import React, { useState, useEffect } from 'react'
import store from 'store'
import { Card, Table, Form, Space, message, Popconfirm, Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

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
  if (dataIndex !== 'taskGroupName') {
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

const TimeSheetTask = () => {
  const [form] = Form.useForm()
  const [inputForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const [TaskTable, setTaskTable] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [taskdtl, setTaskdtl] = useState([])
  const [ModalVisible, setModalVisible] = useState(false)
  const [newTaskvisible, setNewTaskvisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  const newInputData = {
    defaultTaskDtl: '',
    tenantId,
  }
  useEffect(() => {
    getTimeSheetTaskHdr()
    handleAddTask()
    setData([newInputData])
  }, [newTaskvisible])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call to set width on component mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const reqdata = {
    tenantId,
  }

  const getTimeSheetTaskHdr = async () => {
    const response = await IndentGroupgetDetails({
      requestPath: 'getAllTimeSheetTaskForHdr',
      requestData: reqdata,
    })
    if (response?.responseCode === '200') {
      setTaskTable(
        response?.responseData.map((item, index) => ({ ...item, key: index.toString() })),
      )
    } else {
      message.error(response?.responseMessage)
      setTaskTable([])
    }
  }

  const getDtlCard = async record => {
    const response = await IndentGroupgetDetails({
      requestPath: 'getTimeSheetTaskForHdrandDtl',
      requestData: {
        tdId: record.tdId,
        tenantId,
      },
    })
    if (response?.responseCode === '200') {
      setTaskdtl(response?.responseData.map((item, index) => ({ ...item, key: index.toString() })))
      setModalVisible(true)
    } else {
      setTaskdtl(false)
    }
  }

  const save = async record => {
    try {
      const updatedRow = await form.validateFields()
      const response = await indentFileUpload({
        requestPath: 'updateTimeSheetTaskHdrGroupName',
        requestData: {
          tdId: record.tdId,
          taskGroupName: updatedRow.taskGroupName,
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        form.resetFields()
        getTimeSheetTaskHdr()
      } else {
        message.error(response?.responseMessage)
      }
      const newData = [...TaskTable]
      const index = newData.findIndex(item => record.key === item.key)

      if (index > -1) {
        newData[index] = { ...newData[index], taskGroupName: updatedRow.taskGroupName }
        setTaskTable(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      message.error(errInfo)
    }
  }

  const saveDtl = async record => {
    try {
      const updatedRow = await form.validateFields()
      if (record.key === 'new-') {
        const response = await indentFileUpload({
          requestPath: 'insertIndividualTimeSheetTaskDtl',
          requestData: {
            defaultTaskDtl: updatedRow.defaulTaskDtl,
            tdId: record.tdId,
            tenantId,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          form.resetFields()
          getDtlCard(record)
        } else {
          message.error(response?.responseMessage)
        }
        const newData = [...taskdtl]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], defaulTaskDtl: updatedRow.defaulTaskDtl }
          setTaskdtl(newData)
          setEditingKey('')
        }
      } else {
        const response = await indentFileUpload({
          requestPath: 'updateTimeSheetTask',
          requestData: {
            tdDtlId: record.tdDtlId,
            defaultTaskDtl: updatedRow.defaulTaskDtl,
            updatedBy: empId,
            tenantId,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          form.resetFields()
          getDtlCard(record)
          setEditingKey('')
        } else {
          message.error(response?.responseMessage)
        }
        const newData = [...taskdtl]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], defaulTaskDtl: updatedRow.defaulTaskDtl }
          setTaskdtl(newData)
          setEditingKey('')
        }
      }
    } catch (errInfo) {
      message.error(errInfo)
    }
  }

  const Delete = async record => {
    try {
      const updatedRow = await form.validateFields()
      const response = await indentFileUpload({
        requestPath: 'deleteTimeSheetTaskDtl',
        requestData: {
          tdDtlId: record.tdDtlId,
          tdId: record.tdId,
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        form.resetFields()
        getDtlCard(record)
        getTimeSheetTaskHdr()
        setEditingKey('')
      } else {
        message.error(response?.responseMessage)
      }
      const newData = [...taskdtl]
      const index = newData.findIndex(item => record.key === item.key)

      if (index > -1) {
        newData[index] = { ...newData[index], defaulTaskDtl: updatedRow.defaulTaskDtl }
        setTaskdtl(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      message.error(errInfo)
    }
  }

  const edit = record => {
    form.setFieldsValue({
      taskGroupName: record.taskGroupName,
      defaulTaskDtl: record.defaulTaskDtl,
    })
    setEditingKey(record.key)
  }

  const cancelDtlCard = () => {
    setModalVisible(false)
    setNewTaskvisible(false)
    setEditingKey('')
    form.resetFields()
    inputForm.resetFields()
    setData('')
  }

  const cancel = record => {
    if (record.key === 'new-') {
      const newData = taskdtl.slice(0, -1)
      setTaskdtl(newData)
      setEditingKey('')
      form.resetFields()
    } else {
      setEditingKey('')
      setNewTaskvisible(false)
      form.resetFields()
    }
  }

  const isEditing = record => record.key === editingKey

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'taskGroupName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdEmpName',
      width: '17%',
      editable: false,
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      width: '13%',
      editable: false,
      render: (text, record) => moment(record.createdOn).format('DD-MMM-YYYY HH:mm'),
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedEmpName',
      width: '17%',
      editable: false,
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      width: '13%',
      editable: false,
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
    {
      title: 'Action',
      key: 'action',
      width: '18%',
      render: (_, record, index) => {
        const editable = isEditing(record)

        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record)}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
              <Button>Cancel</Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              disabled={editingKey !== '' && editingKey !== record.key}
              onClick={() => getDtlCard(record, index)}
            >
              Details
            </Button>
            <Button
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
  const mergedColumns = columns.map(col => ({
    ...col,
    onCell: record => ({
      record,
      inputType: col.dataIndex === 'taskGroupName' ? 'text' : '',
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record),
    }),
  }))

  const handleNewTaskDtl = index => {
    const newData = [...data]
    if (newData[index].defaultTaskDtl !== '') {
      setData([...data, newInputData])
      inputForm.resetFields()
    }
  }

  const handleAddTask = () => {
    const insertTask = async () => {
      const formData = form.getFieldValue()
      const newData = data
      if (
        formData.GroupTaskName !== '' &&
        formData.GroupTaskName !== undefined &&
        newData.every(item => item.defaultTaskDtl !== undefined && item.defaultTaskDtl !== '')
      ) {
        const response = await indentFileUpload({
          requestPath: 'insertTimeSheetTask',
          requestData: {
            taskGroupName: formData.GroupTaskName,
            createdBy: empId,
            updatedBy: empId,
            tenantId,
            timeSheetDtl: newData,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          form.resetFields()
          getTimeSheetTaskHdr()
          const totalPages = Math.ceil((taskdtl.length + 1) / 10)
          setCurrentPage(totalPages)
        } else {
          message.error(response?.responseMessage)
        }
        form.resetFields()
        inputForm.resetFields()
        setNewTaskvisible(false)
        setData([])
        setEditingKey('')
      } else {
        message.warning('Missing Group Name or Default Task')
        setNewTaskvisible(true)
      }
    }

    const handleInputChange = (index, e) => {
      const newArr = [...data]
      index.defaultTaskDtl = e.target.value
      setData(newArr)
    }
    const RemoveRow = indexToRemove => {
      setData(prevData => prevData.filter((_, index) => index !== indexToRemove))
    }

    const cancelCard = () => {
      setNewTaskvisible(false)
      form.resetFields()
      inputForm.resetFields()
    }

    const AddColumns = [
      {
        title: 'Default Tasks',
        dataIndex: 'defaultTaskDtl',
        key: 'defaultTaskDtl',
        width: '30%',
        render: (text, record, index) =>
          index === data.length - 1 ? (
            <Form form={inputForm}>
              <Form.Item name="inputfield">
                <Input
                  style={{ width: '800px' }}
                  value={text}
                  name={`inputfield${index}`}
                  onBlur={event => handleInputChange(record, event)}
                />
              </Form.Item>
            </Form>
          ) : (
            text
          ),
      },
      {
        title: 'Action',
        dataIndex: 'add',
        key: 'add',
        width: '20%',
        render: (_, record, index) => (
          <Space>
            {index === data.length - 1 && <AddIconButton onClick={() => handleNewTaskDtl(index)} />}
            {index !== data.length - 1 && <RemoveIcon onClick={() => RemoveRow(index)} />}
          </Space>
        ),
      },
    ]

    return (
      <div>
        <Form form={form}>
          <Form.Item
            name="GroupTaskName"
            labelAlign="left"
            label={
              <span>
                Group Task<span style={{ color: 'red' }}>*</span>{' '}
              </span>
            }
          >
            <Input type="text" style={{ width: '500px' }} />
          </Form.Item>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={AddColumns}
            rowClassName="editable-row"
            pagination={false}
          />
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={() => insertTask()}>
              Submit
            </Button>
            <Button type="primary" onClick={() => cancelCard()}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  const ShowDtl = () => {
    const EditableDtlCell = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    }) => {
      if (dataIndex !== 'defaulTaskDtl') {
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

    const DtlCol = [
      {
        title: 'Default Tasks',
        dataIndex: 'defaulTaskDtl',
        // width: '30%',
        editable: true,
      },
      {
        title: 'Action',
        key: 'action',
        width: '23%',
        render: (_, record) => {
          const editable = isEditing(record)

          return editable ? (
            <Space>
              <Button type="primary" onClick={() => saveDtl(record)}>
                Save
              </Button>
              <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
                <Button>Cancel</Button>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Button
                disabled={editingKey !== '' && editingKey !== record.key}
                onClick={() => edit(record)}
              >
                Edit
              </Button>
              <Popconfirm title="Sure to delete?" onConfirm={() => Delete(record)}>
                <Button type="primary" disabled={editingKey !== '' && editingKey !== record.key}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          )
        },
      },
    ]
    const mergedDtlColumns = DtlCol.map(col => ({
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'defaulTaskDtl' ? 'text' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }))

    const AddTaskDtl = () => {
      if (editingKey === '') {
        const newData = {
          key: `new-`,
          tdId: taskdtl[0].tdId,
          defaultTaskDtl: '',
        }
        setTaskdtl([...taskdtl, newData])
        setEditingKey(newData.key)
      } else {
        message.warning('Save or cancel the current add task before adding a new Task.')
      }
    }

    return (
      <div>
        <Form form={form}>
          <Table
            components={{
              body: {
                cell: EditableDtlCell,
              },
            }}
            bordered
            dataSource={taskdtl}
            columns={mergedDtlColumns}
            rowClassName="editable-row"
            pagination={false}
          />
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={() => AddTaskDtl()}>
              Add Task
            </Button>
            <Button type="primary" onClick={() => cancelDtlCard()}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  return (
    <div style={isMobile ? { width: tableWidth } : { marginTop: '20px' }}>
      <Card
        style={{ width: '100%' }}
        title="Timesheet Task"
        extra={
          <ButtonComponent
            text="New Task"
            type="primary"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => {
              setNewTaskvisible(true)
            }}
          />
        }
      >
        <Form form={form}>
          {TaskTable && TaskTable.length > 0 && (
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={TaskTable}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                current: currentPage,
                onChange: setCurrentPage,
                total: TaskTable.length,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', [TaskTable?.length]],
              }}
            />
          )}
        </Form>
        {taskdtl ? (
          <ModalPopup
            text={`Task Group Details - ${taskdtl.length > 0 ? taskdtl[0].taskGroupName : ''}`}
            FieldsComponent={ShowDtl}
            isModalVisible={ModalVisible}
            width="900"
            onCancel={() => {
              cancelDtlCard()
            }}
          />
        ) : null}
        {newTaskvisible ? (
          <ModalPopup
            text="New Task"
            FieldsComponent={handleAddTask}
            isModalVisible={newTaskvisible}
            width="900"
            onCancel={() => {
              cancelDtlCard()
            }}
          />
        ) : null}
      </Card>
    </div>
  )
}
export default TimeSheetTask
