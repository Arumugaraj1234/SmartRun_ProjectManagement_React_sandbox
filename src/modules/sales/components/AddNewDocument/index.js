import React, { useState, useEffect } from 'react'
import store from 'store'
import { Form, Input, Upload, Button, Select, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import './style.scss'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import TextArea from '../../../../components/shared/TextAreaComponent'
import Buttons from '../../../../components/shared/ButtonComponent'
import checkFileSize from '../../../../_helpers/fileUtill'
import {
  addDocumentdetail,
  documentLIst,
} from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const { Option } = Select

const AddNewDocument = ({ handleCancel, isModalVisible, submit, type, Value, projDoc }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState(null)
  const [doctypedata, setDocTypeData] = useState([])
  const [disablebtn, setDisabledbtn] = useState(false)

  const employeID = store.get('employeeId')
  const projectid = store.get('ProjectID')
  const enquiryid = store.get('EnquiryID')

  const Tab = store.get('Tab')
  useEffect(() => {
    setDisabledbtn(false)
    const documentTypelist = async () => {
      try {
        const requestData = {
          documentTypeCode: projDoc,
          tenantId: Tab.tenantId,
        }
        const response = await documentLIst({
          requestData,
        })
        if (response) {
          setDocTypeData(response.responseData)
        }
      } catch (error) {
        console.error(error)
      }
    }

    documentTypelist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible])

  // const onFileChange = info => {
  //   const newFileList = info.fileList.slice(-1)
  //   setFileList(newFileList)
  // }

  const beforeUpload = file => {
    if (checkFileSize(file)) {
      setFileList(file)
    } else {
      setFileList(null)
    }
  }

  const handleSubmit = async () => {
    const valid = await form.validateFields()
    if (valid) {
      try {
        setDisabledbtn(true)
        const { tenantId, mstId, stgCode, processCode } = Tab
        const reqObj = [
          {
            enquiryId: enquiryid,
            tenantId,
            documentType: projDoc,
            uploadDocType: form.getFieldValue('documentType'),
            remarks: form.getFieldValue('remarks'),
            empId: employeID,
            referenceId: mstId,
            projectId: projectid !== undefined ? projectid : '',
            stageCode: stgCode,
            documentName: form.getFieldValue('documentName'),
            type,
            pmId: processCode,
          },
        ]
        const formData = new FormData()
        formData.append('addDocument', JSON.stringify({ reqObj }))
        // fileList.forEach(file => {
        formData.append(`file`, fileList)
        // })

        const response = await addDocumentdetail({
          requestData: formData,
        })

        if (response) {
          submit()
          formReset()
          setDisabledbtn(false)
          message.success(response.responseMessage)
        }
      } catch (error) {
        message.error(error)
        setDisabledbtn(false)
      }
    }
  }

  function formReset() {
    form.resetFields()
    setFileList(null)
    setDisabledbtn(false)
  }

  const FieldsComponent = () => {
    return (
      <Form form={form}>
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
              <p>Document Type</p>
              <Form.Item
                name="documentType"
                rules={[{ required: true, message: 'Please select Document Type!' }]}
              >
                <Select placeholder="Select Document Type">
                  {doctypedata.map(item => (
                    <Option key={item.fuCode} value={item.fuCode}>
                      {item.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
              <p>Document Name</p>
              <Form.Item
                name="documentName"
                rules={[{ required: true, message: 'Please enter Document Name!' }]}
              >
                <Input placeholder="Type Here..." />
              </Form.Item>
            </div>

            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
              <p>Upload File below 100MB</p>
              <Form.Item
                name="fileList"
                rules={[{ required: true, message: 'Please upload a file!' }]}
              >
                <Upload
                  beforeUpload={beforeUpload}
                  maxCount={5}
                  listType="text"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Files</Button>
                </Upload>
              </Form.Item>

              {fileList && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ margin: '0px 0px 5px 0px' }}>
                    <p style={{ margin: '0px' }}>
                      <b>Selected File :</b> {fileList.name}
                    </p>
                    <p style={{ margin: '0px', padding: '3px 6px' }}>
                      <b>File Size :</b> {(fileList.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row" style={{ marginTop: '15px' }}>
            {!Value ? (
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <p>Remarks</p>
                <Form.Item
                  name="remarks"
                  rules={[{ max: 2056, message: 'Maximum 2056 characters allowed' }]}
                >
                  <TextArea maxLength={2056} width="230px" maxRows="3" placeholder="Type Here..." />
                </Form.Item>
              </div>
            ) : null}
            {Value ? (
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <p>Value</p>
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      pattern: /^(?=.*[1-9])\d{0,13}(\.\d{1,2})?$/,
                      message: 'Maximum 13 digits allowed.',
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter a number"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>
            ) : null}
          </div>
        </div>
      </Form>
    )
  }

  const ButtonsComponent = () => {
    return (
      <div style={{ textAlign: 'center', marginTop: '25px', justifyContent: 'center' }}>
        <Buttons
          text="Submit"
          type="primary"
          disable={disablebtn}
          marginright="10px"
          onClick={handleSubmit}
        />
        <Buttons
          text="Cancel"
          type="primary"
          onClick={() => {
            formReset()
            handleCancel()
          }}
        />
      </div>
    )
  }

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      FieldsComponent={FieldsComponent}
      ButtonsComponent={ButtonsComponent}
      text="Upload Document"
      onCancel={() => {
        formReset()
        handleCancel()
      }}
    />
  )
}

export default AddNewDocument
