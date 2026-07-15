import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import store from 'store'
import _ from 'lodash'
// import { Table } from 'ant-table-extensions'
import { FileExcelOutlined } from '@ant-design/icons'
// import { FaCircleInfo } from 'react-icons/fa6'
import {
  Form,
  Card,
  Row,
  Divider,
  Button,
  DatePicker,
  Select,
  message,
  Input,
  // Popover,
  Checkbox,
  Table,
} from 'antd'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
import currentDateTime from '../../../../currentDateTime'

const VendorBasedQualityRating = () => {
  const { Option } = Select
  const [allqtyForm] = Form.useForm()
  const [vendorDrpDwn, setVendorDrpDwn] = useState([])
  const [vendorGetDtlsVal, setVendorGetDtlsVal] = useState([])
  const [vendorGetDtlsVal2, setVendorGetDtlsVal2] = useState([])
  const [slctdVendorName, setSlctdVendorNameval] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [vendrQltyDtlsVal, setVendrQltyDtlsVal] = useState([])
  // const [overall, setOverall] = useState('')
  const [avgoverall, setAvgoverall] = useState('')
  const [inwardPerformance, setInwardPerformance] = useState('')
  const [supplierPerformance, setSupplierPerformance] = useState('')

  const [showData, setShowData] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')

  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate

  const handleChange = (pagination, filters, sorter, extra) => {
    setfilterinfo(filters)
    calculatePercentage(extra.currentDataSource)
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

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  // const defaultFromDate = moment('2023-04-01', 'YYYY-MM-DD')
  // const defaultToDate = moment('2024-03-31', 'YYYY-MM-DD')

  useEffect(() => {
    getVendorDrpDwnList()
  }, [])

  const getVendorDrpDwnList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getApprVendorDtls',
      requestData: {
        tenantId,
        approved: '1',
      },
    })
    if (response?.responseCode === '200') {
      setVendorDrpDwn(response?.responseData)
      // message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
      setVendorDrpDwn([])
    }
  }
  const getVendorGetDtls = () => {
    const formvalues = allqtyForm.getFieldValue()
    if (
      formvalues.ToDate !== null &&
      formvalues.FromDate !== null &&
      formvalues.Vendor !== undefined
    ) {
      getMatralInwrdPopUp(formvalues.ToDate, formvalues.FromDate, formvalues.Vendor)
      setShowData(true)
    } else {
      messageReturn(405)
    }
  }

  const getMatralInwrdPopUp = async (todate, fromdate, Vendor) => {
    const response = await indentFileUpload({
      requestPath: 'getQtyInspectionHdr',
      requestData: {
        tenantId,
        fromDate: moment(fromdate).format('YYYY-MM-DD'),
        toDate: moment(todate).format('YYYY-MM-DD'),
        vendor: Vendor,
        empId: employeeId,
      },
    })
    if (response?.responseCode === '200') {
      // setVendorGetDtlsVal(response ?.responseData[0].qtyinspectionList)
      const newData = response?.responseData[0].qtyinspectionList.map(data => {
        const overallRating = Number(
          parseFloat(data.inwardRating || 0) +
            parseFloat(data.supplierRating || 0) +
            parseFloat(Number(data.qualityRating * 0.6).toString() || 0),
        )
        return {
          ...data,
          sno: data.sno,
          qiHdrId: data.qiHdrId,
          pmHdrCode: data.pmHdrCode,
          inspectedOn: data.inspectedOn,
          vendorName: data.vendorName,
          poCode: data.poCode,
          inspectionQty: data.inspectionQty,
          okQty: data.okQty,
          totalCa: data.totalCa,
          qualityRating: data.qualityRating,
          totalrejected: data.totalrejected,
          totalRework: data.totalRework,
          qualityAvgRating: Number(data.qualityRating * 0.6).toString(),
          inwardRating: data.inwardRating.toString(),
          supplierRating: data.supplierRating.toString(),
          empDesc: data.empDesc,
          overallRating: Number(
            parseFloat(data.inwardRating || 0) +
              parseFloat(data.supplierRating || 0) +
              parseFloat(Number(data.qualityRating * 0.6).toString() || 0),
          ),
          Grade:
            overallRating >= 85 ? 'A' : overallRating >= 70 ? 'B' : overallRating >= 60 ? 'C' : 'D',
          isEdited: false,
        }
      })
      newData.sort((a, b) => {
        const getLastNumber = (code) => {
          const parts = code.split('/')
          return parseInt(parts[parts.length - 1], 10) || 0
        }
        // Sort by project number first
        if (a.pmHdrCode === b.pmHdrCode) {
          return getLastNumber(a.poCode) - getLastNumber(b.poCode)
        }
        return a.pmHdrCode.localeCompare(b.pmHdrCode)
      })
  
      setVendorGetDtlsVal(newData)
      setVendorGetDtlsVal2(newData)

      // const ratings = response?.responseData?.[0]?.qtyinspectionList
      // const sum = ratings.reduce(
      //   (accumulator, item) => accumulator + parseFloat(item.qualityRating),
      //   0,
      // )
      // const inwardRating = ratings.reduce(
      //   (accumulator, item) => accumulator + parseFloat(item.inwardRating),
      // )
      // const supplierRating = ratings.reduce(
      //   (accumulator, item) => accumulator + parseFloat(item.supplierRating),
      // )
      // const count = ratings.length
      // const average = sum / count
      // const sixAvg = (sum * 0.6) / count
      // setOverall(average)
      // setAvgoverall(sixAvg)
      // setInwardPerformance(inwardRating)
      // setSupplierPerformance(supplierRating)
      setVendrQltyDtlsVal(response?.responseData[0])
      calculatePercentage(newData)
      calculatePercentage(response?.responseData?.[0]?.qtyinspectionList)
    } else {
      message.error(response?.responseMessage)
      setVendorGetDtlsVal([])
      setVendorGetDtlsVal2([])
    }
  }

  const calculatePercentage = Data => {
    const sum = Data?.reduce((accumulator, item) => accumulator + parseFloat(item.qualityRating), 0)
    const inwardRating = Data?.reduce(
      (accumulator, item) => accumulator + parseFloat(item.inwardRating),
      0,
    )
    const supplierRating = Data?.reduce(
      (accumulator, item) => accumulator + parseFloat(item.supplierRating),
      0,
    )

    const count = Data?.length
    // const average = sum / count
    const sixAvg = (sum * 0.6) / count || 0
    const inwardPer = inwardRating / count || 0
    const supplierPer = supplierRating / count || 0
    // const average = (sum * 0.6) / count
    // const sixAvg = (sum * 0.6) / count
    // const inwardPer = (inwardRating * 0.2) / count
    // const supplierPer = (supplierRating * 0.2) / count
    // setOverall(sixAvg)
    setAvgoverall(sixAvg)
    setInwardPerformance(inwardPer)
    setSupplierPerformance(supplierPer)
  }
  const handleClear = () => {
    allqtyForm.resetFields()
    setVendorGetDtlsVal([])
    setVendorGetDtlsVal2([])
    setShowData(false)
  }
  const projectNo = []
  const inspectedOn = []
  const vendorName = []
  const poCode = []
  const inspectionQty = []
  const okQty = []
  const totalCa = []
  const totalRework = []
  const totalrejected = []
  const qualityRating = []
  const overallqualityRating = []
  const inwardRating1 = []

  if (vendorGetDtlsVal && vendorGetDtlsVal.length > 0) {
    vendorGetDtlsVal.map(h => {
      return projectNo.push(h.pmHdrCode)
    })
    vendorGetDtlsVal.map(h => {
      return inspectedOn.push(h.inspectedOn)
    })
    vendorGetDtlsVal.map(h => {
      return vendorName.push(h.vendorName)
    })
    vendorGetDtlsVal.map(h => {
      return poCode.push(h.poCode)
    })
    vendorGetDtlsVal.map(h => {
      return inspectionQty.push(h.inspectionQty)
    })
    vendorGetDtlsVal.map(h => {
      return okQty.push(h.okQty)
    })
    vendorGetDtlsVal.map(h => {
      return totalCa.push(h.totalCa)
    })
    vendorGetDtlsVal.map(h => {
      return totalRework.push(h.totalRework)
    })
    vendorGetDtlsVal.map(h => {
      return totalrejected.push(h.totalrejected)
    })
    vendorGetDtlsVal.map(h => {
      return qualityRating.push(h.qualityAvgRating)
    })
    vendorGetDtlsVal.map(h => {
      return overallqualityRating.push(h.qualityAvgRating)
    })
    vendorGetDtlsVal.map(h => {
      return inwardRating1.push(h.inwardRating)
    })
  }

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== "" && self.indexOf(value) === index;
  }

  const projectNo2 = projectNo.filter(distinct)
  const inspectedOn2 = inspectedOn.filter(distinct)
  const vendorName2 = vendorName.filter(distinct)
  const poCode2 = poCode.filter(distinct)
  const inspectionQty2 = inspectionQty.filter(distinct)
  const okQty2 = okQty.filter(distinct)
  const totalCa2 = totalCa.filter(distinct)
  const totalRework2 = totalRework.filter(distinct)
  const totalrejected2 = totalrejected.filter(distinct)
  const qualityRating2 = qualityRating.filter(distinct)
  const overallqualityRating2 = overallqualityRating.filter(distinct)
  const inwardRating2 = inwardRating1.filter(distinct)

  const projectNo3 = []
  const inspectedOn3 = []
  const vendorName3 = []
  const poCode3 = []
  const inspectionQty3 = []
  const okQty3 = []
  const totalCa3 = []
  const totalRework3 = []
  const totalrejected3 = []
  const qualityRating3 = []
  const overallqualityRating3 = []
  const inwardRating3 = []

  projectNo2.map(element => {
    return projectNo3.push({
      text: element,
      value: element,
    })
  })
  inspectedOn2.map(element => {
    return inspectedOn3.push({
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
  poCode2.map(element => {
    return poCode3.push({
      text: element,
      value: element,
    })
  })
  inspectionQty2.map(element => {
    return inspectionQty3.push({
      text: element,
      value: element,
    })
  })
  okQty2.map(element => {
    return okQty3.push({
      text: element,
      value: element,
    })
  })
  totalCa2.map(element => {
    return totalCa3.push({
      text: element,
      value: element,
    })
  })
  totalRework2.map(element => {
    return totalRework3.push({
      text: element,
      value: element,
    })
  })
  totalrejected2.map(element => {
    return totalrejected3.push({
      text: element,
      value: element,
    })
  })
  qualityRating2.map(element => {
    return qualityRating3.push({
      text: element,
      value: element,
    })
  })
  overallqualityRating2.map(element => {
    return overallqualityRating3.push({
      text: element,
      value: element,
    })
  })
  inwardRating2.map(element => {
    return inwardRating3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 70,
      fixed: 'left',
    },
    {
      title: 'Project Number',
      dataIndex: 'pmHdrCode',
      key: 'pmHdrCode',
      width: 100,
      fixed: 'left',
      filters: projectNo3.sort((a,b) => a.value.localeCompare(b.value)), 
      filteredValue: filtersinfo.pmHdrCode,
      onFilter: (value, record) => record?.pmHdrCode === value,
    },
    {
      title: 'Inspection Date',
      dataIndex: 'inspectedOn',
      key: 'inspectedOn',
      width: 100,
      fixed: 'left',
      filters: inspectedOn3.sort((a,b)=>{
        return new Date(a.value)-new Date(b.value);
      }),
      filteredValue: filtersinfo.inspectedOn || null,
      onFilter: (value, record) => record?.inspectedOn === value,
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 200,
      fixed: 'left',
      filters: vendorName3,
      filteredValue: filtersinfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      width: 140,
      fixed: 'left',
      filters: poCode3,
      filteredValue: filtersinfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
    },
    // Qty offered for Inspection
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: 'Qty offered for Inspection',
      dataIndex: 'inspectionQty',
      key: 'inspectionQty',
      width: 100,
      align: 'right',
      filters: inspectionQty3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.inspectionQty,
      onFilter: (value, record) => record?.inspectionQty === value,
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Ok Qty.',
      dataIndex: 'okQty',
      key: 'okQty',
      width: 100,
      align: 'right',
      filters: okQty3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.okQty,
      onFilter: (value, record) => record?.okQty === value,
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'CA Qty.',
      dataIndex: 'totalCa',
      key: 'totalCa',
      filters: totalCa3.sort((a,b)=>a.value-b.value),
      width: 100,
      align: 'right',
      filteredValue: filtersinfo.totalCa,
      onFilter: (value, record) => record?.totalCa === value,
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Rework Qty.',
      dataIndex: 'totalRework',
      key: 'totalRework',
      width: 100,
      align: 'right',
      filters: totalRework3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.totalRework,
      onFilter: (value, record) => record?.totalRework === value,
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Rejected Qty.',
      dataIndex: 'totalrejected',
      key: 'totalrejected',
      width: 100,
      align: 'right',
      filters: totalrejected3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.totalrejected,
      onFilter: (value, record) => record?.totalrejected === value,
      render: text => Number(text).toFixed(0),
    },
    // {
    //   title: 'Quality Rating (against 100%)',
    //   dataIndex: 'qualityRating',
    //   key: 'qualityRating',
    //   filters: qualityRating3,
    //   filteredValue: filtersinfo.qualityRating,
    //   onFilter: (value, record) => record?.qualityRating=== value,
    //   render: text => Number(text).toFixed(0),
    // },
    // {
    //   title: 'Overall Quality Rating (against 60% from the 100%)',
    //   dataIndex: 'qualityAvgRating',
    //   key: 'qualityAvgRating',
    //   filters: overallqualityRating3,
    //   filteredValue: filtersinfo.qualityAvgRating,
    //   onFilter: (value, record) => record?.qualityAvgRating=== value,
    //   render: text => Number(text).toFixed(0),
    // },
    {
      title: 'Quality Rating (against 60% from the 100%)',
      dataIndex: 'qualityAvgRating',
      key: 'qualityAvgRating',
      filters: qualityRating3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.qualityAvgRating,
      onFilter: (value, record) => record?.qualityAvgRating === value,
      width: 160,
      // fixed: 'right',
    },
    {
      title: 'Inward Rating (against 20% from the 100%)',
      dataIndex: 'inwardRating',
      key: 'inwardRating',
      width: 160,
      filters: inwardRating3.sort((a,b)=>a.value-b.value),
      filteredValue: filtersinfo.inwardRating,
      onFilter: (value, record) => record?.inwardRating === value,
      render: text => Number(text).toFixed(0),
      // fixed: 'right',
    },
    {
      title: 'Supplier Rating (against 20% from the 100%)',
      dataIndex: 'supplierRating',
      key: 'supplierRating',
      width: 160,
      // fixed: 'right',
      render: (text, record) => {
        return (
          <Input
            value={Number(text).toFixed(0)}
            readOnly={record.inputEnable === 0}
            onChange={e =>
              handleSupplierRatingChange(
                Math.min(Math.max(0, parseInt(e.target.value, 10)), 20),
                record,
              )
            }
            max={20}
            min={0}
            type="number"
            formatter={value => `${value}`.replace(/[^0-2]/g, '')}
          />
        )
      },
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      width: 100,
      render: text => Number(text).toFixed(0),
      // render: (text, record) => {
      //   const content = (
      //     <div>
      //       <p>{record.empDesc}</p>
      //     </div>
      //   )
      //   return (
      //     <Popover content={content} title="Ratings Given by">
      //       <div>
      //         {text} &nbsp;&nbsp;
      //         <FaCircleInfo
      //           style={{ cursor: 'pointer', marginBottom: '-2px', color: '#6565eb' }}
      //           onClick={e => e.stopPropagation()}
      //         />
      //       </div>
      //     </Popover>
      //   )
      // },
    },
    {
      title: 'Grade',
      dataIndex: 'Grade',
      key: 'Grade',
      width: 100,
      render: text => <div style={{ fontWeight: 700 }}>{text}</div>,
    },
    {
      title: 'Customer Complaint',
      dataIndex: 'customerComplaint',
      key: 'customerComplaint',
      width: 100,
      // fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <Checkbox
              disabled={record.inputQtyEnable === 0}
              checked={text === '1'}
              onChange={() => handleCheckboxChange(record)}
            />
          </div>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => {
                handlesave(record)
              }}
            >
              Save
            </Button>
          </div>
        )
      },
    },
  ]

  const handleCheckboxChange = record => {
    const newData = vendorGetDtlsVal.map(item => {
      if (item.qiHdrId === record.qiHdrId) {
        return {
          ...item,
          customerComplaint: record.customerComplaint === '1' ? '0' : '1',
          isEdited: !record.isEdited,
        }
      }
      return item
    })
    setVendorGetDtlsVal(newData)
  }
  const handleSupplierRatingChange = (value, record) => {
    const newData = vendorGetDtlsVal.map(item => {
      if (item.qiHdrId === record.qiHdrId) {
        const overallRating = (
          parseFloat(item.inwardRating || 0) +
          parseFloat(item.qualityAvgRating || 0) +
          parseFloat(value || 0)
        ).toFixed(0)
        return {
          ...item,
          supplierRating: value,
          overallRating,
        }
      }
      return item
    })
    setVendorGetDtlsVal(newData)
  }
  const handlesave = async record => {
    handlesave1(record)
    if (record.inputEnable === 1) {
      const response = await indentFileUpload({
        requestPath: 'updateVendorRating',
        requestData: {
          qiHdrId: record.qiHdrId,
          supplierValue: record.supplierRating || 0,
          empId: employeeId,
          tenantId,
        },
      })
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        getVendorGetDtls()
      }
    }
  }

  const handlesave1 = async record => {
    if (record.isEdited === true && record.inputQtyEnable === 1) {
      const response = await indentFileUpload({
        requestPath: 'customerComplaintCheck',
        requestData: {
          hdrId: record.qiHdrId,
          checkVal: record.customerComplaint,
          tenantId,
        },
      })
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        getVendorGetDtls()
      }
    }
  }
  const setSlctdVendorName = (value, option) => {
    setVendorGetDtlsVal([])
    setSlctdVendorNameval(option.children)
    setShowData(false)
  }

  const QualityDtlsArry = [
    // {
    //   key: 1,
    //   label: 'Vendor Name',
    //   value: vendrQltyDtlsVal?.vendorName || '-',
    // },
    {
      key: 1,
      label: 'Total Inspection Requested',
      value: parseInt(vendorGetDtlsVal?.length, 10) || '-',
    },
    {
      key: 2,
      label: 'Total No. of Items offered for Inspection',
      value: parseInt(vendrQltyDtlsVal?.totalInspectionQty, 10) || '-',
    },
    {
      key: 3,
      label: 'Total No. of Items Directly Accepted',
      value: parseInt(vendrQltyDtlsVal?.totalOkty, 10) || '-',
    },
    {
      key: 4,
      label: 'Total No. of Items Conditionally Accepted',
      value:
        parseInt(vendrQltyDtlsVal?.totalCaInternal, 10) +
          parseInt(vendrQltyDtlsVal?.totalCaVendor, 10) || '-',
    },
    // {
    //   key: 5,
    //   label: 'Total Conditionally Accepted - Due to Supplier Mistake',
    //   value: Number(vendrQltyDtlsVal?.totalCaVendor).toFixed(0) || '-',
    // },
    {
      key: 5,
      label: 'Total No. of Items Rework',
      value:
        parseInt(vendrQltyDtlsVal?.totalReworkInternal, 10) +
          parseInt(vendrQltyDtlsVal?.totalReworkVendor, 10) || '-',
    },
    // {
    //   key: 6,
    //   label: 'Total Rework - Due to Supplier Mistake',
    //   value: Number(vendrQltyDtlsVal?.totalReworkVendor).toFixed(0) || '-',
    // },
    {
      key: 6,
      label: 'Total No. of Items Rejected',
      value:
        parseInt(vendrQltyDtlsVal?.totalRejectedInternal, 10) +
          parseInt(vendrQltyDtlsVal?.totalRejectedExternal, 10) || '-',
    },
    // {
    //   key: 9,
    //   label: 'Total Rejected - Due to supplier mistake',
    //   value: Number(vendrQltyDtlsVal?.totalRejectedExternal).toFixed(0) || '-',
    // },
  ]
  // const handleSearch = e => {
  //   const filtered = vendorGetDtlsVal2.filter(item =>
  //     Object.keys(item).some(key =>
  //       item[key]
  //         ?.toString()
  //         .toLowerCase()
  //         .includes(e.target.value.toLowerCase()),
  //     ),
  //   )
  //   setVendorGetDtlsVal(filtered)
  // }

  const debouncedSearch = useCallback(
    _.debounce(value => {
      const filtered = vendorGetDtlsVal2.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
      setVendorGetDtlsVal(filtered)
    }, 300),
    [vendorGetDtlsVal2],
  )

  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }

  const handleExport = () => {
    const headers = columns.map(col => col.title || col.dataIndex).join(',')
    const rows = vendorGetDtlsVal.map(row => {
      return columns
        .map(col => {
          const cellValue = row[col.dataIndex]
          if (
            typeof cellValue === 'string' &&
            (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"'))
          ) {
            // Escape special characters
            return `"${cellValue.replace(/"/g, '""')}"`
          }
          return cellValue
        })
        .join(',')
    })

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n')

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `VendorQualityRating_${currentDateTime}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Form form={allqtyForm}>
        <Card style={{ width: '100%', marginTop: '13px' }} title="Vendor Quality Rating">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="FromDate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="ToDate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultToDate)}
              >
                <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Vendor"
                label={
                  <span>
                    Vendor<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  showSearch
                  // style={{ width: 200 }}
                  placeholder="Search to Select"
                  onChange={setSlctdVendorName}
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                >
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                  {vendorDrpDwn?.map(item => (
                    <Option
                      key={item.vendorCode}
                      value={item.vendorCode}
                      label={`(${item.vendorUniqueCode}) - ${item.vendorName}`}
                    >
                      <div>
                        ({item.vendorUniqueCode}) - {item.vendorName}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={getVendorGetDtls}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {vendorDrpDwn && vendorDrpDwn.length > 0 && (
            <div style={{ display: showData ? 'block' : 'none' }}>
              <Row>
                <Divider orientation="left">
                  Vendor Quality Details{' '}
                  {slctdVendorName !== 'Get All' ? `- ${slctdVendorName}` : null}
                </Divider>
              </Row>

              <div style={{ display: showData ? 'block' : 'none' }}>
                {slctdVendorName !== 'Get All' && showData ? (
                  <Card bordered={false} className="custom-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {QualityDtlsArry.map(item => (
                        <div key={item.key}>
                          <p style={{ fontWeight: 'bold', margin: '0px' }}>{item.label}</p>
                          <p style={{ margin: '0px' }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : null}
              </div>
              <div>
                <Button icon={<FileExcelOutlined />} type="primary" onClick={handleExport}>
                  Export to CSV
                </Button>
                <Input.Search
                  style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
                  placeholder="Search here..."
                  enterButton
                  // onSearch={handleSearch}
                  onChange={e => handleSearch(e)}
                />
              </div>
              <div style={{ display: showData ? 'block' : 'none' }}>
                <Table
                  columns={columns}
                  dataSource={vendorGetDtlsVal}
                  pagination={{
                    pageSizeOptions: ['10', '20', '30', '50', [vendorGetDtlsVal?.length]],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                  }}
                  scroll={{ y: 500 }}
                  bordered
                  onChange={handleChange}
                  footer={() => (
                    <div
                      style={{
                        fontSize: '16px',
                        marginLeft: '32px',
                        textAlign: 'right',
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ padding: '0px 50px' }}>
                        Quality performance :
                        {avgoverall !== null || undefined
                          ? `${parseFloat(avgoverall || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`
                          : `${parseFloat(avgoverall || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`}{' '}
                      </span>
                      <span style={{ padding: '0px 50px' }}>
                        Delivery performance :
                        {inwardPerformance !== null || undefined
                          ? `${parseFloat(inwardPerformance || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`
                          : `${parseFloat(inwardPerformance || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`}{' '}
                      </span>
                      <span style={{ padding: '0px 50px' }}>
                        Service & Response :
                        {supplierPerformance !== null || undefined
                          ? `${parseFloat(supplierPerformance || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`
                          : `${parseFloat(supplierPerformance || 0)
                              .toFixed(2)
                              .toLocaleString('en-IN')}%`}{' '}
                      </span>

                      {/* <span style={{ padding: '0px 50px' }}>
                        Avg. Overall Quality Rating (against 60% from the 100%) :
                        {avgoverall !== null || undefined
                          ? `${parseFloat(avgoverall).toFixed(2).toLocaleString('en-IN')}%`
                          : `${parseFloat(avgoverall).toFixed(2).toLocaleString('en-IN')}%`}
                      </span> */}
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </Card>
      </Form>
    </div>
  )
}

export default VendorBasedQualityRating
