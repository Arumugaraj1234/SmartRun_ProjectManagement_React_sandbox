import React, { useEffect, useState } from 'react'
import store from 'store'
import { Skeleton, Form, Select, message, Input, Card } from 'antd'
import moment from 'moment'
import { FileExcelOutlined, CommentOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import '../../pages/style.scss'
// import Table from '../../../../components/common/TableComponent'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import InputComponent from '../../../../components/shared/InputComponent'
import BackButtonComponent from '../../../../components/common/BackBtnComponent'
import Popuptable from '../../../../components/shared/PopuptableComponent'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import getEmployeeService from '../../../../services/common/getDepartmentAndEmployeeDropDownDataService'

// msg file
import currentDateTime from '../../../../currentDateTime'
// eslint-disable-next-line import/no-cycle
import CostAnalysis from '../CostAnalysis'

const ProjectBExcessSheet = () => {
  // const [Overallcolumns]=props;
  let defaultfilterData = {}
  const history = useHistory()
  console.log(history)
  const prevPath = history.location.state?.from
  console.log(prevPath)
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      indentCode: [history?.location?.state?.record?.refCode],
    }
  }
  const { Option } = Select
  const [loading, setLoading] = useState(true)
  const [tableData, setTabledata] = useState([])
  const [filtersInfo, setfilterinfo] = useState(defaultfilterData)
  const [deptEmp, setDeptEmp] = useState([])
  const [isDtlModal, setDtlModal] = useState(false)
  const [hdrId, setHdrId] = useState(null)
  const [linkStatus, setLinkStatus] = useState([])
  const [singledetail, setSingleDetail] = useState(null)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const disable = true
  const [detailCard, setdetailCard] = useState(false)
  const { TextArea } = Input

  const [appr, setApprove] = useState(null)

  const [form] = Form.useForm()
  const [remarkform] = Form.useForm()
  const ProjectID = store.get('ProjectID')
  const tenantid = store.get('tenantId')
  const tenantId = store.get('tenantId')
  const empid = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const enqid = store.get('EnquiryID')
  const Tab = store.get('Tab')
  const pmId = store.get('processDoc')
  const isInternal = store.get('isInternal')
  const [searchText, setSearchText] = useState('')
  const [costFlowType, setCostFlowType] = useState('LEGACY')

  useEffect(() => {
    getRerieveData()
    getDeptAndEmp()
  }, [empid])

  useEffect(() => {
    getLinkStatus()
    getCostFlowType()
  }, [])

  const getCostFlowType = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getCostFlowTypeByPmHdrId',
        requestData: { projectID: ProjectID, tenantID: tenantid },
      })
      if (response && response.responseDataMessage) {
        setCostFlowType(response.responseDataMessage)
      }
    } catch (error) {
      console.error('Error fetching cost flow type:', error)
    }
  }

  const getRerieveData = async () => {
    setLoading(true)
    const keyareaobj = {
      pmHdrId: ProjectID,
      tenantId: tenantid,
      sequenceNo: '1',
      empId: empid,
      processCode: isInternal === 1 ||  isInternal === "1" ? '8' : '3',
    }

    const response = await indentFileUpload({
      requestPath: 'retriveBudgetExcessSheetDtl',
      requestData: keyareaobj,
    })
    let data
    if (response !== null && response !== undefined) {
      if (response.length > 0) {
        setLoading(false)
        data = response
      } else {
        setLoading(false)
        data = ''
      }
    } else {
      setLoading(false)
      data = ''
    }
    let updatedData = []
    if (Array.isArray(data)) {
      updatedData = data.map((item, index) => {
        return {
          ...item,
          statusDesc: item.isCompleted === '1' ? 'Completed' : item.statusDesc,
          nextSeqDesc: item.isCompleted === '1' ? '-' : item.nextSeqDesc,
          serialNumber: index + 1,
          actualExcess: item.actualExcess,
        }
      })
      console.log('Updated Data:', updatedData)
    }

    setTabledata(updatedData)
  }

  const PmHdrIdVal = store.get('ProjectID')

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
      } else {
        setLinkStatus([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }
  const getDeptAndEmp = async () => {
    const response = await getEmployeeService({
      tenantId,
      isActive: '1',
      employeID: '',
    })
    let data = []
    if (response !== null && response !== undefined && response.length > 0) {
      data = response
    } else {
      data = ''
    }
    setDeptEmp(data)
  }

  // methods

  const handleDetails = rec => {
    getLinkStatus()
    console.log(rec, 'rec')
    setSingleDetail(rec)
    const matchedCost = linkStatus?.find(item => item.pkDesc === rec.assemblyValue)
    const allocatedVal = Number(rec.allocatedValue) || 0
    const spentSoFarVal = Number(rec.actualSpentSoFar) || 0
    const balanceAvailableVal = allocatedVal - spentSoFarVal
    form.setFieldsValue({
      action: rec.action !== 'null' && rec.action !== '' ? rec.action : '',
      rca: rec.rootCause !== 'null' && rec.rootCause !== '' ? rec.rootCause : '',
      reason: rec.reason !== 'null' && rec.reason !== '' ? rec.reason : '',
      indentcode: rec.indentCode !== 'null' && rec.indentCode !== '' ? rec.indentCode : '',
      projectcode: rec.projectCode !== 'null' && rec.projectCode !== '' ? rec.projectCode : '',
      vendorname: rec.vendorName !== 'null' && rec.vendorName !== '' ? rec.vendorName : '',
      Dept: rec.responsible !== 'null' && rec.responsible !== '' ? rec.responsible : '',
      indentBudgetCostlat: matchedCost?.budgetCost
        ? formatIndianNumber(matchedCost.budgetCost)
        : '',
      indentBudgetCost: matchedCost?.targetCost ? formatIndianNumber(matchedCost.targetCost) : '',
      indentActualCost: matchedCost?.actualCost ? formatIndianNumber(matchedCost.actualCost) : '',
      IndentOverallExcessCost:
        Number(matchedCost?.budgetCost) - Number(matchedCost?.actualCost)
          ? formatIndianNumber(Number(matchedCost?.budgetCost) - Number(matchedCost?.actualCost))
          : '',
      budgetCostlat:
        rec.budgetCostlat !== 'null' && rec.budgetCostlat !== ''
          ? formatIndianNumber(rec.budgetCostlat)
          : '',
      budgetCost:
        rec.budgetCost !== 'null' && rec.budgetCost !== ''
          ? formatIndianNumber(rec.budgetCost)
          : '',
      excessCost: rec.excess !== 'null' && rec.excess !== '' ? formatIndianNumber(rec.excess) : '',
      actualCost:
        rec.actualCost !== 'null' && rec.actualCost !== ''
          ? formatIndianNumber(rec.actualCost)
          : '',
      station: rec.assemblyValue !== 'null' && rec.assemblyValue !== '' ? rec.assemblyValue : '',
      subAssemblyValue:
        rec.subAssemblyValue !== 'null' && rec.subAssemblyValue !== null && rec.subAssemblyValue !== ''
          ? rec.subAssemblyValue
          : '',
      pjsRefNo: rec.pjsRefNo !== 'null' && rec.pjsRefNo !== null && rec.pjsRefNo !== '' ? rec.pjsRefNo : '',
      allocatedValueDtl: rec.allocatedValue ? formatIndianNumber(rec.allocatedValue) : '',
      actualSpentSoFarDtl: rec.actualSpentSoFar ? formatIndianNumber(rec.actualSpentSoFar) : '',
      balanceAvailableDtl: formatIndianNumber(balanceAvailableVal),
      pjsValueDtl: rec.actualCost ? formatIndianNumber(rec.actualCost) : '',
      actualExcessDtl: rec.actualExcess ? formatIndianNumber(rec.actualExcess) : '',
      overallExcessDtl: rec.overallExcessCost ? formatIndianNumber(rec.overallExcessCost) : '',
    })
    setHdrId(rec.beHdrId)
    console.log('Matched Cost:', matchedCost)

    setDtlModal(true)
  }

  function formatIndianNumber(num) {
    if (num === null || num === '' || Number.isNaN(Number(num))) {
      return ''
    }

    num = Number(num).toFixed(2) // Ensure two decimal points
    const [integerPart, decimalPart] = num.split('.')
    const lastThreeDigits = integerPart.slice(-3)
    const otherDigits = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')

    return `${otherDigits ? `${otherDigits},` : ''}${lastThreeDigits}.${decimalPart}`
  }

  const FilterChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleCloseDtlModal = () => {
    setDtlModal(false)
    form.resetFields()
  }
  const handleSave = async id => {
    let returnVal = false
    const formValues = form.getFieldsValue()
    if (
      formValues.Dept !== '' &&
      formValues.Dept !== null &&
      formValues.action !== '' &&
      formValues.action !== null &&
      formValues.rca !== '' &&
      formValues.rca !== null &&
      formValues.reason !== '' &&
      formValues.reason !== null
    ) {
      const keyareaobj = {
        tenantId,
        beHdrId: hdrId,
        reason: formValues.reason,
        rootCase: formValues.rca,
        action: formValues.action,
        responseDept: formValues.Dept,
        approvingStatus: singledetail.documentStatusMstList[0].docStatus,
        sequenceNo: '',
        empId: empid,
        remarks: '',
      }

      const response = await indentFileUpload({
        requestPath: 'updateBudgetExcessSheetDtl',
        requestData: keyareaobj,
      })
      if (response) {
        if (id === 0) {
          getRerieveData()
          handleCloseDtlModal()
          message.success(response?.responseMessage)
        }
        returnVal = true
      }
    } else {
      messageReturn(405)
    }
    return returnVal
  }
  // handleSaveRemark
  const handleSaveRemark = async () => {
    const savemessage = await handleSave(1)
    if (savemessage) {
      const formValues = remarkform.getFieldsValue()
      if (formValues.remarkfield !== undefined) {
        const keyareaobj = {
          currentseq:
            appr === 1
              ? singledetail.documentStatusMstList[0].cancelSeq
              : singledetail.documentStatusMstList[0].currSequence,
          tenantId,
          hdrId,
          empId: empid,
          remarks: formValues.remarkfield,
          pmId,
          mstId: Tab.mstId,
          docTypeCode: '',
          pmHdrId: singledetail.pmHdrId,
          enquiryId: enqid,
          docGroup: singledetail.documentStatusMstList[0].docGroup,
          processCode: isInternal === 1 ||  isInternal === "1" ? '8' : '3',
        }
        const response = await indentFileUpload({
          requestPath: 'updateBudgetSheetExcessSeqAndStatus',
          requestData: keyareaobj,
        })
        if (response) {
          message.success(response?.responseMessage)
          setRejectRemarksCard(false)
          remarkform.resetFields()
          getRerieveData()
          handleCloseDtlModal()
        }
      } else {
        messageReturn(638)
      }
    }
  }

  const indentcode1 = []
  const assyValue1 = []
  const subAssyValue1 = []
  const projectcode1 = []
  const department1 = []
  const vendor1 = []
  const reason1 = []
  const RCA = []
  const Action1 = []
  const status1 = []
  const actualCost = []
  const excessCost = []
  const actualExcessCost = []
  const assemblyValue = []
  const subAssemblyValue = []
  const nextStatus1 = []

  if (tableData.length > 0) {
    tableData.map(h => {
      return indentcode1.push(h.indentCode)
    })
    tableData.map(h => {
      return assyValue1.push(h.assemblyValue)
    })
    tableData.map(h => {
      return subAssyValue1.push(h.subAssemblyValue)
    })
    tableData.map(h => {
      return projectcode1.push(h.projectCode)
    })
    tableData.map(h => {
      return department1.push(h.responsibleDesc)
    })
    tableData.map(h => {
      return vendor1.push(h.vendorName)
    })
    tableData.map(h => {
      return reason1.push(h.reason)
    })
    tableData.map(h => {
      return RCA.push(h.rootCause)
    })
    tableData.map(h => {
      return Action1.push(h.action)
    })
    tableData.map(h => {
      return status1.push(h.statusDesc)
    })
    tableData.map(h => {
      return actualCost.push(h.actualCost)
    })
    tableData.map(h => {
      return excessCost.push(h.excess)
    })
    tableData.map(h => {
      return actualExcessCost.push(h.actualExcess)
    })
    tableData.map(h => {
      return assemblyValue.push(h.assemblyValue)
    })
    tableData.map(h => {
      return subAssemblyValue.push(h.subAssemblyValue)
    })
    tableData.map(h => {
      return nextStatus1.push(
        h.nextSeqDesc !== 'null' && h.nextSeqDesc !== null ? h.nextSeqDesc : 'NA',
      )
    })
  }

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const indentcode2 = indentcode1.filter(distinct)
  const assyValue2 = assyValue1.filter(distinct)
  const subAssyValue2 = subAssyValue1.filter(distinct)
  const projectcode2 = projectcode1.filter(distinct)
  const department2 = department1.filter(distinct)
  const vendor2 = vendor1.filter(distinct)
  const reason2 = reason1.filter(distinct)
  const RCA2 = RCA.filter(distinct)
  const Action2 = Action1.filter(distinct)
  const status2 = status1.filter(distinct)
  const actualCost2 = actualCost.filter(distinct)
  const excessCost2 = excessCost.filter(distinct)
  const actualExcessCost2 = actualExcessCost.filter(distinct)
  const nextStatus2 = nextStatus1.filter(distinct)

  const indentcode3 = []
  const assyValue3 = []
  const subAssyValue3 = []
  const projectcode3 = []
  const department3 = []
  const vendor3 = []
  const reason3 = []
  const RCA3 = []
  const Action3 = []
  const status3 = []
  const actualCost3 = []
  const excessCost3 = []
  const actualExcessCost3 = []
  const nextStatus3 = []

  indentcode2
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .map(element => {
      return indentcode3.push({
        text: element,
        value: element,
      })
    })

  assyValue2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return assyValue3.push({
        text: element,
        value: element,
      })
    })

  subAssyValue2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach(element => {
      subAssyValue3.push({
        text: element,
        value: element,
      })
    })

  projectcode2.map(element => {
    return projectcode3.push({
      text: element,
      value: element,
    })
  })

  department2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      department3.push({
        text: element,
        value: element,
      }),
    )

  vendor2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      vendor3.push({
        text: element,
        value: element,
      }),
    )

  reason2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      reason3.push({
        text: element,
        value: element,
      }),
    )

  RCA2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      RCA3.push({
        text: element,
        value: element,
      }),
    )

  Action2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      Action3.push({
        text: element,
        value: element,
      }),
    )

  status2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      status3.push({
        text: element,
        value: element,
      }),
    )

  actualCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      actualCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  excessCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      excessCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  actualExcessCost2
    .slice()
    .sort((a, b) => a - b)
    .forEach(element =>
      actualExcessCost3.push({
        text: parseFloat(element).toLocaleString('en-IN'),
        value: element,
      }),
    )

  nextStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      nextStatus3.push({
        text: element,
        value: element,
      }),
    )

  const searchedData = tableData.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })
  const legacyColumns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '10%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: '10%',
      filters: projectcode3,
      filteredValue: filtersInfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      width: '14%',
      filters: indentcode3,
      filteredValue: filtersInfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Station',
      dataIndex: 'assemblyValue',
      key: 'assemblyValue',
      width: '14%',
      filters: assyValue3,
      filteredValue: filtersInfo.assemblyValue,
      onFilter: (value, record) => record?.assemblyValue === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'SubAssembly',
      dataIndex: 'subAssemblyValue',
      key: 'subAssemblyValue',
      width: '19%',
      filters: subAssyValue3,
      filteredValue: filtersInfo.subAssemblyValue,
      onFilter: (value, record) => record?.subAssemblyValue === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '10%',
      filters: vendor3,
      filteredValue: filtersInfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text,
      }),
    },
    {
      title: `Budget Cost ${Menulistdata[0].currency}`,
      dataIndex: 'budgetCostlat',
      key: 'budgetCostlat',
      className: 'right-align-cell',
      width: '14%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: `Target Cost ${Menulistdata[0].currency}`,
      dataIndex: 'budgetCost',
      key: 'budgetCost',
      className: 'right-align-cell',
      width: '12%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: `Actual Cost ${Menulistdata[0].currency}`,
      dataIndex: 'actualCost',
      key: 'actualCost',
      className: 'right-align-cell',
      width: '12%',
      filters: actualCost3,
      filteredValue: filtersInfo.actualCost,
      onFilter: (value, record) => record?.actualCost === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: `Excess Cost ${Menulistdata[0].currency}`,
      dataIndex: 'excess',
      key: 'excess',
      className: 'right-align-cell',
      width: '12%',
      filters: excessCost3,
      filteredValue: filtersInfo.excess,
      onFilter: (value, record) => record?.excess === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: `Actual Excess Cost ${Menulistdata[0].currency}`,
      dataIndex: 'actualExcess',
      key: 'actualExcess',
      className: 'right-align-cell',
      width: '12%',
      filters: actualExcessCost3,
      filteredValue: filtersInfo.actualExcess,
      onFilter: (value, record) => record?.actualExcess === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children: (
          <div>
            {text !== undefined && text !== null && text !== ''
              ? parseFloat(text).toLocaleString('en-IN')
              : ''}
          </div>
        ),
      }),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: '15%',
      filters: reason3,
      filteredValue: filtersInfo.reason,
      onFilter: (value, record) => record?.reason === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null ? text : '-',
      }),
    },
    {
      title: 'RCA',
      dataIndex: 'rootCause',
      key: 'rootCause',
      width: '15%',
      filters: RCA3,
      filteredValue: filtersInfo.rootCause,
      onFilter: (value, record) => record?.rootCause === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null ? text : '-',
      }),
    },
    {
      title: 'Responsible Department',
      dataIndex: 'responsibleDesc',
      key: 'responsibleDesc',
      width: '14%',
      filters: department3,
      filteredValue: filtersInfo.responsibleDesc,
      onFilter: (value, record) => record?.responsibleDesc === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null ? text : '-',
      }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
      filters: Action3,
      filteredValue: filtersInfo.action,
      onFilter: (value, record) => record?.action === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null ? text : '-',
      }),
    },
    {
      title: 'Current Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: '15%',
      filters: status3,
      filteredValue: filtersInfo.statusDesc,
      onFilter: (value, record) => record?.statusDesc === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null || text === 'NA' ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null && text !== 'NA' ? text : '-',
      }),
    },
    {
      title: 'Next Status',
      dataIndex: 'nextSeqDesc',
      key: 'nextSeqDesc',
      width: '15%',
      filters: nextStatus3,
      filteredValue: filtersInfo.nextSeqDesc,
      onFilter: (value, record) => record.nextSeqDesc && record.nextSeqDesc.indexOf(value) === 0,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: text === 'null' || text === null || text === 'NA' ? 'center' : 'left',
          },
        },
        children: text !== 'null' && text !== null && text !== 'NA' ? text : '-',
      }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (text, record, index) => (
        <div>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleDetails(record, index)}
          />
        </div>
      ),
    },
  ]

  // NEW-flow only (see costFlowType gate below): station-level Allocated Value / Actual Spent
  // So Far / PJS Value / Actual Excess Cost (PJS) / Overall Excess Cost (Station), replacing the
  // legacy Budget/Target/Actual/Excess Cost columns above which are always 0/meaningless once
  // TARGET_VALUE stops being written (see project_budget_target_cost_removal memory).
  const rowHighlightStyle = record => ({
    backgroundColor: record.verCheck === '1' ? '#FFFF00' : 'transparent',
  })

  const renderCurrencyCell = (text, record) => ({
    props: {
      style: { ...rowHighlightStyle(record), textAlign: 'right' },
    },
    children: (
      <div>
        {text !== undefined && text !== null && text !== ''
          ? parseFloat(text).toLocaleString('en-IN')
          : ''}
      </div>
    ),
  })

  const renderPlainCell = (text, record) => ({
    props: { style: rowHighlightStyle(record) },
    children: text,
  })

  const renderTextCell = (text, record) => ({
    props: {
      style: {
        ...rowHighlightStyle(record),
        textAlign: text === 'null' || text === null || text === 'NA' ? 'center' : 'left',
      },
    },
    children: text !== 'null' && text !== null && text !== 'NA' ? text : '-',
  })

  const newFlowColumns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '6%',
      render: renderPlainCell,
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: '8%',
      filters: projectcode3,
      filteredValue: filtersInfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      render: renderPlainCell,
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      width: '9%',
      filters: indentcode3,
      filteredValue: filtersInfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
      render: renderPlainCell,
    },
    {
      title: 'Station',
      dataIndex: 'assemblyValue',
      key: 'assemblyValue',
      width: '9%',
      filters: assyValue3,
      filteredValue: filtersInfo.assemblyValue,
      onFilter: (value, record) => record?.assemblyValue === value,
      render: renderPlainCell,
    },
    {
      title: 'SubAssembly',
      dataIndex: 'subAssemblyValue',
      key: 'subAssemblyValue',
      width: '10%',
      filters: subAssyValue3,
      filteredValue: filtersInfo.subAssemblyValue,
      onFilter: (value, record) => record?.subAssemblyValue === value,
      render: renderPlainCell,
    },
    {
      title: 'PJS Ref No.',
      dataIndex: 'pjsRefNo',
      key: 'pjsRefNo',
      width: '9%',
      render: renderPlainCell,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '8%',
      filters: vendor3,
      filteredValue: filtersInfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
      render: renderPlainCell,
    },
    {
      title: `Allocated Value ${Menulistdata[0].currency}`,
      dataIndex: 'allocatedValue',
      key: 'allocatedValue',
      className: 'right-align-cell',
      width: '9%',
      render: renderCurrencyCell,
    },
    {
      title: `Actual Spent So Far ${Menulistdata[0].currency}`,
      dataIndex: 'actualSpentSoFar',
      key: 'actualSpentSoFar',
      className: 'right-align-cell',
      width: '9%',
      render: renderCurrencyCell,
    },
    {
      title: `PJS Value ${Menulistdata[0].currency}`,
      dataIndex: 'actualCost',
      key: 'actualCost',
      className: 'right-align-cell',
      width: '9%',
      render: renderCurrencyCell,
    },
    {
      title: `Actual Excess Cost (PJS) ${Menulistdata[0].currency}`,
      dataIndex: 'actualExcess',
      key: 'actualExcess',
      className: 'right-align-cell',
      width: '9%',
      render: renderCurrencyCell,
    },
    {
      title: `Overall Excess Cost (Station) ${Menulistdata[0].currency}`,
      dataIndex: 'overallExcessCost',
      key: 'overallExcessCost',
      className: 'right-align-cell',
      width: '9%',
      render: renderCurrencyCell,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: '10%',
      filters: reason3,
      filteredValue: filtersInfo.reason,
      onFilter: (value, record) => record?.reason === value,
      render: renderTextCell,
    },
    {
      title: 'RCA',
      dataIndex: 'rootCause',
      key: 'rootCause',
      width: '10%',
      filters: RCA3,
      filteredValue: filtersInfo.rootCause,
      onFilter: (value, record) => record?.rootCause === value,
      render: renderTextCell,
    },
    {
      title: 'Responsible Department',
      dataIndex: 'responsibleDesc',
      key: 'responsibleDesc',
      width: '10%',
      filters: department3,
      filteredValue: filtersInfo.responsibleDesc,
      onFilter: (value, record) => record?.responsibleDesc === value,
      render: renderTextCell,
    },
    {
      title: 'Action Planned',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      filters: Action3,
      filteredValue: filtersInfo.action,
      onFilter: (value, record) => record?.action === value,
      render: renderTextCell,
    },
    {
      title: 'Current Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: '10%',
      filters: status3,
      filteredValue: filtersInfo.statusDesc,
      onFilter: (value, record) => record?.statusDesc === value,
      render: renderTextCell,
    },
    {
      title: 'Next Status',
      dataIndex: 'nextSeqDesc',
      key: 'nextSeqDesc',
      width: '10%',
      filters: nextStatus3,
      filteredValue: filtersInfo.nextSeqDesc,
      onFilter: (value, record) => record.nextSeqDesc && record.nextSeqDesc.indexOf(value) === 0,
      render: renderTextCell,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'actionButton',
      width: 150,
      render: (text, record, index) => (
        <div>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleDetails(record, index)}
          />
        </div>
      ),
    },
  ]

  const columns = costFlowType === 'NEW' ? newFlowColumns : legacyColumns

  const RejectRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div>
            <div>
              <h5>Add Remarks</h5>
              <Form form={remarkform}>
                <div className="row form_datas">
                  <div>
                    <Form.Item name="remarkfield">
                      <TextArea rows={4} />
                    </Form.Item>
                  </div>
                </div>
              </Form>
              <center style={{ marginTop: '10px' }}>
                <ButtonComponent type="primary" text="Save" onClick={handleSaveRemark} />
              </center>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const handleOpen = val => {
    setRejectRemarksCard(true)
    if (val === 0) {
      setApprove(0)
    } else {
      setApprove(1)
    }
  }

  const dateformatter = dateStringval => {
    const dateSp = dateStringval.split('-')
    const finalStr = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
    return finalStr
  }

  const Dtlcolumns = [
    {
      title: 'Status Description',
      dataIndex: 'sequenceStatusDesc',
      key: 'sequenceStatusDesc',
    },
    {
      title: 'Updated by',
      dataIndex: 'empName',
      key: 'empName',
      render: text => {
        let updatedBy = null
        if (text !== null) {
          updatedBy = text
        } else {
          updatedBy = '-'
        }
        return updatedBy
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => {
        let remarks = null
        if (text !== null) {
          remarks = text
        } else {
          remarks = '-'
        }
        return remarks
      },
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: text => {
        let updatedOn = null
        if (text !== null) {
          const spltdval = text.split(' ') || null
          const dateformat = `${dateformatter(spltdval[0])} ${spltdval[1]}`
          updatedOn = dateformat
        } else {
          updatedOn = '-'
        }
        return updatedOn
      },
    },
  ]

  // component
  const DtlComponent = () => {
    return (
      <div>
        <div>
          <Form form={form} layout="vertical" labelAlign="left">
            <div className="row ">
              <div className="col-md-3">
                <Form.Item
                  name="indentcode"
                  label={
                    <span>
                      Indent No.<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent type="text" disabled={disable} />
                </Form.Item>
              </div>

              <div className="col-md-3">
                <Form.Item
                  name="projectcode"
                  label={
                    <span>
                      Project Number<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent type="text" disabled={disable} />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="vendorname"
                  label={
                    <span>
                      Vendor Name<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <InputComponent type="text" disabled={disable} />
                </Form.Item>
              </div>

              <div className="col-md-3">
                <Form.Item
                  name="Dept"
                  label={
                    <span>
                      Responsible Dept<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    placeholder="Select Department"
                    defaultValue="Select Department"
                    style={{ minWidth: '170px' }}
                  >
                    {deptEmp &&
                      deptEmp.map(item => (
                        <Option key={item.departmentCode} value={item.departmentCode}>
                          {item.departmentName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name="station" label={<span>Station </span>}>
                  <InputComponent type="text" disabled={disable} />
                </Form.Item>
              </div>
              {singledetail?.costFlowType === 'NEW' && (
                <>
                  <div className="col-md-3">
                    <Form.Item name="subAssemblyValue" label={<span>Sub Assy. </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item name="pjsRefNo" label={<span>PJS Ref No. </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                </>
              )}
              {singledetail?.costFlowType === 'NEW' ? (
                <>
                  <div className="col-md-3">
                    <Form.Item
                      name="allocatedValueDtl"
                      label={<span>Allocated Value for the Station (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item
                      name="actualSpentSoFarDtl"
                      label={<span>Actual Consumed So Far in the Station (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item
                      name="balanceAvailableDtl"
                      label={<span>Balance Available Cost in the Station (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-3">
                    <Form.Item
                      name="indentBudgetCostlat"
                      label={<span> Station Budget Cost (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item name="indentBudgetCost" label={<span>Station Target Cost (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item name="indentActualCost" label={<span>Station Actual Cost (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                </>
              )}

              {singledetail?.costFlowType === 'NEW' ? (
                <>
                  <div className="col-md-3">
                    <Form.Item name="pjsValueDtl" label={<span>PJS Value (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item
                      name="actualExcessDtl"
                      label={<span>Actual Excess Cost (PJS) (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item
                      name="overallExcessDtl"
                      label={<span>Overall Excess Cost (Station) (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-3">
                    <Form.Item name="budgetCostlat" label={<span>Indent Budget Cost (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item name="budgetCost" label={<span>Indent Target Cost (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item name="actualCost" label={<span>Indent Actual Cost (Rs.) </span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-3">
                    <Form.Item
                      name="IndentOverallExcessCost"
                      label={<span>Indent Overall Excess Cost (Rs.) </span>}
                    >
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                </>
              )}
              <div className="col-md-3">
                <Form.Item
                  name="reason"
                  label={
                    <span>
                      Reason<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <textarea
                    className="form-control"
                    maxLength={256}
                    rows={3}
                    style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="rca"
                  label={
                    <span>
                      RCA<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <textarea
                    className="form-control"
                    maxLength={256}
                    rows={3}
                    style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="action"
                  label={
                    <span>
                      {singledetail?.costFlowType === 'NEW' ? 'Action Planned' : 'Action'}
                      <span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <textarea
                    className="form-control"
                    maxLength={256}
                    rows={3}
                    style={{ width: '100%', resize: 'none' }} // Style to make it responsive
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold' }}> Current Status : </span> {singledetail.statusDesc}
          </h6>
        </div>
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {singledetail &&
          singledetail.documentStatusMstList &&
          singledetail.documentStatusMstList[0] !== null ? (
            <ButtonComponent
              text={singledetail?.documentStatusMstList[0]?.docStatusDesc}
              type="primary"
              marginright="10px"
              onClick={() => handleOpen(0)}
              // onClick={() => handleApprove(1)}
            />
          ) : null}
          <ButtonComponent
            marginright="10px"
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => {
              setdetailCard(true)
            }}
          />

          {singledetail &&
          singledetail.documentStatusMstList &&
          singledetail.documentStatusMstList[0] !== null ? (
            <ButtonComponent
              text="Save"
              type="primary"
              marginright="10px"
              onClick={() => handleSave(0)}
            />
          ) : null}
          <ButtonComponent
            text="Cancel"
            type="primary"
            marginright="10px"
            onClick={handleCloseDtlModal}
          />
          {singledetail &&
          singledetail.documentStatusMstList &&
          singledetail.documentStatusMstList[0] !== null &&
          singledetail.documentStatusMstList[0].cancelSeq !== null ? (
            <ButtonComponent
              text="Previous Stage"
              type="danger"
              marginright="10px"
              // onClick={() => setRejectRemarksCard(true)}
              onClick={() => handleOpen(1)}
            />
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Popuptable
            onClose={() => setRejectRemarksCard(false)}
            cardLabel=""
            component={() => RejectRemarksComponent(1)}
            visible={rejectRemarksCard}
            placement="top"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Popuptable
            onClose={() => setdetailCard(false)}
            cardLabel=""
            component={
              <Table
                dataSource={singledetail && singledetail.budgetExcessStatusDtlList}
                columns={Dtlcolumns}
              />
            }
            visible={detailCard}
          />
        </div>
      </div>
    )
  }
  return (
    <div>
      <Skeleton loading={loading} active>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input.Search
            placeholder="Search..."
            allowClear
            enterButton
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 450 }}
          />
        </div>
        <Table
          dataSource={searchedData}
          columns={columns}
          exportableProps={{
            fileName: `Budget_Excess_Sheet${currentDateTime}`,
            btnProps: {
              type: 'primary',
              icon: <FileExcelOutlined />,
              children: <span>Export to CSV</span>,
            },
          }}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [tableData.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          onChange={FilterChange}
          bordered
        />
      </Skeleton>
      <ModalPopup
        text="Budget Excess RCA"
        isModalVisible={isDtlModal}
        onCancel={handleCloseDtlModal}
        FieldsComponent={DtlComponent}
        width={1400}
      />
      <CostAnalysis cumulative={1} />
      <BackButtonComponent componentToRender="project" />
    </div>
  )
}

export default ProjectBExcessSheet
