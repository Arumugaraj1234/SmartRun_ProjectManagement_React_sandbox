/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react'
import store from 'store'
import { Timeline, Card, Button, Checkbox } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Table } from 'ant-table-extensions'
import { FileExcelOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import moment from 'moment'
import currentDateTime from 'currentDateTime'
import NotifyApprove from './NotifyApprove'
import './style.scss'
import '../style.scss'

const NotificationTimeline = () => {
  const history = useHistory()
  const { params } = useParams()
  const MenuListData = store.get('MenuListData')
  const [sampleData, setSampleData] = useState([])
  const [approveDetails, setApproveDetails] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const [tableWidth, setTableWidth] = useState('300px')
  const [opendetails, setOpenDetails] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selecteditems, setSelectedItems] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  useEffect(() => {
    getNotificationDetails()
    getApproveDetails()
  }, [])
  // convert url params → object
const queryParams = {};
if (params) {
  // List of known keys we expect
  const keys = ['pmId', 'pmHdrId', 'docTypeCode', 'docTypeDesc', 'uniStgCode', 'tenantId', 'refCode'];

  let remaining = params;

  keys.forEach((key, index) => {
    const prefix = `${key  }=`;
    if (remaining.startsWith(prefix)) {
      remaining = remaining.slice(prefix.length);
      // If not the last key, stop at the next known key
      if (index < keys.length - 1) {
        // Find next key position
        const nextKeyIndex = keys
          .slice(index + 1)
          .map(k => remaining.indexOf(`${k  }=`))
          .filter(i => i >= 0)
          .sort((a, b) => a - b)[0];

        if (nextKeyIndex !== undefined) {
          queryParams[key] = decodeURIComponent(remaining.slice(0, nextKeyIndex - 1));
          remaining = remaining.slice(nextKeyIndex);
        } else {
          queryParams[key] = decodeURIComponent(remaining);
          remaining = '';
        }
      } else {
        // Last key, take everything
        queryParams[key] = decodeURIComponent(remaining);
        remaining = '';
      }
    }
  });
}

console.log(queryParams);


  console.log('URL Params:', queryParams)
  console.log('Approval Record:', approveDetails)

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

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const projectCode1 = []
  const projectName1 = []
  const docTypeDesc1 = []
  const refCode1 = []
  const insertedDate1 = []

  if (approveDetails && approveDetails.length > 0) {
    approveDetails.map(h => {
      return projectCode1.push(h.projectCode)
    })
    approveDetails.map(h => {
      return projectName1.push(h.projectName)
    })
    approveDetails.map(h => {
      return docTypeDesc1.push(h.docTypeDesc)
    })
    approveDetails.map(h => {
      return refCode1.push(h.refCode)
    })
    approveDetails.map(h => {
      return insertedDate1.push(h.insertedDate)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const docTypeDesc2 = docTypeDesc1.filter(distinct)
  const refCode2 = refCode1.filter(distinct)
  const insertedDate2 = insertedDate1.filter(distinct)

  const projectCode3 = []
  const projectName3 = []
  const docTypeDesc3 = []
  const refCode3 = []
  const insertedDate3 = []

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
  docTypeDesc2.map(element => {
    return docTypeDesc3.push({
      text: element,
      value: element,
    })
  })
  refCode2.map(element => {
    return refCode3.push({
      text: element,
      value: element,
    })
  })
  insertedDate2.map(element => {
    return insertedDate3.push({
      text: element,
      value: element,
    })
  })

  const getProjectDetails = async record => {
    let data
    const keyareaobj = {
      tenantID: tenantId,
      fromDate: '',
      toDate: '',
      custName: '',
      projectID: record?.projectId,
      pmId: record?.pmId,
      empId: employeeId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getProjectDtl',
        requestData: keyareaobj,
      })

      if (response.responseCode) {
        data = response?.responseData[0]

        // Set data in store
        store.set('ProjectID', data?.pmHdrId)
        store.set('ProjectPMHdrId', data?.pmHdrId)
        store.set('InitiatedDate', data?.initiateDate)
        store.set('PlannedStartDate', data?.plannedStartDate)
        store.set('plannerEndDate', data?.plannedEndDate)
        store.set('Priority', data?.priority)
        store.set('ScopeOfWork', data?.scopeOfWork)
        store.set('IndustrialType', data?.industrialType)
        store.set('EnquiryID', data?.enquiryId)
        store.set('Handoverdate', data?.projHandOverDate)
        store.set('EndDate', data?.dueDate)
        store.set('CreatedDate', data?.createdDate)
        store.set('referenceMstId', data?.pmHdrId)

        store.set('projectCode', data?.projCode)
        store.set('projectName', data?.projectName)
        store.set('PlannedStartDate', data?.plannedStartDate)
        store.set('plannerEndDate', data?.plannedEndDate)
        store.set('Priority', data?.priority)
        store.set('IndustrialType', data?.industrialType)
        store.set('ScopeOfWork', data?.scopeOfWork)
        store.set('Handoverdate', data?.projHandOverDate)
        store.set('EndDate', data?.dueDate)

        const Enquiry = [
          {
            key: 1,
            label: 'Project Number',
            value: data?.projCode ? data?.projCode : '<- To be Generated ->',
          },
          {
            key: 2,
            label: 'Project name',
            value: data?.projectName,
          },
          {
            key: 3,
            label: 'Project Status',
            value: data?.hdrStatusDesc,
          },
          {
            key: 4,
            label: 'Customer name',
            value: data?.customerName,
          },
          {
            key: 5,
            label: 'Project HandOver date',
            value:
              data?.projHandOverDate !== null
                ? moment(data?.projHandOverDate).format('DD-MMM-YYYY')
                : '-',
          },
          {
            key: 6,
            label: 'Due Date',
            editable: true,
            value: data?.dueDate ? moment(data?.dueDate).format('DD-MMM-YYYY') : '-',
          },
          {
            key: 7,
            label: `Budget${MenuListData[0].currency}`,
            value: currencyFormat(data?.indentPlan),
          },
          {
            key: 8,
            label: `Final${MenuListData[0].currency}`,
            value: currencyFormat(data?.indentActual),
          },
          {
            key: 9,
            label: `Balance${MenuListData[0].currency}`,
            value: currencyFormat(Number(data?.indentPlan) - Number(data?.indentActual)),
          },
          {
            key: 10,
            label: `Sale Value${MenuListData[0].currency}`,
            value: '',
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/projectdetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  useEffect(() => {
    if (!queryParams.pmId || !queryParams.docTypeCode) return

    // find matching record
    const match = approveDetails.find(
      rec =>
        rec.pmId === queryParams.pmId &&
        rec.docTypeCode === queryParams.docTypeCode &&
        rec.refCode === queryParams.refCode
    )

    if (match) {
      console.log('Auto-redirecting with record:', match)

      // Decide which handler to call
      if (
        (match?.projectId !== '' && match?.isInternal != 1) ||
        (match?.docTypeCode === 'DC038' && match?.isInternal == 1) ||
        (match?.docTypeCode === 'DC039' && match?.isInternal == 1)
      ) {
        handleApprove(match)
      } else if (match?.docTypeCode === 'DC078') {
        handleredirect(match)
      } else if (match?.pmId === '1') {
        handleredirectToSaleEnquiry(match)
      } else if (match?.docTypeCode === 'DC018' && match?.isInternal == 1) {
        handleredirectToGeneral(match)
      }
    }
  }, [approveDetails, queryParams])

  const getDesignDetails = async record => {
    let data
    const keyareaobj = {
      tenantID: tenantId,
      fromDate: '',
      toDate: '',
      customer: '',
      designID: '',
      processId: record?.pmId || '2',
      projectId: record?.projectId,
      empId: employeeId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getDesignDtl',
        requestData: keyareaobj,
      })

      if (response.responseCode) {
        data = response?.responseData[0]
        store.set('ProjectID', data?.projectID)
        store.set('DesignID', data?.designID)
        store.set('hdrId', data?.designID)
        store.set('enquiryId', data?.enquiryId)
        store.set('EnquiryID', data?.enquiryId)

        const Enquiry = [
          // {
          //   key: 1,
          //   label: 'Design Code',
          //   value: e.designCode,
          // },
          {
            key: 2,
            label: 'Project Number',
            value: data?.projectCode,
          },
          {
            key: 3,
            label: 'Project name',
            value: data?.projectName,
          },
          {
            key: 4,
            label: 'Customer name',
            value: data?.customerName,
          },
          {
            key: 5,
            label: 'Requested by',
            value: data?.requestedBy,
          },
          {
            key: 6,
            label: 'Planned Start Date',
            value: data?.plannedStartDate
              ? moment(data?.plannedStartDate).format('DD-MMM-YYYY')
              : '',
          },
          {
            key: 7,
            label: 'Due Date',
            value: data?.dueDate ? moment(data?.dueDate).format('DD-MMM-YYYY') : '',
          },
          {
            key: 8,
            label: 'Status',
            value: data?.hdrStatusDesc,
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/designdetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const getAssemblyDtl = async record => {
    let data
    const keyareaobj = {
      tenantID: tenantId,
      fromDate: '',
      toDate: '',
      custName: '',
      assyId: '',
      pmId: record?.pmId,
      projectId: record?.projectId,
      empId: employeeId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getAssyDtl',
        requestData: keyareaobj,
      })
      if (response.responseCode) {
        data = response?.responseData[0]
        store.set('AssyHdrId', data?.assyHdrId)
        store.set('hdrId', data?.assyHdrId)
        store.set('ProjectID', data?.pmHdrId)
        store.set('EnquiryID', data?.enquiryId)
        const Enquiry = [
          {
            key: 1,
            label: 'Project Number',
            value: data?.projectCode,
          },
          {
            key: 2,
            label: 'Project Name',
            value: data?.projectName,
          },
          {
            key: 3,
            label: 'Project Status',
            value: data?.hdrStatusDesc,
          },
          {
            key: 4,
            label: 'Customer Name',
            value: data?.customerName,
          },
          {
            key: 5,
            label: 'Indent Plan',
            value: data?.indentCount,
          },
          {
            key: 6,
            label: 'Indent Actual',
            value: data?.indentIsCompletedCount,
          },
          {
            key: 7,
            label: 'Material Plan',
            value: data?.materialRequestHdrCount,
          },
          {
            key: 8,
            label: 'Material Actual',
            value: data?.materialRequestIsCompletedCount,
          },
          {
            key: 9,
            label: 'Request Date',
            value: moment(data?.requestDate).format('DD-MMM-YYYY'),
          },
          {
            key: 10,
            label: `Planned Start Date`,
            value: moment(data?.planStartDate).format('DD-MMM-YYYY'),
          },
          {
            key: 11,
            label: 'Due Date',
            value: moment(data?.planEndDate).format('DD-MMM-YYYY'),
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/assemblydetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }
  const getSCMDetails = async record => {
    let data
    const keyareaobj = {
      fromDate: '',
      toDate: '',
      tenantId,
      empId: employeeId,
      customerName: '',
      projectId: record?.projectId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getScmHdrBasedDtl',
        requestData: keyareaobj,
      })

      if (response.responseCode) {
        data = response?.responseData[0]
        store.set('ProjectID', data?.pmHdrId)
        store.set('ProjectPMHdrId', data?.pmHdrId)
        store.set('ScmHdrId', data?.scmHdrId)
        store.set('InitiatedDate', data?.scmInitiatedDate)
        store.set('PlannedStartDate', data?.plannedStartDate)
        store.set('plannerEndDate', data?.plannedEndDate)
        store.set('Priority', data?.priority)
        store.set('ScopeOfWork', data?.scopeOfWork)
        store.set('IndustrialType', data?.industrialType)
        store.set('EnquiryID', data?.enquiryId)

        const Enquiry = [
          {
            key: 1,
            label: 'Project Number',
            value: data?.projectCode === '-' ? '<- To be Generated ->' : data?.projectCode,
          },
          {
            key: 2,
            label: 'Project name',
            value: data?.projectName,
          },
          {
            key: 3,
            label: 'Project Status',
            value: data?.hdrStatusDesc,
          },
          {
            key: 4,
            label: 'Customer name',
            value: data?.customerName,
          },
          {
            key: 5,
            label: 'Planned Start Date',
            value: moment(data?.scmInitiatedDate).format('DD-MMM-YYYY'),
          },
          {
            key: 6,
            label: 'Due Date',
            value: moment(data?.dueDate).format('DD-MMM-YYYY'),
          },
          {
            key: 7,
            label: 'Indent Count',
            value: data?.intentCount,
          },
          {
            key: 8,
            label: `Raised PO's`,
            value: data?.poCount,
          },
          {
            key: 9,
            label: `Material Inward`,
            value: data?.inwardCount,
          },
          {
            key: 10,
            label: `GRN`,
            value: data?.grnCount,
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/scmdetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const getFinanceDetails = async record => {
    let data
    const keyareaobj = {
      processId: record?.pmId,
      customer: '',
      empId: employeeId,
      fromDate: '',
      designID: '',
      tenantID: tenantId,
      toDate: '',
      projectId: record?.projectId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getFinanceDtl',
        requestData: keyareaobj,
      })

      if (response.responseCode) {
        data = response?.responseData[0]
        store.set('EnquiryID', data?.enquiryId)
        store.set('feHdrId', data?.feHdrId)
        store.set('ProjectID', data?.pmHdrId)
        store.set('isInternal', data?.isInternal)

        const Enquiry = [
          {
            key: 1,
            label: 'Project Number',
            value: data?.projectCode || '',
          },
          {
            key: 2,
            label: 'Project Name',
            value: data?.projectName || '',
          },
          {
            key: 3,
            label: 'Status',
            value: data?.hdrStatusDesc || '',
          },
          {
            key: 4,
            label: 'Start Date',
            value: data?.initiatedDate ? moment(data?.initiatedDate).format('DD-MMM-YYYY') : '',
          },
          {
            key: 5,
            label: 'Handover Date',
            value: data?.handoverDate ? moment(data?.handoverDate).format('DD-MMM-YYYY') : '',
          },
          {
            key: 6,
            label: 'Due Date',
            value: data?.dueDate ? moment(data?.dueDate).format('DD-MMM-YYYY') : '',
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/financedetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const getQualityDetails = async record => {
    let data
    const payload = {
      qhdrId: '',
      customerName: '',
      empId: employeeId,
      fromDate: '',
      pmId: record?.pmId,
      tenantId,
      toDate: '',
      projectId: record?.projectId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getQtyDtl',
        requestData: payload,
      })

      if (response.responseCode) {
        data = response?.responseData[0]
        store.set('EnquiryID', data?.enquiryId)
        store.set('QtyHdrId', data?.qhdrId)
        store.set('ProjectID', data?.pmHdrId)

        const sumofqty =
          parseInt(data?.okCount || '0', 10) +
          parseInt(data?.conditionalApprovedCnt || '0', 10) +
          parseInt(data?.rejectedCount || '0', 10) +
          parseInt(data?.reworkCount || '0', 10)
        const completedqty = sumofqty > data?.qtyToBeInspected ? data?.qtyToBeInspected : sumofqty

        const Enquiry = [
          {
            key: 1,
            label: 'Project Number',
            value: data?.projectCode || '',
          },
          {
            key: 2,
            label: 'Project Name',
            value: data?.projectName || '',
          },
          {
            key: 3,
            label: 'Status',
            value: data?.hdrStatusDesc || '',
          },
          {
            key: 4,
            label: 'Inspection Requested Qty.',
            value: parseInt(data?.qtyToBeInspected || '0', 10),
          },
          // {
          //   key: 11,
          //   label: 'Yet To be Inspected',
          //   value: parseInt(YettobeIns || '0', 10) ,
          // },
          {
            key: 6,
            label: 'Inspection Completed Qty.',
            value: parseInt(completedqty || '0', 10),
          },
          {
            key: 5,
            label: 'Ok Qty.',
            value: parseInt(data?.okCount || '0', 10),
          },
          {
            key: 6,
            label: 'Conditional Qty.',
            value: parseInt(data?.conditionalApprovedCnt || '0', 10),
          },
          {
            key: 7,
            label: 'Rejected Qty.',
            value: parseInt(data?.rejectedCount || '0', 10),
          },
          {
            key: 8,
            label: 'Rework Qty.',
            value: parseInt(data?.reworkCount || '0', 10),
          },
          {
            key: 9,
            label: 'No. of Request Received',
            value: data?.qtyinspectionTotal || '',
          },
          {
            key: 10,
            label: 'No. of Request Completed',
            value: data?.qtyinspectionCompleted || '',
          },
        ]

        store.set('Enquiry', Enquiry)
        // Navigate to project details page after setting data
        history.push({
          pathname: '/qualitydetails',
          state: { record },
        })
      }
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  const handleApprove = record => {
    console.log(record, 'record inside handleAprrove')
    getComponentName(record)
    if (record?.pmId === '1') {
      // sales
      // getDesignDetails(record)
    }
    if (record?.pmId === '2') {
      // design
      getDesignDetails(record)
    }
    if (record?.pmId === '3') {
      // project
      getProjectDetails(record)
    }
    if (record?.pmId === '4') {
      getAssemblyDtl(record)
    }
    if (record?.pmId === '5') {
      getSCMDetails(record)
    }
    if (record?.pmId === '6') {
      getQualityDetails(record)
    }
    if (record?.pmId === '7') {
      getFinanceDetails(record)
    }
  }

  const isInternal = store.get('isInternal')

  const getComponentName = async record => {
    try {
      const payload = {
        referenceId: record?.projectId,
        // eslint-disable-next-line eqeqeq
        processDoc: record?.docTypeCode === 'DC018' && isInternal == 1 ? '8' : record?.pmId,
        tenantId,
        docDesc: record?.docTypeDesc,
        uniqueStgCode: record?.uniqueStgCode,
      }
      const response = await indentFileUpload({
        requestPath: 'getDefaultComponentName',
        requestData: payload,
      })

      store.set('currentTab', response?.responseData[0]?.stgDesc)
    } catch (error) {
      console.log(error)
    }
  }

  const handleredirect = record => {
    history.push({
      pathname: '/master/vendorMaster',
      state: { record },
    })
  }
  const handleredirectToGeneral = record => {
    history.push({
      pathname: '/CommonIndentManagement',
      state: { record },
    })
  }
  const handleredirectToSaleEnquiry = record => {
    history.push({
      pathname: '/sales',
      state: { record },
    })
  }
  const handleCheckboxChange = record => {
    console.log(record)
    const find = selecteditems?.find(item => item?.dnDtlId === record?.dnDtlId)
    if (find) {
      const updatevalues = selecteditems?.filter(item => item?.dnDtlId !== record?.dnDtlId)
      setSelectedItems(updatevalues)
    } else {
      const updatevalues = [...selecteditems, record]
      setSelectedItems(updatevalues)
    }
  }

  const handleApproveAll = () => {
    console.log(selecteditems)
  }

  const columns = [
    {
      title: 'Select',
      dataIndex: 'checkbox',
      key: 'checkbox',
      hidden: true,
      render: (text, record) => (
        <Checkbox
          checked={selecteditems?.find(item => item?.dnDtlId === record?.dnDtlId)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },

    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => {
        const displayValue = record.pmId === '1' ? record.enquiryCode : record.projectCode
        return displayValue && displayValue.indexOf(value) === 0
      },
      render: (text, record) => {
        const displayValue = record.pmId === '1' ? record.enquiryCode : text
        return <div>{displayValue || '-'}</div>
      },
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => {
        return record.projectName && record.projectName.indexOf(value) === 0
      },
      render: text => <div>{text || '-'}</div>,
    },
    {
      title: 'Document Description',
      dataIndex: 'docTypeDesc',
      key: 'docTypeDesc',
      filters: docTypeDesc3,
      filteredValue: filtersinfo.docTypeDesc,
      onFilter: (value, record) => {
        return record.docTypeDesc && record.docTypeDesc.indexOf(value) === 0
      },
      render: text => <div>{text || '-'}</div>,
    },
    {
      title: 'Reference code',
      dataIndex: 'refCode',
      key: 'refCode',
      filters: refCode3,
      filteredValue: filtersinfo.refCode,
      onFilter: (value, record) => {
        return record.refCode && record.refCode.indexOf(value) === 0
      },
      render: text => <div>{text || '-'}</div>,
    },
    {
      title: 'Created Date',
      dataIndex: 'insertedDate',
      key: 'insertedDate',
      filters: insertedDate3,
      filteredValue: filtersinfo.insertedDate,
      onFilter: (value, record) => {
        return record.insertedDate && record.insertedDate.indexOf(value) === 0
      },
      render: text => <div>{text || '-'}</div>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return (
          <center style={{ display: 'flex', gap: '5px' }}>
            {(record?.projectId !== '' && record?.isInternal != 1) ||
            (record?.docTypeCode === 'DC038' && record?.isInternal == 1) ||
            (record?.docTypeCode === 'DC039' && record?.isInternal == 1) ? (
              <Button type="primary" onClick={() => handleApprove(record)}>
                View
              </Button>
            ) : null}
            {record?.docTypeCode === 'DC078' ? (
              <Button type="primary" onClick={() => handleredirect(record)}>
                View
              </Button>
            ) : null}
            {record?.pmId === '1' ? (
              <Button type="primary" onClick={() => handleredirectToSaleEnquiry(record)}>
                View
              </Button>
            ) : null}
            {record?.docTypeCode === 'DC018' && record?.isInternal == 1 ? (
              <Button type="primary" onClick={() => handleredirectToGeneral(record)}>
                View
              </Button>
            ) : null}
            {record?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.isEditable === '0' ? (
              <Button
                type="primary"
                style={{ display: 'block' }}
                onClick={() => {
                  setIsModalVisible(true)
                  setOpenDetails(record)
                }}
              >
                Approve
              </Button>
            ) : null}
          </center>
        )
      },
    },
  ].filter(item => !item.hidden)

  const onCancel = () => {
    setIsModalVisible(false)
    getApproveDetails()
  }

  const getNotificationDetails = async () => {
    const keyareaobj = {
      tenantID: tenantId,
      empId: employeeId,
    }
    const response = await indentFileUpload({
      requestPath: 'getNotificationDetails',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      let combinedList = []
      response.responseData[0].list.forEach(({ list }) => {
        combinedList = combinedList.concat(list)
      })
      combinedList.sort((a, b) => {
        const dateA = new Date(a.label)
        const dateB = new Date(b.label)
        return dateB - dateA
      })
      setSampleData(combinedList)
    } else {
      setSampleData([])
    }
  }

  const getApproveDetails = async () => {
    const keyareaobj = {
      tenantID: tenantId,
      empId: employeeId,
    }
    const response = await indentFileUpload({
      requestPath: 'getApprovalDesigDtls',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      setApproveDetails(response?.responseData)
      console.log(response?.responseData, 'response?.responseData in getapprove')
    } else {
      setApproveDetails([])
    }
  }

  const eventsByMonth = sampleData?.reduce((acc, item) => {
    const month = moment(item.label).format('MMMM YYYY')
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(item)
    return acc
  }, {})

  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    Object.keys(eventsByMonth)?.[Object.keys(eventsByMonth).length - 1]
      ? Object.keys(eventsByMonth).length - 1
      : 0,
  )

  const months = Object.keys(eventsByMonth)

  const handleNextMonth = () => {
    setCurrentMonthIndex(prevIndex => Math.min(prevIndex + 1, months.length - 1))
  }

  const handlePrevMonth = () => {
    setCurrentMonthIndex(prevIndex => Math.max(prevIndex - 1, 0))
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      {Object.keys(eventsByMonth).length > 0 && (
        <div className="row mt-2">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6  p-1">
            <Card
              title={
                <div style={isMobile ? { textAlign: 'center' } : {}}>
                  {months[currentMonthIndex]}
                </div>
              }
              className="mb-4"
            >
              <div
                style={
                  isMobile
                    ? { height: '398px', overflow: 'auto' }
                    : { height: '498px', overflow: 'auto' }
                }
              >
                <div
                  style={
                    isMobile
                      ? {
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '1px',
                          marginBottom: '20px',
                        }
                      : { display: 'flex', justifyContent: 'center', marginTop: '1rem' }
                  }
                >
                  <Button
                    onClick={handleNextMonth}
                    disabled={currentMonthIndex === months.length - 1}
                    style={{ marginLeft: '1rem' }}
                  >
                    Previous Month
                  </Button>
                  <Button onClick={handlePrevMonth} disabled={currentMonthIndex === 0}>
                    Next Month
                  </Button>
                </div>
                <Timeline>
                  <Timeline.Item>
                    <Button
                      onClick={handleNextMonth}
                      disabled={currentMonthIndex === months.length - 1}
                      style={{ marginLeft: '1rem' }}
                    >
                      Previous Month
                    </Button>
                  </Timeline.Item>
                  {eventsByMonth[months[currentMonthIndex]]?.map((event, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Timeline.Item key={index}>
                      <div>
                        <p>
                          {moment(event.label).format('DD-MMM-YYYY HH:mm')}{' '}
                          <span style={{ color: 'green' }}> - {`${event.event}`}</span>
                        </p>
                        <p>{event.description}</p>
                      </div>
                    </Timeline.Item>
                  ))}

                  <Timeline.Item>
                    <Button onClick={handlePrevMonth} disabled={currentMonthIndex === 0}>
                      Next Month
                    </Button>
                  </Timeline.Item>
                </Timeline>
              </div>
            </Card>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6  p-1">
            <Card
              title={
                <div style={isMobile ? { textAlign: 'center' } : {}}>Pending For Approval</div>
              }
              className="mb-4"
            >
              <div style={{ height: '498px', overflow: 'auto', paddingTop: '1rem' }}>
                <Button
                  onClick={handleApproveAll}
                  style={{ float: 'right', marginTop: '10px', display: 'none' }}
                  type="primary"
                >
                  Approve All
                </Button>
                <div className="custom_antd_Table">
                  <Table
                    dataSource={approveDetails}
                    columns={columns}
                    scrollY={isMobile ? 200 : 330}
                    exportableProps={{
                      fileName: `Pending_For_Approval${currentDateTime}`,
                      btnProps: {
                        type: 'primary',
                        icon: <FileExcelOutlined />,
                        children: <span>Export to CSV</span>,
                      },
                    }}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      {isModalVisible && (
        <NotifyApprove details={opendetails} modalVisible={isModalVisible} onCancel={onCancel} />
      )}
    </div>
  )
}

export default NotificationTimeline
