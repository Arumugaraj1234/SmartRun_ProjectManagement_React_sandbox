import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'

// import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Row,
  Select,
  Divider,
  Table,
  Input,
  DatePicker,
  message,
  Modal,
  AutoComplete,
  Form,
  Popover,
  InputNumber,
} from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
// import DatePickerComponent from 'components/shared/DatePickerComponent'
import moment from 'moment'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import ModalPopupBox from 'components/shared/ModalPopupComponent'
import { FileExcelOutlined, HistoryOutlined } from '@ant-design/icons'
import getDepartmentAndEmployeeDropDownDataService from 'services/common/getDepartmentAndEmployeeDropDownDataService'
// import DropDownComponent from 'components/shared/DropDownComponent'
import getMstPocEmpForDepartment from 'services/common/getMstPocEmpForDepartment'
import ApproveOrRejectButton from 'components/common/ApproveRejectBtnComponent'
import InputComponent from 'components/shared/InputComponent'
// import ModalPopupBox from 'components/shared/ModalPopupComponent'
import getSalesCategory from 'services/common/BudgetsheetService/KeyCategoryService'
// import SubAssyDetails from 'modules/project/components/SubAssemblyDetails'
import Buttons from 'components/shared/ButtonComponent'
import SpinLoading from 'components/common/Loader'
// msg file
import messageReturn from '_helpers/messageReturn'
import Message from '../../../../msgfile'
import currentDateTime from '../../../../currentDateTime'
// const employeID = store.get('employeeId')

