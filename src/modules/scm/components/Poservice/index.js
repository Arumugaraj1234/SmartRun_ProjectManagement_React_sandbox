import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Form,
  Input,
  DatePicker,
  message,
  Skeleton,
  Popover,
  Button,
  Space,
  Select,
  AutoComplete,
  Checkbox,
  Upload,
  Row,
  Col,
  InputNumber,
} from 'antd'
import store from 'store'
import moment from 'moment'
import { CommentOutlined, UploadOutlined } from '@ant-design/icons'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from 'components/shared/ButtonComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import convertNumberToWords from '../../../../_helpers/convertToWords'
import PaymentTermsPopUp from '../PoPaymentTermsPopUp'
import {
  indentFileUpload,
  commongetmethod,
} from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../style.scss'
import '../../../style.scss'

const Poservice = ({ rowData, onClose, calldetailapi, isView }) => {
  const { Option } = Select
  const Menulistdata = store.get('MenuListData')
  // const [rupestext, setRupeesText] = useState('')
  // const [totalamount, setTotalAmount] = useState('')
  const [poform] = Form.useForm()
  const [projectList, setProjectList] = useState([])
  const [potabel, setPoTable] = useState([])
  const [paymentterms, setPaymentTerms] = useState([])
  const [docStatus, setDocStatus] = useState([])
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [inputForm] = Form.useForm()
  const [debitForm] = Form.useForm()
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
  const [selectedGST, setSelectedGST] = useState('GST')
  const [isGstUpdated, setIsGstUpdated] = useState(false)
  const [oldGstValue, setOldGstValue] = useState('')
  const [poGstValue, setPoGstValue] = useState(0)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentData, setPaymentData] = useState([])
  const [indexVal, setIndexValue] = useState('')
  const [grnData, setGrnData] = useState([])
  const [mainEntity, setMainEntity] = useState({})
  const [prevEntity, setPrevEntity] = useState({})
  const [prevpoTable, setPrevPoTable] = useState([])
  const [gstType, setGstType] = useState('')
  const [poCostType, setPoCostType] = useState([])
  const [reasonList, setReasonList] = useState([])
  const [selectedReasonObj, setSelectedReasonObj] = useState(null)
  const [fileList, setFileList] = useState([])
  const [isDebitClicked, setIsDebitClicked] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [transportValue, setTransportValue] = useState('0.000')
  const [pfValue, setPfValue] = useState('0.000')
  const [insuranceValue, setInsuranceValue] = useState('0.000')
  const [otherValue, setOtherValue] = useState('0.000')
  const [gstValue, setGstValue] = useState(null)
  const [pendingGstValue, setPendingGstValue] = useState('0.000')
  const projectId = store.get('ProjectID')
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
    setRmkDetaillist([])
    getType()
    getInspectionList()
    getdivisionList()
    getDispatchlist()
    getInsuranceList()
  }, [rowData])

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const Tab = store.get('Tab')
  const HighlightStyle = { border: '2px solid blue', borderRadius: '3px', width: '100%' }
  const getPoDetails = async () => {
    setIsLoading(true)
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
      setPoTable(response?.responseData[0]?.poDtl || [])
      setPrevPoTable(response?.responseData[1]?.poDtl || [])
      setRmkDetaillist(response?.responseData[0]?.poStatusList)
      setReasonList(response?.responseData[0]?.debitNoteReasonList)
      setDocStatus(response?.responseData[0]?.docLifeCycleMstList)
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

      setPaymentTerms([...response?.responseData[0]?.poPaymentTerm, emptyPaymentTerms])
      if (response?.responseData[0].isEditable === '1') {
        setComponentDisabled(false)
      } else {
        setComponentDisabled(true)
      }
      const amountInWord = convertNumberToWords(parseInt(response?.responseData[0]?.totalValue, 10))
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
        revision:
          Number(response?.responseData[0]?.revision) > 0
            ? response?.responseData[0]?.revision
            : '',
        revisionDate:
          Number(response?.responseData[0]?.revision) > 0
            ? moment(response?.responseData[0]?.revisionDate, 'YYYY-MM-DD')
            : '',
        refDate: moment(response?.responseData[0]?.refDate, 'YYYY-MM-DD') || '',
        refNo: response?.responseData[0]?.refNo || '',
        deliveryDate: moment(response?.responseData[0]?.deliveryDate, 'YYYY-MM-DD') || '',
        PaymentTerms: 'Mentioned Below',
        deliveryTerms: response?.responseData[0]?.deliveryTerms || '',
        LiquidatedDamages: response?.responseData[0]?.liqDamages,
        pan: response?.responseData[0]?.pan,
        ranDivCommte: response?.responseData[0]?.ranDivCommte,
        Warranty: response?.responseData[0]?.warrenty,
        guarantee: response?.responseData[0]?.guarantee,
        dispatchMode: response?.responseData[0]?.dispatchModeDesc,
        priceBasis: response?.responseData[0]?.priceBasis,
        Insurance: response?.responseData[0]?.transitInsuranceDesc,
        Inspection: response?.responseData[0]?.Inspection || '',

        // Enclosure below fields
        CTC: formatValue2(response?.responseData[0]?.ctc),
        TDC: formatValue2(response?.responseData[0]?.tdc),
        TDS: formatValue2(response?.responseData[0]?.tds),
        QAP: formatValue2(response?.responseData[0]?.qap),
        DWGS: response?.responseData[0]?.dwgs,
        GTC: formatValue2(response?.responseData[0]?.gtc),
        POTC: response?.responseData[0]?.poTC,
        subtotal: formatValue2(response?.responseData[0]?.basicTotal),
        lessdiscounts: formatValue2(response?.responseData[0]?.discount),
        documentcharges: response?.responseData[0]?.docCharges,
        inspectioncharges: response?.responseData[0]?.inspectionCharges,
        pf: formatValue2(response?.responseData[0]?.pf),
        frieght: formatValue2(response?.responseData[0]?.frieght),
        transportCharges: formatValue2(response?.responseData[0]?.transportCharges || 0),
        others: formatValue2(response?.responseData[0]?.others),
        gst: formatValue2(parseFloat(response?.responseData[0]?.gst) / 2 || '0'),
        IGST: formatValue2(parseFloat(response?.responseData[0]?.igst) || '0'),
        sgst: formatValue2(parseFloat(response?.responseData[0]?.gst) / 2 || '0'),
        cess: formatValue2(response?.responseData[0]?.cess),
        terminalTax: formatValue2(response?.responseData[0]?.terminalTax),
        Total: formatValue2(response?.responseData[0]?.totalValue),
        taxablevalue: response?.responseData[0]?.taxableValue || '0',
        insurancevalue: response?.responseData[0]?.insuranceValue,
        testingcharges: response?.responseData[0]?.testingCharges,
        specialremarks: response?.responseData[0]?.remarks,
        amountInWords: amountInWord,
      })
      setGstType(response?.responseData[0]?.gstType)
      if (response?.responseData[0].isEditable === '1') {
        if (response?.responseData[0]?.gstType === '1') {
          setSelectedGST('GST')
          setGstValue(parseFloat(response?.responseData[0]?.gst))
          setPendingGstValue(parseFloat(response?.responseData[0]?.pendingGst))
          setOldGstValue(parseFloat(response?.responseData[0]?.gst))
        }
        if (response?.responseData[0]?.gstType === '2') {
          setSelectedGST('IGST')
          setGstValue(parseFloat(response?.responseData[0]?.igst))
          setPendingGstValue(parseFloat(response?.responseData[0]?.pendingGst))
          setOldGstValue(parseFloat(response?.responseData[0]?.igst))
        }
        if (response?.responseData[0]?.gstType === '3') {
          if (Number(response?.responseData[0]?.gst) <= 0) {
            setSelectedGST('IGST')
            setGstValue(parseFloat(response?.responseData[0]?.igst))
            setPendingGstValue(parseFloat(response?.responseData[0]?.pendingGst))
            setOldGstValue(parseFloat(response?.responseData[0]?.igst))
          } else {
            setSelectedGST('GST')
            setGstValue(parseFloat(response?.responseData[0]?.gst))
            setPendingGstValue(parseFloat(response?.responseData[0]?.pendingGst))
            setOldGstValue(parseFloat(response?.responseData[0]?.gst))
          }
        }
      }
      if (response?.responseData[0].isEditable !== '1') {
        if (Number(response?.responseData[0]?.gst) <= 0) {
          setSelectedGST('IGST')
          setGstValue(parseFloat(response?.responseData[0]?.igst))
          // const y = parseFloat(response?.responseData[0]?.igst)
        } else {
          setSelectedGST('GST')
          // const x = parseFloat(response?.responseData[0]?.gst)
          setGstValue(parseFloat(response?.responseData[0]?.gst))
        }
      }
      onLoadCalculation(response?.responseData[0])
    }

    setIsLoading(false)
    // calculatetotal()
  }

  const debitNoteSubmit = async () => {
    const valueForDebitNote = debitForm.getFieldValue('valueForDebitNote')

    console.log('Value for Debit Note', valueForDebitNote)
    console.log('PO Form', Object.keys(debitForm.getFieldsValue()))

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

  const getType = async () => {
    setIsLoading(true)
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
  const gstOnChangeValue = (value, index) => {
    const updatedItems = [...potabel]
    // if (index === 0) {
    //   updatedItems = updatedItems.map(item => ({
    //     ...item,
    //     poGst: value,
    //   }))
    // } else {
    updatedItems[index] = { ...updatedItems[index], poGst: value }
    // }
    setPoTable(updatedItems)
    //  After the poTable changes the useEffect handles the GST calculation
    calculateGstTotal(updatedItems)
    updatedItems.forEach(item => {
      poform.setFieldsValue({ [`gst_${item.poDtlId}`]: item.poGst })
    })
  }

  // const handleUploadChange = ({ filelist }) => {
  //   setFileList(filelist)
  // }
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

  const columns = [
    {
      title: 'S.No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: (
        <span>
          {' '}
          Service Number<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'serviceNo',
      key: 'serviceNo',
      render: (text, record, index) => (
        <Form.Item name={`serviceno_${record.poDtlId}`} initialValue={record.serviceNo}>
          <Input
            placeholder="Type here"
            style={Potablechanged('serviceNo', index) ? HighlightStyle : {}}
          />
        </Form.Item>
      ),
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
      title: (
        <span>
          {' '}
          Material Description <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'materialDesc',
      key: 'materialDesc',
      render: (text, record, index) => (
        <Form.Item name={`materialdesc_${record.poDtlId}`} initialValue={record.materialDesc}>
          <Input
            placeholder="Type here"
            style={Potablechanged('materialDesc', index) ? HighlightStyle : {}}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      render: (text, record) => <div>{record.indentDtlList[0]?.specification}</div>,
    },
    {
      title: (
        <span>
          {' '}
          SAC code <strong style={{ color: 'red' }}>*</strong>
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
    {
      title: 'GST',
      dataIndex: 'poGst',
      key: 'poGst',
      render: (text, record, index) => (
        <Form.Item name={`gst_${record.poDtlId}`} initialValue={Number(record.poGst)}>
          <Select
            style={{ width: '150px' }}
            options={[
              { value: 0, label: '0' },
              { value: 5, label: '5' },
              { value: 7, label: '7' },
              { value: 12, label: '12' },
              { value: 18, label: '18' },
              { value: 28, label: '28' },
            ]}
            onChange={value => gstOnChangeValue(value, index)}
            // onChange={value => {
            //   let updatedItems = [...potabel]

            //   if (index === 0) {
            //     updatedItems = updatedItems.map(item => ({
            //       ...item,
            //       poGst: value,
            //     }))
            //   } else {
            //     updatedItems[index] = { ...updatedItems[index], poGst: value }
            //   }
            //   setPoTable(updatedItems)
            //   updatedItems.forEach(item => {
            //     poform.setFieldsValue({ [`gst_${item.poDtlId}`]: item.poGst })
            //   })
            // }}
          />
        </Form.Item>
      ),
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
  ]
  // {paymentterms.map(item => (
  //   <div key={item.potId} style={{ display: 'flex', flexDirection: 'column' }}>
  //     {`${item.potId} - ${item.percentage}% ${item.remarks}`}
  //   </div>
  // ))}
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
      render: (text, record) => <span>{Math.round(parseFloat(record.paymentAmount))}</span>,
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
      render: (text, record, index) =>
        (record.isLast === '0' && Math.round(parseFloat(record.pendingAmount)) >= 1) ||
        (record.isLast === '1' &&
          (Math.round(parseFloat(pendingGstValue)) !== 0 ||
            Math.round(parseFloat(transportValue)) !== 0 ||
            Math.round(parseFloat(otherValue)) !== 0 ||
            Math.round(parseFloat(pfValue)) !== 0 ||
            Math.round(parseFloat(insuranceValue)) !== 0 ||
            Math.round(parseFloat(record.pendingAmount)) >= 1)) ? (
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
              PRA No :<b> {record.praCode} </b>
            </span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
              PRA Date :{' '}
              <b>{record.praDate !== '0' ? moment(record.praDate).format('DD-MMM-YYYY') : ''} </b>
            </span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>
              PRA Status:<b> {record.documentStatus} </b>
            </span>
          </div>
        ),
    },
  ]

  const handleDetail = (data, i) => {
    setPaymentLoading(true)
    setPaymentData(data)

    if (i === paymentterms.slice(0, -1).length - 1) {
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

  const handleCancelDtlsBtnInward = () => {
    setPaymentLoading(false)
    getPoDetails()
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

    if (typeof value !== 'string') {
      value = String(value)
    }

    const valuse = value.replace(/,/g, '')
    return valuse
  }
  const amountonchange = () => {
    calculatetotal()
    const formvalues = poform.getFieldsValue()
    poform.setFieldsValue({
      taxablevalue: getFormattedValue(formvalues.taxablevalue),
      pf: getFormattedValue(formvalues.pf),
      // frieght: getFormattedValue(formvalues.frieght),
      transportCharges: getFormattedValue(formvalues.transportCharges),
      // sgst: getFormattedValue(formvalues.sgst),
      gst: getFormattedValue(formvalues.gst),
      cess: getFormattedValue(formvalues.cess),
      others: getFormattedValue(formvalues.others),
      // terminalTax: getFormattedValue(formvalues.terminalTax),
      lessdiscounts: getFormattedValue(formvalues.lessdiscounts),
      // QAP: getFormattedValue(formvalues.QAP),
      // GTC: getFormattedValue(formvalues.GTC),
    })
  }
  const calculateGstTotal = potabelData => {
    let totalGstAmount = 0
    let totalAmount = 0
    // Loop through each item in table
    potabelData.forEach(item => {
      const baseAmount = parseFloat(item.totalValue) || 0 // base value
      const gstPercent = parseFloat(item.poGst) || 0 // GST %

      // Calculate GST for this item
      const gstForItem = (baseAmount * gstPercent) / 100

      totalAmount += baseAmount
      // Add it to total GST
      totalGstAmount += gstForItem
    })

    // After calculating total GST
    // const sgst = totalGstAmount / 2;
    // const cgst = totalGstAmount / 2;

    // Set values (assuming you have setters)
    console.log(totalGstAmount, 'total gst amount', totalAmount, 'total basic amount')
    console.log('Payment Terms', paymentterms)
    poform.setFieldsValue({ Total: totalAmount + totalGstAmount })
    setIsGstUpdated(true)
    setOldGstValue(gstValue)
    setGstValue(0)
    setGstValue(totalGstAmount)
    setPoGstValue(totalGstAmount)
    console.log(poGstValue, 'po gst value')
    // setSgstValue(sgst);
    // setCgstValue(cgst);
  }
  const calculatetotal = () => {
    const formvalues = poform.getFieldsValue()
    // Function to remove commas from string

    const fieldsToSum = [
      'subtotal',
      // 'taxablevalue',
      // 'frieght',
      'pf',
      'transportCharges',
      // 'gst',
      // 'gst',
      // 'IGST',
      // 'terminalTax',
      // 'cess',
      'others',
    ]
    const total = fieldsToSum.reduce((accumulator, fieldName) => {
      let fieldValue = formvalues[fieldName]
      if (fieldValue === '' || fieldValue === undefined || fieldValue === null) {
        fieldValue = '0' // Replace empty string with "0"
      }
      fieldValue = parseInt(removeCommas(fieldValue), 0) || 0
      return accumulator + fieldValue
    }, 0)
    // Ensure lessdiscounts is initialized to 0 if it's not set
    let lessDiscounts = formvalues.lessdiscounts
    if (lessDiscounts === '') {
      lessDiscounts = '0' // Replace empty string with "0"
    }
    lessDiscounts = parseFloat(removeCommas(lessDiscounts)) || 0
    let Taxablevalue = total - lessDiscounts
    if (Taxablevalue < 0) {
      Taxablevalue = 0
    }

    // Calculate the final total
    const CESSvalue = formvalues.cess
    let finalTotal =
      total - lessDiscounts + Number(gstValue) + parseInt(removeCommas(CESSvalue), 0) || 0
    if (finalTotal < 0) {
      finalTotal = 0
    }

    // Convert finalTotal to words and update form fields
    const amountInWord = convertNumberToWords(parseInt(finalTotal, 10))

    // Reformat finalTotal with commas
    const finalTotalWithCommas = finalTotal.toLocaleString('en-IN')

    poform.setFieldsValue({
      amountInWords: amountInWord,
      Total: finalTotalWithCommas, // Set the formatted total with commas
      terminalTax: Taxablevalue.toLocaleString('en-IN'),
    })
  }
  const onLoadCalculation = data => {
    const TerminalTax =
      Number(data.basicTotal || 0) +
      Number(data.transportCharges || 0) +
      Number(data.pf || 0) +
      Number(data.others || 0) -
      Number(data.discount || 0)

    let gstvalue = 0
    if (Number(data.gst) <= 0) {
      gstvalue = data.igst
    } else {
      gstvalue = data.gst
    }
    const total = Number(TerminalTax || 0) + Number(gstvalue || 0) + Number(data.cess || 0)
    const amountInWord = convertNumberToWords(parseInt(total, 10))
    poform.setFieldsValue({
      amountInWords: amountInWord,
      Total: total.toLocaleString('en-IN'),
      terminalTax: TerminalTax.toLocaleString('en-IN'),
    })
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
    readOnly,
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
        readOnly={readOnly}
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
        // await updatePoSeqAndStatus(seq, type)
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
          materialDesc: formvalues[`materialdesc_${item.poDtlId}`] || '',
          serviceNo: formvalues[`serviceno_${item.poDtlId}`] || '',
          hsnCode: formvalues[`hsnCode_${item.poDtlId}`] || '',
          poGst: formvalues[`gst_${item.poDtlId}`] || '0',
          deliveryDate: moment(formvalues[`deliverydate_${item.poDtlId}`]).format('YYYY-MM-DD'),
        }
      })
      // const valuse = formvalues.gst.replace(/,/g, '')
      // const totalgst = (valuse * 2).toLocaleString('en-IN')

      const HsnCode = updatedTableData.filter(
        data => data.hsnCode !== '' && data.materialDesc !== '' && data.serviceNo !== '',
      )
      const isHsncode = HsnCode.length === updatedTableData.length ? 'true' : 'false'
      // const paymenttermsWithoutLast = paymentterms.slice(0, -1)
      const paymenttermsWithoutLast = paymentterms.slice(0, -1).map(item => ({ ...item }))
      console.log('paymenttermsWithoutLast', paymenttermsWithoutLast)

      const payload = {
        poId: projectList[0].poId,
        igScpId: projectList[0].igScpId,
        indentID: projectList[0].indentID,
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
        isGstChanged: isGstUpdated,
        oldGst: oldGstValue,
        division: formvalues.Division,
        orderNo: formvalues.OrderNumber,
        date: moment(formvalues.Date).format('YYYY-MM-DD'),
        revision:
          formvalues.revision !== '' &&
          formvalues.revision !== null &&
          formvalues.revision !== undefined
            ? formvalues.revision
            : '0',
        revisionDate: formvalues.revisionDate
          ? moment(formvalues.revisionDate).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        refDate: moment(formvalues.refDate).format('YYYY-MM-DD'),
        refNo: projectList[0]?.refNo || '',
        deliveryDate: moment(formvalues.deliveryDate).format('YYYY-MM-DD'),
        deliveryTerms: formvalues.deliveryTerms,
        liqDamages: formvalues.LiquidatedDamages,
        ranDivCommte: formvalues.ranDivCommte,
        pan: formvalues.pan,
        guarantee: formvalues.guarantee,
        warrenty: formvalues.Warranty,
        dispatchMode: formvalues.dispatchMode,
        priceBasis: formvalues.priceBasis,
        transitInsurance: formvalues.Insurance,
        inspectionScope: formvalues.Inspection,
        misc: projectList[0].misc,
        portOfDest: projectList[0].portOfDest,
        remarks: formvalues.specialremarks,
        discount: removeCommas(formvalues.lessdiscounts) || '0',
        frieght: removeCommas(formvalues.frieght) || '0',
        transportCharges: removeCommas(formvalues.transportCharges) || '0',
        others: removeCommas(formvalues.others) || '0',
        basicTotal: removeCommas(formvalues.subtotal) || '0',
        gst: selectedGST === 'GST' ? gstValue.toString() : '0',
        igst: selectedGST === 'IGST' ? gstValue.toString() : '0',
        terminalTax: removeCommas(formvalues.terminalTax) || '0',

        cess: removeCommas(formvalues.cess) || '0',
        totalValue: removeCommas(formvalues.Total),
        frieghtRemarks: projectList[0].frieghtRemarks,
        poTC: removeCommas(formvalues.POTC) || '',
        dwgs: removeCommas(formvalues.DWGS) || '',
        qap: removeCommas(formvalues.QAP) || '0',
        gtc: removeCommas(formvalues.GTC) || '0',
        docCharges: formvalues.documentcharges,
        inspectionCharges: formvalues.inspectioncharges,
        insuranceValue: formvalues.insurancevalue,
        testingCharges: formvalues.testingcharges,
        ctc: removeCommas(formvalues.CTC) || '0',
        tdc: removeCommas(formvalues.TDC) || '0',
        tds: removeCommas(formvalues.TDS) || '0',
        tenantId: projectList[0].tenantId,
        sequenceNo: projectList[0].sequenceNo,
        sequenceStatus: projectList[0].sequenceStatus,
        vendorCode: projectList[0].vendorCode,
        poCode: projectList[0].poCode,
        poDtl: updatedTableData,
        amountinwords: formvalues.amountInWords,
        poPaymentTerm: paymenttermsWithoutLast,
        poDispatchDoc: projectList[0].poDispatchDoc,
        poStatusList: projectList[0].poStatusList,
        docLifeCycleMstList: projectList[0].docLifeCycleMstList,
        pf: removeCommas(formvalues.pf) || '0',
        pFRemarks: '',
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
        } else {
          messageReturn(405)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false)
        }
      })
    })
  }

  const gstChange = type => {
    if (gstType === '3') {
      if (type === 'GST') {
        setSelectedGST('GST')
        poform.setFieldValue({
          gst: gstValue / 2,
          IGST: 0,
        })
      }
      if (type === 'IGST') {
        setSelectedGST('IGST')
        poform.setFieldsValue({
          gst: 0,
          IGST: gstValue,
        })
      }
    }
  }

  const downloadreport = async () => {
    const reqdata = {
      key: 'poService',
      poId: rowData.poId,
      poType: 'Service',
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
      // 'revision',
      // 'revisionDate',
      'guarantee',
      // 'priceBasis',
      'refDate',
      // 'deliveryDate',
      // 'deliveryTerms',
      'LiquidatedDamages',
      'Warranty',
      'dispatchMode',
      // 'Insurance',
      // 'Inspection',
      'specialremarks',
      'CTC',

      // 'POTC',GTCDWGS
      'DWGS',
      'Total',
      'GTC',
      'DWGS',
      'QAP',
      'TDS',
      'TDC',
      // 'ranDivCommte',
      // 'pan',
      // 'priceBasis',
      'guarantee',
    ]

    // const missingFields = mandatoryFields.filter(field => !values[field])
    // if (missingFields.length > 0) {
    //   missingFields.forEach(field => field)
    // }

    return mandatoryFields.every(field => values[field])
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
  return (
    <div className="mt-3">
      <Skeleton loading={isLoading} active>
        <Card title="Purchase Order - Service" className="customize">
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
                  <h5>BUYER / BILLING ADDRESS</h5>
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
                  {/* <h5>SHIPPING ADDRESS</h5> */}
                  <Form.Item
                    name="AddressType"
                    label={
                      <h5 style={{ marginBottom: '0px' }}>
                        SHIPPING ADDRESS<span style={{ color: 'red' }}>*</span>
                      </h5>
                    }
                    // initialValue={dclist[0]?.dcCode}
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleDcChange}
                      // disabled={false}
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
                  <h5 className="mb-3">PURCHASE ORDER</h5>
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
                    readOnly
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
                  <CustomFormItem
                    name="revision"
                    disabled
                    label={<span style={{ textAlign: 'center' }}>Revision</span>}
                    NewChange={isFieldValueChanged('revision')}
                  />
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="revisionDate"
                    label={<span style={{ textAlign: 'center' }}>Revision Date</span>}
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      style={
                        isFieldValueChanged('revisionDate') ? HighlightStyle : { width: '100%' }
                      }
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="refDate"
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
                    label={<span style={{ textAlign: 'center' }}>Ref No.</span>}
                    disabled
                    NewChange={isFieldValueChanged('refNo')}
                  />
                  <CustomFormItem
                    name="ranDivCommte"
                    label={<span style={{ textAlign: 'center' }}>Ran/Div/Commte</span>}
                    NewChange={isFieldValueChanged('ranDivCommte')}
                  />
                  <CustomFormItem
                    name="pan"
                    label={<span style={{ textAlign: 'center' }}>PAN</span>}
                    NewChange={isFieldValueChanged('pan')}
                  />
                </div>
                <div className="col-md-5">
                  <CustomFormItem
                    name="deliveryTerms"
                    label={<span style={{ textAlign: 'center' }}>Delivery Terms</span>}
                    NewChange={isFieldValueChanged('deliveryTerms')}
                  />
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
                    name="guarantee"
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

                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="dispatchMode"
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
                          [`dispatchMode`]: e,
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
                  <CustomFormItem
                    name="priceBasis"
                    label={<span style={{ textAlign: 'center' }}>Price Basis</span>}
                    NewChange={isFieldValueChanged('priceBasis')}
                  />
                  <Form.Item
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    name="Insurance"
                    label={<span style={{ textAlign: 'center' }}>Transit Insurance</span>}
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
                    <CustomFormItem
                      name="CTC"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          1. CTC <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('ctc')}
                    />
                    <CustomFormItem
                      name="TDC"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          2. TDC <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('tdc')}
                    />
                    <CustomFormItem
                      name="TDS"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          3. TDS <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('tds')}
                    />
                    <CustomFormItem
                      name="QAP"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          4. QAP <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('qap')}
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
                    <CustomFormItem
                      name="GTC"
                      label={
                        <span style={{ textAlign: 'center' }}>
                          6. GTC <span style={{ color: 'red' }}> *</span>
                        </span>
                      }
                      type="text"
                      NewChange={isFieldValueChanged('gtc')}
                    />

                    {/* <CustomFormItem name="QAP" label="3.QAP" onChange={amountonchange} />
                    <CustomFormItem name="GTC" label="4.GTC" onChange={amountonchange} /> */}
                    <div className="shipping_section">
                      <h5>
                        SPECIAL REMARKS<span style={{ color: 'red' }}> *</span>
                      </h5>
                      <Form.Item name="specialremarks">
                        <TextArea
                          className="custom-input"
                          style={
                            isFieldValueChanged('remarks') ? HighlightStyle : { width: '100%' }
                          }
                        />
                      </Form.Item>
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
                          <Table
                            dataSource={paymentterms.slice(0, -1)}
                            columns={paymentTermColumns}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                          isFieldValueChanged('amountinwords') ? HighlightStyle : { width: '100%' }
                        }
                      />
                    </Form.Item>
                  </div>
                  <CustomFormItem
                    onChange={amountonchange}
                    name="subtotal"
                    label="SUB TOTAL"
                    disabled
                    type="text"
                    NewChange={isFieldValueChanged('basicTotal')}
                  />
                  <CustomFormItem
                    onChange={amountonchange}
                    name="lessdiscounts"
                    label="Discount"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('discount')}
                  />
                  <CustomFormItem
                    onChange={amountonchange}
                    name="transportCharges"
                    label="Transport Charges"
                    placeholder="0.00"
                    type="text"
                    disabled
                    NewChange={isFieldValueChanged('transportCharges')}
                  />
                  <CustomFormItem
                    onChange={amountonchange}
                    name="pf"
                    label="P & F"
                    placeholder="0.00"
                    type="text"
                    disabled
                    NewChange={isFieldValueChanged('pf')}
                  />
                  {/* <CustomFormItem
                    onChange={amountonchange}
                    name="frieght"
                    label="Frieght"
                    placeholder="0.00"
                    type="text"
                  /> */}
                  {/* <CustomFormItem
                    onChange={amountonchange}
                    name="others"
                    label="Others"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('others')}
                  /> */}
                  <CustomFormItem
                    // onChange={amountonchange}
                    disabled
                    name="terminalTax"
                    label="Taxable Value"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('terminalTax')}
                  />
                  {/* <CustomFormItem
                    onChange={amountonchange}
                    name="gst"
                    label={`SGST ${Menulistdata[0].currency}`}
                    placeholder="0.00"
                    type="text"
                    disabled
                  />
                  <CustomFormItem
                    onChange={amountonchange}
                    name="gst"
                    label={`CGST ${Menulistdata[0].currency}`}
                    placeholder="0.00"
                    type="text"
                    disabled
                  /> */}
                  <Checkbox
                    style={{ position: 'relative', top: '30px', left: '-30px' }}
                    disabled={false}
                    onClick={() => gstChange('GST')}
                    checked={selectedGST === 'GST'}
                  />{' '}
                  <Form.Item
                    name="gst"
                    label={`SGST ${Menulistdata[0].currency}`}
                    onChange={amountonchange}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <Input
                        value={formatValue2(selectedGST === 'GST' ? gstValue / 2 : 0)}
                        className="custom-input"
                        disabled
                        style={isFieldValueChanged('gst') ? HighlightStyle : { width: '100%' }}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="gst"
                    label={`CGST ${Menulistdata[0].currency}`}
                    onChange={amountonchange}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <Input
                        value={formatValue2(selectedGST === 'GST' ? gstValue / 2 : 0)}
                        className="custom-input"
                        disabled
                        style={isFieldValueChanged('gst') ? HighlightStyle : { width: '100%' }}
                      />
                    </div>
                  </Form.Item>
                  <Checkbox
                    style={{ position: 'relative', top: '30px', left: '-30px' }}
                    disabled={false}
                    onClick={() => gstChange('IGST')}
                    checked={selectedGST === 'IGST'}
                  />
                  <Form.Item
                    name="IGST"
                    label={`IGST ${Menulistdata[0].currency}`}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <Input
                        value={formatValue2(selectedGST === 'IGST' ? gstValue : 0)}
                        className="custom-input"
                        disabled
                        style={isFieldValueChanged('igst') ? HighlightStyle : { width: '100%' }}
                      />
                    </div>
                  </Form.Item>
                  <CustomFormItem
                    onChange={amountonchange}
                    name="cess"
                    label="CESS"
                    placeholder="0.00"
                    type="text"
                    NewChange={isFieldValueChanged('cess')}
                  />
                  <CustomFormItem
                    name="Total"
                    label="Total"
                    // value={totalamount}
                    placeholder="0.00"
                    type="text"
                    disabled
                    NewChange={isFieldValueChanged('totalValue')}
                  />
                </div>
              </div>
            </Card>
          </Form>
          {/* when currSequence is 3 po was cancelled */}
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
              {/* when currSequence is 3 po was cancelled */}
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
      {paymentLoading && (
        <PaymentTermsPopUp
          resp={paymentData}
          isLoading={paymentLoading}
          onCancel={handleCancelDtlsBtnInward}
          projectList={projectList}
          indexVal={indexVal}
          Multiselect={grnData}
          PoCostType={poCostType}
          gst={(poform.getFieldValue('gst').replace(/,/g, '') * 2).toString()}
          igst={poform.getFieldValue('IGST')}
          po={poform.getFieldValue('subtotal')}
        />
      )}
    </div>
  )
}
export default Poservice
