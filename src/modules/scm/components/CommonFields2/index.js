import React, { useState, useEffect } from 'react'
import { Row, Form, Select, Col, Button, DatePicker } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const CommonFields2 = ({
  onGetDetails,
  onClear,
  getIndent,
  buttonEnable,
  isCommonDropdown,
  isCommonDropdownval,
}) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  //   const defaultFromDate = moment('2023-04-01', 'YYYY-MM-DD')
  //   const defaultToDate = moment('2024-03-31', 'YYYY-MM-DD')
  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }
  const [indentList, setIndentList] = useState([])
  const [projectList, setProjectList] = useState([])

  useEffect(() => {
    getProjectList()
  }, [])

  useEffect(() => {
    if (isCommonDropdown) {
      form.setFieldsValue({
        IndentCode: 'Get All',
        Projectcode: isCommonDropdownval.projectcode,
        fromDate: moment(isCommonDropdownval.fromdate).format('YYYY-MM-DD'),
        toDate: moment(isCommonDropdownval.todate).format('YYYY-MM-DD'),
      })
    }
  }, [isCommonDropdown])

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }

  const getIndentList = async () => {
    setIndentList([])
    onClear()
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'indentHdrDropDownByProjectCode',
      requestData: {
        tenantId,
        empId: employeeId,
        pmId: '5',
        projectId: formData.Projectcode,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
        getIndent,
      },
    })
    if (response) {
      if (response?.responseData?.length > 0) {
        const updatedResponseData = [
          {
            indentId: 'getAll',
            indentCode: 'Get All',
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

  const handleDueGetDetails = (value, option) => {
    const formData = form.getFieldsValue()
    const updatedFormData = {
      ...formData,
      DueDate: option.key ? moment(option.key).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    }
    onGetDetails(updatedFormData)
  }
  const fromdateChange = () => {
    setIndentList([])
    onClear()
    getProjectList()
  }

  const toDateChange = () => {
    setIndentList([])
    onClear()
    getProjectList()
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
            name="Projectcode"
            label={
              <span>
                Project<span style={{ color: 'red' }}>*</span>{' '}
              </span>
            }
          >
            <Select
              style={{ width: '100%' }}
              onChange={getIndentList}
              placeholder="Select Project"
              showSearch
              filterOption={(input, option) =>
                option.children
                  .toString()
                  .toUpperCase()
                  .indexOf(input.toUpperCase()) !== -1
              }
            >
              {projectList?.map(item => (
                <Option key={item.projectId} value={item.projectId}>
                  {item.projectCode}-{item.customerName}
                </Option>
              ))}
            </Select>
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
            <Select
              style={{ width: '100%' }}
              placeholder="Select Indent"
              onChange={(value, option) =>
                buttonEnable ? handleDueGetDetails(value, option) : null
              }
            >
              {indentList?.map(item => (
                <Option key={item.expectedDeliveryDate} value={item.indentId}>
                  {item.indentCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {buttonEnable ? null : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
          <Button type="primary" onClick={handleGetDetails}>
            Get details
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      )}
    </Form>
  )
}

export default CommonFields2
