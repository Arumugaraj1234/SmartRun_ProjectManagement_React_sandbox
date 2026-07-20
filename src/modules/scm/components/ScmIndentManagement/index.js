/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react'
import store from 'store'
import { Card, Row, Divider, Popover, Input, Form, message, Select, Checkbox } from 'antd'
import {
  FileExcelOutlined,
  FileTwoTone,
  MessageOutlined,
  UserOutlined,
  CommentOutlined,
  MinusOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import messageReturn from '_helpers/messageReturn'
import ModalPopup from 'components/shared/ModalPopupComponent'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import Button from 'components/shared/ButtonComponent'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import CommonFields from '../CommonFields2'
import Tailviewfields from '../Tailviewfields'
// import AssignTeam from '../../../../components/common/AssignTeam'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../../style.scss'
import currentDateTime from '../../../../currentDateTime'

const { TextArea } = Input
const { Option } = Select
const ScmIndentManagement = ({ isTailview }) => {
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
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const Tab = store.get('Tab')
  const Menulistdata = store.get('MenuListData')
  const ScmHdrId = store.get('ScmHdrId')
  const ProjectID = store.get('ProjectID')
  const updatedTab = { ...Tab, processCode: 5, tenantId }
  store.set('Tab', updatedTab)
  const isInternal = store.get('isInternal')
  const [form] = Form.useForm()
  const [indentTable, setIndentTable] = useState([])
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const [detailModalVisible, setDetailmodalVisible] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [detailTable, setDetailTable] = useState([])
  const [viewAssignTeam, setViewAssignTeam] = useState(false)
  const [docLifeList, setDocLifeList] = useState([])
  const [approvebtn, setApprovebtn] = useState(false)
  const [approveRemarksCard, setApproveremarksCard] = useState(false)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const [msgdetailcard, setMsgDetailCard] = useState(false)
  const [msgDetailslist, setMsgDetailList] = useState([])
  const [indentID, setIndentId] = useState(null)
  const [budgetpopup, setBudgetPopup] = useState(false)
  const [budgetTable, setBudgetTable] = useState([])
  const [openedsinglebudget, setOpenedsinglebudget] = useState(null)
  const [singleIndent, setSingleIndent] = useState('')
  const [fieldsvalue, setFieldsvalue] = useState(null)
  const [costFlowType, setCostFlowType] = useState('LEGACY')
  const [teamMembersList, setTeamMembersList] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [allowtoAssign, setAllowtoAssign] = useState('')
  const [poDtlList, setPoDtlList] = useState([])
  const [podtlpopup, setPoDtlPopup] = useState(false)
  const [partnummodal, setPartnumModal] = useState(false)
  const [ProductCostdetails, setProductCostDetails] = useState([])
  const [IsCriticalModal, setIsCriticalModal] = useState(false)
  const [criticalTabData, setCriticalTabData] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    onloadgetallIndent()
  }, [])

  // useEffect(() => {
  //   setFilteringData(criticalTabData)
  // }, [criticalTabData])

  const handleGetDetails = formData => {
    setFieldsvalue(formData)
    getallIndent(formData)
  }
  const getallIndent = async formData => {
    if (!formData?.IndentCode || !formData?.Projectcode) {
      onloadgetallIndent()
      return
    }

    const reqdata = {
      pmId: '5',
      indentId: formData?.IndentCode,
      tenantId,
      empId: employeeId,
      projectId: formData?.Projectcode,
      byProjectId: formData?.IndentCode === 'getAll' ? '1' : '0',
      docType: 'DC018',
    }

    const response = await indentFileUpload({
      requestPath: 'getIndentHdrDtlsByIndentId',
      requestData: reqdata,
    })

    if (response?.responseCode === '200') {
      const updatedData = response.responseData.map((item, index) => {
        const different =
          item.indentClosed === '1' && item.indentClosedDate
            ? moment(item.indentClosedDate).diff(moment(item.expectedDeliveryDate), 'days')
            : moment().diff(moment(item.expectedDeliveryDate), 'days')
        return {
          ...item,
          sno: index + 1,
          different: different <= 0 ? '-' : different,
        }
      })
      setIndentTable(updatedData)
      // message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
      setIndentTable([])
    }
  }

  const onloadgetallIndent = async () => {
    const reqdata = {
      pmId: '5',
      indentId: 'getAll',
      tenantId,
      empId: employeeId,
      projectId: ProjectID,
      byProjectId: '1',
      docType: 'DC018',
    }

    const response = await indentFileUpload({
      requestPath: 'getIndentHdrDtlsByIndentId',
      requestData: reqdata,
    })

    if (response?.responseCode === '200') {
      const updatedData = response.responseData.map((item, index) => {
        const different =
          item.indentClosed === '1' && item.indentClosedDate
            ? moment(item.indentClosedDate).diff(moment(item.expectedDeliveryDate), 'days')
            : moment().diff(moment(item.expectedDeliveryDate), 'days')
        return { ...item, sno: index + 1, different: different <= 0 ? '-' : different }
      })
      setIndentTable(updatedData)
    } else {
      message.error(response?.responseMessage)
      setIndentTable([])
    }
  }

  const getAssignTeamStatus = async () => {
    const reqdata = {
      referenceId: ScmHdrId,
      referenceDoc: updatedTab.processCode,
      employeeID: employeeId,
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getProcessAssignedTeam',
      requestData: reqdata,
    })

    if (response) {
      setAllowtoAssign(response?.assignTeam)
      setTeamMembersList(response?.processAssignedTeamEntity)
    }
  }

  // const getTeamMembers = async () => {
  //   const reqdata = {
  //     tenantId,
  //     departmentId: '',
  //     employeeId,
  //   }
  //   const response = await indentFileUpload({
  //     requestPath: 'getEmployeeForDepartment',
  //     requestData: reqdata,
  //   })

  //   if (response) {
  //     setTeamMembersList(response)
  //   } else {
  //     message.error(response?.responseMessage)
  //     setTeamMembersList([])
  //   }
  // }
  const OpendAssignTeam = (record, index) => {
    const updateTab = { ...Tab, mstId: index.indentId }
    store.set('Tab', updateTab)
    setViewAssignTeam(true)
    getAssignTeamStatus()
    // getTeamMembers()
    setDetailId(index.indentCode)
    getDetails(index.indentId)
    setIndentId(index.indentId)
    setSingleIndent(index)
    form.setFieldsValue({
      dueDate: moment(index?.expectedDeliveryDate, 'YYYY-MM-DD') || '',
    })
  }
  const Opendetailview = (record, index) => {
    setDetailId(index.indentCode)
    getDetails(index.indentId)
    setIndentId(index.indentId)
    setDetailmodalVisible(true)
    setViewAssignTeam(false)
    setSingleIndent(index)
    form.setFieldsValue({
      dueDate: moment(index?.expectedDeliveryDate, 'YYYY-MM-DD') || '',
    })
  }

  const handleDetailCancel = () => {
    setDetailmodalVisible(false)
    setDetailTable([])
  }

  const approveIndent = async () => {
    setApproveremarksCard(true)
  }
  const cancelIndent = async () => {
    setRejectRemarksCard(true)
  }

  const getDetails = async indentId => {
    const reqdata = {
      tenantId,
      empId: employeeId,
      indentId,
      projectId: ProjectID,
      docType: 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlsByIndentId',
      requestData: reqdata,
    })
    if (response?.responseData?.length > 0 && response?.responseData[0]) {
      setDetailTable(response?.responseData[0]?.dtlList)
      setDocLifeList(response?.responseData[0]?.docLifeCycleMstList)
      setCostFlowType(response?.responseData[0]?.costFlowType || 'LEGACY')
      form.setFieldsValue({
        targetValue:
          parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN') || '0',
      })
      if (response?.responseData[0]?.approveBtnEnable === 1) {
        setApprovebtn(true)
      }
      if (response?.responseData[0]?.approveBtnEnable === 0) {
        setApprovebtn(false)
      }
    } else {
      setDetailTable([])
    }
  }

  const OpenmsgDetailCard = async () => {
    const keyareaobj = {
      tenantID: tenantId,
      indentHdrId: indentID,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentRemarks',
      requestData: keyareaobj,
    })
    if (response) {
      setMsgDetailList(response.responseData)
    }
    setMsgDetailCard(true)
  }
  const TotalValueModal = record => {
    setBudgetPopup(true)
    Totalvalueget(record)
    setOpenedsinglebudget(record)
  }

  const Totalvalueget = async indent => {
    TotalValueModal() // remove this line
    const reqObj = {
      indentDtlId: indent.indentDtlId,
    }
    const response = await indentFileUpload({
      requestPath: 'getindentbudgetDtlbyindentDtlId',
      requestData: reqObj,
    })
    if (response) {
      setBudgetTable(response?.responseData || [])
    }
  }

  const submitApprove = async () => {
    setIsSubmitting(true)
    setApprovebtn(false)
    const formValues = form.getFieldsValue()
    const keyareaobj = {
      tenantId,
      indentId: detailTable[0]?.indentId,
      empId: employeeId,
      remarks: formValues.remarks,
      currentseq: docLifeList[0]?.currSequence,
      pmId: Tab.processCode,
      docType: 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'updateIndentHdrStatus',
      requestData: keyareaobj,
    })
    if (response) {
      setDetailTable([])
      setDetailId(null)
      setDetailmodalVisible(false)
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        setIsSubmitting(false)
      }
      if (response.responseCode !== '200') {
        message.error(response.responseMessage)
        setIsSubmitting(false)
      }
    }
    
    setApproveremarksCard(false)
    getallIndent(fieldsvalue)
    form.resetFields()
  }
  const submitCancel = async () => {
    setIsSubmitting(true)
    setApprovebtn(false)
    const formValues = form.getFieldsValue()
    const keyareaobj = {
      tenantId,
      indentId: detailTable[0]?.indentId,
      empId: employeeId,
      remarks: formValues.remarks,
      currentseq: docLifeList[0]?.cancelSeq,
      pmId: Tab.processCode,
      docType: 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'updateIndentHdrStatus',
      requestData: keyareaobj,
    })
    if (response) {
      setDetailTable([])
      setDetailId(null)
      setDetailmodalVisible(false)
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        getDetails(indentID)
        setIsSubmitting(false)
      }
      if (response.responseCode !== '200') {
        message.error(response.responseMessage)
        setIsSubmitting(false)
      }
    }
    // setIsSubmitting(false)
    setRejectRemarksCard(false)
    getallIndent(fieldsvalue)
    form.resetFields()
  }

  const DeleteBudget = async (record, index) => {
    try {
      const reqobj = {
        indentBudId: index.indentBudId,
      }
      const response = await indentFileUpload({
        requestPath: 'deleteIndentBudgetId',
        requestData: reqobj,
      })
      if (response) {
        Totalvalueget(openedsinglebudget)
      }
    } catch (error) {
      message.error(error)
    }
  }

  const getCriticalList = async () => {
    const reqdata = {
      masterId: store.get('ProjectID'),
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getcriticalListByPmHdrId',
      requestData: reqdata,
    })
    if (response) {
      if (response.responseCode === '200') {
        setCriticalTabData(response?.responseData)
      } else {
        setCriticalTabData([])
      }
    }
  }

  const getProductcost = async record => {
    const reqdata = {
      productCode: record.productCode,
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlProductCost',
      requestData: reqdata,
    })
    if (response) {
      setPartnumModal(true)
      if (response.responseCode === '200') {
        setProductCostDetails(response.responseData)
      } else {
        message.error(response.responseMessage)
      }
    } else {
      setPartnumModal(true)
      message.error(response.responseMessage)
    }
  }

  const OpenPodetail = async (text, record) => {
    const reqdata = {
      prodCode: record.productCode,
      tenantId,
      projId: ProjectID,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlsPoIndentId',
      requestData: reqdata,
    })
    if (response) {
      setPoDtlPopup(true)
      if (response.responseCode === '200') {
        setPoDtlList(response.responseData)
      } else {
        message.error(response.responseMessage)
      }
    } else {
      setPoDtlPopup(true)
      message.error(response.responseMessage)
    }

    // setPoDtlList(record)
  }
  const msgdetailcolumn = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status Description',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]
  // const Projectname = []
  const SeleCategory = []
  const KeyArea = []
  const KeySubArea = []
  const EDdate = []
  const status = []
  const nxtStatus = []
  const createdOn = []
  const createdBy = []
  const indentCode = []

  if (indentTable) {
    // indentTable.map(h => {
    //   return Projectname.push(h.projectName)
    // })
    indentTable.map(h => {
      return status.push(h.statusDesc)
    })
    indentTable.map(h => {
      return nxtStatus.push(h.nextstatusDesc)
    })
    indentTable.map(h => {
      return SeleCategory.push(h.sbcDesc)
    })
    indentTable.map(h => {
      return KeyArea.push(h.keyAreaDesc)
    })
    indentTable.map(h => {
      return KeySubArea.push(h.subKeyAreaDesc)
    })
    indentTable.map(h => {
      return EDdate.push(h.expectedDeliveryDate)
    })
    indentTable.map(h => {
      return createdOn.push(h.createdOn)
    })
    indentTable.map(h => {
      return createdBy.push(h.createdBy)
    })
    indentTable.map(h => {
      return indentCode.push(h.indentCode)
    })
  }

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  // const filterprojectname = Projectname.filter(distinct)
  const filtersalectg = SeleCategory.filter(distinct)
  const filterkeyares = KeyArea.filter(distinct)
  const filterkeysubareas = KeySubArea.filter(distinct)
  const filterEDdate = EDdate.filter(distinct)
  const filterStatus = status.filter(distinct)
  const filterNxtStatus = nxtStatus.filter(distinct)
  const filterCreatedOn = createdOn.filter(distinct)
  const filterCreatedBy = createdBy.filter(distinct)
  const filterIndentCode = indentCode.filter(distinct)

  //  const FilterProjectName = []
  const FilterSaleCategory = []
  const FilterIndentCode = []
  const FilterKeyArea = []
  const FilterKeySubArea = []
  const FilterEDdate = []
  const FilterStatus = []
  const FilterNxtStatus = []
  const FilterCreatedBy = []
  const FilterCreatedOn = []

  // filterprojectname.map(element => {
  //   return FilterProjectName.push({
  //     text: element,
  //     value: element,
  //   })
  // })

  filterStatus
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterStatus.push({
        text: element,
        value: element,
      })
    })

  filterNxtStatus
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterNxtStatus.push({
        text: element,
        value: element,
      })
    })

  filtersalectg
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterSaleCategory.push({
        text: element,
        value: element,
      })
    })

  filterIndentCode
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .forEach(element => {
      FilterIndentCode.push({
        text: element,
        value: element,
      })
    })

  filterkeyares
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterKeyArea.push({
        text: element,
        value: element,
      })
    })

  filterkeysubareas
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach(element => {
      FilterKeySubArea.push({
        text: element,
        value: element,
      })
    })

  filterEDdate.forEach(element => {
    const formattedDate = element ? moment(element).format('DD-MMM-YYYY') : ''
    FilterEDdate.push({
      text: formattedDate,
      value: element,
    })
  })

  filterCreatedBy
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterCreatedBy.push({
        text: element,
        value: element,
      })
    })

  filterCreatedOn
    .sort((a, b) => new Date(a) - new Date(b))
    .forEach(element => {
      const formattedDate = moment(element).format('DD-MMM-YYYY')
      FilterCreatedOn.push({
        text: formattedDate,
        value: element,
      })
    })

  const searchedData = indentTable.filter(item => {
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
      dataIndex: 'sno',
      key: 'sno',
      width: '4%',
    },
    // {
    //   title: 'Indent For',
    //   dataIndex: 'indentTypeDesc',
    //   key: 'indentTypeDesc',
    // },
    {
      title: 'Indent Type',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      filters: FilterSaleCategory,
      filteredValue: filtersinfo.sbcDesc,
      onFilter: (value, record) => record?.sbcDesc === value,
    },

    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: FilterIndentCode,
      filteredValue: filtersinfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
    },

    // {
    //   title: 'Project',
    //   dataIndex: 'projectName',
    //   key: 'projectName',
    //   display:'none',
    //   filters: FilterProjectName,
    //   filteredValue: filtersinfo.projectName,
    //   onFilter: (value, record) => record?.projectName=== value,
    //   onHeaderCell: () => {
    //     return {
    //       style: { display: 'none' },
    //     };
    //   },
    //   onCell: () => {
    //     return {
    //       style: { display: 'none' },
    //     };
    //   },
    // },
    {
      title: 'Station',
      dataIndex: 'keyAreaDesc',
      key: 'keyAreaDesc',
      filters: FilterKeyArea,
      filteredValue: filtersinfo.keyAreaDesc,
      onFilter: (value, record) => record?.keyAreaDesc === value,
    },

    {
      title: 'Sub Assy.',
      dataIndex: 'subKeyAreaDesc',
      key: 'subKeyAreaDesc',
      filters: FilterKeySubArea,
      filteredValue: filtersinfo.subKeyAreaDesc,
      onFilter: (value, record) => record?.subKeyAreaDesc === value,
    },
    {
      title: 'Part Count',
      dataIndex: 'noOfProductsCount',
      key: 'noOfProductsCount',
      className: 'right-align-cell',
    },
    {
      title: 'Target Date',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      filters: FilterEDdate,
      filteredValue: filtersinfo.expectedDeliveryDate,
      onFilter: (value, record) => record?.expectedDeliveryDate === value,
      render: (text, record) => {
        const currentDate = new Date()
        const dateString = moment(record.expectedDeliveryDate).format('DD-MMM-YYYY')
        const expectedDeliveryDate = new Date(record.expectedDeliveryDate)
        return expectedDeliveryDate < currentDate && record.indentClosed === '0' ? (
          <span className="text-red">{dateString}</span>
        ) : (
          dateString
        )
      },
    },
    {
      title: `Target Cost ${Menulistdata[0].currency}`,
      key: 'targetCost',
      dataIndex: 'targetCost',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text?.toLocaleString('en-IN') || ''
      },
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      filters: FilterCreatedOn,
      filteredValue: filtersinfo.createdOn,
      onFilter: (value, record) => record?.createdOn === value,
      render: (text, record) =>
        record.createdOn ? moment(record.createdOn).format('DD-MMM-YYYY') : '',
    },
    {
      title: 'Created by',
      key: 'createdBy',
      dataIndex: 'createdBy',
      filters: FilterCreatedBy,
      filteredValue: filtersinfo.createdBy,
      onFilter: (value, record) => record?.createdBy === value,
    },
    {
      title: 'Revision No.',
      dataIndex: 'revisionNo',
      key: 'revisionNo',
      className: 'right-align-cell',
      render: text => (text != null ? text : '-'),
    },
    {
      title: 'Revision On',
      dataIndex: 'revisionOn',
      key: 'revisionOn',
      render: (text, record) => moment(record.revisionOn).format('DD-MMM-YYYY'),
    },
    {
      title: 'Delay Days',
      dataIndex: 'different',
      key: 'different',
      className: 'right-align-cell',
      // render: (text, record) => {
      //   const diff =
      //     record.indentClosed === '1' && record.indentClosedDate
      //       ? moment(record.indentClosedDate).diff(moment(record.expectedDeliveryDate), 'days')
      //       : moment().diff(moment(record.expectedDeliveryDate), 'days')
      //   return diff <= 0 ? 'NA' : diff
      // },
    },

    // {
    //   title: 'Status',
    //   key: 'statusDesc',
    //   dataIndex: 'statusDesc',
    // },
    {
      title: 'Assigned Status',
      key: 'assigned',
      dataIndex: 'assigned',
      filters: [
        { text: 'Assigned', value: false },
        { text: 'Un Assigned', value: true },
      ],
      filteredValue: filtersinfo.assigned,
      onFilter: (value, record) => record?.assigned === value,
      render: text => (text === true ? 'Un Assigned' : 'Assigned'),
    },
    {
      title: 'Current Status',
      key: 'statusDesc',
      dataIndex: 'statusDesc',
      filters: FilterStatus,
      filteredValue: filtersinfo.statusDesc,
      onFilter: (value, record) => record?.statusDesc === value,
      render: text => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: 'Next Status',
      key: 'nextstatusDesc',
      dataIndex: 'nextstatusDesc',
      filters: FilterNxtStatus,
      filteredValue: filtersinfo.nextstatusDesc,
      onFilter: (value, record) => {
        const nextStatus = record.nextstatusDesc || '' // Default to empty string if null
        return nextStatus.indexOf(value) === 0
      },
      render: text => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (record, index) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button
            type="primary"
            onClick={() => {
              Opendetailview(record, index)
            }}
            icon={<FileTwoTone />}
          />
          <Button
            type="primary"
            onClick={() => {
              OpendAssignTeam(record, index)
            }}
            icon={<UserOutlined />}
          />
        </div>
      ),
    },
  ]
  const columns2 = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 50,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={() => getProductcost(record)}>
          <p style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{text}</p>
        </div>
      ),
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      className: 'right-align-cell',
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
    },
    {
      title: 'Quantity',
      key: 'qty',
      dataIndex: 'qty',
      align: 'right',
    },
    {
      title: 'Unit',
      key: 'uomDesc',
      dataIndex: 'uomDesc',
    },
    // {
    //   title: `Allocated Budget ${Menulistdata[0].currency}`,
    //   key: 'totalVal',
    //   dataIndex: 'totalVal',
    //   width: 150,
    //   render: (text, record) => (
    //     <Link
    //       onClick={() => {
    //         TotalValueModal(record)
    //       }}
    //       onKeyDown={e => {
    //         if (e.key === 'Enter') {
    //           TotalValueModal(record)
    //         }
    //       }}
    //       style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
    //     >
    //       <span>{parseFloat(record.totalVal).toLocaleString('en-IN')}</span>
    //     </Link>
    //   ),
    // },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      align: 'center',
      width: 120,
      render: (record, index) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Popover
            title="Remarks"
            content={<Input.TextArea disabled defaultValue={index.remarks} value={index.remarks} />}
            trigger="click"
          >
            <Button type="primary" width="30px" icon={<MessageOutlined />} />
          </Popover>
          {index.dmId !== 0 ? (
            <DownloadDocuments
              isPdf={record?.isPdf}
              refid={index.dmId}
              tenanrId={tenantId}
              fileDocode=""
              docTypeCode=""
            />
          ) : null}
        </div>
      ),
    },
  ]
  const columns5 = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 50,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      align: 'right',
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
    },
    {
      title: 'Qty.',
      key: 'qty',
      dataIndex: 'qty',
      align: 'right',
    },
    {
      title: 'Unit',
      key: 'uomDesc',
      dataIndex: 'uomDesc',
    },
    {
      title: 'Assigned Employee',
      key: 'assignTeamEmpName',
      dataIndex: 'assignTeamEmpName',
      render: text => (text !== '' && text !== null && text !== undefined ? text : 'Unassigned'),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Assign</span>
          <Checkbox
            indeterminate={
              selectedRowKeys.length > 0 && selectedRowKeys.length < detailTable.length
            }
            style={{ marginLeft: '5px' }}
            checked={selectedRowKeys.length === detailTable.length}
            onChange={event => {
              const { checked } = event.target
              setSelectedRowKeys(checked ? detailTable.map(item => item.indentDtlId) : [])
            }}
          />
        </div>
      ),
      key: '',
      dataIndex: '',
      align: 'center',
      render: (_, record) => {
        const onChange = event => {
          const { checked } = event.target
          const checkedList = checked
            ? [...selectedRowKeys, record.indentDtlId]
            : selectedRowKeys.filter(item => item !== record.indentDtlId)

          setSelectedRowKeys(checkedList)
        }

        return (
          <Checkbox checked={selectedRowKeys.includes(record.indentDtlId)} onChange={onChange} />
        )
      },
    },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      align: 'center',
      width: 120,
      render: (record, index) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Popover
            title="Remarks"
            content={<Input.TextArea disabled defaultValue={index.remarks} value={index.remarks} />}
            trigger="click"
          >
            <Button type="primary" width="30px" icon={<MessageOutlined />} />
          </Popover>
          {index.dmId !== 0 ? (
            <DownloadDocuments
              isPdf={record?.isPdf}
              refid={index.dmId}
              tenanrId={tenantId}
              fileDocode=""
              docTypeCode=""
            />
          ) : null}
          {index.poCount !== 0 ? (
            <Button
              type="primary"
              onClick={() => {
                OpenPodetail(record, index)
              }}
              icon={<ProfileOutlined />}
            />
          ) : null}
        </div>
      ),
    },
  ]

  const columns4 = [
    {
      title: 'Sub Assy.',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
    },
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
    },
    {
      title: 'Element Desc',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
    },
    {
      title: 'Alloc. Qty',
      dataIndex: 'allocatedQty',
      key: 'allocatedQty',
      className: 'right-align-cell',
    },
    {
      title: 'Alloc. Value',
      dataIndex: 'allocatedVal',
      key: 'allocatedVal',
      className: 'right-align-cell',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (record, index) => (
        <Button
          type="danger"
          onClick={() => {
            DeleteBudget(record, index)
          }}
          icon={<MinusOutlined />}
        />
      ),
    },
  ]
  const columns3 = [
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Po Id',
      dataIndex: 'poId',
      key: 'poId',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      align: 'right',
    },
    {
      title: 'Unit Rate',
      dataIndex: 'unitRate',
      key: 'unitRate',
      align: 'right',
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
  ]
  const columns6 = [
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Po Date',
      dataIndex: 'poDate',
      key: 'poDate',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
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
        return text?.toLocaleString('en-IN') || ''
      },
    },
  ]
  const BudgetFieldsComponent = () => {
    return (
      <div>
        <div className="mt-1 custom_antd_Table">
          <Table columns={columns4} dataSource={budgetTable} bordered scroll={{ y: 500 }} />
        </div>
      </div>
    )
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const handleClear = () => {
    setIndentTable([])
    setViewAssignTeam(false)
  }

  const handleAssign = async () => {
    const y = form.getFieldValue('Teammembers')
    if (y === undefined || null || '') {
      messageReturn(405)
      return
    }
    const reqdata = {
      tenantId,
      indentId: singleIndent.indentId,
      employeeId: y,
      selectedIndents: selectedRowKeys,
    }
    const response = await indentFileUpload({
      requestPath: 'updateEmpInIndentAssignTeam',
      requestData: reqdata,
    })

    if (response?.responseCode === '200') {
      message.success(response?.responseMessage)
      setSelectedRowKeys([])
    }
    getDetails(indentID)
  }
  const AddRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={form}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <center>
                {approveRemarksCard ? (
                  <Button
                    type="primary"
                    text="Save"
                    onClick={submitApprove}
                    disabled={isSubmitting}
                  />
                ) : null}
                {rejectRemarksCard ? (
                  <Button
                    type="primary"
                    text="Save"
                    onClick={submitCancel}
                    disabled={isSubmitting}
                  />
                ) : null}
              </center>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const PartnumFieldsComponent = () => {
    return (
      <div>
        <Table
          columns={columns6}
          dataSource={ProductCostdetails}
          scroll={{ y: 500 }}
          pagination={false}
          bordered
        />
      </div>
    )
  }
  // const handleDownload = async () => {
  //   setIsDownloading(true)

  //   const downloadPromises = detailTable.map(async record => {
  //     const dmId = record?.dmId
  //     if (dmId) {
  //       const response = await indentFileUpload({
  //         requestPath: 'documentDownloadDocFile',
  //         requestData: {
  //           referenceId: dmId,
  //           tenantId,
  //           fileCode: '',
  //           docTypeCode: '',
  //         },
  //       })

  //       if (response && response.fileContent !== null) {
  //         const link = document.createElement('a')
  //         link.href = `data:application/octet-stream;base64,${response.fileContent}`
  //         link.download = response.fileName
  //         link.click()
  //       }
  //     }
  //   })

  //   try {
  //     await Promise.all(downloadPromises)
  //   } catch (error) {
  //     console.error('Error downloading files', error)

  //     messageReturn(606)
  //   }

  //   setIsDownloading(false) // Re-enable button and reset text
  // }

  const handleDownload = async () => {
    setIsDownloading(true)

    const zip = new JSZip()
    const downloadPromises = detailTable.map(async record => {
      const dmId = record?.dmId
      if (dmId) {
        const response = await indentFileUpload({
          requestPath: 'documentDownloadDocFile',
          requestData: {
            referenceId: dmId,
            tenantId,
            fileCode: '',
            docTypeCode: '',
          },
        })

        if (response && response.fileContent !== null) {
          // Add the file content to the ZIP
          zip.file(response.fileName, response.fileContent, { base64: true })
        }
      }
    })

    try {
      await Promise.all(downloadPromises)
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${detailId}_${currentDateTime}.zip`)
    } catch (error) {
      console.error('Error downloading files', error)
      messageReturn(606)
    } finally {
      setIsDownloading(false) // Re-enable button and reset text
    }
  }
  const FieldsComponent = () => {
    return (
      <div>
        <div>
          <div className="mt-1 custom_antd_Table">
            <div className="row">
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                <p className="tob_label">Station :</p>
                <p>{singleIndent?.keyAreaDesc}</p>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                <p className="tob_label">Sub Assy. :</p>
                <p>{singleIndent?.subKeyAreaDesc}</p>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                <p className="tob_label">Created On :</p>
                <p>
                  {singleIndent.createdOn
                    ? moment(singleIndent.createdOn).format('DD-MMM-YYYY')
                    : ''}
                </p>
              </div>

              {costFlowType !== 'NEW' ? (
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                  <p className="tob_label">
                    Target Cost {Menulistdata[0].currency}
                    <span style={{ color: 'red' }}>*</span> :{' '}
                  </p>
                  <Form form={form}>
                    <Form.Item name="targetValue" style={{ color: 'black' }}>
                      <Input type="text" disabled />
                    </Form.Item>
                  </Form>
                </div>
              ) : null}
            </div>
            {detailTable && detailTable.length > 0 ? (
              <div style={{ marginBottom: '-32px', marginLeft: '155px' }}>
                <Button
                  text={isDownloading ? 'Downloading...' : 'Download All'}
                  type="primary"
                  onClick={handleDownload}
                />
              </div>
            ) : null}
            <Table
              columns={columns2}
              dataSource={detailTable}
              scroll={{ y: 500 }}
              pagination={false}
              bordered
              exportableProps={{
                fileName: `Indent_Details_${detailId}-${currentDateTime}`,
                btnProps: {
                  type: 'primary',
                  icon: <FileExcelOutlined />,
                  children: <span>Export to CSV</span>,
                },
              }}
            />
          </div>
        </div>
        <div>
          {partnummodal ? (
            <ModalPopup
              FieldsComponent={PartnumFieldsComponent}
              isModalVisible={partnummodal}
              text="Product - PO History"
              onCancel={() => {
                setPartnumModal(false)
                setProductCostDetails([])
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
  const ButtonsComponent = () => {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            gap: '5px',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {approvebtn ? (
            <div>
              {docLifeList && docLifeList.length > 0 && (
                <Button
                  type="primary"
                  text={docLifeList[0].docStatusDesc}
                  onClick={approveIndent}
                />
              )}
              <Popuptable
                onClose={() => setApproveremarksCard(false)}
                cardLabel=""
                component={AddRemarksComponent}
                visible={approveRemarksCard}
              />
              <span style={{ margin: '0 3px' }} />
              <Popuptable
                onClose={() => setRejectRemarksCard(false)}
                cardLabel=""
                component={AddRemarksComponent}
                visible={rejectRemarksCard}
              />
              {docLifeList && docLifeList.length > 0 && docLifeList[0].cancelSeq !== null && (
                <Button type="danger" text="Previous Stage " onClick={cancelIndent} />
              )}
              <span style={{ margin: '0 3px' }} />
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button type="primary" text="Cancel" onClick={() => handleDetailCancel()} />
            <Popuptable
              onClose={() => setMsgDetailCard(false)}
              cardLabel=""
              component={<Table dataSource={msgDetailslist} columns={msgdetailcolumn} />}
              visible={msgdetailcard}
            />
            <Button
              type="primary"
              icon={<CommentOutlined />}
              onClick={() => {
                OpenmsgDetailCard()
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  const PoDtlFieldsComponent = () => {
    return (
      <div>
        <div className="row">
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Part Number</p>
            <p>{poDtlList[0]?.productCode || 'NA'} </p>
          </div>
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Description</p>
            <p>{poDtlList[0]?.description || 'NA'} </p>
          </div>
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Specification</p>
            <p>{poDtlList[0]?.specification || 'NA'} </p>
          </div>
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Material</p>
            <p>{poDtlList[0]?.material || 'NA'} </p>
          </div>
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Quantity</p>
            <p>{poDtlList[0]?.dtlQty || 'NA'} </p>
          </div>
          <div className="col-md-2">
            <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Unit</p>
            <p>{poDtlList[0]?.unit || 'NA'} </p>
          </div>
        </div>
        <Table columns={columns3} dataSource={poDtlList} bordered scroll={{ y: 500 }} />
      </div>
    )
  }

  const columns7 = [
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
    },
    {
      title: 'Element Desc.',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
    },
    {
      title: 'Critical',
      dataIndex: 'critical',
      key: 'critical',
      align: 'right',
    },
    {
      title: 'Time Line In Weeks',
      dataIndex: 'timelineInWeeks',
      key: 'timelineInWeeks',
      align: 'right',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      align: 'right',
    },
    // {
    //   title: 'Total Value',
    //   dataIndex: 'totalValue',
    //   key: 'totalValue',
    //   align: 'right',
    //   render: text => (
    //     <div style={{ textAlign: 'right' }}>
    //       {text !== undefined && text !== null && text !== ''
    //         ? parseFloat(text).toLocaleString('en-IN')
    //         : ''}
    //     </div>
    //   ),
    // },
    // {
    //   title: 'Allocated Value',
    //   dataIndex: 'allocatedvalue',
    //   key: 'allocatedvalue',
    //   align: 'right',
    //   render: text => (
    //     <div style={{ textAlign: 'right' }}>
    //       {text !== undefined && text !== null && text !== ''
    //         ? parseFloat(text).toLocaleString('en-IN')
    //         : ''}
    //     </div>
    //   ),
    // },
  ]

  // const [filteringdata, setFilteringData] = useState(criticalTabData);
  // let filteredData = criticalTabData
  // const handleSearch = e => {
  //   filteredData = criticalTabData.filter(item =>
  //     Object.keys(item).some(key =>
  //       item[key]
  //         ?.toString()
  //           .toLowerCase()
  //           .includes(e.target.value.toLowerCase()),
  //     ),
  //   )
  //   setFilteringData(filteredData)
  // }
  const CriticalModalView = () => {
    return (
      <div>
        {/* <Input.Search
          style={{ margin: '0 0 10px 0', width: '30%', float: 'right' }}
          placeholder="Search here..."
          enterButton
          onSearch={handleSearch}
          onChange={e => handleSearch(e)}
        /> */}
        <Table
          columns={columns7}
          dataSource={criticalTabData}
          bordered
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [criticalTabData?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 500 }}
        />
      </div>
    )
  }

  return (
    <div className="my-3">
      <Card style={{ width: '100%' }} title={!isTailview ? 'Indent Management' : null}>
        {!isTailview ? (
          <CommonFields
            onGetDetails={handleGetDetails}
            onClear={handleClear}
            getIndent={isInternal == 1 ? isInternal : '5'}
          />
        ) : (
          <div>
            <h5 className="mb-3">Indent Management</h5>
            <Tailviewfields onGetDetails={handleGetDetails} onClear={handleClear} getIndent={isInternal == 1 ? '5' : '1'} />
          </div>
        )}
        {indentTable && indentTable.length > 0 ? (
          <div>
            <Row>
              <Divider orientation="left">Indent Details</Divider>
            </Row>

            <div>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  text="View Critical Indent"
                  onClick={() => {
                    setIsCriticalModal(true)
                    getCriticalList()
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
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
                exportableProps={{
                  fileName: `Indent_Management_${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [indentTable.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                onChange={handleChange}
                bordered
              />
            </div>
          </div>
        ) : null}
        {/* <div>{viewAssignTeam ? <AssignTeam component="scmind" /> : null}</div> */}
        <div>
          {viewAssignTeam ? (
            <div>
              <Form form={form}>
                <div className="row">
                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    {allowtoAssign === '1' ? (
                      <Form.Item
                        name="Teammembers"
                        label={
                          <span>
                            Allocated Team Members:<span style={{ color: 'red' }}>*</span>{' '}
                          </span>
                        }
                      >
                        <Select placeholder="Select Team Members">
                          {teamMembersList?.map(item => (
                            <Option key={item.empId} value={item.empId}>
                              {item.employeeName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : null}
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <div>
                      <span>Indent No</span>
                      <span style={{ marginLeft: '10px' }}>
                        :&nbsp;&nbsp;{singleIndent.indentCode}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="mt-1 custom_antd_Table">
                      <Table
                        columns={columns5}
                        dataSource={detailTable}
                        bordered
                        pagination={{
                          pageSizeOptions: ['10', '20', '30', '50', [detailTable.length]],
                          showSizeChanger: true,
                          defaultPageSize: 10,
                        }}
                        scroll={{ y: 500 }}
                      />
                    </div>
                    {allowtoAssign === '1' ? (
                      <div className="text-center">
                        <Button type="primary" text="Assign" onClick={handleAssign} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </Form>
            </div>
          ) : null}
        </div>
        <ModalPopup
          FieldsComponent={CriticalModalView}
          isModalVisible={IsCriticalModal}
          text="Critical Part Details"
          width={1400}
          onCancel={() => {
            setIsCriticalModal(false)
          }}
        />
        <div>
          {detailModalVisible ? (
            <ModalPopup
              FieldsComponent={FieldsComponent}
              isModalVisible={detailModalVisible}
              ButtonsComponent={ButtonsComponent}
              text={`${singleIndent?.indentTypeDesc} -Indent Details -${detailId} -${singleIndent?.sbcDesc}`}
              width={1400}
              onCancel={() => {
                handleDetailCancel()
                getallIndent(fieldsvalue)
              }}
            />
          ) : null}
        </div>

        <div>
          {podtlpopup ? (
            <ModalPopup
              FieldsComponent={PoDtlFieldsComponent}
              isModalVisible={podtlpopup}
              text="Purchase Order Details"
              width={1400}
              onCancel={() => {
                setPoDtlPopup(false)
                setPoDtlList([])
              }}
            />
          ) : null}
        </div>
        <div>
          {budgetpopup ? (
            <ModalPopup
              FieldsComponent={BudgetFieldsComponent}
              isModalVisible={budgetpopup}
              text="Allocated Details"
              onCancel={() => {
                setBudgetPopup(false)
                getDetails(singleIndent.indentId)
              }}
            />
          ) : null}
        </div>
      </Card>
    </div>
  )
}

export default ScmIndentManagement
