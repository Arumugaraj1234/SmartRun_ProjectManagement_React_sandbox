import React, { useState, useEffect } from 'react'
import { FileExcelOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import { Button } from 'antd'
import store from 'store'
import moment from 'moment'
import currentDateTime from '../../../../currentDateTime'

// import style from './style.module.scss';

const ProjectTable = ({ data, onClickfun }) => {
  const [filtersinfo, setfilterinfo] = useState([])

  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const currency = store.get('MenuListData')

  const budgetValString = `Budget${currency[0].currency}`
  const actualValString = `Actual${currency[0].currency}`
  const balanceString = `Balance${currency[0].currency}`

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call to set width on component mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // const handleCardView = () => {
  //   setIsTableOpen(false)
  // }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const dateSp = dateStringval.split('-')
      returndata = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  const customer1 = []
  const projectnum1 = []
  const projectname1 = []
  const completion1 = []
  const status1 = []
  const duedate1 = []
  if (data) {
    data.map(h => {
      return customer1.push(h.customerName)
    })
    data.map(h => {
      return projectnum1.push(h.projCode)
    })
    data.map(h => {
      return projectname1.push(h.projectName)
    })
    data.map(h => {
      return completion1.push(h.completionPercent)
    })
    data.map(h => {
      return status1.push(h.hdrStatusDesc)
    })
    data.map(h => {
      return duedate1.push(h.dueDate)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const customer2 = customer1.filter(distinct)
  const projectnum2 = projectnum1.filter(distinct)
  const projectname2 = projectname1.filter(distinct)
  const completion2 = completion1.filter(distinct)
  const status2 = status1.filter(distinct)
  const duedate2 = duedate1.filter(distinct)

  const customer3 = []
  const projectnum3 = []
  const projectname3 = []
  const completion3 = []
  const status3 = []
  const duedate3 = []

  customer2.map(element => {
    return customer3.push({
      text: element,
      value: element,
    })
  })
  projectnum2.map(element => {
    return projectnum3.push({
      text: element,
      value: element,
    })
  })
  projectname2.map(element => {
    return projectname3.push({
      text: element,
      value: element,
    })
  })
  completion2.map(element => {
    return completion3.push({
      text: element,
      value: element,
    })
  })
  status2.map(element => {
    return status3.push({
      text: element,
      value: element,
    })
  })
  duedate2.map(element => {
    return duedate3.push({
      text: dateformatter(element),
      value: element,
    })
  })

  // const handleCardClick = e => {
  //   setSlaveIdval(e.seId)
  //   setDesignID(e.designID)
  //   setProjectID(ProjectIDVals)
  //   store.set('ProjectID', e.pmHdrId)
  //   store.set('ProjectPMHdrId', e.pmHdrId)
  //   store.set('InitiatedDate', e.initiateDate)
  //   store.set('PlannedStartDate', e.plannedStartDate)
  //   store.set('plannerEndDate', e.plannedEndDate)
  //   store.set('Priority', e.priority)
  //   store.set('ScopeOfWork', e.scopeOfWork)
  //   store.set('IndustrialType', e.industrialType)
  //   store.set('EnquiryID', e.enquiryId)
  //   store.set('Handoverdate', e.projHandOverDate)
  //   store.set('EndDate', e.dueDate)
  //   store.set('CreatedDate', e.createdDate)
  //   setProjectName(e.projectName)
  //   setProjectCode(e.projCode !== null ? e.projCode : '-')
  //   RetriveData(e.designID)
  //   TileRetriveData(e.designID)
  //   setCustomerCard(true)
  //   setIsTableOpen(false)
  //   getViewDetailsVal()

  //   const Enquiry = [
  //     {
  //       key: 1,
  //       label: 'Project Number',
  //       value: e.projCode ? e.projCode : '<- To be Generated ->',
  //     },
  //     {
  //       key: 2,
  //       label: 'Project name',
  //       value: e.projectName,
  //     },
  //     {
  //       key: 3,
  //       label: 'Project Status',
  //       value: e.hdrStatusDesc,
  //     },
  //     {
  //       key: 4,
  //       label: 'Customer name',
  //       value: e.customerName,
  //     },
  //     {
  //       key: 5,
  //       label: 'Project HandOver date',
  //       value: e.projHandOverDate !== null ? moment(e.projHandOverDate).format('DD-MMM-YYYY') : '-',
  //     },
  //     // {
  //     //   key: 6,
  //     //   label: "Due Date",
  //     //   value: moment(e.dueDate).format('DD-MMM-YYYY'),
  //     // },
  //     {
  //       key: 6,
  //       label: 'Due Date',
  //       editable: true,
  //       value: moment(e.dueDate).format('DD-MMM-YYYY'),
  //     },
  //     // {
  //     //   key: 6,
  //     //   label: (
  //     //     <span>
  //     //       {' '}
  //     //       Due Date
  //     //       <Button
  //     //         type="primary"
  //     //         onClick={() => {
  //     //           showDtlRecords()
  //     //         }}
  //     //         icon={<InfoCircleOutlined />}
  //     //       />
  //     //     </span>
  //     //   ),
  //     //   value: moment(e.dueDate).format('DD-MMM-YYYY'),
  //     // },
  //     {
  //       key: 7,
  //       label: budgetValString,
  //       value: currencyFormat(e.indentPlan),
  //     },
  //     {
  //       key: 8,
  //       label: actualValString,
  //       value: currencyFormat(e.indentActual),
  //     },
  //     {
  //       key: 9,
  //       label: balanceString,
  //       value: currencyFormat(Number(e.indentPlan) - Number(e.indentActual)),
  //     },
  //     {
  //       key: 10,
  //       label: saleValString,
  //       value: currencyFormat(saleVal),
  //     },
  //   ]
  //   store.set('Enquiry', Enquiry)
  //   history.push({
  //     pathname: '/projectdetails',
  //     state: { e },
  //   })
  // }

  const ProjectColumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      filters: customer3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Project Number',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: projectnum3,
      filteredValue: filtersinfo.projCode,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectname3,
      filteredValue: filtersinfo.projCode,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: budgetValString,
      key: 'indentPlan',
      dataIndex: 'indentPlan',
      className: 'right-align-cell',
      render: (text, record) =>
        record.costFlowType === 'NEW' ? currencyFormat(record.allocatedValue) : currencyFormat(text),
    },
    {
      title: actualValString,
      dataIndex: 'indentActual',
      key: 'indentActual',
      className: 'right-align-cell',
      render: (text, record) =>
        record.costFlowType === 'NEW' ? currencyFormat(record.actualSpent) : currencyFormat(text),
    },
    {
      title: `Target Cost ${currency[0].currency}`,
      dataIndex: 'targetCost',
      key: 'targetCost',
      className: 'right-align-cell',
      render: (text, record) =>
        record.costFlowType === 'NEW' ? '-' : text ? currencyFormat(text) : '0',
    },
    {
      title: balanceString,
      dataIndex: '',
      className: 'right-align-cell',
      render: record => {
        if (record.costFlowType === 'NEW') {
          return record.saleValue !== null && record.actualSpent !== null
            ? currencyFormat(Number(record.saleValue) - Number(record.actualSpent))
            : '-'
        }
        return record.indentPlan !== null && record.indentActual !== null
          ? currencyFormat(Number(record.indentPlan) - Number(record.indentActual))
          : '-'
      },
    },
    {
      title: 'Completion (%)',
      key: 'completionPercent',
      dataIndex: 'completionPercent',
      className: 'right-align-cell',
      filters: completion3,
      filteredValue: filtersinfo.completionPercent,
      onFilter: (value, record) => record?.completionPercent === value,
    },
    {
      title: 'Status',
      key: 'hdrStatusDesc',
      dataIndex: 'hdrStatusDesc',
      filters: status3,
      filteredValue: filtersinfo.hdrStatusDesc,
      onFilter: (value, record) => record?.hdrStatusDesc === value,
    },
    {
      title: 'Due Date',
      key: 'dueDate',
      dataIndex: 'dueDate',
      filters: duedate3,
      filteredValue: filtersinfo.dueDate,
      onFilter: (value, record) => record?.dueDate === value,
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (text, record) => {
        // const cutoffDate = new Date('2026-12-28')
        // return new Date() < cutoffDate ? (
        return (
          <Button type="primary" onClick={() => onClickfun(record)}>
            Details
          </Button>
        )
      },
    },
  ]

  return (
    <div className="card" style={isMobile ? { width: tableWidth } : { marginTop: '10px' }}>
      <div className="card-body" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
        <div className="table" style={{ marginTop: '15px' }}>
          <Table
            columns={ProjectColumns}
            dataSource={data}
            exportableProps={{
              fileName: `Project${currentDateTime}`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [data?.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
            scroll={{ y: 400 }}
            bordered
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectTable
