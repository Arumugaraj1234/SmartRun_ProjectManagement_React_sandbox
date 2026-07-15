import React, { useState, useEffect, useContext, useRef } from 'react'
import { Input, DatePicker, Form, Table, message, AutoComplete, Radio } from 'antd'
import store from 'store'
import moment from 'moment'
import RemoveIcon from 'components/shared/RemoveIconComponent'
// import EnquiryValidationCommon from 'components/common/DocumentUploadManagement'
import ApproveDocument from 'components/common/ApproveDocument'
import AddIcon from 'components/shared/AddIconComponent'
import getIndustryTypeDrpDwn from 'services/common/IndustryType'
import getScopeOfWorkDrpDwn from 'services/common/ScopeOfWork'
import getReasonCodeDrpDwn from 'services/common/ReasonCode'
import getViewDetailsVals from 'services/sales/enquiryBySlaveId'
import insertAndUpdateEnquiry from 'services/sales/insertUpdateEnquiry'
// import ApproveOrRejectButton from 'components/common/ApproveRejectBtnComponent'
import Inputs from 'components/shared/InputComponent'
// import getEmployeeDropDownDataService from 'services/common/getEmployeeDropDownDataService'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values,
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      ''
      /* <div
              className="editable-cell-value-wrap"
              style={{
                paddingRight: 24,
              }}
              onClick={toggleEdit}
            >
              {children}
            </div> */
    )
  }
  return <td {...restProps}>{childNode}</td>
}

