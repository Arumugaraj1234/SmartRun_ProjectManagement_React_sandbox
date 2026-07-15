import React, { useState, useEffect } from 'react'
// import validator from 'validator'
import { Card, message, Row, Col, Form, Input, Select, Button } from 'antd'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import store from 'store'
import ModalPopup from 'components/shared/ModalPopupComponent'
import TextArea from 'antd/lib/input/TextArea'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const VendorMater = () => {
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantID = store.get('tenantId')
  const [vendorTab, setVendorTab] = useState([])
  const [editingKey, setEditingKey] = useState(null)
  const [editedData, setEditedData] = useState({})
  const [insertVendorvisible, setinsertVendorvisible] = useState(false)
  const [vendordtlvisible, setvendordtlvisible] = useState(false)
  const [filteredvendor, setfilteredvendor] = useState([])
  const [setBtndisable] = useState(false)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  // const validateEmail = () => {
  //   const formData = form.getFieldsValue()
  //   const value = formData.Email
  //   const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //   // Your custom validation logic here
  //   if (emailRegex.test(value)) {
  //     // callback(''); // Valid email
  //     setBtndisable(false)
  //   } else {
  //     // callback('Please enter a valid email address!');
  //     setBtndisable(true)
  //     // message.error('error')
  //   }
  // }
  const handleDetailCancel = () => {
    form.resetFields()
    setinsertVendorvisible(false)
    setvendordtlvisible(false)
    setBtndisable(false)
  }

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
  const openinsertcard = () => {
    return (
      <div>
        <Form form={form}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="VendorName"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Vendor Name<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Gst"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    GST<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={15} type="text" />
                {/* <span style={{paddingLeft: '80px'}}><Input maxLength={15} type="text" style={{ width: '72%' }}  /></span> */}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Pan"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    PAN<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={12} type="text" />
                {/* <span style={{paddingLeft: '20px'}}><Input maxLength={10} type="text" style={{ width: '93%' }} /></span> */}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                // onMouseLeave={validateEmail}
                name="Email"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Email Id<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                rules={[{ type: 'email', message: 'Please Enter valid Email' }]}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="PoType"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    PO Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                {/* /// <span style={{paddingLeft: '30px'}}> */}
                <Select placeholder="Select Location">
                  <Option key={1} value={1}>
                    Domestic
                  </Option>
                  <Option key={2} value={2}>
                    Import
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="LocationRefName"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                label={
                  <span>
                    Location Ref Name<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                name="City"
                label={
                  <span>
                    City<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
                {/* <span style={{paddingLeft:'50px'}}><Input type="text" style={{width:'81%'}} /></span> */}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Contactno"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Contact No<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={10} type="text" />
                {/* <span style={{paddingLeft:'50px'}}><Input type="text" style={{width:'81%'}} /></span> */}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Address"
                label={
                  <span>
                    Address<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="State"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    State<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Country"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Country<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" style={{ width: '100%' }} />
                {/* <span><Input type="text" style={{ width: '100%' }} /></span> */}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="Pincode"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Pincode<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input
                  // type='text'
                  style={{ width: '100%' }}
                  maxLength={6}
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                />
                {/* <span><Input type="text" maxLength={6} style={{ width: '100%' }} /></span> */}
              </Form.Item>
            </Col>
            {vendordtlvisible ? (
              <Col span={6} style={{ display: 'none' }}>
                <Form.Item name="VendorCode" label={<span>Vendor Code</span>}>
                  <Input type="text" disabled />
                </Form.Item>
              </Col>
            ) : null}
            {vendordtlvisible ? (
              <Col span={6} style={{ display: 'none' }}>
                <Form.Item name="LocationId" label={<span>Location Id</span>}>
                  <Input type="text" style={{ width: '90%', marginLeft: '35px' }} disabled />
                  {/* <span style={{paddingLeft:'35px'}}><Input type="text" style={{ width: '90%' }} /></span> */}
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        </Form>
      </div>
    )
  }

  const columns = [
    {
      title: 'Customer Code',
      dataIndex: 'customerCode',
      key: 'customerCode',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'GST',
      dataIndex: 'gstNumber',
      key: 'gstNumber',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editedData.gstNumber}
            onChange={e => handleChange(record.key, 'gstNumber', e.target.value)}
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: 'PAN',
      dataIndex: 'panNumber',
      key: 'panNumber',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editedData.panNumber}
            onChange={e => handleChange(record.key, 'panNumber', e.target.value)}
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) =>
        isEditing(record) ? (
          <Input.TextArea
            value={editedData.address}
            onChange={e => handleChange(record.key, 'address', e.target.value)}
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editedData.contactNumber}
            onChange={e => handleChange(record.key, 'contactNumber', e.target.value)}
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <>
            <Button type="primary" onClick={() => save(record.key)}>
              Save
            </Button>
            <Button
              type="secondary"
              onClick={cancel}
              style={{ color: 'Black', backgroundColor: 'white', marginLeft: '15px' }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => edit(record)} disabled={editingKey !== null}>
            Edit
          </Button>
        )
      },
    },
  ]

  useEffect(() => {
    getvendor()
  }, [])

  const getvendor = async () => {
    // const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getAllCustomerDtl',
      requestData: {
        tenantID,
      },
    })
    if (response?.responseCode === '200') {
      setVendorTab(response?.responseData)
      setfilteredvendor(response?.responseData)
      // message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
      setVendorTab([])
      setfilteredvendor([])
    }
  }
  const isEditing = record => record.key === editingKey

  const edit = record => {
    setEditingKey(record.key)
    setEditedData({ ...record, tenantID })
  }
  const save = async key => {
    try {
      const updatedVendor = { ...editedData, key }

      const response = await indentFileUpload({
        requestPath: 'UpdateCustMstDtl',
        requestData: updatedVendor,
      })

      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        getvendor()
        setVendorTab(prev => prev.map(item => (item.key === key ? updatedVendor : item)))
        setfilteredvendor(prev => prev.map(item => (item.key === key ? updatedVendor : item)))
        setEditingKey(null)
      } else {
        message.error(response?.responseMessage || 'Failed to update')
      }
    } catch (error) {
      message.error('Error updating ')
    }
  }

  const cancel = () => setEditingKey(null)

  const handleChange = (key, field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }
  const handleSearch = e => {
    const filtered = filteredvendor.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e?.target?.value?.toLowerCase()),
      ),
    )
    setVendorTab(filtered)
  }
  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%' }} title="Customer Master">
        <Input.Search
          style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
          placeholder="Search here..."
          enterButton
          // onSearch={handleSearch}
          onChange={e => handleSearch(e)}
        />
        <Table
          columns={columns}
          dataSource={vendorTab.map((item, index) => ({ ...item, key: index }))}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [vendorTab?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
        />
        {insertVendorvisible ? (
          <ModalPopup
            text="New Vendor"
            FieldsComponent={openinsertcard}
            isModalVisible="setinsetVendorvisible"
            width="900"
            onCancel={() => {
              handleDetailCancel()
            }}
          />
        ) : null}
        {vendordtlvisible ? (
          <ModalPopup
            text="Vendor Details"
            FieldsComponent={openinsertcard}
            isModalVisible="setvendordtlvisible"
            width="900"
            onCancel={() => {
              handleDetailCancel()
            }}
          />
        ) : null}
      </Card>
    </div>
  )
}
export default VendorMater
