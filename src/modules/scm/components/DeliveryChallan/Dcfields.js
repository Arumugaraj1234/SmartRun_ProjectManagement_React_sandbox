import React, { useState, useEffect } from 'react'
import { Form, Select, Button, DatePicker } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const DcFields = ({ onGetDetails, onClear, getAllEnable }) => {
  const { Option } = Select
  const [form] = Form.useForm()

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

  const tenantId = store.get('tenantId')
  const [projectList, setProjectList] = useState([])

  useEffect(() => {
    getProjectList()
  }, [])

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

  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    onGetDetails(formData)
  }
  const fromdateChange = () => {
    onClear()
    getProjectList()
  }

  const toDateChange = () => {
    onClear()
    getProjectList()
  }

  const handleClear = () => {
    form.resetFields()
    onClear()
  }

  return (
    <div>
      <Form form={form}>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
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
                format="DD-MMM-YYYY"
                style={{ width: '100%' }}
                onChange={fromdateChange}
              />
            </Form.Item>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
            <Form.Item
              name="ToDate"
              label={
                <span>
                  To Date<span style={{ color: 'red' }}>*</span>{' '}
                </span>
              }
              initialValue={moment(defaultToDate)}
            >
              <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} onChange={toDateChange} />
            </Form.Item>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
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
                placeholder="Select Project"
                showSearch
                filterOption={(input, option) =>
                  option.children
                    .toString()
                    .toUpperCase()
                    .indexOf(input.toUpperCase()) !== -1
                }
              >
                {getAllEnable && (
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                )}
                {projectList?.map(item => (
                  <Option key={item.projectId} value={item.projectId}>
                    {item.projectCode}-{item.customerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
          <Button type="primary" onClick={handleGetDetails}>
            Get details
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default DcFields
