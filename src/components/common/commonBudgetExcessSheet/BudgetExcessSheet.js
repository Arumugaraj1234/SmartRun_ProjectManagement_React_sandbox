import React, { useEffect, useState } from 'react'
import store from 'store'
import { Skeleton, Form, Select, message, Input, Card, DatePicker, Row, Col, Button } from 'antd'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { FileExcelOutlined, CommentOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
// import '../../pages/style.scss'
// import Table from '../../../../components/common/TableComponent'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import getEmployeeDropDownDataService from 'services/common/getEmployeeDropDownDataService'
import ButtonComponent from 'components/shared/ButtonComponent'
import InputComponent from 'components/shared/InputComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import currentDateTime from 'currentDateTime'
import ModalPopup from 'components/shared/ModalPopupComponent'
import BackButtonComponent from '../BackBtnComponent'

const BudgetExcessSheet = () => {
  let defaultfilterData = {}
  const history = useHistory()
  console.log(history)
  const prevPath = history.location.state?.from
  console.log(prevPath)
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      indentCode: [history?.location?.state?.record?.refCode],
    }
  }

  const { Option } = Select
  const [loading, setLoading] = useState(true)
  const [tableData, setTabledata] = useState([])
  const [filtersInfo, setfilterinfo] = useState(defaultfilterData)
  const [deptEmp, setDeptEmp] = useState([])
  const [isDtlModal, setDtlModal] = useState(false)
  const [hdrId, setHdrId] = useState(null)
  const [singledetail, setSingleDetail] = useState(null)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const disable = true
  const [detailCard, setdetailCard] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const { TextArea } = Input
  const [ProjId, setProjectId] = useState('getall')
  const [appr, setApprove] = useState(null)
  const [searchText, setSearchText] = useState('')

  // const [indentList, setIndentList] = useState([])
  const [projectList, setProjectList] = useState([])

  const [form] = Form.useForm()
  const [remarkform] = Form.useForm()
  // const ProjectID = store.get('ProjectID')
  const tenantid = store.get('tenantId')
  const tenantId = store.get('tenantId')
  const empid = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const enqid = store.get('EnquiryID')
  const Tab = store.get('Tab')
  const pmId = store.get('processDoc')
  const isInternal = store.get('isInternal')
  const isTailview = true
  // const employeeId = store.get('employeeId')

  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate
  // console.log(indIdcd, finalcost, totalcost, scsHdrid, scsStatus, openindex)
  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  useEffect(() => {
    getRerieveData()
    getDeptAndEmp()
    getProjectList()
  }, [empid])

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDateAndIndent',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }

  // const getIndentList = async projId => {
  //   // console.log(projId,'PROJECT ID')
  //   const formData = form.getFieldsValue()
  //   const payload = {
  //     tenantId,
  //     empId: employeeId,
  //     pmId: '5',
  //     projectId: projId,
  //     fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
  //     toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
  //     getIndent: '4',
  //   }
  //   const response = await indentFileUpload({
  //     requestPath: 'indentHdrDropDownByProjectCode',
  //     requestData: payload,
  //   })
  //   setIndentList(response?.responseData || [])
  // }
  // console.log(indentList,'Indent List')

  const getRerieveData = async () => {
    setLoading(true)
    const keyareaobj = {
      pmHdrId: ProjId,
      tenantId: tenantid,
      sequenceNo: '1',
      empId: empid,
      enqId: store.get('EnquiryID'),
      processCode: isInternal === 1 ||  isInternal === "1" ? '8' : '3',
    }

    const response = await indentFileUpload({
      requestPath: 'retriveBudgetExcessSheetDtl',
      requestData: keyareaobj,
    })
    console.log('getRerieveData called', response)
    console.log('ProjId called', ProjId)

    let data
    if (response !== null && response !== undefined) {
      if (response.length > 0) {
        setLoading(false)
        data = response
      } else {
        setLoading(false)
        data = ''
      }
    } else {
      setLoading(false)
      data = ''
    }

    let updatedData = []
    if (Array.isArray(data)) {
      updatedData = data.map((item, index) => {
        return {
          ...item,
          statusDesc: item.isCompleted === '1' ? 'Completed' : item.statusDesc,
          nextSeqDesc: item.isCompleted === '1' ? 'NA' : item.nextSeqDesc,
          serialNumber: index + 1,
        }
      })
    }

    setTabledata(updatedData)
  }
  const getDeptAndEmp = async () => {
    const response = await getEmployeeDropDownDataService({
      tenantId,
      isActive: '1',
      employeID: '',
    })
    let data = []
    if (response !== null && response !== undefined && response.length > 0) {
      data = response
    } else {
      data = ''
    }
    setDeptEmp(data)
  }

  // methods

  const handleDetails = rec => {
    setSingleDetail(rec)
    form.setFieldsValue({
      action: rec.action !== 'null' && rec.action !== '' ? rec.action : '',
      rca: rec.rootCause !== 'null' && rec.rootCause !== '' ? rec.rootCause : '',
      reason: rec.reason !== 'null' && rec.reason !== '' ? rec.reason : '',
      indentcode: rec.indentCode !== 'null' && rec.indentCode !== '' ? rec.indentCode : '',
      projectcode: rec.projectCode !== 'null' && rec.projectCode !== '' ? rec.projectCode : '',
      vendorname: rec.vendorName !== 'null' && rec.vendorName !== '' ? rec.vendorName : '',
      Dept: rec.responsible !== 'null' && rec.responsible !== '' ? rec.responsible : '',
      budgetCostlat:
        rec.budgetCostlat !== 'null' && rec.budgetCostlat !== ''
          ? formatIndianNumber(rec.budgetCostlat)
          : '',
      excessCost: rec.excess !== 'null' && rec.excess !== '' ? formatIndianNumber(rec.excess) : '',
      budgetCost:
        rec.budgetCost !== 'null' && rec.budgetCost !== ''
          ? formatIndianNumber(rec.budgetCost)
          : '',
      actualCost:
        rec.actualCost !== 'null' && rec.actualCost !== ''
          ? formatIndianNumber(rec.actualCost)
          : '',
      station: rec.assemblyValue !== 'null' && rec.assemblyValue !== '' ? rec.assemblyValue : '',
    })
    setHdrId(rec.beHdrId)

    setDtlModal(true)
  }

  const handleClear = () => {
    // setHdretrievedata([])
    // setIndentDtldisplay(false)
  }

  const handleGetDetails = () => {
    getRerieveData()
    const formData = form.getFieldsValue()
    const updatedFormData = {
      ...formData,
      FromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
      ToDate: moment(defaultToDate).format('YYYY-MM-DD'),
      isTailview,
    }
    console.log(updatedFormData, 'Updated Form Data')
    // handleGetIndentformDetails(updatedFormData)
  }

  function formatIndianNumber(num) {
    if (num === null || num === '' || Number.isNaN(Number(num))) {
      return ''
    }

    num = Number(num).toFixed(2) // Ensure two decimal points
    const [integerPart, decimalPart] = num.split('.')
    const lastThreeDigits = integerPart.slice(-3)
    const otherDigits = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')

    return `${otherDigits ? `${otherDigits},` : ''}${lastThreeDigits}.${decimalPart}`
  }

  useEffect(() => {
    applyFilters()
  }, [filtersInfo])

  const applyFilters = () => {
    let filtered = tableData
    Object.keys(filtersInfo).forEach(key => {
      if (filtersInfo[key]) {
        filtered = filtered.filter(item => item[key].includes(filtersInfo[key]))
      }
    })
    setFilteredData(filtered)
  }

  const FilterChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleCloseDtlModal = () => {
    setDtlModal(false)
    form.resetFields()
  }
  const handleSave = async id => {
    let returnVal = false
    const formValues = form.getFieldsValue()
    if (
      formValues.Dept !== '' &&
      formValues.Dept !== null &&
      formValues.action !== '' &&
      formValues.action !== null &&
      formValues.rca !== '' &&
      formValues.rca !== null &&
      formValues.reason !== '' &&
      formValues.reason !== null
    ) {
      const keyareaobj = {
        tenantId,
        beHdrId: hdrId,
        reason: formValues.reason,
        rootCase: formValues.rca,
        action: formValues.action,
        responseDept: formValues.Dept,
        approvingStatus: singledetail.documentStatusMstList[0].docStatus,
        sequenceNo: '',
        empId: empid,
        remarks: '',
      }
      const response = await indentFileUpload({
        requestPath: 'updateBudgetExcessSheetDtl',
        requestData: keyareaobj,
      })
      if (response) {
        if (id === 0) {
          getRerieveData()
          handleCloseDtlModal()
          message.success(response?.responseMessage)
        }
        returnVal = true
      }
    } else {
      messageReturn(405)
    }
    return returnVal
  }
  // handleSaveRemark
  const handleSaveRemark = async () => {
    const savemessage = await handleSave(1)
    if (savemessage) {
      const formValues = remarkform.getFieldsValue()
      if (formValues.remarkfield !== undefined) {
        const keyareaobj = {
          currentseq:
            appr === 1
              ? singledetail.documentStatusMstList[0].cancelSeq
              : singledetail.documentStatusMstList[0].currSequence,
          tenantId,
          hdrId,
          empId: empid,
          remarks: formValues.remarkfield,
          pmId,
          mstId: Tab.mstId,
          docTypeCode: '',
          pmHdrId: singledetail.pmHdrId,
          enquiryId: enqid,
          docGroup: singledetail.documentStatusMstList[0].docGroup,
          processCode: isInternal === 1 ||  isInternal === "1" ? '8' : '3',
        }
        const response = await indentFileUpload({
          requestPath: 'updateBudgetSheetExcessSeqAndStatus',
          requestData: keyareaobj,
        })
        if (response) {
          message.success(response?.responseMessage)
          setRejectRemarksCard(false)
          remarkform.resetFields()
          getRerieveData()
          handleCloseDtlModal()
        }
      } else {
        messageReturn(638)
      }
    }
  }

  const indentcode1 = []
  const assyValue1 = []
  const subAssyValue1 = []
  const projectcode1 = []
  const department1 = []
  const vendor1 = []
  const reason1 = []
  const RCA = []
  const Action1 = []
  const status1 = []
  const actualCost = []
  const excessCost = []
  const actualExcessCost = []
  const nextStatus1 = []

  if (tableData.length > 0) {
    tableData.map(h => {
      return indentcode1.push(h.indentCode)
    })
    tableData.map(h => {
      return assyValue1.push(h.assemblyValue)
    })
    tableData.map(h => {
      return subAssyValue1.push(h.subAssemblyValue)
    })
    tableData.map(h => {
      return projectcode1.push(h.projectCode)
    })
    tableData.map(h => {
      return department1.push(h.responsibleDesc)
    })
    tableData.map(h => {
      return vendor1.push(h.vendorName)
    })
    tableData.map(h => {
      return reason1.push(h.reason)
    })
    tableData.map(h => {
      return RCA.push(h.rootCause)
    })
    tableData.map(h => {
      return Action1.push(h.action)
    })
    tableData.map(h => {
      return status1.push(h.statusDesc)
    })
    tableData.map(h => {
      return actualCost.push(h.actualCost)
    })
    tableData.map(h => {
      return excessCost.push(h.excess)
    })
    tableData.map(h => {
      return actualExcessCost.push(h.actualExcess)
    })
    tableData.map(h => {
      return nextStatus1.push(
        h.nextSeqDesc !== 'null' && h.nextSeqDesc !== null ? h.nextSeqDesc : 'NA',
      )
    })
  }

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const indentcode2 = indentcode1.filter(distinct)
  const assyValue2 = assyValue1.filter(distinct)
  const subAssyValue2 = subAssyValue1.filter(distinct)
  const projectcode2 = projectcode1.filter(distinct)
  const department2 = department1.filter(distinct)
  const vendor2 = vendor1.filter(distinct)
  const reason2 = reason1.filter(distinct)
  const RCA2 = RCA.filter(distinct)
  const Action2 = Action1.filter(distinct)
  const status2 = status1.filter(distinct)
  const actualCost2 = actualCost.filter(distinct)
  const excessCost2 = excessCost.filter(distinct)
  const actualExcessCost2 = actualExcessCost.filter(distinct)
  const nextStatus2 = nextStatus1.filter(distinct)

  const indentcode3 = []
  const assyValue3 = []
  const subAssyValue3 = []
  const projectcode3 = []
  const department3 = []
  const vendor3 = []
  const reason3 = []
  const RCA3 = []
  const Action3 = []
  const status3 = []
  const actualCost3 = []
  const excessCost3 = []
  const actualExcessCost3 = []
  const nextStatus3 = []

  indentcode2
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .map(element => {
      return indentcode3.push({
        text: element,
        value: element,
      })
    })

  assyValue2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return assyValue3.push({
        text: element,
        value: element,
      })
    })

  subAssyValue2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach(element => {
      subAssyValue3.push({
        text: element,
        value: element,
      })
    })

  projectcode2.map(element => {
    return projectcode3.push({
      text: element,
      value: element,
    })
  })

  department2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      department3.push({
        text: element,
        value: element,
      }),
    )

  vendor2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      vendor3.push({
        text: element,
        value: element,
      }),
    )

  reason2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      reason3.push({
        text: element,
        value: element,
      }),
    )

  RCA2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      RCA3.push({
        text: element,
        value: element,
      }),
    )

  Action2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      Action3.push({
        text: element,
        value: element,
      }),
    )

  status2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      status3.push({
        text: element,
        value: element,
      }),
    )

  actualCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      actualCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  excessCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      excessCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  actualExcessCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      actualExcessCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  nextStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      nextStatus3.push({
        text: element,
        value: element,
      }),
    )

  const baseData = filteredData.length > 0 ? filteredData : tableData
  const searchedData = baseData.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '5%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectcode3,
      filteredValue: filtersInfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: indentcode3,
      filteredValue: filtersInfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Station',
      dataIndex: 'assemblyValue',
      key: 'assemblyValue',
      filters: assyValue3,
      filteredValue: filtersInfo.assemblyValue,
      onFilter: (value, record) => record?.assemblyValue === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'SubAssembly',
      dataIndex: 'subAssemblyValue',
      key: 'subAssemblyValue',
      width: '8%',
      filters: subAssyValue3,
      filteredValue: filtersInfo.subAssemblyValue,
      onFilter: (value, record) => record?.subAssemblyValue === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendor3,
      filteredValue: filtersInfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: `Budget Cost ${Menulistdata[0].currency}`,
      dataIndex: 'budgetCostlat',
      key: 'budgetCostlat',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null && text !== ''
            ? parseFloat(text).toLocaleString('en-IN')
            : '',
      }),
    },
    {
      title: `Target Cost ${Menulistdata[0].currency}`,
      dataIndex: 'budgetCost',
      key: 'budgetCost',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null && text !== ''
            ? parseFloat(text).toLocaleString('en-IN')
            : '',
      }),
    },
    {
      title: `Actual Cost ${Menulistdata[0].currency}`,
      dataIndex: 'actualCost',
      key: 'actualCost',
      className: 'right-align-cell',
      filters: actualCost3,
      filteredValue: filtersInfo.actualCost,
      onFilter: (value, record) => record?.actualCost === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null && text !== ''
            ? parseFloat(text).toLocaleString('en-IN')
            : '',
      }),
    },
    {
      title: `Excess Cost ${Menulistdata[0].currency}`,
      dataIndex: 'excess',
      key: 'excess',
      className: 'right-align-cell',
      filters: excessCost3,
      filteredValue: filtersInfo.excess,
      onFilter: (value, record) => record?.excess === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null && text !== ''
            ? parseFloat(text).toLocaleString('en-IN')
            : '',
      }),
    },
    {
      title: `Actual Excess Cost ${Menulistdata[0].currency}`,
      dataIndex: 'actualExcess',
      key: 'actualExcess',
      className: 'right-align-cell',
      filters: excessCost3,
      filteredValue: filtersInfo.actualExcess,
      onFilter: (value, record) => record?.actualExcess === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      filters: reason3,
      filteredValue: filtersInfo.reason,
      onFilter: (value, record) => record?.reason === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' ? 'center' : 'left',
          },
        },
        children: text !== 'null' ? text : '-',
      }),
    },
    {
      title: 'RCA',
      dataIndex: 'rootCause',
      key: 'rootCause',
      filters: RCA3,
      filteredValue: filtersInfo.rootCause,
      onFilter: (value, record) => record?.rootCause === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' ? 'center' : 'left',
          },
        },
        children: text !== 'null' ? text : '-',
      }),
    },
    {
      title: 'Responsible Department',
      dataIndex: 'responsibleDesc',
      key: 'responsibleDesc',
      filters: department3,
      filteredValue: filtersInfo.responsibleDesc,
      onFilter: (value, record) => record?.responsibleDesc === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === null ? 'center' : 'left',
          },
        },
        children: text !== null ? text : '-',
      }),
    },
    {
      title: 'Current Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      filters: status3,
      filteredValue: filtersInfo.statusDesc,
      onFilter: (value, record) => record?.statusDesc === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Next Status',
      dataIndex: 'nextSeqDesc',
      key: 'nextSeqDesc',
      // width: '15%',
      filters: nextStatus3,
      filteredValue: filtersInfo.nextSeqDesc,
      onFilter: (value, record) => {
        return record.nextSeqDesc && record.nextSeqDesc.indexOf(value) === 0
      },
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text !== 'null' && text !== null && text !== 'NA' ? text : '-',
      }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      // width: 150,
      render: (text, record, index) => (
        <div>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleDetails(record, index)}
          />
        </div>
      ),
    },
  ]

  const RejectRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div>
            <div>
              <h5>Add Remarks</h5>
              <Form form={remarkform}>
                <div className="row form_datas">
                  <div>
                    <Form.Item name="remarkfield">
                      <TextArea rows={4} />
                    </Form.Item>
                  </div>
                </div>
              </Form>
              <center style={{ marginTop: '10px' }}>
                <ButtonComponent type="primary" text="Save" onClick={handleSaveRemark} />
              </center>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const handleOpen = val => {
    setRejectRemarksCard(true)
    if (val === 0) {
      setApprove(0)
    } else {
      setApprove(1)
    }
  }

  const dateformatter = dateStringval => {
    const dateSp = dateStringval.split('-')
    const finalStr = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
    return finalStr
  }

  const Dtlcolumns = [
    {
      title: 'Status Description',
      dataIndex: 'sequenceStatusDesc',
      key: 'sequenceStatusDesc',
    },
    {
      title: 'Updated by',
      dataIndex: 'empName',
      key: 'empName',
      render: text => {
        let updatedBy = null
        if (text !== null) {
          updatedBy = text
        } else {
          updatedBy = '-'
        }
        return updatedBy
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => {
        let remarks = null
        if (text !== null) {
          remarks = text
        } else {
          remarks = '-'
        }
        return remarks
      },
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: text => {
        let updatedOn = null
        if (text !== null) {
          const spltdval = text.split(' ') || null
          const dateformat = `${dateformatter(spltdval[0])} ${spltdval[1]}`
          updatedOn = dateformat
        } else {
          updatedOn = '-'
        }
        return updatedOn
      },
    },
  ]

  // component
  const DtlComponent = () => {
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <div>
            <Form form={form} layout="vertical" labelAlign="left">
              <div className="row">
                <div className="col-md-3">
                  <Form.Item
                    name="indentcode"
                    label={
                      <span>
                        Indent No.<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>

                <div className="col-md-3">
                  <Form.Item
                    name="projectcode"
                    label={
                      <span>
                        Project Number<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="vendorname"
                    label={
                      <span>
                        Vendor Name<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="Dept"
                    label={
                      <span>
                        Responsible Dept<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select
                      placeholder="Select Department"
                      defaultValue="Select Department"
                      style={{ minWidth: '170px' }}
                    >
                      {deptEmp &&
                        deptEmp.map(item => (
                          <Option key={item.departmentCode} value={item.departmentCode}>
                            {item.departmentName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="station" label={<span>Station </span>}>
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="budgetCostlat" label={<span>Budget Cost (Rs.) </span>}>
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="budgetCost" label={<span>Target Cost (Rs.) </span>}>
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="actualCost" label={<span>Actual Cost (Rs.) </span>}>
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="excessCost" label={<span>Excess Cost (Rs.) </span>}>
                    <InputComponent type="text" disabled={disable} />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="reason"
                    label={
                      <span>
                        Reason<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <textarea
                      className="form-control"
                      maxLength={256}
                      rows={3}
                      style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                    />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="rca"
                    label={
                      <span>
                        RCA<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <textarea
                      className="form-control"
                      maxLength={256}
                      rows={3}
                      style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                    />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    name="action"
                    label={
                      <span>
                        Action<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <textarea
                      className="form-control"
                      maxLength={256}
                      rows={3}
                      style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold' }}> Current Status : </span>{' '}
              {singledetail.statusDesc}
            </h6>
          </div>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            {singledetail &&
            singledetail.documentStatusMstList &&
            singledetail.documentStatusMstList[0] !== null ? (
              <ButtonComponent
                text={singledetail?.documentStatusMstList[0]?.docStatusDesc}
                type="primary"
                marginright="10px"
                onClick={() => handleOpen(0)}
                // onClick={() => handleApprove(1)}
              />
            ) : null}
            <ButtonComponent
              marginright="10px"
              type="primary"
              icon={<CommentOutlined />}
              onClick={() => {
                setdetailCard(true)
              }}
            />
            {singledetail &&
            singledetail.documentStatusMstList &&
            singledetail.documentStatusMstList[0] !== null ? (
              <ButtonComponent
                text="Save"
                type="primary"
                marginright="10px"
                onClick={() => handleSave(0)}
              />
            ) : null}

            <ButtonComponent
              text="Cancel"
              type="primary"
              marginright="10px"
              onClick={handleCloseDtlModal}
            />
            {singledetail &&
            singledetail.documentStatusMstList &&
            singledetail.documentStatusMstList[0] !== null &&
            singledetail.documentStatusMstList[0].cancelSeq !== null ? (
              <ButtonComponent
                text="Previous Stage"
                type="danger"
                marginright="10px"
                // onClick={() => setRejectRemarksCard(true)}
                onClick={() => handleOpen(1)}
              />
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Popuptable
              onClose={() => setRejectRemarksCard(false)}
              cardLabel=""
              component={() => RejectRemarksComponent(1)}
              visible={rejectRemarksCard}
              placement="top"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Popuptable
              onClose={() => setdetailCard(false)}
              cardLabel=""
              component={
                <Table
                  dataSource={singledetail && singledetail.budgetExcessStatusDtlList}
                  columns={Dtlcolumns}
                />
              }
              visible={detailCard}
            />
          </div>
        </Card>
      </div>
    )
  }

  const exportToPDF = () => {
    const infoArray = store.get('Enquiry')
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.top = '-9999px' // Hide the container offscreen

    // Add title "Sales Budget Sheet"
    let htmlContent = `
      <div style="font-size: 35px; text-align: center; margin-bottom: 20px;">
        <strong>Sales Budget Sheet</strong>
      </div>
      <div style="font-size: 25px; display: flex; justify-content: center; margin-left: 30px;">
    `

    infoArray.forEach(item => {
      htmlContent += `
        <p style="margin-right: 30px;">
          <strong>${item.label}</strong><br />
          <strong>${item.value}</strong>
        </p>
      `
    })
    htmlContent += '</div>'

    tempContainer.innerHTML = htmlContent
    document.body.appendChild(tempContainer)
    html2canvas(tempContainer).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      doc.addImage(imgData, 'PNG', 10, 10, canvas.width / 10, canvas.height / 10)
      const tableRows = tableData?.map((item, index) => [
        index + 1,
        item.indentCode,
        item.projectCode,
        item.vendorName,
        item.budgetCost,
        item.actualCost,
        item.excess,
        item.reason,
        item.rootCause,
        item.responsibleDesc,
        item.action,
        item.statusDesc,
      ])
      const tableHeaders = columns.slice(0, -1).map(col => col.title)
      doc.autoTable({
        startY: canvas.height / 10 + 11,
        head: [tableHeaders],
        body: tableRows,
        styles: {
          fontSize: 6,
          cellPadding: 1,
        },
      })
      doc.save(`Budget_Excess_Sheet_${currentDateTime}.pdf`)
      document.body.removeChild(tempContainer)
    })
  }

  return (
    <div>
      <Card style={{ marginTop: '20px' }}>
        {isTailview ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h5>Indent Group</h5>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <Form form={form}>
                <Row gutter={24}>
                  <Col span={4}>
                    <Form.Item
                      name="FromDate"
                      label={
                        <span>
                          From Date<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      initialValue={moment(defaultFromDate)}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="ToDate"
                      label={
                        <span>
                          To Date<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      initialValue={moment(defaultToDate)}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Projectcode"
                      label={
                        <span>
                          Project<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select Project"
                        onChange={projectId => setProjectId(projectId)}
                      >
                        {projectList?.map(item => (
                          <Option key={item.projectId} value={item.projectId}>
                            {item.projectCode}-{item.customerName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* <Col span={4}>
                    <Form.Item
                      name="IndentCodeDP"
                      label={
                        <span>
                          Indent<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      style={{ width: '298px' }}
                    >
                      <Select defaultValue="Get All" placeholder="Select Indent">
                        {indentList?.map(item => (
                          <Option key={item.indentId} value={item.indentId}>
                            {item.indentCode}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col> */}
                </Row>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    marginTop: '10px',
                  }}
                >
                  <Button type="primary" onClick={handleGetDetails}>
                    Get details
                  </Button>
                  <Button type="primary" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </Form>
            </div>

            <Skeleton loading={loading && tableData && tableData.length > 0} active>
              <div style={{ marginBottom: '-32px', marginLeft: '10rem' }}>
                <ButtonComponent onClick={exportToPDF} text="Export to PDF" type="primary" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Input.Search
                  placeholder="Search..."
                  allowClear
                  enterButton
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 450 }}
                />
              </div>
              <Table
                dataSource={searchedData}
                columns={columns}
                exportableProps={{
                  fileName: `Budget_Excess_Sheet${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', `${tableData.length}`],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                onChange={FilterChange}
                bordered
              />
            </Skeleton>

            <ModalPopup
              text="Budget Excess RCA"
              isModalVisible={isDtlModal}
              onCancel={handleCloseDtlModal}
              FieldsComponent={DtlComponent}
              width={1400}
            />

            <BackButtonComponent componentToRender="project" />
          </>
        ) : null}
      </Card>
    </div>
  )
}

export default BudgetExcessSheet
