import React, { useState, useEffect } from 'react'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import { useMediaQuery } from 'react-responsive'
import { FileExcelOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import currentDateTime from '../../../../currentDateTime'

const FinanceTableComponent = ({ data, onClick }) => {
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

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const dateSp = dateStringval.split('-')
      returndata = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
    } else {
      returndata = '-'
    }
    return returndata
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleCardClick = record => {
    if (onClick) {
      onClick(record)
    }
  }

  const projectCode1 = []
  const customerName1 = []
  const projectName1 = []
  const initiatedDate1 = []
  const handoverDate1 = []
  const dueDate1 = []

  if (data) {
    data.map(h => {
      return projectCode1.push(h.projectCode)
    })
    data.map(h => {
      return customerName1.push(h.customerName)
    })
    data.map(h => {
      return projectName1.push(h.projectName)
    })
    data.map(h => {
      return initiatedDate1.push(h.initiatedDate)
    })
    data.map(h => {
      return handoverDate1.push(h.handoverDate)
    })
    data.map(h => {
      return dueDate1.push(h.dueDate)
    })
  }
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projectCode2 = projectCode1.filter(distinct)
  const customerName2 = customerName1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const initiatedDate2 = initiatedDate1.filter(distinct)
  const handoverDate2 = handoverDate1.filter(distinct)
  const dueDate2 = dueDate1.filter(distinct)

  const projectCode3 = []
  const customerName3 = []
  const projectName3 = []
  const initiatedDate3 = []
  const handoverDate3 = []
  const dueDate3 = []

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
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
  initiatedDate2.map(element => {
    return initiatedDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  handoverDate2.map(element => {
    return handoverDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  dueDate2.map(element => {
    return dueDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })
  const FInanceColumns = [
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      align: 'center',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      filters: customerName3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
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
      title: 'Start Date',
      dataIndex: 'initiatedDate',
      key: 'initiatedDate',
      filters: initiatedDate3,
      filteredValue: filtersinfo.initiatedDate,
      onFilter: (value, record) => record?.initiatedDate === value,
      render: text => dateformatter(text),
    },
    {
      title: 'Handover Date',
      key: 'handoverDate',
      dataIndex: 'handoverDate',
      filters: handoverDate3,
      filteredValue: filtersinfo.handoverDate,
      onFilter: (value, record) => record?.handoverDate === value,
      render: text => dateformatter(text),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      filters: dueDate3,
      filteredValue: filtersinfo.dueDate,
      onFilter: (value, record) => record?.dueDate === value,
      render: text => dateformatter(text),
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
            columns={FInanceColumns}
            dataSource={data}
            exportableProps={{
              fileName: `FInance Details${currentDateTime}`,
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
            bordered
          />
        </div>
      </div>
    </div>
  )
}

export default FinanceTableComponent
