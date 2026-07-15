/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import { Table, Button } from 'antd'

import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from '../../../../currentDateTime'
import { convertToCSV, downloadCSV } from './ExportToCsv'

const ProjectDetailsModal = ({ project, unit }) => {
  // eslint-disable-next-line no-unused-vars
  const [filterData, setFilterData] = useState([])

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

  const formatValue = val => {
    const num = Number(val) || 0

    if (num === 0) {
      return '0'
    }

    // Helper to truncate without rounding
    const truncateToTwo = value => Math.floor(value * 100) / 100

    if (unit === 'crores') {
      const crores = num / 10000000
      return `${crores < 1 ? crores.toFixed(2) : truncateToTwo(crores)} Cr`
    }

    if (unit === 'lakhs') {
      const lakhs = num / 100000
      return `${lakhs < 1 ? lakhs.toFixed(2) : truncateToTwo(lakhs)} L`
    }

    return `${Math.round(num).toLocaleString('en-IN')}`
  }
      
  const formatWithRupee = value => `₹ ${formatValue(value)}`


  const projectNameFilter = getUniqueFilters(project, 'projName')
  const projectNoFilter = getUniqueFilters(project, 'projCode')
  const customerNameFilter = getUniqueFilters(project, 'custName')
  const stagesFilter = getUniqueFilters(project, 'stages')

  const projectColumns = [
    {
      title: 'S.No',
      dataIndex: 'slNo',
      key: 'slNo',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: getUniqueFilters(projectNoFilter),
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
      title: 'Customer Name',
      dataIndex: 'custName',
      key: 'custName',
      filters: customerNameFilter,
      onFilter: (value, record) => record?.custName === value,
    },
    {
      title: 'Project Stage',
      dataIndex: 'stage',
      key: 'stage',
      filters: stagesFilter,
      onFilter: (value, record) => record?.stage === value,
    },
    {
      title: 'Project Budget',
      dataIndex: 'budgetCost',
      key: 'budgetCost',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Contribution',
      dataIndex: 'contrib',
      key: 'contrib',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Total Project Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Received',
      dataIndex: 'received',
      key: 'received',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Outstanding',
      dataIndex: 'outstanding',
      key: 'outstanding',
      align: 'right',
      // onFilter: (value, record) => record?.received === value,
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Balance Receivable',
      dataIndex: 'receivable',
      key: 'receivable',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
  ]

  const cleanupDataSource = dataSource => {
    return dataSource.map((row, index) => {
      return {
        'S.No': index + 1,
        'Project No': row.projCode || '-',
        'Project Name': row.projName,
        'Customer Name': row.custName,
        'Project Stage': row.stage,
        'Material Cost': row.budgetCost,
        Contribution: row.contrib,
        'Total Project Value': row.orderValue,
        Received: row.received,
        outstanding: row.ourstanding,
        Receivable: row.receivable,
      }
    })
  }

  const handleExportCSV = () => {
    const cleanedData = cleanupDataSource(project)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Project_Details_${currentDateTime}.csv`)
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
            pageSizeOptions: ['10', '20', '30', '50', [project?.length]],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          scroll={{ y: 300 }}
          onChange={handleDataChange}
          summary={() => {
            let totalBudgetCost = 0
            let totalContribution = 0
            let totalOrderValue = 0
            let totalReceived = 0
            let totalOutstanding = 0
            let totalReceivable = 0

            project?.forEach(item => {
              totalBudgetCost += Number(item.budgetCost) || 0
              totalContribution += Number(item.contrib) || 0
              totalOrderValue += Number(item.orderValue) || 0
              totalReceived += Number(item.received) || 0
              totalOutstanding += Number(item.outstanding) || 0
              totalReceivable += Number(item.receivable) || 0
            })
            return (
              <Table.Summary.Row style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell />
                <Table.Summary.Cell />
                <Table.Summary.Cell />
                <Table.Summary.Cell align="right">
                  {formatWithRupee(totalBudgetCost)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatWithRupee(totalContribution)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatWithRupee(totalOrderValue)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">{formatWithRupee(totalReceived)}</Table.Summary.Cell>
                <Table.Summary.Cell align="right">{formatWithRupee(totalOutstanding)}</Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatWithRupee(totalReceivable)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </div>
    </>
  )
}

export default ProjectDetailsModal
