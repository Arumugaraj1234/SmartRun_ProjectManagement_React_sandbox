import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import { message, Upload, Button, Space, Input, Card, Form, InputNumber, AutoComplete } from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  CommentOutlined,
  MessageOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import ModalPopup from 'components/shared/ModalPopupComponent'
import TaskApprovalService from 'services/common/Taskmanagement/ApprovalService'
import getDocumentManagementDetails from 'services/common/Taskmanagement/DownloadModalviewservice'
import UpdateCompletionpercent from 'services/common/Taskmanagement/UpdateCompletionPercent'
import uploadtaskDocuments from 'services/common/Taskmanagement/Uploaddocumentfiles'
import getTaskRemarksDetail from 'services/common/Taskmanagement/RemarksDetailService'
import getEmployeeDropDownDataService from 'services/common/AssignTeamGetDtlService'
import TaskDtlRemarksById from 'services/common/Taskmanagement/TaskDtlRemarksByIdService'
import TaskPercentageFlag from 'services/common/Taskmanagement/TaskPercentageFlagService'
import TaskPercentageUpdate from 'services/common/Taskmanagement/UpdateHdrPercentage'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import TaskReassignFlag from 'services/common/Taskmanagement/TaskReassignFlagService'
import ButtonComponent from 'components/shared/ButtonComponent'
import Popuptable from 'components/shared/PopuptableComponent'
import messageReturn from '_helpers/messageReturn'
// import DropDownComponent from 'components/shared/DropDownComponent'
import { useMediaQuery } from 'react-responsive'
import TableComponent from '../TableComponent'
import DownloadDocuments from '../FileDownloadComponent'

