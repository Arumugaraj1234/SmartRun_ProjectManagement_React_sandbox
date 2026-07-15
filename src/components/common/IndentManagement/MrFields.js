import React, { useState, useEffect } from 'react'
import { Form, Select, DatePicker, message } from 'antd'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'

const CommonFields2 = ({ onGetDetails, onClear }) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const history = useHistory()
  const prevPath = history.location.state?.from
  console.log(prevPath)

  const projectIdFromNoti = history?.location?.state?.record?.projectId || null

  const tenantId = store.get('tenantId')
  const currentYear = moment().year()
  const currentMonth = moment().month()
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
  const [projectList, setProjectList] = useState([])

  useEffect(() => {
    getProjectList()
  }, [])

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDateAndIndent',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }

  useEffect(() => {
    if (projectIdFromNoti && projectList?.length > 0) {
      form.setFieldsValue({ Projectcode: projectIdFromNoti })

      // auto-trigger the same logic as manual selection
      const selected = projectList.find(p => p.projectId === projectIdFromNoti)
      if (selected) {
        handleGetDetails(selected.projectId, { key: selected.masterId })
        getIsInternalOrNot(selected.projectId)
      }
    }
  }, [projectIdFromNoti, projectList])

  const getIsInternalOrNot = async projId => {
    const response = await indentFileUpload({
      requestPath: 'getIsInternalOrNot',
      requestData: {
        tenantId,
        projectCode: projId,
      },
    })

    // console.log('Full response:', response);

    if (response) {
      store.set('isInternal', response?.isInternal)
    } else {
      message.error('Error')
    }
  }
  // console.log(store.get('isInternal'),'Store.isinternal')

  const handleGetDetails = (value, option) => {
    const formData = form.getFieldsValue()
    const updatedFormData = {
      ...formData,
      masterId: option.key,
    }
    onGetDetails(updatedFormData)
  }

  const fromdateChange = () => {
    onClear()
    getProjectList()
  }

  const toDateChange = () => {
    onClear()
    getProjectList()
  }

  // const handleClear = () => {
  //   form.resetFields()
  //   onClear()
  // }

  return (
    <div style={{ width: '100%' }}>
      <Form form={form}>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <Form.Item
              name="Projectcode"
              label={
                <span>
                  Project<span style={{ color: 'red' }}>*</span>{' '}
                </span>
              }
            >
              <Select
                placeholder="Select Project"
                onChange={(value, option) => {
                  handleGetDetails(value, option)
                  getIsInternalOrNot(value)
                }}
              >
                {projectList?.map(item => (
                  <Option key={item.masterId} value={item.projectId}>
                    {item.projectCode}-{item.customerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        {/* <div>
          <Button type="primary" onClick={handleGetDetails}>
            Get details
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div> */}
      </Form>
    </div>
  )
}

export default CommonFields2
