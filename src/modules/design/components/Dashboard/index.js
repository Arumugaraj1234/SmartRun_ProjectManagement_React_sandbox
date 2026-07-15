import React, { useState, useEffect } from 'react'
import { Table, DatePicker, Row, Col, Card, Skeleton, Form, Select, Checkbox, Spin } from 'antd'
import { MdOutlineDraw, MdDownloadDone } from 'react-icons/md'
import { FaCircleInfo } from 'react-icons/fa6'
import { GrCompliance } from 'react-icons/gr'
import { SiTicktick } from 'react-icons/si'
import './style.css'
import './index.css'
import moment from 'moment'
import store from 'store'
import 'antd/dist/antd.css'
import { useMediaQuery } from 'react-responsive'
import InspectionReportService from 'services/Quality/InspectionReport'
import FilterEnquiry from 'components/shared/FilterEnquiry'
import DashboardTableView from 'components/common/DashboardTblView'
import ButtonComponent from 'components/shared/ButtonComponent'
import { IoRefreshOutline } from 'react-icons/io5'
import ModalPopup from 'components/shared/ModalPopupComponent'
import DrawingDtlsModal from './DrawingDtlsModal'
import DapDtlsModal from './DapDtlsModal'
import ProjectManualModal from './ProjectManualModal'

// import Widget from '../Widget'

