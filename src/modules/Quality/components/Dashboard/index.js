import React, { useState, useEffect } from 'react'
import { Select, DatePicker, Table, Spin } from 'antd'
import { VictoryLegend, VictoryPie } from 'victory'
import Chart from 'react-apexcharts'

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
  // const [empDtlform] = Form.useForm()
  // const currDate = new Date().toISOString().split('T')[0]
  // const currntdate = moment(currDate).format('YYYY-MM-DD')
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
  const [widgetData, setWidgetData] = useState([])
  const [ratingData, setRatingData] = useState([])
  const [empData, setEmpData] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('265px')

  const [teamMemberData, setTeamMemberData] = useState([])
  const [totalvalue, setTotalvalue] = useState(null)
  // const [teamMemberData1, setTeamMemberData1] = useState([])
  const [loading, setLoading] = useState(true)
  const [projCount, setProjCount] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [fromDate, setFromDate] = useState(defaultFromDate)
  const [toDate, setToDate] = useState(defaultToDate)
  const [project, setProject] = useState(null)
  const [dropdownVal, selectDropdown] = useState('getall')
  const [projectData, setProjectData] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [filtersinfo1, setfilterinfo1] = useState([])
  const [modalView, setModalView] = useState(false)
  const [drillDownData, setDrilldownData] = useState([])
  const [widgetname, setWidgetname] = useState(null)
  const [cardName, setCardName] = useState(null)
  const [teamMemeberEnable, setTeamMemberEnable] = useState(null)
  const [pieChartRespVals, setvendorTypePieChartVals] = useState(null)
  const [vendorCategoryPieChartVals, setvendorCategoryPieChartVals] = useState(null)

  // const [deptForm] = Form.useForm()
  const { Option } = Select
  const empId = store.get('employeeId')
  const tenantID = store.get('tenantId')

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleChange1 = (pagination, filters) => {
    setfilterinfo1(filters)
  }
  const handleClick = (e, val) => {
    setWidgetname(e)
    setCardName(val)
    getDrilldownDtl(e)
    setModalView(true)
  }
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
  const venName1 = []
  const inspOk1 = []
  const rejQty1 = []
  const ca1 = []
  const reWorkQty1 = []
  const rating1 = []
  const qtyRate1 = []
  const relationshipRate1 = []
  const inwardRate1 = []

  if (ratingData && ratingData.length > 0) {
    ratingData.map(h => {
      return venName1.push(h.venName)
    })
    ratingData.map(h => {
      return inspOk1.push(h.inspOk)
    })
    ratingData.map(h => {
      return rejQty1.push(h.rejQty)
    })
    ratingData.map(h => {
      return ca1.push(h.ca)
    })
    ratingData.map(h => {
      return reWorkQty1.push(h.reWorkQty)
    })
    ratingData.map(h => {
      return rating1.push(h.qtyRate)
    })
    ratingData.map(h => {
      return qtyRate1.push(h.qtyRate)
    })
    ratingData.map(h => {
      return relationshipRate1.push(h.relationshipRate)
    })
    ratingData.map(h => {
      return inwardRate1.push(h.inwardRate)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const venName2 = venName1.filter(distinct)
  const inspOk2 = inspOk1.filter(distinct)
  const rejQty2 = rejQty1.filter(distinct)
  const ca2 = ca1.filter(distinct)
  const reWorkQty2 = reWorkQty1.filter(distinct)
  const rating2 = rating1.filter(distinct)
  const qtyRate2 = qtyRate1.filter(distinct)
  const relationshipRate2 = relationshipRate1.filter(distinct)
  const inwardRate2 = inwardRate1.filter(distinct)

  const venName3 = []
  const inspOk3 = []
  const rejQty3 = []
  const ca3 = []
  const reWorkQty3 = []
  const rating3 = []
  const qtyRate3 = []
  const relationshipRate3 = []
  const inwardRate3 = []

  venName2.map(element => {
    return venName3.push({
      text: element,
      value: element,
    })
  })
  inspOk2.map(element => {
    return inspOk3.push({
      text: element ? parseInt(element, 10) : element,
      value: element,
    })
  })
  rejQty2.map(element => {
    return rejQty3.push({
      text: element ? parseInt(element, 10) : element,
      value: element,
    })
  })
  ca2.map(element => {
    return ca3.push({
      text: element ? parseInt(element, 10) : element,
      value: element,
    })
  })
  reWorkQty2.map(element => {
    return reWorkQty3.push({
      text: element,
      value: element,
    })
  })
  rating2.map(element => {
    return rating3.push({
      text: element,
      value: element,
    })
  })
  qtyRate2.map(element => {
    return qtyRate3.push({
      text: (element * 0.6).toFixed(2),
      value: element,
    })
  })
  relationshipRate2.map(element => {
    return relationshipRate3.push({
      text: element ? parseFloat(element)?.toFixed(2) : element,
      value: element,
    })
  })
  inwardRate2.map(element => {
    return inwardRate3.push({
      text: element ? parseFloat(element)?.toFixed(2) : element,
      value: element,
    })
  })

  // drilldown
  const projName1 = []
  const vendorName1 = []
  const projCode1 = []
  const inspOn1 = []
  const qualityRate1 = []
  const rejQnty1 = []
  const rejectInternal1 = []
  const rejectExternal1 = []
  const reWorkQnty1 = []
  const reWorkInternal1 = []
  const reWorkVendor1 = []
  const caqty1 = []
  const caInternal1 = []
  const caVendor1 = []

  if (drillDownData && drillDownData.length > 0) {
    drillDownData.map(h => {
      return projName1.push(h.projName)
    })
    drillDownData.map(h => {
      return vendorName1.push(h.vendorName)
    })
    drillDownData.map(h => {
      return projCode1.push(h.projCode)
    })
    drillDownData.map(h => {
      return inspOn1.push(h.inspOn)
    })
    drillDownData.map(h => {
      return qualityRate1.push(h.qualityRate)
    })
    drillDownData.map(h => {
      return rejQnty1.push(h.rejQty)
    })
    drillDownData.map(h => {
      return rejectInternal1.push(h.rejectInternal)
    })
    drillDownData.map(h => {
      return rejectExternal1.push(h.rejectExternal)
    })
    drillDownData.map(h => {
      return reWorkQnty1.push(h.reWorkQty)
    })
    drillDownData.map(h => {
      return reWorkInternal1.push(h.reWorkInternal)
    })
    drillDownData.map(h => {
      return reWorkVendor1.push(h.reWorkVendor)
    })
    drillDownData.map(h => {
      return caqty1.push(h.ca)
    })
    drillDownData.map(h => {
      return caInternal1.push(h.caInternal)
    })
    drillDownData.map(h => {
      return caVendor1.push(h.caVendor)
    })
  }

  const distinct1 = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projName2 = projName1.filter(distinct1)
  const vendorName2 = vendorName1.filter(distinct1)
  const projCode2 = projCode1.filter(distinct1)
  const inspOn2 = inspOn1.filter(distinct1)
  const qualityRate2 = qualityRate1.filter(distinct1)
  const rejQnty2 = rejQnty1.filter(distinct1)
  const rejectInternal2 = rejectInternal1.filter(distinct1)
  const rejectExternal2 = rejectExternal1.filter(distinct1)
  const reWorkQnty2 = reWorkQnty1.filter(distinct1)
  const reWorkInternal2 = reWorkInternal1.filter(distinct1)
  const reWorkVendor2 = reWorkVendor1.filter(distinct1)
  const caqty2 = caqty1.filter(distinct1)
  const caInternal2 = caInternal1.filter(distinct1)
  const caVendor2 = caVendor1.filter(distinct1)

  const projName3 = []
  const vendorName3 = []
  const projCode3 = []
  const inspOn3 = []
  const qualityRate3 = []
  const rejQnty3 = []
  const rejectInternal3 = []
  const rejectExternal3 = []
  const reWorkQnty3 = []
  const reWorkInternal3 = []
  const reWorkVendor3 = []
  const caqty3 = []
  const caInternal3 = []
  const caVendor3 = []

  projName2.map(element => {
    return projName3.push({
      text: element,
      value: element,
    })
  })
  vendorName2.map(element => {
    return vendorName3.push({
      text: element,
      value: element,
    })
  })
  projCode2.map(element => {
    return projCode3.push({
      text: element,
      value: element,
    })
  })
  inspOn2.map(element => {
    return inspOn3.push({
      text: element,
      value: element,
    })
  })
  qualityRate2.map(element => {
    return qualityRate3.push({
      text: element,
      value: element,
    })
  })
  rejQnty2.map(element => {
    return rejQnty3.push({
      text: element,
      value: element,
    })
  })
  rejectInternal2.map(element => {
    return rejectInternal3.push({
      text: element,
      value: element,
    })
  })
  rejectExternal2.map(element => {
    return rejectExternal3.push({
      text: element,
      value: element,
    })
  })
  reWorkQnty2.map(element => {
    return reWorkQnty3.push({
      text: element,
      value: element,
    })
  })
  reWorkInternal2.map(element => {
    return reWorkInternal3.push({
      text: element,
      value: element,
    })
  })
  reWorkVendor2.map(element => {
    return reWorkVendor3.push({
      text: element,
      value: element,
    })
  })
  caqty2.map(element => {
    return caqty3.push({
      text: element,
      value: element,
    })
  })
  caInternal2.map(element => {
    return caInternal3.push({
      text: element,
      value: element,
    })
  })
  caVendor2.map(element => {
    return caVendor3.push({
      text: element,
      value: element,
    })
  })

  useEffect(() => {
    getRatingDetails()
    getWidgetDetails()
    getQualityProjCnt()
    getEmployeeForDepartment()
    getIndentProjectDtlsByDate()
    getTeamMemberEnableCheck()
    getPieChartRespDtls()
    // setLoading(false)
  }, [])

  useEffect(() => {
    getTeamMemberLoad()
  }, [dropdownVal])

  const getTeamMemberEnableCheck = async () => {
    const response = await indentFileUpload({
      requestPath: 'getTeamMemberEnableCheck',
      requestData: {
        tenantId: tenantID,
        empId,
        pmId: '6',
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setTeamMemberEnable(response.responseDataMessage)
      }
    }
  }

  const getPieChartRespDtls = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorByCatAndType',
      requestData: {
        tenantID,
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

  const getWidgetDetails = async () => {
    setFilterOpen(false)
    const response = await indentFileUpload({
      requestPath: 'getQualityWidgetDtl',
      requestData: {
        projId: project !== null ? project : 'getAll',
        tenantID,
        empId,
        pmId: '6',
        fromDate,
        toDate,
      },
    })

    if (response) {
      if (response.responseCode === '200') {
        setWidgetData(response?.responseData)
        // setLoading(false)
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
  const getEmployeeForDepartment = async () => {
    const response = await indentFileUpload({
      requestPath: 'getEmployeeForDepartment',
      requestData: {
        tenantId: tenantID,
        departmentId: 'D09',
        employeeId: '',
      },
    })
    if (response) {
      setEmpData(response)
    }
  }
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
  const getRatingDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getSupplierRating',
      requestData: {
        projId: project !== null ? project : 'getAll',
        tenantID,
        empId,
        pmId: '6',
        fromDate,
        toDate,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setRatingData(response?.responseData)
        setLoading(false)
      } else {
        setRatingData([])
      }
    }
  }

  const getTeamMemberLoad = async () => {
    const response = await indentFileUpload({
      requestPath: 'getTeamMemberLoad',
      requestData: {
        projId: project !== null ? project : 'getAll',
        tenantID,
        teamMemEmpId:
          teamMemeberEnable !== null && teamMemeberEnable === '1'
            ? dropdownVal === null
              ? 'getall'
              : dropdownVal
            : 'getall',
        empId,
        pmId: '6',
        fromDate,
        toDate,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        setTeamMemberData(response?.responseData)
        const inspectionCall = response?.responseData.reduce(
          (acc, curr) => acc + (curr.inspCall ? parseInt(curr.inspCall, 10) : 0),
          0,
        )

        const inspectionQty = response?.responseData.reduce(
          (acc, curr) => acc + (curr.inspQty ? parseInt(curr.inspQty, 10) : 0),
          0,
        )
        const total = { inspectionCall, inspectionQty }
        console.log(total)
        setTotalvalue(total)
      } else {
        setTeamMemberData([])
      }
    }
  }

  // const errorMsg = resp => {
  //   message.error(resp)
  // }
  console.log(pieChartRespVals)
  console.log(vendorCategoryPieChartVals)
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
      return pieChartCount.push({
        x:
          h.desc === '0'
            ? 'Not Approved'
            : h.desc === '1'
            ? 'Approved'
            : h.desc === '2'
            ? 'Blocked'
            : h.desc, // Set the label based on the value of desc,
        y: Number(h.count),
      })
    })
    pieChartRespVals.map(j => {
      // if(Number(Math.floor(j.energyPercentage)) !== 0){
      pieChartDesc.push({
        name: `${
          j.desc === '0'
            ? 'Not Approved'
            : j.desc === '1'
            ? 'Approved'
            : j.desc === '2'
            ? 'Blocked'
            : j.desc
        } - ${j.count}`,
      })
      // }
      return pieChartDesc
    })
  }
  if (vendorCategoryPieChartVals !== null && vendorCategoryPieChartVals !== undefined) {
    vendorCategoryPieChartVals.map(h => {
      return vendorCatCount.push({
        x: h.desc,
        y: Number(h.count),
      })
    })
    vendorCategoryPieChartVals.map(j => {
      return vendorCatDesc.push({
        name: `${j.desc} - ${j.count}`,
      })
    })
  }
  console.log(vendorCatDesc)
  console.log(donutSliceColor1)
  console.log(vendorCatCount)
  function getSelectedFromDate(value, dateString) {
    setFromDate(moment(dateString).format('YYYY-MM-DD'))
  }
  const getSelectedToDate = (value, dateString) => {
    setToDate(moment(dateString).format('YYYY-MM-DD'))
  }

  const handleCancel = () => {
    setModalView(false)
  }

  const getDrilldownDtl = async e => {
    let response
    console.log('service call check', e)
    if (e === 'CA') {
      response = await indentFileUpload({
        requestPath: 'getQiCaDtlsByPmHdrId',
        requestData: {
          pmHdrId: project !== null ? project : 'getAll',
          tenantId: tenantID,
          fromDate,
          toDate,
          typeCode: e,
          empId,
          pmId: '6',
        },
      })
    } else {
      response = await indentFileUpload({
        requestPath: 'getDrilldownDtl',
        requestData: {
          projId: project !== null ? project : 'getAll',
          tenantId: tenantID,
          typeCode: e,
          empId,
          pmId: '6',
          fromDate,
          toDate,
        },
      })
    }
    if (response) {
      if (response.responseCode === '200') {
        setDrilldownData(response?.responseData)
      }
    }
  }

  const columns = [
    {
      title: 'Vendor',
      dataIndex: 'venName',
      key: 'venName',
      width: '20%',
      filters: venName3,
      filteredValue: filtersinfo.venName,
      onFilter: (value, record) => record?.venName === value,
    },
    {
      title: 'Ok',
      dataIndex: 'inspOk',
      key: 'inspOk',
      align: 'right',
      filters: inspOk3,
      filteredValue: filtersinfo.inspOk,
      onFilter: (value, record) => record?.inspOk === value,
      render: data => <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>,
    },
    {
      title: 'Not Ok',
      dataIndex: 'rejQty',
      key: 'rejQty',
      align: 'right',
      filters: rejQty3,
      filteredValue: filtersinfo.rejQty,
      onFilter: (value, record) => record?.rejQty === value,
      render: data => <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>,
    },
    {
      title: 'CA',
      dataIndex: 'ca',
      key: 'ca',
      align: 'right',
      filters: ca3,
      filteredValue: filtersinfo.ca,
      onFilter: (value, record) => record?.ca === value,
      render: data => <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>,
    },
    {
      title: 'Rework Qty.',
      dataIndex: 'reWorkQty',
      key: 'reWorkQty',
      align: 'right',
      filters: reWorkQty3,
      filteredValue: filtersinfo.reWorkQty,
      onFilter: (value, record) => record?.reWorkQty === value,
      render: data => <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>,
    },
    {
      title: 'Quality Rating %',
      dataIndex: 'qtyRate',
      key: 'qtyRate',
      align: 'right',
      filters: qtyRate3,
      filteredValue: filtersinfo.qtyRate,
      onFilter: (value, record) => record?.qtyRate === value,
      render: qtyRate => <p>{(parseFloat(qtyRate) * 0.6)?.toFixed(2)}</p>,
    },
    {
      title: 'SCM Rating %',
      dataIndex: 'relationshipRate',
      key: 'relationshipRate',
      align: 'right',
      filters: relationshipRate3,
      filteredValue: filtersinfo.relationshipRate,
      onFilter: (value, record) => record?.relationshipRate === value,
      render: relationshipRate => <p>{parseFloat(relationshipRate)?.toFixed(2)}</p>,
    },
    {
      title: 'Inward Rating %',
      dataIndex: 'inwardRate',
      key: 'inwardRate',
      align: 'right',
      filters: inwardRate3,
      filteredValue: filtersinfo.inwardRate,
      onFilter: (value, record) => record?.inwardRate === value,
      render: inwardRate => <p>{parseFloat(inwardRate)?.toFixed(2)}</p>,
    },
    {
      title: 'Overall Rating %',
      dataIndex: 'overallrating',
      key: 'overallrating',
      align: 'right',
      render: (value, record) => {
        const total =
          parseFloat(record.qtyRate) * 0.6 +
          parseFloat(record.relationshipRate) +
          parseFloat(record.inwardRate)
        return <p>{parseFloat(total)?.toFixed(2)}</p>
      },
    },
    // {
    //   title: 'Rating %',
    //   dataIndex: 'qtyRate',
    //   key: 'qtyRate',
    //   align: 'right',
    //   filters: rating3,
    //   filteredValue: filtersinfo.qtyRate,
    //   onFilter: (value, record) => record?.qtyRate=== value,
    //   render: qtyRate => <p>{parseFloat(qtyRate)?.toFixed(2)}</p>,
    // },
  ]
  const closeFilterCard = () => {
    setFilterOpen(false)
  }
  const openFilterCard = () => {
    setFilterOpen(true)
  }
  const handleChangeProject = (val, opt) => {
    setProject(opt.key)
  }

  const DrillDowncomponent = () => {
    const [drillDownColumn, setDrillDownCol] = useState([
      {
        title: 'Project',
        dataIndex: 'projName',
        key: 'projName',
        width: 180,
        filters: projName3,
        filteredValue: filtersinfo1.projName,
        onFilter: (value, record) => record?.projName !== '' && record.projName === value,
      },
      {
        title: 'Vendor',
        dataIndex: 'vendorName',
        key: 'vendorName',
        width: 180,
        filters: vendorName3,
        filteredValue: filtersinfo1.vendorName,
        onFilter: (value, record) => record.vendorName !== '' && record.vendorName === value,
      },
      {
        title: 'Project Code',
        dataIndex: 'projCode',
        key: 'projCode',
        width: 180,
        filters: projCode3,
        filteredValue: filtersinfo1.projCode,
        onFilter: (value, record) => record?.projCode !== '' && record.projCode === value,
      },
      {
        title: 'Inspection On',
        dataIndex: 'inspOn',
        key: 'inspOn',
        width: 180,
        filters: inspOn3,
        filteredValue: filtersinfo1.inspOn,
        onFilter: (value, record) => record?.inspOn !== '' && record.inspOn === value,
        render: date => {
          return (
            <span>{date && moment(date).isValid() ? moment(date).format('DD-MMM-YYYY') : '-'}</span>
          )
        },
      },
      // {
      //   title: 'Rating %',
      //   dataIndex: 'qualityRate',
      //   align: 'right',
      //   key: 'qualityRate',
      //   width: 180,
      //   filters: qualityRate3,
      //   filteredValue: filtersinfo1.qualityRate,
      //   onFilter: (value, record) => record.qualityRate !== '' && record.qualityRate === value,
      //   render: qtyRate => <span>{parseFloat(qtyRate)?.toFixed(2)}</span>,
      // },
    ])

    useEffect(() => {
      // let newColumn
      const newColumns = [...drillDownColumn]
      console.log('widgetname', widgetname)
      if (widgetname === 'INSPECTION_QTY') {
        const newColumnsToAdd = [
          {
            title: 'No of Req Received',
            dataIndex: 'inspReqCnt',
            key: 'reqReceived',
            align: 'right',
            width: 180,
          },
          {
            title: 'No of Req Completed',
            dataIndex: 'inspCompleteCnt',
            key: 'reqCompleted',
            align: 'right',
            width: 180,
          },
          {
            title: 'Inspection Requested Qty',
            dataIndex: 'inspQty',
            key: 'inspectionRequestedQty',
            align: 'right',
            width: 180,
          },
          {
            title: 'Inspection Completed Qty',
            dataIndex: 'inspOk',
            key: 'inspectionCompletedQty',
            align: 'right',
            width: 180,
          },
          {
            title: 'QC Not Required Qty',
            dataIndex: 'inspNotReq',
            key: 'qcNotRequiredQty',
            align: 'right',
            width: 180,
          },
          {
            title: 'Under Inspection Scope %',
            key: 'underInspectionPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.underScope
                ? // ? ((r.inspectionCompletedQty / r.inspectionRequestedQty) * 100).toFixed(2)
                  r.underScope
                : '0.00',
          },
          {
            title: 'Not Under Inspection Scope %',
            key: 'notUnderInspectionPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.notUnderScope
                ? // ? ((r.qcNotRequiredQty / r.inspectionRequestedQty) * 100).toFixed(2)
                  r.notUnderScope
                : '0.00',
          },
        ]

        newColumnsToAdd.forEach((col, index) => {
          newColumns.splice(4 + index, 0, col)
        })

        setDrillDownCol(newColumns)
      } else if (widgetname === 'rej') {
        const newColumnsToAdd = [
          {
            title: 'Rejected Qty.',
            dataIndex: 'rejQty',
            key: 'rejQty',
            align: 'right',
            width: 180,
            filters: rejQnty3,
            filteredValue: filtersinfo1.rejQty,
            onFilter: (value, record) => record?.rejQty !== '' && record.rejQty === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rejected Internal Qty',
            dataIndex: 'rejectInternal',
            key: 'rejectInternal',
            align: 'right',
            width: 180,
            filters: rejectInternal3,
            filteredValue: filtersinfo1.rejectInternal,
            onFilter: (value, record) =>
              record.rejectInternal !== '' && record.rejectInternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rejected External Qty',
            dataIndex: 'rejectExternal',
            key: 'rejectExternal',
            align: 'right',
            width: 180,
            filters: rejectExternal3,
            filteredValue: filtersinfo1.rejectExternal,
            onFilter: (value, record) =>
              record.rejectExternal !== '' && record.rejectExternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rejected Internal %',
            dataIndex: 'rejectExternal',
            key: 'rejectExternal',
            align: 'right',
            width: 180,
            filters: rejectExternal3,
            filteredValue: filtersinfo1.rejectExternal,
            onFilter: (value, record) =>
              record.rejectExternal !== '' && record.rejectExternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rejected External %',
            dataIndex: 'rejectExternal',
            key: 'rejectExternal',
            align: 'right',
            width: 180,
            filters: rejectExternal3,
            filteredValue: filtersinfo1.rejectExternal,
            onFilter: (value, record) =>
              record.rejectExternal !== '' && record.rejectExternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
        ]
        newColumnsToAdd.forEach((newColumn, index) => {
          const insertAtIndex = 4 + index
          newColumns.splice(insertAtIndex, 0, newColumn)
        })
        setDrillDownCol(newColumns)
      } else if (widgetname === 'reWork') {
        const newColumnsToAdd = [
          {
            title: 'Po No.',
            dataIndex: 'poCode',
            key: 'reWorkQty',
            align: 'right',
            width: 200,
            filters: reWorkQnty3,
            filteredValue: filtersinfo1.reWorkQty,
            onFilter: (value, record) => record.reWorkQty !== '' && record.reWorkQty === value,
            render: data => <span style={{ textAlign: 'right' }}>{data || '-'}</span>,
          },
          {
            title: 'Part No.',
            dataIndex: 'prodCode',
            key: 'reWorkQty',
            align: 'right',
            width: 220,
            filters: reWorkQnty3,
            filteredValue: filtersinfo1.reWorkQty,
            onFilter: (value, record) => record.reWorkQty !== '' && record.reWorkQty === value,
            render: data => <span style={{ textAlign: 'right' }}>{data || '-'}</span>,
          },
          {
            title: 'Rework Qty.',
            dataIndex: 'reWorkQty',
            key: 'reWorkQty',
            align: 'right',
            width: 180,
            filters: reWorkQnty3,
            filteredValue: filtersinfo1.reWorkQty,
            onFilter: (value, record) => record.reWorkQty !== '' && record.reWorkQty === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rework Internal Qty.',
            dataIndex: 'reWorkQty',
            key: 'reWorkQty',
            align: 'right',
            width: 180,
            filters: reWorkQnty3,
            filteredValue: filtersinfo1.reWorkQty,
            onFilter: (value, record) => record.reWorkQty !== '' && record.reWorkQty === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rework External Qty',
            dataIndex: 'reWorkInternal',
            key: 'reWorkInternal',
            align: 'right',
            width: 180,
            filters: reWorkInternal3,
            filteredValue: filtersinfo1.reWorkInternal,
            onFilter: (value, record) =>
              record.reWorkInternal !== '' && record.reWorkInternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rework Internal %',
            dataIndex: 'reWorkVendor',
            key: 'reWorkVendor',
            align: 'right',
            width: 180,
            filters: reWorkVendor3,
            filteredValue: filtersinfo1.reWorkVendor,
            onFilter: (value, record) =>
              record.reWorkVendor !== '' && record.reWorkVendor === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'Rework External %',
            dataIndex: 'reWorkVendor',
            key: 'reWorkVendor',
            align: 'right',
            width: 180,
            filters: reWorkVendor3,
            filteredValue: filtersinfo1.reWorkVendor,
            onFilter: (value, record) =>
              record.reWorkVendor !== '' && record.reWorkVendor === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
        ]
        newColumnsToAdd.forEach((newColumn, index) => {
          const insertAtIndex = 4 + index
          newColumns.splice(insertAtIndex, 0, newColumn)
        })
        setDrillDownCol(newColumns)
      } else if (widgetname === 'CA') {
        const newColumnsToAdd = [
          {
            title: 'CA Qty.',
            dataIndex: 'qty',
            key: 'ca',
            align: 'right',
            width: 180,
            filters: ca3,
            filteredValue: filtersinfo1.ca,
            onFilter: (value, record) => record?.ca !== '' && record.ca === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'CA Raised Date',
            dataIndex: 'reqReceivedDatetime',
            key: 'caInternal',
            align: 'right',
            width: 180,
            filters: caInternal3,
            filteredValue: filtersinfo1.caInternal,
            onFilter: (value, record) => record.caInternal !== '' && record.caInternal === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>
                {data ? moment(data).format('YYYY-MM-DD') : '-'}
              </span>
            ),
          },
          {
            title: 'CA Raised By',
            dataIndex: 'caRaisedBy',
            key: 'caVendor',
            align: 'right',
            width: 180,
            filters: caVendor3,
            filteredValue: filtersinfo1.caVendor,
            onFilter: (value, record) => record.caVendor !== '' && record.caVendor === value,
            render: data => <span style={{ textAlign: 'right' }}>{data || '-'}</span>,
          },
          {
            title: 'CA Approved By',
            dataIndex: 'caApprovedBy',
            key: 'caVendor',
            align: 'right',
            width: 180,
            filters: caVendor3,
            filteredValue: filtersinfo1.caVendor,
            onFilter: (value, record) => record.caVendor !== '' && record.caVendor === value,
            render: data => <span style={{ textAlign: 'right' }}>{data || '-'}</span>,
          },
          {
            title: 'CA Approved Qty',
            // caVendor + caInternal
            dataIndex: 'caVendor',
            key: 'caVendor',
            align: 'right',
            width: 180,
            filters: caVendor3,
            filteredValue: filtersinfo1.caVendor,
            onFilter: (value, record) => record.caVendor !== '' && record.caVendor === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
          {
            title: 'CA Approved Date',
            dataIndex: 'caApprovedOn',
            key: 'caVendor',
            align: 'right',
            width: 180,
            filters: caVendor3,
            filteredValue: filtersinfo1.caVendor,
            onFilter: (value, record) => record.caVendor !== '' && record.caVendor === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>
                {data ? moment(data).format('YYYY-MM-DD') : '-'}
              </span>
            ),
          },
          {
            title: 'CA Duration',
            dataIndex: 'durationTime',
            key: 'caVendor',
            align: 'right',
            width: 180,
            filters: caVendor3,
            filteredValue: filtersinfo1.caVendor,
            onFilter: (value, record) => record.caVendor !== '' && record.caVendor === value,
            render: data => (
              <span style={{ textAlign: 'right' }}>{data && parseInt(data, 10)}</span>
            ),
          },
        ]
        newColumnsToAdd.forEach((newColumn, index) => {
          const insertAtIndex = 4 + index
          newColumns.splice(insertAtIndex, 0, newColumn)
        })
        setDrillDownCol(newColumns)
      } else if (widgetname === 'inspOk') {
        const newColumnsToAdd = [
          { title: 'OK Qty', dataIndex: 'okQty', key: 'okQty', align: 'right', width: 180 },
          { title: 'CA Qty', dataIndex: 'ca', key: 'caQty', align: 'right', width: 180 },
          { title: 'Rejected Qty', dataIndex: 'rejQty', key: 'rejQty', align: 'right', width: 180 },
          {
            title: 'Rework Qty',
            dataIndex: 'reWorkQty',
            key: 'rewQty',
            align: 'right',
            width: 180,
          },

          {
            title: 'OK %',
            key: 'okPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.inspCompleteCnt
                ? ((r.okQty / r.inspCompleteCnt) * 100).toFixed(2)
                : '0.00',
          },
          {
            title: 'CA %',
            key: 'caPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.inspCompleteCnt
                ? ((r.ca / r.inspCompleteCnt) * 100).toFixed(2)
                : '0.00',
          },
          {
            title: 'Rew %',
            key: 'rewPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.inspCompleteCnt
                ? ((r.reWorkQty / r.inspCompleteCnt) * 100).toFixed(2)
                : '0.00',
          },
          {
            title: 'Rej %',
            key: 'rejPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.inspectionCompletedQty
                ? ((r.rejQty / r.inspectionCompletedQty) * 100).toFixed(2)
                : '0.00',
          },
          {
            title: 'QC Not Required %',
            key: 'qcNotReqPct',
            align: 'right',
            width: 180,
            render: (_, r) =>
              r.inspReqCnt
                ? ((r.qcNotRequiredQty / r.inspReqCnt) * 100).toFixed(2)
                : '0.00',
          },
        ]
        newColumnsToAdd.forEach((newColumn, index) => {
          const insertAtIndex = 4 + index
          newColumns.splice(insertAtIndex, 0, newColumn)
        })
        setDrillDownCol(newColumns)
      }
    }, [widgetname])

    return (
      <div>
        <Table
          columns={drillDownColumn}
          dataSource={drillDownData}
          scroll={{ y: 450, x: 'max-content' }}
          tableLayout="fixed"
          onChange={handleChange1}
          pagination={false}
        />
      </div>
    )
  }

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
        return `${vendorCatDesc[seriesIndex].name}` // Use your description array for legend
      },
    },
  }

  const seriesType = pieChartCount.map(item => item.y)
  const optionsType = {
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
    labels: pieChartCount.map(item => item.x), // Labels for the pie slices
    legend: {
      position: 'right',
      // verticalAlign: 'left',
      align: 'center',
      formatter: (seriesName, { seriesIndex }) => {
        return `${pieChartDesc[seriesIndex].name}` // Use your description array for legend
      },
    },
  }

  return (
    <div className="Dashboard" style={isMobile ? { width: tableWidth } : {}}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={!isMobile ? { marginRight: '10px' } : { marginLeft: '20px' }}>
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
                : { flex: 1, fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }
            }
          >
            Quality Dashboard
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
          <Widget widgetData={widgetData} projCount={projCount} handleClick={handleClick} />
        </div>
        <div className="row" style={{ marginTop: '0px' }}>
          <div
            className="custom-card col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12"
            style={{ marginBottom: '5px' }}
          >
            <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div
                style={{
                  marginLeft: '10px',
                  fontWeight: '700',
                  fontFamily: 'Arial, sans-serif',
                  color: 'gray',
                }}
              >
                Team Member
              </div>
              <div style={{ width: '35%', marginRight: '15px' }}>
                {teamMemeberEnable === '1' && (
                  <Select
                    style={{ width: '100%' }}
                    defaultValue="Get All"
                    onChange={(e, val) => {
                      selectDropdown(val.key)
                    }}
                  >
                    <Option key="getAll" value="getall">
                      Get All
                    </Option>
                    {empData?.map(item => (
                      <Option key={item.employeeId} value={item.employeeId}>
                        {item.employeeName}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
              {totalvalue ? (
                <div style={{ marginLeft: '12px', width: '100%' }}>
                  Total Inspectino Call : {totalvalue.inspectionCall} &nbsp;&nbsp;&nbsp;&nbsp; Total
                  Inspection Call Completed : {totalvalue.inspectionQty}
                </div>
              ) : null}
            </div>
            <LineChart teamMemberData={teamMemberData} />
          </div>
          <div
            className="card supplier col-xl-7 col-lg-7 col-md-12 col-sm-12 col-xs-12"
            style={{ height: '400px', marginBottom: '5px' }}
          >
            <p
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: '700',
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
              }}
            >
              Supplier Rating
            </p>
            <Table
              columns={columns}
              dataSource={ratingData}
              scroll={{ y: 250, x: true }}
              onChange={handleChange}
              // pagination={false}
            />
          </div>
        </div>
      </div>
      <ModalPopup
        text={`Quality Details - ${cardName}`}
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
                  value={fromDate && moment(fromDate)}
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
                  value={toDate && moment(toDate)}
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
                >
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                  {projectData?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}- {item.customerName}
                    </Option>
                  ))}
                </Select>
              ),
            },

            {
              key: 4,
              component: (
                <div style={{ paddingRight: '40%' }}>
                  <Button
                    type="primary"
                    size="medium"
                    text="Submit"
                    onClick={() => {
                      setLoading(true)
                      getWidgetDetails()
                      getRatingDetails()
                      getQualityProjCnt()
                      getTeamMemberLoad()
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      )}

      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-0">
          <DashboardTableView pmId="6" selectedMonth={null} fromDate={fromDate} toDate={toDate} />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 p-0">
          <div className="card">
            <span
              style={{
                align: 'center',
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: '700',
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
              }}
            >
              Vendor Type
            </span>
            <div style={{ marginLeft: '50px' }}>
              <Chart
                options={optionsType}
                series={seriesType}
                type="pie" // Change to 'pie' if you want a full pie chart
                width={440}
              />
            </div>
            {/* <svg viewBox="0 20 400 150">
              <VictoryLegend
                standalone={false}
                colorScale={donutSliceColor}
                width={200}
                height={200}
                x={150}
                y={50}
                orientation="vertical"
                gutter={40}
                title="Legend"
                itemsPerRow={4}
                centerTitle
                style={{
                  border: { stroke: 'black' },
                  title: { fontSize: 8 },
                  labels: { fontSize: 8 },
                }}
                data={pieChartDesc}
              />
              <VictoryPie
                colorScale={donutSliceColor}
                standalone={false}
                width={190}
                height={190}
                data={pieChartCount}
                innerRadius={0}
                labelRadius={20}
                style={{
                  labels: { fontSize: 5, fill: 'white', display: 'none' },
                  title: { fontSize: 10 },
                }}
              />
            </svg> */}
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 p-0">
          <div className="card">
            <span
              style={{
                align: 'center',
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: '700',
                fontFamily: 'Arial, sans-serif',
                color: 'gray',
              }}
            >
              Vendor Category
            </span>

            <div style={{ marginLeft: '50px' }}>
              <Chart
                options={optionsVal}
                series={series}
                type="pie" // Change to 'pie' if you want a full pie chart
                width={500}
              />
            </div>
            {/* <svg viewBox="30 20 400 150">
              <VictoryLegend
                standalone={false}
                colorScale={donutSliceColor1}
                width={170}
                height={170}
                x={150}
                y={50}
                orientation="vertical"
                itemsPerRow={5}
                gutter={40}
                title="Legend"
                centerTitle
                style={{
                  border: { stroke: 'black' },
                  title: { fontSize: 8 },
                  labels: { fontSize: 8 },
                }}
                data={vendorCatDesc}
              />
              <VictoryPie
                colorScale={donutSliceColor1}
                standalone={false}
                width={190}
                height={190}
                data={vendorCatCount}
                innerRadius={0}
                labelRadius={20}
                style={{
                  labels: { fontSize: 5, fill: 'white', display: 'none' },
                  title: { fontSize: 10 },
                }}
              />
            </svg> */}
          </div>
        </div>
      </div>
      <div className="row" style={{ display: 'none' }}>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <div className="card">
            <svg viewBox="0 20 400 400">
              <VictoryLegend
                standalone={false}
                colorScale={donutSliceColor}
                width={200}
                height={200}
                x={20}
                y={150}
                orientation="vertical"
                gutter={20}
                title="Legend"
                centerTitle
                style={{
                  border: { stroke: 'black' },
                  title: { fontSize: 10 },
                  labels: { fontSize: 10 },
                }}
                data={pieChartDesc}
              />
              <VictoryPie
                colorScale={donutSliceColor}
                standalone={false}
                width={50}
                height={50}
                data={pieChartCount}
                innerRadius={0}
                labelRadius={20}
                style={{
                  labels: { fontSize: 5, fill: 'white', display: 'none' },
                  title: { fontSize: 10 },
                }}
              />
            </svg>
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <div className="card">
            <svg viewBox="0 20 400 400">
              <VictoryLegend
                standalone={false}
                colorScale={donutSliceColor1}
                width={300}
                height={250}
                x={20}
                y={150}
                orientation="vertical"
                itemsPerRow={4}
                gutter={20}
                title="Legend"
                centerTitle
                style={{
                  border: { stroke: 'black' },
                  title: { fontSize: 10 },
                  labels: { fontSize: 10 },
                }}
                data={vendorCatDesc}
              />
              <VictoryPie
                colorScale={donutSliceColor1}
                standalone={false}
                width={200}
                height={200}
                data={vendorCatCount}
                innerRadius={0}
                labelRadius={20}
                style={{
                  labels: { fontSize: 5, fill: 'white', display: 'none' },
                  title: { fontSize: 10 },
                }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
export default QualityDashboard
