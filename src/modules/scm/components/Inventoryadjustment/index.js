/* eslint-disable */
import React, { useState } from 'react'
import { Card, Col, Form, Row, Button, message, DatePicker, Divider, Select, Input } from 'antd'
import { Table } from 'ant-table-extensions'
import store from 'store'
import moment from 'moment'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import currentDateTime from '../../../../currentDateTime'
import messageReturn from '_helpers/messageReturn'

const Inventoryadjustment = () => {
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantID = store.get('tenantId')
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const [adjmentTable, setAdjmentTable] = useState([])
  const [adjmentTab, setAdjmentTab] = useState(null)
  const [insertModalVisible, setinsertModalVisible] = useState(false)
  const [showMaterialDtl, setshowMaterialDtl] = useState(false)
  const [projectlist, setprojectlist] = useState([])
  const [productlist, setproductlist] = useState([])
  const [locationlist, setlocationlist] = useState([])
  const [adjtyplist, setAdjtyplist] = useState([])
  const [qtyOnHandVal, setqtyOnHandVal] = useState('')
  const [projName, setProjectName] = useState('')
  const [productName, setProductName] = useState('')
  const [location, setLocation] = useState('')
  const [productCodeData, setProductCode] = useState('')
  const [btnDisable, setBtnDis] = useState(false)

  const currentYear = moment().year()
  const currentMonth = moment().month()

  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  const getAdjustMentdtl = async () => {
    const formData = form.getFieldsValue()
    const response = await IndentGroupgetDetails({
      requestPath: 'retrieveinventoryAdjustment',
      requestData: {
        tenantId: tenantID,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    if (response?.responseCode === '200') {
      setAdjmentTable(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setAdjmentTable([])
    }
  }
  const getprojectdrp = async () => {
    const response = await indentFileUpload({
      requestPath: 'gettProjectdropdown',
      requestData: {
        tenantID,
      },
    })
    if (response?.responseCode === '200') {
      setprojectlist(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setprojectlist([])
    }
  }
  const getproductdropdown = async e => {
    const response = await indentFileUpload({
      requestPath: 'getProductdropdown',
      requestData: {
        tenantId: tenantID,
        pmHdrId: e,
      },
    })
    if (response?.responseCode === '200') {
      setproductlist(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setproductlist([])
    }
  }
  const getlocationdropdown = async () => {
    const response = await indentFileUpload({
      requestPath: 'getLocationdropdown',
      requestData: {
        tenantID,
      },
    })
    if (response?.responseCode === '200') {
      setlocationlist(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setlocationlist([])
    }
  }
  const getadjustmettypedropdown = async () => {
    const response = await indentFileUpload({
      requestPath: 'getadjustmettypedropdown',
      requestData: {
        tenantID,
      },
    })
    if (response?.responseCode === '200') {
      setAdjtyplist(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setAdjtyplist([])
    }
  }
  let qtyOnHnd
  const getqtyOnHand = async (val, e) => {
    const response = await indentFileUpload({
      requestPath: 'getAvailableQty',
      requestData: {
        tenantID: tenantId,
        frmLocationCode: val === 1 && location !== '' ? location : val === 1 ? '' : e,
        productID: val === 1 ? e : productName,
      },
    })
    if (response !== null || response !== '' || response !== undefined) {
      const qtyOnHandvalue = parseInt(response, 10)
      setqtyOnHandVal(qtyOnHandvalue)
      qtyOnHnd = qtyOnHandvalue
      form.setFieldsValue({
        QtyOnHand: qtyOnHandvalue,
      })
    } else {
      message.error(response?.responseMessage)
      setqtyOnHandVal('')
    }
  }
  const insertAdjdtl = async () => {
    const formData = form.getFieldsValue()
    if (
      formData.Project !== '' &&
      formData.Project !== undefined &&
      formData.Product !== '' &&
      formData.Product !== undefined &&
      formData.Location !== '' &&
      formData.Location !== undefined &&
      formData.AdjustmentType !== '' &&
      formData.AdjustmentType !== undefined &&
      formData.QtyOnHand !== '' &&
      formData.QtyOnHand !== undefined &&
      formData.AdjustmentQty !== '' &&
      formData.AdjustmentQty !== undefined &&
      formData.RevisedQtyOnHand !== '' &&
      formData.RevisedQtyOnHand !== undefined &&
      formData.Remarks !== '' &&
      formData.Remarks !== undefined
    ) {
      const response = await indentFileUpload({
        requestPath: 'insertAdjustment',
        requestData: {
          tenantId,
          projectId: formData.Project,
          productId: productName,
          productCode: productCodeData,
          locationCode: formData.Location,
          adjustmentType: formData.AdjustmentType,
          qtyonHand: formData.QtyOnHand,
          adjustedQty: formData.AdjustmentQty,
          revisedQty: formData.RevisedQtyOnHand,
          adjustmentedBy: empId,
          reason: formData.Remarks,
        },
      })

      if (response?.responseDataMessage === '1') {
        message.success(response?.responseMessage)
        setinsertModalVisible(false)
        form.resetFields()
        setAdjmentTable([])
      } else {
        message.error(response?.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleChangeProject = e => {
    form.setFieldsValue({
      Product: 'Select Product',
    })
    setProjectName(e.key)
    getproductdropdown(e.key)
  }

  const handleChangeProduct = e => {
    form.setFieldsValue({
      AdjustmentQty: '',
    })
    form.setFieldsValue({
      RevisedQtyOnHand: '',
    })
    setProductName(e.key)
    setProductCode(e.value)
    getlocationdropdown()
    getqtyOnHand(1, e.key)
    setBtnDis(false)
  }

  const handleChangeLocation = e => {
    form.setFieldsValue({
      AdjustmentQty: '',
    })
    form.setFieldsValue({
      RevisedQtyOnHand: '',
    })
    setLocation(e.key)
    getqtyOnHand(2, e.key)
    getadjustmettypedropdown()
    setBtnDis(false)
  }

  const handleDetailCancel = () => {
    form.resetFields()
    setinsertModalVisible(false)
    setshowMaterialDtl(false)
    setproductlist([])
    setlocationlist([])
    setAdjtyplist(false)
    setLocation(false)
  }

  const getRevisedQty = e => {
    const adjVal = e.target.value
    const splitVal = adjVal.slice(0, 1) === '-' ? adjVal.slice(0, 1) : adjVal
    let returnData

    if (adjVal !== '0') {
      if (splitVal !== '-') {
        const result = adjVal.replace('+', '')
        returnData = qtyOnHandVal + parseInt(result, 10)
      } else if (splitVal === '-') {
        const result = adjVal.replace('-', '')
        returnData = qtyOnHandVal - parseInt(result, 10)
      }

      const num = parseFloat(returnData)
      if (num < 0) {
        messageReturn(666)
        setBtnDis(true)
        form.setFieldsValue({
          RevisedQtyOnHand: '',
          AdjustmentQty: '',
        })
      } else if (num > 0) {
        form.setFieldsValue({
          RevisedQtyOnHand: returnData,
        })
        setBtnDis(false)
      } else if (num === 0) {
        form.setFieldsValue({
          RevisedQtyOnHand: returnData,
        })
        setBtnDis(false)
      }
    } else {
      messageReturn(666)
      form.setFieldsValue({
        RevisedQtyOnHand: ' ',
        AdjustmentQty: '',
      })
      setBtnDis(true)
    }
  }

  const showModal = record => {
    setshowMaterialDtl(true)
    setAdjmentTab(record)
  }

  const handleClear = () => {
    form.resetFields()
    setAdjmentTable(false)
  }

  const column = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Reference ID',
      dataIndex: 'adjustmentCode',
      key: 'adjustmentCode',
      width: 150,
    },
    {
      title: 'Project',
      dataIndex: 'projectDesc',
      key: 'projectDesc',
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      align: 'center',
    },
    {
      title: 'Adjustment Type',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
    },
    {
      title: 'Adjusted Qty.',
      dataIndex: 'adjustmentQty',
      key: 'adjustmentQty',
    },
    {
      title: 'Adjusted By',
      dataIndex: 'adjustedBy',
      key: 'adjustedBy',
    },
    {
      title: 'Adjusted On',
      dataIndex: 'adjustedDateTime',
      key: 'adjustedDateTime',
      width: 150,
      render: (text, record) =>
        record.adjustedDateTime ? moment(record.adjustedDateTime).format('DD-MMM-YYYY HH:mm') : '',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (record, index) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button
            type="primary"
            onClick={() => {
              showModal(record, index)
            }}
          >
            Details
          </Button>
        </div>
      ),
    },
  ]

  const openinsertcard = () => {
    return (
      <div>
        <Form form={form}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="Project"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%', paddingLeft: '30px' }}
                  placeholder="Select Project"
                  onChange={(value, option) => handleChangeProject(option)}
                  value={projName}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {projectlist
                    ? projectlist.map(item => (
                        <Option key={item.projectId} value={item.projectId}>
                          {item.projectName}-{item.projectCode}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Product"
                label={
                  <span>
                    Product<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%', paddingLeft: '46px' }}
                  placeholder="Select Product"
                  onChange={(value, option) => {
                    handleChangeProduct(option)
                  }}
                  value={productName}
                >
                  {productlist
                    ? productlist.map(item => (
                        <Option key={item.productId} value={item.productCode}>
                          {item.productDesc}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Location"
                label={
                  <span>
                    Location<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%', paddingLeft: '67px' }}
                  placeholder="Select Location"
                  onChange={(value, option) => {
                    handleChangeLocation(option)
                  }}
                  value={location}
                >
                  {locationlist
                    ? locationlist.map(item => (
                        <Option key={item.inventoryLocationCode} value={item.inventoryLocationCode}>
                          {item.inventoryLocationDescription}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="AdjustmentType"
                label={
                  <span>
                    Adjustment Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '95%' }} placeholder="Select Adjustment Type">
                  {adjtyplist
                    ? adjtyplist.map(item => (
                        <Option key={item.adjustmenttypeId} value={item.adjustmenttypeId}>
                          {item.adjustmenttypeDesc}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="QtyOnHand" label={<span>Qty On Hand </span>}>
                <Input value={qtyOnHandVal} disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="AdjustmentQty"
                label={
                  <span>
                    Adjustment Qty<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="number" onChange={event => getRevisedQty(event)} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="RevisedQtyOnHand" label={<span>Revised Qty On Hand</span>}>
                <Input type="number" disabled />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="Remarks"
                label={
                  <span>
                    Remarks<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <span className="col-2" style={{ paddingLeft: '50px' }}>
                  <Input type="text" />
                </span>
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" disabled={btnDisable} onClick={insertAdjdtl}>
              Submit
            </Button>
            <Button type="primary" onClick={handleDetailCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  const DtlFieldComponent = () => {
    return (
      <div className="data-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Reference ID
          </span>
          <span>:&nbsp;{adjmentTab?.adjustmentCode}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Project
          </span>
          <span>:&nbsp;{adjmentTab?.projectDesc}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Part Number
          </span>
          <span>:&nbsp;{adjmentTab?.productCode}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Description
          </span>
          <span>:&nbsp;{adjmentTab?.productDesc}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            UOM
          </span>
          <span>:&nbsp;{adjmentTab?.uom}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Adjustment Type
          </span>
          <span>:&nbsp;{adjmentTab?.adjustmentType}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Qty On Hand
          </span>
          <span>:&nbsp;{adjmentTab?.qtyonHand}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Adjusted Qty
          </span>
          <span>:&nbsp;{adjmentTab?.adjustmentQty}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Revised Qty On Hand
          </span>
          <span>:&nbsp;{adjmentTab?.revisedqtyonHand}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Adjusted By
          </span>
          <span>:&nbsp;{adjmentTab?.adjustedBy}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Adjusted On
          </span>
          <span>:&nbsp;{adjmentTab?.adjustedDateTime}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Adjusted Reason
          </span>
          <span>:&nbsp;{adjmentTab?.reason}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-3">
      <Card
        style={{ width: '100%' }}
        title="Inventory Adjustment"
        extra={
          <ButtonComponent
            text="New Adjustment"
            type="primary"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => {
              setinsertModalVisible(true)
              getprojectdrp()
            }}
          />
        }
      >
        <Form form={form}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="FromDate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={d => !d || d.isAfter(form.getFieldValue('ToDate'))}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="ToDate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultToDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={d => !d || d.isBefore(form.getFieldValue('FromDate'))}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={() => getAdjustMentdtl()}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
          {adjmentTable && adjmentTable.length > 0 ? (
            <div>
              <Row>
                <Divider orientation="left">Adjustment Details</Divider>
              </Row>
              <Table
                columns={column}
                dataSource={adjmentTable}
                exportableProps={{
                  fileName: `Inventory_Materia_Adjustment_${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [adjmentTable?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
              />
            </div>
          ) : null}
          {insertModalVisible ? (
            <ModalPopup
              text="Inventory Adjustment"
              FieldsComponent={openinsertcard}
              isModalVisible="setinsertmodalVisible"
              width="900"
              onCancel={() => {
                handleDetailCancel()
              }}
            />
          ) : null}
          {showMaterialDtl ? (
            <ModalPopup
              text="Adjustment Details"
              isModalVisible="setshowMaterialDtl"
              onCancel={() => {
                handleDetailCancel()
              }}
              FieldsComponent={DtlFieldComponent}
              width="900"
            />
          ) : null}
        </Form>
      </Card>
    </div>
  )
}
export default Inventoryadjustment
