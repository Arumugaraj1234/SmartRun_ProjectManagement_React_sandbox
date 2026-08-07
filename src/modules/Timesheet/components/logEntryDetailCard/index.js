import React, { useState, useEffect } from 'react'
import store from 'store'
import moment from 'moment'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { Form, Select, Checkbox, DatePicker, Input, Button, Table, message } from 'antd'
import debounce from 'lodash/debounce'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import './style.scss'
import messageReturn from '_helpers/messageReturn'

const LogEntryDetails = ({ onCancel, isModalVisible }) => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const { Option } = Select
  const [form] = Form.useForm()
  const [projectList, setProjectList] = useState([])
  const [timesheetCategory, setTimesheetCategory] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [defaultList, setDefaultList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [applicable, setApplicable] = useState(false)
  const [tableData, setTableData] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  const [availableHours, setAvailableHours] = useState(0)
  const [categoryCode, setCategoryCode] = useState('')

  useEffect(() => {
    getProjectList()
  }, [])
  const getProjectList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: '',
        toDate: '',
      },
    })
    setProjectList(response?.responseData || []) /* */
  }

  const getTimesheetCategory = async () => {
    form.setFieldsValue({
      TCategory: undefined,
      department: undefined,
      type: undefined,
      category: undefined,
      defaulttemplate: undefined,
    })
    const response = await indentFileUpload({
      requestPath: 'getTimeSheetCategory',
      requestData: {
        tenantId,
        tcId: '',
      },
    })
    setTimesheetCategory(response?.responseData || []) /* */
  }

  const getDepartment = async () => {
    form.setFieldsValue({
      type: undefined,
      category: undefined,
      department: undefined,
      defaulttemplate: undefined,
    })
    setDepartmentList([])
    try {
      const response = await indentFileUpload({
        requestPath: 'getDepartmentAndEmpInfo',
        requestData: {
          tenantId,
          isActive: '1',
          employeID: '',
        },
      })
      const options = response.map(item => ({
        key: item.departmentCode,
        value: item.departmentName,
      }))
      setDepartmentList(options)
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
    }
  }
  const getType = async () => {
    form.setFieldsValue({
      type: undefined,
      category: undefined,
      defaulttemplate: undefined,
    })
    setTypeList([])
    const formvalues = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getTaskTypeByEmp',
      requestData: {
        tenantId,
        empId: employeeId,
        pmId: '',
        depCode: formvalues.department,
      },
    })
    setTypeList(response?.responseData || []) /* */
  }

  const getCategory = async () => {
    form.setFieldsValue({
      defaulttemplate: undefined,
      category: undefined,
    })
    setCategoryList([])
    const formvalues = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getTaskCategoryByPmHdrId',
      requestData: {
        tenantId,
        taskTypeCode: formvalues.type,
        pmHdrId: formvalues.projectId,
      },
    })
    setCategoryList(response?.responseData || []) /* */
  }

  const getDefaultlist = async () => {
    const response = await indentFileUpload({
      requestPath: 'getAllTimeSheetTaskForHdr',
      requestData: {
        tenantId,
      },
    })
    setDefaultList(response?.responseData || [])
  }

  const changeApplicable = () => {
    setApplicable(!applicable)
  }
  const onSubmit = async () => {
    // It is Default Template Retrical Like NA Checkbox NOt Checked scenario
    const formvalues = form.getFieldsValue()
    if (
      formvalues.projectId &&
      formvalues.TCategory &&
      formvalues.department &&
      formvalues.type &&
      formvalues.category &&
      formvalues.summary &&
      formvalues.date
    ) {
      const payload = {
        requestPath: 'taskEntryHdrAndDtl',
        requestData: {
          tenantId,
          pmHdrId: formvalues.projectId,
          typeCode: formvalues.type,
          categoryCode: formvalues.category,
        },
      }
      const response = await indentFileUpload(payload)
      if (response?.responseData && response?.responseData.length > 0) {
        const updatedTableData = response?.responseData.map((item, index) => {
          return {
            ...item,
            sno: index + 1,
          }
        })
        setTableData(updatedTableData)
      } else {
        setTableData([])
      }
    } else {
      messageReturn(405)
    }
  }

  const onSubmit2 = async () => {
    // It is Default Template Retrival Like NA Checkbox checked scenario
    const formvalues = form.getFieldsValue()
    if (
      formvalues.projectId &&
      formvalues.TCategory &&
      formvalues.defaulttemplate &&
      formvalues.summary &&
      formvalues.date
    ) {
      const payload = {
        requestPath: 'getTimeSheetTaskForHdrandDtl',
        requestData: {
          tenantId,
          tdId: formvalues.defaulttemplate,
        },
      }
      const response = await indentFileUpload(payload)
      if (response?.responseData && response?.responseData.length > 0) {
        const updatedTableData = response?.responseData.map((item, index) => {
          return {
            ...item,
            sno: index + 1,
          }
        })
        setTableData(updatedTableData)
      } else {
        setTableData([])
      }
    } else {
      messageReturn(405)
    }
  }

  const getRemainingHours = async () => {
    const formvalues = form.getFieldsValue()
    if (formvalues.date) {
      const response = await indentFileUpload({
        requestPath: 'timelogRemaining',
        requestData: {
          empId: employeeId,
          date: formvalues.date ? formvalues.date.format('YYYY-MM-DD') : '',
          tenantId,
        },
      })
      setAvailableHours(response?.responseDataMessage || 0)
    }
  }

  const insertDetails = async () => {
    // It is hours insert service in Without NA Checkbox
    const formvalues = form.getFieldsValue()
    let totalHours = 0
    let accptHrs = true
    const updatedTableData = tableData.map(item => {
      const timeenterSheetHrs = parseFloat(formvalues[`hours_${item.sno}`]) || 0

      totalHours += timeenterSheetHrs

      if (totalHours > 24) {
        messageReturn(683)
        accptHrs = false
      }

      return {
        teDtlId: item.teDtlId || '',
        tdDtlId: item.tdDtlId || '',
        timeSheetHrs: timeenterSheetHrs,
        timeSheetDtl: item.defaulTaskDtl,
        tenantId,
      }
    })
    const filteredData = updatedTableData.filter(
      item => item.timeSheetHrs && item.timeSheetHrs != null && item.timeSheetHrs !== '',
    )
    if (filteredData.length === 0) {
      messageReturn(680)
      return
    }
    if (accptHrs) {
      const response = await indentFileUpload({
        requestPath: 'insertTimeSheetDtl',
        requestData: {
          tcId: formvalues.TCategory,
          empId: employeeId,
          tenantId,
          recordDate: formvalues.date ? formvalues.date.format('YYYY-MM-DD') : '',
          teHdrId: '',
          pmHdrId: formvalues.projectId,
          tdId: formvalues.tdId,
          summary: formvalues.summary,
          recordedBy: employeeId,
          timeSheetDtl: filteredData,
          taskCategoryCode: categoryCode,
        },
      })
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        onCancel()
      } else {
        message.error(response.responseMessage)
      }
    }
  }
  const insertDetails2 = async () => {
    const formvalues = form.getFieldsValue()
    let totalHours = 0
    let accptHrs = true
    const updatedTableData = tableData.map(item => {
      const timeenterSheetHrs = parseFloat(formvalues[`hours_${item.sno}`]) || 0

      totalHours += timeenterSheetHrs

      if (totalHours > 24) {
        messageReturn(683)
        accptHrs = false
      }

      return {
        teDtlId: item.teDtlId || '',
        tdDtlId: item.tdDtlId || '',
        timeSheetHrs: timeenterSheetHrs,
        timeSheetDtl: item.defaulTaskDtl,
        tenantId,
      }
    })

    // Filter out any null values due to the hours exceeding limit
    const filteredData = updatedTableData.filter(
      item => item && item.timeSheetHrs && item.timeSheetHrs !== null && item.timeSheetHrs !== '',
    )

    if (filteredData.length === 0) {
      messageReturn(680) // Message indicating no valid data to insert
      return
    }

    // Insert service for timesheet details
    if (accptHrs) {
      const response = await indentFileUpload({
        requestPath: 'insertTimeSheetDtl',
        requestData: {
          tcId: formvalues.TCategory,
          empId: employeeId,
          tenantId,
          recordDate: formvalues.date ? formvalues.date.format('YYYY-MM-DD') : '',
          teHdrId: '',
          pmHdrId: formvalues.projectId,
          tdId: formvalues.tdId,
          summary: formvalues.summary,
          recordedBy: employeeId,
          timeSheetDtl: filteredData,
          taskCategoryCode: categoryCode,
        },
      })

      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        onCancel()
      } else {
        message.error(response.responseMessage)
      }
    }
  }

  const checkRemainingHours = debounce((e, record) => {
    const formvalues = form.getFieldsValue()
    const updatedTableData = tableData.map(item => {
      const timeenterSheetHrs = parseFloat(formvalues[`hours_${item.sno}`]) || 0
      return {
        ...item,
        timeSheetHrs: timeenterSheetHrs,
      }
    })
    const sumofhours = updatedTableData.reduce((a, b) => a + b.timeSheetHrs, 0)
    if (sumofhours > availableHours) {
      form.setFieldsValue({
        [`hours_${record.sno}`]: undefined,
      })
      message.error(`Only ${Math.floor(availableHours)} hours remaining for you selected date`)
    }
  }, 500)

  const onClear = () => {
    form.resetFields()
    setApplicable(false)
    setTableData([])
  }

  const removeRow = record => {
    const newTableData = tableData.filter(item => item.tdDtlId !== record.tdDtlId)
    setTableData(newTableData)
  }

  const defaulTaskDtl1 = []
  const activityName1 = []
  const assignToDesc1 = []
  const empName1 = []
  const timeSheetDtl1 = []

  if (tableData && tableData.length > 0) {
    tableData.map(h => {
      return defaulTaskDtl1.push(h.defaulTaskDtl)
    })
    tableData.map(h => {
      return activityName1.push(h.activityName)
    })
    tableData.map(h => {
      return assignToDesc1.push(h.assignToDesc)
    })
    tableData.map(h => {
      return empName1.push(h.empName)
    })
    tableData.map(h => {
      return timeSheetDtl1.push(h.timeSheetDtl)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const defaulTaskDtl2 = defaulTaskDtl1.filter(distinct)
  const activityName2 = activityName1.filter(distinct)
  const assignToDesc2 = assignToDesc1.filter(distinct)
  const empName2 = empName1.filter(distinct)
  const timeSheetDtl2 = timeSheetDtl1.filter(distinct)

  const defaulTaskDtl3 = []
  const activityName3 = []
  const assignToDesc3 = []
  const empName3 = []
  const timeSheetDtl3 = []

  defaulTaskDtl2.map(element => {
    return defaulTaskDtl3.push({
      text: element,
      value: element,
    })
  })
  activityName2.map(element => {
    return activityName3.push({
      text: element,
      value: element,
    })
  })
  assignToDesc2.map(element => {
    return assignToDesc3.push({
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
  timeSheetDtl2.map(element => {
    return timeSheetDtl3.push({
      text: element,
      value: element,
    })
  })
  const columns1 = [
    {
      title: 'Activities',
      dataIndex: 'defaulTaskDtl',
      key: 'defaulTaskDtl',
      filters: defaulTaskDtl3,
      filteredValue: filtersinfo.defaulTaskDtl,
      onFilter: (value, record) => record?.defaulTaskDtl === value,
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 200,
      render: (text, record) => (
        <Form form={form}>
          <Form.Item name={`hours_${record.sno}`}>
            <Input
              type="number"
              min={0}
              max={24}
              placeholder="Enter Hours"
              onChange={e => {
                checkRemainingHours(e, record)
                const { value } = e.target
                if (value > 24) {
                  form.setFieldsValue({
                    [`hours_${record.sno}`]: '',
                  })
                  e.target.value = '24'
                }
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render: (text, record) => (
        <RemoveIcon
          onClick={() => removeRow(record)}
          disableInputBoxes={employeeId !== record.createdBy}
        />
      ),
    },
  ]
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const columns2 = [
    {
      title: 'Activities',
      dataIndex: 'activityName',
      key: 'activityName',
      filters: activityName3,
      filteredValue: filtersinfo.activityName,
      onFilter: (value, record) => record?.activityName === value,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignToDesc',
      key: 'assignToDesc',
      filters: assignToDesc3,
      filteredValue: filtersinfo.assignToDesc,
      onFilter: (value, record) => record?.assignToDesc === value,
    },
    {
      title: 'Type',
      dataIndex: 'ttDesc',
      key: 'ttDesc',
    },
    {
      title: 'Category',
      dataIndex: 'tcDesc',
      key: 'tcDesc',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      render: (text, record) => (
        <Form form={form}>
          <Form.Item name={`hours_${record.sno}`}>
            <Input
              type="number"
              min={0}
              max={24}
              placeholder="Enter Hours"
              onChange={e => {
                checkRemainingHours(e, record)
                const { value } = e.target
                if (value > 24) {
                  form.setFieldsValue({
                    [`hours_${record.sno}`]: '',
                  })
                  e.target.value = '24'
                }
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  const getCategoryCode = value => {
    setCategoryCode(value)
  }

  const FieldsComponent = () => {
    const today = moment()
    const last7days = today.subtract(7, 'days')
    const tomorrow = moment().add(1, 'day')

    return (
      <div>
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row">
            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ gap: '10px', display: 'flex' }}
            >
              <div style={{ width: '90%' }}>
                <Form.Item
                  name="projectId"
                  label={
                    <span>
                      Project<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Project"
                    onChange={() => {
                      getTimesheetCategory()
                      getDefaultlist()
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toUpperCase()
                        .indexOf(input.toUpperCase()) !== -1
                    }
                  >
                    {projectList?.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div style={{ width: '10%' }}>
                <Form.Item value={applicable} label={<span>NA</span>}>
                  <Checkbox
                    value={applicable}
                    checked={applicable}
                    style={{ width: '20%' }}
                    onChange={() => {
                      changeApplicable()
                      setTableData([])
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="TCategory"
                label={
                  <span>
                    Timesheet Category<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Timesheet Category"
                  onChange={getDepartment}
                >
                  {timesheetCategory?.map(item => (
                    <Option key={item.tcId} value={item.tcId}>
                      {item.tcName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: applicable ? 'none' : 'block' }}
            >
              <Form.Item
                name="department"
                label={
                  <span>
                    Department<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Department"
                  onChange={getType}
                >
                  {departmentList?.map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: applicable ? 'none' : 'block' }}
            >
              <Form.Item
                name="type"
                label={
                  <span>
                    Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Type" onChange={getCategory}>
                  {typeList?.map(item => (
                    <Option key={item.ttCode} value={item.ttCode}>
                      {item.ttDesc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: applicable ? 'none' : 'block' }}
            >
              <Form.Item
                name="category"
                label={
                  <span>
                    Category<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Category"
                  onChange={getCategoryCode}
                >
                  {categoryList?.map(item => (
                    <Option key={item.taskCategoryCode} value={item.taskCategoryCode}>
                      {item.taskDesc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: !applicable ? 'none' : 'block' }}
            >
              <Form.Item
                name="defaulttemplate"
                label={
                  <span>
                    Default Template<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Template">
                  {defaultList?.map(item => (
                    <Option key={item.tdId} value={item.tdId}>
                      {item.taskGroupName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="summary"
                label={
                  <span>
                    Summary<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input style={{ width: '100%' }} maxLength={255} />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                style={{ width: '100%' }}
                name="date"
                initialValue={moment()}
                label={
                  <span>
                    Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <DatePicker
                  format="DD-MMM-YYYY"
                  disabledDate={d =>
                    !d || d.isBefore(moment(last7days)) || d.isAfter(moment(tomorrow))
                  }
                  style={{ width: '100%' }}
                  onChange={getRemainingHours}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          {applicable === true ? (
            <Button
              type="primary"
              onClick={() => {
                onSubmit2()
                getRemainingHours()
              }}
            >
              Get Details
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                onSubmit()
                getRemainingHours()
              }}
            >
              Get Details
            </Button>
          )}
          <Button type="primary" onClick={onClear}>
            Clear
          </Button>
        </div>

        {tableData && tableData.length > 0 ? (
          <div className="custom_antd_Table mt-3">
            {applicable === true ? (
              <Table
                columns={columns1}
                dataSource={tableData}
                pagination={false}
                onChange={handleChange}
              />
            ) : (
              <Table
                columns={columns2}
                dataSource={tableData}
                pagination={false}
                onChange={handleChange}
              />
            )}
            <div
              style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}
            >
              {applicable === true ? (
                <Button type="primary" onClick={insertDetails2}>
                  Submit
                </Button>
              ) : (
                <Button type="primary" onClick={insertDetails}>
                  Submit
                </Button>
              )}
              <Button type="primary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <ModalPopup
      onCancel={onCancel}
      isModalVisible={isModalVisible}
      width={1800}
      FieldsComponent={FieldsComponent}
    />
  )
}

export default LogEntryDetails
