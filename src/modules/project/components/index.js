import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
// import { InfoCircleOutlined } from '@ant-design/icons'
import { message, Select, DatePicker } from 'antd'
import getProjectDtl from 'services/project/projectRetrieve'
import getViewDetailsVals from 'services/project/projectViewDetails'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import ProjectTable from 'modules/project/components/ProjectTableComponent'

import GridComponent from '../../../components/shared/GridComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'

import Buttons from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const Projectcomponent = () => {
  const history = useHistory()
  const tenantid = store.get('tenantId')
  const emplId = store.get('employeeId')
  const currency = store.get('MenuListData')

  // const projectIDVal = ''
  const pmId = '3'
  const budgetValString = `Budget${currency[0].currency}`
  const actualValString = `Final${currency[0].currency}`
  const balanceString = `Balance${currency[0].currency}`
  const saleValString = `Sale Value${currency[0].currency}`

  const currentYear = moment().year()
  const currentMonth = moment().month()
  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  console.log(defaultFromDate, defaultToDate)
  const [slctdFromDate, setSlctdFromDate] = useState('')
  const [slctdToDate, setSlctdToDate] = useState('')

  const [designRetrieve, setDesignRetrieve] = useState([])
  const [tileprojectData, settileprojectData] = useState([])
  const [slaveIdval, setSlaveIdval] = useState([])

  const [designId, setDesignID] = useState('')
  const [projectID, setProjectID] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [customerVal, setCustomerVal] = useState('')
  const [saleVal, setSaleValue] = useState('')
  const [projectList, setProjectList] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')

  store.set('projectCode', projectCode)
  store.set('projectName', projectName)

  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)

  const Btnscomponent = [
    <div>
      <Buttons type="primary" size="medium" text="Submit" />
      <Buttons type="primary" size="medium" text="Cancel" />
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
    // onClickGetViewDetails('')
  }
  let ProjectIDVals
  console.log(projectID)
  const handleCardClick = e => {
    console.log(e, 'dataval')
    setSlaveIdval(e.seId)
    setDesignID(e.designID)
    setProjectID(ProjectIDVals)
    store.set('ProjectID', e.pmHdrId)
    store.set('ProjectPMHdrId', e.pmHdrId)
    store.set('InitiatedDate', e.initiateDate)
    store.set('PlannedStartDate', e.plannedStartDate)
    store.set('plannerEndDate', e.plannedEndDate)
    store.set('Priority', e.priority)
    store.set('ScopeOfWork', e.scopeOfWork)
    store.set('IndustrialType', e.industrialType)
    store.set('EnquiryID', e.enquiryId)
    store.set('Handoverdate', e.projHandOverDate)
    store.set('EndDate', e.dueDate)
    store.set('CreatedDate', e.createdDate)
    store.set('isInternal', e.isInternal)

    setProjectName(e.projectName)
    setProjectCode(e.projCode !== null ? e.projCode : '-')
    RetriveData(e.designID)
    TileRetriveData(e.designID)
    setCustomerCard(true)
    setIsTableOpen(false)
    getViewDetailsVal()
    console.log(saleVal, 'saleVal')

    const Enquiry = [
      {
        key: 1,
        label: 'Project Number',
        value: e.projCode ? e.projCode : '<- To be Generated ->',
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
        label: 'Project HandOver date',
        value: e.projHandOverDate !== null ? moment(e.projHandOverDate).format('DD-MMM-YYYY') : '-',
      },
      // {
      //   key: 6,
      //   label: "Due Date",
      //   value: moment(e.dueDate).format('DD-MMM-YYYY'),
      // },
      {
        key: 6,
        label: 'Due Date',
        editable: true,
        value: moment(e.dueDate).format('DD-MMM-YYYY'),
      },
      // {
      //   key: 6,
      //   label: (
      //     <span>
      //       {' '}
      //       Due Date
      //       <Button
      //         type="primary"
      //         onClick={() => {
      //           showDtlRecords()
      //         }}
      //         icon={<InfoCircleOutlined />}
      //       />
      //     </span>
      //   ),
      //   value: moment(e.dueDate).format('DD-MMM-YYYY'),
      // },
      {
        key: 7,
        label: budgetValString,
        value: currencyFormat(e.indentPlan),
      },
      {
        key: 8,
        label: actualValString,
        value: currencyFormat(e.indentActual),
      },
      {
        key: 9,
        label: balanceString,
        value: currencyFormat(Number(e.indentPlan) - Number(e.indentActual)),
      },
      {
        key: 10,
        label: saleValString,
        value: currencyFormat(e.saleValue),
      },
    ]

    store.set('Enquiry', Enquiry)
    history.push({
      pathname: '/projectdetails',
      state: { e },
    })
    // return null
  }
  console.log(slaveIdval)
  useEffect(() => {
    RetriveData()
    TileRetriveData()
    getProjectsList()
  }, [])

  console.log(currencyFormat(saleVal), 'sale')

  // function showDtlRecords(){
  //   console.log("testing")
  // }

  const getViewDetailsVal = async () => {
    ProjectIDVals = store.get('ProjectPMHdrId')
    const respViewDtlVal = await getViewDetailsVals(tenantid, ProjectIDVals)
    let data1 = []
    if (respViewDtlVal.responseData !== null && respViewDtlVal.responseData !== undefined) {
      data1 = respViewDtlVal.responseData
      if (data1 && data1.length > 0) {
        store.set('SaleValue', data1[0].saleValue)
        setSaleValue(data1[0].saleValue)
      }
    } else {
      data1 = ''
    }
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
        projectId: '',
        projectName: 'Get All',
      },
      ...response.responseData,
    ]
    setProjectList(updatedResponseData)
  }

  const RetriveData = async () => {
    const response = await getProjectDtl(
      tenantid,
      slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      customerVal,
      selectedProjectId,
      pmId,
      emplId,
    )
    let data = []
    if (response.responseData !== null && response.responseData !== undefined) {
      setFilterCards(false)
      const updatedData = response?.responseData?.map((item, index) => {
        return {
          ...item,
          sno: index + 1,
        }
      })
      data = updatedData
    } else {
      setFilterCards(false)
      const resp = response.responseCode
      data = ''
      error(resp)
    }
    setDesignRetrieve(data)
  }
  const TileRetriveData = async () => {
    const payload = {
      tenantID: tenantid,
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      custName: customerVal,
      projectID: selectedProjectId,
      pmId,
      empId: emplId,
    }
    const response = await indentFileUpload({
      requestPath: 'getProjectTitleView',
      requestData: payload,
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
    settileprojectData(data)
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
    const spltDateMnthandyear = dateString.split('/')
    const datemonthandyearformat = `${spltDateMnthandyear[2]}-${spltDateMnthandyear[1]}-${spltDateMnthandyear[0]}`

    setSlctdFromDate(datemonthandyearformat)
    setSlctdToDate(moment().format('YYYY-MM-DD'))
  }
  function getSelectedToDate(value, dateString) {
    const spltDateMnthandyears = dateString.split('/')
    const datemonthandyearformats = `${spltDateMnthandyears[2]}-${spltDateMnthandyears[1]}-${spltDateMnthandyears[0]}`
    setSlctdToDate(datemonthandyearformats)
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
          EnquiryLabel="Project Request"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <ProjectTable data={designRetrieve} onClickfun={handleCardClick} />
      ) : (
        !customercard && (
          <div>
            {tileprojectData.map(tile => (
              <GridComponent
                title={tile.statusDesc}
                GridData={tile.enqList}
                columns={columns}
                ProjectLabel={budgetValString}
                ValueLabel={actualValString}
                DetailsLabel="View Details"
                // DetailsLabel={today > cutoffDate ? '' : 'View Details'}
                rupee={currency[0].currency}
                numRows={numRows}
                onClick={handleCardClick}
                moduleType="project"
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
                <DatePicker width="155px" format="DD-MMM-YYYY" onChange={getSelectedFromDate} />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker width="155px" format="DD-MMM-YYYY" onChange={getSelectedToDate} />
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
export default Projectcomponent
