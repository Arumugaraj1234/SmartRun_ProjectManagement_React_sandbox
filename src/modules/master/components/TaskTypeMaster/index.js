import React, { useState, useEffect } from 'react'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import { Card, Table, Button, Input, Switch, Form, Select, message } from 'antd'
import messageReturn from '_helpers/messageReturn'

const TaskTypeMaster = () => {
  const tenantId = store.get('tenantId')
  // const employeeId = store.get('employeeId');
  const { Option } = Select

  const [tableData, setTableData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [departmentList, setDepartmentList] = useState([])
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
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

  const isEditing = record => record.key === editingKey

  const edit = record => {
    tableform.setFieldsValue({
      ttDesc: record.ttDesc,
      deptName: record.deptCode,
      isActive: false,
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = async () => {
    try {
      await tableform.validateFields()
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const save = async () => {
    try {
      const values = await tableform.validateFields()
      const newData = tableData.map(item =>
        item.key === editingKey ? { ...item, ...values } : item,
      )
      const ttcode = newData?.find(item => item.key === editingKey)?.ttCode
      const payload = {
        taskTypeCode: ttcode === 'Auto Generated' ? '' : ttcode,
        taskDesc: values.ttDesc,
        deptCode: values.deptName,
        isActive: values.isActive ? '1' : '0',
        tenantID: tenantId,
      }
      const response = await indentFileUpload({
        requestPath: 'insertTaskTypeMst',
        requestData: payload,
      })

      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        setEditingKey('')
        getTaskTypeMaster()
      }
      // setTableData(newData);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const departmentchange = record => {
    tableform.setFieldsValue({
      deptName: record.deptCode,
    })
  }
  const columns = [
    {
      title: 'Task Type Code',
      dataIndex: 'ttCode',
      key: 'ttCode',
      // render: (text, record) => {
      //   return isEditing(record) ? (
      //     <Form.Item
      //       name="ttCode"
      //       style={{ margin: 0 }}
      //       rules={[{ required: true, message: 'Please input the task type code!' }]}
      //     >
      //       <Input />
      //     </Form.Item>
      //   ) : (
      //     text
      //   );
      // },
    },
    {
      title: 'Task Type Description',
      dataIndex: 'ttDesc',
      key: 'ttDesc',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="ttDesc"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please input the task type description!' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Department',
      dataIndex: 'deptCode',
      key: 'deptCode',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="deptName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please select the department!' }]}
          >
            <Select
              style={{ width: '100%' }}
              onChange={departmentchange(record)}
              placeholder="Select Department"
            >
              {departmentList.map(item => (
                <Option key={item.key} value={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          record.deptName
        )
      },
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item name="isActive" valuePropName="checked" style={{ margin: 0 }}>
            <Switch />
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
      render: (text, record) => {
        return isEditing(record) ? (
          <span>
            <Button type="primary" onClick={save}>
              Save
            </Button>
            <Button onClick={cancel} style={{ marginLeft: 8 }}>
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

  const getTaskTypeMaster = async () => {
    const formvalues = form.getFieldsValue()
    if (formvalues.departmentcode) {
      try {
        const response = await indentFileUpload({
          requestPath: 'getAllTaskType',
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
            deptName: item.deptName,
            isActive: item.isActive,
            deptCode: item.deptCode,
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
    setEditingKey('')
    setCurrentPage(1)
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
      tableform.resetFields()
      setTableData([...tableData, newRow])
      setEditingKey(newRowKey)
      const lastPage = Math.ceil((tableData.length + 1) / pageSize)
      setCurrentPage(lastPage)
    } else {
      message.warning('Please complete the current edit before adding a new row.')
    }
  }

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Task Type Master">
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => {
              getTaskTypeMaster()
              setTableData([])
              setEditingKey('')
            }}
          >
            Get Details
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              addNewRow()
            }}
          >
            Add New Type
          </Button>
        </div>
        <Form form={tableform} component={false}>
          <Table
            columns={columns}
            dataSource={tableData}
            rowClassName="editable-row"
            pagination={{
              pageSizeOptions: ['3', '20', '30', '50'],
              showSizeChanger: true,
              defaultPageSize: pageSize,
              current: currentPage,
              onChange: page => setCurrentPage(page),
            }}
          />
        </Form>
      </Card>
    </div>
  )
}

export default TaskTypeMaster
