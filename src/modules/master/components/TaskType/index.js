import React, { useState, useEffect } from 'react'
import store from 'store'
import { Card, Form, Select, Button, Table, message, Row, Divider, Input, Switch } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'

const TaskType = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()
  const tenantId = store.get('tenantId')
  const [isDisplay, setIsDisplay] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [departmentList, setDepartmentList] = useState([])
  const [tableData, setTableData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const pageSize = 10

  useEffect(() => {
    getDepartment()
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

  const getTaskTypeMaster = async () => {
    const formvalues = form.getFieldsValue()
    setIsDisplay(true)
    if (formvalues.departmentcode) {
      try {
        const response = await indentFileUpload({
          requestPath: 'getTasktypeDtls',
          requestData: {
            tenantId,
            deptCode: formvalues.departmentcode,
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
            ttCode: item.ttCode,
            ttDesc: item.ttDesc,
            isActive: item.isActive,
          }))
          setTableData(mappedData)
          setCurrentPage(1)
        } else {
          setTableData([])
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      messageReturn(637)
    }
  }

  const handleClear = () => {
    tableform.resetFields()
    form.resetFields()
    setTableData([])
    setIsDisplay(false)
    setEditingKey('')
    setCurrentPage(1)
  }

  const edit = record => {
    tableform.setFieldsValue({
      ttdesc: record.ttDesc,
      isActive: record.isActive === '1',
      ...record,
    })
    setEditingKey(record.key)
    setIsChecked(record.isActive === '1')
  }

  const cancel = record => {
    try {
      if (record.ttCode === 'Auto Generated') {
        const newData = tableData.slice(0, -1)
        setTableData(newData)
      } else {
        tableform.validateFields()
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const save = async () => {
    const formData = form.getFieldValue()
    try {
      const values = await tableform.validateFields()
      const newData = tableData.map(item =>
        item.key === editingKey ? { ...item, ...values } : item,
      )
      const ttcode = newData?.find(item => item.key === editingKey)?.ttCode
      const payload = {
        ttcode: ttcode === 'Auto Generated' ? '' : ttcode,
        ttdesc: values.ttDesc,
        deptCode: formData.departmentcode,
        isActive: values.isActive ? '1' : '0',
        tenantId,
      }
      const response = await indentFileUpload({
        requestPath: 'insertUpdateTaskType',
        requestData: payload,
      })
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        setEditingKey('')
        getTaskTypeMaster()
      }
      setTableData(newData)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const addNewRow = () => {
    if (editingKey === '') {
      const newRowKey =
        (tableData.length ? parseInt(tableData[tableData.length - 1].key, 10) : 0) + 1
      const newRow = {
        key: newRowKey,
        ttCode: 'Auto Generated',
        ttDesc: '',
        deptName: '',
        isActive: false,
      }
      setIsChecked(false)
      tableform.resetFields()
      setTableData([...tableData, newRow])
      setEditingKey(newRowKey)
      const lastPage = Math.ceil((tableData.length + 1) / pageSize)
      setCurrentPage(lastPage)
    } else {
      message.warning('Complete the current edit before adding a new row.')
    }
  }

  const isEditing = record => record.key === editingKey
  const columns = [
    {
      title: 'Task Type',
      dataIndex: 'ttDesc',
      key: 'ttDesc',
      width: '60%',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="ttDesc"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Enter the Task Type Description!`,
              },
              {
                type: 'string',
                pattern: /^(?!\s*$).+/,
                message: `Task Type Description cannot contain only empty spaces!`,
              },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
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
      width: '20%',
      render: (_, record) => {
        return isEditing(record) ? (
          <span>
            <Button type="primary" onClick={save}>
              Save
            </Button>
            <Button onClick={() => cancel(record)} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button type="primary" onClick={() => edit(record)}>
            Edit
          </Button>
        )
      },
    },
  ]

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Task Type">
        <div>
          <Form form={form}>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <Form.Item
                name="departmentcode"
                label={
                  <span>
                    Department<span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Department">
                  {departmentList.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '10px' }}
          >
            <Button
              type="primary"
              onClick={() => {
                getTaskTypeMaster()
                setEditingKey('')
              }}
            >
              Get Details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <Form form={tableform} component={false}>
            <div style={{ marginTop: '40px', display: isDisplay ? 'block' : 'none' }}>
              <div>
                <Row>
                  <Divider orientation="left">Task Type Details</Divider>
                </Row>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      addNewRow()
                    }}
                  >
                    Add Task Type
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  rowClassName="editable-row"
                  pagination={{
                    pageSizeOptions: ['10', '20', '30', '50', [tableData?.length]],
                    showSizeChanger: true,
                    defaultPageSize: pageSize,
                    current: currentPage,
                    onChange: setCurrentPage,
                  }}
                />
              </div>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  )
}
export default TaskType
