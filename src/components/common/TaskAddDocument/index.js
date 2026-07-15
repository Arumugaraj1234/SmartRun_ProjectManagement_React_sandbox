import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import { Space, Form, Input, DatePicker, Select, message, AutoComplete, Table } from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import getTaskType from 'services/common/Taskmanagement/Tasktype'
import getTaskCategorey from 'services/common/Taskmanagement/TaskCategorey'
import TaskTemplateService from 'services/common/Taskmanagement/TaskTemplateService'
import getTemplateDetails from 'services/common/Taskmanagement/TemplateDetailsService'
import InsertTasktemplatedetails from 'services/common/Taskmanagement/InsertTaskTempDetailService'
// import getEmployeeDropDownDataService from 'services/common/getEmployeeDropDownDataService'
import getEmployeeDropDownDataService from 'services/common/AssignTeamGetDtlService'
import ButtonComponent from 'components/shared/ButtonComponent'
// import DropDownComponent from 'components/shared/DropDownComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import messageReturn from '_helpers/messageReturn'
// import AssignTeamGetDtlService from 'services/common/AssignTeamGetDtlService'

const TaskAddNewDocument = ({ handleCancel, isModalVisible, submit, dependentTeHdrId, pmId }) => {
  const { Option } = Select
  const [inputForm] = Form.useForm()
  const [qtyForm] = Form.useForm()
  const [requirementFrom] = Form.useForm()
  console.log(
    'handleCancel, isModalVisible, submit',
    handleCancel,
    isModalVisible,
    submit,
    dependentTeHdrId,
  )

  const employeID = store.get('employeeId')
  const Tab = store.get('Tab')
  const projectid = store.get('ProjectID')
  const { tenantId, mstId, processCode } = Tab
  const [taskTypeData, setTaskTypeData] = useState([])
  const [taskType, setTaskType] = useState(undefined)
  const [taskTypeCode, setTaskTypeCode] = useState(undefined)
  const [taskTempData, setTaskTempData] = useState([])
  const [taskTemp, setTaskTemp] = useState(undefined)
  const [taskTempCode, setTaskTempCode] = useState(undefined)
  const [taskCategorydata, setTaskCategorydata] = useState([])
  const [taskCategory, setTaskCategory] = useState(undefined)
  const [taskCategoryCode, setTaskCategoryCode] = useState(undefined)
  const [employeeData, setEmployeeData] = useState([])
  const [retrivaldata, setRetrivaldata] = useState([])
  const [tthdrid, setTthdrid] = useState('')
  const [responseOk, setResponseOk] = useState(false)
  const [disablebtnstatus, setDisablebtnstatus] = useState(false)
  const enquiryarr = store.get('Enquiry')
  const dueDateObject = enquiryarr.find(item => item.label === 'Due Date')
  const dueDate = dueDateObject ? dueDateObject.value : null
  const planStartObject = enquiryarr.find(item => item.label === 'Planned Start Date')
  const planStartDate = planStartObject ? planStartObject.value : null

  // const emptyTemp = {
  //   activityName: '',
  //   assignTo: '',
  //   ttDtlId: '',
  //   tenantId,
  //   plannedStartDate: planStartDate
  //     ? moment(planStartDate).format('YYYY-MM-DD')
  //     : moment().format('YYYY-MM-DD'),
  //   dueDate: dueDate ? moment(dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
  //   teDtlId: '',
  //   requirementFrom: '',
  //   qty: '',
  //   sno:0
  // }

  //   const [activityNames, setActivityNames] = useState([])
  //   const [activityName, setActivityName] = useState('')

  useEffect(() => {
    handleClear()
    fetchTypeDropdowndata()
    getEmployeeDropDownData()
  }, [isModalVisible])

  const fetchTypeDropdowndata = async () => {
    const httpResponsedp = await getTaskType({
      empId: employeID,
      tenantId,
      pmId,
    })
    setTaskCategory(undefined)
    setRetrivaldata([])
    setTaskCategorydata([])
    if (httpResponsedp.responseMessage === '200') {
      const typecoderesp = httpResponsedp.responseData
      const options = typecoderesp?.map(item => ({
        key: item.ttCode,
        value: item.ttDesc,
      }))
      setTaskTypeData(options)
    } else {
      messageReturn(619)
    }
  }

  const getEmployeeDropDownData = async () => {
    const httpResponsedp = await getEmployeeDropDownDataService({
      employeeID: employeID,
      referenceDoc: processCode,
      referenceId: mstId,
      tenantId,
      // tenantId,
      // departmentId: '',
      // employeeId: employeID,
    })
    console.log('data-------> ', httpResponsedp)

    if (httpResponsedp) {
      const typecoderesp = httpResponsedp.processAssignedTeamEntity
      console.log('--->typecoderesp-- ', typecoderesp)
      if (typecoderesp) {
        const options = typecoderesp?.map(item => ({
          key: item.empId,
          value: item.employeeName,
          isPrimary: item.isPrimary,
        }))
        setEmployeeData(options)
        console.log('employeeData---> ', employeeData)
        console.log('options---> ', options)
      }
    } else {
      messageReturn(619)
    }
  }

  const fetchTaskCatDropdowndata = async tskcd => {
    const httpResponsedp = await getTaskCategorey({
      typeCode: tskcd,
      tenantId,
    })
    setTaskCategory(undefined)
    setTaskTemp(undefined)
    setTaskTempData([])
    setTaskCategorydata([])
    setRetrivaldata([])
    if (httpResponsedp.responseMessage === '200') {
      const typecoderesp = httpResponsedp.responseData
      console.log('fetchTaskCatDropdowndata--> ', typecoderesp)

      const options = typecoderesp.map(item => ({
        key: item.tcCode,
        value: item.tcDesc,
      }))
      setTaskCategorydata(options)
    } else {
      messageReturn(619)
    }
  }

  const fetchTaskTempDropdowndata = async (typeCode, catCode) => {
    const httpResponsedp = await TaskTemplateService({
      typeCode,
      catCode,
      empId: employeID,
      tenantId,
    })
    setTaskTemp(undefined)
    setTaskTempData([])
    setRetrivaldata([])
    if (httpResponsedp.responseMessage === '200') {
      const typecoderesp = httpResponsedp.responseData
      console.log('fetchTaskTempDropdowndata--> ', typecoderesp)

      const options = typecoderesp.map(item => ({
        key: item.ttHdrId,
        value: item.ttname,
      }))
      setTaskTempData(options)
    } else {
      messageReturn(619)
    }
  }

  const handleActivityChange = (index, e) => {
    const newData = [...retrivaldata]
    newData[index].activityName = e.target.value

    // if(e.target.value.length>2055){
    // }
    // setRetrivaldata(newData)
  }

  const handlegetDtlSubmit = async () => {
    clearform()
    if (
      taskTempCode !== undefined &&
      taskCategoryCode !== undefined &&
      taskTypeCode !== undefined
    ) {
      const getTemprop = {
        tenantId,
        ttHdrId: taskTempCode,
      }

      const httpResponsedp = await getTemplateDetails(getTemprop)
      if (httpResponsedp.responseMessage === '200') {
        console.log('getTemplateDetails---> ', httpResponsedp)
        if (httpResponsedp.responseData.length > 0) {
          setTthdrid(httpResponsedp.responseData[0].ttHdrId)
        } else {
          setTthdrid('')
        }
        setResponseOk(true)
        const maxSno = httpResponsedp.responseData.reduce((max, data) => Math.max(max, data.sno), 0)
        const emptyTemps = {
          activityName: '',
          assignTo: '',
          ttDtlId: '',
          tenantId,
          plannedStartDate: planStartDate
            ? moment(planStartDate).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
          dueDate: dueDate ? moment(dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
          teDtlId: '',
          requirementFrom: '',
          qty: '',
          sno: maxSno + 1,
        }
        const newData = httpResponsedp.responseData.map(data => {
          return {
            activityName: data.activityName,
            sno: data.sno,
            assignTo: '',
            ttDtlId: data.ttDtlId,
            plannedStartDate: planStartDate
              ? moment(planStartDate).format('YYYY-MM-DD')
              : moment().format('YYYY-MM-DD'),
            dueDate: dueDate ? moment(dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            teDtlId: '',
            tenantId,
            qty: '',
            requirementFrom: '',
          }
        })
        setRetrivaldata([...newData, emptyTemps])
      } else {
        messageReturn(619)
      }
    } else {
      setRetrivaldata([])
      setResponseOk(false)
      messageReturn(405)
    }
    console.log('handlegetDtlSubmit--->')
  }
  const handleAssignToChange = (index, value, option) => {
    const newData = [...retrivaldata]
    if (option !== undefined) {
      newData[index].assignTo = option.key
    }
    newData[index].assignToDesc = value
    // setRetrivaldata(newData)
  }

  const handlePlanStartDateChange = (index, dateString, record) => {
    console.log(index, dateString, ' handlePlanStartDateChange')
    const newData = [...retrivaldata]
    const fromdate = dateString
    const todate = newData[index].dueDate
    if (fromdate && todate && todate < fromdate) {
      messageReturn(620)
      requirementFrom.setFieldsValue({
        [`dueDate${record.sno}`]: moment(dateString),
      })
      newData[index].plannedStartDate = dateString
      newData[index].dueDate = dateString
      return
    }
    newData[index].plannedStartDate = dateString

    requirementFrom.setFieldsValue({
      [`plannedStartDate${record.sno}`]: moment(dateString),
    })
    // setRetrivaldata(newData)
  }

  const handleQtyChange = (index, value) => {
    const newData = [...retrivaldata]
    newData[index].qty = value
    // setRetrivaldata(newData)
  }

  const handleDueDateChange = (index, dateString, record) => {
    console.log(index, dateString, ' handleDueDateChange')
    const newData = [...retrivaldata]
    newData[index].dueDate = dateString

    const newDueDate = moment(dateString)
    if (moment(newData[index].plannedStartDate).isAfter(newDueDate)) {
      messageReturn(621)
      newData[index].plannedStartDate = dateString
      newData[index].dueDate = dateString
      requirementFrom.setFieldsValue({
        [`plannedStartDate${record.sno}`]: moment(dateString),
      })
    }
    requirementFrom.setFieldsValue({
      [`dueDate${record.sno}`]: moment(dateString),
    })
    // setRetrivaldata(newData)
  }

  console.log('retrivaldata---> ', retrivaldata)

  const handleClear = () => {
    setTaskType(undefined)
    setTaskCategory(undefined)
    setTaskTemp(undefined)
    setTaskCategoryCode(undefined)
    setTaskTempCode(undefined)
    setTaskTypeCode(undefined)
    inputForm.resetFields()
    setTaskTempData([])
    setTaskCategorydata([])
    setRetrivaldata([])
    setResponseOk(false)
    clearform()
  }

  const clearform = () => {
    qtyForm.resetFields()
    inputForm.resetFields()
    requirementFrom.resetFields()
  }

  const handleAddRow = index => {
    const newData = [...retrivaldata]
    if (
      newData[index].activityName !== '' &&
      newData[index].assignToDesc !== '' &&
      newData[index].assignTo !== '' &&
      newData[index].plannedStartDate !== '' &&
      newData[index].dueDate !== '' &&
      newData[index].requirementFrom !== '' &&
      newData[index].qty !== ''
    ) {
      const maxSno = newData.reduce((max, data) => Math.max(max, data.sno), 0)

      // Create emptyTemp with the incremented sno value
      const emptyTemp = {
        activityName: '',
        assignTo: '',
        ttDtlId: '',
        tenantId,
        plannedStartDate: planStartDate
          ? moment(planStartDate).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        dueDate: dueDate ? moment(dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        teDtlId: '',
        requirementFrom: '',
        qty: '',
        sno: maxSno + 1,
      }

      setRetrivaldata([...retrivaldata, emptyTemp])
      inputForm.resetFields()
    } else {
      messageReturn(405)
      // if (newData[index].assignTo === '' || undefined || null) {
      // }
    }

    console.log('handleAddRow')
  }

  const handleRemoveRow = (indexToRemove, record) => {
    const updatedTableData = retrivaldata.filter(item => item.sno !== record.sno)

    // setRetrivaldata(prevData => prevData.filter((_, index) => index !== indexToRemove))
    setRetrivaldata(updatedTableData)
    console.log('handleRemoveRow', indexToRemove)
  }
  // const handleRemoveRows = record => {
  //   const updatedTableData = tableData.filter(item => item.sno !== record.sno)
  //   setTableData(updatedTableData)
  // }

  const handleinsertSubmit = async () => {
    setDisablebtnstatus(true)
    console.log('handleinsertSubmit---> ', retrivaldata)
    const filteredData = retrivaldata.filter(
      entry => entry.activityName !== '' || entry.assignTo !== '',
    )
    const hasEmptyValues = filteredData.some(
      entry =>
        entry.activityName === '' ||
        entry.assignTo === '' ||
        entry.plannedStartDate === '' ||
        entry.plannedCompletedDate === '' ||
        entry.dueDate === '' ||
        entry.requirementFrom === '' ||
        entry.qty === '',
    )
    if (hasEmptyValues) {
      messageReturn(405)
    } else {
      const newInsert = {
        employeID,
        dependentTeHdrId: null,
        masterId: mstId,
        ttHdrId: tthdrid,
        taskCategoryCode,
        taskTypeCode,
        tenantId,
        pmHdrId: projectid,
        taskEntryDtl: filteredData,
      }
      console.log('handleinsertSubmit', newInsert)
      const httpResponseInsert = await InsertTasktemplatedetails(newInsert)
      if (httpResponseInsert.responseCode === '200') {
        console.log('handleinsertSubmit newInsert ---> ', httpResponseInsert.responseData)
        message.success(httpResponseInsert.responseMessage)
        submit()
        clearform()
        setDisablebtnstatus(false)
      } else {
        message.error(httpResponseInsert.responseMessage)
      }
      console.log('handleinsertSubmit newInsert ---> ', newInsert, httpResponseInsert)
    }
    setDisablebtnstatus(false)
  }

  const handleTaskTypeOnChange = async (type, value, key) => {
    console.log('handleTaskTypeChange---> ', value, key)
    console.log('taskcat--> ', type)
    console.log('Submitted taskCategory:', taskCategory)
    console.log('Submitted taskTempCode:', taskTypeCode, taskCategoryCode, taskTempCode)
    if (type === 'tasktype') {
      fetchTaskCatDropdowndata(key)
    }
    if (type === 'taskcat') {
      fetchTaskTempDropdowndata(taskTypeCode, key)
    }
    if (type === 'tasktemp') {
      console.log('taskTemp---> ', taskTemp)
    }
  }

  // const renderItem = (item) => {
  //   console.log("item", item);
  //   const backgrdColor = item.isPrimary === "1" ? 'lightgrey' : 'transparent'; // Adjust the background color conditionally

  //   const optionStyle = {
  //     backgroundColor: `${backgrdColor} !important`,
  //     color:'black'
  //   };

  //   return (
  //     <AutoComplete.Option key={item.key} value={item.value} style={optionStyle}>
  //       {item.value}
  //     </AutoComplete.Option>
  //   );
  // };

  const handleInputChanged = (index, value) => {
    const newData = [...retrivaldata]
    newData[index].assignToDesc = value
    // setRetrivaldata(newData)
  }
  const columns = [
    {
      title: (
        <>
          <span>Activity </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'activityName',
      key: 'activityName',
      width: '25%',
      render: (text, record, index) =>
        index === retrivaldata.length - 1 ? (
          <Form form={inputForm} style={{ marginTop: '20px' }}>
            <Form.Item name="inputfield">
              <Input
                value={text}
                onBlur={e => handleActivityChange(index, e)}
                placeholder="Type here..."
                style={{ width: '300px' }}
                name="inputfield"
                maxLength={2056}
              />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: (
        <>
          <span>Assigned To </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'assignToDesc',
      key: 'assignToDesc',
      width: '12%',
      render: (text, record, index) => (
        // <DropDownComponent
        //   data={employeeData}
        //   value={text}
        //   onChange={() => handleAssignToChange(index, text)}
        //   onSelect={(value, option) => handleAssignToChange(index, value, option)}
        // />
        <Form form={qtyForm} style={{ marginTop: '20px' }}>
          <Form.Item name={`assignto${record.sno}`}>
            <AutoComplete
              options={employeeData.map(option => ({
                ...option,
                label: (
                  <div
                    style={{
                      backgroundColor: option.isPrimary === '1' ? 'lightgrey' : 'transparent',
                      borderRadius: '4px',
                    }}
                  >
                    {option.value}
                  </div>
                ),
              }))}
              value={record.assignToDesc}
              onSelect={(value, option) => handleAssignToChange(index, value, option)}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              <Input
                placeholder="Select here"
                onBlur={e => handleInputChanged(index, e.target.value)}
              />
            </AutoComplete>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Plan.Start Date </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      width: '13%',
      render: (text, record, index) => {
        // Define your start and end dates name={`assignto${record.sno}`
        const start = moment(planStartDate, 'DD-MMM-YYYY')
        const end = moment(dueDate, 'DD-MMM-YYYY')

        return (
          <Form form={requirementFrom} style={{ marginTop: '20px' }}>
            <Form.Item
              name={`plannedStartDate${record.sno}`}
              initialValue={start ? moment(start) : moment()}
            >
              <DatePicker
                value={start ? moment(start) : moment()}
                onChange={(date, dateString) =>
                  handlePlanStartDateChange(index, dateString, record)
                }
                format="YYYY-MM-DD"
                disabledDate={d => !d || d.isBefore(start) || d.isAfter(end)}
              />
            </Form.Item>
          </Form>
        )
      },
    },
    {
      title: (
        <>
          <span>Due Date </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: '10%',
      render: (text, record, index) => {
        // Define your start and end dates
        const start = moment(planStartDate, 'DD-MMM-YYYY')
        const end = moment(dueDate, 'DD-MMM-YYYY')

        return (
          <Form form={requirementFrom} style={{ marginTop: '20px' }}>
            <Form.Item name={`dueDate${record.sno}`} initialValue={end ? moment(end) : moment()}>
              <DatePicker
                value={end ? moment(end) : moment()}
                onChange={(date, dateString) => handleDueDateChange(index, dateString, record)}
                format="YYYY-MM-DD"
                disabledDate={d => !d || d.isBefore(start) || d.isAfter(end)}
              />
            </Form.Item>
          </Form>
        )
      },
    },
    {
      title: (
        <>
          <span>Qty. </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'qty',
      key: 'qty',
      width: '10%',
      render: (text, record, index) => (
        <Form form={qtyForm} style={{ marginTop: '20px' }}>
          <Form.Item name={`qtyfield${record.sno}`}>
            <Input
              value={record.qty}
              onBlur={e => handleQtyChange(index, e.target.value)}
              placeholder="Type here..."
              name={`qtyfield${record.sno}`}
              type="number"
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Requirement </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'requirementFrom',
      key: 'requirementFrom',
      width: '20%',
      render: (text, record, index) => (
        <Form form={requirementFrom} style={{ marginTop: '20px' }}>
          <Form.Item name={`requirementFrom${record.sno}`}>
            <Select
              onChange={value => {
                const newData = [...retrivaldata]
                newData[index].requirementFrom = value
                // setRetrivaldata(newData) // Uncomment this line to update the state

                requirementFrom.setFieldsValue({
                  [`requirementFrom${record.sno}`]: value,
                })
              }}
              placeholder="Select Requirement"
              style={{ width: '300px' }}
            >
              <Select.Option key="0" value="" disabled>
                Select Requirement
              </Select.Option>
              <Select.Option key="1" value="In Project">
                In Project
              </Select.Option>
              <Select.Option key="2" value="New from Sales">
                New from Sales
              </Select.Option>
              <Select.Option key="3" value="New from SCM">
                New from SCM
              </Select.Option>
              <Select.Option key="4" value="New from Factory">
                New from Factory
              </Select.Option>
              <Select.Option key="5" value="New from Site">
                New from Site
              </Select.Option>
              <Select.Option key="6" value="New from Customer">
                New from Customer
              </Select.Option>
              <Select.Option key="7" value="Rework">
                Rework
              </Select.Option>
              <Select.Option key="8" value="Service Request">
                Service Request
              </Select.Option>
              <Select.Option key="9" value="New from PM">
                New from PM
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: '10%',
      render: (text, record, index) => (
        <Space>
          {index === retrivaldata.length - 1 && (
            <AddIconButton onClick={() => handleAddRow(index)} />
          )}
          {index !== retrivaldata.length - 1 && (
            <RemoveIcon onClick={() => handleRemoveRow(index, record)} />
          )}
        </Space>
      ),
    },
  ]

  const FieldsComponent = () => {
    return (
      <div>
        <div>
          <div className="row">
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <p style={{ marginRight: '10px' }} htmlFor="taskType">
                Task Type <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                value={taskType}
                onChange={(value, option) => {
                  setTaskType(value)
                  setTaskTypeCode(option.key)
                  handleTaskTypeOnChange('tasktype', value, option.key)
                }}
                placeholder="Select Task Type"
                id="taskType"
                style={{ marginRight: '10px', width: '100%' }}
                showSearch
              >
                {taskTypeData?.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="taskCategory">
                Task Category <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                value={taskCategory}
                onChange={(value, option) => {
                  setTaskCategory(value)
                  setTaskCategoryCode(option.key)
                  handleTaskTypeOnChange('taskcat', value, option.key)
                }}
                placeholder="Select Task Category"
                id="taskCategory"
                style={{ marginRight: '10px', width: '100%' }}
                showSearch
              >
                {/* Placeholder option */}
                {taskCategorydata?.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="taskTemplate">
                Default Task List <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                value={taskTemp}
                onChange={(value, option) => {
                  setTaskTemp(value)
                  setTaskTempCode(option.key)
                  handleTaskTypeOnChange('tasktemp', value, option.key)
                }}
                placeholder="Select Task Template"
                id="taskTemplate"
                style={{ marginRight: '10px', width: '100%' }}
                showSearch
              >
                {/* Placeholder option */}
                {taskTempData.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '25px', justifyContent: 'center' }}>
            <ButtonComponent
              text="Get Details"
              type="primary"
              marginright="10px"
              onClick={handlegetDtlSubmit}
            />
            <ButtonComponent text="Clear" type="primary" marginright="10px" onClick={handleClear} />
          </div>
        </div>
        <div
          className="custom_antd_Table"
          style={{ marginTop: '10px', display: responseOk ? 'block' : 'none' }}
        >
          <Table
            columns={columns}
            dataSource={retrivaldata}
            pagination={false}
            scroll={{ y: 580 }}
          />
        </div>
      </div>
    )
  }
  console.log(disablebtnstatus)
  const ButtonsComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: responseOk ? 'block' : 'none',
        }}
      >
        <ButtonComponent
          text="Submit"
          type="primary"
          marginright="10px"
          onClick={handleinsertSubmit}
          disable={disablebtnstatus}
        />
        <ButtonComponent
          text="Cancel"
          type="primary"
          onClick={() => {
            clearform()
            handleCancel()
          }}
        />
      </div>
    )
  }

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      ButtonsComponent={ButtonsComponent}
      FieldsComponent={FieldsComponent}
      text="Create Task"
      onCancel={() => {
        clearform()
        handleCancel()
      }}
      width="900"
    />
  )
}

export default TaskAddNewDocument
