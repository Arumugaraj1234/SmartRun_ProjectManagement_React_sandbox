import React, { useState, useEffect } from 'react'
import store from 'store'
import { FileTwoTone, MessageOutlined } from '@ant-design/icons'
import { Space, Table, Divider, Form, DatePicker, Popover, Input, message } from 'antd'
import moment from 'moment'
import Button from 'components/shared/ButtonComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import BackButtonComponent from 'components/common/BackBtnComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
// import ExportPDF from 'components/common/ExportPdfComponent'
// import {indentFileUpload} from '../../../services/common/AppeovedDocumentService/adddocumentservice'

const ProjectCostAnalysis = ({ cumulative }) => {
  console.log('cumulative', cumulative)
  const [retrivaldata, setRetrivaldata] = useState([])
  const [retrivaldata2, setRetrivaldata2] = useState([])
  const tenantId = store.get('tenantId')
  const PmHdrIdVal = store.get('ProjectID')
  const [materialTable, setmaterialTable] = useState([])
  // const [material, setmaterial] = useState(null)
  const [budgetCost, setBudgetCost] = useState('')
  const [matCost, setMatCost] = useState('')
  const [debitCost, setDebitCost] = useState(0)
  const [actualCost, setActualCost] = useState('')
  const [availCost, setAvailCost] = useState('')
  const [budgetIndent, setBudgetIndent] = useState('')
  const [budgetstatus, setBudgetstatus] = useState('')
  const [detailModalVisible, setDetailmodalVisible] = useState(false)
  // const [showMaterialDtl, setshowMaterialDtl] = useState(false)
  const [singleIndent, setSingleIndent] = useState(null)
  const [detailTable, setDetailTable] = useState([])
  const [dueDateForm] = Form.useForm()
  const [filtersinfo, setfilterinfo] = useState([])
  const [filtersinfo2, setfiltersinfo2] = useState([])
  const [timeSheetDetails, setTimeSheetDetails] = useState([])
  const [employeeCost, setEmployeeCost] = useState(0)
  const [Searchindex, setSearchindex] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const Menulistdata = store.get('MenuListData')
  const Tab = store.get('Tab')
  const employeeId = store.get('employeeId')
  useEffect(() => {
    getprojectDtldata()
    getMaterialdtl()
    getTimesheetDetail()
  }, [])

  // useEffect(() => {
  // }, [availCost])

  const Opendetailview = (record, index) => {
    setSingleIndent(index)
    getDetails(index.indentId)
    setDetailmodalVisible(true)
    // dueDateForm.setFieldsValue({
    //   dueDate: moment('YYYY-MM-DD') || '',
    //   // availableValue: index?.avilablevalue,
    // })
    // setRetrivaldata([])
  }
  const handleDetailCancel = () => {
    setDetailmodalVisible(false)
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleChange2 = (pagination, filters) => {
    setfiltersinfo2(filters)
  }

  const getMaterialdtl = async () => {
    const response = await indentFileUpload({
      requestPath: 'getMaterialTransferDtls',
      requestData: {
        tenantId,
        pmHdrId: PmHdrIdVal,
      },
    })
    if (response?.responseCode === '200') {
      setmaterialTable(response?.responseData)
    } else {
      setmaterialTable([])
    }
  }

  const getTimesheetDetail = async () => {
    const response = await indentFileUpload({
      requestPath: 'timeSheetReportCategory',
      requestData: {
        pmHdrId: PmHdrIdVal,
        fromDate: moment('1900-01-01').format('YYYY-MM-DD'),
        toDate: moment('2200-01-01').format('YYYY-MM-DD'),
        tenantId,
      },
    })
    if (response?.responseCode === '200') {
      setTimeSheetDetails(response?.responseData)
      const totalCost = response?.responseData?.reduce(
        (sum, data) => sum + (parseFloat(data?.rupees) || 0),
        0,
      )
      setEmployeeCost(totalCost)
    } else {
      message.error(response?.responseMessage)
      setTimeSheetDetails([])
    }
  }

  // useEffect(() => {
  //   setActualCost(Number(availCost || 0) + Number(employeeCost|| 0))
  //   setAvailCost(Number(actualCost || 0) - Number(employeeCost || 0))
  // }, [employeeCost,availCost,actualCost])

  const getprojectDtldata = async () => {
    const props = {
      hdrId: PmHdrIdVal,
      tenantId,
    }

    const httpgethdrdetails = await IndentGroupgetDetails({
      requestPath: 'getCostAnlysDtls',
      requestData: props,
    })
    if (httpgethdrdetails.responseCode === '200') {
      setRetrivaldata(httpgethdrdetails.responseData)
      setRetrivaldata2(httpgethdrdetails.responseData)
      setBudgetCost(httpgethdrdetails.responseData?.[0].salesTotalBudget)
      setMatCost(httpgethdrdetails.responseData?.[0].materialTransfeCost)
      setDebitCost(httpgethdrdetails.responseData?.[0].debitNoteValue)
      setAvailCost(httpgethdrdetails.responseData?.[0].availablebudgetOnDate)
      setActualCost(httpgethdrdetails.responseData?.[0].poReleased)
      setBudgetIndent(httpgethdrdetails.responseData?.[0].indentedMaterial)
      setBudgetstatus(httpgethdrdetails.responseData?.[0].rmcBudgetStatus)
    } else {
      setRetrivaldata([])
      setRetrivaldata2([])
      messageReturn(619)
    }
  }

  const DownloadPDF = async () => {
    const reqdata = {
      projectId: PmHdrIdVal,
      tenantId: Tab.tenantId,
      key: 'projectTrackerReport',
    }
    const response = await indentFileUpload({
      requestPath: 'getProjectTrackerReportPDF',
      requestData: reqdata,
    })

    if (response.responseCode === '200') {
      if (response?.responseData[0]?.fileContent !== null) {
        const link = document.createElement('a')
        link.href = `data:application/octet-stream;base64,${response?.responseData[0]?.fileContent}`
        link.download = response?.fileName
        link.click()
        messageReturn(210)
      } else {
        messageReturn(606)
      }
    }
  }

  // const handleExportToCSV = async () => {
  //   const reqdata = {
  //     projectId: PmHdrIdVal,
  //     tenantId: Tab.tenantId,
  //     key: 'projectTrackerReport',
  //   }
  //   const response = await indentFileUpload({
  //     requestPath: 'getProjectTrackerReportExcel',
  //     requestData: reqdata,
  //   })

  //   if (response.responseCode === '200') {
  //     const link = document.createElement('a')
  //     link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.responseData[0].fileContent}`
  //     link.download = response.fileName
  //     link.click()
  //   }
  // }
  const handleExportToCSV = () => {
    const currentDateTime = moment().format('YYYY-MM-DD_HH-mm-ss')

    const escapeValue = value => {
      if (value === null || value === undefined) return ''
      const str = value.toString()
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""').replace(/\n/g, ' ')}"` : str
    }

    // Main Cost Analysis Table
    const cleanedData = retrivaldata?.flatMap(data =>
      data?.catbaseIndentCostDtl?.flatMap(catbaseData =>
        catbaseData?.indentCostDtl?.map((item, index) => ({
          'S.No.': index + 1,
          'Indent No.': escapeValue(item.indentTypeCode),
          Station: escapeValue(item.pkDesc),
          'Sub Assy.': escapeValue(item.pskDesc),
          'Indent Date': moment(item.createdDate).format('DD-MMM-YYYY'),
          'Indent Closed Date': item.closeDate ? moment(item.closeDate).format('DD-MMM-YYYY') : '-',
          'Budget Cost (Rs.)': parseFloat(item.budgetValue || 0).toFixed(2),
          'Target Cost (Rs.)': parseFloat(item.targetValue || 0).toFixed(2),
          'Final Cost (Rs.)': parseFloat(item.scmBudgetAllocated || 0).toFixed(2),
          'Budget Status (Rs.)': parseFloat(item.budgetStatus || 0).toFixed(2),
        })),
      ),
    )

    // Material Transfer Table
    const cleanedMaterial = materialTable?.map((item, index) => ({
      'S.No.': index + 1,
      'Reference ID': escapeValue(item.referenceId),
      'Part Number': escapeValue(item.productCode),
      Description: escapeValue(item.productDesc),
      UOM: escapeValue(item.uom),
      'From Project': `${escapeValue(item.frmprojectCode)} - ${escapeValue(item.frmprojectName)}`,
      'To Project': `${escapeValue(item.toprojectCode)} - ${escapeValue(item.toprojectName)}`,
      'From Location': escapeValue(item.fromLocationDesc),
      'To Location': escapeValue(item.toLocationDesc),
      'Transferred Qty': item.transferQuantity,
      'Transferred Cost (Rs.)': parseFloat(item.overAllCost || 0).toFixed(2),
      'Transferred On': item.createdOn ? moment(item.createdOn).format('DD-MMM-YYYY') : '',
      'Transferred By': escapeValue(item.createdBy),
    }))

    // Timesheet Table
    const cleanedTimesheet = timeSheetDetails?.map((item, index) => ({
      'S.No.': index + 1,
      'Project Code': escapeValue(item.projectCode),
      'Project Name': escapeValue(item.projectName),
      Date: moment(item.recordDate).format('DD-MMM-YYYY'),
      Activity: escapeValue(item.activity),
      'Employee Code': escapeValue(item.employeeCode),
      'Employee Name': escapeValue(item.employeeName),
      Summary: escapeValue(item.summary),
      Hours: Number(item.hrs || 0).toFixed(1),
      'Cost (Rs.)': Number(item.rupees || 0).toFixed(2),
    }))

    const summaryBudgetTable = [
      { 'Budget for Indented Material (Rs.)': parseFloat(budgetIndent || 0).toFixed(2) },
      { 'Final Cost (Rs.)': parseFloat(actualCost - matCost || 0).toFixed(2) },
      { 'RMC Budget Status (Rs.)': parseFloat(budgetstatus || 0).toFixed(2) },
      { 'Material Transfer Cost (Rs.)': parseFloat(matCost || 0).toFixed(2) },
      { 'Debit Note Raised Cost (Rs.)': parseFloat(debitCost || 0).toFixed(2) },
      { 'Employee Cost (Rs.)': parseFloat(employeeCost || 0).toFixed(2) },
      { 'Actual Spent (Rs.)': parseFloat(actualCost +employeeCost - debitCost || 0).toFixed(2) },

    ]

    const summaryOverallTable = [
      {
        Description: 'Overall RMC Mechanical & Electrical',
        'Overall Sales Budget Cost (Rs.)': parseFloat(budgetCost || 0).toFixed(2),
        'Actual Spent (Rs.)': parseFloat(actualcostvalue).toFixed(2),
        'Available budget as on date (Rs.)': parseFloat( budgetCost - actualcostvalue).toFixed(2),
      },
    ]

    const convertToCSV = data => {
      const header = Object.keys(data[0]).join(',')
      const rows = data.map(row => Object.values(row).join(','))
      return [header, ...rows].join('\n')
    }

    const downloadCSV = (csvData, fileName) => {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    if (!cleanedData.length && !cleanedMaterial.length && !cleanedTimesheet.length) {
      message.warning('No data to export')
      return
    }

    let csvContent = ''

    if (cleanedData.length) {
      csvContent += `Cost Analysis Details\n${convertToCSV(cleanedData)}\n\n`
    }

    if (cleanedMaterial.length) {
      csvContent += `Material Transfer Details\n${convertToCSV(cleanedMaterial)}\n\n`
    }

    if (cleanedTimesheet.length) {
      csvContent += `Timesheet Report Details\n${convertToCSV(cleanedTimesheet)}\n\n\n`
    }

    if (summaryBudgetTable.length) {
      csvContent += `Budget for Indented Material (Rs.),${parseFloat(budgetIndent || 0).toFixed(
        2,
      )}\n`
      csvContent += `Final Cost (Rs.),${parseFloat(actualCost - matCost || 0).toFixed(2)}\n`
      csvContent += `RMC Budget Status (Rs.),${parseFloat(budgetstatus || 0).toFixed(2)}\n`
      csvContent += `Material Transfer Cost (Rs.),${parseFloat(matCost || 0).toFixed(2)}\n`
      csvContent += `Debit Note Raised Cost (Rs.),${parseFloat(debitCost || 0).toFixed(2)}\n`
      csvContent += `Employee Cost (Rs.),${parseFloat(employeeCost || 0).toFixed(2)}\n`
      csvContent += `Actual Spent (Rs.),${parseFloat(actualCost + employeeCost - debitCost || 0).toFixed(2)}\n`
    }

    if (summaryOverallTable.length) {
      csvContent += `\n${convertToCSV(summaryOverallTable)}\n\n`
    }

    downloadCSV(csvContent, `Cost_Analysis_${currentDateTime}.csv`)
  }

  const getDetails = async indentId => {
    const reqdata = {
      tenantId: Tab.tenantId,
      empId: employeeId,
      indentId,
      docType: 'DC018',
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlsByIndentId',
      requestData: reqdata,
    })
    if (response) {
      if (response?.responseData) {
        dueDateForm.setFieldsValue({
          availableValue:
            parseFloat(response?.responseData[0]?.avilablevalue).toLocaleString('en-IN') || '0',
          allocatedValue:
            parseFloat(response?.responseData[0]?.allocatedValue).toLocaleString('en-IN') || '0',
          targetValue:
            parseFloat(response?.responseData[0]?.targetValue).toLocaleString('en-IN') || '0',
          budgetvalue:
            parseFloat(response?.responseData[0]?.allocatedValue).toLocaleString('en-IN') || '0',
        })
        setDetailTable(response?.responseData[0]?.dtlList)
      } else {
        setDetailTable([])
      }
    }
  }

  const columns = [
    {
      title: 'Indent No.',
      dataIndex: 'indentTypeCode',
      key: 'indentTypeCode',
    },

    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
    },
    {
      title: 'Indent Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Indent Closed Date',
      dataIndex: 'closeDate',
      key: 'closeDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Budget Cost (Rs.)',
      dataIndex: 'budgetValue',
      key: 'budgetValue',
      className: 'right-align-cell',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Target Cost (Rs.)',
      dataIndex: 'targetValue',
      key: 'targetValue',
      className: 'right-align-cell',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Final Cost (Rs.)',
      key: 'scmBudgetAllocated',
      dataIndex: 'scmBudgetAllocated',
      className: 'right-align-cell',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Budget Status (Rs.)',
      key: 'budgetStatus',
      dataIndex: 'budgetStatus',
      className: 'right-align-cell',
      render: text => (
        <div style={{ textAlign: 'right', color: text >= 0 ? 'green' : 'red' }}>
          {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    // {
    //   title: 'Remarks',
    //   key: 'reason',
    //   dataIndex: 'reason',
    // },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (record, index) => (
        <Button
          type="primary"
          onClick={() => {
            Opendetailview(record, index)
          }}
          icon={<FileTwoTone />}
        />
      ),
    },
  ]
  const columns2 = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 50,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
    },
    {
      title: 'Mass(kgs)',
      key: 'weight',
      dataIndex: 'weight',
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
    },
    {
      title: 'Quantity',
      key: 'qty',
      dataIndex: 'qty',
    },
    {
      title: 'Unit',
      key: 'uomDesc',
      dataIndex: 'uomDesc',
    },
    // {
    //   title: `Allocated Budget ${Menulistdata[0].currency}`,
    //   key: 'totalVal',
    //   dataIndex: 'totalVal',
    //   className: 'hide-column',
    //   render: (text, record) => (
    //     <Link
    //       onClick={() => {
    //         TotalValueModal(record)
    //       }}
    //       onKeyDown={e => {
    //         if (e.key === 'Enter') {
    //           TotalValueModal(record)
    //         }
    //       }}
    //       style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
    //     >
    //       <span>{parseFloat(record.totalVal).toLocaleString('en-IN')}</span>
    //     </Link>
    //   ),
    // },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      align: 'center',
      render: record => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Popover
              title="Remarks"
              content={
                <Input.TextArea disabled defaultValue={record?.remarks} value={record?.remarks} />
              }
              trigger="click"
            >
              <Button type="primary" icon={<MessageOutlined />} />
            </Popover>
            {record && record.dmId !== 0 ? (
              <DownloadDocuments
                isPdf={record.isPdf}
                tenantId
                refid={record.dmId}
                fileDocode=""
                docTypeCode=""
              />
            ) : null}
          </div>
        )
      },
    },
  ]
  const FieldsComponent = () => {
    return (
      <div>
        <Form form={dueDateForm}>
          <div>
            <div className="mt-1 custom_antd_Table">
              <div className="row">
                <div className="col-3 tob_details">
                  <p className="tob_label">Station :</p>
                  <p>{singleIndent?.pkDesc}</p>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">Sub Assy. :</p>
                  <p>{singleIndent?.pskDesc}</p>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">Created On :</p>
                  <p>
                    {singleIndent.createdDate
                      ? moment(singleIndent.createdDate).format('DD-MMM-YYYY')
                      : ''}
                  </p>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">
                    Due Date<span style={{ color: 'red' }}>*</span> :
                  </p>
                  <Form.Item name="dueDate" style={{ color: 'black' }}>
                    <DatePicker defaultValue={moment()} disabled />
                  </Form.Item>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">Available Budget {Menulistdata[0].currency} :</p>
                  <Form.Item name="availableValue" style={{ color: 'black' }}>
                    <Input type="text" disabled />
                  </Form.Item>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">
                    Allocated Budget {Menulistdata[0].currency}
                    <span style={{ color: 'red' }}>*</span> :
                  </p>
                  <Form.Item name="allocatedValue" style={{ color: 'black' }}>
                    <Input type="text" disabled />
                  </Form.Item>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">
                    Budget Cost {Menulistdata[0].currency}
                    <span style={{ color: 'red' }}>*</span> :
                  </p>
                  <Form.Item name="budgetvalue" style={{ color: 'black' }}>
                    <Input type="text" disabled />
                  </Form.Item>
                </div>
                <div className="col-3 tob_details">
                  <p className="tob_label">
                    Target Cost {Menulistdata[0].currency}
                    <span style={{ color: 'red' }}>*</span> :
                  </p>
                  <Form.Item name="targetValue" style={{ color: 'black' }}>
                    <Input type="text" disabled />
                  </Form.Item>
                </div>
              </div>
              <Table columns={columns2} dataSource={detailTable} scroll={{ y: 300 }} bordered />
            </div>
          </div>
        </Form>
      </div>
    )
  }

  const FilterProductcode = []
  const FilterProject = []
  const FilterToproject = []
  const FilterFromLocation = []
  const FIlterTolocation = []
  const Filterransferdby = []
  const FilterDesc = []
  const Filterransferdon = []

  if (materialTable) {
    materialTable.map(h => {
      return FilterProductcode.push(h.productCode)
    })
    materialTable.map(h => {
      return FilterProject.push(h.frmprojectName)
    })
    materialTable.map(h => {
      return FilterToproject.push(h.toprojectName)
    })
    materialTable.map(h => {
      return FilterFromLocation.push(h.fromLocationDesc)
    })
    materialTable.map(h => {
      return FIlterTolocation.push(h.toLocationDesc)
    })
    materialTable.map(h => {
      return Filterransferdby.push(h.createdBy)
    })
    materialTable.map(h => {
      return FilterDesc.push(h.productDesc)
    })
    materialTable.map(h => {
      return Filterransferdon.push(h.createdOn)
    })
  }
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const filterprocode = FilterProductcode.filter(distinct)
  const filterproject = FilterProject.filter(distinct)
  const filtertoproject = FilterToproject.filter(distinct)
  const filteredfromlocation = FilterFromLocation.filter(distinct)
  const filtertolocation = FIlterTolocation.filter(distinct)
  const filtertransferdby = Filterransferdby.filter(distinct)
  const filterDescription = FilterDesc.filter(distinct)
  const filtertransferdon = Filterransferdon.filter(distinct)

  const FilteredPRoductCOde = []
  const FilteredProject = []
  const FIlteredTOProject = []
  const FilteredFromLocation = []
  const FilteredToLocation = []
  const FilteredTransferedBY = []
  const FilteredDesc = []
  const FilteredTransferedOn = []

  filterprocode.map(element => {
    return FilteredPRoductCOde.push({
      text: element,
      value: element,
    })
  })
  filterproject.map(element => {
    return FilteredProject.push({
      text: element,
      value: element,
    })
  })
  filtertoproject.map(element => {
    return FIlteredTOProject.push({
      text: element,
      value: element,
    })
  })
  filteredfromlocation.map(element => {
    return FilteredFromLocation.push({
      text: element,
      value: element,
    })
  })
  filtertolocation.map(element => {
    return FilteredToLocation.push({
      text: element,
      value: element,
    })
  })
  filtertransferdby.map(element => {
    return FilteredTransferedBY.push({
      text: element,
      value: element,
    })
  })

  filterDescription.map(element => {
    return FilteredDesc.push({
      text: element,
      value: element,
    })
  })

  filtertransferdon.map(element => {
    return FilteredTransferedOn.push({
      text: moment(element).format('DD-MMM-YYYY'),
      value: element,
    })
  })

  // const handleDetailCardCancel = () => {
  //   setshowMaterialDtl(false)
  // }
  // const showModal = record => {
  //   setshowMaterialDtl(true)
  //   setmaterial(record)
  // }

  // Material Transfer Details
  const columnmat = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Reference ID',
      dataIndex: 'referenceId',
      key: 'referenceId',
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: FilteredPRoductCOde,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: FilteredDesc,
      filteredValue: filtersinfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      align: 'center',
    },
    {
      title: 'From Project',
      dataIndex: 'frmprojectName',
      key: 'frmprojectName',
      filters: FilteredProject,
      filteredValue: filtersinfo.frmprojectName,
      onFilter: (value, record) => record?.frmprojectName === value,
      render: (text, record) => `${record.frmprojectCode} - ${record.frmprojectName}`,
    },
    {
      title: 'To Project',
      dataIndex: 'toprojectName',
      key: 'toprojectName',
      filters: FIlteredTOProject,
      filteredValue: filtersinfo.toprojectName,
      onFilter: (value, record) => record?.toprojectName === value,
      render: (text, record) => `${record.toprojectCode} - ${record.toprojectName}`,
    },
    {
      title: 'From Location',
      dataIndex: 'fromLocationDesc',
      key: 'fromLocationDesc',
      filters: FilteredFromLocation,
      filteredValue: filtersinfo.fromLocationDesc,
      onFilter: (value, record) => record?.fromLocationDesc === value,
    },
    {
      title: 'To Location',
      dataIndex: 'toLocationDesc',
      key: 'toLocationDesc',
      filters: FilteredToLocation,
      filteredValue: filtersinfo.toLocationDesc,
      onFilter: (value, record) => record?.toLocationDesc === value,
    },
    {
      title: 'Transferred Qty',
      dataIndex: 'transferQuantity',
      key: 'transferQuantity',
      align: 'right',
    },
    {
      title: 'Transferred Cost (Rs.)',
      dataIndex: 'overAllCost',
      key: 'overAllCost',
      align: 'right',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : ''}
        </div>
      ),
    },
    {
      title: 'Transferred On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      filters: FilteredTransferedOn,
      filteredValue: filtersinfo.createdOn,
      onFilter: (value, record) => record?.createdOn === value,
      render: (text, record) =>
        record.createdOn ? moment(record.createdOn).format('DD-MMM-YYYY') : '',
    },
    {
      title: 'Transferred By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      filters: FilteredTransferedBY,
      filteredValue: filtersinfo.createdBy,
      onFilter: (value, record) => record?.createdBy === value,
    },
    // {
    //   title: 'Action',
    //   dataIndex: '',
    //   key: '',
    //   align: 'center',
    //   // render: (record, index) => (
    //   //   <div style={{ display: 'none' }}>
    //   //     <div style={{ display: 'flex', gap: '5px' }}>
    //   //       <Button
    //   //         type="primary"
    //   //         onClick={() => {
    //   //           showModal(record, index)
    //   //         }}
    //   //         text="Details"
    //   //       />
    //   //     </div>
    //   //   </div>
    //   // ),
    //   onHeaderCell: () => {
    //     return {
    //       style: { display: 'none' },
    //     }
    //   },
    //   onCell: () => {
    //     return {
    //       style: { display: 'none' },
    //     }
    //   },
    // },
  ]
  const projectCode1 = []
  const projectName1 = []
  const employeeCode1 = []
  const employeeName1 = []
  const date1 = []
  const activity1 = []

  if (timeSheetDetails.length > 0) {
    timeSheetDetails.map(h => {
      return projectCode1.push(h.projectCode)
    })
    timeSheetDetails.map(h => {
      return projectName1.push(h.projectName)
    })
    timeSheetDetails.map(h => {
      return employeeCode1.push(h.employeeCode)
    })
    timeSheetDetails.map(h => {
      return employeeName1.push(h.employeeName)
    })
    timeSheetDetails.map(h => {
      return date1.push(h.recordDate)
    })
    timeSheetDetails.map(h => {
      return activity1.push(h.activity)
    })
  }

  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const employeeCode2 = employeeCode1.filter(distinct)
  const employeeName2 = employeeName1.filter(distinct)
  const date2 = date1.filter(distinct)
  const activity2 = activity1.filter(distinct)

  const projectCode3 = []
  const projectName3 = []
  const employeeCode3 = []
  const employeeName3 = []
  const date3 = []
  const activity3 = []

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
  employeeCode2.map(element => {
    return employeeCode3.push({
      text: element,
      value: element,
    })
  })
  employeeName2.map(element => {
    return employeeName3.push({
      text: element,
      value: element,
    })
  })

  date2.map(element => {
    return date3.push({
      text: moment(element).format('DD-MMM-YYYY'),
      value: element,
    })
  })

  activity2.map(element => {
    return activity3.push({
      text: element,
      value: element,
    })
  })

  const TimeSheetColumns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      render: text => (text !== null ? text : ''),
      filters: projectCode3,
      filteredValue: filtersinfo2.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      render: text => (text !== null ? text : ''),
      filters: projectName3,
      filteredValue: filtersinfo2.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },
    {
      title: 'Date',
      dataIndex: 'recordDate',
      key: 'recordDate',
      filters: date3,
      filteredValue: filtersinfo2.recordDate,
      onFilter: (value, record) => record?.recordDate === value,
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      filters: activity3,
      filteredValue: filtersinfo2.activity,
      onFilter: (value, record) => record?.activity === value,
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      filters: employeeCode3,
      filteredValue: filtersinfo2.employeeCode,
      onFilter: (value, record) => record?.employeeCode === value,
      // className: 'right-align-cell',
    },
    {
      title: 'Employee Name',
      key: 'employeeName',
      dataIndex: 'employeeName',
      filters: employeeName3,
      filteredValue: filtersinfo2.employeeName,
      onFilter: (value, record) => record?.employeeName === value,
      render: (text, record) => record.employeeName,
    },
    {
      title: 'Summary',
      key: 'summary',
      dataIndex: 'summary',
    },
    {
      title: 'Hours',
      key: 'hrs',
      align: 'right',
      dataIndex: 'hrs',
      render: text => <div style={{ textAlign: 'right' }}>{Number(text).toFixed(1)}</div>,
    },
    {
      title: `Cost ${Menulistdata[0]?.currency}`,
      key: 'rupees',
      align: 'right',
      dataIndex: 'rupees',
      render: text => <div style={{ textAlign: 'right' }}>{Number(text || 0).toFixed(2)}</div>,
    },
  ]
  // const avalilablecost = Number(availCost) - Number(employeeCost)
  const actualcostvalue = Number(actualCost) + Number(employeeCost) -Number(debitCost)

  const handleSearch = (index, value) => {
    setSearchindex(index)
    setSearchValue(value)
    try {
      const updatedRetrivaldata2 = retrivaldata2?.map((dataItem, i) => {
        if (i === 0) {
          const updatedCatbaseIndentCostDtl = dataItem?.catbaseIndentCostDtl?.map(
            (catItem, catIndex) => {
              if (catIndex === index) {
                const filtered = catItem?.indentCostDtl?.filter(item =>
                  Object.keys(item || {}).some(key =>
                    item?.[key]
                      ?.toString()
                      .toLowerCase()
                      .includes(value?.toLowerCase()),
                  ),
                )

                return {
                  ...catItem,
                  indentCostDtl: filtered, // Update the filtered indentCostDtl
                }
              }
              return { ...catItem }
            },
          )

          // Return the updated dataItem with the filtered catbaseIndentCostDtl
          return {
            ...dataItem,
            catbaseIndentCostDtl: updatedCatbaseIndentCostDtl,
          }
        }
        return { ...dataItem }
      })

      // Update retrivaldata with the filtered data
      setRetrivaldata(updatedRetrivaldata2)
    } catch (error) {
      console.error('Error in handleSearch: ', error)
    }
  }

  return cumulative === 1 ? (
    <div>
      {retrivaldata.length > 0 && (
        <>
          <table
            style={{
              width: '25%',
              margin: 'auto',
              marginBottom: '10px',
              border: '1px solid black',
              borderCollapse: 'collapse',
            }}
          >
            <tbody>
              {/* <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Final Cost (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {actualCost !== undefined &&
                  matCost !== undefined &&
                  actualCost !== null &&
                  matCost !== null
                    ? (parseFloat(actualCost) - parseFloat(matCost)).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr> */}
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Budget for Indented Material (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {budgetIndent !== undefined && budgetIndent !== null
                    ? parseFloat(budgetIndent).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Final Cost (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {actualCost !== undefined && actualCost !== null
                    ? (parseFloat(actualCost) - parseFloat(matCost)).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  RMC Budget Status (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {budgetstatus !== undefined && budgetstatus !== null
                    ? parseFloat(budgetstatus).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Material Transfer Cost (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {matCost !== undefined && matCost !== null
                    ? parseFloat(matCost).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Debit Note Raised Cost (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {debitCost !== undefined && debitCost !== null
                    ? parseFloat(debitCost).toLocaleString('en-IN')
                    : 0}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Employee Cost (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {employeeCost !== undefined && employeeCost !== null
                    ? parseFloat(employeeCost).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '50%', margin: 'auto', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    Description
                  </th>
                  <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    Overall Sales Budget Cost (Rs.)
                  </th>
                  <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    Final Cost (Rs.)
                  </th>
                  <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    Available budget as on date (Rs.)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    Overall RMC Mechanical & Electrical
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    {budgetCost !== undefined && budgetCost !== null
                      ? parseFloat(budgetCost).toLocaleString('en-IN')
                      : ''}
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    {actualCost !== undefined && actualCost !== null
                      ? parseFloat(actualcostvalue).toLocaleString('en-IN')
                      : ''}
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                    {availCost !== undefined && availCost !== null
                      ? parseFloat(budgetCost -actualcostvalue).toLocaleString('en-IN')
                      : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  ) : (
    <div>
      <Space>
        <Button type="primary" text="Export to PDF" onClick={DownloadPDF} />
        <Button type="primary" text="Export to CSV" onClick={handleExportToCSV} />
      </Space>
      {retrivaldata?.map(data => (
        <div>
          {data?.catbaseIndentCostDtl?.map((catbaseData, index) => (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h6>Category: {catbaseData?.indentCostDtl?.[0]?.sbcDesc}</h6>
                <Input.Search
                  placeholder="Search here..."
                  style={{ width: '300px', marginBottom: '10px' }}
                  value={Searchindex === index ? searchValue : ''}
                  onChange={e => handleSearch(index, e.target.value)}
                  allowClear
                />
              </div>
              {/* <Button type="primary" text="Export to CSV" onClick={DownloadPDF} /> */}

              <Table
                columns={columns}
                dataSource={catbaseData?.indentCostDtl}
                bordered
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [catbaseData?.indentCostDtl?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
              />
              <div
                className="row"
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
              >
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  style={{ display: 'flex' }}
                >
                  <p style={{ marginRight: '10px', fontWeight: 'bold' }}>Total Budget Cost (Rs.)</p>
                  <p>
                    {catbaseData?.totalBudgetCost !== undefined &&
                    catbaseData?.totalBudgetCost !== null
                      ? parseFloat(catbaseData?.totalBudgetCost).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  style={{ display: 'flex' }}
                >
                  <p style={{ marginLeft: '20px', marginRight: '10px', fontWeight: 'bold' }}>
                    Total Target Cost (Rs.)
                  </p>
                  <p>
                    {catbaseData?.totalTargetCost !== undefined &&
                    catbaseData?.totalTargetCost !== null
                      ? parseFloat(catbaseData?.totalTargetCost).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  style={{ display: 'flex' }}
                >
                  <p style={{ marginLeft: '20px', marginRight: '10px', fontWeight: 'bold' }}>
                    Total Actual Cost (Rs.)
                  </p>
                  <p>
                    {catbaseData?.totalPoCost !== undefined && catbaseData?.totalPoCost !== null
                      ? parseFloat(catbaseData?.totalPoCost).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12"
                  style={{ display: 'flex' }}
                >
                  <p style={{ marginLeft: '20px', marginRight: '10px', fontWeight: 'bold' }}>
                    Total Budget Status (Rs.)
                  </p>
                  <p>
                    {catbaseData?.finalBudgetStatus !== undefined &&
                    catbaseData?.finalBudgetStatus !== null
                      ? parseFloat(catbaseData?.finalBudgetStatus).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
              </div>
              <Divider style={{ margin: '15px 0' }} />
            </div>
          ))}
        </div>
      ))}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h6>Material Transfer Details:</h6>
          {/* <Button type="primary" text="Export" onClick={DownloadPDF} /> */}
        </div>
        <Table
          // Material Transfer Details
          columns={columnmat}
          dataSource={materialTable}
          bordered
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [materialTable?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          onChange={handleChange}
        />
        <Divider style={{ margin: '15px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h6>Timesheet Report Detail:</h6>
          {/* <Button type="primary" text="Export" onClick={DownloadPDF} /> */}
        </div>
        <Table
          // Timesheet Report Detail:
          columns={TimeSheetColumns}
          dataSource={timeSheetDetails}
          bordered
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [timeSheetDetails?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          onChange={handleChange2}
        />
        <Divider style={{ margin: '15px 0' }} />
      </div>
      <div>
        {retrivaldata.length > 0 ? (
          <table
            style={{
              width: '25%',
              margin: 'auto',
              marginBottom: '10px',
              border: '1px solid black',
              borderCollapse: 'collapse',
            }}
          >
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Budget for Indented Material (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {budgetIndent !== undefined && budgetIndent !== null
                    ? parseFloat(budgetIndent).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Final Cost (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {actualCost !== undefined &&
                  matCost !== undefined &&
                  actualCost !== null &&
                  matCost !== null
                    ? (parseFloat(actualCost) - parseFloat(matCost)).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  RMC Budget Status (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {budgetstatus !== undefined && budgetstatus !== null
                    ? parseFloat(budgetstatus).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Material Transfer Cost (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {matCost !== undefined && matCost !== null
                    ? parseFloat(matCost).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  Debit Note Raised Cost (Rs.)
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {debitCost !== undefined && debitCost !== null
                    ? parseFloat(debitCost).toLocaleString('en-IN')
                    : 0}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Employee Cost (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {matCost !== undefined && matCost !== null
                    ? parseFloat(employeeCost).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>Actual Spent (Rs.)</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {actualCost !== undefined &&
                  actualCost !== null &&
                  employeeCost !== undefined &&
                  employeeCost !== null 
                    ? (parseFloat(actualCost) + parseFloat(employeeCost) -parseFloat(debitCost)).toLocaleString('en-IN')
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>

      <div style={{ overflowX: 'auto' }}>
        {retrivaldata.length > 0 ? (
          <table style={{ width: '50%', margin: 'auto', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  Description
                </th>
                <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  Overall Sales Budget Cost (Rs.)
                </th>
                <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  Actual Spent (Rs.)
                </th>
                <th style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  Available budget as on date (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  <p>Overall RMC Mechanical & Electrical </p>
                </td>
                <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  {/* <Input type="text" readOnly value={budgetCost} /> */}
                  <p>
                    {' '}
                    {budgetCost !== undefined && budgetCost !== null
                      ? parseFloat(budgetCost).toLocaleString('en-IN')
                      : ''}
                  </p>
                </td>
                <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  <p>
                    {' '}
                    {actualCost !== undefined && actualCost !== null
                      ? parseFloat(actualcostvalue).toLocaleString(
                          'en-IN',
                        )
                      : ''}
                  </p>
                </td>
                <td style={{ textAlign: 'center', border: '1px solid #000', padding: '8px' }}>
                  <p>
                    {' '}
                    {availCost !== undefined && availCost !== null
                      ? parseFloat(budgetCost -actualcostvalue).toLocaleString('en-IN')
                      : ''}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </div>
      <div>
        {detailModalVisible ? (
          <ModalPopup
            FieldsComponent={FieldsComponent}
            isModalVisible={detailModalVisible}
            text={`Indent Details -${singleIndent?.indentCode}  -${singleIndent?.sbcDesc}`}
            width={1400}
            onCancel={() => {
              handleDetailCancel()
            }}
          />
        ) : null}
        {/* {showMaterialDtl ? (
          <ModalPopup
            text="Material Transfer Details"
            isModalVisible="setshowMaterialDtl"
            onCancel={() => {
              handleDetailCardCancel()
            }}
            FieldsComponent={DtlFieldComponent}
            width="900"
          />
        ) : null} */}
      </div>
      <BackButtonComponent componentToRender="project" />
    </div>
  )
}

export default ProjectCostAnalysis
