import React, { useEffect, useState } from 'react'
import {
  Card,
  Select,
  Form,
  Row,
  Divider,
  message,
  Button,
  Space,
  Table,
  Input,
  Switch,
} from 'antd'
import store from 'store'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const TaskCategory = () => {
  const [isDisplay, setIsDisplay] = useState(false)
  const [form] = Form.useForm()
  const { Option } = Select
  const [TaskTypeDropDown, setTaskTypeDropDown] = useState([])
  const tenantId = store.get('tenantId')
  const [taskCatTable, settaskCatTable] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [editingKey, setEditingKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const pageSize = 10

  useEffect(() => {
    getTaskTypeDropdown()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
    if (dataIndex !== 'tcDesc') {
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

  const getTaskTypeDropdown = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getTaskTypeDropDownIsActive',
        requestData: {
          tenantId,
          deptCode: 'getall',
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setTaskTypeDropDown(response.responseData)
          } else {
            setTaskTypeDropDown([])
          }
        } else {
          setTaskTypeDropDown([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async () => {
    // setIsDisplay(true)
    const formVal = form.getFieldsValue()
    if (formVal.TaskType !== undefined) {
      setIsDisplay(true)

      try {
        const response = await indentFileUpload({
          requestPath: 'getTaskCategory',
          requestData: {
            ttCode: formVal.TaskType,
            tenantId,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            if (response.responseData !== null && response.responseData.length > 0) {
              settaskCatTable(
                response?.responseData.map((item, index) => ({ ...item, key: index.toString() })),
              )
              //  setisShowAdd(response.responseData.length - 1)
              // console.log(response.responseData.length);
            } else {
              settaskCatTable([])
            }
            setEditingKey('')
          } else {
            settaskCatTable([])
          }
        }
      } catch (err) {
        console.log(err + 6)
      }
    } else {
      messageReturn(405)
    }
  }
  const handleClear = () => {
    setIsDisplay(false)
    setEditingKey('')
    settaskCatTable([])
    form.resetFields()
  }

  const save = async record => {
    const formData = form.getFieldsValue()
    try {
      const updatedRow = await form.validateFields()
      const response = await indentFileUpload({
        requestPath: 'insertandupdatetaskCat',
        requestData: {
          tcCode: record.tcCode === 'Auto-Generated' ? '' : record.tcCode,
          tcDesc: updatedRow.tcDesc,
          ttCode: formData.TaskType,
          isActive: updatedRow.isActive ? '1' : '0',
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        handleSubmit()
        form.setFieldsValue({
          tcDesc: '',
        })

        const newData = [...taskCatTable]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], tcDesc: updatedRow.tcDesc }
          settaskCatTable(newData)
          setEditingKey('')
        }
      } else {
        message.error(response?.responseMessage)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const cancel = record => {
    if (record.tcCode === 'Auto-Generated') {
      settaskCatTable(taskCatTable.slice(0, -1))
    }
    setEditingKey('')
    form.setFieldsValue({
      tcDesc: '',
    })
  }

  const edit = record => {
    form.setFieldsValue({
      tcDesc: record.tcDesc,
    })
    setIsChecked(record.isActive === '1')
    setEditingKey(record.key)
  }

  const handleNewRow = () => {
    if (editingKey === '') {
      const newData = {
        key: `new-`,
        tcCode: 'Auto-Generated',
        tcDesc: '',
      }
      settaskCatTable([...taskCatTable, newData])
      setEditingKey(newData.key)
      setIsChecked(false)
      const totalPages = Math.ceil((taskCatTable.length + 1) / pageSize)
      setCurrentPage(totalPages)
    } else {
      message.warning('Save or cancel the current add before adding.')
    }
  }

  const isEditing = record => record.key === editingKey

  const column = [
    {
      title: 'Task Category',
      dataIndex: 'tcDesc',
      key: 'tcDesc',
      width: '70%',
      editable: true,
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item name="isActive" style={{ margin: 0 }}>
            <Switch checked={isChecked} onChange={setIsChecked} />
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
      width: '15%',
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
            {/* {Number(record.key) === isShowAdd ? (
              <Button
                // type="primary"
                disabled={editingKey !== '' && editingKey !== record.key}
                onClick={() => handleNewRow(index)}
              >
                Add
              </Button>
            ) : null} */}
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

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card title="Task Category">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="TaskType"
                label={
                  <span>
                    Task Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Task Type"
                  style={{ width: '100%' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  {TaskTypeDropDown &&
                    TaskTypeDropDown.map(item => (
                      <Option key={item.ttCode} value={item.ttCode}>
                        {item.ttDesc}
                      </Option>
                    ))}
                </Select>
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
              <Divider orientation="left">Task Category Details</Divider>
            </Row>
            <div style={{ textAlign: 'right', paddingBottom: '20px' }}>
              <Button
                type="primary"
                // style={{paddingTop:'20px'}}
                onClick={() => handleNewRow()}
              >
                Add New Config
              </Button>
            </div>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={taskCatTable}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [taskCatTable?.length]],
                showSizeChanger: true,
                defaultPageSize: pageSize,
                current: currentPage,
                onChange: setCurrentPage,
              }}
            />
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default TaskCategory
