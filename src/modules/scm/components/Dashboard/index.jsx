/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import {
  Form,
  Table,
  DatePicker,
  Row,
  Col,
  Card,
  Select,
  Checkbox,
  Spin,
  Button,
  Input,
} from 'antd'
// import { VictoryLegend, VictoryPie } from 'victory'
import Chart from 'react-apexcharts'
import moment from 'moment'
import store from 'store'
import './index.css'
import {
  MdOutlineDiscount,
  MdOutlinePendingActions,
  MdProductionQuantityLimits,
  MdInventory2,
} from 'react-icons/md'
import { SiConvertio } from 'react-icons/si'
import { CiDiscount1 } from 'react-icons/ci'
import { AiFillGold } from 'react-icons/ai'
import { FaCircleInfo } from 'react-icons/fa6'
import { BsCalendarDate } from 'react-icons/bs'
import ButtonComponent from 'components/shared/ButtonComponent'
import FilterEnquiry from 'components/shared/FilterEnquiry'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'
import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from 'currentDateTime'
import DashboardTableView from 'components/common/DashboardTblView'
import NoOfPOModal from './NoOfPOModal'
import IndentToPOModal from './IndentToPOModal'
import PendingIndentModal from './PendingIndentModal'
import ItemsDelayedModal from './ItemsDelayedModal'
import CostNegotiateModal from './CostNegotiateModal'
import InventoryValueModal from './InventoryValueModal'
import AvgInventoryValue from './AvgInventoryValue'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import PayableSection from './PayableSection'
import InventoryStockModal from './InventoryStockModal'

