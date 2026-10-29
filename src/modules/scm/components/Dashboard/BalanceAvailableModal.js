import React, { useState } from 'react'
import moment from 'moment'
import { Table, Button } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from '../../../../currentDateTime'
import { convertToCSV, downloadCSV } from './ExportToCsv'

const BalanceAvailable = ({ project }) => {
  // eslint-disable-next-line no-unused-vars
  const [filterData, setFilterData] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [projectData, setProjectData] = useState([])

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

  // PRA amounts are shown rounded to the nearest rupee (100.49 -> 100, 100.56 -> 101), no paise
  const roundAmt = value =>
    value === null || value === undefined || value === '' ? value : Math.round(Number(value))
  const fmtDate = value => (value ? moment(value).format('DD-MMM-YYYY') : '-')
  // Every column (except S.No) filters on the value as shown in the cell, so rounded amounts,
  // formatted dates and '-'/'OPEN' placeholders match what the user sees
  const columnFilter = (key, display = value => value) => {
    const shown = record => String(display(record?.[key]) ?? '-')
    const seen = new Set()
    return {
      filters: (project || [])
        .map(shown)
        .filter(val => !seen.has(val) && seen.add(val))
        .map(val => ({ text: val, value: val })),
      filterSearch: true,
      onFilter: (value, record) => shown(record) === value,
    }
  }

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
      ...columnFilter('projCode'),
    },
    {
      title: 'Project Name',
      dataIndex: 'projName',
      key: 'projName',
      ...columnFilter('projName'),
    },
    {
      title: 'Vendor Name​',
      dataIndex: 'vendorName',
      key: 'vendorName',
      ...columnFilter('vendorName'),
    },
    {
      title: 'PO No​',
      dataIndex: 'poCode',
      key: 'poCode',
      ...columnFilter('poCode'),
    },
    {
      title: 'PO Date​',
      dataIndex: 'poDate',
      key: 'poDate',
      ...columnFilter('poDate', fmtDate),
      render: value => (value ? moment(value).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'PRA No​',
      dataIndex: 'praCode',
      key: 'praCode',
      ...columnFilter('praCode'),
    },
    {
      title: 'PRA Date',
      dataIndex: 'praDate',
      key: 'praDate',
      ...columnFilter('praDate', fmtDate),
      render: value => (value ? moment(value).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Payment Term',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      ...columnFilter('paymentTerms', value => value || '-'),
      render: value => value || '-',
    },
    {
      title: 'PRA Amount',
      dataIndex: 'amountPayable',
      key: 'amountPayable',
      ...columnFilter('amountPayable', roundAmt),
      align: 'right',
      render: value => roundAmt(value),
    },
    {
      title: 'PRA Vendor Payment Due',
      dataIndex: 'amountDue',
      key: 'amountDue',
      ...columnFilter('amountDue', value => roundAmt(value) || '-'),
      align: 'right',
      render: value => roundAmt(value) || '-',
    },
    {
      title: 'Vendor Invoice Number',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      ...columnFilter('invoiceNo', value => value || '-'),
      render: value => value || '-',
    },
    {
      title: 'Vendor Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      ...columnFilter('invoiceDate', fmtDate),
      render: value => (value ? moment(value).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Due On​',
      dataIndex: 'dueDate',
      key: 'dueDate',
      ...columnFilter('dueDate', fmtDate),
      render: value => (value ? moment(value).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Overdue Days​',
      dataIndex: 'overDue',
      key: 'overDue',
      ...columnFilter('overDue'),
    },
    {
      title: 'PRA Status​',
      dataIndex: 'status',
      key: 'status',
      ...columnFilter('status', value => value || 'OPEN'),
      render: value => value || 'OPEN',
    },
  ]

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
        'S.No': escapeValue(row.sno || '-'),
        'Project No': escapeValue(row.projCode || '-'),
        'Project Name': escapeValue(row.projName),
        'Vendor Name': escapeValue(row.vendorName),
        'PO No': escapeValue(row.poCode),
        'PO Date': escapeValue(row.poDate),
        'PRA No': escapeValue(row.praCode),
        'PRA Date': escapeValue(row.praDate),
        'Payment Term': escapeValue(row.paymentTerms || '-'),
        'PRA Amount': escapeValue(roundAmt(row.amountPayable)),
        'PRA Vendor Payment Due': escapeValue(roundAmt(row.amountDue) || '-'),
        'Vendor Invoice Number': escapeValue(row.invoiceNo || '-'),
        'Vendor Invoice Date': escapeValue(row.invoiceDate || '-'),
        'Due On': escapeValue(row.dueDate),
        'Overdue Days': escapeValue(row.overDue),
        'PRA Status': escapeValue(row.status || 'OPEN'),
      }
    })
  }

  // const cleanupDataSource = dataSource => {
  //    return dataSource.map(row, index => {

  //     const escapeValue = value => {
  //         if (
  //           typeof value === 'string' &&
  //           (value.includes(',') || value.includes('\n') || value.includes('"'))
  //         ) {
  //           // Escape special characters (double quotes and commas)
  //           return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
  //         }
  //         return value
  //       }

  //   return {
  //     'S.No': index + 1,
  //     'Project No':escapeValue(row.projCode || '-'),
  //     'Project Name': escapeValue(row.projName),
  //     'Vendor Name': escapeValue(row.vendorName),
  //     'PO No': escapeValue(row.poCode),
  //     'PO Date': escapeValue(row.poDate),
  //     'PRA No': escapeValue(row.praCode),
  //     'PRA Date': escapeValue(row.praDate),
  //     'PRA Amount': escapeValue(row.amountPayable),
  //     'Due On': escapeValue(row.dueDate),
  //     'Overdue Days': escapeValue(row.overDue),
  //     'PRA Status': escapeValue(row.status || 'OPEN'),
  //   }
  //   })
  // }
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
