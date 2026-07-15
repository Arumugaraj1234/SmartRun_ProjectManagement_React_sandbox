import React, { useState, useEffect } from 'react'
import { Form, Select, Button, DatePicker } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const Grnfields = ({ onGetDetails, onClear, isVisible, getAllEnable }) => {
  const { Option } = Select
  const [form] = Form.useForm()

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

  const tenantId = store.get('tenantId')
  const [projectList, setProjectList] = useState([])
  const [pONoDtlVal, setPONoDtlVal] = useState([])
  const [materialList, setMaterialList] = useState([])
  const [slctdProjctDtls, setSlctdProjctDtls] = useState(null)

  useEffect(() => {
    getProjectList()
  }, [])
  console.log(materialList)
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
  const getPONOlist = async value => {
    let x
    if (value === 'getAll') {
      x = {
        projectCode: 'getAll',
        projectName: 'Get All',
      }
    } else {
      x = projectList.find(item => item.projectId === value)
    }
    setSlctdProjctDtls(x)
    //   {
    //     "projectCode": "10021",
    //     "projectName": "Line automation solution",
    //     "projectId": "23",
    //     "customerName": "DAIKIN INDIA LTD",
    //     "masterId": null
    // }
    const formData = form.getFieldsValue()

    const response = await indentFileUpload({
      requestPath: 'getAllDcHdrByPmId',
      requestData: {
        pmHdrId: formData.Projectcode,
        tenantId,
        getRetrunable: 1,
      },
    })
    form.resetFields(['PONo'])
    setPONoDtlVal(response?.responseData || [])
  }
  const getMaterials = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getGrnHdrDetails',
      requestData: {
        tenantId,
        poId: formData.PONo,
      },
    })
    setMaterialList(response?.responseData || [])
  }

  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    onGetDetails(formData, isVisible, slctdProjctDtls)
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
    setPONoDtlVal([])
    setMaterialList([])
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
                style={{ width: '100%' }}
                onChange={fromdateChange}
                format="DD-MMM-YYYY"
                disabledDate={d => !d || d.isAfter(form.getFieldValue('ToDate'))}
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
              <DatePicker
                style={{ width: '100%' }}
                onChange={toDateChange}
                format="DD-MMM-YYYY"
                disabledDate={d => !d || d.isBefore(form.getFieldValue('FromDate'))}
              />
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
              <Select style={{ width: '100%' }} onChange={getPONOlist} placeholder="Select Project">
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
          {isVisible === '1' ? (
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="PONo"
                label={
                  <span>
                    DC<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select DC" onChange={getMaterials}>
                  {pONoDtlVal?.map(item => (
                    <Option key={item.dcID} value={item.dcID}>
                      {item.dcCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          ) : (
            ''
          )}
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

export default Grnfields
