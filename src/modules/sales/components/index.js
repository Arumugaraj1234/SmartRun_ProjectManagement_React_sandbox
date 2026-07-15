import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { DatePicker, message, AutoComplete, Checkbox } from 'antd'

import salesRetrieve from 'services/sales/salesRetrieve'
// import getViewDetailsVals from 'services/sales/enquiryBySlaveId'
import insertEnquiry from 'services/sales/insertUpdateEnquiry'
import getIndustryTypeDrpDwn from 'services/common/IndustryType'
import getScopeOfWorkDrpDwn from 'services/common/ScopeOfWork'

import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
import GridComponent from '../../../components/shared/GridComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'
import Loader from '../../../components/common/Loader'

// Component as props
import NewEnquiry from '../../../components/shared/NewEnquiry'
import SaleTableComponent from './SaleTableComponent'

// fields component
import Button from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'
import DatePickers from '../../../components/shared/DatePickerComponent'
// import DropDown from '../../../components/shared/DropDownComponent'
import TextArea from '../../../components/shared/TextAreaComponent'

// import style from './style.module.scss'

const SalesComponent = () => {
  const history = useHistory()
  const notificationRecord = history?.location?.state?.record
  const tenantid = store.get('tenantId')
  const tenantID = store.get('tenantId')
  const emplId = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const currDate = new Date().toISOString().split('T')[0]
  const currntdate = moment(currDate).format('YYYY-MM-DD')
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
  // const currentYear = moment().year()
  // const currentMonth = moment().month()
  // let defaultFromDate
  // let defaultToDate

  // if (currentMonth < 3) {
  //   defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
  //   defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  // } else {
  //   defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
  //   defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  // }

  const [dateval, setfromDate] = useState(currntdate)
  const slctdEnqruiryTypeVal = ''
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [newIndustryVal, setNewIndustryVal] = useState('')
  const [newLeadDetail, setNewLeadDetail] = useState('')
  const [tentativePOVal, setTentativePOVal] = useState('')
  const [tentativeVal, setTentativeVal] = useState(0)
  const [projectDetail, setProjectDetail] = useState('')
  const [locationDetail, setLocationDetail] = useState('')
  const [newContactNoVal, setNewContactNoVal] = useState('')
  const [newContactNameVal, setNewContactNameVal] = useState('')
  const [newEmailVal, setNewEmailVal] = useState('')
  const [slctdFromDate, setSlctdFromDate] = useState('')
  const [slctdToDate, setSlctdToDate] = useState('')
  const [salesRetrieveData, setSalesRetrieveData] = useState('')
  const [tilesalesRetrieveData, setTileSalesRetrieveData] = useState([])
  const [expectedPoDate, setExpectedPODate] = useState(currntdate)
  const [scopeofWorkVal, setScopeofWorkVal] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [employeeDropDownVal, setEmployeeDropDownVal] = useState(undefined)
  const [internal, setInternal] = useState(false)
  const [customerCode, setNewCustomerCode] = useState(null)

  const [slctdCustomerValue, setSlctdCustomerValue] = useState('')
  const [industryTypeDrpDwnVal, setIndustryTypeDrpDwnVal] = useState('')
  const [scopeOfWorkTypeVal, setScopeOfWorkTypeVal] = useState('')
  const [changeReasonVals, setChangeReasonVals] = useState('')
  const [enquiryType, setEnquiryType] = useState('')
  const [enqEnabledtl, setEnqEnableDtl] = useState(null)
  const [customerMst, setCustomerMst] = useState([])
  const [panNo, setPANNo] = useState('')
  const [gstVal, setGSTVal] = useState('')

  const [loading, setLoading] = useState(false)

  const showcreatebtn = true
  const fetchIndustryTypeDrpDwn = () => {
    const returnData = getIndustryTypeDrpDwn(tenantid)
    return returnData
  }
  const fetchScopeOfWorkDrpDwn = () => {
    const scopeOfData = getScopeOfWorkDrpDwn(tenantid)
    return scopeOfData
  }

  useEffect(() => {
    async function onLoadFunc() {
      const response = await fetchIndustryTypeDrpDwn(tenantid)
      let data = []
      if (response !== null && response !== undefined) {
        data = response
      } else {
        data = ''
      }

      const scopeOfWrkresponse = await fetchScopeOfWorkDrpDwn(tenantid)
      let ScopeOfWorkdata = []
      if (scopeOfWrkresponse !== null && scopeOfWrkresponse !== undefined) {
        ScopeOfWorkdata = scopeOfWrkresponse
      } else {
        ScopeOfWorkdata = ''
      }
      setIndustryTypeDrpDwnVal(data)
      setScopeOfWorkTypeVal(ScopeOfWorkdata)
    }
    onLoadFunc()
    getEnqEnableDtl()
    getEmployeeDtls()
    getCustomerMst()
  }, [])

  const getEnqEnableDtl = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getEnqEnablement',
        requestData: {
          pmId: '1',
          tenantId: tenantID,
          empId: emplId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          setEnqEnableDtl(response.responseDataMessage)
        } else {
          setEnqEnableDtl(null)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getCustomerMst = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getCustomermst',
        requestData: {
          tenantId: tenantID,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          const options = response.responseData.map(item => ({
            key: item.custCode,
            value: item.custName,
          }))
          setCustomerMst(options)
        } else {
          setCustomerMst(null)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getEmployeeDtls = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getEmployeeForDepartment',
        requestData: {
          tenantId: tenantID,
          departmentId: '',
          employeeId: emplId,
        },
      })
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
  }

  // async function onLoadFunc2(slaveIdVal) {
  //   const viewDetailsResp = await getViewDetailsVals(slaveIdVal)
  //   let viewDetailsRespVal = []

  //   if (viewDetailsResp !== null && viewDetailsResp !== undefined) {
  //     viewDetailsRespVal = viewDetailsResp.responseData
  //   } else {
  //     viewDetailsRespVal = ''
  //   }
  // }

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
      value: 'Budgetary',
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

  function fetchSalesRetriveDatas() {
    let tentativeValues
    if (tentativeVal === 0) {
      tentativeValues = 0
    } else {
      tentativeValues = tentativeVal.replace(/,/g, '')
    }

    fetchSalesRetriveData(
      slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      slctdCustomerValue,
      tenantid,
      emplId,
      tentativeValues,
      isChecked === false ? 0 : 1,
    )
  }

  async function fetchSalesRetriveData(
    fromdates,
    todates,
    custmrnames,
    tenantids,
    emplIds,
    tentVal,
    ischeck,
  ) {
    const changefromdte = moment(fromdates).format('YYYY-MM-DD')
    const fromDateTimestamp = Date.parse(changefromdte)
    const toDateTimestamp = Date.parse(todates)
    if (toDateTimestamp < fromDateTimestamp && fromDateTimestamp !== toDateTimestamp) {
      messageReturn(645)
      return
    }
    const response = await salesRetrieve(
      fromdates,
      todates,
      custmrnames,
      tenantids,
      emplIds,
      tentVal,
      ischeck,
    )
    let data = []
    if (response.responseData !== null && response.responseData !== undefined) {
      setFilterCards(false)
      setIsChecked(false)
      setTentativeVal(0)
      setSlctdCustomerValue('')
      data = response.responseData.map((item, index) => {
        // const createdDate = item.enqList[0].createdDateTime.split(" ")[0];
        // return { ...item, sno: index + 1, createdDateTime: createdDate }
        const updatedEnqList = item?.enqList?.map(enq => {
          const createdDate = enq.createdDateTime.split(' ')[0]
          return { ...enq, createdDateTime: createdDate }
        })

        return {
          ...item,
          sno: index + 1,
          enqList: updatedEnqList,
          salesContact: item.salesContact.length > 0 ? item.salesContact[0].contactNo : '',
        }
      })
    } else {
      data = ''
    }
    setSalesRetrieveData(data)
  }

  const onloadfetchSalesRetriveData = () => {
    const reasonCodeData = salesRetrieve(
      slctdFromDate,
      slctdToDate,
      slctdCustomerValue,
      tenantid,
      emplId,
      tentativeVal,
      0,
    )
    return reasonCodeData
  }
  useEffect(() => {
    gettileviewdata()
  }, [])

  useEffect(() => {
    async function onLoadFunc() {
      const response = await onloadfetchSalesRetriveData(
        moment(slctdFromDate).format('YYYY-MM-DD'),
        moment(slctdToDate).format('YYYY-MM-DD'),
        slctdCustomerValue,
        tenantid,
        emplId,
        tentativeVal,
        0,
      )
      let data = []
      if (response.responseData !== null && response.responseData !== undefined) {
        data = response.responseData.map((item, index) => {
          const fullValue = Number(item.finalCost)
          return {
            ...item,
            sno: index + 1,
            createdDateTime: item.createdDateTime
              ? moment(item.createdDateTime).format('YYYY-MM-DD')
              : '',
            salesContact: item.salesContact?.[0]?.contactNo,
            finalCost: fullValue ? fullValue.toLocaleString() : '',
          }
        })
      } else {
        data = ''
      }
      setSalesRetrieveData(data)
      console.log(data)
    }

    onLoadFunc()
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)
  const [submitDisable, setSubmitDisable] = useState(false)

  const gettileviewdata = async () => {
    const props = {
      fromDate: slctdFromDate ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      toDate: slctdToDate ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      customerName: slctdCustomerValue,
      tenantId: tenantid,
      empId: emplId,
      tentativePoVal: tentativeVal ? tentativeVal.replace(/,/g, '') : '',
      isExpectedPoDate: isChecked === false ? 0 : 1,
    }
    const response = await indentFileUpload({
      requestPath: 'getSaleTileView',
      requestData: props,
    })
    let data = []
    if (response.responseData !== null && response.responseData !== undefined) {
      data = response.responseData.map((item, index) => {
        // const createdDate = item.createdDateTime.split(" ")[0];
        // return { ...item, sno: index + 1 }
        const updatedEnqList = item.enqList.map(enq => {
          const createdDate = enq.createdDateTime.split(' ')[0]
          return { ...enq, createdDateTime: createdDate }
        })

        return { ...item, sno: index + 1, enqList: updatedEnqList }
      })
    } else {
      data = []
    }
    setTileSalesRetrieveData(data)
    // console.log(data)
  }

  useEffect(() => {
    if (tilesalesRetrieveData.length > 0 && notificationRecord?.enquiryId) {
      // flatten all enquiries from tiles
      const match = tilesalesRetrieveData
        .flatMap(tile => tile.enqList)
        .find(enq => enq.seId === notificationRecord.enquiryId)

      if (match) {
        // 🔹 reuse handleCardClick logic so it behaves exactly like manual click
        handleCardClick(match)
      }
    }
  }, [tilesalesRetrieveData, notificationRecord])

  const Btncomponent = [
    <div style={{ paddingLeft: '25%' }}>
      <Button
        type="primary"
        size="medium"
        text="Submit"
        onClick={createNewEnquiry}
        disable={submitDisable}
      />
      &nbsp;&nbsp;
      <Button type="primary" size="medium" text="Cancel" onClick={clearInputFields} />
    </div>,
  ]

  const openSidebar = () => {
    setFilterCards(false)
    setIsSidebarOpen(true)
    setIsTableOpen(false)
  }

  const handleClickTable = () => {
    setIsSidebarOpen(false)
    setFilterCards(false)
    setCustomerCard(false)
    setIsTableOpen(true)
  }
  const handleCardView = () => {
    setIsTableOpen(false)
  }

  const openFilterCard = () => {
    setIsSidebarOpen(false)
    if (customercard) {
      setCustomerCard(false)
      setFilterCards(false)
    } else {
      setFilterCards(true)
      setIsTableOpen(false)
    }
  }

  const handleCardClick = e => {
    const poVal = parseFloat(e.tentativePoValue)
    const poValue = poVal.toLocaleString('en-IN')
    store.set('EnquiryID', e.enquiryNo)
    store.set('referenceId', e.seId)
    setCustomerCard(true)
    setIsTableOpen(false)
    // const slaveid = e.seId

    setScopeofWorkVal('')
    // onLoadFunc2(slaveid)

    const Enquiry = [
      {
        key: 2,
        label: 'Enquiry No',
        value: e.enquiryCode,
      },
      {
        key: 2,
        label: 'Customer Name',
        value: e.customerName,
      },
      {
        key: 3,
        label: 'Project Name',
        value: e.projectName,
      },
      {
        key: 4,
        label: 'Enquiry Type',
        value: e.enquiryType,
      },
      {
        key: 5,
        label: 'Expected PO Date',
        value: moment(e.expectedPoDate).format('DD-MMM-YYYY'),
      },
      {
        key: 5,
        label: `Tentative PO Value ${Menulistdata[0].currency}`,
        value: poValue,
      },
    ]

    store.set('Enquiry', Enquiry)
    setIsTableOpen(false)
    history.push({
      pathname: '/salesdetails',
      state: { e },
    })
  }

  const columns = {
    xl: 4,
    lg: 4,
    md: 2,
    sm: 1,
    xs: 1,
  }

  function onChangefromdate(datevalue, dateString) {
    // const datefromt = dateString.split('/')
    const datemonthandyearformat = moment(dateString).format('YYYY-MM-DD')

    setfromDate(datemonthandyearformat)
  }
  function onchangePODate(datevalue, dateString) {
    // const datefromt = dateString.split('/')
    const datemonthandyearformat = moment(dateString).format('YYYY-MM-DD')
    setExpectedPODate(datemonthandyearformat)
  }

  const numRows = Math.ceil(salesRetrieveData.length / columns.xl)
  const pmId = '1'
  const seId = ''
  const enquiryNo = ''
  const enquiryCustomerSts = ''

  function getCustomerName(e, val) {
    if (val && Object.keys(val).length === 0 && val.constructor === Object) {
      setNewCustomerCode(null)
    } else {
      setNewCustomerCode(val.key)
    }
    setNewCustomerName(e)
  }
  function getProjectName(e) {
    if (e.target.value.length > 127) {
      setNewProjectName('')
      messageReturn(646)
    } else {
      setNewProjectName(e.target.value)
    }
  }
  function getIndustryVal(value) {
    setNewIndustryVal(value)
  }
  function getScopeOfWorkVal(value) {
    setScopeofWorkVal(value)
  }

  function getTentativePOVal(e) {
    if (e.target.value.length > 13) {
      setTentativePOVal('')
      messageReturn(647)
    } else {
      const inputValue = e.target.value.replace(/[^\d.]/g, '')
      const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
      const formattedValue = parsedValue.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      setTentativePOVal(formattedValue)
    }
  }

  function getProjectDetail(e) {
    if (e.target.value.length > 2055) {
      setProjectDetail('')
      messageReturn(648)
    } else {
      setProjectDetail(e.target.value)
    }
  }
  function getLocationDetail(e) {
    if (e.target.value.length > 44) {
      messageReturn(649)
      setLocationDetail('')
    } else {
      setLocationDetail(e.target.value)
    }
  }
  function getContactNoDetail(e) {
    if (e.target.value.length > 10) {
      messageReturn(650)
    } else {
      setNewContactNoVal(e.target.value)
    }
  }
  function getContactNameDetail(e) {
    if (e.target.value.length > 127) {
      messageReturn(651)
      setNewContactNameVal('')
    } else {
      setNewContactNameVal(e.target.value)
    }
  }
  function getEmailDetail(e) {
    if (e.target.value.length > 127) {
      messageReturn(652)
      setNewEmailVal('')
    } else {
      setNewEmailVal(e.target.value)
    }
  }
  const internalChange = e => {
    setInternal(e.target.checked)
  }

  function createNewEnquiry() {
    if (
      newProjectName !== '' &&
      newCustomerName !== '' &&
      newIndustryVal !== '' &&
      scopeofWorkVal !== '' &&
      newContactNameVal !== '' &&
      newContactNoVal !== '' &&
      tentativePOVal !== '' &&
      expectedPoDate !== '' &&
      enquiryType !== '' &&
      newLeadDetail !== ''
    ) {
      if (newContactNoVal.length < 10) {
        messageReturn(653)
      } else {
        setSubmitDisable(true)
        setLoading(true)
        const salesEntity = [
          {
            secId: '',
            masterId: '',
            contactName: newContactNameVal,
            contactEmail: newEmailVal,
            contactNo: newContactNoVal,
            primary: true,
          },
        ]

        const reqobj = {
          seId,
          enquiryNo,
          projectName: newProjectName,
          industrialType: newIndustryVal,
          scopeOfWork: scopeofWorkVal,
          projectDescription: projectDetail,
          enquiryType,
          enquiryCustomerSts,
          reason: changeReasonVals,
          enquiryDate: dateval,
          leadDtl: newLeadDetail,
          tentativePoValue: tentativePOVal.replace(/,/g, ''),
          tenantId: tenantid,
          pmId,
          customerName: newCustomerName,
          location: locationDetail,
          emplId,
          expectedPoDate,
          slctdEnqruiryTypeVal,
          salesEntity,
          customerCode,
          pan: panNo,
          gst: gstVal,
          isInternal: internal === false ? 0 : 1,
        }

        insertEnquiryDtls(reqobj)
      }
    } else {
      messageReturn(405)
    }
  }

  const insertEnquiryDtls = async reqobj => {
    setLoading(true)
    const response = await insertEnquiry(reqobj)
    const resp = response.responseMessage
    if (resp === 'Successfully Updated') {
      setLoading(false)
      success(resp)
      fetchSalesRetriveDatas()
      gettileviewdata()
      clearInputFields()
      setIsSidebarOpen(false)
      setSubmitDisable(false)
    } else {
      setLoading(false)
      setSubmitDisable(false)
      error(resp)
    }
  }
  const success = resp => {
    message.success(resp)
  }

  const error = resp => {
    message.error(resp)
  }
  function clearInputFields() {
    setNewCustomerName('')
    setNewProjectName('')
    setNewIndustryVal('<--Select-->')
    setScopeofWorkVal('<--Select-->')
    setNewLeadDetail('')
    setTentativePOVal('')
    setProjectDetail('')
    // setProductDetail('')
    setLocationDetail('')
    // setNewReasonVal('')
    setNewContactNoVal('')
    setNewContactNameVal('')
    setNewEmailVal('')
    setInternal(false)
    setIsSidebarOpen(false)
  }
  function getSelectedFromDate(value, dateString) {
    const spltDateMnthandyear = dateString.split('/')
    const datemonthandyearformat = `${spltDateMnthandyear[2]}-${spltDateMnthandyear[1]}-${spltDateMnthandyear[0]}`

    setSlctdFromDate(datemonthandyearformat)
  }
  function getSelectedToDate(value, dateString) {
    const spltDateMnthandyears = dateString.split('/')
    const datemonthandyearformats = `${spltDateMnthandyears[2]}-${spltDateMnthandyears[1]}-${spltDateMnthandyears[0]}`
    setSlctdToDate(datemonthandyearformats)
  }
  function getCustomerVal(e) {
    setSlctdCustomerValue(e.target.value)
  }
  const closeFilterCard = () => {
    setFilterCards(false)
    setIsChecked(false)
    setTentativeVal(0)
    setSlctdCustomerValue('')
  }

  const getTentativeVal = e => {
    const inputValue = e.target.value.replace(/[^\d.]/g, '')
    const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
    const formattedValue = parsedValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    setTentativeVal(formattedValue)
  }

  const closeNewInputcard = () => {
    setIsSidebarOpen(false)
  }
  function handleChangeReason(value) {
    setChangeReasonVals(value)
  }
  function handlechangeenqType(value) {
    setEnquiryType(value)
  }

  const handleChangeisExp = e => {
    setIsChecked(e.target.checked)
  }

  const handleEmplyOnChange = value => {
    setNewLeadDetail(value)
  }

  return (
    <Loader loading={loading}>
      <div>
        {!customercard && (
          <GridViewHeader
            EnquiryLabel="Enquiries"
            handleCardView={handleCardView}
            handleClickTable={handleClickTable}
            openSidebar={openSidebar}
            openFilterCard={openFilterCard}
            istableopen={istableopen}
            showcreatebtn={showcreatebtn}
            enqEnabledtl={enqEnabledtl}
          />
        )}
        {istableopen ? (
          <SaleTableComponent data={salesRetrieveData} onClick={handleCardClick} />
        ) : (
          !customercard && (
            <div>
              {tilesalesRetrieveData.map(tile => (
                <GridComponent
                  title={tile.statusDesc}
                  GridData={tile.enqList}
                  columns={columns}
                  ProjectLabel="Project Name"
                  ValueLabel={`Value ${Menulistdata[0].currency}`}
                  DetailsLabel="View Details"
                  rupee="L"
                  numRows={numRows}
                  onClick={handleCardClick}
                  moduleType="sales"
                />
              ))}
            </div>
          )
        )}
        {isSidebarOpen && (
          <NewEnquiry
            closeNewCreateCard={closeNewInputcard}
            Btncomponent={Btncomponent}
            text="New Enquiry"
            data={[
              {
                key: 1,
                label: 'Customer Name',
                mandatory: 1,
              },
              {
                key: 2,
                label: 'Project Name',
                mandatory: 1,
              },
              {
                key: 3,
                label: 'Industry Type',
                mandatory: 1,
              },
              {
                key: 4,
                label: 'Scope of Work',
                mandatory: 1,
              },
              {
                key: 5,
                label: 'Enquiry Type',
                mandatory: 1,
              },
              {
                key: 6,
                label: 'Customer Intent',
                mandatory: 0,
              },
              {
                key: 7,
                label: 'Enquiry Generated Date',
                mandatory: 0,
              },
              {
                key: 8,
                label: 'Lead Through',
                mandatory: 1,
              },
              {
                key: 9,
                label: 'Tentative PO Value (Rs.)',
                mandatory: 1,
              },
              {
                key: 10,
                label: 'Expected PO Date',
                mandatory: 1,
              },
              {
                key: 11,
                label: 'Project Details',
                mandatory: 0,
              },

              {
                key: 12,
                label: 'Location',
                mandatory: 0,
              },
              {
                key: 13,
                label: 'Contact Name',
                mandatory: 1,
              },
              {
                key: 14,
                label: 'Contact No.',
                mandatory: 1,
              },
              {
                key: 15,
                label: 'Email',
                mandatory: 0,
              },
              {
                key: 16,
                label: 'PAN',
                mandatory: 0,
              },
              {
                key: 17,
                label: 'GST',
                mandatory: 0,
              },
              {
                key: 18,
                label: 'Internal',
                mandatory: 0,
              },
            ]}
          >
            {/* <Input
            width="180px"
            height="25px"
            placeholder="Type Here..."
            type="text"
            value={newCustomerName}
            onChange={e => getCustomerName(e)}
          /> */}
            <AutoComplete
              style={{ width: 180 }}
              options={customerMst}
              placeholder="Select"
              onChange={(e, val) => getCustomerName(e, val)}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              // onSearch={getIndustryVal}
            />
            <Input
              width="180px"
              height="25px"
              type="text"
              placeholder="Type Here..."
              value={newProjectName}
              onChange={e => getProjectName(e)}
            />
            <AutoComplete
              style={{ width: 180 }}
              options={industryTypeDrpDwnVal.map(option => ({
                value: option.itDesc,
                label: option.itDesc,
              }))}
              placeholder="Select"
              onChange={getIndustryVal}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSearch={getIndustryVal}
            />
            <AutoComplete
              style={{ width: 180 }}
              options={scopeOfWorkTypeVal.map(option => ({
                value: option.sowDesc,
                label: option.sowDesc,
              }))}
              placeholder="Select"
              onChange={getScopeOfWorkVal}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSearch={getScopeOfWorkVal}
            />
            <AutoComplete
              style={{ width: 180 }}
              options={EnquiryTypeArray.map(option => ({
                value: option.value,
                label: option.value,
              }))}
              placeholder="Select"
              onChange={handlechangeenqType}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSearch={handlechangeenqType}
            />
            <AutoComplete
              style={{ width: 180 }}
              options={ReasonArray.map(option => ({
                value: option.value,
                label: option.reason,
              }))}
              placeholder="Select"
              onChange={handleChangeReason}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSearch={handleChangeReason}
            />
            <DatePickers
              width="180px"
              mb="5px"
              defaultValue={moment()}
              monthsShown={1}
              format={dateFormatList}
              onChange={onChangefromdate}
              disabledDate={d => !d || d.isAfter(moment())}
              selectsRange
              inline
            />
            <AutoComplete
              style={{ width: 180, color: 'black !important' }}
              options={employeeDropDownVal?.map(option => ({
                value: option.employeeName,
                label: option.employeeName,
              }))}
              placeholder="Select"
              onChange={handleEmplyOnChange}
              filterOption={(inputValue, option) =>
                option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSearch={handleEmplyOnChange}
            />
            <Input
              width="180px"
              height="30px"
              placeholder="Type Here..."
              value={tentativePOVal}
              onChange={getTentativePOVal}
            />

            <DatePicker
              style={{ width: '180px', height: '30px' }}
              mb="5px"
              defaultValue={moment()}
              // format={dateFormatList}
              format="DD-MMM-YYYY"
              onChange={onchangePODate}
            />

            <TextArea
              mb="10px"
              width="180px"
              placeholder="Type Here..."
              value={projectDetail}
              onChange={e => getProjectDetail(e)}
            />
            <Input
              width="180px"
              height="25px"
              type="text"
              placeholder="Type Here..."
              value={locationDetail}
              onChange={e => getLocationDetail(e)}
            />
            <Input
              width="180px"
              height="25px"
              type="text"
              placeholder="Type Here..."
              value={newContactNameVal}
              onChange={e => getContactNameDetail(e)}
            />
            <Input
              width="180px"
              height="25px"
              type="number"
              placeholder="Type Here..."
              value={newContactNoVal}
              onChange={e => getContactNoDetail(e)}
            />
            <Input
              width="180px"
              height="25px"
              type="text"
              placeholder="Type Here..."
              value={newEmailVal}
              onChange={e => getEmailDetail(e)}
            />
            <Input
              width="180px"
              height="30px"
              placeholder="Type Here..."
              type="text"
              value={panNo}
              onChange={e => {
                const newValue = e.target.value
                if (newValue.length <= 12) {
                  setPANNo(newValue)
                }
              }}
            />

            <Input
              width="180px"
              height="30px"
              placeholder="Type Here..."
              value={gstVal}
              onChange={e => {
                const newValue = e.target.value
                if (newValue.length <= 15) {
                  setGSTVal(newValue)
                }
              }}
              maxLength={15}
              type="text"
            />
            <div style={{ marginRight: '160px' }}>
              <Checkbox checked={internal} onChange={internalChange} />
            </div>
          </NewEnquiry>
        )}

        {filtercards && (
          <FilterEnquiry
            closeFilterCard={closeFilterCard}
            style={{ display: 'left' }}
            cardLabel="Filter Enquiry"
            data={[
              {
                key: 1,
                label: 'From Date',
                component: (
                  <DatePicker
                    onChange={getSelectedFromDate}
                    disabledDate={d => !d || d.isAfter(moment())}
                    format="DD-MMM-YYYY"
                    style={{ width: '155px' }}
                  />
                ),
              },
              {
                key: 2,
                label: 'To Date',
                component: (
                  <DatePicker
                    format="DD-MMM-YYYY"
                    onChange={getSelectedToDate}
                    style={{ width: '155px' }}
                  />
                ),
              },
              {
                key: 3,
                label: 'Customer',
                component: (
                  <Input
                    type="text"
                    width="155px"
                    height="35px"
                    value={slctdCustomerValue}
                    onChange={getCustomerVal}
                  />
                ),
              },
              {
                key: 4,
                label: `PO Value ${Menulistdata[0].currency}`,
                component: (
                  <Input
                    type="text"
                    width="155px"
                    height="35px"
                    value={tentativeVal}
                    onChange={getTentativeVal}
                  />
                ),
              },
              {
                key: 5,
                label: 'Sort By PO Date',
                component: (
                  <div style={{ marginLeft: '40px' }}>
                    <Checkbox checked={isChecked} onChange={handleChangeisExp} />
                  </div>
                ),
              },
              {
                key: 6,
                component: (
                  <div style={{ paddingRight: '40%' }}>
                    <Button
                      type="primary"
                      size="medium"
                      text="Submit"
                      onClick={() => {
                        fetchSalesRetriveDatas()
                        gettileviewdata()
                      }}
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </Loader>
  )
}
export default SalesComponent
