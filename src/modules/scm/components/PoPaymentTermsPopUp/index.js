import React, { useState, useEffect } from 'react'
import { Button, Form, Input, DatePicker, AutoComplete, Checkbox, Select, message } from 'antd'
import moment from 'moment'
import store from 'store'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const { Option } = Select
const PaymentTermsPopUp = props => {
  const {
    igst,
    gst,
    po,
    resp,
    isLoading,
    onCancel,
    projectList,
    indexVal,
    Multiselect,
    PoCostType,
  } = props
  // const [paymentTypeval, setPaymentType] = useState('')
  const [selectedValues, setSelectedValues] = useState([])
  const [deliveryType, setDeliveryType] = useState('')
  const [invoiceValue, setInvoiceValue] = useState('0.00')
  const [transportValue, setTransportValue] = useState('0.000')
  const [pfValue, setPfValue] = useState('0.000')
  const [insuranceValue, setInsuranceValue] = useState('0.000')
  const [otherValue, setOtherValue] = useState('0.000')
  const [gstValue, setGstValue] = useState('0.000')
  const [IGstValue, setIGstValue] = useState('0.000')
  const [isFinal, setIsFinal] = useState('0')
  const [grnDisabled, setGrnDisabled] = useState(false)
  const [isGrnSelected, setIsGrnSelected] = useState(false)
  const [isdisablebtn, setIsdisablebtn] = useState(false)
  const [isPendingChecked, setIsPendingChecked] = useState(false)
  const [previousPendingValue, setPreviousPendingValue] = useState(resp.pendingAmount || '')
  const [poCostTypeValue, setPoCostTypeValue] = useState('')
  //   const [isLoadingCard , setIsLoadingCard] = useState(isLoading)
  const [form] = Form.useForm()
  //   const { percentage } = resp
  const pmhdrId = store.get('ProjectID')
  const tenantid = store.get('tenantId')
  const enqId = store.get('EnquiryId')
  const empId = store.get('employeeId')
  const tab = store.get('Tab')
  const Menulistdata = store.get('MenuListData')
  const tax = po?.replace(/,/g, '')
  const GST = gst ? gst.toString().replace(/,/g, '') : ''
  console.log('GST', GST)
  const IGST = igst ? String(igst).replace(/,/g, '') : '0'
  console.log(tax, igst, '----------------')
  console.log(isFinal)
  const onFinish = () => {
    insertDetails()
  }
  const calculatePendingAmount = () => {
    // Reset the 'invoiceValue' field
    form.resetFields(['invoiceValue'])

    const pendingAmount = Math.round(Number(resp.pendingAmount))
    let withoutgst = pendingAmount

    if (pendingAmount >= 0) {
      if (GST !== '0') {
        withoutgst -= Math.round(Number(GST))
      } else if (IGST !== '0') {
        withoutgst -= Math.round(Number(IGST))
      }
    }
    return withoutgst <= 0 ? pendingAmount : withoutgst
  }

  useEffect(() => {
    const project = projectList[0] || {}
    setInsuranceValue(project.pendingInsuranceChrg ?? project.insuranceValue)
    setOtherValue(project.pendingOtherChrg ?? project.others)
    setTransportValue(project.pendingTransportChrg ?? project.transportCharges ?? '0.000')
    setPfValue(project.pendingPfChrg ?? project.pf ?? '0.000')
  }, [projectList])

  const calculateTotalPayable = () => {
    const total =
      Number(invoiceValue || 0) +
      Number(transportValue || 0) +
      Number(pfValue || 0) +
      Number(insuranceValue || 0) +
      Number(otherValue || 0) +
      Number(gstValue || 0) +
      Number(IGstValue || 0)

    return total.toFixed(2)
  }

  useEffect(() => {
    const total = calculateTotalPayable()

    form.setFieldsValue({
      totalAmountPayable: total,
    })
  }, [invoiceValue, transportValue, pfValue, insuranceValue, otherValue, gstValue, IGstValue])

  useEffect(() => {
    if (projectList.length > 0 && resp) {
      console.log('projectList', projectList)
      console.log('resp', resp)
      console.log('is pending check', resp.pendingAmount === '0.000')
      const project = projectList[0] || {}
      if (GST !== '0') {
        const gstCharge = project.pendingGst ?? project.gst ?? ''
        form.setFieldsValue({
          gstValue: parseFloat(gstCharge).toFixed(2),
        })
        setGstValue(gstCharge)
      } else if (IGST !== '0') {
        const iGstCharge = project.pendingGst ?? project.igst ?? ''
        form.setFieldsValue({
          gstValue: parseFloat(iGstCharge).toFixed(2),
        })
        setIGstValue(iGstCharge)
      }
      form.setFieldsValue({
        po: projectList[0]?.poCode || '',
        podate: projectList[0]?.date ? moment(projectList[0].date) : '',
        paymentType: indexVal,
        // pendingAmount: resp.pendingAmount ? Math.round(parseFloat(resp.pendingAmount)) : '',
        // paymentAmount: resp.paymentAmount ? Math.round(parseFloat(resp.paymentAmount)) : '',
        vendorName: projectList[0]?.vendorName || '',
      })
      if (GST !== '0' && resp?.isLast === '1') {
        console.log('Transpoert charge', transportValue)
        const pmntamount = Math.round(Number(resp.paymentAmount)) - Math.round(Number(GST))
        form.setFieldsValue({
          paymentAmount: pmntamount,
        })
        const pendingGstForCalc = Number(project.pendingGst ?? project.gst ?? GST)
        const pndngamount = Math.round(Number(resp.pendingAmount)) - Math.round(pendingGstForCalc)
        if (pndngamount > 0) {
          form.setFieldsValue({
            pendingAmount: pndngamount,
          })
        } else {
          form.setFieldsValue({
            pendingAmount: resp.pendingAmount ? Math.round(parseFloat(resp.pendingAmount)) : '',
            // gstValue: '0.00',
          })
        }
      } else if (IGST !== '0' && resp?.isLast === '1') {
        const pmntamount = Math.round(Number(resp.paymentAmount)) - Math.round(Number(IGST))
        form.setFieldsValue({
          paymentAmount: pmntamount,
        })
        const pendingIgstForCalc = Number(project.pendingGst ?? project.igst ?? IGST)
        const amount = Math.round(Number(resp.pendingAmount)) - Math.round(pendingIgstForCalc)
        if (amount > 0) {
          form.setFieldsValue({
            pendingAmount: amount,
          })
        } else {
          form.setFieldsValue({
            pendingAmount: resp.pendingAmount ? Math.round(parseFloat(resp.pendingAmount)) : '',
            // gstValue: '0.00',
          })
        }
      } else {
        form.setFieldsValue({
          pendingAmount: resp.pendingAmount ? Math.round(parseFloat(resp.pendingAmount)) : '',
          paymentAmount: resp.paymentAmount ? Math.round(parseFloat(resp.paymentAmount)) : '',
        })
      }
      console.log(
        'Transport chargessss',
        parseFloat(project.pendingTransportChrg ?? project.transportCharges ?? '0.00').toFixed(2),
      )
      // form.setFieldsValue({
      //   transportCharge: parseFloat(project.pendingTransportChrg).toFixed(2) ?? parseFloat(project.transportCharges).toFixed(2) ?? '0.00',
      //   otherCharge: parseFloat(project.pendingOtherChrg).toFixed(2) ?? parseFloat(project.others).toFixed(2) ?? '0.00',
      //   pfCharge: parseFloat(project.pendingPfChrg).toFixed(2) ?? parseFloat(project.pf).toFixed(2) ?? '0.00',
      //   insuranceCharge: parseFloat(project.pendingInsuranceChrg).toFixed(2) ?? parseFloat(project.insuranceValue).toFixed(2) ?? '0.00',
      // })
      form.setFieldsValue({
        transportCharge: !Number.isNaN(
          parseFloat(project.pendingTransportChrg ?? project.transportCharges),
        )
          ? parseFloat(project.pendingTransportChrg ?? project.transportCharges).toFixed(2)
          : '0.00',

        otherCharge: !Number.isNaN(parseFloat(project.pendingOtherChrg ?? project.others))
          ? parseFloat(project.pendingOtherChrg ?? project.others).toFixed(2)
          : '0.00',

        pfCharge: !Number.isNaN(parseFloat(project.pendingPfChrg ?? project.pf))
          ? parseFloat(project.pendingPfChrg ?? project.pf).toFixed(2)
          : '0.00',

        insuranceCharge: !Number.isNaN(
          parseFloat(project.pendingInsuranceChrg ?? project.insuranceValue),
        )
          ? parseFloat(project.pendingInsuranceChrg ?? project.insuranceValue).toFixed(2)
          : '0.00',
      })

      // Calculate pending amount excluding transport, pf, insurance, and other charges if handled separately
      // let adjustedPending = Number(resp.pendingAmount || 0)
      let adjustedPending = form.getFieldValue('pendingAmount')

      // Only reduce if it's a final bill or transport handled separately
      if (resp?.isLast === '1') {
        const transport = Number(project.pendingTransportChrg ?? project.transportCharges ?? 0)
        const pf = Number(project.pendingPfChrg ?? project.pf ?? 0)
        const insurance = Number(project.pendingInsuranceChrg ?? project.insuranceValue ?? 0)
        const others = Number(project.pendingOtherChrg ?? project.others ?? 0)

        // Reduce these values from pendingAmount
        adjustedPending -= transport + pf + insurance + others

        if (adjustedPending < 0) adjustedPending = 0
      }

      form.setFieldsValue({
        pendingAmount: adjustedPending.toFixed(2),
      })
    }
  }, [projectList, resp, indexVal, form])

  const obj = [
    { value: 'As per PO' },
    { value: 'As per Actual' },
    // Add more static options as needed
  ]

  const handleAutoCompleteChange = e => {
    setDeliveryType(e.target.value)
  }
  const handleCheckboxChangePendingAmount = e => {
    const ischecked = e.target.checked
    setIsPendingChecked(ischecked)
    const val = calculatePendingAmount()
    if (ischecked) {
      setPreviousPendingValue(form.getFieldValue('pendingAmount'))
      form.setFieldsValue({ pendingAmount: val })
    } else {
      form.setFieldsValue({ pendingAmount: previousPendingValue })
    }
  }

  const handleAutoCompleteChangeValue = e => {
    console.log('is Final', isFinal)
    const value = parseFloat(e.target.value)
    const formvalue = form.getFieldValue()
    const pendingValue = formvalue.pendingAmount

    if (value >= 0 && value <= pendingValue && value !== 0) {
      setInvoiceValue(String(value))
      form.setFieldsValue({ paymentType: indexVal })
      if (indexVal === 'Final Payment') {
        if (Number(pendingValue) - Number(value) === 0) {
          setIsFinal('1')
        } else {
          setIsFinal('0')
        }
      }
    } else {
      message.warning('Amount is out of the pending value range.')
      form.setFieldsValue({ invoiceValue: '' })
      setInvoiceValue('0.00')
    }
  }
  const handlePendingValueForTransport = e => {
    const value = parseFloat(e.target.value)
    const formvalue = form.getFieldValue()
    const pendAmount = formvalue.pendingAmount
    if (pendAmount !== 0) {
      console.log('ok')
    } else {
      console.log('Pending successfull')
      setIsFinal('1')
    }
    // const formvalue = form.getFieldValue()
    const project = projectList[0] || {}
    const transportCharges = project.pendingTransportChrg ?? project.transportCharges ?? ''

    if (value >= 0 && value <= transportCharges && value !== 0) {
      setTransportValue(value)
      if (isFinal === '1' && value < transportCharges) {
        // message.warning('For final payment, the full transport charge amount must be entered.')
        form.setFieldsValue({ transportCharge: undefined })
        setTransportValue('0.00')
      }
    } else if (isFinal === '1') {
      // message.warning('Amount is out of the transport range.')
      form.setFieldsValue({ transportCharge: undefined })
      setTransportValue('0.00')
    } else {
      form.setFieldsValue({ transportCharge: undefined })
      setTransportValue('0.00')
    }
  }
  const handlePendingValueForPf = e => {
    const value = parseFloat(e.target.value)
    const formvalue = form.getFieldValue()
    const pendAmount = formvalue.pendingAmount
    if (pendAmount !== 0) {
      console.log('ok')
    } else {
      console.log('Pending successfull')
      setIsFinal('1')
    }
    // const formvalue = form.getFieldValue()
    const project = projectList[0] || {}
    const pfCharges = project.pendingPfChrg ?? project.pf ?? ''

    if (value >= 0 && value <= pfCharges && value !== 0) {
      setPfValue(value)
      if (isFinal === '1' && value < pfCharges) {
        // message.warning('For final payment, the full P&F charge amount must be entered.')
        form.setFieldsValue({ pfCharge: undefined })
        // setPfValue('0.000')
      }
    } else if (isFinal === '1') {
      // message.warning('Amount is out of the P&F range.')
      form.setFieldsValue({ pfCharge: undefined })
      // setPfValue('0.000')
    } else {
      form.setFieldsValue({ pfCharge: undefined })
      // setPfValue('0.000')
    }
  }
  const handlePendingValueForInsurance = e => {
    const value = parseFloat(e.target.value)
    const formvalue = form.getFieldValue()
    const pendAmount = formvalue.pendingAmount
    if (pendAmount !== 0) {
      console.log('ok')
    } else {
      console.log('Pending successfull')
      setIsFinal('1')
    }
    // const formvalue = form.getFieldValue()
    const project = projectList[0] || {}
    const insuranceCharges = project.pendingInsuranceChrg ?? project.insuranceValue ?? ''

    if (value >= 0 && value <= insuranceCharges && value !== 0) {
      setInsuranceValue(value)
      if (isFinal === '1' && value < insuranceCharges) {
        // message.warning('For final payment, the full insurance charge amount must be entered.')
        form.setFieldsValue({ insuranceCharge: undefined })
        // setInsuranceValue('0.000')
      }
    } else if (isFinal === '1') {
      // message.warning('Amount is out of the Insurance range.')
      form.setFieldsValue({ insuranceCharge: undefined })
      // setInsuranceValue('0.000')
    } else {
      form.setFieldsValue({ insuranceCharge: undefined })
      // setInsuranceValue('0.000')
    }
  }
  const handlePendingValueForGst = e => {
    const value = parseFloat(e.target.value)
    const formvalue = form.getFieldValue()
    const pendAmount = formvalue.pendingAmount
    if (pendAmount !== 0) {
      console.log('ok')
    } else {
      console.log('Pending successfull')
      setIsFinal('1')
    }
    console.log('GSTCheck', GST, value, isFinal, pendAmount)
    // const formvalue = form.getFieldValue()
    const project = projectList[0] || {}
    let gstCharge
    if (GST !== '0') {
      gstCharge = project.pendingGst ?? project.gst ?? ''
    } else if (IGST !== '0') {
      gstCharge = project.pendingGst ?? project.igst ?? ''
    }

    if (value >= 0 && value <= gstCharge && value !== 0) {
      if (GST !== '0') {
        setGstValue(String(value))
      } else {
        setIGstValue(String(value))
      }

      if (isFinal === '1' && value < gstCharge) {
        // message.warning('For final payment, the full GST amount must be entered.')
        // form.setFieldsValue({ gstValue: undefined })
        console.log('GST Check', value, GST)
        if (GST !== '0') {
          setGstValue(value)
        } else {
          setIGstValue(value)
        }
      }
    } else if (isFinal === '1') {
      // message.warning('Amount is out of the GST charge range.')
      form.setFieldsValue({ gstValue: undefined })
      setGstValue('0.000')
      setIGstValue('0.000')
    } else {
      form.setFieldsValue({ gstValue: undefined })
      setGstValue('0.000')
      setIGstValue('0.000')
    }
  }
  const handlePendingValueForOther = e => {
    const value = parseFloat(e.target.value)
    // const formvalue = form.getFieldValue()
    const project = projectList[0] || {}
    const otherCharges = project.pendingOtherChrg ?? project.others ?? ''

    if (value >= 0 && value <= otherCharges && value !== 0) {
      setOtherValue(value)
      if (isFinal === '1' && value < otherCharges) {
        // message.warning('For final payment, the full other charges amount must be entered.')
        form.setFieldsValue({ otherCharge: undefined })
        // setOtherValue('0.000')
      }
    } else if (isFinal === '1') {
      // message.warning('Amount is out of the Other charge range.')
      form.setFieldsValue({ otherCharge: undefined })
      // setOtherValue('0.000')
    } else {
      form.setFieldsValue({ otherCharge: undefined })
      // setOtherValue('0.000')
    }
  }

  const handleChange = values => {
    setSelectedValues(values)
    if (values && values.length > 0) {
      const selectedGrn = Multiselect.find(option => option.grnHdrId === values[0])
      if (selectedGrn) {
        form.setFieldsValue({
          invoiceNumber: selectedGrn.dcNo || '',
          invoiceDate: selectedGrn.dcDate ? moment(selectedGrn.dcDate, 'YYYY-MM-DD') : undefined,
        })
      }
      setIsGrnSelected(true)
    } else {
      form.setFieldsValue({ invoiceNumber: '', invoiceDate: undefined })
      setIsGrnSelected(false)
    }
  }
  const handlePoCostTypeChange = values => {
    setPoCostTypeValue(values)
  }

  const insertDetails = async () => {
    if (!tenantid) {
      message.error('Session data missing. Please log out and log back in, then try again.')
      return
    }
    if (
      [
        'deliveryType',
        'grn',
        'poCostType',
        ...(resp.pendingAmount === '0.000' ? [] : ['invoiceValue']),
        // ...(isFinal === '1'
        //   ? ['transportCharge', 'otherCharge', 'pfCharge', 'insuranceCharge', 'gstValue']
        //   : []),
      ].every(field => form.getFieldValue(field))
    ) {
      const formData = form.getFieldsValue()
      console.log('Insurance value', formData.insuranceNumber)
      setIsdisablebtn(true)
      // const sanitize = val =>
      //   val && typeof val === 'string' && val.trim() !== '' ? val.replace(/,/g, '').trim() : '0'
      const safeGst = gstValue
      const safeIgst = IGstValue
      const response = await indentFileUpload({
        requestPath: 'InsertPRA',
        requestData: {
          grnHdrId: selectedValues.join(','),
          poId: projectList[0].poId,
          paymentTerms: formData.paymentType,
          deliveryType,
          poDate: projectList[0].date,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : null,
          // invoiceDate: formData.invoiceDate
          //   ? new Date(formData.invoiceDate).toISOString().split('T')[0]
          //   : null,
          invoiceDate: formData.invoiceDate ? formData.invoiceDate.format('YYYY-MM-DD') : null,
          potId: resp.potId,
          isLast: isFinal,
          pmHdrId: pmhdrId,
          vendorCode: projectList[0].vendorCode,
          tds: projectList[0].tds,
          remarks: projectList[0].remarks,
          tenantId: tenantid,
          orderValue: projectList[0].totalValue,
          praDate: moment(new Date()).format('YYYY-MM-DD'),
          typeOfPayment: formData.paymentType,
          enquiryId: enqId,
          processCode: tab.processCode,
          empId,
          poCode: projectList[0].poCode,
          isCompleted: '0',
          invoiceValue,
          transportValue: resp?.isLast === '1' ? transportValue : '0.000',
          pfValue: resp?.isLast === '1' ? pfValue : '0.000',
          otherValue: resp?.isLast === '1' ? otherValue : '0.000',
          insuranceValue: resp?.isLast === '1' ? insuranceValue : '0.000',
          poCostType: formData.poCostType,
          invoiceNumber: formData.invoiceNumber ? formData.invoiceNumber : '',
          gst: resp?.isLast === '1' && parseFloat(igst) === 0 ? safeGst : '0.000',
          igst: resp?.isLast === '1' ? safeIgst : '0.000',
        },
      })

      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        setIsdisablebtn(false)
        onCancel()
      } else {
        message.error(response.responseMessage)
        setIsdisablebtn(false)
      }
    } else if (
      isFinal === '1' &&
      ['deliveryType', 'grn', 'invoiceValue', 'poCostType'].every(field =>
        form.getFieldValue(field),
      )
    ) {
      const fieldLabels = {
        transportCharge: 'Transport Charge',
        otherCharge: 'Other Charge',
        pfCharge: 'PF Charge',
        insuranceCharge: 'Insurance Charge',
        gstValue: 'GST',
        grn: 'GRN',
      }

      const requiredFields = Object.keys(fieldLabels)
      const missingFields = requiredFields.filter(field => !form.getFieldValue(field))

      if (missingFields.length > 0) {
        // const missingLabels = missingFields.map(field => fieldLabels[field] || field)
        // message.warn(
        //   `Final payment — please complete the following field(s): ${missingLabels.join(', ')}.`,
        // )
      }
    } else {
      messageReturn(405)
      setIsdisablebtn(false)
    }
  }

  const handleCheckboxChange = e => {
    const { checked } = e.target

    setGrnDisabled(checked) // Update grnDisabled based on checkbox state

    if (checked) {
      setSelectedValues([]) // Clear selected values if checkbox is checked
      form.setFieldsValue({ grn: [], invoiceNumber: '', invoiceDate: undefined }) // Reset form field values
      setIsGrnSelected(false)
    }
  }

  const title = `PRA Details - ${resp.poId} - ${resp.term} - ${resp.isLast}`
  const DetailsTableComponent = () => {
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="container-fluid">
          {/* First Row */}
          <div className="row">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="po" label="PO">
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="podate" label="PO Date">
                <DatePicker format="DD-MM-YYYY" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="paymentType" label="Payment Type">
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="paymentAmount" label={`Taxable Value ${Menulistdata[0].currency}`}>
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="pendingAmount" label={`Pending Value ${Menulistdata[0].currency}`}>
                <Input type="text" disabled />
              </Form.Item>
              {resp.isLast === '1' && (
                <div style={{ display: 'none', marginTop: '-24px' }}>
                  <Checkbox checked={isPendingChecked} onChange={handleCheckboxChangePendingAmount}>
                    <span>Without GST</span>
                  </Checkbox>
                </div>
              )}
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item
                name="invoiceValue"
                label={
                  <span>
                    {`Amount ${Menulistdata[0].currency}`}
                    <span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <AutoComplete
                  onBlur={handleAutoCompleteChangeValue}
                  disabled={resp.pendingAmount === '0.000'}
                >
                  <Input placeholder="Type here" type="Number" />
                </AutoComplete>
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item
                name="deliveryType"
                label={
                  <span>
                    Delivery Type<span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <AutoComplete options={obj} onBlur={handleAutoCompleteChange}>
                  <Input placeholder="Select or type here" />
                </AutoComplete>
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="vendorName" label="Vendor Name">
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="grn"
                label={
                  <span>
                    GRN<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                style={{ marginBottom: '10px' }}
              >
                <Select
                  id="approvalDropdown"
                  style={{ width: '100%' }}
                  placeholder="Select"
                  mode="multiple"
                  value={selectedValues}
                  onChange={handleChange}
                  disabled={grnDisabled}
                >
                  {Multiselect.map(option => (
                    <Option key="serial-number" value={option.grnHdrId}>
                      {option.grnCode !== null ? option.grnCode : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <div style={{ marginTop: '-10px' }}>
                <Checkbox checked={grnDisabled} onChange={handleCheckboxChange} />
                <span>NA</span>
              </div>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="invoiceNumber" label="Proforma / Invoice Number">
                <Input type="text" placeholder="Type here" disabled={isGrnSelected} />
              </Form.Item>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item
                name="poCostType"
                label={
                  <span>
                    Po Cost Type<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                style={{ marginBottom: '10px' }}
              >
                <Select
                  id="poCostTypeDropDown"
                  style={{ width: '100%' }}
                  placeholder="Select"
                  // mode="multiple"
                  value={poCostTypeValue}
                  onChange={handlePoCostTypeChange}
                  // disabled={grnDisabled}
                >
                  {PoCostType.map(option => (
                    <Option key={option.pctId} value={option.pctId}>
                      {option.pctDesc !== null ? option.pctDesc : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="invoiceDate" label="Proforma / Invoice Date">
                <DatePicker format="DD-MM-YYYY" disabled={isGrnSelected} />
              </Form.Item>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker format="DD-MM-YYYY" />
              </Form.Item>
            </div>
            {resp?.isLast === '1' && (
              <>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item
                    name="transportCharge"
                    label={
                      <span>
                        {`Transport Charge`}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </span>
                    }
                  >
                    <AutoComplete
                      onBlur={handlePendingValueForTransport}
                      // eslint-disable-next-line
                      disabled={form.getFieldValue('transportCharge') == 0}
                    >
                      <Input placeholder="Type here" type="Number" />
                    </AutoComplete>
                  </Form.Item>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item
                    name="pfCharge"
                    label={
                      <span>
                        {`P&F`}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </span>
                    }
                  >
                    <AutoComplete
                      onBlur={handlePendingValueForPf}
                      // eslint-disable-next-line
                      disabled={form.getFieldValue('pfCharge') == 0}
                    >
                      <Input placeholder="Type here" type="Number" />
                    </AutoComplete>
                  </Form.Item>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item
                    name="insuranceCharge"
                    label={
                      <span>
                        {`Insurance`}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </span>
                    }
                  >
                    <AutoComplete
                      onBlur={handlePendingValueForInsurance}
                      // eslint-disable-next-line
                      disabled={form.getFieldValue('insuranceCharge') == 0}
                    >
                      <Input placeholder="Type here" type="Number" />
                    </AutoComplete>
                  </Form.Item>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item
                    name="otherCharge"
                    label={
                      <span>
                        {`Others`}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </span>
                    }
                  >
                    <AutoComplete
                      onBlur={handlePendingValueForOther}
                      // eslint-disable-next-line
                      disabled={form.getFieldValue('otherCharge') == 0}
                    >
                      <Input placeholder="Type here" type="Number" />
                    </AutoComplete>
                  </Form.Item>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item
                    name="gstValue"
                    label={
                      <span>
                        {`GST`}
                        {/* <span style={{ color: 'red' }}>*</span> */}
                      </span>
                    }
                  >
                    <AutoComplete
                      onBlur={handlePendingValueForGst}
                      // eslint-disable-next-line
                      disabled={form.getFieldValue('gstValue') == 0}
                    >
                      <Input placeholder="Type here" type="Number" />
                    </AutoComplete>
                  </Form.Item>
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                  <Form.Item name="totalAmountPayable" label="Amount Payable">
                    <Input type="text" disabled />
                  </Form.Item>
                </div>
              </>
            )}
          </div>

          {/* Third Row */}
          {/* <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
              <Form.Item name="grnNa" label="GRN NA" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </div>
          </div> */}

          {/* Button Row */}
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}
          >
            <Button type="primary" htmlType="submit" disabled={isdisablebtn}>
              Submit
            </Button>
            <Button type="primary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    )
  }

  return (
    <>
      <ModalPopup
        text={title}
        isModalVisible={isLoading}
        onCancel={onCancel}
        FieldsComponent={DetailsTableComponent}
        width={1450}
      />
    </>
  )
}

export default PaymentTermsPopUp
