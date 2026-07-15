import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Form,
  Input,
  DatePicker,
  message,
  Skeleton,
  Select,
  AutoComplete,
  Upload,
  Row,
  Col,
  InputNumber,
  Button,
  Popover,
  Space,
} from 'antd'
import moment from 'moment'
import store from 'store'
import { CommentOutlined, UploadOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import messageReturn from '_helpers/messageReturn'
import convertNumberToWords from '../../../../_helpers/convertToWords'
import PaymentTermsPopUp from '../PoPaymentTermsPopUp'
import {
  indentFileUpload,
  commongetmethod,
} from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../style.scss'
import '../../../style.scss'

const Poimport = ({ rowData, onClose, calldetailapi, isView }) => {
  const { Option } = Select
  const [projectList, setProjectList] = useState([])
  const [poform] = Form.useForm()
  const [debitForm] = Form.useForm()
  const [potabel, setPoTable] = useState([])
  const [paymentterms, setPaymentTerms] = useState([])
  const [paymentData, setPaymentData] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [grnData, setGrnData] = useState([])
  const [poCostType, setPoCostType] = useState([])
  const [indexVal, setIndexValue] = useState('')
  const [docStatus, setDocStatus] = useState([])
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [inputForm] = Form.useForm()
  const [detailCard, setdetailCard] = useState(false)
  const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [prevRemarksCard, setPrevRemarksCard] = useState(false)
  const [componentDisabled, setComponentDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dclist, setDcList] = useState([])
  const [addressList, setAddressList] = useState([])
  const [hsnCode, setHsnCode] = useState([])
  const [divisionList, setDivisionList] = useState([])
  const [dispatchlist, setDispatchlist] = useState([])
  const [insurancelist, setInsurancelist] = useState([])
  const [inspectionlist, setInspectionList] = useState([])
  const [mainEntity, setMainEntity] = useState({})
  const [prevEntity, setPrevEntity] = useState({})
  const [maindoclist, setMainDocList] = useState([])
  const [prevdoclist, setPrevDocList] = useState([])
  const [prevpoTable, setPrevPoTable] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [reasonList, setReasonList] = useState([])
  const [selectedReasonObj, setSelectedReasonObj] = useState(null)
  const [fileList, setFileList] = useState([])
  const [isDebitClicked, setIsDebitClicked] = useState(false)
  const [transportValue, setTransportValue] = useState('0.000')
  const [pfValue, setPfValue] = useState('0.000')
  const [insuranceValue, setInsuranceValue] = useState('0.000')
  const [otherValue, setOtherValue] = useState('0.000')
  // const [gstValue, setGstValue] = useState('')
  const [pendingGstValue, setPendingGstValue] = useState('0.000')
  const [selectedRows, setSelectedRows] = useState([])
  const HighlightStyle = { border: '2px solid blue', borderRadius: '3px', width: '100%' }
  const projectId = store.get('ProjectID')
  const Menulistdata = store.get('MenuListData')
  const enquiryId = store.get('EnquiryID')
  const referenceId = store.get('referenceId')
  const [apprvBtnEnabled, setApprvBtnEnabled] = useState(true)
  const emptyPaymentTerms = {
    term: '',
    percentage: '',
    remarks: '',
    potId: '',
    poId: '',
  }
  useEffect(() => {
    poform.resetFields()
    getPoDetails()
    getType()
    getInspectionList()
    getdivisionList()
    getDispatchlist()
    getInsuranceList()
  }, [rowData])
  useEffect(() => {
    console.log('po pfValue term', pfValue)
  }, [pfValue])

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  // const Menulistdata = store.get('MenuListData')
  const Tab = store.get('Tab')
  const newDate = moment().add(1, 'day')
  const getPoDetails = async () => {
    setIsLoading(true)
    poform.resetFields()
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByPoId',
      requestData: {
        tenantId,
        hdrId: rowData.poId,
        empId: employeeId,
      },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      setProjectList(response?.responseData || [])
      setMainEntity(response?.responseData[0])
      setPrevEntity(response?.responseData[1])
      setPrevDocList(response?.responseData[0]?.poDispatchDoc[0])
      setMainDocList(response?.responseData[1]?.poDispatchDoc[0])
      setPoTable(response?.responseData[0]?.poDtl || [])
      setPrevPoTable(response?.responseData[1]?.poDtl || [])
      setRmkDetaillist(response?.responseData[0]?.poStatusList)
      setReasonList(response?.responseData[0]?.debitNoteReasonList)
      setDocStatus(response?.responseData[0]?.docLifeCycleMstList)
      if (response?.responseData[0].isEditable === '1') {
        setComponentDisabled(false)
      } else {
        setComponentDisabled(true)
      }
      setPendingGstValue(
        parseFloat(response?.responseData[0]?.pendingGst ?? response?.responseData[0]?.gst),
      )
      setInsuranceValue(
        response?.responseData[0]?.pendingInsuranceChrg ??
          response?.responseData[0]?.insuranceValue,
      )
      setOtherValue(
        response?.responseData[0]?.pendingOtherChrg ?? response?.responseData[0]?.others,
      )
      setTransportValue(
        response?.responseData[0]?.pendingTransportChrg ??
          response?.responseData[0]?.transportCharges,
      )
      setPfValue(response?.responseData[0]?.pendingPfChrg ?? response?.responseData[0]?.pf)
      setPaymentTerms(response?.responseData[0]?.poPaymentTerm)
      poform.setFieldsValue({
        // Delivery Address Fields
        AddressType: response?.responseData[0]?.venCode,
        deliveryName: response?.responseData[0]?.deliveryName,
        deliveryAddressLine: response?.responseData[0]?.deliveryAddressLine,
        deliveryCity: response?.responseData[0]?.deliveryCity,
        deliveryPincode: response?.responseData[0]?.deliveryPincode,
        deliveryState: response?.responseData[0]?.deliveryState,
        deliveryCount: response?.responseData[0]?.deliveryCount,
        deliveryContactno: response?.responseData[0]?.deliveryContact,
        deliveryGst: response?.responseData[0]?.deliveryGst,

        // DISPATCH DOCUMENTS REQUIRED & NO. OF COPIES right side fields value setting
        Division: response?.responseData[0]?.divisionDesc,
        OrderNumber: response?.responseData[0]?.orderNo,
        Date: moment(response?.responseData[0]?.date, 'YYYY-MM-DD') || '',
        YourRefDate: moment(response?.responseData[0]?.refDate, 'YYYY-MM-DD') || '',
        refNo: response?.responseData[0]?.refNo || '',
        deliveryDate: response?.responseData[0]?.deliveryDate
          ? moment(response?.responseData[0]?.deliveryDate, 'YYYY-MM-DD')
          : '',
        PaymentTerms: 'Mentioned Below',
        LiquidatedDamages: response?.responseData[0]?.liqDamages,
        Guarantee: response?.responseData[0]?.guarantee,
        Warranty: response?.responseData[0]?.warrenty,
        ModeOfDispatch: response?.responseData[0]?.dispatchModeDesc,
        Insurance: response?.responseData[0]?.transitInsuranceDesc,
        Inspection: response?.responseData[0]?.inspectionScopeDesc,
        Miscellaneous: response?.responseData[0]?.misc,
        PortOfDestination: response?.responseData[0]?.portOfDest,

        // DISPATCH DOCUMENTS REQUIRED & NO. OF COPIES fields value setting
        invoice: response?.responseData[0]?.poDispatchDoc[0]?.invoiceNo,
        pkglist: response?.responseData[0]?.poDispatchDoc[0]?.pkgList,
        awbbl: response?.responseData[0]?.poDispatchDoc[0]?.awbBl,
        testreports: response?.responseData[0]?.poDispatchDoc[0]?.testReports,
        certificateoforigin: response?.responseData[0]?.poDispatchDoc[0]?.certificateOfOrigin,
        ommanual: response?.responseData[0]?.poDispatchDoc[0]?.oMManual,
        insuranceWarrenty: response?.responseData[0]?.poDispatchDoc[0]?.insuranceWarrentyCert,
        inspectionReport: response?.responseData[0]?.poDispatchDoc[0]?.inspectionReport,

        // Enclosure below fields
        // parseFloat(response?.responseData[0]?.avilablevalue).toLocaleString('en-IN') || '0',
        CTC: formatValue2(response?.responseData[0]?.ctc),
        TDC: formatValue2(response?.responseData[0]?.tdc),
        TDS: formatValue2(response?.responseData[0]?.tds),
        QAP: formatValue2(response?.responseData[0]?.qap),
        DWGS: response?.responseData[0]?.dwgs,
        POTC: response?.responseData[0]?.poTC,
        GTC: formatValue2(response?.responseData[0]?.gtc),
        subtotal: formatValue2(response?.responseData[0]?.basicTotal),
        subtotalFx:
          response?.responseData[0]?.basicTotalFx !== null &&
          response?.responseData[0]?.basicTotalFx !== '' &&
          response?.responseData[0]?.basicTotalFx !== '0.000'
            ? formatValue2(response?.responseData[0]?.basicTotalFx)
            : formatValue2(response?.responseData[0]?.basicTotal),
        lessdiscounts: formatValue2(response?.responseData[0]?.discount),
        documentcharges: formatValue2(response?.responseData[0]?.docCharges),
        inspectioncharges: formatValue2(response?.responseData[0]?.inspectionCharges),
        // pf: formatValue2(response?.responseData[0]?.pf),
        pf:
          response?.responseData[0]?.pffx !== null &&
          response?.responseData[0]?.pffx !== '' &&
          response?.responseData[0]?.pffx !== '0.000'
            ? formatValue2(response?.responseData[0]?.pffx)
            : formatValue2(response?.responseData[0]?.pf || 0),
        freight: formatValue2(response?.responseData[0]?.frieght),
        // transportCharges: formatValue2(response?.responseData[0]?.transportCharges || 0),
        transportCharges:
          response?.responseData[0]?.transportChargesFx !== null &&
          response?.responseData[0]?.transportChargesFx !== '' &&
          response?.responseData[0]?.transportChargesFx !== '0.000'
            ? formatValue2(response?.responseData[0]?.transportChargesFx)
            : formatValue2(response?.responseData[0]?.transportCharges || 0),
        insurancevalue: formatValue2(response?.responseData[0]?.insuranceValue),
        testingcharges: formatValue2(response?.responseData[0]?.testingCharges),
        Total: formatValue2(response?.responseData[0]?.totalValue),
        TotalFx:
          response?.responseData[0]?.totalValueFx !== null &&
          response?.responseData[0]?.totalValueFx !== '' &&
          response?.responseData[0]?.totalValueFx !== '0.000'
            ? formatValue2(response?.responseData[0]?.totalValueFx)
            : formatValue2(response?.responseData[0]?.totalValue),
        Shippingmarks: response?.responseData[0]?.remarks,
      })
    }
    setIsLoading(false)
    calculatetotal()
  }

  const uploadFiles = async (index, e) => {
    const reqObj = [
      {
        enquiryId,
        tenantId,
        type: 'Projects',
        empId: employeeId,
        referenceId,
        projectId,
        // stageCode: Tab?.stgCode,
        stageCode: 'STG046',
        indentDtlId: '',
        indentHdrId: e,
        docType: 'DC083',
        uploadDocType: 'FC015',
      },
    ]
    // if (index < filesList.length) {
    const formData = new FormData()
    formData.append('insertDocRequest', JSON.stringify({ reqObj }))
    formData.append('file', fileList[0].originFileObj)
    console.log('Debit Note File', fileList)
    try {
      const response = await indentFileUpload({
        requestPath: 'insertDebitNoteFile',
        requestData: formData,
      })
      if (response) {
        if (response.responseCode === '200') {
          // message.success(response.responseDataMessage)
        }
      }
    } catch (error) {
      message.error('', 'Something happened uploading a file')
      // }
    }
  }

  const debitNoteSubmit = async () => {
    const valueForDebitNote = debitForm.getFieldValue('valueForDebitNote')

    if (!valueForDebitNote || !selectedReasonObj?.dnrDesc) {
      if (isDebitClicked) {
        messageReturn(405)
      } else {
        messageReturn(686)
      }
      return // prevent API call
    }

    if (!selectedRows || selectedRows.length === 0) {
      message.warning('Please select at least one line item before submitting.')
      return // Prevent API call
    }

    const reqdata = {
      debitNoteDtl: selectedRows,
      dnValue: valueForDebitNote,
      dnrId: selectedReasonObj.dnrId,
      dnReason: selectedReasonObj.dnrDesc,
      empId: employeeId,
      pmHdrId: projectId,
      poId: mainEntity.poId,
      seqStatus: 'ds001',
      seq: '1',
      tenantId,
      updatedBy: employeeId,
      vendorCode: mainEntity.vendorCode,
    }

    const response = await indentFileUpload({
      requestPath: 'insertDebitNoteHdrAndDtl',
      requestData: reqdata,
    })

    if (response.responseCode === '200') {
      if (fileList.length > 0) {
        uploadFiles(0, response.responseMessage)
      }
      messageReturn(213)
      getPoDetails()
      debitForm.resetFields()
      setSelectedReasonObj(null)
      setIsDebitClicked(false)
      setSelectedRows([])
    } else {
      messageReturn(633)
    }
  }

  // const handleUploadChange = ({ filelist }) => {
  //   setFileList(filelist)
  // }

  const handleCancelDtlsBtnInward = () => {
    setPaymentLoading(false)
    getPoDetails()
  }

  const rowSelection = {
    onChange: selectedKeyRows => {
      const formatted = selectedKeyRows.map(id => ({ poDtlId: id }))
      console.log('Formatted Selection:', formatted)
      setSelectedRows(formatted)
    },
    getCheckboxProps: () => ({
      disabled: false,
    }),
  }

  const handleDebitNote = () => {
    if (isDebitClicked) {
      setIsDebitClicked(false)
    } else {
      setIsDebitClicked(true)
    }
  }

  const getType = async () => {
    const response = await commongetmethod({ requestPath: 'getDCTypeDtl' })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      setDcList(response?.responseData)
    }
  }
  const getdivisionList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getdivisionDesc',
      requestData: { tenantID: tenantId },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      const transformedList = response?.responseData.map(item => ({
        ...item,
        key: item.id,
        value: item.desc,
      }))
      setDivisionList(transformedList)
    }
  }
  const getDispatchlist = async () => {
    const response = await indentFileUpload({
      requestPath: 'getModeOfDispatchDesc',
      requestData: { tenantID: tenantId },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      const transformedList = response?.responseData.map(item => ({
        ...item,
        key: item.id,
        value: item.desc,
      }))
      setDispatchlist(transformedList)
    }
  }
  const getInsuranceList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getTransitInsuranceDesc',
      requestData: { tenantID: tenantId },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      const transformedList = response?.responseData.map(item => ({
        ...item,
        key: item.id,
        value: item.desc,
      }))
      setInsurancelist(transformedList)
    }
  }
  const getInspectionList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getInspectScopeDesc',
      requestData: { tenantID: tenantId },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      const transformedList = response?.responseData.map(item => ({
        ...item,
        key: item.id,
        value: item.desc,
      }))
      setInspectionList(transformedList)
    }
  }

  const handleDcChange = async () => {
    const AddressType = poform.getFieldValue('AddressType')
    if (AddressType !== '' && AddressType !== null && AddressType !== undefined) {
      setAddressList([])
      poform.setFieldsValue({
        deliveryName: undefined,
        deliveryAddressLine: '',
        deliveryCity: '',
        deliveryPincode: '',
        deliveryState: '',
        deliveryGst: '',
      })
      const response = await indentFileUpload({
        requestPath: 'getAddressDtlByDcType',
        requestData: {
          tenantId,
          dcTypeCode: AddressType,
        },
      })
      if (response?.responseCode === '200') {
        setAddressList(response?.responseData || [])
        if (response?.responseData.length === 1) {
          filladdress(response?.responseData[0])
        }
      } else {
        setAddressList([])
      }
    }
  }

  const downloadreport = async () => {
    const reqdata = {
      key: 'poImport',
      poId: rowData.poId,
      poType: 'Import',
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByPoIdReportPDF',
      requestData: reqdata,
    })

    if (response.responseCode === '200') {
      if (response?.responseData[0]?.fileContent !== null) {
        const link = document.createElement('a')
        link.href = `data:application/octet-stream;base64,${response?.responseData[0]?.fileContent}`
        link.download = response?.fileName
        link.click()
        messageReturn(210)
      } else {
        messageReturn(606)
      }
    }
  }

  const downloaddrawn = async record => {
    const response = await indentFileUpload({
      requestPath: 'documentDownloadDocFile',
      requestData: {
        referenceId: record?.indentDtlList[0]?.dmId,
        tenantId,
        fileCode: '',
        docTypeCode: '',
      },
    })
    if (response) {
      if (response.fileContent !== null) {
        const link = document.createElement('a')
        link.href = `data:application/octet-stream;base64,${response.fileContent}`
        link.download = response.fileName
        link.click()
        messageReturn(210)
      } else {
        messageReturn(606)
      }
    }
  }
  const handleAddressChange = () => {
    const deliveryName = poform.getFieldValue('deliveryName')
    if (deliveryName !== '' && deliveryName !== null && deliveryName !== undefined) {
      const data = addressList.find(item => item.name === deliveryName)
      filladdress(data)
    }
  }
  const filladdress = data => {
    poform.setFieldsValue({
      addressName: data.name,
      deliveryName: data.name,
      deliveryAddressLine: data.address,
      deliveryCity: data.city,
      deliveryPincode: data.pincode,
      deliveryState: data.state,
      deliveryGst: data.gstNo,
    })
  }
  const formatValue2 = value => {
    return value !== '' ? parseFloat(value).toLocaleString('en-IN') : '0'
  }
  const handleHSNCode = async e => {
    const response = await indentFileUpload({
      requestPath: 'getHsnCodeByPartNo',
      requestData: {
        partNo: e?.indentDtlList[0]?.productCode,
        tenantId,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        if (response.responseData.length > 0) {
          setHsnCode(response.responseData)
        }
      }
    }
  }
  const Potablechanged = (fieldname, index) => {
    if (!potabel || !prevpoTable) return false
    if (!potabel[index] || !prevpoTable[index]) return false
    if (!potabel[index][fieldname] && !prevpoTable[index][fieldname]) return false
    return potabel[index][fieldname] !== prevpoTable[index][fieldname]
  }

  const handleAddRows = index => {
    let perArr = 0

    paymentterms.forEach(function(item) {
      perArr += parseFloat(item.percentage !== '' ? item.percentage : 0)
    })
    const total = perArr + parseFloat(poform.getFieldValue('addpaymentpercentage'))
    if (total > 100) {
      messageReturn(678)
      poform.setFieldsValue({ addpaymentpercentage: '' })
      return
    }
    if (
      poform.getFieldValue('addpaymentterm') === (null || undefined || '') ||
      poform.getFieldValue('addpaymentpercentage') === (null || undefined || '') ||
      poform.getFieldValue('addpaymentremarks') === (null || undefined || '')
    ) {
      messageReturn(405)
      poform.setFieldsValue({ addpaymentterm: '', addpaymentpercentage: '', addpaymentremarks: '' })
      return
    }
    const newData = [...paymentterms]
    newData[index] = {
      potId: '',
      poId: projectList[0].poId,
      term: poform.getFieldValue('addpaymentterm'),
      percentage: poform.getFieldValue('addpaymentpercentage'),
      remarks: poform.getFieldValue('addpaymentremarks'),
    }
    poform.setFieldsValue({
      addpaymentterm: '',
      addpaymentpercentage: '',
      addpaymentremarks: '',
    })
    setPaymentTerms([...newData, emptyPaymentTerms])
  }

  const handleRemoveRows = index => {
    const newData = paymentterms.filter((_, i) => i !== index)
    setPaymentTerms(newData)
  }

  const handleKeyDown = e => {
    if (e.target.value.indexOf('.') !== -1) {
      // if(/\./.test(e.target.value)){
      poform.setFieldsValue({
        addpaymentpercentage: '',
      })
      messageReturn(681)
    } else {
      poform.setFieldsValue({
        addpaymentpercentage: e.target.value,
      })
    }
  }

  const handleDetail = (data, i) => {
    console.log(data, 'data')
    setPaymentLoading(true)
    setPaymentData(data)

    if (i === paymentterms.length - 1) {
      setIndexValue('Final Payment')
    } else {
      setIndexValue('Partial Payment')
    }
    getMaterials(data)
    getPoCostTypeDetail()
  }

  const getMaterials = async param => {
    const response = await indentFileUpload({
      requestPath: 'getGrnHdrDetails',
      requestData: {
        tenantId,
        projectId,
        poId: param.poId,

        // projectId,
      },
    })
    setGrnData(response?.responseData || [])
  }

  const getPoCostTypeDetail = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPoCostType',
      requestData: {
        tenantId,
        isActive: '1',
      },
    })
    setPoCostType(response?.responseData || [])
  }

  const columns = [
    {
      title: 'S.No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: 'Part Number',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => (
        <a
          role="button"
          tabIndex="0"
          onClick={() => downloaddrawn(record)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              downloaddrawn(record)
            }
          }}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {record?.indentDtlList[0]?.productCode || ''}
        </a>
      ),
    },

    {
      title: 'Description',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.description || ''}</div>,
    },
    {
      title: 'Specification',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.specification || ''}</div>,
    },
    {
      title: (
        <span>
          {' '}
          HSN code <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      render: (text, record, index) => (
        <Form.Item name={`hsnCode_${record.poDtlId}`} initialValue={record.hsnCode}>
          <AutoComplete
            style={{ width: '150px' }}
            options={hsnCode}
            onChange={e => {
              poform.setFieldsValue({
                [`hsnCode_${record.poDtlId}`]: e,
              })
            }}
            maxLength={8}
            onSelect={(e, value) => {
              if (value.length > 8) {
                poform.setFieldsValue({
                  [`hsnCode_${record.poDtlId}`]: '',
                })
                messageReturn(677)
              }
            }}
            onClick={() => handleHSNCode(record)}
          >
            <Input
              placeholder="Select here"
              style={Potablechanged('hsnCode', index) ? HighlightStyle : {}}
            />
          </AutoComplete>
        </Form.Item>
      ),
    },
    // {
    //   title: 'GST',
    //   dataIndex: 'poGst',
    //   key: 'poGst',
    //   render: (text, record, index) => (
    //     <Form.Item name={`gst_${record.poDtlId}`} initialValue={Number(record.poGst)}>
    //       <Select
    //         style={{ width: '150px' }}
    //         options={[
    //           { value: 0, label: '0' },
    //           { value: 5, label: '5' },
    //           { value: 7, label: '7' },
    //           { value: 12, label: '12' },
    //         ]}
    //         onChange={value => {
    //           let updatedItems = [...potabel]

    //           if (index === 0) {
    //             updatedItems = updatedItems.map(item => ({
    //               ...item,
    //               poGst: value,
    //             }))
    //           } else {
    //             updatedItems[index] = { ...updatedItems[index], poGst: value }
    //           }
    //           setPoTable(updatedItems)
    //           updatedItems.forEach(item => {
    //             poform.setFieldsValue({ [`gst_${item.poDtlId}`]: item.poGst })
    //           })
    //         }}
    //       />
    //     </Form.Item>
    //   ),
    // },
    {
      title: 'Make',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.make || ''}</div>,
    },
    {
      title: 'Mass(Kgs)',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      className: 'right-align-cell',
      render: (text, record) => <div>{record?.indentDtlList[0]?.weight || ''}</div>,
    },
    {
      title: 'Material',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.material || ''}</div>,
    },

    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        const numericValue = parseFloat(record?.qty)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.indentDtlList[0].qty
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uomCode',
      key: 'uomCode',
      render: (text, record) => {
        const numericValue = parseFloat(record.indentDtlList[0]?.uomDesc)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.indentDtlList[0].uomDesc
      },
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 150,

      render: (text, record, index) => (
        <Form.Item
          name={`deliverydate_${record.poDtlId}`}
          initialValue={
            record.deliveryDate
              ? moment(record.deliveryDate)
              : moment(poform.getFieldValue('deliveryDate'))
          }
        >
          <DatePicker
            format="DD-MMM-YYYY"
            disabledDate={current => current >= moment(poform.getFieldValue('deliveryDate'))}
            style={Potablechanged('deliveryDate', index) ? HighlightStyle : {}}
          />
        </Form.Item>
      ),
    },
    {
      title: `Currency Type`,
      dataIndex: 'currencyType',
      key: 'unitRate',
      className: 'right-align-cell',
      render: text => {
        // const numericValue = parseFloat(text)
        // // eslint-disable-next-line no-restricted-globals
        // if (!isNaN(numericValue)) {
        //   return numericValue.toLocaleString('en-IN')
        // }
        return text
      },
    },
    {
      title: `Unit Rate ${potabel[0]?.currencyType ? ` (${potabel[0].currencyType})` : ''}`,
      dataIndex: 'unitRateFx',
      key: 'unitRateFx',
      className: 'right-align-cell',
      render: (text, record) => {
        const value =
          text && text !== '' && text !== '0.000' && text !== null ? text : record.unitRate
        const numericValue = parseFloat(value)
        return !Number.isNaN(numericValue) ? numericValue.toLocaleString('en-IN') : value
      },
    },
    // {
    //   title: `Unit Rate ${Menulistdata[0].currency}`,
    //   dataIndex: 'unitRate',
    //   key: 'unitRate',
    //   className: 'right-align-cell hide-column',
    //   render: text => {
    //     const numericValue = parseFloat(text)
    //     // eslint-disable-next-line no-restricted-globals
    //     if (!isNaN(numericValue)) {
    //       return numericValue.toLocaleString('en-IN')
    //     }
    //     return text
    //   },
    // },
    {
      title: `Total Value${potabel[0]?.currencyType ? ` (${potabel[0].currencyType})` : ''}`,
      dataIndex: 'totalValueFx',
      key: 'totalValueFx',
      className: 'right-align-cell',
      render: (text, record) => {
        const value =
          text && text !== '' && text !== '0.000' && text !== null ? text : record.totalValue
        const numericValue = parseFloat(value)
        return !Number.isNaN(numericValue) ? numericValue.toLocaleString('en-IN') : value
      },
    },
    // {
    //   title: `Total Value ${Menulistdata[0].currency}`,
    //   dataIndex: 'totalValue',
    //   key: 'totalValue',
    //   className: 'right-align-cell',
    //   render: text => {
    //     const numericValue = parseFloat(text)
    //     // eslint-disable-next-line no-restricted-globals
    //     if (!isNaN(numericValue)) {
    //       return numericValue.toLocaleString('en-IN')
    //     }
    //     return text
    //   },
    // },
  ]

  const paymentcolumns = [
    {
      title: 'Payment Term',
      dataIndex: 'term',
      key: 'term',
      render: (text, record, index) =>
        index === paymentterms.length - 1 ? (
          <Form form={poform}>
            <Form.Item name="addpaymentterm">
              <Input
                value={text}
                placeholder="Type here..."
                style={{ width: '200px' }}
                type="text"
              />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, record, index) =>
        index === paymentterms.length - 1 ? (
          <Form form={poform}>
            <Form.Item name="addpaymentpercentage">
              <Input
                value={text}
                // onBlur={e => handleDataChanges(index, e, level, 'percentage')}
                placeholder="Type here..."
                style={{ width: '200px' }}
                onKeyUp={handleKeyDown}
                type="number"
              />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text, record, index) =>
        index === paymentterms.length - 1 ? (
          <Form form={poform}>
            <Form.Item name="addpaymentremarks">
              <TextArea
                value={text}
                rows={4}
                // onBlur={e => handleDataChanges(index, e, level, 'remarks')}
                placeholder="Type here..."
                style={{ width: '200px' }}
                type="text"
              />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: '15%',
      render: (text, record, index) => (
        <Space>
          {index === paymentterms.length - 1 && (
            <AddIconButton onClick={() => handleAddRows(index)} />
          )}
          {index !== paymentterms.length - 1 && (
            <RemoveIcon onClick={() => handleRemoveRows(index)} />
          )}
        </Space>
      ),
    },
  ]

  const getPendingValue = record => {
    console.log(
      record,
      pendingGstValue,
      transportValue,
      otherValue,
      pfValue,
      insuranceValue,
      'getpendingvalue record',
    )
    const pending =
      // (parseFloat(pendingGstValue) || 0) +
      // (parseFloat(transportValue) || 0) +
      // ((parseFloat(otherValue) || 0) + (parseFloat(pfValue) || 0)) +
      parseFloat(record.pendingAmount) || 0

    console.log(Math.round(pending), 'Pending value')
    return Math.round(pending)
  }

  const paymentTermColumns = [
    {
      title: 'S.No.',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: text => Number(text).toFixed(2),
    },
    {
      title: `Term Value ${Menulistdata[0].currency}`,
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      render: (text, record) => <span>{Math.round(parseFloat(Number(record.paymentAmount)))}</span>,
    },
    {
      title: `Pending Value ${Menulistdata[0].currency}`,
      dataIndex: 'pendingAmount',
      key: 'pendingAmount',
      render: (text, record) => {
        let pending = parseFloat(record.pendingAmount) || 0

        if (pending === 0) {
          // Example: sum of two other fields from record
          pending =
            (parseFloat(pendingGstValue) || 0) +
            (parseFloat(transportValue) || 0) +
            (parseFloat(otherValue) + parseFloat(pfValue) || 0)
        }

        return <span>{Math.round(pending)}</span>
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        const pending = getPendingValue(record)
        console.log(pending, 'pending in action')

        return (record.isLast === '0' && pending >= 1) ||
          (record.isLast === '1' &&
            (Math.round(parseFloat(pendingGstValue)) !== 0 ||
              Math.round(parseFloat(transportValue)) !== 0 ||
              Math.round(parseFloat(otherValue)) !== 0 ||
              Math.round(parseFloat(pfValue)) !== 0 ||
              Math.round(parseFloat(insuranceValue)) !== 0)) ||
          Math.round(parseFloat(record.pendingAmount)) >= 1 ? (
          !isView && (
            // eslint-disable-next-line
            <Button
              type="primary"
              disabled={projectList[0].isApproved !== '1'}
              onClick={() => handleDetail(record, index)}
            >
              PRA
            </Button>
          )
        ) : (
          <div>
            <span style={{ whiteSpace: 'nowrap' }}>
              PRA No :
              <b> {record.praCode === 'null' || record.praCode == null ? '-' : record.praCode} </b>
            </span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
              PRA Date :{' '}
              <b>{record.praDate !== '0' ? moment(record.praDate).format('DD-MMM-YYYY') : '-'} </b>
            </span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
              PRA Status:
              <b>
                {' '}
                {record.documentStatus === 'null' || record.documentStatus == null
                  ? '-'
                  : record.documentStatus}{' '}
              </b>
            </span>
          </div>
        )
      },
    },
  ]
  const { TextArea } = Input

  const onFinish = values => {
    const amountInWords = convertNumberToWords(parseInt(values.amount, 10))
    poform.setFieldsValue({ amountInWords })
  }

  const getFormattedValue = value => {
    if (!value) {
      return 0
    }
    const inputValue = value.replace(/[^\d.]/g, '')
    const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
    const formattedValue = parsedValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formattedValue
  }
  const removeCommas = value => {
    if (!value) {
      return 0
    }
    const valuse = value.replace(/,/g, '')
    return valuse
  }

  // eslint-disable-next-line no-unused-vars
  const amountonchange = (e, name) => {
    calculatetotal()
    const formvalues = poform.getFieldsValue()
    poform.setFieldsValue({
      documentcharges: getFormattedValue(formvalues.documentcharges),
      inspectioncharges: getFormattedValue(formvalues.inspectioncharges),
      pf: getFormattedValue(formvalues.pf),
      freight: getFormattedValue(formvalues.freight),
      transportCharges: getFormattedValue(formvalues.transportCharges),
      insurancevalue: getFormattedValue(formvalues.insurancevalue),
      testingcharges: getFormattedValue(formvalues.testingcharges),
      // subtotal: getFormattedValue(formvalues.subtotal),
      lessdiscounts: getFormattedValue(formvalues.lessdiscounts),
      CTC: getFormattedValue(formvalues.CTC),
      TDC: getFormattedValue(formvalues.TDC),
      TDS: getFormattedValue(formvalues.TDS),
      QAP: getFormattedValue(formvalues.QAP),
      GTC: getFormattedValue(formvalues.GTC),
    })
  }
  const calculatetotal = () => {
    const formvalues = poform.getFieldsValue()
    // Function to remove commas from string

    const fieldsToSum = [
      'documentcharges',
      'inspectioncharges',
      'pf',
      // 'freight',
      'transportCharges',
      'insurancevalue',
      'testingcharges',
      'subtotalFx',
    ]
    const total = fieldsToSum.reduce((accumulator, fieldName) => {
      let fieldValue = formvalues[fieldName]
      if (fieldValue === '' || fieldValue === undefined || fieldValue === null) {
        fieldValue = '0' // Replace empty string with "0"
      }
      fieldValue = parseFloat(removeCommas(fieldValue)) || 0
      return accumulator + fieldValue
    }, 0)

    // Ensure lessdiscounts is initialized to 0 if it's not set
    let lessDiscounts = formvalues.lessdiscounts
    if (lessDiscounts === '') {
      lessDiscounts = '0' // Replace empty string with "0"
    }
    if (lessDiscounts !== undefined && lessDiscounts !== null) {
      lessDiscounts = parseFloat(removeCommas(lessDiscounts)) || 0
    }

    // Calculate the final total
    let finalTotal = total - lessDiscounts
    if (finalTotal < 0) {
      finalTotal = 0
    }

    // Convert finalTotal to words and update form fields
    if (finalTotal !== undefined && finalTotal !== null) {
      const amountInWord = convertNumberToWords(parseInt(finalTotal, 10))
      // Reformat finalTotal with commas
      const finalTotalWithCommas = finalTotal.toLocaleString('en-IN')
      console.log(finalTotalWithCommas)
      poform.setFieldsValue({
        amountInWords: amountInWord,
        // TotalFx: finalTotalWithCommas, // Set the formatted total with commas
      })
    }
  }

  const CustomFormItem = ({
    name,
    label,
    inputClassName,
    onChange,
    onBlur,
    value,
    disabled,
    type,
    initialValue,
    placeholder,
    NewChange,
    ...props
  }) => (
    <Form.Item
      name={name}
      label={label}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      {...props}
      initialValue={initialValue}
      labelAlign="left"
    >
      <Input
        className="custom-input"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        style={NewChange ? HighlightStyle : { width: '100%' }}
      />
    </Form.Item>
  )
  // eslint-disable-next-line no-unused-vars
  const addRemarksSubmit = seqval => {
    setApproveRemarksCard(true)
  }
  const OpenDetailCard = () => {
    setdetailCard(true)
  }
  // eslint-disable-next-line no-unused-vars
  const addprevRemarksSubmit = seqval => {
    setPrevRemarksCard(true)
  }
  const handlescsapproval = async (seq, type) => {
    if (type === 'Reject') {
      await updatePoSeqAndStatus(seq, type)
    }
    if (type === 'Approve') {
      const mandatoryValidationPassed = await handleinsert()
      if (mandatoryValidationPassed) {
        await updatePoSeqAndStatus(selectedOption, type)
      } else {
        messageReturn(405)
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  const updatePoSeqAndStatus = async (seq, type) => {
    const formvalue = inputForm.getFieldValue()
    const props = {
      currentseq: seq,
      empId: employeeId,
      tenantId,
      hdrId: rowData.poId,
      remarks: formvalue.remarks,
      pmId: Tab?.processCode,
      mstId: Tab?.mstId,
    }

    const httpapprovals = await indentFileUpload({
      requestPath: 'updatePoSeqAndStatus',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      inputForm.resetFields()
      calldetailapi()
      message.success(httpapprovals.responseMessage)
    } else {
      message.error(httpapprovals.responseMessage)
    }
  }
  const remarksColumns = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status Description',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'empName',
      key: 'empName',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]
  const handleinsert = async () => {
    return new Promise((resolve, reject) => {
      const formvalues = poform.getFieldValue()
      const updatedTableData = potabel.map(item => {
        return {
          ...item,
          hsnCode: formvalues[`hsnCode_${item.poDtlId}`] || '',
          poGst: formvalues[`gst_${item.poDtlId}`] || '0',
          deliveryDate: moment(formvalues[`deliverydate_${item.poDtlId}`] || newDate).format(
            'YYYY-MM-DD',
          ),
        }
      })
      const HsnCode = updatedTableData.filter(data => data.hsnCode !== '')
      const isHsncode = HsnCode.length === updatedTableData.length ? 'true' : 'false'

      const payload = {
        poId: projectList[0].poId,
        igScpId: projectList[0].igScpId,
        transactionNo: projectList[0].transactionNo,
        financialYearMstId: projectList[0].financialYearMstId,
        poType: projectList[0].poType,
        billingName: projectList[0].billingName,
        billingAddressLine: projectList[0].billingAddressLine,
        billingCity: projectList[0].billingCity,
        billingPincode: projectList[0].billingPincode,
        billingState: projectList[0].billingState,
        billingCount: projectList[0].billingCount,
        billingGst: projectList[0].billingGst,
        billingContactNo: projectList[0]?.billingContactNo,
        vendorName: projectList[0].vendorName,
        vendorAddressLine: projectList[0].vendorAddressLine,
        vendorCity: projectList[0].vendorCity,
        vendorPincode: projectList[0].vendorPincode,
        vendorState: projectList[0].vendorState,
        vendorCount: projectList[0].vendorCount,
        vendorGst: projectList[0].vendorGst,
        vendorContactNo: projectList[0]?.vendorContactNo,
        deliveryName: formvalues.deliveryName,
        deliveryAddressLine: formvalues.deliveryAddressLine,
        deliveryCity: formvalues.deliveryCity,
        deliveryPincode: formvalues.deliveryPincode,
        deliveryState: formvalues.deliveryState,
        deliveryCount: formvalues.deliveryCount,
        deliveryGst: formvalues.deliveryGst,
        deliveryContact: formvalues.deliveryContactno,
        // deliveryContactNo : formvalues.deliveryContactno,
        division: formvalues.Division,
        orderNo: formvalues.OrderNumber,
        date: moment(formvalues.Date).format('YYYY-MM-DD'),
        revision: projectList[0].revision,
        revisionDate: moment(projectList[0].revisionDate).format('YYYY-MM-DD'),
        refDate: moment(formvalues.YourRefDate).format('YYYY-MM-DD'),
        refNo: projectList[0]?.refNo || '',
        deliveryDate: moment(formvalues.deliveryDate).format('YYYY-MM-DD'),
        deliveryTerms: projectList[0].deliveryTerms || '',
        liqDamages: formvalues.LiquidatedDamages,
        guarantee: formvalues.Guarantee,
        warrenty: formvalues.Warranty,
        dispatchMode: formvalues.ModeOfDispatch,
        transitInsurance: removeCommas(formvalues.Insurance) || '',
        inspectionScope: formvalues.Inspection || '',
        misc: formvalues.Miscellaneous,
        portOfDest: formvalues.PortOfDestination,
        remarks: formvalues.Shippingmarks,
        discount: removeCommas(formvalues.lessdiscounts) || '0',
        frieght: removeCommas(formvalues.freight) || '0',
        transportChargesFx: removeCommas(formvalues.transportCharges) || '0',
        transportCharges: Number((mainEntity.transportCharges ?? '').toString().trim()) || 0,
        others: projectList[0].others || '0',
        basicTotal: removeCommas(formvalues.subtotal) || '0',
        gst: pendingGstValue || '0',
        cess: projectList[0].cess || '0',
        totalValue: removeCommas(formvalues.Total) || '0',
        frieghtRemarks: projectList[0].frieghtRemarks,
        poTC: formvalues.POTC,
        dwgs: formvalues.DWGS,
        qap: formvalues.QAP,
        gtc: removeCommas(formvalues.GTC) || '0',
        docCharges: removeCommas(formvalues.documentcharges) || '0',
        inspectionCharges: removeCommas(formvalues.inspectioncharges) || '0',
        insuranceValue: removeCommas(formvalues.insurancevalue) || '0',
        testingCharges: removeCommas(formvalues.testingcharges) || '0',
        ctc: removeCommas(formvalues.CTC) || '0',
        tdc: removeCommas(formvalues.TDC) || '0',
        tds: removeCommas(formvalues.TDS) || '0',
        tenantId: projectList[0].tenantId,
        empId: projectList[0].empId,
        sequenceNo: projectList[0].sequenceNo,
        sequenceStatus: projectList[0].sequenceStatus,
        vendorCode: projectList[0].vendorCode,
        poCode: projectList[0].poCode,
        updatedOn: projectList[0].updatedOn,
        updatedBy: projectList[0].updatedBy,
        isApproved: projectList[0].isApproved,
        poDtl: updatedTableData,
        amountinwords: formvalues.amountInWords,
        poPaymentTerm: paymentterms,
        poDispatchDoc: [
          {
            podId: projectList[0].poDispatchDoc[0]?.podId,
            poId: projectList[0].poDispatchDoc[0]?.poId,
            invoiceNo: formvalues.invoice,
            pkgList: formvalues.pkglist,
            awbBl: formvalues.awbbl,
            testReports: formvalues.testreports,
            certificateOfOrigin: formvalues.certificateoforigin,
            oMManual: formvalues.ommanual,
            insuranceWarrentyCert: formvalues.insuranceWarrenty,
            inspectionReport: formvalues.inspectionReport,
          },
        ],
        pfFx: removeCommas(formvalues.pf) || '0',
        pf: Number((mainEntity.pf ?? '').toString().trim()) || 0,
        pFRemarks: '',
        poStatusList: rmkDetaillist,
        seqStatusDesc: projectList[0].seqStatusDesc,
        pmId: Tab?.processCode,
        masterId: Tab?.mstId,
        venCode: formvalues.AddressType,
      }

      poform.validateFields().then(async values => {
        if (checkMandatoryFields(values) && isHsncode === 'true') {
          const response = await indentFileUpload({
            requestPath: 'insertPoDtlService',
            requestData: payload,
          })
          if (response.responseCode === '200') {
            message.success(response?.responseMessage)
            calldetailapi()
            onClose()
            resolve(true)
          } else {
            message.error(response?.responseMessage)
          }
          calldetailapi()
          onClose()
        } else {
          messageReturn(405)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false)
        }
      })
    })
  }

  const checkMandatoryFields = values => {
    const mandatoryFields = [
      'deliveryName',
      'deliveryAddressLine',
      'deliveryCity',
      'deliveryPincode',
      'deliveryState',
      'deliveryGst',
      'deliveryContactno',
      'Division',
      'OrderNumber',
      'Date',
      'YourRefDate',
      'deliveryDate',
      'LiquidatedDamages',
      'Guarantee',
      'Warranty',
      'ModeOfDispatch',
      // 'Insurance',
      // 'Inspection',
      'Miscellaneous',
      'PortOfDestination',
      'Shippingmarks',
      'invoice',
      'pkglist',
      'awbbl',
      'testreports',
      'certificateoforigin',
      'ommanual',
      'insuranceWarrenty',
      'inspectionReport',
      'POTC',
      'DWGS',
      'Total',
    ]

    return mandatoryFields.every(field => values[field])
  }
  const handleDropdownChange = value => {
    setSelectedOption(value)
    setApprvBtnEnabled(false)
  }
  const AddRemarksComponent = seq => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  onClick={() => handlescsapproval(seq, 'Approve')}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const AddRemarksprevComponent = seq => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  onClick={() => handlescsapproval(seq, 'Reject')}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const isFieldValueChanged = fieldname => {
    if (!prevEntity || !mainEntity) return false
    if (!prevEntity[fieldname] && !mainEntity[fieldname]) return false
    return mainEntity[fieldname] !== prevEntity[fieldname]
  }

  const isFieldValueChanged2 = fieldname => {
    if (!prevdoclist || !maindoclist) return false
    if (!prevdoclist[fieldname] && !maindoclist[fieldname]) return false
    return maindoclist[fieldname] !== prevdoclist[fieldname]
  }

  return (
    <div className="mt-3">
      <Skeleton loading={isLoading} active>
        <Card title="Purchase Order - Import" className="customize">
          <Form
            layout="horizontal"
            className="custom-form-container"
            form={poform}
            onFinish={onFinish}
            disabled={componentDisabled}
          >
            <Card>
              <div className="row address">
                <div className="col-md-4">
                  <h5>SUPPLIER ADDRESS</h5>
                  {projectList[0]?.vendorName}
                  <br />
                  {projectList[0]?.vendorAddressLine}
                  <br />
                  {projectList[0]?.vendorCity}
                  <br />
                  {projectList[0]?.vendorPincode}
                  <br />
                  {projectList[0]?.vendorState}
                  <br />
                  GST No. : {projectList[0]?.vendorGst}
                  <br />
                  {projectList[0]?.vendorContactNo}
                </div>
                <div className="col-md-4">
                  <h5>INVOICE / BILLING ADDRESS</h5>
                  {projectList[0]?.billingName}
                  <br />
                  {projectList[0]?.billingAddressLine}
                  <br />
                  {projectList[0]?.billingCity}
                  <br />
                  {projectList[0]?.billingPincode}
                  <br />
                  {projectList[0]?.billingState}
                  <br />
                  GST No. : {projectList[0]?.billingGst}
                  <br />
                  {projectList[0]?.billingContactNo}
                </div>
                <div className="col-md-4">
                  {/* <h5>MATERIALS DELIVERED AT</h5> */}
                  <Form.Item
                    name="AddressType"
                    label={
                      <h5 style={{ marginBottom: '0px' }}>
                        MATERIALS DELIVERED AT<span style={{ color: 'red' }}>*</span>
                      </h5>
                    }
                    labelAlign="left"
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleDcChange}
                      style={
                        isFieldValueChanged('AddressType') ? HighlightStyle : { width: '100%' }
                      }
                    >
                      {dclist?.map(item => (
                        <Option key={item.dcCode} value={item.dcCode}>
                          {item.dcDesc}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="deliveryName"
                    label={
                      <span>
                        Name<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                  >
                    <Select
                      placeholder="Select"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={handleAddressChange}
                      style={
                        isFieldValueChanged('deliveryName') ? HighlightStyle : { width: '100%' }
                      }
                    >
                      {addressList?.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Option key={index} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <CustomFormItem
                    name="deliveryName"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Name <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  /> */}
                  <CustomFormItem
                    name="deliveryAddressLine"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Address <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('deliveryAddressLine')}
                  />
                  <CustomFormItem
                    name="deliveryCity"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        City <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('deliveryCity')}
                  />
                  <CustomFormItem
                    name="deliveryPincode"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Pincode <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('deliveryPincode')}
                  />
                  <CustomFormItem
                    name="deliveryState"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        State <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('deliveryState')}
                  />
                  <CustomFormItem
                    name="deliveryGst"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        GST No. <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('deliveryGst')}
                  />
                  <Form.Item
                    name="deliveryContactno"
                    label={
                      <span style={{ marginBottom: '0px' }}>
                        Delivery Contact No<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input
                      type="text"
                      maxLength={10}
                      style={
                        isFieldValueChanged('deliveryContact') ? HighlightStyle : { width: '100%' }
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
            <Card>
              <div className="row costom-form-body">
                <div className="col-md-5">
                  <h5 className="mb-3">DISPATCH DOCUMENTS REQUIRED & NO. OF COPIES</h5>
                  <CustomFormItem
                    name="invoice"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Invoice <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('invoiceNo')}
                  />
                  <CustomFormItem
                    name="pkglist"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Pkg List <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('pkgList')}
                  />
                  <CustomFormItem
                    name="awbbl"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        AWB / BL <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('awbBl')}
                  />
                  <CustomFormItem
                    name="testreports"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Test Reports <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('testReports')}
                  />
                  <CustomFormItem
                    name="certificateoforigin"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Certificate of Origin <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('certificateOfOrigin')}
                  />
                  <CustomFormItem
                    name="ommanual"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        O & M Manual <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('oMManual')}
                  />
                  <CustomFormItem
                    name="insuranceWarrenty"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Insurance & Warranty <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('insuranceWarrentyCert')}
                  />
                  <CustomFormItem
                    name="inspectionReport"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Inspection Report <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged2('inspectionReport')}
                  />
                </div>
                <div className="col-md-5">
                  {/* <CustomFormItem
                    name="Division"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Division <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  /> */}
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="Division"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Division <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <AutoComplete
                      options={divisionList}
                      onChange={e => {
                        poform.setFieldsValue({
                          [`Division`]: e,
                        })
                      }}
                    >
                      <Input
                        placeholder="Select here"
                        style={
                          isFieldValueChanged('divisionDesc') ? HighlightStyle : { width: '100%' }
                        }
                      />
                    </AutoComplete>
                  </Form.Item>
                  <CustomFormItem
                    name="OrderNumber"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Order Number <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    disabled
                    NewChange={isFieldValueChanged('orderNo')}
                  />
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="Date"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Date <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      style={isFieldValueChanged('date') ? HighlightStyle : { width: '100%' }}
                    />
                  </Form.Item>
                  {/* <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="YourRefDate"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Your Ref/Date <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <DatePicker format="DD-MMM-YYYY" className="custom-input" disabled />
                  </Form.Item> */}
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="YourRefDate"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Ref Date <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      disabled
                      style={isFieldValueChanged('refDate') ? HighlightStyle : { width: '100%' }}
                    />
                  </Form.Item>
                  <CustomFormItem
                    name="refNo"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Ref No. <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    disabled
                    NewChange={isFieldValueChanged('refNo')}
                  />
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="deliveryDate"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Delivery Date <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      disabled
                      style={
                        isFieldValueChanged('deliveryDate') ? HighlightStyle : { width: '100%' }
                      }
                    />
                  </Form.Item>
                  <CustomFormItem
                    name="PaymentTerms"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Payment Terms <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    disabled
                    NewChange={isFieldValueChanged('PaymentTerms')}
                  />
                  <CustomFormItem
                    name="LiquidatedDamages"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Liquidated Damages <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('liqDamages')}
                  />
                  <CustomFormItem
                    name="Guarantee"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Guarantee <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('guarantee')}
                  />
                  <CustomFormItem
                    name="Warranty"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Warranty <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('warrenty')}
                  />
                  {/* <CustomFormItem
                    name="ModeOfDispatch"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Mode of Dispatch <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  /> */}
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="ModeOfDispatch"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Mode of Dispatch <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  >
                    <AutoComplete
                      options={dispatchlist}
                      onChange={e => {
                        poform.setFieldsValue({
                          [`ModeOfDispatch`]: e,
                        })
                      }}
                    >
                      <Input
                        placeholder="Select here"
                        style={
                          isFieldValueChanged('dispatchModeDesc')
                            ? HighlightStyle
                            : { width: '100%' }
                        }
                      />
                    </AutoComplete>
                  </Form.Item>
                  {/* <CustomFormItem
                    name="Insurance"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Insurance <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  /> */}
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="Insurance"
                    label={<span style={{ textAlign: 'center' }}>Insurance</span>}
                  >
                    <AutoComplete
                      options={insurancelist}
                      onChange={e => {
                        poform.setFieldsValue({
                          [`Insurance`]: e,
                        })
                      }}
                    >
                      <Input
                        placeholder="Select here"
                        style={
                          isFieldValueChanged('transitInsuranceDesc')
                            ? HighlightStyle
                            : { width: '100%' }
                        }
                      />
                    </AutoComplete>
                  </Form.Item>
                  {/* <CustomFormItem
                    name="Inspection"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Inspection <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                  /> */}
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="Inspection"
                    label={<span style={{ textAlign: 'center' }}>Inspection</span>}
                  >
                    <AutoComplete
                      options={inspectionlist}
                      onChange={e => {
                        poform.setFieldsValue({
                          [`Inspection`]: e,
                        })
                      }}
                    >
                      <Input
                        placeholder="Select here"
                        style={
                          isFieldValueChanged('inspectionScopeDesc')
                            ? HighlightStyle
                            : { width: '100%' }
                        }
                      />
                    </AutoComplete>
                  </Form.Item>
                  <CustomFormItem
                    name="Miscellaneous"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Miscellaneous <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('misc')}
                  />
                  <CustomFormItem
                    name="PortOfDestination"
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Port of Destination <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    NewChange={isFieldValueChanged('portOfDest')}
                  />
                </div>
              </div>
            </Card>
            <Card className="custom_antd_Table">
              <Table
                rowSelection={isDebitClicked ? rowSelection : null}
                columns={columns}
                dataSource={potabel}
                rowKey="poDtlId"
                bordered
              />
              <div className="costom-form-body mt-3">
                <div className="col-md-5">
                  <div className="custom-form-container">
                    <div className="amount_words">
                      <Form.Item
                        label={
                          <div>
                            <h5 className="mt-2">ENCLOSURES</h5>
                          </div>
                        }
                      />
                    </div>
                    {/* <CustomFormItem name="CTC" label="1.CTC" onChange={amountonchange} />
                    <CustomFormItem name="TDC" label="2.TDC" onChange={amountonchange} />
                    <CustomFormItem name="TDS" label="3.TDS" onChange={amountonchange} />
                    <CustomFormItem name="QAP" label="4.QAP" onChange={amountonchange} /> */}
                    <CustomFormItem
                      name="POTC"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          1. PO T&C <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('poTC')}
                    />
                    <CustomFormItem
                      name="DWGS"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          5. DWGS <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('dwgs')}
                    />

                    {/* <CustomFormItem name="GTC" label="6.GTC" onChange={amountonchange} /> */}
                  </div>
                  <div className="shipping_section">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                      }}
                    >
                      <h5>PAYMENT TERMS</h5>
                      {!isView &&
                        (['1'].includes(String(mainEntity?.sequenceNo)) ? (
                          <Popover
                            placement="top"
                            content={
                              <div className="custom_antd_Table">
                                <Table dataSource={paymentterms} columns={paymentcolumns} />
                              </div>
                            }
                            trigger="click"
                          >
                            <Button type="primary">Add Payment Terms</Button>
                          </Popover>
                        ) : (
                          <Button type="primary" disabled>
                            Add Payment Terms
                          </Button>
                        ))}
                    </div>
                    {/* {paymentterms.slice(0, -1).map((item, index) => (
                                        <div key={item.potId} style={{ display: 'flex', flexDirection: 'column' }}>
                                          {`${index + 1}) ${item.term}- ${item.percentage}% `}
                                        </div>
                                      ))} */}

                    <div>
                      <div className="custom_antd_Table">
                        <Table dataSource={paymentterms} columns={paymentTermColumns} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-5 custom-form-container">
                  <div className="amount_words">
                    <Form.Item
                      name="amountInWords"
                      label={
                        <div>
                          <h5 className="mt-2">Amount in Words</h5>
                        </div>
                      }
                    >
                      <TextArea
                        className="custom-input"
                        disabled
                        style={
                          isFieldValueChanged('amountinwords'.replace(/^Rupees\s+/i, ''))
                            ? HighlightStyle
                            : { width: '100%' }
                        }
                      />
                    </Form.Item>
                  </div>
                  {/* <CustomFormItem
                    onChange={e => amountonchange(e, 'subtotal')}
                    name="subtotal"
                    label="SUB TOTAL"
                    disabled
                    type="text"
                    NewChange={isFieldValueChanged('basicTotal')}
                  /> */}
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'subtotal')}
                    name="subtotalFx"
                    label={`SUB TOTAL ${
                      potabel[0]?.currencyType ? ` (${potabel[0].currencyType})` : ''
                    }`}
                    disabled
                    type="text"
                    NewChange={isFieldValueChanged('basicTotal')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'lessdiscounts')}
                    name="lessdiscounts"
                    label="LESS DISCOUNTS"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('discount')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'documentcharges')}
                    name="documentcharges"
                    label="DOCUMENT CHARGES"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('docCharges')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'inspectioncharges')}
                    name="inspectioncharges"
                    label="INSPECTION CHARGES"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('inspectionCharges')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'transportCharges')}
                    name="transportCharges"
                    label="Transport Charges"
                    placeholder="0.00"
                    type="text"
                    disabled
                    NewChange={isFieldValueChanged('transportCharges')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'pf')}
                    name="pf"
                    label="P & F"
                    placeholder="0.00"
                    type="text"
                    disabled
                    NewChange={isFieldValueChanged('pf')}
                  />
                  {/* <CustomFormItem
                    onChange={e => amountonchange(e, 'freight')}
                    name="freight"
                    label="FREIGHT"
                    placeholder="0.00"
                    type="text"
                  /> */}
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'insurancevalue')}
                    name="insurancevalue"
                    label="INSURANCE VALUE"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('pf')}
                  />
                  <CustomFormItem
                    onChange={e => amountonchange(e, 'testingcharges')}
                    name="testingcharges"
                    label="TESTING CHARGES"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('testingCharges')}
                  />
                  {/* <CustomFormItem
                    name="Total"
                    // value={totalamount}
                    label="Total"
                    placeholder="0.00"
                    disabled
                    type="text"
                    NewChange={isFieldValueChanged('totalValue')}
                  /> */}
                  <CustomFormItem
                    name="TotalFx"
                    // value={totalamount}
                    label={`Total ${
                      potabel[0]?.currencyType ? ` (${potabel[0].currencyType})` : ''
                    }`}
                    placeholder="0.00"
                    disabled
                    type="text"
                    NewChange={isFieldValueChanged('totalValue')}
                  />
                </div>
              </div>
            </Card>
            <Card>
              <div className="costom-form-body">
                <div className="col-md-5">
                  <table className="default_table">
                    <thead>
                      <tr>
                        <td>PO SUMMARY</td>
                        <td>BASIC ORDER VALUE</td>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                      <td>Main Supplies</td>
                      <td>
                        <Form.Item name="Main Supplies">
                          <Input className="custom-input" />
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>Mandatory Spares</td>
                      <td>
                        <Form.Item name="Mandatory Spares">
                          <Input className="custom-input" />
                        </Form.Item>
                      </td>
                    </tr> */}
                      <tr style={{ display: 'none' }}>
                        <td>Total</td>
                        <td>
                          <Form.Item name="Total">
                            <Input className="custom-input" />
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Total {potabel[0]?.currencyType ? `(${potabel[0].currencyType})` : ''}
                        </td>
                        <td>
                          <Form.Item name="TotalFx">
                            <Input className="custom-input" />
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {mainEntity.isApproved === '0' ? null : !isDebitClicked ? (
                    !isView && (
                      <Button type="primary" onClick={handleDebitNote}>
                        Add Debit Note
                      </Button>
                    )
                  ) : (
                    <>
                      <h5>Debit Note</h5>
                      <Form form={debitForm} layout="vertical">
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              label={
                                <>
                                  Select Reason <span style={{ color: 'red' }}>*</span>
                                </>
                              }
                              name="debitNoteReason"
                            >
                              <AutoComplete
                                placeholder="Select or type a reason"
                                options={reasonList.map(reason => ({
                                  label: reason.dnrDesc,
                                  value: reason.dnrDesc,
                                }))}
                                value={selectedReasonObj?.dnrDesc || ''}
                                onChange={value => {
                                  const match = reasonList.find(r => r.dnrDesc === value)
                                  if (match) {
                                    setSelectedReasonObj(match) // selected from list
                                  } else {
                                    setSelectedReasonObj({ dnrId: null, dnrDesc: value }) // user-typed
                                  }
                                }}
                                filterOption={false}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item label="Upload File" name="file">
                              <Upload
                                beforeUpload={file => {
                                  setFileList([file]) // Ensure `originFileObj` is available
                                  return false // prevent auto upload
                                }}
                                fileList={fileList}
                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                              >
                                <Button type="primary" icon={<UploadOutlined />} />
                              </Upload>
                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item
                              label={
                                <>
                                  Enter Value <span style={{ color: 'red' }}>*</span>
                                </>
                              }
                              name="valueForDebitNote"
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                placeholder="Enter Value"
                                formatter={value => value.replace(/[^\d.]/g, '')}
                                parser={value => value.replace(/[^\d.]/g, '')}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </>
                  )}
                </div>
                <div className="col-md-5 ">
                  <div className="shipping_section">
                    <h5>
                      SHIPPING MARKS<span style={{ color: 'red' }}> *</span>
                    </h5>
                    <Form.Item name="Shippingmarks">
                      <TextArea
                        className="custom-input"
                        style={isFieldValueChanged('remarks') ? HighlightStyle : { width: '100%' }}
                      />
                    </Form.Item>
                  </div>
                  <div className="shipping_section">
                    <h5>PAYMENT TERMS</h5>
                    <Form.Item name="paymentterms">
                      {paymentterms.map((item, index) => (
                        <div key={item.potId}>
                          {`${index + 1} )  ${item.term}-${item.percentage}%`}
                        </div>
                      ))}
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
          </Form>
          {!isView && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              {docStatus &&
                docStatus.length > 0 &&
                docStatus[0].cancelSeq !== '' &&
                docStatus[0].currSequence !== '3' && (
                  <div style={{ display: 'flex' }}>
                    <Select
                      id="approvalDropdown"
                      style={{ width: '150px' }}
                      dropdownStyle={{ textAlign: 'left' }}
                      onChange={value => handleDropdownChange(value)}
                      value={selectedOption}
                      placeholder="Select"
                    >
                      <Option value="" key="defaultOption">
                        Select
                      </Option>
                      {docStatus.map(option => (
                        <Option key={option.currSequence} value={option.currSequence}>
                          {option.docStatusDesc}
                        </Option>
                      ))}
                    </Select>
                    <div style={{ marginLeft: '10px' }}>
                      <ButtonComponent
                        type="primary"
                        // text={docStatus[0].docStatusDesc}
                        text="Update"
                        disable={
                          docStatus?.length > 0 && String(docStatus[0]?.previousSeq ?? '') === '2'
                            ? apprvBtnEnabled
                            : false
                        }
                        onClick={() => addRemarksSubmit(docStatus[0].currSequence)}
                      />
                    </div>
                  </div>
                )}
              <Popuptable
                onClose={() => setApproveRemarksCard(false)}
                cardLabel=""
                component={AddRemarksComponent(
                  docStatus && docStatus.length > 0 ? docStatus[0].currSequence : '',
                )}
                visible={approveRemarksCard}
              />
              <span style={{ margin: '0 8px' }} />
              <ButtonComponent
                type="primary"
                icon={<CommentOutlined />}
                onClick={() => {
                  OpenDetailCard()
                }}
              />
              <Popuptable
                onClose={() => setdetailCard(false)}
                cardLabel=""
                component={
                  <div className="custom_antd_Table" style={{ width: '500px' }}>
                    <Table dataSource={rmkDetaillist} columns={remarksColumns} scrollY={300} />
                  </div>
                }
                visible={detailCard}
              />
              <span style={{ margin: '0 8px' }} />
              <ButtonComponent
                text="Save"
                type="primary"
                disable={
                  componentDisabled ||
                  ((docStatus?.[0]?.previousSeq ?? '') === '2' ? apprvBtnEnabled : false)
                }
                onClick={() => handleinsert()}
              />
              {mainEntity.isApproved === '0' ? null : (
                <>
                  <span style={{ margin: '0 8px' }} />
                  <ButtonComponent
                    text="Debit Note"
                    type="primary"
                    disable={componentDisabled}
                    onClick={() => debitNoteSubmit()}
                  />
                </>
              )}
              <span style={{ margin: '0 8px' }} />
              {docStatus &&
                docStatus.length > 0 &&
                docStatus[0].cancelSeq !== '' &&
                docStatus[0].currSequence !== '3' && (
                  <ButtonComponent
                    type="danger"
                    text="PO Cancel"
                    onClick={() => addprevRemarksSubmit(docStatus[0].cancelSeq)}
                  />
                )}
              <Popuptable
                onClose={() => setPrevRemarksCard(false)}
                cardLabel=""
                component={AddRemarksprevComponent(
                  docStatus && docStatus.length > 0 ? docStatus[0].cancelSeq : '',
                )}
                visible={prevRemarksCard}
              />
              <span style={{ margin: '0 8px' }} />
              {rowData.isApproved === '1' ? (
                <ButtonComponent type="primary" text="PO Export" onClick={() => downloadreport()} />
              ) : null}
            </div>
          )}
        </Card>
      </Skeleton>
      {console.log(paymentData, 'paymentData')}
      {paymentLoading && (
        <PaymentTermsPopUp
          resp={paymentData}
          isLoading={paymentLoading}
          onCancel={handleCancelDtlsBtnInward}
          projectList={projectList}
          indexVal={indexVal}
          Multiselect={grnData}
          PoCostType={poCostType}
          gst={pendingGstValue}
          igst={
            poform.getFieldValue('IGST')
              ? (
                  Number(
                    poform
                      .getFieldValue('IGST')
                      .toString()
                      .replace(/,/g, ''),
                  ) * 2
                ).toString()
              : '0'
          }
          po={poform.getFieldValue('subtotal')}
        />
      )}
    </div>
  )
}

export default Poimport
