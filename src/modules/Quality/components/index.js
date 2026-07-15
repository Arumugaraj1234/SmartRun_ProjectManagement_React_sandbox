import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { DatePicker, Select } from 'antd'

// Services
import getQtyDtl from 'services/Quality/qtyRetrive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import GridComponent from '../../../components/shared/GridComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'

// SubComponent
// import Designprocess from './DesignProcessComponent'

// Component as props
import QtyTableComponent from './qtyTableComponent'

// fields component
import Buttons from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const QualityComponent = () => {
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
  const pmId = '6'
  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)
  const [assyDataSourceRetr, setAssyDataSourceRetr] = useState([])
  const [tileQtyData, setTileQtyData] = useState([])

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
    store.set('EnquiryID', e.enquiryId)
    store.set('QtyHdrId', e.qhdrId)
    store.set('ProjectID', e.pmHdrId)
    // onClickViewDetails(e.qhdrId)
    setCustomerCard(true)
    // calculation of completed
    const sumofqty =
      parseInt(e?.okCount || '0', 10) +
      parseInt(e?.conditionalApprovedCnt || '0', 10) +
      parseInt(e?.rejectedCount || '0', 10) +
      parseInt(e?.reworkCount || '0', 10)
    const completedqty = sumofqty > e?.qtyToBeInspected ? e?.qtyToBeInspected : sumofqty
    // calculation of yet to be inspected
    // const calyettoins = completedqty - e?.qtyToBeInspected
    // const YettobeIns = calyettoins < 0 ? 0 : calyettoins
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
        label: 'Inspection Requested Qty.',
        value: parseInt(e?.qtyToBeInspected || '0', 10),
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
        value: parseInt(e?.okCount || '0', 10),
      },
      {
        key: 6,
        label: 'Conditional Qty.',
        value: parseInt(e?.conditionalApprovedCnt || '0', 10),
      },
      {
        key: 7,
        label: 'Rejected Qty.',
        value: parseInt(e?.rejectedCount || '0', 10),
      },
      {
        key: 8,
        label: 'Rework Qty.',
        value: parseInt(e?.reworkCount || '0', 10),
      },
      {
        key: 9,
        label: 'No. of Request Received',
        value: e?.qtyinspectionTotal || '',
      },
      {
        key: 10,
        label: 'No. of Request Completed',
        value: e?.qtyinspectionCompleted || '',
      },
    ]
    store.set('Enquiry', Enquiry)
    history.push({
      pathname: '/qualitydetails',
      state: { e },
    })
  }
  // const onClickViewDetails = async value => {
  //   const respPopUp = await getQtyDtl(
  //     value || '',
  //     customer,
  //     emplId,
  //     slctdFromDate,
  //     pmId,
  //     tenantid,
  //     slctdToDate,
  //     selectedProjectId,
  //   )
  //   let data = []
  //    if (response !== null && response !== undefined) {
  //   }
  //   if (respPopUp?.responseCode === '200') {
  //     setRespPopUpCreateInwrd(respPopUp.responseData)
  //     setshowpopupcrtetbl(true)
  //   } else {
  //     setRespPopUpCreateInwrd([])
  //   }
  // }

  // const customer = ''
  const qhdrId = ''
  const RetriveData = async () => {
    // setLoading(true)
    const response = await getQtyDtl(
      qhdrId,
      customerVal || '',
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
          // setLoading(false)
          // setFilterCards(false)
          data = response.responseData
        }
      } else {
        // setLoading(false)
        data = ''
      }
    } else {
      // setLoading(false)
      data = ''
    }
    setAssyDataSourceRetr(data)
  }

  const TileRetriveData = async () => {
    // setLoading(true)customerName: custName,

    const payload = {
      qhdrId,
      customerName: customerVal || '',
      empId: emplId,
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      pmId,
      tenantId: tenantid,
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      projectId: selectedProjectId,
    }
    const response = await indentFileUpload({
      requestPath: 'getQualityView',
      requestData: payload,
    })
    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          // setLoading(false)
          // setFilterCards(false)
          data = response.responseData
        }
      } else {
        // setLoading(false)
        data = ''
      }
    } else {
      // setLoading(false)
      data = ''
    }
    setTileQtyData(data)
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
          EnquiryLabel="Quality Request"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <QtyTableComponent onClick={handleCardClick} data={assyDataSourceRetr} />
      ) : (
        !customercard && (
          <div>
            {tileQtyData.map(tile => (
              <GridComponent
                title={tile.statusDesc}
                GridData={tile.enqList}
                columns={columns}
                ProjectLabel="Request Raised"
                ValueLabel="Request Closed"
                numRows={numRows}
                DetailsLabel="View Details"
                onClick={handleCardClick}
                moduleType="Quality"
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

export default QualityComponent
