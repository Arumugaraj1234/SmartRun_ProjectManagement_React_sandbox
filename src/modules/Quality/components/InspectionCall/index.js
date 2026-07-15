import React, { useState, useEffect } from 'react'
import { Button, message, Popover, Input } from 'antd'
import { ImportOutlined, CheckOutlined, CloseOutlined, FileExcelOutlined } from '@ant-design/icons'
import store from 'store'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
// import TableComponent from 'components/common/TableComponent'
import { Table } from 'ant-table-extensions'
import ButtonComponent from 'components/shared/ButtonComponent'
import InspectionReportService from 'services/Quality/InspectionReport'
import ApproveOrReject from 'components/common/ApproveRejectBtnComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import QualityReportComponet from '../QualityReportComponent'
import currentDateTime from '../../../../currentDateTime'

// import './style.scss'

const InspectionCall = () => {
  let defaultfilterData = {}
  const history = useHistory()
  if (history?.location?.state?.record?.refCode) {
    const splitText = history?.location?.state?.record?.refCode.split('-')
    defaultfilterData = {
      poCode: [splitText[0]],
      // "productDesc": [splitText[1]]
    }
  }
  console.log(defaultfilterData)
  const [onloadtable, setOnloadtable] = useState([])
  const [tableData, setTableData] = useState([])

  const [indenthdrid, setIndenthdrid] = useState(undefined)
  const [qinsId, setQinsId] = useState(undefined)
  const [poId, setPoId] = useState(undefined)
  const [requestDate, setRequestDate] = useState('')
  const [qcinsvisible, setQcinsvisible] = useState(false)
  const [openindex, setOpenindex] = useState('')
  const [materialStaging, setMaterialStaging] = useState(false)
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [QCBtn, setQCBtn] = useState(false)
  const [cancelpopoverVisible, setcancelPopoverVisible] = useState(false)
  const [showStaging, setShowStaging] = useState(false)
  const [loading, setLoading] = useState(false)
  const Tab = store.get('Tab')
  const QtyHdrId = store.get('QtyHdrId')
  const { docTypeCode, slaveId, processCode } = Tab
  const ProjectID = store.get('ProjectID')
  const Enquiry = store.get('Enquiry')
  const tenantId = store.get('tenantId')
  const employeID = store.get('employeeId')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const [filtersInfo, setfilterinfo] = useState(defaultfilterData)

  useEffect(() => {
    getOnloadtabledata()
    getOnloadStaging()
    getAssignTeamStatus()
    updateTailView()
  }, [])

  useEffect(() => {
    console.log(filtersInfo)
  }, [filtersInfo])

  const getOnloadtabledata = async () => {
    setLoading(true)
    const props = {
      projectId: ProjectID,
      tenantId,
      empId: employeID,
      pmId: processCode,
    }
    const httpget = await InspectionReportService({
      requestPath: 'retrieveQualitInspectionReq',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      const updatedData = httpget.responseData.map(item => {
        return {
          ...item,
          inspectionReqDate: item.inspectionReqDate
            ? moment(item.inspectionReqDate).format('DD-MMM-YYYY')
            : '',
          inspectionReqDate2: item.inspectionReqDate,
        }
      })
      // updatedData.sort((a, b) => {
      //   const getLastNumber = (code) => {
      //     const parts = code.split('/');
      //     return parseInt(parts[parts.length - 1], 10) || 0;
      //   };
      //   return getLastNumber(a.poCode) - getLastNumber(b.poCode);
      // });

      setOnloadtable(updatedData)
      setTableData(updatedData)
    } else {
      message.error(httpget.responseMessage)
    }
    setLoading(false)
    setQCBtn(false)
  }

  const getAssignTeamStatus = async () => {
    const props = {
      referenceId: QtyHdrId,
      referenceDoc: Tab.processCode,
      employeeID: employeID,
      tenantId,
    }
    const response = await InspectionReportService({
      requestPath: 'getProcessAssignedTeam',
      requestData: props,
    })

    if (response) {
      setShowStaging(response?.assignTeam)
    }
  }

  const getOnloadStaging = async () => {
    const props = {
      isQc: '1',
      tenantId,
      hdrId: QtyHdrId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'retriveIsStagingStatus',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setMaterialStaging(httpget.responseDataMessage)
    }
  }

  const openInsdetails = (record, index) => {
    setIndenthdrid(record.indentDtlId)
    setQinsId(record.qiId)
    setPoId(record.poId)
    setQcinsvisible(true)
    setRequestDate(record.inspectionReqDate2)
    setOpenindex(index)
  }

  const handlesumit = () => {
    if (false) {
      window.location.reload()
    }
  }

  const renderQcInsComponent = () => {
    return (
      <QualityReportComponet
        hdrId={qinsId}
        poId={poId}
        IndenthdrId={indenthdrid}
        requestDate={requestDate}
        onmodalCancel={() => {
          setQcinsvisible(false)
          getOnloadtabledata()
        }}
      />
    )
  }

  const POCode = onloadtable ? onloadtable.map(h => h.poCode) : []
  const ProductCode = onloadtable ? onloadtable.map(h => h.productCode) : []
  const RequestFrom = onloadtable ? onloadtable.map(h => h.reqFrom) : []
  // const UOM = onloadtable ? onloadtable.map(h => h.uom) : []
  const qtyInspect = onloadtable ? onloadtable.map(h => h.qtyToBeInspected) : []
  // const inspectQty = onloadtable ? onloadtable.map(h => h.inspectQty) : []
  const okCount = onloadtable ? onloadtable.map(h => h.okCount) : []
  const condCount = onloadtable ? onloadtable.map(h => h.conditionalCnt) : []
  const rejectCount = onloadtable ? onloadtable.map(h => h.rejectedCount) : []
  const reworkCount = onloadtable ? onloadtable.map(h => h.reworkCount) : []
  const insReqBy = onloadtable ? onloadtable.map(h => h.inspectionReqBy) : []
  const vendorName = onloadtable ? onloadtable.map(h => h.vendorName) : []
  const insReqDate = onloadtable ? onloadtable.map(h => h.inspectionReqDate) : []
  const insDate = onloadtable ? onloadtable.map(h => h.inspectedDate) : []
  const inspecStatus = onloadtable ? onloadtable.map(h => h.inspectionStatus) : []
  const inspectedBy1 = onloadtable ? onloadtable.map(h => h.inspectedBy) : []
  const nrFlag1 = onloadtable ? onloadtable.map(h => h.nrFlag) : []

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const getLastNumber = code => {
    const parts = code.split('/')
    return parseInt(parts[parts.length - 1], 10) || 0
  }

  const filterPOCode = POCode.filter(distinct)
  const filterProdcode = ProductCode.filter(distinct)
  const filterRequestFrom = RequestFrom.filter(distinct)
  // const filteruom = UOM.filter(distinct)
  const filterqtyInspect = qtyInspect.filter(distinct)
  // const filterinspectqty = inspectQty.filter(distinct)
  const filterokcnt = okCount.filter(distinct)
  const filtercondCount = condCount.filter(distinct)
  const filterRejCount = rejectCount.filter(distinct)
  const filterreworkCnt = reworkCount.filter(distinct)
  const filtervendor = vendorName.filter(distinct)
  const filterinsReqBy = insReqBy.filter(distinct)
  const filterinsReqdate = insReqDate.filter(distinct)
  const filterinsDate = insDate.filter(distinct)
  const filterinspStatus = inspecStatus.filter(distinct)
  const inspectedBy2 = inspectedBy1.filter(distinct)
  const nrFlag2 = nrFlag1.filter(distinct)

  const FilterPOCode = filterPOCode
    .sort((a, b) => getLastNumber(a) - getLastNumber(b))
    .map(element => ({
      text: element,
      value: element,
    }))

  // Product codes lexicographically
  const FilterProdCode = filterProdcode
    .sort((a, b) => a?.localeCompare(b))
    .map(element => ({
      text: element,
      value: element,
    }))

  // Other filters (no sorting needed unless required)
  const sortAsc = (a, b) => a?.localeCompare(b)

  const FilterRequestFrom = filterRequestFrom.sort(sortAsc).map(e => ({ text: e, value: e }))

  const FilterQtyInspect = filterqtyInspect.sort((a, b) => a - b).map(e => ({ text: e, value: e }))

  const FilterOkcnt = filterokcnt.sort((a, b) => a - b).map(e => ({ text: e, value: e }))

  const FilterCondCount = filtercondCount.sort((a, b) => a - b).map(e => ({ text: e, value: e }))

  const FilterRejCount = filterRejCount.sort((a, b) => a - b).map(e => ({ text: e, value: e }))

  const FilterReworkCnt = filterreworkCnt.sort((a, b) => a - b).map(e => ({ text: e, value: e }))

  const FilterVendorName = filtervendor.sort(sortAsc).map(e => ({ text: e, value: e }))

  const FilterInsReqBy = filterinsReqBy.sort(sortAsc).map(e => ({ text: e, value: e }))

  const FilterInsReqDate = filterinsReqdate
    .sort((a, b) => new Date(a) - new Date(b))
    .map(e => ({ text: e, value: e }))

  const FilterInsDate = filterinsDate
    .sort((a, b) => new Date(a) - new Date(b))
    .map(e => ({
      text: new Date(e).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      value: e,
    }))

  const FilterInspStatus = filterinspStatus.sort(sortAsc).map(e => ({ text: e, value: e }))

  // Special case: inspectedBy
  const inspectedBy3 = inspectedBy2.map(e => ({ text: e, value: e }))

  // Special case: nrFlag
  const nrFlag3 = nrFlag2.map(e => ({
    text: e === '1' ? 'QC Not req' : '',
    value: e === '1' ? '1' : '0',
  }))

  const FilterChange = (pag, filters) => {
    setfilterinfo(filters)
  }

  const handleNotRequired = record => {
    // handleQCInsapproval(record)
    handleinsertfunction(record)
  }

  const handleCancelRequired = record => {
    handleselectedfunction(record)
  }

  const handleQCInsapproval = async record => {
    const props = {
      currentseq: '2',
      tenantId,
      empId: employeID,
      hdrId: record.qiHdrId,
      remarks: '',
      nrFlag: '1',
      cancelFlag: '0',
      pmId: processCode,
      qHdrId: QtyHdrId,
      poId: record?.poId,
      pmHdrId: ProjectID,
      qualityHdrId: QtyHdrId,
    }
    const httpapprovals = await InspectionReportService({
      requestPath: 'updateQISeqAndStatus',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      updateTailView()
      getOnloadtabledata()
    }
  }

  const handleSelectedQCInsapproval = async record => {
    const props = {
      currentseq: '3',
      tenantId,
      empId: employeID,
      hdrId: record.qiHdrId,
      remarks: '',
      cancelFlag: '1',
      nrFlag: '0',
      pmId: processCode,
      qHdrId: QtyHdrId,
      poId: record?.poId,
      pmHdrId: ProjectID,
      qualityHdrId: QtyHdrId,
    }
    const httpapprovals = await InspectionReportService({
      requestPath: 'updateQISeqAndStatus',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      updateTailView()
      getOnloadtabledata()
    }
  }

  const handleinsertfunction = async record => {
    setLoading(true)
    const newInsert = {
      caInternal: 0,
      caVendor: 0,
      configName: '',
      docLifeCycleMstList: [],
      dtlList: [],
      empId: employeID,
      inspectedBy: employeID,
      inspectedOn: moment().format('YYYY-MM-DD'),
      inspectionQty: record?.qtyToBeInspected,
      inspectionType: '',
      okQty: 0,
      pmHdrId: ProjectID,
      qiHdrId: '',
      qiId: record.qiId,
      qicCreatedBy: employeID,
      qicCreatedOn: '',
      qicHdrId: '',
      qicName: '',
      vendorCode: record?.vendorCode,
      qualityRating: 0,
      qualityRefNo: '',
      drawingNo: record?.productCode,
      rejectedExternal: 0,
      rejectedInternal: 0,
      revisionDate: moment().format('YYYY-MM-DD'),
      reworkInternal: 0,
      reworkVendor: 0,
      tenantId,
      totalOkQty: record.qtyToBeInspected,
      totalReworkQty: 0,
      totalRejectQty: 0,
      okRemarks: '',
      nokRemarks: '',
      totalRejcInt: 0,
      totalRejcExt: 0,
      totalNokQty: 0,
      rejectIntRemarks: '',
      rejectExtRemarks: '',
      totalReworkInt: 0,
      totalReworkVen: 0,
      reworkIntRemarks: '',
      reworkVenRemarks: '',
      nrFlag: 1,
      pmId: processCode,
      qHdrId: QtyHdrId,
      poId: record?.poId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'insertInspHdrAndDtl',
      requestData: newInsert,
    })

    if (httpget.responseCode === '200') {
      message.success(httpget.responseMessage)
      const updatedrecord = { ...record, qiHdrId: httpget?.responseDataMessage }
      await handleQCInsapproval(updatedrecord)
      getOnloadtabledata()
    } else {
      message.error(httpget.responseMessage)
    }
    setLoading(false)
  }

  const handleselectedfunction = async record => {
    const newInsert = {
      caInternal: 0,
      caVendor: 0,
      configName: '',
      docLifeCycleMstList: [],
      dtlList: [],
      empId: employeID,
      inspectedBy: employeID,
      inspectedOn: moment().format('YYYY-MM-DD'),
      inspectionQty: record?.qtyToBeInspected,
      inspectionType: '',
      okQty: 0,
      pmHdrId: ProjectID,
      qiHdrId: '',
      qiId: record.qiId,
      qicCreatedBy: employeID,
      qicCreatedOn: '',
      qicHdrId: '',
      qicName: '',
      vendorCode: record?.vendorCode,
      qualityRating: 0,
      qualityRefNo: '',
      drawingNo: record?.productCode,
      rejectedExternal: 0,
      rejectedInternal: 0,
      revisionDate: moment().format('YYYY-MM-DD'),
      reworkInternal: 0,
      reworkVendor: 0,
      tenantId,
      totalOkQty: 0,
      totalReworkQty: 0,
      totalRejectQty: 0,
      okRemarks: '',
      nokRemarks: '',
      totalRejcInt: 0,
      totalRejcExt: 0,
      totalNokQty: 0,
      rejectIntRemarks: '',
      rejectExtRemarks: '',
      totalReworkInt: 0,
      totalReworkVen: 0,
      reworkIntRemarks: '',
      reworkVenRemarks: '',
      nrFlag: 0,
      cancelFlag: 1,
      pmId: processCode,
      qHdrId: QtyHdrId,
      poId: record?.poId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'insertInspHdrAndDtl',
      requestData: newInsert,
    })
    if (httpget.responseCode === '200') {
      message.success(httpget.responseMessage)
      const updatedrecord = { ...record, qiHdrId: httpget?.responseDataMessage }
      handleSelectedQCInsapproval(updatedrecord)
      getOnloadtabledata()
    } else {
      message.error(httpget.responseMessage)
    }
  }

  const updateTailView = async () => {
    console.log(Enquiry)
    const response = await indentFileUpload({
      requestPath: 'getQtyDtl',
      requestData: {
        qhdrId: '',
        customerName: '',
        empId: employeID,
        fromDate: '',
        pmId: processCode,
        toDate: '',
        projectId: ProjectID,
        tenantId,
      },
    })
    console.log(response)
    if (response.responseCode === '200') {
      const updatedResponseData = response.responseData
      const filteredData = updatedResponseData.find(item => item.pmHdrId === ProjectID)
      console.log(filteredData)

      const sumofqty =
        parseInt(filteredData?.okCount || '0', 10) +
        parseInt(filteredData?.conditionalApprovedCnt || '0', 10) +
        parseInt(filteredData?.rejectedCount || '0', 10) +
        parseInt(filteredData?.reworkCount || '0', 10)
      const completedqty =
        sumofqty > filteredData?.qtyToBeInspected ? filteredData?.qtyToBeInspected : sumofqty

      const updateEnquiry = [
        {
          key: 1,
          label: 'Project Number',
          value: filteredData?.projectCode || '',
        },
        {
          key: 2,
          label: 'Project Name',
          value: filteredData?.projectName || '',
        },
        {
          key: 3,
          label: 'Status',
          value: filteredData?.hdrStatusDesc || '',
        },
        {
          key: 4,
          label: 'Inspection Requested Qty.',
          value: parseInt(filteredData?.qtyToBeInspected || '0', 10),
        },
        // {
        //   key: 11,
        //   label: 'Yet To be Inspected',
        //   value: parseInt(YettobeIns || '0', 10) ,
        // },
        {
          key: 6,
          label: 'Inspection Completed Qty.',
          value: parseInt(completedqty || '0', 10),
        },
        {
          key: 5,
          label: 'Ok Qty.',
          value: parseInt(filteredData?.okCount || '0', 10),
        },
        {
          key: 6,
          label: 'Conditional Qty.',
          value: parseInt(filteredData?.conditionalApprovedCnt || '0', 10),
        },
        {
          key: 7,
          label: 'Rejected Qty.',
          value: parseInt(filteredData?.rejectedCount || '0', 10),
        },
        {
          key: 8,
          label: 'Rework Qty.',
          value: parseInt(filteredData?.reworkCount || '0', 10),
        },
        {
          key: 9,
          label: 'No. of Request Received',
          value: filteredData?.qtyinspectionTotal || '',
        },
        {
          key: 10,
          label: 'No. of Request Completed',
          value: filteredData?.qtyinspectionCompleted || '',
        },
      ]
      console.log(updateEnquiry)
      setTimeout(() => {
        store.set('Enquiry', updateEnquiry)
      }, 2000)
    }
  }

  const onloadcolumns = [
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      width: '5%',
      filters: FilterPOCode,
      filteredValue: filtersInfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '6%',
      filters: FilterProdCode,
      filteredValue: filtersInfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '6%',
      filters: FilterVendorName,
      filteredValue: filtersInfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      width: 105,
    },
    {
      title: 'Request From',
      dataIndex: 'reqFrom',
      key: 'reqFrom',
      width: '6%',
      filters: FilterRequestFrom,
      filteredValue: filtersInfo.reqFrom,
      onFilter: (value, record) => record?.reqFrom === value,
    },

    // {
    //   title: 'UOM',
    //   dataIndex: 'uom',
    //   key: 'uom',
    //   filters: FilterUOM,
    //   filteredValue: filtersInfo.uom,
    //   onFilter: (value, record) => record?.uom=== value,
    // },
    {
      title: 'Qty offered for Inspection',
      dataIndex: 'qtyToBeInspected',
      key: 'qtyToBeInspected',
      className: 'right-align-cell',
      width: 56,
      render: text => {
        const textVal = parseFloat(text || 0)
        return textVal % 1 === 0 ? textVal.toFixed(0) : textVal.toFixed(1)
      },
      filters: FilterQtyInspect.sort((a, b) => a.value - b.value),
      filteredValue: filtersInfo.qtyToBeInspected,
      onFilter: (value, record) => record?.qtyToBeInspected === value,
      onCell: record => {
        const style = record.isRework > 0 ? { backgroundColor: '#ed5d5d', color: 'white' } : {}
        return { style }
      },
    },
    // {
    //   title: 'Inspect Qty',
    //   dataIndex: 'inspectQty',
    //   key: 'inspectQty',
    //   className: 'right-align-cell',
    //   render: text => parseInt(text, 10),
    //   filters: FilterInspectQty,
    //   filteredValue: filtersInfo.inspectQty,
    //   onFilter: (value, record) => record?.inspectQty=== value,
    // },
    {
      title: 'OK',
      dataIndex: 'okCount',
      key: 'okCount',
      className: 'right-align-cell',
      width: 56,
      render: text => {
        const textVal = parseFloat(text || 0)
        return textVal % 1 === 0 ? textVal.toFixed(0) : textVal.toFixed(1)
      },
      filters: FilterOkcnt.sort((a, b) => a.value - b.value),
      filteredValue: filtersInfo.okCount,
      onFilter: (value, record) => record?.okCount === value,
    },
    {
      title: 'Conditionally OK',
      dataIndex: 'conditionalCnt',
      key: 'conditionalCnt',
      className: 'right-align-cell',
      width: '7%',
      render: text => {
        const textVal = parseFloat(text || 0)
        return textVal % 1 === 0 ? textVal.toFixed(0) : textVal.toFixed(1)
      },
      filters: FilterCondCount.sort((a, b) => a.value - b.value),
      filteredValue: filtersInfo.conditionalCnt,
      onFilter: (value, record) => record?.conditionalCnt === value,
    },
    {
      title: 'Rework',
      dataIndex: 'reworkCount',
      key: 'reworkCount',
      className: 'right-align-cell',
      width: '6%',
      render: text => {
        const textVal = parseFloat(text || 0)
        return textVal % 1 === 0 ? textVal.toFixed(0) : textVal.toFixed(1)
      },
      filters: FilterReworkCnt.sort((a, b) => a.value - b.value),
      filteredValue: filtersInfo.reworkCount,
      onFilter: (value, record) => record?.reworkCount === value,
    },
    {
      title: 'Rejected',
      dataIndex: 'rejectedCount',
      key: 'rejectedCount',
      className: 'right-align-cell',
      width: '6%',
      render: text => {
        const textVal = parseFloat(text || 0)
        return textVal % 1 === 0 ? textVal.toFixed(0) : textVal.toFixed(1)
      },
      filters: FilterRejCount,
      filteredValue: filtersInfo.rejectedCount,
      onFilter: (value, record) => record?.rejectedCount === value,
    },
    {
      title: 'Inspection Requested By',
      dataIndex: 'inspectionReqBy',
      key: 'inspectionReqBy',
      width: '8%',
      filters: FilterInsReqBy,
      filteredValue: filtersInfo.inspectionReqBy,
      onFilter: (value, record) => record?.inspectionReqBy === value,
    },
    {
      title: 'Inspection Requested Date',
      dataIndex: 'inspectionReqDate',
      key: 'inspectionReqDate',
      width: '8%',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : null),
      filters: FilterInsReqDate.sort((a, b) => moment(a.value).unix() - moment(b.value).unix()),
      filteredValue: filtersInfo.inspectionReqDate,
      onFilter: (value, record) => record?.inspectionReqDate === value,
    },
    {
      title: 'Inspection Compeletion Date',
      dataIndex: 'inspectedDate',
      key: 'inspectedDate',
      width: '8%',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : null),
      filters: FilterInsDate.sort((a, b) => moment(a.value).unix() - moment(b.value).unix()),
      filteredValue: filtersInfo.inspectedDate,
      onFilter: (value, record) => record?.inspectedDate === value,
    },
    {
      title: 'Inspected By',
      dataIndex: 'inspectedBy',
      key: 'inspectedBy',
      width: '7%',
      filters: inspectedBy3,
      filteredValue: filtersInfo?.inspectedBy,
      onFilter: (value, record) => record?.inspectedBy === value,
    },
    {
      title: 'Status',
      dataIndex: 'inspectionStatus',
      key: 'inspectionStatus',
      width: 80,
      filters: FilterInspStatus,
      filteredValue: filtersInfo.inspectionStatus,
      onFilter: (value, record) => record?.inspectionStatus === value,
    },
    {
      title: 'Quality Rating',
      dataIndex: 'qtyRating',
      key: 'qtyRating',
      width: 80,
    },
    {
      title: 'Action',
      key: 'nrFlag',
      dataIndex: 'nrFlag',
      align: 'center',
      filters: nrFlag3,
      width: '10%',
      filteredValue: filtersInfo.nrFlag,
      onFilter: (value, record) => record?.nrFlag === value,
      render: (text, record, index) => (
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
          {record && record?.isnrFlag === 1 && record?.nrflag !== 1 && (
            <Popover
              content={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ margin: '10px 10px' }}>Are you sure to skip inspection?</span>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <Button onClick={() => setPopoverVisible(false)}>No</Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleNotRequired(record, index)
                        setPopoverVisible(false)
                        setQCBtn(true)
                      }}
                      disabled={QCBtn}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              }
              visible={popoverVisible === index}
              onVisibleChange={visible => setPopoverVisible(visible ? index : null)}
              trigger="click"
            >
              <Button disabled={loading} icon={<CheckOutlined />} type="primary" />
            </Popover>
          )}
          {record && record?.isnrFlag === 1 && record?.nrflag !== 1 && (
            <Popover
              content={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ margin: '10px 10px' }}>Are you sure to canceled inspection?</span>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <Button onClick={() => setcancelPopoverVisible(false)}>No</Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleCancelRequired(record, index)
                        setcancelPopoverVisible(false)
                        setQCBtn(true)
                      }}
                      disabled={QCBtn}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              }
              visible={cancelpopoverVisible === index}
              onVisibleChange={visible => setcancelPopoverVisible(visible ? index : null)}
              trigger="click"
            >
              <Button disabled={loading} icon={<CloseOutlined />} type="primary" />
            </Popover>
          )}
          {record &&
          record.nrFlag !== '1' &&
          record.cancelFlag !== '1' &&
          record.inspectionStatus !== 'Cancelled' ? (
            <Button
              type="primary"
              icon={<ImportOutlined />}
              onClick={() => openInsdetails(record, index)}
            />
          ) : (
            ''
          )}
          {record && record.nrFlag === '1' && 'QC Not req'}
          {qcinsvisible && index === openindex ? (
            <ModalPopup
              isModalVisible={qcinsvisible}
              FieldsComponent={renderQcInsComponent}
              text="Quality Inspection"
              onCancel={() => {
                setQcinsvisible(false)
              }}
              width="900"
            />
          ) : null}
        </div>
      ),
    },
  ]
  const handleSearch = e => {
    const filteringdatas = tableData.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      ),
    )
    setOnloadtable(filteringdatas)
  }
  const chagegeMaterialStaging = async () => {
    const props = {
      isQc: '',
      tenantId,
      hdrId: QtyHdrId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'updateIsStagingStatus',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      message.success(httpget.responseMessage)
      getOnloadStaging()
    } else {
      message.info(httpget.responseMessage)
    }
  }
  return (
    <div className="my-3">
      <div className="d-flex justify-content-between pb-2">
        <h5>Inspection Report</h5>
        {showStaging === '1' ? (
          <ButtonComponent
            text={materialStaging === '1' ? ' Stop Material Staging' : 'Start Material Staging '}
            type="primary"
            onClick={chagegeMaterialStaging}
          />
        ) : null}
      </div>
      <div>
        <Input.Search
          style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
          placeholder="Search here..."
          enterButton
          // onSearch={handleSearch}
          onChange={e => handleSearch(e)}
        />
        <Table
          dataSource={onloadtable}
          exportableProps={{
            fileName: `Inspection Call${currentDateTime}`,
            btnProps: {
              type: 'primary',
              icon: <FileExcelOutlined />,
              children: <span>Export to CSV</span>,
            },
          }}
          columns={onloadcolumns}
          onChange={FilterChange}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [onloadtable?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
        />
      </div>

      <div>
        <ApproveOrReject
          refId={slaveId}
          refDoctTyp={docTypeCode}
          tenId={tenantId}
          componentToRender="quality"
          submitFunction={handlesumit}
        />
      </div>
    </div>
  )
}

export default InspectionCall
