import React, { useState, useEffect } from 'react'
import store from 'store'
import {
  Card,
  Select,
  Form,
  Switch,
  message,
  Row,
  Divider,
  Button,
  Table,
  Space,
  Input,
} from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import { PlusSquareOutlined } from '@ant-design/icons'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import moment from 'moment'
import messageReturn from '_helpers/messageReturn'

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  if (dataIndex !== 'actName') {
    return <td {...restProps}>{children}</td>
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Enter the ${title}!`,
            },
            {
              type: 'string',
              pattern: /^(?!\s*$).+/,
              message: `${title} cannot contain only empty spaces!`,
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const TaskTemplateType = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [formDtl] = Form.useForm()
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const [isDisplay, setIsDisplay] = useState(false)
  const [departmentList, setDepartmentList] = useState([])
  const [TaskType, setTaskType] = useState([])
  const [TaskCategory, setTaskCategory] = useState([])
  const [TaskTemplate, setTaskTemplate] = useState([])
  const [isChecked, setIsChecked] = useState(true)
  const [isCheckedNew, setIsCheckedNew] = useState(false)
  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editingKey, setEditingKey] = useState('')
  const [TemplateName, setTemplateName] = useState(false)
  const pageSize = 10

  useEffect(() => {
    getDepartment()
    getTaskTypeDropdown()
  }, [])

  const getDepartment = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getDepartmentAndEmpInfo',
        requestData: {
          tenantId,
          isActive: '1',
          employeID: '',
        },
      })
      const options =
        response?.map(item => ({
          key: item.departmentCode,
          value: item.departmentName,
        })) || []
      setDepartmentList(options)
    } catch (error) {
      console.error('Error fetching department data:', error)
    }
  }

  const getTaskTypeDropdown = async () => {
    const formVal = form.getFieldsValue()
    try {
      const response = await indentFileUpload({
        requestPath: 'getTaskTypeDropDownIsActive',
        requestData: {
          tenantId,
          deptCode: formVal.departmentcode,
        },
      })
      const dataArray = response.responseData || []
      const data =
        dataArray?.map(item => ({
          key: item.ttCode,
          value: item.ttDesc,
        })) || []
      setTaskType(data)
    } catch (err) {
      console.error(err)
    }
  }

  const getTaskCategoryDropdown = async () => {
    const formVal = form.getFieldsValue()
    try {
      const response = await indentFileUpload({
        requestPath: 'getTaskCategorydrpDwn',
        requestData: {
          tenantId,
          ttCode: formVal.ttCode,
        },
      })
      const dataArray = response.responseData || []
      const data =
        dataArray?.map(item => ({
          key: item.tcCode,
          value: item.tcDesc,
        })) || []
      setTaskCategory(data)
    } catch (err) {
      console.error(err)
    }
  }

  const getTaskTemplateDropdown = async () => {
    const formVal = form.getFieldsValue()
    try {
      const response = await indentFileUpload({
        requestPath: 'getTaskTypeTemplatedrpDwn',
        requestData: {
          tenantId,
          ttCode: formVal.ttCode,
          tcCode: formVal.tcCode,
          deptCode: formVal.departmentcode,
        },
      })
      const dataArray = response.responseData || []
      const data =
        dataArray?.map(item => ({
          key: item.ttHdrId,
          value: item.tempName,
        })) || []
      setTaskTemplate(data)
      // setIsChecked(dataArray.isActive === '0')
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    const formData = form.getFieldsValue()
    if (
      formData.departmentcode !== '' &&
      formData.tcCode !== '' &&
      formData.ttCode !== '' &&
      formData.ttHdrId !== ''
    ) {
      setIsDisplay(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'getTaskTemplatedtl',
          requestData: {
            tenantId,
            ttHdrId: formData.ttHdrId,
            isActive: isChecked === true ? '1' : '0',
          },
        })
        if (
          response &&
          response.responseData &&
          response.responseData.length > 0 &&
          response.responseData
        ) {
          const mappedData = response.responseData.map((item, index) => ({
            key: index + 1,
            ttDtlId: item.ttDtlId,
            actName: item.actName,
            empName: item.empName,
            isActive: item.isActive,
            lastUpdatedOn: item.lastUpdatedOn,
            lastUpdatedBy: item.lastUpdatedBy,
          }))
          setTableData(mappedData)
          // setCurrentPage(1)
          setEditingKey('')
        } else {
          setTableData([])
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleChangeDepartment = () => {
    getTaskTypeDropdown()
  }

  const handleChangeType = () => {
    getTaskCategoryDropdown()
  }

  const handleChangeCategory = () => {
    getTaskTemplateDropdown()
  }

  const save = async record => {
    const formData = form.getFieldsValue()
    try {
      const updatedRow = await form.validateFields()
      const response = await indentFileUpload({
        requestPath: 'insertUpdateTemplate',
        requestData: {
          ttDtlId: record.ttDtlId === 'Auto-Generated' ? '' : record.ttDtlId,
          actName: updatedRow.actName,
          ttHdrId: formData.ttHdrId,
          empId,
          // ttCode:formData.TaskType,
          isActive: updatedRow.isActive ? '1' : '0',
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        handleSubmit()
        form.setFieldsValue({
          actName: '',
        })

        const newData = [...tableData]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], actName: updatedRow.actName }
          setTableData(newData)
          setEditingKey('')
          // setIsCheckedNew(false)
        }
      } else {
        message.error(response?.responseMessage)
      }
    } catch (errInfo) {
      console.error(errInfo)
    }
  }

  const handleSumbitPopup = async () => {
    const formData = formDtl.getFieldValue()
    const formVal = form.getFieldValue()
    if (
      formVal.departmentcode !== null &&
      formVal.tcCode !== null &&
      formVal.ttCode !== null &&
      formData.templateName !== null
    ) {
      const response = await indentFileUpload({
        requestPath: 'insertTemplateHdr',
        requestData: {
          actName: '',
          deptCode: formVal.departmentcode,
          empId,
          tcCode: formVal.tcCode,
          ttCode: formVal.ttCode,
          templateName: formData.templateName,
          isActive: '1',
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        formDtl.setFieldsValue({
          TemplateName: '',
        })
        const newData = [...TaskTemplate]
        const newTemplate = {
          key: response.newTemplateKey,
          value: formData.templateName,
        }
        newData.push(newTemplate)
        setTaskTemplate(newData)
        setTemplateName(false)
        formDtl.resetFields()
        handleChangeCategory()
      } else {
        message.error(response?.responseMessage)
      }
    }
  }
  const edit = record => {
    form.setFieldsValue({
      actName: record.actName,
    })
    setEditingKey(record.key)
    setIsCheckedNew(record.isActive === '1')
  }
  const cancel = record => {
    if (record.ttDtlId === 'Auto-Generated') {
      setTableData(tableData.slice(0, -1))
    }
    setEditingKey('')
    form.setFieldsValue({
      actName: '',
    })
  }
  const handleNewRow = () => {
    if (editingKey === '') {
      const newData = {
        key: `new-`,
        ttDtlId: 'Auto-Generated',
        tcDesc: '',
      }
      setTableData([...tableData, newData])
      setEditingKey(newData.key)
      setIsCheckedNew(false)
      const totalPages = Math.ceil((tableData.length + 1) / pageSize)
      setCurrentPage(totalPages)
    } else {
      message.warning('Save or cancel the current add before adding.')
    }
  }
  const handleClear = () => {
    form.resetFields()
    setIsDisplay(false)
    setTaskType([])
    setTaskCategory([])
    setTaskTemplate([])
    setIsChecked(true)
  }

  const handleCancel = () => {
    formDtl.resetFields()
  }
  const isEditing = record => record.key === editingKey
  const column = [
    {
      title: 'Activity Detail',
      dataIndex: 'actName',
      key: 'actName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Last Updated By',
      dataIndex: 'empName',
      key: 'empName',
      width: '15%',
      editable: false,
    },
    {
      title: 'Last Updated On',
      dataIndex: 'lastUpdatedOn',
      key: 'lastUpdatedOn',
      width: '15%',
      editable: false,
      render: (_, record) => {
        if (record.key !== 'new-') {
          return moment(record.lastUpdatedOn).format('DD-MMM-YYYY HH:mm')
        }
        return ''
      },
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item name="isActive" style={{ margin: 0 }}>
            <Switch checked={isCheckedNew} onChange={setIsCheckedNew} />
          </Form.Item>
        ) : text === '1' ? (
          'Yes'
        ) : (
          'No'
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record)}>
              Save
            </Button>
            <Button onClick={() => cancel(record)}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              disabled={editingKey !== '' && editingKey !== record.key}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = column.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'tcDesc' ? 'text' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const AddTemplate = () => {
    return (
      <div>
        <Form form={formDtl}>
          <div>
            <Form.Item
              name="templateName"
              // labelCol={{ span: 7 }}
              // wrapperCol={{ span: 18 }}
              labelAlign="left"
              label={
                <span>
                  Template Name<span style={{ color: 'red' }}>*</span>{' '}
                </span>
              }
            >
              <Input type="text" placeholder="Enter the Template Name" style={{ width: '50%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent
              type="primary"
              text="Submit"
              marginright="10px"
              onClick={handleSumbitPopup}
            />
            <ButtonComponent type="primary" text="Clear" onClick={handleCancel} />
          </div>
        </Form>
      </div>
    )
  }
  return (
    <div>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Task Template">
        <Form form={form}>
          <div className="row form_datas">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Form.Item
                name="departmentcode"
                label={
                  <span>
                    Department<span style={{ color: 'red' }}>*&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Department"
                  onChange={(_, option) => handleChangeDepartment(option)}
                >
                  {departmentList.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Form.Item
                name="ttCode"
                label={
                  <span>
                    Task Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Task Type"
                  style={{ width: '100%' }}
                  onChange={(_, option) => handleChangeType(option)}
                >
                  {TaskType.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Form.Item
                name="tcCode"
                label={
                  <span>
                    Task Category<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Task Category"
                  style={{ width: '100%' }}
                  onChange={(_, option) => handleChangeCategory(option)}
                >
                  {TaskCategory.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Form.Item
                  name="ttHdrId"
                  label={
                    <span>
                      Task Template<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                  style={{ margin: 0, flex: 1 }}
                >
                  <Select placeholder="Select Task Template" style={{ width: '100%' }}>
                    {TaskTemplate.map(item => (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <PlusSquareOutlined
                  onClick={() => {
                    setTemplateName(true)
                  }}
                  style={{ marginLeft: '2px' }}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
              <Form.Item
                name="isActive"
                style={{ margin: 0 }}
                label={
                  <span>
                    Is Active<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Switch checked={isChecked} onChange={setIsChecked} />
              </Form.Item>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent
              type="primary"
              text="Get Details"
              marginright="10px"
              onClick={handleSubmit}
            />
            <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
          </div>
          <div style={{ display: isDisplay ? 'block' : 'none' }}>
            <Row>
              <Divider orientation="left">Task Template Details</Divider>
            </Row>
            <div style={{ textAlign: 'right', paddingBottom: '20px' }}>
              <Button type="primary" onClick={() => handleNewRow()}>
                Add New Template
              </Button>
            </div>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={tableData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [tableData?.length]],
                showSizeChanger: true,
                defaultPageSize: pageSize,
                current: currentPage,
                onChange: setCurrentPage,
              }}
            />
            {TemplateName ? (
              <ModalPopup
                text="Create New Template"
                FieldsComponent={AddTemplate}
                isModalVisible="setTemplateName"
                width={650}
                onCancel={() => {
                  setTemplateName(false)
                  formDtl.resetFields()
                }}
              />
            ) : null}
          </div>
        </Form>
      </Card>
    </div>
  )
}
export default TaskTemplateType
