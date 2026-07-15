/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react'
import { Form, Table, DatePicker, Row, Col, Card, Select, Spin, Button } from 'antd'
import moment from 'moment'
import store from 'store'
import './index.css'
import {
  MdOutlineWorkOutline,
  MdPieChartOutline,
  MdPayments,
  MdOutlinePending,
  MdOutlineSavings,
  MdOutlineAttachMoney,
} from 'react-icons/md'
import Chart from 'react-apexcharts'
import { FileExcelOutlined } from '@ant-design/icons'
import { FaRupeeSign } from 'react-icons/fa'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { GiReceiveMoney } from 'react-icons/gi'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { FaCircleInfo } from 'react-icons/fa6'

// import { BsCalendarDate } from 'react-icons/bs'
import ButtonComponent from 'components/shared/ButtonComponent'
import FilterEnquiry from 'components/shared/FilterEnquiry'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'

import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import BalanceAvailable from './BalanceAvailableModal'
import currentDateTime from '../../../../currentDateTime'
import PoReleaseModal from './PoReleasedModal'
import ProjectDetailsModal from './ProjectDetailsModal'
import { convertToCSV, downloadCSV } from './ExportToCsv'
import VendorPaymentChart from './VendorPaymentChart'
import POBudgetChart from './POBudgetChart'
import ProfitLossChart from './ProfitLossChart'

