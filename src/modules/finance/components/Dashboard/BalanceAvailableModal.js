import React, { useState } from 'react'
import { Table, Button } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from '../../../../currentDateTime'
import {convertToCSV,downloadCSV} from './ExportToCsv'

const BalanceAvailable = ({ project }) => {
  // eslint-disable-next-line no-unused-vars
  const [filterData, setFilterData] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [projectData, setProjectData] = useState([])

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }


  const getUniqueFilters = (data, key) => {
  const seen = new Set()
  return data
    .map(item => item?.[key])
    .filter(val => val !== undefined && val !== null && !seen.has(val) && seen.add(val))
    .map(val => ({ text: val, value: val }))
}

  const projectNameFilter = getUniqueFilters(project, 'projName')
  const projectNoFilter = getUniqueFilters(project, 'projCode')
  const poCodeFilter = getUniqueFilters(project,'poCode')
  const vendorNameFilter = getUniqueFilters(project,'vendorName')
  const praCodeFilter = getUniqueFilters(project,'praCode')
  const statusFilter = getUniqueFilters(project,'status')


  const projectColumns = [
    {
      title: 'S.No',
      dataIndex: 'slNo',
      key: 'projectNo',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Project No​',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: projectNoFilter,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projName',
      key: 'projName',
      filters: projectNameFilter,
      onFilter: (value, record) => record?.projName === value,
    },
    {
      title: 'Vendor Name​',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendorNameFilter,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'PO No​',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: poCodeFilter,
      onFilter: (value, record) => record?.poCode === value,
    },
    {
      title: 'PO Date​',
      dataIndex: 'poDate',
      key: 'poDate',
    },
    {
      title: 'PRA No​',
      dataIndex: 'praCode',
      key: 'praCode',
      filters: praCodeFilter,
      onFilter: (value, record) => record?.praCode === value,
    },
    {
      title: 'PRA Date',
      dataIndex: 'praDate',
      key: 'praDate',
    },
    {
      title: 'PRA Amount',
      dataIndex: 'amountPayable',
      key: 'amountPayable',
      align:'right',
    },
    {
      title: 'Due On​',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Overdue Days​',
      dataIndex: 'overDue',
      key: 'overDue',
    },
    {
      title: 'PRA Status​',
      dataIndex: 'status',
      key: 'status',
      render: value => value || 'OPEN',
      filters: statusFilter,
      onFilter: (value, record) => record?.status === value,
    },
  ]


// const cleanupDataSource = dataSource => {


//   return dataSource.map((row, index) => ({
//     'S.No': index + 1,
//              'Project No':(row.projCode || '-'),
//     'Project Name': (row.projName),
//     'Vendor Name': (row.vendorName),
//     'PO No': (row.poCode),
//     'PO Date': (row.poDate),
//     'PRA No': (row.praCode),
//     'PRA Date': (row.praDate),
//     'PRA Amount': (row.amountPayable),
//     'Due On': (row.dueDate),
//     'Overdue Days': (row.overDue),
//     'PRA Status': (row.status || 'OPEN'),
//   }))
// }
  const cleanupDataSource = dataSource => {
    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          // Escape special characters (double quotes and commas)
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value
      }

      return {
    'S.No': escapeValue(row.sno),
    'Project No':escapeValue(row.projCode || '-'),
    'Project Name': escapeValue(row.projName),
    'Vendor Name': escapeValue(row.vendorName),
    'PO No': escapeValue(row.poCode),
    'PO Date': escapeValue(row.poDate),
    'PRA No': escapeValue(row.praCode),
    'PRA Date': escapeValue(row.praDate),
    'PRA Amount': escapeValue(row.amountPayable),
    'Due On': escapeValue(row.dueDate),
    'Overdue Days': escapeValue(row.overDue),
    'PRA Status': escapeValue(row.status || 'OPEN'), // Manually map and escape 'Action'
      }
    })
  }
const handleExportCSV = () => {
  const cleanedData = cleanupDataSource(project)
  const csvData = convertToCSV(cleanedData)
  downloadCSV(csvData, `Vendor_Payment_Staus_${currentDateTime}.csv`)
}

  return (
    <>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={() => handleExportCSV()}
        style={{ marginTop: '10px' }}
      >
        Export to CSV
      </Button>
      <div className="custom_antd_Table">
        <Table
          dataSource={project}
          columns={projectColumns}
          size="small"
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [projectData?.length]],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          scroll={{ y: 300 }}
          onChange={handleDataChange}
        />
      </div>
    </>
  )
}

export default BalanceAvailable
