import React, { useState, useEffect } from 'react'
import store from 'store'
import { Modal, Form, Select, InputNumber, Table, message } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import getSalesCategory from 'services/common/BudgetsheetService/KeyCategoryService'
import InputComponent from 'components/shared/InputComponent'
import Buttons from 'components/shared/ButtonComponent'
import SpinLoading from 'components/common/Loader'

const { Option } = Select

// Same "Budget Link" mechanism as the WBS screen's Link button
// (modules/project/components/ProjectInitiation/index.js) - lets a PM pick any
// Sales Category/Element still holding unallocated value and assign a quantity of
// it to a station. Built as its own component (rather than reusing the WBS one
// in place) so it can be opened from the PJS screen without touching the
// WBS screen's own, already-live code path.
const AllocateStationBudgetModal = ({ visible, onCancel, pkaId, stationLabel, onSaved }) => {
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const Tab = store.get('Tab')
  const enquiryId = store.get('enquiryId') || store.get('EnquiryID')
  const pmHdrId = store.get('ProjectID') || store.get('ProjectPMHdrId')
  const Menulistdata = store.get('MenuListData')
  const curr = Menulistdata && Menulistdata.length > 0 ? Menulistdata[0].currency : ''

  const [saleCategoryDrpDown, setSaleCategoryDrpDown] = useState([])
  const [elementDropDownVal, setElementDropDownVal] = useState([])
  const [budgetLinkTablDtl, setBudgetLinkTablDtl] = useState([])
  const [salecatcode, setSalecatcode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [disablbtn, setDisablebtn] = useState(false)
  const [filtersinfo, setfilterinfo] = useState({})

  const errosr = resp => message.error(resp)
  const success = resp => message.success(resp)

  useEffect(() => {
    if (visible) {
      form.resetFields()
      tableform.resetFields()
      setElementDropDownVal([])
      setBudgetLinkTablDtl([])
      fetchsaleCateDropdown()
      getTotalSubAreaVal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const fetchsaleCateDropdown = async () => {
    const response = await getSalesCategory({
      doctype: Tab.docTypeCode,
      tenId: Tab.tenantId || tenantId,
      enqID: enquiryId,
    })
    if (response && response.responseCode === '200' && response.responseData.length > 0) {
      setSaleCategoryDrpDown(response.responseData)
    } else {
      setSaleCategoryDrpDown([])
    }
  }

  const getTotalSubAreaVal = async () => {
    const responses = await indentFileUpload({
      requestPath: 'totalSubAreaValueByPskId',
      requestData: {
        pmHdrId,
        pkaId,
        tenantId,
      },
    })
    if (responses && responses.responseCode === '200') {
      form.setFieldsValue({
        totalAllocVal: parseFloat(responses.responseDataMessage || 0).toLocaleString('en-IN'),
      })
    }
  }

  const fetchElementDropdown = async keyCode => {
    const response = await indentFileUpload({
      requestPath: 'getelementHdrDistinct',
      requestData: {
        projectID: pmHdrId,
        tenantID: tenantId,
        keyCode,
      },
    })
    const ElementResp = response && response.responseData ? response.responseData : []
    setElementDropDownVal(ElementResp)
  }

  const getSaleCatValue = e => {
    form.setFieldsValue({ KeyArea: undefined })
    setBudgetLinkTablDtl([])
    setSalecatcode(e)
    fetchElementDropdown(e)
  }

  const getElementValue = async elementDesc => {
    setIsLoading(true)
    const responses = await indentFileUpload({
      requestPath: 'getsalesBudgetExtnDtl',
      requestData: {
        pmHdrId,
        elementDesc,
        tenantId,
        keyCode: salecatcode,
      },
    })
    const resp = responses && responses.responseData ? responses.responseData : []
    setIsLoading(false)
    setBudgetLinkTablDtl(resp)
    resp.forEach(res => {
      tableform.setFieldsValue({ [`allocatedValue_${res.sbExtnId}`]: '' })
    })
  }

  // Blocks the keystroke itself, before it ever reaches the DOM - clamping after the
  // fact (via parser/onChange + a forced re-render) fights rc-input-number's own
  // cursor-restoration logic and corrupts the displayed digits (e.g. typing past the
  // cap could splice new digits into the wrong position, showing a scrambled number).
  // Computing the prospective value from the current text + cursor selection and
  // rejecting the keystroke outright avoids all of that.
  const blockOverLimitKeyDown = (e, record) => {
    if (!/^\d$/.test(e.key)) return
    const input = e.target
    const currentText = input.value || ''
    const selStart = input.selectionStart ?? currentText.length
    const selEnd = input.selectionEnd ?? currentText.length
    const prospective = currentText.slice(0, selStart) + e.key + currentText.slice(selEnd)
    const num = parseFloat(prospective)
    const cap = parseFloat(record.availableAmount) || 0
    if (!Number.isNaN(num) && num > cap) {
      e.preventDefault()
    }
  }

  // This modal is only ever opened from ScsComponent's "Allocate to Station" icon,
  // which is itself gated on canAllocateFromSalesBudget/hasBudgetExcess - fields the
  // backend only populates for NEW-flow indents (IndentUploadService.getIndentByIndentID) -
  // so this modal is already NEW-flow-only; no legacy/qty-based fallback is needed here.
  // Client wants allocation entered as an amount, not a quantity - the input still caps
  // against what's actually available (Available Qty x Unit Value), and the qty the
  // backend also expects gets derived back from the entered amount at Save time (see
  // handleSave), since insertSubAreaExtn persists both fields independently.
  const handleAllocateChange = (value, record) => {
    if (value === null || value === '' || Number.isNaN(value)) return
    const valueStr = value.toString()
    const decimalValid = /^(\d+)?(\.\d{0,4})?$/.test(valueStr)
    if (!decimalValid) {
      errosr('Only up to 4 decimal places are allowed.')
      return
    }
    const allocatedValue = parseFloat(value)
    const fieldName = `allocatedValue_${record.sbExtnId}`
    tableform.setFieldsValue({ [fieldName]: parseFloat(allocatedValue.toFixed(2)) })
  }

  const handleAllocateAll = () => {
    if (budgetLinkTablDtl.length > 0) {
      const updatedValues = budgetLinkTablDtl.map(rec => ({
        [`allocatedValue_${rec.sbExtnId}`]: parseFloat(rec.availableAmount) || 0,
      }))
      tableform.setFieldsValue(Object.assign({}, ...updatedValues))
    } else {
      errosr('No Records Selected')
    }
  }

  const handleUnallocate = () => {
    if (budgetLinkTablDtl.length > 0) {
      const updatedValues = budgetLinkTablDtl.map(rec => ({
        [`allocatedValue_${rec.sbExtnId}`]: 0,
      }))
      tableform.setFieldsValue(Object.assign({}, ...updatedValues))
    } else {
      errosr('No Records Selected')
    }
  }

  const handleSave = async () => {
    setDisablebtn(true)
    setIsLoading(true)
    if (budgetLinkTablDtl.length > 0) {
      const formValues = tableform.getFieldsValue(true)
      const reqArr = budgetLinkTablDtl.map(item => {
        const allocatedValue = parseFloat(formValues[`allocatedValue_${item.sbExtnId}`]) || 0
        const perPartVal = parseFloat(item.perPartVal) || 0
        const obj = {
          pkaId,
          sbExtnId: item.sbExtnId,
          allocatedQty: perPartVal > 0 ? allocatedValue / perPartVal : 0,
          allocatedvalue: allocatedValue,
          tenantId,
          pmId: '3',
          empId,
          source: 'PJS',
        }
        const objAsString = {}
        Object.keys(obj).forEach(key => {
          objAsString[key] = String(obj[key])
        })
        return objAsString
      })

      // Both backend updates this feeds are additive (ALLOCATED_VALUE = ALLOCATED_VALUE + ?),
      // so sending 0 for a row nobody touched is a harmless no-op for the allocation math -
      // but insertSubAreaExtnHist still inserts a Topup History row for every entry in the
      // array unconditionally, flooding the history with meaningless "0/0" rows for every
      // untouched item in the table. Only send rows that actually have something to add.
      const touchedRows = reqArr.filter(item => item.allocatedvalue !== '0')
      if (touchedRows.length === 0) {
        errosr('Enter at least one Allocated Value before saving')
        setDisablebtn(false)
        setIsLoading(false)
        return
      }

      const response = await indentFileUpload({
        requestPath: 'insertSubAreaExtn',
        requestData: touchedRows,
      })

      setDisablebtn(false)
      setIsLoading(false)
      if (response && response.responseCode === '200') {
        success(response.responseMessage)
        if (onSaved) onSaved()
        if (onCancel) onCancel()
      } else if (response) {
        errosr(response.responseMessage)
      }
    } else {
      setDisablebtn(false)
      setIsLoading(false)
      errosr('Minimum one Allocated Value should be greater than zero')
    }
  }

  const ElementDesc3 = [...new Set(budgetLinkTablDtl.map(h => h.elementDtl))].map(el => ({
    text: el,
    value: el,
  }))

  const budgetLinkColumns = [
    { title: 'S.No', dataIndex: 'sno', key: 'sno', width: '7%', render: (t, r, i) => i + 1 },
    { title: 'Element', dataIndex: 'elementHdr', key: 'elementHdr', width: '20%' },
    {
      title: 'Element Desc',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
      width: '20%',
      filters: ElementDesc3,
      filteredValue: filtersinfo.elementDtl,
      onFilter: (value, record) => record?.elementDtl === value,
    },
    { title: 'Specification', dataIndex: 'specification', key: 'specification' },
    { title: 'Make', dataIndex: 'make', key: 'make' },
    {
      title: 'Qty',
      dataIndex: 'totalQty',
      key: 'totalQty',
      className: 'right-align-cell',
      render: (text, record) => <span>{parseFloat(record.totalQty)}</span>,
    },
    {
      title: `Total Amount ${curr}`,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{record.totalAmount ? parseFloat(record.totalAmount).toLocaleString('en-IN') : '0'}</span>
      ),
    },
    {
      title: `Utilized Amount ${curr}`,
      dataIndex: 'utilizedAmount',
      key: 'utilizedAmount',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{record.utilizedAmount ? parseFloat(record.utilizedAmount).toLocaleString('en-IN') : '0'}</span>
      ),
    },
    {
      title: `Amount Available ${curr}`,
      dataIndex: 'availableAmount',
      key: 'availableAmount',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{record.availableAmount ? parseFloat(record.availableAmount).toLocaleString('en-IN') : '0'}</span>
      ),
    },
    {
      title: `Allocated Value ${curr}`,
      dataIndex: 'allocatedValue',
      key: 'allocatedValue',
      width: 160,
      render: (text, record) => (
        <Form form={tableform} initialValues={{ ...record }}>
          <Form.Item name={`allocatedValue_${record.sbExtnId}`} initialValue={undefined}>
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              min={0}
              max={parseFloat(record.availableAmount) || 0}
              formatter={value => (value === null || value === undefined ? '' : value)}
              parser={value => {
                if (value === '' || value === null || value === undefined) return ''
                const num = parseFloat(value)
                if (Number.isNaN(num)) return ''
                const cap = parseFloat(record.availableAmount) || 0
                if (num < 0) return 0
                return num > cap ? cap : num
              }}
              disabled={!record.availableAmount || parseFloat(record.availableAmount) <= 0}
              onKeyDown={e => blockOverLimitKeyDown(e, record)}
              onChange={value => handleAllocateChange(value, record)}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <Modal
      title={`${stationLabel} - Budget Link`}
      open={visible}
      onCancel={onCancel}
      width={1500}
      footer={[
        <Buttons key="save" type="primary" text="Save" disable={disablbtn} onClick={handleSave} />,
      ]}
    >
      <SpinLoading loading={isLoading}>
        <div className="row ml-2">
          <div className="form_indent" style={{ width: '100%' }}>
            <Form form={form} layout="vertical" labelAlign="left">
              <div className="row form_datas">
                <div className="col-md-4">
                  <Form.Item
                    name="SalesCategory"
                    label={
                      <span>
                        Sales Category<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                  >
                    <Select placeholder="Select Sale Category" onChange={getSaleCatValue}>
                      {saleCategoryDrpDown.map(item => (
                        <Option key={item.keyCatCode} value={item.keyCatCode}>
                          {item.keyCategory}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name="KeyArea"
                    label={
                      <span>
                        Element<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                  >
                    <Select placeholder="Select Element" onChange={getElementValue}>
                      {elementDropDownVal.map(item => (
                        <Option key={item.elementhdr} value={item.elementhdr}>
                          {item.elementhdr}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name="totalAllocVal"
                    label={
                      <span>
                        Total Allocated Value {curr}
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                  >
                    <InputComponent type="text" disabled />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Buttons type="primary" text="Unallocate" onClick={handleUnallocate} />
                </div>
                <div className="col-md-2" style={{ marginLeft: '5px' }}>
                  <Buttons type="primary" text="Allocate All" onClick={handleAllocateAll} />
                </div>
                <div className="col-md-12">
                  <Table
                    dataSource={budgetLinkTablDtl}
                    columns={budgetLinkColumns}
                    pagination={false}
                    scroll={{ y: 300 }}
                    sticky
                    bordered
                    onChange={(pagination, filters) => setfilterinfo(filters)}
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </SpinLoading>
    </Modal>
  )
}

export default AllocateStationBudgetModal
