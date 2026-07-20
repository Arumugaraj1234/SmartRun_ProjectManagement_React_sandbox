import React, { useState, useEffect, useRef } from 'react'
import { Form, Select, Card, Button, Input, message, Table } from 'antd'
import { CommentOutlined, PlusCircleOutlined, DownloadOutlined } from '@ant-design/icons'
// import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import PRADetailCard from 'modules/finance/components/PRADetailCard'
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

const { Option } = Select
const PRASearchCardComp = () => {
  let defaultfilterData = {}
  const history = useHistory()
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      praCode: [history?.location?.state?.record?.refCode],
    }
  }
  const [pONoDtlVal, setPONoDtlVal] = useState([])
  const [detailResp, setDetailResp] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [popupresp, setPopupResp] = useState([])
  const [popupRespPre, setPopupRespPre] = useState([])
  const [popupGrnDtl, setPopupGrnDtl] = useState([])
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const latestPraIdRef = useRef(null)
  // const [isApproval, setIsApproval] = useState(true)
  const [docuLifeMst, setDocuLifeMst] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [prevRemarksCard, setPrevRemarksCard] = useState(false)
  const [praCancelCard, setPraCancelCard] = useState(false)
  const [apprvlRemarksCard, setApprvlRemarksCard] = useState(false)

  // const [isEditable, setIsEditable] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [btnDisplay, setBtnDisplay] = useState(true)
  const [praCancelBtn, setPraCancelBtn] = useState(false)
  const [praId, setPraId] = useState('')
  const [records, setRecords] = useState([])
  const [currSeq, setCurrSeq] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const [sequenceDesc, setSequenceDesc] = useState('')
  const [cancelSeq, setCancelSeq] = useState('')
  const [cancelSeqDesc, setCancelSeqDesc] = useState('')
  // const [clrValues, setClrValues] = useState('')
  const [isLast, setIsLast] = useState('')
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const [form] = Form.useForm()
  const [inputForm] = Form.useForm()
  const [fieldForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  const tab = store.get('Tab')
  const Menulistdata = store.get('MenuListData')
  const projectIds = store.get('ProjectID')
  const employeeId = store.get('employeeId')
  const enqId = store.get('EnquiryId')
  const [searchText, setSearchText] = useState('')

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

  const addprevRemarksSubmit = () => {
    setPrevRemarksCard(true)
  }
  const praCancelSubmit = () => {
    setPraCancelCard(true)
  }
  const addApprvlRemarksSubmit = () => {
    setApprvlRemarksCard(true)
  }
  const getDetailData = async () => {
    const formData = form.getFieldsValue()
    setTableLoading(true)
    setIsLoading(true)
    const response = await indentFileUpload({
      requestPath: 'retrievePRA',
      requestData: {
        pmHdrId: projectIds,
        poId: formData.PONo,
        docTypeCode: 'DC077',
        empId: employeeId,
        tenantId,
      },
    })
    setDetailResp(response?.responseData || [])
    setTableLoading(false)
  }
  const downloadreport = async data => {
    console.log(data)
    const reqdata = {
      praId: data.praId,
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getPraReportByPraId',
      requestData: reqdata,
    })

    if (response.responseCode === '200') {
      if (response?.responseData[0]?.fileContent !== null) {
        const link = document.createElement('a')
        link.href = `data:application/octet-stream;base64,${response?.responseData[0]?.fileContent}`
        link.download = response?.fileName
        link.click()
        messageReturn(210)
      } else {
        messageReturn(606)
      }
    }
  }
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
    console.log(fieldForm.getFieldsValue())
    if (isSaving) {
      return
    }
    if (
      ['retention', 'ld', 'tds', 'amountPayable'].every(
        field =>
          fieldForm.getFieldValue(field) !== undefined && fieldForm.getFieldValue(field) !== null,
      )
    ) {
      const formData = fieldForm.getFieldsValue()
      setIsSaving(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'InsertPRA',
          requestData: {
            invoiceDate: popupresp?.[0]?.invoiceDate,
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
            praId,
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
      } finally {
        setIsSaving(false)
      }
    } else {
      messageReturn(405)
    }
  }

  const updateDetails = async () => {
    const formvalue = inputForm.getFieldValue()
    console.log(formvalue.remarks, 'remarks')
    if (
      [
        // 'invoiceDate',
        // 'invoiceNumber',
        'tds',
        // 'approvalDropdown',
        'remarks',
        'amountPayable',
      ].every(field => fieldForm.getFieldValue(field))
    ) {
      await indentFileUpload({
        requestPath: 'udpatePraHdrSeq',
        requestData: {
          seq: currSeq,
          seqDesc: sequenceDesc,
          islast: isLast,
          tenantId,
          praId,
          pmHdrId: projectIds,
          processCode: tab.processCode,
          enqId,
          praCode: records.praCode,
          poNo: records.poId,
          empId: employeeId,
          remarks: formvalue.remarks,
        },
      })

      saveData()
      setApprvlRemarksCard(false)
      getDetailData()
    } else {
      messageReturn(405)
    }
  }

  const handleDetail = async data => {
    // Tag this click so a slower, earlier request can't overwrite a newer one when it resolves later
    latestPraIdRef.current = data.praId
    setPopupResp([])
    setIsDetailLoading(true)
    try {
      // Assuming these are state setters from useState
      setRecords(data)
      console.log('PRA data', data)
      // Handling isApproval
      // if (data.isApproval !== null && data.isApproval.toLowerCase() === 'true') {
      //   setIsApproval(false)
      // } else {
      //   setIsApproval(true)
      // }

      // Handling docStatusMst
      console.log('PRA detail', data.statusDesc, data.statusDesc !== 'PRA Closed')
      if (data.docStatusMst === null && data.statusDesc !== 'PRA Closed') {
        setPraCancelBtn(true)
      }
      if (data.docStatusMst !== null && data.docStatusMst.length > 0) {
        setBtnDisplay(true)
        // Assuming docStatusMst is an array, setting individual state values
        setCurrSeq(data.docStatusMst[0].currSequence)
        setSequenceDesc(data.docStatusMst[0].docStatus)
        setIsLast(data.docStatusMst[0].lastSeq)
        // setIsEditable(data.docStatusMst[0].isEditable)
        setCancelSeq(data.docStatusMst[0].cancelSeq)
        console.log(
          'PRA doc status for cancel',
          data.docStatusMst[0].cancelSeq !== '',
          data.docStatusMst[0].currSequence !== '4',
        )
        if (
          data.docStatusMst[0] == null ||
          (data.docStatusMst[0].cancelSeq !== '' && data.docStatusMst[0].currSequence !== '3')
        ) {
          setPraCancelBtn(true)
          console.log('pra cancel logic button')
        }
        setCancelSeqDesc(data.docStatusMst[0].cancelStatusCode)
        setDocuLifeMst(data.docStatusMst) // Setting entire array to state
      } else {
        setBtnDisplay(false)
        setCurrSeq(null)
        setSequenceDesc(null)
        setIsLast(null)
        setDocuLifeMst([])
      }

      // A cancelled PRA has no further lifecycle to advance through — hide the
      // "Purchase approved"/next-stage button regardless of what docStatusMst says
      if (data.isLatest === '0') {
        setBtnDisplay(false)
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
        // invoiceDate: data.invoiceDate !== null ? moment(data.invoiceDate) : '-',
        invoiceDate: data.invoiceDate ? moment(data.invoiceDate).format('YYYY-MM-DD') : '-',
      })
      // Setting praId
      setPraId(data.praId)

      // Fetching additional data
      setShowDtlTablLoading(true)
      const response = await indentFileUpload({
        requestPath: 'getPraDtl',
        requestData: {
          praId: data.praId,
          tenantId, // Assuming tenantId is defined in your scope
          empId: employeeId,
        },
      })

      // Handling response
      console.log(response, 'response for PRA')
      if (latestPraIdRef.current !== data.praId) {
        // A newer PRA was opened while this request was still in flight — discard this stale response
        return
      }
      setCurrentStatus(response?.responseData[0].statusDesc)
      setRmkDetaillist(response?.responseData[0].praStatusList)
      setPopupResp(response?.responseData || [])
      setPopupRespPre(response?.responseData[0].getPraDtl || [])
      setPopupGrnDtl(response?.responseData[0].grnDtl || [])
      handleOrderValue(response?.responseData || [])
      setSequenceDesc(response?.responseData[0].docStatusMst[0]?.docStatus)
    } catch (error) {
      console.error('Error in handleDetail:', error)
    } finally {
      if (latestPraIdRef.current === data.praId) {
        setIsDetailLoading(false)
      }
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
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
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

  const praCode1 = []
  const statusDesc1 = []
  const poCode1 = []
  const vendorName1 = []
  const poDate1 = []
  const revisionDate1 = []
  // const vendorName1=[]

  detailResp.map(h => {
    return praCode1.push(h.praCode)
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
    return statusDesc1.push(h.isLatest === '0' ? 'PRA Cancelled' : h.statusDesc)
  })
  // detailResp.map(h => {
  //   return vendorName1.push(h.vendorName)
  // })
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }
  const praCode2 = praCode1.filter(distinct)
  const statusDesc2 = statusDesc1.filter(distinct)
  const poCode2 = poCode1.filter(distinct)
  const vendorName2 = vendorName1.filter(distinct)
  const poDate2 = poDate1.filter(distinct)
  const revisionDate2 = revisionDate1.filter(distinct)
  // const vendorName2=vendorName1.filter(distinct)

  const praCode3 = []
  const poDate3 = []
  const poCode3 = []
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

  praCode2.map(element => {
    return praCode3.push({
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
      title: 'PRA No.',
      dataIndex: 'praCode',
      key: 'praCode',
      width: '7%',
      filters: praCode3,
      filteredValue: filtersinfo.praCode,
      onFilter: (value, record) => record?.praCode === value,
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
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: '7%',
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
      title: 'PO Date',
      dataIndex: 'poDate',
      key: 'poDate',
      width: '6%',
      filters: poDate3,
      filteredValue: filtersinfo.poDate,
      onFilter: (value, record) => record?.poDate === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>
            {record.poDate !== null && record.poDate !== ''
              ? moment(record.poDate).format('DD-MMM-YYYY')
              : ''}
          </span>
        ),
      }),
    },
    {
      title: 'PO Revision',
      dataIndex: 'revision',
      key: 'revision',
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
      title: 'Revision Date',
      dataIndex: 'revisionDate',
      key: 'revisionDate',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>
            {record.revisionDate !== null && record.revisionDate !== ''
              ? moment(record.revisionDate).format('DD-MMM-YYYY')
              : ''}
          </span>
        ),
      }),
      filters: revisionDate3,
      filteredValue: filtersinfo.revisionDate,
      onFilter: (value, record) => record?.revisionDate === value,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '7%',
      filters: vendorName3,
      filteredValue: filtersinfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
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
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: '7%',
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
      title: 'PO Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>
            {Number(text).toLocaleString('en-IN', {
              currency: 'INR',
            })}
          </span>
        ),
      }),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{text !== null ? moment(text).format('DD-MMM-YYYY') : ''}</span>,
      }),
    },
    {
      title: 'Invoice No.',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <span>{text !== null ? text : ''}</span>,
      }),
    },
    {
      title: `Amount  ${Menulistdata[0].currency}`,
      dataIndex: 'invoiceValue',
      key: 'invoiceValue',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>
            {Number(text).toLocaleString('en-IN', {
              currency: 'INR',
            })}
          </span>
        ),
      }),
    },
    {
      title: `Amount Payable  ${Menulistdata[0].currency}`,
      dataIndex: 'amountPayable',
      key: 'amountPayable',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>
            {Number(text).toLocaleString('en-IN', {
              currency: 'INR',
            })}
          </span>
        ),
      }),
    },
    {
      title: 'Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: '7%',
      filters: statusDesc3,
      filteredValue: filtersinfo.statusDesc,
      onFilter: (value, record) =>
        (record?.isLatest === '0' ? 'PRA Cancelled' : record?.statusDesc) === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: (
          <span>{record.isLatest === '0' ? 'PRA Cancelled' : text !== null ? text : ''}</span>
        ),
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
          {record.isLatest !== '0' && (
            <div>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => downloadreport(record)}
              />
            </div>
          )}
        </div>
      ),
    },
  ]

  const handleCancelButton = () => {
    setShowDtlTablLoading(false)
  }

  const handleOrderValue = param => {
    const formData = fieldForm.getFieldsValue()

    fieldForm.setFieldsValue({
      tds: getFormattedValue(formData.tds),
      retention: getFormattedValue(formData.retention),
      ld: getFormattedValue(formData.ld),
      others: getFormattedValue(formData.others),
    })
    const tds = Number(formData.tds) || 0
    const retention = Number(formData.retention) || 0
    const ld = Number(formData.ld) || 0
    const others = Number(formData.others) || 0

    const invValue =
      param?.length > 0
        ? Number(param[0]?.amountPayable || 0) +
          Number(param[0]?.retention || 0) +
          Number(param[0]?.ld || 0)
        : Number(popupresp[0]?.amountPayable || 0) +
          Number(popupresp[0]?.retention || 0) +
          Number(popupresp[0]?.ld || 0)

    if (Number.isNaN(tds) || tds < 0 || tds > 100) {
      fieldForm.setFieldsValue({
        amountPayable: 0,
        tds: '',
      })
      messageReturn(636)
      return
    }
    const tdsDeduction = (tds / 100) * invValue
    const returnData =
      // Number(popupresp[0].praGst) +
      // Number(popupresp[0].otherValue) +
      // Number(popupresp[0].transportValue) +
      // Number(popupresp[0].pfValue) +
      // Number(popupresp[0].insuranceValue) +
      invValue - (tdsDeduction + retention + ld + others)
    const safeReturnData = returnData < 0 ? 0 : returnData
    fieldForm.setFieldsValue({
      amountPayable: safeReturnData.toLocaleString('en-IN'),
    })
  }

  const getFormattedValue = value => {
    if (!value) {
      return 0
    }
    const inputValue = value.replace(/[^\d.]/g, '')
    const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
    const formattedValue = parsedValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formattedValue
  }

  const onFinish = () => {
    updateDetails()
  }
  // disabled={isApproval} it is form disable code
  const disabled =
    isDetailLoading || popupresp.length === 0
      ? true
      : popupresp[0].isCompleted === '1' ||
        popupresp[0].isEditable === '0' ||
        popupresp[0].isLatest === '0'

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
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: '10%',
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: '10%',
    },
  ]

  const PreviousPRA = [
    {
      title: 'PRA No',
      dataIndex: 'praNum',
      key: 'praNum',
      width: '15%',
    },
    {
      title: 'PRA Status',
      dataIndex: 'praStatusDesc',
      key: 'praStatusDesc',
      width: '30%',
    },
    {
      title: `PRA Amount ${Menulistdata[0].currency}`,
      dataIndex: 'praValue',
      key: 'praValue',
      align: 'right',
      width: '30%',
      render: text =>
        Number(text).toLocaleString('en-IN', {
          currency: 'INR',
        }),
    },
  ]

  const DetailsTableComponent = () => {
    return (
      <Form form={fieldForm} onFinish={onFinish} layout="vertical">
        <div className="container-fluid">
          {/* First Row */}

          <div className="row">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Project No</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].projectCode : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Project Name</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].projectName : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PRA No</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].praCode : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PRA Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? moment(popupresp[0].praDate).format('DD-MMM-YYYY') : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Vendor Name</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].vendorName : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Status</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? popupresp[0].isLatest === '0'
                    ? 'PRA Cancelled'
                    : popupresp[0].statusDesc
                  : ''}
              </p>
            </div>
          </div>

          {/* Second Row */}
          <div className="row">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO NO</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].poCode : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? moment(popupresp[0].poDate).format('DD-MMM-YYYY') : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Due Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? moment(popupresp[0].dueDate).format('DD-MMM-YYYY') : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Revision</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].revision : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Revision Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? moment(popupresp[0].revisionDate).format('DD-MMM-YYYY')
                  : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Qty</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(popupresp[0].poQty))
                  : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].poValue).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>PO Description</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp?.[0]?.poType === '1'
                  ? 'Domestic'
                  : popupresp?.[0]?.poType === '2'
                  ? 'Import'
                  : popupresp?.[0]?.poType === '3'
                  ? 'Service'
                  : ''}
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
              </p>
            </div>
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
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
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
            </div>
            {/* <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <p>Vendor Name</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 ? popupresp[0].vendorName : ''}
              </p>
            </div> */}
          </div>

          {/* third Row */}
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div>
                <br />
                <Table
                  columns={GRNDtl}
                  className="tableheight"
                  dataSource={popupGrnDtl}
                  pagination={false}
                  scroll={{ y: 150 }}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div>
                <h6>Previous PRA Details - items</h6>
              </div>
              <div>
                <Table
                  columns={PreviousPRA}
                  className="tableheight"
                  dataSource={popupRespPre}
                  pagination={false}
                  scroll={{ y: 150 }}
                />
              </div>
            </div>
          </div>

          {/* fourth Row */}
          <div className="row">
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>PRA Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].praValue).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div> */}
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="invoiceDate"
                label={
                  <span>
                    Invoice Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <DatePicker
                  format="DD-MMM-YYYY"
                  disabledDate={current => current >= moment(new Date())}
                  disabled={disabled}
                  style={{ color: 'black !important' }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Invoice Date</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 && popupresp[0].invoiceDate
                  ? moment(popupresp[0].invoiceDate).isValid()
                    ? moment(popupresp[0].invoiceDate).format('DD-MMM-YYYY')
                    : '-'
                  : '-'}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Invoice Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].invoiceValue).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>GST Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].praGst).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Sub Total</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].basicTotal).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Tax Value</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].gst).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Total</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].orderValue).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
          </div>

          {/* fifth Row */}

          <div className="row">
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>PO Cost Type</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0 && popupresp[0].poCostType !== ''
                  ? popupresp[0].poCostType
                  : '-'}
              </p>
            </div> */}
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="transportValue" label={<span>Transport Charge</span>}>
                <Input
                  type="number"
                  disabled={disabled}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Transport Charge</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(
                      popupresp[0].transportValue !== '' ? popupresp[0].transportValue : '-',
                    ).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="pfValue" label={<span>P&F</span>}>
                <Input
                  type="number"
                  disabled={disabled}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>P&F</p>
              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(popupresp[0].pfValue !== '' ? popupresp[0].pfValue : '-').toLocaleString(
                      'en-IN',
                      {
                        style: 'currency',
                        currency: 'INR',
                      },
                    )
                  : ''}
              </p>
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="insuranceValue" label={<span>Insurance Charge</span>}>
                <Input
                  type="number"
                  disabled={disabled}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Insurance Charge</p>

              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(
                      popupresp[0].insuranceValue !== '' ? popupresp[0].insuranceValue : '-',
                    ).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="otherValue" label={<span>Other Charge</span>}>
                <Input
                  type="number"
                  disabled={disabled}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <p>Others</p>

              <p style={{ fontWeight: 'bold' }}>
                {popupresp.length > 0
                  ? Number(
                      popupresp[0].otherValue !== '' ? popupresp[0].otherValue : '-',
                    ).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                  : ''}
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="tds"
                label={
                  <span>
                    TDS<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input onChange={handleOrderValue} disabled={disabled} maxLength={3} />
              </Form.Item>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="amountPayable"
                label={
                  <span>
                    Amount Payable<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="retention" label={<span>Retention</span>}>
                <Input
                  disabled={disabled}
                  onChange={handleOrderValue}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="ld"
                label={
                  <span>
                    LD<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input
                  disabled={disabled}
                  onChange={handleOrderValue}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div>
            {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="others"
                label={
                  <span>
                    Others<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input
                  type="number"
                  disabled={disabled}
                  onKeyPress={event => {
                    if (event.key === '.' || event.key === 'e' || event.key === '-') {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="remarks"
                label={
                  <span>
                    Remarks<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input.TextArea rows={4} disabled={disabled} />
              </Form.Item>
            </div>
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
              <span style={{ fontWeight: 'bold' }}> Current Status : </span>{' '}
              {popupresp[0]?.isLatest === '0' ? 'PRA Cancelled' : currentStatus}
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
                  <TableComponent data={rmkDetaillist} columns={remarksColumns} scrollY={300} />
                </div>
              }
              visible={detailCard}
            />
            <Button
              type="primary"
              disabled={disabled || isSaving}
              style={{
                display:
                  isDetailLoading || popupresp.length === 0
                    ? 'none'
                    : popupresp[0].isCompleted === '1' ||
                      popupresp[0].isEditable === '0' ||
                      popupresp[0].isLatest === '0'
                    ? 'none'
                    : 'block',
              }}
              onClick={saveData}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button type="primary" disabled={false} onClick={handleCancelButton}>
              Cancel
            </Button>

            <Button
              type="danger"
              style={{
                display:
                  praCancelBtn && !isDetailLoading && popupresp[0]?.isLatest !== '0'
                    ? 'block'
                    : 'none',
              }}
              htmlType="submit"
              onClick={() => praCancelSubmit()}
            >
              PRA Cancel
            </Button>
            <Popuptable
              onClose={() => setPraCancelCard(false)}
              cardLabel=""
              component={AddRemarksPraCancelComponent(
                docuLifeMst && docuLifeMst.length > 0 ? docuLifeMst[0].cancelSeq : '',
              )}
              visible={praCancelCard}
            />
            {docuLifeMst.length > 0 && docuLifeMst?.[0]?.cancelSeq && (
              <Button
                type="danger"
                style={{ display: btnDisplay ? 'none' : 'none' }}
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
                  onClick={() => handlePraRev(cancelSeq)}
                  // onClick={() => console.log(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const AddRemarksPraCancelComponent = () => {
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
                  onClick={() => handlePraCancel(cancelSeq)}
                  // onClick={() => console.log(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const handlePraRev = async cancelSequence => {
    // const insertCheck = await handleinsert()

    const formvalue = inputForm.getFieldValue()
    console.log(formvalue.remarks, 'remarks')
    const props = {
      seq: cancelSequence,
      seqDesc: cancelSeqDesc,
      islast: isLast,
      tenantId,
      praId,
      pmHdrId: projectIds,
      processCode: tab.processCode,
      enqId,
      praCode: records.praCode,
      poNo: records.poId,
      empId: employeeId,
      remarks: formvalue.remarks,
    }
    // if (insertCheck) {
    const httpapprovals = await indentFileUpload({
      requestPath: 'udpatePraHdrSeq',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      // onmodalCancel()
      // setApproveRemarksCard(false)
      setPrevRemarksCard(false)
      handleCancelDtlsBtnInward()
      getDetailData()
    } else {
      message.error(httpapprovals.responseMessage)
    }
    // }
  }

  const handlePraCancel = async () => {
    const props = {
      tenantId,
      praId,
      poId: popupresp[0]?.poId,
      empId: employeeId,
    }
    // if (insertCheck) {
    const httpapprovals = await indentFileUpload({
      requestPath: 'praCancel',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      // onmodalCancel()
      // setApproveRemarksCard(false)
      setPraCancelCard(false)
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
            title="PRA"
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
            <PRADetailCard
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
        text="PRA Detail View"
        isModalVisible={showDtlTablLoading}
        onCancel={handleCancelDtlsBtnInward}
        FieldsComponent={DetailsTableComponent}
        width={1450}
      />
    </>
  )
}
export default PRASearchCardComp