const DesignDashboard = () => {
  const [requirementFrom] = Form.useForm()
  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  const [filtercards, setFilterCards] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(moment())
  const [drawingArr, setDrawingArr] = useState([])
  const [dapArr, setDapArr] = useState([])
  const [projectManualArr, setProjectManualArr] = useState([])
  const [projectData, setProjectData] = useState([])
  const [activityData, setActivityData] = useState([])
  const [filterinfo, setfilterinfo] = useState([])
  const [filterData, setFilterData] = useState([])
  const [filterwk, setFilterwk] = useState([])
  const [filterml, setFilterml] = useState([])
  const [projectLoading, setProjectLoading] = useState(false)
  const [drStsModal, setDrStsModal] = useState(false)
  const [dapStsModal, setDapStsModal] = useState(false)
  const [prmStsModal, setPrmStsModal] = useState(false)
  const [weekWiseData, setWeekWiseData] = useState([])
  const [monthWiseData, setMonthWiseData] = useState([])
  const [projectDwnData, setProjectDwnData] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')
  const [project, setProject] = useState('getall')
  const [check, setCheck] = useState(false)
  const [loading, setLoading] = useState(true)
  const { Option } = Select

  const openFilterCard = () => {
    setFilterCards(true)
  }
  const Btnscomponent = [
    <div>
      <ButtonComponent type="primary" size="medium" text="Submit" />
      <ButtonComponent type="primary" size="medium" text="Cancel" />
    </div>,
  ]

  // const monthFormat = 'MMM-YYYY';

  useEffect(() => { }, [selectedMonth])
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
  useEffect(() => {
    getProjectData()
    getWidgetResponseCheck()
    getPlannedProjectDtls()
    getProjectActivityDtls()
    getMonthwiseDataList()
    getWeekwiseDataList()
  }, [])
  const handlePageChange = (page, filters) => {
    setfilterinfo(filters)
  }

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

  const handleDataChangewk = (page, filters) => {
    setFilterwk(filters)
  }
  const handleDataChangeml = (page, filters) => {
    setFilterml(filters)
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
        setProjectDwnData(response.responseData)
      }
    }
  }
  // const getColumnSearchProps = dataIndex => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div
  //       role="button"
  //       tabIndex={0}
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={e => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0] || ''}
  //         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: 'block',
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Reset
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             confirm({
  //               closeDropdown: false,
  //             })
  //             setSearchText(selectedKeys[0])
  //             setSearchedColumn(dataIndex)
  //           }}
  //         >
  //           Filter
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close()
  //           }}
  //         >
  //           Close
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: filtered => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? '#1890ff' : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex]
  //       .toString()
  //       .toLowerCase()
  //       .includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: visible => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100)
  //     }
  //   },
  //   render: text =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: '#ffc069',
  //           padding: 0,
  //         }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ''}
  //       />
  //     ) : (
  //       text
  //     ),
  // })

  const renderDrawingComponent = () => {
    return (
      <DrawingDtlsModal
        onmodalCancel={() => {
          setDrStsModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const renderDapComponent = () => {
    return (
      <DapDtlsModal
        onmodalCancel={() => {
          setDapStsModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const renderProjectManualComponent = () => {
    return (
      <ProjectManualModal
        onmodalCancel={() => {
          setPrmStsModal(false)
        }}
        selectedMonth={selectedMonth}
        project={project}
      />
    )
  }

  const getWeekwiseDataList = async () => {
    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: '',
      projectId: project,
    }

    const httpget = await InspectionReportService({
      requestPath: 'getTaskCompPerBymonth',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setWeekWiseData(httpget.responseData)
      setLoading(false)
    } else {
      setWeekWiseData([])
      setLoading(false)
    }
  }

  const getMonthwiseDataList = async () => {
    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: '',
      projectId: project,
    }

    const httpget = await InspectionReportService({
      requestPath: 'getTaskCompPerByYear',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      const updatedData = httpget?.responseData?.map(item => {
        return {
          ...item,
          reportedDateMonth: `${monthNames[item?.reportmonth]}-${item?.reportyear}`,
        }
      })
      setMonthWiseData(updatedData)
    } else {
      setMonthWiseData([])
    }
  }

  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm()
  //   setSearchText(selectedKeys[0])
  //   setSearchedColumn(dataIndex)
  // }

  // const handleReset = clearFilters => {
  //   clearFilters()
  //   setSearchText('')
  // }

  const projectCodes1 = []
  const projectName1 = []

  projectData.map(h => {
    return projectCodes1.push(h.projectCode)
  })
  projectData.map(h => {
    return projectName1.push(h.projectName)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const projectCodes2 = projectCodes1.filter(distinctval)
  const projectName2 = projectName1.filter(distinctval)

  const projectCodes3 = []
  const projectName3 = []

  projectCodes2.map(element => {
    return projectCodes3.push({
      text: element,
      value: element,
    })
  })

  projectName2.map(element => {
    return projectName3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '5%',
      // ...getColumnSearchProps('sno'),
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCodes3,
      filteredValue: filterData.projectCode,
      onFilter: (value, record) => record.projectCode !== null && record.projectCode === value,
      // ...getColumnSearchProps('projectCode'),
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filterData.projectName,
      onFilter: (value, record) => record?.projectName === value,
      // ...getColumnSearchProps('projectName'),
    },
    {
      title: 'Total No. of Drawing Planned to Release',
      dataIndex: 'totalDrawing',
      key: 'totalDrawing',
      className: 'right-align-cell',
      // ...getColumnSearchProps('totalDrawing'),
      sorter: {
        compare: (a, b) => a.totalDrawing - b.totalDrawing,
        multiple: 3,
      },
    },
    {
      title: 'No. of Drawing Released',
      dataIndex: 'completedDrawing',
      key: 'completedDrawing',
      className: 'right-align-cell',
      // ...getColumnSearchProps('completedDrawing'),
      sorter: {
        compare: (a, b) => a.completedDrawing - b.completedDrawing,
        multiple: 2,
      },
    },
    {
      title: 'Planned DAP End Date',
      dataIndex: 'dapPlannedDate',
      key: 'dapPlannedDate',
      // render: text => (text !== '0' ? moment(text).format('DD-MMM-YYYY') : '-'),
      render: (text, record) => {
        const diff =
          record.dapActualDate && record.dapActualDate !== '0'
            ? moment(record.dapActualDate).diff(moment(record.dapPlannedDate), 'days')
            : moment(record.dapPlannedDate).diff(moment(), 'days')
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ textAlign: 'left' }}>
              {record.dapPlannedDate ? moment(record.dapPlannedDate).format('DD-MMM-YYYY') : '-'}{' '}
              <span style={{ color: diff < 0 ? 'red' : 'green', textAlign: 'right' }}>
                {!Number.isNaN(diff) ? `(${diff})` : ''}
              </span>
            </span>
            <span>
              {!Number.isNaN(diff) ? diff > 0 ? <MdDownloadDone /> : <IoRefreshOutline /> : ''}
            </span>
          </div>
        )
      },
    },

    {
      title: 'Planned Manual end Date ',
      dataIndex: 'manualPlannedDate',
      key: 'manualPlannedDate',
      render: (text, record) => {
        const diff =
          record.manualActualDate && record.manualActualDate !== '0'
            ? moment(record.manualActualDate).diff(moment(record.manualPlannedDate), 'days')
            : moment(record.manualPlannedDate).diff(moment(), 'days')
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ textAlign: 'left' }}>
              {record.manualPlannedDate
                ? moment(record.manualPlannedDate).format('DD-MMM-YYYY')
                : '-'}{' '}
              <span style={{ color: diff < 0 ? 'red' : 'green', textAlign: 'right' }}>
                {!Number.isNaN(diff) ? `(${diff})` : ''}
              </span>
            </span>

            <span>
              {!Number.isNaN(diff) ? diff > 0 ? <MdDownloadDone /> : <IoRefreshOutline /> : ''}
            </span>
          </div>
        )
      },
    },
    // {
    //   title: 'Delay in Days',
    //   dataIndex: 'actstartdate',
    //   key: 'actstartdate',
    //   ...getColumnSearchProps('actstartdate'),
    //   sorter: {
    //     compare: (a, b) => a.actstartdate - b.actstartdate,
    //     multiple: 1,
    //   },
    // },
  ]

  const handleCheckboxChange = () => {
    const checkboxValue = requirementFrom.getFieldValue('lifespan')
    console.log('Checkbox value:', checkboxValue)
    setCheck(checkboxValue)
  }

  const CardComponent = ({ icon: Icon, title, planned, completed, onClick, bgicon, bgicondiv }) => (
    <div
      className="card orange"
      style={{
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        height: 'auto',
        padding: '1px 5px', // Add some padding for better layout
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
          paddingTop: '15px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: 'black 1px solid',
            marginBottom: '10px', // Adjusted margin
          }}
        >
          <div>
            <h4 style={{ fontWeight: 'bold', margin: '0px' }}>{title}</h4>
          </div>
          <div>
            <h5 style={{ fontWeight: 'bold', margin: '0px' }}>
              {moment(selectedMonth).format('MMM-YYYY')}
            </h5>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
          }}
        >
          <div>No. of Planned</div>
          <div>No. of Completed</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ marginLeft: '30px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{planned}</span>
          </div>
          <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{completed}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const getWidgetResponseCheck = () => {
    setLoading(true)
    setFilterCards(false)
    getWidgetResponse('TC022')
    getWidgetResponse('TC009,TC023')
    getWidgetResponse('getall')
    getPlannedProjectDtls()
    getProjectActivityDtls()
    getMonthwiseDataList()
    getWeekwiseDataList()
  }

  const getPlannedProjectDtls = async () => {
    setProjectLoading(true)

    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: '',
      projectId: project,
      lifespan: check ? '1' : '0',
    }
    const httpget = await InspectionReportService({
      requestPath: 'getPlannedProject',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setProjectData(httpget.responseData)
      setProjectLoading(false)
    } else {
      setProjectData([])
      setProjectLoading(false)
    }
  }
  const getProjectActivityDtls = async () => {
    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: '',
      projectId: project,
      lifespan: check ? '1' : '0',
    }
    const httpget = await InspectionReportService({
      requestPath: 'getPlannedActivity',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setActivityData(httpget.responseData)
    } else {
      setActivityData([])
    }
  }

  const getWidgetResponse = async catCode => {
    const props = {
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: catCode,
      projectId: project,
      lifespan: check ? '1' : '0',
    }
    const httpget = await InspectionReportService({
      requestPath: 'getDesignWidgetDtl',
      requestData: props,
    })

    if (catCode === 'TC022') {
      if (httpget.responseCode === '200') {
        setDapArr(httpget.responseData)
      } else {
        setDapArr([])
      }
    } else if (catCode === 'TC009,TC023') {
      if (httpget.responseCode === '200') {
        setProjectManualArr(httpget.responseData)
      } else {
        setProjectManualArr([])
      }
    } else if (catCode === 'getall') {
      if (httpget.responseCode === '200') {
        setDrawingArr(httpget.responseData)
      } else {
        setDrawingArr([])
      }
    }
  }

  // const onValuesChange = (_, allValues) => {
  //   setSelectedMonth(allValues.selectedmonth);
  //   getWidgetResponse(allValues.selectedmonth)
  // };

  const monthNames = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  }

  const closeFilterCard = () => {
    setFilterCards(false)
  }
  function getSelectedFromDate(value, dateString) {
    setSelectedMonth(dateString)
    requirementFrom.setFieldsValue({
      selectMonthform: moment(dateString),
    })
  }

  const assignto1 = []
  const project1 = []
  const activity1 = []
  const projectCode1 = []

  activityData.map(h => {
    return assignto1.push(h.assignToDesc)
  })
  activityData.map(h => {
    return project1.push(h.projectName)
  })
  activityData.map(h => {
    return activity1.push(h.activityName)
  })
  activityData.map(h => {
    return projectCode1.push(h.projectCode)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const assignto2 = assignto1.filter(distinct)
  const project2 = project1.filter(distinct)
  const activity2 = activity1.filter(distinct)
  const projectCode2 = projectCode1.filter(distinct)

  const assignto3 = []
  const project3 = []
  const activity3 = []
  const projectCode3 = []

  assignto2.map(element => {
    return assignto3.push({
      text: element,
      value: element,
    })
  })
  project2.map(element => {
    return project3.push({
      text: element,
      value: element,
    })
  })
  activity2.map(element => {
    return activity3.push({
      text: element,
      value: element,
    })
  })
  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })

  const columnplns = [
    {
      title: 'S.no',
      dataIndex: 'sno',
      key: 'sno',
      width: '10%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'assignToDesc',
      key: 'assignToDesc',
      filters: assignto3,
      filteredValue: filterinfo.assignToDesc,
      onFilter: (value, record) => record?.assignToDesc === value,
    },
    {
      title: 'Planned',
      children: [
        {
          title: 'Project number',
          dataIndex: 'projectCode',
          key: 'projectCode',
          filters: projectCode3,
          filteredValue: filterinfo.projectCode,
          onFilter: (value, record) => record?.projectCode === value,
        },
        {
          title: 'Project name',
          dataIndex: 'projectName',
          key: 'projectName',
          filters: project3,
          filteredValue: filterinfo.projectName,
          onFilter: (value, record) => record?.projectName === value,
        },
        {
          title: 'Activity',
          dataIndex: 'activityName',
          key: 'activityName',
          filters: activity3,
          filteredValue: filterinfo.activityName,
          onFilter: (value, record) => record?.activityName === value,
        },
        {
          title: 'Start Date',
          dataIndex: 'actualStartDate',
          key: 'actualStartDate',
          render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
        },
        {
          title: 'End Date',
          dataIndex: 'plannedCompletedDate',
          key: 'plannedCompletedDate',
          render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
        },
      ],
    },
  ]

  //   for (let i = 1; i <= 10; i=i+1) {
  //     dataplantbl.push({
  //       key: i,
  //       sno: i,
  //       name: '',
  //       projectNumber: '',
  //       projectName: '',
  //       activity: '',
  //       startDate: '',
  //       endDate: '',
  //     });
  //   }

  const employeeName1 = []
  const weekStart1 = []
  const percentageCompleted1 = []

  weekWiseData.map(h => {
    return employeeName1.push(h.employeeName)
  })
  weekWiseData.map(h => {
    return weekStart1.push(h.weekStart)
  })
  weekWiseData.map(h => {
    return percentageCompleted1.push(h.percentageCompleted)
  })

  const distinctwk = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const employeeName2 = employeeName1.filter(distinctwk)
  const weekStart2 = weekStart1.filter(distinctwk)
  const percentageCompleted2 = percentageCompleted1.filter(distinctwk)
  const employeeName3 = []
  const weekStart3 = []
  const percentageCompleted3 = []

  employeeName2.map(element => {
    return employeeName3.push({
      text: element,
      value: element,
    })
  })
  weekStart2.map(element => {
    return weekStart3.push({
      text: element,
      value: element,
    })
  })
  percentageCompleted2.map(element => {
    return percentageCompleted3.push({
      text: element,
      value: element,
    })
  })

  const columnsweekly = [
    {
      title: 'Weekly on time completion %',
      children: [
        {
          title:
            'Total number of weekly planned completed activity in weekly planned activity / Total number of planned activity',
          children: [
            {
              title: 'Assigned User',
              dataIndex: 'employeeName',
              key: 'employeeName',
              filters: employeeName3,
              filteredValue: filterwk.employeeName,
              onFilter: (value, record) =>
                record.employeeName !== null && record.employeeName === value,
              // width: 150,
            },
            {
              title: 'Week Start Date',
              dataIndex: 'weekStart',
              key: 'weekStart',
              // width: 150,
              filters: weekStart3,
              filteredValue: filterwk.weekStart,
              onFilter: (value, record) => record.weekStart !== null && record.weekStart === value,
              render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
            },
            {
              title: 'Total number of planned activity',
              dataIndex: 'noPlannedTask',
              key: 'noPlannedTask',
              // width: 150,
              // ...getColumnSearchProps('totalPlanned'),
            },
            {
              title: 'Total number of completed activity',
              dataIndex: 'noCompltedTask',
              key: 'noCompltedTask',
              // width: 150,
            },
            {
              title: 'Total number of Delayed activity',
              dataIndex: 'delayTask',
              key: 'delayTask',
              // width: 150,
            },
            {
              title: 'Completed %',
              dataIndex: 'percentageCompleted',
              key: 'percentageCompleted',
              filters: percentageCompleted3,
              filteredValue: filterwk.percentageCompleted,
              onFilter: (value, record) =>
                record.percentageCompleted !== null && record.percentageCompleted === value,
              // width: 100,
              render: text => (text ? parseFloat(text).toFixed(2) : '0.00'),
            },
          ],
        },
      ],
    },
  ]

  const employeeNameml1 = []
  const reportmonth1 = []
  const percentageCompletedml1 = []

  monthWiseData.map(h => {
    return employeeNameml1.push(h.employeeName)
  })
  monthWiseData.map(h => {
    return reportmonth1.push(h.reportedDateMonth)
  })
  monthWiseData.map(h => {
    return percentageCompletedml1.push(h.percentageCompleted)
  })

  const distinctml = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const employeeNameml2 = employeeNameml1.filter(distinctml)
  const reportmonth2 = reportmonth1.filter(distinctml)
  const percentageCompletedml2 = percentageCompletedml1.filter(distinctml)

  const employeeNameml3 = []
  const reportmonth3 = []
  const percentageCompletedml3 = []

  employeeNameml2.map(element => {
    return employeeNameml3.push({
      text: element,
      value: element,
    })
  })
  reportmonth2.map(element => {
    return reportmonth3.push({
      text: element,
      value: element,
    })
  })
  percentageCompletedml2.map(element => {
    return percentageCompletedml3.push({
      text: element ? parseFloat(element)?.toFixed(2) : element,
      value: element,
    })
  })

  const columnsmonthly = [
    {
      title: 'Monthly on time completion %',
      children: [
        {
          title:
            'Total number of monthly planned completed activity in monthly planned activity / Total number of planned activity',
          children: [
            {
              title: 'Assigned User',
              dataIndex: 'employeeName',
              key: 'employeeName',
              filters: employeeNameml3,
              filteredValue: filterml.employeeName,
              onFilter: (value, record) =>
                record.employeeName !== null && record.employeeName === value,
              // width: 150,
            },
            {
              title: 'Month',
              dataIndex: 'reportedDateMonth',
              key: 'reportedDateMonth',
              // width: 150,
              filters: reportmonth3,
              filteredValue: filterml.reportedDateMonth,
              onFilter: (value, record) =>
                record.reportedDateMonth !== null && record.reportedDateMonth === value,
              // render: (text, record) => {
              //   const formattedDate = `${monthNames[record.reportmonth]}-${record.reportyear}`
              //   return <span>{formattedDate}</span>
              // },
            },
            {
              title: 'Total number of planned activity',
              dataIndex: 'noPlannedTask',
              key: 'noPlannedTask',
              // width: 150,
            },
            {
              title: 'Total number of completed activity',
              dataIndex: 'noCompltedTask',
              key: 'noCompltedTask',
              // width: 150,
            },
            {
              title: 'Completed %',
              dataIndex: 'percentageCompleted',
              key: 'percentageCompleted',
              filters: percentageCompletedml3,
              filteredValue: filterml.percentageCompleted,
              onFilter: (value, record) =>
                record.percentageCompleted !== null && record.percentageCompleted === value,
              // width: 100,
              render: text => (text ? parseFloat(text).toFixed(2) : '0.00'),
            },
          ],
        },
      ],
    },
  ]

  const getDrawingModalViewDtls = () => {
    setDrStsModal(true)
  }

  const getDapModalViewDtls = () => {
    setDapStsModal(true)
  }

  const getprojectModalViewDtls = () => {
    setPrmStsModal(true)
  }
  const handleChangeProject = (_val, opt) => {
    setProject(opt.key)
  }

  const matchingProject = projectDwnData.find(proj => proj.projectId === project)
  const projectCode = matchingProject ? matchingProject.projectCode : ''
  return (
    <div
      className="app"
      style={isMobile ? { width: tableWidth, height: '300px' } : { height: '300px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        <div style={{ textAlign: 'center', flex: '1' }}>
          <h2
            style={
              !isMobile
                ? {
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                }
                : {
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  fontSize: '18px',
                  marginBottom: '30px',
                }
            }
          >
            Design Dashboard {project === 'getall' ? '' : projectCode ? `- ${projectCode}` : ''}
          </h2>
        </div>
        <div
          style={
            !isMobile
              ? { position: 'absolute', left: '30px' }
              : { position: 'absolute', left: '45px', marginBottom: '20px' }
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
        {loading ? (
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: 0,
              right: 0,
              bottom: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Spin size="large" tip="Loading..." />
          </div>
        ) : null}
        <div className="dashboard">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={8} lg={8}>
              <CardComponent
                icon={MdOutlineDraw}
                title="Drawing - Status"
                planned={drawingArr?.[0]?.totalQty || 0}
                completed={drawingArr?.[0]?.completedQty || 0}
                onClick={getDrawingModalViewDtls}
                bgicondiv="#8dc4f9"
                bgicon="#3b8edc"
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <CardComponent
                icon={SiTicktick}
                title="DAP - Status"
                planned={dapArr?.[0]?.totalQty || 0}
                completed={dapArr?.[0]?.completedQty || 0}
                onClick={getDapModalViewDtls}
                bgicondiv="#adf7c0"
                bgicon="#2ed358"
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <CardComponent
                icon={GrCompliance}
                title="Project Manual - Status"
                planned={projectManualArr?.[0]?.totalQty || 0}
                completed={projectManualArr?.[0]?.completedQty || 0}
                onClick={getprojectModalViewDtls}
                bgicondiv="#f7e3cb"
                bgicon="#cc9f67"
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* <Divider  /> */}
      {/* <div style={{ width: '300px', height: '180px' }}> */}

      {/* </div> */}
      <div>
        <Card
          bordered={false}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            borderRadius: '10px',
          }}
        >
          <div className="tableheight">
            <Skeleton active loading={projectLoading}>
              <Table
                dataSource={projectData}
                columns={columns}
                size="small"
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [projectData?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 50,
                }}
                scroll={{ y: 240 }}
                onChange={handleDataChange}
              />
            </Skeleton>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Card
          bordered={false}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
            borderRadius: '10px',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Skeleton active loading={projectLoading}>
                <Table
                  columns={columnplns}
                  dataSource={activityData}
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ y: 400 }} // Adjust scroll height as needed
                  onChange={handlePageChange}
                />
              </Skeleton>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Skeleton active loading={projectLoading}>
                <Table
                  columns={columnsweekly}
                  dataSource={weekWiseData}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ y: 200 }} // Adjust scroll height as needed
                  handleChange={handleDataChangewk}
                />
              </Skeleton>
              <Skeleton active loading={projectLoading}>
                <Table
                  columns={columnsmonthly}
                  dataSource={monthWiseData}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ y: 200 }} // Adjust scroll height as needed
                  style={{ marginTop: '10px' }}
                  handleChanges={handleDataChangeml}
                />
              </Skeleton>
            </Col>
          </Row>
        </Card>
      </div>

      {drStsModal ? (
        <ModalPopup
          isModalVisible={drStsModal}
          FieldsComponent={renderDrawingComponent}
          text="Drawing Details"
          onCancel={() => {
            setDrStsModal(false)
          }}
          width="500"
        />
      ) : null}
      {dapStsModal ? (
        <ModalPopup
          isModalVisible={dapStsModal}
          FieldsComponent={renderDapComponent}
          text="DAP Details"
          onCancel={() => {
            setDapStsModal(false)
          }}
          width="500"
        />
      ) : null}
      {prmStsModal ? (
        <ModalPopup
          isModalVisible={prmStsModal}
          FieldsComponent={renderProjectManualComponent}
          text="Project Manual Details"
          onCancel={() => {
            setPrmStsModal(false)
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
                  Select Month<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Form form={requirementFrom} style={{ width: '58%', height: '35px' }}>
                  <Form.Item name="selectMonthform" initialValue={moment()}>
                    <DatePicker
                      style={{ width: '155px' }}
                      picker="month"
                      format="YYYY-MM"
                      onChange={getSelectedFromDate}
                      value={moment()}
                    />
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 2,
              label: <span>Life span</span>,
              component: (
                <Form form={requirementFrom} style={{ width: '58%', height: '35px' }}>
                  <Form.Item
                    name="lifespan"
                    valuePropName="checked" // To bind checked state with the form value
                    style={{ marginBottom: '0px', textAlign: 'left', marginRight: '135px' }}
                  >
                    <Checkbox onChange={handleCheckboxChange} />
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 3,
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
                  {projectDwnData?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 4,
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
      <div className="row">
        <div className="col-md-12 col-lg-12 col-xl-12 col-sm-12 p-1">
          <DashboardTableView
            pmId="2"
            selectedMonth={selectedMonth}
            fromDate={null}
            toDate={null}
          />
        </div>
      </div>
    </div>
  )
}

export default DesignDashboard
