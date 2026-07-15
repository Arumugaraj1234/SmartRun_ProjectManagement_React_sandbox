import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import { Space, Form, Input, DatePicker, Select, message, AutoComplete, Table } from 'antd'
import ModalPopup from 'components/shared/ModalPopupComponent'
import getTaskType from 'services/common/Taskmanagement/Tasktype'
// import getTaskCategorey from 'services/common/Taskmanagement/TaskCategorey'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import InsertTasktemplatedetails from 'services/common/Taskmanagement/InsertTaskTempDetailService'
// import getEmployeeDropDownDataService from 'services/common/getEmployeeDropDownDataService'
import getEmployeeDropDownDataService from 'services/common/AssignTeamGetDtlService'
import TaskDtlRetriveService from 'services/common/Taskmanagement/TaskDtlRetriveService'
import ButtonComponent from 'components/shared/ButtonComponent'
// import DropDownComponent from 'components/shared/DropDownComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import messageReturn from '_helpers/messageReturn'
// import TableComponent from '../TableComponent'

const SubTaskAddDocument = ({
  handleCancel,
  isModalVisible,
  submit,
  dependentTeHdrId,
  pmId,
  docFile,
}) => {
  const { Option } = Select
  const [inputForm] = Form.useForm()
  const [qtyForm] = Form.useForm()

  console.log(dependentTeHdrId)
  const employeID = store.get('employeeId')
  const Tab = store.get('Tab')
  const projectid = store.get('ProjectID')
  const { tenantId, mstId, processCode } = Tab
  const [taskTypeData, setTaskTypeData] = useState([])
  const [taskType, setTaskType] = useState(undefined)
  const [taskTypeCode, setTaskTypeCode] = useState(undefined)
  const [actName, setActName] = useState(undefined)
  const [actCode, setActCode] = useState(undefined)
  const [actNameData, setActNameData] = useState([])
  const [taskCategorydata, setTaskCategorydata] = useState([])
  const [taskCategory, setTaskCategory] = useState(undefined)
  const [taskCategoryCode, setTaskCategoryCode] = useState(undefined)
  const [employeeData, setEmployeeData] = useState([])
  const [retrivaldata, setRetrivaldata] = useState([])
  const [responsedata, setResponsedata] = useState([])

  const [responseOk, setResponseOk] = useState(false)
  const [duedDate, setDuedDate] = useState(moment().format('YYYY-MM-DD'))
  const [planDate, setPlanDate] = useState(moment().format('YYYY-MM-DD'))

  const [submitBtnDisable, setSubmitBtnDisable] = useState(false)
  const tthdrid = ''

  const emptyTemp = {
    activityName: '',
    assignTo: '',
    ttDtlId: '',
    tenantId,
    plannedStartDate: moment(planDate).format('YYYY-MM-DD'),
    dueDate: moment(duedDate).format('YYYY-MM-DD'),
    teDtlId: '',
    qty: '',
    sno: 1,
  }

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

    if (httpResponsedp) {
      const typecoderesp = httpResponsedp.responseData
      console.log(typecoderesp)
      const options = typecoderesp?.map(item => ({
        key: item.ttCode,
        value: item.ttDesc,
      }))
      setTaskTypeData(options)
      console.log('taskTypeData---> ', taskTypeData)
      console.log('options---> ', options)
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
        console.log('taskTypeData---> ', employeeData)
        console.log('options---> ', options)
      }
    }
  }

  const fetchTaskCatDropdowndata = async tskcd => {
    setTaskCategory(undefined)
    setActName(undefined)
    setActNameData([])
    setRetrivaldata([])
    // const httpResponsedp = await getTaskCategorey({
    //   typeCode: tskcd,
    //   tenantId,
    // })
    // if (httpResponsedp) {
    //   const typecoderesp = httpResponsedp.responseData
    //   console.log('fetchTaskCatDropdowndata--> ', typecoderesp)
    // }
    console.log(tskcd)
    const keyareaobj = {
      tenantId,
      pmHdrId: projectid,
      taskTypeCode: tskcd,
    }
    const response = await indentFileUpload({
      requestPath: 'getTaskCategoryByPmHdrId  ',
      requestData: keyareaobj,
    })
    if (response) {
      const typecoderesp = response?.responseData
      const options = typecoderesp.map(item => ({
        key: item.taskCategoryCode,
        value: item.taskDesc,
      }))
      setTaskCategorydata(options)
    }
  }

  const handleActivityChange = (index, e) => {
    const newData = [...retrivaldata]
    newData[index].activityName = e.target.value
    setRetrivaldata(newData)
  }

  const handlegetdetailsonchange = key => {
    console.log('handlegetdetailsonchange')
    clearform()
    setResponseOk(false)

    setRetrivaldata([])

    const activity = responsedata.find(item => item.teDtlId === key)
    const dueDateFromResponse = activity ? activity?.dueDate : null
    const plannedStartdate = activity ? activity?.plannedStartDate : null

    if (dueDateFromResponse) {
      emptyTemp.dueDate = dueDateFromResponse
      emptyTemp.plannedStartDate = plannedStartdate
      setPlanDate(moment(plannedStartdate))
      setDuedDate(moment(dueDateFromResponse))
    }
    setRetrivaldata([emptyTemp])
    setResponseOk(true)
  }

  // const handletableclr=()=>{
  //   console.log('handletableclr')
  //   setRetrivaldata([])
  //   inputForm.resetFields()
  //   qtyForm.resetFields()
  //   setRetrivaldata([emptyTemp])

  // }

  //   const handlegetDtlSubmit = async () => {
  //     if (taskCategoryCode !== undefined && taskTypeCode !== undefined) {
  //       const getTemprop = {
  //         tenantId,
  //       }

  //       const httpResponsedp = await getTemplateDetails(getTemprop)
  //       if (httpResponsedp) {
  //         console.log('getTemplateDetails---> ', httpResponsedp)
  //         if (httpResponsedp.responseData.length > 0) {
  //           setTthdrid(httpResponsedp.responseData[0].ttHdrId)
  //         } else {
  //           setTthdrid('')
  //         }
  //         const newData = httpResponsedp.responseData.map(data => {
  //           return {
  //             activityName: data.activityName,
  //             assignTo: '',
  //             ttDtlId: data.ttDtlId,
  //             plannedStartDate: moment().format('YYYY-MM-DD'),
  //             dueDate: moment().format('YYYY-MM-DD'),
  //             teDtlId: '',
  //             tenantId,
  //           }
  //         })
  //         setRetrivaldata([...newData, emptyTemp])
  //       }
  //     } else {
  //       setRetrivaldata([])
  //       messageReturn(405)
  //     }
  //     console.log('handlegetDtlSubmit--->')
  //   }

  const fetchActivityDropdowndata = async (type, catcode) => {
    console.log('fetchActivityDropdowndata---->', type, catcode)
    const retriveprop = {
      tenantId,
      typeCode: type,
      masterId: mstId,
      categoryCode: catcode,
      empId: employeID,
      dependentDtlId: '',
      docTypeCode: docFile,
      pmId,
    }
    setActName(undefined)
    setActNameData([])
    setRetrivaldata([])
    inputForm.resetFields()
    qtyForm.resetFields()
    const httpRetriveresponse = await TaskDtlRetriveService(retriveprop)
    if (httpRetriveresponse.responseMessage === '200') {
      const typecoderesp = httpRetriveresponse.responseData
      setResponsedata(typecoderesp)
      // const dueDateFromResponse = httpRetriveresponse.responseData?.[0]?.dueDate

      const options = typecoderesp.map(item => ({
        key: item.teDtlId,
        value: item.activityName,
      }))
      setActNameData(options)
    } else {
      messageReturn(619)
    }
  }

  const handleAssignToChange = (index, value, option) => {
    const newData = [...retrivaldata]
    if (option !== undefined) {
      newData[index].assignTo = option.key
    }
    newData[index].assignToDesc = value
    // setRetrivaldata(newData)
  }
  // const handlePlanStartDateChange = (index, dateString, record) => {
  //   const newData = [...retrivaldata]
  //   newData[index].plannedStartDate = dateString
  //   qtyForm.setFieldsValue({
  //     [`plannedStartDate${record.sno}`]: moment(dateString),
  //   })
  //   // setRetrivaldata(newData)
  // }

  const handlePlanStartDateChange = (index, dateString, record) => {
    console.log(index, dateString, ' handlePlanStartDateChange')
    const newData = [...retrivaldata]
    const fromdate = dateString
    const todate = newData[index].dueDate
    if (fromdate && todate && todate < fromdate) {
      messageReturn(620)
      qtyForm.setFieldsValue({
        [`dueDate${record.sno}`]: moment(dateString),
      })
      newData[index].plannedStartDate = dateString
      newData[index].dueDate = dateString
      return
    }
    newData[index].plannedStartDate = dateString

    qtyForm.setFieldsValue({
      [`plannedStartDate${record.sno}`]: moment(dateString),
    })
    // setRetrivaldata(newData)
  }
  // const handleDueDateChange = (index, dateString) => {
  //   const newData = [...retrivaldata]
  //   newData[index].dueDate = dateString
  //   newData[index].plannedCompletedDate = dateString

  //   setRetrivaldata(newData)
  // }

  const handleDueDateChange = (index, dateString, record) => {
    console.log(index, dateString, record, ' handleDueDateChange')
    const newData = [...retrivaldata]
    newData[index].dueDate = dateString

    const newDueDate = moment(dateString)
    if (moment(newData[index].plannedStartDate).isAfter(newDueDate)) {
      messageReturn(621)
      newData[index].plannedStartDate = dateString
      newData[index].dueDate = dateString
      qtyForm.setFieldsValue({
        [`plannedStartDate${record.sno}`]: moment(dateString),
      })
    }
    qtyForm.setFieldsValue({
      [`dueDate${record.sno}`]: moment(dateString),
    })
    // setRetrivaldata(newData)
  }

  console.log('retrivaldata---> ', retrivaldata)

  const handleClear = () => {
    clearform()
    setTaskType(undefined)
    setTaskCategory(undefined)
    setTaskCategoryCode(undefined)
    setTaskTypeCode(undefined)
    setActCode(undefined)
    setActName(undefined)
    setActNameData([])
    setResponseOk(false)
    setRetrivaldata([])
  }

  const handleQtyChange = (index, e) => {
    console.log('handleQtyChange------> ')
    const newData = [...retrivaldata]
    newData[index].qty = e.target.value
    setRetrivaldata(newData)
  }

  const handleAddRow = index => {
    const newData = [...retrivaldata]
    if (
      newData[index].activityName !== '' &&
      newData[index].assignToDesc !== '' &&
      newData[index].assignTo !== '' &&
      newData[index].plannedStartDate !== '' &&
      newData[index].dueDate !== '' &&
      newData[index].qty !== ''
    ) {
      const maxSno = newData.reduce((max, data) => Math.max(max, data.sno), 0)
      const emptyTemps = {
        activityName: '',
        assignTo: '',
        ttDtlId: '',
        tenantId,
        plannedStartDate: moment(planDate).format('YYYY-MM-DD'),
        dueDate: moment(duedDate).format('YYYY-MM-DD'),
        teDtlId: '',
        qty: '',
        sno: maxSno + 1,
      }

      setRetrivaldata([...retrivaldata, emptyTemps])
      inputForm.resetFields()
    } else {
      messageReturn(405)
    }

    console.log('handleAddRow')
  }

  const handleRemoveRow = indexToRemove => {
    setRetrivaldata(prevData => prevData.filter((_, index) => index !== indexToRemove))
    console.log('handleRemoveRow')
  }

  const handleinsertSubmit = async () => {
    setSubmitBtnDisable(true)
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
        entry.qty === '',
    )
    if (hasEmptyValues) {
      messageReturn(405)
    } else {
      const newInsert = {
        employeID,
        dependentTeHdrId: actCode,
        masterId: mstId,
        ttHdrId: tthdrid,
        taskCategoryCode,
        taskTypeCode,
        tenantId,
        pmHdrId: projectid,
        taskEntryDtl: filteredData,
      }

      const httpResponseInsert = await InsertTasktemplatedetails(newInsert)
      if (httpResponseInsert.responseCode === '200') {
        console.log('handleinsertSubmit newInsert ---> ', httpResponseInsert.responseData)
        message.success(httpResponseInsert.responseMessage)
        clearform()
        submit('insertdone')
        setSubmitBtnDisable(false)
      } else {
        message.error(httpResponseInsert.responseMessage)
        setSubmitBtnDisable(false)
      }
      console.log('handleinsertSubmit newInsert ---> ', newInsert, httpResponseInsert)
    }
    setSubmitBtnDisable(false)
  }

  const handleTaskTypeOnChange = async (type, value, key) => {
    console.log('handleTaskTypeChange---> ', value, key)
    console.log('taskcat--> ', type)
    console.log('Submitted taskCategory:', taskCategory)
    console.log('Submitted taskTempCode:', taskTypeCode, taskCategoryCode, actCode)
    if (type === 'tasktype') {
      fetchTaskCatDropdowndata(key)
    }
    if (type === 'taskcat') {
      fetchActivityDropdowndata(taskTypeCode, key)
    }
    if (type === 'actName') {
      console.log('Submitted actName:', key)
      handlegetdetailsonchange(key)
    }
  }
  const handleInputChanged = (index, value) => {
    const newData = [...retrivaldata]
    newData[index].assignToDesc = value
    setRetrivaldata(newData)
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
          <Form form={inputForm}>
            <Form.Item name="inputfield">
              <Input
                // value={activityNames[index]}
                value={text}
                onBlur={e => handleActivityChange(index, e)}
                placeholder="Type here..."
                style={{ width: '300px' }}
                name="inputfield"
                maxLength={2056}
                // type="text"
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
      width: '15%',
      render: (text, record, index) => (
        // <DropDownComponent
        //   data={employeeData}
        //   value={text}
        //   onChange={() => handleAssignToChange(index, text)}
        //   onSelect={(value, option) => handleAssignToChange(index, value, option)}
        // />
        <Form form={qtyForm}>
          <Form.Item name={`assignto${record.sno}`} initialValue={record.assignToDesc}>
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
    // {
    //   title: (
    //     <>
    //       <span>Plan.Start Date </span>
    //       <span style={{ color: 'red' }}>*</span>
    //     </>
    //   ),
    //   dataIndex: 'plannedStartDate',
    //   key: 'plannedStartDate',
    //   width: '15%',
    //   render: (text, record, index) => (
    //     <DatePicker
    //       value={text ? moment(text) : moment()}
    //       onChange={(date, dateString) => handlePlanStartDateChange(index, dateString)}
    //       format="YYYY-MM-DD"
    //       disabledDate={d => !d || d.isAfter(moment(record.dueDate))}
    //     />
    //   ),
    // },

    {
      title: (
        <>
          <span>Plan.Start Date </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      width: '15%',
      render: (text, record, index) => {
        // if (moment(record.dueDate).isAfter(record.plannedStartDate)) {
        //   return (
        //     <DatePicker
        //       value={moment(record.text)}
        //       onChange={(date, dateString) => handlePlanStartDateChange(index, dateString,record)}
        //       format="YYYY-MM-DD"
        //       disabledDate={d =>
        //         !d ||
        //         d.isBefore(moment(record.plannedStartDate)) ||
        //         d.isAfter(moment(record.dueDate))
        //       }
        //       style={{ marginBottom: '24px' }}
        //     />
        //   )
        // }

        return (
          <Form form={qtyForm} style={{ marginTop: '20px' }}>
            <Form.Item
              name={`plannedStartDate${record.sno}`}
              initialValue={planDate ? moment(planDate) : moment()}
            >
              <DatePicker
                value={record.plannedStartDate ? moment(record.plannedStartDate) : moment()}
                onChange={(date, dateString) =>
                  handlePlanStartDateChange(index, dateString, record)
                }
                format="YYYY-MM-DD"
                disabledDate={d => !d || d.isBefore(planDate) || d.isAfter(duedDate)}
              />
            </Form.Item>
          </Form>
        )
        // return (
        //   <DatePicker
        //     value={record.dueDate ? moment(record.dueDate) : moment()}
        //     onChange={(date, dateString) => handlePlanStartDateChange(index, dateString,record)}
        //     format="YYYY-MM-DD"
        //     disabledDate={d =>
        //       !d || d.isBefore(moment(record.plannedStartDate)) || d.isAfter(moment(record.dueDate))
        //     }
        //     style={{ marginBottom: '24px' }}
        //   />
        // )
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
      width: '15%',
      render: (text, record, index) => {
        return (
          <Form form={qtyForm} style={{ marginTop: '20px' }}>
            <Form.Item
              name={`dueDate${record.sno}`}
              initialValue={duedDate ? moment(duedDate) : moment()}
            >
              <DatePicker
                value={record.dueDate ? moment(record.dueDate) : moment()}
                onChange={(date, dateString) => handleDueDateChange(index, dateString, record)}
                format="YYYY-MM-DD"
                style={{ marginBottom: '24px', color: 'black' }}
                disabledDate={d => !d || d.isBefore(planDate) || d.isAfter(duedDate)}
              />
            </Form.Item>
          </Form>
        )
      },
    },
    {
      title: (
        <>
          <span>Qty </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'qty',
      key: 'qty',
      width: '10%',
      render: (text, record, index) => (
        <Form form={qtyForm}>
          <Form.Item name={`qtyfield${record.sno}`} initialValue={record.qty}>
            <Input
              value={record.qty}
              onBlur={e => handleQtyChange(index, e)}
              placeholder="Type here..."
              type="number"
              name="qtyfieldvalue"
            />
          </Form.Item>
        </Form>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: '15%',
      render: (text, record, index) => (
        <Space style={{ marginBottom: '24px' }}>
          {index === retrivaldata.length - 1 && (
            <AddIconButton onClick={() => handleAddRow(index)} />
          )}
          {index !== retrivaldata.length - 1 && (
            <RemoveIcon onClick={() => handleRemoveRow(index)} />
          )}
        </Space>
      ),
    },
  ]

  const clearform = () => {
    inputForm.resetFields()
    qtyForm.resetFields()
    setRetrivaldata([])
  }

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
                showSearch
                placeholder="Select Task Category"
                id="taskCategory"
                style={{ marginRight: '10px', width: '100%' }}
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
              <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="activityname">
                Parent Activity <span style={{ color: 'red' }}>*</span>
              </p>
              <Select
                value={actName}
                onChange={(value, option) => {
                  setActName(value)
                  setActCode(option.key)
                  handleTaskTypeOnChange('actName', value, option.key)
                }}
                placeholder="Select Activity Name"
                id="activityname"
                style={{ marginRight: '10px', width: '100%' }}
                showSearch
              >
                {/* Placeholder option */}
                {actNameData?.map(item => (
                  <Option key={item.key} value={item.value}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '25px', justifyContent: 'center' }}>
            {/* <ButtonComponent
              text="Get Details"
              type="primary"
              marginright="10px"
             St
              onClick={handlegetDtlSubmit}
            /> */}
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
          disable={submitBtnDisable}
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
      text="Create Sub Task"
      onCancel={() => {
        clearform()
        handleCancel()
      }}
      width="900"
    />
  )
}

export default SubTaskAddDocument