const ProjectInitiation = () => {
  const Tab = store.get('Tab')

  const currDate = new Date().toISOString().split('T')[0]
  const currntdate = moment(currDate).format('YYYY-MM-DD')
  const { tenantId, docTypeCode, isEditable, processCode } = Tab
  const projCode = store.get('projectCode')
  const [paymentTermListVal, setPaymentTermListVal] = useState([])
  const [PTform] = Form.useForm()
  // const projName = store.get('projectName')
  const employeeId = store.get('employeeId')
  const initiateDate = store.get('InitiatedDate')
  const saleVal = store.get('SaleValue')
  const history = useHistory()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [pkaId, setPkaId] = useState(null)
  const [costFlowType, setCostFlowType] = useState('LEGACY')
  const [manualProjectId, setManualProjectId] = useState('')
  const setDefaultMileStone = [
    {
      milestoneName: '',
      plannedStartDate: currntdate,
      plannedEndDate: currntdate,
      responsibleDeptCode: null,
      responsibleName: null,
      deptName: null,
      empName: null,
      pmHdrId: store.get('ProjectPMHdrId'),
      pmTempId: '',
      ptId: null,
      tenantId,
      isret: 0,
      isupd: 0,
      isins: 0,
    },
  ]
  //   const exportToCSV = (data, fileName) => {
  //   const headers = ['Station', 'Budget Cost', 'Target Cost', 'Actual Cost', 'Allocated Value']
  //   const rows = data.map(item => [
  //     item.keySubArea,
  //     item.budgetcost,
  //     item.targetcost,
  //     item.actualcost,
  //     item.allocatedVal,
  //   ])

  //   const csvContent = `data:text/csv;charset=utf-8,${[headers, ...rows].map(e => e.join(',')).join('\n')}`;

  //   const encodedUri = encodeURI(csvContent)
  //   const link = document.createElement('a')
  //   link.setAttribute('href', encodedUri)
  //   link.setAttribute('download', `${fileName}.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }
  const handleExport = (data, fileName) => {
    const cleanedData = cleanupDataSource(data)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `${fileName}.csv`)
  }

  const cleanupDataSource = dataSource => {
    const escapeValue = value => {
      if (
        typeof value === 'string' &&
        (value.includes(',') || value.includes('\n') || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
      }
      return value
    }

    return dataSource.map(row =>
      costFlowType === 'NEW'
        ? {
            Station: escapeValue(row.keySubArea),
            'Consumed So Far': escapeValue(row.consumedSoFar),
            'Allocated Value': escapeValue(row.allocatedVal),
          }
        : {
            Station: escapeValue(row.keySubArea),
            'Budget Cost': escapeValue(row.budgetcost),
            'Target Cost': escapeValue(row.targetcost),
            'Actual Cost': escapeValue(row.actualcost),
            'Allocated Value': escapeValue(row.allocatedVal),
          },
    )
  }

  const convertToCSV = data => {
    const header = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [header, ...rows].join('\n')
  }

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const { slaveId } = Tab
  const plannedStartDate = store.get('PlannedStartDate')
  const plannedEndDate = store.get('plannerEndDate')
  const priorityval = store.get('Priority')
  const indtype = store.get('IndustrialType')
  const scopework = store.get('ScopeOfWork')
  const handoverDate = store.get('Handoverdate')
  const enddate = store.get('EndDate')
  // const createdDate = store.get('CreatedDate')
  const [planStartDate, setPlanStartDate] = useState(plannedStartDate)
  const [planEndDate, setPlanEndDate] = useState(plannedEndDate)
  const [departmentData, setDepartmentData] = useState([])
  // const [clearMileStoneName, setclearMileStoneName] = useState('')
  const [priorityValue, setPriorityValue] = useState(priorityval)
  const [data, setData] = useState([])
  const [deleteMileStones, setDeleteMileStones] = useState(setDefaultMileStone)
  // const [projectCode, setprojectCode] = useState([])
  // const [projectName, setprojectName] = useState([])
  // const [projectTemplate, setprojectTemplate] = useState([])
  // const [projectStart, setprojectStart] = useState(currntdate)
  // const [projectEnd, setprojectEnd] = useState(currntdate)
  // const [projByIdDetail, setprojByIdDetail] = useState([])
  const [wbsTemplate, setwbsTemplate] = useState([])
  const [isTempDisabled, setisTempDisabled] = useState(false)
  const [isProjectCreated, setIsProjectCreated] = useState(false)
  const [employeeData, setEmployeeData] = useState([])
  const [dropDownData, setDropDowndata] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalVal, setIsModalVal] = useState(false)
  const [subArearec, setSubArearec] = useState([])
  // const [generateCode, setGenerateCode] = useState(null)
  const [disableInputBoxes, setDisabledInputBoxes] = useState(true)
  const [selectedRecordVal, setSelectedRecordVal] = useState([])
  const [projTempltDropDwn, setProjTempltDropDwn] = useState([])
  const [projInitDataMsg, setProjInitDataMsg] = useState(null)
  const [allocateVal, setAllocateVal] = useState(null)
  const [filtersinfo, setfilterinfo] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [generateCode, setGenerateCode] = useState('')
  // projInitDataMsg

  useEffect(() => {
    async function onLoadFunc() {
      if (isEditable === '1') {
        setDisabledInputBoxes(false)
      } else {
        setDisabledInputBoxes(true)
      }
    }
    onLoadFunc()
  }, [])

  useEffect(() => {
    // if (deleteMileStones) {

    const newRows = data.map((res, index) => {
      let planneddate = null
      let plannedenddate = null
      if (handoverDate !== null) {
        if (res.generatedStartDate < handoverDate && res.generatedStartDate > enddate) {
          planneddate = handoverDate
        } else if (res.generatedStartDate < handoverDate) {
          planneddate = handoverDate
        } else if (res.generatedStartDate > enddate) {
          planneddate = handoverDate
        }
      } else if (handoverDate === null) {
        planneddate = enddate
      }

      if (enddate !== null) {
        if (res.generatedEndDate < handoverDate && res.generatedStartDate > enddate) {
          plannedenddate = enddate
        } else if (res.generatedEndDate < handoverDate) {
          plannedenddate = enddate
        } else if (res.generatedEndDate > enddate) {
          plannedenddate = enddate
        }
      } else if (handoverDate === null) {
        plannedenddate = moment(new Date())
      }
      return {
        key: `${index}`,
        milestoneName: res.milestoneName,
        plannedStartDate: planneddate !== null ? planneddate : res.generatedStartDate,
        plannedEndDate: plannedenddate !== null ? plannedenddate : res.generatedEndDate,
        responsibleDeptCode: res.deptName,
        deptName: res.responsibleDeptCode,
        empName: res.responsibleName,
        responsibleName: res.empName,
        pmHdrId: store.get('ProjectPMHdrId'),
        pmTempId: res.pmTempId,
        ptId: res.ptId,
        isret: 1,
        isupd: 0,
        isins: 0,
        tenantId,
      }
    })
    setDeleteMileStones([...newRows, ...setDefaultMileStone])
    // }
  }, [data])

  const MenuTab = store.get('MenuListData')
  const curr = MenuTab[0].currency
  const [dskIdVal, setDskId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [selectedRecordVal, setSelectedRecordVal] = useState([])
  // const [trueFalseBox, setTrueFalseBox] = useState([])
  const [saleCategoryDrpDown, setSaleCategoryDrpDown] = useState([])
  const [elementDropDownVal, setElementDropDownVal] = useState([])
  // const [allocatedQty, setAllocatedQty] = useState('')
  const [budgetLinkTablDtl, setBudgetLinkTablDtl] = useState([])
  // const [popupdskId, setpopupdskId] = useState([])
  // const [popupsbExtnId, setpopupsbExtnId] = useState([])
  const [linkStatus, setLinkStatus] = useState([])
  const [disablbtn, setDisablebtn] = useState(false)
  const [topupHistoryOpen, setTopupHistoryOpen] = useState(false)
  const [topupHistoryDtl, setTopupHistoryDtl] = useState([])
  const [topupHistoryLoading, setTopupHistoryLoading] = useState(false)
  const [salecatcode, setSalecatcode] = useState('')
  // const [popupTotalAllocVal, setPopupTotalAllocVal] = useState('0')
  // const [slctdElementVal, setSlctdElementVal] = useState('')

  // const [pmHdrIdVal, setpmHdrIdVal] = useState('')
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MMM-YYYY']
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 5,
  // })
  const enquiryId = store.get('EnquiryID')
  // setpmHdrIdVal(store.get('ProjectPMHdrId'));

  const saveButtonStatus = true
  const display = true
  const getReferenceIdVal = store.get('referenceID')
  const { Option } = Select

  // const onChangeMileStone = (index, e) => {
  //   setclearMileStoneName(e.target.value)
  //   const newArr = [...data]
  //   index.milestoneName = e.target.value
  //   setData(newArr)
  // }

  // Milestone retrieve service onchanges

  const handleChangeMileStone = (index, e) => {
    const newArr = [...deleteMileStones]
    index.milestoneName = e.target.value
    if (index.isret === 1) {
      index.isupd = 1
    } else {
      index.isupd = 1
    }
    setDeleteMileStones(newArr)
  }
  // if (fromdate && todate && fromdate < todate) {
  //   errosr('Planned End Date cannot be before Planned Start Date')
  //   return
  // }
  const handlePlanStartDate = (index, dateString) => {
    const newData = [...deleteMileStones]
    const fromdate = moment(dateString).format('YYYY-MM-DD')
    const todate = moment(newData[index].plannedEndDate).format('YYYY-MM-DD')
    if (fromdate <= todate) {
      newData[index].plannedStartDate = dateString
      setDeleteMileStones(newData)
    } else {
      errosr('Planned Start date cannot be greater than Planned End Date.')
      return
    }
    newData[index].plannedStartDate = dateString
    setDeleteMileStones(newData)
  }
  const handlePlanEndDate = (index, dateString) => {
    const newData = [...deleteMileStones]
    const fromdate = moment(newData[index].plannedStartDate).format('YYYY-MM-DD')
    const todate = moment(dateString).format('YYYY-MM-DD')
    if (fromdate <= todate) {
      newData[index].plannedEndDate = dateString
      setDeleteMileStones(newData)
    } else {
      errosr('Planned Start Date cannot be greater than Planned End Date.')
      return
    }
    newData[index].plannedEndDate = dateString
    setDeleteMileStones(newData)
  }

  const handleInputChange = (value, record, index) => {
    const newData = [...deleteMileStones]
    newData[index].responsibleDeptCode = value
    if (index.isret === 1) {
      newData[index].isupd = 1
    } else {
      newData[index].isupd = 1
    }
    setDeleteMileStones(newData)
    getEmployeeDropDownData(value)
  }
  useEffect(() => {
    updateSelectedDepartments()
  }, [deleteMileStones])
  const updateSelectedDepartments = () => {
    const newSelectedDepartments = deleteMileStones.map(item => item.responsibleDeptCode)
    setSelectedDepartments(newSelectedDepartments)
  }
  const handleEmployeeChange = (value, record, index) => {
    const newData = [...deleteMileStones]
    newData[index].responsibleName = value
    if (index.isret === 1) {
      newData[index].isupd = 1
    } else {
      newData[index].isupd = 1
    }
    setDeleteMileStones(newData)
  }
  // const handleRemoveRec = (key, records, index) => {
  //   const newData = [...deleteMileStones];
  //   const updatedData = newData.filter((item, idx) => idx !== index);
  //   setDeleteMileStones(updatedData);
  // }
  const getEmployeeDropDownData = async departmtCode => {
    try {
      const returnData = await getMstPocEmpForDepartment({
        tenantId,
        departmentId: departmtCode,
      })
      const options = returnData.map(item => ({ key: item.employeeId, value: item.employeeName }))
      setEmployeeData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getMstPocEmpForDepartment:', error)
      return []
    }
  }
  const removeColumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Milestone Name',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      width: '20%',
      render: (text, record) => {
        return record.isret === 1 ? (
          <Input value={text} onChange={event => handleChangeMileStone(record, event)} />
        ) : (
          <Input value={text} onChange={event => handleChangeMileStone(record, event)} />
        )
      },
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      render: (text, record, index) => {
        return record.isret === 1 ? (
          <DatePicker
            value={text ? moment(text) : moment()}
            onChange={(date, dateString) => handlePlanStartDate(index, dateString)}
            format="DD-MMM-YYYY"
            disabledDate={d => !d || d.isBefore(handoverDate)}
          />
        ) : (
          <DatePicker
            value={text ? moment(text) : moment()}
            onChange={(date, dateString) => handlePlanStartDate(index, dateString)}
            format="DD-MMM-YYYY"
            disabledDate={d => !d || d.isBefore(handoverDate)}
          />
        )
      },
    },
    {
      title: 'Planned End Date',
      dataIndex: 'plannedEndDate',
      key: 'plannedEndDate',
      render: (text, record, index) => {
        return record.isret === 1 ? (
          <DatePicker
            value={text ? moment(text) : moment()}
            onChange={(date, dateString) => handlePlanEndDate(index, dateString)}
            format="DD-MMM-YYYY"
            disabledDate={d => !d || d.isAfter(enddate)}
          />
        ) : (
          <DatePicker
            value={text ? moment(text) : moment()}
            onChange={(date, dateString) => handlePlanEndDate(index, dateString)}
            format="DD-MMM-YYYY"
            disabledDate={d => !d || d.isAfter(enddate)}
          />
        )
      },
    },
    {
      title: 'Department',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text, record, index) => {
        return record.isret === 1 ? (
          record.responsibleDeptCode
        ) : (
          <Select
            placeholder="Select Department"
            onChange={value => handleInputChange(value, record, index)}
            style={{ width: '100%' }}
            value={record.responsibleDeptCode}
          >
            {departmentData.map(item => (
              <Option
                key={item.key}
                value={item.key}
                disabled={
                  selectedDepartments.includes(item.key) || selectedDepartments.includes(item.value)
                }
              >
                {item.value}
              </Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: 'Responsible User',
      dataIndex: 'empName',
      key: 'empName',
      render: (text, record, index) => {
        return record.isret === 1 ? (
          record.responsibleName
        ) : (
          <Select
            placeholder="Select Responsible User"
            onChange={value => handleEmployeeChange(value, record, index)}
            style={{ width: '100%' }}
          >
            {employeeData.map(item => (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      render: (text, record, index) =>
        deleteMileStones.length >= 1 ? (
          <div>
            <div>
              {index === deleteMileStones.length - 1 ? (
                <AddIconButton
                  onClick={() => handleAddRow(record, index)}
                  disableInputBoxes={disableInputBoxes}
                />
              ) : null}
            </div>

            <div>
              {index !== deleteMileStones.length - 1 ? (
                <RemoveIcon
                  onClick={() => handleRemoveRowss(record.key, record, index)}
                  disableInputBoxes={projInitDataMsg === '0'}
                />
              ) : null}
            </div>
          </div>
        ) : null,
    },
  ]

  const ShowModalPopup = rec => {
    setAllocateVal(rec)
    getSubAreaPm(rec)
    setDskId(rec.pkaId)
    setIsModalVal(true)
  }
  const handleCancelModalVal = () => {
    setIsModalVal(false)
  }
  const disable = true
  const getSubAreaPm = async e => {
    try {
      const keyareaobj = {
        pmHdrId: e.pmHdrId,
        pkId: e.pkaId,
        tenantId: e.tenantId,
      }
      const response = await indentFileUpload({
        requestPath: 'getSubAreaPmHdrList',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        setSubArearec(response.responseData)
      } else {
        setSubArearec([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const handleAddRow = (index, rec) => {
    if (
      index.milestoneName !== '' &&
      index.responsibleDeptCode !== null &&
      index.responsibleName !== null
    ) {
      const newData = [...deleteMileStones]

      if (rec > -1) {
        const newMilestone = {
          milestoneName: '',
          plannedStartDate: currntdate,
          plannedEndDate: currntdate,
          responsibleDeptCode: null,
          responsibleName: null,
          deptName: null,
          empName: null,
          pmHdrId: store.get('ProjectPMHdrId'),
          pmTempId: '',
          ptId: '',
          tenantId,
          isret: 0,
          isupd: 0,
          isins: 0,
        }
        const updatedData = [...newData, newMilestone]

        setDeleteMileStones(updatedData)
      }
    } else {
      error(Message)
    }
  }
  function submitFunction() {
    // console.log('submit function')
    updateNewProject()
  }

  const handleRemoveRowss = (key, records, index) => {
    if (records.ptId !== null && records.ptId !== '') {
      deleteMileStoneRecord(records)
    } else if (index !== undefined && index >= 0 && index < deleteMileStones.length) {
      // const updatedMilestones = [...deleteMileStones]
      // updatedMilestones.splice(index, 1)
      // setDeleteMileStones(updatedMilestones)
      const newData = [...deleteMileStones]
      const updatedData = newData.filter((item, idx) => idx !== index)
      setDeleteMileStones(updatedData)
      success('Record Deleted')
    }
  }

  const deleteMileStoneRecord = async record => {
    const response = await indentFileUpload({
      requestPath: 'deleteWBSById',
      requestData: {
        ptID: record.ptId,
        tenantID: tenantId,
      },
    })
    const resp = response.responseMessage
    if (resp === 'Record Deleted') {
      getTimeLineByPMS()
      success(resp)
    } else {
      error(resp)
    }
  }

  // const onChangeProjCode = (value, key) => {
  //   console.log(`${value} ${key}`)
  //   setprojectCode(value)
  // }

  // const onChangeProjName = e => {
  //   console.log(e.target.value)
  //   setprojectName(e.target.value)
  // }

  // async function getProjCode() {
  //   console.log(store.get('ProjectPMHdrId'))
  //   const keyareaobj = {
  //     custName: '',
  //     empId: '',
  //     fromDate: '',
  //     pmId: '',
  //     projectID: store.get('ProjectPMHdrId'),
  //     tenantId,
  //     toDate: '',
  //   }
  //   const response = await indentFileUpload({
  //     requestPath: 'getProjectDtl',
  //     requestData: keyareaobj,
  //   })
  //   if (response.responseData !== null && response.responseData !== undefined) {
  //     setprojByIdDetail(response?.responseData)
  //     setprojectName(response?.responseData[0]?.projectName)
  //     setprojectStart(response?.responseData[0]?.createdDate)
  //     setprojectEnd(response?.responseData[0]?.dueDate)
  //     // setpmHdrIdVal(response?.responseData[0]?.pmHdrId)
  //   }
  //   // console.log(`projByIdDetail ${projByIdDetail}`)
  // }
  async function getTimeLineByPMS() {
    const keyareaobj = {
      projectID: store.get('ProjectPMHdrId'),
      tenantID: tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getTimeLineByPM',
      requestData: keyareaobj,
    })
    if (response.responseData !== null && response.responseData !== undefined) {
      if (response?.responseData.length > 0) {
        setisTempDisabled(true)
        setData(response?.responseData)
        // setDeleteMileStones(response ?.responseData)
        setProjTempltDropDwn([])
      } else {
        // setData([])
        setisTempDisabled(false)
        setData([])
        setProjTempltDropDwn(null)
      }
    } else {
      setisTempDisabled(false)
      // setDeleteMileStones([])
      setData([])
    }
  }
  const getPaymentTermsList = async () => {
    const keyareaobj = {
      custName: '',
      fromDate: '',
      pmId: '',
      toDate: '',
      empId: '',
      projectID: store.get('ProjectPMHdrId'),
      tenantID: tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getProjectDtl',
      requestData: keyareaobj,
    })
    if (response.responseData !== null && response.responseData !== undefined) {
      if (response?.responseData.length > 0) {
        setPaymentTermListVal(response.responseData[0].paymentTerms)
      }
    }
  }

  const updatePaymentTerms = async () => {
    try {
      const values = await PTform.validateFields()

      const updatedPaymentList = paymentTermListVal.map((item, index) => {
        const rawDate = values[`actualDate-${index}`]
        return {
          actualDate: rawDate ? moment(rawDate).format('YYYY-MM-DD') : null,
          remarks: values[`remarks-${index}`],
          sbPtId: item.sbPtId,
        }
      })

      const keyareaobj = {
        paymentTerms: updatedPaymentList,
      }

      const response = await indentFileUpload({
        requestPath: 'updateBudgetSheetPaymentTerms',
        requestData: keyareaobj,
      })

      if (response.statusCode === 200) {
        message.success('Payment Terms updated successfully')
      }
    } catch (error) {
      console.error('Validation or API Error:', error)
      message.error('Failed to update payment terms')
    }
  }

  const getProjectTimePlanDropdown = async () => {
    const keyareaobj = {
      tenantID: tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getProjTimePlanDropDown',
      requestData: keyareaobj,
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      if (response?.responseData.length > 0) {
        setwbsTemplate(response?.responseData)
      }
    }
  }
  const getWbsTemplateByIdApi = async value => {
    const keyareaobj = {
      pmHdrId: value,
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getExistingPMtemplateByPmHdrId',
      requestData: keyareaobj,
    })
    if (response) {
      if (response.responseData !== null) {
        if (response.responseData && response.responseData.length > 0) {
          const modifiedData = response.responseData.map(item => ({
            ...item,
            ptId: null,
          }))
          setData(modifiedData)
        } else {
          setData([])
          messageReturn(619)
        }
      } else {
        setData([])
        messageReturn(619)
      }
    }
  }
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
      return returnData
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
      return []
    }
  }

  function getWbsTemplateById(value, options) {
    setProjTempltDropDwn(value)
    getWbsTemplateByIdApi(options.key)
  }

  useEffect(() => {
    // c const response = await fetchAssignTeamServicedata()
    // getProjCode()
    getPaymentTermsList()
    getTimeLineByPMS()
    getProjectTimePlanDropdown()
    getDepartmentDropDownData()
    getProjectInitRes()
    // fetchElementDropdown()
  }, [projCode])
  // const PmId = store.get('ProjectID')
  const tenantid = store.get('tenantId')
  const PmHdrIdVal = store.get('ProjectPMHdrId')
  let setPmHdrValue = ''

  if (PmHdrIdVal !== null && PmHdrIdVal !== undefined) {
    setPmHdrValue = PmHdrIdVal
  } else {
    setPmHdrValue = ''
  }

  const [keySubArea, setKeySubArea] = useState([])

  useEffect(() => {
    const newRows = linkStatus.map((res, index) => ({
      key: `${index}`,
      pkaId: res.pkaId,
      pkId: res.pkId,
      pmHdrId: res.pmHdrId,
      tenantId: tenantid,
      allocatedVal: res.allocatedVal,
      totalCount: res.totalCount,
      isret: 1,
      keySubArea: res.pkDesc,
      budgetcost: res.budgetCost,
      actualcost: res.actualCost,
      targetcost: res.targetCost,
      consumedSoFar: res.consumedSoFar,
    }))

    setDatas([...newRows, ...Defaultdata])
  }, [linkStatus])
  const Defaultdata = [
    {
      pkaId: '',
      pkId: '',
      pmHdrId: PmHdrIdVal,
      tenantId: tenantid,
      allocatedVal: 0,
      totalCount: 0,
      isret: 0,
      keySubArea: '',
      budgetcost: '',
      actualcost: '',
      targetcost: '',
    },
  ]

  const [datas, setDatas] = useState(Defaultdata)
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()

  useEffect(() => {
    getKeySubArea()
    getDropDowndata()
    getLinkStatus()
    fetchsaleCateDropdown()
  }, [tenantid, PmHdrIdVal])

  useEffect(() => {
    const newRows = keySubArea.map((res, index) => ({
      key: `${index}`,
      pkaId: res.pkaId,
      pmHdrId: PmHdrIdVal,
      tenantId: tenantid,
      isret: 1,
      keySubArea: res.keyName,
      pkId: res.pkId,
    }))
    setDatas([...newRows, ...Defaultdata])
  }, [keySubArea])

  const getLinkStatus = async () => {
    try {
      const keyareaobj = {
        projectID: PmHdrIdVal,
        tenantID: tenantid,
      }

      const response = await indentFileUpload({
        requestPath: 'getLinkStatusByPMId',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        setLinkStatus(response.responseData)
        if (response.responseData.length > 0) {
          setCostFlowType(response.responseData[0].costFlowType)
        }
      } else {
        setLinkStatus([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const getKeySubArea = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: setPmHdrValue,
      }

      const response = await indentFileUpload({
        requestPath: 'getKeyArea',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        setKeySubArea(response.responseData)
        // setDatas(response.responseData)
      } else {
        // setDropDownLoadData()
        setKeySubArea([])
        console.error('Error: Response data is missing')
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const getDropDowndata = async () => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: '',
      }

      const response = await indentFileUpload({
        requestPath: 'getKeyArea',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        // setKeySubArea(response.responseData)
        const options = response.responseData
          .map(item =>
            item.pkId !== null && item.keyName !== null
              ? { key: item.pkId, value: item.keyName }
              : null,
          )
          .filter(Boolean)
        setDropDowndata(options)
      } else {
        setDropDowndata([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const updateNewProject = async () => {
    let isMandatory
    if (deleteMileStones.length === 1) {
      const lastItem = deleteMileStones[deleteMileStones.length - 1]
      isMandatory =
        lastItem &&
        lastItem.milestoneName !== '' &&
        lastItem.responsibleDeptCode !== null &&
        lastItem.responsibleName !== null
    } else if (deleteMileStones.length > 1) {
      const lastItem = deleteMileStones[deleteMileStones.length - 1]
      if (
        lastItem.milestoneName === '' &&
        lastItem.responsibleDeptCode === null &&
        lastItem.responsibleName === null
      ) {
        deleteMileStones.splice(deleteMileStones.length - 1, 1)
        isMandatory = true
      } else if (
        lastItem.milestoneName === '' ||
        lastItem.responsibleDeptCode === null ||
        lastItem.responsibleName === null
      ) {
        isMandatory = false
      } else if (
        lastItem.milestoneName !== '' ||
        lastItem.responsibleDeptCode !== null ||
        lastItem.responsibleName !== null
      ) {
        isMandatory = true
      }
    }
    if (isMandatory) {
      try {
        // const insertMileStoneobj = deleteMileStones
        const updatedDeleteMileStones = deleteMileStones.map(item => ({
          ...item,
          responsibleDeptCode: item.deptName ? item.deptName : item.responsibleDeptCode,
          responsibleName: item.empName ? item.empName : item.responsibleName,
          plannedEndDate: moment(item.plannedEndDate).format('YYYY-MM-DD'),
          plannedStartDate: moment(item.plannedStartDate).format('YYYY-MM-DD'),
          updatedBy: employeeId,
        }))
        const mileStoneResp = await indentFileUpload({
          requestPath: 'insertUpdateProjectMilestone',
          requestData: updatedDeleteMileStones,
        })
        const response = await indentFileUpload({
          requestPath: 'updateProjectPlanDate',
          requestData: {
            pmHdrId: store.get('ProjectPMHdrId'),
            pmPlanDate: planStartDate
              ? moment(planStartDate).format('YYYY-MM-DD')
              : moment().format('YYYY-MM-DD'),
            pmEndDate: planEndDate
              ? moment(planEndDate).format('YYYY-MM-DD')
              : moment().format('YYYY-MM-DD'),
            priority: priorityValue,
            tenantId: tenantid,
          },
        })

        const milstoneResp = mileStoneResp.responseMessage
        if (milstoneResp === 'Successfully Updated') {
          success(milstoneResp)
          setData([])
          setData(setDefaultMileStone)
          setProjTempltDropDwn([])
          // setclearMileStoneName('')
          getTimeLineByPMS()
        } else {
          error(milstoneResp)
        }
        if (response) {
          if (response.responseCode === '200') {
            // success(response.responseMessage)
          }
        }
      } catch (error) {
        console.error('Error Inserting Key Area:', error)
      }
    } else {
      errosr(Message)
    }
  }

  const success = resp => {
    message.success(resp)
  }
  const error = resp => {
    message.error(resp)
  }
  const errosr = resp => {
    message.error(resp)
  }

  const getElementValue = () => {
    const formValues = form.getFieldsValue()
    const formval = formValues.KeyArea
    getBudgetLinkPopUpValues(formval)
  }
  const getBudgetLinkPopUpValues = async val => {
    setIsLoading(true)
    const responses = await indentFileUpload({
      requestPath: 'getsalesBudgetExtnDtl',
      requestData: {
        pmHdrId: store.get('ProjectPMHdrId'),
        elementDesc: val,
        tenantId: tenantid,
        keyCode: salecatcode,
      },
    })
    const resp = responses.responseData
    if (resp) {
      if (resp.length > 0) {
        // form.resetFields()
        // form.setFieldsValue({
        //   KeyArea: 'Select Element',
        // })
        // setElementDropDownVal([])
        setIsLoading(false)
        setBudgetLinkTablDtl(resp)
        // setpopupdskId(resp[0].dskId)
        // setpopupsbExtnId(resp[0].sbExtnId)
        // setAllocatedQty(resp[0].totalValue)
        resp.forEach(res => {
          const fieldName =
            costFlowType === 'NEW'
              ? `allocatedValue_${res.sbExtnId}`
              : `allocatedQty_${res.sbExtnId}`
          // tableform.setFieldsValue({ [fieldName]: parseInt(res.totalQty, 10) })
          tableform.setFieldsValue({ [fieldName]: '' })
        })
      } else {
        // form.setFieldsValue({
        //   SalesCategory: 'Select Element',
        // })
        setIsLoading(false)
        // setElementDropDownVal([])
        // form.resetFields()
        // setSaleCategoryDrpDown([])
        setBudgetLinkTablDtl([])
      }
    } else {
      // setElementDropDownVal([])
      // form.resetFields()
      setSaleCategoryDrpDown([])
      setIsLoading(false)
      setBudgetLinkTablDtl([])
    }
  }
  function getSaleCatValue(e) {
    form.setFieldsValue({
      KeyArea: 'Select Element',
    })
    fetchElementDropdown(e)
    setSalecatcode(e)
  }
  const handlekeyAreaChange = (val, ind) => {
    const updatedDatas = [...datas]
    updatedDatas[ind] = { ...updatedDatas[ind], keySubArea: val }
    setDatas(updatedDatas)
  }

  const handleChangeDropDown = (val, opt, ind) => {
    const updatedDatas = [...datas]
    updatedDatas[ind] = { ...updatedDatas[ind], keySubArea: val }
    setDatas(updatedDatas)
  }
  const showModal = record => {
    setSelectedRecordVal(`${record.keySubArea} - Budget Link`)
    setIsModalOpen(true)
    getTotalSubAreaVal(record)
    setDskId(record.pkaId)
  }
  const getTotalSubAreaVal = async e => {
    setPkaId(e)
    const responses = await indentFileUpload({
      requestPath: 'totalSubAreaValueByPskId',
      requestData: {
        pmHdrId: store.get('ProjectPMHdrId'),
        pkaId: e.pkaId,
        tenantId: tenantid,
      },
    })
    if (responses) {
      if (responses.responseCode === '200') {
        const resmsg = responses.responseDataMessage
        form.setFieldsValue({ totalAllocVal: parseFloat(resmsg).toLocaleString('en-IN') })
        // setPopupTotalAllocVal(resmsg)
      } else {
        // setPopupTotalAllocVal('0');
      }
    }
  }

  const handleSaveBudgetLink = async () => {
    setDisablebtn(true)
    setIsLoading(true)
    if (budgetLinkTablDtl.length > 0) {
      const formValues = tableform.getFieldsValue(true)
      const reqArr = budgetLinkTablDtl.map(item => {
        const perPartVal = parseFloat(item.perPartVal) || 0
        let allocatedQty
        let allocatedvalue
        if (costFlowType === 'NEW') {
          allocatedvalue = parseFloat(formValues[`allocatedValue_${item.sbExtnId}`]) || 0
          allocatedQty = perPartVal > 0 ? allocatedvalue / perPartVal : 0
        } else {
          allocatedQty = parseFloat(formValues[`allocatedQty_${item.sbExtnId}`]) || 0
          allocatedvalue = perPartVal * allocatedQty || 0
        }
        const obj = {
          pkaId: dskIdVal,
          sbExtnId: item.sbExtnId,
          allocatedQty,
          allocatedvalue,
          tenantId: tenantid,
          pmId: Tab.processCode,
          empId: employeeId,
          source: 'WBS',
        }

        const objAsString = {}
        Object.keys(obj).forEach(key => {
          objAsString[key] = String(obj[key])
        })
        return objAsString
      })
      // Both backend updates this feeds (project_key_area_extn / sales_budget_sheet_extn) are
      // additive (ALLOCATED_VALUE = ALLOCATED_VALUE + ?), so sending 0 for a row nobody touched
      // is a harmless no-op for the actual allocation math - but insertSubAreaExtnHist still
      // inserts a Topup History row for every entry in the array unconditionally, flooding the
      // history with meaningless "0/0" rows for every untouched item in the table. Only send
      // rows that actually have something to add.
      const touchedRows = reqArr.filter(item => item.allocatedvalue !== '0' || item.allocatedQty !== '0')
      if (touchedRows.length === 0) {
        errosr('Enter at least one Allocated Value before saving')
        setDisablebtn(false)
        setIsLoading(false)
        return
      }
      const response = await indentFileUpload({
        requestPath: 'insertSubAreaExtn',
        requestData: touchedRows,
      })

      if (response) {
        if (response.responseCode === '200') {
          setDisablebtn(false)
          setIsLoading(false)
          getElementValue()
          getLinkStatus()
          getTotalSubAreaVal(pkaId)
          success(response.responseMessage)
        } else {
          errosr(response.responseMessage)
        }
      }
    } else {
      setDisablebtn(false)
      setIsLoading(false)
      errosr('Minimum one Allocated Qty should be greater than zero')
    }
    // } else {
    //   setDisablebtn(false)
    //   setIsLoading(false)
    //   errosr('No records to insert ')
    // }
  }

  const handleViewTopupHistory = async () => {
    setTopupHistoryLoading(true)
    setTopupHistoryOpen(true)
    const response = await indentFileUpload({
      requestPath: 'getSubAreaExtnHist',
      requestData: {
        pkaId: dskIdVal,
        tenantId: tenantid,
      },
    })
    setTopupHistoryLoading(false)
    setTopupHistoryDtl(response && response.responseData ? response.responseData : [])
  }

  const topupHistoryColumns = [
    { title: 'Element', dataIndex: 'elementHdr', key: 'elementHdr' },
    { title: 'Element Desc', dataIndex: 'elementDtl', key: 'elementDtl' },
    {
      title: `Allocated Value ${curr}`,
      dataIndex: 'allocatedvalue',
      key: 'allocatedvalue',
      className: 'right-align-cell',
      render: text => (text ? parseFloat(text).toLocaleString('en-IN') : '0'),
    },
    {
      title: 'Allocated Qty',
      dataIndex: 'allocatedQty',
      key: 'allocatedQty',
      className: 'right-align-cell',
      render: text => (text ? parseFloat(text).toLocaleString('en-IN') : '0'),
    },
    { title: 'Source', dataIndex: 'source', key: 'source' },
    { title: 'Allocated By', dataIndex: 'empName', key: 'empName', render: text => text || '-' },
    {
      title: 'Allocated On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: text => (text ? moment(text).format('DD-MM-YYYY hh:mm A') : '-'),
    },
  ]

  const handleRemoveAllocatedValRow = async rec => {
    const response = await indentFileUpload({
      requestPath: 'deleteSubAreaExtn',
      requestData: {
        pkseId: rec.pkseId,
        tenantId: tenantid,
        pmId: Tab.processCode,
      },
    })
    if (response) {
      if (response.responseCode === '200') {
        // setIsModalVal(false)
        getSubAreaPm(allocateVal)
        getLinkStatus()
        success(response.responseMessage)
      } else {
        errosr(response.responseMessage)
      }
    }
  }

  const columnss = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      // render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Station',
      dataIndex: 'keySubArea',
      key: 'keySubArea',
      render: (textv, record, index) => {
        return record.isret === 1 ? (
          record.keySubArea
        ) : (
          <AutoComplete
            style={{ width: 180 }}
            options={dropDownData}
            onSearch={text => handleChangeDropDown(text, record, index)}
            onSelect={value => handlekeyAreaChange(value, index)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        )
      },
    },
    ...(costFlowType === 'NEW'
      ? [
          {
            title: `Consumed So Far ${curr}`,
            dataIndex: 'consumedSoFar',
            key: 'consumedSoFar',
            className: 'right-align-cell',
            render: (text, record) => {
              const consumedSoFar = record.consumedSoFar
              return consumedSoFar !== '' && consumedSoFar !== undefined ? (
                <span>{parseFloat(consumedSoFar).toLocaleString('en-IN')}</span>
              ) : (
                ''
              )
            },
          },
        ]
      : [
          {
            title: `Budget Cost ${curr}`,
            dataIndex: 'budgetCost',
            key: 'budgetCost',
            className: 'right-align-cell',
            render: (text, record) => {
              const budgetCost = record.budgetcost
              return budgetCost !== '' ? (
                <span>{parseFloat(budgetCost).toLocaleString('en-IN')}</span>
              ) : (
                ''
              )
            },
          },
          {
            title: `Target Cost ${curr}`,
            dataIndex: 'targetCost',
            key: 'targetCost',
            className: 'right-align-cell',
            render: (text, record) => {
              const targetCost = record.targetcost
              return targetCost !== '' ? (
                <span>{parseFloat(targetCost).toLocaleString('en-IN')}</span>
              ) : (
                ''
              )
            },
          },
          {
            title: `Actual Cost ${curr}`,
            dataIndex: 'actualCost',
            key: 'actualCost',
            className: 'right-align-cell',
            render: (text, record) => {
              const actualCost = record.actualcost
              return actualCost !== '' ? (
                <span>{parseFloat(actualCost).toLocaleString('en-IN')}</span>
              ) : (
                ''
              )
            },
          },
        ]),
    {
      title: `Allocated Value ${curr}`,
      dataIndex: 'allocatedVal',
      key: 'allocatedVal',
      className: 'right-align-cell',
      render: (_, record) => (
        <span
          onClick={() => ShowModalPopup(record)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              ShowModalPopup(record)
            }
          }}
          role="button"
          tabIndex={0}
          style={{
            cursor: record.allocatedVal === '0' ? 'none' : 'pointer',
            color: record.allocatedVal === '0' ? 'black' : 'blue',
          }}
        >
          {record.allocatedVal !== '0'
            ? parseFloat(record.allocatedVal).toLocaleString('en-IN')
            : 0}
        </span>
      ),
    },
    {
      title: 'Budget Linked',
      dataIndex: 'keySubArea',
      key: 'keySubArea',
      render: (_, record, index) =>
        index === datas.length - 1 ? (
          // <Button
          //   style={{
          //     color: 'black',
          //     border: 'none',
          //     borderRadius: '3px',
          //   }}
          // >
          //   Link
          // </Button>
          ''
        ) : (
          <Button
            style={{
              background: record.totalCount === '0' ? 'red' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
            }}
            onClick={() => showModal(record)}
            disabled={projInitDataMsg === '0'}
          >
            Link
          </Button>
        ),
    },
    {
      title: 'Action',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      render: (text, record, index) =>
        // const lastRow = data.length - 1;
        datas.length >= 1 ? (
          <span>
            {index === datas.length - 1 ? (
              <AddIconButton onClick={() => handleAddRows(record, index)} />
            ) : null}

            {index !== datas.length - 1 ? (
              <RemoveIcon
                disableInputBoxes={record.allocatedVal > 0}
                onClick={() => handleRemoveRows(record, index)}
              />
            ) : null}
          </span>
        ) : null,
    },
  ]
  const ModalLinkCol = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
    },
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
    },
    {
      title: 'Element Desc.',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
    },
    {
      title: 'Alloc. Qty',
      dataIndex: 'allocatedQty',
      key: 'allocatedQty',
      className: 'right-align-cell',
    },
    {
      title: `Alloc. Value ${curr}`,
      dataIndex: 'allovatedValue',
      key: 'allovatedValue',
      className: 'right-align-cell',
      render: (text, record) => (
        <span>{`${parseFloat(record.allovatedValue).toLocaleString('en-IN')}`} </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      // render: (text, record, index) => (
      //   <RemoveIcon
      //     onClick={() => handleRemoveAllocatedValRow(record, index)}
      //     disableInputBoxes={projInitDataMsg === '0'}
      //   />
      // ),

      render: (text, record, index) => (
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ margin: '10px 10px' }}>Confirm Delete?</span>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleRemoveAllocatedValRow(record, index)
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            }
            trigger="click"
          >
            <RemoveIcon />
          </Popover>
        </div>
      ),
    },
  ]

  const getProjectInitRes = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getProjectInitiationMstResp',
        requestData: {
          pmId: processCode,
          empId: employeeId,
          tenantId: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          setProjInitDataMsg(response.responseDataMessage)
          store.set('dueDateBtnStats', response.responseDataMessage)
        } else {
          setProjInitDataMsg(null)
        }
      }
    } catch (err) {
      console.error('Error ', err)
    }
  }

  const FieldsModalValComponent = () => {
    const [filteredData, setFilteredData] = useState(subArearec)
    const handleSearch = e => {
      const filteringdatas = subArearec.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(e.target.value.toLowerCase()),
        ),
      )
      setFilteredData(filteringdatas)
    }
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <Buttons
            type="primary"
            icon={<HistoryOutlined />}
            text="History"
            onClick={handleViewTopupHistory}
          />
          <Input.Search
            style={{ width: '30%' }}
            placeholder="Search here..."
            enterButton
            // onSearch={handleSearch}
            onChange={e => handleSearch(e)}
          />
        </div>
        <Table
          dataSource={filteredData}
          columns={ModalLinkCol}
          pagination={false}
          scroll={{ y: 300 }}
          sticky
          bordered
        />
      </div>
    )
  }
  const ButtonsValComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Buttons type="primary" text="Close" onClick={handleCancelModalVal} />
      </div>
    )
  }
  const errors = resp => {
    message.error(resp)
  }
  const handleAddRows = async val => {
    if (val.keySubArea !== '') {
      try {
        const keyareaobj = [
          {
            pmHdrId: PmHdrIdVal,
            pkId: val.keySubArea,
            tenantId: tenantid,
            pmId: processCode,
          },
        ]
        const response = await indentFileUpload({
          requestPath: 'insertKeyAreaByPMId',
          requestData: keyareaobj,
        })

        if (response) {
          if (response.responseCode === '200') {
            getLinkStatus()
            success(response.responseMessage)
          } else {
            errors(response.responseMessage)
          }
        } else {
          console.error('Failed to Add Record')
        }
      } catch (err) {
        console.error('Error fetching key area:', err)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleRemoveRows = async record => {
    if (datas.length > 1) {
      try {
        const response = await indentFileUpload({
          requestPath: 'deletePKByPKAId',
          requestData: {
            pkaId: record.pkaId,
            projectid: store.get('ProjectPMHdrId'),
            tenantId: tenantid,
          },
        })

        if (response) {
          if (response.responseCode === '200') {
            getLinkStatus()
            success(response.responseMessage)
          } else {
            errors(response.responseMessage)
          }
        }
      } catch (err) {
        console.error('Error Deleting key area:', err)
      }
    } else {
      console.log('At least one primary contact required')
    }
  }

  const fetchsaleCateDropdown = async () => {
    const response = await getSalesCategory({
      doctype: Tab.docTypeCode,
      tenId: Tab.tenantId,
      enqID: enquiryId,
    })
    if (response) {
      if (response.responseCode === '200') {
        if (response.responseData.length > 0) {
          setSaleCategoryDrpDown(response.responseData)
        } else {
          setSaleCategoryDrpDown([])
        }
      } else {
        setSaleCategoryDrpDown([])
      }
    }
  }
  const handleAllocateChange = (value, record) => {
    if (value === null || value === '' || Number.isNaN(value)) return

    const valueStr = value.toString()
    const decimalValid = /^(\d+)?(\.\d{0,4})?$/.test(valueStr)

    if (!decimalValid) {
      errosr('Only up to 4 decimal places are allowed.')
      return
    }

    const allocatedQty = parseFloat(value)
    const availableQty = parseFloat(record.totalQty)
    const fieldName = `allocatedQty_${record.sbExtnId}`

    if (allocatedQty <= availableQty) {
      tableform.setFieldsValue({
        [fieldName]: parseFloat(allocatedQty.toFixed(2)),
      })
    } else {
      errosr('Allocated Qty. cannot be higher than Available Qty.')
      tableform.setFieldsValue({
        [fieldName]: parseFloat(availableQty.toFixed(2)),
      })
    }
  }

  // NEW-flow only: client wants allocation entered as an amount, not a quantity.
  // LEGACY keeps handleAllocateChange (qty-based) completely untouched above.
  const handleAllocateValueChange = (value, record) => {
    if (value === null || value === '' || Number.isNaN(value)) return

    const valueStr = value.toString()
    const decimalValid = /^(\d+)?(\.\d{0,4})?$/.test(valueStr)

    if (!decimalValid) {
      errosr('Only up to 4 decimal places are allowed.')
      return
    }

    const allocatedValue = parseFloat(value)
    const fieldName = `allocatedValue_${record.sbExtnId}`
    tableform.setFieldsValue({ [fieldName]: parseFloat(allocatedValue.toFixed(2)) })
  }

  // Blocks the keystroke itself, before it ever reaches the DOM - clamping after the
  // fact (via parser/onChange + a forced re-render) fights rc-input-number's own
  // cursor-restoration logic and corrupts the displayed digits (e.g. typing past the
  // cap could splice new digits into the wrong position, showing a scrambled number).
  // Computing the prospective value from the current text + cursor selection and
  // rejecting the keystroke outright avoids all of that.
  const blockOverLimitKeyDown = (e, record) => {
    if (!/^\d$/.test(e.key)) return
    const input = e.target
    const currentText = input.value || ''
    const selStart = input.selectionStart ?? currentText.length
    const selEnd = input.selectionEnd ?? currentText.length
    const prospective = currentText.slice(0, selStart) + e.key + currentText.slice(selEnd)
    const num = parseFloat(prospective)
    const cap = parseFloat(record.availableAmount) || 0
    if (!Number.isNaN(num) && num > cap) {
      e.preventDefault()
    }
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const ElementDesc1 = []
  if (budgetLinkTablDtl) {
    budgetLinkTablDtl.map(h => {
      return ElementDesc1.push(h.elementDtl)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const ElementDesc2 = ElementDesc1.filter(distinct)
  const ElementDesc3 = []
  ElementDesc2.map(element => {
    return ElementDesc3.push({
      text: element,
      value: element,
    })
  })

  const budgetLink = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '7%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Element',
      dataIndex: 'elementHdr',
      key: 'elementHdr',
      width: '20%',
    },
    {
      title: 'Element Desc',
      dataIndex: 'elementDtl',
      key: 'elementDtl',
      width: '20%',
      filters: ElementDesc3,
      filteredValue: filtersinfo.elementDtl,
      onFilter: (value, record) => record?.elementDtl === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
    },
    ...(costFlowType === 'NEW'
      ? [
          {
            title: 'Qty',
            dataIndex: 'totalQty',
            key: 'totalQty',
            className: 'right-align-cell',
            render: (text, record) => <span>{parseFloat(record.totalQty)}</span>,
          },
          {
            title: `Total Amount ${curr}`,
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            className: 'right-align-cell',
            render: (text, record) => (
              <span>
                {record.totalAmount ? parseFloat(record.totalAmount).toLocaleString('en-IN') : '0'}
              </span>
            ),
          },
          {
            title: `Utilized Amount ${curr}`,
            dataIndex: 'utilizedAmount',
            key: 'utilizedAmount',
            className: 'right-align-cell',
            render: (text, record) => (
              <span>
                {record.utilizedAmount
                  ? parseFloat(record.utilizedAmount).toLocaleString('en-IN')
                  : '0'}
              </span>
            ),
          },
          {
            title: `Amount Available ${curr}`,
            dataIndex: 'availableAmount',
            key: 'availableAmount',
            className: 'right-align-cell',
            render: (text, record) => (
              <span>
                {record.availableAmount
                  ? parseFloat(record.availableAmount).toLocaleString('en-IN')
                  : '0'}
              </span>
            ),
          },
          {
            title: `Allocated Value ${curr}`,
            dataIndex: 'allocatedValue',
            key: 'allocatedValue',
            render: (text, record) => (
              <Form form={tableform} initialValues={{ ...record }}>
                <Form.Item name={`allocatedValue_${record.sbExtnId}`} initialValue={undefined}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => (value === null || value === undefined ? '' : value)}
                    parser={value => {
                      if (value === '' || value === null || value === undefined) return ''
                      const num = parseFloat(value)
                      if (Number.isNaN(num)) return ''
                      const cap = parseFloat(record.availableAmount) || 0
                      if (num < 0) return 0
                      return num > cap ? cap : num
                    }}
                    controls={false}
                    min={0}
                    max={parseFloat(record.availableAmount) || 0}
                    disabled={!record.availableAmount || parseFloat(record.availableAmount) <= 0}
                    onKeyDown={e => blockOverLimitKeyDown(e, record)}
                    onChange={value => handleAllocateValueChange(value, record)}
                  />
                </Form.Item>
              </Form>
            ),
          },
        ]
      : [
          {
            title: 'Available Qty.',
            dataIndex: 'totalQty',
            key: 'totalQty',
            className: 'right-align-cell',
            render: (text, record) => <span>{parseFloat(record.totalQty)}</span>,
          },
          {
            title: `Unit Value ${curr}`,
            dataIndex: 'perPartVal',
            key: 'perPartVal',
            className: 'right-align-cell',
            render: (text, record) => (
              <span>
                {record.perPartVal ? parseFloat(record.perPartVal).toLocaleString('en-IN') : '0'}
              </span>
            ),
          },
          {
            title: 'Allocated Qty',
            dataIndex: 'allocatedQty',
            key: 'allocatedQty',
            render: (text, record) => (
              <Form form={tableform} initialValues={{ ...record }}>
                <Form.Item name={`allocatedQty_${record.sbExtnId}`} initialValue={undefined}>
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => (value === null || value === undefined ? '' : value)}
                    parser={value => (value === '' ? null : value)}
                    onChange={value => handleAllocateChange(value, record)}
                  />
                </Form.Item>
              </Form>
            ),
          },
        ]),
  ]
  const fetchElementDropdown = async e => {
    const response = await indentFileUpload({
      requestPath: 'getelementHdrDistinct',
      requestData: {
        projectID: store.get('ProjectPMHdrId'),
        tenantID: tenantid,
        keyCode: e,
      },
    })
    const ElementResp = response.responseData
    if (ElementResp.length > 0) {
      setElementDropDownVal(ElementResp)
    } else {
      setElementDropDownVal([])
    }
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
    setElementDropDownVal([])
    setBudgetLinkTablDtl([])
  }

  const handleAllocate = () => {
    if (budgetLinkTablDtl.length > 0) {
      const updatedValues = budgetLinkTablDtl.map(rec => {
        const fieldName =
          costFlowType === 'NEW'
            ? `allocatedValue_${rec.sbExtnId}`
            : `allocatedQty_${rec.sbExtnId}`
        return { [fieldName]: null }
      })
      tableform.setFieldsValue(Object.assign({}, ...updatedValues))
    } else {
      errosr('No Records Selected')
    }
  }
  const handleUnAllocate = () => {
    if (budgetLinkTablDtl.length > 0) {
      const updatedValues = budgetLinkTablDtl.map(rec => {
        if (costFlowType === 'NEW') {
          const fieldName = `allocatedValue_${rec.sbExtnId}`
          return { [fieldName]: parseFloat(rec.availableAmount) || 0 }
        }
        const fieldName = `allocatedQty_${rec.sbExtnId}`
        return { [fieldName]: parseInt(rec.totalQty, 10) }
      })
      tableform.setFieldsValue(Object.assign({}, ...updatedValues))
    } else {
      errosr('No Records Selected')
    }
  }

  const FieldsComponent = () => {
    return (
      <SpinLoading loading={isLoading}>
        <div className="row ml-2">
          <div className="form_indent" style={{ width: '100%' }}>
            <Form form={form} layout="vertical" labelAlign="left">
              <div className="row form_datas">
                <div className="col-md-4">
                  <Form.Item
                    name="SalesCategory"
                    label={
                      <span>
                        Sales Category<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select placeholder="Select Sale Category" onChange={e => getSaleCatValue(e)}>
                      {saleCategoryDrpDown &&
                        saleCategoryDrpDown.map(item => (
                          <Option key="serial-number" value={item.keyCatCode}>
                            {item.keyCategory}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name="KeyArea"
                    label={
                      <span>
                        Element<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select placeholder="Select Element" onChange={getElementValue}>
                      {elementDropDownVal.map(item => (
                        <Option key={item.elementhdr} value={item.elementhdr}>
                          {item.elementhdr}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-md-4">
                  <Form.Item
                    name="totalAllocVal"
                    label={
                      <span>
                        `Total Allocated Value {curr}`<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <InputComponent type="text" disabled />
                  </Form.Item>
                </div>
                <div className="col-md-1">
                  <Buttons type="primary" text="Unallocate" onClick={handleAllocate} />
                </div>
                <div className="col-md-1" style={{ marginLeft: '5px' }}>
                  <Buttons type="primary" text="Allocate All" onClick={handleUnAllocate} />
                </div>
                <div className="col-md-12">
                  {budgetLinkTablDtl ? (
                    <Table
                      dataSource={budgetLinkTablDtl}
                      columns={budgetLink}
                      pagination={false}
                      scroll={{ y: 300 }}
                      sticky
                      bordered
                      onChange={handleChange}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </SpinLoading>
    )
  }
  const ButtonsComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Buttons type="primary" text="Save" disable={disablbtn} onClick={handleSaveBudgetLink} />
      </div>
    )
  }

  useEffect(() => {
    if (projCode && projCode !== '-') {
      setGenerateCode(projCode)
      setIsProjectCreated(true)
    } else {
      setIsProjectCreated(false)
      setGenerateCode('')
      setManualProjectId('')
    }
  }, [projCode])

  const handleGenerate = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'GenerateAndUpdateProjectCode',
        requestData: {
          pmHdrId: store.get('ProjectPMHdrId'),
          tenantId: tenantid,
          projectCode: manualProjectId,
        },
      })

      if (response) {
        if (response.responseCode === '200') {
          setGenerateCode(response.responseDataMessage)
          setIsProjectCreated(true)
          success(response.responseMessage)
          history.push('/project')
        } else {
          setManualProjectId('')
          errors(response.responseMessage)
        }
      }
    } catch {
      console.error('An error occurred.')
    }
  }

  const onChangefromdate = dateVal => {
    if (planEndDate && dateVal && dateVal < planEndDate) {
      errosr('Project End Date cannot be before Project Planned Date')
      return
    }
    setPlanStartDate(moment(dateVal, dateFormatList))
  }

  const onChangeenddate = dateVal => {
    if (planStartDate && dateVal && dateVal < planStartDate) {
      errosr('Project End Date cannot be before Project Planned Date')
      return
    }
    setPlanEndDate(moment(dateVal, dateFormatList))
  }

  return (
    <div>
      <div
        className="d-flex flex-column justify-content-center mr-auto"
        style={{ marginTop: '10px' }}
      >
        <div>
          <h5>Project Initiation</h5>
        </div>
      </div>
      <div>
        <Row gutter={[16, 24]}>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Project Number</h6>
            {/* {projCode === '-' && generateCode === null ? (
              <Button type="primary" onClick={handleGenerte}>
                Generate
              </Button> */}
            {/* ) : generateCode !== null ? (
              generateCode
            ) : (
              <Input placeholder="<-- Auto Generated -->" disabled value={projCode} /> 
            )} */}
            {/* Reference Code with Reset Functionality */}
            {projCode === '-' && !generateCode ? (
              <>
                <Input
                  placeholder="Enter project ID"
                  value={manualProjectId}
                  onChange={e => setManualProjectId(e.target.value)}
                  disabled={isProjectCreated}
                />
                {!isProjectCreated && (
                  <Button type="primary" onClick={handleGenerate} style={{ marginTop: '10px' }}>
                    Submit
                  </Button>
                )}
              </>
            ) : (
              <Input placeholder="<-- Auto Generated -->" value={generateCode} disabled />
            )}
          </Col>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Project Time Plan</h6>
            <Select
              placeholder="Select Project Template"
              disabled={isTempDisabled}
              value={projTempltDropDwn}
              style={{ width: '100%' }}
              onChange={getWbsTemplateById}
            >
              {wbsTemplate.map(item => (
                <Option key={item.pmHdrId} value={item.pmHdrDesc}>
                  {item.pmHdrDesc}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6> Initiated Date </h6>
            <Input
              disabled="true"
              value={
                initiateDate !== null
                  ? moment(initiateDate).format('DD-MMM-YYYY')
                  : 'Not yet Initiated'
              }
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={7} xl={4}>
            <h6>{`Sale Value ${curr}`}</h6>
            <Input
              disabled={isTempDisabled}
              value={saleVal !== null ? parseFloat(saleVal).toLocaleString('en-IN') : 0}
            />
          </Col>
          {paymentTermListVal.length > 0 && (
            <Col xs={24} sm={12} md={5} lg={7} xl={4}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  paddingTop: '20px',
                  paddingRight: '10px',
                }}
              >
                <Button type="primary" onClick={() => setViewModalOpen(true)}>
                  View Payment Terms
                </Button>
              </div>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 24]} style={{ marginTop: '10px' }}>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Type of Project</h6>
            <Input disabled={isTempDisabled} value={indtype} />
          </Col>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Commodity</h6>
            <Input
              placeholder=""
              disabled={isTempDisabled}
              // disabled
              value={scopework}
              // onChange={event => {
              //   onChangeProjName(event)
              // }}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Priority</h6>
            <Select
              placeholder="Select Project Priority"
              // disabled={isTempDisabled}
              value={priorityValue}
              style={{ width: '100%' }}
              onChange={value => {
                setPriorityValue(value)
              }}
            >
              <Select.Option key="1" value="High">
                High
              </Select.Option>
              <Select.Option key="2" value="Medium">
                Medium
              </Select.Option>
              <Select.Option key="3" value="Low">
                Low
              </Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={8} xl={5}>
            <h6>Planned Start Date</h6>
            <DatePicker
              monthsShown={1}
              format="DD-MMM-YYYY"
              disablepicker={isTempDisabled}
              onChange={(date, dateString) => onChangefromdate(dateString)}
              // disabledDate={d => !d || d.isBefore(moment())}
              disabled={disable}
              selectsRange
              inline
              style={{ width: '100%' }}
              value={planStartDate ? moment(planStartDate) : moment()}
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={7} xl={4}>
            <h6>Project End Date</h6>
            <DatePicker
              style={{ width: '100%' }}
              mb="5px"
              monthsShown={1}
              format="DD-MMM-YYYY"
              disablepicker={isTempDisabled}
              onChange={(date, dateString) => onChangeenddate(dateString)}
              // disabledDate={d => !d || d.isBefore(moment())}
              disabled={disable}
              selectsRange
              inline
              // value={planEndDate}
              value={planEndDate ? moment(planEndDate) : moment(enddate)}
            />
          </Col>
        </Row>
        <Row>
          <Divider orientation="left">Key Milestones</Divider>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={deleteMileStones}
              columns={removeColumns}
              pagination={false}
              bordered
              scroll={{ y: 400 }}
            />
          </Col>
        </Row>
        <br />

        <Row style={{ marginTop: '20px' }}>
          <Col span={24}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <h5 style={{ margin: 0 }}>Work Breakdown Structure</h5>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={() => handleExport(datas, `Work_Breakdown_Structure ${currentDateTime}`)}
              >
                Export to CSV
              </Button>
            </div>

            <Table
              rowClassName={() => 'editable-row'}
              columns={columnss}
              dataSource={datas}
              pagination={false}
              bordered
              scroll={{ y: 400 }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: '20px', display: 'none' }}>
            <center>
              <Button type="primary" onClick={updateNewProject}>
                Submit
              </Button>{' '}
              &nbsp;&nbsp;
              <Button type="primary">Cancel</Button>
            </center>
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: '10px' }}>
        <ApproveOrRejectButton
          refId={slaveId}
          refDoctTyp={docTypeCode}
          tenId={tenantId}
          btnShow={display}
          // isEditableBtn={isEditable}
          isEditableBtn="1"
          submitFunction={submitFunction}
          saveButtonStatus={saveButtonStatus}
          componentToRender="project"
          getReferenceIdVal={getReferenceIdVal}
          saveButtonStatusVal="1"
        />
      </div>

      <Modal
        title="Payment Terms"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={PTform} component={false}>
          <Table
            style={{ width: '790px' }}
            dataSource={paymentTermListVal}
            columns={[
              {
                title: 'Payment Term',
                dataIndex: 'term',
                key: 'term',
                width: 950,
              },
              {
                title: 'Percentage',
                dataIndex: 'percentage',
                key: 'percentage',
                width: 100,
              },
              {
                title: 'Planned Date',
                dataIndex: 'plannedDate',
                key: 'plannedDate',
                width: 450,
              },
              {
                title: 'Actual Date',
                dataIndex: 'actualDate',
                key: 'actualDate',
                width: 850,
                render: (text, record, index) => (
                  <Form.Item
                    name={`actualDate-${index}`}
                    style={{ margin: 0 }}
                    initialValue={
                      record.actualDate
                        ? moment(record.actualDate)
                        : record.plannedDate
                        ? moment(record.plannedDate)
                        : null
                    }
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                  </Form.Item>
                ),
              },
              {
                title: 'Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
                width: 850,
                render: (text, record, index) => (
                  <Form.Item
                    name={`remarks-${index}`}
                    style={{ margin: 0 }}
                    initialValue={record.remarks}
                    // rules={[{ required: true, message: 'Please input remarks!' }]}
                  >
                    <Input />
                  </Form.Item>
                ),
              },
            ]}
            pagination={false}
            rowKey={(record, index) => index}
          />
        </Form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={async () => {
              try {
                const values = await PTform.validateFields()
                console.log(values, 'check values')

                const updatedList = paymentTermListVal.map((item, index) => ({
                  ...item,
                  actualDate: values[`actualDate-${index}`]
                    ? values[`actualDate-${index}`].format('YYYY-MM-DD')
                    : null,
                  remarks: values[`remarks-${index}`],
                }))

                setPaymentTermListVal(updatedList)
                setViewModalOpen(false)
                console.log('Saved:', updatedList)
              } catch (err) {
                console.error('Validation Error:', err)
              }
              updatePaymentTerms()
            }}
          >
            Save
          </Button>
        </div>
      </Modal>

      <ModalPopupBox
        text={` ${allocateVal?.keySubArea} - Allocated Value`}
        isModalVisible={isModalVal}
        FieldsComponent={FieldsModalValComponent}
        ButtonsComponent={ButtonsValComponent}
        onCancel={handleCancelModalVal}
        width={1200}
      />
      <ModalPopupBox
        text={selectedRecordVal}
        isModalVisible={isModalOpen}
        FieldsComponent={FieldsComponent}
        ButtonsComponent={ButtonsComponent}
        onCancel={handleCancel}
        width={1500}
      />
      <Modal
        title="Topup History"
        open={topupHistoryOpen}
        onCancel={() => setTopupHistoryOpen(false)}
        footer={null}
        width={900}
      >
        <Table
          dataSource={topupHistoryDtl}
          columns={topupHistoryColumns}
          loading={topupHistoryLoading}
          rowKey="pkseHistId"
          pagination={false}
          scroll={{ y: 300 }}
          bordered
        />
      </Modal>
    </div>
  )
}
export default ProjectInitiation
