import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { DatePicker, Select } from 'antd'

import getAssemblyDtl from 'services/assembly/assemblyRetrieve'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import GridComponent from '../../../components/shared/GridComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'
import AssignTableComponent from './assyTableComponent'

import Buttons from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const AssemblyComponent = () => {
  const history = useHistory()
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

  const tenantid = store.get('tenantId')
  const emplId = store.get('employeeId')
  const pmId = '4'
  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)
  const [assyDataSourceRetr, setAssyDataSourceRetr] = useState([])
  const [tileviewDataArray, setTileviewDataArray] = useState([])
  const [slctdFromDate, setSlctdFromDate] = useState('')
  const [slctdToDate, setSlctdToDate] = useState('')
  const [customerVal, setCustomerVal] = useState('')
  const [projectList, setProjectList] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('getall')

  const handleCardView = () => {
    setIsTableOpen(false)
  }
  const handleClickTable = () => {
    setFilterCards(false)
    setCustomerCard(false)
    setIsTableOpen(true)
  }
  const openFilterCard = () => {
    if (customercard) {
      setCustomerCard(false)
      setFilterCards(false)
    } else {
      setFilterCards(true)
    }
  }
  useEffect(() => {
    RetriveData()
    TileRetriveData()
    getProjectsList()
  }, [])
  const handleCardClick = e => {
    setIsTableOpen(false)
    RetriveData(e)
    TileRetriveData(e)
    store.set('AssyHdrId', e.assyHdrId)
    store.set('hdrId', e.assyHdrId)
    store.set('ProjectID', e.pmHdrId)
    store.set('EnquiryID', e.enquiryId)
    store.set('isInternal', e.isInternal)
    onClickViewDetails(e.assyHdrId)
    setCustomerCard(true)

    const Enquiry = [
      {
        key: 1,
        label: 'Project Number',
        value: e.projectCode,
      },
      {
        key: 2,
        label: 'Project Name',
        value: e.projectName,
      },
      {
        key: 3,
        label: 'Project Status',
        value: e.hdrStatusDesc,
      },
      {
        key: 4,
        label: 'Customer Name',
        value: e.customerName,
      },
      {
        key: 5,
        label: 'Indent Plan',
        value: e.indentCount,
      },
      {
        key: 6,
        label: 'Indent Actual',
        value: e.indentIsCompletedCount,
      },
      {
        key: 7,
        label: 'Material Plan',
        value: e.materialRequestHdrCount,
      },
      {
        key: 8,
        label: 'Material Actual',
        value: e.materialRequestIsCompletedCount,
      },
      {
        key: 9,
        label: 'Request Date',
        value: moment(e.requestDate).format('DD-MMM-YYYY'),
      },
      {
        key: 10,
        label: `Planned Start Date`,
        value: moment(e.planStartDate).format('DD-MMM-YYYY'),
      },
      {
        key: 11,
        label: 'Due Date',
        value: moment(e.planEndDate).format('DD-MMM-YYYY'),
      },
    ]
    store.set('Enquiry', Enquiry)
    history.push({
      pathname: '/assemblydetails',
      state: { e },
    })
  }
  const onClickViewDetails = async value => {
    // eslint-disable-next-line no-unused-vars
    const respPopUp = await getAssemblyDtl(
      value,
      customer,
      emplId,
      slctdFromDate,
      pmId,
      tenantid,
      slctdToDate,
      selectedProjectId,
    )
  }

  const customer = ''
  const assyId = ''

  const RetriveData = async () => {
    const response = await getAssemblyDtl(
      assyId,
      customerVal,
      emplId,
      slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      pmId,
      tenantid,
      slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      selectedProjectId,
    )
    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          setFilterCards(false)
          data = response.responseData
        }
      } else {
        data = ''
      }
    } else {
      data = ''
    }
    setAssyDataSourceRetr(data)
  }

  const TileRetriveData = async () => {
    const payload = {
      assyId,
      custName: customerVal,
      empId: emplId,
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      pmId,
      tenantID: tenantid,
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      projectId: selectedProjectId,
    }
    const response = await indentFileUpload({
      requestPath: 'getAssyTitleView',
      requestData: payload,
    })

    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          setFilterCards(false)
          data = response.responseData
        }
      } else {
        data = ''
      }
    } else {
      data = ''
    }
    setTileviewDataArray(data)
  }

  const getProjectsList = async () => {
    const payload = {
      tenantId: tenantid,
      fromDate: '',
      toDate: '',
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: payload,
    })
    const updatedResponseData = [
      {
        projectId: 'getall',
        projectName: 'Get All',
      },
      ...response.responseData,
    ]
    setProjectList(updatedResponseData)
  }

  const columns = {
    xl: 4,
    lg: 4,
    md: 2,
    sm: 1,
    xs: 1,
  }
  const closeFilterCard = () => {
    setFilterCards(false)
  }
  const Btnscomponent = [
    <div>
      <Buttons type="primary" size="medium" text="Submit" />
      <Buttons type="primary" size="medium" text="Cancel" />
    </div>,
  ]
  const numRows = Math.ceil(assyDataSourceRetr.length / columns.xl)
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

  return (
    <div>
      {!customercard && (
        <GridViewHeader
          EnquiryLabel="Assembly Request"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <AssignTableComponent onClick={handleCardClick} data={assyDataSourceRetr} />
      ) : (
        !customercard && (
          <div>
            {tileviewDataArray.map(tile => (
              <GridComponent
                title={tile.statusDesc}
                GridData={tile.enqList}
                columns={columns}
                ProjectLabel="Indent Plan vs Act"
                ValueLabel="Material Plan vs Act"
                numRows={numRows}
                DetailsLabel="View Details"
                onClick={handleCardClick}
                moduleType="assembly"
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
                  placeholder="Select From Date"
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
                  onChange={getSelectedFromDate}
                />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker
                  placeholder="Select To Date"
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
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
                    <Buttons
                      type="primary"
                      size="medium"
                      text="Submit"
                      onClick={() => {
                        RetriveData()
                        TileRetriveData()
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

export default AssemblyComponent