const FinanceDashboard = () => {
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
  // const [requirementFrom] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [filtercards, setFilterCards] = useState(false)

  const [poReleaseModal, setPoReleaseModal] = useState(false)
  const [balanceAvailModal, setBalanceAvailModal] = useState(false)
  const [projectDetailsModal, setProjectDetailsModal] = useState(false)

  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(defaultToDate)

  const [overAllProjectData, setOverAllProjectData] = useState([])
  const [projectSpentData, setProjectSpentData] = useState([])
  const [projectSpentData2, setProjectSpentData2] = useState([])

  // eslint-disable-next-line no-unused-vars
  const [tableData, setTableData] = useState([])
  const [projectData, setProjectData] = useState([])
  // const [projectSpent, setProjectspent] = useState([])
  const [unit, setUnit] = useState('raw')
  // eslint-disable-next-line no-unused-vars
  const [project, setProject] = useState('getall')
  const [customer, setCustomer] = useState('getall')
  const [customerData, setCustomerData] = useState([])
  const [projectStagesData, setProjectStagesData] = useState([])
  const [projectDetailsData, setProjectDetailsData] = useState([])

  const [projectStages, setProjectStages] = useState('getall')
  const [vendor, setVendor] = useState('getall')
  const [vendorData, setVendorData] = useState([])
  const [vendorDetailsData, setVendorDetailsData] = useState([])
  const [vendorTableData, setVendorTableData] = useState([])
  const [vendorPaymentData, setVendorPaymentData] = useState([])

  // eslint-disable-next-line no-unused-vars
  const [projectValue, setProjectValue] = useState({})
  const [projectConsume, setProjectConsume] = useState({})

  // eslint-disable-next-line no-unused-vars
  const [check, setCheck] = useState(false)
  const { Option } = Select
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')

  // }
  // eslint-disable-next-line no-unused-vars
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

  const getOnloadservice = () => {
    setLoading(true)
    setFilterCards(false)
    fetchAllData()
    setLoading(false)
    setFilteredTableData({})
  }

  const openFilterCard = () => {
    setFilterCards(true)
  }

  const [filters, setFilters] = useState({
    fromDate: defaultFromDate,
    toDate: defaultToDate,
    project: 'getall',
    customer: 'getall',
    projectStages: 'getall',
    vendor: 'getall',
    empId: empId,
    tenantId: tenantId,
  })
  const fetchAllData = async () => {
    const payload = {
      customerId: filters.customer,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      pmHdrId: filters.project,
      stageCode: filters.projectStages,
      tenantId: filters.tenantId,
      empId: filters.empId,
    }

    const [
      projRes,
      stagesRes,
      custRes,
      vendorRes,
      projValRes,
      projConsumeRes,
      overallRes,
      spentRes,
      // spent2Res,
      detailsRes,
      vendorDetailRes,
      vendorHdrRes,
      vendorPaymentRes,
    ] = await Promise.all([
      indentFileUpload({
        requestPath: 'getIndentProjectDtlsByDate',
        requestData: { fromDate: '', toDate: '', tenantId: filters.tenantId },
      }),
      indentFileUpload({
        requestPath: 'getDocTypesDataList',
        requestData: {
          docGroup: 'default',
          docType: 'DC024',
          processCode: '3',
          tenantId: filters.tenantId,
        },
      }),
      indentFileUpload({
        requestPath: 'getCustomermst',
        requestData: { fromDate: '', toDate: '', tenantId: filters.tenantId },
      }),
      indentFileUpload({
        requestPath: 'getApprVendorDtls',
        requestData: { approved: '1', tenantId: filters.tenantId },
      }),
      indentFileUpload({ requestPath: 'getTotalProjCnt', requestData: payload }),
      indentFileUpload({ requestPath: 'getProjConsumedValue', requestData: payload }), // Budgwt conumed table
      indentFileUpload({ requestPath: 'getOverAllProjSpentDrillDown', requestData: payload }),
      // indentFileUpload({ requestPath: 'getProjSpentDrillDown', requestData: payload }), // PO columns
      indentFileUpload({ requestPath: 'getProjSpentDetailByPmId', requestData: payload }), // Combined table PO columns
      // indentFileUpload({ requestPath: 'getProjActualValDrillDown', requestData: payload }), // BalAvailCOlumn
      indentFileUpload({ requestPath: 'getProjDetailsDrillDown', requestData: payload }), // REcievable
      indentFileUpload({
        requestPath: 'getVendorDetailDrillDown',
        requestData: { ...payload, vendorCode: filters.vendor },
      }),
      indentFileUpload({
        requestPath: 'getVendorDetailHdrView',
        requestData: { ...payload, vendorCode: filters.vendor },
      }),
      indentFileUpload({
        requestPath: 'getVendorPaymentDetails',
        requestData: { ...payload, vendorCode: filters.vendor },
      }),
    ])

    if (projRes?.responseCode === '200') setProjectData(projRes?.responseData)
    if (stagesRes?.responseCode === '200') setProjectStagesData(stagesRes?.responseData)

    if (custRes?.responseCode === '200') setCustomerData(custRes?.responseData)
    if (vendorRes?.responseCode === '200') setVendorData(vendorRes?.responseData)
    if (projValRes?.responseCode === '200') setProjectValue(projValRes?.responseData)

    if (projConsumeRes?.responseCode === '200') setProjectConsume(projConsumeRes?.responseData)
    if (overallRes?.responseCode === '200') setOverAllProjectData(overallRes?.responseData)
    console.log(spentRes, 'spentRes from API')
    if (
      (spentRes?.responseCode === 200 || spentRes?.responseCode === '200') &&
      Array.isArray(spentRes?.responseData)
    ) {
      setProjectSpentData(spentRes.responseData)
    } else {
      setProjectSpentData([])
    }

    // if (spent2Res?.responseCode === '200') setProjectSpentData2(spent2Res.responseData)
    if (detailsRes?.responseCode === '200') {
      setProjectDetailsData(detailsRes.responseData || [])
    } else {
      setProjectDetailsData([])
    }
    if (vendorDetailRes?.responseCode === '200') {
       const updatedData = vendorDetailRes.responseData.map((item, index) => ({
              ...item,
              sno: index + 1
        }));
      setVendorDetailsData(updatedData)
    } else {
      setVendorDetailsData([])
    }
    if (vendorHdrRes?.responseCode === '200') {
      const updatedData = vendorHdrRes.responseData.map((item, index) => ({
              ...item,
              sno: index + 1
        }));
      setVendorTableData(updatedData || [])
    } else {
      setVendorTableData([])
    }
    if (vendorPaymentRes?.responseCode === '200'){
        const updatedData = vendorPaymentRes.responseData.map((item, index) => ({
              ...item,
              sno: index + 1
        }));
        setVendorPaymentData(updatedData);
    }
      // setVendorPaymentData(vendorPaymentRes.responseData)
   }

  // console.log(projectSpentData,'spentRes data')
  const [filteredTableData, setFilteredTableData] = useState({})

  // Handle AntD Table onChange for any table
  const handleTableChange = (tableKey, pagination, tableFilters, sorter, extra) => {
    setFilteredTableData(prev => {
      if (Array.isArray(extra?.currentDataSource)) {
        return { ...prev, [tableKey]: extra.currentDataSource }
      }
      const { [tableKey]: _, ...rest } = prev // remove the key
      return rest
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

  const CardComponent = ({
    icon: Icon,
    title,
    planned,
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
        height: '110px',
        padding: '10px 20px',
        position: 'relative', // for absolutely positioned info icon
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Info icon in top-right */}
      {displayicon && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          <FaCircleInfo onClick={onClick} />
        </div>
      )}

      {/* Icon center aligned */}
      <div
        className="card icon"
        style={{
          backgroundColor: bgicondiv,
          alignSelf: 'center',
          marginBottom: '5px',
        }}
      >
        <Icon style={{ color: bgicon }} />
      </div>

      {/* Title and Planned count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // textAlign: 'center',
        }}
      >
        <h5 style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{title}</h5>
        <h5 style={{ fontWeight: 'bold', margin: 0 }}>{planned}</h5>
      </div>
    </div>
  )
  const getUniqueFilters = (data, key) => {
    const seen = new Set()
    return data
      .map(item => item?.[key])
      .filter(val => val !== undefined && val !== null && !seen.has(val) && seen.add(val))
      .map(val => ({ text: val, value: val }))
  }

  const projectNoFilter = getUniqueFilters(projectDetailsData, 'projCode')
  const vendorNoFilter = getUniqueFilters(vendorTableData, 'projCode')
  const projectSpentNoFilter = getUniqueFilters(projectSpentData, 'projCode')
  const projectSpent2NoFilter = getUniqueFilters(projectSpentData2, 'projCode')
  const vendorNameFilter = getUniqueFilters(vendorTableData, 'vendorName')

  const cleanupOrderReceivablesData = dataSource => {
    return dataSource.map((row, index) => {
      return {
        'S.No': index + 1,
        'Project No': row.projCode || '-',

        'Order Value': Number(row.orderValue || 0),
        Received: Number(row.received || 0),
        Outstanding: Number(row.outstanding || 0),
        Receivable: Number(row.receivable || 0),
      }
    })
  }

  const handleExportReceivableCSV = () => {
    const cleanedData = cleanupOrderReceivablesData(projectDetailsData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Project_Value_Status_${currentDateTime}.csv`)
  }

  const columns = [
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: projectNoFilter,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Order value​',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      // onFilter: (value, record) => record?.orderValue === value,
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Received',
      dataIndex: 'received',
      key: 'received',
      align: 'right',
      // onFilter: (value, record) => record?.received === value,
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Outstanding',
      dataIndex: 'outstanding',
      key: 'outstanding',
      align: 'right',
      // onFilter: (value, record) => record?.received === value,
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Balance Receivable',
      dataIndex: 'receivable',
      key: 'receivable',
      align: 'right',
      // onFilter: (value, record) => record?.receivable === value,
      render: value => (value ? formatValue(value) : 0),
    },
  ]

  const cleanupVendorDueData = dataSource => {
    return dataSource.map((row, index) => {
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
      return {
        'S.No': escapeValue(row.sno),
        'Project No': escapeValue(row.projCode || '-'),
        'Vendor Name': escapeValue(row.vendorName),
        'Amount Payable': Number(row.amountPayable || 0),
        'Amount Due': Number(row.amountDue || 0),
      }
    })
  }

  const handleExportVendorDueCSV = () => {
    const cleanedData = cleanupVendorDueData(vendorTableData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Vendor_Payment_Due_${currentDateTime}.csv`)
  }

  const columns1 = [
    {
      title: 'Project No​',
      dataIndex: 'projCode',
      key: 'projCode',
      render: value => value || '-',
      filters: vendorNoFilter,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendorNameFilter,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'Amount Payable',
      dataIndex: 'amountPayable',
      align: 'right',
      key: 'amountPayable',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Amount Due​',
      dataIndex: 'amountDue',
      align: 'right',
      key: 'amountDue',
      render: value => (value ? formatValue(value) : '0'),
    },
  ]

  const cleanupPOBudgetData = dataSource => {
    return dataSource.map((row, index) => {
      const materialBudget = Number(row.materialBudCons || 0)
      const materialReleased = Number(row.materialRelesVal || 0)
      const serviceBudget = Number(row.serviceBudCons || 0)
      const serviceReleased = Number(row.serviceRelesVal || 0)

      const totalBudgetConsumed = Number(row.totalBudgetConsum || 0)
      const totalPOReleased = materialReleased + serviceReleased
      const overallSpent = Number(row.actualVal || 0) - Number(row.debitValue || 0)
      const balance = Number(row.projcBudget || 0) - Number(row.actualVal || 0)
      const profit = Number(row.orderValue || 0) - overallSpent

      return {
        'S.No': index + 1,
        'Project No': row.projCode || '-',
        'Order Value': Number(row.orderValue || 0),
        'Project Budget': Number(row.projcBudget || 0),

        'Material - Budget Cost': materialBudget,
        'Material - PO Released so far': materialReleased,

        'Service - Budget Cost': serviceBudget,
        'Service - PO Released so far': serviceReleased,

        'Total Budget Consumed': totalBudgetConsumed,
        'Total PO Released': totalPOReleased,

        'Overall Project Spent': overallSpent,
        Balance: balance,

        'Profit & Loss': profit,
      }
    })
  }

  const handleExportPOBugdetCSV = () => {
    const cleanedData = cleanupPOBudgetData(projectSpentData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Budget_Consumed_${currentDateTime}.csv`)
  }

  const POColumns = [
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projectCode',
      rowSpan: 2,
      // align: 'right',
      fixed: 'left',
      filters: projectSpentNoFilter,
      render: value => value || '-',
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Order Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Project Budget',
      dataIndex: 'projcBudget',
      key: 'projcBudget',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Materials',
      children: [
        {
          title: 'Budget cost',
          dataIndex: 'materialBudCons',
          key: 'materialBudCons',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'PO Released so far',
          dataIndex: 'materialRelesVal',
          key: 'materialRelesVal',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
      ],
    },
    {
      title: 'Service',
      children: [
        {
          title: 'Budget cost',
          dataIndex: 'serviceBudCons',
          key: 'serviceBudCons',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'PO Released so far',
          dataIndex: 'serviceRelesVal',
          key: 'serviceRelesVal',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
      ],
    },
    {
      title: 'Total Budget Consumed',
      dataIndex: 'totalBudgetConsum',
      key: 'totalBudgetConsum',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Total PO Released',
      dataIndex: 'totalPoreles',
      key: 'totalPoreles',
      align: 'right',
      render: (_, record) => {
        const total =
          Math.round(Number(record.materialRelesVal || 0)) +
          Math.round(Number(record.serviceRelesVal || 0))
        return formatValue(total)
      },
    },
    {
      title: 'Overall Project Spent',
      dataIndex: 'actualVal',
      key: 'actualVal',
      align: 'right',
      render: (_, record) =>
        formatValue(Number(record.actualVal || 0) - Number(record.debitValue || 0)),
    },
    // {
    //   title: 'Debit Value',
    //   dataIndex: 'debitValue',
    //   key: 'debitValue',
    //   align: 'right',
    //   render: value => (value ? formatValue(value) : 0),
    // },

    {
      title: 'Balance',
      dataIndex: 'balanceVal',
      key: 'balanceVal',
      align: 'right',
      render: (_, record) =>
        formatValue(Number(record.projcBudget || 0) - Number(record.actualVal || 0)),
    },
    {
      title: 'Profit & Loss',
      key: 'profitAndLoss',
      align: 'right',
      render: (_, record) => {
        const profit =
          Number(record.orderValue || 0) - Number(record.actualVal - record.debitValue || 0)
        const color = profit >= 0 ? 'green' : 'red'
        return <span style={{ color }}>{formatValue(profit)}</span>
      },
    },
  ]

  // Over all project spent, Balance and Profit & loss,

  const cleanupBalanceAvailableData = dataSource => {
    return dataSource.map((row, index) => {
      return {
        'S.No': index + 1,
        'Project No': row.projCode || '-',

        'Order Value': Number(row.orderValue || 0),
        'Project Budget Cost': Number(row.budgetVal || 0),
        'Actual Spent - Materials': Number(row.actualVal || 0),
        'Actual Spent - Manpower': Number(row.manPowerCost || 0),
        'Actual Spent - Others': Number(row.other || 0),
        'Actual Spent - Total Spends': Number(row.totalSpends || 0),
        Balance: Number(row.balanceVal || 0),
        'Profit & Loss': Number(row.orderValue || 0) - Number(row.totalSpends || 0),
      }
    })
  }

  const handleExportBalanceAvailCSV = () => {
    const cleanedData = cleanupBalanceAvailableData(projectSpentData2)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `ProjectWise_Actual_Spend_${currentDateTime}.csv`)
  }

  const BalAvailColumns = [
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projCode',
      rowSpan: 2,
      // align: 'center',
      fixed: 'left',
      filters: projectSpent2NoFilter,
      render: value => value || '-',
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Order Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Project Budget Cost',
      dataIndex: 'budgetVal',
      key: 'budgetVal',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Actual Cost Spend So Far',
      children: [
        {
          title: 'Materials',
          dataIndex: 'actualVal',
          key: 'actualVal',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'Manpower',
          dataIndex: 'manPowerCost',
          key: 'manPowerCost',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'Others',
          dataIndex: 'other',
          key: 'other',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'Total Spends',
          dataIndex: 'totalSpends',
          key: 'totalSpends',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
      ],
    },
    {
      title: 'Balance',
      dataIndex: 'balanceVal',
      key: 'balanceVal',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Profit & Loss',
      key: 'profitAndLoss',
      align: 'right',
      render: (_, record) => {
        const profit = Number(record.orderValue || 0) - Number(record.totalSpends || 0)
        const color = profit >= 0 ? 'green' : 'red'
        return <span style={{ color }}>{formatValue(profit)}</span>
      },
    },
  ]

  const getPoReleaseModalViewDtls = () => {
    setPoReleaseModal(true)
  }
  const getBalanceAvailableDtls = () => {
    setBalanceAvailModal(true)
  }
  const getProjectDetailsDtls = () => {
    setProjectDetailsModal(true)
  }

  const renderItemsDelayComponent = () => {
    return (
      <PoReleaseModal
        onmodalCancel={() => {
          setPoReleaseModal(false)
        }}
        // selectedMonth={selectedMonth}
        getSelectedFromDate={fromDate}
        getSelectedToDate={toDate}
        unit={unit}
        project={projectSpentData}
      />
    )
  }

  const renderBalanceAvailComponent = () => {
    return (
      <BalanceAvailable
        onmodalCancel={() => {
          setBalanceAvailModal(false)
        }}
        getSelectedFromDate={fromDate}
        getSelectedToDate={toDate}
        project={vendorDetailsData}
      />
    )
  }

  const renderProjectValueComponent = () => {
    return (
      <ProjectDetailsModal
        onmodalCancel={() => {
          setProjectDetailsModal(false)
        }}
        // selectedMonth={selectedMonth}
        unit={unit}
        getSelectedFromDate={fromDate}
        getSelectedToDate={toDate}
        project={projectDetailsData}
      />
    )
  }

  const formatValue = val => {
    const num = Number(val) || 0

    if (num === 0) {
      return '0'
    }

    // Helper to truncate without rounding
    const truncateToTwo = value => Math.floor(value * 100) / 100

    if (unit === 'crores') {
      const crores = num / 10000000
      return `${crores < 1 ? crores.toFixed(2) : truncateToTwo(crores)} Cr`
    }

    if (unit === 'lakhs') {
      const lakhs = num / 100000
      return `${lakhs < 1 ? lakhs.toFixed(2) : truncateToTwo(lakhs)} L`
    }

    return `${Math.round(num).toLocaleString('en-IN')}`
  }

  const formatWithRupee = value => `₹ ${formatValue(value)}`

  const totalReceived = (filteredTableData?.projectDetailsData || projectDetailsData).reduce(
    (sum, item) => sum + Number(item.received || 0),
    0,
  )
  const totalReceivable = (filteredTableData?.projectDetailsData || projectDetailsData).reduce(
    (sum, item) => sum + Number(item.receivable || 0),
    0,
  )
  const totalOutstanding = (filteredTableData?.projectDetailsData || projectDetailsData).reduce(
    (sum, item) => sum + Number(item.outstanding || 0),
    0,
  )

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    colors: ['#008FFB', '#00E396', '#D100D1'],
    labels: [`Received`, `Outstanding`, `Balance Receivable`],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      labels: {
        colors: undefined,
        useSeriesColors: false,
      },
      markers: {
        width: 10,
        height: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
      formatter: function(val) {
        return `${val.toFixed(1)}%`
      },
    },
    tooltip: {
      enabled: true,
    },
  }

  const chartSeries = [
    Number(totalReceived || 0),
    Number(totalOutstanding || 0),
    Number(totalReceivable || 0),
  ]

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
        <div style={{ textAlign: 'center', flex: '1', margin: '15px 0px' }}>
          <h2
            style={
              !isMobile
                ? { flex: 1, fontWeight: 'bold', textAlign: 'center' }
                : { fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }
            }
          >
            <></>
            Finance Dashboard
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
              <Row gutter={[30, 30]}>
                {/* Section One */}
                <Col span={24}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'left' }}>
                    Project Details
                  </h4>

                  <Row
                    gutter={[30, 30]}
                    align="top"
                    style={{ marginTop: '35px', display: 'flex', alignItems: 'center' }}
                  >
                    <Col xs={24} xl={6}>
                      <CardComponent
                        icon={MdOutlineWorkOutline}
                        title="No of Project"
                        planned={projectValue?.[0]?.projCnt || 0}
                        bgicondiv="#c8e6c9"
                        bgicon="#2e7d32"
                      />
                      <CardComponent
                        icon={FaRupeeSign}
                        title="Order Value"
                        planned={`₹ ${formatValue(projectValue?.[0]?.projValue)}`}
                        bgicondiv="#bbdefb"
                        bgicon="#0d47a1"
                      />
                      <CardComponent
                        icon={GiReceiveMoney}
                        title="Contribution"
                        planned={`₹ ${formatValue(projectValue?.[0]?.projContri)}`}
                        bgicondiv="#d7ccc8"
                        bgicon="#4e342e"
                      />
                    </Col>

                    <Col xs={24} xl={12}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          width: '100%',
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<FileExcelOutlined />}
                          onClick={() => handleExportReceivableCSV()}
                          style={{ margin: '10px 0px', float: 'left' }}
                        >
                          Export to CSV
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => getProjectDetailsDtls()}
                          style={{ margin: '10px 0px', float: 'right' }}
                        >
                          View Details
                        </Button>
                        <div className="tableheight" style={{ width: '100%' }}>
                          <Table
                            dataSource={projectDetailsData}
                            columns={columns}
                            size="small"
                            scroll={{ y: 220 }}
                            pagination={false}
                            style={{ width: '100%', minHeight: '250px' }}
                            onChange={(pagination, Filters, sorter, extra) =>
                              handleTableChange(
                                'projectDetailsData',
                                pagination,
                                Filters,
                                sorter,
                                extra,
                              )
                            }
                            summary={() => {
                              let totalOrderValue = 0
                              let totalReceivedColumn = 0
                              let totalOutstandingColumn = 0
                              let totalReceivableColumn = 0

                              ;(
                                filteredTableData?.projectDetailsData || projectDetailsData
                              ).forEach(item => {
                                totalOrderValue += Number(item.orderValue) || 0
                                totalReceivedColumn += Number(item.received) || 0
                                totalOutstandingColumn += Number(item.outstanding) || 0
                                totalReceivableColumn += Number(item.receivable) || 0
                              })

                              return (
                                <Table.Summary.Row
                                  style={{ fontWeight: 'bold', background: '#f5f5f5' }}
                                >
                                  <Table.Summary.Cell align="left">Total</Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalOrderValue)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalReceived)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalOutstanding)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalReceivable)}
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              )
                            }}
                          />
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} xl={6}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          padding: '10px',
                          width: '100%',
                          height: '350px',
                        }}
                      >
                        <Chart
                          options={chartOptions}
                          series={chartSeries}
                          type="pie"
                          width="100%"
                          // height="350"
                        />
                        <h3 style={{ textAlign: 'center', fontSize: '14px', marginTop: '0px' }}>
                          Project Summary
                        </h3>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                {/* Section Two - Top Widgets */}

                <Col span={24}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'left' }}>
                    Project Spent
                  </h4>
                  <Row gutter={[16, 16]} style={{ marginTop: '35px' }}>
                    <Col xs={24} md={6}>
                      <CardComponent
                        icon={MdOutlineSavings}
                        title="Project Budget"
                        planned={`₹ ${formatValue(projectConsume?.[0]?.projBudget)}`}
                        bgicondiv="#dcedc8"
                        bgicon="#33691e"
                      />
                    </Col>
                    <Col xs={24} md={4}>
                      <CardComponent
                        icon={MdPieChartOutline}
                        title="Budget Consumed"
                        planned={`₹ ${formatValue(projectConsume?.[0]?.budgetConsumed)}`}
                        bgicondiv="#efebe9"
                        bgicon="#6d4c41"
                      />
                    </Col>
                    <Col xs={24} md={4}>
                      <CardComponent
                        icon={HiOutlineDocumentReport}
                        title="PO released so far​"
                        planned={`₹ ${formatValue(projectConsume?.[0]?.poReleased)}`}
                        getProjectDetailsDtls
                        bgicondiv="#b2dfdb"
                        bgicon="#004d40"
                      />
                    </Col>
                    <Col xs={24} md={4}>
                      <CardComponent
                        icon={MdOutlineAttachMoney}
                        title="Actual Spent"
                        planned={`₹ ${formatValue(projectConsume?.[0]?.actualSpend)}`}
                        bgicondiv="#fff3e0"
                        bgicon="#ef6c00"
                      />
                    </Col>

                    <Col xs={24} md={6}>
                      <CardComponent
                        icon={RiMoneyDollarCircleLine}
                        title="Balance available​"
                        planned={`₹ ${formatValue(projectConsume?.[0]?.balanceAvailable)}`}
                        onClick={getPoReleaseModalViewDtls}
                        bgicondiv="#dcedc8"
                        bgicon="#33691e"
                      />
                    </Col>
                  </Row>

                  {/* Section Two - Material & Service Table */}
                  <Row gutter={[30, 30]}>
                    <Col xs={24} xl={24}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          width: '100%',
                          minWidth: 0,
                          marginTop: '20px',
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<FileExcelOutlined />}
                          onClick={() => handleExportPOBugdetCSV()}
                          style={{ margin: '10px 0px', float: 'left' }}
                        >
                          Export to CSV
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => getPoReleaseModalViewDtls()}
                          style={{ margin: '10px 0px', float: 'right' }}
                        >
                          View Details
                        </Button>
                        <div className="tableheight" style={{ width: '100%' }}>
                          <Table
                            columns={POColumns}
                            dataSource={projectSpentData}
                            pagination={false}
                            scroll={{ y: 300, x: 1500 }}
                            onChange={(pagination, Filters, sorter, extra) =>
                              handleTableChange(
                                'projectSpentData',
                                pagination,
                                Filters,
                                sorter,
                                extra,
                              )
                            }
                            summary={() => {
                              let totalOrderValue = 0
                              let totalBudgetVal = 0
                              let totalMaterialBudCons = 0
                              let totalMaterialRelesVal = 0
                              let totalServiceBudCons = 0
                              let totalServiceRelesVal = 0
                              let totalBudgetConsumed = 0
                              let totalPOReleased = 0
                              let totalSpends = 0
                              let totalBalanceVal = 0

                              ;(filteredTableData?.projectSpentData || projectSpentData).forEach(
                                item => {
                                  totalOrderValue += Number(item.orderValue) || 0
                                  totalBudgetVal += Number(item.projcBudget) || 0
                                  totalMaterialBudCons += Number(item.materialBudCons) || 0
                                  totalMaterialRelesVal += Number(item.materialRelesVal) || 0
                                  totalServiceBudCons += Number(item.serviceBudCons) || 0
                                  totalServiceRelesVal += Number(item.serviceRelesVal) || 0
                                  totalBudgetConsumed += Number(item.totalBudgetConsum) || 0
                                  const spends =
                                    (Number(item.actualVal) || 0) - (Number(item.debitValue) || 0)
                                  totalSpends += spends

                                  totalPOReleased += Number(item.totalPoreles) || 0

                                  const balanceVal =
                                    (Number(item.projcBudget) || 0) - (Number(item.actualVal) || 0)
                                  totalBalanceVal += balanceVal
                                },
                              )
                              const totalProfitAndLoss = totalOrderValue - totalSpends
                              return (
                                <Table.Summary.Row
                                  style={{ fontWeight: 'bold', background: '#f5f5f5' }}
                                >
                                  <Table.Summary.Cell align="left">Total</Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalOrderValue)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalBudgetVal)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalMaterialBudCons)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalMaterialRelesVal)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalServiceBudCons)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalServiceRelesVal)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalBudgetConsumed)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalPOReleased)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalSpends)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    {formatWithRupee(totalBalanceVal)}
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell align="right">
                                    <span
                                      style={{ color: totalProfitAndLoss >= 0 ? 'green' : 'red' }}
                                    >
                                      {formatWithRupee(totalProfitAndLoss)}
                                    </span>
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              )
                            }}
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={[30, 30]}>
                    <Col xs={24} xl={12}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          width: '100%',
                          marginTop: '20px',
                          overflow:'hidden',
                        }}
                      >
                        <POBudgetChart
                          data={
                            filteredTableData.projectSpentData?.length
                              ? filteredTableData.projectSpentData
                              : projectSpentData
                          }
                        />
                      </Card>
                    </Col>
                    <Col xs={24} xl={12}>
                      <Card
                        bordered={false}
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                          borderRadius: '10px',
                          width: '100%',
                          marginTop: '20px',
                        }}
                      >
                        <ProfitLossChart
                          data={
                            filteredTableData?.projectSpentData?.length
                              ? filteredTableData.projectSpentData
                              : projectSpentData
                          }
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>

                {/* Section Three */}
                <Col
                  xs={24}
                  xl={8}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <h4 style={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'left' }}>
                    Payable
                  </h4>

                  <CardComponent
                    icon={MdPayments}
                    title="Vendor Payment done so far​"
                    planned={`₹ ${formatValue(vendorPaymentData?.[0]?.paidSoFar)}`}
                    bgicondiv="#c8e6c9"
                    bgicon="#1b5e20"
                    onClick={getBalanceAvailableDtls}
                  />
                  <CardComponent
                    icon={MdOutlinePending}
                    title="Vendor Payment due​"
                    planned={`₹ ${formatValue(vendorPaymentData?.[0]?.amountDue)}`}
                    bgicondiv="#ffcdd2"
                    bgicon="#b71c1c"
                  />
                </Col>

                <Col xs={24} xl={16}>
                  <Card
                    bordered={false}
                    style={{
                      boxShadow:
                        'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<FileExcelOutlined />}
                      onClick={() => handleExportVendorDueCSV()}
                      style={{ margin: '10px 0px', float: 'left' }}
                    >
                      Export to CSV
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => getBalanceAvailableDtls()}
                      style={{ margin: '10px 0px', float: 'right' }}
                    >
                      View Details
                    </Button>

                    <div className="tableheight" style={{ width: '100%' }}>
                      <Table
                        columns={columns1}
                        dataSource={vendorTableData}
                        size="small"
                        pagination={false}
                        scroll={{ y: 220 }}
                        style={{ width: '100%', minHeight: '250px' }}
                        onChange={(pagination, Filters, sorter, extra) =>
                          handleTableChange('vendorTableData', pagination, Filters, sorter, extra)
                        }
                        summary={() => {
                          let totalAmountPayable = 0
                          let totalAmountDue = 0

                          ;(filteredTableData?.vendorTableData ?? vendorTableData).forEach(item => {
                            const payable = Number(item.amountPayable) || 0
                            const due = Number(item.amountDue) || 0
                            totalAmountPayable += payable
                            totalAmountDue += due
                          })

                          return (
                            <Table.Summary.Row
                              style={{ fontWeight: 'bold', background: '#f5f5f5' }}
                            >
                              <Table.Summary.Cell align="left">Total</Table.Summary.Cell>
                              <Table.Summary.Cell /> {/* Vendor Name column - leave blank */}
                              <Table.Summary.Cell align="right">
                                {formatWithRupee(totalAmountPayable)}
                              </Table.Summary.Cell>
                              <Table.Summary.Cell align="right">
                                {formatWithRupee(totalAmountDue)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          )
                        }}
                      />
                    </div>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    bordered={false}
                    style={{
                      boxShadow:
                        'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                  >
                    <VendorPaymentChart
                      data={
                        filteredTableData.vendorTableData?.length
                          ? filteredTableData.vendorTableData
                          : vendorTableData
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </div>
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
              key: 0,
              label: 'From Date',
              component: (
                <DatePicker
                  onChange={date =>
                    setFilters(prev => ({
                      ...prev,
                      fromDate: date ? date.format('YYYY-MM-DD') : '',
                    }))
                  }
                  disabledDate={d => !d || d.isAfter(moment())}
                  format="DD-MMM-YYYY"
                  style={{ width: '155px' }}
                  value={
                    moment(filters.fromDate, 'YYYY-MM-DD', true).isValid()
                      ? moment(filters.fromDate)
                      : null
                  }
                />
              ),
            },
            {
              key: 1,
              label: 'To Date',
              component: (
                <DatePicker
                  format="DD-MMM-YYYY"
                  disabledDate={d => !d || d.isAfter(moment())}
                  onChange={date =>
                    setFilters(prev => ({
                      ...prev,
                      toDate: date ? date.format('YYYY-MM-DD') : '',
                    }))
                  }
                  style={{ width: '155px' }}
                  value={
                    moment(filters.toDate, 'YYYY-MM-DD', true).isValid()
                      ? moment(filters.toDate)
                      : null
                  }
                />
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
                  value={filters.project}
                  placeholder="Project"
                  onChange={val => setFilters(prev => ({ ...prev, project: val }))}
                >
                  <Option key="getall" value="getall">
                    Get All
                  </Option>
                  {projectData?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.projectName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 3,
              label: (
                <span>
                  Customer<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Select
                  style={{ width: '155px' }}
                  value={filters.customer}
                  placeholder="Customer"
                  onChange={val => setFilters(prev => ({ ...prev, customer: val }))}
                >
                  <Option key="getall" value="getall">
                    Get All
                  </Option>
                  {customerData?.map(item => (
                    <Option key={item.custCode} value={item.custCode}>
                      {item.custName}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 4,
              label: (
                <span>
                  Project Stages<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Select
                  style={{ width: '155px' }}
                  value={filters.projectStages}
                  placeholder="Project Stages"
                  onChange={val => setFilters(prev => ({ ...prev, projectStages: val }))}
                >
                  <Option key="getall" value="getall">
                    Get All
                  </Option>
                  {projectStagesData?.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Option key={item.docStatus} value={item.docStatus}>
                      {item.docStatusDesc}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              key: 6,
              label: (
                <span>
                  Vendor<span style={{ color: 'red' }}>*</span>
                </span>
              ),
              component: (
                <Select
                  style={{ width: '155px' }}
                  value={filters.vendor}
                  placeholder="Vendor"
                  onChange={val => setFilters(prev => ({ ...prev, vendor: val }))}
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
              key: 7,
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

      {poReleaseModal ? (
        <ModalPopup
          isModalVisible={poReleaseModal}
          FieldsComponent={renderItemsDelayComponent}
          text="PO Realesed So Far"
          onCancel={() => {
            setPoReleaseModal(false)
          }}
          width="500"
        />
      ) : null}
      {balanceAvailModal ? (
        <ModalPopup
          isModalVisible={balanceAvailModal}
          FieldsComponent={renderBalanceAvailComponent}
          text="Vendor Payment Due"
          onCancel={() => {
            setBalanceAvailModal(false)
          }}
          width="500"
        />
      ) : null}
      {projectDetailsModal ? (
        <ModalPopup
          isModalVisible={projectDetailsModal}
          FieldsComponent={renderProjectValueComponent}
          text="Project Details"
          onCancel={() => {
            setProjectDetailsModal(false)
          }}
          width="500"
        />
      ) : null}
    </div>
  )
}
export default FinanceDashboard
