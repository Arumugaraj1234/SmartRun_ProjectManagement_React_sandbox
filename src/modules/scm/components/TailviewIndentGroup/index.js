import React, { useState, useEffect, useCallback } from 'react'
import { Row, Form, Select, Col } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const TailviewIndentGroup = ({ onGetDetails, getIndent }) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const projectId = store.get('ProjectID')

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

  // Use financialYearStart and financialYearEnd in your code as needed

  const [indentList, setIndentList] = useState([])

  useEffect(() => {
    // if(isIndentcheck){
    getIndentList()
    // }
  }, [indentList.length === 0])

  const getIndentList = async () => {
    const response = await indentFileUpload({
      requestPath: 'indentHdrDropDownByProjectCode',
      requestData: {
        tenantId,
        empId: employeeId,
        pmId: '5',
        projectId,
        fromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
        toDate: moment(defaultToDate).format('YYYY-MM-DD'),
        getIndent,
      },
    })
    if (response) {
      if (response?.responseData?.length > 0) {
        setIndentList(response?.responseData)
      } else {
        setIndentList([])
      }
    }
  }

  const handleGetDetails = useCallback(
    value => {
      // const formData = form.getFieldsValue();
      // const updatedFormData = {
      //   ...formData,
      //   Projectcode: projectId,
      //   FromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
      //   ToDate: moment(defaultToDate).format('YYYY-MM-DD'),
      //   DueDate: option.key ? moment(option.key).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      //   isTailview

      // };
      form.setFieldsValue({ IndentCode: value }) // Update form field value
      // onGetDetails(updatedFormData);
    },
    [form, onGetDetails, projectId, defaultFromDate, defaultToDate],
  )

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={24}>
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
              onChange={(value, option) => handleGetDetails(value, option)}
              placeholder="Select Indent"
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
    </Form>
  )
}

export default TailviewIndentGroup
