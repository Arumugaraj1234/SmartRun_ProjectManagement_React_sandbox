import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { DatePicker, Row, Col, Card, Table, Form, Select, Checkbox } from 'antd'
import FilterEnquiry from 'components/shared/FilterEnquiry'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
import { FaCircleInfo } from 'react-icons/fa6'
import { TbAlarmAverage } from 'react-icons/tb'
import { GrInProgress } from 'react-icons/gr'
import { MdDateRange } from 'react-icons/md'
import InspectionReportService from 'services/Quality/InspectionReport'
import DashboardTableView from 'components/common/DashboardTblView'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ProjectInProgressModal from './ProjectInProgressModal'
import AverageProjectCompleteModal from './AverageProjectCompleteModal'
import AverageTaskClosureModal from './AverageTaskClosureModal'
import CompletedChart from './CompletedDtlsChart'
import PendingChart from './PendingDtlsChart'

import './index.css'
import './style.css'

const AssemblyDashboard = () => {
  //   const [loading, setLoading] = useState(false)
  const [requirementFrom] = Form.useForm()
  const [filtercards, setFilterCards] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(moment())
  const [widgetdata, setWidgetdata] = useState([])
  const [taskCompletionData, setTaskCompletionData] = useState([])
  const [prjtCmpData, setPrjtCmpData] = useState([])
  const [pendTaskData, setPendTaskData] = useState([])
  const [projectModal, setProjectModal] = useState(false)
  const [avgClsModal, setAvgClsModal] = useState(false)
  const [avgCmptModal, setAvgCmptModal] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [project, setProject] = useState('getall')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')
  const [check, setCheck] = useState(false)

  const { Option } = Select

  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')

  useEffect(() => {
    getProjectData()
    getWidgetResponseCheck()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const openFilterCard = () => {
    setFilterCards(true)
  }
  const handleChangeProject = (val, opt) => {
    setProject(opt.key)
  }
  const Btnscomponent = [
    <div>
      <ButtonComponent type="primary" size="medium" text="Submit" />
      <ButtonComponent type="primary" size="medium" text="Cancel" />
    </div>,
  ]

  const closeFilterCard = () => {
    setFilterCards(false)
  }

  // const completArr = [
  //   {
  //     projId: '31',
  //     projCode: '10013',
  //     openTask: '100',
  //     pendingTask: '1',
  //     completedTask: '50',
  //     completedPer: '50.000000',
  //   },
  //   {
  //     projId: '32',
  //     projCode: '10014',
  //     openTask: '90',
  //     pendingTask: '70',
  //     completedTask: '20',
  //     completedPer: '20.000000',
  //   },
  //   {
  //     projId: '38',
  //     projCode: '10022',
  //     openTask: '105',
  //     pendingTask: '105',
  //     completedTask: '40',
  //     completedPer: '40.500000',
  //   },
  //   {
  //     projId: '40',
  //     projCode: '10023',
  //     openTask: '10',
  //     pendingTask: '6',
  //     completedTask: '2',
  //     completedPer: '20.000000',
  //   },
  // ]
  const getWidgetDtls = async () => {
    const props = {
      monYr: selectedMonth ? moment(selectedMonth).format('YYYY-MM') : moment().format('YYYY-MM'),
      empId,
      tenantId,
      deptCode: 'D06',
      pmId: '4',
      projId: project,
      lifeSpan: check ? '1' : '0',
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getAssyMisWidgetDtl',
      requestData: props,
    })

    if (httpresponse.responseCode === '200') {
      setWidgetdata(httpresponse.responseData)
    } else {
      setWidgetdata([])
    }
  }

  const getProjectComplDtls = async () => {
    const props = {
      monYr: selectedMonth ? moment(selectedMonth).format('YYYY-MM') : moment().format('YYYY-MM'),
      empId,
      tenantId,
      deptCode: 'D06',
      pmId: '4',
      projId: project,
      lifeSpan: check ? '1' : '0',
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getAssyTaskReport',
      requestData: props,
    })

    if (httpresponse.responseCode === '200') {
      setPrjtCmpData(httpresponse.responseData)
    } else {
      setPrjtCmpData([])
    }
  }

  const getProjectData = async () => {
    const response = await InspectionReportService({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        fromDate: '',
        toDate: '',
        tenantId,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setProjectData(response.responseData)
      }
    }
  }

  const getPendingTaskDtls = async () => {
    const props = {
      monYr: selectedMonth ? moment(selectedMonth).format('YYYY-MM') : moment().format('YYYY-MM'),
      empId,
      tenantId,
      deptCode: 'D06',
      pmId: '4',
      projId: project,
      lifeSpan: check ? '1' : '0',
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getAssyDtlTaskReport',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setPendTaskData(httpresponse.responseData)
    } else {
      setPendTaskData([])
    }
  }

  const getProjectActivityDtls = async () => {
    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D06',
      pmId: '4',
      category: '',
      projectId: project,
      lifespan: check ? '1' : '0',
    }
    const httpget = await InspectionReportService({
      requestPath: 'getPlannedActivity',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setTaskCompletionData(httpget.responseData)
    } else {
      setTaskCompletionData([])
    }
  }

  const getWidgetResponseCheck = () => {
    setFilterCards(false)
    getWidgetDtls()
    getProjectActivityDtls()
    getProjectComplDtls()
    getPendingTaskDtls()
  }

  function getSelectedFromDate(value, dateString) {
    setSelectedMonth(dateString)
    requirementFrom.setFieldsValue({
      selectMonthform: moment(dateString),
    })
  }

  const renderprojectComponent = () => {
    return (
      <ProjectInProgressModal
        onmodalCancel={() => {
          setProjectModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const renderAvgClsComponent = () => {
    return (
      <AverageTaskClosureModal
        onmodalCancel={() => {
          setAvgClsModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const renderAvgCompleteComponent = () => {
    return (
      <AverageProjectCompleteModal
        onmodalCancel={() => {
          setAvgCmptModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const taskcolumns = [
    // {
    //   title: 'S.No',
    //   dataIndex: 'sno',
    //   key: 'sno',
    //   width: '10%',
    //   render: (text, record, index) => index + 1,
    // },

    {
      title: 'Activity',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignToDesc',
      key: 'assignToDesc',
    },
    {
      title: 'Completion',
      dataIndex: 'completePtg',
      key: 'completePtg',
      className: 'right-align-cell',
    },
    {
      title: 'Planned Completed Date',
      dataIndex: 'plannedCompletedDate',
      key: 'plannedCompletedDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
  ]

  const getProjectprogressDtls = () => {
    setProjectModal(true)
  }

  const getAvgCmptDtls = () => {
    setAvgCmptModal(true)
  }

  const getAvgClsDtls = () => {
    setAvgClsModal(true)
  }
  const handleCheckboxChange = e => {
    setCheck(e.target.checked)
  }

  const CardComponent = ({ icon: Icon, title, planned, completed, onClick, bgicon, bgicondiv }) => (
    <div
      className="card orange"
      style={{
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        height: 'auto',
        marginBottom: '8px',
        padding: '0px 5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'end', // Vertically center the icons
        }}
      >
        <div className="card icon" style={{ backgroundColor: bgicondiv }}>
          <Icon style={{ color: bgicon }} />
        </div>
        <div style={{ display: 'flex', cursor: 'pointer' }}>
          <FaCircleInfo onClick={onClick} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          marginTop: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            // borderBottom: 'black 1px solid',
            // marginBottom: '5px',
          }}
        >
          <div>
            <h5 style={{ fontWeight: 'bold', fontSize: '15px' }}>{title}</h5>
          </div>
          <div>
            <h5 style={{ fontWeight: 'bold' }}>{planned ? parseInt(planned, 10) : 0}</h5>
          </div>
        </div>
        <div
          style={{
            display: 'none',
            justifyContent: 'space-between',
            fontWeight: 'bold',
          }}
        >
          <div>No. of Planned</div>
          <div>No. of Completed</div>
        </div>
        <div
          style={{
            display: 'none',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ marginLeft: '30px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {planned ? parseInt(planned, 10) : 0}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {completed ? parseInt(completed, 10) : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
  const matchingProject = projectData.find(proj => proj.projectId === project)

  const projectCode = matchingProject ? matchingProject.projectCode : ''

  return (
    <div
      className="app"
      style={isMobile ? { width: tableWidth, height: '300px' } : { height: '300px' }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ textAlign: 'center', flex: '1' }}>
            <h2
              style={
                !isMobile
                  ? {
                      fontWeight: '700',
                      fontFamily: 'Arial, sans-serif',
                      color: 'black',
                    }
                  : {
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '20px',
                    }
              }
            >
              Assembly Dashboard {project === 'getall' ? '' : projectCode ? `- ${projectCode}` : ''}
            </h2>
          </div>
          <div
            style={
              !isMobile
                ? { position: 'absolute', left: '30px' }
                : { position: 'absolute', left: '40px', marginBottom: '10px' }
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-filter"
              viewBox="0 0 16 16"
              style={{ cursor: 'pointer' }}
              onClick={openFilterCard}
            >
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
            </svg>
          </div>
        </div>
        <div>
          <div className="dashboard">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={8} lg={8}>
                <CardComponent
                  icon={GrInProgress}
                  title="Project in progress"
                  planned={widgetdata?.[0]?.projCnt}
                  completed={0}
                  onClick={() => getProjectprogressDtls()}
                  bgicondiv="#8dc4f9"
                  bgicon="#3b8edc"
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <CardComponent
                  icon={TbAlarmAverage}
                  title="Average Task Closure in Days"
                  planned={
                    widgetdata?.[0]?.avgTasktime ? `${widgetdata?.[0]?.avgTasktime} Days` : '0'
                  }
                  completed={0}
                  onClick={() => getAvgClsDtls()}
                  bgicondiv="#adf7c0"
                  bgicon="#2ed358"
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <CardComponent
                  icon={MdDateRange}
                  title="Average Project Completion in Days"
                  planned={
                    widgetdata?.[0]?.avgProjtime ? `${widgetdata?.[0]?.avgProjtime} Days` : '0'
                  }
                  completed={0}
                  onClick={() => getAvgCmptDtls()}
                  bgicondiv="#f7e3cb"
                  bgicon="#cc9f67"
                />
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card
                      bordered={false}
                      style={{
                        boxShadow:
                          'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                        borderRadius: '10px',
                        height: '210px',
                      }}
                    >
                      <CompletedChart Datas={prjtCmpData} title="Project Completion Summary" />
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div style={{ padding: '0px' }}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          height: '210px',
                          marginTop: '10px',
                        }}
                      >
                        <PendingChart Datas={pendTaskData} title="Pending Task Details" />
                      </Card>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow:
                      'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                    borderRadius: '10px',
                    height: '435px',
                  }}
                >
                  <div style={{ height: '100%' }}>
                    <Table
                      className="custom-table"
                      dataSource={taskCompletionData}
                      columns={taskcolumns}
                      size="small"
                      pagination={{
                        pageSizeOptions: ['10', '20', '30', '50', [taskCompletionData?.length]],
                        showSizeChanger: true,
                        defaultPageSize: 50,
                      }}
                      scroll={{ y: 270 }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        {projectModal ? (
          <ModalPopup
            isModalVisible={projectModal}
            FieldsComponent={renderprojectComponent}
            text="Project in Progress Details"
            onCancel={() => {
              setProjectModal(false)
            }}
            width="500"
          />
        ) : null}
        {avgClsModal ? (
          <ModalPopup
            isModalVisible={avgClsModal}
            FieldsComponent={renderAvgClsComponent}
            text="Average Task Closure Time Details"
            onCancel={() => {
              setAvgClsModal(false)
            }}
            width="500"
          />
        ) : null}
        {avgCmptModal ? (
          <ModalPopup
            isModalVisible={avgCmptModal}
            FieldsComponent={renderAvgCompleteComponent}
            text="Average Project Completion Details"
            onCancel={() => {
              setAvgCmptModal(false)
            }}
            width="500"
          />
        ) : null}
        {filtercards && (
          <FilterEnquiry
            closeFilterCard={closeFilterCard}
            Btnscomponent={Btnscomponent}
            style={{ float: 'center' }}
            cardLabel="Filter Details"
            data={[
              {
                key: 1,
                label: (
                  <span>
                    Select Month<span style={{ color: 'red' }}>*</span> <span>Life span</span>
                  </span>
                ),
                component: (
                  <Form form={requirementFrom} style={{ width: '58%' }}>
                    <Form.Item name="selectMonthform" initialValue={moment()}>
                      <DatePicker
                        style={{ width: '155px' }}
                        picker="month"
                        format="YYYY-MM"
                        onChange={getSelectedFromDate}
                        value={moment()}
                      />
                    </Form.Item>
                    <Form.Item
                      name="lifespan"
                      style={{ marginBottom: '0px', marginTop: '-23px', textAlign: 'left' }}
                    >
                      <Checkbox onChange={handleCheckboxChange} checked={check} />
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 2,
                label: (
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>
                  </span>
                ),
                component: (
                  <Select
                    style={{ width: '155px' }}
                    value={project}
                    placeholder="Select Project"
                    onChange={(val, opt) => handleChangeProject(val, opt)}
                  >
                    <Option key="getall" value="getall">
                      Get All
                    </Option>
                    {projectData?.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                  </Select>
                ),
              },
              {
                key: 3,
                component: (
                  <div style={{ paddingLeft: 5 }}>
                    <ButtonComponent
                      type="primary"
                      size="medium"
                      text="Submit"
                      onClick={() => getWidgetResponseCheck()}
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <DashboardTableView pmId="4" selectedMonth={selectedMonth} fromDate={null} toDate={null} />
      </div>
    </div>
  )
}

export default AssemblyDashboard
