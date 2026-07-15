import React, { useState, useEffect, useRef } from 'react'
import store from 'store'
import moment from 'moment'
import { Select, Button } from 'antd'
import { Table } from 'ant-table-extensions'
import { PlusOutlined, FileTwoTone, FileExcelOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import getTaskType from 'services/common/Taskmanagement/Tasktype'
import TaskDtlRetriveService from 'services/common/Taskmanagement/TaskDtlRetriveService'
// import getTaskCategorey from 'services/common/Taskmanagement/TaskCategorey'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
import BackButtonComponent from '../BackBtnComponent'
import SubTaskAddDocument from '../SubTaskAddDocument'
// import TableComponent from '../TableComponent'
import DownloadModalview from '../FileDownloadModalView'
import currentDateTime from '../../../currentDateTime'

const SubTaskManagement = ({ dependentTeHdrId, pmId, uploadFile, docFile }) => {
  const employeID = store.get('employeeId')
  const ProjectID = store.get('ProjectID')
  const Tab = store.get('Tab')
  const { Option } = Select
  const { tenantId, isEditable, stgCode, mstId, docTypeCode } = Tab
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [taskTypeData, setTaskTypeData] = useState([])
  const [taskType, setTaskType] = useState(undefined)
  const [taskTypeCode, setTaskTypeCode] = useState(undefined)
  const [taskCategorydata, setTaskCategorydata] = useState([])
  const [taskCategory, setTaskCategory] = useState(undefined)
  const [taskCategoryCode, setTaskCategoryCode] = useState(undefined)
  const [actName, setActName] = useState(undefined)
  const [actCode, setActCode] = useState(undefined)
  const [actNameData, setActNameData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [isdownloadmodalvisible, setIsdownloadmodalvisible] = useState(false)
  const [taskdetailId, setTaskdetailId] = useState('')
  const [activityName, setActivityName] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [completion, setCompletion] = useState('')
  const [approvalseq, setApprovalseq] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('')
  const [isApproval, setIsApproval] = useState('')
  const [assignemp, setAssignemp] = useState('')
  const [docStatus, setDocStatus] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [qty, setQty] = useState('')
  const [singlerecord, setsinglerecord] = useState(null)
  const [createTask, setCreateTask] = useState(true)
  const enquiryarr = store.get('Enquiry')

  useEffect(() => {
    const dueDateObject = enquiryarr.find(item => item.label === 'Due Date')
    const dueDateval = dueDateObject ? dueDateObject.value : null

    if (dueDateval) {
      const currentDate = moment().format('DD-MM-YYYY')
      const formattedDueDate = moment(dueDateval, 'DD-MMM-YYYY').format('DD-MM-YYYY')

      if (moment(currentDate, 'DD-MM-YYYY').isAfter(moment(formattedDueDate, 'DD-MM-YYYY'))) {
        setCreateTask(false)
      }
    }
  }, [enquiryarr])

  useEffect(() => {
    fetchTypeDropdowndata()
  }, [])
  const completionRef = useRef({})
  const fetchTypeDropdowndata = async () => {
    const httpResponsedp = await getTaskType({
      empId: employeID,
      tenantId,
      pmId,
    })
    setTaskCategory(undefined)
    setActName(undefined)
    setActNameData([])
    setOriginalData([])
    if (httpResponsedp) {
      const typecoderesp = httpResponsedp.responseData
      const options = typecoderesp?.map(item => ({
        key: item.ttCode,
        value: item.ttDesc,
      }))
      setTaskTypeData(options)
    } else {
      messageReturn(311)
    }
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handlefileDownloadmodal = (
    dtlid,
    activyname,
    assignto,
    duedate,
    comple,
    seq,
    staus,
    appvl,
    docusts,
    qtyval,
    record,
    emp,
  ) => {
    setTaskdetailId(dtlid)
    setActivityName(activyname)
    setAssignedTo(assignto)
    setDueDate(moment(duedate).format('DD-MMM-YYYY'))
    setCompletion(comple)
    setApprovalStatus(staus)
    setApprovalseq(seq)
    setIsApproval(appvl)
    setDocStatus(docusts)
    setQty(qtyval)
    setIsdownloadmodalvisible(true)
    setsinglerecord(record)
    setAssignemp(emp)
  }

  const handleDownloadModalCancel = () => {
    setIsdownloadmodalvisible(false)
    handlegetDtlSubmit()
  }

  const fetchTaskCatDropdowndata = async tskcd => {
    setTaskCategory(undefined)
    setActName(undefined)
    setActNameData([])
    // const httpResponsedp = await getTaskCategorey({
    //   typeCode: tskcd,
    //   tenantId,
    // })
    // if (httpResponsedp) {
    //   const typecoderesp = httpResponsedp.responseData
    // }
    const keyareaobj = {
      tenantId,
      pmHdrId: ProjectID,
      taskTypeCode: tskcd,
    }
    const response = await indentFileUpload({
      requestPath: 'getTaskCategoryByPmHdrId  ',
      requestData: keyareaobj,
    })
    if (response) {
      const typecoderesp = response?.responseData
      const options = typecoderesp?.map(item => ({
        key: item.taskCategoryCode,
        value: item.taskDesc,
      }))
      setTaskCategorydata(options)
    }
  }

  // const saveFunction = async taskId => {
  //   let completionValue = completionRef.current[taskId]

  //   if (completionValue === undefined) {
  //     const originalDataItem = originalData.find(item => item.taskentrydtlid === taskId)
  //     if (originalDataItem) {
  //       completionValue = originalDataItem.completion
  //     }
  //   }
  //   const updateprop = {
  //     teDtlId: taskId,
  //     ptgVal: completionValue,
  //   }
  //   const httpResponseCmp = await UpdateCompletionpercent(updateprop)

  //   if(httpResponseCmp){
  //   }
  // }
  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      // const dateSp = dateStringval.split('-');
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  const type1 = []
  const category1 = []
  const assignto1 = []
  const pstartdate1 = []
  const duedate1 = []
  const status1 = []

  originalData.map(h => {
    return type1.push(h.tasktype)
  })
  originalData.map(h => {
    return category1.push(h.taskcat)
  })
  originalData.map(h => {
    return assignto1.push(h.assignto)
  })
  originalData.map(h => {
    return pstartdate1.push(h.planstart)
  })
  originalData.map(h => {
    return duedate1.push(h.duedate)
  })
  originalData.map(h => {
    return status1.push(h.status)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const type2 = type1.filter(distinct)
  const category2 = category1.filter(distinct)
  const assignto2 = assignto1.filter(distinct)
  const pstartdate2 = pstartdate1.filter(distinct)
  const duedate2 = duedate1.filter(distinct)
  const status2 = status1.filter(distinct)

  const type3 = []
  const category3 = []
  const assignto3 = []
  const pstartdate3 = []
  const duedate3 = []
  const status3 = []

  type2.map(element => {
    return type3.push({
      text: element,
      value: element,
    })
  })
  category2.map(element => {
    return category3.push({
      text: element,
      value: element,
    })
  })
  assignto2.map(element => {
    return assignto3.push({
      text: element,
      value: element,
    })
  })
  pstartdate2.map(element => {
    return pstartdate3.push({
      text: dateformatter(element),
      value: element,
    })
  })
  duedate2.map(element => {
    return duedate3.push({
      text: dateformatter(element),
      value: element,
    })
  })
  status2.map(element => {
    return status3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Activity',
      dataIndex: 'taskdesc',
      key: 'taskdesc',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignto',
      key: 'assignto',
      filters: assignto3,
      filteredValue: filtersinfo.assignto,
      onFilter: (value, record) => record?.assignto === value,
    },
    {
      title: 'Type',
      dataIndex: 'tasktype',
      key: 'tasktype',
      filters: type3,
      filteredValue: filtersinfo.tasktype,
      onFilter: (value, record) => record?.tasktype === value,
    },
    {
      title: 'Category',
      dataIndex: 'taskcat',
      key: 'taskcat',
      filters: category3,
      filteredValue: filtersinfo.taskcat,
      onFilter: (value, record) => record?.taskcat === value,
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
    },

    {
      title: 'Plan.Start Date',
      dataIndex: 'planstart',
      key: 'planstart',
      render: text => <a>{dateformatter(text)}</a>,
      filters: pstartdate3,
      filteredValue: filtersinfo.planstart,
      onFilter: (value, record) => moment(record.planstart).isSame(moment(value), 'day'),
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      key: 'duedate',
      render: text => <a>{dateformatter(text)}</a>,
      filters: duedate3,
      filteredValue: filtersinfo.duedate,
      onFilter: (value, record) => moment(record.duedate).isSame(moment(value), 'day'),
    },
    {
      title: 'Act.Start Date',
      dataIndex: 'actstartdate',
      key: 'actstartdate',
    },
    {
      title: 'Act.End Date',
      dataIndex: 'actenddate',
      key: 'actenddate',
    },
    {
      title: 'Delay Days',
      dataIndex: 'delaydays',
      key: 'delaydays',
      render: (text, record) => {
        const diff = record.actenddate
          ? moment(record.actenddate).diff(moment(record.duedate), 'days')
          : moment().diff(moment(record.duedate), 'days')
        return diff <= 0 ? 'NA' : diff
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: status3,
      filteredValue: filtersinfo.status,
      onFilter: (value, record) => record?.status === value,
      render: text => text,
      onCell: record => {
        const diff = record.actenddate
          ? moment(record.actenddate).diff(moment(record.duedate), 'days')
          : moment().diff(moment(record.duedate), 'days')
        const style =
          diff > 0
            ? { backgroundColor: 'red', color: 'white' }
            : record.isCompleted === '1'
            ? { backgroundColor: 'green', color: 'white' }
            : {}
        return { style }
      },
    },
    {
      title: 'Compl. %',
      dataIndex: 'completion',
      key: 'completion',
    },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent
            type="primary"
            onClick={() =>
              handlefileDownloadmodal(
                record.taskentrydtlid,
                record.taskdesc,
                record.assignto,
                record.duedate,
                record.completion,
                record.approvalSeq,
                record.approvalStatus,
                record.isApproval,
                record.docStatus,
                record.qty,
                record,
                record.assignemp,
              )
            }
            icon={<FileTwoTone />}
            // size="small"
          />

          <span style={{ margin: '0 8px' }} />
          {/* <ButtonComponent
            type="primary"
            text="Save"
            onClick={() => saveFunction(record.taskentrydtlid, record.completion)}
          /> */}
          <span style={{ margin: '0 8px' }} />
          {/* {record.isApproval === 'True' && isEditable === '1' && ( */}
          {/* <ButtonComponent type="primary" text="Approve" onClick={() => {}} /> */}
          {/* )} */}
        </div>
      ),
    },
  ]
  const handleExportCSV = () => {
    const csvData = originalData.map(row => {
      const diff = row.actenddate
        ? moment(row.actenddate).diff(moment(row.duedate), 'days')
        : moment().diff(moment(row.duedate), 'days')
      const delayDays = diff <= 0 ? 'NA' : diff

      const rowData = columns.slice(0, -1).map(col => {
        const cellData = col.dataIndex === 'delaydays' ? delayDays : row[col.dataIndex]
        return cellData === null || cellData === 'null' ? '-' : cellData
      })
      return rowData.join(',')
    })

    const csvContent = [
      columns
        .slice(0, -1)
        .map(col => col.title)
        .join(','),
      ...csvData,
    ].join('\n')

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Design_Sub_Task_${currentDateTime}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handlegetDtlSubmit = async () => {
    if (taskTypeCode !== undefined && taskCategoryCode !== undefined && actCode !== undefined) {
      const retriveprop = {
        tenantId,
        typeCode: taskTypeCode,
        masterId: mstId,
        categoryCode: taskCategoryCode,
        empId: employeID,
        dependentDtlId: actCode,
        docTypeCode: docFile,
        pmId,
      }
      const httpRetriveresponse = await TaskDtlRetriveService(retriveprop)
      if (httpRetriveresponse?.responseData?.length > 0) {
        const newData = httpRetriveresponse.responseData.map((data, index) => {
          return {
            sno: index + 1,
            tasktype: data.ttDesc,
            taskcat: data.tcDesc,
            taskdesc: data.activityName,
            planstart:
              data.plannedStartDate != null
                ? moment(data.plannedStartDate).format('DD-MMM-YYYY')
                : '',
            actstartdate:
              data.actualStartDate != null
                ? moment(data.actualStartDate).format('DD-MMM-YYYY')
                : '',
            actenddate:
              data.completedDate != null ? moment(data.completedDate).format('DD-MMM-YYYY') : '',
            duedate: data.dueDate != null ? moment(data.dueDate).format('DD-MMM-YYYY') : '',
            status: data.approvalStatusDesc,
            completion: data.completePtg,
            taskentryhdrid: data.teHdrId,
            taskentrydtlid: data.teDtlId,
            assignto: data.assignToDesc,
            approvalStatus: data.approvalStatus,
            isApproval: data.isApproval,
            approvalSeq: data.approvalSeq,
            docStatus: data.docStatusMst,
            qty: data.qty != null ? data.qty : '',
            teHdrId: data.teHdrId,
            isCompleted: data.isCompleted,
            assignemp: data.assignTo,
          }
        })

        setOriginalData(newData)

        const completionRefCopy = { ...completionRef.current }
        Object.keys(completionRefCopy).forEach(taskId => {
          completionRefCopy[taskId] = undefined
        })
        completionRef.current = completionRefCopy
      } else {
        messageReturn(311)
      }
    } else {
      setOriginalData([])
      messageReturn(405)
    }
  }

  // retrievaldata.map(h => {
  //   const timefor = moment(h.fileCreatedDate).format('DD-MMM-YYYY HH:mm')
  //   return origionalData.push({
  //     dmId: h.dmId,
  //     stgDescription: h.stgDescription,
  //     documentTypeDescription: h.documentTypeDescription,
  //     documentName: h.documentName,
  //     access: h.access,
  //     dateTime: timefor,
  //     empName: h.empName,
  //   })
  // })

  const handleSubmit = () => {
    handleCancel()
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const fetchActivityDropdowndata = async (type, catcode) => {
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
    setOriginalData([])
    const httpRetriveresponse = await TaskDtlRetriveService(retriveprop)
    if (httpRetriveresponse.responseMessage === '200') {
      const typecoderesp = httpRetriveresponse.responseData

      const options = typecoderesp.map(item => ({
        key: item.teDtlId,
        value: item.activityName,
      }))
      setActNameData(options)
    } else {
      messageReturn(311)
    }
  }

  const handleTaskTypeOnChange = async (type, value, key) => {
    if (type === 'tasktype' && value !== 'getAll') {
      setTaskCategoryCode(undefined)
      setActCode(undefined)
      fetchTaskCatDropdowndata(key)
    } else if (type === 'tasktype' && value === 'getAll') {
      setTaskCategory(value)
      setTaskCategoryCode(key)
      setActCode(key)
      setActName('Get All')
    }
    if (type === 'taskcat' && value !== 'getAll') {
      fetchActivityDropdowndata(taskTypeCode, key)
      setActCode(undefined)
    } else if (type === 'taskcat' && value === 'getAll') {
      setActCode(key)
      setActName('Get All')
    }
  }

  const handleClear = () => {
    setTaskType(undefined)
    setTaskCategory(undefined)
    setTaskCategoryCode(undefined)
    setTaskTypeCode(undefined)
  }

  return (
    <div style={{ width: '100%', maxWidth: '100vw', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h5>Sub Task Management</h5>
        {isEditable === '1' && createTask ? (
          <ButtonComponent
            text="Create Sub Task"
            type="primary"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={showModal}
          />
        ) : null}
        <SubTaskAddDocument
          submit={handleSubmit}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
          dependentTeHdrId={dependentTeHdrId}
          pmId={pmId}
          docFile={docFile}
        />
      </div>

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
            >
              <Option key="getAll" value="getAll">
                Get All
              </Option>
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
            >
              <Option key="getAll" value="getAll">
                Get All
              </Option>
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
            >
              <Option key="getAll" value="getAll">
                Get All
              </Option>
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
          <ButtonComponent
            text="Get Details"
            type="primary"
            marginright="10px"
            onClick={handlegetDtlSubmit}
          />
          <ButtonComponent text="Clear" type="primary" marginright="10px" onClick={handleClear} />
        </div>
      </div>
      <Button
        type="primary"
        exportableProps={{
          fileName: `Design_Sub_Task${currentDateTime}`,
          btnProps: {
            type: 'primary',
            icon: <FileExcelOutlined />,
            children: <span>Export to CSV</span>,
          },
        }}
        onClick={handleExportCSV}
        style={{ marginTop: '10px' }}
      >
        Export to CSV
      </Button>

      <div style={{ marginTop: '10px', width: '100%', overflowX: 'auto' }}>
        {/* <TableComponent columns={columns} data={originalData} /> */}
        <Table
          columns={columns}
          dataSource={originalData}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [originalData?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          onChange={handleChange}
        />
      </div>

      <div>
        <BackButtonComponent componentToRender="design" />
      </div>
      {isdownloadmodalvisible ? (
        <DownloadModalview
          isDownloadlmodal={isdownloadmodalvisible}
          stageCode={stgCode}
          referenceCode={taskdetailId}
          handleCancel={handleDownloadModalCancel}
          activityName={activityName}
          assignedTo={assignedTo}
          dueDate={dueDate}
          completion={completion}
          approvalSeq={approvalseq}
          approvalStatus={approvalStatus}
          isApproval={isApproval}
          docStatus={docStatus}
          uploaddoctype={uploadFile}
          docTypeCode={docTypeCode}
          isFlag="0"
          Qty={qty}
          singlerow={singlerecord}
          assignemp={assignemp}
        />
      ) : null}
    </div>
  )
}

export default SubTaskManagement
