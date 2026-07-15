import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { FileExcelOutlined } from '@ant-design/icons'
import { Card, Skeleton } from 'antd'
import { Table } from 'ant-table-extensions'

const GetDetailCard = ({ resp, isloading, tableLoading, fromDate, toDate }) => {
  const MenulistData = store.get('MenuListData')
  const [tableData, setTableData] = useState([])
  const [filtersInfo, setfilterinfo] = useState([])

  useEffect(() => {
    setTableData(resp)
  }, [resp])

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const projectCode1 = []
  const projectName1 = []
  const recordDate1 = []
  const activity1 = []
  const employeeCode1 = []
  const employeeName1 = []
  const hrs1 = []
  const rupees1 = []

  if (tableData) {
    tableData.map(h => {
      return projectCode1.push(h.projectCode)
    })
    tableData.map(h => {
      return projectName1.push(h.projectName)
    })
    tableData.map(h => {
      return recordDate1.push(h.recordDate)
    })
    tableData.map(h => {
      return activity1.push(h.activity)
    })
    tableData.map(h => {
      return employeeCode1.push(h.employeeCode)
    })
    tableData.map(h => {
      return employeeName1.push(h.employeeName)
    })
    tableData.map(h => {
      return hrs1.push(h.hrs)
    })
    tableData.map(h => {
      return rupees1.push(h.rupees)
    })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const recordDate2 = recordDate1.filter(distinct)
  const activity2 = activity1.filter(distinct)
  const employeeCode2 = employeeCode1.filter(distinct)
  const employeeName2 = employeeName1.filter(distinct)
  const hrs2 = hrs1.filter(distinct)
  const rupees2 = rupees1.filter(distinct)

  const projectCode3 = []
  const projectName3 = []
  const recordDate3 = []
  const activity3 = []
  const employeeCode3 = []
  const employeeName3 = []
  const hrs3 = []
  const rupees3 = []

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

  recordDate2.map(element => {
    return recordDate3.push({
      text: element ? moment(element).format('DD-MMM-YYYY') : '',
      value: element,
    })
  })

  activity2.map(element => {
    return activity3.push({
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
  hrs2.map(element => {
    return hrs3.push({
      text: element ? Number(element).toFixed(1) : '',
      value: element,
    })
  })
  rupees2.map(element => {
    return rupees3.push({
      text: element ? Number(element || 0).toFixed(2) : '',
      value: element,
    })
  })

  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      render: text => (text !== null ? text : ''),
      filters: projectCode3,
      filteredValue: filtersInfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      filters: projectName3,
      filteredValue: filtersInfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
      render: text => (text !== null ? text : ''),
    },
    {
      title: 'Date',
      dataIndex: 'recordDate',
      key: 'recordDate',
      filters: recordDate3,
      filteredValue: filtersInfo.recordDate,
      onFilter: (value, record) => record?.recordDate === value,
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      filters: activity3,
      filteredValue: filtersInfo.activity,
      onFilter: (value, record) => record?.activity === value,
      render: text => (text !== null ? text : ''),
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      filters: employeeCode3,
      filteredValue: filtersInfo?.employeeCode,
      onFilter: (value, record) => record?.employeeCode === value,
      // className: 'right-align-cell',
    },
    {
      title: 'Employee Name',
      key: 'employeeName',
      dataIndex: 'employeeName',
      filters: employeeName3,
      filteredValue: filtersInfo?.employeeName,
      onFilter: (value, record) => record?.employeeName === value,
      render: (text, record) => record.employeeName,
    },
    {
      title: 'Hours',
      key: 'hrs',
      align: 'right',
      dataIndex: 'hrs',
      filters: hrs3,
      filteredValue: filtersInfo?.hrs,
      onFilter: (value, record) => record?.hrs === value,
      render: text => <div style={{ textAlign: 'right' }}>{Number(text).toFixed(1)}</div>,
    },
    {
      title: `Cost ${MenulistData[0]?.currency}`,
      key: 'rupees',
      align: 'right',
      dataIndex: 'rupees',
      filters: rupees3,
      filteredValue: filtersInfo?.rupees,
      onFilter: (value, record) => record?.rupees === value,
      render: text => <div style={{ textAlign: 'right' }}>{Number(text || 0).toFixed(2)}</div>,
    },
  ]
  const title = `Timesheet Report Detail - ( ${moment(fromDate).format('DD-MMM-YYYY')} to ${moment(
    toDate,
  ).format('DD-MMM-YYYY')} )`

  return (
    <>
      <Card
        title={title}
        style={{ display: isloading ? 'block' : 'none' }}
        // headStyle={{ backgroundColor: '#001F3E', color: 'white' }}
      >
        {tableLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            exportableProps={{
              fileName: `Timesheet Report ${moment(fromDate).format('DD-MMM-YYYY')} to ${moment(
                toDate,
              ).format('DD-MMM-YYYY')}`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            onChange={handleChange}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [tableData?.length]],
              defaultPageSize: 10,
            }}
            scroll={{ y: 500 }}
            bordered
          />
        )}
      </Card>
    </>
  )
}

export default GetDetailCard
