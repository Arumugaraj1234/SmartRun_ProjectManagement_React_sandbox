/* eslint-disable */
import React, { useState, useEffect } from 'react'
import store from 'store'
import {
  PlusOutlined,
  FileExcelOutlined,
  FileTwoTone,
  CommentOutlined,
  UploadOutlined,
  MinusOutlined,
  InfoCircleOutlined,
  // CloseOutlined,
} from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import {
  Card,
  Input,
  Form,
  message,
  Popover,
  Upload,
  DatePicker,
  Skeleton,
  AutoComplete,
  Tooltip,
  Select,
} from 'antd'
import { useHistory } from 'react-router-dom'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import moment from 'moment'
import Popuptable from 'components/shared/PopuptableComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
// import BudgetModal from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import AddIcon from 'components/shared/AddIconComponent'
import Button from '../../shared/ButtonComponent'
import Addindent from '../AddIndent'
import { indentFileUpload } from '../../../services/common/AppeovedDocumentService/adddocumentservice'
import DownloadDocuments from '../FileDownloadComponent'
import BackButtonComponent from '../BackBtnComponent'
import checkFileSize from '../../../_helpers/fileUtill'
import currentDateTime from '../../../currentDateTime'
import CommonFields2 from './MrFields'
import '../style.scss'
import './style.scss'

