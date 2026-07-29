import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import {
  Card,
  Form,
  Input,
  Col,
  Divider,
  Select,
  DatePicker,
  Space,
  Popover,
  message,
  Skeleton,
  Button,
  Spin,
  Table,
} from 'antd'
import { CommentOutlined, DownloadOutlined } from '@ant-design/icons'
import TableComponent from 'components/common/TableComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'

import './style.scss'
import '../../../style.scss'
import messageReturn from '_helpers/messageReturn'

const SupCompState = ({
  hdrId,
  indentType,
  subAssy,
  station,
  indentId,
  scsStatus,
  totalcost,
  finalcost,
  indentcode,
  onmodalCancel,
  ProcessCode1,
}) => {
  const [allPropForm] = Form.useForm()
  const [percentForm] = Form.useForm()
  const [paytermForm] = Form.useForm()
  const [tableform] = Form.useForm()
  const [inputForm] = Form.useForm()
  const { Option } = Select
  const { TextArea } = Input
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const Tab = store.get('Tab')
  const pmHdrId = store.get('ProjectID')
  const enquiryId = store.get('enquiryId')
  const Menulistdata = store.get('MenuListData')
  const { docTypeCode, mstId, processCode } = Tab

  const [scmretrievaldata, setScmretrievaldata] = useState([])
  const [vendorQuafylst, setVendorQuafylst] = useState(null)
  const [scmHdrdata, setScmHdrdata] = useState([])
  const [priceTable, setPriceTable] = useState([])
  const [vendorlist, setVendorlist] = useState([])
  const [country1, setCountry1] = useState('')
  const [country2, setCountry2] = useState('')
  const [country3, setCountry3] = useState('')
  const [currencyTypeL1, setCurrencyTypeL1] = useState('')
  const [currencyTypeL2, setCurrencyTypeL2] = useState('')
  const [currencyTypeL3, setCurrencyTypeL3] = useState('')
  const [countryL1, setCountryL1] = useState(true)
  const [countryL2, setCountryL2] = useState(true)
  const [countryL3, setCountryL3] = useState(true)
  const [paymttermvisible1, setPaymttermvisible1] = useState(false)
  const [paymttermvisible2, setPaymttermvisible2] = useState(false)
  const [paymttermvisible3, setPaymttermvisible3] = useState(false)
  const [paymenttermdatal1, setPaymenttermdatal1] = useState([])
  const [paymenttermdatal2, setPaymenttermdatal2] = useState([])
  const [paymenttermdatal3, setPaymenttermdatal3] = useState([])
  const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [scpVendorDataList, setScpVendorDataList] = useState([])
  const [docStatus, setDocStatus] = useState([])
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [poPaymentTerm, setPoPaymentTerm] = useState([])
  const [praAmount, setPraAmount] = useState()
  const [isPraCreated, setIsPraCreated] = useState(false)
  const [vendorQualified, setVendorQualified] = useState('')
  const [prevRemarksCard, setPrevRemarksCard] = useState(false)
  const [isEditable, setIsEditable] = useState('0')
  const [formdisable, setFormdisable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isdisablebtn, setIsdisablebtn] = useState(false)
  const [igscpId, setIgscpId] = useState('')
  const [isOverDue, setIsOverDue] = useState(false)
  const [vendorQualify, setVendorQualify] = useState([])
  const [l1VendorUniqueCode, setL1VendorUniqueCode] = useState('')
  const [l2VendorUniqueCode, setL2VendorUniqueCode] = useState('')
  const [l3VendorUniqueCode, setL3VendorUniqueCode] = useState('')
  const [partnummodal, setPartnumModal] = useState(false)
  const [ProductCostdetails, setProductCostDetails] = useState([])
  const [finalVal, setFinalVal] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  // eslint-disable-next-line no-unused-vars
  let updatedPriceTable = []
  // const [baseTabVal, setBaseTabVal] = useState(null)
  // const [vendorShort, setVendorShort] = useState(0)

  const emptyPaymentTerms = {
    igScpVpt: '',
    igScpId: '',
    level: '',
    term: '',
    percentage: '',
    remarks: '',
  }
  useEffect(() => {
    getvendordropdown()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      await getscsretrievaldata()
      await getvendordropdown()
    }
    fetchData()
    getscshdrleveldata()
  }, [indentId])

  useEffect(() => {
    // If poPaymentTerm is not present or empty, simply set praAmount to 0.
    if (!poPaymentTerm || poPaymentTerm.length === 0) {
      setPraAmount(0)
      return
    }
    console.log(praAmount)

    // Compute the sum of (pendingAmount - payableAmount) for each element.
    const total = poPaymentTerm.reduce((accumulator, currentItem) => {
      const pending = parseFloat(currentItem.pendingAmount || 0)
      const payable = parseFloat(currentItem.paymentAmount || 0)
      return accumulator + (payable - pending)
    }, 0)
    console.log('Total PRA', total)

    const isCreated = poPaymentTerm.some(item => item.isCreated === '1')
    setIsPraCreated(isCreated)
    console.log('isPraCreated', isPraCreated)
    // Update the praAmount state.
    setPraAmount(total)
  }, [poPaymentTerm]) // This effect runs every time poPaymentTerm changes

  const getscshdrleveldata = async () => {
    const props = {
      indentId,
      tenantId,
      processCode: ProcessCode1 === '8' ? ProcessCode1 : '5',
    }

    const httpgethdrdetails = await IndentGroupgetDetails({
      requestPath: 'getIndentByIndentID',
      requestData: props,
    })
    if (httpgethdrdetails) {
      setScmHdrdata(httpgethdrdetails.responseData)
    }
  }

  useEffect(() => {
    const pjsDueDate =
      scmHdrdata && scmHdrdata.length > 0
        ? moment(scmHdrdata[0].expDeliveryDate).format('YYYY-MM-DD')
        : ''

    if (scpVendorDataList && scmHdrdata && scpVendorDataList.length > 0 && scmHdrdata.length > 0) {
      const l1DelDate =
        vendorQuafylst === 'L1'
          ? scpVendorDataList?.[0]?.l1DeliveryDate
          : vendorQuafylst === 'L2'
          ? scpVendorDataList?.[0]?.l2DeliveryDate
          : scpVendorDataList?.[0]?.l3DeliveryDate
      if (pjsDueDate && l1DelDate && moment(l1DelDate).isAfter(pjsDueDate, 'YYYY-MM-DD')) {
        setIsOverDue(true)
      } else {
        setIsOverDue(false)
      }
    }
  }, [scmHdrdata, scpVendorDataList, vendorQuafylst])

  const getvendordropdown = async () => {
    const props = {
      approved: '1',
      tenantId,
      venRatingBased: '1',
    }

    const httpgethdrdetails = await IndentGroupgetDetails({
      requestPath: 'getApprVendorDtls',
      requestData: props,
    })
    console.log(('Vendor httpgethdrdetails list', httpgethdrdetails))

    if (httpgethdrdetails) {
      const options = httpgethdrdetails?.responseData?.map(item => ({
        key: item.vendorCode,
        value: item.vendorUniqueCode,
        label: item.vendorName,
        country: item.locCountryCode,
        currencyType: item.currencyType !== null ? item.currencyType : '',
        isActive: true,
      }))
      const updatedVendorList = [...vendorlist, ...options]
      console.log(('Vendor first list', options))
      setVendorlist(updatedVendorList)
    }
  }

  const getscsretrievaldata = async () => {
    const props = {
      hdrId,
      tenantId,
      empId: employeeId,
      processCode: ProcessCode1 === '8' ? ProcessCode1 : '5',
    }
    setLoading(true)
    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'getScpDtlsByIgHdrId',
      requestData: props,
    })

    if (httpgetdetails.responseCode === '200') {
      setLoading(false)
      setIgscpId(httpgetdetails.responseData[0].igScpId)
      const scpVendorDtlListdata = httpgetdetails.responseData[0].scpVendorDtlList
      setScpVendorDataList(httpgetdetails?.responseData?.[0]?.scpVendorDtlList)
      setRmkDetaillist(httpgetdetails.responseData[0].scsStatusList)
      setDocStatus(httpgetdetails.responseData[0].docLifeCycleMstList)
      setIsEditable(httpgetdetails.responseData[0]?.isEditable)
      setPoPaymentTerm(httpgetdetails.responseData[0]?.poCancel?.poPaymentTerm)
      setVendorQualified(httpgetdetails?.responseData[0]?.vendorQualified)
      if (scpVendorDtlListdata && scpVendorDtlListdata.length > 0) {
        const vendor = httpgetdetails?.responseData?.[0]?.scpVendorDtlList?.[0] ?? {}
        allPropForm.setFieldsValue({
          warantyl1: vendor?.l1Warrenty ?? '',
          warantyl2: vendor?.l2Warrenty ?? '',
          warantyl3: vendor?.l3Warrenty ?? '',

          transportChargeL1fin: parseFloat(vendor?.l1FinalTransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL1finFx: parseFloat(vendor?.l1FinalTransportChargesFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL1in: parseFloat(vendor?.l1TransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL1inFx: parseFloat(vendor?.l1TransportChargesFx ?? 0).toFixed(2),

          transportChargeL2in: parseFloat(vendor?.l2TransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL2inFx: parseFloat(vendor?.l2TransportChargesFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL2fin: parseFloat(vendor?.l2FinalTransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL2finFx: parseFloat(vendor?.l2FinalTransportChargesFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          transportChargeL3in: parseFloat(vendor?.l3TransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL3inFx: parseFloat(vendor?.l3TransportChargesFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL3fin: parseFloat(vendor?.l3FinalTransportCharges ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          transportChargeL3finFx: parseFloat(vendor?.l3FinalTransportChargesFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          pfL1in: parseFloat(vendor?.l1PF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL1inFx: parseFloat(vendor?.l1PFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL1fin: parseFloat(vendor?.l1FinalPF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL1finFx: parseFloat(vendor?.l1FinalPFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          pfL2in: parseFloat(vendor?.l2PF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL2inFx: parseFloat(vendor?.l2PFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL2fin: parseFloat(vendor?.l2FinalPF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL2finFx: parseFloat(vendor?.l2FinalPFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          pfL3in: parseFloat(vendor?.l3PF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL3inFx: parseFloat(vendor?.l3PFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL3fin: parseFloat(vendor?.l3FinalPF ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          pfL3finFx: parseFloat(vendor?.l3FinalPFFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          subTotalL1inFx: parseFloat(vendor?.l1SubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-US'),
          subTotalL1in: parseFloat(vendor?.l1SubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL1finFx: parseFloat(vendor?.l1FinalSubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-US'),
          subTotalL1fin: parseFloat(vendor?.l1FinalSubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          subTotalL2inFx: parseFloat(vendor?.l2SubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL2in: parseFloat(vendor?.l2SubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL2finFx: parseFloat(vendor?.l2FinalSubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL2fin: parseFloat(vendor?.l2FinalSubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          subTotalL3inFx: parseFloat(vendor?.l3SubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL3in: parseFloat(vendor?.l3SubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL3finFx: parseFloat(vendor?.l3FinalSubTotalFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          subTotalL3fin: parseFloat(vendor?.l3FinalSubTotal ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          gst18L1in: parseFloat(vendor?.l1GstValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L1inFx: parseFloat(vendor?.l1GstValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L1fin: parseFloat(vendor?.l1FinalGSTValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L1finFx: parseFloat(vendor?.l1FinalGSTValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          gst18L2in: parseFloat(vendor?.l2GstValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L2inFx: parseFloat(vendor?.l2GstValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L2fin: parseFloat(vendor?.l2FinalGSTValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L2finFx: parseFloat(vendor?.l2FinalGSTValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          gst18L3in: parseFloat(vendor?.l3GstValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L3inFx: parseFloat(vendor?.l3GstValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L3fin: parseFloat(vendor?.l3FinalGSTValue ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          gst18L3finFx: parseFloat(vendor?.l3FinalGSTValueFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          landedCostL1in: parseFloat(vendor?.l1TotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL1inFx: parseFloat(vendor?.l1TotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL1fin: parseFloat(vendor?.l1FinalTotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL1finFx: parseFloat(vendor?.l1FinalTotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          landedCostL2in: parseFloat(vendor?.l2TotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL2inFx: parseFloat(vendor?.l2TotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL2fin: parseFloat(vendor?.l2FinalTotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL2finFx: parseFloat(vendor?.l2FinalTotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),

          landedCostL3in: parseFloat(vendor?.l3TotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL3inFx: parseFloat(vendor?.l3TotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL3fin: parseFloat(vendor?.l3FinalTotalCost ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
          landedCostL3finFx: parseFloat(vendor?.l3FinalTotalCostFx ?? 0)
            .toFixed(2)
            .toLocaleString('en-IN'),
        })
        // if (httpgetdetails.responseData[0].l1CurrencyType !== null) {
        //   allPropForm.setFieldsValue({
        //     country1: currencyToCountry[httpgetdetails.responseData[0].l1CurrencyType],
        //   })
        //   setCountry1(currencyToCountry[httpgetdetails.responseData[0].l1CurrencyType])
        //   setCountryL1(
        //     currencyToCountry[httpgetdetails.responseData[0].l1CurrencyType] === 'India'
        //       ? currencyToCountry[httpgetdetails.responseData[0].l1CurrencyType] === 'India'
        //       : false,
        //   )
        // }
        // if (httpgetdetails.responseData[0].l2CurrencyType !== null) {
        //   allPropForm.setFieldsValue({
        //     country2: currencyToCountry[httpgetdetails.responseData[0].l2CurrencyType],
        //   })
        //   setCountry2(currencyToCountry[httpgetdetails.responseData[0].l2CurrencyType])
        //   setCountryL2(
        //     currencyToCountry[httpgetdetails.responseData[0].l2CurrencyType] === 'India'
        //       ? currencyToCountry[httpgetdetails.responseData[0].l2CurrencyType] === 'India'
        //       : false,
        //   )
        // }
        // if (httpgetdetails.responseData[0].l3CurrencyType !== null) {
        //   allPropForm.setFieldsValue({
        //     country3: currencyToCountry[httpgetdetails.responseData[0].l3CurrencyType],
        //   })
        //   setCountry3(currencyToCountry[httpgetdetails.responseData[0].l3CurrencyType])
        //   setCountryL3(
        //     currencyToCountry[httpgetdetails.responseData[0].l3CurrencyType] === 'India'
        //       ? currencyToCountry[httpgetdetails.responseData[0].l3CurrencyType] === 'India'
        //       : false,
        //   )
        // }

        allPropForm.setFieldsValue({
          exchangeRate1: httpgetdetails.responseData[0].l1ExchangeRate,
        })
        allPropForm.setFieldsValue({
          exchangeRate2: httpgetdetails.responseData[0].l2ExchangeRate,
        })
        allPropForm.setFieldsValue({
          exchangeRate3: httpgetdetails.responseData[0].l3ExchangeRate,
        })
        const D1date = httpgetdetails.responseData[0].scpVendorDtlList[0].l1DeliveryDate
        allPropForm.setFieldsValue({
          delivery1: D1date ? moment(D1date) : undefined,
        })
        const D2date = httpgetdetails.responseData[0].scpVendorDtlList[0].l2DeliveryDate

        allPropForm.setFieldsValue({
          delivery2: D2date ? moment(D2date) : undefined,
        })
        const D3date = httpgetdetails.responseData[0].scpVendorDtlList[0].l3DeliveryDate

        allPropForm.setFieldsValue({
          delivery3: D3date ? moment(D3date) : undefined,
        })

        allPropForm.setFieldsValue({ ld1: httpgetdetails.responseData[0].scpVendorDtlList[0].l1Ld })
        allPropForm.setFieldsValue({ ld2: httpgetdetails.responseData[0].scpVendorDtlList[0].l2Ld })
        allPropForm.setFieldsValue({ ld3: httpgetdetails.responseData[0].scpVendorDtlList[0].l3Ld })

        const initialDate1 = httpgetdetails.responseData[0].scpVendorDtlList[0].l1InitialQuotedDate

        allPropForm.setFieldsValue({
          initialdate1: initialDate1 ? moment(initialDate1) : undefined,
        })

        const initialDate2 = httpgetdetails.responseData[0].scpVendorDtlList[0].l2InitialQuotedDate
        allPropForm.setFieldsValue({
          initialdate2: initialDate2 ? moment(initialDate2) : undefined,
        })
        const initialDate3 = httpgetdetails.responseData[0].scpVendorDtlList[0].l3InitialQuotedDate

        allPropForm.setFieldsValue({
          initialdate3: initialDate3 ? moment(initialDate3) : undefined,
        })

        allPropForm.setFieldsValue({
          refno1: httpgetdetails.responseData[0].scpVendorDtlList[0].l1InitialQuotedRef,
        })
        allPropForm.setFieldsValue({
          refno2: httpgetdetails.responseData[0].scpVendorDtlList[0].l2InitialQuotedRef,
        })
        allPropForm.setFieldsValue({
          refno3: httpgetdetails.responseData[0].scpVendorDtlList[0].l3InitialQuotedRef,
        })

        const finalDate1 = httpgetdetails.responseData[0].scpVendorDtlList[0].l1FinalQuotedDate

        allPropForm.setFieldsValue({
          finaldate1: finalDate1 ? moment(finalDate1) : undefined,
        })
        const finalDate2 = httpgetdetails.responseData[0].scpVendorDtlList[0].l2FinalQuotedDate
        allPropForm.setFieldsValue({
          finaldate2: finalDate2 ? moment(finalDate2) : undefined,
        })
        const finalDate3 = httpgetdetails.responseData[0].scpVendorDtlList[0].l3FinalQuotedDate
        allPropForm.setFieldsValue({
          finaldate3: finalDate3 ? moment(finalDate3) : undefined,
        })

        allPropForm.setFieldsValue({
          finalref1: httpgetdetails.responseData[0].scpVendorDtlList[0].l1FinalQuotedRef,
        })
        allPropForm.setFieldsValue({
          finalref2: httpgetdetails.responseData[0].scpVendorDtlList[0].l2FinalQuotedRef,
        })
        allPropForm.setFieldsValue({
          finalref3: httpgetdetails.responseData[0].scpVendorDtlList[0].l3FinalQuotedRef,
        })
      }
      let initialVendorQualify = ''
      const scpVendorListdata = httpgetdetails.responseData[0].scpVendorList
      if (scpVendorListdata && scpVendorListdata.length > 0) {
        setL1VendorUniqueCode(httpgetdetails.responseData[0].scpVendorList[0].l1VendorCode)
        setL2VendorUniqueCode(httpgetdetails.responseData[0].scpVendorList[0].l2VendorCode)
        setL3VendorUniqueCode(httpgetdetails.responseData[0].scpVendorList[0].l3VendorCode)
        allPropForm.setFieldsValue({
          vendorshortl1: {
            value: httpgetdetails.responseData[0].scpVendorList[0].l1VendorUniqueCode,
            label: httpgetdetails.responseData[0].scpVendorList[0].l1VendorName,
          },
          vendorshortl2: {
            value: httpgetdetails.responseData[0].scpVendorList[0].l2VendorUniqueCode,
            label: httpgetdetails.responseData[0].scpVendorList[0].l2VendorName,
          },
          vendorshortl3: {
            value: httpgetdetails.responseData[0].scpVendorList[0].l3VendorUniqueCode,
            label: httpgetdetails.responseData[0].scpVendorList[0].l3VendorName,
          },
          vendorcode1: httpgetdetails.responseData[0].scpVendorList[0].l1VendorUniqueCode,
          vendorcode2: httpgetdetails.responseData[0].scpVendorList[0].l2VendorUniqueCode,
          vendorcode3: httpgetdetails.responseData[0].scpVendorList[0].l3VendorUniqueCode,
          vendorgstL1: httpgetdetails.responseData[0].scpVendorList[0].l1Gst,
          vendorgstL2: httpgetdetails.responseData[0].scpVendorList[0].l2Gst,
          vendorgstL3: httpgetdetails.responseData[0].scpVendorList[0].l3Gst,
          suppliername1: httpgetdetails.responseData[0].scpVendorList[0].l1VendorName,
          suppliername2: httpgetdetails.responseData[0].scpVendorList[0].l2VendorName,
          suppliername3: httpgetdetails.responseData[0].scpVendorList[0].l3VendorName,
        })
        if (httpgetdetails.responseData[0].scpVendorList[0].l1VendorCountry !== null) {
          allPropForm.setFieldsValue({
            // country1: 'INDIA',
            country1: httpgetdetails.responseData[0].scpVendorList[0].l1VendorCountry,
          })
          setCountryL1(
            httpgetdetails.responseData[0].scpVendorList[0].l1VendorCountry.toLowerCase() ===
              'india'
              ? httpgetdetails.responseData[0].scpVendorList[0].l1VendorCountry.toLowerCase() ===
                  'india'
              : false,
          )
          setCountry1(httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry)
        }
        if (httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry !== null) {
          allPropForm.setFieldsValue({
            country2: httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry,
          })
          setCountryL2(
            httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry.toLowerCase() ===
              'india'
              ? httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry.toLowerCase() ===
                  'india'
              : false,
          )
          setCountry2(httpgetdetails.responseData[0].scpVendorList[0].l2VendorCountry)
        }
        if (httpgetdetails.responseData[0].scpVendorList[0].l3VendorCountry !== null) {
          allPropForm.setFieldsValue({
            country3: httpgetdetails.responseData[0].scpVendorList[0].l3VendorCountry,
          })
          setCountryL3(
            httpgetdetails.responseData[0].scpVendorList[0].l3VendorCountry.toLowerCase() ===
              'india'
              ? httpgetdetails.responseData[0].scpVendorList[0].l3VendorCountry.toLowerCase() ===
                  'india'
              : false,
          )
          setCountry3(httpgetdetails.responseData[0].scpVendorList[0].l1VendorCountry)
        }
        if (httpgetdetails.responseData[0].scpVendorList[0].l1VendorCurrency !== null) {
          setCurrencyTypeL1(httpgetdetails.responseData[0].scpVendorList[0].l1VendorCurrency)
        }
        if (httpgetdetails.responseData[0].scpVendorList[0].l2VendorCurrency !== null) {
          setCurrencyTypeL2(httpgetdetails.responseData[0].scpVendorList[0].l2VendorCurrency)
        }
        if (httpgetdetails.responseData[0].scpVendorList[0].l3VendorCurrency !== null) {
          setCurrencyTypeL3(httpgetdetails.responseData[0].scpVendorList[0].l3VendorCurrency)
        }
        const vendorQuafy = httpgetdetails?.responseData[0]?.vendorQualified
        setVendorQuafylst(vendorQuafy)
        const vendorQulfy = [
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorName,
            name: 'vendorshortl1',
            selected: vendorQuafy === 'L1' ? 'true' : 'false',
          },
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorName,
            name: 'vendorshortl2',
            selected: vendorQuafy === 'L2' ? 'true' : 'false',
          },
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorName,
            name: 'vendorshortl3',
            selected: vendorQuafy === 'L3' ? 'true' : 'false',
          },
        ]

        initialVendorQualify = vendorQulfy
          .filter(item => item.label !== null)
          .map(code => ({
            // key: `vendorshortl${index + 1}`,
            value: code.key,
            label: code.label,
            key: code.key,
            name: code.name,
            selected: code.selected,
          }))
        setVendorQualify(initialVendorQualify)
        allPropForm.setFieldsValue({
          vendorqualifiedL1: initialVendorQualify?.find(item => item.selected === 'true')?.key,
        })

        const responsevendorLisst = [
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorName,
            value: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorUniqueCode,
            country: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorCountry,
            currencyType: httpgetdetails.responseData[0]?.scpVendorList[0]?.l1VendorCurrency,
            isActive: true,
          },
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorName,
            value: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorUniqueCode,
            country: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorCountry,
            currencyType: httpgetdetails.responseData[0]?.scpVendorList[0]?.l2VendorCurrency,
            isActive: true,
          },
          {
            key: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorCode,
            label: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorName,
            value: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorUniqueCode,
            country: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorCountry,
            currencyType: httpgetdetails.responseData[0]?.scpVendorList[0]?.l3VendorCurrency,
            isActive: true,
          },
        ]

        setVendorlist(prevVendorlist => {
          console.log('prevVendorlist', prevVendorlist)
          const updatedVendorList = [...prevVendorlist, ...responsevendorLisst]
          console.log('updatedVendorList', updatedVendorList)

          return updatedVendorList
        })
      }
      // const values = allPropForm.getFieldsValue()
      // const vendorShortCodes = [httpgetdetails.responseData[0].scpVendorList[0].l1VendorCode,  httpgetdetails.responseData[0].scpVendorList[0].l2VendorCode, httpgetdetails.responseData[0].scpVendorList[0].l3VendorCode];
      // const vendorShortLabels = [httpgetdetails.responseData[0].scpVendorList[0].l1VendorName, httpgetdetails.responseData[0].scpVendorList[0].l2VendorName, httpgetdetails.responseData[0].scpVendorList[0].l3VendorName];

      const pricedatalist = httpgetdetails.responseData[0].scpvendorPtList
      if (pricedatalist && pricedatalist.length > 0) {
        const filterpaymentL1 = httpgetdetails.responseData[0].scpvendorPtList.filter(
          item => item.level === '1',
        )
        setPaymenttermdatal1([...filterpaymentL1, emptyPaymentTerms])

        const filterpaymentL2 = httpgetdetails.responseData[0].scpvendorPtList.filter(
          item => item.level === '2',
        )
        setPaymenttermdatal2([...filterpaymentL2, emptyPaymentTerms])
        const filterpaymentL3 = httpgetdetails.responseData[0].scpvendorPtList.filter(
          item => item.level === '3',
        )
        setPaymenttermdatal3([...filterpaymentL3, emptyPaymentTerms])
      }

      allPropForm.setFieldsValue({
        // techcomparison: httpgetdetails.responseData[0].technicalCompassion,
        scstypeL1: httpgetdetails.responseData[0].type,
      })
      // allPropForm.setFieldsValue({
      //   techicalrecom: httpgetdetails.responseData[0].technicalRecommendation,
      // })
      allPropForm.setFieldsValue({
        vendorevaluation: httpgetdetails.responseData[0].vendorEvaluated,
      })
      allPropForm.setFieldsValue({ justificationL1: httpgetdetails.responseData[0].justification })

      allPropForm.setFieldsValue({
        customerapprovedL1: httpgetdetails.responseData[0].customerApproval,
      })

      setFinalVal(httpgetdetails.responseData[0].vendorQualified)
      const priceDtlArr = httpgetdetails.responseData[0].scpDtlList
      if (priceDtlArr && priceDtlArr.length > 0) {
        setPriceTable(httpgetdetails.responseData[0].scpDtlList)
        setInitialBasevalues(httpgetdetails.responseData[0].scpDtlList)
      } else {
        const prop = {
          delAll: 0,
          igDtlId: hdrId,
          tenantId,
        }

        const httpget = await IndentGroupgetDetails({
          requestPath: 'getIndentGroupHdrAndDtl',
          requestData: prop,
        })
        if (httpget.responseCode === '200') {
          const newData = httpget?.responseData?.map((item, index) => ({
            sno: index + 1,
            igScpDItld: '',
            igScpId: '',
            igDtlId: item.indentGrpDtlId,
            indentDtlId: item.indentDtlId,
            l1UnitPriceFx: '',
            l1ExtendedPriceFx: '',
            l1UnitPrice: '',
            l1ExtendedPrice: '',
            l2UnitPriceFx: '',
            l2ExtendedPriceFx: '',
            l2UnitPrice: '',
            l2ExtendedPrice: '',
            l3UnitPriceFx: '',
            l3ExtendedPriceFx: '',
            l3UnitPrice: '',
            l3ExtendedPrice: '',
            finalL1UnitPriceFx: '',
            finalL1ExtendedPriceFx: '',
            finalL1UnitPrice: '',
            finalL1ExtendedPrice: '',
            finalL2UnitPriceFx: '',
            finalL2ExtendedPriceFx: '',
            finalL2UnitPrice: '',
            finalL2ExtendedPrice: '',
            finalL3UnitPriceFx: '',
            finalL3ExtendedPriceFx: '',
            finalL3UnitPrice: '',
            finalL3ExtendedPrice: '',
            tenantId: '',
            prodCode: item.productCode,
            prodDesc: item.description,
            prodSpec: item.specification,
            uom: item.uom,
            qty: item.indentQty,
            dmId: item.dmId,
          }))
          setPriceTable(newData)
          setPaymenttermdatal1([emptyPaymentTerms])
          setPaymenttermdatal2([emptyPaymentTerms])
          setPaymenttermdatal3([emptyPaymentTerms])
        }
      }

      setScmretrievaldata(httpgetdetails?.responseData)
      // Calculatefinalprice()
    } else {
      setLoading(false)
      const responseData = httpgetdetails?.responseData
      const isEditableval =
        responseData && responseData.length > 0 ? responseData[0].isEditable : '0'
      setIsEditable(isEditableval)
      const prop = {
        delAll: 0,
        igDtlId: hdrId,
        tenantId,
      }

      const httpget = await IndentGroupgetDetails({
        requestPath: 'getIndentGroupHdrAndDtl',
        requestData: prop,
      })
      if (httpget.responseCode === '200') {
        const newData = httpget?.responseData?.map((item, index) => ({
          sno: index + 1,
          igScpDItld: '',
          igScpId: '',
          igDtlId: item.indentGrpDtlId,
          indentDtlId: item.indentDtlId,
          l1UnitPrice: '',
          l1ExtendedPrice: '',
          l2UnitPrice: '',
          l2ExtendedPrice: '',
          l3UnitPrice: '',
          l3ExtendedPrice: '',
          finalL1UnitPrice: '',
          finalL1ExtendedPrice: '',
          finalL2UnitPrice: '',
          finalL2ExtendedPrice: '',
          finalL3UnitPrice: '',
          finalL3ExtendedPrice: '',
          tenantId: '',
          prodCode: item.productCode,
          prodDesc: item.description,
          prodSpec: item.specification,
          uom: item.uom,
          qty: item.indentQty,
          dmId: item.dmId,
        }))
        setPriceTable(newData)
        setPaymenttermdatal1([emptyPaymentTerms])
        setPaymenttermdatal2([emptyPaymentTerms])
        setPaymenttermdatal3([emptyPaymentTerms])
      }
    }
  }

  useEffect(() => {
    setFormdisable(isEditable === '0')
  }, [docStatus?.length > 0, isEditable])
  // const Calculatefinalprice = () => {
  //   const tableformvalue = tableform.getFieldsValue()
  //   const allPropFormvalue = allPropForm.getFieldValue()
  //   // allPropForm.setFieldValue({
  //   //     basicTotalL1inunit
  //   // })
  // }

  const downloaddrawn = async record => {
    const response = await IndentGroupgetDetails({
      requestPath: 'documentDownloadDocFile',
      requestData: {
        referenceId: record?.dmId,
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

  const getProductcost = async record => {
    const reqdata = {
      productCode: record.prodCode,
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
                  disable={isdisablebtn}
                  onClick={() => handlescsapproval(seq)}
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
                  disable={isdisablebtn}
                  onClick={() => handlescsapproval(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  // const countryToCurrency = {
  //   '': '',
  //   Afghanistan: 'AFN',
  //   Albania: 'ALL',
  //   Algeria: 'DZD',
  //   America: 'USD',
  //   Andorra: 'EUR',
  //   Angola: 'AOA',
  //   Argentina: 'ARS',
  //   Armenia: 'AMD',
  //   Australia: 'AUD',
  //   Austria: 'EUR',
  //   Azerbaijan: 'AZN',
  //   Bahamas: 'BSD',
  //   Bahrain: 'BHD',
  //   Bangladesh: 'BDT',
  //   Barbados: 'BBD',
  //   Belarus: 'BYN',
  //   Belgium: 'EUR',
  //   Belize: 'BZD',
  //   Benin: 'XOF',
  //   Bhutan: 'BTN',
  //   Bolivia: 'BOB',
  //   Bosnia_and_Herzegovina: 'BAM',
  //   Botswana: 'BWP',
  //   Brazil: 'BRL',
  //   Brunei: 'BND',
  //   Bulgaria: 'BGN',
  //   Burkina_Faso: 'XOF',
  //   Burundi: 'BIF',
  //   Cambodia: 'KHR',
  //   Cameroon: 'XAF',
  //   Canada: 'CAD',
  //   Cape_Verde: 'CVE',
  //   Central_African_Republic: 'XAF',
  //   Chad: 'XAF',
  //   Chile: 'CLP',
  //   China: 'CNY',
  //   Colombia: 'COP',
  //   Comoros: 'KMF',
  //   Congo: 'XAF',
  //   Costa_Rica: 'CRC',
  //   Croatia: 'HRK',
  //   Cuba: 'CUP',
  //   Cyprus: 'EUR',
  //   Czech_Republic: 'CZK',
  //   Denmark: 'DKK',
  //   Djibouti: 'DJF',
  //   Dominica: 'XCD',
  //   Dominican_Republic: 'DOP',
  //   Egypt: 'EGP',
  //   Equatorial_Guinea: 'XAF',
  //   Eritrea: 'ERN',
  //   Estonia: 'EUR',
  //   Eswatini: 'SZL',
  //   Ethiopia: 'ETB',
  //   Fiji: 'FJD',
  //   Finland: 'EUR',
  //   France: 'EUR',
  //   Gabon: 'XAF',
  //   Gambia: 'GMD',
  //   Georgia: 'GEL',
  //   Germany: 'EUR',
  //   Ghana: 'GHS',
  //   Greece: 'EUR',
  //   Grenada: 'XCD',
  //   Guatemala: 'GTQ',
  //   Guinea: 'GNF',
  //   Guinea_Bissau: 'XOF',
  //   Guyana: 'GYD',
  //   Haiti: 'HTG',
  //   Honduras: 'HNL',
  //   Hungary: 'HUF',
  //   Iceland: 'ISK',
  //   India: 'INR',
  //   Indonesia: 'IDR',
  //   Iran: 'IRR',
  //   Iraq: 'IQD',
  //   Ireland: 'EUR',
  //   Israel: 'ILS',
  //   Italy: 'EUR',
  //   Jamaica: 'JMD',
  //   Japan: 'JPY',
  //   Jordan: 'JOD',
  //   Kazakhstan: 'KZT',
  //   Kenya: 'KES',
  //   Korea_North: 'KPW',
  //   Korea_South: 'KRW',
  //   Kuwait: 'KWD',
  //   Kyrgyzstan: 'KGS',
  //   Laos: 'LAK',
  //   Latvia: 'EUR',
  //   Lebanon: 'LBP',
  //   Lesotho: 'LSL',
  //   Liberia: 'LRD',
  //   Libya: 'LYD',
  //   Liechtenstein: 'CHF',
  //   Lithuania: 'EUR',
  //   Luxembourg: 'EUR',
  //   Madagascar: 'MGA',
  //   Malawi: 'MWK',
  //   Malaysia: 'MYR',
  //   Maldives: 'MVR',
  //   Mali: 'XOF',
  //   Malta: 'EUR',
  //   Mauritania: 'MRU',
  //   Mauritius: 'MUR',
  //   Mexico: 'MXN',
  //   Moldova: 'MDL',
  //   Monaco: 'EUR',
  //   Mongolia: 'MNT',
  //   Montenegro: 'EUR',
  //   Morocco: 'MAD',
  //   Mozambique: 'MZN',
  //   Myanmar: 'MMK',
  //   Namibia: 'NAD',
  //   Nepal: 'NPR',
  //   Netherlands: 'EUR',
  //   New_Zealand: 'NZD',
  //   Nicaragua: 'NIO',
  //   Niger: 'XOF',
  //   Nigeria: 'NGN',
  //   North_Macedonia: 'MKD',
  //   Norway: 'NOK',
  //   Oman: 'OMR',
  //   Pakistan: 'PKR',
  //   Panama: 'PAB',
  //   Papua_New_Guinea: 'PGK',
  //   Paraguay: 'PYG',
  //   Peru: 'PEN',
  //   Philippines: 'PHP',
  //   Poland: 'PLN',
  //   Portugal: 'EUR',
  //   Qatar: 'QAR',
  //   Romania: 'RON',
  //   Russia: 'RUB',
  //   Rwanda: 'RWF',
  //   Samoa: 'WST',
  //   Saudi_Arabia: 'SAR',
  //   Senegal: 'XOF',
  //   Serbia: 'RSD',
  //   Seychelles: 'SCR',
  //   Sierra_Leone: 'SLL',
  //   Singapore: 'SGD',
  //   Slovakia: 'EUR',
  //   Slovenia: 'EUR',
  //   Solomon_Islands: 'SBD',
  //   Somalia: 'SOS',
  //   South_Africa: 'ZAR',
  //   South_Sudan: 'SSP',
  //   Spain: 'EUR',
  //   Sri_Lanka: 'LKR',
  //   Sudan: 'SDG',
  //   Suriname: 'SRD',
  //   Sweden: 'SEK',
  //   Switzerland: 'CHF',
  //   Syria: 'SYP',
  //   Taiwan: 'TWD',
  //   Tajikistan: 'TJS',
  //   Tanzania: 'TZS',
  //   Thailand: 'THB',
  //   Togo: 'XOF',
  //   Tonga: 'TOP',
  //   Tunisia: 'TND',
  //   Turkey: 'TRY',
  //   Turkmenistan: 'TMT',
  //   Uganda: 'UGX',
  //   Ukraine: 'UAH',
  //   United_Arab_Emirates: 'AED',
  //   United_Kingdom: 'GBP',
  //   Uruguay: 'UYU',
  //   Uzbekistan: 'UZS',
  //   Vanuatu: 'VUV',
  //   Venezuela: 'VES',
  //   Vietnam: 'VND',
  //   Yemen: 'YER',
  //   Zambia: 'ZMW',
  //   Zimbabwe: 'ZWL',
  // }
  // const currencyToCountry = Object.fromEntries(
  //   Object.entries(countryToCurrency).map(([country, currency]) => [currency, country]),
  // )

  const handlescsapproval = async seq => {
    const insertCheck = await handleinsert()
    console.log('finalval,,,.....', finalVal)
    const formvalue = inputForm.getFieldValue()
    let isValid = false
    if (vendorQualified !== null && vendorQualified === 'L1') {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL1fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L1 isValid', isValid, landedCost)
    } else if (vendorQualified !== null && vendorQualified === 'L2') {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL2fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L2 isValid', isValid, landedCost)
    } else {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL3fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L3 isValid', isValid, landedCost)
    }

    const props = {
      currentseq: seq,
      empId: employeeId,
      tenantId,
      scsFinalCost: finalcost,
      hdrId: igscpId,
      remarks: formvalue.remarks,
      pmId: processCode,
      processCode: ProcessCode1 === '8' ? ProcessCode1 : '5',

      pmHdrId,
      enquiryId,
      docTypeCode,
      mstId,
    }
    if (insertCheck && isValid) {
      const httpapprovals = await IndentGroupgetDetails({
        requestPath: 'updateScpSeqAndStatus',
        requestData: props,
      })

      if (httpapprovals.responseCode === '200') {
        onmodalCancel()
        setApproveRemarksCard(false)
      } else {
        message.error(httpapprovals.responseMessage)
      }
    }
  }

  const CustomFormItem = ({ name, label, colspan, inputClassName, maxLength, ...props }) => (
    <Col span={colspan}>
      <Form.Item
        name={name}
        label={
          <span>
            {label}
            <span style={{ color: 'red' }}> *</span>
          </span>
        }
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        {...props}
        labelAlign="left"
      >
        <Input.TextArea rows={2} className="custom-input" maxLength={maxLength} />
      </Form.Item>
    </Col>
  )

  const CustomFormInput = ({ name, readOnly, disable, maxLength }) => {
    return (
      <Form.Item name={name}>
        <Input
          type="text"
          className="custom-input"
          readOnly={readOnly}
          disabled={disable}
          maxLength={maxLength}
        />
      </Form.Item>
    )
  }

  const CustomFormNumberInput = ({ name, readOnly, functionname, maxLength }) => {
    const handleChange = e => {
      const { value } = e.target
      const newValue = value.replace(/[^0-9,]/g, '')
      functionname(newValue)
      console.log('check----', finalcost)
    }

    return (
      <Form.Item name={name}>
        <Input
          type="text"
          className="custom-input"
          readOnly={readOnly}
          onChange={handleChange}
          maxLength={maxLength}
        />
      </Form.Item>
    )
  }

  const CustomFormDate = ({ name, readOnly, disabledate, onChange, vendoritem }) => {
    const disabledDate = current => {
      return disabledate && current && current > moment().endOf('day')
    }
    // const formvalues = allPropForm.getFieldValue()

    const handleDateChange = date => {
      const formattedDate = moment(date).format('DD-MM-YYYY')

      if (onChange && finalVal === vendoritem) {
        const pjsDueDate =
          scmHdrdata && scmHdrdata.length > 0
            ? moment(scmHdrdata[0].expDeliveryDate).format('DD-MM-YYYY')
            : ''
        if (pjsDueDate && formattedDate) {
          const isAfter = moment(formattedDate, 'DD-MM-YYYY').isAfter(
            moment(pjsDueDate, 'DD-MM-YYYY'),
          )

          if (isAfter) {
            setIsOverDue(true)
          } else {
            setIsOverDue(false)
          }
        } else {
          setIsOverDue(false)
        }
      }
    }

    return (
      <Form.Item name={name}>
        <DatePicker
          format="YYYY-MMM-DD"
          readOnly={readOnly}
          disabledDate={disabledDate}
          onChange={handleDateChange}
          style={{ width: '100%' }}
        />
      </Form.Item>
    )
  }

  const handleinsert = async () => {
    let insertcheck = false
    const formvalues = allPropForm.getFieldValue()
    const paymenttermsArr = [...paymenttermdatal1, ...paymenttermdatal2, ...paymenttermdatal3]

    const filterpaymentArr = paymenttermsArr.filter(
      entry => entry.term !== '' && entry.percentage !== '',
    )
    const finalval = finalVal === 'L1' ? '1' : finalVal === 'L2' ? '2' : '3'
    const filterL1paymentArr = paymenttermsArr.filter(
      entry => entry.level === finalval && (entry.term !== '' || entry.percentage !== ''),
    )
    const sum = filterL1paymentArr
      .map(entry => Number(entry.percentage))
      .reduce((acc, curr) => acc + Number(curr), 0)

    const FormColname = [
      `delivery${finalval}`,
      `finaldate${finalval}`,
      `initialdate${finalval}`,
      `suppliername${finalval}`,
      `vendorcode${finalval}`,
      `finalref${finalval}`,
      `refno${finalval}`,
      `warantyl${finalval}`,
      `ld${finalval}`,
      `vendorshortl${finalval}`,
      `vendorgstL${finalval}`,
      `justificationL1`,
      `vendorqualifiedL1`,
      `scstypeL1`,
    ]

    const formfieldPresent = FormColname.every(colName => {
      return (
        Object.keys(formvalues).includes(colName) &&
        formvalues[colName] &&
        formvalues[colName] !== ''
      )
    })

    // const isL1PriceFormFilled = priceTable.every(
    //   item =>
    //     item[`l${finalval}UnitPrice`].trim() !== '' &&
    //     item[`l${finalval}UnitPriceFx`].trim() !== '' &&
    //     item[`l${finalval}ExtendedPrice`].trim() !== '' &&
    //     item[`finalL${finalval}UnitPrice`].trim() !== '' &&
    //     item[`finalL${finalval}UnitPriceFx`].trim() !== '' &&
    //     item[`finalL${finalval}ExtendedPrice`].trim() !== '',
    // )
    const countryMap = {
      1: countryL1,
      2: countryL2,
      3: countryL3,
    }

    const isL1PriceFormFilled = priceTable.every(item => {
      const unitPrice = (item[`l${finalval}UnitPrice`] ?? '').toString().trim()
      const unitPriceFx = (item[`l${finalval}UnitPriceFx`] ?? '').toString().trim()
      const extPrice = (item[`l${finalval}ExtendedPrice`] ?? '').toString().trim()
      const finalUnitPrice = (item[`finalL${finalval}UnitPrice`] ?? '').toString().trim()
      const finalUnitPriceFx = (item[`finalL${finalval}UnitPriceFx`] ?? '').toString().trim()
      const finalExtPrice = (item[`finalL${finalval}ExtendedPrice`] ?? '').toString().trim()
      const isFxRequired = !countryMap[finalval]

      return (
        unitPrice !== '' &&
        (isFxRequired ? unitPriceFx !== '' : true) &&
        extPrice !== '' &&
        finalUnitPrice !== '' &&
        (isFxRequired ? finalUnitPriceFx !== '' : true) &&
        finalExtPrice !== ''
      )
    })

    // const isL1FormFilled = Object.keys(formvalues)
    //   .filter(
    //     key => key.toLowerCase().includes('l1') && key.toLowerCase().includes('customerapprovedL1'),
    //   )
    //   .map(key => formvalues[key])
    //   .some(value => value === '' || value === null || value === undefined)
    console.log(formfieldPresent, filterL1paymentArr.length, isL1PriceFormFilled, sum)
    const selectedOptionl1 = vendorlist.find(option => option.value === formvalues.vendorshortl1)
    const l1VendorCodeselected = selectedOptionl1 ? selectedOptionl1.key : l1VendorUniqueCode
    const selectedOptionl2 = vendorlist.find(option => option.value === formvalues.vendorshortl2)
    const l2VendorCodeselected = selectedOptionl2 ? selectedOptionl2.key : l2VendorUniqueCode
    const selectedOptionl3 = vendorlist.find(option => option.value === formvalues.vendorshortl3)
    const l3VendorCodeselected = selectedOptionl3 ? selectedOptionl3.key : l3VendorUniqueCode

    let isValid = false
    if (vendorQualified !== null && vendorQualified === 'L1') {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL1fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L1 isValid', isValid, landedCost)
    } else if (vendorQualified !== null && vendorQualified === 'L2') {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL2fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L2 isValid', isValid, landedCost)
    } else {
      const landedCost = parseFloat(
        (allPropForm.getFieldValue('landedCostL3fin') || '0').toString().replace(/,/g, ''),
      )
      isValid = landedCost >= parseFloat(praAmount)
      console.log('L3 isValid', isValid, landedCost)
    }

    if (
      formfieldPresent &&
      filterL1paymentArr.length > 0 &&
      isL1PriceFormFilled &&
      sum === 100 &&
      isValid
    ) {
      console.log(
        'Currency type L1',
        currencyTypeL1,
        'Currency type L2',
        currencyTypeL2,
        'Currency type L2',
        currencyTypeL3,
      )
      setIsdisablebtn(true)
      const newInsert = {
        igScpId: (scmretrievaldata && scmretrievaldata?.[0]?.igScpId) || '',
        igHdrId: hdrId || '',
        technicalCompassion: '',
        technicalRecommendation: '',
        vendorEvaluated: formvalues.vendorevaluation,
        justification: formvalues.justificationL1,
        vendorQualified: finalVal,
        customerApproval:
          formvalues.customerapprovedL1 === undefined ? '' : formvalues.customerapprovedL1,
        createdDate: moment().format('YYYY-MM-DD hh:mm:ss'),
        createdBy: employeeId,
        type: formvalues.scstypeL1,
        tenantId,
        l1CurrencyType: currencyTypeL1,
        l2CurrencyType: currencyTypeL2,
        l3CurrencyType: currencyTypeL3,
        // l1CurrencyType: countryToCurrency[country1] ? countryToCurrency[country1] : '',
        // l2CurrencyType: countryToCurrency[country2] ? countryToCurrency[country2] : '',
        // l3CurrencyType: countryToCurrency[country3] ? countryToCurrency[country3] : '',

        l1ExchangeRate: allPropForm.getFieldValue('exchangeRate1')
          ? allPropForm.getFieldValue('exchangeRate1')
          : '',
        l2ExchangeRate: allPropForm.getFieldValue('exchangeRate2')
          ? allPropForm.getFieldValue('exchangeRate2')
          : '',
        l3ExchangeRate: allPropForm.getFieldValue('exchangeRate3')
          ? allPropForm.getFieldValue('exchangeRate3')
          : '',
        scpVendorList: [
          {
            igScpVid:
              (scmretrievaldata && scmretrievaldata?.[0]?.scpVendorList?.[0]?.igScpVid) || '',
            igScpId: (scmretrievaldata && scmretrievaldata?.[0]?.scpVendorList?.[0]?.igScpId) || '',
            l1VendorCode: l1VendorCodeselected,
            l2VendorCode: l2VendorCodeselected,
            l3VendorCode: l3VendorCodeselected,
            l1Gst: formvalues.vendorgstL1,
            l2Gst: formvalues.vendorgstL2,
            l3Gst: formvalues.vendorgstL3,
            lastUpdatedBy: employeeId,
          },
        ],
        scpVendorDtlList: [
          {
            igScpVendtlId:
              (scmretrievaldata && scmretrievaldata?.[0]?.scpVendorDtlList?.[0]?.igScpVendtlId) ||
              '',
            igScpId:
              (scmretrievaldata && scmretrievaldata?.[0]?.scpVendorDtlList?.[0]?.igScpId) || '',
            igDtlId: 0,
            indentDtlId: 0,
            l1Warrenty: formvalues.warantyl1,
            l1DeliveryDate: moment(formvalues.delivery1).format('YYYY-MM-DD'),
            l1Ld: formvalues.ld1,
            l1InitialQuotedDate: moment(formvalues.initialdate1).format('YYYY-MM-DD'),
            l1InitialQuotedRef: formvalues.refno1,
            l1FinalQuotedDate: moment(formvalues.finaldate1).format('YYYY-MM-DD'),
            l1FinalQuotedRef: formvalues.finalref1,
            l1UnitIniBasicTotal: formvalues.basicTotalL1inunit.replace(/,/g, ''),
            l1UnitIniBasicTotalFx: formvalues.basicTotalL1inunitFx.replace(/,/g, ''),
            l1ExtnIniBasicTotal: formvalues.basicTotalL1inextd.replace(/,/g, ''),
            l1ExtnIniBasicTotalFx: formvalues.basicTotalL1inextdFx.replace(/,/g, ''),
            l1UnitFinalBasicTotal: formvalues.basicTotalL1finunit.replace(/,/g, ''),
            l1UnitFinalBasicTotalFx: formvalues.basicTotalL1finunitFx.replace(/,/g, ''),
            l1ExtnFinalBasicTotal: formvalues.basicTotalL1finextd.replace(/,/g, ''),
            l1ExtnFinalBasicTotalFx: formvalues.basicTotalL1finextdFx.replace(/,/g, ''),
            l1TransportCharges: formvalues.transportChargeL1in.replace(/,/g, ''),
            l1TransportChargesFx: formvalues.transportChargeL1inFx.replace(/,/g, ''),
            l1FinalTransportCharges: formvalues.transportChargeL1fin.replace(/,/g, ''),
            l1FinalTransportChargesFx: formvalues.transportChargeL1finFx.replace(/,/g, ''),
            l1PF: formvalues.pfL1in.replace(/,/g, ''),
            l1PFFx: formvalues.pfL1inFx.replace(/,/g, ''),
            l1SubTotal: formvalues.subTotalL1in.replace(/,/g, ''),
            l1GstValue: formvalues.gst18L1in.replace(/,/g, ''),
            l1GstValueFx: formvalues.gst18L1inFx.replace(/,/g, ''),
            l1TotalCost: formvalues.landedCostL1in.replace(/,/g, ''),
            l1TotalCostFx: formvalues.landedCostL1inFx.replace(/,/g, ''),
            l1FinalPF: formvalues.pfL1fin.replace(/,/g, ''),
            l1FinalPFFx: formvalues.pfL1finFx.replace(/,/g, ''),
            l1FinalSubTotal: formvalues.subTotalL1fin.replace(/,/g, ''),
            l1FinalSubTotalFx: formvalues.subTotalL1finFx.replace(/,/g, ''),
            l1FinalGSTValue: formvalues.gst18L1fin.replace(/,/g, ''),
            l1FinalGSTValueFx: formvalues.gst18L1finFx.replace(/,/g, ''),
            l1FinalTotalCost: formvalues.landedCostL1fin.replace(/,/g, ''),
            l1FinalTotalCostFx: formvalues.landedCostL1finFx.replace(/,/g, ''),
            l2Warrenty: formvalues.warantyl2,

            l2DeliveryDate:
              formvalues.delivery2 !== undefined && formvalues.delivery2 !== ''
                ? moment(formvalues.delivery2).format('YYYY-MM-DD')
                : '',
            l2Ld: formvalues.ld2,

            l2InitialQuotedDate:
              formvalues.initialdate2 !== undefined && formvalues.initialdate2 !== ''
                ? moment(formvalues.initialdate2).format('YYYY-MM-DD')
                : '',
            l2InitialQuotedRef: formvalues.refno2,

            l2FinalQuotedDate:
              formvalues.finaldate2 !== undefined && formvalues.finaldate2 !== ''
                ? moment(formvalues.finaldate2).format('YYYY-MM-DD')
                : '',
            l2FinalQuotedRef: formvalues.finalref2,
            l2UnitIniBasicTotal: formvalues.basicTotalL2inunit.replace(/,/g, ''),
            l2UnitIniBasicTotalFx: formvalues.basicTotalL2inunitFx.replace(/,/g, ''),
            l2ExtnIniBasicTotal: formvalues.basicTotalL2inextd.replace(/,/g, ''),
            l2ExtnIniBasicTotalFx: formvalues.basicTotalL2inextdFx.replace(/,/g, ''),
            l2ExtnFinalBasicTotal: formvalues.basicTotalL2finextd.replace(/,/g, ''),
            l2ExtnFinalBasicTotalFx: formvalues.basicTotalL2finextdFx.replace(/,/g, ''),
            l2UnitFinalBasicTotal: formvalues.basicTotalL2finunit.replace(/,/g, ''),
            l2UnitFinalBasicTotalFx: formvalues.basicTotalL2finunitFx.replace(/,/g, ''),
            l2TransportCharges: formvalues.transportChargeL2in.replace(/,/g, ''),
            l2TransportChargesFx: formvalues.transportChargeL2inFx.replace(/,/g, ''),
            l2PF: formvalues.pfL2in.replace(/,/g, ''),
            l2PFFx: formvalues.pfL2inFx.replace(/,/g, ''),
            l2SubTotal: formvalues.subTotalL2in.replace(/,/g, ''),
            l2SubTotalFx: formvalues.subTotalL2inFx.replace(/,/g, ''),
            l2GstValue: formvalues.gst18L2in.replace(/,/g, ''),
            l2GstValueFx: formvalues.gst18L2inFx.replace(/,/g, ''),
            l2TotalCost: formvalues.landedCostL2in.replace(/,/g, ''),
            l2TotalCostFx: formvalues.landedCostL2inFx.replace(/,/g, ''),
            l2FinalTransportCharges: formvalues.transportChargeL2fin.replace(/,/g, ''),
            l2FinalTransportChargesFx: formvalues.transportChargeL2finFx.replace(/,/g, ''),
            l2FinalPF: formvalues.pfL2fin.replace(/,/g, ''),
            l2FinalPFFx: formvalues.pfL2finFx.replace(/,/g, ''),
            l2FinalSubTotal: formvalues.subTotalL2fin.replace(/,/g, ''),
            l2FinalGSTValue: formvalues.gst18L2fin.replace(/,/g, ''),
            l2FinalGSTValueFx: formvalues.gst18L2finFx.replace(/,/g, ''),
            l2FinalTotalCost: formvalues.landedCostL2fin.replace(/,/g, ''),
            l2FinalTotalCostFx: formvalues.landedCostL2finFx.replace(/,/g, ''),
            l3Warrenty: formvalues.warantyl3,
            l3DeliveryDate:
              formvalues.delivery3 !== undefined && formvalues.delivery3 !== ''
                ? moment(formvalues.delivery3).format('YYYY-MM-DD')
                : '',
            l3Ld: formvalues.ld3,

            l3InitialQuotedDate:
              formvalues.initialdate3 !== undefined && formvalues.initialdate3 !== ''
                ? moment(formvalues.initialdate3).format('YYYY-MM-DD')
                : '',
            l3InitialQuotedRef: formvalues.refno3,
            l3FinalQuotedDate:
              formvalues.finaldate3 !== undefined && formvalues.finaldate3 !== ''
                ? moment(formvalues.finaldate3).format('YYYY-MM-DD')
                : '',
            l3FinalQuotedRef: formvalues.finalref3,
            l3UnitIniBasicTotal: formvalues.basicTotalL3inunit.replace(/,/g, ''),
            l3UnitIniBasicTotalFx: formvalues.basicTotalL3inunitFx.replace(/,/g, ''),
            l3ExtnIniBasicTotal: formvalues.basicTotalL3inextd.replace(/,/g, ''),
            l3ExtnIniBasicTotalFx: formvalues.basicTotalL3inextdFx.replace(/,/g, ''),
            l3UnitFinalBasicTotal: formvalues.basicTotalL3finunit.replace(/,/g, ''),
            l3ExtnFinalBasicTotalFx: formvalues.basicTotalL3finextdFx.replace(/,/g, ''),
            l3UnitFinalBasicTotalFx: formvalues.basicTotalL3finunitFx.replace(/,/g, ''),
            l3ExtnFinalBasicTotal: formvalues.basicTotalL3finextd.replace(/,/g, ''),
            l3TransportCharges: formvalues.transportChargeL3in.replace(/,/g, ''),
            l3TransportChargesFx: formvalues.transportChargeL3inFx.replace(/,/g, ''),
            l3PF: formvalues.pfL3in.replace(/,/g, ''),
            l3PFFx: formvalues.pfL3inFx.replace(/,/g, ''),
            l3SubTotal: formvalues.subTotalL3in.replace(/,/g, ''),
            l3SubTotalFx: formvalues.subTotalL3inFx.replace(/,/g, ''),
            l3GstValue: formvalues.gst18L3in.replace(/,/g, ''),
            l3GstValueFx: formvalues.gst18L3inFx.replace(/,/g, ''),
            l3TotalCost: formvalues.landedCostL3in.replace(/,/g, ''),
            l3TotalCostFx: formvalues.landedCostL3inFx.replace(/,/g, ''),
            l3FinalTransportCharges: formvalues.transportChargeL3fin.replace(/,/g, ''),
            l3FinalTransportChargesFx: formvalues.transportChargeL3finFx.replace(/,/g, ''),
            l3FinalPF: formvalues.pfL3fin.replace(/,/g, ''),
            l3FinalPFFx: formvalues.pfL3finFx.replace(/,/g, ''),
            l3FinalSubTotal: formvalues.subTotalL3fin.replace(/,/g, ''),
            l3FinalGSTValue: formvalues.gst18L3fin.replace(/,/g, ''),
            l3FinalGSTValueFx: formvalues.gst18L3finFx.replace(/,/g, ''),
            l3FinalTotalCost: formvalues.landedCostL3fin.replace(/,/g, ''),
            l3FinalTotalCostFx: formvalues.landedCostL3finFx.replace(/,/g, ''),
            lastUpdatedBy: employeeId,
          },
        ],

        scpvendorPtList: filterpaymentArr,
        scpDtlList: priceTable,
      }

      const httpgethdrdetails = await IndentGroupgetDetails({
        requestPath: 'insertScpDtlsByIgHdrId',
        requestData: [newInsert],
      })

      if (httpgethdrdetails.responseCode === '200') {
        message.success(httpgethdrdetails.responseMessage)
        onmodalCancel()
        setIsdisablebtn(false)
        insertcheck = true
      } else {
        setIsdisablebtn(false)
        message.error(httpgethdrdetails.responseMessage)
      }
    } else {
      setIsdisablebtn(false)
      messageReturn(405)
      if (!isValid) {
        messageReturn(
          null,
          `Amount should not be lesser than PRA - Rs.${Number(praAmount).toFixed(
            2,
          )} for this indent group`,
          'error',
        )
      }
    }
    setIsdisablebtn(false)

    return insertcheck
  }

  const paymentformclear = () => {
    percentForm.resetFields()
    paytermForm.resetFields()
  }
  const handlevendorchange = (value, option, name) => {
    allPropForm.resetFields(['vendorqualifiedL1'])
    allPropForm.resetFields(['customerapprovedL1'])
    setVendorQualify(prevVendorQualify => {
      // Check if an item with the specified key already exists
      const isItemExists = prevVendorQualify.some(item => item.key === value)
      const isItemName = prevVendorQualify.filter(item => item.name === name)
      if (!isItemExists) {
        // If no item with the specified name exists, add a new item
        if (isItemName.length === 0) {
          return [
            ...prevVendorQualify,
            {
              key: value,
              label: option.children,
              name,
              isActive: 1,
            },
          ]
        }

        if (isItemName.length > 0) {
          const updatedVendorQualify = prevVendorQualify?.map(item => {
            if (item.name === name) {
              return {
                ...item,
                key: value,
                label: option.children,
                name,
                isActive: item.isActive,
              }
            }
            return item
          })
          return updatedVendorQualify
        }
      }
      return prevVendorQualify
    })

    // Set fields value based on the name
    if (name === 'vendorshortl1') {
      allPropForm.setFieldsValue({
        vendorcode1: value,
        suppliername1: option.children,
        country1: option.country,
      })
      setCurrencyTypeL1(option.currencyType)
      setCountry1(option.country)
      setCountryL1(option.country.toLowerCase() === 'india')
    } else if (name === 'vendorshortl2') {
      allPropForm.setFieldsValue({
        vendorcode2: value,
        suppliername2: option.children,
        country2: option.country,
      })
      setCurrencyTypeL2(option.currencyType)
      setCountry2(option.country)
      setCountryL2(option.country.toLowerCase() === 'india')
    } else if (name === 'vendorshortl3') {
      allPropForm.setFieldsValue({
        vendorcode3: value,
        suppliername3: option.children,
        country3: option.country,
      })
      setCurrencyTypeL3(option.currencyType)
      setCountry3(option.country)
      setCountryL3(option.country.toLowerCase() === 'india')
    }
  }

  //   const handleAddRow = (index, level) => {
  //     let newData1 = []
  //     let newData2 = []
  //     let newData3 = []

  //     if (level === 'l1') {
  //       const paytermValue = paytermForm.getFieldValue(`payterml1`)
  //       const percentagevalue = percentForm.getFieldValue(`percentl1`)
  //       if (percentagevalue > 100) {
  //         percentForm.resetFields()
  //         return
  //       }

  //       const remarksvalue = rmkForm.getFieldValue(`remarksl1`)
  //       newData1 = [...paymenttermdatal1]
  //       newData1[index].level = '1'
  //       newData1[index].percentage = percentagevalue
  //       newData1[index].remarks = remarksvalue
  //       newData1[index].term = paytermValue
  //       const targetArray = paymenttermdatal1
  //     } else if (level === 'l2') {
  //       const paytermValue = paytermForm.getFieldValue(`payterml2`)
  //       const percentagevalue = percentForm.getFieldValue(`percentl2`)
  //       if (percentagevalue > 100) {
  //         percentForm.resetFields()
  //         return
  //       }

  //       const remarksvalue = rmkForm.getFieldValue(`remarksl2`)

  //       newData2 = [...paymenttermdatal2]
  //       newData2[index].level = '2'
  //       newData2[index].percentage = percentagevalue
  //       newData2[index].remarks = remarksvalue
  //       newData2[index].term = paytermValue
  //       const targetArray = paymenttermdatal2
  //     } else if (level === 'l3') {
  //       const paytermValue = paytermForm.getFieldValue(`payterml3`)
  //       const percentagevalue = percentForm.getFieldValue(`percentl3`)
  //       if (percentagevalue > 100) {
  //         percentForm.resetFields()
  //         return
  //       }

  //       const remarksvalue = rmkForm.getFieldValue(`remarksl3`)
  //       newData3 = [...paymenttermdatal3]
  //       newData3[index].level = '3'
  //       newData3[index].percentage = percentagevalue
  //       newData3[index].remarks = remarksvalue
  //       newData3[index].term = paytermValue
  //       const targetArray = paymenttermdatal3
  //     }

  //     if (level === 'l1') {
  //       if (
  //         newData1[index].percentage !== '' &&
  //         newData1[index].remarks !== '' &&
  //         newData1[index].term !== '' &&
  //         newData1[index].level !== ''
  //       ) {
  //         const filterpaymentL1 = newData1.filter(item => item.level === '1')
  //         setPaymenttermdatal1([...filterpaymentL1, emptyPaymentTerms])
  //         paymentformclear()
  //       } else {
  //       }
  //     } else if (level === 'l2') {
  //       if (
  //         newData2[index].percentage !== '' &&
  //         newData2[index].remarks !== '' &&
  //         newData2[index].term !== '' &&
  //         newData2[index].level !== ''
  //       ) {
  //         const filterpaymentL2 = newData2.filter(item => item.level === '2')
  //         setPaymenttermdatal2([...filterpaymentL2, emptyPaymentTerms])
  //         paymentformclear()
  //       } else {
  //       }
  //     } else if (level === 'l3') {
  //       if (
  //         newData3[index].percentage !== '' &&
  //         newData3[index].remarks !== '' &&
  //         newData3[index].term !== '' &&
  //         newData3[index].level !== ''
  //       ) {
  //         const filterpaymentL3 = newData3.filter(item => item.level === '3')
  //         setPaymenttermdatal3([...filterpaymentL3, emptyPaymentTerms])
  //         paymentformclear()
  //       } else {
  //       }
  //     }
  //   }
  const handleAddRow = (index, level) => {
    if (isPraCreated) {
      messageReturn(
        null,
        'We cannot add another payment term as PRA already created for this indent group',
        'error',
      )
      return
    }
    let perArr = 0
    if (level === 'l1') {
      paymenttermdatal1.forEach(function(item) {
        perArr += parseFloat(item.percentage !== '' ? item.percentage : 0)
      })
    }

    if (level === 'l2') {
      paymenttermdatal2.forEach(function(item) {
        perArr += parseFloat(item.percentage !== '' ? item.percentage : 0)
      })
    }

    if (level === 'l3') {
      paymenttermdatal3.forEach(function(item) {
        perArr += parseFloat(item.percentage !== '' ? item.percentage : 0)
      })
    }

    const paytermValue = paytermForm.getFieldValue(`payterm${level}`)
    const percentagevalue = parseFloat(
      percentForm.getFieldValue(`percent${level}`) !== undefined
        ? percentForm.getFieldValue(`percent${level}`)
        : 0,
    )
    if (perArr + percentagevalue > 100) {
      messageReturn(611)
      percentForm.resetFields()
      return
    }

    if (percentagevalue <= 0) {
      messageReturn(679)
      percentForm.resetFields()
      return
    }

    let newData = []
    let targetArray

    switch (level) {
      case 'l1':
        newData = [...paymenttermdatal1]
        targetArray = setPaymenttermdatal1
        break
      case 'l2':
        newData = [...paymenttermdatal2]
        targetArray = setPaymenttermdatal2
        break
      case 'l3':
        newData = [...paymenttermdatal3]
        targetArray = setPaymenttermdatal3
        break
      default:
        break
    }

    newData[index] = {
      level: level.charAt(1),
      percentage: percentagevalue,
      remarks: '',
      term: paytermValue,
      igScpVpt: '',
      igScpId: '',
    }

    if (percentagevalue !== '' && paytermValue !== '' && level !== '') {
      const filterPayment = newData.filter(item => item.level === level.charAt(1))
      targetArray([...filterPayment, emptyPaymentTerms])
      paymentformclear()
    } else {
      messageReturn(405)
    }
  }

  const handleRemoveRow = (index, level) => {
    if (isPraCreated) {
      messageReturn(
        null,
        'We cannot add another payment term as PRA already created for this indent group',
        'error',
      )
      return
    }
    let newData = []
    if (level === 'l1') {
      newData = [...paymenttermdatal1]
      newData.splice(index, 1)
      setPaymenttermdatal1(newData)
    } else if (level === 'l2') {
      newData = [...paymenttermdatal2]
      newData.splice(index, 1)
      setPaymenttermdatal2(newData)
    } else if (level === 'l3') {
      newData = [...paymenttermdatal3]
      newData.splice(index, 1)
      setPaymenttermdatal3(newData)
    }
  }

  const Openpaymenttermcard1 = () => {
    setPaymttermvisible1(true)
    setPaymttermvisible2(false)
    setPaymttermvisible3(false)
  }

  const Openpaymenttermcard2 = () => {
    setPaymttermvisible1(false)
    setPaymttermvisible2(true)
    setPaymttermvisible3(false)
  }

  const Openpaymenttermcard3 = () => {
    setPaymttermvisible1(false)
    setPaymttermvisible2(false)
    setPaymttermvisible3(true)
  }

  //   const handleDataChange = (index, e, level, field) => {
  //     let updatedData
  //     let targetArray

  //     if (level === 'l1') {
  //       const newData1 = [...paymenttermdatal1]
  //       targetArray = paymenttermdatal1
  //       updatedData = newData1 // Assign the corresponding newData array to updatedData
  //     } else if (level === 'l2') {
  //       const newData2 = [...paymenttermdatal2]
  //       targetArray = paymenttermdatal2
  //       updatedData = newData2 // Assign the corresponding newData array to updatedData
  //     } else if (level === 'l3') {
  //       const newData3 = [...paymenttermdatal3]
  //       targetArray = paymenttermdatal3
  //       updatedData = newData3 // Assign the corresponding newData array to updatedData
  //     }

  //     if (field === 'percentage') {
  //       const inputValue = parseFloat(e.target.value)
  //       if (inputValue > 100) {
  //         percentForm.resetFields()
  //         return
  //       }
  //     }
  //     // updatedData[index][field] = e.target.value
  //   }

  const generatePaymentTermColumns = (level, data, handleAddRows, handleRemoveRows) => [
    {
      title: 'Payment Term',
      dataIndex: 'term',
      key: 'term',
      render: (text, record, index) =>
        index === data.length - 1 ? (
          <Form form={paytermForm}>
            <Form.Item name={`payterm${level}`}>
              <Input
                value={text}
                maxLength={512}
                // onBlur={e => handleDataChanges(index, e, level, 'term')}
                placeholder="Type here..."
                style={{ width: '200px' }}
                name={`payterm${level}field`}
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
        index === data.length - 1 ? (
          <Form form={percentForm}>
            <Form.Item name={`percent${level}`}>
              <Input
                value={text}
                // onBlur={e => handleDataChanges(index, e, level, 'percentage')}
                placeholder="Type here..."
                style={{ width: '200px' }}
                name={`percent${level}field`}
                type="number"
                maxLength={11}
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
          {index === data.length - 1 && (
            <AddIconButton onClick={() => handleAddRows(index, level)} />
          )}
          {index !== data.length - 1 && (
            <RemoveIcon onClick={() => handleRemoveRows(index, level)} />
          )}
        </Space>
      ),
    },
  ]

  const paymenttermcolumnsl1 = generatePaymentTermColumns(
    'l1',
    paymenttermdatal1,
    handleAddRow,
    handleRemoveRow,
  )
  const paymenttermcolumnsl2 = generatePaymentTermColumns(
    'l2',
    paymenttermdatal2,
    handleAddRow,
    handleRemoveRow,
  )
  const paymenttermcolumnsl3 = generatePaymentTermColumns(
    'l3',
    paymenttermdatal3,
    handleAddRow,
    handleRemoveRow,
  )
  const formatNumber = value => {
    if (Number.isNaN(value) || typeof value !== 'string') {
      return ''
    }
    return value
  }

  const setBasevalues = dataWithSum => {
    allPropForm.setFieldsValue({
      basicTotalL1inunit: formatNumber(dataWithSum.suml1UnitPrice),
      basicTotalL1inunitFx: formatNumber(dataWithSum.suml1UnitPriceFx),
      basicTotalL1inextd: formatNumber(dataWithSum.suml1ExtendedPrice),
      basicTotalL1inextdFx: formatNumber(dataWithSum.suml1ExtendedPriceFx),
      basicTotalL1finunit: formatNumber(dataWithSum.sumfinalL1UnitPrice),
      basicTotalL1finunitFx: formatNumber(dataWithSum.sumfinalL1UnitPriceFx),
      basicTotalL1finextd: formatNumber(dataWithSum.sumfinalL1ExtendedPrice),
      basicTotalL1finextdFx: formatNumber(dataWithSum.sumfinalL1ExtendedPriceFx),

      basicTotalL2inunit: formatNumber(dataWithSum.suml2UnitPrice),
      basicTotalL2inunitFx: formatNumber(dataWithSum.suml2UnitPriceFx),
      basicTotalL2inextd: formatNumber(dataWithSum.suml2ExtendedPrice),
      basicTotalL2inextdFx: formatNumber(dataWithSum.suml2ExtendedPriceFx),
      basicTotalL2finunit: formatNumber(dataWithSum.sumfinalL2UnitPrice),
      basicTotalL2finunitFx: formatNumber(dataWithSum.sumfinalL2UnitPriceFx),
      basicTotalL2finextd: formatNumber(dataWithSum.sumfinalL2ExtendedPrice),
      basicTotalL2finextdFx: formatNumber(dataWithSum.sumfinalL2ExtendedPriceFx),

      basicTotalL3inunit: formatNumber(dataWithSum.suml3UnitPrice),
      basicTotalL3inunitFx: formatNumber(dataWithSum.suml3UnitPriceFx),
      basicTotalL3inextd: formatNumber(dataWithSum.suml3ExtendedPrice),
      basicTotalL3inextdFx: formatNumber(dataWithSum.suml3ExtendedPriceFx),
      basicTotalL3finunit: formatNumber(dataWithSum.sumfinalL3UnitPrice),
      basicTotalL3finunitFx: formatNumber(dataWithSum.sumfinalL3UnitPriceFx),
      basicTotalL3finextd: formatNumber(dataWithSum.sumfinalL3ExtendedPrice),
      basicTotalL3finextdFx: formatNumber(dataWithSum.sumfinalL3ExtendedPriceFx),
    })
    updatevalues()
  }

  const updatevalues = () => {
    calculateSubTotalfin('L1')
    calculateSubTotalfin('L2')
    calculateSubTotalfin('L3')
    calculateSubTotalin('L1')
    calculateSubTotalin('L2')
    calculateSubTotalin('L3')
    // handleTableChange(baseTabVal)
  }

  const setInitialBasevalues = data => {
    const formValues = tableform.getFieldsValue()
    let dataWithSum = []
    dataWithSum = calculateSumForRow(formValues, data)
    setBasevalues(dataWithSum)
  }

  const handleTableChange = allValues => {
    updatedPriceTable = priceTable?.map(row => {
      const { sno } = row
      // if (sno && rowIndex === index) { // Check if rowIndex matches the current index
      const fieldNames = {
        l1UnitPriceFx: `l1UnitPriceFx${sno}`,
        l1ExtendedPriceFx: `l1ExtendedPriceFx${sno}`,
        finalL1UnitPriceFx: `finalL1UnitPriceFx${sno}`,
        finalL1ExtendedPriceFx: `finalL1ExtendedPriceFx${sno}`,
        l1UnitPrice: `l1UnitPrice${sno}`,
        l1ExtendedPrice: `l1ExtendedPrice${sno}`,
        finalL1UnitPrice: `finalL1UnitPrice${sno}`,
        finalL1ExtendedPrice: `finalL1ExtendedPrice${sno}`,
        l2UnitPriceFx: `l2UnitPriceFx${sno}`,
        l2ExtendedPriceFx: `l2ExtendedPriceFx${sno}`,
        finalL2UnitPriceFx: `finalL2UnitPriceFx${sno}`,
        finalL2ExtendedPriceFx: `finalL2ExtendedPriceFx${sno}`,
        l2UnitPrice: `l2UnitPrice${sno}`,
        l2ExtendedPrice: `l2ExtendedPrice${sno}`,
        finalL2UnitPrice: `finalL2UnitPrice${sno}`,
        finalL2ExtendedPrice: `finalL2ExtendedPrice${sno}`,
        l3UnitPriceFx: `l3UnitPriceFx${sno}`,
        l3ExtendedPriceFx: `l3ExtendedPriceFx${sno}`,
        finalL3UnitPriceFx: `finalL3UnitPriceFx${sno}`,
        finalL3ExtendedPriceFx: `finalL3ExtendedPriceFx${sno}`,
        l3UnitPrice: `l3UnitPrice${sno}`,
        l3ExtendedPrice: `l3ExtendedPrice${sno}`,
        finalL3UnitPrice: `finalL3UnitPrice${sno}`,
        finalL3ExtendedPrice: `finalL3ExtendedPrice${sno}`,
      }

      Object.keys(fieldNames).forEach(fieldName => {
        const fieldValue = allValues[fieldNames[fieldName]]
        let newValue
        if (fieldValue && !Number.isNaN(parseFloat(fieldValue))) {
          // const value = allValues[fieldNames[fieldName]].replace(/,/g, '') // Remove commas
          // const floatValue = parseFloat(value) // Convert to float
          // const fixedValue = floatValue.toFixed(2) // Format to two decimal places (returns a string)
          // const localizedValue = Number(fixedValue).toLocaleString('en-IN', {
          //   minimumFractionDigits: 2,
          //   maximumFractionDigits: 2,
          // }) // Convert back to number and format to locale string
          // newValue = localizedValue
          newValue = parseFloat(allValues[fieldNames[fieldName]].replace(/,/g, '')).toLocaleString(
            'en-IN',
          )
        } else {
          newValue = ''
        }

        tableform.setFieldsValue({
          [fieldNames[fieldName]]: newValue,
        })

        row[fieldName] = allValues[fieldNames[fieldName]]?.replace(/,/g, '')
      })
      // }
      return row
    })

    // setPriceTable(updatedPriceTable)

    const formValues = tableform.getFieldsValue()
    let dataWithSum = []
    dataWithSum = calculateSumForRow(formValues, priceTable)
    setBasevalues(dataWithSum)
  }

  const calculateSumForRow = (formValues, record) => {
    const sums = {
      suml1UnitPrice: 0,
      suml1UnitPriceFx: 0,
      suml1ExtendedPrice: 0,
      suml1ExtendedPriceFx: 0,
      sumfinalL1UnitPrice: 0,
      sumfinalL1UnitPriceFx: 0,
      sumfinalL1ExtendedPrice: 0,
      sumfinalL1ExtendedPriceFx: 0,
      suml2UnitPrice: 0,
      suml2UnitPriceFx: 0,
      suml2ExtendedPrice: 0,
      suml2ExtendedPriceFx: 0,
      sumfinalL2UnitPrice: 0,
      sumfinalL2UnitPriceFx: 0,
      sumfinalL2ExtendedPrice: 0,
      sumfinalL2ExtendedPriceFx: 0,
      suml3UnitPrice: 0,
      suml3UnitPriceFx: 0,
      suml3ExtendedPrice: 0,
      suml3ExtendedPriceFx: 0,
      sumfinalL3UnitPrice: 0,
      sumfinalL3UnitPriceFx: 0,
      sumfinalL3ExtendedPrice: 0,
      sumfinalL3ExtendedPriceFx: 0,
    }
    record.forEach(({ sno }) => {
      const keys = [
        'l1UnitPrice',
        'l1UnitPriceFx',
        'l1ExtendedPrice',
        'l1ExtendedPriceFx',
        'finalL1UnitPrice',
        'finalL1UnitPriceFx',
        'finalL1ExtendedPrice',
        'finalL1ExtendedPriceFx',
        'l2UnitPrice',
        'l2UnitPriceFx',
        'l2ExtendedPrice',
        'l2ExtendedPriceFx',
        'finalL2UnitPrice',
        'finalL2UnitPriceFx',
        'finalL2ExtendedPrice',
        'finalL2ExtendedPriceFx',
        'l3UnitPrice',
        'l3UnitPriceFx',
        'l3ExtendedPrice',
        'l3ExtendedPriceFx',
        'finalL3UnitPrice',
        'finalL3UnitPriceFx',
        'finalL3ExtendedPrice',
        'finalL3ExtendedPriceFx',
      ]

      keys.forEach(key => {
        const priceValues = formValues[`${key}${sno}`]
          ? formValues[`${key}${sno}`].replace(/,/g, '')
          : ''

        sums[`sum${key}`] += parseFloat(priceValues !== '' ? priceValues : 0)
      })
      // const l1UnitPriceValue = formValues[`l1UnitPrice${sno}`] ?
      // formValues[`l1UnitPrice${sno}`].replace(/,/g, '') : '';

      // if (formValues[`l1UnitPrice${sno}`] !== undefined) {
      //   sums.sumL1UnitPrice += parseFloat(
      //     formValues[`l1UnitPrice${sno}`] !== '' ? formValues[`l1UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`l1ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumL1ExtendedPrice += parseFloat(
      //     formValues[`l1ExtendedPrice${sno}`] !== '' ? formValues[`l1ExtendedPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL1UnitPrice${sno}`] !== undefined) {
      //   sums.sumfinalL1UnitPrice += parseFloat(
      //     formValues[`finalL1UnitPrice${sno}`] !== '' ? formValues[`finalL1UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL1ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumfinalL1ExtendedPrice += parseFloat(
      //     formValues[`finalL1ExtendedPrice${sno}`] !== ''
      //       ? formValues[`finalL1ExtendedPrice${sno}`]
      //       : 0,
      //   )
      // }

      // if (formValues[`l2UnitPrice${sno}`] !== undefined) {
      //   sums.sumL2UnitPrice += parseFloat(
      //     formValues[`l2UnitPrice${sno}`] !== '' ? formValues[`l2UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`l2ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumL2ExtendedPrice += parseFloat(
      //     formValues[`l2ExtendedPrice${sno}`] !== '' ? formValues[`l2ExtendedPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL2UnitPrice${sno}`] !== undefined) {
      //   sums.sumfinalL2UnitPrice += parseFloat(
      //     formValues[`finalL2UnitPrice${sno}`] !== '' ? formValues[`finalL2UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL2ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumfinalL2ExtendedPrice += parseFloat(
      //     formValues[`finalL2ExtendedPrice${sno}`] !== ''
      //       ? formValues[`finalL2ExtendedPrice${sno}`]
      //       : 0,
      //   )
      // }

      // if (formValues[`l3UnitPrice${sno}`] !== undefined) {
      //   sums.sumL3UnitPrice += parseFloat(
      //     formValues[`l3UnitPrice${sno}`] !== '' ? formValues[`l3UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`l3ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumL3ExtendedPrice += parseFloat(
      //     formValues[`l3ExtendedPrice${sno}`] !== '' ? formValues[`l3ExtendedPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL3UnitPrice${sno}`] !== undefined) {
      //   sums.sumfinalL3UnitPrice += parseFloat(
      //     formValues[`finalL3UnitPrice${sno}`] !== '' ? formValues[`finalL3UnitPrice${sno}`] : 0,
      //   )
      // }

      // if (formValues[`finalL3ExtendedPrice${sno}`] !== undefined) {
      //   sums.sumfinalL3ExtendedPrice += parseFloat(
      //     formValues[`finalL3ExtendedPrice${sno}`] !== ''
      //       ? formValues[`finalL3ExtendedPrice${sno}`]
      //       : 0,
      //   )
      // }
    })
    Object.keys(sums).forEach(key => {
      sums[key] = parseFloat(sums[key].toFixed(2)).toLocaleString('en-IN')
    })

    return sums
  }

  // const calculateRowSum = (formValues, record) => {
  //     let sumL1UnitPrice = 0;
  //     let sumL1ExtendedPrice = 0;
  //     let sumfinalL1UnitPrice=0;
  //     let sumfinalL1ExtendedPrice=0;
  //     let sumL2UnitPrice = 0;
  //     let sumL2ExtendedPrice = 0;
  //     let sumfinalL2UnitPrice=0;
  //     let sumfinalL2ExtendedPrice=0;
  //     let sumL3UnitPrice = 0;
  //     let sumL3ExtendedPrice = 0;
  //     let sumfinalL3UnitPrice=0;
  //     let sumfinalL3ExtendedPrice=0;
  //     if (formValues[`l1UnitPrice${record.sno}`] !== undefined) {
  //         sumL1UnitPrice += parseFloat(formValues[`l1UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`l1ExtendedPrice${record.sno}`] !== undefined) {
  //         sumL1ExtendedPrice += parseFloat(formValues[`l1ExtendedPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL1UnitPrice${record.sno}`] !== undefined) {
  //         sumfinalL1UnitPrice += parseFloat(formValues[`finalL1UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL1ExtendedPrice${record.sno}`] !== undefined) {
  //         sumfinalL1ExtendedPrice += parseFloat(formValues[`finalL1ExtendedPrice${record.sno}`]);
  //     }

  //     if (formValues[`l2UnitPrice${record.sno}`] !== undefined) {
  //         sumL2UnitPrice += parseFloat(formValues[`l2UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`l2ExtendedPrice${record.sno}`] !== undefined) {
  //         sumL2ExtendedPrice += parseFloat(formValues[`l2ExtendedPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL2UnitPrice${record.sno}`] !== undefined) {
  //         sumfinalL2UnitPrice += parseFloat(formValues[`finalL2UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL2ExtendedPrice${record.sno}`] !== undefined) {
  //         sumfinalL2ExtendedPrice += parseFloat(formValues[`finalL2ExtendedPrice${record.sno}`]);
  //     }

  //     if (formValues[`l3UnitPrice${record.sno}`] !== undefined) {
  //         sumL3UnitPrice += parseFloat(formValues[`l3UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`l3ExtendedPrice${record.sno}`] !== undefined) {
  //         sumL3ExtendedPrice += parseFloat(formValues[`l3ExtendedPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL3UnitPrice${record.sno}`] !== undefined) {
  //         sumfinalL3UnitPrice += parseFloat(formValues[`finalL3UnitPrice${record.sno}`]);
  //     }

  //     if (formValues[`finalL3ExtendedPrice${record.sno}`] !== undefined) {
  //         sumfinalL3ExtendedPrice += parseFloat(formValues[`finalL3ExtendedPrice${record.sno}`]);
  //     }

  //     return {
  //         sumL1UnitPrice,
  //         sumL1ExtendedPrice,
  //         sumfinalL1UnitPrice,
  //         sumfinalL1ExtendedPrice,
  //         sumL2UnitPrice,
  //         sumL2ExtendedPrice ,
  //         sumfinalL2UnitPrice,
  //         sumfinalL2ExtendedPrice,
  //         sumL3UnitPrice ,
  //         sumL3ExtendedPrice ,
  //         sumfinalL3UnitPrice,
  //         sumfinalL3ExtendedPrice,
  //         // Add more sums as needed for other fields
  //     };
  // };

  const handleChangeInputForOtherCountry = (value, name1, name2, name3, record, isIndia, L1) => {
    console.log(value, name3, record, L1, 'for other country')
    const amount = parseFloat(value.replace(/,/g, ''))
    //  Replaces comma separator to number format
    if (!isIndia && L1 === 'L1') {
      if (
        allPropForm.getFieldValue('exchangeRate1') === null ||
        allPropForm.getFieldValue('exchangeRate1') === undefined ||
        Number(allPropForm.getFieldValue('exchangeRate1')) <= 0
      ) {
        message.error(`Please Enter the Exchange Rate for ${L1}`)
        return
      }
      tableform.setFieldsValue({
        [name1]: parseFloat(record.qty * amount).toLocaleString('en-IN'),
      })
      tableform.setFieldsValue({
        [name2]: parseFloat(amount * allPropForm.getFieldValue('exchangeRate1')).toLocaleString(
          'en-IN',
        ),
      })
      tableform.setFieldsValue({
        [name3]: parseFloat(
          record.qty * amount * allPropForm.getFieldValue('exchangeRate1'),
        ).toLocaleString('en-IN'),
      })
    }
    if (!isIndia && L1 === 'L2') {
      if (
        allPropForm.getFieldValue('exchangeRate2') === null ||
        allPropForm.getFieldValue('exchangeRate2') === undefined ||
        Number(allPropForm.getFieldValue('exchangeRate2')) <= 0
      ) {
        message.error(`Please Enter the Exchange Rate for ${L1}`)
        return
      }
      tableform.setFieldsValue({
        [name1]: parseFloat(record.qty * amount).toLocaleString('en-IN'),
      })
      tableform.setFieldsValue({
        [name2]: parseFloat(amount * allPropForm.getFieldValue('exchangeRate2')).toLocaleString(
          'en-IN',
        ),
      })
      tableform.setFieldsValue({
        [name3]: parseFloat(
          record.qty * amount * allPropForm.getFieldValue('exchangeRate2'),
        ).toLocaleString('en-IN'),
      })
    }
    if (!isIndia && L1 === 'L3') {
      if (
        allPropForm.getFieldValue('exchangeRate3') === null ||
        allPropForm.getFieldValue('exchangeRate3') === undefined ||
        Number(allPropForm.getFieldValue('exchangeRate3')) <= 0
      ) {
        message.error(`Please Enter the Exchange Rate for ${L1}`)
        return
      }
      tableform.setFieldsValue({
        [name1]: parseFloat(record.qty * amount).toLocaleString('en-IN'),
      })
      tableform.setFieldsValue({
        [name2]: parseFloat(amount * allPropForm.getFieldValue('exchangeRate3')).toLocaleString(
          'en-IN',
        ),
      })
      tableform.setFieldsValue({
        [name3]: parseFloat(
          record.qty * amount * allPropForm.getFieldValue('exchangeRate3'),
        ).toLocaleString('en-IN'),
      })
    }
    const formValues = tableform.getFieldsValue()
    handleTableChange(formValues)
    let dataWithSum = []
    dataWithSum = calculateSumForRow(formValues, priceTable)
    setBasevalues(dataWithSum)
  }

  const handleChangeInput = (name, data, qty) => {
    tableform.setFieldsValue({
      [name]: parseFloat(data * qty).toLocaleString('en-IN'),
    })
    const formValues = tableform.getFieldsValue()
    handleTableChange(formValues)
    let dataWithSum = []
    dataWithSum = calculateSumForRow(formValues, priceTable)
    setBasevalues(dataWithSum)
  }

  const pricecolumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 40,
      // render: (text, record) => (
      //   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      //     <div>{record.sno}</div>
      //     <ButtonComponent
      //       icon={<DownloadOutlined />}
      //       onClick={() => downloaddrawn(record)}
      //       type="primary"
      //       size="small"
      //       disable={false}
      //     />
      //   </div>
      // )
    },
    {
      title: 'Part Number',
      dataIndex: 'prodCode',
      key: 'prodCode',
      render: (text, record) => (
        <a
          role="button"
          tabIndex="0"
          onClick={() => getProductcost(record)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              getProductcost(record)
            }
          }}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'prodDesc',
      key: 'prodDesc',
    },
    {
      title: 'Specification',
      dataIndex: 'prodSpec',
      key: 'prodSpec',
      width: '300px',
    },
    {
      title: 'Mass',
      dataIndex: 'weight',
      key: 'weight',
      render: text => (text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: text => (text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
    },

    {
      title: `L1 Initial Unit Price ${currencyTypeL1 === '' ? '' : `(${currencyTypeL1})`}`,
      dataIndex: 'l1UnitPriceFx',
      key: 'l1UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l1UnitPriceFx${record.sno}`}
            initialValue={
              record.l1UnitPriceFx ? parseFloat(record.l1UnitPriceFx).toLocaleString('en-IN') : ''
            }
          >
            <Input
              disabled={formdisable || countryL1}
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `l1ExtendedPriceFx${record.sno}`,
                  `l1UnitPrice${record.sno}`,
                  `l1ExtendedPrice${record.sno}`,
                  record,
                  countryL1,
                  'L1',
                )
              }
              type="text"
              value={
                record.l1UnitPriceFx ? parseFloat(record.l1UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L1 Initial Extd. Price ${currencyTypeL1 === '' ? '' : `(${currencyTypeL1})`}`,
      dataIndex: 'l1ExtendedPriceFx',
      key: 'l1ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l1ExtendedPriceFx${record.sno}`}
            initialValue={
              record.l1ExtendedPriceFx
                ? parseFloat(record.l1ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              disabled={formdisable || countryL1}
              onChange={() =>
                handleChangeInput(
                  `l1ExtendedPriceFx${record.sno}`,
                  record.l1UnitPriceFx,
                  record.qty,
                )
              }
              type="text"
              value={
                record.l1UnitPriceFx ? parseFloat(record.l1UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L1 Initial Unit Price (Rs.)',
      dataIndex: 'l1UnitPrice',
      key: 'l1UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l1UnitPrice${record.sno}`}
            initialValue={
              record.l1UnitPrice ? parseFloat(record.l1UnitPrice).toLocaleString('en-IN') : ''
            }
          >
            <Input
              onChange={() =>
                handleChangeInput(`l1ExtendedPrice${record.sno}`, record.l1UnitPrice, record.qty)
              }
              type="text"
              readOnly={!countryL1}
              value={
                record.l1UnitPrice ? parseFloat(record.l1UnitPrice).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L1 Initial Extd. Price',
      dataIndex: 'l1ExtendedPrice',
      key: 'l1ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l1ExtendedPrice${record.sno}`}
            initialValue={
              record.l1ExtendedPrice
                ? parseFloat(record.l1ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.l1ExtendedPrice
                  ? parseFloat(record.l1ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalin('L1')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L1 Final Unit Price ${currencyTypeL1 === '' ? '' : `(${currencyTypeL1})`}`,
      dataIndex: 'finalL1UnitPriceFx',
      key: 'finalL1UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL1UnitPriceFx${record.sno}`}
            initialValue={
              record.finalL1UnitPriceFx
                ? parseFloat(record.finalL1UnitPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `finalL1ExtendedPriceFx${record.sno}`,
                  `finalL1UnitPrice${record.sno}`,
                  `finalL1ExtendedPrice${record.sno}`,
                  record,
                  countryL1,
                  'L1',
                )
              }
              type="text"
              disabled={formdisable || countryL1}
              value={
                record.finalL1UnitPriceFx
                  ? parseFloat(record.finalL1UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L1 Final Extd. Price ${currencyTypeL1 === '' ? '' : `(${currencyTypeL1})`}`,
      dataIndex: 'finalL1ExtendedPriceFx',
      key: 'finalL1ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL1ExtendedPriceFx${record.sno}`}
            initialValue={
              record.finalL1ExtendedPriceFx
                ? parseFloat(record.finalL1ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              disabled={formdisable || countryL1}
              onChange={() =>
                handleChangeInput(
                  `finalL1ExtendedPriceFx${record.sno}`,
                  record.finalL1UnitPrice,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL1UnitPriceFx
                  ? parseFloat(record.finalL1UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L1 Final Unit Price (Rs.)',
      dataIndex: 'finalL1UnitPrice',
      key: 'finalL1UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL1UnitPrice${record.sno}`}
            initialValue={
              record.finalL1UnitPrice
                ? parseFloat(record.finalL1UnitPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly={!countryL1}
              onChange={() =>
                handleChangeInput(
                  `finalL1ExtendedPrice${record.sno}`,
                  record.finalL1UnitPrice,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL1UnitPrice
                  ? parseFloat(record.finalL1UnitPrice).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L1 Final Extd. Price',
      dataIndex: 'finalL1ExtendedPrice',
      key: 'finalL1ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L1' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL1ExtendedPrice${record.sno}`}
            initialValue={
              record.finalL1ExtendedPrice
                ? parseFloat(record.finalL1ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.finalL1ExtendedPrice
                  ? parseFloat(record.finalL1ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalfin('L1')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L2 Initial Unit Price ${currencyTypeL2 === '' ? '' : `(${currencyTypeL2})`}`,
      dataIndex: 'l2UnitPriceFx',
      key: 'l2UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l2UnitPriceFx${record.sno}`}
            initialValue={
              record.l2UnitPriceFx ? parseFloat(record.l2UnitPriceFx).toLocaleString('en-IN') : ''
            }
          >
            <Input
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `l2ExtendedPriceFx${record.sno}`,
                  `l2UnitPrice${record.sno}`,
                  `l2ExtendedPrice${record.sno}`,
                  record,
                  countryL2,
                  'L2',
                )
              }
              type="text"
              disabled={formdisable || countryL2}
              value={
                record.l2UnitPriceFx ? parseFloat(record.l2UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L2 Initial Extd. Price ${currencyTypeL2 === '' ? '' : `(${currencyTypeL2})`}`,
      dataIndex: 'l2ExtendedPriceFx',
      key: 'l2ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l2ExtendedPriceFx${record.sno}`}
            initialValue={
              record.l2ExtendedPriceFx
                ? parseFloat(record.l2ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              onChange={() =>
                handleChangeInput(
                  `l2ExtendedPriceFx${record.sno}`,
                  record.l2UnitPriceFx,
                  record.qty,
                )
              }
              type="text"
              value={
                record.l2UnitPriceFx ? parseFloat(record.l2UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L2 Initial Unit Price (Rs.)',
      dataIndex: 'l2UnitPrice',
      key: 'l2UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l2UnitPrice${record.sno}`}
            initialValue={
              record.l2UnitPrice ? parseFloat(record.l2UnitPrice).toLocaleString('en-IN') : ''
            }
          >
            <Input
              onChange={() =>
                handleChangeInput(`l2ExtendedPrice${record.sno}`, record.l2UnitPrice, record.qty)
              }
              type="text"
              readOnly={!countryL2}
              value={
                record.l2UnitPrice ? parseFloat(record.l2UnitPrice).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L2 Initial Extd. Price',
      dataIndex: 'l2ExtendedPrice',
      key: 'l2ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l2ExtendedPrice${record.sno}`}
            initialValue={
              record.l2ExtendedPrice
                ? parseFloat(record.l2ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.l2ExtendedPrice
                  ? parseFloat(record.l2ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalin('L2')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L2 Final Unit Price ${currencyTypeL2 === '' ? '' : `(${currencyTypeL2})`}`,
      dataIndex: 'finalL2UnitPriceFx',
      key: 'finalL2UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL2UnitPriceFx${record.sno}`}
            initialValue={
              record.finalL2UnitPriceFx
                ? parseFloat(record.finalL2UnitPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `finalL2ExtendedPriceFx${record.sno}`,
                  `finalL2UnitPrice${record.sno}`,
                  `finalL2ExtendedPrice${record.sno}`,
                  record,
                  countryL2,
                  'L2',
                )
              }
              type="text"
              disabled={formdisable || countryL2}
              value={
                record.finalL2UnitPriceFx
                  ? parseFloat(record.finalL2UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L2 Final Extd. Price ${currencyTypeL2 === '' ? '' : `(${currencyTypeL2})`}`,
      dataIndex: 'finalL2ExtendedPriceFx',
      key: 'finalL2ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL2ExtendedPriceFx${record.sno}`}
            initialValue={
              record.finalL2ExtendedPriceFx
                ? parseFloat(record.finalL2ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              disabled={formdisable || countryL2}
              onChange={() =>
                handleChangeInput(
                  `finalL2ExtendedPrice${record.sno}`,
                  record.finalL2UnitPriceFx,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL2UnitPriceFx
                  ? parseFloat(record.finalL2UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L2 Final Unit Price (Rs.)',
      dataIndex: 'finalL2UnitPrice',
      key: 'finalL2UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL2UnitPrice${record.sno}`}
            initialValue={
              record.finalL2UnitPrice
                ? parseFloat(record.finalL2UnitPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              onChange={() =>
                handleChangeInput(
                  `finalL2ExtendedPrice${record.sno}`,
                  record.finalL2UnitPrice,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL2UnitPrice
                  ? parseFloat(record.finalL2UnitPrice).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L2 Final Extd. Price',
      dataIndex: 'finalL2ExtendedPrice',
      key: 'finalL2ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L2' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL2ExtendedPrice${record.sno}`}
            initialValue={
              record.finalL2ExtendedPrice
                ? parseFloat(record.finalL2ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.finalL2ExtendedPrice
                  ? parseFloat(record.finalL2ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalfin('L2')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L3 Initial Unit Price ${currencyTypeL3 === '' ? '' : `(${currencyTypeL3})`}`,
      dataIndex: 'l3UnitPriceFx',
      key: 'l3UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l3UnitPriceFx${record.sno}`}
            initialValue={
              record.l3UnitPriceFx ? parseFloat(record.l3UnitPriceFx).toLocaleString('en-IN') : ''
            }
          >
            <Input
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `l3ExtendedPriceFx${record.sno}`,
                  `l3UnitPrice${record.sno}`,
                  `l3ExtendedPrice${record.sno}`,
                  record,
                  countryL3,
                  'L3',
                )
              }
              type="text"
              disabled={formdisable || countryL3}
              value={
                record.l3UnitPriceFx ? parseFloat(record.l3UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L3 Initial Extd. Price ${currencyTypeL3 === '' ? '' : `(${currencyTypeL3})`}`,
      dataIndex: 'l3ExtendedPriceFx',
      key: 'l3ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l3ExtendedPriceFx${record.sno}`}
            initialValue={
              record.l3ExtendedPriceFx
                ? parseFloat(record.l3ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              disabled={countryL3}
              onChange={() =>
                handleChangeInput(`l3ExtendedPrice${record.sno}`, record.l3UnitPriceFx, record.qty)
              }
              type="text"
              value={
                record.l3UnitPriceFx ? parseFloat(record.l3UnitPriceFx).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L3 Initial Unit Price (Rs.)',
      dataIndex: 'l3UnitPrice',
      key: 'l3UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l3UnitPrice${record.sno}`}
            initialValue={
              record.l3UnitPrice ? parseFloat(record.l3UnitPrice).toLocaleString('en-IN') : ''
            }
          >
            <Input
              onChange={() =>
                handleChangeInput(`l3ExtendedPrice${record.sno}`, record.l3UnitPrice, record.qty)
              }
              type="text"
              readOnly={!countryL3}
              value={
                record.l3UnitPrice ? parseFloat(record.l3UnitPrice).toLocaleString('en-IN') : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L3 Initial Extd. Price',
      dataIndex: 'l3ExtendedPrice',
      key: 'l3ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`l3ExtendedPrice${record.sno}`}
            initialValue={
              record.l3ExtendedPrice
                ? parseFloat(record.l3ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.l3ExtendedPrice
                  ? parseFloat(record.l3ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalin('L3')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L3 Final Unit Price ${currencyTypeL3 === '' ? '' : `(${currencyTypeL3})`}`,
      dataIndex: 'finalL3UnitPriceFx',
      key: 'finalL3UnitPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL3UnitPriceFx${record.sno}`}
            initialValue={
              record.finalL3UnitPriceFx
                ? parseFloat(record.finalL3UnitPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              onChange={e =>
                handleChangeInputForOtherCountry(
                  e.target.value,
                  `finalL3ExtendedPriceFx${record.sno}`,
                  `finalL3UnitPrice${record.sno}`,
                  `finalL3ExtendedPrice${record.sno}`,
                  record,
                  countryL3,
                  'L3',
                )
              }
              type="text"
              disabled={formdisable || countryL3}
              value={
                record.finalL3UnitPriceFx
                  ? parseFloat(record.finalL3UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: `L3 Final Extd. Price ${currencyTypeL3 === '' ? '' : `(${currencyTypeL3})`}`,
      dataIndex: 'finalL3ExtendedPriceFx',
      key: 'finalL3ExtendedPriceFx',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL3ExtendedPriceFx${record.sno}`}
            initialValue={
              record.finalL3ExtendedPriceFx
                ? parseFloat(record.finalL3ExtendedPriceFx).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              readOnly
              disabled={formdisable || countryL3}
              onChange={() =>
                handleChangeInput(
                  `finalL3ExtendedPriceFx${record.sno}`,
                  record.finalL3UnitPriceFx,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL3UnitPriceFx
                  ? parseFloat(record.finalL3UnitPriceFx).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L3 Final Unit Price (Rs.)',
      dataIndex: 'finalL3UnitPrice',
      key: 'finalL3UnitPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL3UnitPrice${record.sno}`}
            initialValue={
              record.finalL3UnitPrice
                ? parseFloat(record.finalL3UnitPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              onChange={() =>
                handleChangeInput(
                  `finalL3ExtendedPrice${record.sno}`,
                  record.finalL3UnitPrice,
                  record.qty,
                )
              }
              type="text"
              value={
                record.finalL3UnitPrice
                  ? parseFloat(record.finalL3UnitPrice).toLocaleString('en-IN')
                  : ''
              }
              maxLength={12}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'L3 Final Extd. Price',
      dataIndex: 'finalL3ExtendedPrice',
      key: 'finalL3ExtendedPrice',
      render: (text, record) => (
        <div style={{ backgroundColor: finalVal === 'L3' ? 'gray' : 'none', padding: '3px' }}>
          <Form.Item
            name={`finalL3ExtendedPrice${record.sno}`}
            initialValue={
              record.finalL3ExtendedPrice
                ? parseFloat(record.finalL3ExtendedPrice).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              disabled
              type="text"
              value={
                record.finalL3ExtendedPrice
                  ? parseFloat(record.finalL3ExtendedPrice).toLocaleString('en-IN')
                  : ''
              }
              // onChange={() => calculateSubTotalfin('L3')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      width: 50,
      render: (text, record) =>
        record.dmId !== '0' ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonComponent
              icon={<DownloadOutlined />}
              onClick={() => downloaddrawn(record)}
              type="primary"
              size="small"
              disable={false}
            />
          </div>
        ) : null,
    },
  ]

  // const PaymentTermsSection = ({ level, data, columns, visible, setVisible, openCard }) => (
  //   <td>
  //     <div style={{ marginBottom: '20px' }}>
  //       <div style={{ width: '100%' }}>
  //         <ButtonComponent
  //           type="primary"
  //           width="100%"
  //           text={`Update ${level} Payment Terms`}
  //           textcolor="white"
  //           bgcolor={data.length>0?"#52c41a":"blue"}
  //           background={data.length>0?"#52c41a":"blue"}
  //           onClick={() => openCard()}
  //         />
  //       </div>

  //       <Popover
  //         onVisibleChange={() => setVisible(false)}
  //         title=""
  //         placement="top"
  //         content={
  //           <div className="custom_antd_Table" style={{ width: '600px' }}>
  //             <TableComponent
  //               data={data}
  //               columns={columns}
  //               scrollY={200}
  //               rowClass={record => !record.enabled && 'disabled-row'}
  //             />
  //           </div>
  //         }
  //         visible={visible}
  //       />
  //     </div>
  //   </td>
  // )

  // function formatNumberWithCommas(number) {
  //   return number.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  // }

  function onChangeFxCalculationForTransport(lType, value) {
    if (lType === 'L1') {
      const l1ExchRate = allPropForm.getFieldValue('exchangeRate1')
      const fxRate = Number(value) * Number(l1ExchRate)
      allPropForm.setFieldsValue({ transportChargeL1in: fxRate })
      calculateSubTotalin('L1')
    }
    if (lType === 'L2') {
      const l2ExchRate = allPropForm.getFieldValue('exchangeRate2')
      const fxRate = Number(value) * Number(l2ExchRate)
      allPropForm.setFieldsValue({ transportChargeL2in: fxRate })
      calculateSubTotalin('L2')
    }
    if (lType === 'L3') {
      const l3ExchRate = allPropForm.getFieldValue('exchangeRate3')
      const fxRate = Number(value) * Number(l3ExchRate)
      allPropForm.setFieldsValue({ transportChargeL3in: fxRate })
      calculateSubTotalin('L3')
    }
  }
  function onChangeFinalFxCalculationForTransport(lType, value) {
    if (lType === 'L1') {
      const l1ExchRate = allPropForm.getFieldValue('exchangeRate1')
      const fxRate = Number(value) * Number(l1ExchRate)
      allPropForm.setFieldsValue({ transportChargeL1fin: fxRate })
      calculateSubTotalfin('L1')
    }
    if (lType === 'L2') {
      const l2ExchRate = allPropForm.getFieldValue('exchangeRate2')
      const fxRate = Number(value) * Number(l2ExchRate)
      allPropForm.setFieldsValue({ transportChargeL2fin: fxRate })
      calculateSubTotalfin('L2')
    }
    if (lType === 'L3') {
      const l3ExchRate = allPropForm.getFieldValue('exchangeRate3')
      const fxRate = Number(value) * Number(l3ExchRate)
      allPropForm.setFieldsValue({ transportChargeL3fin: fxRate })
      calculateSubTotalfin('L3')
    }
  }
  function onChangeFxCalculationForPandF(lType, value) {
    if (lType === 'L1') {
      const l1ExchRate = allPropForm.getFieldValue('exchangeRate1')
      const fxRate = Number(value) * Number(l1ExchRate)
      allPropForm.setFieldsValue({ pfL1in: fxRate })
      calculateSubTotalin('L1')
    }
    if (lType === 'L2') {
      const l2ExchRate = allPropForm.getFieldValue('exchangeRate2')
      const fxRate = Number(value) * Number(l2ExchRate)
      allPropForm.setFieldsValue({ pfL2in: fxRate })
      calculateSubTotalin('L2')
    }
    if (lType === 'L3') {
      const l3ExchRate = allPropForm.getFieldValue('exchangeRate3')
      const fxRate = Number(value) * Number(l3ExchRate)
      allPropForm.setFieldsValue({ pfL3in: fxRate })
      calculateSubTotalin('L3')
    }
  }
  function onChangeFinalFxCalculationForPandF(lType, value) {
    if (lType === 'L1') {
      const l1ExchRate = allPropForm.getFieldValue('exchangeRate1')
      const fxRate = Number(value) * Number(l1ExchRate)
      allPropForm.setFieldsValue({ pfL1fin: fxRate })
      calculateSubTotalfin('L1')
    }
    if (lType === 'L2') {
      const l2ExchRate = allPropForm.getFieldValue('exchangeRate2')
      const fxRate = Number(value) * Number(l2ExchRate)
      allPropForm.setFieldsValue({ pfL2fin: fxRate })
      calculateSubTotalfin('L2')
    }
    if (lType === 'L3') {
      const l3ExchRate = allPropForm.getFieldValue('exchangeRate3')
      const fxRate = Number(value) * Number(l3ExchRate)
      allPropForm.setFieldsValue({ pfL3fin: fxRate })
      calculateSubTotalfin('L3')
    }
  }

  function calculateSubTotalin(levelPrefix) {
    const formValues = allPropForm.getFieldsValue()

    const basicTotalValue = parseFloat(
      (typeof formValues?.[`basicTotal${levelPrefix}inextd`] === 'string'
        ? formValues?.[`basicTotal${levelPrefix}inextd`].replace(/,/g, '')
        : formValues?.[`basicTotal${levelPrefix}inextd`]) || 0,
    )
    const basicTotalValueFx = parseFloat(
      (typeof formValues?.[`basicTotal${levelPrefix}inextdFx`] === 'string'
        ? formValues?.[`basicTotal${levelPrefix}inextdFx`].replace(/,/g, '')
        : formValues?.[`basicTotal${levelPrefix}inextdFx`]) || 0,
    )
    const transportChargeValue = parseFloat(
      (typeof formValues?.[`transportCharge${levelPrefix}in`] === 'string'
        ? formValues?.[`transportCharge${levelPrefix}in`].replace(/,/g, '')
        : formValues?.[`transportCharge${levelPrefix}in`]) || 0,
    )
    const transportChargeValueFx = parseFloat(
      (typeof formValues?.[`transportCharge${levelPrefix}inFx`] === 'string'
        ? formValues?.[`transportCharge${levelPrefix}inFx`].replace(/,/g, '')
        : formValues?.[`transportCharge${levelPrefix}inFx`]) || 0,
    )

    const pfValue = parseFloat(
      (typeof formValues?.[`pf${levelPrefix}in`] === 'string'
        ? formValues?.[`pf${levelPrefix}in`].replace(/,/g, '')
        : formValues?.[`pf${levelPrefix}in`]) || 0,
    )
    const pfValueFx = parseFloat(
      (typeof formValues?.[`pf${levelPrefix}inFx`] === 'string'
        ? formValues?.[`pf${levelPrefix}inFx`].replace(/,/g, '')
        : formValues?.[`pf${levelPrefix}inFx`]) || 0,
    )

    const gstselect = formValues?.[`vendorgst${levelPrefix}`] ?? 1

    const subTotalValue = basicTotalValue + transportChargeValue + pfValue
    const subTotalValueFx = basicTotalValueFx + transportChargeValueFx + pfValueFx
    const gstvalue = parseFloat((subTotalValue * (gstselect / 100)).toFixed(2))
    const gstValueFx = parseFloat((subTotalValueFx * (gstselect / 100)).toFixed(2))
    const landcost = parseFloat((subTotalValue + gstvalue).toFixed(2))
    const landCostFx = parseFloat((subTotalValueFx + gstValueFx).toFixed(2))

    // const gstcval = formatNumberWithCommas(gstvalue)

    allPropForm.setFieldsValue({
      [`transportCharge${levelPrefix}in`]: transportChargeValue.toLocaleString('en-IN'),
      [`transportCharge${levelPrefix}inFx`]: transportChargeValueFx.toLocaleString('en-IN'),
      [`pf${levelPrefix}in`]: pfValue.toLocaleString('en-IN'),
      [`pf${levelPrefix}inFx`]: pfValueFx.toLocaleString('en-IN'),
      [`subTotal${levelPrefix}in`]: subTotalValue.toLocaleString('en-IN'),
      [`subTotal${levelPrefix}inFx`]: basicTotalValueFx.toLocaleString('en-IN'),
      [`gst18${levelPrefix}in`]: gstvalue.toLocaleString('en-IN'),
      [`gst18${levelPrefix}inFx`]: gstValueFx.toLocaleString('en-IN'),
      [`landedCost${levelPrefix}in`]: landcost.toLocaleString('en-IN'),
      [`landedCost${levelPrefix}inFx`]: landCostFx.toLocaleString('en-IN'),
    })
  }

  function calculateSubTotalfin(levelPrefix) {
    const formValues = allPropForm.getFieldsValue()
    const basicTotalValue = parseFloat(
      (typeof formValues?.[`basicTotal${levelPrefix}finextd`] === 'string'
        ? formValues?.[`basicTotal${levelPrefix}finextd`].replace(/,/g, '')
        : formValues?.[`basicTotal${levelPrefix}finextd`]) || 0,
    )
    const basicTotalValueFx = parseFloat(
      (typeof formValues?.[`basicTotal${levelPrefix}finextdFx`] === 'string'
        ? formValues?.[`basicTotal${levelPrefix}finextdFx`].replace(/,/g, '')
        : formValues?.[`basicTotal${levelPrefix}finextdFx`]) || 0,
    )

    const transportChargeValue = parseFloat(
      (typeof formValues?.[`transportCharge${levelPrefix}fin`] === 'string'
        ? formValues?.[`transportCharge${levelPrefix}fin`].replace(/,/g, '')
        : formValues?.[`transportCharge${levelPrefix}fin`]) || 0,
    )
    const transportChargeValueFx = parseFloat(
      (typeof formValues?.[`transportCharge${levelPrefix}finFx`] === 'string'
        ? formValues?.[`transportCharge${levelPrefix}finFx`].replace(/,/g, '')
        : formValues?.[`transportCharge${levelPrefix}finFx`]) || 0,
    )

    const pfValue = parseFloat(
      (typeof formValues?.[`pf${levelPrefix}fin`] === 'string'
        ? formValues?.[`pf${levelPrefix}fin`].replace(/,/g, '')
        : formValues?.[`pf${levelPrefix}fin`]) || 0,
    )
    const pfValueFx = parseFloat(
      (typeof formValues?.[`pf${levelPrefix}finFx`] === 'string'
        ? formValues?.[`pf${levelPrefix}finFx`].replace(/,/g, '')
        : formValues?.[`pf${levelPrefix}finFx`]) || 0,
    )
    const subTotalValue = basicTotalValue + transportChargeValue + pfValue
    const subTotalValueFx = basicTotalValueFx + transportChargeValueFx + pfValueFx
    const gstselect = formValues?.[`vendorgst${levelPrefix}`] ?? 1
    const gstvalue = parseFloat((subTotalValue * (gstselect / 100)).toFixed(2))
    const gstvalueFx = parseFloat((subTotalValueFx * (gstselect / 100)).toFixed(2))
    const landcost = parseFloat((subTotalValue + gstvalue).toFixed(2))
    const landcostFx = parseFloat((subTotalValueFx + gstvalueFx).toFixed(2))

    allPropForm.setFieldsValue({
      [`transportCharge${levelPrefix}fin`]: transportChargeValue.toLocaleString('en-IN'),
      [`transportCharge${levelPrefix}finFx`]: transportChargeValueFx.toLocaleString('en-IN'),
      [`pf${levelPrefix}fin`]: pfValue.toLocaleString('en-IN'),
      [`pf${levelPrefix}finFx`]: pfValueFx.toLocaleString('en-IN'),
      [`subTotal${levelPrefix}fin`]: subTotalValue.toLocaleString('en-IN'),
      [`subTotal${levelPrefix}finFx`]: subTotalValueFx.toLocaleString('en-IN'),
      [`gst18${levelPrefix}fin`]: gstvalue.toLocaleString('en-IN'),
      [`gst18${levelPrefix}finFx`]: gstvalueFx.toLocaleString('en-IN'),
      [`landedCost${levelPrefix}fin`]: landcost.toLocaleString('en-IN'),
      [`landedCost${levelPrefix}finFx`]: landcostFx.toLocaleString('en-IN'),
    })
  }

  const addRemarksSubmit = () => {
    setApproveRemarksCard(true)
  }

  const OpenDetailCard = () => {
    setdetailCard(true)
  }

  const addprevRemarksSubmit = () => {
    setPrevRemarksCard(true)
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

  const handleDeleteSCS = async () => {
    const props = {
      indScpId: igscpId,
      empId: employeeId,
      indentId,
      tenantId,
      mstId,
    }

    const httpDeleteScs = await IndentGroupgetDetails({
      requestPath: 'deleteIndScpDtlId',
      requestData: props,
    })
    if (httpDeleteScs.responseCode === '200') {
      message.success(httpDeleteScs.responseMessage)
      onmodalCancel()
    } else {
      message.error(httpDeleteScs.responseMessage)
    }
  }

  const handlevendorQualify = value => {
    const formValues = allPropForm.getFieldsValue()
    let finalValue = ''
    if (formValues.vendorshortl1 === value) {
      finalValue = 'L1'
    } else if (formValues.vendorshortl2 === value) {
      finalValue = 'L2'
    } else if (formValues.vendorshortl3 === value) {
      finalValue = 'L3'
    }
    setFinalVal(finalValue)

    if (scpVendorDataList && scmHdrdata && scpVendorDataList.length > 0 && scmHdrdata.length > 0) {
      const pjsDueDate =
        scmHdrdata && scmHdrdata.length > 0
          ? moment(scmHdrdata[0].expDeliveryDate).format('YYYY-MM-DD')
          : ''
      const l1DelDate =
        finalValue === 'L1'
          ? formValues.delivery1
          : finalValue === 'L2'
          ? formValues.delivery2
          : formValues.delivery3
      if (pjsDueDate && l1DelDate && moment(l1DelDate).isAfter(pjsDueDate, 'YYYY-MM-DD')) {
        setIsOverDue(true)
      } else {
        setIsOverDue(false)
      }
    }
  }
  const PaymentTermsSection = ({ level, data, columns, visible, setVisible, openCard }) => {
    const buttonColor = data.length > 1 ? 'green' : 'blue'
    return (
      <td>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '100%' }}>
            <ButtonComponent
              width="100%"
              text={`Update ${level} Payment Terms`}
              textcolor="white"
              bgcolor={buttonColor}
              bgcolors={buttonColor}
              onClick={() => openCard()}
              disable={false}
            />
          </div>
          <div style={{ paddingLeft: '100px' }}>
            <Popover
              title={
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Button type="text" disabled={false} onClick={() => setVisible(false)}>
                    X
                  </Button>
                </div>
              }
              content={
                <div className="custom_antd_Table" style={{ width: '600px' }}>
                  <TableComponent
                    data={data}
                    columns={columns}
                    scrollY={200}
                    rowClass={record => !record.enabled && 'disabled-row'}
                  />
                </div>
              }
              visible={visible}
              trigger="click"
              // placement="center"
            />
          </div>
        </div>
      </td>
    )
  }
  const PartnumFieldsComponent = () => {
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
  const SCSFieldsComponent = () => {
    return (
      <div>
        <Skeleton loading={loading} active>
          <Form
            form={allPropForm}
            layout="horizontal"
            disabled={formdisable}
            style={{ margin: '0px' }}
          >
            <Card>
              <Divider orientation="left" style={{ margin: '0px' }}>
                PROJECT DETAILS:
              </Divider>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Project No:
                    </p>
                    <p style={{ marginBottom: '0' }}>
                      {scmHdrdata && scmHdrdata.length > 0 ? scmHdrdata[0].projectCode : ''}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Project Name:
                    </p>
                    <p style={{ marginBottom: '0' }}>
                      {scmHdrdata && scmHdrdata.length > 0 ? scmHdrdata[0].projectName : ''}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Indent Type:
                    </p>
                    <p style={{ marginBottom: '0' }}>{indentType}</p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Indent No.:
                    </p>
                    <p style={{ marginBottom: '0' }}>{indentcode}</p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Indent Date:
                    </p>
                    <p style={{ marginBottom: '0' }}>
                      {scmHdrdata && scmHdrdata.length > 0
                        ? moment(scmHdrdata[0].createdDate).format('DD-MMM-YYYY')
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Expected Delivery:
                    </p>
                    <p style={{ marginBottom: '0' }}>
                      {scmHdrdata && scmHdrdata.length > 0
                        ? moment(scmHdrdata[0].expDeliveryDate).format('DD-MMM-YYYY')
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Station:
                    </p>
                    <p style={{ marginBottom: '0' }}>{station}</p>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Sub Assy. :
                    </p>
                    <p style={{ marginBottom: '0' }}>{subAssy}</p>
                  </div>
                </div>
                {scmHdrdata?.[0]?.costFlowType !== 'NEW' ? (
                  <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                        Budget Cost (Rs.) :
                      </p>

                      <p style={{ marginBottom: '0' }}>
                        {parseFloat(parseFloat(totalcost).toFixed(2)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                        Allocated Value (Rs.) :
                      </p>

                      <p style={{ marginBottom: '0' }}>
                        {scmHdrdata && scmHdrdata.length > 0 && scmHdrdata[0].allocatedValue
                          ? parseFloat(
                              parseFloat(scmHdrdata[0].allocatedValue).toFixed(2),
                            ).toLocaleString('en-IN')
                          : '0'}
                      </p>
                    </div>
                  </div>
                )}
                {scmHdrdata?.[0]?.costFlowType !== 'NEW' ? (
                  <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                        Budget Consumed (Rs.) :
                      </p>

                      <p style={{ marginBottom: '0' }}>
                        {scmHdrdata && scmHdrdata.length > 0 && scmHdrdata[0].totalBudgetConsumed
                          ? parseFloat(
                              parseFloat(scmHdrdata[0].totalBudgetConsumed).toFixed(2),
                            ).toLocaleString('en-IN')
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                        Actual Consumed Value (Rs.) :
                      </p>

                      <p style={{ marginBottom: '0' }}>
                        {scmHdrdata && scmHdrdata.length > 0 && scmHdrdata[0].actualConsumedValue
                          ? parseFloat(
                              parseFloat(scmHdrdata[0].actualConsumedValue).toFixed(2),
                            ).toLocaleString('en-IN')
                          : '0'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Divider orientation="left" style={{ margin: '0px' }}>
                PRODUCT / TECHNICAL:
              </Divider>
              <div className="row">
                {/* <CustomFormItem name="techcomparison" label="Tech. Comparison" colspan="8" /> */}
                {/* <CustomFormItem name="techicalrecom" label="Tech. Recommendation" colspan="8" /> */}
                <CustomFormItem
                  name="vendorevaluation"
                  label="Vendor Evalutation"
                  colspan="8"
                  maxLength={2056}
                />
              </div>

              <Divider orientation="left" style={{ margin: '0px' }}>
                Vendor Shortlisted:
              </Divider>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <Form.Item
                    name="vendorshortl1"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        L1{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L1' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      disabled={isPraCreated}
                      style={{ width: '100%' }}
                      onChange={(value, option) =>
                        handlevendorchange(value, option, 'vendorshortl1')
                      }
                      placeholder="Select Vendor"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children ?? '')?.toLowerCase()?.includes(input?.toLowerCase())
                      }
                    >
                      {vendorlist?.map(item => (
                        <Option
                          key={item.key}
                          value={item.value}
                          country={item.country}
                          currencyType={item.currencyType}
                          disabled={vendorQualify?.some(v => v.key === item.value)}
                        >
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="vendorshortl2"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        L2{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L2' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      disabled={isPraCreated}
                      style={{ width: '100%' }}
                      placeholder="Select Vendor"
                      onChange={(value, option) =>
                        handlevendorchange(value, option, 'vendorshortl2')
                      }
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children ?? '')?.toLowerCase()?.includes(input?.toLowerCase())
                      }
                    >
                      {vendorlist?.map(item => (
                        <Option
                          key={item.key}
                          value={item.value}
                          country={item.country}
                          currencyType={item.currencyType}
                          disabled={vendorQualify?.some(v => v.key === item.value)}
                        >
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="vendorshortl3"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        L3{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L3' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      disabled={isPraCreated}
                      style={{ width: '100%' }}
                      placeholder="Select Vendor"
                      onChange={(value, option) =>
                        handlevendorchange(value, option, 'vendorshortl3')
                      }
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase()?.includes(input?.toLowerCase())
                      }
                    >
                      {vendorlist?.map(item => (
                        <Option
                          key={item.key}
                          value={item.value}
                          country={item.country}
                          currencyType={item.currencyType}
                          disabled={vendorQualify?.some(v => v.key === item.value)}
                        >
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <Form.Item
                    name="vendorgstL1"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Vendor L1 GST (%){' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L1' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select L1 GST"
                      onChange={() => {
                        calculateSubTotalin('L1')
                        calculateSubTotalfin('L1')
                      }}
                    >
                      <Option key="0" value="0">
                        0
                      </Option>
                      <Option key="1" value="5">
                        5
                      </Option>
                      <Option key="2" value="12">
                        12
                      </Option>
                      <Option key="1" value="18">
                        18
                      </Option>
                      <Option key="2" value="28">
                        28
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="vendorgstL2"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Vendor L2 GST (%){' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L2' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select L2 GST"
                      onChange={() => {
                        calculateSubTotalin('L2')
                        calculateSubTotalfin('L2')
                      }}
                    >
                      <Option key="0" value="0">
                        0
                      </Option>
                      <Option key="1" value="5">
                        5
                      </Option>
                      <Option key="2" value="12">
                        12
                      </Option>
                      <Option key="1" value="18">
                        18
                      </Option>
                      <Option key="2" value="28">
                        28
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="vendorgstL3"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Vendor L3 GST (%){' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L3' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select L3 GST"
                      onChange={() => {
                        calculateSubTotalin('L3')
                        calculateSubTotalfin('L3')
                      }}
                    >
                      <Option key="0" value="0">
                        0
                      </Option>
                      <Option key="1" value="5">
                        5
                      </Option>
                      <Option key="2" value="12">
                        12
                      </Option>
                      <Option key="1" value="18">
                        18
                      </Option>
                      <Option key="2" value="28">
                        28
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <CustomFormItem
                    name="justificationL1"
                    label="Justification"
                    colspan="24"
                    maxLength={2056}
                  />
                  <Form.Item
                    name="vendorqualifiedL1"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Vendor Qualified <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    {/* <Input type="text" className="custom-input" /> */}
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select Vendor"
                      onChange={(value, option) => handlevendorQualify(value, option)}
                      // defaultValue={defaultSelectedOption && defaultSelectedOption.key}
                    >
                      {vendorQualify?.map(item => (
                        <Option key={item.key} value={item.key}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="customerapprovedL1"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    label={<span style={{ textAlign: 'center' }}>Customer Preferred</span>}
                  >
                    <Input type="text" className="custom-input" maxLength={256} />
                  </Form.Item>
                  <Form.Item
                    name="scstypeL1"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    label={
                      <span style={{ textAlign: 'center' }}>
                        Type <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    labelAlign="left"
                  >
                    <Select style={{ width: '100%' }} placeholder="Select Type">
                      <Option key="1" value="PO Justification">
                        PO
                      </Option>
                      <Option key="2" value="Cash Voucher">
                        Cash Voucher
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <Divider orientation="left" style={{ margin: '0px' }}>
                Vendor Terms
              </Divider>

              <table className="custom-form-container" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>&nbsp;</th>
                    <th style={{ textAlign: 'center' }}>
                      L1{' '}
                      <span
                        style={{
                          color: 'red',
                          display: finalVal === 'L1' ? 'inline-block' : 'none',
                        }}
                      >
                        {' '}
                        *
                      </span>
                    </th>
                    <th style={{ textAlign: 'center' }}>
                      L2{' '}
                      <span
                        style={{
                          color: 'red',
                          display: finalVal === 'L2' ? 'inline-block' : 'none',
                        }}
                      >
                        {' '}
                        *
                      </span>
                    </th>
                    <th style={{ textAlign: 'center' }}>
                      L3{' '}
                      <span
                        style={{
                          color: 'red',
                          display: finalVal === 'L3' ? 'inline-block' : 'none',
                        }}
                      >
                        {' '}
                        *
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Supplier Name <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="suppliername1" readOnly />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="suppliername2" readOnly />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="suppliername3" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Vendor Code <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="vendorcode1" readOnly />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="vendorcode2" readOnly />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="vendorcode3" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Initial Date <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="initialdate1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="initialdate2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="initialdate3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Initial Ref No. <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="refno1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="refno2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="refno3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Final Date <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="finaldate1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="finaldate2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormDate
                        name="finaldate3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disabledate
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Final Ref No. <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="finalref1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="finalref2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '0px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="finalref3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Delivery <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td style={{ background: finalVal === 'L1' && isOverDue ? 'red' : 'white' }}>
                      <CustomFormDate
                        name="delivery1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        onChange
                        vendoritem="L1"
                      />
                    </td>
                    <td style={{ background: finalVal === 'L2' && isOverDue ? 'red' : 'white' }}>
                      <CustomFormDate
                        name="delivery2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        onChange
                        vendoritem="L2"
                      />
                    </td>
                    <td style={{ background: finalVal === 'L3' && isOverDue ? 'red' : 'white' }}>
                      <CustomFormDate
                        name="delivery3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        onChange
                        vendoritem="L3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Warranty <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="warantyl1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="warantyl2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="warantyl3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      LD <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="ld1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="ld2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="ld3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        maxLength={64}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Country <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="country1" readOnly maxLength={64} />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="country2" readOnly maxLength={64} />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput name="country3" readOnly maxLength={64} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Exchange Rate (Rs.) <span style={{ color: 'red' }}> *</span>
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L1' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="exchangeRate1"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disable={country1?.toLowerCase?.() === 'india' || formdisable}
                        // disable={allPropForm.getFieldValue('country1') === 'india' || formdisable}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L2' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="exchangeRate2"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disable={country2?.toLowerCase?.() === 'india' || formdisable}
                        maxLength={64}
                      />
                    </td>
                    <td
                      style={{
                        background: finalVal === 'L3' ? 'gray' : 'white',
                        padding: '3px 3px 0px 3px',
                      }}
                    >
                      <CustomFormInput
                        name="exchangeRate3"
                        readOnly={isEditable === '0' || isEditable === undefined}
                        disable={country3?.toLowerCase?.() === 'india' || formdisable}
                        maxLength={64}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Payment Terms <span style={{ color: 'red' }}> *</span>
                    </td>

                    <PaymentTermsSection
                      level="L1"
                      data={paymenttermdatal1}
                      columns={paymenttermcolumnsl1}
                      visible={paymttermvisible1}
                      setVisible={setPaymttermvisible1}
                      openCard={Openpaymenttermcard1}
                    />
                    <PaymentTermsSection
                      level="L2"
                      data={paymenttermdatal2}
                      columns={paymenttermcolumnsl2}
                      visible={paymttermvisible2}
                      setVisible={setPaymttermvisible2}
                      openCard={Openpaymenttermcard2}
                    />
                    <PaymentTermsSection
                      level="L3"
                      data={paymenttermdatal3}
                      columns={paymenttermcolumnsl3}
                      visible={paymttermvisible3}
                      setVisible={setPaymttermvisible3}
                      openCard={Openpaymenttermcard3}
                    />
                  </tr>
                </tbody>
              </table>
              <div className="custom_antd_Table">
                <Form
                  form={tableform}
                  onValuesChange={(changedValues, allValues) => {
                    handleTableChange(allValues)
                    // setBaseTabVal(allValues);
                  }}
                  initialValues={{ priceTable }}
                >
                  {/* <TableComponent
                    data={priceTable}
                    columns={pricecolumns}
                    scrollY={450}
                    scrollX={1800}
                    page={false}
                    sticky
                    onRow={(record, rowIndex) => ({
                      rowIndex, // Pass the rowIndex here
                    })}
                  /> */}
                  <Table
                    columns={pricecolumns}
                    dataSource={priceTable}
                    pagination={{
                      pageSizeOptions: ['10', '20', '30', '50', [priceTable.length]],
                      showSizeChanger: true,
                      defaultPageSize: priceTable.length,
                    }}
                    // onChange={handleChange}
                    scroll={{ y: 450, x: 3000 }}
                    // rowClassName={rowClass}
                    bordered
                  />
                </Form>
              </div>
              <div>
                <table className="custom-form-container" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>&nbsp;</th>
                      <th colSpan="8" style={{ textAlign: 'center' }}>
                        L1{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L1' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </th>
                      <th colSpan="8" style={{ textAlign: 'center' }}>
                        L2{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L2' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </th>
                      <th colSpan="8" style={{ textAlign: 'center' }}>
                        L3{' '}
                        <span
                          style={{
                            color: 'red',
                            display: finalVal === 'L3' ? 'inline-block' : 'none',
                          }}
                        >
                          {' '}
                          *
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Basic Total <span style={{ color: 'red' }}> *</span>
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          // width:'100%',
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1inunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1inextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1inunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1inextd" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1finunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1finextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1finunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL1finextd" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2inunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2inunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2inextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2inextd" readOnly />
                      </td>

                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2finunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2finunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2finextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL2finextd" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3inunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3inunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3inextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3inextd" readOnly />
                      </td>

                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3finunitFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3finunit" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3finextdFx" readOnly />
                      </td>
                      <td
                        colSpan="1"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="basicTotalL3finextd" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Transport Charge <span style={{ color: 'red' }}> *</span>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL1inFx"
                          functionname={e => {
                            calculateSubTotalin('L1')
                            onChangeFxCalculationForTransport('L1', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL1}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL1in"
                          functionname={() => calculateSubTotalin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL1finFx"
                          functionname={e => {
                            calculateSubTotalin('L1')
                            onChangeFinalFxCalculationForTransport('L1', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL1}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL1fin"
                          functionname={() => calculateSubTotalfin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL2inFx"
                          functionname={e => {
                            calculateSubTotalin('L2')
                            onChangeFxCalculationForTransport('L2', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL2}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL2in"
                          functionname={() => calculateSubTotalin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL2finFx"
                          functionname={e => {
                            calculateSubTotalin('L2')
                            onChangeFinalFxCalculationForTransport('L2', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL2}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL2fin"
                          functionname={() => calculateSubTotalfin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL3inFx"
                          functionname={e => {
                            calculateSubTotalin('L3')
                            onChangeFxCalculationForTransport('L3', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL3}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL3in"
                          functionname={() => calculateSubTotalin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL3finFx"
                          functionname={e => {
                            calculateSubTotalin('L3')
                            onChangeFinalFxCalculationForTransport('L3', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL3}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="transportChargeL3fin"
                          functionname={() => calculateSubTotalfin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        P&F <span style={{ color: 'red' }}> *</span>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL1inFx"
                          functionname={e => {
                            calculateSubTotalin('L1')
                            onChangeFxCalculationForPandF('L1', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL1}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL1in"
                          functionname={() => calculateSubTotalin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL1finFx"
                          functionname={e => {
                            onChangeFinalFxCalculationForPandF('L1', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL1}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL1fin"
                          functionname={() => calculateSubTotalfin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL2inFx"
                          functionname={e => {
                            calculateSubTotalin('L2')
                            onChangeFxCalculationForPandF('L2', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL2}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL2in"
                          functionname={() => calculateSubTotalin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL2finFx"
                          functionname={e => {
                            onChangeFinalFxCalculationForPandF('L2', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL2}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL2fin"
                          functionname={() => calculateSubTotalfin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL3inFx"
                          functionname={e => {
                            calculateSubTotalin('L3')
                            onChangeFxCalculationForPandF('L3', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL3}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL3in"
                          functionname={() => calculateSubTotalin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL3finFx"
                          functionname={e => {
                            onChangeFinalFxCalculationForPandF('L3', e)
                          }}
                          readOnly={isEditable === '0' || isEditable === undefined || countryL3}
                          maxLength={15}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="pfL3fin"
                          functionname={() => calculateSubTotalfin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                          maxLength={15}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Sub Total <span style={{ color: 'red' }}> *</span>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL1inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL1in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL1finFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL1fin" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL2inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL2in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL2finFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL2fin" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL3inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL3in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL3fin" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="subTotalL3finFx" readOnly />
                      </td>
                    </tr>
                    <tr style={{ display: 'none' }}>
                      <td>
                        GST Value <span style={{ color: 'red' }}> *</span>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L1inFx"
                          functionname={() => calculateSubTotalin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L1in"
                          functionname={() => calculateSubTotalin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L1finFx"
                          functionname={() => calculateSubTotalfin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L1fin"
                          functionname={() => calculateSubTotalfin('L1')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L2inFx"
                          functionname={() => calculateSubTotalin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L2in"
                          functionname={() => calculateSubTotalin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L2finFx"
                          functionname={() => calculateSubTotalfin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L2fin"
                          functionname={() => calculateSubTotalfin('L2')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L3inFx"
                          functionname={() => calculateSubTotalin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L3in"
                          functionname={() => calculateSubTotalin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L3finFx"
                          functionname={() => calculateSubTotalfin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput
                          name="gst18L3fin"
                          functionname={() => calculateSubTotalfin('L3')}
                          readOnly={isEditable === '0' || isEditable === undefined}
                        />
                      </td>
                    </tr>
                    <tr style={{ display: 'none' }}>
                      <td>
                        Landed Cost<span style={{ color: 'red' }}>*</span>
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL1inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL1in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL1finFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L1' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL1fin" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL2inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL2in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL2finFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L2' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL2fin" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL3inFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL3in" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL3finFx" readOnly />
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          background: finalVal === 'L3' ? 'gray' : 'white',
                          padding: '3px 3px 0px 3px',
                        }}
                      >
                        <CustomFormNumberInput name="landedCostL3fin" readOnly />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold' }}> Current Status : </span> {scsStatus}
            </h6>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            {docStatus && docStatus.length > 0 && (
              <ButtonComponent
                type="primary"
                text={docStatus[0].docStatusDesc}
                onClick={() => addRemarksSubmit(docStatus[0].currSequence)}
              />
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
                <div className="custom_antd_Table" style={{ width: isMobile ? '280px' : '500px' }}>
                  {' '}
                  <TableComponent data={rmkDetaillist} columns={remarksColumns} scrollY={300} />
                </div>
              }
              visible={detailCard}
            />
            <span style={{ margin: '0 8px' }} />
            <div style={{ display: isEditable === '0' ? 'none' : 'inline' }}>
              <ButtonComponent
                text="Save"
                disable={isdisablebtn}
                type="primary"
                onClick={() => handleinsert()}
              />
            </div>

            <span style={{ margin: '0 8px' }} />
            {docStatus && docStatus.length > 0 && docStatus?.[0]?.cancelSeq && (
              <ButtonComponent
                type="danger"
                text="Previous Stage"
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
            {isEditable === '1' && (
              <ButtonComponent type="primary" text="Delete PJS" onClick={() => handleDeleteSCS()} />
            )}
          </div>
        </Skeleton>
      </div>
    )
  }

  return (
    <div>
      {isdisablebtn ? (
        <Spin>
          <SCSFieldsComponent />
        </Spin>
      ) : (
        <div>
          <SCSFieldsComponent />
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
      )}
    </div>
  )
}

export default SupCompState
