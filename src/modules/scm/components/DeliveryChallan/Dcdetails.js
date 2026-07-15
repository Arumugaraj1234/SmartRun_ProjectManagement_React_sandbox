import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import { Form, Input, Select, Card, Table, DatePicker, message } from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const Dcdetails = ({ visible, onClose, data }) => {
  const tenantId = store.get('tenantId')
  const Menulistdata = store.get('MenuListData')
  const employeeId = store.get('employeeId')
  const [DcForm] = Form.useForm()
  const { Option } = Select
  const { TextArea } = Input
  const [hsntable, setHsntable] = useState([])

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const response = await indentFileUpload({
      requestPath: 'getDcDtlByDcId',
      requestData: {
        tenantId,
        dcHdrId: data.dcID,
      },
    })
    if (response?.responseData) {
      setHsntable(response?.responseData[0]?.dcDtlList)
      DcForm.setFieldsValue({
        DcType: response?.responseData[0]?.dcType,
        projectCode: data?.projectCode,
        FromdeliveryName: response?.responseData[0]?.shippedFrom,
        fromaddress: response?.responseData[0]?.shippedFromAddress,
        fromcity: response?.responseData[0]?.shippedFromDistrict,
        frompincode: response?.responseData[0]?.shippedPinCode,
        fromstate: response?.responseData[0]?.shippedFromState,
        fromgst: response?.responseData[0]?.shippedGstIn,
        AddressType: response?.responseData[0]?.deliveredTo,
        deliveryName: response?.responseData[0]?.deliveredTo,
        deliveryAddressLine: response?.responseData[0]?.deliveredToAddress,
        deliveryCity: response?.responseData[0]?.deliveredToDistrict,
        deliveryPincode: response?.responseData[0]?.deliveredPinCode,
        deliveryState: response?.responseData[0]?.deliveredToState,
        deliveryGst: response?.responseData[0]?.deliveredGstIn,

        ChallanDate: response?.responseData[0]?.dcDate
          ? moment(response?.responseData[0]?.dcDate)
          : '',
        PoNo: response?.responseData[0]?.poNO,
        PoDate: response?.responseData[0]?.poNO ? moment(response?.responseData[0]?.poDATE) : '',
        TransportationName: response?.responseData[0]?.transportationName,
        TransportationMode: response?.responseData[0]?.transportationMode,
        LRNo: response?.responseData[0]?.lrNo,
        LRDate: response?.responseData[0]?.lrNo
          ? moment(response?.responseData[0]?.lrDateTime)
          : '',

        // Recno: response?.responseData[0]?.recNo,
        Division: response?.responseData[0]?.division,
        ChallanNo: response?.responseData[0]?.dcCode,

        amountInWords: response?.responseData[0]?.amountInWords,
        Remarks: response?.responseData[0]?.remarks,
        TotalBasic: response?.responseData[0]?.totalBasic || 0,
        Gst: getFormattedValue(response?.responseData[0]?.gstValue || 0),
        Total: response?.responseData[0]?.totalValue || 0,
      })
    }
  }

  const cancelDc = async () => {
    const response = await indentFileUpload({
      requestPath: 'cancelDcHdr',
      requestData: {
        tenantId,
        dcHdrId: data.dcID,
        empId: employeeId,
      },
    })
    if (response?.responseCode === '200') {
      message.success(response?.responseDataMessage)
      onClose()
    } else {
      message.error(response?.responseDataMessage)
    }
  }

  const downloadreport = async () => {
    const reqdata = {
      dcId: data.dcID,
      tenantId,
      key: 'deliveryChallan',
    }
    const response = await indentFileUpload({
      requestPath: 'getDeliveryChallanReportPdf',
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
  const getFormattedValue = value => {
    if (!value) {
      return ''
    }
    const inputValue = value.replace(/[^\d.]/g, '')
    const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
    const formattedValue = parsedValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formattedValue
  }

  const columns1 = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '20%',
    },
    {
      title: 'Description of Goods',
      dataIndex: 'descOfGoods',
      key: 'descOfGoods',
      width: '20%',
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnNo',
      key: 'hsnNo',
      width: '10%',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      width: '10%',
    },
    {
      title: 'UOM',
      dataIndex: 'uomDesc',
      key: 'uomDesc',
      width: '10%',
    },
    {
      title: `Unit Rate ${Menulistdata[0].currency}`,
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: '15%',
      render: text => getFormattedValue(text),
    },
    {
      title: `Total Value ${Menulistdata[0].currency}`,
      dataIndex: 'total',
      key: 'total',
      width: '15%',
      align: 'right',
      render: text => getFormattedValue(text),
    },
  ]
  const FieldsComponent = () => {
    return (
      <div className="row">
        <Form form={DcForm} className="create_dc_form" style={{ width: '100%' }} disabled>
          <div>
            <Card className="mt-4">
              <div className="d-flex justify-content-end mb-5">
                <Form.Item
                  name="projectCode"
                  label="Project Number"
                  className="col-md-2 mr-5"
                >
                  <Input placeholder="" />
                </Form.Item>
                <Form.Item
                  name="DcType"
                  label="DC Type"
                  className="col-md-3"
                  initialValue="returnable"
                >
                  <Select style={{ width: '100%' }}>
                    <Option value="returnable">Returnable</Option>
                    <Option value="nonreturnable">Non Returnable</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Shipping From</h5>
                  {/* <Form.Item
                    name="FromAddressType"
                    label={
                      <h5 className="labels" style={{ marginBottom: '0px' }}>
                        Shipping From<span style={{ color: 'red' }}>*</span>
                      </h5>
                    }
                    labelAlign="left"
                  >
                    <Input placeholder="Enter Address" />
                  </Form.Item> */}
                  <Form.Item
                    name="FromdeliveryName"
                    label={
                      <span className="labels">
                        Name<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="" />
                  </Form.Item>
                  <Form.Item
                    name="fromaddress"
                    label={
                      <span className="labels">
                        Address<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter Address" />
                  </Form.Item>
                  <Form.Item
                    name="fromcity"
                    label={
                      <span className="labels">
                        City<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="frompincode"
                    label={
                      <span className="labels">
                        PinCode<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter PinCode" />
                  </Form.Item>
                  <Form.Item
                    name="fromstate"
                    label={
                      <span className="labels">
                        State<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter State" />
                  </Form.Item>
                  <Form.Item
                    name="fromgst"
                    label={
                      <span className="labels">
                        GSTIN<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter GSTIN" />
                  </Form.Item>
                </div>
                {/* <div className='col-md-4' /> */}
                <div className="col-md-6">
                  <h5>Delivered To</h5>
                  {/* <Form.Item
                    name="AddressType"
                    label={
                      <h5 className="labels" style={{ marginBottom: '0px' }}>
                        Delivered To<span style={{ color: 'red' }}>*</span>
                      </h5>
                    }
                    labelAlign="left"
                  >
                    <Input placeholder="" />
                  </Form.Item> */}
                  <Form.Item
                    name="deliveryName"
                    label={
                      <span className="labels">
                        Name<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="" />
                  </Form.Item>
                  <Form.Item
                    name="deliveryAddressLine"
                    label={
                      <span className="labels">
                        Address<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter Address" />
                  </Form.Item>
                  <Form.Item
                    name="deliveryCity"
                    label={
                      <span className="labels">
                        City<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="deliveryPincode"
                    label={
                      <span className="labels">
                        PinCode<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter PinCode" />
                  </Form.Item>
                  <Form.Item
                    name="deliveryState"
                    label={
                      <span className="labels">
                        State<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter State" />
                  </Form.Item>
                  <Form.Item
                    name="deliveryGst"
                    label={
                      <span className="labels">
                        GSTIN<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter GSTIN" />
                  </Form.Item>
                </div>
              </div>
            </Card>
            <Card className="mt-2">
              <div className="row">
                <div className="col-md-6 mt-2">
                  {/* <Form.Item
                    name="Recno"
                    label={
                      <span className="labels">
                        Rec No<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter Rec No" />
                  </Form.Item> */}
                  <Form.Item
                    name="Division"
                    label={
                      <span className="labels">
                        Division<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter Division" />
                  </Form.Item>
                  <Form.Item
                    name="ChallanNo"
                    label={
                      <span className="labels">
                        DC No<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <Input placeholder="Enter DC No" />
                  </Form.Item>
                  <Form.Item
                    name="ChallanDate"
                    label={
                      <span className="labels">
                        DC Date<span className="mandatorystar"> *</span>
                      </span>
                    }
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 mt-2">
                  <Form.Item name="PoNo" label={<span className="labels">Po. No.</span>}>
                    <Input placeholder="Enter Po. No." />
                  </Form.Item>
                  <Form.Item name="PoDate" label={<span className="labels">Po. Date</span>}>
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="TransportationName"
                    label={<span className="labels">Transportation Name</span>}
                  >
                    <Input placeholder="Enter Transportation Name" />
                  </Form.Item>
                  <Form.Item
                    name="TransportationMode"
                    label={<span className="labels">Transportation Mode</span>}
                  >
                    <Input placeholder="Enter Transportation Mode" />
                  </Form.Item>
                  <Form.Item name="LRNo" label={<span className="labels">LR No.</span>}>
                    <Input placeholder="Enter LR No." />
                  </Form.Item>
                  <Form.Item name="LRDate" label={<span className="labels">LR Date</span>}>
                    <DatePicker
                      format="DD-MMM-YYYY"
                      className="custom-input"
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div>
                <Table columns={columns1} dataSource={hsntable} pagination={false} />
              </div>
              <div className="row mt-4">
                <div className="col-md-5 remarks_section">
                  <Form.Item
                    name="amountInWords"
                    label={<h5 className="labels">Amount in Words</h5>}
                  >
                    <TextArea className="custom-input" disabled />
                  </Form.Item>

                  <Form.Item
                    name="Remarks"
                    className="mt-3"
                    label={
                      <h5 className="labels">
                        Remarks<span className="mandatorystar"> *</span>
                      </h5>
                    }
                  >
                    <TextArea className="custom-input" />
                  </Form.Item>
                </div>
                <div className="col-md-2" />
                <div className="col-md-5">
                  <Form.Item
                    name="TotalBasic"
                    label={<span className="labels">Basic Total{Menulistdata[0].currency}</span>}
                  >
                    <Input placeholder="0.00" disabled />
                  </Form.Item>
                  <Form.Item name="Gst" label={<span className="labels">GST</span>}>
                    <Input placeholder="0.00" />
                  </Form.Item>
                  <Form.Item
                    name="Total"
                    label={<span className="labels">Total Value{Menulistdata[0].currency}</span>}
                  >
                    <Input placeholder="0.00" disabled />
                  </Form.Item>
                </div>
              </div>
            </Card>
          </div>
        </Form>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
          }}
        >
          <div>
            {data.isCancel === '0' ? (
              <ButtonComponent text="Cancel DC" type="primary" onClick={cancelDc} />
            ) : null}
          </div>
          <div>
            <ButtonComponent text="Export DC" type="primary" onClick={downloadreport} />
          </div>
        </div>
      </div>
    )
  }
  return (
    <ModalPopup
      isModalVisible={visible}
      onCancel={onClose}
      FieldsComponent={FieldsComponent}
      text="Delivery challan Details"
      width="90%"
    />
  )
}

export default Dcdetails
