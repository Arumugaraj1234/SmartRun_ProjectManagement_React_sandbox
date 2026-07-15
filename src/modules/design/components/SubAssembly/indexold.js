import React, { useState, useEffect } from 'react'
import store from 'store'
import { Table, Button, Select, Form, Input, message, Skeleton, AutoComplete } from 'antd'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import ModalPopupBox from 'components/shared/ModalPopupComponent'
import InputComponent from 'components/shared/InputComponent'
import getSalesCategory from 'services/common/BudgetsheetService/KeyCategoryService'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import Buttons from 'components/shared/ButtonComponent'
// import DropDownComponent from 'components/shared/DropDownComponent'

// msg file
import messageReturn from '_helpers/messageReturn'

const SubAssemblyold = () => {
  const Tab = store.get('Tab')
  const tenantid = store.get('tenantId')
  const PmHdrIdVal = store.get('ProjectPMHdrId')

  const [saleCategoryDrpDown, setSaleCategoryDrpDown] = useState([])
  const [selectedRecordVal, setSelectedRecordVal] = useState([])
  const [budgetLinkTablDtl, setBudgetLinkTablDtl] = useState([])
  // const [popupTotalAllocVal, setPopupTotalAllocVal] = useState('0')
  const [elementDropDownVal, setElementDropDownVal] = useState([])
  // const [totSubAreaVal, setTotSubAreaVal] = useState('0');
  const [isLoading, setIsLoading] = useState(false)
  const [dskIdVal, setDskId] = useState(null)

  const enquiryId = ''

  // service data
  const [linkStatus, setLinkStatus] = useState([])
  const [subArearec, setSubArearec] = useState([])

  const [popupdskId, setpopupdskId] = useState([])
  const [popupsbExtnId, setpopupsbExtnId] = useState([])
  const [allocatedQty, setAllocatedQty] = useState('')
  // const [slctdElementVal, setSlctdElementVal] = useState('')
  // const [deleteSubAssyRecord, setDeleteSubAssyRecord] = useState([])
  let setPmHdrValue = ''
  console.log(popupdskId, popupsbExtnId)
  const MenuTab = store.get('MenuListData')
  const curr = MenuTab[0].currency

  const Defaultdata = [
    {
      pkaId: '',
      pmHdrId: PmHdrIdVal,
      tenantId: tenantid,
      totalCost: 0,
    },
  ]
  const [datas, setDatas] = useState(Defaultdata)

  if (PmHdrIdVal !== null && PmHdrIdVal !== undefined) {
    setPmHdrValue = PmHdrIdVal
  } else {
    setPmHdrValue = ''
  }
  console.log(datas)

  const getElementValue = () => {
    const formValues = form.getFieldsValue()
    const formval = formValues.KeyArea
    getBudgetLinkPopUpValues(formval)
  }

  const getBudgetLinkPopUpValues = async val => {
    setIsLoading(true)
    const responses = await indentFileUpload({
      requestPath: 'getsalesBudgetExtnDtl',
      requestData: {
        pmHdrId: store.get('ProjectPMHdrId'),
        elementDesc: val,
        tenantId: tenantid,
      },
    })
    const resp = responses.responseData
    if (resp) {
      if (resp.length > 0) {
        setIsLoading(false)
        setBudgetLinkTablDtl(resp)
        setpopupdskId(resp[0].dskId)
        setpopupsbExtnId(resp[0].sbExtnId)
        setAllocatedQty(resp[0].totalValue)
      } else {
        setIsLoading(false)
        setBudgetLinkTablDtl([])
      }
    } else {
      setIsLoading(false)
      setBudgetLinkTablDtl([])
    }
  }

  function getSaleCatValue(e) {
    fetchElementDropdown(e)
  }

  console.log(allocatedQty)
  const fetchsaleCateDropdown = async () => {
    const response = await getSalesCategory({
      doctype: Tab.docTypeCode,
      tenId: Tab.tenantId,
      enqID: enquiryId,
    })
    console.log(response)
    if (response.responseData.length > 0) {
      setSaleCategoryDrpDown(response.responseData)
    } else {
      setSaleCategoryDrpDown([])
    }
  }
  const success = resp => {
    message.success(resp)
  }
  const errosr = resp => {
    message.error(resp)
  }
  const fetchElementDropdown = async e => {
    const response = await indentFileUpload({
      requestPath: 'getelementHdrDistinct',
      requestData: {
        projectID: store.get('ProjectPMHdrId'),
        tenantID: tenantid,
        keyCode: e,
      },
    })
    const ElementResp = response.responseData
    console.log(ElementResp)
    if (ElementResp.length > 0) {
      setElementDropDownVal(ElementResp)
    } else {
      setElementDropDownVal([])
    }
  }

  const handleInputChange = (index, newValue, e) => {
    if (parseInt(newValue.totalQty, 10) >= parseInt(index, 10)) {
      setBudgetLinkTablDtl(prevState => {
        return prevState.map((item, idx) => {
          if (idx === e) {
            return {
              ...item,
              allocatQty: index,
              isEdited: 1,
            }
          }
          return item
        })
      })
    } else {
      const fieldName = `allocatedQty_${e + 1}`
      tableform.setFieldsValue({ [fieldName]: 0 })
      errosr('Allocated Qty. cannot be higher than Available Qty.')
    }
  }

  const budgetLink = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '7%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
      width: '20%',
    },
    {
      title: 'Element Desc',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
      width: '20%',
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
    },
    {
      title: 'Available Qty.',
      dataIndex: 'totalQty',
      key: 'totalQty',
      className: 'right-align-cell',
      render: (text, record) => <span>{Math.round(parseFloat(record.totalQty))}</span>,
    },
    {
      title: `Unit Value ${curr}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{parseFloat(record.perPartVal).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Allocated Qty',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (text, record, index) => (
        <Form form={tableform} onFinish={onFinish} initialValues={{ ...record }}>
          <Form.Item name={`allocatedQty_${index + 1}`} initialValue={0}>
            <Input
              onMouseLeave={e => handleInputChange(e.target.value, record, index)}
              type="number"
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const onFinish = values => {
    console.log(values)
  }
  const handleSaveBudgetLink = async () => {
    console.log(budgetLinkTablDtl, '--budgetLinkTablDtl')
    const reqArr = budgetLinkTablDtl
      .filter(item => item.isEdited === 1 && item.allocatQty === '1')
      .map(item => ({
        dskId: dskIdVal,
        sbExtnId: item.sbExtnId,
        allocatedQty: item.allocatQty,
        allocatedvalue: parseInt(item.perPartVal, 10) * parseInt(item.allocatQty, 10),
        tenantId: tenantid,
        pmId: Tab.processCode,
      }))

    const response = await indentFileUpload({
      requestPath: 'insertSubAreaExtn',
      requestData: reqArr,
    })

    if (response) {
      if (response.responseCode === '200') {
        tableform.resetFields()
        handleCancel()
        getLinkStatus()
        success(response.responseMessage)
      } else {
        errosr(response.responseMessage)
      }
    }
  }

  const [form] = Form.useForm()
  const [tableform] = Form.useForm()

  const FieldsComponent = () => {
    return (
      <div className="row ml-2">
        <div className="form_indent">
          <Form form={form} layout="vertical" labelAlign="left">
            <div className="row form_datas">
              <div className="col-md-4">
                <Form.Item
                  name="Indenttype"
                  label={
                    <span>
                      Sales Category<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select placeholder="Select Sale Category" onChange={e => getSaleCatValue(e)}>
                    {saleCategoryDrpDown.map(item => (
                      <Option key="serial-number" value={item.keyCatCode}>
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
                      Element<span style={{ color: 'red' }}>*</span>{' '}
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
                      `Total Allocated Value {curr}`<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent
                    type="text"
                    // onChange={e => setPopupTotalAllocVal(e.target.value)}
                    disabled
                  />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Skeleton loading={isLoading} active>
                  {budgetLinkTablDtl ? (
                    <Table
                      dataSource={budgetLinkTablDtl}
                      columns={budgetLink}
                      pagination={false}
                      scroll={{ y: 300 }}
                      sticky
                      bordered
                    />
                  ) : (
                    ''
                  )}
                </Skeleton>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
  const ButtonsComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Buttons type="primary" text="Save" onClick={handleSaveBudgetLink} />
      </div>
    )
  }
  useEffect(() => {
    const newRows = linkStatus.map((res, index) => ({
      key: `${index}`,
      pkaId: res.pksId,
      pmHdrId: res.pmHdrId,
      tenantId: tenantid,
      allocatedVal: res.allocatedVal,
      totalCount: res.totalCount,
      isret: 1,
      keySubArea: res.pskDesc,
      dskId: res.dskId,
    }))

    setSubDatas([...newRows, ...DefaultSubdata])
  }, [linkStatus])
  const DefaultSubdata = [
    {
      dskId: '',
      pskId: '',
      deHdrid: PmHdrIdVal,
      tenantId: tenantid,
      allocatedVal: 0,
      totalCount: 0,
      isret: 0,
      keySubArea: '',
    },
  ]
  const [subDatas, setSubDatas] = useState(DefaultSubdata)
  const [keySubArea, setKeySubArea] = useState([])
  const [keySubAreafun, setKeySubAreaFun] = useState([])
  // const [trueFalseBox, setTrueFalseBox] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalVal, setIsModalVal] = useState(false)
  const { Option } = Select
  console.log(keySubArea)
  const showModal = record => {
    // getSubAreaPm(record);
    setSelectedRecordVal(`Budget Link`)
    setIsModalOpen(true)
    getTotalSubAreaVal(record)
    setDskId(record.dskId)
  }
  const ShowModalPopup = rec => {
    getSubAreaPm(rec)
    setIsModalVal(true)
  }
  const handleCancelModalVal = () => {
    setIsModalVal(false)
  }

  const getSubAreaPm = async e => {
    try {
      const keyareaobj = {
        pmHdrId: e.pmHdrId,
        pskId: e.pkaId,
        tenantId: e.tenantId,
      }
      const response = await indentFileUpload({
        requestPath: 'getSubAreaPmHdrList',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        setSubArearec(response.responseData)
      } else {
        setSubArearec([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const getTotalSubAreaVal = async e => {
    console.log(e)
    const responses = await indentFileUpload({
      requestPath: 'totalSubAreaValueByPskId',
      requestData: {
        pmHdrId: store.get('ProjectPMHdrId'),
        pskId: e.pkaId,
        tenantId: tenantid,
      },
    })
    if (responses) {
      if (responses.responseCode === '200') {
        const resmsg = responses.responseDataMessage
        form.setFieldsValue({ totalAllocVal: parseFloat(resmsg).toLocaleString('en-IN') })
        // setPopupTotalAllocVal(resmsg)
      } else {
        // setPopupTotalAllocVal('0');
      }
    }
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
    setElementDropDownVal([])
    setBudgetLinkTablDtl([])
  }
  useEffect(() => {
    getKeySubAreaFun()
    fetchsaleCateDropdown()
    getKeySubArea()
    getLinkStatus()
  }, [tenantid, PmHdrIdVal])

  const getLinkStatus = async () => {
    try {
      const keyareaobj = {
        projectID: PmHdrIdVal,
        tenantID: tenantid,
      }

      const response = await indentFileUpload({
        requestPath: 'getLinkStatusByPMId',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        setLinkStatus(response.responseData)
      } else {
        setLinkStatus([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const getKeySubAreaFun = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: '',
      }

      const response = await indentFileUpload({
        requestPath: 'getKeySubArea',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        const options = response.responseData.map(item => ({
          key: item.keyId,
          value: item.keyName,
        }))
        setKeySubAreaFun(options)
      } else {
        console.error('Error: Response data is missing')
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const handleAddSubRows = async val => {
    if (val.keySubArea !== '') {
      try {
        const keyareaobj = [
          {
            deHdrid: PmHdrIdVal,
            pskId: val.keySubArea,
            dskId: '',
            tenantId: tenantid,
          },
        ]
        const response = await indentFileUpload({
          requestPath: 'updatedesignSubKeyArea',
          requestData: keyareaobj,
        })

        if (response) {
          if (response.responseCode === '200') {
            getLinkStatus()
            success(response.responseMessage)
          } else {
            errosr(response.responseMessage)
          }
        } else {
          console.error('Failed to Add Record')
        }
      } catch (error) {
        console.error('Error fetching key area:', error)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleRemoveSubRows = async record => {
    if (subDatas.length > 1) {
      try {
        const response = await indentFileUpload({
          requestPath: 'deletedesignSubKeyArea',
          requestData: {
            dskId: record.dskId,
            tenantId: tenantid,
          },
        })
        // const resp = response.responseMessage
        // console.log(response)
        if (response.responseCode === '200') {
          getLinkStatus()
          success(response.responseMessage)
        } else {
          errosr(response.responseMessage)
        }
      } catch (error) {
        console.error('Error Deleting key area:', error)
      }
    } else {
      console.log('At least one primary contact required')
    }
  }

  const setDropDownLoadData = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: '',
      }

      const response = await indentFileUpload({
        requestPath: 'getKeyArea',
        requestData: keyareaobj,
      })
      console.log(response)
      if (response && response.responseData) {
        setKeySubArea(response.responseData)
        // setDatas(response.responseData)
      } else {
        console.error('Error: Response data is missing')
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }
  const getKeySubArea = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: setPmHdrValue,
      }

      const response = await indentFileUpload({
        requestPath: 'getKeyArea',
        requestData: keyareaobj,
      })
      console.log(response)
      if (response && response.responseData) {
        setKeySubArea(response.responseData)
        setDatas(response.responseData)
      } else {
        setDropDownLoadData()
        console.error('Error: Response data is missing')
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const handlekeyAreaChange = (val, ind) => {
    const updatedDatas = [...subDatas]
    updatedDatas[ind] = { ...updatedDatas[ind], keySubArea: val }
    setSubDatas(updatedDatas)
  }

  const handleChangeDropDown = (val, opt, ind) => {
    const updatedDatas = [...subDatas]
    updatedDatas[ind] = { ...updatedDatas[ind], keySubArea: val }
    setSubDatas(updatedDatas)
  }

  const Subcolumnss = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subassy',
      key: 'subassy',
      render: (textv, record, index) => {
        return record.isret === 1 ? (
          record.keySubArea
        ) : (
          <AutoComplete
            style={{ width: 180 }}
            options={keySubAreafun}
            onSearch={text => handleChangeDropDown(text, record, index)}
            onSelect={value => handlekeyAreaChange(value, index)}
          />
        )
      },
    },
    {
      title: `Allocated Value ${curr}`,
      dataIndex: 'allocatedVal',
      key: 'allocatedVal',
      render: (_, record) => (
        <span
          onClick={() => ShowModalPopup(record)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              ShowModalPopup(record)
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            cursor: record.allocatedVal === '0' ? 'none' : 'pointer',
            color: record.allocatedVal === '0' ? 'black' : 'blue',
          }}
        >
          {record.allocatedVal !== '0'
            ? parseFloat(record.allocatedVal).toLocaleString('en-IN')
            : 0}
        </span>
      ),
    },
    {
      title: 'Budget Linked',
      dataIndex: 'keySubArea',
      key: 'keySubArea',
      render: (_, record, index) =>
        index === subDatas.length - 1 ? (
          <Button
            style={{
              color: 'black',
              border: 'none',
              borderRadius: '3px',
            }}
          >
            Link
          </Button>
        ) : (
          <Button
            style={{
              background: record.totalCount === '0' ? 'red' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
            }}
            onClick={() => showModal(record)}
          >
            Link
          </Button>
        ),
    },
    {
      title: 'Action',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      render: (text, record, index) =>
        subDatas.length >= 1 ? (
          <span>
            {index === subDatas.length - 1 ? (
              <AddIconButton onClick={() => handleAddSubRows(record, index)} />
            ) : null}

            {index !== subDatas.length - 1 ? (
              <RemoveIcon onClick={() => handleRemoveSubRows(record)} />
            ) : null}
          </span>
        ) : null,
    },
  ]

  const handleRemoveRow = async e => {
    try {
      const keyareaobj = {
        pkseId: e.pkseId,
        tenantId: tenantid,
        pmId: Tab.processCode,
      }
      const response = await indentFileUpload({
        requestPath: 'deleteSubAreaExtn',
        requestData: keyareaobj,
      })
      if (response) {
        if (response.responseCode === '200') {
          getLinkStatus()
          setIsModalVal(false)
          message.success(response.responseMessage)
        } else {
          messageReturn(635)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const ModalLinkCol = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
    },
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
    },
    {
      title: 'Element Desc.',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
    },
    {
      title: 'Alloc. Qty',
      dataIndex: 'allocatedQty',
      key: 'allocatedQty',
      className: 'right-align-cell',
    },
    {
      title: `Alloc. Value ${curr}`,
      dataIndex: 'allovatedValue',
      key: 'allovatedValue',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{`${parseFloat(record.allovatedValue).toLocaleString('en-IN')}`} </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      render: (text, record, index) => (
        <RemoveIcon onClick={() => handleRemoveRow(record, index)} />
      ),
    },
  ]
  const ButtonsValComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Buttons type="primary" text="Close" onClick={handleCancelModalVal} />
      </div>
    )
  }
  const FieldsModalValComponent = () => {
    return (
      <div>
        <Table dataSource={subArearec} columns={ModalLinkCol} pagination={false} />
      </div>
    )
  }
  return (
    <div className="row">
      <div className="col-6">
        <h5>Sub assembly details</h5>
        <Table
          rowClassName={() => 'editable-row'}
          columns={Subcolumnss}
          dataSource={subDatas}
          page="true"
        />
        <div>
          <ModalPopupBox
            text={selectedRecordVal}
            isModalVisible={isModalOpen}
            FieldsComponent={FieldsComponent}
            ButtonsComponent={ButtonsComponent}
            onCancel={handleCancel}
            width={1200}
          />
          <ModalPopupBox
            text="Allocated Value"
            isModalVisible={isModalVal}
            FieldsComponent={FieldsModalValComponent}
            ButtonsComponent={ButtonsValComponent}
            onCancel={handleCancelModalVal}
            width={1200}
          />
        </div>
      </div>
      {/* <div className="col-6">
        
      </div> */}
    </div>
  )
}
export default SubAssemblyold
