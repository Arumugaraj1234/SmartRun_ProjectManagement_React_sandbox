import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ButtonComponent from 'components/shared/ButtonComponent'
import {
  PlusOutlined,
  CommentOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  UserSwitchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import DropDownComponent from 'components/shared/DropDownComponent'
import AutoCompleteComponent from 'components/shared/AutoCompleteComponent'
// import RequestManagementAdd from 'components/common/RequestManagementAdd'
import { Table } from 'ant-table-extensions'
import { Form, Card, Row, Divider, message, Input, Button, DatePicker, Select } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import ModalPopup from 'components/shared/ModalPopupComponent'
import getDepartmentAndEmployeeDropDownDataService from 'services/common/getDepartmentAndEmployeeDropDownDataService'
import getEmployeeDropDownDataService from 'services/common/getEmployeeDropDownDataService'
import Popuptable from 'components/shared/PopuptableComponent'
import messageReturn from '_helpers/messageReturn'
// import './RequestManagement.scss'

const RequestManagement = () => {
  const { Option } = Select
  const { TextArea } = Input
  const [addremark] = Form.useForm()
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')

  const deptname = store.get('adminname')
  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }
  // const defaultFromDate = moment('2023-04-01', 'YYYY-MM-DD')
  // const defaultToDate = moment('2024-03-31', 'YYYY-MM-DD')
  const [projectList, setProjectList] = useState([])
  const [allqtyForm] = Form.useForm()
  const [addreqForm] = Form.useForm()
  const [showInwardDetail, setShowInwardDetail] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [showaddinwardpop, setshowaddinwardpop] = useState(false)
  const [clearForm, setClearForm] = useState(false)
  const [getDetailsTableResp, setGetDetailsTableResp] = useState(undefined)
  const [onClickDtlsBtn, setOnclickDtlsBtn] = useState([])
  const [categoryDropDwn, setCategoryDropDwn] = useState(undefined)
  const [slctdProjctTyp, setSlctdProjctTyp] = useState(undefined)
  const [slctdProjectStringVal, setSlctdProjectStringVal] = useState('')
  const [departmentData, setDepartmentData] = useState([])
  const [deptName, setDeptName] = useState('')
  const [reqToDeptName, setReqToDeptName] = useState('')
  const [emp, setEmp] = useState([])
  const [reqToEmp, setReqToEmp] = useState([])
  const [istableopen, setIstableopen] = useState(false)
  const [employeeData, setEmployeeData] = useState([])
  // const [allEmployeeData, setAllEmployeeData] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [statusDetaillist, setStatusDetaillist] = useState([])
  const [RqIdVal, setRqIdVal] = useState('')
  const [seqNoVal, setSeqNoVal] = useState('')
  const [deptCode, setdeptCode] = useState('')
  const [reqtoEmp, setreqtoEmp] = useState('')
  const [widgetClick, setWidgetClick] = useState('getRequestedByDtl')
  // const [reqEmpName, setReqEmpName] = useState('')
  const [showOnlyClosedButton, setShowOnlyClosedButton] = useState(false)
  const [showApproveButton, setShowApproveButton] = useState(false)
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [seqStatusCodeVal, setseqStatusCodeVal] = useState('')
  const [widgetCountRespVal, setWidgetCountRespVal] = useState('')
  const [deptData, setDeptData] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  console.log(isModalVisible)

  console.log(reqToEmp)
  useEffect(() => {
    getWidgetValues()
    getProjectList()
    getDepartmentDropDownData()
    getAllEmployeeDropDownData()
    getWidgetDatas(widgetClick)
  }, [])

  useEffect(() => {
    getCategoryDrpDwn()
    getDepartmentDropDownData()
  }, [tenantId])

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

  const handleInputChange = (fieldName, value, option) => {
    console.log(value, option)

    if (fieldName === 'employeeID') {
      setEmp(option.key)
    }
    if (fieldName === 'employeeDept') {
      setdeptCode(option.key)
      getEmployeeDropDownData(option.key)
    }
  }
  const handleReqToInputChange = (fieldName, value, option) => {
    console.log(value)
    if (fieldName === 'employeeID') {
      setreqtoEmp(option.key)
    }
    if (fieldName === 'employeeDept') {
      setReqToDeptName(option.key)
      getEmployeeDropDownData(option.key)
    }
  }

  // const handleAllInputChange = (fieldName, value, option) => {
  //   if (fieldName === 'employeeID') {
  //     setReqEmpName(option.key)
  //   }
  // }

  const NewEmployeeName = value => {
    setEmp(value)
  }
  const NewReqToEmployeeName = value => {
    setReqToEmp(value)
  }
  // const NewReqAllEmployeeName = value => {
  //   setReqEmpName(value)
  // }

  const getDepartmentDropDownData = async () => {
    try {
      const returnData = await getDepartmentAndEmployeeDropDownDataService({
        tenantId,
        isActive: '1',
        employeID: '',
      })
      const options = returnData.map(item => ({
        key: item.departmentCode,
        value: item.departmentName,
      }))
      setDepartmentData(options)
      setDeptData(options.filter(data => data.value === deptname))
      return returnData
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
      return []
    }
  }
  const getEmployeeDropDownData = async departmtCode => {
    try {
      const returnData = await getEmployeeDropDownDataService({
        tenantId,
        departmentId: departmtCode,
      })

      const options = returnData.map(item => ({ key: item.employeeId, value: item.employeeName }))
      setEmployeeData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getEmployeeDropDownData:', error)
      return []
    }
  }

  const getProjectList = async () => {
    // const formData = allqtyForm.getFieldsValue()
    // console.log(formData)
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: '',
        toDate: '',
      },
    })
    setProjectList(response?.responseData || [])
  }
  const getWidgetValues = async () => {
    const widgtRespVal = await indentFileUpload({
      requestPath: 'getAllCounts',
      requestData: {
        tenantId,
        empId: employeeId,
      },
    })
    setWidgetCountRespVal(widgtRespVal)
  }
  const getCategoryDrpDwn = async () => {
    const response = await indentFileUpload({
      requestPath: 'getRequestCategory',
      requestData: {
        tenantId,
      },
    })
    setCategoryDropDwn(response?.responseData || [])
  }

  const showModal = () => {
    setIsModalVisible(true)
    setshowaddinwardpop(true)
  }
  const handleCancelAddInward = () => {
    addreqForm.resetFields()
    setshowaddinwardpop(false)
    setClearForm(!clearForm)
  }
  const handleClickOnDetails = record => {
    getOnClickDtlsButton(record.rqId)
    setRqIdVal(record.rqId)
    setSeqNoVal(record.seqNo)
    setseqStatusCodeVal(record.seqStatusCode)
    setShowDtlTablLoading(true)
  }
  const getOnClickDtlsButton = async value => {
    const response = await indentFileUpload({
      requestPath: 'getReqManHdrAndStatusAndRemarks',
      requestData: {
        tenantId,
        rqId: value,
      },
    })
    if (response !== undefined) {
      if (response.responseData.length > 0) {
        if (response.responseData[0].isCompleted === '0') {
          if (
            response.responseData[0].requestedToId === employeeId &&
            response.responseData[0].seqNo === '1'
          ) {
            setShowOnlyClosedButton(true)
            setShowApproveButton(false)
            setShowCancelButton(true)
          } else if (
            response.responseData[0].requestedById === employeeId ||
            response.responseData[0].ticketReporterId === employeeId
          ) {
            setShowOnlyClosedButton(false)
            setShowApproveButton(true)
            setShowCancelButton(true)
            if (response.responseData[0].seqNo === '1') {
              setShowOnlyClosedButton(true)
            }
          } else {
            setShowOnlyClosedButton(false)
            setShowApproveButton(false)
            setShowCancelButton(false)
          }
        } else {
          setShowOnlyClosedButton(false)
          setShowApproveButton(false)
          setShowCancelButton(false)
        }
      }
    }
    setOnclickDtlsBtn(response?.responseData || [])
    if (response.responseData.length > 0) {
      setStatusDetaillist(response.responseData[0].statusList)
    } else {
      setStatusDetaillist([])
    }
  }

  const popcolumns = [
    {
      title: 'Status Description',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ]

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const projectCode1 = []
  const projectName1 = []
  const FromDepartment1 = []
  const ToDepartment1 = []
  const RequestedBy1 = []
  const RequestedTo1 = []

  if (getDetailsTableResp && getDetailsTableResp.length > 0) {
    getDetailsTableResp.map(h => {
      return projectCode1.push(h.projectCode)
    })
    getDetailsTableResp.map(h => {
      return projectName1.push(h.projectName)
    })
    getDetailsTableResp.map(h => {
      return FromDepartment1.push(h.requestedByDeptName)
    })
    getDetailsTableResp.map(h => {
      return ToDepartment1.push(h.requestedToDeptName)
    })
    getDetailsTableResp.map(h => {
      return RequestedBy1.push(h.requestedByName)
    })
    getDetailsTableResp.map(h => {
      return RequestedTo1.push(h.requestedToName)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const FromDepartment2 = FromDepartment1.filter(distinct)
  const ToDepartment2 = ToDepartment1.filter(distinct)
  const RequestedBy2 = RequestedBy1.filter(distinct)
  const RequestedTo2 = RequestedTo1.filter(distinct)
  const projectCode3 = []
  const projectName3 = []
  const FromDepartment3 = []
  const ToDepartment3 = []
  const RequestedBy3 = []
  const RequestedTo3 = []

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
  projectName2.map(element => {
    return projectName3.push({
      text: element,
      value: element,
    })
  })
  FromDepartment2.map(element => {
    return FromDepartment3.push({
      text: element,
      value: element,
    })
  })
  ToDepartment2.map(element => {
    return ToDepartment3.push({
      text: element,
      value: element,
    })
  })
  RequestedBy2.map(element => {
    return RequestedBy3.push({
      text: element,
      value: element,
    })
  })
  RequestedTo2.map(element => {
    return RequestedTo3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      render: (text, record) => record.projectCode,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
      render: (text, record) => record.projectName,
    },
    {
      title: 'Request Name',
      dataIndex: 'reqName',
      key: 'reqName',
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedByName',
      key: 'requestedByName',
      filters: RequestedBy3,
      filteredValue: filtersinfo.requestedByName,
      onFilter: (value, record) => record?.requestedByName === value,
    },

    {
      title: 'From Department',
      dataIndex: 'requestedByDeptName',
      key: 'requestedByDeptName',
      filters: FromDepartment3,
      filteredValue: filtersinfo.requestedByDeptName,
      onFilter: (value, record) => record?.requestedByDeptName === value,
    },
    {
      title: 'Requested To',
      dataIndex: 'requestedToName',
      key: 'requestedToName',
      filters: RequestedTo3,
      filteredValue: filtersinfo.requestedToName,
      onFilter: (value, record) => record?.requestedToName === value,
    },
    {
      title: 'To Department',
      dataIndex: 'requestedToDeptName',
      key: 'requestedToDeptName',
      filters: ToDepartment3,
      filteredValue: filtersinfo.requestedToDeptName,
      onFilter: (value, record) => record?.requestedToDeptName === value,
    },
    {
      title: 'Status',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
    },
    {
      title: 'Requested Date',
      dataIndex: 'requestedDate', // need to ask entity
      key: 'requestedDate',
      render: text => {
        let requesteddate = null
        if (text !== null) {
          requesteddate = moment(text).format('DD-MMM-YYYY')
        } else {
          requesteddate = '-'
        }
        return requesteddate
      },
      // render: (text, record) => moment(record.requestedDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Closed Date',
      dataIndex: 'closedDate', // need to ask entity
      key: 'closedDate',
      render: text => {
        let closeddate = null
        if (text !== null) {
          closeddate = moment(text).format('DD-MMM-YYYY')
        } else {
          closeddate = '-'
        }
        return closeddate
      },
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleClickOnDetails(record)}
          />
        </div>
      ),
    },
  ]
  const getReqstMngmntDtls = () => {
    const formvalues = allqtyForm.getFieldValue()
    if (
      formvalues.ToDate !== null &&
      formvalues.FromDate !== null &&
      formvalues.Projectcode !== undefined
    ) {
      getMatralInwrdPopUp(formvalues.Projectcode)
      setShowInwardDetail(true)
      setshowaddinwardpop(false)
    } else {
      messageReturn(405)
    }
  }
  const getMatralInwrdPopUp = async value => {
    const response = await indentFileUpload({
      requestPath: 'getReqManHdrDtl',
      requestData: {
        tenantId,
        pmHdrId: value,
      },
    })
    setGetDetailsTableResp(response?.responseData)
  }

  const handleClear = () => {
    allqtyForm.resetFields()
    setShowInwardDetail(false)
    // handleUnAllocate()
    // setRespPopUpCreateInwrd([])
  }
  // const handleGetDetails = () => {
  //   console.log("clicked on submit button")
  // }
  const fromdateChange = () => {
    onClear()
    getProjectList()
  }
  const toDateChange = () => {
    onClear()
    getProjectList()
  }
  const getProjectVallist = (value, option) => {
    console.log(value)
    setSlctdProjectStringVal(option.children)
  }
  const onClear = () => {
    console.log('clear click')
  }
  const getCreatePrjctNo = (value, option) => {
    console.log(option)
    setSlctdProjctTyp(value)
  }

  const handleCancelDtlsBtnInward = () => {
    setShowDtlTablLoading(false)
  }
  const handleClearInputFilds = () => {
    addreqForm.resetFields()
  }
  const handleReuploadSubmit = async () => {
    const formvalues = addremark.getFieldsValue()
    if (formvalues.addnewRemarks !== undefined) {
      const response = await indentFileUpload({
        requestPath: 'insertRMRemarks',
        requestData: {
          empId: employeeId,
          remarks: formvalues.addnewRemarks,
          rqId: RqIdVal,
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        setShowDtlTablLoading(false)
        if (istableopen) {
          getReqstMngmntDtls()
        } else {
          getWidgetDatas(widgetClick)
        }
        getWidgetValues()
        addremark.resetFields()
      } else {
        message.error(response?.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const DetailsTableComponent = () => {
    return (
      <div>
        <div style={{ display: isMobile ? 'block' : 'flex', justifyContent: 'space-between' }}>
          <div>
            Project <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].projectDesc : ''}
            </span>{' '}
          </div>
          <div>
            Category <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].reqCategoryDesc : ''}
            </span>{' '}
          </div>
          <div>
            Requested By Dept. <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].requestedByDeptName : ''}
            </span>{' '}
          </div>
          <div>
            Requested By <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].requestedByName : ''}
            </span>{' '}
          </div>
          <div>
            Requested To Dept <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].requestedToDeptName : ''}
            </span>{' '}
          </div>
          <div>
            Requested To <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].requestedToName : ''}
            </span>{' '}
          </div>
          <div>
            Description <br />
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].reqDesc : ''}
            </span>{' '}
          </div>
        </div>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            Status : <span style={{ fontWeight: 'bold' }}>{onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].seqStatusDesc : ''}</span>
          </div>
          <div>
            Ticket Reported By :{' '}
            <span style={{ fontWeight: 'bold' }}>{onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].ticketReporterName : ''}</span>
          </div>
          <div>
            Initiated By :{' '}
            <span style={{ fontWeight: 'bold' }}>
              {onClickDtlsBtn.length > 0 ? onClickDtlsBtn[0].requestedByName : ''}
            </span>
          </div>
        <div> */}
        <div style={{ marginTop: '10px' }}>
          <p>Remarks</p>
          <div style={{ border: '1px solid #ccc' }}>
            <PerfectScrollbar
              style={{ maxHeight: '200px', overflowX: 'hidden' }}
              options={{ suppressScrollX: true }}
            >
              {onClickDtlsBtn.length > 0
                ? onClickDtlsBtn[0].remarksList.map(detail => {
                    let split = []
                    split = detail.requestedDateTime.split(' ')
                    return (
                      <div style={{ display: 'flex', marginLeft: '3px' }}>
                        <p>{detail.empName}</p>
                        <span style={{ marginLeft: '5px' }}> at </span>
                        <p style={{ marginLeft: '5px' }}>
                          {moment(split[0]).format('DD-MMM-YYYY')}
                          {split[1]}
                        </p>
                        <span style={{ marginLeft: '5px' }}> : </span>
                        <p style={{ marginLeft: '5px' }}>{detail.remarks}</p>
                      </div>
                    )
                  })
                : ''}
            </PerfectScrollbar>
          </div>
        </div>
        <Form form={addremark} layout="vertical" labelAlign="left">
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-md-8">
              <Form.Item
                name="addnewRemarks"
                label={
                  <span>
                    Add Remark<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea rows={6} />
              </Form.Item>
            </div>
            {/* <div className="col-md-4" style={{ marginTop: '40px' }}>
              <ButtonComponent text="Submit" type="primary" onClick={handleUpdate} />
            </div> */}
          </div>
        </Form>
        {/* <Table data={detailstable} columns={detailsColumns} /> */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <ButtonComponent text="Update Remark" type="primary" onClick={handleReuploadSubmit} />
          {showApproveButton === 'true' ? (
            <Button type="primary" onClick={() => handleApproveButton(1, 1)}>
              Completed
            </Button>
          ) : null}
          {showOnlyClosedButton === true ? (
            <Button type="primary" onClick={() => handleApproveButton(0, 1)}>
              Close Ticket
            </Button>
          ) : null}
          {showCancelButton === true ? (
            <Button type="primary" onClick={handleCancelButton}>
              Cancel
            </Button>
          ) : null}

          <ButtonComponent
            // text="View Approval Cycle"
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => {
              OpenDetailCard()
            }}
          />
          <Popuptable
            onClose={() => setdetailCard(false)}
            cardLabel=""
            component={<Table dataSource={statusDetaillist} columns={popcolumns} />}
            visible={detailCard}
          />
        </div>
      </div>
    )
  }
  const handleApproveButton = async (isapp, iscomp) => {
    const formvalues = addremark.getFieldsValue()
    if (formvalues.addnewRemarks !== undefined) {
      const response = await indentFileUpload({
        requestPath: 'insertReqStatus',
        requestData: {
          empId: employeeId,
          rqId: RqIdVal,
          seqNo: seqNoVal,
          seqStatus: seqStatusCodeVal,
          statusRemarks: formvalues.addnewRemarks,
          tenantId,
          isComplete: iscomp,
          isApproved: isapp,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        addremark.resetFields()
        getWidgetValues()
        setShowDtlTablLoading(false)
        if (istableopen) {
          getReqstMngmntDtls()
        } else {
          getWidgetDatas(widgetClick)
        }
      } else {
        message.error(response?.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }
  // const handleClosedButton = () => {
  //   const formvalues = addremark.getFieldsValue()
  //   console.log(formvalues)
  //   if (formvalues.addnewRemarks !== undefined) {
  //     console.log("Close Btn");
  //   } else {
  //    messageReturn(405)
  //   }
  // }
  const handleCancelButton = () => {
    addremark.resetFields(['addnewRemarks'])
    setShowDtlTablLoading(false)
  }
  const OpenDetailCard = () => {
    setdetailCard(true)
  }

  const getAllEmployeeDropDownData = async () => {
    try {
      const returnData = await indentFileUpload({
        requestPath: 'getEmployeeForDepartment',
        requestData: {
          tenantId,
          departmentId: '',
          employeeId,
        },
      })
      const options = returnData.map(item => ({ key: item.employeeId, value: item.employeeName }))
      console.log(options)
      // setEmployeeData(returnData)
      // setAllEmployeeData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getEmployeeDropDownData:', error)
      return []
    }
  }

  const AddRequestComponent = () => {
    return (
      <div>
        <Form form={addreqForm} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-3" style={{ display: 'none' }}>
              <Form.Item
                name="FromDate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker style={{ width: '100%' }} onChange={fromdateChange} />
              </Form.Item>
            </div>
            <div className="col-md-3" style={{ display: 'none' }}>
              <Form.Item
                name="ToDate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultToDate)}
              >
                <DatePicker style={{ width: '100%' }} onChange={toDateChange} />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="Projectcode"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  onChange={getCreatePrjctNo}
                  placeholder="Select Project"
                >
                  {projectList?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="CategoryCode"
                label={
                  <span>
                    Category<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Category">
                  {categoryDropDwn?.map(item => (
                    <Option key={item.cateId} value={item.cateId}>
                      {item.cateDesc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="requestedByDept"
                label={
                  <span>
                    Requested By Dept.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <DropDownComponent
                  data={deptData}
                  value={deptName}
                  onChange={text => setDeptName(text)}
                  onSelect={(value, option) => handleInputChange('employeeDept', value, option)}
                  onBlur={value => NewEmployeeName(value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="requestedBy"
                label={
                  <span>
                    Requested By<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <AutoCompleteComponent
                  data={employeeData}
                  // onChange={text => setEmpName(text)}
                  onSelect={(value, option) => handleInputChange('employeeID', value, option)}
                  onBlur={value => NewEmployeeName(value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="requestedToDept"
                label={
                  <span>
                    Requested To Dept.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <DropDownComponent
                  data={departmentData}
                  value={reqToDeptName}
                  onChange={text => setReqToDeptName(text)}
                  onSelect={(value, option) =>
                    handleReqToInputChange('employeeDept', value, option)
                  }
                  onBlur={value => NewReqToEmployeeName(value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="requestto"
                label={
                  <span>
                    Request To<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <AutoCompleteComponent
                  data={employeeData}
                  // onChange={text => setEmpName(text)}
                  onSelect={(value, option) => handleReqToInputChange('employeeID', value, option)}
                  onBlur={value => NewReqToEmployeeName(value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="requestName"
                label={
                  <span>
                    Request Name<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="dueDate"
                label={
                  <span>
                    Due Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment()}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                name="description"
                label={
                  <span>
                    Description<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea rows={4} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="remarks"
                label={
                  <span>
                    Remarks<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea rows={4} />
              </Form.Item>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={handleCreateNewRequest}>
              Submit
            </Button>
            <Button type="primary" onClick={handleClearInputFilds}>
              Clear
            </Button>
          </div>
        </Form>
      </div>
    )
  }
  const handleCreateNewRequest = async () => {
    const formvalues = addreqForm.getFieldsValue()
    if (emp !== reqtoEmp) {
      if (
        formvalues.FromDate !== undefined &&
        formvalues.ToDate !== undefined &&
        formvalues.Projectcode !== undefined &&
        formvalues.CategoryCode !== undefined &&
        formvalues.description !== undefined &&
        formvalues.remarks !== undefined &&
        formvalues.requestedBy !== undefined &&
        formvalues.requestto !== undefined
      ) {
        const response = await indentFileUpload({
          requestPath: 'insertReqManagementHdr',
          requestData: {
            empId: employeeId,
            pmHdrId: slctdProjctTyp,
            remarks: formvalues.remarks,
            remarksBy: employeeId,
            reqCategory: formvalues.CategoryCode,
            reqDesc: formvalues.description,
            reqName: formvalues.requestName,
            dueDate: moment(formvalues.dueDate).format('YYYY-MM-DD'),
            requestedBy: emp,
            requestedByDept: deptCode,
            requestedTo: reqtoEmp,
            requestedToDept: reqToDeptName,
            tenantId,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          setshowaddinwardpop(false)
          addreqForm.resetFields()
          getReqstMngmntDtls()
          getWidgetValues()
        } else {
          message.error(response?.responseMessage)
        }
      } else {
        messageReturn(405)
      }
    } else {
      messageReturn(618)
    }
  }

  const handleClickTable = () => {
    if (istableopen) {
      getWidgetDatas(widgetClick)
    }

    setIstableopen(!istableopen)
    handleClearData()
  }
  const handleClearData = () => {
    allqtyForm.resetFields()
    setGetDetailsTableResp([])
    setShowInwardDetail(false)
  }

  const handleWidgetClick = widget => {
    setWidgetClick(widget)
    getWidgetDatas(widget)
  }

  const getWidgetDatas = async widget => {
    handleClearData()
    setIstableopen(false)

    const widgtRespData = await indentFileUpload({
      requestPath: widget,
      requestData: {
        tenantId,
        empId: employeeId,
        isDashboard: '0',
      },
    })
    if (widgtRespData.responseCode === '200') {
      setGetDetailsTableResp(widgtRespData.responseData)
    } else {
      message.error(widgtRespData?.responseMessage)
      setGetDetailsTableResp([])
    }
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <div className="row form_datas mt-2">
        <div
          className="col-md-3 col-lg-3 col-xl-3 col-sm-12"
          role="button"
          tabIndex={0}
          onClick={() => handleWidgetClick('getRequestedByDtl')}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleWidgetClick('getRequestedByDtl')
            }
          }}
        >
          <div
            className="card"
            style={{
              // height: '9vh',
              marginBottom: '5px',
              borderColor: 'rgb(191 197 208)',
              background: 'rgb(129 129 158)',
            }}
          >
            <div className="row" style={{ marginTop: '5px' }}>
              <div
                className="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4"
                style={{
                  // height: 'auto',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <center>
                  <b>
                    <span style={{ fontSize: '50px', color: 'white' }}>
                      <UserSwitchOutlined />
                    </span>
                  </b>
                </center>
              </div>
              <div
                className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-8"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <b>
                    <span style={{ fontSize: '20px', color: 'white' }}>Assigned By Me</span>
                  </b>{' '}
                  <br />
                  <span style={{ fontSize: '25px', color: 'white' }}>
                    {widgetCountRespVal.requestedByCount !== '' &&
                    widgetCountRespVal.requestedByCount !== null &&
                    widgetCountRespVal.requestedByCount !== undefined
                      ? widgetCountRespVal.requestedByCount
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-3 col-lg-3 col-xl-3 col-sm-12"
          role="button"
          tabIndex={0}
          onClick={() => handleWidgetClick('getRequestToWithAllDepartment')}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleWidgetClick('getRequestToWithAllDepartment')
            }
          }}
        >
          <div
            className="card"
            style={{
              // height: '9vh',
              marginBottom: '5px',
              borderColor: 'rgb(191 197 208)',
              background: '#e4c28d',
            }}
          >
            <div className="row" style={{ marginTop: '5px' }}>
              <div
                className="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <center>
                  <b>
                    <span style={{ fontSize: '50px', color: 'white' }}>
                      <UsergroupAddOutlined />
                    </span>
                  </b>
                </center>
              </div>
              <div
                className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-8"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <b>
                    <span style={{ fontSize: '20px', color: 'white' }}>Assigned To Dept.</span>
                  </b>{' '}
                  <br />
                  <span style={{ fontSize: '25px', color: 'white' }}>
                    {widgetCountRespVal.reqToCountWithDeptName !== '' &&
                    widgetCountRespVal.reqToCountWithDeptName !== null &&
                    widgetCountRespVal.reqToCountWithDeptName !== undefined
                      ? widgetCountRespVal.reqToCountWithDeptName
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12">
          <div
            className="card"
            style={{
              // height: '9vh',
              marginBottom: '5px',
              borderColor: 'rgb(191 197 208)',
              background: '#98c1c7',
            }}
            role="button"
            tabIndex={0}
            onClick={() => handleWidgetClick('getRequestedToDtl')}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handleWidgetClick('getRequestedToDtl')
              }
            }}
          >
            <div className="row" style={{ marginTop: '5px' }}>
              <div
                className="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <center>
                  <b>
                    <span style={{ fontSize: '50px', color: 'white' }}>
                      <UserAddOutlined />
                    </span>
                  </b>
                </center>
              </div>
              <div
                className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-8"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <b>
                    <span style={{ fontSize: '20px', color: 'White' }}>Assigned to Me</span>
                  </b>{' '}
                  <br />
                  <span style={{ fontSize: '25px', color: 'White' }}>
                    {widgetCountRespVal.reqToCount !== '' &&
                    widgetCountRespVal.reqToCount !== null &&
                    widgetCountRespVal.reqToCount !== undefined
                      ? widgetCountRespVal.reqToCount
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-3 col-lg-3 col-xl-3 col-sm-12"
          role="button"
          tabIndex={0}
          onClick={() => handleWidgetClick('getRequestedByDtlWithIsComplete')}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleWidgetClick('getRequestedByDtlWithIsComplete')
            }
          }}
        >
          <div
            className="card"
            style={{
              // height: '9vh',
              marginBottom: '5px',
              borderColor: 'rgb(191 197 208)',
              background: '#7cb166',
            }}
          >
            <div className="row" style={{ marginTop: '5px' }}>
              <div
                className="col-lg-4 col-md-4 col-sm-4 col-xs-4 col-4"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <center>
                  <b>
                    <span style={{ fontSize: '50px', color: 'white' }}>
                      <CheckCircleOutlined />
                    </span>
                  </b>
                </center>
              </div>
              <div
                className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-8"
                style={{
                  // height: '40px',
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  marginTop: '0px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <b>
                    <span style={{ fontSize: '20px', color: 'White' }}>
                      Task Completed By Others
                    </span>
                  </b>{' '}
                  <br />
                  <span style={{ fontSize: '25px', color: 'White' }}>
                    {widgetCountRespVal.reqByWithCompletedCount !== '' &&
                    widgetCountRespVal.reqByWithCompletedCount !== null &&
                    widgetCountRespVal.reqByWithCompletedCount !== undefined
                      ? widgetCountRespVal.reqByWithCompletedCount
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{ marginRight: '15px', marginTop: '5px', display: 'flex', justifyContent: 'end' }}
        >
          {istableopen ? (
            <MenuUnfoldOutlined style={{ fontSize: '20px' }} onClick={() => handleClickTable()} />
          ) : (
            <UnorderedListOutlined
              style={{ fontSize: '20px' }}
              onClick={() => handleClickTable()}
            />
          )}
        </div>
      </div>
      <div style={{ display: istableopen ? 'block' : 'none' }}>
        <Form form={allqtyForm}>
          <Card
            style={{ width: '100%', marginTop: '13px' }}
            title="Request Management"
            extra={
              <>
                <ButtonComponent
                  text="Create Request"
                  type="primary"
                  icon={<PlusOutlined style={{ color: 'white' }} />}
                  onClick={showModal}
                />
              </>
            }
          >
            <div className="row">
              <div className="col-12 col-sm-12 col-md-3 col-lg-4 ">
                <Form.Item
                  name="FromDate"
                  label={
                    <span>
                      From Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                  initialValue={moment(defaultFromDate)}
                >
                  <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} onChange={fromdateChange} />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-12 col-md-3 col-lg-4 ">
                <Form.Item
                  name="ToDate"
                  label={
                    <span>
                      To Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                  initialValue={moment(defaultToDate)}
                >
                  <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} onChange={toDateChange} />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-12 col-md-3 col-lg-4 ">
                <Form.Item
                  name="Projectcode"
                  label={
                    <span>
                      Project<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    style={{ width: '100%' }}
                    onChange={getProjectVallist}
                    placeholder="Select Project"
                  >
                    <Option key="getall" value="getall">
                      Get All
                    </Option>
                    {projectList?.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
            >
              <Button type="primary" onClick={getReqstMngmntDtls}>
                Get details
              </Button>
              <Button type="primary" onClick={handleClear}>
                Clear
              </Button>
            </div>

            <div style={{ display: showInwardDetail ? 'block' : 'none' }}>
              <Row>
                <Divider orientation="left">
                  Request Management Details - {slctdProjectStringVal}
                </Divider>
              </Row>
              <div>
                <Table columns={columns} dataSource={getDetailsTableResp} />
              </div>
            </div>
          </Card>
        </Form>
      </div>
      <div style={{ display: !istableopen ? 'block' : 'none' }}>
        <div>
          <Card style={{ width: '100%', marginTop: '13px' }} title="Request Management Details">
            <div>
              <Table columns={columns} dataSource={getDetailsTableResp} onChange={handleChange} />
            </div>
          </Card>
        </div>
      </div>

      <ModalPopup
        text="Request Management Details"
        isModalVisible={showDtlTablLoading}
        onCancel={handleCancelDtlsBtnInward}
        FieldsComponent={DetailsTableComponent}
        width={1450}
      />
      <ModalPopup
        text="Add Request"
        isModalVisible={showaddinwardpop}
        onCancel={handleCancelAddInward}
        FieldsComponent={AddRequestComponent}
        width={950}
      />
    </div>
  )
}

export default RequestManagement