const { TextArea } = Input
// const { Link } = Typography
const IndentManagement = ({ componentdata }) => {
  const { Option } = Select
  const history = useHistory()
  const prevPath = history.location.state?.from
  console.log(prevPath)

  const fromHistory =
    history?.location?.state?.record?.refCode && history?.location?.state?.record?.projectId
  const [form] = Form.useForm()
  const [toolTipData] = Form.useForm()
  const [indentDetailForm] = Form.useForm()
  const [requiredQryForm] = Form.useForm()
  const [requiredValForm] = Form.useForm()
  const [addnewform] = Form.useForm()
  // const [budgetForm] = Form.useForm()
  const [dueDateForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [cancelpopoverVisible, setcancelPopoverVisible] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [indentTable, setIndentTable] = useState([])
  const [filtersinfo, setfilterinfo] = useState(
    fromHistory
      ? {
          indentCode: [history?.location?.state?.record?.refCode],
          projectIdFromNoti: history?.location?.state?.record?.projectId,
        }
      : {},
  )
  const [detailTable, setDetailTable] = useState([])
  const [docLifeList, setDocLifeList] = useState([])
  const [budgetIcondata, setBudgetIconData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  // const [addIndent, setAddIndent] = useState(false)
  const [indentid, setindentid] = useState(null)
  const [isFlag, setIsFlag] = useState(null)
  const [addbtnsts, setAddBtnSts] = useState(false)
  const [approvebtn, setApprovebtn] = useState(false)
  const [approveRemarksCard, setApproveremarksCard] = useState(false)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const [detailModalVisible, setDetailmodalVisible] = useState(false)
  const [msgdetailcard, setMsgDetailCard] = useState(false)
  const [msgDetailslist, setMsgDetailList] = useState([])
  const [saveButton, setSaveButton] = useState(false)
  const [indentID, setIndentId] = useState(null)
  const [singleIndent, setSingleIndent] = useState(null)
  // const [BudgetList, setBudgetList] = useState([])
  // const [visible, setVisible] = useState(false)
  // const [selectedIndex, setSelectedIndex] = useState(null)
  const [budgetpopup, setBudgetPopup] = useState(false)
  const [budgetTable, setBudgetTable] = useState([])
  const [openedsinglebudget, setOpenedsinglebudget] = useState(null)
  const [commonProjectId, setCommonProjectId] = useState('')
  const [criticalTabData, setCriticalTabData] = useState([])
  const [IsCriticalModal, setIsCriticalModal] = useState(false)
  const [seqnum, setSeqNum] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tableWidth, setTableWidth] = useState('300px')
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [dtlListCount, setDtlListCount] = useState(0)
  const [originalDtlListCount, setOriginalDtlListCount] = useState(0)
  const [productDetails, setProductDetails] = useState([])
  const [dataKeySubArea, setDataKeySubArea] = useState([])
  const [dataKeyArea, setDataKeyArea] = useState([])
  const [partnummodal, setPartnumModal] = useState(false)
  const [ProductCostdetails, setProductCostDetails] = useState([])
  const [showUploadBtn, setShowUploadBtn] = useState(false)
  const [searchText, setSearchText] = useState('')
  // const [commonMasterId, setCommonMasterId]=useState('');
  // const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projId, setProjID] = useState(null)

  const Tab = store.get('Tab')
  const ProjectID = store.get('ProjectID')
  // const hdrId = store.get('hdrId')
  const employeeId = store.get('employeeId')
  const enquiryId = store.get('EnquiryID')
  const referenceId = store.get('referenceId')
  const Menulistdata = store.get('MenuListData')
  const tenantid = store.get('tenantId')
  const enquiryarr = store.get('Enquiry')
  const pmId = store.get('processDoc')
  const depCode = store.get('depCode')
  const isInternal = store.get('isInternal')
  const dueDateObject = enquiryarr?.find(item => item.label === 'Due Date')
  const dueDateval = dueDateObject ? moment(dueDateObject.value) : null
  const planStartObject = enquiryarr?.find(item => item.label === 'Project HandOver date')
  const planStartDate = planStartObject ? moment(planStartObject.value) : null
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const isTab = useMediaQuery({ query: '(max-width: 769px)' })

  useEffect(() => {
    if (componentdata.module !== 'common') {
      if (filtersinfo.projectIdFromNoti) {
        getIndentlist(filtersinfo.projectIdFromNoti)
      } else {
        getIndentlist()
      }
    }
    addIndentbtn()
    getProductDetails()
    getKeyareas()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 90}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getIndentlist = async ProjId => {
    setLoading(true)
    const keyareaobj = {
      tenantId: tenantid,
      projectId: ProjId || projId || ProjectID,
      empId: employeeId,
      docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentHdrDtlsByProjectId',
      requestData: keyareaobj,
    })
    if (response) {
      const updatedData = response.responseData.map((item, index) => {
        const diff =
          item.indentClosed === '1' && item.indentClosedDate
            ? moment(item.indentClosedDate).diff(moment(item.expectedDeliveryDate), 'days')
            : moment().diff(moment(item.expectedDeliveryDate), 'days')
        return {
          ...item,
          sno: index + 1,
          diff: diff <= 0 ? '-' : diff,
        }
      })
      setIndentTable(updatedData)
    }
    store.remove('closepopup')
    setDtlListCount(0)
    setLoading(false)
  }

  const getProductDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getpoInstoreDtlByPmId ',
      requestData: {
        tenantId: tenantid,
        isFlag: 1,
      },
    })
    if (response?.responseCode === '200') {
      const options = response?.responseData.map(item => ({
        key: item.productId ? item.productId : '',
        value: item.productCode ? item.productCode : '',
        data: item,
      }))
      setProductDetails(options)
    } else {
      message.error(response?.responseMessage)
    }
  }

  const handleinsertChange = (value, option) => {
    if (option?.data) {
      addnewform.setFieldsValue({
        uomDesc: option?.data?.uomLongDescriprtion || '',
        partNumber: option?.data?.productCode || '',
        description: option?.data?.productDesc || '',
      })
      // setSelectedProduct(option?.data)
    } else {
      // setSelectedProduct(null)
      value = null
    }
  }

  const handleInputChange = (value, option = {}, sno) => {
    if (option?.data && value) {
      indentDetailForm.setFieldsValue({
        [`uomDesc_${sno}`]: option.data.uomLongDescriprtion || '',
        [`productCode_${sno}`]: option.data.productCode || '',
        [`description_${sno}`]: option.data.productDesc || '',
      })
    } else {
      indentDetailForm.setFieldsValue({
        [`productCode_${sno}`]: '',
      })

      setTimeout(() => {
        indentDetailForm.setFieldsValue({
          [`uomDesc_${sno}`]: '',
          [`description_${sno}`]: '',
        })
      }, 0)
    }
  }

  const getKeyareas = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: ProjectID || commonProjectId,
    }
    const response = await indentFileUpload({
      requestPath: 'getKeyArea',
      requestData: keyareaobj,
    })
    if (response) {
      setDataKeyArea(response?.responseData)
    }
  }

  const getKeusubareas = async () => {
    const formValues = dueDateForm.getFieldsValue()
    form.setFieldsValue({ keysubarea: undefined })
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: ProjectID || commonProjectId,
      pkaId: formValues.KeyArea,
    }
    const response = await indentFileUpload({
      requestPath: 'getKeySubAreaByPKId',
      requestData: keyareaobj,
    })
    if (response) {
      setDataKeySubArea(response?.responseData)
    }
  }

  const getBudgetcost = async e => {
    const keyareaobj = {
      indentId: e,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'getBudgetDtlByIndent',
      requestData: keyareaobj,
    })
    if (response) {
      if (response?.responseData) {
        if (response.responseData.length > 0) {
          const updateData = response.responseData.map((rec, index) => {
            return {
              oldRequiredQty: rec.requiredQty,
              oldRequiredValue: rec.requiredValue,
              sno: index + 1,
              ...rec,
            }
          })
          setBudgetIconData(updateData)
          const updatedValues = updateData.map(rec => {
            const fieldName = `requiredQty_${rec.sno}`
            return { [fieldName]: rec.requiredQty }
          })
          const updatedValue = updateData.map(rec => {
            const fieldName = `requiredValue_${rec.sno}`
            return { [fieldName]: rec.requiredValue }
          })
          requiredQryForm.setFieldsValue(Object.assign({}, ...updatedValues))
          requiredValForm.setFieldsValue(Object.assign({}, ...updatedValue))
        } else {
          setBudgetIconData([])
        }
      } else {
        setBudgetIconData([])
      }
    }
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleSubmit = () => {}
  const handleCancel = () => {
    setIsModalVisible(false)
    getIndentlist()
    addIndentbtn()
    setDataKeySubArea([])
    store.remove('closepopup')
  }
  const Opendetailview = (record, index) => {
    // setOriginalDtlListCount(0)
    // setDtlListCount(0)
    // setShowUploadBtn(true)
    setDetailmodalVisible(true)
    setDetailId(index.indentCode)
    getDetails(index.indentId)
    setIndentId(index.indentId)
    setSingleIndent(index)
    indentDetailForm.resetFields()
    dueDateForm.setFieldsValue({
      dueDate: moment(index?.expectedDeliveryDate, 'YYYY-MM-DD') || '',
      // availableValue: index?.avilablevalue,
    })
  }
  const handleDetailCancel = Indent => {
    setDetailmodalVisible(false)
    // setDtlListCount(0)
    // getDetails(Indent)
    console.log(Indent)
    indentDetailForm.resetFields()
    if (dtlListCount !== 0) {
      if (originalDtlListCount !== dtlListCount) {
        UpdateindentDetails()
      }
    }
    // getDetails(Indent)
    getIndentlist()
    setOriginalDtlListCount(0)
    setDtlListCount(0)
    setDataKeySubArea([])
    dueDateForm.resetFields()
  }
  const getDetails = async indentId => {
    setLoading(true)
    const reqdata = {
      tenantId: tenantid,
      empId: employeeId,
      indentId,
      docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
      pmId: componentdata?.module === 'common' ? '8' : pmId != null ? pmId : '2',
      depCode,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlsByIndentId',
      requestData: reqdata,
    })
    if (response) {
      if (response?.responseData.length > 0) {
        setindentid(response?.responseData[0]?.dtlList[0]?.indentId)
        setIsFlag(response?.responseData[0]?.isFlag)
        const count = response?.responseData[0]?.dtlList.length
        if (!detailModalVisible) {
          setOriginalDtlListCount(count)
          setDtlListCount(0)
        } else {
          setDtlListCount(count)
        }
        setSeqNum(response?.responseData[0]?.seq)
        // getBudgetcost(response ?.responseData[0] ?.dtlList[0] ?.indentId)
        dueDateForm.setFieldsValue({
          availableValue:
            parseFloat(response?.responseData[0]?.avilablevalue).toLocaleString('en-IN') || '0',
          allocatedValue:
            parseFloat(response?.responseData[0]?.allocatedValue).toLocaleString('en-IN') || '0',
          // targetValue:
          //   parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN') || '0',
          budgetvalue:
            parseFloat(response?.responseData[0]?.allocatedValue).toLocaleString('en-IN') || '0',
          targetValue:
            parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN') || '0',
        })
        // if (Number(response?.responseData[0]?.targetValue > 0)) {
        //   dueDateForm.setFieldsValue({
        //     targetValue:
        //       parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN') || '0',
        //   })
        // } else {
        //   dueDateForm.setFieldsValue({
        //     targetValue:  parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN'),
        //   })
        // }
        setDetailTable(response?.responseData[0]?.dtlList)
        setDocLifeList(response?.responseData[0]?.docLifeCycleMstList)
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
    setLoading(false)
  }
  const approveIndent = async () => {
    setApproveremarksCard(true)
    // getIndentlist()
  }
  const cancelIndent = async () => {
    setRejectRemarksCard(true)
    // getIndentlist()
  }
  const OpenmsgDetailCard = async () => {
    const keyareaobj = {
      tenantID: tenantid,
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

  const submitApprove = async () => {
    setApproveremarksCard(false)
    setIsSubmitting(true)
    setApprovebtn(false)
    const availablevalue = parseFloat(
      dueDateForm.getFieldValue('availableValue')?.replace(/,/g, ''),
    )
    const budgetvalue = parseFloat(dueDateForm.getFieldValue('budgetvalue')?.replace(/,/g, ''))
    if (
      (componentdata.module === 'project' ||
        (componentdata.module === 'common' &&
          docLifeList?.[0].docStatusDesc === 'Finance Accepted')) &&
      docLifeList?.length > 0
    ) {
      if (
        (availablevalue > 0 && budgetvalue == 0) ||
        budgetvalue === NaN ||
        budgetvalue === undefined
      ) {
        messageReturn(612) // Error code for target should not be zero if allocated exists
        dueDateForm.setFieldsValue({ budgetvalue: '' })
        return
      }

      if (
        !dueDateForm.getFieldValue('allocatedValue') ||
        !dueDateForm.getFieldValue('targetValue') ||
        // dueDateForm.getFieldValue('targetValue') === '0' ||
        !dueDateForm.getFieldValue('dueDate')
      ) {
        messageReturn(405)
        return
      }
      SaveDueDate(1)
    }
    const formValues = form.getFieldsValue()
    const keyareaobj = {
      tenantId: tenantid,
      indentId: detailTable[0]?.indentId,
      empId: employeeId,
      remarks: formValues.remarks,
      currentseq: docLifeList?.[0]?.currSequence,
      pmId: Tab?.processCode || componentdata.processCode,
      docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'updateIndentHdrStatus',
      requestData: keyareaobj,
    })
    if (response) {
      setDetailTable([])
      setDetailId(null)
      addIndentbtn()
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
    form.resetFields()
    getIndentlist()
  }
  const submitCancel = async () => {
    // setShowUploadBtn(true)
    setIsSubmitting(true)
    setRejectRemarksCard(false)
    setApprovebtn(false)
    const formValues = form.getFieldsValue()
    const keyareaobj = {
      tenantId: tenantid,
      indentId: detailTable[0]?.indentId,
      empId: employeeId,
      remarks: formValues.remarks,
      currentseq: docLifeList[0]?.cancelSeq,
      pmId: Tab?.processCode || componentdata.processCode,
      docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
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

    form.resetFields()
    getIndentlist()
  }
  const addIndentbtn = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      hdrId: componentdata.module !== 'common' ? ProjectID : commonProjectId,
      pmId: pmId != null ? pmId : '2',
    }
    const response = await indentFileUpload({
      requestPath: 'getStartIndentReqStatus',
      requestData: keyareaobj,
    })
    if (response) {
      if (response?.responseDataMessage === '1') {
        setAddBtnSts(true)
      } else {
        setAddBtnSts(false)
      }
    }
  }

  const deleteIndent = async (record, index) => {
    if (record.indentDtlId === undefined) {
      const updatedTable = detailTable.filter((_, i) => i !== index)
      setDetailTable(updatedTable)

      if (updatedTable.length === 0) {
        indentDetailForm.resetFields()
        setDetailmodalVisible(false)
      }
      return
    }
    setLoading(true)
    const keyareaobj = {
      indentDtlId: record.indentDtlId,
      dmId: record.dmId ? record.dmId : '',
      tenantId: tenantid,
    }

    const response = await indentFileUpload({
      requestPath: 'deleteIndentByIndentDtlId',
      requestData: keyareaobj,
    })

    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      indentDetailForm.resetFields()
      setDetailTable([])
      // const updatedTable = detailTable.filter((_, i) => i !== index)
      // setDetailTable(updatedTable)

      // if(setDetailmodalVisible){
      //   getDetails(record.indentId)
      //   // const updatedTable = detailTable.filter((_, i) => i !== index)
      //   // setDetailTable(updatedTable)
      //   setDetailmodalVisible(true)
      //   if (detailTable.length === 0) {
      //     indentDetailForm.resetFields()
      //     setDetailmodalVisible(false)
      //   }
      // }
    } else {
      message.error(response.responseMessage)
    }
    getDetails(record.indentId)
    setLoading(false)
  }
  const beforeUpload = (info, record) => {
    if (checkFileSize(info)) {
      uploadfile(info, record)
    }
  }
  const uploadfile = async (info, rec) => {
    const reqObj = [
      {
        enquiryId,
        tenantId: tenantid,
        type: 'Projects',
        empId: employeeId,
        refId: referenceId,
        projectId: ProjectID || commonProjectId,
        stageCode: Tab?.stgCode || componentdata.stgCode,
        indentHdrId: '',
        indentDtlId: rec.indentDtlId,
        docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
        uploadDocType: componentdata?.module === 'common' ? 'FC015' : 'FC015',
      },
    ]
    if (info) {
      const formData = new FormData()
      formData.append('insertDocRequest', JSON.stringify({ reqObj }))
      formData.append('file', info)

      try {
        const response = await indentFileUpload({
          requestPath: 'insertIndentFile',
          requestData: formData,
        })

        if (response) {
          if (response.responseCode === '200') {
            message.success(response.responseDataMessage)
            getDetails(indentID)
          } else {
            message.error(response.responseDataMessage)
          }
        }
      } catch (error) {
        messageReturn(610)
      }
    }
  }

  const IndentTypeDesc = []
  const SeleCategory = []
  const IndentNoCate = []
  const KeyArea = []
  const KeySubArea = []
  const EDdate = []
  const createdOn = []
  const status = []
  const nxtStatus = []
  const createdBy = []

  indentTable.map(h => {
    return status.push(h.statusDesc)
  })
  indentTable.map(h => {
    return nxtStatus.push(h.nextstatusDesc)
  })
  indentTable.map(h => {
    return IndentTypeDesc.push(h.indentTypeDesc)
  })
  indentTable.map(h => {
    return SeleCategory.push(h.sbcDesc)
  })
  indentTable.map(h => {
    return IndentNoCate.push(h.indentCode)
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
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const filterindentdesc = IndentTypeDesc.filter(distinct)
  const filtersalectg = SeleCategory.filter(distinct)
  const filterIndentNo = IndentNoCate.filter(distinct)
  const filterkeyares = KeyArea.filter(distinct)
  const filterkeysubareas = KeySubArea.filter(distinct)
  const filterEDdate = EDdate.filter(distinct)
  const filterCreatedOn = createdOn.filter(distinct)
  const filterCreatedBy = createdBy.filter(distinct)
  const filterStatus = status.filter(distinct)
  const filterNxtStatus = nxtStatus.filter(distinct)

  const FilterIndentDescription = []
  const FilterSaleCategory = []
  const FilterIndentNo = []
  const FilterKeyArea = []
  const FilterKeySubArea = []
  const FilterEDdate = []
  const FilterCreatedBy = []
  const FilterCreatedOn = []
  const FilterStatus = []
  const FilterNxtStatus = []

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

  filterindentdesc
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterIndentDescription.push({
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

  filterIndentNo
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .forEach(element => {
      FilterIndentNo.push({
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
    const formattedDate = moment(element).format('DD-MMM-YYYY')
    FilterEDdate.push({
      text: formattedDate,
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

  filterCreatedBy
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      FilterCreatedBy.push({
        text: element,
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
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
    },
    {
      title: 'Indent Type',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: FilterSaleCategory,
      filteredValue: filtersinfo.sbcDesc,
      onFilter: (value, record) => record?.sbcDesc === value,
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: FilterIndentNo,
      ...(fromHistory && filtersinfo.indentCode
        ? {
            filteredValue: filtersinfo.indentCode,
            onFilter: (value, record) => record.indentCode === value,
          }
        : {
            filteredValue: filtersinfo.indentCode || [],
            onFilter: (value, record) => record.indentCode === value,
          }),
    },

    {
      title: 'Station',
      dataIndex: 'keyAreaDesc',
      key: 'keyAreaDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: FilterKeyArea,
      filteredValue: filtersinfo.keyAreaDesc,
      onFilter: (value, record) => record?.keyAreaDesc === value,
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'subKeyAreaDesc',
      key: 'subKeyAreaDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: FilterKeySubArea,
      filteredValue: filtersinfo.subKeyAreaDesc,
      onFilter: (value, record) => record?.subKeyAreaDesc === value,
    },
    {
      title: 'Part Count',
      dataIndex: 'noOfProductsCount',
      key: 'noOfProductsCount',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
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
        const expectedDeliveryDate = record.expectedDeliveryDate
          ? new Date(record.expectedDeliveryDate)
          : null
        const formattedDate = expectedDeliveryDate
          ? moment(expectedDeliveryDate).format('DD-MMM-YYYY')
          : '-'

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children:
            expectedDeliveryDate &&
            expectedDeliveryDate < currentDate &&
            record.indentClosed === '0' ? (
              <span className="text-red">{formattedDate}</span>
            ) : (
              formattedDate
            ),
        }
      },
    },

    {
      title: `Target Cost ${Menulistdata[0]?.currency}`,
      key: 'targetCost',
      dataIndex: 'targetCost',
      className: 'right-align-cell',
      render: (text, record) => {
        let formattedText = '-'

        const numericValue = Number(text)
        if (text !== null && text !== undefined && !Number.isNaN(numericValue)) {
          formattedText = numericValue.toLocaleString('en-IN')
        }

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children: formattedText,
        }
      },
    },

    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      filters: FilterCreatedOn,
      filteredValue: filtersinfo.createdOn,
      onFilter: (value, record) => record?.createdOn === value,
      render: (text, record) => {
        const formattedDate = record.createdOn
          ? moment(record.createdOn).format('DD-MMM-YYYY')
          : '-'

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children: formattedDate,
        }
      },
    },
    {
      title: 'Created by',
      key: 'createdBy',
      dataIndex: 'createdBy',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: FilterCreatedBy,
      filteredValue: filtersinfo.createdBy,
      onFilter: (value, record) => record?.createdBy === value,
    },
    {
      title: 'Revision No.',
      dataIndex: 'revisionNo',
      key: 'revisionNo',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      // render: text => (text != null ? text : '-'),
      // render: (text, record) => (
      //   <div
    },
    {
      title: 'Revision On',
      dataIndex: 'revisionOn',
      key: 'revisionOn',
      render: (text, record) => {
        const formattedDate = record.revisionOn
          ? moment(record.revisionOn).format('DD-MMM-YYYY')
          : '-'

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children: formattedDate,
        }
      },
    },
    {
      title: 'Delay Days',
      dataIndex: 'diff',
      key: 'diff',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      // render: (text, record) => {
      //   const diff =
      //     record.indentClosed === '1' && record.indentClosedDate
      //       ? moment(record.indentClosedDate).diff(moment(record.expectedDeliveryDate), 'days')
      //       : moment().diff(moment(record.expectedDeliveryDate), 'days')
      //   return diff <= 0 ? 'NA' : diff
      // },
    },
    {
      title: 'Current Status',
      key: 'statusDesc',
      dataIndex: 'statusDesc',
      filters: FilterStatus,
      filteredValue: filtersinfo.statusDesc,
      onFilter: (value, record) => record?.statusDesc === value,
      render: (text, record) => {
        const displayText = text !== undefined && text !== null ? text : '-'

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children: displayText,
        }
      },
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
      render: (text, record) => {
        const displayText = text !== undefined && text !== null ? text : '-'

        return {
          props: {
            style: {
              backgroundColor: record.verCheck === 1 ? '#FFFF00' : 'transparent',
            },
          },
          children: displayText,
        }
      },
    },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (record, index) => (
        <Button
          type="primary"
          onClick={() => {
            Opendetailview(record, index)
          }}
          icon={<FileTwoTone />}
        />
      ),
    },
  ]
  const UpdateindentDetails = async () => {
    setSaveButton(true)
    const formValues = indentDetailForm.getFieldsValue()
    const dueform = dueDateForm.getFieldValue()
    const updatedTableData = detailTable.map(item => {
      return {
        ...item,

        partNumber: formValues[`productCode_${item.sno}`] || '',
        desc: formValues[`description_${item.sno}`] || '',
        specification: formValues[`specification_${item.sno}`] || '',
        make: formValues[`make_${item.sno}`] || '',
        weight: formValues[`weight_${item.sno}`] || '',
        material: formValues[`material_${item.sno}`] || '',
        qty: formValues[`qty_${item.sno}`] || '',
        unit: formValues[`uomDesc_${item.sno}`] || '',
        remarks: formValues[`remarks_${item.sno}`] || '',
      }
    })
    const allFieldsFilled = updatedTableData.every(
      item => item.description && item.qty && item.unit,
    )

    const isCountMismatch = originalDtlListCount !== dtlListCount

    if (!isCountMismatch) {
      if (!allFieldsFilled) {
        messageReturn(405)
        setSaveButton(false)
        return
      }
    }

    const payload = {
      tenantId: tenantid,
      indentId: indentID,
      pkaId: dueform.KeyArea,
      pksaId: dueform.keysubarea,
      empId: employeeId,
      projectId: projId || ProjectID || commonProjectId,
      indentType: detailTable[0]?.indentType,
      dtlList: updatedTableData,
      docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'insertIndentDtls',
      requestData: payload,
    })
    if (response.responseCode === '200') {
      setDetailmodalVisible(false)
      indentDetailForm.resetFields()
      getDetails(indentID)
      getIndentlist()
      // setOriginalDtlListCount(0)
      // setDtlListCount(0)
      message.success(response.responseMessage)
      setSaveButton(false)
    }
  }
  const handleKeyPress = e => {
    if (!e || !e.charCode) {
      return
    }

    const charCode = e.charCode || e.keyCode
    const charStr = String.fromCharCode(charCode)

    // Prevent double quotes and single quotes
    if (charStr === '"' || charStr === "'" || charStr === '\\' || charStr === '/') {
      e.preventDefault()
    }
  }

  const insertdata = [
    {
      sno: '',
      partNumber: '',
      Desc: '',
      specification: '',
      make: '',
      weight: '',
      material: '',
      qty: '',
      unit: '',
      remarks: '',
    },
  ]

  const onFinish = () => {
    const updatedTableData = detailTable.map(item => {
      return {
        ...item,
        remarks: form.getFieldValue(`remarks_${item.sno}`) || '',
      }
    })

    setDetailTable(updatedTableData)
  }

  const formatValue = input => {
    const numericValue = input.replace(/[^0-9.]/g, '').replace(/\.(?=.*\.)/g, '')
    return numericValue.replace(/^0+(\d)/, '$1')
  }

  const handlePaste = e => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')
    const numericData = formatValue(pasteData)
    document.execCommand('insertText', false, numericData)
  }

  const handleAddRow = () => {
    const formvalues = addnewform.getFieldsValue()
    if (
      formvalues.productCode &&
      formvalues.qty &&
      formvalues.uomDesc &&
      formvalues.description !== ('' && undefined)
    ) {
      setShowUploadBtn(false)
      const formValues2 = indentDetailForm.getFieldsValue()
      const updatedTableData = detailTable.map(item => {
        return {
          ...item,
          productCode: formValues2[`productCode_${item.sno}`] || '',
          description: formValues2[`description_${item.sno}`] || '',
          specification: formValues2[`specification_${item.sno}`] || '',
          make: formValues2[`make_${item.sno}`] || '',
          weight: formValues2[`weight_${item.sno}`] || '',
          material: formValues2[`material_${item.sno}`] || '',
          qty: formValues2[`qty_${item.sno}`] || '',
          uomDesc: formValues2[`uomDesc_${item.sno}`] || '',
          remarks: formValues2[`remarks_${item.sno}`] || '',
          // dmId : 0,
        }
      })
      const sno =
        updatedTableData.length > 0 ? updatedTableData[updatedTableData.length - 1].sno + 1 : 1
      const x = [...updatedTableData, { ...formvalues, sno }]
      setDetailTable(x)
      addnewform.resetFields()
    } else {
      messageReturn(405)
    }
  }

  const insertColumns = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'sno',
      width: '3%',
      render: () => '',
      // render: () => tableData.length > 0 ? tableData[tableData.length - 1].sno + 1 : 1,
    },
    {
      title: (
        <span>
          {' '}
          Part Number<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="productCode" initialValue={record.partNumber}>
          <AutoComplete
            options={productDetails}
            onChange={handleinsertChange}
            onSelect={(value, option) => handleinsertChange(value, option)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            <Input maxLength={1023} placeholder="Select here" onKeyPress={handleKeyPress} />
          </AutoComplete>
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Description <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'desc',
      dataIndex: 'description',
      width: '8%',
      render: () => (
        <Form.Item name="description">
          {/* <Tooltip position="top" title="inputText"> */}
          <Input maxLength={2155} onKeyPress={handleKeyPress} />
          {/* </Tooltip> */}
        </Form.Item>
      ),
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
      width: '8%',
      render: (text, record) => {
        return (
          <Form.Item name="specification" initialValue={record.specification}>
            {/* <Tooltip position="top" title="inputText"> */}
            <Input maxLength={2000} onKeyPress={handleKeyPress} />
            {/* </Tooltip> */}
          </Form.Item>
        )
      },
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="weight" initialValue={record.weight}>
          <Input
            type="text"
            min="0"
            maxLength={9}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="material" initialValue={record.material}>
          <Input maxLength={2055} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="make" initialValue={record.make}>
          <Input maxLength={255} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Quantity <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'qty',
      dataIndex: 'qty',
      width: '8%',
      render: () => (
        // <Form.Item name="qty" initialValue={record.qty}>
        //   <Input />
        // </Form.Item>

        <Form.Item name="qty">
          <Input
            type="text"
            min="0"
            maxLength={11}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
            onChange={e => {
              if (e.target.value === Number) {
                addnewform.setFieldsValue({
                  quantity: '',
                })
              }
              handleKeyPress()
            }}
            onPaste={handlePaste}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Unit <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'uomDesc',
      dataIndex: 'uomDesc',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="uomDesc" initialValue={record.uomDesc}>
          <Input maxLength={7} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: <span> Remarks</span>,
      key: 'remarks',
      dataIndex: 'remarks',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="remarks" initialValue={record.remarks}>
          <Input maxLength={250} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      width: '6%',
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* <Popover
            title="Add Remarks"
            content={
              <Form form={addnewform}>
                <Form.Item name="remarks">
                  <Input.TextArea placeholder="Enter remarks" onKeyPress={handleKeyPress} />
                </Form.Item>
              </Form>
            }
            trigger="click"
          > */}
          {/* <Button type="primary" icon={<MessageOutlined />} /> */}
          {/* </Popover> */}
          {docLifeList && docLifeList[0]?.isEditable === '1' && seqnum === '1' ? (
            <AddIcon onClick={() => handleAddRow()} />
          ) : (
            ''
          )}
        </div>
      ),
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

  const getProductcost = async record => {
    const reqdata = {
      productCode: record.productCode,
      tenantId: tenantid,
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
  const columns2 = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 50,
    },
    {
      title: <span> Part Number</span>,
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => {
        const isEditable =
          docLifeList && docLifeList[0]?.isEditable === '1' && seqnum === '1' && isFlag === 1
        return (
          <>
            {isEditable ? (
              <Form.Item name="productCode" initialValue={record.productCode}>
                <AutoComplete
                  options={productDetails}
                  onChange={value => handleInputChange(value, record.sno)}
                  onSelect={(value, option) => handleInputChange(value, option, record.sno)}
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  // onClick={() => {getProductDetails}}
                >
                  {/* <Input maxLength={1023} placeholder="Select here" onKeyPress={handleKeyPress} /> */}
                  {/* {docLifeList && docLifeList[0]?.isEditable === "1" && seqnum === "1" ? ( */}
                  <Tooltip title={record.productCode}>
                    <Form.Item name={`productCode_${record.sno}`} initialValue={record.productCode}>
                      <Input maxLength={1023} onKeyPress={handleKeyPress} />
                    </Form.Item>
                  </Tooltip>
                </AutoComplete>
              </Form.Item>
            ) : (
              <span>{text}</span>
            )}

            {/* {docLifeList && docLifeList[0]?.isEditable === "1" && seqnum === "1" ? (
          <Form.Item name={`productCode_${record.sno}`} initialValue={record.productCode}>
            <Input />
          </Form.Item>
        ) : (
          text
        )} */}
          </>
        )
      },
    },
    {
      title: (
        <span>
          {' '}
          Description<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'description',
      dataIndex: 'description',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`description_${record.sno}`} initialValue={record.description}>
            <Input maxLength={2155} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`specification_${record.sno}`} initialValue={record.specification}>
            <Input maxLength={5190} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      className: 'right-align-cell',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`weight_${record.sno}`} initialValue={record.weight}>
            <Input
              type="text"
              min="0"
              maxLength={9}
              pattern="[0-9]+([.][0-9]+)?"
              onKeyPress={e => {
                if (
                  (!/[0-9]/.test(e.key) &&
                    !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                  (e.target.value.length === 0 && e.key === '-')
                ) {
                  e.preventDefault()
                }
                handleKeyPress()
              }}
            />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`material_${record.sno}`} initialValue={record.material}>
            <Input maxLength={2055} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`make_${record.sno}`} initialValue={record.make}>
            <Input maxLength={255} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: (
        <span style={{ display: 'block', textAlign: 'right' }}>
          {' '}
          Quantity<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'qty',
      dataIndex: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`qty_${record.sno}`} initialValue={record.qty}>
            <Input maxLength={11} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: (
        <span>
          {' '}
          Unit<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'uomDesc',
      dataIndex: 'uomDesc',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`uomDesc_${record.sno}`} initialValue={record.uomDesc}>
            <Input maxLength={7} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: <span> Remarks</span>,
      key: 'remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
            <Input maxLength={250} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    // {
    //   title: `Allocated Budget ${Menulistdata[0].currency}`,
    //   key: 'totalVal',
    //   dataIndex: 'totalVal',
    //   className: 'hide-column',
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
      // align: 'center',
      width: 180,
      render: (text, record, index) => {
        const isEditable = docLifeList && docLifeList[0]?.isEditable === '1'
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {/* <div style={{ width: '32px' }}>
              <Popover
                title="Remarks"
                content={
                  <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
                    <Input.TextArea
                      disabled={!(isEditable && seqnum === '1')}
                      onKeyPress={handleKeyPress}
                    />
                  </Form.Item>
                }
                trigger="click"
              >
                <Button type="primary" icon={<MessageOutlined />} />
              </Popover>
            </div> */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {record && record.dmId !== 0 && record.dmId !== undefined ? (
                <DownloadDocuments
                  isPdf={record?.isPdf}
                  tenanrId={tenantid}
                  refid={record.dmId}
                  fileDocode=""
                  docTypeCode=""
                />
              ) : null}
              {record &&
              docLifeList &&
              docLifeList[0]?.isEditable === '1' &&
              record.dmId !== undefined ? (
                <div style={{ width: '32px' }}>
                  <Upload
                    // customRequest={customRequest}
                    showUploadList={false}
                    // onChange={info => uploadfile(info, record)}
                    beforeUpload={info => beforeUpload(info, record)}
                  >
                    <Button type="success" icon={<UploadOutlined />} />
                  </Upload>
                </div>
              ) : null}
            </div>
            {(singleIndent.createdUserId === employeeId && isEditable) || isEditable ? (
              // (approvebtn &&
              //   docLifeList &&
              //   docLifeList.length > 0 &&
              //   docLifeList[0].docStatus !== null) ||

              <div style={{ width: '32px' }}>
                <Popover
                  content={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ margin: '10px 10px' }}>Are you sure to delete?</span>
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          justifyContent: 'center',
                        }}
                      >
                        <Button text="No" />
                        <Button
                          text="Yes"
                          type="primary"
                          onClick={() => {
                            deleteIndent(record, index)
                            // setcancelPopoverVisible(false)
                            if (detailTable.length - 1 === 0) {
                              setDetailmodalVisible(false)
                            }
                          }}
                        />
                      </div>
                    </div>
                  }
                  // visible={cancelpopoverVisible === index}
                  // onVisibleChange={visible => setcancelPopoverVisible(visible ? index : null)}
                  trigger="click"
                >
                  {isFlag === 1 ? <Button type="danger" icon={<MinusOutlined />} /> : null}
                </Popover>
              </div>
            ) : null}
          </div>
        )
      },
    },
  ]

  const columns3 = [
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
      title: (
        <span>
          {' '}
          Description<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'description',
      dataIndex: 'description',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`description_${record.sno}`} initialValue={record.description}>
            <Input maxLength={2155} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`specification_${record.sno}`} initialValue={record.specification}>
            <Input maxLength={5190} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      className: 'right-align-cell',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`weight_${record.sno}`} initialValue={record.weight}>
            <Input
              type="text"
              min="0"
              maxLength={9}
              pattern="[0-9]+([.][0-9]+)?"
              onKeyPress={e => {
                if (
                  (!/[0-9]/.test(e.key) &&
                    !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                  (e.target.value.length === 0 && e.key === '-')
                ) {
                  e.preventDefault()
                }
                handleKeyPress()
              }}
            />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`material_${record.sno}`} initialValue={record.material}>
            <Input maxLength={2055} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`make_${record.sno}`} initialValue={record.make}>
            <Input maxLength={255} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: (
        <span style={{ display: 'block', textAlign: 'right' }}>
          {' '}
          Quantity<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'qty',
      dataIndex: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`qty_${record.sno}`} initialValue={record.qty}>
            <Input maxLength={11} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: (
        <span>
          {' '}
          Unit<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'uomDesc',
      dataIndex: 'uomDesc',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`uomDesc_${record.sno}`} initialValue={record.uomDesc}>
            <Input maxLength={7} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: <span> Remarks</span>,
      key: 'remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        return docLifeList &&
          docLifeList[0]?.isEditable === '1' &&
          seqnum === '1' &&
          isFlag === 1 ? (
          <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
            <Input maxLength={250} onKeyPress={handleKeyPress} />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    // {
    //   title: `Allocated Budget ${Menulistdata[0].currency}`,
    //   key: 'totalVal',
    //   dataIndex: 'totalVal',
    //   className: 'hide-column',
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
      // align: 'center',
      width: 180,
      render: (text, record, index) => {
        const isEditable = docLifeList && docLifeList[0]?.isEditable === '1'
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {/* <div style={{ width: '32px' }}>
              <Popover
                title="Remarks"
                content={
                  <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
                    <Input.TextArea
                      disabled={!(isEditable && seqnum === '1')}
                      onKeyPress={handleKeyPress}
                    />
                  </Form.Item>
                }
                trigger="click"
              >
                <Button type="primary" icon={<MessageOutlined />} />
              </Popover>
            </div> */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {record && record.dmId !== 0 && record.dmId !== undefined ? (
                <DownloadDocuments
                  isPdf={record?.isPdf}
                  tenanrId={tenantid}
                  refid={record.dmId}
                  fileDocode=""
                  docTypeCode=""
                />
              ) : null}
              {record &&
              docLifeList &&
              docLifeList[0]?.isEditable === '1' &&
              record.dmId !== undefined ? (
                <div style={{ width: '32px' }}>
                  <Upload
                    // customRequest={customRequest}
                    showUploadList={false}
                    // onChange={info => uploadfile(info, record)}
                    beforeUpload={info => beforeUpload(info, record)}
                  >
                    <Button type="success" icon={<UploadOutlined />} />
                  </Upload>
                </div>
              ) : null}
            </div>
            {(singleIndent.createdUserId === employeeId && isEditable) || isEditable ? (
              // (approvebtn &&
              //   docLifeList &&
              //   docLifeList.length > 0 &&
              //   docLifeList[0].docStatus !== null) ||

              <div style={{ width: '32px' }}>
                <Popover
                  content={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ margin: '10px 10px' }}>Are you sure to delete?</span>
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          justifyContent: 'center',
                        }}
                      >
                        <Button text="No" />
                        <Button
                          text="Yes"
                          type="primary"
                          onClick={() => {
                            deleteIndent(record, index)
                            // setcancelPopoverVisible(false)
                            if (detailTable.length - 1 === 0) {
                              setDetailmodalVisible(false)
                            }
                          }}
                        />
                      </div>
                    </div>
                  }
                  // visible={cancelpopoverVisible === index}
                  // onVisibleChange={visible => setcancelPopoverVisible(visible ? index : null)}
                  trigger="click"
                >
                  {isFlag === 1 ? <Button type="danger" icon={<MinusOutlined />} /> : null}
                </Popover>
              </div>
            ) : null}
          </div>
        )
      },
    },
  ]

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

  const handleAllocatedValueChange = () => {
    const formvalues = dueDateForm.getFieldsValue()
    const parsedBudgetValue = parseFloat(formvalues.allocatedValue.replace(/,/g, ''))
    const parsedAvailableValue = parseFloat(formvalues.availableValue.replace(/,/g, ''))
    const sumvalue = parsedAvailableValue + parsedBudgetValue

    if (
      formvalues.budgetvalue !== '' &&
      formvalues.budgetvalue !== undefined &&
      formvalues.budgetvalue !== null
    ) {
      // if (parseFloat(formvalues.budgetvalue) === 0 && parseFloat(formvalues.availableValue) !== 0) {
      //   alert('Available cost should be used for budget cost by allocating values alert 2')
      //   dueDateForm.setFieldsValue({ budgetvalue: '' })
      //   return
      // }

      if (sumvalue >= parseFloat(formvalues.budgetvalue.replace(/,/g, ''))) {
        const budgetvalue2 = formvalues.budgetvalue.toLocaleString('en-IN')
        const inputValue = budgetvalue2.replace(/[^\d.]/g, '')
        const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
        const formattedValue = parsedValue.toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        dueDateForm.setFieldsValue({
          budgetvalue: formattedValue,
        })
      } else {
        messageReturn(613)
        dueDateForm.setFieldsValue({ budgetvalue: '' })
      }
    }

    if (
      formvalues.targetValue !== '' &&
      formvalues.targetValue !== undefined &&
      formvalues.targetValue !== null
    ) {
      const targetValueCleaned = formvalues.targetValue.replace(/,/g, '')
      const availableValueCleaned = formvalues.availableValue.replace(/,/g, '')

      if (parseFloat(targetValueCleaned) === 0 && parseFloat(availableValueCleaned) !== 0) {
        messageReturn(684)
        dueDateForm.setFieldsValue({ targetValue: '' })
        return
      }
      if (parsedBudgetValue >= parseFloat(formvalues.targetValue.replace(/,/g, ''))) {
        const targetvalue2 = formvalues.targetValue.toLocaleString('en-IN')
        const inputValue = targetvalue2.replace(/[^\d.]/g, '')
        const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
        const formattedValue2 = parsedValue.toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        dueDateForm.setFieldsValue({
          targetValue: formattedValue2,
        })
      } else {
        messageReturn(614)
        dueDateForm.setFieldsValue({ targetValue: '' })
      }
    }
  }

  const SaveDueDate = async type => {
    dueDateForm
      .validateFields()
      .then(async () => {
        const budgetValue = dueDateForm.getFieldValue('budgetvalue')
        const targetValue = dueDateForm.getFieldValue('targetValue')
        const dueDate = dueDateForm.getFieldValue('dueDate')

        // Check for required fields
        if (budgetValue && dueDate && (type === 2 || (type === 1 && targetValue))) {
          const reqobj = {
            tenantId: tenantid,
            indentId: indentID,
            budgetValue: budgetValue.replace(/,/g, '') || '',
            targetValue: targetValue ? targetValue.replace(/,/g, '') : undefined,
            date: moment(dueDate).format('YYYY-MM-DD') || '',
          }

          const response = await indentFileUpload({
            requestPath: 'updateBudgetDtl',
            requestData: reqobj,
          })

          if (response) {
            getDetails(singleIndent.indentId)
            getIndentlist()
          }
        } else {
          messageReturn(405) // Missing required fields
        }
      })
      .catch(() => {
        messageReturn(405) // Validation error
      })
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

  const removeCommas = value => {
    const val = value.toString()
    if (!val) {
      return '0'
    }
    const valuse = val.replace(/,/g, '')
    return valuse
  }

  const handleAllocateChange = (rec, e) => {
    if (e !== '') {
      if (parseFloat(rec.requiredQty) + parseFloat(rec.balanceQty) >= parseFloat(e)) {
        requiredQryForm.setFieldsValue({ [`requiredQty_${rec.sno}`]: e })

        const allocatedQty = parseFloat(rec.allocatedQty) || 0
        const allocatedValue = parseFloat(rec.allocatedValue) || 0

        if (allocatedQty > 0) {
          const val = allocatedValue / allocatedQty
          requiredValForm.setFieldsValue({
            [`requiredValue_${rec.sno}`]: (e * val).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          })
        } else {
          requiredValForm.setFieldsValue({
            [`requiredValue_${rec.sno}`]: 0,
          })
        }
      } else {
        requiredQryForm.setFieldsValue({
          [`requiredQty_${rec.sno}`]: rec.requiredQty,
        })
        requiredValForm.setFieldsValue({
          [`requiredValue_${rec.sno}`]: (
            parseFloat(rec.requiredQty) * parseFloat(rec.unitPrice)
          ).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        })
        messageReturn(615)
      }
    } else {
      requiredValForm.setFieldsValue({
        [`requiredValue_${rec.sno}`]: 0,
      })
    }
  }

  const handleUnAllocate = () => {
    if (budgetIcondata.length > 0) {
      const updatedValues = budgetIcondata.map(rec => {
        const fieldName = `requiredQty_${rec.sno}`
        return { [fieldName]: 0 }
      })
      const updatedValue = budgetIcondata.map(rec => {
        const fieldName = `requiredValue_${rec.sno}`
        return { [fieldName]: 0 }
      })
      requiredQryForm.setFieldsValue(Object.assign({}, ...updatedValues))
      requiredValForm.setFieldsValue(Object.assign({}, ...updatedValue))
    } else {
      messageReturn(616)
    }
  }
  const handleAllocate = () => {
    if (budgetIcondata.length > 0) {
      const updatedValues = budgetIcondata.map(rec => {
        const fieldName = `requiredQty_${rec.sno}`
        return { [fieldName]: parseFloat(rec.balanceQty).toFixed(2) }
      })
      const updatedValue = budgetIcondata.map(rec => {
        const eVallue = Number(rec.requiredQty) + Number(rec.balanceQty)
        const val =
          parseFloat(rec.allocatedValue).toFixed(2) / parseFloat(rec.allocatedQty).toFixed(2) || 0
        const fieldName = `requiredValue_${rec.sno}`
        return {
          [fieldName]: Number(eVallue * val),
        }
      })
      requiredQryForm.setFieldsValue(Object.assign({}, ...updatedValues))
      requiredValForm.setFieldsValue(Object.assign({}, ...updatedValue))
    } else {
      messageReturn(616)
    }
  }
  const handleSave = async () => {
    setBudgetLoading(true)
    const formvalues = requiredQryForm.getFieldValue()
    const formvalues1 = requiredValForm.getFieldValue()
    const updatedTableData = budgetIcondata.map(item => {
      return {
        ...item,
        requiredQty: formvalues[`requiredQty_${item.sno}`],
        indentBudId: '',
        indentId: indentID,
        requiredValue: removeCommas(formvalues1[`requiredValue_${item.sno}`]),
        tenantId: tenantid,
      }
    })
    // const filteredTableData = updatedTableData.filter(
    //   item =>
    //     item.budgetQty !== 0 &&
    //     item.budgetQty !== '0.00' &&
    //     item.budgetQty !== undefined &&
    //     item.budgetQty !== '',
    // )

    const newData = updatedTableData.map(item => {
      if (item.requiredQty === '') {
        return { ...item, requiredQty: '0' }
      }
      return item
    })

    let totalRequiredValue = 0

    newData.forEach(item => {
      if (item.requiredValue !== undefined) {
        totalRequiredValue += parseInt(item.requiredValue, 10)
      }
    })
    dueDateForm.setFieldsValue({
      [`budgetvalue`]: parseFloat(totalRequiredValue).toLocaleString('en-IN'),
    })

    if (updatedTableData.length > 0) {
      const response = await indentFileUpload({
        requestPath: 'updateIndentBudgetDtl',
        requestData: newData,
      })
      if (response) {
        if (response.responseCode === '200') {
          message.success(response.responseDataMessage)
          getBudgetcost(indentID)
          setIsOpen(false)
          requiredValForm.resetFields()
          requiredQryForm.resetFields()
          SaveDueDate(2)
        } else {
          message.error(response.responseDataMessage)
        }
      } else {
        messageReturn(617)
      }
    }
    setBudgetLoading(false)
  }
  // const handleClose = () => {
  //   setIsOpen(false)
  // }
  const Content = () => {
    const [tableData, setTableData] = useState(budgetIcondata)
    const [filtersInfo, setFiltersInfo] = useState({})
    const elementDtl1 = []
    const elementHdr1 = []
    const unitPrice1 = []
    const allocatedQty1 = []
    const allocatedValue1 = []
    const balanceQty1 = []
    const balanceValue1 = []
    const elementSpec1 = []
    const elementMake1 = []
    const requiredQty1 = []
    const requiredvalue1 = []

    if (tableData) {
      tableData.map(h => {
        return elementDtl1.push(h.elementDtl)
      })
      tableData.map(h => {
        return unitPrice1.push(h.unitPrice)
      })
      tableData.map(h => {
        return allocatedQty1.push(h.allocatedQty)
      })
      tableData.map(h => {
        return allocatedValue1.push(h.allocatedValue)
      })
      tableData.map(h => {
        return requiredQty1.push(h.requiredQty)
      })
      tableData.map(h => {
        return requiredvalue1.push(h.requiredValue)
      })
      tableData.map(h => {
        return balanceQty1.push(h.balanceQty)
      })
      tableData.map(h => {
        return balanceValue1.push(h.balanceValue)
      })
      tableData.map(h => {
        return elementHdr1.push(h.elementHdr)
      })
      tableData.map(h => {
        return elementSpec1.push(h.elementSpec)
      })
      tableData.map(h => {
        return elementMake1.push(h.elementMake)
      })
    }
    const elementDtl2 = elementDtl1.filter(distinct)
    const unitPrice2 = unitPrice1.filter(distinct)
    const allocatedQty2 = allocatedQty1.filter(distinct)
    const allocatedValue2 = allocatedValue1.filter(distinct)
    const balanceQty2 = balanceQty1.filter(distinct)
    const balanceValue2 = balanceValue1.filter(distinct)
    const elementHdr2 = elementHdr1.filter(distinct)
    const elementSpec2 = elementSpec1.filter(distinct)
    const elementMake2 = elementMake1.filter(distinct)
    const requiredQty2 = requiredQty1.filter(distinct)
    const requiredvalue2 = requiredvalue1.filter(distinct)

    const elementDtl3 = []
    const unitPrice3 = []
    const allocatedQty3 = []
    const allocatedValue3 = []
    const balanceQty3 = []
    const balanceValue3 = []
    const elementHdr3 = []
    const elementSpec3 = []
    const elementMake3 = []
    const requiredQty3 = []
    const requiredvalue3 = []

    elementDtl2.map(element => {
      return elementDtl3.push({
        text: element,
        value: element,
      })
    })

    elementHdr2.map(element => {
      return elementHdr3.push({
        text: element,
        value: element,
      })
    })

    unitPrice2.map(element => {
      return unitPrice3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    allocatedQty2.map(element => {
      return allocatedQty3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    allocatedValue2.map(element => {
      return allocatedValue3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    balanceQty2.map(element => {
      return balanceQty3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    balanceValue2.map(element => {
      return balanceValue3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    elementSpec2.map(element => {
      return elementSpec3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    elementMake2.map(element => {
      return elementMake3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    requiredQty2.map(element => {
      return requiredQty3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })
    requiredvalue2.map(element => {
      return requiredvalue3.push({
        text: parseFloat(element || 0).toLocaleString('en-IN'),
        value: element,
      })
    })

    const [tempQty, setTempQty] = useState({})

    const ContentCol = [
      {
        title: 'S.No',
        dataIndex: 'sno',
        key: 'sno',
        width: '6%',
        // render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Element',
        dataIndex: 'elementHdr',
        key: 'elementHdr',
        filters: elementHdr3,
        filteredValue: filtersInfo.elementHdr,
        onFilter: (value, record) => record?.elementHdr === value,
      },
      {
        title: 'Element Desc',
        dataIndex: 'elementDtl',
        key: 'elementDtl',
        filters: elementDtl3,
        filteredValue: filtersInfo.elementDtl,
        onFilter: (value, record) => record?.elementDtl === value,
      },
      {
        title: 'Specification',
        dataIndex: 'elementSpec',
        key: 'elementSpec',
        width: '135px',
        filters: elementSpec3,
        filteredValue: filtersInfo.elementSpec,
        onFilter: (value, record) => record?.elementSpec === value,
      },
      {
        title: 'Make',
        dataIndex: 'elementMake',
        key: 'elementMake',
        filters: elementMake3,
        filteredValue: filtersInfo.elementMake,
        onFilter: (value, record) => record?.elementMake === value,
      },
      {
        title: `Unit Price ${Menulistdata[0].currency}`,
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        align: 'right',
        filters: unitPrice3,
        filteredValue: filtersInfo.unitPrice,
        onFilter: (value, record) => record?.unitPrice === value,
        render: text => (
          <div style={{ textAlign: 'right' }}>{parseFloat(text).toLocaleString('en-IN')}</div>
        ),
      },
      {
        title: 'Allocated Qty.',
        dataIndex: 'allocatedQty',
        key: 'allocatedQty',
        align: 'right',
        filters: allocatedQty3,
        filteredValue: filtersInfo.allocatedQty,
        onFilter: (value, record) => record?.allocatedQty === value,
        render: text => <div style={{ textAlign: 'right' }}>{Number(text).toFixed(2)}</div>,
      },
      {
        title: `Allocated ${Menulistdata[0].currency}`,
        dataIndex: 'allocatedValue',
        key: 'allocatedValue',
        align: 'right',
        filters: allocatedValue3,
        filteredValue: filtersInfo.allocatedValue,
        onFilter: (value, record) => record?.allocatedValue === value,
        render: text => (
          <div style={{ textAlign: 'right' }}>{parseFloat(text).toLocaleString('en-IN')}</div>
        ),
      },
      {
        title: 'Balance Qty.',
        dataIndex: 'balanceQty',
        key: 'balanceQty',
        align: 'right',
        filters: balanceQty3,
        filteredValue: filtersInfo.balanceQty,
        onFilter: (value, record) => record?.balanceQty === value,
        render: text => <div style={{ textAlign: 'right' }}>{Number(text).toFixed(2)}</div>,
      },
      {
        title: `Balance ${Menulistdata[0].currency}`,
        dataIndex: 'balanceValue',
        key: 'balanceValue',
        align: 'right',
        filters: balanceValue3,
        filteredValue: filtersInfo.balanceValue,
        onFilter: (value, record) => record?.balanceValue === value,
        render: text => (
          <div style={{ textAlign: 'right' }}>
            {parseFloat(text).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        title: `Required ${Menulistdata[0].currency}`,
        dataIndex: 'requiredValue',
        key: 'requiredValue',
        align: 'right',
        width: '120px',
        filters: requiredvalue3,
        filteredValue: filtersInfo.requiredValue,
        onFilter: (value, record) => record?.requiredValue === value,
        render: (text, record) => (
          <Form form={requiredValForm}>
            <Form.Item
              name={`requiredValue_${record.sno}`}
              initialValue={parseFloat(record.requiredValue).toFixed(2)}
            >
              <Input
                style={{ textAlign: 'right' }}
                type="text"
                disabled
                defaultValue={parseFloat(text)
                  .toFixed(2)
                  .toLocaleString('en-IN')}
              />
            </Form.Item>
          </Form>
        ),
      },
      {
        title: 'Required Qty.',
        dataIndex: 'requiredQty',
        key: 'requiredQty',
        render: (text, record, index) => {
          const fieldName = `requiredQty_${record.sno}`
          const value =
            tempQty[record.sno] ?? (text !== undefined && text !== null ? String(text) : '')

          return (
            <Input
              value={value}
              onChange={e => {
                const v = e.target.value

                // allow empty
                if (v === '') {
                  setTempQty(prev => ({ ...prev, [record.sno]: '' }))
                  return
                }

                // allow up to 2 decimals
                if (/^\d*\.?\d{0,2}$/.test(v)) {
                  // check numeric value only if it's a complete number (not ending with '.')
                  if (!v.endsWith('.') && !isNaN(v)) {
                    const numericValue = parseFloat(v)
                    const balanceQty = parseFloat(record.balanceQty || 0)

                    if (numericValue > balanceQty) {
                      messageReturn(687)
                      setTempQty(prev => ({ ...prev, [record.sno]: '' }))
                      return
                    }

                    handleAllocateChange(record, numericValue, index)
                  }

                  // update temp value to allow typing
                  setTempQty(prev => ({ ...prev, [record.sno]: v }))
                }
              }}
              onBlur={() => {
                const v = tempQty[record.sno]
                if (v && !isNaN(v)) {
                  const formatted = parseFloat(v).toFixed(2)
                  setTempQty(prev => ({ ...prev, [record.sno]: formatted }))
                  handleAllocateChange(record, parseFloat(formatted), index)
                }
              }}
            />
          )
        },
      },
    ]
    const handleChange2 = (pagination, filters) => {
      setFiltersInfo(filters)
    }
    const handleSearch = e => {
      const filtered = budgetIcondata.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(e.target.value.toLowerCase()),
        ),
      )
      setTableData(filtered)
    }
    return (
      <div>
        {/* <CloseOutlined
          onClick={handleClose}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, cursor: 'pointer' }}
        /> */}
        <Skeleton loading={budgetLoading} active style={{ width: '100%' }}>
          <Form form={toolTipData} layout="vertical" labelAlign="left">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginLeft: '10px', display: 'flex', gap: '20px' }}>
                  <Button
                    type="primary"
                    text="Allocate All"
                    disable={!(docLifeList && docLifeList.length > 0)}
                    onClick={handleAllocate}
                  />
                  <Button
                    type="primary"
                    text="Unallocate All"
                    disable={!(docLifeList && docLifeList.length > 0)}
                    onClick={handleUnAllocate}
                  />
                </div>
                <div>
                  <Input.Search
                    style={{
                      margin: '0 0 10px 0',
                      width: isMobile ? '100%' : '100%',
                      float: 'right',
                    }}
                    placeholder="Search here..."
                    enterButton
                    onChange={e => handleSearch(e)}
                  />
                </div>
              </div>
              <Table
                columns={ContentCol}
                dataSource={tableData}
                scroll={{ y: 300 }}
                pagination={false}
                onChange={handleChange2}
              />
              {/* </div> */}
            </div>
          </Form>
        </Skeleton>
        <div style={{ textAlign: 'center' }}>
          <Button
            text="Save"
            onClick={handleSave}
            disable={budgetLoading || !(docLifeList && docLifeList.length > 0)}
            type="primary"
          />
        </div>
      </div>
    )
  }
  const BudgetFieldsComponent = () => {
    return (
      <div>
        <div className="mt-1 custom_antd_Table">
          <Table columns={columns4} dataSource={budgetTable} bordered />
        </div>
      </div>
    )
  }
  const handlePopup = () => {
    getBudgetcost(indentid)
    setIsOpen(true)
  }
  const handleClear = () => {
    if (false) {
      setIsOpen(false)
    }
  }
  const handleCancelBudget = () => {
    setIsOpen(false)
    requiredValForm.resetFields()
    requiredQryForm.resetFields()
  }
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

  const handleExport = () => {
    const cleanedData = cleanupDataSource(detailTable)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Indent_Details_${detailId}-${currentDateTime}.csv`)
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

      return {
        'S.No': escapeValue(row.sno), // Manually map and escape 'S.No' to row.sno
        'Part Number': escapeValue(row.productCode), // Manually map and escape 'Part Number'
        Description: escapeValue(row.description), // Manually map and escape 'Description'
        Specification: escapeValue(row.specification), // Manually map and escape 'Specification'
        'Mass (Kgs)': escapeValue(row.weight), // Manually map and escape 'Mass (Kgs)'
        Material: escapeValue(row.material), // Manually map and escape 'Material'
        Make: escapeValue(row.make), // Manually map and escape 'Make'
        Quantity: escapeValue(row.qty), // Manually map and escape 'Quantity'
        Unit: escapeValue(row.uomDesc), // Manually map and escape 'Unit'
        Remarks: escapeValue(row.remarks), // Manually map and escape 'Remarks'
      }
    })
  }

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
            tenantId: tenantid,
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
        <Form form={dueDateForm}>
          <div>
            <div className="mt-1 custom_antd_Table">
              <div className="row">
                {/* <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                  <p className='tob_label'>Indent Type :</p>
                  <p>{singleIndent?.sbcDesc}</p>
                </div> */}
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                  {docLifeList &&
                  docLifeList[0]?.isEditable === '1' &&
                  seqnum === '1' &&
                  isFlag === 1 ? (
                    <Form.Item
                      name="KeyArea"
                      label={
                        <span className="tob_label">
                          Station No.
                          <span style={{ color: 'red' }}>*</span>{' '}
                        </span>
                      }
                    >
                      <Select placeholder={singleIndent?.keyAreaDesc} onChange={getKeusubareas}>
                        {dataKeyArea?.map(item => (
                          <Option value={item.pkaId}>
                            <Tooltip key={item.pkaId} title={`${item.keyName} (${item.code})`}>
                              {item.keyName} ({item.code})
                            </Tooltip>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="keysubarea"
                      label={<span className="tob_label">Station No. </span>}
                    >
                      <p style={{ marginBottom: '-2px' }}>{singleIndent?.keyAreaDesc}</p>
                    </Form.Item>
                  )}
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                  {docLifeList &&
                  docLifeList[0]?.isEditable === '1' &&
                  seqnum === '1' &&
                  isFlag === 1 ? (
                    <Form.Item
                      name="keysubarea"
                      label={
                        <span className="tob_label">
                          Sub Assy.<span style={{ color: 'red' }}>*</span>{' '}
                        </span>
                      }
                    >
                      <Select placeholder={singleIndent?.subKeyAreaDesc}>
                        {dataKeySubArea?.map(item => (
                          <Option key={item.pkaId} value={item.pkaId}>
                            <Tooltip key={item.pkaId} title={`${item.keyName} (${item.code})`}>
                              {item.keyName} ({item.code})
                            </Tooltip>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="keysubarea"
                      label={<span className="tob_label">Sub Assy. </span>}
                    >
                      <p style={{ marginBottom: '-2px' }}>{singleIndent?.subKeyAreaDesc}</p>
                    </Form.Item>
                  )}
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                  <p className="tob_label">Created On :</p>
                  <p>
                    {singleIndent.createdOn
                      ? moment(singleIndent.createdOn).format('DD-MMM-YYYY')
                      : ''}
                  </p>
                </div>
                {componentdata.module === 'project' ||
                (componentdata.module === 'common' &&
                  depCode === 'D10' &&
                  docLifeList &&
                  docLifeList.length > 0) ? (
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                    <p className="tob_label">
                      Due Date<span style={{ color: 'red' }}>*</span> :
                    </p>
                    <Form.Item name="dueDate" style={{ color: 'black' }}>
                      <DatePicker
                        disabledDate={d => {
                          if (dueDateval && planStartDate) {
                            return (
                              !d ||
                              d.isBefore(moment(planStartDate)) ||
                              d.isAfter(moment(dueDateval))
                            )
                          }
                          return false
                        }}
                      />
                    </Form.Item>
                  </div>
                ) : null}
                {componentdata.module === 'project' ||
                (componentdata.module === 'common' && depCode === 'D10') ? (
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                    <p className="tob_label">Available Budget {Menulistdata[0].currency} :</p>
                    <Form.Item name="availableValue" style={{ color: 'black' }}>
                      <Input type="text" disabled />
                    </Form.Item>
                  </div>
                ) : null}
                {componentdata.module === 'project' ||
                (componentdata.module === 'common' && depCode === 'D10') ? (
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                    <p className="tob_label">
                      Allocated Budget {Menulistdata[0].currency}
                      <span style={{ color: 'red' }}>*</span> :
                    </p>
                    <Form.Item name="allocatedValue" style={{ color: 'black' }}>
                      <Input type="text" disabled />
                    </Form.Item>
                  </div>
                ) : null}
                {componentdata.module === 'project' ||
                (componentdata.module === 'common' && depCode === 'D10') ? (
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                    <p className="tob_label">
                      Budget Cost {Menulistdata[0].currency}
                      <span style={{ color: 'red' }}>*</span> :
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Item
                        name="budgetvalue"
                        style={{
                          color: 'black',
                          width: '150px',
                          marginRight: '10px',
                        }}
                      >
                        <Input type="text" onChange={handleAllocatedValueChange} disabled />
                      </Form.Item>
                      {/* <Popover
                        title="Allocate Budget"
                        content={Content}
                        trigger="click"
                        placement="bottom"
                        visible={isOpen}
                        overlayStyle={{ width: '80vw' }}
                      > */}
                      <Button type="primary" onClick={handlePopup} icon={<InfoCircleOutlined />} />
                      {/* </Popover> */}
                    </div>
                  </div>
                ) : null}
                {componentdata.module === 'project' ||
                (componentdata.module === 'common' && depCode === 'D10') ? (
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tob_details">
                    <p className="tob_label">
                      Target Cost {Menulistdata[0].currency}
                      <span style={{ color: 'red' }}>*</span> :
                    </p>
                    <Form.Item name="targetValue" style={{ color: 'black' }}>
                      <Input
                        type="text"
                        onChange={handleAllocatedValueChange}
                        disabled={isInternal == 1 && componentdata.module === 'project'}
                      />
                    </Form.Item>
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
              <Form form={indentDetailForm} style={{ width: '100%' }}>
                <div>
                  <Skeleton loading={loading} active style={{ width: '100%' }}>
                    {componentdata.module === 'project' ||
                    (componentdata.module === 'common' && depCode === 'D10') ? (
                      <Table
                        columns={columns3}
                        dataSource={detailTable}
                        scroll={{ y: 500 }}
                        style={{ width: '100%' }}
                        bordered
                        exportableProps={{
                          fileName: `Indent_Details_${detailId}-${currentDateTime}`,
                          btnProps: {
                            type: 'primary',
                            icon: <FileExcelOutlined />,
                            children: <span>Export to CSV</span>,
                            onClick: handleExport,
                          },
                        }}
                        pagination={
                          !(docLifeList && docLifeList[0]?.isEditable === '1' && seqnum === '1')
                        }
                      />
                    ) : (
                      <Table
                        columns={columns2}
                        dataSource={detailTable}
                        scroll={{ y: 500 }}
                        style={{ width: '100%' }}
                        bordered
                        exportableProps={{
                          fileName: `Indent_Details_${detailId}-${currentDateTime}`,
                          btnProps: {
                            type: 'primary',
                            icon: <FileExcelOutlined />,
                            children: <span>Export to CSV</span>,
                            onClick: handleExport,
                          },
                        }}
                        pagination={
                          !(docLifeList && docLifeList[0]?.isEditable === '1' && seqnum === '1')
                        }
                      />
                    )}

                    {docLifeList &&
                    docLifeList[0]?.isEditable === '1' &&
                    seqnum === '1' &&
                    isFlag === 1 ? (
                      <Form
                        form={addnewform}
                        onFinish={onFinish}
                        initialValues={{ dtlList: detailTable }}
                      >
                        <Table
                          columns={insertColumns}
                          dataSource={insertdata}
                          pagination={false}
                          showHeader={!(detailTable.length > 0)}
                          style={{ marginTop: '-1px' }}
                          bordered
                        />
                      </Form>
                    ) : null}
                  </Skeleton>
                </div>
              </Form>
            </div>
          </div>
        </Form>
        <ModalPopup
          FieldsComponent={Content}
          isModalVisible={isOpen}
          text="Allocate Budget"
          // handleCancel={handleCancelBudget}
          onCancel={handleCancelBudget}
          width={1350}
        />
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
              {docLifeList && docLifeList.length > 0 && docLifeList[0].docStatus !== null && (
                <Button
                  text={docLifeList[0].docStatusDesc}
                  type="primary"
                  onClick={approveIndent}
                />
              )}
              <Popuptable
                onClose={() => {
                  setApproveremarksCard(false)
                  isSubmitting(true)
                }}
                cardLabel=""
                component={AddRemarksComponent}
                visible={approveRemarksCard}
              />
              <span style={{ margin: '0 3px' }} />
              <Popuptable
                onClose={() => {
                  setRejectRemarksCard(false)
                  isSubmitting(true)
                }}
                cardLabel=""
                component={AddRemarksComponent}
                visible={rejectRemarksCard}
              />
              {docLifeList && docLifeList.length > 0 && docLifeList[0].cancelSeq !== null && (
                <Button
                  type="danger"
                  // text={docLifeList[0].cancelStatusDesc}
                  text={docLifeList[0]?.previousSeq === '1' ? 'Hold' : 'Previous Stage'}
                  onClick={cancelIndent}
                />
              )}
              <span style={{ margin: '0 3px' }} />
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button type="primary" text="Cancel" onClick={() => handleDetailCancel(indentID)} />
            <Popuptable
              onClose={() => setMsgDetailCard(false)}
              cardLabel=""
              component={
                <Table
                  style={{ width: isMobile ? '280px' : 'auto' }}
                  dataSource={msgDetailslist}
                  columns={msgdetailcolumn}
                />
              }
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
          {docLifeList && docLifeList[0]?.isEditable === '1' && seqnum === '1' ? (
            <Button type="primary" text="Save" disable={saveButton} onClick={UpdateindentDetails} />
          ) : null}
        </div>
      </div>
    )
  }
  const handleGetDetails = formData => {
    setCommonProjectId(formData.Projectcode)
    store.set('mstId', formData.masterId)
    // setAddIndent(true)
    setProjID(formData.Projectcode)
    getIndentlist(formData.Projectcode)
  }
  useEffect(() => {
    addIndentbtn()
  }, [commonProjectId])

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
  const getCriticalList = async () => {
    const reqdata = {
      masterId: store.get('ProjectID'),
      tenantId: tenantid,
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
    <div
      style={(isTab || isMobile) && componentdata.module === 'common' ? { width: tableWidth } : {}}
    >
      <div className="indent_header">
        <h5>
          {' '}
          {componentdata.module === 'common' ? 'Capex Indent Management' : 'Indent Management'}
        </h5>

        <div className="indent_header_btns">
          <div>
            {componentdata.module !== 'common' ? (
              <Button
                type="primary"
                text="View Critical Indent"
                onClick={() => {
                  setIsCriticalModal(true)
                  getCriticalList()
                }}
              />
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* {console.log(isInternal, 'is internal in ')}
            {console.log(componentdata, 'component data in ')}
            {console.log(addbtnsts, 'add buttons data in ')}
            {console.log(componentdata.module === 'common' && isInternal == 1,'componentdata.module === "common" && isInternal == 1')} */}

            {addbtnsts &&
            componentdata.createindent &&
            ((componentdata.module === 'common' && isInternal == 1) ||
              (componentdata.module !== 'common' && isInternal == 0)) ? (
              <Button
                text="Create Indent"
                type="primary"
                icon={<PlusOutlined style={{ color: 'white' }} />}
                onClick={showModal}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        {componentdata.module === 'common' ? (
          <CommonFields2 onGetDetails={handleGetDetails} onClear={handleClear} />
        ) : null}
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
          pageSizeOptions: ['10', '20', '30', '50', [indentTable?.length]],
          showSizeChanger: true,
          defaultPageSize: 10,
        }}
        scroll={{ y: 400 }}
        onChange={handleChange}
        bordered
      />
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
            text={`${singleIndent?.indentTypeDesc} - Indent Details -${detailId}  -${singleIndent?.sbcDesc}`}
            width={1400}
            onCancel={() => {
              handleDetailCancel(singleIndent.indentId)
            }}
          />
        ) : null}
        <BackButtonComponent componentToRender="design" />
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
      {isModalVisible ? (
        <Addindent
          submit={handleSubmit}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
          componentdata={componentdata}
          commonProjectId={commonProjectId}
        />
      ) : null}
    </div>
  )
}
export default IndentManagement
