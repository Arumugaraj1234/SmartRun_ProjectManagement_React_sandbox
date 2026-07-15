import React, { useState, useEffect } from 'react'
import { Row, Form, Select, Col, Button, DatePicker, Input, Checkbox } from 'antd'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const CommonFields3 = ({
  onGetDetails,
  onClear,
  SubmitorGetDtls,
  pONoCodeVal1,
  showMinwardDrpDwn,
  clearForm,
  isPono,
  handleChangeChkBox = () => {},
  NApplicable,
  getAllEnable,
}) => {
  const { Option } = Select
  const [form] = Form.useForm()

  const tenantId = store.get('tenantId')
  // const defaultFromDate = moment('2023-04-01', 'YYYY-MM-DD')
  // const defaultToDate = moment('2024-03-31', 'YYYY-MM-DD')

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
  const [pONoDtlVal, setPONoDtlVal] = useState([])
  const [pONoCodeVal, setPONoCodeVal] = useState(null)
  const [vendorCodeVal, setVendorCodeVal] = useState(null)
  const [materialInwardDrpDwn, setMaterialInwardDrpDwn] = useState(null)
  const [slctdMtrlObjList, setSlctdMtrlObjList] = useState(null)
  const [slctdProjctDtls, setSlctdProjctDtls] = useState(null)

  useEffect(() => {
    getProjectList()
  }, [])

  useEffect(() => {
    handleClear()
  }, [clearForm])

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
  function getPONOlist(value) {
    form.resetFields(['PONo'])
    let x
    if (value === 'getAll') {
      form.setFieldsValue({
        PONo: 'getAll',
      })
      x = {
        projectCode: 'getAll',
        projectName: 'Get All',
      }
    } else {
      x = projectList.find(item => item.projectId === value)
    }

    setSlctdProjctDtls(x)
    getPONoDetailList(value)
  }
  const getMaterialInwardDtls = async value => {
    const response = await indentFileUpload({
      requestPath: 'getGrnHdrDetails',
      requestData: {
        tenantId,
        poId: value,
      },
    })
    setMaterialInwardDrpDwn(response?.responseData || [])
  }
  const getPONoDetailList = async value => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByDateAndPoId',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
        indentId: '',
        projectId: value,
      },
    })

    setPONoDtlVal(response?.responseData || [])
  }
  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    onGetDetails(formData, pONoCodeVal, vendorCodeVal, slctdMtrlObjList, slctdProjctDtls)
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
  const getPONoDtls = (value, option) => {
    // setPONoCodeVal(option.children[0])
    const [innerText] = option.children[0]
    pONoCodeVal1 = innerText
    setPONoCodeVal(option.children[0])
    setVendorCodeVal(option.children[2])
    // pONoCodeVal = option.children;
    getMaterialInwardDtls(value)
  }
  const getMatrlInwrdDtls = value => {
    // materialInwardDrpDwn.includes(value)
    const foundObject = materialInwardDrpDwn.find(item => item.miId === value)
    // if (foundObject) {
    // } else {
    // }
    setSlctdMtrlObjList(foundObject)
  }

  return (
    <div>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={isPono === '0' ? 5 : 4} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
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
                format="DD-MMM-YYYY"
                onChange={fromdateChange}
              />
            </Form.Item>
          </Col>
          <Col span={isPono === '0' ? 5 : 4} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <Form.Item
              name="ToDate"
              label={
                <span>
                  To Date<span style={{ color: 'red' }}>*</span>{' '}
                </span>
              }
              initialValue={moment(defaultToDate)}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" onChange={toDateChange} />
            </Form.Item>
          </Col>
          <Col span={isPono === '0' ? 6 : 5} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
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
          </Col>
          <Col span={6} style={{ display: 'none' }}>
            <Form.Item name="materialInward">
              <span>{pONoCodeVal1}</span>
            </Form.Item>
          </Col>

          {isPono === '0' ? (
            <Col span={6} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
              <Form.Item
                name="PONo"
                label={
                  <span>
                    PO No.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select PO No."
                  onChange={getPONoDtls}
                >
                  <Option key="getAll" value="getAll">
                    Get All
                  </Option>
                  {pONoDtlVal?.map(item => (
                    <Option key={item.poId} value={item.poId}>
                      {item.poCode}-{item.vendorCode}-{item.vendorName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          ) : (
            <>
              {NApplicable === 0 ? (
                <Col span={6} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
                  <Form.Item
                    name="PONo"
                    label={
                      <span>
                        PO No.<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select PO No."
                      onChange={getPONoDtls}
                    >
                      {pONoDtlVal?.map(item => (
                        <Option key={item.poId} value={item.poId}>
                          {item.poCode}-{item.vendorCode}-{item.vendorName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              ) : NApplicable === 1 ? (
                <Col span={6} xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
                  <Form.Item
                    name="POQty"
                    label={
                      <span>
                        PO No.<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Input
                      //  onChange={e => handleInwardQtyChange(record, e, index)}
                      placeholder="Po No"
                      type="text"
                    />
                  </Form.Item>
                </Col>
              ) : null}
            </>
          )}
          {isPono === '1' ? (
            <Col span={2}>
              <Form.Item name="NA" valuePripName={NApplicable} label={<span>PO NA</span>}>
                <Checkbox onChange={e => handleChangeChkBox(e)} />
              </Form.Item>
            </Col>
          ) : null}
          {showMinwardDrpDwn === '1' ? (
            <Col span={6}>
              <Form.Item
                name="materialInwardNo"
                label={
                  <span>
                    Material Inward No.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Material Inward No."
                  onChange={getMatrlInwrdDtls}
                >
                  {materialInwardDrpDwn?.map(item => (
                    <Option key={item.miId} value={item.miId}>
                      {item.miCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        {SubmitorGetDtls === '1' ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={handleGetDetails}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        ) : (
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={handleGetDetails}>
              Create
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}

export default CommonFields3
