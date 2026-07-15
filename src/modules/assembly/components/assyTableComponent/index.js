import React, { useState, useEffect } from 'react'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import { FileExcelOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { Button } from 'antd'
import currentDateTime from '../../../../currentDateTime'

const AssemblyTableComponent = ({ data, onClick }) => {
  const [filtersinfo, setfilterinfo] = useState([])

  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
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

  const customerName1 = []
  const projectName1 = []
  const projectCode1 = []
  const projectDesc1 = []
  const requestDate1 = []
  const planStartDate1 = []
  const planEndDate1 = []
  const actualStartDate1 = []
  const actualEndDate = []

  if (data) {
    data.map(h => {
      return customerName1.push(h.customerName)
    })
    data.map(h => {
      return projectName1.push(h.projectName)
    })
    data.map(h => {
      return projectCode1.push(h.projectCode)
    })
    data.map(h => {
      return projectDesc1.push(h.projectDesc)
    })
    data.map(h => {
      return requestDate1.push(h.requestDate)
    })
    data.map(h => {
      return planStartDate1.push(h.planStartDate)
    })
    data.map(h => {
      return planEndDate1.push(h.planEndDate)
    })
    data.map(h => {
      return actualStartDate1.push(h.actualStartDate)
    })
    data.map(h => {
      return actualEndDate.push(h.actualEndDate)
    })
  }
  const customerName3 = []
  const projectName3 = []
  const projectCode3 = []
  const projectDesc3 = []
  const requestDate3 = []
  const planStartDate3 = []
  const planEndDate3 = []
  const actualStartDate3 = []
  const actualEndDate3 = []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const customerName2 = customerName1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const projectCode2 = projectCode1.filter(distinct)
  const projectDesc2 = projectDesc1.filter(distinct)
  const requestDate2 = requestDate1.filter(distinct)
  const planStartDate2 = planStartDate1.filter(distinct)
  const planEndDate2 = planEndDate1.filter(distinct)
  const actualStartDate2 = actualStartDate1.filter(distinct)
  const actualEndDate2 = actualEndDate.filter(distinct)

  customerName2.map(element => {
    return customerName3.push({
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
  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
  projectDesc2.map(element => {
    return projectDesc3.push({
      text: element,
      value: element,
    })
  })
  requestDate2.map(element => {
    return requestDate3.push({
      text: element ? moment(element).format('YYYY-MMM-DD') : '',
      value: element,
    })
  })
  planStartDate2.map(element => {
    return planStartDate3.push({
      text: element ? moment(element).format('YYYY-MMM-DD') : '',
      value: element,
    })
  })
  planEndDate2.map(element => {
    return planEndDate3.push({
      text: element ? moment(element).format('YYYY-MMM-DD') : '',
      value: element,
    })
  })
  actualStartDate2.map(element => {
    return actualStartDate3.push({
      text: element ? moment(element).format('YYYY-MMM-DD') : '',
      value: element,
    })
  })
  actualEndDate2.map(element => {
    return actualEndDate3.push({
      text: element ? moment(element).format('YYYY-MMM-DD') : '',
      value: element,
    })
  })

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleCardClick = record => {
    if (onClick) {
      onClick(record)
    }
  }

  const SaleColumns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'center',
      width: '150px',
      filters: customerName3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },
    {
      title: 'Project Desc',
      dataIndex: 'projectDesc',
      key: 'projectDesc',
      filters: projectDesc3,
      filteredValue: filtersinfo.projectDesc,
      onFilter: (value, record) => record?.projectDesc === value,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      filters: requestDate3,
      filteredValue: filtersinfo.requestDate,
      onFilter: (value, record) => record?.requestDate === value,
      render: text =>
        text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Plan Start Date',
      dataIndex: 'planStartDate',
      key: 'planStartDate',
      filters: planStartDate3,
      filteredValue: filtersinfo.planStartDate,
      onFilter: (value, record) => record?.planStartDate === value,
      render: text =>
        text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Plan End Date',
      key: 'planEndDate',
      dataIndex: 'planEndDate',
      filters: planEndDate3,
      filteredValue: filtersinfo.planEndDate,
      onFilter: (value, record) => record?.planEndDate === value,
      render: text =>
        text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Actual Start Date',
      key: 'actualStartDate',
      dataIndex: 'actualStartDate',
      filters: actualStartDate3,
      filteredValue: filtersinfo.actualStartDate,
      onFilter: (value, record) => record?.actualStartDate === value,
      render: text =>
        text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Actual End Date',
      key: 'actualEndDate',
      dataIndex: 'actualEndDate',
      filters: actualEndDate3,
      filteredValue: filtersinfo.actualEndDate,
      onFilter: (value, record) => record?.actualEndDate === value,
      render: text =>
        text !== null && text !== undefined ? moment(text).format('DD-MMM-YYYY') : '-',
    },
    {
      title: 'Indent Plan',
      key: 'indentCount',
      dataIndex: 'indentCount',
      width: 120,
      align: 'right',
    },
    {
      title: 'Indent Act.',
      key: 'indentIsCompletedCount',
      dataIndex: 'indentIsCompletedCount',
      align: 'right',
    },
    {
      title: 'Material Plan',
      key: 'materialRequestHdrCount',
      dataIndex: 'materialRequestHdrCount',
      align: 'right',
    },
    {
      title: 'Material Actual',
      key: 'materialRequestIsCompletedCount',
      dataIndex: 'materialRequestIsCompletedCount',
      align: 'right',
    },
    {
      title: 'Action',
      key: 'taskActual',
      dataIndex: ['taskActual'],
      render: (text, record) => {
        return (
          <Button type="primary" onClick={() => handleCardClick(record)}>
            Details
          </Button>
        )
      },
    },
  ]
  return (
    <div className="card" style={isMobile ? { width: tableWidth } : { marginTop: '10px' }}>
      <div className="card-body" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
        <div style={{ marginTop: '15px' }}>
          <Table
            columns={SaleColumns}
            dataSource={data}
            exportableProps={{
              fileName: `Assembly Details${currentDateTime}`,
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
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default AssemblyTableComponent
