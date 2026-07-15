import React, { useState, useEffect, useRef } from 'react'
import store from 'store'
import moment from 'moment'
// import { Select } from 'antd'
import { Table } from 'ant-table-extensions'
import ApproveOrReject from 'components/common/ApproveRejectBtnComponent'
import { PlusOutlined, FileTwoTone, FileExcelOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import getTaskType from 'services/common/Taskmanagement/Tasktype'
import TaskDtlRetriveService from 'services/common/Taskmanagement/TaskDtlRetriveService'
// import getTaskCategorey from 'services/common/Taskmanagement/TaskCategorey'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
import AutoCompleteComponent from 'components/shared/AutoCompleteComponent'
import DropDownComponent from '../../shared/DropDownComponent'
import TaskAddNewDocument from '../TaskAddDocument'
// import TableComponent from '../TableComponent'
import DownloadModalview from '../FileDownloadModalView'
import ModalPopup from '../../shared/ModalPopupComponent'
import currentDateTime from '../../../currentDateTime'

const Taskmanagement = ({ backcomponent, pmId, uploadFile, docFile }) => {
  const employeID = store.get('employeeId')
  const Tab = store.get('Tab')
  const ProjectID = store.get('ProjectID')
  // const { Option } = Select
  const { tenantId, docTypeCode, isEditable, stgCode, slaveId } = Tab
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [taskTypeData, setTaskTypeData] = useState([])
  const [taskType, setTaskType] = useState('Get All')
  const [taskTypeCode, setTaskTypeCode] = useState('getAll')
  const [taskCategorydata, setTaskCategorydata] = useState([])
  const [taskCategory, setTaskCategory] = useState('Get All')
  const [taskCategoryCode, setTaskCategoryCode] = useState('getAll')
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
  const [docStatus, setDocStatus] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [qty, setQty] = useState('')
  const [requrirement, setRequirement] = useState('')
  const [singlerecord, setsinglerecord] = useState(null)
  const [assignemp, setassignemp] = useState('')
  const [taskView, setTaskView] = useState(false)
  const [taskData, setTaskData] = useState([])
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
    handlegetDtlSubmit()
  }, [])
  const completionRef = useRef({})
  const fetchTypeDropdowndata = async () => {
    const httpResponsedp = await getTaskType({
      empId: employeID,
      tenantId,
      pmId,
    })
    setOriginalData([])
    if (httpResponsedp) {
      const typecoderesp = httpResponsedp.responseData
      const options = typecoderesp?.map(item => ({
        key: item.ttCode,
        value: item.ttDesc,
      }))
      setTaskTypeData(options)
    }
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
    docStatusMst,
    qtyval,
    req,
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
    setDocStatus(docStatusMst)
    setQty(qtyval)
    setRequirement(req)
    setIsdownloadmodalvisible(true)
    setsinglerecord(record)
    setassignemp(emp)
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleDownloadModalCancel = () => {
    setIsdownloadmodalvisible(false)
    handlegetDtlSubmit()
  }

  const fetchTaskCatDropdowndata = async tskcd => {
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
      const options = [
        { key: 'getAll', value: 'Get All' }, 
        ...typecoderesp?.map(item => ({
          key: item.taskCategoryCode,
          value: item.taskDesc,
        })),
      ];
      setTaskCategorydata(options)
    }
  }

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

  const handleViewTaks = async e => {
    setTaskView(true)
    const keyareaobj = {
      tenantId,
      categoryCode: taskCategoryCode,
      dependentDtlId: e.taskentrydtlid,
      docTypeCode: docFile,
      empId: employeID,
      masterId: Tab.mstId,
      pmId,
      typeCode: taskTypeCode,
    }
    const response = await indentFileUpload({
      requestPath: 'getTaskEntryDtlByDeptDtlId  ',
      requestData: keyareaobj,
    })
    if (response?.responseData) {
      setTaskData(response?.responseData)
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
      width: '4%',
    },
    {
      title: 'Activity',
      dataIndex: 'taskdesc',
      key: 'taskdesc',
      width: '10%',
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
      className: 'right-align-cell',
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
      dataIndex: 'diff',
      key: 'diff',
      className: 'right-align-cell',
    },
    {
      title: 'No of Sub task',
      dataIndex: 'subTaskCount',
      key: 'subTaskCount',
      align: 'right',
      render: (text, record) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleViewTaks(record)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              setTaskView(true)
            }
          }}
          style={{ cursor: text > 0 ? 'pointer' : 'none', color: text > 0 ? 'blue' : 'black' }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: status3,
      filteredValue: filtersinfo.status,
      onFilter: (value, record) => record?.status === value,
      // render: (text, record) => {
      //   const diff = record.actenddate
      //     ? moment(record.actenddate).diff(moment(record.duedate), 'days')
      //     : moment().diff(moment(record.duedate), 'days')
      //   const backgroundColor = diff > 0 ? 'red' : 'green';
      //   return (
      //     <span style={{ backgroundColor, color: backgroundColor === 'red' ? 'white' : 'black', padding: '2px 5px', borderRadius: '3px' }}>
      //       {record.status}
      //     </span>
      //   );
      // }

      render: text => text,
      onCell: record => {
        const diff = record.actenddate
          ? moment(record.actenddate).diff(moment(record.duedate), 'days')
          : moment().diff(moment(record.duedate), 'days')
        const style =
          diff > 0
            ? { backgroundColor: '#ed5d5d', color: 'white' }
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
                record.requrirement,
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

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handlegetDtlSubmit = async () => {
    if (taskTypeCode !== undefined && taskCategoryCode !== undefined) {
      const retriveprop = {
        tenantId,
        typeCode: taskTypeCode,
        masterId: Tab.mstId,
        categoryCode: taskCategoryCode,
        empId: employeID,
        dependentDtlId: '',
        docTypeCode: docFile,
        pmId,
      }
      const httpRetriveresponse = await TaskDtlRetriveService(retriveprop)
      if (httpRetriveresponse?.responseData?.length > 0) {
        const newData = httpRetriveresponse.responseData.map((data, index) => {
          const diff = data.actenddate
            ? moment(data.actenddate).diff(moment(data.duedate), 'days')
            : moment().diff(moment(data.duedate), 'days')
          return {
            diff: diff <= 0 ? '-' : diff,
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
            requrirement: data.requirementFrom != null ? data.requirementFrom : '',
            teHdrId: data.teHdrId,
            subTaskCount: data.subTaskCount != null ? data.subTaskCount : '',
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
    handlegetDtlSubmit()
    handleCancel()
  }
  const handleCancel = insertcheck => {
    setIsModalVisible(false)
    if (insertcheck === 'insertdone') {
      setTaskCategory('Get All')
      setTaskType('Get All')
      setTaskCategoryCode('getAll')
      setTaskTypeCode('getAll')
      handlegetDtlSubmit()
    }
  }

  const handleTaskTypeOnChange = (type, value, key) => {
    if (type === 'tasktype' && value !== 'Get All') {
      fetchTaskCatDropdowndata(key)
    } else if (type === 'tasktype' && value === 'Get All') {
      setTaskCategory(value)
      setTaskCategoryCode(key)
      setTaskCategorydata([])
    } else if (type === 'taskcat' && taskTypeCode === 'getAll') {
      setTaskCategory('Get All')
      setTaskCategoryCode('getAll')
    }
  }

  const handleClear = () => {
    setTaskType(undefined)
    setTaskCategory(undefined)

    setTaskCategorydata([])

    setTaskCategoryCode(undefined)
    setTaskTypeCode(undefined)
  }
  const savedetail = () => {
    if (false) {
      fetchTypeDropdowndata()
    }
  }

  const Taskcolumn = [
    {
      title: 'Activity',
      dataIndex: 'activityName',
      key: 'activityName',
      width: '10%',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignToDesc',
      key: 'assignToDesc',
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
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      width: '5%',
    },
    {
      title: 'Plan.Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      render: text => <span>{text !== null ? moment(text).format('DD-MMM-YYYY') : '-'}</span>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: text => <span>{text !== null ? moment(text).format('DD-MMM-YYYY') : '-'}</span>,
    },
    {
      title: 'Act.Start Date',
      dataIndex: 'actualStartDate',
      key: 'actualStartDate',
      render: text => <span>{text !== null ? moment(text).format('DD-MMM-YYYY') : '-'}</span>,
    },
    {
      title: 'Act.End Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: text => <span>{text !== null ? moment(text).format('DD-MMM-YYYY') : '-'}</span>,
    },
    {
      title: 'Delay Days',
      dataIndex: 'dalaydays',
      key: 'dalaydays',
      width: '10%',
      className: 'right-align-cell',
      render: (text, record) => {
        const diff =
          record.completedDate !== null && record.dueDate !== null
            ? moment(record.completedDate).diff(moment(record.dueDate), 'days')
            : moment().diff(moment(record.dueDate), 'days')
        return diff <= 0 ? 'NA' : diff
      },
    },
    {
      title: 'Compl. %',
      dataIndex: 'completePtg',
      key: 'completePtg',
      width: '8%',
    },
  ]
  const FieldsComponent = () => {
    return (
      <div className="custom_antd_Table" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={Taskcolumn}
          dataSource={taskData}
          // exportableProps={{
          //   fileName: `Design_Task${currentDateTime}`,
          //   btnProps: {
          //     type: 'primary',
          //     icon: <FileExcelOutlined />,
          //     children: <span>Export to CSV</span>,
          //   },
          // }}
          // pagination={{
          //   pageSizeOptions: ['10', '20', '30', '50', [originalData ?.length]],
          //   showSizeChanger: true,
          //   defaultPageSize: 10,
          // }}
          scroll={{ y: 300 }}
          // onChange={handleChange}
          bordered
        />
      </div>
    )
  }
  const handleCancelModal = () => {
    setTaskView(false)
  }
  return (
    <div style={{ width: '100%', maxWidth: '100vw' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h5>Task Management</h5>
        {isEditable === '1' && createTask ? (
          <ButtonComponent
            text="Create Task"
            type="primary"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={showModal}
          />
        ) : null}
        <TaskAddNewDocument
          submit={() => handleSubmit()}
          handleCancel={() => handleCancel()}
          isModalVisible={isModalVisible}
          dependentTeHdrId
          pmId={pmId}
        />
      </div>

      <div>
        <div className="row">
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p style={{ marginRight: '10px' }} htmlFor="taskType">
              Task Type <span style={{ color: 'red' }}>*</span>
            </p>
            <DropDownComponent
              data={[
                { label: 'Get All', value: 'Get All', key: 'getAll' },
                ...taskTypeData?.map(item => ({
                  label: item.value,  
                  value: item.value,
                  key: item.key,
                }))
              ]}
              value={taskType}
              onChange={value => setTaskType(value)}
              onSelect={(value, option) => {
                setTaskType(value);
                setTaskTypeCode(option.key);
                handleTaskTypeOnChange('tasktype', value, option.key);
              }}
              width="100%"
            />
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="taskCategory">
              Task Category <span style={{ color: 'red' }}>*</span>
            </p>
            <AutoCompleteComponent
              data={taskCategorydata} 
              value={taskCategory} 
              onChange={text => setTaskCategory(text)} 
              onSelect={(value, option) => {
                setTaskCategory(value); 
                setTaskCategoryCode(option.key); 
                handleTaskTypeOnChange('taskCategory', value, option.key); 
              }}
              width="100%"
              disableInput={false} 
            />
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
        style={{ marginTop: '10px', width: '100%', overflowX: 'auto' }}
      >
        {/* <TableComponent columns={columns} data={originalData} /> */}
        <Table
          columns={columns}
          dataSource={originalData}
          exportableProps={{
            fileName: `Design_Task${currentDateTime}`,
            btnProps: {
              type: 'primary',
              icon: <FileExcelOutlined />,
              children: <span>Export to CSV</span>,
            },
          }}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [originalData?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 500 }}
          onChange={handleChange}
          bordered
        />
      </div>

      <ApproveOrReject
        refId={slaveId}
        refDoctTyp={docTypeCode}
        tenId={tenantId}
        componentToRender={backcomponent}
        submitFunction={savedetail}
      />
      <ModalPopup
        isModalVisible={taskView}
        FieldsComponent={FieldsComponent}
        text="Task List"
        onCancel={handleCancelModal}
        width="90%"
      />
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
          docTypeCode={docFile}
          isFlag="1"
          requrirement={requrirement}
          Qty={qty}
          singlerow={singlerecord}
          assignemp={assignemp}
        />
      ) : null}
    </div>
  )
}

export default Taskmanagement
