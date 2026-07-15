import React, { useState, useEffect } from 'react'
import { DatePicker, Form, Select, Card, Button, message, Skeleton } from 'antd'
import { Table } from 'ant-table-extensions'
import store from 'store'
import moment from 'moment'
import { FileExcelOutlined } from '@ant-design/icons'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import messageReturn from '_helpers/messageReturn'
import LogEntryDetails from '../logEntryDetailCard'
import currentDateTime from '../../../../currentDateTime'

const LogEntrySearchCard = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [projectList, setProjectList] = useState([])
  const [openCreatCard, setOpenCreateCard] = useState(false)
  const [employeeData, setEmployeeData] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false) // State variable to track loading status
  const [filtersinfo, setfilterinfo] = useState({})
  const [totalHours, setTotalHours] = useState(0)
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const currentDate = moment()
  const firstDateOfMonth = moment().startOf('month')

  const disabledFutureDates = current => {
    return current && current > moment().endOf('day')
  }

  useEffect(() => {
    getProjectList()
    getEmployeeDetails()
  }, [])

  useEffect(() => {
    calculateTotalHours()
  }, [tableData, filtersinfo])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 50}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const calculateTotalHours = () => {
    const filteredData = tableData.filter(record => {
      return (
        (!filtersinfo.projectCode || filtersinfo.projectCode.includes(record.projectCode)) &&
        (!filtersinfo.recordDate || filtersinfo.recordDate.includes(record.recordDate)) &&
        (!filtersinfo.empCode || filtersinfo.empCode.includes(record.empCode)) &&
        (!filtersinfo.empName || filtersinfo.empName.includes(record.empName)) &&
        (!filtersinfo.timeSheetDtl || filtersinfo.timeSheetDtl.includes(record.timeSheetDtl))
      )
    })

    const total = filteredData.reduce(
      (sum, record) => sum + parseFloat(record.timeSheetHrs || 0),
      0,
    )
    setTotalHours(total)
  }

  const projectCode1 = []
  const recordDate1 = []
  const empCode1 = []
  const empName1 = []
  const department1 = []
  const timeSheetDtl1 = []
  const timeSheetCate1 = []
  const typeDtl = []
  const taskEntryDesc1 = []
  const summaryDtl = []

  tableData.map(h => {
    return projectCode1.push(h.projectCode)
  })
  tableData.map(h => {
    return recordDate1.push(h.recordDate)
  })
  tableData.map(h => {
    return empCode1.push(h.empCode)
  })
  tableData.map(h => {
    return empName1.push(h.empName)
  })
  tableData.map(h => {
    return department1.push(h.departmentDesc)
  })
  tableData.map(h => {
    return timeSheetDtl1.push(h.category)
  })

  tableData.map(h => {
    return timeSheetCate1.push(h.timeSheetCategory)
  })

  tableData.map(h => {
    return typeDtl.push(h.type)
  })
  tableData.map(h => {
    return taskEntryDesc1.push(h.taskEntryDesc)
  })

  tableData.map(h => {
    return summaryDtl.push(h.summary)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const projectCode2 = projectCode1.filter(distinct)
  const recordDate2 = recordDate1.filter(distinct)
  const empCode2 = empCode1.filter(distinct)
  const empName2 = empName1.filter(distinct)
  const timeSheetDtl2 = timeSheetDtl1.filter(distinct)
  const department2 = department1.filter(distinct)
  const timeSheetCate2 = timeSheetCate1.filter(distinct)
  const timeTypeDtl1 = typeDtl.filter(distinct)
  const taskEntryDesc2 = taskEntryDesc1.filter(distinct)
  const summaryDtl1 = summaryDtl.filter(distinct)

  const projectCode3 = []
  const recordDate3 = []
  const empCode3 = []
  const empName3 = []
  const timeSheetDtl3 = []
  const timeSheetCategory = []
  const department3 = []
  const timeTypeDtl3 = []
  const summaryDtl2 = []
  const taskEntryDesc3 = []

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
  recordDate2.map(element => {
    return recordDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  empCode2.map(element => {
    return empCode3.push({
      text: element,
      value: element,
    })
  })
  empName2.map(element => {
    return empName3.push({
      text: element,
      value: element,
    })
  })
  department2.map(element => {
    return department3.push({
      text: element,
      value: element,
    })
  })

  timeSheetDtl2.map(element => {
    return timeSheetDtl3.push({
      text: element,
      value: element,
    })
  })

  timeSheetCate2.map(element => {
    return timeSheetCategory.push({
      text: element,
      value: element,
    })
  })

  timeTypeDtl1.map(element => {
    return timeTypeDtl3.push({
      text: element,
      value: element,
    })
  })
  taskEntryDesc2.map(element => {
    return taskEntryDesc3.push({
      text: element,
      value: element,
    })
  })
  summaryDtl1.map(element => {
    return summaryDtl2.push({
      text: element,
      value: element,
    })
  })

  console.log(timeTypeDtl3, 'timeTypeDtl1')
  console.log(filtersinfo, 'filtersinfo')

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode || null,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Record Date',
      dataIndex: 'recordDate',
      key: 'recordDate',
      filters: recordDate3,
      filteredValue: filtersinfo.recordDate || null,
      onFilter: (value, record) => record?.recordDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
    },
    {
      title: 'Employee Code',
      dataIndex: 'empCode',
      key: 'empCode',
      filters: empCode3,
      filteredValue: filtersinfo.empCode || null,
      onFilter: (value, record) => record?.empCode === value,
    },
    {
      title: 'Employee Name',
      dataIndex: 'empName',
      key: 'empName',
      filters: empName3,
      filteredValue: filtersinfo.empName || null,
      onFilter: (value, record) => record?.empName === value,
    },
    {
      title: 'Timesheet Category',
      dataIndex: 'timeSheetCategory',
      key: 'timeSheetCategory',
      filters: timeSheetCategory,
      filteredValue: filtersinfo.timeSheetCategory || null,
      onFilter: (value, record) => record?.timeSheetCategory === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: timeTypeDtl3,
      filteredValue: filtersinfo.type || null,
      onFilter: (value, record) => record?.type === value,
    },
    {
      title: 'Department',
      dataIndex: 'departmentDesc',
      key: 'departmentDesc',
      filters: department3,
      filteredValue: filtersinfo.departmentDesc || null,
      onFilter: (value, record) => record?.departmentDesc === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: timeSheetDtl3,
      filteredValue: filtersinfo.category || null,
      onFilter: (value, record) => record?.category === value,
    },
    {
      title: 'Activity',
      dataIndex: 'taskEntryDesc',
      key: 'taskEntryDesc',
      filters: taskEntryDesc3,
      filteredValue: filtersinfo.taskEntryDesc || null,
      onFilter: (value, record) => record?.taskEntryDesc === value,
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      filters: summaryDtl2,
      filteredValue: filtersinfo.summary || null,
      onFilter: (value, record) => record?.summary === value,
    },
    {
      title: 'Recorded Hrs.',
      dataIndex: 'timeSheetHrs',
      key: 'timeSheetHrs',
      className: 'right-align-cell',
      render: text => (text ? parseFloat(text).toFixed(1) : ''),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <a>
          <RemoveIcon
            onClick={() => removeRow(record)}
            disableInputBoxes={record.empId !== employeeId}
          />
        </a>
      ),
    },
  ]

  const getProjectList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: '',
        toDate: '',
      },
    })
    if (response.responseCode === '200') {
      setProjectList(response?.responseData)
    } else {
      setProjectList([])
    }
  }

  const getEmployeeDetails = async projectId => {
    const response = await indentFileUpload({
      requestPath: 'getEmpIDinTimesheet',
      requestData: {
        pmHdrId: projectId || '',
        empId: employeeId,
        tenantId,
      },
    })
    if (response.responseCode === '200') {
      setEmployeeData(response?.responseData)
    } else {
      setEmployeeData([])
    }
  }

  const handleSubmit = async () => {
    const formvalues = form.getFieldsValue()
    if (formvalues.projectId !== undefined && formvalues.employee !== undefined) {
      setLoading(true) // Set loading to true before fetching data
      const response = await indentFileUpload({
        requestPath: 'getTimeSheetDtl',
        requestData: {
          pmHdrId: formvalues.projectId,
          unLogginEmpId: formvalues.employee,
          logginEmpId: employeeId,
          tenantId,
          fromDate: formvalues.fromdate ? formvalues.fromdate.format('YYYY-MM-DD') : '',
          toDate: formvalues.todate ? formvalues.todate.format('YYYY-MM-DD') : '',
        },
      })
      setTableData(response?.responseData || [])
      setLoading(false) // Set loading to false after data is fetched
    } else {
      messageReturn(405)
    }
  }

  const handleProjectChange = value => {
    form.setFieldsValue({
      projectId: value,
    })
    getEmployeeDetails(value)
  }

  const openModal = () => {
    setOpenCreateCard(true)
    cleardata()
  }
  const onclose = () => {
    setOpenCreateCard(false)
    getProjectList()
    getEmployeeDetails()
  }
  const cleardata = () => {
    form.resetFields()
    setTableData([])
  }

  const removeRow = async record => {
    const response = await indentFileUpload({
      requestPath: 'deleteActivityforEmpId',
      requestData: {
        tdtlId: record.tdtlId,
        tenantId,
      },
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      handleSubmit()
    }
  }

  return (
    <div style={isMobile ? { width: tableWidth } : { marginTop: '20px' }}>
      <Card
        title="Timesheet"
        extra={
          <Button type="primary" text="Create Log" onClick={openModal}>
            Create Log
          </Button>
        }
      >
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="projectId"
                defaultValue=""
                initialValue=""
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select onChange={handleProjectChange} placeholder="Select Project">
                  <Option value="">Get All</Option>
                  {projectList?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="fromdate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                initialValue={firstDateOfMonth}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MMM-YYYY"
                  disabledDate={disabledFutureDates}
                />
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="todate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                initialValue={currentDate}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MMM-YYYY"
                  disabledDate={disabledFutureDates}
                />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="employee"
                placeholder="Select Employee"
                initialValue=""
                defaultValue=""
                label={
                  <span>
                    Employee<span style={{ color: 'red' }}>*</span>
                  </span>
                }
              >
                <Select placeholder="Select Employee" defaultValue="">
                  <Option value="">Get All</Option>
                  {employeeData?.map(item => (
                    <Option key={item.empId} value={item.empId}>
                      {item.empCode}-{item.empName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button type="primary" onClick={handleSubmit}>
              {' '}
              Get Details
            </Button>
            <Button type="primary" onClick={cleardata}>
              {' '}
              Clear
            </Button>
          </div>
          <div className="mt-3">
            {loading ? ( // Show skeleton loader when loading
              <Skeleton active />
            ) : (
              tableData &&
              tableData.length > 0 && (
                <Table
                  columns={columns}
                  dataSource={tableData}
                  onChange={handleChange}
                  exportableProps={{
                    fileName: `Timesheet_${currentDateTime}`,
                    btnProps: {
                      type: 'primary',
                      icon: <FileExcelOutlined />,
                      children: <span>Export to CSV</span>,
                    },
                  }}
                  footer={() => (
                    <div style={{ textAlign: 'right', paddingRight: '10px' }}>
                      <b>
                        Total Hours :{' '}
                        {totalHours.toLocaleString('en-IN', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </b>
                    </div>
                  )}
                />
              )
            )}
          </div>
        </Form>
      </Card>
      {openCreatCard && <LogEntryDetails isModalVisible={openCreatCard} onCancel={onclose} />}
    </div>
  )
}

export default LogEntrySearchCard
