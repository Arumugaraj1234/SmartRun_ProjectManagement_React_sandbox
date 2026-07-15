import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { DatePicker, Spin, Select } from 'antd'
import Button from 'components/shared/ButtonComponent'
import DashboardTableView from 'components/common/DashboardTblView'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import FilterEnquiry from '../../../../components/shared/FilterEnquiry'
import LeadChart from './LeadChart'
import WonChart from './Wonchart'
import LostChart from './LostChart'
import HoldChart from './Hold'
import Stagewisechart from './Stagewisechart'
import Enquiryorderchart from './Enquiryorder'
import CustomerOrderchart from './CustomerOrder'
import OrderContribution from './OrderContribution'

const Dashboard = () => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const depCode = store.get('depCode')

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

  const [filtercards, setFilterCards] = useState(false)
  const [loading, setLoading] = useState(true)
  const [slctdFromDate, setSlctdFromDate] = useState(defaultFromDate)
  const [slctdToDate, setSlctdToDate] = useState(defaultToDate)
  const [saleorderList, setSaleOrderList] = useState([])
  const [stageorderList, setStageOrderList] = useState([])
  const [customerOrderList, setCustomerOrderList] = useState([])
  const [EnquiryorderList, setEnquiryOrderList] = useState([])
  const [tableWidth, setTableWidth] = useState('265px')
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const [salesDeptEmployees, setSalesDeptEmployees] = useState([])
  const { Option } = Select
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  // const [selectedEmployee, setSelectedEmployee] = useState("getAll");
  // const [selectedEmployee, setSelectedEmployee] = useState(store.get('employeeId'));

  useEffect(() => {
    getDashboardData()
    getStagelist()
    getCustomerOrderList()
    getEnquiryOrderList()
    getSalesDeptName()
  }, [])
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 40}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const handleChangeEmployee = val => {
    setSelectedEmployee(val)
  }
  const openFiltercard = () => {
    setFilterCards(!filtercards)
  }
  const getDashboardData = async () => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      tenantId,
      projectId: '',
      // empId: employeeId,
      // empId: selectedEmployee === "getall" ? "" : selectedEmployee,
      empId: selectedEmployee,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getSalesOrderDetails',
      requestData: keyareaobj,
    })
    if (response) {
      setSaleOrderList(response.responseData[0])
    }
  }

  const getStagelist = async () => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      tenantId,
      projectId: '',
      // empId: employeeId,
      empId: selectedEmployee,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getSalesStageDtl',
      requestData: keyareaobj,
    })
    if (response) {
      setStageOrderList(response.responseData)
    }
  }

  const getCustomerOrderList = async () => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      tenantId,
      projectId: '',
      // empId: employeeId,
      empId: selectedEmployee,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getCustomerOrderDtl',
      requestData: keyareaobj,
    })
    if (response) {
      setCustomerOrderList(response.responseData)
      setLoading(false)
    }
  }

  const getEnquiryOrderList = async () => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      tenantId,
      projectId: '',
      // empId: employeeId,
      empId: selectedEmployee,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getSalesConvRatio',
      requestData: keyareaobj,
    })
    if (response) {
      setEnquiryOrderList(response.responseData)
    }
  }
  const getSalesDeptName = async () => {
    const keyareaobj = {
      tenantId,
      depCode,
      // empId: selectedEmployee === "getall" ? "" : selectedEmployee,
      empId: employeeId,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getSalesDeptEmployees',
      requestData: keyareaobj,
    })
    if (response) {
      setSalesDeptEmployees(response.responseData)
    }
  }
  useEffect(() => {
    if (salesDeptEmployees.length === 1) {
      setSelectedEmployee(salesDeptEmployees[0].empId)
    }
  }, [salesDeptEmployees])
  return (
    <div
      className="my-3"
      style={
        isMobile
          ? { width: tableWidth, marginLeft: '5px', overflow: 'hidden', padding: '0px 16px' }
          : {}
      }
    >
      <div>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', margin: '10px 0px 0px 0px' }}>
          Sales Dashboard
        </h2>
        <div style={{ position: 'absolute', left: '39px', top: '80px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-filter"
            viewBox="0 0 16 16"
            style={{ cursor: 'pointer' }}
            onClick={openFiltercard}
          >
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
          </svg>
        </div>
      </div>
      <div className="row pb-0">
        {loading ? (
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: 0,
              right: 0,
              bottom: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Spin size="large" tip="Loading..." />
          </div>
        ) : null}
        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 col-12 p-1">
          <LeadChart Datas={saleorderList} />
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 col-12 p-1">
          <WonChart Datas={saleorderList} />
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 col-12 p-1">
          <LostChart Datas={saleorderList} />
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 col-12 p-1">
          <HoldChart Datas={saleorderList} />
        </div>
      </div>

      <div className="row p-0">
        <div className="col-md-12 col-lg-4 col-xl-4 col-sm-12 p-1">
          <Stagewisechart Datas={stageorderList} />
        </div>
        <div className="col-md-12 col-lg-8 col-xl-8 col-sm-12 p-1">
          <Enquiryorderchart Datas={EnquiryorderList} />
        </div>
      </div>
      <div className="row p-0">
        <div className="col-md-12 col-lg-6 col-xl-6 col-sm-12 p-1">
          <CustomerOrderchart Datas={customerOrderList} />
        </div>
        <div className="col-md-12 col-lg-6 col-xl-6 col-sm-12 p-1">
          <OrderContribution
            Datas={customerOrderList}
            slctdFromDate={slctdFromDate}
            slctdToDate={slctdToDate}
            selectedEmployee={selectedEmployee}
          />
        </div>
      </div>
      {filtercards && (
        <FilterEnquiry
          style={{ display: 'left' }}
          cardLabel="Filter Details"
          closeFilterCard={openFiltercard}
          data={[
            {
              key: 1,
              label: 'From Date',
              component: (
                <DatePicker
                  defaultValue={moment(slctdFromDate)}
                  disabledDate={d => !d || d.isAfter(moment())}
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
                  onChange={e => setSlctdFromDate(e)}
                />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker
                  defaultValue={moment(slctdToDate)}
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
                  onChange={e => setSlctdToDate(e)}
                />
              ),
            },
            {
              key: 3,
              label: (
                <span>
                  Employee<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Select
                  style={{ width: '155px' }}
                  // value={selectedEmployee}
                  // placeholder="Select Employee"
                  value={selectedEmployee || 'getall'}
                  onChange={val => handleChangeEmployee(val)}
                >
                  {salesDeptEmployees.length > 1 && (
                    <Option key="getall" value="getall">
                      Get All
                    </Option>
                  )}
                  {salesDeptEmployees?.map(item => (
                    <Option key={item.empId} value={item.empId}>
                      {item.empName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 4,
              component: (
                <div>
                  <Button
                    type="primary"
                    size="medium"
                    text="Submit"
                    onClick={() => {
                      setLoading(true)
                      getDashboardData()
                      getStagelist()
                      getCustomerOrderList()
                      getEnquiryOrderList()
                      openFiltercard()
                      getSalesDeptName()
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      )}
      <div className="row clearfix">
        <div className="col-md-12 col-lg-12 col-xl-12 col-sm-12 p-1">
          <DashboardTableView
            pmId="1"
            selectedMonth={null}
            fromDate={slctdFromDate}
            toDate={slctdToDate}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
