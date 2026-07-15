import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { DatePicker, Select } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import GridComponent from '../../../components/shared/GridComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'
import FinanceTableComponent from './financeTableComponent'
import Buttons from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const FinanceComponent = () => {
  const history = useHistory()
  const tenantid = store.get('tenantId')
  const emplId = store.get('employeeId')
  const pmId = '7'
  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)
  const [financedata, setfinancedata] = useState([])
  const [tilefinancedata, settilefinancedata] = useState([])
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
    store.set('EnquiryID', e.enquiryId)
    store.set('feHdrId', e.feHdrId)
    store.set('ProjectID', e.pmHdrId)
    store.set('isInternal', e.isInternal)
    setCustomerCard(true)
    const Enquiry = [
      {
        key: 1,
        label: 'Project Number',
        value: e?.projectCode || '',
      },
      {
        key: 2,
        label: 'Project Name',
        value: e?.projectName || '',
      },
      {
        key: 3,
        label: 'Status',
        value: e?.hdrStatusDesc || '',
      },
      {
        key: 4,
        label: 'Start Date',
        value: e?.initiatedDate ? moment(e?.initiatedDate).format('DD-MMM-YYYY') : '',
      },
      {
        key: 5,
        label: 'Handover Date',
        value: e?.handoverDate ? moment(e?.handoverDate).format('DD-MMM-YYYY') : '',
      },
      {
        key: 6,
        label: 'Due Date',
        value: e?.dueDate ? moment(e?.dueDate).format('DD-MMM-YYYY') : '',
      },
    ]
    store.set('Enquiry', Enquiry)
    history.push({
      pathname: '/financedetails',
      state: { e },
    })
  }
  const RetriveData = async () => {
    const response = await indentFileUpload({
      requestPath: 'getFinanceDtl',
      requestData: {
        processId: pmId,
        customer: customerVal || '',
        empId: emplId,
        fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
        designID: '',
        tenantID: tenantid,
        toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
        projectId: selectedProjectId,
      },
    })
    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response?.responseData?.length > 0) {
          data = response.responseData
        }
      } else {
        data = ''
      }
    } else {
      data = ''
    }
    setfinancedata(data)
  }
  const TileRetriveData = async () => {
    const response = await indentFileUpload({
      requestPath: 'getFinanceTitleView',
      requestData: {
        processId: pmId,
        customer: customerVal || '',
        empId: emplId,
        fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
        designID: '',
        tenantID: tenantid,
        toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
        projectId: selectedProjectId,
      },
    })
    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response?.responseData?.length > 0) {
          data = response.responseData
        }
      } else {
        data = ''
      }
    } else {
      data = ''
    }
    settilefinancedata(data)
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
  const numRows = Math.ceil(financedata.length / columns.xl)
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
  const getCustomerVal = e => {
    setCustomerVal(e.target.value)
  }

  return (
    <div>
      {!customercard && (
        <GridViewHeader
          EnquiryLabel="Finance Request"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <FinanceTableComponent onClick={handleCardClick} data={financedata} />
      ) : (
        !customercard && (
          <div>
            {tilefinancedata.map(tile => (
              <GridComponent
                title={tile.statusDesc}
                GridData={tile.enqList}
                columns={columns}
                ProjectLabel="Project Name"
                ValueLabel="Start Date"
                numRows={numRows}
                DetailsLabel="View Details"
                onClick={handleCardClick}
                moduleType="finance"
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
                  style={{ width: '155px' }}
                  format="DD-MMM-YYYY"
                  onChange={getSelectedFromDate}
                />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker
                  style={{ width: '155px' }}
                  format="DD-MMM-YYYY"
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
                        setFilterCards(false)
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

export default FinanceComponent
