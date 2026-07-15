import React, { useState, useEffect } from 'react'
import {
  Button,
  message,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Input,
  Space,
  Card,
  Skeleton,
  Upload,
  Table,
  Tooltip,
} from 'antd'
import { CommentOutlined, UploadOutlined } from '@ant-design/icons'
import moment from 'moment'
import store from 'store'
import TableComponent from 'components/common/TableComponent'
import InputComponent from 'components/shared/InputComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import AddIcon from 'components/shared/AddIconComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import InspectionReportService from 'services/Quality/InspectionReport'
import {
  addDocumentdetail,
  documentLIst,
  indentFileUpload,
} from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import '../../style.scss'
import messageReturn from '_helpers/messageReturn'
import IndentGroupgetDetails from 'services/common/IndentGroupService'

// import QualityApproveDocs from '../ApproveDocument'

const QualityReportComponet = ({ hdrId, onmodalCancel, requestDate, poId }) => {
  const [form] = Form.useForm()
  const [inputForm] = Form.useForm()
  const { TextArea } = Input
  const { Option } = Select
  const tenantId = store.get('tenantId')
  const employeID = store.get('employeeId')
  const projectId = store.get('ProjectID')
  const enquiryid = store.get('EnquiryID')
  const QtyHdrId = store.get('QtyHdrId')
  const Enquiry = store.get('Enquiry')
  const Tab = store.get('Tab')
  const { stgCode, processCode } = Tab

  const [qcreshdrdata, setQcreshdrdata] = useState([])
  const [qualityView, setQualityView] = useState(false)
  const [configList, setConfigList] = useState([])
  const [insrestable, setInsrestable] = useState([])
  const [qcrestable, setQcrestable] = useState([])
  const [isEditable, setIsEditable] = useState('')
  const [docStatus, setDocStatus] = useState([])
  const [insresultview, setInsresultview] = useState(false)
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [prevRemarksCard, setPrevRemarksCard] = useState(false)
  const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [hdrcardloading, setHdrcardloading] = useState(true)
  const [filesList, setFilesList] = useState([])
  const [reportdata, setReportdata] = useState([])
  const [doctypedata, setDocTypeData] = useState([])
  const [disablesavebtn, setDisablesavebtn] = useState(false)
  const [docStatusDescbtn, setDocStatusDescbtn] = useState(false)
  const [initialData, setinitialData] = useState({})
  const [masterPoc, setMasterPoc] = useState('')

  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })

  useEffect(() => {
    if (qcreshdrdata && qcreshdrdata.length > 0) {
      form.setFieldsValue({
        inspectionQty: qcreshdrdata?.[0]?.qtyToBeInspected
          ? parseFloat(qcreshdrdata?.[0]?.qtyToBeInspected).toLocaleString('en-IN')
          : 0,
      })
    }
  }, [qcreshdrdata])

  useEffect(() => {
    getConfigdtlList()
    retriveHdrData(hdrId)
    getDoctDetails()
    documentTypelist()
  }, [])

  const documentTypelist = async () => {
    try {
      const requestData = {
        documentTypeCode: 'DC072',
        tenantId,
      }
      const response = await documentLIst({
        requestData,
      })
      if (response) {
        setDocTypeData(response.responseData)
      }
    } catch (error) {
      message.error(error)
    }
  }

  useEffect(() => {
    if (qcreshdrdata && qcreshdrdata.length > 0 && configList && configList.length > 0) {
      form.setFieldsValue({
        config: qcreshdrdata?.[0]?.configName || configList?.[0], // Set config value from qcreshdrdata
      })
      if (qcreshdrdata?.[0]?.configName) {
        handleGetDetails(qcreshdrdata?.[0]?.configName)
      }
    }
  }, [qcreshdrdata, configList])

  const handleDescChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].description = value
    setInsrestable(newData)
  }
  const handleSpecChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].specification = value
    setInsrestable(newData)
  }
  const handleInsmetChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].inspectionMethod = value
    setInsrestable(newData)
  }
  const handleMinChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].minimum = value.replace(/[^0-9.]/g, '')
    setInsrestable(newData)
  }
  const handleMaxChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].maximum = value.replace(/[^0-9.]/g, '')
    setInsrestable(newData)
  }
  const handleAvgChange = (index, value) => {
    const newData = [...insrestable]
    newData[index].average = value.replace(/[^0-9.]/g, '')
    setInsrestable(newData)
  }

  const handleUploadChange = info => {
    const newFileList = info.fileList.slice(-1)
    setFilesList(newFileList)
  }
  const insrescolumns = [
    {
      title: (
        <>
          <span>Sl. No </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'sno',
      key: 'sno',
      width: '8%',
      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item style={{ marginTop: '20px' }} name={`sno${record.sno}`}>
            <Input
              type="number"
              value={record.serialNumber}
              onChange={e => {
                const newValue = e.target.value
                if (newValue !== '') {
                  const isDuplicate = insrestable.some(item => item.serialNumber === newValue)

                  if (isDuplicate) {
                    messageReturn(642)
                    form.resetFields([`sno${record.sno}`])
                  } else {
                    const newData = [...insrestable]
                    newData[index].serialNumber = newValue
                    form.setFieldsValue({
                      [`sno${record.sno}`]: newValue,
                    })
                  }
                } else {
                  const newData = [...insrestable]
                  newData[index].serialNumber = newValue
                  form.setFieldsValue({
                    [`sno${record.sno}`]: newValue,
                  })
                }
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Description </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item name={`description${record.sno}`} style={{ marginTop: '20px' }}>
            <Input
              value={record.description}
              placeholder="Enter description"
              type="text"
              onBlur={e => handleDescChange(index, e.target.value)}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Specification </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'specification',
      key: 'specification',
      width: '15%',

      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item style={{ marginTop: '20px' }} name={`spec${record.sno}`}>
            <Input
              placeholder="Enter specification"
              value={record.specification}
              onBlur={e => handleSpecChange(index, e.target.value)}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Inspection Method </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'inspectionMethod',
      key: 'inspectionMethod',
      width: '15%',
      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item name={`inspectionMethod${record.sno}`} style={{ marginTop: '20px' }}>
            <Input
              value={record.inspectionMethod}
              placeholder="Enter inspectionMethod"
              type="text"
              onBlur={e => handleInsmetChange(index, e.target.value)}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Actuals',
      width: '28%',
      children: [
        {
          title: 'Minimum',
          dataIndex: 'minimum',
          key: 'minimum',
          align: 'center',
          width: '9%',
          render: (text, record, index) => (
            <Form form={form} disabled={isEditable === '0'}>
              <Form.Item
                style={{ marginTop: '20px' }}
                name={`minActual${record.sno}`}
                placeholder="Minimum"
              >
                <Input
                  type="text"
                  value={record.minimum ? parseFloat(record.minimum).toLocaleString('en-IN') : ''}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9.]/g, '')
                    handleMinChange(index, newValue)

                    const formattedValue =
                      newValue !== '' && !Number.isNaN(parseFloat(newValue))
                        ? parseFloat(newValue).toLocaleString('en-IN')
                        : ''
                    form.setFieldsValue({
                      [`minActual${record.sno}`]: formattedValue,
                    })
                  }}
                />
              </Form.Item>
            </Form>
          ),
        },
        {
          title: 'Maximum',
          dataIndex: 'maximum',
          key: 'maximum',
          width: '9%',
          align: 'center',
          render: (text, record, index) => (
            <Form form={form} disabled={isEditable === '0'}>
              <Form.Item
                style={{ marginTop: '20px' }}
                name={`maxActual${record.sno}`}
                placeholder="Maximum"
              >
                <Input
                  type="text"
                  value={record.maximum ? parseFloat(record.maximum).toLocaleString('en-IN') : ''}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9.]/g, '')
                    handleMaxChange(index, newValue)

                    const formattedValue =
                      newValue !== '' && !Number.isNaN(parseFloat(newValue))
                        ? parseFloat(newValue).toLocaleString('en-IN')
                        : ''
                    form.setFieldsValue({
                      [`maxActual${record.sno}`]: formattedValue,
                    })
                  }}
                />
              </Form.Item>
            </Form>
          ),
        },
        {
          title: 'Avg',
          dataIndex: 'average',
          key: 'average',
          width: '9%',
          align: 'center',
          render: (text, record, index) => (
            <Form form={form} disabled={isEditable === '0'}>
              <Form.Item
                style={{ marginTop: '20px' }}
                name={`avgActual${record.sno}`}
                placeholder="Average"
              >
                <Input
                  type="text"
                  value={record.average ? parseFloat(record.average).toLocaleString('en-IN') : ''}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9.]/g, '')
                    handleAvgChange(index, newValue)
                    const formattedValue =
                      newValue !== '' && !Number.isNaN(parseFloat(newValue))
                        ? parseFloat(newValue).toLocaleString('en-IN')
                        : ''
                    form.setFieldsValue({
                      [`avgActual${record.sno}`]: formattedValue,
                    })
                  }}
                />
              </Form.Item>
            </Form>
          ),
        },
      ],
    },
    {
      title: (
        <>
          <span>Inspection Result </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'inspectionResult',
      key: 'inspectionResult',
      width: '15%',
      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item style={{ marginTop: '20px' }} name={`inspectionResult${record.sno}`}>
            <Select
              onChange={value => {
                const newData = [...insrestable]
                newData[index].inspectionResult = value
                setInsrestable(newData)
              }}
              placeholder="Inspection Result"
            >
              <Select.Option key="2" value="ok">
                OK
              </Select.Option>
              <Select.Option key="3" value="nok">
                Not OK
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: '7%',
      render: (text, record, index) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Space>
            {index === insrestable.length - 1 && <AddIcon onClick={() => handleAddRow(index)} />}
            {index !== insrestable.length - 1 && (
              <RemoveIcon onClick={() => handleRemoveRow(index)} />
            )}
          </Space>
        </Form>
      ),
    },
  ]

  const handleAddRow = index => {
    const newData = [...insrestable]
    if (
      newData[index].sno !== '' &&
      newData[index].description !== '' &&
      newData[index].specification !== '' &&
      newData[index].inspectionMethod !== '' &&
      newData[index].inspectionResult !== ''
    ) {
      const insEmptyObj = {
        description: '',
        specification: '',
        inspectionMethod: '',
        minimum: '',
        maximum: '',
        average: '',
        inspectionResult: '',
        qicDtlId: '',
        qicHdrId: '',
        sno: parseInt(newData[index].sno, 10) + 1,
        serialNumber: parseInt(newData[index].sno, 10) + 1,
      }
      setInsrestable([...insrestable, insEmptyObj])

      form.setFieldsValue({
        [`sno${newData[index].sno + 1}`]: parseInt(newData[index].sno, 10) + 1,
      })
      form.resetFields([
        `description${newData[index].sno + 1}`,
        `specification${newData[index].sno + 1}`,
        `inspectionMethod${newData[index].sno + 1}`,
        `minimum${newData[index].sno + 1}`,
        `maximum${newData[index].sno + 1}`,
        `average${newData[index].sno + 1}`,
      ])
    } else {
      messageReturn(405)
    }
  }

  const handleRemoveRow = indexToRemove => {
    setInsrestable(prevData => prevData.filter((_, index) => index !== indexToRemove))
  }
  const handleInspectionResult = fieldname => {
    const formData = form.getFieldsValue()
    const newValue = formData[fieldname].replace(/[^0-9.]/g, '')
    form.setFieldsValue({
      [`${fieldname}`]: newValue === '' ? 0 : parseInt(newValue, 10),
    })

    const okquantity = formData.okquantity === '' ? 0 : parseInt(formData.okquantity, 10)
    const nokquantity = formData.nokquantity === '' ? 0 : parseInt(formData.nokquantity, 10)
    const rejectInternal =
      formData.totalrejectedInternal === '' ? 0 : parseInt(formData.totalrejectedInternal, 10)
    const rejectExternal =
      formData.totalrejectedExternal === '' ? 0 : parseInt(formData.totalrejectedExternal, 10)

    const reworkInternal =
      formData.totalreworkInternal === '' ? 0 : parseInt(formData.totalreworkInternal, 10)
    const reworkExternal =
      formData.totalreworkExternal === '' ? 0 : parseInt(formData.totalreworkExternal, 10)

    // const reworkquantity=formData.reworkquantity === '' ? 0 : parseInt(formData.reworkquantity, 10)
    // const qualityRating = parseInt(formData.qualityRating, 10)
    // const overallRating = parseInt(formData.overallRating, 10)
    const insQty =
      formData.inspectionQty === '' ? 0 : parseInt(formData?.inspectionQty?.replace(/,/g, ''), 10)
    // const okqty = formData.okQty === '' ? 0 : parseInt(formData.okQty, 10)
    // const caInternal = formData.caInternal === '' ? 0 : parseInt(formData.caInternal, 10)
    // const caVendor = formData.caVendor === '' ? 0 : parseInt(formData.caVendor, 10)
    // const reworkInternal =
    //   formData.reworkInternal === '' ? 0 : parseInt(formData.reworkInternal, 10)
    // const reworkVendor = formData.reworkVendor === '' ? 0 : parseInt(formData.reworkVendor, 10)
    // const rejectedInternal =
    //   formData.rejectedInternal === '' ? 0 : parseInt(formData.rejectedInternal, 10)
    // const rejectedExternal =
    //   formData.rejectedExternal === '' ? 0 : parseInt(formData.rejectedExternal, 10)

    const sum =
      okquantity + nokquantity + rejectInternal + rejectExternal + reworkInternal + reworkExternal
    if (insQty === sum) {
      form.setFieldsValue({
        okquantity,
        nokquantity,
        totalrejectedInternal: rejectInternal,
        totalrejectedExternal: rejectExternal,
        totalreworkInternal: reworkInternal,
        totalreworkExternal: reworkExternal,
      })
    } else if (sum > insQty) {
      form.setFieldsValue({
        [`${fieldname}`]: 0,
      })
      message.error(
        'Sum of all inspected qty cannot be higher than the No. of items offered for inspection.',
      )
    }
  }

  const qcrescolumns = [
    {
      title: (
        <>
          <span>No of Items offered for Inspection </span>
        </>
      ),
      dataIndex: 'inspectionQty',
      key: 'inspectionQty',
      render: text => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item style={{ marginTop: '20px' }} name="inspectionQty">
            <Input
              type="text"
              value={text ? parseFloat(text).toLocaleString('en-IN') : ''}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Directly Accepted </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'okQty',
      key: 'okQty',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="okQty"
            initialValue={record.okQty ? parseFloat(record.okQty).toLocaleString('en-IN') : ''}
          >
            <Input
              type="text"
              value={record.okQty ? parseFloat(record.okQty).toLocaleString('en-IN') : ''}
              onChange={() => handleInspectionResult('okQty')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Conditionally Accepted - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      data: 'caInternal',
      key: 'caInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="caInternal"
            initialValue={
              record.caInternal ? parseFloat(record.caInternal).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={record.caInternal ? parseFloat(record.caInternal).toLocaleString('en-IN') : ''}
              onChange={() => handleInspectionResult('caInternal')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Conditionally Accepted - Due to Supplier Mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'caVendor',
      key: 'caVendor',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="caVendor"
            initialValue={
              record.caVendor ? parseFloat(record.caVendor).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={record.caVendor ? parseFloat(record.caVendor).toLocaleString('en-IN') : ''}
              onChange={() => handleInspectionResult('caVendor')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rework - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'reworkInternal',
      key: 'reworkInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="reworkInternal"
            initialValue={
              record.reworkInternal ? parseFloat(record.reworkInternal).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={
                record.reworkInternal
                  ? parseFloat(record.reworkInternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('reworkInternal')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rework - Due to Supplier Mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'reworkVendor',
      key: 'reworkVendor',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="reworkVendor"
            initialValue={
              record.reworkVendor ? parseFloat(record.reworkVendor).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={
                record.reworkVendor ? parseFloat(record.reworkVendor).toLocaleString('en-IN') : ''
              }
              onChange={() => handleInspectionResult('reworkVendor')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rejected - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'rejectedInternal',
      key: 'rejectedInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="rejectedInternal"
            initialValue={
              record.rejectedInternal
                ? parseFloat(record.rejectedInternal).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              type="text"
              value={
                record.rejectedInternal
                  ? parseFloat(record.rejectedInternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('rejectedInternal')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rejected - Due to Supplier Mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'rejectedExternal',
      key: 'rejectedExternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="rejectedExternal"
            initialValue={
              record.rejectedExternal
                ? parseFloat(record.rejectedExternal).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              type="text"
              value={
                record.rejectedExternal
                  ? parseFloat(record.rejectedExternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('rejectedExternal')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Quality Rating',
      dataIndex: 'qualityRating',
      key: 'qualityRating',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="qualityRating"
            initialValue={
              record.qualityRating ? parseFloat(record.qualityRating).toLocaleString('en-IN') : 0
            }
          >
            <Input
              type="text"
              value={
                record.qualityRating ? parseFloat(record.qualityRating).toLocaleString('en-IN') : 0
              }
              onChange={() => handleInspectionResult('qualityRating')}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const getConfigdtlList = async () => {
    setConfigList([])
    form.resetFields(['config'])
    // const formData = form.getFieldsValue()
    const props = {
      tenantId,
      qiId: hdrId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'getConfigName',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      if (httpget?.responseData?.length > 0) {
        setConfigList(httpget?.responseData)
        handleGetDetails(httpget?.responseData?.[0])
      } else {
        setConfigList([])
      }
    } else {
      setConfigList([])
    }
  }

  const retriveHdrData = async hdrid => {
    const props = {
      qiId: hdrid,
      empId: employeID,
      pmId: processCode,
      tenantId,
    }
    const httpget = await InspectionReportService({
      requestPath: 'retieveQCInspectionHdr',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setHdrcardloading(false)
      setDocStatusDescbtn(false)
      setQcreshdrdata(httpget.responseData)
      setHdrDtls(httpget.responseData)
      setMasterPoc(httpget.responseData?.[0].masterPoc)
      setQualityView(true)
    } else {
      message.error(httpget.responseMessage)
    }
  }
  const setHdrDtls = data => {
    if (data) {
      const insdate = data?.[0]?.inspectedDate
      const revdate = data?.[0]?.insReqDate
      form.setFieldsValue({
        drawingnumber: data?.[0]?.productCode || data?.[0]?.drawingNo,
        qualityplanreqnum: data?.[0]?.qualityRefNo,
        inspectiondate: insdate ? moment(insdate) : '',
        revisiondate: revdate ? moment(revdate) : '',
      })
    }
  }

  const handleinsert = async () => {
    setDocStatusDescbtn(true)
    let insertcheck = false
    const formvalues = form.getFieldValue()
    const filterdtllist = insrestable.filter(
      entry =>
        entry.sno !== '' &&
        entry.description !== '' &&
        entry.inspectionMethod !== '' &&
        entry.specification !== '' &&
        entry.inspectionResult !== '' &&
        entry.inspectionResult !== undefined,
    )

    const updatedList = filterdtllist.map(entry => ({
      ...entry,
      minimum: entry.minimum === null ? 0 : entry.minimum,
      maximum: entry.maximum === null ? 0 : entry.maximum,
      average: entry.average === null ? 0 : entry.average,
      inspectionResult: 'ok',
    }))

    const formData = form.getFieldsValue()
    const insQty =
      formData.inspectionQty === '' ? 0 : parseInt(formData?.inspectionQty?.replace(/,/g, ''), 10)

    const okquantity = formData.okquantity === '' ? 0 : parseInt(formData.okquantity, 10)
    const nokquantity = formData.nokquantity === '' ? 0 : parseInt(formData.nokquantity, 10)
    const rejectInternal =
      formData.totalrejectedInternal === '' ? 0 : parseInt(formData.totalrejectedInternal, 10)
    const rejectExternal =
      formData.totalrejectedExternal === '' ? 0 : parseInt(formData.totalrejectedExternal, 10)
    const reworkInternal =
      formData.totalreworkInternal === '' ? 0 : parseInt(formData.totalreworkInternal, 10)
    const reworkExternal =
      formData.totalreworkExternal === '' ? 0 : parseInt(formData.totalreworkExternal, 10)

    const sum =
      okquantity + nokquantity + rejectInternal + rejectExternal + reworkInternal + reworkExternal

    if (insQty === sum) {
      if (
        filterdtllist.length > 0 &&
        formvalues.drawingnumber &&
        formvalues.qualityplanreqnum !== null &&
        formvalues.qualityplanreqnum !== undefined &&
        (okquantity <= 0 ||
          (okquantity > 0 && formvalues.okquantityrmk && formvalues.okquantityrmk.trim() !== '')) &&
        (nokquantity <= 0 ||
          (nokquantity > 0 &&
            formvalues.nokquantityrmk &&
            formvalues.nokquantityrmk.trim() !== '')) &&
        (rejectInternal <= 0 ||
          (rejectInternal > 0 &&
            formvalues.totalrejectedInternalrmk &&
            formvalues.totalrejectedInternalrmk.trim() !== '')) &&
        (rejectExternal <= 0 ||
          (rejectExternal > 0 &&
            formvalues.totalrejectedExternalrmk &&
            formvalues.totalrejectedExternalrmk.trim() !== '')) &&
        (reworkInternal <= 0 ||
          (reworkInternal > 0 &&
            formvalues.totalreworkInternalrmk &&
            formvalues.totalreworkInternalrmk.trim() !== '')) &&
        (reworkExternal <= 0 ||
          (reworkExternal > 0 &&
            formvalues.totalreworkExternalrmk &&
            formvalues.totalreworkExternalrmk.trim() !== ''))
      ) {
        setDisablesavebtn(true)
        const newInsert = {
          caInternal: formvalues.caInternal || 0,
          caVendor: formvalues.caVendor || 0,
          configName: formvalues.config || configList?.[0],
          docLifeCycleMstList: [],
          dtlList: updatedList,
          empId: employeID,
          inspectedBy: employeID,
          inspectedOn: moment(formvalues.inspectiondate).format('YYYY-MM-DD'),
          inspectionQty: parseInt(formvalues?.inspectionQty?.replace(/,/g, ''), 10) || 0,
          inspectionType: (qcrestable && qcrestable?.[0]?.inspectionType) || '',
          directlyAccepted: formvalues.okQty || 0,
          pmHdrId: projectId,
          qiHdrId: (qcrestable && qcrestable?.[0]?.qiHdrId) || '',
          qiId: hdrId || '',
          qicCreatedBy: employeID,
          qicCreatedOn: '',
          qicHdrId: (qcrestable && qcrestable?.[0]?.qicHdrId) || '',
          qicName: '',
          vendorCode: (qcreshdrdata && qcreshdrdata?.[0]?.vendorCode) || '',
          qualityRating: formvalues.rejectedExternal || 0,
          qualityRefNo: formvalues.qualityplanreqnum,
          drawingNo: formvalues.drawingnumber,
          rejectedExternal: formvalues.rejectedExternal || 0,
          rejectedInternal: formvalues.rejectedInternal || 0,
          revisionDate: moment(formvalues.revisiondate).format('YYYY-MM-DD'),
          reworkInternal: formvalues.reworkInternal || 0,
          reworkVendor: formvalues.reworkVendor || 0,
          tenantId,
          totalOkQty: formvalues.okquantity,
          totalReworkQty: 0,
          totalNokQty: formvalues.nokquantity || 0,
          okRemarks: formvalues.okquantityrmk,
          nokRemarks: formvalues.nokquantityrmk,
          totalRejcInt: formvalues.totalrejectedInternal,
          totalRejcExt: formvalues.totalrejectedExternal,
          rejectIntRemarks: formvalues.totalrejectedInternalrmk,
          rejectExtRemarks: formvalues.totalrejectedExternalrmk,
          totalReworkInt: formvalues.totalreworkInternal,
          totalReworkVen: formvalues.totalreworkExternal,
          reworkIntRemarks: formvalues.totalreworkInternalrmk,
          reworkVenRemarks: formvalues.totalreworkExternalrmk,
          nrFlag: 0,
          cancelFlag: '0',
          pmId: processCode,
          qHdrId: QtyHdrId,
          poId,
        }
        setDisablesavebtn(true)
        setDocStatusDescbtn(true)
        const httpget = await InspectionReportService({
          requestPath: 'insertInspHdrAndDtl',
          requestData: newInsert,
        })

        if (httpget.responseCode === '200') {
          message.success(httpget.responseMessage)
          handleClear()
          setDisablesavebtn(false)
          setDocStatusDescbtn(false)
          insertcheck = true
        } else {
          message.error(httpget.responseMessage)
          setDisablesavebtn(false)
          setDocStatusDescbtn(false)
        }
      } else {
        messageReturn(405)
        setDocStatusDescbtn(false)
      }
    } else {
      messageReturn(643)
    }
    return insertcheck
  }

  const handleClear = () => {
    onmodalCancel()
    setQualityView(false)
    setInsresultview(false)
    form.resetFields()
  }
  const handleGetDetails = async config => {
    // const formData = form.getFieldsValue()
    const props = {
      tenantId,
      empId: employeID,
      qiId: hdrId,
      qicName: config,
    }

    if (config !== '') {
      setInsresultview(true)
      const httpget = await InspectionReportService({
        requestPath: 'getInspHdrAndDtl',
        requestData: props,
      })
      if (httpget.responseCode === '200') {
        if (httpget?.responseData?.length > 0) {
          getDoctDetails()

          // setConfigList(httpget?.responseData)
          const maxSno = httpget?.responseData?.[0]?.dtlList.reduce(
            (max, item) => Math.max(max, parseInt(item.sno, 10)),
            -Infinity,
          )
          const insEmptyObj = {
            description: '',
            specification: '',
            inspectionMethod: '',
            minimum: '',
            maximum: '',
            average: '',
            inspectionResult: '',
            qicDtlId: '',
            qicHdrId: '',
            sno: maxSno + 1 || '',
            serialNumber: maxSno + 1 || '',
          }
          const newupdatedDate = [...httpget?.responseData?.[0]?.dtlList, insEmptyObj]
          setInsrestable([...httpget?.responseData?.[0]?.dtlList, insEmptyObj])
          setIsEditable(httpget?.responseData?.[0]?.isEditable)
          setDocStatus(httpget?.responseData?.[0]?.docLifeCycleMstList)
          setQcrestable(httpget?.responseData)

          if (form && httpget?.responseData?.[0]?.dtlList) {
            newupdatedDate.forEach(record => {
              form.setFieldsValue({
                [`sno${record.sno}`]: record.serialNumber,
                [`inspectionResult${record.sno}`]: record.inspectionResult,
                [`description${record.sno}`]: record.description,
                [`spec${record.sno}`]: record.specification,
                [`inspectionMethod${record.sno}`]: record.inspectionMethod,
                [`minActual${record.sno}`]: record.minimum
                  ? parseFloat(record.minimum).toLocaleString('en-IN')
                  : '',
                [`maxActual${record.sno}`]: record.maximum
                  ? parseFloat(record.maximum).toLocaleString('en-IN')
                  : '',
                [`avgActual${record.sno}`]: record.average
                  ? parseFloat(record.average).toLocaleString('en-IN')
                  : '',
              })
            })
          }

          if (form && httpget?.responseData) {
            const initialValues = {}
            httpget.responseData.forEach(record => {
              // const rework =
              //   parseInt(record.reworkVendor || 0, 10) + parseInt(record.reworkInternal || 0, 10)
              // const nokQuantity =
              //   parseInt(record.rejectedInternal || 0, 10) +
              //   parseInt(record.rejectedExternal || 0, 10)
              // const okQuantity =
              //   parseInt(record.okQty || 0, 10) +
              //   parseInt(record.caInternal || 0, 10) +
              //   parseInt(record.caVendor || 0, 10)
              initialValues.totalrejectedInternalrmk = record.rejectIntRemarks
              initialValues.totalrejectedExternalrmk = record.rejectExtRemarks
              initialValues.totalrejectedInternal = parseInt(record.totalRejcInt || 0, 10)
              initialValues.totalrejectedExternal = parseInt(record.totalRejcExt || 0, 10)
              initialValues.totalreworkInternalrmk = record.reworkIntRemarks
              initialValues.totalreworkExternalrmk = record.reworkVenRemarks
              initialValues.totalreworkInternal = parseInt(record.totalReworkInt || 0, 10)
              initialValues.totalreworkExternal = parseInt(record.totalReworkVen || 0, 10)
              initialValues.okquantity = parseInt(record.totalOkQty || 0, 10)
              initialValues.nokquantity = parseInt(record.totalNokQty || 0, 10)
              initialValues.nokquantityrmk = record.nokRemarks
              initialValues.okquantityrmk = record.okRemarks
              initialValues.okQty = record.directlyAccepted
                ? parseFloat(record.directlyAccepted).toLocaleString('en-IN')
                : 0
              initialValues.caInternal = record.caInternal
                ? parseFloat(record.caInternal).toLocaleString('en-IN')
                : 0
              initialValues.caVendor = record.caVendor
                ? parseFloat(record.caVendor).toLocaleString('en-IN')
                : 0
              initialValues.reworkInternal = record.reworkInternal
                ? parseFloat(record.reworkInternal).toLocaleString('en-IN')
                : 0
              initialValues.reworkVendor = record.reworkVendor
                ? parseFloat(record.reworkVendor).toLocaleString('en-IN')
                : 0
              initialValues.rejectedInternal = record.rejectedInternal
                ? parseFloat(record.rejectedInternal).toLocaleString('en-IN')
                : 0
              initialValues.rejectedExternal = record.rejectedExternal
                ? parseFloat(record.rejectedExternal).toLocaleString('en-IN')
                : 0

              // Add other fields as needed
            })
            setinitialData(initialValues)
            form.setFieldsValue(initialValues)
          }
        } else {
          // setConfigList([])
          const insEmptyObj = {
            description: '',
            specification: '',
            inspectionMethod: '',
            minimum: '',
            maximum: '',
            average: '',
            inspectionResult: '',
            qicDtlId: '',
            qicHdrId: '',
            sno: 1,
            serialNumber: 1,
          }
          setInsrestable(insEmptyObj)
        }
      } else {
        const insEmptyObj = {
          description: '',
          specification: '',
          inspectionMethod: '',
          minimum: '',
          maximum: '',
          average: '',
          inspectionResult: '',
          qicDtlId: '',
          qicHdrId: '',
          sno: 1,
          serialNumber: 1,
        }
        setInsrestable(insEmptyObj)
      }
    } else {
      messageReturn(405)
      setInsrestable([])
    }
  }


  const addRemarksSubmit = () => {
    setApproveRemarksCard(true)
  }

  const OpenDetailCard = () => {
    setdetailCard(true)
    getRemarkslog()
  }

  const getRemarkslog = async () => {
    const props = {
      refId: (insrestable && insrestable?.[0]?.qiHdrId) || '',
      refDoc: 'INSPECTION',
      tenantId,
    }
    const httprmk = await InspectionReportService({
      requestPath: 'getQIStatusDtls',
      requestData: props,
    })
    if (httprmk.responseCode === '200') {
      setRmkDetaillist(httprmk.responseData)
    } else {
      message.error(httprmk.responseMessage)
    }
  }

  const addprevRemarksSubmit = () => {
    setPrevRemarksCard(true)
  }

  const AddRemarksComponent = seq => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  onClick={() => handleQCInsapproval(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const handleQCInsapproval = async seq => {
    const formvalue = inputForm.getFieldValue()
    setApproveRemarksCard(false)
    const props = {
      currentseq: seq,
      tenantId,
      empId: employeID,
      hdrId: (insrestable && insrestable?.[0]?.qiHdrId) || '',
      remarks: formvalue.remarks,
      nrFlag: '0',
      cancelFlag: '0',
      pmId: processCode,
      qHdrId: QtyHdrId,
      qualityHdrId: QtyHdrId,
      poId,
      pmHdrId: projectId,
      docGroup: '',
      docTypeCode: '',
      enquiryId: '',
      mstId: '',
    }

    const formData = form.getFieldsValue()
    const insQty =
      formData.inspectionQty === '' ? 0 : parseInt(formData?.inspectionQty?.replace(/,/g, ''), 10)

    const okquantity = formData.okquantity === '' ? 0 : parseInt(formData.okquantity, 10)
    const nokquantity = formData.nokquantity === '' ? 0 : parseInt(formData.nokquantity, 10)
    const rejectInternal =
      formData.totalrejectedInternal === '' ? 0 : parseInt(formData.totalrejectedInternal, 10)
    const rejectExternal =
      formData.totalrejectedExternal === '' ? 0 : parseInt(formData.totalrejectedExternal, 10)
    const reworkInternal =
      formData.totalreworkInternal === '' ? 0 : parseInt(formData.totalreworkInternal, 10)
    const reworkExternal =
      formData.totalreworkExternal === '' ? 0 : parseInt(formData.totalreworkExternal, 10)

    const sum =
      okquantity + nokquantity + rejectInternal + rejectExternal + reworkInternal + reworkExternal
    if (insQty === sum) {
      const handleInsertResult = await handleinsert()
      if (handleInsertResult) {
        const httpapprovals = await InspectionReportService({
          requestPath: 'updateQISeqAndStatus',
          requestData: props,
        })

        if (httpapprovals.responseCode === '200') {
          updateTailView()
          onmodalCancel()
          setApproveRemarksCard(false)
        } else {
          message.error(httpapprovals.responseMessage)
        }
      }
    } else {
      messageReturn(643)
    }
  }

  const updateTailView = async () => {
    console.log(Enquiry)
    const response = await indentFileUpload({
      requestPath: 'getQtyDtl',
      requestData: {
        qhdrId: '',
        customerName: '',
        empId: employeID,
        fromDate: '',
        pmId: processCode,
        toDate: '',
        projectId,
        tenantId,
      },
    })
    console.log(response)
    if (response.responseCode === '200') {
      const updatedResponseData = response.responseData
      const filteredData = updatedResponseData.find(item => item.pmHdrId === projectId)
      console.log(filteredData)

      const sumofqty =
        parseInt(filteredData?.okCount || '0', 10) +
        parseInt(filteredData?.conditionalApprovedCnt || '0', 10) +
        parseInt(filteredData?.rejectedCount || '0', 10) +
        parseInt(filteredData?.reworkCount || '0', 10)
      const completedqty =
        sumofqty > filteredData?.qtyToBeInspected ? filteredData?.qtyToBeInspected : sumofqty

      const updateEnquiry = [
        {
          key: 1,
          label: 'Project Number',
          value: filteredData?.projectCode || '',
        },
        {
          key: 2,
          label: 'Project Name',
          value: filteredData?.projectName || '',
        },
        {
          key: 3,
          label: 'Status',
          value: filteredData?.hdrStatusDesc || '',
        },
        {
          key: 4,
          label: 'Inspection Requested Qty.',
          value: parseInt(filteredData?.qtyToBeInspected || '0', 10),
        },
        // {
        //   key: 11,
        //   label: 'Yet To be Inspected',
        //   value: parseInt(YettobeIns || '0', 10) ,
        // },
        {
          key: 6,
          label: 'Inspection Completed Qty.',
          value: parseInt(completedqty || '0', 10),
        },
        {
          key: 5,
          label: 'Ok Qty.',
          value: parseInt(filteredData?.okCount || '0', 10),
        },
        {
          key: 6,
          label: 'Conditional Qty.',
          value: parseInt(filteredData?.conditionalApprovedCnt || '0', 10),
        },
        {
          key: 7,
          label: 'Rejected Qty.',
          value: parseInt(filteredData?.rejectedCount || '0', 10),
        },
        {
          key: 8,
          label: 'Rework Qty.',
          value: parseInt(filteredData?.reworkCount || '0', 10),
        },
        {
          key: 9,
          label: 'No. of Request Received',
          value: filteredData?.qtyinspectionTotal || '',
        },
        {
          key: 10,
          label: 'No. of Request Completed',
          value: filteredData?.qtyinspectionCompleted || '',
        },
      ]
      console.log(updateEnquiry)
      setTimeout(() => {
        store.set('Enquiry', updateEnquiry)
      }, 2000)
    }
  }
  
  const handletaskfileupload = async () => {
    const formvalue = inputForm.getFieldsValue()
    if (filesList.length === 0 || formvalue.documentType === undefined) {
      messageReturn(644)
      return
    }

    try {
      const file = filesList[0]
      const reqObj = [
        {
          enquiryId: enquiryid,
          tenantId,
          documentType: 'DC072',
          uploadDocType: formvalue.documentType,
          remarks: '',
          empId: employeID,
          refId: hdrId,
          projectId,
          stageCode: stgCode,
          documentName: 'QC Inspection',
          type: 'Projects',
          pmId: processCode,
        },
      ]

      const formData = new FormData()
      formData.append('addDocument', JSON.stringify({ reqObj }))
      formData.append('file', file.originFileObj)

      const response = await addDocumentdetail({ requestData: formData })

      if (response.responseCode === '200') {
        message.success(`File ${file.name} uploaded successfully`)
        setFilesList([])
        getDoctDetails()
      } else {
        messageReturn(null, `Failed to upload file ${file.name}`)
      }
    } catch (error) {
      messageReturn(610)
    }
  }

  const AddRemarksprevComponent = seq => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  onClick={() => handleQCInsapproval(seq)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const getDoctDetails = async () => {
    const props = {
      enqId: enquiryid,
      stgCode,
      docTypeCode: 'DC072',
      tenantId,
      uploadDocType: '',
      refId: hdrId,
      pmHdrId: projectId,
    }

    const httpgetDoc = await InspectionReportService({
      requestPath: 'getqtyInspecDocDtl',
      requestData: props,
    })

    if (httpgetDoc.responseCode === '200') {
      setReportdata(httpgetDoc.responseData)
    }
  }


  const handleDeleteFile= async (dmid) => {
    const props = [{
      empId:employeID,
      tenantId,
      dmaId:dmid,
    }
    ]
    const httpDeleteFile = await IndentGroupgetDetails({
      requestPath: 'deleteUploadDocument',
      requestData: props,
    })
    if (httpDeleteFile.responseCode === '200') {
      message.success(httpDeleteFile.responseMessage)
      setReportdata(prev => prev.filter(doc => doc.dmId !== dmid))
    } else {
      message.error(httpDeleteFile.responseMessage)
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
    },
    {
      title: 'Document Type ',
      dataIndex: 'uploadDocument',
      key: 'uploadDocument',
    },
    // {
    //   title: 'Doc ID',
    //   dataIndex: 'dmId',
    //   key: 'dmId',
    // },
    // {
    //   title:  'Remarks',
    //   key: 'remarks',
    //   dataIndex: 'remarks',
    //   render: (text, record) => {
    //     return  (
    //       <span>{record.remarks}</span>
    //     )
    //   },
    // },
    {
      title: 'Uploaded On',
      key: 'createdDate',
      dataIndex: 'createdDate',
      render: (text, record) => moment(record.createdDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Uploaded By',
      key: 'createdBy',
      dataIndex: 'createdBy',
    },
    {
      title: 'Action',
      key: 'Apprveaction',
      dataIndex: 'Apprveaction',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <DownloadDocuments
              refid={record.dmId}
              tenanrId={tenantId}
              fileDocode={record.uploadDocType}
              docTypeCode={record.document}
              isPdf={record.isPdf}
            />
            {masterPoc === '1' ? <RemoveIcon onClick={()=>handleDeleteFile(record.dmId)} /> : null}
          </div>
        )
      },
    },
  ]

  const remarksColumns = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status Description',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]
  // const disableDates = current => {
  //   const insReqDate = qcreshdrdata[0]?.insReqDate
  //     ? moment(qcreshdrdata[0].insReqDate)
  //     : moment().endOf('day')
  //   return (
  //     // current && !current.isBetween(moment(insReqDate).add(7, 'days'), insReqDate, null, '[]')
  //     current && !current.isBetween(insReqDate, moment(insReqDate).add(7, 'days'), null, '[]')
  //   )
  //   // return current && !current.isBetween(insReqDate, moment(insReqDate).add(7, 'days'), null, '[]')
  // }

  return (
    <div>
      <Skeleton loading={hdrcardloading} active>
        <div style={{ display: qualityView ? 'block' : 'none' }}>
          <Form form={form}>
            <div className="row" style={{ marginBottom: '10px' }}>
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 col-xxl-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                    Supplier Name:
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    {qcreshdrdata && qcreshdrdata?.[0]?.vendorName}
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 col-xxl-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                    Supplier Location:
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    {qcreshdrdata && qcreshdrdata?.[0]?.locationRef}
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 col-xxl-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                    Description:
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    {qcreshdrdata && qcreshdrdata?.[0]?.productName}
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 col-xxl-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>Qty:</p>
                  <p style={{ marginBottom: '0' }}>
                    {qcreshdrdata && qcreshdrdata?.[0]?.qtyToBeInspected}
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                    QC Requested DateTime:
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    {requestDate && moment(requestDate).format('DD-MMM-YYYY HH:mm')}
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-1 col-xl-1 col-xxl-2">
                {qcreshdrdata && qcreshdrdata?.[0]?.dmId !== 0 && (
                  <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '5px' }}>
                    <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                      Drawing Detail:
                    </p>
                    <p style={{ marginBottom: '0', pointerEvents: 'auto', opacity: 1 }}>
                      <DownloadDocuments
                        refid={qcreshdrdata && qcreshdrdata?.[0]?.dmId}
                        tenanrId={tenantId}
                        fileDocode="FC015"
                        docTypeCode="DC018"
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Form>
          <Form form={form} disabled={isEditable === '0'}>
            <div className="row" style={{ marginBottom: '10px' }}>
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="drawingnumber"
                  label={
                    <span>
                      Drawing No<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent disabled placeholder="Type Drawing No." />
                </Form.Item>
              </div>
              <div
                className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3"
                style={{ display: 'none' }}
              >
                <Form.Item
                  name="revisiondate"
                  label={
                    <span>
                      Revision Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                  initialValue={moment()}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="inspectiondate"
                  label={
                    <span>
                      Inspection Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="qualityplanreqnum"
                  label={
                    <span>
                      Quality Plan Ref No.<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent placeholder="Type Quality Plan Req No." />
                </Form.Item>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item
                    name="config"
                    label={
                      <span>
                        Config<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select style={{ width: '100%' }} placeholder="Select Config">
                      {configList?.map(item => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div
              style={{ display: 'none', justifyContent: 'center', gap: '15px', marginTop: '15px' }}
            >
              <Button type="primary" onClick={() => handleGetDetails()}>
                Get details
              </Button>
              <Button type="primary" onClick={() => handleClear()}>
                Clear
              </Button>
            </div>
          </Form>
        </div>
        <div style={{ display: 'none', marginTop: '15px' }}>
          <TableComponent data={insrestable} columns={insrescolumns} scrollY={400} page={false} />
        </div>
        <div style={{ display: insresultview ? 'block' : 'none', marginTop: '15px' }}>
          <Table columns={qcrescolumns} dataSource={qcrestable} pagination={false} />
          {/* <TableComponent data={qcrestable} columns={qcrescolumns} scrollY={400} page={false} /> */}
        </div>
        <div>
          <div style={{ display: insresultview ? 'block' : 'none', marginTop: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <h5>Overall Inspection Result:</h5>
            </div>

            <table
              style={{
                width: '25%',
                margin: 'auto',
                marginBottom: '10px',
                border: '1px solid black',
                borderCollapse: 'collapse',
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    OK
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="okquantity">
                        <Input type="text" onChange={() => handleInspectionResult('okquantity')} />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.okquantityrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="okquantityrmk">
                          <Input type="text" placeholder="Ok Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    Not OK
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="nokquantity">
                        <Input type="text" onChange={() => handleInspectionResult('nokquantity')} />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.nokquantityrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="nokquantityrmk">
                          <Input type="text" placeholder="Nok Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    Rejected (Internal)
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedInternal">
                        <Input
                          type="text"
                          onChange={() => handleInspectionResult('totalrejectedInternal')}
                        />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.totalrejectedInternalrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedInternalrmk">
                          <Input type="text" placeholder="Rejected Internal Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    Rejected (External)
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedExternal">
                        <Input
                          type="text"
                          onChange={() => handleInspectionResult('totalrejectedExternal')}
                        />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.totalrejectedExternalrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedExternalrmk">
                          <Input type="text" placeholder="Rejected External Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    Rework (Internal)
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="totalreworkInternal">
                        <Input
                          type="text"
                          onChange={() => handleInspectionResult('totalreworkInternal')}
                        />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.totalreworkInternalrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalreworkInternalrmk">
                          <Input type="text" placeholder="Rejected Rewrok Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                    Rework (External)
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Form.Item style={{ marginBottom: '0px' }} name="totalreworkExternal">
                        <Input
                          type="text"
                          onChange={() => handleInspectionResult('totalreworkExternal')}
                        />
                      </Form.Item>
                    </Form>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Form form={form} disabled={isEditable === '0'}>
                      <Tooltip title={initialData?.totalreworkExternalrmk}>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalreworkExternalrmk">
                          <Input type="text" placeholder="Rejected Rework Remakrs.." />
                        </Form.Item>
                      </Tooltip>
                    </Form>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* <div>
          <QualityApproveDocs type="Quality" uploadDocType="DC072" />
        </div> */}
        <div
          style={{ display: insresultview ? 'block' : 'none', marginTop: '10px' }}
          className="custom_antd_Table"
        >
          <TableComponent columns={columns} data={reportdata} scrollY={500} />
        </div>

        <div style={{ display: insresultview ? 'block' : 'none' }}>
          {qcrestable && qcrestable?.[0]?.statusDesc && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold' }}> Current Status : </span>{' '}
                {qcrestable && qcrestable?.[0]?.statusDesc}
              </h6>
            </div>
          )}
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
            <Form form={inputForm}>
              <Form.Item
                name="documentType"
                rules={[{ required: true, message: 'Please select Document Type!' }]}
              >
                <Select placeholder="Select Doc Type">
                  {doctypedata.map(item => (
                    <Option key={item.fuCode} value={item.fuCode}>
                      {item.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>

            <div style={{ width: '135px' }}>
              <Upload
                onChange={handleUploadChange}
                fileList={filesList}
                beforeUpload={false}
                showUploadList={false}
              >
                <Button type="primary" size="medium" icon={<UploadOutlined />}>
                  Select Files
                </Button>
              </Upload>
              {filesList.length > 0 && (
                <div>
                  <p>Selected Files:</p>
                  <ul>
                    {filesList.map(file => (
                      <li key={file}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <ButtonComponent
              type="primary"
              text="Upload"
              onClick={() => {
                handletaskfileupload()
              }}
            />

            {docStatus && docStatus.length > 0 && (
              <>
                {/* <span style={{ margin: '0 8px' }} /> */}
                <ButtonComponent
                  type="primary"
                  text={docStatus[0].docStatusDesc}
                  onClick={() => addRemarksSubmit(docStatus[0].currSequence)}
                  disable={docStatusDescbtn}
                />
              </>
            )}

            <Popuptable
              onClose={() => setApproveRemarksCard(false)}
              cardLabel=""
              component={AddRemarksComponent(
                docStatus && docStatus.length > 0 ? docStatus[0].currSequence : '',
              )}
              visible={approveRemarksCard}
            />
            {/* <span style={{ margin: '0 8px' }} /> */}

            <ButtonComponent
              type="primary"
              icon={<CommentOutlined />}
              onClick={() => {
                OpenDetailCard()
              }}
            />
            <Popuptable
              onClose={() => setdetailCard(false)}
              cardLabel=""
              component={
                <div className="custom_antd_Table" style={{ width: isMobile ? '280px' : '500px' }}>
                  {' '}
                  <TableComponent data={rmkDetaillist} columns={remarksColumns} scrollY={500} />
                </div>
              }
              visible={detailCard}
            />
            {/* <span style={{ margin: '0 8px' }} /> */}
            <div style={{ display: isEditable === '0' ? 'none' : 'inline' }}>
              <ButtonComponent
                text="Save"
                type="primary"
                onClick={() => handleinsert()}
                disable={disablesavebtn}
              />
            </div>
            <div style={{ display: 'none' }}>
              {/* <span style={{ margin: '0 8px' }} /> */}
              {docStatus && docStatus.length > 0 && (
                <ButtonComponent
                  type="danger"
                  text="Previous Stage"
                  onClick={() => addprevRemarksSubmit(docStatus[0].cancelSeq)}
                />
              )}
              <Popuptable
                onClose={() => setPrevRemarksCard(false)}
                cardLabel=""
                component={AddRemarksprevComponent(
                  docStatus && docStatus.length > 0 ? docStatus[0].cancelSeq : '',
                )}
                visible={prevRemarksCard}
              />
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default QualityReportComponet
