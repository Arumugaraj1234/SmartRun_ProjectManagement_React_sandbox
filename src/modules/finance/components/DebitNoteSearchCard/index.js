import React, { useState, useEffect } from 'react'
import { Form, Select, Card, Button, message, Table, Input } from 'antd'
import { CommentOutlined, PlusCircleOutlined } from '@ant-design/icons'
// import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
// import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import './style.scss'
import messageReturn from '_helpers/messageReturn'
import Popuptable from 'components/shared/PopuptableComponent'
import TableComponent from 'components/common/TableComponent'
import TextArea from 'antd/lib/input/TextArea'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import DebitNoteDetailCard from '../DebitNoteDetailCard'

const { Option } = Select
const DebitNoteSearchCardComp = () => {
  let defaultfilterData = {}
  const history = useHistory()
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      dnCode: [history?.location?.state?.record?.refCode],
    }
  }
  const [pONoDtlVal, setPONoDtlVal] = useState([])
  const [detailResp, setDetailResp] = useState([])
  const [poTable, setPoTable] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [popupresp, setPopupResp] = useState([])
  const [popupRespPre, setPopupRespPre] = useState([])
  const [popupGrnDtl, setPopupGrnDtl] = useState([])
  // const [isApproval, setIsApproval] = useState(true)
  const [docuLifeMst, setDocuLifeMst] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  // const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [prevRemarksCard, setPrevRemarksCard] = useState(false)
  const [dnCancelCard, setDnCancelCard] = useState(false)
  const [apprvlRemarksCard, setApprvlRemarksCard] = useState(false)
  // const [isEditable, setIsEditable] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [btnDisplay, setBtnDisplay] = useState(true)
  // const [praId, setPraId] = useState('')
  const [dnId, setDnId] = useState('')
  // const [records, setRecords] = useState([])
  const [currSeq, setCurrSeq] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const [sequenceDesc, setSequenceDesc] = useState('')
  const [cancelSeq, setCancelSeq] = useState('')
  // const [cancelSeqDesc, setCancelSeqDesc] = useState('')
  const [isLast, setIsLast] = useState('')
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const [form] = Form.useForm()
  const [inputForm] = Form.useForm()
  const [fieldForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  // const tab = store.get('Tab')
  const Menulistdata = store.get('MenuListData')
  const projectIds = store.get('ProjectID')
  const employeeId = store.get('employeeId')
  const [searchText, setSearchText] = useState('')
  // const enqId = store.get('EnquiryId')

  const onHandleSubmit = () => {
    getDetailData()
  }

  useEffect(() => {
    getPONoDetailList()
    form.setFieldsValue({
      PONo: 'GetAll',
    })
    getDetailData()
  }, [])
  useEffect(() => {
    console.log('dn sts detail resp', popupRespPre)
  }, [popupRespPre])

  const addprevRemarksSubmit = () => {
    setPrevRemarksCard(true)
  }
  const dnCancelSubmit = () => {
    setDnCancelCard(true)
  }
  const addApprvlRemarksSubmit = () => {
    setApprvlRemarksCard(true)
  }
  const getDetailData = async () => {
    const formData = form.getFieldsValue()
    setTableLoading(true)
    setIsLoading(true)
    const response = await indentFileUpload({
      requestPath: 'retrieveDebitNote',
      //   requestPath: 'retrievePRA',
      requestData: {
        pmHdrId: projectIds,
        poId: formData.PONo,
        docTypeCode: 'DC083',
        empId: employeeId,
        tenantId,
      },
    })
    if (response) {
      if (response.responseData) {
        setDetailResp(response?.responseData || [])
        console.log('checking the respooo', response)
        setPopupRespPre(response?.responseData[0]?.debitNoteStatus || 0)
      }
    }
    setTableLoading(false)
  }
  // const downloadreport = async data => {
  //   console.log(data)
  //   const reqdata = {
  //     dnId: data.dnId,
  //     tenantId,
  //   }
  //   const response = await indentFileUpload({
  //     requestPath: 'getDnReportByDnId',
  //     requestData: reqdata,
  //   })

  //   if (response.responseCode === '200') {
  //     if (response?.responseData[0]?.fileContent !== null) {
  //       const link = document.createElement('a')
  //       link.href = `data:application/octet-stream;base64,${response?.responseData[0]?.fileContent}`
  //       link.download = response?.fileName
  //       link.click()
  //       messageReturn(210)
  //     } else {
  //       messageReturn(606)
  //     }
  //   }
  // }
  const getPONoDetailList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByDateAndPoId',
      requestData: {
        tenantId,
        fromDate: '',
        toDate: '',
        indentId: '',
        projectId: projectIds,
      },
    })

    setPONoDtlVal(response?.responseData || [])
  }

  const removeCommas = value => {
    return value.replace(/,/g, '')
  }

  const saveData = async () => {
    if (
      ['invoiceDate', 'retention', 'ld', 'tds', 'amountPayable'].every(field =>
        fieldForm.getFieldValue(field),
      )
    ) {
      const formData = fieldForm.getFieldsValue()
      const response = await indentFileUpload({
        requestPath: 'InsertPRA',
        requestData: {
          // invoiceNumber: formData.invoiceNumber,
          invoiceDate: moment(formData.invoiceDate).format('YYYY-MM-DD'),
          transportValue: formData.transportValue,
          pfValue: formData.pfValue,
          insuranceValue: formData.insuranceValue,
          otherValue: formData.otherValue,
          tds: formData.tds,
          amountPayable: Number(removeCommas(formData.amountPayable)),
          remarks: formData.remarks,
          retention: formData.retention,
          ld: formData.ld,
          others: formData.others,
          dnId,
          tenantId,
          empId: employeeId,
        },
      })

      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        handleCancelDtlsBtnInward()
        getDetailData()
      } else {
        message.error(response.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const updateDetails = async () => {
    const formvalue = inputForm.getFieldValue()
    console.log(formvalue.remarks, 'remarks')
    // if (
    //   [
    //     'invoiceDate',
    //     // 'invoiceNumber',
    //     'tds',
    //     // 'approvalDropdown',
    //     'remarks',
    //     'amountPayable',
    //   ].every(field => fieldForm.getFieldValue(field))
    // ) {
    await indentFileUpload({
      requestPath: 'updateDebitNoteHdr',
      // requestPath: '',
      requestData: {
        dnId,
        seq: currSeq,
        seqStatus: sequenceDesc,
        isLast,
        tenantId,
        empId: employeeId,
        remarks: formvalue.remarks,
      },
    })

    // saveData()
    setPrevRemarksCard(false)
    setApprvlRemarksCard(false)
    handleCancelDtlsBtnInward()
    getDetailData()
    // } else {
    //   messageReturn(405)
    // }
  }
  const updateDetailsForPrevSeq = async () => {
    const formvalue = inputForm.getFieldValue()
    console.log(formvalue.remarks, 'remarks')
    // if (
    //   [
    //     'invoiceDate',
    //     // 'invoiceNumber',
    //     'tds',
    //     // 'approvalDropdown',
    //     'remarks',
    //     'amountPayable',
    //   ].every(field => fieldForm.getFieldValue(field))
    // ) {
    await indentFileUpload({
      requestPath: 'updateDebitNoteHdr',
      // requestPath: '',
      requestData: {
        dnId,
        seq: currSeq,
        seqStatus: sequenceDesc,
        isLast,
        tenantId,
        empId: employeeId,
        remarks: formvalue.remarks,
      },
    })

    // saveData()
    setPrevRemarksCard(false)
    // setApprvlRemarksCard(false)
    handleCancelDtlsBtnInward()
    getDetailData()
    // } else {
    //   messageReturn(405)
    // }
  }

  const handleDetail = async data => {
    try {
      // Assuming these are state setters from useState
      // setRecords(data)
      console.log('After clicking detail action', data)
      setPopupResp(data)
      setPoTable(data.poDtlEntity)
      setPopupGrnDtl(data.grnDtlsEntity)
      // Handling isApproval
      // if (data.isApproval !== null && data.isApproval.toLowerCase() === 'true') {
      //   setIsApproval(false)
      // } else {
      //   setIsApproval(true)
      // }

      // Handling docStatusMst
      if (data.docStatusMst !== null && data.docStatusMst.length > 0) {
        setBtnDisplay(true)
        // Assuming docStatusMst is an array, setting individual state values
        setCurrSeq(data.docStatusMst[0].currSequence)
        setSequenceDesc(data.docStatusMst[0].docStatus)
        setIsLast(data.docStatusMst[0].lastSeq)
        // setIsEditable(data.docStatusMst[0].isEditable)
        setCancelSeq(data.docStatusMst[0].cancelSeq)
        // setCancelSeqDesc(data.docStatusMst[0].cancelStatusCode)
        setDocuLifeMst(data.docStatusMst) // Setting entire array to state
      } else {
        setBtnDisplay(false)
        setCurrSeq(null)
        setCancelSeq(null)
        setSequenceDesc(null)
        setIsLast(null)
        setDocuLifeMst([])
      }

      // Setting form fields
      fieldForm.setFieldsValue({
        invoiceNumber: data.invoiceNumber,
        transportValue: data.transportValue,
        pfValue: data.pfValue,
        insuranceValue: data.insuranceValue,
        otherValue: data.otherValue,
        remarks: data.remarks,
        tds: data.tds,
        retention: data.retention,
        ld: data.ld,
        others: data.others,
        amountPayable:
          data.amountPayable !== null && data.amountPayable !== ''
            ? Number(data.amountPayable).toLocaleString('en-IN', {
                currency: 'INR',
              })
            : '',
        invoiceDate: data.invoiceDate !== null ? moment(data.invoiceDate) : null,
      })

      // Setting dnId
      setDnId(data.dnId)
      setDnId(data.dnId)
      setPopupRespPre(data.debitNoteStatus)
      setCurrentStatus(data.seqDesc)

      // Fetching additional data
      setShowDtlTablLoading(true)
      // const response = await indentFileUpload({
      //   requestPath: 'getPraDtl',
      //   requestData: {
      //     dnId: data.dnId,
      //     tenantId,
      //     empId: employeeId,
      //   },
      // })

      // Handling response
      // console.log(response, 'response for PRA')
      // setCurrentStatus(response?.responseData[0].statusDesc)
      // setRmkDetaillist(response?.responseData[0].praStatusList)
      // setPopupResp(response?.responseData || [])
      // setPopupRespPre(response?.responseData[0].debitNoteStatus || [])
      // setPopupGrnDtl(response?.responseData[0].grnDtl || [])
      // handleOrderValue(response?.responseData || [])
      // setSequenceDesc(response?.responseData[0].docStatusMst[0]?.docStatus)
    } catch (error) {
      console.error('Error in handleDetail:', error)
    }
  }
  const remarksColumns = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status Description',
      dataIndex: 'seqDesc',
      key: 'seqDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'empName',
      key: 'empName',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const OpenDetailCard = () => {
    setdetailCard(true)
  }
  const handleCancel = () => {
    setIsLoading(false)
    fieldForm.resetFields()
  }

  const handleCancelDtlsBtnInward = () => {
    setShowDtlTablLoading(false)
    fieldForm.resetFields()
  }

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      // const dateSp = dateStringval.split('-');
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  const dnCode1 = []
  const statusDesc1 = []
  const poCode1 = []
  const poType1 = []
  const vendorName1 = []
  const poDate1 = []
  const revisionDate1 = []
  // const vendorName1=[]

  detailResp.map(h => {
    return dnCode1.push(h.dnCode)
  })
  detailResp.map(h => {
    return poDate1.push(h.poDate)
  })
  detailResp.map(h => {
    return poCode1.push(h.poCode)
  })
  detailResp.map(h => {
    return vendorName1.push(h.vendorName)
  })
  detailResp.map(h => {
    return revisionDate1.push(h.revisionDate)
  })
  detailResp.map(h => {
    return statusDesc1.push(h.seqDesc)
  })
  // detailResp.map(h => {
  //   return vendorName1.push(h.vendorName)
  // })
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }
  const dnCode2 = dnCode1.filter(distinct)
  const statusDesc2 = statusDesc1.filter(distinct)
  const poCode2 = poCode1.filter(distinct)
  const poType2 = poType1.filter(distinct)
  const vendorName2 = vendorName1.filter(distinct)
  const poDate2 = poDate1.filter(distinct)
  const revisionDate2 = revisionDate1.filter(distinct)
  // const vendorName2=vendorName1.filter(distinct)

  const dnCode3 = []
  const poDate3 = []
  const poCode3 = []
  const poType3 = []
  const vendorName3 = []
  const statusDesc3 = []
  const revisionDate3 = []
  // const vendorName3=[]

  vendorName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      vendorName3.push({
        text: element,
        value: element,
      }),
    )

  dnCode2.map(element => {
    return dnCode3.push({
      text: element,
      value: element,
    })
  })
  poCode2
    .sort((a, b) => {
      const numA = parseInt(a.split('/').pop(), 10)
      const numB = parseInt(b.split('/').pop(), 10)
      return numA - numB
    })
    .map(element => {
      return poCode3.push({
        text: element,
        value: element,
      })
    })
  poType2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return poType3.push({
        text: element,
        value: element,
      })
    })
  // vendorName2.map(element => {
  //   return vendorName3.push({
  //     text: element,
  //     value: element,
  //   })
  // })
  statusDesc2
    .filter(e => e != null && e !== '')
    .map(e => (typeof e === 'string' ? e.trim() : e))
    .sort((a, b) =>
      String(a).localeCompare(String(b), undefined, {
        sensitivity: 'base',
      }),
    )
    .forEach(element => {
      statusDesc3.push({
        text: element,
        value: element,
      })
    })
  poDate2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return poDate3.push({
        text: dateformatter(element),
        value: element,
      })
    })
  revisionDate2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return revisionDate3.push({
        text: dateformatter(element),
        value: element,
      })
    })
  const searchedData = detailResp.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })
  const columns = [
    {
      title: 'SI. No.',
      // dataIndex: 'dnCode',
      key: 'index',
      width: '7%',
      filters: dnCode3,
      filteredValue: filtersinfo.dnCode,
      onFilter: (value, record) => record?.dnCode === value,
      render: (text, record, index) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{index + 1}</span>,
      }),
    },
    // {
    //   title: 'Project Number',
    //   dataIndex: 'projectCode',
    //   key: 'projectCode',
    //   width: '15%',
    //   render: (text, record) => ({
    //     props: {
    //       style: {
    //         backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
    //       },
    //     },
    //     children: <span>{text}</span>,
    //   }),
    // },
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: poCode3,
      filteredValue: filtersinfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{text}</span>,
      }),
    },
    {
      title: 'PO Type',
      dataIndex: 'poTypeText',
      key: 'poTypeText',
      // render: (text, record) => (record.poType === '1' ? 'Local' : 'Import'),
      // filters: poType3,
      // filteredValue: filtersinfo.poType || null,
      // onFilter: (value, record) => record?.poType === value,
      render: (text, record) => {
        return record.poType === '1'
          ? 'Domestic'
          : record.poType === '2'
          ? 'Import'
          : record.poType === '3'
          ? 'Service'
          : ''
      },
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '15%',
      filters: vendorName3,
      filteredValue: filtersinfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>{record.poDate !== null && record.vendorName !== '' ? record.vendorName : ''}</span>
        ),
      }),
    },
    {
      title: 'PO Value',
      dataIndex: 'poValue',
      key: 'poValue',
      width: '20%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{text}</span>,
      }),
    },
    // {
    //   title: 'Vendor Name',
    //   dataIndex: 'vendorName',
    //   key: 'vendorName',
    //   filters: vendorName3,
    //   filteredValue: filtersinfo.vendorName,
    //   onFilter: (value, record) => record?.vendorName === value,
    // },
    {
      title: 'Debit Note Value',
      dataIndex: 'dnValue',
      key: 'dnValue',
      width: '12%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{record.dnValue}</span>,
      }),
      // filters: revisionDate3,
      // filteredValue: filtersinfo.revisionDate,
      // onFilter: (value, record) => record?.revisionDate === value,
    },
    {
      title: 'Status',
      dataIndex: 'seqDesc',
      key: 'seqDesc',
      width: '7%',
      filters: statusDesc3,
      filteredValue: filtersinfo.statusDesc,
      onFilter: (value, record) => record?.seqDesc === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{text}</span>,
      }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '6%',
      render: (text, record) => (
        <div style={{ align: 'center', display: 'flex' }}>
          <div style={{ align: 'center', display: 'flex', marginRight: '9px' }}>
            <Button type="primary" onClick={() => handleDetail(record)}>
              Detail
            </Button>
          </div>
          {/* <div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadreport(record)}
            />
          </div> */}
        </div>
      ),
    },
  ]

  const handleCancelButton = () => {
    setShowDtlTablLoading(false)
  }

  // const handleOrderValue = param => {
  //   const formData = fieldForm.getFieldsValue()

  //   fieldForm.setFieldsValue({
  //     tds: getFormattedValue(formData.tds),
  //   })
  //   const tds = Number(formData.tds)
  //   // const orderValue = Number(popupresp[0].orderValue)
  //   const invValue =
  //     param.length > 0 ? Number(param[0].amountPayable) : Number(popupresp[0].amountPayable)
  //   // Check if tds is a valid number and within range
  //   if (Number.isNaN(tds) || tds < 0 || tds > 100) {
  //     fieldForm.setFieldsValue({
  //       amountPayable: 0,
  //       tds: '',
  //     })
  //     messageReturn(636)

  //     return
  //   }

  //   const percentage = (tds / 100) * invValue

  //   // const formattedPercentage = percentage.toLocaleString('en-IN')
  //   const returnData = Number(percentage) + Number(invValue)

  //   // Set amountPayable field in form

  //   fieldForm.setFieldsValue({
  //     amountPayable: returnData.toLocaleString('en-IN'),
  //   })
  // }

  // const getFormattedValue = value => {
  //   if (!value) {
  //     return 0
  //   }
  //   const inputValue = value.replace(/[^\d.]/g, '')
  //   const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
  //   const formattedValue = parsedValue.toLocaleString('en-IN', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   })
  //   return formattedValue
  // }

  // const onFinish = () => {
  //   updateDetails()
  // }
  // disabled={isApproval} it is form disable code
  const disabled =
    popupresp.length > 0
      ? popupresp[0].isCompleted === '1' || popupresp[0].isEditable === '0'
      : false

  const GRNDtl = [
    {
      title: 'GRN No',
      dataIndex: 'grnNo',
      key: 'grnNo',
      width: '10%',
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      key: 'grnDate',
      width: '10%',
    },
    {
      title: 'GRN Qty',
      dataIndex: 'grnQty',
      key: 'grnQty',
      width: '10%',
    },
  ]

  const PreviousPRA = [
    {
      title: 'S.No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: 'Part Number',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => (
        <a
          role="button"
          tabIndex="0"
          // onClick={() => downloaddrawn(record)}
          // onKeyDown={e => {
          //   if (e.key === 'Enter') {
          //     downloaddrawn(record)
          //   }
          // }}
          // style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {record?.indentDtlList[0]?.productCode || ''}
        </a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record.indentDtlList[0]?.description}</div>,
    },
    {
      title: 'Specification',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record.indentDtlList[0]?.specification}</div>,
    },
    {
      title: <span> HSN code</span>,
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      // render: (text, record, index) => (
      //   <Form.Item name={`hsnCode_${record.poDtlId}`} initialValue={record.hsnCode}>
      //     <AutoComplete
      //       style={{ width: '150px' }}
      //       options={hsnCode}
      //       onChange={e => {
      //         poform.setFieldsValue({
      //           [`hsnCode_${record.poDtlId}`]: e,
      //         })
      //       }}
      //       maxLength={8}
      //       onSelect={(e, value) => {
      //         if (value.length > 8) {
      //           poform.setFieldsValue({
      //             [`hsnCode_${record.poDtlId}`]: '',
      //           })
      //           messageReturn(677)
      //         }
      //       }}
      //       onClick={() => handleHSNCode(record)}
      //     >
      //       <Input
      //         placeholder="Select here"
      //         style={Potablechanged('hsnCode', index) ? HighlightStyle : {}}
      //       />
      //     </AutoComplete>
      //   </Form.Item>
      // ),
    },
    {
      title: 'GST',
      dataIndex: 'poGst',
      key: 'poGst',
      render: (text, record) => <div>{record.poGst}</div>,
    },

    {
      title: 'Make',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record.indentDtlList[0]?.make}</div>,
    },
    {
      title: 'Mass(Kgs)',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      className: 'right-align-cell',
      render: (text, record) => <div>{record.indentDtlList[0].weight}</div>,
    },
    {
      title: 'Material',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record.indentDtlList[0]?.material}</div>,
    },

    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        const numericValue = parseFloat(record?.qty)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.indentDtlList[0].qty
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uomCode',
      key: 'uomCode',
      render: (text, record) => {
        const numericValue = parseFloat(record.indentDtlList[0]?.uomDesc)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.indentDtlList[0].uomDesc
      },
    },
    // {
    //   title: 'Delivery Date',
    //   dataIndex: 'deliveryDate',
    //   key: 'deliveryDate',
    //   render: (text, record, index) => (
    //     <Form.Item
    //       name={`deliverydate_${record.poDtlId}`}
    //       initialValue={
    //         record.deliveryDate
    //           ? moment(record.deliveryDate)
    //           : moment(poform.getFieldValue('deliveryDate'))
    //       }
    //     >
    //       <DatePicker
    //         format="DD-MMM-YYYY"
    //         disabledDate={current => current >= moment(poform.getFieldValue('deliveryDate'))}
    //         style={Potablechanged('deliveryDate', index) ? HighlightStyle : {}}
    //       />
    //     </Form.Item>
    //   ),
    // },
    {
      title: `Unit Rate ${Menulistdata[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },
    {
      title: `Total Value ${Menulistdata[0].currency}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },
  ]

  const DetailsTableComponent = () => {
    return (
      <Form form={fieldForm} layout="vertical">
        <div className="container-fluid">
          {/* First Row */}

          {/* <div className="row"> */}
          <div className="row address">
            <div className="col-md-4">
              <h5>SUPPLIER ADDRESS</h5>
              {popupresp.vendorName}
              <br />
              {popupresp.vendorAddressLine}
              <br />
              {popupresp.vendorCity}
              <br />
              {popupresp.vendorPincode}
              <br />
              {popupresp.vendorState}
              <br />
              GST No. : {popupresp.vendorGst}
              <br />
              {popupresp.vendorContactNo}
            </div>
            <div className="col-md-4">
              <h5>BUYER / BILLING ADDRESS </h5>
              {popupresp.billingName}
              <br />
              {popupresp.billingAddressLine}
              <br />
              {popupresp.billingCity}
              <br />
              {popupresp.billingPincode}
              <br />
              {popupresp.billingState}
              <br />
              GST No. : {popupresp.billingGst}
              <br />
              {popupresp.billingContactNo}
            </div>
            <div className="col-md-4">
              <h5>SHIPPING ADDRESS </h5>
              {popupresp.deliveryName}
              <br />
              {popupresp.deliveryAddressLine}
              <br />
              {popupresp.deliveryCity}
              <br />
              {popupresp.deliveryPincode}
              <br />
              {popupresp.deliveryState}
              <br />
              GST No. : {popupresp.deliveryGst}
              <br />
              {popupresp.deliveryContactno}
            </div>
          </div>
          {/* </div> */}

          {/* Second Row */}
          <div className="row">
            {/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? moment(popupresp[0].poDate).format('DD-MMM-YYYY') : ''}
              </p>
            </div> */}

            {/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Revision Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? moment(popupresp[0].revisionDate).format('DD-MMM-YYYY')
                  : ''}
              </p>
            </div> */}

            {/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Type</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp?.[0]?.poType === '1'
                  ? 'Domestic'
                  : popupresp?.[0]?.poType === '2'
                  ? 'Import'
                  : popupresp?.[0]?.poType === '3'
                  ? 'Service'
                  : ''} */}
            {/* {(() => {
                  switch (popupresp[0].poType) {
                    case '1':
                      return 'Local';
                    case '2':
                      return 'Import';
                    case '3':
                      return 'Service';
                    default:
                      return '';
                  }
                })()} */}
            {/* </p>
            </div> */}
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="invoiceNumber"
                label={
                  <span>
                    Invoice Number<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="number" disabled={disabled} />
              </Form.Item>
            </div> */}
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Invoice Number</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 && popupresp[0].invoiceNumber !== ''
                  ? popupresp[0].invoiceNumber
                  : '-'}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Type Of Payment</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].typeOfPayment : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Payment Terms</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].paymentTerms : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>PO Cost Type</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 && popupresp[0].poCostType !== ''
                  ? popupresp[0].poCostType
                  : '-'}
              </p>
            </div> */}
            {/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Vendor Name</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].vendorName : ''}
              </p>
            </div> */}
          </div>

          {/* third Row */}
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div>
                <h6>PO Details - items</h6>
              </div>
              <div>
                <Table
                  columns={PreviousPRA}
                  className="tableheight"
                  dataSource={poTable}
                  pagination={false}
                  // scroll={{ y: 150 }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div>
                <br />
                <Table
                  columns={GRNDtl}
                  className="tableheight"
                  dataSource={popupGrnDtl}
                  pagination={false}
                  // scroll={{ y: 150 }}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <br />
              <div className="row">
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Project No</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.projectCode}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Project Name</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.projectName}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Vendor Name</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.vendorName}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Vendor Code</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.vendorCode}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>PO NO</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.poCode}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Debit Note Reason</p>
                  <p style={{ fontWeight: 'bold' }}>{popupresp.reason}</p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Debit Note Value</p>
                  <p style={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(popupresp.dnValue))}
                  </p>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>Debit Note File</p>
                  <DownloadDocuments
                    // isPdf={record.isPdf}
                    refid={popupresp?.dmId}
                    tenanrId={tenantId}
                    fileDocode="FC015"
                    docTypeCode="DC083"
                  />
                </div>
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                  <p>PO Value</p>
                  <p style={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(popupresp.poValue))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* fourth Row */}
          <div className="row">
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>PRA Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].dnValue).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div> */}

            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="invoiceNumber"
                label={
                  <span>
                    Invoice Number<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="number" disabled={disabled} />
              </Form.Item>
            </div>
             */}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold' }}> Current Status : </span> {currentStatus}
            </h6>
          </div>
          {/* Button Row */}
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}
          >
            {docuLifeMst.length > 0 && (
              <Form.Item name="approvalDropdown">
                <Select
                  // style={{ width: '150px', display: btnDisplay ? 'block' : 'none' }}
                  style={{ width: '150px', display: 'none' }}
                  dropdownStyle={{ textAlign: 'left' }}
                  onChange={handleDropdownChange}
                  value={selectedOption}
                  placeholder="Select"
                >
                  {docuLifeMst.map(option => (
                    <Option key={option.currSequence} value={option.currSequence}>
                      {option.nextSeqStatusDesc !== null ? option.nextSeqStatusDesc : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {docuLifeMst.length > 0 && (
              <Button
                type="primary"
                style={{ display: btnDisplay ? 'block' : 'none' }}
                onClick={() => addApprvlRemarksSubmit()}
                // htmlType="submit"
              >
                {docuLifeMst[0].nextSeqStatusDesc}
              </Button>
            )}
            <Popuptable
              onClose={() => setApprvlRemarksCard(false)}
              cardLabel=""
              component={AddRemarksApprvlComponent(
                docuLifeMst && docuLifeMst.length > 0 ? docuLifeMst[0].cancelSeq : '',
              )}
              visible={apprvlRemarksCard}
            />
            <ButtonComponent
              type="primary"
              icon={<CommentOutlined />}
              onClick={() => {
                OpenDetailCard()
              }}
            />
            <Popuptable
              onClose={() => setdetailCard(false)}
              cardLabel=""
              component={
                <div className="custom_antd_Table" style={{ width: isMobile ? '280px' : '500px' }}>
                  {' '}
                  <TableComponent data={popupRespPre} columns={remarksColumns} scrollY={300} />
                </div>
              }
              visible={detailCard}
            />
            <Button
              type="primary"
              disabled={disabled}
              style={{
                display: 'none',
              }}
              // style={{
              //   display:
              //     popupresp.length > 0
              //       ? popupresp[0].isCompleted === '1' || popupresp[0].isEditable === '0'
              //         ? 'none'
              //         : 'block'
              //       : 'block',
              // }}
              onClick={saveData}
            >
              Save
            </Button>
            <Button type="primary" disabled={false} onClick={handleCancelButton}>
              Cancel
            </Button>

            <Button
              type="danger"
              // style={{ display: btnDisplay ? 'block' : 'none' }}
              style={{ display: 'none' }}
              htmlType="submit"
              onClick={() => dnCancelSubmit()}
            >
              Debit Note Cancel
            </Button>
            <Popuptable
              onClose={() => setDnCancelCard(false)}
              cardLabel=""
              component={AddRemarksDnCancelComponent(
                docuLifeMst && docuLifeMst.length > 0 ? docuLifeMst[0].cancelSeq : '',
              )}
              visible={dnCancelCard}
            />
            {docuLifeMst.length > 0 && docuLifeMst?.[0]?.cancelSeq && (
              <Button
                type="danger"
                style={{ display: btnDisplay ? 'block' : 'none' }}
                htmlType="submit"
                onClick={() => addprevRemarksSubmit()}
              >
                Previous Stage
              </Button>
            )}
            <Popuptable
              onClose={() => setPrevRemarksCard(false)}
              cardLabel=""
              component={AddRemarksprevComponent(
                docuLifeMst && docuLifeMst.length > 0 ? docuLifeMst[0].cancelSeq : '',
              )}
              visible={prevRemarksCard}
            />
          </div>
        </div>
      </Form>
    )
  }

  const AddRemarksApprvlComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  // disable={isdisablebtn}
                  onClick={() => updateDetails()}
                  // onClick={() => console.log(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const AddRemarksprevComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  // disable={isdisablebtn}
                  onClick={() => updateDetailsForPrevSeq()}
                  // onClick={() => console.log(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const AddRemarksDnCancelComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  // disable={isdisablebtn}
                  onClick={() => handleDnCancel(cancelSeq)}
                  // onClick={() => console.log(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // const handleDnRev = async cancelSequence => {
  //   // const insertCheck = await handleinsert()

  //   const formvalue = inputForm.getFieldValue()
  //   console.log(formvalue.remarks, 'remarks')
  //   const props = {
  //     seq: cancelSequence,
  //     seqDesc: cancelSeqDesc,
  //     islast: isLast,
  //     tenantId,
  //     dnId,
  //     pmHdrId: projectIds,
  //     processCode: tab.processCode,
  //     enqId,
  //     dnCode: records.dnCode,
  //     poNo: records.poId,
  //     empId: employeeId,
  //     remarks: formvalue.remarks,
  //   }
  //   // if (insertCheck) {
  //   const httpapprovals = await indentFileUpload({
  //     requestPath: 'udpatePraHdrSeq',
  //     requestData: props,
  //   })

  //   if (httpapprovals.responseCode === '200') {
  //     // onmodalCancel()
  //     // setApproveRemarksCard(false)
  //     // setPrevRemarksCard(false)
  //     handleCancelDtlsBtnInward()
  //     getDetailData()
  //   } else {
  //     message.error(httpapprovals.responseMessage)
  //   }
  //   // }
  // }

  const handleDnCancel = async () => {
    const props = {
      tenantId,
      dnId,
      poId: popupresp[0].poId,
    }
    // if (insertCheck) {
    const httpapprovals = await indentFileUpload({
      requestPath: 'praCancel',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      // onmodalCancel()
      // setApproveRemarksCard(false)
      setDnCancelCard(false)
      handleCancelDtlsBtnInward()
      getDetailData()
    } else {
      message.error(httpapprovals.responseMessage)
    }
  }
  const handleDropdownChange = param => {
    setSelectedOption(param)
  }

  return (
    <>
      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <Card
            title="Debit Note"
            extra={
              <PlusCircleOutlined style={{ fontSize: '20px', color: 'white', display: 'none' }} />
            }
          >
            <Form form={form} layout="horizontal" labelAlign="left" onFinish={onHandleSubmit}>
              <div className="row">
                {/* <div
                  className="col-xs-12 col-sm-12 col-md-3 col-lg-3"
                  style={{ marginBottom: '10px' }}
                >
                  <Form.Item
                    name="projectId"
                    label={
                      <span>
                        Project<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select a project',
                      },
                    ]}
                  >
                    <Select
                      onChange={getPONOlist}
                      placeholder="Select Project"
                      style={{ width: '100%' }}
                    >
                      <Select.Option key="getAll" value="getAll">
                        Get All
                      </Select.Option>
                      {projectList?.map(item => (
                        <Select.Option key={item.projectId} value={item.projectId}>
                          {item.projectCode}-{item.customerName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div> */}

                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <Form.Item
                    name="PONo"
                    label={
                      <span>
                        PO No.<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                  >
                    <Select placeholder="Select PO No." style={{ width: '320px' }}>
                      <Select.Option key="getAll" value="getAll">
                        Get All
                      </Select.Option>
                      {pONoDtlVal?.map(item => (
                        <Select.Option key={item.poId} value={item.poId}>
                          {item.poCode}-{item.vendorCode}-{item.vendorName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                    Submit
                  </Button>
                  <Button type="primary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </div>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Input.Search
                placeholder="Search..."
                allowClear
                enterButton
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 450 }}
              />
            </div>
            <DebitNoteDetailCard
              resp={searchedData}
              isLoading={isLoading}
              tableLoading={tableLoading}
              columns={columns}
              onChange={handleChange}
            />
          </Card>
        </div>
      </div>

      <ModalPopup
        text="Debit Note Detail View"
        isModalVisible={showDtlTablLoading}
        onCancel={handleCancelDtlsBtnInward}
        FieldsComponent={DetailsTableComponent}
        width={1450}
      />
    </>
  )
}
export default DebitNoteSearchCardComp
