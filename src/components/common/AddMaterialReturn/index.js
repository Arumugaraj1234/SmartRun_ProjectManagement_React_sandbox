import React, { useEffect, useState } from 'react'
import moment from 'moment'
import store from 'store'
import {
  Form,
  Table,
  Input,
  message,
  Col,
  DatePicker,
  Select,
  Button,
  Skeleton,
  Radio,
  Checkbox,
} from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import Buttons from 'components/shared/ButtonComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const AddMaterialReturn = ({ handleCancel, isModalVisible }) => {
  const [projectList, setProjectList] = useState([])
  const [individualItems, setIndividualItems] = useState([])
  const [groupRows, setGroupRows] = useState([])
  const [activeTab, setActiveTab] = useState('individual')
  const [remarkscreateTbl, showremarkscreateTbl] = useState(false)
  const [slctdProjctVal, setSlctdProjctVal] = useState('')
  const [mtrlRtrnCreteTableLoader, setMtrlRtrnCreteTableLoader] = useState(false)
  const [disableInsrtBtn, setDisableInsrtBtn] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  const { TextArea } = Input
  const { Option } = Select
  const [returnQtyForm] = Form.useForm()
  const [remarksQtyForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  useEffect(() => {
    showremarkscreateTbl(false)
    remarksQtyForm.resetFields()
    setActiveTab('individual')
    setIndividualItems([])
    setGroupRows([])
    getProjectList()
  }, [isModalVisible])

  const getProjectList = async () => {
    const formData = remarksQtyForm.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || []) /* */
  }

  const getCreateRespDtlVals = async () => {
    const formvalues = remarksQtyForm.getFieldValue()
    if (
      formvalues.ToDate !== null &&
      formvalues.FromDate !== null &&
      formvalues.Projectcode !== undefined
    ) {
      showremarkscreateTbl(true)
      setMtrlRtrnCreteTableLoader(true)
      const keyareaobj = {
        hdrId: formvalues.Projectcode,
        tenantId,
      }

      const [individualResp, groupResp] = await Promise.all([
        indentFileUpload({ requestPath: 'retrieveForMS', requestData: keyareaobj }),
        indentFileUpload({ requestPath: 'msHdrRetrieve', requestData: keyareaobj }),
      ])

      const rawIndividualItems =
        individualResp?.responseData && individualResp.responseData.length > 0
          ? individualResp.responseData.map(item => ({ ...item, isGroup: false }))
          : []

      const groupHdrs =
        groupResp?.responseData && groupResp.responseData.length > 0 ? groupResp.responseData : []

      const rawGroupRows = await Promise.all(
        groupHdrs.map(async grp => {
          const dtlResp = await indentFileUpload({
            requestPath: 'retrieveMSDtlByHdr',
            requestData: { hdrId: grp.msHdrId, tenantId },
          })
          return {
            isGroup: true,
            msHdrId: grp.msHdrId,
            msName: grp.msName,
            productDesc: grp.msName,
            inventoryQtyOnHand: grp.stageQty,
            groupItems: dtlResp?.responseData || [],
          }
        }),
      )

      // sno must be unique across BOTH lists since Return Qty inputs share one Form
      const combined = [...rawIndividualItems, ...rawGroupRows].map((item, index) => ({
        ...item,
        sno: index,
      }))
      setIndividualItems(combined.filter(item => !item.isGroup))
      setGroupRows(combined.filter(item => item.isGroup))
      setMtrlRtrnCreteTableLoader(false)
    } else {
      messageReturn(405)
    }
  }
  const fromdateChange = () => {
    getProjectList()
  }
  const toDateChange = () => {
    getProjectList()
  }
  const getReqstMngmntDtls = () => {
    getCreateRespDtlVals()
    returnQtyForm.resetFields()
  }
  const getProjectVal = (value, option) => {
    console.log(option)
    setSlctdProjctVal(value)
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(individualItems)) {
      return []
    }

    return individualItems
      .map(item => item[key])
      .filter(distinct)
      .map(value => ({
        text: value,
        value,
      }))
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const columns = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      // width: '30%',
      filters: distinctValues('productCode'),
      filteredValue: filtersinfo.productCode || null,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      // width: '30%',
      filters: distinctValues('productDesc'),
      filteredValue: filtersinfo.productDesc || null,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      // width: '30%',
      filters: distinctValues('specification'),
      filteredValue: filtersinfo.specification || null,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      // width: '30%',
      filters: distinctValues('make'),
      filteredValue: filtersinfo.make || null,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      // width: '30%',
      filters: distinctValues('station'),
      filteredValue: filtersinfo.station || null,
      onFilter: (value, record) => record?.station === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subAssy',
      key: 'subAssy',
      // width: '30%',
      filters: distinctValues('subAssy'),
      filteredValue: filtersinfo.subAssy || null,
      onFilter: (value, record) => record?.subAssy === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
      // width: '20%',
      filters: distinctValues('uomLongDesc'),
      filteredValue: filtersinfo.uomLongDesc || null,
      onFilter: (value, record) => record?.uomLongDesc === value,
    },
    {
      title: 'Available Qty.',
      dataIndex: 'inventoryQtyOnHand',
      key: 'inventoryQtyOnHand',
      width: '8%',
      align: 'right',
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Return Qty.',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: '10%',
      render: (_, record) => (
        <Form form={returnQtyForm}>
          <Form.Item name={`returnQty${record.sno}`}>
            <Input
              type="number"
              style={{ textAlign: 'right' }}
              onChange={event => handleRtnQtyChange(record, event, record.sno)}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const groupColumns = [
    {
      title: 'Material Group',
      dataIndex: 'msName',
      key: 'msName',
    },
    {
      title: 'UoM',
      dataIndex: 'groupItems',
      key: 'uom',
      render: groupItems =>
        [...new Set((groupItems || []).map(item => item.uomLongDesc).filter(Boolean))].join(', ') ||
        '-',
    },
    {
      title: 'Staged Qty.',
      dataIndex: 'inventoryQtyOnHand',
      key: 'inventoryQtyOnHand',
      width: '20%',
      align: 'right',
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Return',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <Form form={returnQtyForm}>
          <Form.Item
            name={`returnQty${record.sno}`}
            valuePropName="checked"
            initialValue={false}
            noStyle
          >
            <Checkbox />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const FieldsComponent = () => {
    return (
      <div>
        <Form form={remarksQtyForm}>
          <div className="row">
            <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="FromDate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  onChange={fromdateChange}
                />
              </Form.Item>
            </Col>
            <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="ToDate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultToDate)}
              >
                <DatePicker
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  onChange={toDateChange}
                />
              </Form.Item>
            </Col>
            <Col className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Projectcode"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Project"
                  onChange={getProjectVal}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {projectList?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={getReqstMngmntDtls}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </Form>
        <div style={{ display: remarkscreateTbl ? 'block' : 'none' }}>
          <Form form={remarksQtyForm}>
            <div className="row form_datas">
              <div className="col-md-4 col-lg-4 col-xl-4 col-sm-4">
                <Form.Item
                  name="remarks"
                  label={
                    <span>
                      Remarks<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                    </span>
                  }
                >
                  <TextArea rows={4} />
                </Form.Item>
              </div>
            </div>
          </Form>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <Radio.Group value={activeTab} onChange={handleTabChange}>
              <Radio.Button value="individual">Individual Items</Radio.Button>
              <Radio.Button value="group">Material Groups</Radio.Button>
            </Radio.Group>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Buttons text="Allocate All" type="primary" onClick={setAllocateAll} />
              <Buttons text="Unallocate All" type="primary" onClick={setUnallocateAll} />
            </div>
          </div>
          <Skeleton active loading={mtrlRtrnCreteTableLoader}>
            <div>
              {activeTab === 'individual' ? (
                <Table
                  columns={columns}
                  dataSource={individualItems}
                  pagination={false}
                  onChange={handleChange}
                  scroll={{ y: 400 }}
                  bordered
                />
              ) : (
                <Table
                  columns={groupColumns}
                  dataSource={groupRows}
                  pagination={false}
                  scroll={{ y: 400 }}
                  bordered
                />
              )}
            </div>
          </Skeleton>
          <div
            style={{
              textAlign: 'center',
              marginTop: '25px',
              justifyContent: 'center',
              display: 'flex',
              gap: '12px',
            }}
          >
            <Buttons
              text="Submit"
              type="primary"
              onClick={handleCreate}
              disable={disableInsrtBtn}
            />
            <Buttons
              text="Cancel"
              type="primary"
              onClick={() => {
                handleClear()
                handleClearVals()
                handleCancel()
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  const handleCreate = async () => {
    const qtyform = remarksQtyForm.getFieldsValue()
    const qtyform1 = returnQtyForm.getFieldsValue(true)
    const allRows = [...individualItems, ...groupRows]

    const selectedRows = allRows
      .map(record => {
        const rawValue = qtyform1[`returnQty${record.sno}`]
        const qty = record.isGroup ? (rawValue === true ? record.inventoryQtyOnHand : '') : rawValue
        return { record, qty }
      })
      .filter(({ qty }) => qty !== '0' && qty !== '' && qty !== null && qty !== undefined)

    if (selectedRows.length === 0) {
      return
    }
    const hasIndividualSelected = selectedRows.some(({ record }) => !record.isGroup)
    const hasGroupSelected = selectedRows.some(({ record }) => record.isGroup)
    if (hasIndividualSelected && hasGroupSelected) {
      message.error('Select either Individual Items or Material Groups, not both, for a return')
      return
    }
    if (qtyform.remarks === undefined) {
      messageReturn(405)
      return
    }

    setDisableInsrtBtn(true)

    let mrDtlList = []
    for (let i = 0; i < selectedRows.length; i += 1) {
      const { record, qty } = selectedRows[i]
      if (record.isGroup) {
        // eslint-disable-next-line no-await-in-loop
        const cancelResp = await indentFileUpload({
          requestPath: 'cancelMsHdrReq',
          requestData: { hdrId: record.msHdrId, tenantId, empId: employeeId },
        })
        if (cancelResp?.responseCode === '200') {
          mrDtlList = mrDtlList.concat(
            (record.groupItems || []).map(line => ({
              qty: line.qty,
              productId: line.productId,
              tenantId,
              msHdrId: record.msHdrId,
              msName: record.msName,
            })),
          )
        } else {
          message.error(`Failed to release staging group "${record.msName}" for return`)
        }
      } else {
        mrDtlList.push({ qty, productId: record.productId, tenantId })
      }
    }

    if (mrDtlList.length === 0) {
      setDisableInsrtBtn(false)
      return
    }

    const keyareaobj = {
      createdBy: employeeId,
      hdrRemark: qtyform.remarks,
      pmHdrId: slctdProjctVal,
      tenantId,
      remarks: qtyform.remarks,
      mrDtlList,
    }
    const response = await indentFileUpload({
      requestPath: 'insertMRHAndMRD',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      handleCancel()
      setDisableInsrtBtn(false)
      remarksQtyForm.resetFields()
      returnQtyForm.resetFields()
    } else {
      message.error(response.responseMessage)
      setDisableInsrtBtn(false)
    }
  }
  const handleTabChange = e => {
    const newTab = e.target.value
    const rowsToClear = newTab === 'individual' ? groupRows : individualItems
    if (rowsToClear.length > 0) {
      const clearedValues = rowsToClear.map(record => ({
        [`returnQty${record.sno}`]: record.isGroup ? false : '',
      }))
      returnQtyForm.setFieldsValue(Object.assign({}, ...clearedValues))
    }
    setActiveTab(newTab)
  }
  const handleClear = () => {
    remarksQtyForm.resetFields()
    returnQtyForm.resetFields()
    setActiveTab('individual')
  }
  const handleClearVals = () => {
    remarksQtyForm.resetFields()
    returnQtyForm.resetFields()
    setActiveTab('individual')
  }
  const setAllocateAll = () => {
    const rows = activeTab === 'individual' ? individualItems : groupRows
    if (rows.length > 0) {
      const updatedValues = rows.map(record => {
        if (record.isGroup) {
          return { [`returnQty${record.sno}`]: true }
        }
        const returnQty = Number(record.inventoryQtyOnHand).toFixed(0)
        return { [`returnQty${record.sno}`]: returnQty }
      })
      returnQtyForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const setUnallocateAll = () => {
    const rows = activeTab === 'individual' ? individualItems : groupRows
    if (rows.length > 0) {
      const updatedValues = rows.map(record => {
        return { [`returnQty${record.sno}`]: record.isGroup ? false : '' }
      })
      returnQtyForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const handleRtnQtyChange = (record, event, sno) => {
    const {
      target: { value },
    } = event
    if (Number(value) > Number(record.inventoryQtyOnHand)) {
      returnQtyForm.setFieldsValue({ [`returnQty${sno}`]: '' })
      messageReturn(604)
    } else {
      returnQtyForm.setFieldsValue({ [`returnQty${sno}`]: value })
    }
  }

  return (
    <div style={{ marginTop: '10px', width: '100%', overflowX: 'auto' }}>
      <ModalPopup
        isModalVisible={isModalVisible}
        FieldsComponent={FieldsComponent}
        text="New Material Return"
        onCancel={() => {
          handleCancel()
        }}
        width="900"
      />
    </div>
  )
}

export default AddMaterialReturn
