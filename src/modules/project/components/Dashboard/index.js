import React, { useState, useEffect } from 'react'
import { Select, DatePicker, Table, Spin } from 'antd'
import './index.css'
import store from 'store'
import moment from 'moment'
import { useMediaQuery } from 'react-responsive'
import DashboardTableView from 'components/common/DashboardTblView'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import FilterEnquiry from '../../../../components/shared/FilterEnquiry'
import Button from '../../../../components/shared/ButtonComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import LineChart from '../LineChart'
import Widget from '../Widget'

const QualityDashboard = () => {
  const MenulistData = store.get('MenuListData')
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

  // const [empDtlform] = Form.useForm()
  const currDate = new Date().toISOString().split('T')[0]
  // const currntdate = moment(currDate).format('YYYY-MM-DD')
  const currntdateYear = moment(currDate).format('YYYY-MM')
  const [widgetData, setWidgetData] = useState([])
  const [milestoneData, setMilestoneData] = useState([])
  // const [empData, setEmpData] = useState([])
  const [teamMemberData, setTeamMemberData] = useState([])
  const [projCount, setProjCount] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(defaultToDate)
  const [milestoneDate, setMileStoneDate] = useState(currntdateYear)
  const [project, setProject] = useState(null)
  const [indent, setIndent] = useState(null)
  const [indentType, setIndentType] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [filtersinfo1, setfilterinfo1] = useState([])
  const [filtersinfo2, setfilterinfo2] = useState([])
  const [modalView, setModalView] = useState(false)
  const [drillDownData, setDrilldownData] = useState([])
  const [projectData, setProjectData] = useState([])
  const [workLoadData, setWorkLoadData] = useState([])
  const { Option } = Select
  const empId = store.get('employeeId')
  const tenantID = store.get('tenantId')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleChange1 = (pagination, filters) => {
    setfilterinfo1(filters)
  }

  // mileStone data
  const department1 = []
  const projectCode1 = []
  const plannedStartDate1 = []
  const plannedEndDate1 = []
  const actualEndDate1 = []

  if (milestoneData && milestoneData.length > 0) {
    milestoneData.map(h => {
      return department1.push(h.department)
    })
    milestoneData.map(h => {
      return projectCode1.push(h.projectCode)
    })
    milestoneData.map(h => {
      return plannedStartDate1.push(h.plannedStartDate)
    })
    milestoneData.map(h => {
      return plannedEndDate1.push(h.plannedEndDate)
    })
    teamMemberData.map(h => {
      return actualEndDate1.push(h.actualEndDate)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const department2 = department1.filter(distinct)
  const projectCode2 = projectCode1.filter(distinct)
  const plannedStartDate2 = plannedStartDate1.filter(distinct)
  const plannedEndDate2 = plannedEndDate1.filter(distinct)
  const actualEndDate2 = actualEndDate1.filter(distinct)

  const department3 = []
  const projectCode3 = []
  const plannedStartDate3 = []
  const plannedEndDate3 = []
  const actualEndDate3 = []

  department2.map(element => {
    return department3.push({
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
  plannedStartDate2.map(element => {
    return plannedStartDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  plannedEndDate2.map(element => {
    return plannedEndDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  actualEndDate2.map(element => {
    return actualEndDate3.push({
      text: element,
      value: element,
    })
  })

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

  // workload management data
  const distinct1 = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const empCode1 = []
  const empName1 = []
  const noofProject1 = []

  if (workLoadData && workLoadData.length > 0) {
    workLoadData.map(h => {
      return empCode1.push(h.empCode)
    })
    workLoadData.map(h => {
      return empName1.push(h.employeeName)
    })
    workLoadData.map(h => {
      return noofProject1.push(h.invProject)
    })
  }

  const empCode2 = empCode1.filter(distinct1)
  const empName2 = empName1.filter(distinct1)
  const noofProject2 = noofProject1.filter(distinct1)

  const empCode3 = []
  const empName3 = []
  const noofProject3 = []

  empCode2.map(element => {
    return empCode3.push({
      text: element,
      value: element,
    })
  })
  empName2.map(element => {
    return empName3.push({
      text: element,
      value: element,
    })
  })
  noofProject2.map(element => {
    return noofProject3.push({
      text: element,
      value: element,
    })
  })

  useEffect(() => {
    getWidgetDetails()
    getQualityProjCnt()
    getTeamMemberLoad()
    getKeyCategory()
    getPMWorkLoad()
    getIndentProjectDtlsByDate()
  }, [])

  useEffect(() => {
    getPMMilestoneByMonthYr()
  }, [milestoneDate])

  const handleClick = () => {
    getPMReportTracker()
    setModalView(true)
  }
  const handleCancel = () => {
    setModalView(false)
    setfilterinfo2({})
  }

  const getPMReportTracker = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPMReportTracker',
      requestData: {
        pmHdrId: project !== null ? project : 'getAll',
        tenantId: tenantID,
        sbcCode: 'getall',
        fromDate,
        endDate: toDate,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setDrilldownData(response?.responseData)
      }
    }
  }

  

  const getKeyCategory = async () => {
    const response = await indentFileUpload({
      requestPath: 'getKeyCategory',
      requestData: {
        documentTypeCode: 'DC017',
        enquiryId: '',
        tenantId: tenantID,
      },
    })

    if (response) {
      if (response.responseCode === '200') {
        setIndentType(response?.responseData)
      }
    }
  }

  const getWidgetDetails = async () => {
    setFilterOpen(false)
    const response = await indentFileUpload({
      requestPath: 'getPMWidgetDtl',
      requestData: {
        tenantId: tenantID,
        sbcCode: indent === null ? 'getall' : indent,
        pmHdrId: project == null ? 'getall' : project,
        fromDate: moment(fromDate).format('YYYY-MM-DD'),
        endDate: moment(toDate).format('YYYY-MM-DD'),
      },
    })

    if (response) {
      if (response.responseCode === '200') {
        setWidgetData(response?.responseData)
      }
    }
  }
  // const getEmployeeForDepartment = async () => {
  //   const response = await indentFileUpload({
  //     requestPath: 'getEmployeeForDepartment',
  //     requestData: {
  //       departmentId: "D09",
  //       tenantId: tenantID,
  //     }
  //   })
  //   if (response) {
  //     setEmpData(response)
  //   }
  // }
  const getQualityProjCnt = async () => {
    const response = await indentFileUpload({
      requestPath: 'getQualityProjCnt',
      requestData: {
        projId: project !== null ? project : 'getAll',
        tenantId: tenantID,
        empId,
        pmId: '6',
        fromDate,
        toDate,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setProjCount(response?.responseDataMessage)
      }
    }
  }
  const getPMMilestoneByMonthYr = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPMMilestoneByMonthYr',
      requestData: {
        pmHdrId: project == null ? 'getall' : project,
        month: moment(milestoneDate).format('MM'),
        tenantId: tenantID,
        yr: moment(milestoneDate).format('YYYY'),
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setMilestoneData(response?.responseData)
      } else {
        setMilestoneData([])
      }
    }
  }
  const getTeamMemberLoad = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPMBySBCType',
      requestData: {
        pmHdrId: project == null ? 'getall' : project,
        tenantId: tenantID,
        sbcCode: 'getall',
        empId,
        fromDate,
        endDate: toDate,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setTeamMemberData(response?.responseData)
        setLoading(false)
      }
    }
  }

  const getIndentProjectDtlsByDate = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        fromDate: '',
        tenantId: tenantID,
        toDate: '',
      },
    })

    if (response) {
      if (response.responseCode === '200') {
        setProjectData(response?.responseData)
      }
    }
  }

  const getPMWorkLoad = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPMWorkLoad',
      requestData: {
        pmHdrId: project == null ? 'getall' : project,
        tenantId: tenantID,
        sbcCode: '',
        fromDate: '',
        endDate: '',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setWorkLoadData(response?.responseData)
      }
    }
  }
  const getMonthYear = (value, dateSting) => {
    console.log(value)
    setMileStoneDate(moment(dateSting).format('YYYY-MM'))
  }
  function getSelectedFromDate(value, dateString) {
    console.log(value)
    setFromDate(moment(dateString).format('YYYY-MM-DD'))
  }
  function getSelectedToDate(value, dateString) {
    console.log(value)
    setToDate(moment(dateString).format('YYYY-MM-DD'))
  }

  const workColumn = [
    {
      title: 'Employee Code',
      dataIndex: 'empCode',
      key: 'empCode',
      width: '10%',
      filters: empCode3,
      filteredValue: filtersinfo1.empCode,
      onFilter: (value, record) => record?.empCode !== null && record.empCode === value,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '13%',
      filters: empName3,
      filteredValue: filtersinfo1.employeeName,
      onFilter: (value, record) => record.employeeName !== null && record.employeeName === value,
    },
    {
      title: 'No. Project Assigned',
      dataIndex: 'invProject',
      key: 'invProject',
      align: 'right',
      width: '10%',
      filters: noofProject3,
      filteredValue: filtersinfo1.invProject,
      onFilter: (value, record) => record.invProject !== null && record.invProject === value,
    },
  ]
  const columns = [
    {
      title: 'Project',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: '15%',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record.projectCode !== null && record.projectCode === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: department3,
      filteredValue: filtersinfo.department,
      onFilter: (value, record) => record?.department === value,
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      filters: plannedStartDate3,
      filteredValue: filtersinfo.plannedStartDate,
      onFilter: (value, record) => record?.plannedStartDate === value,
      render: data => (
        <span>{data !== 'null' || data !== null ? moment(data).format('DD-MMM-YYYY') : '-'}</span>
      ),
    },
    {
      title: 'Planned End Date',
      dataIndex: 'plannedEndDate',
      key: 'plannedEndDate',
      filters: plannedEndDate3,
      filteredValue: filtersinfo.plannedEndDate,
      onFilter: (value, record) => record?.plannedEndDate === value,
      align: 'right',
      render: data => (
        <span>{data !== 'null' || data !== null ? moment(data).format('DD-MMM-YYYY') : '-'}</span>
      ),
    },
    {
      title: 'Actual End Date',
      dataIndex: 'actualEndDate',
      key: 'actualEndDate',
      align: 'right',
      filters: actualEndDate3,
      filteredValue: filtersinfo.actualEndDate,
      onFilter: (value, record) => record?.actualEndDate === value,
      render: data => (
        <span>
          {data !== 'NA' ? moment(data).format('DD-MMM-YYYY') : data === '-' ? 'NA' : '-'}
        </span>
      ),
    },
    {
      title: 'Delay Days',
      dataIndex: 'delaydays',
      key: 'delaydays',
      align: 'right',
      render: (text, record) => {
        const diff =
          record.actualEndDate !== 'NA' && record.actualEndDate !== '-'
            ? moment(record.actualEndDate).diff(moment(record.plannedEndDate), 'days')
            : record.actualEndDate === '-'
              ? moment().diff(moment(record.plannedEndDate), 'days')
              : '-'

        // moment().diff(moment(record.plannedEndDate), 'days')

        let cellColor = ''

        if (diff > 0) {
          cellColor = 'red'
        } else if (diff < 0) {
          cellColor = 'green'
        }

        return (
          <span
            style={{
              backgroundColor: cellColor,
              display: 'block',
              padding: '4px',
              color: cellColor === 'green' || cellColor === 'red' ? 'white' : '',
            }}
          >
            {diff}
          </span>
        )
      },
    },
  ]
  const closeFilterCard = () => {
    setFilterOpen(false)
  }
  const openFilterCard = () => {
    setFilterOpen(true)
  }
  const handleChangeProject = (val, opt) => {
    console.log(val)
    setProject(opt.key)
  }
  const handleChangeIndent = (val, opt) => {
    console.log(val)
    setIndent(opt.key)
  }

  const DrillDowncomponent = () => {
    const handleChange2 = (pagination, filters) => {
      setfilterinfo2(filters)
    }
    // project Details filter
    const projectCode11 = []
    const saleValue1 = []
    const saleContribution1 = []
    const pmBudgetValue1 = []
    const targetValue1 = []
    const scmPoValue1 = []
    const materialTransferValue1 = []
    const balanceValue1 = []
    const empCostValue1 = []

    if (drillDownData && drillDownData.length > 0) {
      drillDownData.map(h => {
        return projectCode11.push(h.projectCode)
      })
      drillDownData.map(h => {
        return saleValue1.push(h.saleValue)
      })
      drillDownData.map(h => {
        return saleContribution1.push(h.saleContribution)
      })
      drillDownData.map(h => {
        return pmBudgetValue1.push(h.pmBudgetValue)
      })
      drillDownData.map(h => {
        return targetValue1.push(h.targetValue)
      })
      drillDownData.map(h => {
        return scmPoValue1.push(h.scmPoValue)
      })
      drillDownData.map(h => {
        return materialTransferValue1.push(h.materialTransferValue)
      })
      drillDownData.map(h => {
        return balanceValue1.push(h.balanceValue)
      })
      drillDownData.map(h => {
        return empCostValue1.push(h.empCostValue)
      })
    }

    const distinct2 = (value, index, self) => {
      return self.indexOf(value) === index
    }

    const projectCode21 = projectCode11.filter(distinct2)
    const saleValue2 = saleValue1.filter(distinct2)
    const saleContribution2 = saleContribution1.filter(distinct2)
    const pmBudgetValue2 = pmBudgetValue1.filter(distinct2)
    const targetValue2 = targetValue1.filter(distinct2)
    const scmPoValue2 = scmPoValue1.filter(distinct2)
    const materialTransferValue2 = saleValue1.filter(distinct2)
    const balanceValue2 = balanceValue1.filter(distinct2)
    const empCostValue2 = empCostValue1.filter(distinct2)

    const projectCode31 = []
    const saleValue3 = []
    const saleContribution3 = []
    const pmBudgetValue3 = []
    const targetValue3 = []
    const scmPoValue3 = []
    const materialTransferValue3 = []
    const balanceValue3 = []
    const empCostValue3 = []

    projectCode21.map(element => {
      return projectCode31.push({
        text: element,
        value: element,
      })
    })
    saleValue2.map(element => {
      return saleValue3.push({
        text: element,
        value: element,
      })
    })
    saleContribution2.map(element => {
      return saleContribution3.push({
        text: element,
        value: element,
      })
    })
    pmBudgetValue2.map(element => {
      return pmBudgetValue3.push({
        text: element,
        value: element,
      })
    })
    targetValue2.map(element => {
      return targetValue3.push({
        text: element,
        value: element,
      })
    })
    scmPoValue2.map(element => {
      return scmPoValue3.push({
        text: element,
        value: element,
      })
    })
    materialTransferValue2.map(element => {
      return materialTransferValue3.push({
        text: element,
        value: element,
      })
    })
    balanceValue2.map(element => {
      return balanceValue3.push({
        text: element,
        value: element,
      })
    })
    empCostValue2.map(element => {
      return empCostValue3.push({
        text: element,
        value: element,
      })
    })

    const Drilldowncolumns = [
      {
        title: 'Project Code',
        dataIndex: 'projectCode',
        key: 'projectCode',
        align: 'right',
        filters: projectCode31,
        filteredValue: filtersinfo2?.projectCode || null,
        onFilter: (value, record) =>
          record.projectCode !== null && record.projectCode.toLowerCase() === value.toLowerCase(),
      },
      {
        title: `Sale Value ${MenulistData[0].currency}`,
        dataIndex: 'saleValue',
        key: 'saleValue',
        align: 'right',
        filters: saleValue3,
        filteredValue: filtersinfo2.saleValue,
        onFilter: (value, record) => record.saleValue !== null && record.saleValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Sale Contribution ${MenulistData[0].currency}`,
        dataIndex: 'saleContribution',
        key: 'saleContribution',
        align: 'right',
        filters: saleContribution3,
        filteredValue: filtersinfo2.saleContribution,
        onFilter: (value, record) =>
          record.saleContribution !== null && record.saleContribution === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `PM Budget Value ${MenulistData[0].currency}`,
        dataIndex: 'pmBudgetValue',
        key: 'pmBudgetValue',
        align: 'right',
        filters: pmBudgetValue3,
        filteredValue: filtersinfo2.pmBudgetValue,
        onFilter: (value, record) =>
          record.pmBudgetValue !== null && record.pmBudgetValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Target Value ${MenulistData[0].currency}`,
        dataIndex: 'targetValue',
        key: 'targetValue',
        align: 'right',
        filters: targetValue3,
        filteredValue: filtersinfo2.targetValue,
        onFilter: (value, record) => record.targetValue !== null && record.targetValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Final Cost ${MenulistData[0].currency}`,
        dataIndex: 'scmPoValue',
        key: 'scmPoValue',
        align: 'right',
        filters: scmPoValue3,
        filteredValue: filtersinfo2.scmPoValue,
        onFilter: (value, record) => record.scmPoValue !== null && record.scmPoValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Material Trasfer Value ${MenulistData[0].currency}`,
        dataIndex: 'materialTransferValue',
        key: 'materialTransferValue',
        align: 'right',
        filters: materialTransferValue3,
        filteredValue: filtersinfo2.materialTransferValue,
        onFilter: (value, record) =>
          record.materialTransferValue !== null && record.materialTransferValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Emp. Utilization Cost ${MenulistData[0].currency}`,
        dataIndex: 'empCostValue',
        key: 'empCostValue',
        align: 'right',
        filters: empCostValue3,
        filteredValue: filtersinfo2.empCostValue,
        onFilter: (value, record) => record.empCostValue !== null && record.empCostValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
      {
        title: `Balance Value ${MenulistData[0].currency}`,
        dataIndex: 'balanceValue',
        key: 'balanceValue',
        align: 'right',
        filters: balanceValue3,
        filteredValue: filtersinfo2.balanceValue,
        onFilter: (value, record) => record.balanceValue !== null && record.balanceValue === value,
        render: data => (
          <span style={{ textAlign: 'right' }}>
            {data !== '' && parseFloat(data).toLocaleString('en-IN')}
          </span>
        ),
      },
    ]
    return (
      <div>
        <Table
          columns={Drilldowncolumns}
          dataSource={drillDownData}
          scroll={{ y: 400 }}
          onChange={handleChange2}
          pagination={false}
        />
      </div>
    )
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={!isMobile ? { marginRight: '10px' } : { marginLeft: '35px' }}>
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
          <h2
            style={
              !isMobile
                ? { flex: 1, fontWeight: 'bold', textAlign: 'center' }
                : { fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }
            }
          >
            Project Dashboard
          </h2>
        </div>
        <div>
          {loading ? (
            <div
              style={{
                position: 'absolute',
                top: 100,
                left: 0,
                right: 0,
                bottom: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <Spin size="large" tip="Loading..." />
            </div>
          ) : null}
        </div>
        <div style={{ marginTop: '20px' }}>
          <Widget
            widgetData={widgetData}
            projCount={projCount}
            handleClick={handleClick}
            val={MenulistData[0]?.currency}
          />
        </div>
        <div className="row" style={{ marginTop: '0px' }}>
          <div className="custom-card col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div
              style={{
                fontWeight: '700',
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
                marginLeft: '0',
              }}
            >
              PM Budget Analysis
            </div>
            <LineChart teamMemberData={teamMemberData} val={MenulistData[0].currency} />
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px' }}>
          <div
            className="custom-card col-xl-7 col-lg-7 col-md-12 col-sm-12"
            style={{ height: '400px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'gray' }}>
                MileStone -{' '}
              </div>
              <div style={{ marginLeft: '5px', marginBottom: '7px' }}>
                <DatePicker
                  onChange={getMonthYear}
                  // disabledDate={d => !d || d.isAfter(moment())}
                  picker="month"
                  defaultValue={moment()}
                  style={{ width: '155px' }}
                />
              </div>
            </div>
            <div>
              <Table
                columns={columns}
                dataSource={milestoneData}
                // pagination={false}
                scroll={{ y: 250 }}
                onChange={handleChange}
              />
            </div>
          </div>
          <div
            className="custom-card col-xl-5 col-lg-5 col-md-12 col-sm-12"
            style={{ height: '400px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  margin: '10px',
                  fontWeight: '700',
                  fontFamily: 'Arial, sans-serif',
                  color: 'gray',
                }}
              >
                Workload Management{' '}
              </div>
            </div>

            <Table
              columns={workColumn}
              dataSource={workLoadData}
              // pagination={false}
              scroll={{ y: 250 }}
              onChange={handleChange1}
            // style={{ height: '400px' }}
            />
          </div>
        </div>
      </div>
      <ModalPopup
        text="Project Tracker Details"
        isModalVisible={modalView}
        onCancel={handleCancel}
        FieldsComponent={DrillDowncomponent}
        width={1200}
      />
      {filterOpen && (
        <FilterEnquiry
          closeFilterCard={closeFilterCard}
          style={{ display: 'left' }}
          cardLabel="Filter Details"
          data={[
            {
              key: 1,
              label: 'From Date',
              component: (
                <DatePicker
                  onChange={getSelectedFromDate}
                  disabledDate={d => !d || d.isAfter(moment())}
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
                  defaultValue={fromDate ? moment(fromDate) : null}
                  value={fromDate ? moment(fromDate) : ''}
                />
              ),
            },
            {
              key: 2,
              label: 'To Date',
              component: (
                <DatePicker
                  format="DD-MMM-YYYY"
                  disabledDate={d => !d || d.isAfter(moment())}
                  onChange={getSelectedToDate}
                  style={{ width: '155px' }}
                  defaultValue={toDate ? moment(toDate) : null}
                  value={toDate ? moment(toDate) : ''}
                />
              ),
            },
            {
              key: 3,
              label: 'Project',
              component: (
                <Select
                  style={{ width: '155px' }}
                  placeholder="Select Project"
                  onChange={(val, opt) => handleChangeProject(val, opt)}
                  value={project}
                >
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                  {projectData?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode} - {item.customerName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 4,
              label: 'Indent Type',
              component: (
                <Select
                  style={{ width: '155px' }}
                  placeholder="Select Indent Type"
                  onChange={(val, opt) => handleChangeIndent(val, opt)}
                  value={indent}
                >
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                  {indentType?.map(item => (
                    <Option key={item.keyCatCode} value={item.keyCatCode}>
                      {item.keyCategory}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 5,
              component: (
                <div style={{ paddingRight: '40%' }}>
                  <Button
                    type="primary"
                    size="medium"
                    text="Submit"
                    onClick={() => {
                      setLoading(true)
                      getWidgetDetails()
                      getPMMilestoneByMonthYr()
                      getQualityProjCnt()
                      getTeamMemberLoad()
                      getPMWorkLoad()
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      )}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-1">
          <DashboardTableView pmId="3" selectedMonth={null} fromDate={fromDate} toDate={toDate} />
        </div>
      </div>
    </div>
  )
}
export default QualityDashboard
