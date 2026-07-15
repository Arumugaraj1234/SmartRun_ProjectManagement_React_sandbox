import React, { useState, useEffect } from 'react'
import { Form, Select, Button } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const Tailviewfields = ({
  onGetDetails,
  onClear,
  getIndent,
  istileDropdown,
  isTailview,
  isCommonDropdownval,
}) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const projectId = store.get('ProjectID')
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

  useEffect(() => {
    getIndentList()
  }, [])

  useEffect(() => {
    if (istileDropdown && indentList.length > 0) {
      // setIndentGetall()
      form.setFieldsValue({
        IndentCode: isCommonDropdownval.indentId,
      })
    }
  }, [indentList, istileDropdown])

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

  // const setIndentGetall = () => {
  //   form.setFieldsValue({
  //     IndentCodeDP: 'getAll',
  //   })
  // }

  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    const updatedFormData = {
      ...formData,
      Projectcode: projectId,
      FromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
      ToDate: moment(defaultToDate).format('YYYY-MM-DD'),
      isTailview,
    }
    onGetDetails(updatedFormData)
  }

  const handleClear = () => {
    form.resetFields()
    onClear()
  }

  return (
    <Form form={form}>
      <div className="row">
        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
          <Form.Item
            name="IndentCode"
            label={
              <span>
                Indent<span style={{ color: 'red' }}>*</span>{' '}
              </span>
            }
            style={{ width: '298px' }}
          >
            <Select placeholder="Select Indent" defaultValue="Get All">
              {indentList?.map(item => (
                <Option key={item.indentId} value={item.indentId}>
                  {item.indentCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
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

export default Tailviewfields
