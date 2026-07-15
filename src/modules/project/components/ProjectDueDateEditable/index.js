import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Button, DatePicker, Form, Input, message, Table } from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const { TextArea } = Input
const DueDateButtonClick = ({ onClose, showPopUpModal }) => {
  const history = useHistory()
  const [form] = Form.useForm()
  const ProjectID = store.get('ProjectID')
  const tenantid = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [dueDateEditFields, setDueDateEditFields] = useState([])

  useEffect(() => {
    getPopUpVaules()
  }, [])

  const getPopUpVaules = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: ProjectID,
    }
    const response = await indentFileUpload({
      requestPath: 'getProjectDueDates',
      requestData: keyareaobj,
    })
    if (response) {
      setDueDateEditFields(response?.responseData)
    }
  }

  const updateRequest = async () => {
    const formData = form.getFieldsValue()
    if (formData.dueDate !== undefined && formData.enteredReason !== undefined) {
      if (Number(formData.enteredReason.length) < 2055) {
        const response = await indentFileUpload({
          requestPath: 'UpdateProjectDueDate',
          requestData: {
            pmHdrId: ProjectID,
            tenantId: tenantid,
            dueDate: moment(formData.dueDate).format('YYYY-MM-DD'),
            reason: formData.enteredReason, // moment(formData.ToDate).format('YYYY-MM-DD'),
            empId: employeeId,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            message.success(response.responseMessage)
            handleclose()
            //  window.location.reload();
            history.push('/project')
          } else {
            message.error(response.responseMessage)
          }
        }
      } else {
        messageReturn(639)
      }
    } else {
      messageReturn(405)
    }
  }

  const columns = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'age',
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
    },
  ]

  const handleclose = () => {
    onClose()
  }

  const DetailsTableComponent = () => {
    return (
      <div>
        <div className="row">
          <div className="form_indent">
            <Form form={form} layout="vertical" labelAlign="left">
              <div className="row form_datas">
                <div className="col-md-6">
                  <Form.Item
                    name="dueDate"
                    label={
                      <span>
                        Due Date<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <DatePicker format="DD-MMM-YYYY" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name="enteredReason"
                    label={
                      <span>
                        Reason<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <TextArea type="text" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-12"
            style={{
              textAlign: 'center',
              marginTop: '5px',
              marginBottom: '5px',
              justifyContent: 'center',
              display: 'flex',
              gap: '12px',
            }}
          >
            <Button type="primary" onClick={updateRequest}>
              Update
            </Button>
            <Button type="primary" onClick={handleclose}>
              Cancel
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <Table dataSource={dueDateEditFields} columns={columns} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ModalPopup
        isModalVisible={showPopUpModal}
        onCancel={onClose}
        text="Update Due Date Details"
        FieldsComponent={DetailsTableComponent}
        width="90%"
      />
    </div>
  )
}
export default DueDateButtonClick
