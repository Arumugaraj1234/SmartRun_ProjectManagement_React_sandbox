import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  message,
  Row,
  Divider,
  Input,
  Form,
  Modal,
  DatePicker,
  Select,
  Col,
  Space,
  Popconfirm,
} from 'antd'
import store from 'store'
import moment from 'moment'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import { PlusOutlined, SecurityScanOutlined, FileExcelOutlined } from '@ant-design/icons'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopupBox from 'components/shared/ModalPopupComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import CommonFields3 from 'modules/scm/components/CommonFields3'
import MaterialInwardAssign from 'modules/scm/components/MaterialInward/materialinwardassign'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../../style.scss'
import currentDateTime from '../../../../currentDateTime'

// const { TextArea } = Input
const MaterialInward = () => {
  // const [form] = Form.useForm()
  const { Option } = Select
  const [allqtyForm] = Form.useForm()
  const [createInwardForm] = Form.useForm()
  const [retrieveInwardForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  const tenantIdVal = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [pmHdrid, setPmhdrId] = useState(null)
  const [isModalVal, setIsModalVal] = useState(false)
  const [showInwardDetail, setShowInwardDetail] = useState(false)
  const [showaddinwardpop, setshowaddinwardpop] = useState(false)
  const [respMatrlInwrdDtls, setRespMatrlInwrdDtls] = useState([])
  const [vendorName, setVendorName] = useState('')
  const [inwardCode, setInwardCode] = useState('')
  const [matrlInwrdRespPopUpval, setMatrlInwrdRespPopUpval] = useState([])
  const [orderedQty, setOrderedQty] = useState('')
  const [receivedQty, setReceivedQty] = useState('')
  const [inspectedQty, setInspectedQty] = useState('')
  const [inwardDate, setInwardDate] = useState('')
  const [inwardBy, setInwardBy] = useState('')
  const [inwardLocation, setInwardLocation] = useState('')
  const [slctdProjectCode, setSlctdProjectCode] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [slctdProjectName, setSlctdProjectName] = useState('')
  const [poCodeVal, setPoCodeVal] = useState('')
  const [vendorNameVal, setVendorNameVal] = useState('')
  // const [DCNOVal, setDCNO] = useState('')
  // const [dCDate, setDCDate] = useState('')
  // const [noofParts, setNoofParts] = useState('')
  // const [statusVal, setStatus] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [NApplicable, setNA] = useState(0)
  const [detailData, setDetailData] = useState({})
  const [filteredData, setFilteredData] = useState(respMatrlInwrdDtls)
  const [searchText, setSearchText] = useState('')

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

  const handleChangeChkBox = e => {
    setNA(e.target.checked ? 1 : 0)
    if (e.target.checked === true) {
      setIsChecked(true)
      setRetrieveInward([])
      setshowpopupcrtetbl(false)
    } else {
      setCreateInward([])
      setshowpopupcrtetbl(false)
      setIsChecked(false)
    }
  }

  const initalData = [
    {
      key: 1,
      productCode: '',
      description: '',
      material: '',
      uomDesc: '',
      make: '',
      specification: '',
      poqty: '',
      inspectedQty: '',
      inwardQty: '',
      inspectQty: '',
      remarks: '',
      unitRate: '',
      vendorCode: '',
      bin: '',
      isFlag: 1,
    },
  ]
  // const [respPopUpCreateInwrd, setRespPopUpCreateInwrd] = useState(initalData)
  const [createInward, setCreateInward] = useState([])
  const [retrieveInward, setRetrieveInward] = useState([])
  useEffect(() => {
    setCreateInward(initalData)
    getVendorlist()
  }, [])

  const [showpopupcrtetbl, setshowpopupcrtetbl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clearForm, setClearForm] = useState(false)
  const [locationlist, setlocationlist] = useState([])
  const [vendorlist, setVendorlist] = useState([])
  const [vendorCode, setVendorCode] = useState('')

  const [assigncard, setAssignCard] = useState(false)
  const [rowData, setRowData] = useState({})
  const [selecteddata, setSelectedData] = useState(null)
  const [filtersinfo, setfilterinfo] = useState([])
  const [filtersinfo1, setfilterinfo1] = useState([])
  const [uniqueKey, setUniqueKey] = useState(0)

  console.log(vendorName, orderedQty, receivedQty, inspectedQty)
  const showModal = (record, index) => {
    console.log(index, 'recordrecordrecord')
    setDetailData(index)
    setshowpopupcrtetbl(false)
    setVendorName(index.vendorName)
    setInwardCode(index.miCode)
    setInwardDate(index.inwardDate)
    setInwardBy(index.empName)
    setInwardLocation(index.materialLocation)
    setPoCodeVal(index.poCode)
    setVendorNameVal(index.vendorName)
    // setDCNO(index.dcNo)
    // setDCDate(index.dcDate)
    // setNoofParts(index.noOfParts)
    // setStatus(index.statusDesc)
    // vendrname = `Material Inward-${index.vendorName}`;
    getMatralInwrdPopUp(index)
    setIsModalVal(true)
  }
  const getMaterialInwardDtls = (
    formData,
    pONoCodeVal,
    vendorCodeVal,
    slctdMtrlObjList,
    slctdProjctDtls,
  ) => {
    setSelectedData(formData)
    getVendorlist(formData)
    console.log(pONoCodeVal, 'pONoCodeVal')
    console.log(vendorCodeVal, 'vendorcodeVale')
    console.log(slctdProjctDtls, 'slctdProjctDtls')
    console.log(slctdMtrlObjList)
    setSlctdProjectCode(slctdProjctDtls.projectCode)
    setSlctdProjectName(slctdProjctDtls.projectName)
    if (
      formData.ToDate !== null &&
      formData.FromDate !== null &&
      formData.Projectcode !== undefined &&
      formData.PONo !== undefined
    ) {
      getMaterialInwardDetls(formData)
      setShowInwardDetail(true)
      setshowaddinwardpop(false)
      setAssignCard(false)
    } else {
      messageReturn(405)
    }
  }
  if (false) {
    callapi()
  }
  const callapi = () => {
    getMaterialInwardDtls(selecteddata)
    setInwardCode(selecteddata.miCode)
    setInwardDate(selecteddata.inwardDate)
  }
  const getMatralInwrdPopUp = async value => {
    const response = await indentFileUpload({
      requestPath: 'getMaterialInwardDtlList',
      requestData: {
        tenantId,
        hdrId: value.miId,
        projectCode: value.projectCode,
      },
    })
    console.log(response)

    if (response.responseData.length > 0) {
      setOrderedQty(response.responseData[0].orderedQty)
      setReceivedQty(response.responseData[0].receivedQty)
      setInspectedQty(response.responseData[0].inspectedQty)
      setMatrlInwrdRespPopUpval(response.responseData || [])
    } else {
      setMatrlInwrdRespPopUpval([])
    }
  }

  const getMaterialInwardDetls = async value => {
    // retrive service
    const response = await indentFileUpload({
      requestPath: 'getMaterialInwardHdrDtls',
      requestData: {
        tenantId,
        fromDate: moment(value.FromDate).format('YYYY-MM-DD'),
        toDate: moment(value.ToDate).format('YYYY-MM-DD'),
        poId: value.PONo,
        pmHdrId: value.Projectcode,
      },
    })
    if (response?.responseCode === '200') {
      setRespMatrlInwrdDtls(response?.responseData)
      console.log(response?.responseData, ': getMaterialInwardDetls valuessssss')
    } else {
      setRespMatrlInwrdDtls([])
      message.error(response?.responseMessage)
    }
  }

  const refreshInwardListAfterCreate = () => {
    if (selecteddata) {
      getMaterialInwardDetls({
        FromDate: selecteddata.FromDate,
        ToDate: selecteddata.ToDate,
        Projectcode: selecteddata.Projectcode,
        PONo: selecteddata.PONo || 'getAll',
      })
      setShowInwardDetail(true)
      setfilterinfo({})
      setSearchText('')
      setFilteredData([])
    }
  }

  const AddMaterialInwardDtls = formData => {
    console.log(formData, 'formdata AddMaterialInwardDtls')
    setSelectedData(formData)
    if (
      formData.ToDate !== null &&
      formData.FromDate !== null &&
      formData.Projectcode !== undefined &&
      (formData.PONo !== undefined || formData.POQty !== undefined)
    ) {
      getCreatePopUpDetls(formData)
    } else {
      messageReturn(405)
    }
  }

  const getCreatePopUpDetls = async formVal => {
    setPmhdrId(formVal.Projectcode)
    getLocationlist()
    if ('POQty' in formVal) {
      setIsVisible(false)
      setshowpopupcrtetbl(true)
    } else {
      setIsVisible(true)
      const respPopUp = await indentFileUpload({
        requestPath: 'getPoDtlsForMaterialInward',
        requestData: {
          tenantId,
          hdrId: formVal.PONo,
        },
      })
      if (respPopUp?.responseCode === '200') {
        const updatedData = respPopUp.responseData.map((data, index) => {
          return {
            ...data,
            key: index + 1,
          }
        })
        setRetrieveInward(updatedData)
        retrieveInwardForm.resetFields()
        setshowpopupcrtetbl(true)
      } else {
        message.error(respPopUp.responseMessage)
        setRetrieveInward([])
      }
    }
  }

  // const getCreatePopUpDetls = async value => {
  //   const respPopUp = await indentFileUpload({
  //     requestPath: 'getPoDtlsForMaterialInward',
  //     requestData: {
  //       tenantId,
  //       hdrId: value,
  //     },
  //   })
  //   console.log(respPopUp)
  //   if (respPopUp?.responseCode === '200') {
  //     setRespPopUpCreateInwrd(respPopUp.responseData)
  //     setshowpopupcrtetbl(true)
  //   } else {
  //     message.error(respPopUp.responseMessage)
  //     setRespPopUpCreateInwrd([])
  //   }

  const getLocationlist = async () => {
    const response = await indentFileUpload({
      requestPath: 'getInvLocationForInward',
      requestData: {
        tenantId,
      },
    })
    if (response?.responseCode === '200') {
      setlocationlist(response?.responseData)
    } else {
      message.error(response.responseMessage)
    }
  }

  const getVendorlist = async () => {
    const response = await indentFileUpload({
      requestPath: 'getApprVendorDtls',
      requestData: {
        approved: '1',
        tenantId,
      },
    })
    if (response?.responseCode === '200') {
      setVendorlist(response?.responseData)
    } else {
      message.error(response.responseMessage)
    }
  }
  function handleCancel() {
    setIsModalVal(false)
  }
  function showAddInwardModal() {
    setshowaddinwardpop(true)
    setShowInwardDetail(false)
    setshowpopupcrtetbl(false)
    setAssignCard(false)
  }
  const opentableedit = record => {
    setUniqueKey(prevKey => prevKey + 1)
    setAssignCard(true)
    setRowData(record)
  }

  function handleCancelAddInward() {
    allqtyForm.resetFields()
    // setRespPopUpCreateInwrd([])
    createInwardForm.resetFields()
    setCreateInward(initalData)
    setRetrieveInward([])
    setshowaddinwardpop(false)
    setNA(0)
    setClearForm(!clearForm)
  }
  const disabledFutureDates = current => {
    return current && current > moment().endOf('day')
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    setfilterinfo(filters)
    setFilteredData(extra.currentDataSource)
  }
  const FilterMIcode = []
  const FilterMIdate = []
  const FilterInwardby = []
  const FilterDcdate = []
  const FIlterMIlocation = []
  const Filterstatuss = []

  if (respMatrlInwrdDtls) {
    respMatrlInwrdDtls.map(h => {
      return FilterMIcode.push(h.miCode)
    })
    respMatrlInwrdDtls.map(h => {
      return FilterMIdate.push(h.inwardDate)
    })
    respMatrlInwrdDtls.map(h => {
      return FilterInwardby.push(h.empName)
    })
    respMatrlInwrdDtls.map(h => {
      return FilterDcdate.push(h.dcDate)
    })
    respMatrlInwrdDtls.map(h => {
      return FIlterMIlocation.push(h.materialLocation)
    })
    respMatrlInwrdDtls.map(h => {
      return Filterstatuss.push(h.statusDesc)
    })
  }
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }
  const filtermicode = FilterMIcode.filter(distinct)
  const filtermidate = FilterMIdate.filter(distinct)
  const filterinwardby = FilterInwardby.filter(distinct)
  const filterdcdate = FilterDcdate.filter(distinct)
  const filtermilocaiton = FIlterMIlocation.filter(distinct)
  const filterstatus = Filterstatuss.filter(distinct)

  const FilteredMIvalue = []
  const FilteredMIdate = []
  const FIlteredInwardby = []
  const FilteredDcdate = []
  const FIlteredLocation = []
  const FilteredDtatus = []

  filtermicode
    .sort((a, b) => a.localeCompare(b))
    .map(element => {
      return FilteredMIvalue.push({
        text: element,
        value: element,
      })
    })
  filtermidate
    .sort((a, b) => a.localeCompare(b))
    .map(element => {
      return FilteredMIdate.push({
        text: moment(element).format('DD-MMM-YYYY'),
        value: element,
      })
    })
  filterinwardby.map(element => {
    return FIlteredInwardby.push({
      text: element,
      value: element,
    })
  })
  filterdcdate
    .sort((a, b) => a.localeCompare(b))
    .map(element => {
      return FilteredDcdate.push({
        text: moment(element).format('DD-MMM-YYYY'),
        value: element,
      })
    })
  filtermilocaiton.map(element => {
    return FIlteredLocation.push({
      text: element,
      value: element,
    })
  })
  filterstatus.map(element => {
    return FilteredDtatus.push({
      text: element,
      value: element,
    })
  })

  const transformExportData = data => {
    return data.map(record => {
      let status = record.statusDesc
      if (
        record.statusDesc?.trim() === 'Pending for GRN' &&
        record.invFlag === '1' &&
        (record.seqFlag === '1' || record.seqFlag === '2')
      ) {
        status = 'Yet to QC raise'
      }
      return {
        ...record,
        statusDesc: status,
      }
    })
  }
  const searchedData = respMatrlInwrdDtls.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })

  if (
    searchedData.some(
      record =>
        record.seqFlag === '2' &&
        record.invFlag === '1' &&
        record.statusDesc.trim() === 'Pending for GRN',
    )
  ) {
    FilteredDtatus.push({ text: 'Yet to QC raise', value: 'yetToQC' })
  }
  const columns = [
    {
      title: 'Inward Code',
      dataIndex: 'miCode',
      key: 'miCode',
      filters: FilteredMIvalue,
      filteredValue: filtersinfo.miCode,
      onFilter: (value, record) => record?.miCode === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Inward Date',
      dataIndex: 'inwardDate',
      key: 'inwardDate',
      filters: FilteredMIdate,
      filteredValue: filtersinfo.inwardDate,
      onFilter: (value, record) => record?.inwardDate === value,
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Inward By',
      dataIndex: 'empName',
      key: 'empName',
      filters: FIlteredInwardby,
      filteredValue: filtersinfo.empName,
      onFilter: (value, record) => record?.empName === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'DC/Invoice no',
      dataIndex: 'dcNo',
      key: 'dcNo',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'DC/Invoice Date',
      dataIndex: 'dcDate',
      key: 'dcDate',
      filters: FilteredDcdate,
      filteredValue: filtersinfo.dcDate || null,
      onFilter: (value, record) => record?.dcDate === value,
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'No. of Parts',
      dataIndex: 'noOfParts',
      key: 'noOfParts',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'GRN No',
      dataIndex: 'grnCode',
      key: 'grnCode',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      key: 'grnDate',
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Inward Location',
      dataIndex: 'materialLocation',
      key: 'materialLocation',
      filters: FIlteredLocation,
      filteredValue: filtersinfo.materialLocation,
      onFilter: (value, record) => record?.materialLocation === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      filters: FilteredDtatus,
      filteredValue: filtersinfo.statusDesc,
      onFilter: (value, record) => {
        if (value === 'yetToQC') {
          return (
            record.seqFlag === '2' &&
            record.invFlag === '1' &&
            record.statusDesc.trim() === 'Pending for GRN'
          )
        }
        if (value === 'Pending for GRN ') {
          return (
            record.statusDesc.trim() === 'Pending for GRN' &&
            !(record.seqFlag === '2' && record.invFlag === '1')
          )
        }
        return record.statusDesc.trim() === value
      },

      render: (text, record) => {
        if (
          record.seqFlag === '2' &&
          record.invFlag === '1' &&
          record.statusDesc.trim() === 'Pending for GRN'
        ) {
          return 'Yet to QC raise'
        }
        return text?.trim() || '-'
      },
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (record, index) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              showModal(record, index)
            }}
          >
            Details
          </Button>
          {index.invFlag === '1' ? (
            <Button
              type="primary"
              icon={<SecurityScanOutlined />}
              onClick={() => opentableedit(index)}
            />
          ) : null}
        </Space>
      ),
    },
  ]
  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)
  const MtrlInwrdPopupcolumns = [
    {
      title: 'Part Number',
      dataIndex: ['indentDtlList', 'productCode'],
      key: 'productCode',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.productCode) {
          return indentDtlList[0].productCode
        }
        return '-'
      },
    },
    {
      title: 'Description',
      dataIndex: ['indentDtlList', 'description'],
      key: 'description',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.description) {
          return indentDtlList[0].description
        }
        return '-'
      },
    },
    {
      title: 'UOM',
      dataIndex: ['indentDtlList', 'uomDesc'],
      key: 'uomDesc',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.uomDesc) {
          return indentDtlList[0].uomDesc
        }
        return '-'
      },
    },
    {
      title: 'Material',
      dataIndex: ['indentDtlList', 'material'],
      key: 'material',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.material) {
          return indentDtlList[0].material
        }
        return '-'
      },
    },
    {
      title: 'Make',
      dataIndex: ['indentDtlList', 'make'],
      key: 'make',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.make) {
          return indentDtlList[0].make
        }
        return '-'
      },
    },
    {
      title: 'Specification',
      dataIndex: ['indentDtlList', 'specification'],
      key: 'specification',
      width: '200px',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.specification) {
          return indentDtlList[0].specification
        }
        return '-'
      },
    },
    /* {
      title: 'Indent Qty.',
      dataIndex: ['indentDtlList', 'totalQty'],
      key: 'totalQty',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.qty) {
          return currencyFormat(indentDtlList[0].qty)
        }
        return '-'
      },
    }, */
    {
      title: 'Remarks',
      dataIndex: ['indentDtlList', 'remarks'],
      key: 'remarks',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.remarks) {
          return indentDtlList[0].remarks
        }
        return '-'
      },
    },
    // {
    //   title: 'Total Value (Rs.)',
    //   dataIndex: ['indentDtlList','totalVal'],
    //   key: 'totalVal',
    //   render: (text, record) => {
    //     const { indentDtlList } = record
    //     if (indentDtlList?.[0]?.totalVal) {
    //       return currencyFormat(indentDtlList[0].totalVal)
    //     }
    //     return '-'
    //   },
    // },
    /* {
      title: 'Weight',
      dataIndex: ['indentDtlList', 'weight'],
      key: 'weight',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.weight) {
          return currencyFormat(indentDtlList[0].weight)
        }
        return '-'
      },
    }, */

    {
      title: 'Ordered Qty.',
      dataIndex: 'orderedQty',
      key: 'weight',
      align: 'right',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
    {
      title: 'Received Qty.',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      align: 'right',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },

    /* {
       title: 'Received Qty.',
       dataIndex: 'receivedQty',
       key: 'weight',
       render: text =>
         text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
     }, */

    {
      title: 'Inspected Qty.',
      dataIndex: 'inspectedQty',
      key: 'weight',
      align: 'right',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
  ]
  const handleInspctQtyChange = (index, e, record) => {
    console.log(e.target.value, index)
    retrieveInwardForm.setFieldsValue({ [`getinspectqty${record.key}`]: e.target.value })
    // setInspectQtyChngVal(e.target.value)
  }

  const handleAllocate = () => {
    if (retrieveInward.length > 0) {
      const updatedValues = retrieveInward.map(record => {
        const inwardqty = Number(record?.qty || 0) - Number(record?.receivedQty || 0)
        const fieldName = `getinwardqty_${record.key}`
        return { [fieldName]: inwardqty < 0 ? 0 : inwardqty }
      })
      retrieveInwardForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const handleUnAllocate = () => {
    if (retrieveInward.length > 0) {
      const updatedValues = retrieveInward.map(record => {
        const fieldName = `getinwardqty_${record.key}`
        return { [fieldName]: '' }
      })
      retrieveInwardForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }

  const handleRemoveRow = (rec, ind) => {
    console.log(rec)
    setCreateInward(prevState => {
      return prevState.filter((item, index) => index !== ind)
    })
  }

  const handleAddRow = (rec, ind) => {
    const formval = createInwardForm.getFieldValue()
    const colName = [
      `description_${ind + 1}`,
      `inspectqty_${ind + 1}`,
      `inspectedQty_${ind + 1}`,
      `inwardqty_${ind + 1}`,
      `make_${ind + 1}`,
      `material_${ind + 1}`,
      `poqty_${ind + 1}`,
      `productCode_${ind + 1}`,
      `specification_${ind + 1}`,
      `uomDesc_${ind + 1}`,
    ]
    const isValid = colName.every(key => (key in formval && formval[key] !== undefined) || '')
    console.log(createInward, 'createInward')
    if (isValid) {
      setCreateInward(prevState => {
        const updatedInwardData = prevState.map(data => {
          // if (data.key === ind + 1) {
          return {
            ...data,
            description: formval[`description_${data.key}`],
            inspectQty:
              NApplicable === 1
                ? formval[`inwardqty_${data.key}`]
                : formval[`inspectqty_${data.key}`],
            inspectedQty: formval[`inspectedQty_${data.key}`],
            inwardQty: formval[`inwardqty_${data.key}`],
            make: formval[`make_${data.key}`],
            material: formval[`material_${data.key}`],
            poqty: formval[`poqty_${data.key}`],
            productCode: formval[`productCode_${data.key}`],
            remarks: formval[`remarksval_${data.key}`] || '',
            bin: formval[`bin_${data.key}`],
            specification: formval[`specification_${data.key}`],
            uom: formval[`uomDesc_${data.key}`],
            uomDesc: '',
            poDtlId: 0,
            poCode: selecteddata.POQty,
            vendorCode,
            unitRate: formval[`unitValue_${data.key}`],
            indentDtlId: 0,
            weight: 0,
            receivedQty: 0,
          }
          // }
          // return data;
        })
        console.log(updatedInwardData, 'updatedInwardData')
        return updatedInwardData
        // return { ...prevState, updatedInwardData };
      })

      // setCreateInward(prevCreateInward => [...prevCreateInward, updateData]);
      const newRow = {
        key: createInward.length + 1,
        productCode: '',
        description: '',
        material: '',
        uomDesc: '',
        make: '',
        specification: '',
        poqty: '',
        inspectedQty: '',
        inwardQty: '',
        inspectQty: '',
        unitRate: '',
        remarks: '',
        isFlag: 1,
        bin: '',
      }
      setCreateInward(prevCreateInward => [...prevCreateInward, newRow])
    } else {
      messageReturn(405)
    }
  }

  const handleKeyPress = event => {
    if (!/\d|\./.test(event.key)) {
      event.preventDefault()
    }
    if (event.key === '.' && event.target.value.includes('.')) {
      event.preventDefault()
    }
  }

  const getdtlsCol1 = [
    {
      title: ' S.No',
      dataIndex: 'key',
      render: (_, record, index) => index + 1,
    },
    {
      title: (
        <span>
          Part Number <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => (
        <Form.Item name={`productCode_${record.key}`} initialValue={record.column1}>
          <Input placeholder="Product code" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Description <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Form.Item name={`description_${record.key}`} initialValue={record.column1}>
          <Input placeholder="description" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Material <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'material',
      key: 'material',
      render: (text, record) => (
        <Form.Item name={`material_${record.key}`} initialValue={record.column1}>
          <Input placeholder="Material" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          UOM <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'uomDesc',
      key: 'uomDesc',
      render: (text, record) => (
        <Form.Item name={`uomDesc_${record.key}`} initialValue={record.column1}>
          <Input placeholder="UOM" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Make <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'make',
      key: 'make',
      render: (text, record) => (
        <Form.Item name={`make_${record.key}`} initialValue={record.column1}>
          <Input placeholder="Make" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Specification <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'specification',
      key: 'specification',
      width: '200px',
      render: (text, record) => (
        <Form.Item name={`specification_${record.key}`} initialValue={record.column1}>
          <Input placeholder="Specification" text="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          PO Qty. <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),

      dataIndex: 'poqty',
      key: 'poqty',
      // width:"4%",
      render: (text, record) => (
        <Form.Item name={`poqty_${record.key}`} initialValue={record.column1}>
          <Input placeholder="PO Qty.." type="number" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Inspected Qty. <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'inspectedQty',
      key: 'inspectedQty',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`inspectedQty_${record.key}`} initialValue={record.column1}>
          <Input placeholder="Inspect Qty.." onKeyPress={handleKeyPress} type="text" />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          Inward Qty.<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'inwardQty',
      key: 'inwardQty',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`inwardqty_${record.key}`}>
          <Input placeholder="Inward Qty.." onKeyPress={handleKeyPress} type="text" />
        </Form.Item>
      ),
    },
    {
      title: <span>Inspect Qty.</span>,
      dataIndex: 'inspectQty',
      key: 'inspectQty',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`inspectqty_${record.key}`} initialValue="0">
          <Input onKeyPress={handleKeyPress} placeholder="Inspect Qty.." type="text" disabled />
        </Form.Item>
      ),
    },
    {
      title: <span>Unit Value.</span>,
      dataIndex: 'unitValue',
      key: 'unitValue',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`unitValue_${record.key}`} initialValue={record.column1}>
          <Input onKeyPress={handleKeyPress} placeholder="Unit Value.." type="text" />
        </Form.Item>
      ),
    },
    // {
    //   title: 'Remarks',
    //   dataIndex: 'remarks',
    //   key: 'remarks',
    //   render: (text, record) => (
    //     <Form.Item name={`remarksval_${record.key}`}>
    //       <TextArea rows={1} maxLength={65} />
    //     </Form.Item>
    //   ),
    // },
    {
      title: 'Bin',
      dataIndex: 'bin',
      key: 'bin',
      render: (text, record) => (
        <Form.Item name={`bin_${record.key}`}>
          <Input maxLength={8} value={record.bin} />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      width: '7%',
      render: (text, record, index) =>
        createInward.length >= 1 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <AddIconButton onClick={() => handleAddRow(record, index)} />
            </div>
            <div>
              <RemoveIcon
                onClick={() => handleRemoveRow(record, index)}
                disableInputBoxes={index === 0}
              />
            </div>
          </div>
        ) : null,
    },
  ]
  const distinct1 = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(retrieveInward)) {
      return []
    }

    return retrieveInward
      .map(item => item[key])
      .filter(distinct1)
      .map(value => ({
        text: value,
        value,
      }))
  }

  const handlefilterChange = (pagination, filters) => {
    setfilterinfo1(filters)
  }
  const getdtlsCol2 = [
    {
      title: ' S.No',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '90px',
      filters: distinctValues('productCode'),
      filteredValue: filtersinfo1.productCode || null,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '150px',
      filters: distinctValues('description'),
      filteredValue: filtersinfo1.description || null,
      onFilter: (value, record) => record?.description === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: '200px',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      filters: distinctValues('make'),
      filteredValue: filtersinfo1.make || null,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'UOM',
      dataIndex: 'uomDesc',
      key: 'uomDesc',
    },
    {
      title: 'PO Qty.',
      dataIndex: 'qty',
      key: 'qty',
      render: text => Number(text).toFixed(0) || 0,
    },
    {
      title: 'Received Qty.',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      render: text => Number(text).toFixed(0) || 0,
    },
    {
      title: 'Waiting for QC',
      dataIndex: 'waitingForQc',
      key: 'waitingForQc',
      render: text => (text ? Number(text).toFixed(0) || 0 : '0'),
    },
    {
      title: 'Ok Qty.',
      dataIndex: 'inspectedQty',
      key: 'inspectedQty',
      render: text => Number(text).toFixed(0) || 0,
    },
    {
      title: 'Failure Qty.',
      dataIndex: 'rejectedQty',
      key: 'rejectedQty',
      render: text => (text ? Number(text).toFixed(0) || 0 : '0'),
    },
    {
      title: `Unit Rate ${Menulistdata[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },

    {
      title: `Total Value ${Menulistdata[0].currency}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },
    {
      title: 'Inward Qty.',
      dataIndex: 'inwardqty',
      key: 'inwardqty',
      width: '120px',
      render: (text, record) => {
        // if (Number(record.qtyToInward) === 0 || Number(record.qtyToInward) < 0  ) {
        //   return (
        //     <div>
        //       <Button
        //         type="text"
        //         icon={<CopyrightOutlined style={{ color: 'white' }} />}
        //         style={{ background: '#04b504', border: 'none', borderRadius: '3px' }}
        //       />
        //     </div>
        //   )
        // }
        const handleInwardQtyChange = e => {
          // const inwardqty = Number(record?.qty || 0) - Number(record?.inspectedQty || 0)
          // const qtyform = retrieveInwardForm.getFieldsValue()
          // console.log(qtyform)
          if (e.target.value !== '' && e.target.value !== null && e.target.value !== undefined) {
            if (Number(e.target.value) < 0) {
              retrieveInwardForm.setFieldsValue({ [`getinwardqty_${record.key}`]: '' })
              message.error('Inward Qty. cannot be negative.')
            } else if (
              Number(e.target.value) <=
              Number(record?.qtyToInward !== 0 ? record?.qtyToInward : record?.qtyToInward)
            ) {
              retrieveInwardForm.setFieldsValue({ [`getinwardqty_${record.key}`]: e.target.value })
            } else {
              retrieveInwardForm.setFieldsValue({ [`getinwardqty_${record.key}`]: '' })
              messageReturn(670)
            }
          }
        }
        return (
          <Form form={retrieveInwardForm}>
            <Form.Item name={`getinwardqty_${record.key}`}>
              <Input
                onChange={e => handleInwardQtyChange(e)}
                placeholder="Inward Qty.."
                type="number"
                min="0"
                disabled={Number(record.qtyToInward) === 0 || Number(record.qtyToInward) < 0}
              />
            </Form.Item>
          </Form>
        )
      },
    },
    {
      title: 'Inspected at other loc.',
      dataIndex: 'inspectQty',
      key: 'inspectQty',
      render: (text, record) => {
        const NonNegativeValue = Math.max(0, Number(record.inspectQty))

        return (
          <Form form={retrieveInwardForm}>
            <Form.Item name={`getinspectqty${record.key}`}>
              <Input
                onChange={e => handleInspctQtyChange(record.key, e, record)}
                placeholder="Inspect Qty.."
                type="number"
                name="qtyfieldvalue"
                disabled
                value={NonNegativeValue.toFixed(2)}
                defaultValue={NonNegativeValue.toFixed(2)}
              />
            </Form.Item>
          </Form>
        )
      },
    },

    // {
    //   title: 'Remarks',
    //   dataIndex: 'remarks',
    //   key: 'remarks',
    //   render: (text, record) => (
    //     <Form form={retrieveInwardForm}>
    //       <Form.Item name={`remarksval_${record.key}`}>
    //         <TextArea rows={2} maxLength={65} />
    //       </Form.Item>
    //     </Form>
    //   ),
    // },
    {
      title: 'Bin',
      dataIndex: 'bin',
      key: 'bin',
      render: (text, record) => (
        <Form form={retrieveInwardForm}>
          <Form.Item name={`bin_${record.key}`}>
            <Input maxLength={8} value={record.bin} defaultValue={record.bin} />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const handleClear = () => {
    handleUnAllocate()
    // setRespPopUpCreateInwrd([])
  }
  const UpdateMaterialInwrdDtls = async () => {
    setLoading(true)
    const formval = createInwardForm.getFieldValue()
    const formvalues = allqtyForm.getFieldValue()
    const getInward = retrieveInwardForm.getFieldValue()
    console.log(getInward)
    if (formvalues.DCNo && formvalues.Dcdate && formvalues.Location !== ('' || null || undefined)) {
      if (isVisible) {
        // retrieve

        // submit the record from retrieve scenario
        const updatedTableData = retrieveInward.map(item => {
          console.log(item, 'items inside updatedTAble data')
          return {
            ...item,
            inwardQty: getInward[`getinwardqty_${item.key}`]
              ? getInward[`getinwardqty_${item.key}`]
              : '',
            tenantId: tenantIdVal,
            empId: employeeId,
            dcDate: moment(formvalues.Dcdate).format('YYYY-MM-DD') || '',
            dcNo: formvalues.DCNo,
            invLocation: formvalues.Location,
            relationShipRating: 0,
            pmId: '5',
            remarks: getInward[`remarksval_${item.key}`] ? getInward[`remarksval_${item.key}`] : '',
            bin: getInward[`bin_${item.key}`] ? getInward[`bin_${item.key}`] : '',
            projectCode: formvalues.Projectcode,
            pmHdrId: pmHdrid,
          }
        })
        const filteredTableData = updatedTableData.filter(
          item =>
            item.inwardQty !== '0' &&
            item.inwardQty !== '' &&
            item.inwardQty !== null &&
            item.inwardQty !== undefined,
        )
        if (filteredTableData.length > 0) {
          const respPopUp = await indentFileUpload({
            requestPath: 'insertMaterialInwardDtls',
            requestData: filteredTableData,
          })
          if (respPopUp) {
            handleCancelAddInward()
            message.success(respPopUp?.responseMessage)
            setClearForm(!clearForm)
            refreshInwardListAfterCreate()
            // setRespPopUpCreateInwrd([])
          }
        } else {
          messageReturn(671)
        }
      } else {
        // insert
        let updatedData = []
        let updateError = false

        if (createInward.length === 1) {
          const colName = [
            `description_1`,
            `inspectqty_1`,
            `inspectedQty_1`,
            `inwardqty_1`,
            `make_1`,
            `material_1`,
            `poqty_1`,
            `productCode_1`,
            `specification_1`,
            `uomDesc_1`,
          ]
          const isValid = colName.every(key => (key in formval && formval[key] !== undefined) || '')
          if (isValid) {
            updatedData =
              createInward &&
              createInward.map(res => ({
                ...res,
                poDtlId: '',
                indentDtlId: null,
                weight: null,
                tenantId: tenantIdVal,
                projectCode: selecteddata.Projectcode,
                poCode: selecteddata.POQty,
                empId: employeeId,
                dcDate: moment(formvalues.Dcdate).format('YYYY-MM-DD') || null,
                relationShipRating: 0,
                dcNo: formvalues.DCNo,
                pmId: '5',
                invLocation: formvalues.Location,
                description: formval.description_1,
                inspectQty: NApplicable === 1 ? formval.inwardqty_1 : formval.inspectqty_1,
                inspectedQty: formval.inspectedQty_1,
                inwardQty: formval.inwardqty_1,
                make: formval.make_1,
                material: formval.material_1,
                poqty: formval.poqty_1,
                productCode: formval.productCode_1,
                remarks: null,
                bin: formval.bin_1,
                specification: formval.specification_1,
                uom: formval.uomDesc_1,
                uomDesc: null,
                vendorCode,
                unitRate: formval.unitValue_1,
                nokQty: 0,
                okQty: 0,
                reworkQty: 0,
                pmHdrId: pmHdrid,
              }))
          } else {
            updateError = true
          }
        }
        if (createInward.length > 1) {
          if (Object.keys(formval).length >= createInward.length * 10) {
            const checkVal = Object.values(formval).every(value => value.trim() !== '')
            if (checkVal) {
              const lastRow = createInward[createInward.length - 1]
              const updatedLastRow = {
                ...lastRow,

                description: formval[`description_${createInward.length}`],
                inspectQty:
                  NApplicable === 1
                    ? formval[`inwardqty_${createInward.length}`]
                    : formval[`inspectqty_${createInward.length}`],
                inspectedQty: formval[`inspectedQty_${createInward.length}`],
                inwardQty: formval[`inwardqty_${createInward.length}`],
                make: formval[`make_${createInward.length}`],
                material: formval[`material_${createInward.length}`],
                poqty: formval[`poqty_${createInward.length}`],
                productCode: formval[`productCode_${createInward.length}`],
                specification: formval[`specification_${createInward.length}`],
                uom: formval[`uomDesc_${createInward.length}`],
                uomDesc: '',
                unitRate: formval[`unitValue_${createInward.length}`],
                // remarks:
                //   formval[`remarksval_${createInward.length}`] === undefined
                //     ? ''
                //     : formval[`remarksval_${createInward.length}`] || '',
                bin:
                  formval[`bin_${createInward.length}`] === undefined
                    ? ''
                    : formval[`bin_${createInward.length}`],
              }

              const lstupdatedData = [
                ...createInward.slice(0, createInward.length - 1),
                updatedLastRow,
              ]

              updatedData = lstupdatedData.map(data => ({
                ...data,
                poDtlId: '',
                indentDtlId: null,
                weight: null,
                tenantId: tenantIdVal,
                empId: employeeId,
                dcDate: moment(formvalues.Dcdate).format('YYYY-MM-DD') || null,
                dcNo: formvalues.DCNo,
                projectCode: formvalues.Projectcode,
                pmId: '5',
                nokQty: 0,
                okQty: 0,
                reworkQty: 0,
                pmHdrId: pmHdrid,
                invLocation: formvalues.Location,
              }))
            } else {
              updateError = true
            }
          } else {
            updateError = true
          }
        }
        if (updatedData.length > 0 && updateError === false && createInward) {
          const respPopUp = await indentFileUpload({
            requestPath: 'insertMaterialInwardDtls',
            requestData: updatedData,
          })
          if (respPopUp) {
            handleCancelAddInward()
            message.success(respPopUp?.responseMessage)
            setClearForm(!clearForm)
            setNA(0)
            refreshInwardListAfterCreate()
            // setRespPopUpCreateInwrd([])
          }
        } else {
          messageReturn(405)
        }
      }
    } else {
      messageReturn(405)
    }

    // if (formvalues.DCNo && formvalues.Dcdate && formvalues.Location !== ('' || null || undefined)) {

    //   // check createInward length is 1 or >1

    //   if (isValid) {
    //     let updatedData = [];
    //     if (createInward.length === 1) {
    //       updatedData = createInward && createInward.map((res) => {
    //         return {
    //           ...res,
    //           tenantId: tenantIdVal,
    //           empId: employeeId,
    //           dcDate: moment(formvalues.Dcdate).format('YYYY-MM-DD') || '',
    //           dcNo: formvalues.DCNo,
    //           pmId: '',
    //           invLocation: formvalues.Location,
    //           description: formval.description_1,
    //           inspectQty: formval.inspectqty_1,
    //           inspectedQty: formval.inspectedQty_1,
    //           inwardQty: formval.inwardqty_1,
    //           make: formval.make_1,
    //           material: formval.material_1,
    //           poqty: formval.poqty_1,
    //           productCode: formval.productCode_1,
    //           remarks: '',
    //           specification: formval.specification_1,
    //           uomDesc: formval.uomDesc_1,
    //         }
    //       })
    //     }

    //     const checkData = isVisible ? filteredTableData : updatedData;
    //     if (checkData.length > 0) {
    //       const respPopUp = await indentFileUpload({
    //         requestPath: 'insertMaterialInwardDtls',
    //         requestData: checkData,
    //       })
    //       if (respPopUp) {
    //         handleCancelAddInward()
    //         message.success(respPopUp ?.responseMessage)
    //         setClearForm(!clearForm)
    //         // setRespPopUpCreateInwrd([])
    //       }
    //     } else {
    //     }
    //   } else {
    //   }
    // } else {
    // }

    setLoading(false)
  }

  const DtlFieldsComponent = () => {
    return (
      <div className="mt-1 custom_antd_Table">
        <div className="row">
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Code
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{inwardCode}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Date
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{moment(inwardDate).format('DD-MMM-YYYY')}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward By
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{inwardBy}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Location
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{inwardLocation}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Project Number
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{detailData?.projectCode}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Project Name
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{detailData?.projectName}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              PO Number
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{poCodeVal}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Vendor Name
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{vendorNameVal}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              SCM Rating
            </span>
            <span>
              :&nbsp;&nbsp;&nbsp;
              {detailData?.relationshipRating
                ? Number(detailData?.relationshipRating).toFixed(1)
                : 'N/A'}
            </span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Rating
            </span>
            <span>
              :&nbsp;&nbsp;&nbsp;
              {detailData?.inwardRating ? Number(detailData?.inwardRating).toFixed(1) : 'N/A'}
            </span>
          </div>
          {/* <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              DC No.
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{DCNOVal || 'N/A'}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              DC Date
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{moment(dCDate).format('DD-MMM-YYYY') || 'N/A'}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              No. of Parts
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{noofParts}</span>
          </div>
          <div className="col-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Status
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{statusVal}</span>
          </div>
           */}
        </div>
        <Table columns={MtrlInwrdPopupcolumns} dataSource={matrlInwrdRespPopUpval} />
      </div>
    )
  }
  console.log(showInwardDetail)
  const handleclose = () => {
    setAssignCard(false)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Form form={allqtyForm}>
        <Card
          style={{ width: '100%', marginTop: '13px' }}
          title="Material Inward"
          extra={
            <ButtonComponent
              text="Create Material Inward"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={showAddInwardModal}
            />
          }
        >
          <CommonFields3
            onGetDetails={getMaterialInwardDtls}
            SubmitorGetDtls="1"
            onClear={() => setRespMatrlInwrdDtls([])}
            showMinwardDrpDwn="0"
            // getSlctdPrjctDtls={getSlctdPrjctDtls}
            isPono="0"
            getAllEnable
          />
          {respMatrlInwrdDtls && respMatrlInwrdDtls.length > 0 && (
            <div style={{ display: showInwardDetail ? 'block' : 'none' }}>
              <Row>
                <Divider orientation="left">Material Inward Details</Divider>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                    <Input.Search
                      placeholder="Search..."
                      allowClear
                      enterButton
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 450 }}
                    />
                  </div>
                  <Table
                    columns={columns}
                    dataSource={searchedData}
                    pagination={{
                      pageSizeOptions: [
                        '10',
                        '20',
                        '30',
                        '50',
                        respMatrlInwrdDtls.length.toString(),
                      ],
                      showSizeChanger: true,
                      defaultPageSize: 10,
                    }}
                    exportableProps={{
                      fileName: `Material_Inward_${currentDateTime}`,
                      dataSource: transformExportData(
                        filteredData.length ? filteredData : searchedData,
                      ),
                      btnProps: {
                        type: 'primary',
                        icon: <FileExcelOutlined />,
                        children: <span>Export to CSV</span>,
                      },
                    }}
                    scroll={{ y: 400 }}
                    onChange={handleChange}
                    bordered
                  />
                </Col>
              </Row>
            </div>
          )}
          {assigncard && respMatrlInwrdDtls && respMatrlInwrdDtls.length > 0 ? (
            <MaterialInwardAssign
              key={uniqueKey}
              onClose={handleclose}
              rowData={rowData}
              // calldetailapi={callapi}
              projectCode={slctdProjectCode}
            />
          ) : null}
        </Card>

        <ModalPopupBox
          text="Material Inward Details"
          isModalVisible={isModalVal}
          onCancel={handleCancel}
          FieldsComponent={DtlFieldsComponent}
          width="900"
        />
        <Modal
          title="Create Material Inward"
          visible={showaddinwardpop}
          width="900"
          onCancel={handleCancelAddInward}
          footer={null}
        >
          <div className="row ml-2">
            <div className="form_indent" style={{ width: '100%' }}>
              <CommonFields3
                onGetDetails={AddMaterialInwardDtls}
                SubmitorGetDtls="1"
                onClear={handleClear}
                showMinwardDrpDwn="0"
                clearForm={clearForm}
                isPono="1"
                NA="0"
                NApplicable={NApplicable}
                handleChangeChkBox={handleChangeChkBox}
              />
            </div>
            <div
              style={{
                display: showpopupcrtetbl ? 'block' : 'none',
                marginTop: '20px',
                width: '100%',
              }}
            >
              {/* {respPopUpCreateInwrd && respPopUpCreateInwrd.length > 0 ? ( */}
              <div style={{ display: showpopupcrtetbl ? 'block' : 'none' }}>
                <div className="row">
                  <div className="col-12 col-xl-2 col-lg-2 col-md-2">
                    <div style={{ display: isVisible ? 'block' : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'div', gap: '10px' }}>
                        <ButtonComponent
                          type="primary"
                          text="Allocate All"
                          onClick={handleAllocate}
                        />
                        <ButtonComponent
                          type="primary"
                          text="Unallocate"
                          onClick={handleUnAllocate}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-12 col-lg-12 col-md-12">
                    <div className="row">
                      <div
                        className="col-12 col-xl-2 col-lg-2 col-md-2"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ width: '35%', paddingTop: '4px', display: 'none' }}>
                          <span className="text-left">
                            SCM Rating:<span style={{ color: 'red' }}>*</span>{' '}
                          </span>
                        </div>
                        <div style={{ width: '65%', display: 'none' }}>
                          <Form.Item
                            name="vendorRating"
                            rules={[
                              {
                                validator: (_, value) => {
                                  if (value && (value < 0 || value > 20)) {
                                    allqtyForm.setFieldsValue({
                                      vendorRating: undefined,
                                    })
                                    return Promise.reject(
                                      new Error('Vendor rating must be between 0 and 20'),
                                    )
                                  }
                                  return Promise.resolve()
                                },
                              },
                            ]}
                          >
                            <Input
                              style={{ width: '100%' }}
                              type="number"
                              min={0}
                              max={20}
                              placeholder="Enter SCM rating"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div
                        className="col-12 col-xl-3 col-lg-3 col-md-3"
                        style={{
                          display: isChecked ? 'block' : 'none',
                          width: '100%',
                        }}
                      >
                        <Form.Item name="vendorName" label={<span>Vendor Name</span>}>
                          <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select Vendor"
                            value={vendorCode}
                            onChange={value => setVendorCode(value)}
                            optionFilterProp="children" // tells Select to filter based on option text
                            filterOption={(input, option) =>
                              option?.children?.toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            {vendorlist?.map(item => (
                              <Option key={item.vendorCode} value={item.vendorCode}>
                                {item.vendorName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12 col-xl-2 col-lg-2 col-md-2">
                        <Form.Item
                          name="Location"
                          label={
                            <span>
                              Location<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                            </span>
                          }
                        >
                          <Select style={{ width: '100%' }} placeholder="Select Location">
                            {locationlist?.map(item => (
                              <Option
                                key={item.inventoryLocationCode}
                                value={item.inventoryLocationCode}
                              >
                                {item.inventoryLocationDescription}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                      <div
                        className="col-12 col-xl-2 col-lg-2 col-md-2"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ width: '35%', paddingTop: '4px' }}>
                          <span className="text-left">
                            DC/Invoice no:<span style={{ color: 'red' }}>*</span>{' '}
                          </span>
                        </div>
                        <div style={{ width: '65%' }}>
                          <Form.Item name="DCNo">
                            <Input style={{ width: '100%' }} placeholder="Enter DC No." />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-12 col-xl-2 col-lg-2 col-md-2">
                        <Form.Item
                          name="Dcdate"
                          label={
                            <span>
                              DC/Invoice Date<span style={{ color: 'red' }}>*</span>{' '}
                            </span>
                          }
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={disabledFutureDates}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                {isVisible ? (
                  <Form form={retrieveInwardForm}>
                    <Table
                      columns={getdtlsCol2}
                      dataSource={retrieveInward}
                      onChange={handlefilterChange}
                      bordered
                      scroll={{ y: 400 }}
                      pagination={false}
                    />
                  </Form>
                ) : (
                  <Form form={createInwardForm}>
                    <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                      <Table
                        columns={getdtlsCol1}
                        dataSource={createInward}
                        bordered
                        scroll={{ y: 400 }}
                      />
                    </div>
                  </Form>
                )}
                <center>
                  <div style={{ padding: '10px' }}>
                    {/* <Button
                    text="Submit"
                    disable={loading}
                    type="primary"
                    onClick={UpdateMaterialInwrdDtls}
                  /> */}
                    <Popconfirm
                      title={
                        <div style={{ textAlign: 'center' }}>
                          <span>Confirm the inwarded quantity</span>
                          <br />
                          <span>and proceed</span>
                        </div>
                      }
                      onConfirm={UpdateMaterialInwrdDtls}
                      placement="top"
                      pointAtCenter
                      okButtonProps={{
                        style: { marginRight: '27%' },
                      }}
                      icon={null} // Optional: remove default icon if needed
                    >
                      <Button type="primary" disabled={loading}>
                        Submit
                      </Button>
                    </Popconfirm>
                    &nbsp;&nbsp;&nbsp;
                    <ButtonComponent type="primary" text="Cancel" onClick={handleCancelAddInward} />
                  </div>
                </center>
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    </div>
  )
}

export default MaterialInward
