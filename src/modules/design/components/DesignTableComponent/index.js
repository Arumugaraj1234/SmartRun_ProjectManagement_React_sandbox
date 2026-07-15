import React, { useState, useEffect } from 'react'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import { FileExcelOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useMediaQuery } from 'react-responsive'
import currentDateTime from '../../../../currentDateTime'
// import style from './style.module.scss';

const DesignTable = ({ data, onClick }) => {
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

  const rfqdate1 = []
  const duedate1 = []
  const actlstrtdate1 = []
  const custName1 = []
  const status1 = []
  const projCode1 = []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  if (data) {
    data.map(h => {
      return rfqdate1.push(h.plannedStartDate)
    })
    data.map(h => {
      return duedate1.push(h.dueDate)
    })
    data.map(h => {
      return actlstrtdate1.push(h.actualStartDate)
    })
    data.map(h => {
      return projCode1.push(h.projectCode)
    })
    data.map(h => {
      return status1.push(h.hdrStatusDesc)
    })
    data.map(h => {
      return custName1.push(h.customerName)
    })
  }

  const rfqdate2 = rfqdate1.filter(distinct)
  const duedate2 = duedate1.filter(distinct)
  const actlstrtdate2 = actlstrtdate1.filter(distinct)
  const custName2 = custName1.filter(distinct)
  const status2 = status1.filter(distinct)
  const projCode2 = projCode1.filter(distinct)

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

  const rfqdate3 = []
  const duedate3 = []
  const actlstrtdate3 = []
  const custName3 = []
  const status3 = []
  const projCode3 = []

  rfqdate2.map(element => {
    return rfqdate3.push({
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

  actlstrtdate2.map(element => {
    return actlstrtdate3.push({
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

  projCode2.map(element => {
    return projCode3.push({
      text: element,
      value: element,
    })
  })

  custName2.map(element => {
    return custName3.push({
      text: element,
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
    // {
    //   title: 'Design Code',
    //   dataIndex: 'designCode',
    //   key: 'designCode',
    //   align: 'center',
    // },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Customer Name',
      key: 'customerName',
      dataIndex: 'customerName',
      filters: custName3,
      filteredValue: filtersinfo.customerName,
      onFilter: (value, record) => record?.customerName === value,
    },
    {
      title: 'Planned Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      filters: rfqdate3,
      filteredValue: filtersinfo.plannedStartDate,
      render: text => <a>{dateformatter(text)}</a>,
      onFilter: (value, record) => moment(record.plannedStartDate).isSame(moment(value), 'day'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      value: 'dueDate',
      render: text => <a>{dateformatter(text)}</a>,
      filters: duedate3,
      filteredValue: filtersinfo.dueDate,
      onFilter: (value, record) => moment(record.dueDate).isSame(moment(value), 'day'),
    },
    // {
    //   title: 'Actual Start Date',
    //   key: 'actualStartDate',
    //   dataIndex: 'actualStartDate',
    //   render: text => <a>{dateformatter(text)}</a>,
    //   filters: actlstrtdate3,
    //   filteredValue: filtersinfo.actualStartDate,
    //   onFilter: (value, record) => moment(record.actualStartDate).isSame(moment(value), 'day'),
    // },
    // {
    //   title: 'Actual End Date',
    //   key: 'actualEndDate',
    //   dataIndex: 'actualEndDate',
    //   value: 'actualEndDate',
    //   sorter: (a, b) => a.actualEndDate - b.actualEndDate,
    //   render: text => <a>{dateformatter(text)}</a>,
    // },
    {
      title: 'Status',
      key: 'hdrStatusDesc',
      dataIndex: 'hdrStatusDesc',
      filters: status3,
      filteredValue: filtersinfo.hdrStatusDesc,
      onFilter: (value, record) => record?.hdrStatusDesc === value,
    },
    {
      title: 'Task Plan',
      key: 'taskPlan',
      dataIndex: 'taskPlan',
      width: 120,
      className: 'right-align-cell',
    },
    {
      title: 'Task Act.',
      key: 'taskActual',
      dataIndex: 'taskActual',
      className: 'right-align-cell',
    },
    {
      title: 'Action',
      key: 'taskActual',
      dataIndex: 'action',
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
              fileName: `Design Details${currentDateTime}`,
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

export default DesignTable
