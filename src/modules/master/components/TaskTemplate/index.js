import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Input, Form, Select, message, Switch } from 'antd'
import store from 'store'
import moment from 'moment'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import DetailTaskTemplate from './DetailTaskTemplate'

const TaskTemplate = () => {
  const tenantId = store.get('tenantId')
  const empid = store.get('employeeId')
  const { Option } = Select
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()

  const [taskList, setTaskList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [tableData, setTableData] = useState([])
  const [department, setDepartment] = useState([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [editingKey, setEditingKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [taskTypeCode, setTaskTypeCode] = useState([])
  const [taskCateCode, setTaskCateCode] = useState([])
  const [isDisplay, setIsDisplay] = useState(false)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const pageSize = 10

  useEffect(() => {
    getTaskType()
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

  const getTaskType = async () => {
    const response = await indentFileUpload({
      requestPath: 'getAllTaskType',
      requestData: {
        tenantId,
        deptCode: 'getAll',
      },
    })
    if (response) {
      setTaskList(response?.responseData)
    }
  }
  const getDepartment = async () => {
    const response = await indentFileUpload({
      requestPath: 'getDepartmentAndEmpInfo',
      requestData: {
        tenantId,
        isActive: '1',
        employeID: '',
      },
    })
    if (response && response.length > 0) {
      setDepartment(response)
    }
  }

  const getTaskTypeCode = async e => {
    const response = await indentFileUpload({
      requestPath: 'getAllTaskType',
      requestData: {
        tenantId,
        deptCode: e,
      },
    })
    if (response) {
      setTaskTypeCode(response?.responseData)
    }
  }

  const getCategoryCode = async e => {
    const response = await indentFileUpload({
      requestPath: 'getTaskCategoryByTypeCode',
      requestData: {
        tenantId,
        typeCode: e,
      },
    })
    if (response) {
      setTaskCateCode(response?.responseData)
    }
  }

  const getCategoryList = async () => {
    const formvalues = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getTaskCategoryByTypeCode',
      requestData: {
        tenantId,
        typeCode: formvalues.taskType,
      },
    })
    if (response) {
      setCategoryList(response?.responseData)
    }
  }

  const getTemplateDetails = async () => {
    setEditingKey('')
    const formvalues = form.getFieldsValue()
    if (formvalues.taskType && formvalues.taskCategory) {
      setIsDisplay(true)
      const response = await indentFileUpload({
        requestPath: 'getTasKTemplateHdr',
        requestData: {
          tenantId,
          ttCode: formvalues.taskType,
          tcCode: formvalues.taskCategory,
        },
      })
      if (response && response.responseData && response.responseData.length > 0) {
        const modifyData = response.responseData.map((data1, index) => ({
          key: index + 1,
          ...data1,
        }))

        setTableData(modifyData)
        setCurrentPage(1)
      } else {
        setTableData([])
      }
    } else {
      messageReturn(405)
    }
  }

  const getDetails = async record => {
    setSelectedData(record)
    setDetailModalVisible(!detailModalVisible)
  }

  const handleClear = () => {
    form.resetFields()
    setCategoryList([])
    setIsDisplay(false)
    setTableData([])
  }

  const save = async () => {
    try {
      const values = await tableform.validateFields()
      const newData = tableData.filter(item => item.key === editingKey)

      let obj = {
        ttHdrId: '',
        ttName: '',
        ttCreatedBy: '',
        ttCreatedOn: '',
        ttDepartmentCode: '',
        taskTypeCode: '',
        taskCategoryCode: '',
        isActive: '',
        lastUpdatedBy: '',
        tenantId: '',
        taskTemplateDtlList: [],
      }
      if (newData?.length > 0) {
        if (newData[0].ttHdrId === 'Auto Generated') {
          // insert
          newData.forEach(() => {
            obj = {
              ...obj,
              ttHdrId: '',
              ttName: values.ttName,
              ttCreatedBy: empid,
              ttCreatedOn: moment().format('YYYY-MM-DD'),
              ttDepartmentCode: values.ttDepartmentCode,
              taskTypeCode: values.taskTypeCode,
              taskCategoryCode: values.taskCategoryCode,
              isActive:
                values.isActive === undefined ? '0' : values.isActive === 'true' ? '1' : '0',
              lastUpdatedBy: empid,
              tenantId,
              taskTemplateDtlList: [],
            }
          })
        } else {
          newData.forEach(item => {
            const [date] = item.ttCreatedOn.split(' ')
            obj = {
              ...obj,
              ttHdrId: item.ttHdrId,
              ttName: values.ttName,
              ttCreatedBy: item.ttCreatedBy,
              ttCreatedOn: date,
              ttDepartmentCode: item.ttDepartmentCode,
              taskTypeCode: item.taskTypeCode,
              taskCategoryCode: item.taskCategoryCode,
              isActive: values.isActive === false ? '0' : '1',
              lastUpdatedBy: empid,
              tenantId,
              taskTemplateDtlList: [],
            }
          })
        }
      }
      const response = await indentFileUpload({
        requestPath: 'updateTaskTemplate',
        requestData: obj,
      })

      if (response) {
        if (response.responseCode === '200') {
          message.success(response.responseMessage)
          setEditingKey('')
          getTemplateDetails()
        } else {
          message.error(response.responseMessage)
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const cancel = async () => {
    try {
      await tableform.validateFields()
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const closepopup = () => {
    setDetailModalVisible(!detailModalVisible)
  }
  const edit = record => {
    tableform.setFieldsValue({
      ttName: record.ttName,
      ttDepartmentCode: record.ttDepartmentCode,
      taskTypeCode: record.taskTypeCode,
      taskCategoryCode: record.taskCategoryCode,
    })
    setEditingKey(record.key)
  }

  const addNewRow = () => {
    if (editingKey === '') {
      const newRowKey =
        (tableData.length ? parseInt(tableData[tableData.length - 1].key, 10) : 0) + 1
      const newRow = {
        key: newRowKey,
        ttHdrId: 'Auto Generated',
        ttName: '',
        // ttCreatedBy: '',
        // ttCreatedOn: '',
        isActive: false,
        isNew: true,
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

  const isEditing = record => record.key === editingKey

  const columns = [
    {
      title: 'Task Template Name',
      dataIndex: 'ttName',
      key: 'ttName',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="ttName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please input the task template name!' }]}
          >
            <Input placeholder="Task Template Name" />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Created by',
      dataIndex: 'ttCreatedByDesc',
      key: 'ttCreatedByDesc',
    },
    {
      title: 'Created On',
      dataIndex: 'ttCreatedOn',
      key: 'ttCreatedOn',
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Department',
      dataIndex: 'ttDepartmentCode',
      key: 'ttDepartmentCode',
      render: (text, record) => {
        const handleDepartmentChange = value => {
          getTaskTypeCode(value)
        }
        return isEditing(record) && record.isNew ? (
          <Form.Item
            name="ttDepartmentCode"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please Select the Department' }]}
          >
            <Select
              style={{ width: 160 }}
              placeholder="Select Department"
              onChange={handleDepartmentChange}
              value={record.ttDepartmentCode}
            >
              {department &&
                department.map(dept => (
                  <Option key={dept.departmentCode} value={dept.departmentCode}>
                    {dept.departmentName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        ) : (
          record.departMentDesc
        )
      },
    },
    {
      title: 'Type',
      dataIndex: 'taskTypeCode',
      key: 'taskTypeCode',
      render: (text, record) => {
        const handleTaskChange = e => {
          getCategoryCode(e)
        }
        return isEditing(record) && record.isNew ? (
          <Form.Item
            name="taskTypeCode"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please Select the Task Type' }]}
          >
            <Select
              style={{ width: 160 }}
              placeholder="Select Task Type"
              onChange={handleTaskChange}
              value={record.taskTypeCode}
            >
              {taskTypeCode &&
                taskTypeCode.map(type => (
                  <Option key={type.ttCode} value={type.ttCode}>
                    {type.ttDesc}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        ) : (
          record.ttDesc
        )
      },
    },
    {
      title: 'Category',
      dataIndex: 'taskCategoryCode',
      key: 'taskCategoryCode',
      render: (text, record) => {
        return isEditing(record) && record.isNew ? (
          <Form.Item
            name="taskCategoryCode"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please select the department!' }]}
          >
            <Select
              style={{ width: 160 }}
              placeholder="Select Department"
              value={record.taskCategoryCode}
            >
              {taskCateCode &&
                taskCateCode.map(task => (
                  <Option key={task.tcCode} value={task.tcCode}>
                    {task.tcDesc}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        ) : (
          record.tcDesc
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
      dataIndex: 'templateDesc',
      key: 'templateDesc',
      render: (text, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Button onClick={() => save()} type="primary">
              Save
            </Button>
            <Button onClick={cancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button type="primary" onClick={() => edit(record)}>
              Edit
            </Button>
            <Button type="primary" onClick={() => getDetails(record)} style={{ marginLeft: 8 }}>
              Detail
            </Button>
          </span>
        )
      },
    },
  ]

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Task Template Master">
        <Form form={form}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="taskType"
                label={
                  <span>
                    Task Type <span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Task Type"
                  onChange={getCategoryList}
                >
                  {taskList?.map(item => (
                    <Option key={item.ttCode} value={item.ttCode}>
                      {item.ttDesc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="taskCategory"
                label={
                  <span>
                    Task Category <span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Task Category">
                  {categoryList?.map(item => (
                    <Option key={item.tcCode} value={item.tcCode}>
                      {item.tcDesc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '10px' }}>
          <Button type="primary" onClick={getTemplateDetails}>
            Get Details
          </Button>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <div className="mt-3" style={{ display: isDisplay ? 'block' : 'none' }}>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={addNewRow}>
              Add New{' '}
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
        </div>
      </Card>

      {detailModalVisible && (
        <DetailTaskTemplate
          onClose={closepopup}
          data={selectedData}
          visible={detailModalVisible}
          getTemplateDetails={getTemplateDetails}
        />
      )}
    </div>
  )
}

export default TaskTemplate
