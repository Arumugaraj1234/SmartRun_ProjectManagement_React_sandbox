import React, { useState, useEffect } from 'react'
import { Row, Form, Select, Col, Button, DatePicker } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const CommonFields = ({ onGetDetails, onClear }) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const defaultFromDate = moment('2023-04-01', 'YYYY-MM-DD')
  const defaultToDate = moment('2024-03-31', 'YYYY-MM-DD')
  const [indentList, setIndentList] = useState([])

  useEffect(() => {
    getIndentList()
  }, [])

  const getIndentList = async () => {
    const formData = form.getFieldsValue()
    const IndentDetailsobj = {
      pmId: '5',
      tenantId,
      fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
      toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      empId: employeeId,
    }
    const response = await indentFileUpload({
      requestPath: 'indentHdrDropDownByProjectCode',
      requestData: IndentDetailsobj,
    })
    if (response) {
      if (response.responseData.length > 0) {
        const updatedResponseData = [
          {
            indentId: 'getall',
            indentCode: 'GetAll',
          },
          ...response?.responseData,
        ]
        setIndentList(updatedResponseData)
      } else {
        setIndentList([])
      }
    }
  }

  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    onGetDetails(formData)
  }
  const fromdateChange = () => {
    setIndentList([])
    onClear()
    getIndentList()
  }

  const toDateChange = () => {
    setIndentList([])
    onClear()
    getIndentList()
  }

  const handleClear = () => {
    form.resetFields()
    onClear()
  }

  return (
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
            initialValue={defaultFromDate}
          >
            <DatePicker style={{ width: '100%' }} onChange={fromdateChange} />
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
            initialValue={defaultToDate}
          >
            <DatePicker style={{ width: '100%' }} onChange={toDateChange} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="IndentCode"
            label={
              <span>
                Indent<span style={{ color: 'red' }}>*</span>{' '}
              </span>
            }
          >
            <Select style={{ width: '100%' }} placeholder="Select Indent">
              {indentList?.map(item => (
                <Option key={item.indentId} value={item.indentId}>
                  {item.indentCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
        <Button type="primary" onClick={handleGetDetails}>
          Get details
        </Button>
        <Button type="primary" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </Form>
  )
}

export default CommonFields
