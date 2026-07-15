import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { message, DatePicker, Select } from 'antd'
import getProjectDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import ScmTable from './ScmTableComponent'
import GridVIIComponent from '../../../components/shared/GridVIIComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'

import Button from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const ScmComponent = () => {
  const history = useHistory()
  const tenantId = store.get('tenantId')
  const emplId = store.get('employeeId')
  const currency = store.get('MenuListData')

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
  const [slctdFromDate, setSlctdFromDate] = useState('')
  const [slctdToDate, setSlctdToDate] = useState('')

  const [designRetrieve, setDesignRetrieve] = useState([])

  const [designId, setDesignID] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [customerVal, setCustomerVal] = useState('')
  const [projectList, setProjectList] = useState([])
  const [getSaleTileView, setGetSaleTileView] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [filtersinfo, setfilterinfo] = useState([])

  store.set('projectCode', projectCode)
  store.set('projectName', projectName)

  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  const distinct1 = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(designRetrieve)) {
      return [] // Return an empty array if dtlTabledata is not an array
    }

    return designRetrieve
      .map(item => item[key])
      .filter(distinct1)
      .map(value => ({
        text: value,
        value,
      }))
  }

  const handleChange = (pagination, filters) => {
    console.log('filters', filters)
    setfilterinfo(filters)
  }

  const ScmColumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: text => parseInt(text, 10),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      sorter: (a, b) => {
        return a.projectCode.localeCompare(b.projectCode)
      },
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Total Indents',
      key: 'intentCount',
      dataIndex: 'intentCount',
      className: 'right-align-cell',
      render: text => currencyFormat(text),
    },
    {
      title: 'PO Raised',
      dataIndex: 'poCount',
      key: 'poCount',
      className: 'right-align-cell',
      render: text => currencyFormat(text),
    },
    {
      title: 'Material Inward',
      dataIndex: 'inwardCount',
      key: 'inwardCount',
      className: 'right-align-cell',
      render: text => currencyFormat(text),
    },
    {
      title: 'GRN',
      dataIndex: 'grnCount',
      key: 'grnCount',
      className: 'right-align-cell',
      render: text => currencyFormat(text),
    },

    {
      title: 'Due Date',
      key: 'dueDate',
      dataIndex: 'dueDate',
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Stage Name',
      key: 'hdrStatusDesc',
      dataIndex: 'hdrStatusDesc',
      render: text => text,
      filters: distinctValues('hdrStatusDesc'),
      filteredValue: filtersinfo.hdrStatusDesc,
      onFilter: (value, record) => record?.hdrStatusDesc === value,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <Button text="Details" type="primary" onClick={() => handleCardClick(record)} />
        ) 
      },
    },
  ]

  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)

  const Btnscomponent = [
    <div>
      <Button type="primary" size="medium" text="Submit" />
      <Button type="primary" size="medium" text="Cancel" />
    </div>,
  ]

  const handleClickTable = () => {
    setFilterCards(false)
    setCustomerCard(false)
    setIsTableOpen(true)
  }
  const handleCardView = () => {
    setIsTableOpen(false)
  }

  const openFilterCard = () => {
    if (customercard) {
      setCustomerCard(false)
      setFilterCards(false)
    } else {
      setFilterCards(true)
    }
  }
  const closeFilterCard = () => {
    setFilterCards(false)
  }
  const handleCardClick = e => {
    setDesignID(e.designID)
    store.set('ProjectID', e.pmHdrId)
    store.set('ProjectPMHdrId', e.pmHdrId)
    store.set('ScmHdrId', e.scmHdrId)
    store.set('InitiatedDate', e.scmInitiatedDate)
    store.set('PlannedStartDate', e.plannedStartDate)
    store.set('plannerEndDate', e.plannedEndDate)
    store.set('Priority', e.priority)
    store.set('ScopeOfWork', e.scopeOfWork)
    store.set('IndustrialType', e.industrialType)
    store.set('EnquiryID', e.enquiryId)
    setProjectName(e.projectName)
    setProjectCode(e.projectCode !== null ? e.projectCode : '-')
    RetriveData(e.pmHdrId)
    TileRetriveData(e.pmHdrId)

    const Enquiry = [
      {
        key: 1,
        label: 'Project Number',
        value: e.projectCode === '-' ? '<- To be Generated ->' : e.projectCode,
      },
      {
        key: 2,
        label: 'Project name',
        value: e.projectName,
      },
      {
        key: 3,
        label: 'Project Status',
        value: e.hdrStatusDesc,
      },
      {
        key: 4,
        label: 'Customer name',
        value: e.customerName,
      },
      {
        key: 5,
        label: 'Planned Start Date',
        value: moment(e.scmInitiatedDate).format('DD-MMM-YYYY'),
      },
      {
        key: 6,
        label: 'Due Date',
        value: moment(e.dueDate).format('DD-MMM-YYYY'),
      },
      {
        key: 7,
        label: 'Indent Count',
        value: e.intentCount,
      },
      {
        key: 8,
        label: `Raised PO's`,
        value: e.poCount,
      },
      {
        key: 9,
        label: `Material Inward`,
        value: e.inwardCount,
      },
      {
        key: 10,
        label: `GRN`,
        value: e.grnCount,
      },
    ]
    store.set('Enquiry', Enquiry)
    setIsTableOpen(false)
    history.push({
      pathname: '/scmdetails',
      state: { e },
    })
  }

  useEffect(() => {
    RetriveData()
    TileRetriveData()
    getProjectsList()
  }, [])

  // const tileviewDataArray= [
  //   {
  //     "Title": "Queue",
  //     "List": [
  //       {
  //         "scmHdrId": "2",
  //         "pmHdrId": "8",
  //         "scmInitiatedDate": "2024-04-01",
  //         "poCount": "3",
  //         "intentCount": "0",
  //         "projectCode": "10000",
  //         "transactionNo": "10000",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "BSH",
  //         "projectName": "Automation",
  //         "dueDate": "2024-04-19",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "13",
  //         "sno": "1.0"
  //       },
  //       {
  //         "scmHdrId": "3",
  //         "pmHdrId": "20",
  //         "scmInitiatedDate": "2024-04-03",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10002",
  //         "transactionNo": "10002",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "ITC",
  //         "projectName": "End of Line Palletizing",
  //         "dueDate": "2024-06-05",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "27",
  //         "sno": "2.0"
  //       },
  //       {
  //         "scmHdrId": "4",
  //         "pmHdrId": "25",
  //         "scmInitiatedDate": "2024-04-04",
  //         "poCount": "3",
  //         "intentCount": "2",
  //         "projectCode": "10004",
  //         "transactionNo": "10004",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Danfoss Industries Private Limited",
  //         "projectName": "MoS2 Filling Automation",
  //         "dueDate": "2024-06-02",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "39",
  //         "sno": "3.0"
  //       },
  //       {
  //         "scmHdrId": "5",
  //         "pmHdrId": "3",
  //         "scmInitiatedDate": "2024-04-05",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10089",
  //         "transactionNo": "10023",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "SCHNEDIR ELECTRIC",
  //         "projectName": "ROBOTIC WIRE WINDING",
  //         "dueDate": "2024-05-31",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "6",
  //         "sno": "4.0"
  //       },
  //       {
  //         "scmHdrId": "7",
  //         "pmHdrId": "10",
  //         "scmInitiatedDate": "2024-04-12",
  //         "poCount": "3",
  //         "intentCount": "1",
  //         "projectCode": "10007",
  //         "transactionNo": "10007",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Samsung",
  //         "projectName": "Automation",
  //         "dueDate": "2024-04-12",
  //         "inwardCount": "2",
  //         "grnCount": "6",
  //         "enquiryId": "15",
  //         "sno": "5.0"
  //       },
  //       {
  //         "scmHdrId": "3",
  //         "pmHdrId": "20",
  //         "scmInitiatedDate": "2024-04-03",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10002",
  //         "transactionNo": "10002",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "ITC",
  //         "projectName": "End of Line Palletizing",
  //         "dueDate": "2024-06-05",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "27",
  //         "sno": "2.0"
  //       },
  //       {
  //         "scmHdrId": "4",
  //         "pmHdrId": "25",
  //         "scmInitiatedDate": "2024-04-04",
  //         "poCount": "3",
  //         "intentCount": "2",
  //         "projectCode": "10004",
  //         "transactionNo": "10004",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Danfoss Industries Private Limited",
  //         "projectName": "MoS2 Filling Automation",
  //         "dueDate": "2024-06-02",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "39",
  //         "sno": "3.0"
  //       },
  //       {
  //         "scmHdrId": "5",
  //         "pmHdrId": "3",
  //         "scmInitiatedDate": "2024-04-05",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10089",
  //         "transactionNo": "10023",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "SCHNEDIR ELECTRIC",
  //         "projectName": "ROBOTIC WIRE WINDING",
  //         "dueDate": "2024-05-31",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "6",
  //         "sno": "4.0"
  //       },
  //       {
  //         "scmHdrId": "7",
  //         "pmHdrId": "10",
  //         "scmInitiatedDate": "2024-04-12",
  //         "poCount": "3",
  //         "intentCount": "1",
  //         "projectCode": "10007",
  //         "transactionNo": "10007",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Samsung",
  //         "projectName": "Automation",
  //         "dueDate": "2024-04-12",
  //         "inwardCount": "2",
  //         "grnCount": "6",
  //         "enquiryId": "15",
  //         "sno": "5.0"
  //       }
  //     ]
  //   },
  //   {
  //     "Title": "NEW",
  //     "List": [
  //       {
  //         "scmHdrId": "8",
  //         "pmHdrId": "31",
  //         "scmInitiatedDate": "2024-04-22",
  //         "poCount": "5",
  //         "intentCount": "8",
  //         "projectCode": "10013",
  //         "transactionNo": "10013",
  //         "transactionStatus": "DS042",
  //         "transactionStatusSeq": "4",
  //         "hdrStatusDesc": "Tasks Completed",
  //         "customerName": "KONE",
  //         "projectName": "Door Glue Dispensing Automation",
  //         "dueDate": "2024-05-31",
  //         "inwardCount": "17",
  //         "grnCount": "9",
  //         "enquiryId": "45",
  //         "sno": "6.0"
  //       },
  //       {
  //         "scmHdrId": "9",
  //         "pmHdrId": "29",
  //         "scmInitiatedDate": "2024-05-07",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10011",
  //         "transactionNo": "10011",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "TATA ELECTRONICS PRIVATE LIMITED - TEPL",
  //         "projectName": "IM AUTOMATION 6",
  //         "dueDate": "2024-05-15",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "44",
  //         "sno": "7.0"
  //       },
  //       {
  //         "scmHdrId": "10",
  //         "pmHdrId": "32",
  //         "scmInitiatedDate": "2024-05-14",
  //         "poCount": "4",
  //         "intentCount": "3",
  //         "projectCode": "10014",
  //         "transactionNo": "10014",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "KONE1",
  //         "projectName": "Cobot Door Glue Dispensing Automation",
  //         "dueDate": "2024-09-30",
  //         "inwardCount": "6",
  //         "grnCount": "4",
  //         "enquiryId": "46",
  //         "sno": "8.0"
  //       },
  //       {
  //         "scmHdrId": "11",
  //         "pmHdrId": "33",
  //         "scmInitiatedDate": "2024-06-01",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10016",
  //         "transactionNo": "10016",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "CAPEX",
  //         "projectName": "CAPEX 2024-25",
  //         "dueDate": "2025-03-30",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "80",
  //         "sno": "9.0"
  //       }
  //     ]
  //   },
  //   {
  //     "Title": "WIP",
  //     "List": [
  //       {
  //         "scmHdrId": "13",
  //         "pmHdrId": "36",
  //         "scmInitiatedDate": "2024-06-12",
  //         "poCount": "0",
  //         "intentCount": "1",
  //         "projectCode": "10020",
  //         "transactionNo": "10020",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Mangal Industries - Metal Fabrication",
  //         "projectName": "Stiffener EOL Automation",
  //         "dueDate": "2024-06-12",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "72",
  //         "sno": "10.0"
  //       },
  //       {
  //         "scmHdrId": "14",
  //         "pmHdrId": "14",
  //         "scmInitiatedDate": "2024-06-12",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10018",
  //         "transactionNo": "10018",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Rane Brake Lining",
  //         "projectName": "Line Automation",
  //         "dueDate": "2024-06-12",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "19",
  //         "sno": "11.0"
  //       },
  //       {
  //         "scmHdrId": "15",
  //         "pmHdrId": "37",
  //         "scmInitiatedDate": "2024-06-12",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10019",
  //         "transactionNo": "10019",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "BGR NEO LIMITED",
  //         "projectName": "General",
  //         "dueDate": "2050-12-31",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "93",
  //         "sno": "12.0"
  //       }
  //     ]
  //   },
  //   {
  //     "Title": "ASSEMBLY",
  //     "List": [
  //       {
  //         "scmHdrId": "16",
  //         "pmHdrId": "38",
  //         "scmInitiatedDate": "2024-06-14",
  //         "poCount": "3",
  //         "intentCount": "2",
  //         "projectCode": "10022",
  //         "transactionNo": "10022",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "SmartRun",
  //         "projectName": "Traceability Solution",
  //         "dueDate": "2024-12-31",
  //         "inwardCount": "2",
  //         "grnCount": "0",
  //         "enquiryId": "98",
  //         "sno": "13.0"
  //       },
  //       {
  //         "scmHdrId": "17",
  //         "pmHdrId": "40",
  //         "scmInitiatedDate": "2024-06-18",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10023",
  //         "transactionNo": "10023",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "Pidillite Industries",
  //         "projectName": "EOL Stiffner automation",
  //         "dueDate": "2024-06-25",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "100",
  //         "sno": "14.0"
  //       },
  //       {
  //         "scmHdrId": "18",
  //         "pmHdrId": "39",
  //         "scmInitiatedDate": "2024-06-18",
  //         "poCount": "0",
  //         "intentCount": "0",
  //         "projectCode": "10024",
  //         "transactionNo": "10024",
  //         "transactionStatus": "DS002",
  //         "transactionStatusSeq": "1",
  //         "hdrStatusDesc": "WIP",
  //         "customerName": "MANGAL - AMRL",
  //         "projectName": "Stiffner automation",
  //         "dueDate": "2024-06-25",
  //         "inwardCount": "0",
  //         "grnCount": "0",
  //         "enquiryId": "99",
  //         "sno": "15.0"
  //       }
  //     ]
  //   }
  // ]

  const RetriveData = async id => {
    const props = {
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      tenantId,
      empId: emplId,
      customerName: customerVal || '',
      projectId: id || selectedProjectId,
    }
    const response = await getProjectDetails({
      requestPath: 'getScmHdrBasedDtl',
      requestData: props,
    })

    let data = []
    if (response.responseData !== null && response.responseData !== undefined) {
      setFilterCards(false)
      data = response.responseData
    } else {
      setFilterCards(false)
      const resp = response.responseCode
      data = ''
      error(resp)
    }
    store.set('isInternal', data[0].isInternal)

    setDesignRetrieve(data)
  }
  const TileRetriveData = async id => {
    const props = {
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      tenantId,
      empId: emplId,
      customerName: customerVal || '',
      projectId: id || selectedProjectId,
    }
    const response = await getProjectDetails({
      requestPath: 'getSCMTitleView',
      requestData: props,
    })

    let data = []
    if (response.responseData !== null && response.responseData !== undefined) {
      setFilterCards(false)
      data = response.responseData
    } else {
      setFilterCards(false)
      const resp = response.responseCode
      data = ''
      error(resp)
    }
    setGetSaleTileView(data)
  }

  const getProjectsList = async () => {
    const payload = {
      tenantId,
      fromDate: '',
      toDate: '',
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: payload,
    })
    const updatedResponseData = [
      {
        projectId: '',
        projectName: 'Get All',
      },
      ...response.responseData,
    ]
    setProjectList(updatedResponseData)
  }

  const error = resp => {
    message.error(resp)
  }

  const columns = {
    xl: 4,
    lg: 4,
    md: 2,
    sm: 1,
    xs: 1,
  }

  const numRows = Math.ceil(designRetrieve.length / columns.xl)

  function getSelectedFromDate(value, dateString) {
    setSlctdFromDate(dateString)
    setSlctdToDate(moment().format('YYYY-MM-DD'))
  }
  function getSelectedToDate(value, dateString) {
    setSlctdToDate(dateString)
  }
  const getCustomerVal = e => {
    setCustomerVal(e.target.value)
  }
  // const cutoffDate = new Date('2026-12-28')
  // const today = new Date()
  return (
    <div>
      {!customercard && (
        <GridViewHeader
          EnquiryLabel="SCM Details"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <ScmTable data={designRetrieve} columns={ScmColumns} handleChange={handleChange} />
      ) : (
        !customercard && (
          <div>
            {getSaleTileView.map(tile => (
              <GridVIIComponent
                title={tile.statusDesc}
                GridData={tile.enqList} // Set GridData dynamically based on the title list
                columns={columns}
                ProjectLabel="Indent Count"
                rupee={currency[0].currency}
                DetailsLabel='View Details'
                // DetailsLabel={today > cutoffDate ? '' : 'View Details'}
                numRows={numRows}
                onClick={handleCardClick}
                moduleType="scm"
              />
            ))}
          </div>
        )
      )}

      {filtercards && (
        <FilterEnquiry
          closeFilterCard={closeFilterCard}
          Btnscomponent={Btnscomponent}
          style={{ float: 'center' }}
          cardLabel="Filter Project"
          data={[
            {
              key: 1,
              label: 'From Date',
              component: (
                <DatePicker
                  format="DD-MMM-YYYY"
                  placeholder="Select Date..."
                  width="155px"
                  onChange={getSelectedFromDate}
                />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker
                  format="DD-MMM-YYYY"
                  placeholder="Select Date..."
                  width="155px"
                  onChange={getSelectedToDate}
                />
              ),
            },
            {
              key: 3,
              label: 'Customer',
              component: (
                <Input
                  type="text"
                  style={{ width: '100%', color: 'black !important' }}
                  width="155px"
                  height="35px"
                  placeholder="Type Here..."
                  onChange={e => getCustomerVal(e)}
                  value={customerVal}
                />
              ),
            },
            {
              key: 3,
              label: 'Project',
              component: (
                <Select
                  style={{ width: '155px' }}
                  placeholder="Select Here..."
                  onChange={e => setSelectedProjectId(e)}
                  options={projectList.map(item => ({
                    label: `${item.projectCode ? item.projectCode : ''} ${
                      item.projectCode ? '-' : ''
                    }${item.projectName}`,
                    value: item.projectId,
                  }))}
                />
              ),
            },
            {
              key: 4,
              component: (
                <center>
                  <div style={{ paddingLeft: 0 }}>
                    <Button
                      type="primary"
                      size="medium"
                      text="Submit"
                      onClick={() => {
                        RetriveData(designId)
                        TileRetriveData(designId)
                      }}
                    />
                  </div>
                </center>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
export default ScmComponent