const ScmDashboard = () => {
  const [requirementFrom] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [widgetData, setWidgetData] = useState([])
  const [vendorPaymentData, setVendorPaymentData] = useState([])
  const [vendorTableData, setVendorTableData] = useState([])
  const [vendorDetailsData, setVendorDetailsData] = useState([])
  const [vendorData, setVendorData] = useState([])
  const [vendor, setVendor] = useState('getall')

  const [filtercards, setFilterCards] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(moment())
  const [penInModal, setPenInModal] = useState(false)
  const [itemsDelayModal, setItemsDelayModal] = useState(false)
  const [costNegoModal, setCostNegoModal] = useState(false)
  const [invValModal, setInvValModal] = useState(false)
  const [avgInvValModal, setAvgInvValModal] = useState(false)
  const [noOfPoMaodal, setNoOfPoMaodal] = useState(false)
  const [inventoryStockModal, setInventoryStockModal] = useState(false)
  const [indToPOModal, setIndToPOModal] = useState(false)
  const [costNegoVal, setCostNegoVal] = useState('')
  const [avgInvVal, setAvgInvVal] = useState('')
  const [invValue, setInvValue] = useState('')
  const [indentToPo, setIndentToPo] = useState('')
  const [tableData, setTableData] = useState([])
  const [projectData, setProjectData] = useState([])
  const [project, setProject] = useState('getall')
  const [searchText, setSearchText] = useState('')
  const [unit, setUnit] = useState('raw')

  const currentYear = moment().year()
  const currentMonth = moment().month() // 0 = January
  const defaultFromDate = moment()
    .startOf('month')
    .format('YYYY-MM-DD')
  const defaultToDate = moment()
    .endOf('month')
    .format('YYYY-MM-DD')

  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(defaultToDate)
  const [check, setCheck] = useState(false)

  const { Option } = Select
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')
  const [pieChartRespVals, setvendorTypePieChartVals] = useState(null)
  const [vendorCategoryPieChartVals, setvendorCategoryPieChartVals] = useState(null)

  const [filterData, setFilterData] = useState([])
  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')

  useEffect(() => {
    getOnloadservice()
    setLoading(false)
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

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

  const handleChangeProject = (val, opt) => {
    setProject(opt.key)
  }

  const getOnloadservice = () => {
    setLoading(true)
    setFilterCards(false)
    getWidgetDetails()
    getCostNegotiateValue()
    getAvgInvAgingVal()
    getInvValue()
    getTableDataDtls()
    getIndentToPO()
    getProjectData()
    getPieChartRespDtls()
    getApprVendorDtls()
    getVendorDetailHdrView()
    getVendorPaymentDetails()
    getVendorDetailDrillDown()
  }

  const openFilterCard = () => {
    setFilterCards(true)
  }
  const getWidgetDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getSCMWidgetDtl',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setWidgetData(response?.responseData)
        setLoading(false)
      }
    }
  }

  const getApprVendorDtls = async () => {
    const response = await indentFileUpload({
      requestPath: 'getApprVendorDtls',
      requestData: { approved: '1', tenantId },
    })
    if (response) {
      if (response.responseCode === '200') {
        setVendorData(response?.responseData)
        setLoading(false)
      }
    }
  }

  const getVendorPaymentDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorPaymentDetails',
      requestData: {
        tenantId,
        empId,
        pmHdrId: project,
        customerId: 'getall',
        stageCode: 'getall',
        pmId: '5',
        fromDate,
        toDate,
        vendorCode: vendor,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setVendorPaymentData(response?.responseData)
        setLoading(false)
      } else {
        setVendorPaymentData([])
      }
    }
  }

  const getVendorDetailHdrView = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorDetailHdrView',
      requestData: {
        tenantId,
        empId,
        pmHdrId: project,
        customerId: 'getall',
        stageCode: 'getall',
        pmId: '5',
        fromDate,
        toDate,
        vendorCode: vendor,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setVendorTableData(response?.responseData)
        setLoading(false)
      } else {
        setVendorTableData([])
      }
    }
  }
  const getVendorDetailDrillDown = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorDetailDrillDown',
      requestData: {
        tenantId,
        empId,
        pmHdrId: project,
        customerId: 'getall',
        stageCode: 'getall',
        fromDate,
        pmId: '5',
        toDate,
        vendorCode: vendor,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setVendorDetailsData(response?.responseData)
        setLoading(false)
      } else {
        setVendorDetailsData([])
      }
    }
  }

  const getPieChartRespDtls = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorByCatAndType',
      requestData: {
        tenantID: tenantId,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        if (response.responseData[0].vendorCategory.length > 0) {
          setvendorTypePieChartVals(response.responseData[0].vendorType)
        } else {
          setvendorTypePieChartVals(null)
        }
        if (response.responseData[0].vendorType.length > 0) {
          setvendorCategoryPieChartVals(response.responseData[0].vendorCategory)
        } else {
          setvendorCategoryPieChartVals(null)
        }
      }
    }
  }

  const getAvgInvAgingVal = async () => {
    const response = await indentFileUpload({
      requestPath: 'getInventoryAgeing',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setAvgInvVal(response?.responseDataMessage)
      }
    }
  }

  const getInvValue = async () => {
    const response = await indentFileUpload({
      requestPath: 'getInventoryValue',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setInvValue(response?.responseDataMessage)
      }
    }
  }

  const getIndentToPO = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentToPO',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setIndentToPo(response?.responseData)
        console.log(indentToPo)
      }
    }
  }

  const getCostNegotiateValue = async () => {
    const response = await indentFileUpload({
      requestPath: 'getcostnegotiated',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setCostNegoVal(parseInt(response?.responseDataMessage, 10))
      }
    }
  }

  const getProjectData = async () => {
    const response = await indentFileUpload({
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

  const getTableDataDtls = async () => {
    const response = await indentFileUpload({
      requestPath: 'getScmEmployeeIndentDtls',
      requestData: {
        tenantId,
        empId,
        pmId: '5',
        pmHdrId: project,
        monthYear: moment(selectedMonth).format('MM-YYYY'),
        lifeSpan: check ? '1' : '0',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        const updatedData = response?.responseData?.map((item, index) => ({
          ...item,
          sno: index + 1,
        }))
        setTableData(updatedData)
      }
    }
  }

  const pieChartCount = []
  const pieChartDesc = []
  const vendorCatDesc = []
  const vendorCatCount = []
  // const donutSliceColor = ["#938f94","#04b5c2","#006f82","#960581","#0f31f1","#d830db","#8c0ec2","#43025e","#07006e","#e899aa","#ab92b3","#28e9f7","#931dcf","#0f31f1","#d830db","#8c0ec2","#43025e","#07006e"]
  const donutSliceColor1 = [
    '#938f94',
    '#04b5c2',
    '#006f82',
    '#960581',
    '#0f31f1',
    '#d830db',
    '#8c0ec2',
    '#43025e',
    '#07006e',
    '#e899aa',
    '#ab92b3',
    '#28e9f7',
    '#931dcf',
    '#0f31f1',
    '#d830db',
    '#8c0ec2',
    '#43025e',
    '#07006e',
  ]
  const donutSliceColor = [
    '#008FFB',
    '#ed904a',
    '#FF4560',
    '#775DD0',
    '#546E7A',
    '#26a69a',
    '#ae71e3',
    '#C105D1',
    '#D17C10',
    '#0CD186',
    '#7A54E8',
    '#0C93D1',
    '#D1A010',
    '#E8B054',
    '#E85464',
    '#3A79D1',
    '#64E854',
    '#D1E8B0',
    '#E8D170',
    '#E8708C',
    '#70E8D1',
    '#0CD1B0',
    '#D1700C',
    '#B0D10C',
    '#D1E864',
    '#64E854',
    '#E8B070',
    '#D1700C',
    '#B0D1E8',
    '#D1B070',
    '#E870B0',
    '#B0E8D1',
    '#70D1B0',
    '#E854D1',
  ]

  if (pieChartRespVals !== null && pieChartRespVals !== undefined) {
    pieChartRespVals.map(h => {
      const label =
        h.desc === '0'
          ? 'Not Approved'
          : h.desc === '1'
          ? 'Approved'
          : h.desc === '2'
          ? 'Blocked'
          : h.desc || 'Unknown'
      return pieChartCount.push({
        x: label,
        y: Number(h.count) || 0,
      })
    })
    pieChartRespVals.map(j => {
      const label =
        j.desc === '0'
          ? 'Not Approved'
          : j.desc === '1'
          ? 'Approved'
          : j.desc === '2'
          ? 'Blocked'
          : j.desc || 'Unknown'
      pieChartDesc.push({
        name: `${label} - ${j.count || 0}`,
      })
      return pieChartDesc
    })
  }
  if (vendorCategoryPieChartVals !== null && vendorCategoryPieChartVals !== undefined) {
    vendorCategoryPieChartVals.map(h => {
      return vendorCatCount.push({
        x: h.desc || 'Unknown',
        y: Number(h.count) || 0,
      })
    })
    vendorCategoryPieChartVals.map(j => {
      return vendorCatDesc.push({
        name: `${j.desc || 'Unknown'} - ${j.count || 0}`,
      })
    })
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

  // handle month change
  function getSelectedFromDate(value) {
    setSelectedMonth(value)

    if (value && !check) {
      setFromDate(
        moment(value)
          .startOf('month')
          .format('YYYY-MM-DD'),
      )
      setToDate(
        moment(value)
          .endOf('month')
          .format('YYYY-MM-DD'),
      )
    }
  }

  // handle checkbox
  const handleCheckboxChange = e => {
    const { checked } = e.target
    setCheck(checked)
    if (checked) {
      setFromDate('')
      setToDate('')
    } else {
      // reset back to selectedMonth’s start and end
      setFromDate(
        moment(selectedMonth)
          .startOf('month')
          .format('YYYY-MM-DD'),
      )
      setToDate(
        moment(selectedMonth)
          .endOf('month')
          .format('YYYY-MM-DD'),
      )
    }
  }

  // const dataSource = [
  //   {
  //     key: '1',
  //     name: 'Mike',
  //     age: 32,
  //     address: '10 Downing Street',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //     age: 42,
  //     address: '10 Downing Street',
  //   },
  // ]

  const CardComponent = ({
    icon: Icon,
    title,
    planned,
    completed,
    onClick,
    displayicon,
    bgicon,
    bgicondiv,
  }) => (
    <div
      className="card orange"
      style={{
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        marginBottom: '10px',
        height: '105px',
        padding: '5px 5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'end',
        }}
      >
        <div className="card icon" style={{ backgroundColor: bgicondiv }}>
          <Icon style={{ color: bgicon }} />
        </div>
        <div style={{ display: displayicon ? 'flex' : 'none', cursor: 'pointer' }}>
          <FaCircleInfo onClick={onClick} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px',
            // borderBottom: 'black 1px solid',
            marginBottom: '5px',
          }}
        >
          <div>
            <h5 style={{ fontWeight: 'bold', fontSize: '16px' }}>{title}</h5>
          </div>
          <div>
            <h5 style={{ fontWeight: 'bold' }}>{planned}</h5>
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
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{planned}</span>
          </div>
          <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{completed}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const productCode1 = []
  const employee1 = []
  const totalIndentsAssigned1 = []
  const completedIndents1 = []

  tableData.map(h => {
    return productCode1.push(h.projectCode)
  })
  tableData.map(h => {
    return employee1.push(h.employee)
  })
  tableData.map(h => {
    return totalIndentsAssigned1.push(h.totalIndentsAssigned)
  })

  tableData.map(h => {
    return completedIndents1.push(h.completedIndents)
  })
  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const productCode2 = productCode1.filter(distinctval)
  const employee2 = employee1.filter(distinctval)
  const totalIndentsAssigned2 = totalIndentsAssigned1.filter(distinctval)
  const completedIndents2 = completedIndents1.filter(distinctval)

  const productCode3 = []
  const employee3 = []
  const totalIndentsAssigned3 = []
  const completedIndents3 = []

  productCode2.map(element => {
    return productCode3.push({
      text: element,
      value: element,
    })
  })

  employee2.map(element => {
    return employee3.push({
      text: element,
      value: element,
    })
  })

  totalIndentsAssigned2.map(element => {
    return totalIndentsAssigned3.push({
      text: element,
      value: element,
    })
  })

  completedIndents2.map(element => {
    return completedIndents3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: productCode3,
      filteredValue: filterData.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      filters: employee3,
      filteredValue: filterData.employee,
      onFilter: (value, record) => record?.employee === value,
    },
    {
      title: 'Indent Count',
      dataIndex: 'totalIndentsAssigned',
      key: 'totalIndentsAssigned',
      filters: totalIndentsAssigned3,
      filteredValue: filterData.totalIndentsAssigned,
      onFilter: (value, record) => record?.totalIndentsAssigned === value,
    },
    {
      title: 'Completed Count',
      dataIndex: 'completedIndents',
      key: 'completedIndents',
      filters: completedIndents3,
      filteredValue: filterData.completedIndents,
      onFilter: (value, record) => record?.completedIndents === value,
    },
    {
      title: 'Delay',
      dataIndex: 'completedIndents',
      key: 'completedIndents',
      render: (text, record) => record.totalIndentsAssigned - record.completedIndents,
    },
  ]

  const series = vendorCatCount.map(item => item.y)
  const optionsVal = {
    chart: {
      type: 'pie', // For a donut chart, use 'donut'; for a full pie chart, use 'pie'
    },
    colors: donutSliceColor1, // Use your defined color array
    tooltip: {
      y: {
        formatter: value => {
          return `${value}` // Custom tooltip format
        },
      },
    },
    labels: vendorCatCount.map(item => item.x), // Labels for the pie slices
    legend: {
      position: 'right',
      verticalAlign: 'middle',
      formatter: (seriesName, { seriesIndex }) => {
        return vendorCatDesc[seriesIndex] ? `${vendorCatDesc[seriesIndex].name}` : seriesName
      },
    },
  }

  const seriesType = pieChartCount.map(item => item.y)
  const optionsType = {
    chart: {
      type: 'pie', // For a donut chart, use 'donut'; for a full pie chart, use 'pie'
    },
    colors: donutSliceColor, // Use your defined color array
    tooltip: {
      y: {
        formatter: value => {
          return `${value}` // Custom tooltip format
        },
      },
    },
    labels: pieChartCount.map(item => item.x), // Labels for the pie slices
    legend: {
      position: 'right',
      // verticalAlign: 'left',
      align: 'center',
      formatter: (seriesName, { seriesIndex }) => {
        return pieChartDesc[seriesIndex] ? `${pieChartDesc[seriesIndex].name}` : seriesName
      },
    },
  }

  const getPendingIndentModalViewDtls = () => {
    setPenInModal(true)
  }

  const getItemsDelayModalViewDtls = () => {
    setItemsDelayModal(true)
  }

  const getCostNegoModalViewDtls = () => {
    setCostNegoModal(true)
  }

  const getInvValModalViewDtls = () => {
    setInvValModal(true)
  }

  const getAvgInvValModalViewDtls = () => {
    setAvgInvValModal(true)
  }

  const getNoOfPOModalViewDtls = () => {
    setNoOfPoMaodal(true)
  }
  const getInventoryStockModalView = () => {
    setInventoryStockModal(true)
  }

  const getIndentToPoModalViewDtls = () => {
    setIndToPOModal(true)
  }

  const renderIndentToPOComponent = () => {
    return (
      <IndentToPOModal
        onmodalCancel={() => {
          setIndToPOModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderNoOfPOComponent = () => {
    return (
      <NoOfPOModal
        onmodalCancel={() => {
          setNoOfPoMaodal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }
  const renderInventoryStockComponent = () => {
    return (
      <InventoryStockModal
        onmodalCancel={() => {
          setInventoryStockModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderPendingIndentComponent = () => {
    return (
      <PendingIndentModal
        onmodalCancel={() => {
          setPenInModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderItemsDelayComponent = () => {
    return (
      <ItemsDelayedModal
        onmodalCancel={() => {
          setItemsDelayModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderCostNegoComponent = () => {
    return (
      <CostNegotiateModal
        onmodalCancel={() => {
          setCostNegoModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderInvValComponent = () => {
    return (
      <InventoryValueModal
        onmodalCancel={() => {
          setInvValModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const renderAvgInvComponent = () => {
    return (
      <AvgInventoryValue
        onmodalCancel={() => {
          setAvgInvValModal(false)
        }}
        selectedMonth={selectedMonth}
        check={check}
        project={project}
      />
    )
  }

  const months = Math.floor(avgInvVal / 30)
  const days = avgInvVal ? parseFloat(avgInvVal % 30).toFixed(2) : 0

  const convertToCSV = data => {
    const header = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [header, ...rows].join('\n')
  }

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportCSV = () => {
    const cleanedData = cleanupDataSource(tableData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Indent_Count_Details_${currentDateTime}.csv`)
  }

  const cleanupDataSource = dataSource => {
    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          // Escape special characters (double quotes and commas)
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value
      }
      const delay =
        row.totalIndentsAssigned && row.completedIndents
          ? row.totalIndentsAssigned - row.completedIndents
          : 0

      return {
        'Project Code': escapeValue(row.projectCode),
        Employee: escapeValue(row.employee),
        'Indent Count': escapeValue(row.totalIndentsAssigned),
        'Completed Count': escapeValue(row.completedIndents),
        Delay: escapeValue(delay),
      }
    })
  }

  const searchedData = tableData.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })

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
        }}
      >
        <div style={{ textAlign: 'center', flex: '1' }}>
          <h2
            style={
              !isMobile
                ? { flex: 1, fontWeight: 'bold', textAlign: 'center' }
                : { fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }
            }
          >
            <></>
            SCM Dashboard
          </h2>
        </div>
        <div
          style={
            !isMobile
              ? { position: 'absolute', left: '30px' }
              : { position: 'absolute', left: '40px' }
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
      <div style={{ marginTop: '10px' }} className="dashboardGloabal">
        {loading ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Spin size="large" tip="Loading..." />
          </div>
        ) : null}
        <Form>
          <div>
            <div className="dashboard">
              <Row gutter={[16, 16]} className="widgets">
                <Col xs={24} sm={12} md={12} lg={6} className="widget">
                  <CardComponent
                    icon={SiConvertio}
                    // title="Indent to PO"
                    title={
                      <div>
                        <p>Indent : {widgetData?.[0]?.indentHdrCnt || 0}</p>
                        {/* <p>{widgetData?.[0]?.indentHdrCnt || 0}</p> */}
                      </div>
                    }
                    planned={
                      <div>
                        <p style={{ fontSize: '16px' }}>
                          Indent line items :{widgetData?.[0]?.indentDtlCnt || 0}
                        </p>
                        {/* <p>{widgetData?.[0]?.indentDtlCnt || 0}</p> */}
                      </div>
                    }
                    // completed={indentToPo?.[0]?.indentCount || 0}
                    onClick={getIndentToPoModalViewDtls}
                    displayicon
                    bgicondiv="#b4f2c4"
                    bgicon="#2ed358"
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={4} className="widget">
                  <CardComponent
                    icon={MdOutlineDiscount}
                    title="PO"
                    planned={widgetData?.[0]?.noOfPo || 0}
                    completed={widgetData?.[0]?.noOfPo || 0}
                    onClick={getNoOfPOModalViewDtls}
                    displayicon
                    bgicondiv="#b9d6f2"
                    bgicon="#097dea"
                  />
                </Col>

                <Col xs={24} sm={12} md={12} lg={4} className="widget">
                  <CardComponent
                    icon={MdOutlinePendingActions}
                    title="Pending Indent"
                    planned={widgetData?.[0]?.pendingIndents || 0}
                    completed={widgetData?.[0]?.pendingIndents || 0}
                    onClick={getPendingIndentModalViewDtls}
                    displayicon
                    bgicondiv="#e9cecb"
                    bgicon="#935d58"
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={4} className="widget">
                  <CardComponent
                    icon={MdInventory2}
                    title="Inventory Stock"
                    planned={widgetData?.[0]?.inventoryStock || 0}
                    completed={widgetData?.[0]?.inventoryStock || 0}
                    onClick={getInventoryStockModalView}
                    displayicon
                    bgicondiv="#e6f4ea"
                    bgicon="#1e7d32"
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} className="widget">
                  <CardComponent
                    icon={MdProductionQuantityLimits}
                    title="Items Delayed"
                    planned={widgetData?.[0]?.itemsDelayed || 0}
                    completed={widgetData?.[0]?.itemsDelayed || 0}
                    onClick={getItemsDelayModalViewDtls}
                    displayicon
                    bgicondiv="#f2e2d4"
                    bgicon="#b47c4b"
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={18} lg={18} style={{ minHeight: '360px' }}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow:
                      'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<FileExcelOutlined />}
                      onClick={() => handleExportCSV()}
                      style={{ marginTop: '10px' }}
                    >
                      Export to CSV
                    </Button>
                    <Input.Search
                      placeholder="Search..."
                      allowClear
                      enterButton
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 450 }}
                    />
                  </div>
                  <div
                    className="tableheight"
                    // style={isMobile ? { width: tableWidth, height: '220px' } : { height: '300px' }}
                  >
                    {/* <Skeleton active loading={projectLoading}> */}
                    <Table
                      dataSource={searchedData}
                      columns={columns}
                      size="small"
                      pagination={{
                        pageSizeOptions: ['10', '20', '30', '50', [tableData?.length]],
                        showSizeChanger: true,
                        defaultPageSize: 50,
                      }}
                      scroll={{ y: 220 }}
                      onChange={handleDataChange}
                    />
                    {/* </Skeleton> */}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={18} lg={6}>
                <div style={{ height: '300px' }}>
                  <Row gutter={16}>
                    <Col span={24}>
                      {/* <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          marginBottom: '30px',
                          height: '127px',
                        }}
                      > */}
                      <div
                        className="card"
                        style={{
                          width: '100%',
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          marginBottom: '15px',
                          height: '105px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'end',
                            padding: '5px 5px',
                            cursor: 'pointer',
                          }}
                        >
                          <h6>
                            <FaCircleInfo onClick={getCostNegoModalViewDtls} />
                          </h6>
                        </div>
                        <Row align="middle" style={{ height: '100%' }}>
                          <Col span={6} style={{ textAlign: 'center' }}>
                            <div className="card icon" style={{ backgroundColor: '#fff3cd' }}>
                              <CiDiscount1 size={32} style={{ color: '#ffc107' }} />
                            </div>
                          </Col>
                          <Col span={18}>
                            <h3
                              style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                            >
                              Cost Negotiate
                            </h3>
                            <span>
                              {costNegoVal
                                ? `Rs. ${parseFloat(costNegoVal).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`
                                : '-'}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <div
                        className="card"
                        style={{
                          width: '100%',
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          marginBottom: '15px',
                          height: '105px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'end',
                            padding: '5px 5px',
                            cursor: 'pointer',
                          }}
                        >
                          <h6>
                            <FaCircleInfo onClick={getInvValModalViewDtls} />
                          </h6>
                        </div>
                        <Row align="middle" style={{ height: '100%' }}>
                          <Col span={6} style={{ textAlign: 'center' }}>
                            <div className="card icon" style={{ backgroundColor: '#dadcde' }}>
                              <AiFillGold style={{ color: '#546E7A' }} />
                            </div>
                          </Col>
                          <Col span={18}>
                            <h3
                              style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                            >
                              Inventory Value
                            </h3>
                            <span>
                              {invValue
                                ? `Rs. ${parseFloat(invValue).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`
                                : '-'}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <div
                        className="card"
                        style={{
                          width: '100%',
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          marginBottom: '15px',
                          height: '105px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'end',
                            padding: '5px 5px',
                            cursor: 'pointer',
                          }}
                        >
                          <h6>
                            <FaCircleInfo onClick={getAvgInvValModalViewDtls} />
                          </h6>
                        </div>
                        <Row align="middle" style={{ height: '100%' }}>
                          <Col span={6} style={{ textAlign: 'center' }}>
                            <div className="card icon" style={{ backgroundColor: '#e0f2f1' }}>
                              <BsCalendarDate style={{ color: '#009688' }} />
                            </div>
                          </Col>
                          <Col span={18}>
                            <h3
                              style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                            >
                              Avg. Inventory Aging
                            </h3>
                            <span>
                              {months > 0 || days > 0
                                ? `${months} Month${months > 1 ? 's' : ''} & ${days} Day${
                                    days > 1 ? 's' : ''
                                  }`
                                : '-'}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
        {/* )} */}
      </div>

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
                <Form form={requirementFrom} style={{ width: '58%', marginBottom: '0px' }}>
                  <Form.Item
                    name="selectMonthform"
                    initialValue={moment()}
                    style={{ marginBottom: '0px' }}
                  >
                    <DatePicker
                      style={{ width: '155px' }}
                      picker="month"
                      format="YYYY-MM"
                      onChange={getSelectedFromDate}
                      value={moment()}
                    />
                  </Form.Item>
                  {/* <Form.Item name="lifespan" style={{ marginBottom: '0px', textAlign: 'left' }}>
                    <Checkbox onChange={handleCheckboxChange} />
                  </Form.Item> */}
                </Form>
              ),
            },
            {
              key: 2,
              label: <span>Life Span</span>,
              component: (
                <Form style={{ width: '58%', marginBottom: '0px' }}>
                  <Form.Item name="lifespan" style={{ marginBottom: '0px', textAlign: 'left' }}>
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
                  {projectData?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 4,
              label: (
                <span>
                  Vendor<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Select
                  style={{ width: '155px' }}
                  value={vendor}
                  placeholder="Vendor"
                  onChange={val => setVendor(val)}
                >
                  <Option key="getall" value="getall">
                    Get All
                  </Option>
                  {vendorData?.map(item => (
                    <Option key={item.vendorCode} value={item.vendorCode}>
                      {`(${item.vendorCode}) - ${item.vendorName}`}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 6,
              component: (
                <>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-evenly',
                      marginTop: '5px',
                    }}
                  >
                    <label htmlFor="unit-raw">
                      <input
                        id="unit-raw"
                        type="radio"
                        name="raw"
                        value="raw"
                        checked={unit === 'raw'}
                        onChange={() => setUnit('raw')}
                      />{' '}
                      Rs
                    </label>{' '}
                    <label htmlFor="unit-lakhs">
                      <input
                        id="unit-lakhs"
                        type="radio"
                        name="unit"
                        value="lakhs"
                        checked={unit === 'lakhs'}
                        onChange={() => setUnit('lakhs')}
                      />{' '}
                      Lakhs
                    </label>{' '}
                    <label htmlFor="unit-crores">
                      <input
                        id="unit-crores"
                        type="radio"
                        name="unit"
                        value="crores"
                        checked={unit === 'crores'}
                        onChange={() => setUnit('crores')}
                      />{' '}
                      Crores
                    </label>
                  </div>
                  <div style={{ paddingLeft: 5 }}>
                    <ButtonComponent
                      type="primary"
                      size="medium"
                      text="Submit"
                      onClick={() => getOnloadservice()}
                    />
                  </div>
                </>
              ),
            },
          ]}
        />
      )}

      {penInModal ? (
        <ModalPopup
          isModalVisible={penInModal}
          FieldsComponent={renderPendingIndentComponent}
          text="Pending Indent Details"
          onCancel={() => {
            setPenInModal(false)
          }}
          width="500"
        />
      ) : null}

      {noOfPoMaodal ? (
        <ModalPopup
          isModalVisible={noOfPoMaodal}
          FieldsComponent={renderNoOfPOComponent}
          text="No Of Approved PO Details"
          onCancel={() => {
            setNoOfPoMaodal(false)
          }}
          width="500"
        />
      ) : null}

      {indToPOModal ? (
        <ModalPopup
          isModalVisible={indToPOModal}
          FieldsComponent={renderIndentToPOComponent}
          text="Indent to PO Details"
          onCancel={() => {
            setIndToPOModal(false)
          }}
          width="500"
        />
      ) : null}

      {inventoryStockModal ? (
        <ModalPopup
          isModalVisible={inventoryStockModal}
          FieldsComponent={renderInventoryStockComponent}
          text="Inventory Stock Details"
          onCancel={() => {
            setInventoryStockModal(false)
          }}
          width="500"
        />
      ) : null}

      {itemsDelayModal ? (
        <ModalPopup
          isModalVisible={itemsDelayModal}
          FieldsComponent={renderItemsDelayComponent}
          text="Items Delay Details"
          onCancel={() => {
            setItemsDelayModal(false)
          }}
          width="500"
        />
      ) : null}

      {costNegoModal ? (
        <ModalPopup
          isModalVisible={costNegoModal}
          FieldsComponent={renderCostNegoComponent}
          text="Cost Negotiate Details"
          onCancel={() => {
            setCostNegoModal(false)
          }}
          width="500"
        />
      ) : null}

      {invValModal ? (
        <ModalPopup
          isModalVisible={invValModal}
          FieldsComponent={renderInvValComponent}
          text="Inventory Value Details"
          onCancel={() => {
            setInvValModal(false)
          }}
          width="500"
        />
      ) : null}

      {avgInvValModal ? (
        <ModalPopup
          isModalVisible={avgInvValModal}
          FieldsComponent={renderAvgInvComponent}
          text="Avgerage Inventory Aging Details"
          onCancel={() => {
            setAvgInvValModal(false)
          }}
          width="500"
        />
      ) : null}
      <div style={{ margin: '30px 0px' }}>
        <PayableSection
          vendorTableData={vendorTableData}
          vendorPaymentData={vendorPaymentData}
          vendorDetailsData={vendorDetailsData}
          unit={unit}
        />
      </div>
      <Row gutter={[30, 30]}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              borderRadius: '10px',
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: 700,
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
                marginBottom: 8,
              }}
            >
              Vendor Type
            </span>

            <Chart options={optionsType} series={seriesType} type="pie" height={350} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              borderRadius: '10px',
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: 700,
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
                marginBottom: 8,
              }}
            >
              Vendor Category
            </span>
            <Chart options={optionsVal} series={series} type="pie" height={350} />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '30px' }}>
        <DashboardTableView pmId="4" selectedMonth={selectedMonth} fromDate={null} toDate={null} />
      </div>
    </div>
  )
}
export default ScmDashboard