const DownloadModalview = ({
  isDownloadlmodal,
  stageCode,
  referenceCode,
  handleCancel,
  activityName,
  assignedTo,
  dueDate,
  completion,
  approvalSeq,
  approvalStatus,
  isApproval,
  uploaddoctype,
  docStatus,
  docTypeCode,
  isFlag,
  requrirement,
  Qty,
  singlerow,
  assignemp,
}) => {
  const Tab = store.get('Tab')
  const employeID = store.get('employeeId')
  const ProjectID = store.get('ProjectID')
  const EnquiryID = store.get('EnquiryID')

  const { tenantId, stgCode, processCode, mstId } = Tab
  const { TextArea } = Input
  const [inputForm] = Form.useForm()
  const [reassignForm] = Form.useForm()
  const [CompletioninputForm] = Form.useForm()
  const [remarksinputform] = Form.useForm()
  const [detailCard, setdetailCard] = useState(false)
  const [responsedata, setResponsedata] = useState([])
  const [rmklog, setRmklog] = useState(false)
  const [rmklogdata, setRmklogdata] = useState([])
  const [filesList, setFilesList] = useState([])
  const [statusDetaillist, setStatusDetaillist] = useState([])
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [sequence, setSequence] = useState(null)
  const [lastsequence, setLastsequence] = useState('0')
  const [statuscode, setStatuscode] = useState(null)
  const [reassign, setReassign] = useState(false)
  const [employeeData, setEmployeeData] = useState([])
  const [emp, setEmp] = useState('')
  // const [empName, setEmpName] = useState('')
  const [complePt, setComplePt] = useState(false)
  const [complete, setComplete] = useState(completion)

  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })
  useEffect(() => {
    fetchDocDetailsdata()
    getEmployeeDropDownData()
    fetchPercentagedetails()
  }, [])

  // useEffect(() => {
  // }, reassign)

  const fetchReassigndetails = async () => {
    const reasign = {
      taskdtlId: referenceCode,
      empId: employeID,
      tenantId,
      pmId: processCode,
    }
    const reqpath = 'TaskReassignFlag'
    // const reqobj = {
    //   reasign,
    //   reqpath,
    // }
    const httpResponse = await TaskReassignFlag(reqpath, reasign)
    if (httpResponse) {
      if (httpResponse.responseMessage !== '0') {
        setReassign(true)
      }
    }
  }

  const fetchPercentagedetails = async () => {
    const reasign = {
      dtlId: referenceCode,
      tenantId,
    }
    const httpResponse = await TaskPercentageFlag(reasign)
    if (httpResponse.responseCode === '200') {
      if (httpResponse.responseMessage === 'NA') {
        setComplePt(false)
      } else {
        const formattedValue = parseFloat(httpResponse.responseMessage).toFixed(2)
        setComplete(formattedValue)
        setComplePt(true)
      }
    } else {
      messageReturn(607)
    }
  }

  const getTaskReassignForEmpId = async empvalue => {
    if (empvalue !== '' && empvalue !== undefined) {
      const reasign = {
        taskdtlId: referenceCode,
        empId: empvalue,
        tenantId,
        pmId: processCode,
      }
      const reqpath = 'TaskReassignForEmpId'
      // const reqobj = {
      //   reasign,
      //   reqpath,
      // }
      const httpResponse = await TaskReassignFlag(reqpath, reasign)
      if (httpResponse.responseCode === '200') {
        message.success(httpResponse.responseMessage)
      } else {
        message.error(httpResponse.responseMessage)
      }
    } else {
      messageReturn(608)
    }
  }
  const deleteTask = async () => {
    const keyareaobj = {
      teDtlId: singlerow?.taskentrydtlid,
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'deleteTaskHdrAndDtl  ',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      handleCancel()
    } else {
      message.error(response.responseMessage)
    }
  }

  const fetchDocDetailsdata = async () => {
    const docprops = {
      refId: referenceCode,
      tenantId,
      stgCode: stageCode,
    }
    const httpResponsedp = await getDocumentManagementDetails(docprops)
    if (httpResponsedp.responseCode === '200') {
      const response = httpResponsedp.responseData
      setResponsedata(response)
    } else {
      setResponsedata([])
    }
    fetchReassigndetails()
  }

  // const handleInputChange = (fieldName, value, option) => {

  //   if (fieldName === 'employeeID') {
  //     setEmp(option.key)
  //     setEmpName(option.value)
  //   }
  // }

  if (docStatus === null) {
    docStatus = []
  }

  const handleUploadChange = ({ fileList }) => {
    const updatedFileList = fileList
      .filter(file => {
        const fileSizeKB = file.size / 1024
        return fileSizeKB <= 1024 * 100
      })
      .map(file => ({
        ...file,
        isKeySet: false,
      }))

    setFilesList(updatedFileList)
  }

  const beforeUpload = file => {
    const fileSizeKB = file.size / 1024
    if (fileSizeKB > 1024 * 100) {
      messageReturn(null, `File ${file.name} size should be less than 100 MB`, 'error')
      return false
    }
    return true
  }
  const handleRemove = file => {
    const index = filesList.indexOf(file)
    const newFileList = filesList.slice()
    newFileList.splice(index, 1)
    handleUploadChange({ fileList: newFileList })
  }

  const handletaskfileupload = async () => {
    if (filesList.length === 0) {
      messageReturn(609)
      return
    }

    const uploadFilesSequentially = async index => {
      if (index >= filesList.length) {
        fetchDocDetailsdata()
        return
      }

      const file = filesList[index]
      const mstDtlArray = [
        {
          teDtlId: referenceCode,
          tenantId,
          pmHdrId: ProjectID,
          empId: employeID,
          documentName: 'Task',
          stageCode: stgCode,
          uploadDocType: uploaddoctype,
          remarks: '',
        },
      ]
      const formData = new FormData()
      formData.append('maininfo', JSON.stringify({ mstDtl: mstDtlArray }))
      formData.append('file', file.originFileObj)

      try {
        const response = await uploadtaskDocuments({
          requestData: formData,
        })

        if (response.responseCode === '200') {
          message.success(`File ${file.name} uploaded successfully`)
          setFilesList(prevFilesList =>
            prevFilesList.filter(files => files.name !== response.responseDataMessage),
          )
        } else {
          messageReturn(null, `Failed to upload file ${file.name}`, 'error')
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
      }

      // Upload the next file recursively
      await uploadFilesSequentially(index + 1)
    }

    try {
      await uploadFilesSequentially(0)
    } catch (error) {
      console.error('Error uploading files:', error)
      messageReturn(610)
    }
  }

  const deleteTaskdetail = async record => {
    console.log(record)
    const response = await indentFileUpload({
      requestPath: 'deleteTaskDoc  ',
      requestData: {
        indentDtlId: '',
        dmId: record?.dmId,
        tenantId,
      },
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      fetchDocDetailsdata()
    }
  }

  const columns = [
    {
      title: 'Doc ID',
      dataIndex: 'dmId',
      key: 'dmId',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Uploaded On',
      dataIndex: 'fileCreatedDate',
      key: 'fileCreatedDate',
      render: record => moment(record.fileCreatedDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Uploaded By',
      dataIndex: 'empName',
      key: 'empName',
    },
    {
      title: 'Task Description',
      dataIndex: 'documentTypeDescription',
      key: 'documentTypeDescription',
    },
    {
      title: 'Action',
      dataIndex: 'download',
      key: 'download',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          <DownloadDocuments
            isPdf={record.isPdf}
            refid={record.dmId}
            tenanrId={tenantId}
            fileDocode={record.fuCode}
            docTypeCode={record.documentTypeCode}
          />
          <Button onClick={() => deleteTaskdetail(record)} type="danger" icon={<MinusOutlined />} />
        </div>
      ),
    },
  ]

  const remarklogs = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Updated By',
      dataIndex: 'empName',
      key: 'empName',
    },
    {
      title: 'Updated Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: record => moment(record.dateTime).format('DD-MMM-YYYY'),
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
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Updated Date',
      dataIndex: 'transcactionDatetime',
      key: 'transcactionDatetime',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]

  const updatehdrpercent = async () => {
    const retriveprop = {
      dtlId: referenceCode,
      tenantId,
      employeeId: employeID,
    }
    // eslint-disable-next-line no-unused-vars
    const httpResponse = await TaskPercentageUpdate(retriveprop)
  }

  const handletaskapproval = async () => {
    const formvalue = inputForm.getFieldValue()
    if (formvalue.remarks && formvalue.remarks !== '') {
      const approvalprops = {
        dtlId: referenceCode,
        seq: sequence,
        isLastSeq: lastsequence,
        status: statuscode,
        pmId: processCode,
        mstId,
        tenantId,
        docTypeCode,
        empId: employeID,
        remarks: formvalue.remarks,
        pmHdrId: ProjectID,
        EnquiryID,
        isFlag,
      }
      const httpResponseCmp = await TaskApprovalService(approvalprops)
      if (httpResponseCmp.responseCode === '200') {
        inputForm.resetFields()
        saveFunction()
        handleCancel()
      } else {
        messageReturn(607)
      }
    } else {
      messageReturn(405)
    }
  }

  const saveFunction = async () => {
    const formValues = CompletioninputForm.getFieldsValue()
    const remarkvalue = remarksinputform.getFieldsValue()
    const remrks = remarkvalue.remarksinput
    const completionval = formValues.completiondata

    if (Number.isNaN(completionval) || completionval < 0 || completionval > 100) {
      messageReturn(611)
    } else {
      const updateprop = {
        teDtlId: referenceCode,
        ptgVal:
          completionval !== undefined && completionval !== null
            ? completionval.toFixed(2)
            : completion,
        remarks: remrks,
        employeeId: employeID,
        tenantId,
      }
      const httpResponseCmp = await UpdateCompletionpercent(updateprop)
      if (httpResponseCmp.responseCode === '200') {
        messageReturn(211)
        updatehdrpercent()
        remarksinputform.setFieldsValue({
          remarksinput: '',
        })
        handleCancel()
      } else {
        messageReturn(607)
      }
    }
  }

  // const handlecompletionchange = e => {
  //   let newValue = parseFloat(e.target.value);
  // if (Number.isNaN(newValue) || newValue < 0) {
  //   newValue = 0;
  // } else if (newValue > 100) {
  //   newValue = 100;
  // }
  //   setCompletionval(newValue)
  // }

  const AddRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>
                Add Remarks <span style={{ color: 'red' }}>*</span>
              </h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" onClick={() => handletaskapproval()}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // function handlecompletionchange(e) {
  //   if (e.target.value > 100 || e.target.value < 0) {
  //   } else {
  //     setCompletionval(e.target.value)
  //   }
  // }
  const addRemarksSubmit = fieldname => {
    if (fieldname === 'Approve') {
      setSequence(docStatus[0].currSequence)
      setStatuscode(docStatus[0].nextSeqStatusCode)
      setLastsequence(docStatus[0].lastSeq !== null ? docStatus[0].lastSeq : '0')
    } else if (fieldname === 'Disapprove') {
      setSequence(approvalSeq)
      setStatuscode(approvalStatus)
      setLastsequence('0')
    } else if (fieldname === 'cancel') {
      setSequence(docStatus[0].cancelSeq)
      setStatuscode(docStatus[0].cancelStatusCode)
      setLastsequence('0')
    }
    setApproveRemarksCard(true)
  }

  const getEmployeeDropDownData = async () => {
    const httpResponsedp = await getEmployeeDropDownDataService({
      employeeID: employeID,
      referenceDoc: processCode,
      referenceId: mstId,
      tenantId,
    })

    if (httpResponsedp) {
      const typecoderesp = httpResponsedp?.processAssignedTeamEntity
      if (typecoderesp) {
        const options = typecoderesp.map(item => ({
          key: item.empId,
          value: item.employeeName,
        }))
        setEmployeeData(options)
      }
    }
  }

  // const NewEmployeeName = value => {
  //   setEmp(value)
  // }

  const OpenDetailCard = async () => {
    const remarksprop = {
      taskDtlId: referenceCode,
      tenantId,
    }

    const httpResponseCmp = await getTaskRemarksDetail(remarksprop)
    if (httpResponseCmp.responseMessage === '200') {
      setStatusDetaillist(httpResponseCmp.responseData)
    } else {
      messageReturn(311)
    }
    setdetailCard(true)
  }

  const OpenRmkDetailCard = async () => {
    const remarksprop = {
      taskDtlId: referenceCode,
      tenantId,
    }

    const httpResponseCmp = await TaskDtlRemarksById(remarksprop)
    if (httpResponseCmp.responseMessage === '200') {
      setRmklogdata(httpResponseCmp.responseData)
    }
    setRmklog(true)
  }
  const handleInputChanged = (value, option) => {
    if (option) {
      reassignForm.setFieldsValue({ emplId: option.value })
      setEmp(option.key)
      // setEmpName(option.value)
    }
  }
  const FieldsComponent = () => {
    return (
      <div>
        <div
          className="row"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Activity:</p>
              <p>{activityName}</p>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div style={{ display: reassign ? 'block' : 'none', alignItems: 'end' }}>
              <Form form={reassignForm}>
                <div style={{ display: 'flex' }}>
                  <div>
                    <Form.Item name="emplId">
                      <AutoComplete
                        options={employeeData}
                        onChange={handleInputChanged}
                        onSelect={(value, option) => handleInputChanged(value, option)}
                        filterOption={(inputValue, option) =>
                          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        <Input placeholder="Select here" />
                      </AutoComplete>
                    </Form.Item>
                  </div>
                  {/* <DropDownComponent
              data={employeeData}
              value={empName}
              onChange={text => setEmpName(text)}
              onSelect={(value, option) => handleInputChange('employeeID', value, option)}
              onBlur={value => NewEmployeeName(value)}
            /> */}
                  <span style={{ margin: '0 8px' }} />
                  <Button
                    type="primary"
                    onClick={() => {
                      getTaskReassignForEmpId(emp)
                    }}
                  >
                    Reassign
                  </Button>
                  <span style={{ margin: '0 8px' }} />
                  <Button
                    type="danger"
                    onClick={() => {
                      deleteTask()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>

        <div className="row">
          <div
            className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Assigned To:</p>
            <p>{assignedTo}</p>
          </div>
          <div
            className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Due Date:</p>
            <p>{dueDate}</p>
          </div>
          <div
            className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Qty:</p>
            <p>{Qty}</p>
          </div>
          <div
            className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Requirement</p>
            <p>{requrirement}</p>
          </div>
        </div>
        <div
          className="row"
          style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
        >
          <div
            className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ fontWeight: 'bold' }}>Completion %:</p>
            <Form form={CompletioninputForm}>
              <Form.Item
                name="completiondata"
                rules={[
                  { required: true, message: 'Please enter a value' },
                  { type: 'number', message: 'Please enter a valid number' },
                ]}
              >
                <InputNumber
                  defaultValue={complete}
                  placeholder="Type here..."
                  style={{ width: '100px', marginLeft: '10px', marginTop: '8px' }}
                  name="inputfield"
                  type="number"
                  readOnly={complePt || isApproval === 'False'}
                />
              </Form.Item>
            </Form>
          </div>
          <div
            className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <p style={{ fontWeight: 'bold' }}>Remarks:</p>
            <Form form={remarksinputform}>
              <Form.Item name="remarksinput">
                <Input
                  defaultValue=""
                  placeholder="Type Remarks here..."
                  style={{ width: '100%', marginLeft: '10px', marginTop: '8px' }}
                  name="remarksinputfield"
                  type="text"
                  readOnly={complePt || isApproval === 'False'}
                />
              </Form.Item>
            </Form>
          </div>
          <div
            className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-3"
            style={{ display: 'flex', gap: '10px' }}
          >
            <div style={{ marginBottom: '20px' }}>
              {(reassign || assignemp === employeID) && (
                <ButtonComponent
                  type="primary"
                  text="Save"
                  disable={complePt || isApproval === 'False'}
                  onClick={() => saveFunction()}
                />
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <ButtonComponent
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => {
                  OpenRmkDetailCard()
                }}
              />
              <Popuptable
                onClose={() => setRmklog(false)}
                cardLabel=""
                place="right"
                component={
                  <div
                    className="custom_antd_Table"
                    style={{ width: isMobile ? '270px' : '400px' }}
                  >
                    {' '}
                    <TableComponent data={rmklogdata} columns={remarklogs} scrollY={200} />
                  </div>
                }
                visible={rmklog}
              />
            </div>
          </div>
        </div>
        <div className="custom_antd_Table">
          <TableComponent columns={columns} data={responsedata} scrollY={500} />
        </div>
      </div>
    )
  }

  const ButtonsComponent = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {docStatus?.[0]?.isEditable === '1'  ? (
          <div style={{ width: '150px' }}>
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              fileList={filesList}
              multiple
              showUploadList={false}
            >
              <Button type="primary" size="medium" icon={<UploadOutlined />}>
                Select Files
              </Button>
              <span style={{ fontSize: '12px' }}>Choose Files below 100MB</span>
            </Upload>
            {filesList.length > 0 && (
              <Space direction="vertical" style={{ marginTop: 16 }}>
                {filesList.map(file => (
                  <div key={file.uid} style={{ display: 'flex' }}>
                    <p
                      className="mt-2"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px',
                        margin: '0px',
                      }}
                    >
                      {file.name.length > 20 ? `${file.name.slice(0, 30)}...` : file.name}
                    </p>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                    />
                  </div>
                ))}
              </Space>
            )}
          </div>
        ) : null}
        <span style={{ margin: '0 8px' }} />
        {docStatus?.[0]?.isEditable === '1' ? (
          <ButtonComponent
            type="primary"
            text="Upload"
            onClick={() => {
              handletaskfileupload()
            }}
          />
        ) : null}
        <span style={{ margin: '0 8px' }} />

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
              <TableComponent data={statusDetaillist} columns={remarksColumns} scrollY={500} />
            </div>
          }
          visible={detailCard}
        />
        <span style={{ margin: '0 8px' }} />
        <ButtonComponent type="primary" text="Cancel" onClick={() => handleCancel()} />
        <span style={{ margin: '0 8px' }} />
        {docStatus && docStatus.length > 0 && (reassign || assignemp === employeID) && (
          <ButtonComponent
            type="primary"
            text={docStatus[0].nextSeqStatusDesc}
            onClick={() => addRemarksSubmit('Approve')}
          />
        )}
        <span style={{ margin: '0 8px' }} />
        <Popuptable
          onClose={() => setApproveRemarksCard(false)}
          cardLabel=""
          component={AddRemarksComponent}
          visible={approveRemarksCard}
        />

        {docStatus &&
          docStatus.length > 0 &&
          docStatus?.[0]?.cancelSeq !== null &&
          (reassign || assignemp === employeID) && (
            <ButtonComponent
              type="danger"
              text={docStatus[0].cancelStatusDesc}
              onClick={() => addRemarksSubmit('cancel')}
            />
          )}
      </div>
    )
  }

  return (
    <div>
      <ModalPopup
        FieldsComponent={FieldsComponent}
        isModalVisible={isDownloadlmodal}
        ButtonsComponent={ButtonsComponent}
        text="Task Details"
        onCancel={() => {
          handleCancel()
        }}
        width={1000}
      />
    </div>
  )
}

export default DownloadModalview
