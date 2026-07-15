import React, { useState, useEffect, useRef, useMemo } from 'react'
import moment from 'moment'
import { message, Upload, Form, Table, Select, DatePicker, Input, Button, Spin, Modal, Popover, Space } from 'antd'
import store from 'store'
import Skeleton from 'antd/lib/skeleton/Skeleton'
import TextArea from 'antd/lib/input/TextArea'
import { UploadOutlined } from '@ant-design/icons'

import getBudgetSheetRetrival from 'services/common/BudgetsheetService/RetrievalService'
import EnquiryValidationCommon from 'components/common/CRDocumentUploadManagement'
import SalesBudgetExcel from 'resources/Sales_budget_template.xlsx'

import messageReturn from '_helpers/messageReturn'
import AddIconButton from 'components/shared/AddIconComponent'
import InputComponent from '../../../../components/shared/InputComponent'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import checkFileSize from '../../../../_helpers/fileUtill'
import RemoveIcon from '../../../../components/shared/RemoveIconComponent'
// scss
// import style from './style.scss'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
// import getEmployeeService from '../../../../services/common/getDepartmentAndEmployeeDropDownDataService'

const ChangeRequestTab = () => {
  // const { Option } = Select
  const [form] = Form.useForm()
  const [initProj] = Form.useForm()
  // const [initProj] = Form.useForm()
  const [retrivaldata, setRetrivaldata] = useState([])
  // const SalesPer = useRef(null)
  // const [disableInputBoxes, setDisableInputBoxes] = useState(true)
  // const [hdrId, setSbHdrId] = useState(null)
  const [totalvalue, setTotalvalue] = useState(0)
  const [paymentterm, setPaymentterm] = useState(null)
  const [isAddModal, setAddModal] = useState(false)
  const [isAddProj, setIsAddProj] = useState(false)
  const [isDtlProj, setDtlProj] = useState(false)
  const [tableData, setTableData] = useState([])
  const [isTable, setIsTable] = useState(false)
  // const [errorMsg, setErrorMsg] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filtersInfo, setfilterinfo] = useState([])
  // const [filterinfos, setfiltersinfos] = useState([])
  const [initProjId, setInitProjId] = useState(null)
  const [percentage, setPercentage] = useState(0)
  const [offerVal, setOfferValue] = useState(0)
  const dateFormatList = ['DD-MM-YYYY', 'DD/MM/YY']
  const [dateval, setDate] = useState(moment())
  // const [detailtotalvalue, setDetailTotalValue] = useState(null)
  const [plannedDate, setPlannedDate] = useState(moment())
  const [detailsCardVal, setDetailsCardVal] = useState(null)
  // const [crTableDisplay, setcrTableDisplay] = useState(true)
  const [crResp, setCrResp] = useState([])
  const [totalCrvalue, setTotalcrvalue] = useState(0)
  const [offerValuetxt, setOffervaluetxt] = useState(0)
  const popoverRef = useRef()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const emptyPaymentTerm = { term: '', percentage: '', plannedDate: null };
  const [addPaymentTerm, setAddPaymentTerm] = useState([{ ...emptyPaymentTerm }]);
  const [paymentTermRows, setPaymentTermRows] = useState([]);
  const [savedPaymentTermList, setSavedPaymentTermList] = useState([])
  const [viewModalOpen, setViewModalOpen] = useState(false)
  console.log('reload', setTotalvalue)

  const [isDisable, setIsDisable] = useState(false)
  // const [Dept, setDept] = useState(null)
  // console.log(disableInputBoxes)
  // const [deptEmp, setDeptEmp] = useState([])
  const [dtlProj, setDtlProjdata] = useState([])


  // file
  const [file, setFile] = useState(null)

  const Tab = store.get('Tab')
  const { tenantId, mstId, docTypeCode, isEditable, stgCode, processCode } = Tab
  const tenantid = store.get('tenantId')
  const empId = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const enquiryId = store.get('EnquiryID')
  // const getReferenceIdVal = store.get('referenceID')
  // console.log(initProjId, '-----initProjId')


  const salesDesc = tableData ? tableData.map(h => h.salesDescription) : []
  const eleHeader = tableData ? tableData.map(h => h.elementHeader) : []
  const leg = tableData ? tableData.map(h => h.leg) : []
  const eleDesc = tableData ? tableData.map(h => h.elementDescription) : []
  const make = tableData ? tableData.map(h => h.make) : []
  const contigency = tableData ? tableData.map(h => h.contingency) : []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const filtersalesDesc = salesDesc.filter(distinct)
  const filtereleHeader = eleHeader.filter(distinct)
  const filterleg = leg.filter(distinct)
  const filtereleDesc = eleDesc.filter(distinct)
  const filtermake = make.filter(distinct)
  const filtercontigency = contigency.filter(distinct)

  const FilterSalesDesc = filtersalesDesc.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEleHeader = filtereleHeader.map(element => ({
    text: element,
    value: element,
  }))
  const FilterLeg = filterleg.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEleDesc = filtereleDesc.map(element => ({
    text: element,
    value: element,
  }))
  const FilterMake = filtermake.map(element => ({
    text: element,
    value: element,
  }))
  const FilterContigency = filtercontigency.map(element => ({
    text: element,
    value: element,
  }))

  const FilterChange = (pagina, filters) => {
    setfilterinfo(filters)
  }

  useEffect(() => {
    const onLoadFunc = () => {
      onloadfetch()
      // getDeptAndEmp()
      getInitiateProjService()
      getChangeRequestDetails()
    }
    onLoadFunc()
  }, [])

  useEffect(() => {
    // Example fetch replaced by empty initialization for demo:
    setAddPaymentTerm([{ ...emptyPaymentTerm }]);
  }, [])
  // useEffect(() => {
  //   async function onLoadFunc() {
  //     if (isEditable === '1') {
  //       setDisableInputBoxes(false)
  //     } else {
  //       setDisableInputBoxes(true)
  //     }
  //   }
  //   onLoadFunc()
  // }, [])
  const onloadfetch = async () => {
    const response = await fetchBudgetSheetServicedata()
    if (response && response.responseData) {
      setPaymentterm(response.responseData[0].paymentTerms)
      // setSavedPaymentTermList(response.responseData[0].paymentTermList)
      // setSbHdrId(response.responseData[0].sbHdrId)
      const totalbudget = response?.responseData[0]?.crCost
      const totalvalue2 = parseFloat(totalbudget).toLocaleString('en-IN')

      // eslint-disable-next-line prefer-destructuring
      const saleValue = response?.responseData[0]?.crfinalCost
      const saleValue2 = parseFloat(saleValue || '0').toLocaleString('en-IN')
      setTotalcrvalue(totalvalue2)
      setOffervaluetxt(
        saleValue2.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      )
      setRetrivaldata(response.responseData[0].salesDtlList)
      setAddPaymentTerm(response.responseData[0].paymentTermList)
      // setPaymentTermRows(response.responseData[0].paymentTermList)
      setSavedPaymentTermList(response.responseData[0].paymentTermList);
      setPaymentTermRows(
        buildPaymentTermRows(response.responseData[0].paymentTermList)
      );
      // SalesPer.current.value = parseInt(response.responseData[0].salePercent, 10)
      const salesper =
        response.responseData[0].salePercent !== null
          ? parseFloat(response.responseData[0].salePercent)
          : 0
      const dividesal = salesper === 0 ? 0 : 100
      const divid = salesper === 0 ? 0 : salesper / dividesal
      const crSalePercent = response?.responseData[0]?.crsalePercent
      const crSalePercent2 = parseFloat(crSalePercent || '0').toLocaleString('en-IN')
      setPercentage(
        crSalePercent2.toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      )
      const finalVal = parseInt(response.responseData[0].totalBudgetCost, 10) * divid

      // const offerValue = finalVal + parseInt(response.responseData[0].totalBudgetCost, 10)
      // const offerValue2 = parseFloat(offerValue.toString()).toLocaleString('en-IN')
      const offerValue =
        finalVal === 0
          ? 0
          : parseFloat(finalVal) + parseFloat(response.responseData[0].totalBudgetCost)
      console.log(parseFloat(offerValue).toLocaleString('en-IN'))

      // setOfferValue(offerValue.toLocaleString('en-IN'))
      // setOffervaluetxt(
      //   offerValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      // )
      // setOfferValue((finalVal + parseInt(response.responseData[0].totalBudgetCost, 10)).toLocaleString('en-IN'));
    }
  }

  /* const getDeptAndEmp = async () => {
    const response = await getEmployeeService({
      tenantId,
      isActive: '1',
      employeID: '',
    })
    let dataVal = []
    if (response !== null && response !== undefined && response.length > 0) {
      dataVal = response
    } else {
      dataVal = ''
    }
    setDeptEmp(dataVal)
  } */

  const fetchBudgetSheetServicedata = async () => {
    const returnData = await getBudgetSheetRetrival({
      mstId: enquiryId,
      tenId: tenantId,
      budgetValue: '0',
    })
    return returnData
  }

  const getChangeRequestDetails = async () => {
    try {
      const keyareaobj = {
        sbHdrId: enquiryId,
        tenantId: tenantid,
      }
      const response = await indentFileUpload({
        requestPath: 'getChangeRequestInfo',
        requestData: keyareaobj,
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData.length > 0) {
            const filteredData = response.responseData.filter(item => {
              return item.crValue !== null && item.crDateTime !== null && item.remarks !== null
            })
            setCrResp(filteredData || [])
          } else {
            setCrResp([])
          }
        } else {
          setCrResp([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const crColumns = [
    {
      title: 'Change Request No.',
      dataIndex: 'sbcId',
      key: 'sbcId',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => <text>{text !== null && text !== undefined ? text : ''}</text>,
    },
    {
      title: `Change Request DateTime`,
      dataIndex: 'crDateTime',
      key: 'crDateTime',
      render: text => (
        <text>
          {text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY HH:mm') : ''}
        </text>
      ),
    },
    {
      title: `Change Request Value ${Menulistdata[0].currency}`,
      dataIndex: 'crValue',
      key: 'crValue',
      render: (text, record) => (
        <span style={{ textAlign: 'right' }}>
          {record.crValue !== null && record.crValue !== undefined
            ? parseFloat(record.crValue).toLocaleString('en-IN')
            : ''}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'delete',
      render: (text, record) => <RemoveIcon onClick={() => handleDelete(record)} />,
    },
  ]

  // useEffect(() => {
  //   getChangeRequestDetails();
  // }, [crResp]);

  const handleDelete = async delrecord => {
    const { sbcId, sbHdrId } = delrecord
    try {
      const keyareaobj = {
        sbcId,
        tenantId: tenantid,
        hdrId: sbHdrId,
      }
      const response = await indentFileUpload({
        requestPath: 'deleteBudgetSheetCR',
        requestData: keyareaobj,
      })
      // console.log('response')
      if (response) {
        if (response.responseCode === '200') {
          // setReload(prev => !prev);
          message.success(response.responseMessage)
          getChangeRequestDetails()
          onloadfetch()
        } else {
          message.error(response.responseMessage)
          // setCrResp([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Category',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
    },
    {
      title: 'Change Request No.',
      dataIndex: 'sbcId',
      key: 'sbcId',
    },
    {
      title: `Value ${Menulistdata[0].currency}`,
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (text, record) => (
        <span style={{ textAlign: 'right' }}>
          {parseFloat(record.value).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleDetails(record, index)}
          />
        </div>
      ),
    },
  ]

  const highlightRow = record => {
    return record.duplicateRecord === '1' ? 'highlighted-row' : ''
  }

  function getPaymentTerms(e) {
    setPaymentterm(e.target.value)
  }
  const handleAddDoc = () => {
    setAddModal(true)
    setAddPaymentTerm(addPaymentTerm)
  }
  const handlehideAddModal = () => {
    form.resetFields()
    setFile('')
    setTableData([])
    setAddModal(false)
  }
  // const onFileChange = info => {
  //   setFile(info.file.originFileObj)
  // }

  const beforeUpload = files => {
    if (checkFileSize(files)) {
      setFile(files)
    }
  }

  const hanleDateChange = (datevalues, dateString) => {
    setDate(datevalues)
    console.log(dateString)
  }
  const handlePlannedDate = (datevalues, dateString) => {
    setPlannedDate(datevalues)
    console.log(dateString)
  }

  const showConfirm = e => {
    const contents = (
      <div>
        {e.map(item => (
          <p>{` ${item}`}</p>
        ))}
      </div>
    )
    Modal.confirm({
      content: contents,
      html: true,
      okText: 'Proceed',
      cancelText: 'Cancel',
      icon: null,
      onOk() {
        setIsTable(true)
      },
      onCancel() {
        handleClear()
      },
    })
  }

  const handleLoad = async () => {
    try {
      if (file !== null && file !== '') {
        const reqObj = [
          {
            tenantId: tenantid,
          },
        ]
        setIsLoad(true)
        setIsLoading(true)
        const formData = new FormData()
        formData.append('UploadFileReq', JSON.stringify({ reqObj }))
        formData.append('file', file)
        const response = await indentFileUpload({
          requestPath: 'uploadBudgetSheetfile',
          requestData: formData,
        })
        if (response && response.responseData) {
          if (response.responseCode === '200') {
            // if (response.responseData[0].list.length > 0) {
            //   showConfirm();
            // }
            if (response.responseData[0].errorMsgs.length > 0) {
              showConfirm(response.responseData[0].errorMsgs)
              setIsTable(false)
            } else {
              setIsTable(true)
            }
            // setErrorMsg(response.responseData[0].errorMsgs)
            setTableData(response.responseData[0].list)
            setIsLoading(false)
            setIsLoad(false)
          } else {
            // setErrorMsg([])
            setTableData([])
            setIsLoad(false)
            setIsLoading(false)
            messageReturn(634)
          }
        } else {
          // setErrorMsg([])
          setTableData([])
          setIsLoad(false)
          setIsLoading(false)
        }
      } else {
        messageReturn(405)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // const handleChangeDept = e => {
  //   setDept(e)
  // }
  const handleSaveBtn = async () => {
    // const formValues = initProj.getFieldsValue()
    // if (formValues.dept !== undefined) {
    const reqObj = {
      deptCode: '',
      tenantId: tenantid,
      refId: mstId,
      startDate: moment(plannedDate).format('YYYY-MM-DD'),
      dueDate: moment(dateval).format('YYYY-MM-DD'),
      empID: empId,
      pmId: processCode,
    }
    const response = await indentFileUpload({
      requestPath: 'initiateProcessFromOtherStage',
      requestData: reqObj,
    })
    if (response) {
      if (response.responseCode === '200') {
        setIsAddProj(false)
        // setDept(null)
        setDate(moment())
        getInitiateProjService()
        messageReturn(212)
      } else {
        messageReturn(633)
      }
    } else {
      messageReturn(633)
    }
    // } else {
    //   messageReturn(405)
    // }
  }

  const handleSubmitBtn = () => {
    console.log('handleSubmitBtn')
  }

  const uploadColumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'right',
      render: (text, record, index) => index + 1,
      width: '7%',
    },
    {
      title: 'Sales Description',
      dataIndex: 'salesDescription',
      key: 'salesDescription',
      width: '10%',
      filters: FilterSalesDesc,
      filteredValue: filtersInfo.salesDescription,
      onFilter: (value, record) => record?.salesDescription === value,
    },
    {
      title: 'Element Header',
      dataIndex: 'elementHeader',
      key: 'elementHeader',
      width: '8%',
      filters: FilterEleHeader,
      filteredValue: filtersInfo.elementHeader,
      onFilter: (value, record) => record?.elementHeader === value,
    },
    {
      title: 'Stn No',
      dataIndex: 'stnNo',
      key: 'stnNo',
      width: '7%',
      align: 'right',
      render: text => {
        // eslint-disable-next-line no-restricted-globals
        if (text && !isNaN(parseFloat(text))) {
          return (
            <div style={{ textAlign: 'right' }}>{parseFloat(text).toLocaleString('en-IN')}</div>
          )
        }
        return '' // Return empty string if text is not a valid number
      },
    },
    {
      title: 'Leg',
      dataIndex: 'leg',
      key: 'leg',
      width: '5%',
      filters: FilterLeg,
      filteredValue: filtersInfo.leg,
      onFilter: (value, record) => record?.leg === value,
    },
    {
      title: 'Element Description',
      dataIndex: 'elementDescription',
      key: 'elementDescription',
      width: '10%',
      filters: FilterEleDesc,
      filteredValue: filtersInfo.elementDescription,
      onFilter: (value, record) => record?.elementDescription === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: '10%',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      width: '10%',
      filters: FilterMake,
      filteredValue: filtersInfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '6%',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== '' ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: '6%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      width: '8%',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== '' ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Sub Total Value',
      dataIndex: 'subTotalvalue',
      key: 'subTotalvalue',
      align: 'right',
      width: '9%',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Value / Sub Station',
      dataIndex: 'valueSubAssy',
      key: 'valueSubAssy',
      width: '9%',
    },
    {
      title: 'Contingency',
      dataIndex: 'contingency',
      key: 'contingency',
      width: '10%',
      filters: FilterContigency,
      filteredValue: filtersInfo.contingency,
      onFilter: (value, record) => record?.contingency === value,
    },
    {
      title: 'Sub Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      width: '9%',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Critical',
      dataIndex: 'critical',
      key: 'critical',
      width: '10%',
    },
    {
      title: 'Timeline (In Weeks)',
      dataIndex: 'timelineInWeeks',
      key: 'timelineInWeeks',
      width: '10%',
    },
  ]
  const handleClear = () => {
    form.resetFields()
    setPaymentTermRows([{ ...emptyPaymentTerm }]);
    setFile('')
    setTableData([])
  }

  const handleSaveFunc = async () => {
    const formValues = form.getFieldsValue()
    const totalPercentage = paymentTermRows.reduce((sum, item) => {
      return sum + (parseFloat(item.percentage) || 0)
    }, 0)
    console.log(totalPercentage, 'totalPercentage')
    if (totalPercentage !== 100) {
      message.error('Total payment percentage must be exactly 100%.')
      return
    }
    if (formValues.totalvalue && file !== null && tableData && tableData.length > 0) {
      setIsDisable(true)
      const modData = tableData.map(data => {
        return {
          ...data,
          value: data.value !== '' ? data.value : 0,
          qty: data.qty !== '' ? data.qty : 0,
          contingency: data.contingency !== '' ? data.contingency : 1,
        }
      })

      const reqObj = {
        documentTypeCode: docTypeCode,
        finalSaleVal: offerVal,
        list: modData,
        masterId: mstId,
        paymentTerms: formValues.paymentterm,
        salePercent: '1',
        stageCode: stgCode,
        tenantId: tenantid,
        version: '1',
        pmId: processCode,
        isBudget: '0',
        remarks: '',
        crSalePercent: formValues.totalvalue,
        empId,
        paymentTermList: paymentTermRows.filter(
          row =>
            row.term?.trim() !== "" &&
            row.percentage?.trim() !== "" &&
            row.plannedDate !== null
        ),
      }
      const response = await indentFileUpload({
        requestPath: 'uploadBudgetSheetTemplate',
        requestData: reqObj,
      })

      if (response) {
        if (response.responseCode === '200') {
          setIsDisable(false)
          message.success(response.responseMessage)
          getInitiateProjService()
          onloadfetch()
          handleClear()
          setAddModal(false)
        } else {
          setIsDisable(false)
          messageReturn(633)
        }
      }
    } else {
      setIsDisable(false)
      messageReturn(405)
    }
    getChangeRequestDetails()
  }
  const paymentTermList = retrivaldata
    .filter(item => item.term && item.percentage && item.plannedDate)
    .map(item => ({
      term: item.term,
      percentage: item.percentage,
      plannedDate: moment(item.Date).format('YYYY-MM-DD'),
    }))

  console.log(paymentTermList, 'After PaymentTermList')

  console.log(savedPaymentTermList, 'savedPaymentTermList', retrivaldata, 'retrivaldata')

  const paymentTermCol = [
    {
      title: 'Payment Term',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
    },
    {
      title: 'Planned Date',
      dataIndex: 'plannedDate',
      key: 'plannedDate',
    },
    {
      title: 'Actual Date',
      dataIndex: 'actualDate',
      key: 'actualDate',
    },
  ]

  const handleAddRows = index => {
    // Read from the actual form, not state!
    const term = form.getFieldValue(['paymentTerms', index, 'addpaymentterm']);
    // eslint-disable-next-line no-shadow
    const percentage = form.getFieldValue(['paymentTerms', index, 'addpaymentpercentage']);
    // eslint-disable-next-line no-shadow
    const plannedDate = moment(form.getFieldValue(['paymentTerms', index, 'addpaymentdate'])).format('YYYY-MM-DD')
    console.log(term, percentage, plannedDate, 'term percent plannedate')
    if (!term || !percentage || !plannedDate) {
      message.error('Please fill out all fields');
      return;
    }

    const total = paymentTermRows
      .slice(0, -1)
      .reduce((acc, item) => acc + (parseFloat(item.percentage) || 0), 0) + (parseFloat(percentage) || 0);

    if (total > 100) {
      message.error('Total percentage cannot exceed 100');
      return;
    }

    const newEntry = { term, percentage, plannedDate: moment(plannedDate).format('YYYY-MM-DD') };

    // Add new row at the top, keep input row at bottom
    const existingRows = paymentTermRows.slice(0, -1).filter(r => r.term || r.percentage || moment(r.plannedDate).format('YYYY-MM-DD'));
    const updatedRows = [newEntry, ...existingRows, { ...emptyPaymentTerm }];

    setPaymentTermRows(updatedRows);

    // Clean the input fields for a new entry (bottom row)
    form.setFields([
      { name: ['paymentTerms', index, 'addpaymentterm'], value: '' },
      { name: ['paymentTerms', index, 'addpaymentpercentage'], value: '' },
      { name: ['paymentTerms', index, 'addpaymentdate'], value: null },
    ]);
  };

  const handleRemoveRows = idx => {
    const updatedRows = paymentTermRows.filter((_, i) => i !== idx);
    // Always leave a blank row at the end
    const last = updatedRows.length && updatedRows[updatedRows.length - 1];
    const resultData =
      last && (last.term || last.percentage || last.Date)
        ? [...updatedRows, { ...emptyPaymentTerm }]
        : updatedRows.length ? updatedRows : [{ ...emptyPaymentTerm }];
    setPaymentTermRows(resultData);
  };
  const paymentcolumns = [
    {
      title: 'Payment Term',
      dataIndex: 'term',
      key: 'term',
      render: (text, record, index) =>
        index === paymentTermRows.length - 1 ? (
          <Form.Item
            name={['paymentTerms', index, 'addpaymentterm']}
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Enter a payment term' }]}
          >
            <Input placeholder="Type here..." style={{ width: '200px' }} />
          </Form.Item>
        ) : (
          record.term || '--'
        ),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, record, index) =>
        index === paymentTermRows.length - 1 ? (
          <Form.Item
            name={['paymentTerms', index, 'addpaymentpercentage']}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: 'Enter percentage' },
              // { type: 'number', min: 1, max: 100, message: '1-100 only' },
            ]}
          >
            <Input type="number" placeholder="Type here..." style={{ width: '200px' }} min={1} max={100} />
          </Form.Item>
        ) : (
          record.percentage != null ? `${record.percentage}` : '--'
        ),
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      render: (text, record, index) =>
        index === paymentTermRows.length - 1 ? (
          <Form.Item
            name={['paymentTerms', index, 'addpaymentdate']}
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Select date' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '200px' }}
              placeholder="Select date"
              getPopupContainer={() => document.body}
            />
          </Form.Item>
        ) : record.plannedDate ? (
          moment(record.plannedDate).format('YYYY-MM-DD')
        ) : (
          '--'
        ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: '15%',
      render: (text, record, index) => (
        <Space>
          {index === paymentTermRows.length - 1 && (
            <Button
              icon={<AddIconButton />}
              onClick={e => {
                e.stopPropagation();
                handleAddRows(index);
              }}
            />
          )}
          {index !== paymentTermRows.length - 1 && (
            <RemoveIcon onClick={() => handleRemoveRows(index)} />
          )}
        </Space>
      ),
    },
  ];

  const buildPaymentTermRows = (list = []) => {
  if (!list || list.length === 0) {
    return [{ ...emptyPaymentTerm }];
  }

  return [
    ...list.map(item => ({
      term: item.term || '',
      percentage: item.percentage || '',
      plannedDate: item.plannedDate ? moment(item.plannedDate).format('YYYY-MM-DD') : null,
    })),
    { ...emptyPaymentTerm }, // 👈 always last empty row
  ];
};


  // const normalizedPaymentTermList = paymentTermList.length > 0
  //   ? paymentTermList
  //   : [{
  //     term: '',
  //     percentage: '',
  //     plannedDate: null,   // keep same field name you used in columns
  //   }]

  const popoverContent = useMemo(
    () => (
      <div style={{ width: '800px' }}>
        <Form form={form} layout="vertical">
          <div
            className="custom_antd_Table"
            style={{ width: '100%' }}
            role="presentation"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            onKeyDown={() => { }}
          >
            <Table dataSource={paymentTermRows} columns={paymentcolumns} pagination={false} rowKey={(_, idx) => idx} />
          </div>
        </Form>
      </div>
    ),
    [paymentTermRows, form],
  )
  const AddRequestComponent = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
          {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
          <div>
            <Form form={form} layout="vertical" labelAlign="left">
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
                {/* <Form.Item
                  name="remarks"
                  label={
                    <span>
                      Remarks<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <TextArea type="text" />
                </Form.Item> */}
                <Form.Item
                  name="totalvalue"
                  label={
                    <span>
                      Sales Contribution Value <span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input type="number" />
                </Form.Item>
              </div>
            </Form>
          </div>

          <div style={{ marginTop: '28px' }}>
            <ButtonComponent text="Download Template" type="primary" href={SalesBudgetExcel} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '28px' }}>
            <Upload
              maxCount={1}
              listType="text"
              // onChange={onFileChange}
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            >
              <ButtonComponent icon={<UploadOutlined />} text="Choose File" />
            </Upload>
            {file ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>Selected File : </p>
                <p style={{ fontWeight: 'bold' }}>{file.name}</p>
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: '28px' }}>
            <ButtonComponent
              text="Load"
              type="primary"
              marginright="10px"
              onClick={handleLoad}
              disable={isLoad}
            />
          </div>
          <div style={{ marginTop: '28px' }}>
            <ButtonComponent text="Clear" type="primary" marginright="10px" onClick={handleClear} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Popover
            placement="top"
            trigger="click"
            destroyTooltipOnHide={false}
            open={popoverOpen}
            onOpenChange={visible => setPopoverOpen(visible)}
            content={<div style={{ width: '800px' }}>{popoverContent}</div>}
            ref={popoverRef}
          >
            <Button
              type="primary"
              onClick={() => {
                // if (normalizedPaymentTermList.length === 0 || normalizedPaymentTermList === null) {
                setPaymentTermRows(buildPaymentTermRows(savedPaymentTermList));
                setPopoverOpen(true);
                // }
              }}
            >
              Add Payment Terms
            </Button>
          </Popover>
        </div>
        <Skeleton loading={isLoading} active>
          <Table
            dataSource={isTable ? tableData : []}
            columns={uploadColumns}
            pagination={false}
            scroll={{ x: 1800, y: 300 }}
            sticky
            rowClassName={highlightRow}
            handleChange={FilterChange}
            bordered
          />
        </Skeleton>

        <div style={{ textAlign: 'center' }}>
          <ButtonComponent
            text="Save"
            type="primary"
            onClick={handleSaveFunc}
            disable={isDisable}
          />
        </div>
      </div>
    )
  }

  const disabledFutureDates = current => {
    return current && current > moment().endOf('day')
  }
  const spinnercomp = () => {
    return (
      <div>
        {isDisable ? (
          <Spin>
            <AddRequestComponent />
          </Spin>
        ) : (
          <AddRequestComponent />
        )}
      </div>
    )
  }

  const InitiateProjComponent = () => {
    return (
      <div className="row">
        <div className="col-md-11">
          <Form form={initProj} layout="vertical" labelAlign="left">
            <div className="row">
              <div className="col-md-4" style={{ display: 'none' }}>
                <Form.Item name="dept" label={<span>Department</span>}>
                  <Select
                    placeholder="Select Department"
                    defaultValue="D03"
                    // onChange={option => handleChangeDept(option)}
                    style={{ width: '170px' }}
                    disabled
                  >
                    {/* deptEmp &&
                      deptEmp.map(item => (
                        <Option key={item.departmentCode} value={item.departmentCode}>
                          {item.departmentName}
                        </Option>
                      )) */}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="plandate"
                  label={
                    <span>
                      Project Handover Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <DatePicker
                    style={{ width: '100%', color: 'black !important' }}
                    defaultValue={plannedDate}
                    monthsShown={1}
                    format={dateFormatList}
                    onChange={handlePlannedDate}
                    disabledDate={disabledFutureDates}
                    selectsRange
                    inline
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="duedate"
                  label={
                    <span>
                      Project Delivery Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <DatePicker
                    style={{ width: '100%', color: 'black !important' }}
                    defaultValue={dateval}
                    monthsShown={1}
                    format={dateFormatList}
                    onChange={hanleDateChange}
                    selectsRange
                    inline
                  />
                </Form.Item>
              </div>
              <div className="col-md-2" style={{ marginTop: '25px' }}>
                <Form.Item name="init">
                  <ButtonComponent text="Initiate" type="primary" onClick={handleSaveBtn} />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  const handleChangePercentage = e => {
    // SalesPer.current.value = e.target.value
    setPercentage(e.target.value)
    const finalVal = parseInt(totalvalue, 10) * (parseInt(e.target.value, 10) / 100)
    setPercentage(e.target.value)
    setOfferValue(finalVal + parseInt(totalvalue, 10))
  }
  const handleChangeOffVal = e => {
    const value = e.target.value.toLocaleString('en-IN')
    setOfferValue(value)
  }
  const getInitiateProjService = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        enqId: mstId,
        // enquiryId
      }

      const response = await indentFileUpload({
        requestPath: 'getProjectCreationStatus',
        requestData: keyareaobj,
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseDataMessage !== '0') {
            setInitProjId(response.responseDataMessage)
            // setIsAddProj(false)
          } else {
            setInitProjId(null)
            // setIsAddProj(true)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const getDtlProjService = async e => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        sbDtlId: e,
      }

      const response = await indentFileUpload({
        requestPath: 'getsalebudgetextDtlBySbDtlId',
        requestData: keyareaobj,
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData.length > 0) {
            setDtlProjdata(response.responseData)
          } else {
            setDtlProjdata([])
          }
        } else {
          setDtlProjdata([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleInitiateProj = () => {
    setIsAddProj(true)
  }
  const handlehideisAddProj = () => {
    initProj.resetFields()
    setIsAddProj(false)
  }
  const handlehideDtlProj = () => {
    setDtlProj(false)
    // setDetailTotalValue(null)
    // setfiltersinfos([])
  }
  const handleDetails = rec => {
    getDtlProjService(rec.sbDtlId)
    setDetailsCardVal(rec.sbcDesc)
    setDtlProj(true)
  }

  const DtlProjComponent = () => {
    const [filteringdata, setFilteringData] = useState(dtlProj)

    // const ElementHdr = dtlProj ? dtlProj.map(h => h.elementHdr) : []
    // const ElementDtl = dtlProj ? dtlProj.map(h => h.elementDtl) : []
    // let y = null
    // const distinct = (value, index, self) => self.indexOf(value) === index

    // const filterelementhdr = ElementHdr.filter(distinct)
    // const filterelementdtl = ElementDtl.filter(distinct)

    // const FilterElementHdr = filterelementhdr.map(element => ({
    //   text: element,
    //   value: element,
    // }))
    // const FilterElementDtl = filterelementdtl.map(element => ({
    //   text: element,
    //   value: element,
    // }))
    let filteredData = dtlProj

    const handleSearch = e => {
      filteredData = dtlProj.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(e.target.value.toLowerCase()),
        ),
      )
      setFilteringData(filteredData)
      // y = filteredData.reduce((sum, item) => sum + parseInt(item.totalValue, 10), 0)
    }

    const DtlColumns = [
      {
        title: 'S.No',
        dataIndex: 'sno',
        key: 'sno',
        align: 'right',
        render: (text, record, index) => index + 1,
        width: '5%',
      },
      {
        title: 'Element',
        dataIndex: 'elementHdr',
        key: 'elementHdr',
        // filters: FilterElementHdr,
        // filteredValue: filterinfos.elementHdr,
        // onFilter: (value, record) => record?.elementHdr=== value,
      },
      {
        title: 'Element Desc',
        dataIndex: 'elementDtl',
        key: 'elementDtl',
        // filters: FilterElementDtl,
        // filteredValue: filterinfos.elementDtl,
        // onFilter: (value, record) => record?.elementDtl=== value,
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
        title: 'Critical',
        dataIndex: 'critical',
        key: 'critical',
        render: text => <div>{text !== undefined && text !== '1' ? 'No' : 'Yes'}</div>,
      },
      {
        title: 'Time Line In Weeks',
        dataIndex: 'timelineInWeeks',
        key: 'timelineInWeeks',
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        align: 'right',
        render: text => (
          <div style={{ textAlign: 'right' }}>
            {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
          </div>
        ),
      },
      {
        title: 'Total Value',
        dataIndex: 'totalValue',
        key: 'totalValue',
        align: 'right',
        render: text => (
          <div style={{ textAlign: 'right' }}>
            {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
          </div>
        ),
      },
      {
        title: 'Allocated Value',
        dataIndex: 'allocatedvalue',
        key: 'allocatedvalue',
        align: 'right',
        render: text => (
          <div style={{ textAlign: 'right' }}>
            {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
          </div>
        ),
      },
    ]

    // const UnapprovedColumn = [
    //   {
    //     title: 'S.No',
    //     dataIndex: 'sno',
    //     render: (text, record, index) => index + 1,
    //   },
    //   {
    //     title: 'Document Type ',
    //     dataIndex: 'uploadDocument',
    //     key: 'uploadDocument',
    //   },
    //   {
    //     title: 'Document Name',
    //     dataIndex: 'documentName',
    //     key: 'documentName',
    //   },
    //   {
    //     title: Value ? 'Value(₹)' : 'Remarks',
    //     key: 'remarks',
    //     dataIndex: 'remarks',
    //     render: (text, record) => {
    //       return Value ? (
    //         <span>
    //           {Number(record.remarks).toLocaleString('en-IN', {
    //             style: 'currency',
    //             currency: 'INR',
    //           })}
    //         </span>
    //       ) : (
    //         <span>{record.remarks}</span>
    //       )
    //     },
    //   },

    //   {
    //     title: 'Uploaded On',
    //     key: 'createdDate',
    //     dataIndex: 'createdDate',
    //     render: (text, record) => moment(record.createdDate).format('DD-MMM-YYYY'),
    //   },
    //   {
    //     title: 'Uploaded By',
    //     key: 'createdBy',
    //     dataIndex: 'createdBy',
    //   },
    //   {
    //     title: 'Ver.',
    //     key: 'version',
    //     dataIndex: 'version',
    //     className: 'right-align-cell',
    //   },
    //   {
    //     title: 'Action',
    //     key: 'unApprveaction',
    //     dataIndex: 'unApprveaction',
    //     align: 'center',
    //     // eslint-disable-next-line no-unused-vars
    //     render: (text, record, index) => {
    //       return <h1>text</h1>
    //     }
    //   }
    // ];

    // const detiltotal = filteredData.reduce((sum, item) => sum + parseInt(item.totalValue, 10), 0)
    // setDetailTotalValue(detiltotal)

    const totalValue = filteringdata.reduce((sum, item) => sum + parseInt(item.totalValue, 10), 0)

    return (
      <div>
        <Input.Search
          style={{ margin: '0 0 10px 0', width: '30%', float: 'right' }}
          placeholder="Search here..."
          enterButton
          // onSearch={handleSearch}
          onChange={e => handleSearch(e)}
        />
        <Table
          columns={DtlColumns}
          dataSource={filteringdata}
          page={false}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [filteringdata?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          // onChange={(pagination, filters, sorter, extra) => {
          //   console.log(pagination, filters, sorter, extra)
          //   if (extra && extra.currentDataSource) {
          //     y = extra.currentDataSource.reduce(
          //       (sum, item) => sum + parseInt(item.totalValue, 10),
          //       0,
          //     )
          //   }
          // }}
          footer={() => (
            <div style={{ fontSize: '16px', marginLeft: '32px' }}>
              <span>Grand Total : {parseFloat(totalValue).toLocaleString('en-IN')}</span>
            </div>
          )}
        />
      </div>
    )
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ marginRight: '10px' }}>
          {isEditable === '0' && initProjId === null ? (
            <Button type="primary" onClick={handleInitiateProj}>
              Project Handover
            </Button>
          ) : isEditable === '1' || initProjId === null ? (
            ''
          ) : isEditable === '0' && initProjId !== null ? (
            <strong>Project Initiated on {moment(initProjId).format('DD-MMM-YYYY')}</strong>
          ) : (
            ''
          )}
        </div>
        <div style={{ marginRight: '10px' }}>
          {isEditable === '1' ? (
            <Button type="primary" onClick={handleAddDoc}>
              Add Change Request
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h5 style={{ margin: 0 }}>Change Request Sheet</h5>
      </div>
      {(paymentTermRows.length > 0 || savedPaymentTermList.length > 0) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-mid',
            marginBottom: '16px',
            marginLeft: '1030px',
          }}
        >
          <Button type="primary" onClick={() => setViewModalOpen(true)}>
            View Payment Terms
          </Button>
        </div>
      )}
      <div className="row" style={{ display: 'flex' }}>
        <div className="col-lg-8">
          <Table
            columns={columns}
            dataSource={retrivaldata}
            page={false}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [retrivaldata?.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
            scroll={{ y: 400 }}
          />
        </div>
        <div className="col-lg-4">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p htmlFor="totalBudgetInput">Total Change Request Value {Menulistdata[0].currency}</p>
            <InputComponent
              id="totalBudgetInput"
              width="250px"
              value={
                totalCrvalue &&
                totalCrvalue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
              disabled="true"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <p>Contribution Value</p>
            <Input
              type="text"
              // ref={SalesPer}
              // value={SalesPer?.current?.value}
              value={
                percentage &&
                percentage.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
              style={{ width: '250px' }}
              onBlur={handleChangePercentage}
              disabled
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <p>Offer Value {Menulistdata[0].currency}</p>
            <Input
              type="text"
              value={
                offerValuetxt &&
                offerValuetxt.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              }
              style={{ width: '250px' }}
              onBlur={handleChangeOffVal}
              disabled="true"
            />
          </div>
          <div style={{ display: 'none', justifyContent: 'space-between', marginTop: '15px' }}>
            <p htmlFor="paymentTermsInput" style={{ margin: '5px 10px', alignSelf: 'flex-end' }}>
              Remarks
            </p>
            <TextArea
              id="paymentTermsInput"
              style={{ marginLeft: 'auto', width: '250px' }}
              value={paymentterm}
              onChange={getPaymentTerms}
              rows={3}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="my-3">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h5>Change Request Details</h5>
        </div>
        <Table columns={crColumns} dataSource={crResp} />
      </div>

      <div style={{ marginTop: '10px' }}>
        {/* <ApproveOrRejectButton
          refId={slaveId}
          refDoctTyp={docTypeCode}
          tenId={tenantid}
          btnShow="true"
          isEditableBtn={isEditable}
          submitFunction={handleSubmitBtn}
          saveButtonStatus="null"
          componentToRender="sales"
          getReferenceIdVal={getReferenceIdVal}
          saveButtonStatusVal="1"
        /> */}
        <EnquiryValidationCommon
          componenttoRender="sales"
          saveButtonStatus="1"
          type="Sales"
          insertfunc={handleSubmitBtn}
          uploadDocType="DC076"
        // crTableDisplay={crTableDisplay}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'none',
        }}
      >
        <ButtonComponent text="Submit" type="primary" marginright="10px" />
      </div>
      <ModalPopup
        text="Upload Change Request Template"
        isModalVisible={isAddModal}
        onCancel={handlehideAddModal}
        FieldsComponent={spinnercomp}
        width={1500}
      />
      <Modal
        title="Payment Terms"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        <Table
          dataSource={savedPaymentTermList}
          columns={paymentTermCol}
          pagination={false}
          rowKey={(record, index) => index}
        />
      </Modal>
      <ModalPopup
        text="Project Hand Over"
        isModalVisible={isAddProj}
        onCancel={handlehideisAddProj}
        FieldsComponent={InitiateProjComponent}
        width={750}
      />
      <ModalPopup
        text={`${detailsCardVal} - Budget Sheet Detail`}
        isModalVisible={isDtlProj}
        onCancel={handlehideDtlProj}
        FieldsComponent={DtlProjComponent}
        width={1400}
      />
    </div>
  )
}
export default ChangeRequestTab
