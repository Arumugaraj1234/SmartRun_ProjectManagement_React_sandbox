import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import { Empty, DatePicker, Select } from 'antd'

// Services
import getDesignDtl from 'services/common/designRetrieve'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import GridDesignComponent from '../../../components/shared/GridDesignComponent'
import GridViewHeader from '../../../components/shared/GridViewHeaderComponent'
import FilterEnquiry from '../../../components/shared/FilterEnquiry'
import DesignTable from './DesignTableComponent'

// fields component
import Button from '../../../components/shared/ButtonComponent'
import Input from '../../../components/shared/InputComponent'

const Designcomponent = () => {
  const history = useHistory()
  const tenantid = store.get('tenantId')
  const emplId = store.get('employeeId')
  const processId = '2'
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
  const [tileviewDataArray, setTileviewDataArray] = useState([])
  const [loading, setLoading] = useState(true)
  const [designId, setDesignID] = useState('')

  const [customerVal, setCustomerVal] = useState('')

  const [istableopen, setIsTableOpen] = useState(false)
  const [filtercards, setFilterCards] = useState(false)
  const [customercard, setCustomerCard] = useState(false)
  const [projectList, setProjectList] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('getall')
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
    store.set('ProjectID', e.projectID)
    store.set('DesignID', e.designID)
    store.set('hdrId', e.designID)
    store.set('enquiryId', e.enquiryId)
    store.set('EnquiryID', e.enquiryId)
    RetriveData(e.designID)
    TileRetriveData(e.designID)
    setCustomerCard(true)
    const Enquiry = [
      // {
      //   key: 1,
      //   label: 'Design Code',
      //   value: e.designCode,
      // },
      {
        key: 2,
        label: 'Project Number',
        value: e.projectCode,
      },
      {
        key: 3,
        label: 'Project name',
        value: e.projectName,
      },
      {
        key: 4,
        label: 'Customer name',
        value: e.customerName,
      },
      {
        key: 5,
        label: 'Requested by',
        value: e.requestedBy,
      },
      {
        key: 6,
        label: 'Planned Start Date',
        value: e.plannedStartDate ? moment(e.plannedStartDate).format('DD-MMM-YYYY') : '',
      },
      {
        key: 7,
        label: 'Due Date',
        value: e.dueDate ? moment(e.dueDate).format('DD-MMM-YYYY') : '',
      },
      {
        key: 8,
        label: 'Status',
        value: e.hdrStatusDesc,
      },
    ]
    store.set('Enquiry', Enquiry)
    history.push({
      pathname: '/designdetails',
      state: { e },
    })
  }

  useEffect(() => {
    RetriveData()
    TileRetriveData()
    getProjectsList()
  }, [])

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

  const RetriveData = async e => {
    setLoading(true)
    const response = await getDesignDtl(
      customerVal,
      e !== undefined && e !== '' ? e : designId,
      emplId,
      slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      processId,
      slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      tenantid,
      selectedProjectId,
    )
    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          setLoading(false)
          setFilterCards(false)
          store.set('isInternal', response.responseData[0].isInternal)
          data = response.responseData
        }
      } else {
        setLoading(false)
        data = ''
      }
    } else {
      setLoading(false)
      data = ''
    }
    setDesignRetrieve(data)
  }

  const TileRetriveData = async e => {
    const props = {
      customer: customerVal,
      designID: e !== undefined && e !== '' ? e : designId,
      empId: emplId,
      fromDate: slctdFromDate !== '' ? moment(slctdFromDate).format('YYYY-MM-DD') : '',
      processId,
      toDate: slctdToDate !== '' ? moment(slctdToDate).format('YYYY-MM-DD') : '',
      tenantID: tenantid,
      projectId: selectedProjectId,
    }

    const response = await indentFileUpload({
      requestPath: 'getDesignTitleView',
      requestData: props,
    })
    setLoading(true)

    let data = []
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          setLoading(false)
          setFilterCards(false)
          data = response.responseData
        }
      } else {
        setLoading(false)
        data = ''
      }
    } else {
      setLoading(false)
      data = ''
    }
    setTileviewDataArray(data)
  }

  const handleExport = () => {
    const csvContent = `data:text/xlsx;charset=utf-8,${designRetrieve
      .map(row => Object.values(row).join(','))
      .join('\n')}`
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'export.xlsx')
    document.body.appendChild(link)
    link.click()
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
          EnquiryLabel="Design Request"
          handleCardView={handleCardView}
          handleClickTable={handleClickTable}
          openFilterCard={openFilterCard}
          istableopen={istableopen}
        />
      )}
      {istableopen ? (
        <DesignTable handleExport={handleExport} data={designRetrieve} onClick={handleCardClick} />
      ) : (
        !customercard &&
        (designRetrieve && designRetrieve.length === 0 ? (
          <Empty />
        ) : (
          <div>
            {tileviewDataArray.map(tile => (
              <GridDesignComponent
                title={tile.statusDesc}
                isLoading={loading}
                GridData={tile.enqList}
                columns={columns}
                ProjectLabel="Indent C/V/A/PO"
                ValueLabel="Task P/C"
                DetailsLabel='View Details'
                rupee="L"
                numRows={numRows}
                onClick={handleCardClick}
                moduleType="Design"
              />
            ))}
          </div>
        ))
      )}

      {filtercards && (
        <FilterEnquiry
          closeFilterCard={closeFilterCard}
          Btnscomponent={Btnscomponent}
          style={{ float: 'center' }}
          cardLabel="Filter Design Projects"
          data={[
            {
              key: 1,
              label: 'From Date',
              component: (
                <DatePicker
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
                  style={{ width: 100 }}
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
                <div style={{ paddingLeft: 5 }}>
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
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
export default Designcomponent