const NewEnquiryCreate = ({ content, slaveid }) => {
  const currDate = new Date().toISOString().split('T')[0]
  const currntdate = moment(currDate).format('DD-MM-YYYY')
  const dateFormatList = ['DD-MMM-YYYY', 'DD/MM/YY']
  // const [dateval, setfromDate] = useState(currntdate)
  const Tab = store.get('Tab')
  const { isEditable, processCode } = Tab
  const getTenantId = store.get('tenantId')
  const getLoginEmplId = store.get('employeeId')
  const emptyobj = {
    secId: '',
    masterId: '',
    contactName: '',
    contactEmail: '',
    contactNo: '',
    department: '',
    primary: false,
  }

  const { TextArea } = Input
  const [industryTypeVal, setIndustryTypeVal] = useState([])
  const [scopeOfWorkTypeVal, setScopeOfWorkTypeVal] = useState([])
  // const [reasonCodeDrpDwn, setReasonCodeDrpDwn] = useState([])
  const [projectDetailVals, setProjectDetailVals] = useState()
  // const [productDetailVals, setProductDetailVals] = useState([])
  const [customerNameVals, setCustomerNameVals] = useState('')
  const [scopeofWorkVals, setScopeofWorkVals] = useState([])
  const [tentativePOVals, setTentativePOVals] = useState([])
  const [enquiryDateVals, setEnquiryDateVals] = useState('')
  const [leadDtlVals, setLeadDtlVals] = useState([])
  const [indstrlTypeVals, setIndstrlTypeVals] = useState([])
  const [enquiryCodeVals, setEnquiryCodeVals] = useState([])
  // const [contactDetailVals, setContactDetailVals] = useState([])
  const [reasonTextVal, setReasonTextVal] = useState([])
  const [locationTextVal, setLocationTextVal] = useState([])
  const [cityVal, setCityVal] = useState([])
  const [stateVal, setStateVal] = useState([])
  const [pincodeNo, setPincodeNo] = useState([])
  const [contactno, setcontactNo] = useState([])
  const [countryVal, setCountryVal] = useState([])
  const [addressVal, setAddressVal] = useState([])
  const [sEId, setSEId] = useState([])
  const [enquiryNoVal, setEnquiryNo] = useState([])
  const [projectDescriptionVal, setProjectDescription] = useState([])
  const [enquiryTypeVal, setEnquiryType] = useState([])
  const [enquiryCustomerStsVal, setEnquiryCustomerSts] = useState([])
  // const [pmIdVal, setpmId] = useState([])
  const [tenantIdVal, setTenantId] = useState([])
  const [expectedPoDate, setExpectedPODate] = useState(currntdate)
  const [enqCreatedDate, setEnqCreatedDate] = useState(currntdate)
  // const [checkedValue, setCheckedValue] = useState(0)
  const [disableInputBoxes, setDisableInputBoxes] = useState(true)
  // const [display, setDisplay] = useState(true)
  // const [saveButtonStatus, setSaveButtonStatus] = useState(null)
  // const [changeReasonVals, setChangeReasonVals] = useState([])
  const [employeeDropDownVal, setEmployeeDropDownVal] = useState(undefined)
  const [panNo, setPANNo] = useState('')
  const [gstVal, setGSTVal] = useState('')

  // console.log(changeReasonVals)
  // console.log(productDetailVals)

  const ReasonArray = [
    {
      value: 'Man-Power Reduction',
      reason: 'Man-Power Reduction',
    },
    {
      value: 'Process Implementation',
      reason: 'Process Implementation',
    },
    {
      value: 'Production Increment',
      reason: 'Production Increment',
    },
  ]
  const EnquiryTypeArray = [
    {
      value: 'Budgetory',
    },
    {
      value: 'Techno Commercial Offer',
    },
    {
      value: 'Firm',
    },
    {
      value: 'Lead',
    },
    {
      value: 'AMC',
    },
    {
      value: 'Spare',
    },
  ]

  const [dataSource, setDataSource] = useState([])
  const [count, setCount] = useState(0)
  const handleDelete = async (record, index) => {
    if (dataSource.length > 2) {
      const response = await indentFileUpload({
        requestPath: 'deleteSaleEnqContact',
        requestData: {
          hdrId: record?.secId,
        },
      })
      if (response.responseCode === '200') {
        // message.success(response.responseMessage)
      }
      const newData = [...dataSource]
      newData.splice(index, 1)
      setDataSource(newData)
    } else {
      messageReturn(654)
    }
  }

  const handleRadioChange = (record, index) => {
    console.log(record)

    const updatedDataSource = dataSource.map((item, i) => {
      if (index === i) {
        return { ...item, primary: true }
      }
      return { ...item, primary: false }
    })

    setDataSource(updatedDataSource)
  }

  const handleInputChange = (index, e) => {
    const newArr = [...dataSource]
    newArr[index].contactName = e.target.value
    setDataSource(newArr)
  }
  const handleInputContactEmailChange = (index, e) => {
    const newArr = [...dataSource]
    newArr.map(item => {
      if (index.secId === item.secId) {
        return { ...item, contactEmail: e.target.value }
      }
      return item
    })
    // console.log('contact emailvalue ->',newArr[index].contactEmail)
    index.contactEmail = e.target.value
    setDataSource(newArr)
  }

  const handleInputContactNoChange = (index, e) => {
    if (e.target.value.length > 10) {
      messageReturn(650)
    } else {
      const newArr = [...dataSource]
      newArr.map(item => {
        if (index.secId === item.secId) {
          return { ...item, contactNo: e.target.value }
        }
        return item
      })
      index.contactNo = e.target.value
      setDataSource(newArr)
    }
  }
  const handleInputDepartment = (index, e) => {
    const newArr = [...dataSource]
    newArr.map(item => {
      if (index.secId === item.secId) {
        return { ...item, department: e.target.value }
      }
      return item
    })
    index.department = e.target.value
    setDataSource(newArr)
  }

  const defaultColumns = [
    {
      title: 'Contact Name',
      dataIndex: 'contactName',
      key: 'secId',
      width: '25%',
      render: (text, record, index) => {
        // setAddNewContactName(text)
        // console.log(record)
        return {
          props: {
            style: { textAlign: 'left', width: '100px' },
          },
          children: (
            <Input
              value={text}
              style={{ color: 'black' }}
              onChange={event => handleInputChange(index, event)}
              disabled={disableInputBoxes}
            />
          ),
        }
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'secId',
      width: '25%',
      render: (text, index) => {
        return {
          props: {
            style: { textAlign: 'left', width: '100px' },
          },
          children: (
            <Input
              value={text}
              style={{ color: 'black' }}
              onChange={event => handleInputDepartment(index, event)}
              disabled={disableInputBoxes}
            />
          ),
        }
      },
    },
    {
      title: 'Contact Email',
      dataIndex: 'contactEmail',
      key: 'secId',
      width: '25%',
      render: (text, index) => {
        //  setAddNewContactNumber(text)
        return {
          props: {
            style: { textAlign: 'left', width: '100px' },
          },
          children: (
            <Input
              value={text}
              style={{ color: 'black' }}
              onChange={event => handleInputContactEmailChange(index, event)}
              disabled={disableInputBoxes}
            />
          ),
        }
      },
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo',
      key: 'secId',
      width: '25%',
      render: (text, index) => {
        return {
          props: {
            style: { textAlign: 'left', width: '100px' },
          },
          children: (
            <Input
              value={text}
              type="number"
              style={{ color: 'black' }}
              onChange={event => handleInputContactNoChange(index, event)}
              disabled={disableInputBoxes}
            />
          ),
        }
      },
    },
    // {
    //   title: 'primary',
    //   dataIndex: 'primary',
    //   key: 'secId',
    //   width: '10%',
    //   render: (text, index) => {
    //     // setprimaryValue(index.primary !== null ? index.primary : '0')
    //     return (
    //       <span>
    //         <Select
    //           defaultValue="<--Select-->"
    //           style={{ width: '100%', color: 'black !important' }}
    //           onChange={event => handleCheckboxChange(index, event)}
    //           value={index.primary ? true : false}
    //         >
    //           <Option value="true">True</Option>
    //           <Option value="false">False</Option>
    //         </Select>

    //       </span>
    //     )
    //   },
    // },

    {
      title: 'Primary',
      dataIndex: 'primary',
      width: '25%',
      render: (_, record, index) => (
        <Radio onChange={() => handleRadioChange(record, index)} checked={record.primary} />
      ),
    },

    {
      title: 'Action',
      dataIndex: 'operation',
      width: '25%',
      render: (_, record, index) =>
        dataSource.length >= 1 ? (
          <span>
            {index === dataSource.length - 1 ? (
              <AddIcon disableInputBoxes={disableInputBoxes} onClick={() => handleAdd(record)} />
            ) : null}

            {index !== dataSource.length - 1 ? (
              <RemoveIcon
                disableInputBoxes={disableInputBoxes}
                onClick={() => handleDelete(record, index)}
              />
            ) : null}
          </span>
        ) : null,
    },
  ]
  const handleAdd = record => {
    if (
      record.contactEmail !== '' &&
      record.contactName !== '' &&
      record.contactNo !== '' &&
      record.department !== ''
    ) {
      const newData = {
        //  key: count,
        secId: '',
        masterId: '',
        contactName: '',
        contactEmail: '',
        contactNo: '',
        primary: '',
        department: '',
      }
      setDataSource([...dataSource, newData])
      setCount(count + 1)
    } else {
      messageReturn(405)
    }
  }
  const handleSave = row => {
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  // console.log(contactDetailVals)
  // console.log(reasonCodeDrpDwn)

  const tenantid = getTenantId
  const employeid = getLoginEmplId

  /* let departmentId = '';
   const fetchEmployeeLeadThrgh = () => {
     console.log()
     const LeadEmployeeData = getEmployeeDropDownDataService(getTenantId, departmentId, getLoginEmplId)
     return LeadEmployeeData
   } */
  const fetchIndustryTypeDrpDwn = () => {
    const returnData = getIndustryTypeDrpDwn(tenantid)
    return returnData
  }
  const fetchScopeOfWorkDrpDwn = () => {
    const scopeOfData = getScopeOfWorkDrpDwn(tenantid)
    return scopeOfData
  }
  const fetchReasonCodeDrpDwn = () => {
    const reasonCodeData = getReasonCodeDrpDwn(tenantid, employeid)
    return reasonCodeData
  }

  const getSlaveIdVal = store.get('slaveId')
  // const getReferenceIdVal = store.get('referenceID')
  // console.log(getReferenceIdVal)
  useEffect(() => {
    console.log(content)
    async function onLoadFunc() {
      /* const responseVals = await fetchEmployeeLeadThrgh(tenantid, departmentId, employeid)
       let data1 = []
       if (responseVals !== null && responseVals !== undefined) {
         data1 = responseVals
       } else {
         data1 = ''
       }
       console.log(data1) */
      const responseVal = await indentFileUpload({
        requestPath: 'getEmployeeForDepartment',
        requestData: {
          tenantId: getTenantId,
          departmentId: '',
          employeeId: getLoginEmplId,
        },
      })
      if (responseVal) {
        if (responseVal) {
          setEmployeeDropDownVal(responseVal)
        } else {
          setEmployeeDropDownVal(null)
        }
      }

      const response = await fetchIndustryTypeDrpDwn(tenantid)
      let data = []
      if (response !== null && response !== undefined) {
        data = response
      } else {
        data = ''
      }

      const options = data.map(item => ({
        key: item.itCode,
        value: item.itDesc,
      }))

      const scopeOfWrkresponse = await fetchScopeOfWorkDrpDwn(tenantid)
      let ScopeOfWorkdata = []
      if (scopeOfWrkresponse !== null && scopeOfWrkresponse !== undefined) {
        ScopeOfWorkdata = scopeOfWrkresponse
      } else {
        ScopeOfWorkdata = ''
      }

      const options1 = ScopeOfWorkdata.map(item => ({
        key: item.sowCode,
        value: item.sowDesc,
      }))

      const reasonCoderesponse = await fetchReasonCodeDrpDwn(tenantid, employeid)
      let ReasonCodedata = []
      if (reasonCoderesponse !== null && reasonCoderesponse !== undefined) {
        ReasonCodedata = reasonCoderesponse
      } else {
        ReasonCodedata = ''
      }
      console.log(ReasonCodedata)
      setIndustryTypeVal(data)
      setScopeOfWorkTypeVal(ScopeOfWorkdata)
      console.log(options)
      console.log(options1)
      // setReasonCodeDrpDwn(ReasonCodedata)
    }
    onLoadFunc()
  }, [slaveid])

  useEffect(() => {
    async function onLoadFunc() {
      const viewDetailsResp = await getViewDetailsVals(getSlaveIdVal)
      let viewDetailsRespVal = []

      if (viewDetailsResp !== null && viewDetailsResp !== undefined) {
        viewDetailsRespVal = viewDetailsResp.responseData
      } else {
        viewDetailsRespVal = ''
      }
      if (isEditable === '0') {
        setDisableInputBoxes(true)
        // setDisplay(true)
      } else {
        // setDisableInputBoxes(false)
        setDisableInputBoxes(false)
        // setDisplay(true)
      }
      // setSaveButtonStatus(null)
      if (viewDetailsRespVal.length > 0) {
        const poVal = parseFloat(viewDetailsRespVal[0].tentativePoValue)
        const poValue = poVal.toLocaleString('en-IN')
        setEnquiryCodeVals(viewDetailsRespVal[0].enquiryCode)
        setProjectDetailVals(viewDetailsRespVal[0].projectName)
        // setProductDetailVals(viewDetailsRespVal[0].productDetails)
        setCustomerNameVals(viewDetailsRespVal[0].customerName)
        setScopeofWorkVals(viewDetailsRespVal[0].scopeOfWork)
        setTentativePOVals(poValue)
        setEnquiryDateVals(viewDetailsRespVal[0].enquiryDate)
        setLeadDtlVals(viewDetailsRespVal[0].leadDtl)
        setIndstrlTypeVals(viewDetailsRespVal[0].industrialType)
        // setContactDetailVals(viewDetailsRespVal[0].salesContact)
        setReasonTextVal(viewDetailsRespVal[0].reason)
        // setChangeReasonVals(viewDetailsRespVal[0].reason)
        setLocationTextVal(viewDetailsRespVal[0].location)
        const x = viewDetailsRespVal[0].salesContact
        x.push(emptyobj)
        setDataSource(x)
        setSEId(viewDetailsRespVal[0].seId) // not saved
        setEnquiryNo(viewDetailsRespVal[0].enquiryNo) // not saved
        setProjectDescription(viewDetailsRespVal[0].projectDescription) // not saved
        setEnquiryType(viewDetailsRespVal[0].enquiryType) // not saved
        setEnquiryCustomerSts(viewDetailsRespVal[0].enquiryCustomerSts) // not saved
        // setpmId(viewDetailsRespVal[0].pmId) // not saved
        setTenantId(viewDetailsRespVal[0].tenantId)
        setExpectedPODate(viewDetailsRespVal[0]?.expectedPoDate)
        setEnqCreatedDate(viewDetailsRespVal[0]?.createdDateTime)
        setAddressVal(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.address)
        setCityVal(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.city)
        setStateVal(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.state)
        setCountryVal(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.country)
        setPincodeNo(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.pincode)
        setcontactNo(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.contactNo)
        setPANNo(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.pan)
        setGSTVal(viewDetailsRespVal?.[0]?.custMstEntity?.[0]?.gst)
      }
    }
    onLoadFunc()
    // getEmployeeDtls()
  }, [])
  function getCustomerName(e) {
    setCustomerNameVals(e.target.value)
  }
  function getProjectName(e) {
    if (e.target.value.length > 127) {
      setProjectDetailVals('')
      messageReturn(646)
    } else {
      setProjectDetailVals(e.target.value)
    }
  }
  function handleChangeIndusType(value) {
    setIndstrlTypeVals(value)
  }
  function handleChangeScopeOfwrk(value, options) {
    setScopeofWorkVals(value)
    console.log(options)
  }
  function handlechangeEnquirytype(value, options) {
    setEnquiryType(value)
    console.log(options)
  }

  function onChangefromdate(datevalue, dateString) {
    // setfromDate(dateString)
    console.log(datevalue)
    const datefromt = dateString.split('-')
    const datemonthandyearformat = `${datefromt[2]}-${datefromt[1]}-${datefromt[0]}`
    setEnquiryDateVals(datemonthandyearformat)
  }
  function onchangepoDate(datevalue, dateString) {
    console.log(datevalue)
    const datefromt = dateString.split('-')
    const datemonthandyearformat = `${datefromt[2]}-${datefromt[1]}-${datefromt[0]}`
    setExpectedPODate(datemonthandyearformat)
  }
  function getLeadDetail(value, options) {
    setLeadDtlVals(value)
    console.log(options)
  }
  function getProjectDtl(e) {
    setProjectDescription(e.target.value)
  }
  function getReasonDetailVal(value) {
    setReasonTextVal(value)
  }
  function getLocationVall(e) {
    if (e.target.value.length > 44) {
      messageReturn(649)
      setLocationTextVal('')
    } else {
      setLocationTextVal(e.target.value)
    }
  }
  function getCityVal(e) {
    if (e.target.value.length > 127) {
      messageReturn(655)
      setCityVal('')
    } else {
      setCityVal(e.target.value)
    }
  }
  function getStateVal(e) {
    if (e.target.value.length > 128) {
      messageReturn(656)
      setStateVal('')
    } else {
      setStateVal(e.target.value)
    }
  }
  function getPincodeNo(e) {
    if (e.target.value.length > 44) {
      messageReturn(657)
      setPincodeNo('')
    } else {
      setPincodeNo(e.target.value)
    }
  }
  function getCountryVal(e) {
    if (e.target.value.length > 128) {
      messageReturn(658)
      setCountryVal('')
    } else {
      setCountryVal(e.target.value)
    }
  }
  function getAddressVal(e) {
    if (e.target.value.length > 1028) {
      messageReturn(659)
      setAddressVal('')
    } else {
      setAddressVal(e.target.value)
    }
  }

  /* const getEmployeeDtls = async () => {
     console.log(getLoginEmplId)
     console.log(getTenantId)
     try {
       const response = await indentFileUpload({
         requestPath: 'getEmployeeForDepartment',
         requestData: {
           tenantId: getTenantId,
           departmentId: '',
           employeeId: getLoginEmplId,
         },
       })
       console.log(response)
       if (response) {
         if (response) {
           setEmployeeDropDownVal(response)
         } else {
           setEmployeeDropDownVal(null)
         }
       }
     } catch (error) {
       console.error(error)
     } 
   } */
  // console.log(pmIdVal)
  function submitFunction() {
    const updatedSalesEntity = dataSource.filter(entity => {
      return (
        entity.contactName.trim() !== '' ||
        entity.contactEmail.trim() !== '' ||
        entity.contactNo.trim() !== '' ||
        entity.department.trim() !== ''
      )
    })
    const reqobj = {
      seId: sEId,
      enquiryNo: enquiryNoVal,
      projectName: projectDetailVals,
      industrialType: indstrlTypeVals,
      scopeOfWork: scopeofWorkVals,
      projectDescription: projectDescriptionVal,
      // productDetailVals,
      enquiryType: enquiryTypeVal,
      enquiryCustomerSts: enquiryCustomerStsVal,
      reason: reasonTextVal,
      enquiryDate: enquiryDateVals,
      leadDtl: leadDtlVals,
      tentativePoValue: tentativePOVals.replace(/,/g, ''),
      tenantId: tenantIdVal,
      pmId: processCode,
      customerName: customerNameVals,
      emplId: getLoginEmplId,
      location: locationTextVal,
      expectedPoDate: expectedPoDate ? moment(expectedPoDate).format('YYYY-MM-DD') : '',
      salesEntity: updatedSalesEntity,
      city: cityVal,
      state: stateVal,
      country: countryVal,
      pincode: pincodeNo,
      address: addressVal,
      contactNo: contactno,
      gst: gstVal,
      pan: panNo,
    }

    onUpdateContactDetails(reqobj)
  }

  async function onUpdateContactDetails(reqobj) {
    const viewDetailsResp = await insertAndUpdateEnquiry(reqobj)

    const resp = viewDetailsResp.responseMessage
    if (resp === 'Successfully Updated') {
      success(resp)
      updatedetailinstore()
    } else {
      error(resp)
    }
  }

  async function updatedetailinstore() {
    const viewDetailsResp = await getViewDetailsVals(getSlaveIdVal)
    let viewDetailsRespVal = []
    if (viewDetailsResp !== null && viewDetailsResp !== undefined) {
      viewDetailsRespVal = viewDetailsResp.responseData
    } else {
      viewDetailsRespVal = ''
    }
    if (viewDetailsRespVal.length > 0) {
      const poVal = parseFloat(viewDetailsRespVal[0].tentativePoValue)
      const poValue = poVal.toLocaleString('en-IN')
      const Enquiry = [
        {
          key: 2,
          label: 'Enquiry No',
          value: viewDetailsRespVal[0].enquiryCode,
        },
        {
          key: 2,
          label: 'Customer Name',
          value: viewDetailsRespVal[0].customerName,
        },
        {
          key: 3,
          label: 'Project Name',
          value: viewDetailsRespVal[0].projectName,
        },
        {
          key: 4,
          label: 'Enquiry Type',
          value: viewDetailsRespVal[0].enquiryType,
        },
        {
          key: 5,
          label: 'Expected PO Date',
          value: moment(viewDetailsRespVal[0]?.expectedPoDate).format('DD-MMM-YYYY'),
        },
        {
          key: 5,
          label: `Tentative PO Value ${store.get('MenuListData')[0].currency}`,
          value: poValue,
        },
      ]

      store.set('Enquiry', Enquiry)
    }
    window.location.reload()
  }
  const success = resp => {
    message.success(resp)
  }

  const error = resp => {
    message.error(resp)
  }
  function docDescHandle(e) {
    if (e.target.value.length > 13) {
      setTentativePOVals('')
      messageReturn(647)
    } else {
      const inputValue = e.target.value.replace(/[^\d.]/g, '')
      const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
      const formattedValue = parsedValue.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

      setTentativePOVals(formattedValue)
    }
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '5px', marginTop: '0px' }}>
      <div>
        <div className="d-flex flex-column justify-content-center mr-auto">
          <div>
            <h5>Enquiry Initiation</h5>
          </div>
        </div>

        <div>
          <div style={{ marginTop: '0px', marginLeft: '10px' }}>
            <div className="row" style={{ display: 'flex', paddingTop: 10 }}>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <h6>Enquiry No</h6>
                <Inputs color="black" value={enquiryCodeVals} colors="black" disabled />
              </div>

              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <h6>Customer Name</h6>
                <Inputs
                  color="black"
                  value={customerNameVals}
                  onChange={e => getCustomerName(e)}
                  disabled={disableInputBoxes}
                  colors="black"
                />
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <h6>Project Name</h6>
                <Inputs
                  color="black"
                  value={projectDetailVals}
                  onChange={getProjectName}
                  disabled={disableInputBoxes}
                  colors="black"
                />
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <h6>Industry Type</h6>
                <AutoComplete
                  style={{ width: '100%', color: 'black !important' }}
                  options={industryTypeVal.map(option => ({
                    value: option.itDesc,
                    label: option.itDesc,
                  }))}
                  placeholder="Select"
                  onChange={handleChangeIndusType}
                  disabled={disableInputBoxes}
                  value={indstrlTypeVals}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={handleChangeIndusType}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Scope of Work</h6>
                <AutoComplete
                  style={{ width: '100%', color: 'black !important' }}
                  options={scopeOfWorkTypeVal.map(option => ({
                    value: option.sowDesc,
                    label: option.sowDesc,
                  }))}
                  placeholder="Select"
                  onChange={handleChangeScopeOfwrk}
                  disabled={disableInputBoxes}
                  value={scopeofWorkVals}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={handleChangeScopeOfwrk}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Enquiry Type</h6>
                <AutoComplete
                  style={{ width: '100%', color: 'black !important' }}
                  options={EnquiryTypeArray.map(option => ({
                    value: option.value,
                    label: option.value,
                  }))}
                  placeholder="Select"
                  onChange={handlechangeEnquirytype}
                  disabled={disableInputBoxes}
                  value={enquiryTypeVal}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={handlechangeEnquirytype}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Customer Intent</h6>
                <AutoComplete
                  style={{ width: '100%', color: 'black !important' }}
                  options={ReasonArray.map(option => ({
                    value: option.value,
                    label: option.reason,
                  }))}
                  placeholder="Select"
                  value={reasonTextVal}
                  onChange={getReasonDetailVal}
                  disabled={disableInputBoxes}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={getReasonDetailVal}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Enquiry Generated Date</h6>
                <DatePicker
                  style={{ width: '100%', color: 'black !important' }}
                  monthsShown={1}
                  format={dateFormatList}
                  value={enquiryDateVals ? moment(enquiryDateVals) : ''}
                  onChange={onChangefromdate}
                  disabledDate={d => !d || d.isAfter(moment())}
                  selectsRange
                  inline
                  disabled={disableInputBoxes}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Lead Through</h6>
                <AutoComplete
                  style={{ width: '100%', color: 'black !important' }}
                  options={employeeDropDownVal?.map(option => ({
                    value: option.employeeName,
                    label: option.employeeName,
                  }))}
                  placeholder="Select"
                  onChange={getLeadDetail}
                  disabled={disableInputBoxes}
                  value={leadDtlVals}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={getLeadDetail}
                />
                {/* <Inputs
                  color="black"
                  value={leadDtlVals}
                  onChange={getLeadDetail}
                  disabled={disableInputBoxes}
                  colors="black"
                /> */}
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Tentative PO Value</h6>
                <Inputs
                  color="black"
                  value={tentativePOVals}
                  onChange={docDescHandle}
                  disabled={disableInputBoxes}
                  colors="black"
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Expected PO Date</h6>
                <DatePicker
                  style={{ width: '100%', color: 'black !important' }}
                  monthsShown={1}
                  format="DD-MMM-YYYY"
                  onChange={onchangepoDate}
                  disabledDate={d => !d || d.isBefore(moment())}
                  selectsRange
                  inline
                  value={expectedPoDate ? moment(expectedPoDate) : ''}
                  disabled={disableInputBoxes}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Enquiry Created Date</h6>
                <DatePicker
                  style={{ width: '100%', color: 'black !important' }}
                  monthsShown={1}
                  format={dateFormatList}
                  // onChange={onchangepoDate}
                  disabledDate={d => !d || d.isBefore(moment())}
                  selectsRange
                  inline
                  value={enqCreatedDate ? moment(enqCreatedDate) : ''}
                  disabled
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Location</h6>
                <Inputs
                  color="black"
                  value={locationTextVal}
                  onChange={getLocationVall}
                  disabled={disableInputBoxes}
                  colors="black"
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Project Detail</h6>
                <TextArea
                  rows={4}
                  style={{ color: 'black' }}
                  value={projectDescriptionVal}
                  onChange={getProjectDtl}
                  disabled={disableInputBoxes}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Address</h6>
                <TextArea
                  rows={4}
                  style={{ color: 'black' }}
                  value={addressVal}
                  onChange={getAddressVal}
                  disabled={disableInputBoxes}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>City</h6>
                <Inputs
                  type="text"
                  disabled={disableInputBoxes}
                  colors="black"
                  value={cityVal}
                  onChange={getCityVal}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>State</h6>
                <Inputs
                  type="text"
                  disabled={disableInputBoxes}
                  colors="black"
                  value={stateVal}
                  onChange={getStateVal}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Country</h6>
                <Inputs
                  type="text"
                  disabled={disableInputBoxes}
                  colors="black"
                  value={countryVal}
                  onChange={getCountryVal}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Pincode</h6>
                <Input
                  style={{ width: '100%' }}
                  maxLength={6}
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  value={pincodeNo}
                  onChange={getPincodeNo}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>Contact No</h6>
                <Input
                  style={{ width: '100%' }}
                  maxLength={10}
                  colors="black"
                  disabled
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  value={contactno}
                  onChange={e => setcontactNo(e.target.value)}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>PAN</h6>
                <Input
                  style={{ width: '100%' }}
                  maxLength={12}
                  type="text"
                  value={panNo}
                  onChange={e => setPANNo(e.target.value)}
                />
              </div>
              <div
                className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
                style={{ marginTop: '10px' }}
              >
                <h6>GST</h6>
                <Input
                  style={{ width: '100%' }}
                  value={gstVal}
                  onChange={e => setGSTVal(e.target.value)}
                  maxLength={15}
                  type="text"
                />
              </div>
            </div>
            <div>
              <div className="d-flex flex-column justify-content-center mr-auto mt-3">
                <div>
                  <h5>Contact Details</h5>
                </div>
              </div>
              <div className="col-12" style={{ marginTop: '10px' }}>
                <Table
                  components={components}
                  rowClassName={() => 'editable-row'}
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{
                    pageSizeOptions: ['10', '20', '30', '50', [dataSource?.length]],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                  }}
                  scroll={{ y: 400 }}
                  // pagination={false}
                  // pagination={false}
                />
              </div>
            </div>
          </div>
          {/* <EnquiryValidationCommon
            componenttoRender="sales"
            saveButtonStatus="1"
            type="Sales"
            insertfunc={submitFunction}
            uploadDocType="DC043"
          /> */}
          <ApproveDocument
            componenttoRender="sales"
            saveButtonStatus="1"
            type="Sales"
            insertfunc={submitFunction}
            uploadDocType="DC043"
          />
          {/* <ApproveOrRejectButton
            refId={getSlaveIdVal}
            refDoctTyp={docTypeCode}
            tenId={getTenantId}
            btnShow={display}
            isEditableBtn={isEditable}
            submitFunction={submitFunction}
            saveButtonStatus={saveButtonStatus}
            componentToRender="sales"
            getReferenceIdVal={getReferenceIdVal}
            saveButtonStatusVal="1"
          /> */}
        </div>
      </div>
    </div>
  )
}
export default NewEnquiryCreate
