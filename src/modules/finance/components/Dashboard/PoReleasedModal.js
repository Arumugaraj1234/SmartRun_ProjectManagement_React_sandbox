import React, { useState } from 'react'
import { Table, Button } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from '../../../../currentDateTime'
import { convertToCSV, downloadCSV } from './ExportToCsv'

const PoReleasedModal = ({ project, unit }) => {
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

  const projectNameFilter = getUniqueFilters(project, 'projName')
  const projectNoFilter = getUniqueFilters(project, 'projCode')
  const customerNameFilter = getUniqueFilters(project, 'custName')
  const stagesFilter = getUniqueFilters(project, 'stages')

  const projectColumns = [
    {
      title: 'S.No',
      key: 'sNo',
      render: (_, __, index) => index + 1,
      fixed: 'left',
    },
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projCode',
      rowSpan: 2,
      filters: projectNoFilter,
      fixed: 'left',
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projName',
      key: 'projName',
      rowSpan: 2,
      filters: projectNameFilter,
      onFilter: (value, record) => record?.projName === value,
    },
    {
      title: 'Customer Name',
      dataIndex: 'custName',
      key: 'custName',
      rowSpan: 2,
      filters: customerNameFilter,
      onFilter: (value, record) => record?.custName === value,
    },
    {
      title: 'Project Stage',
      dataIndex: 'stage',
      key: 'stage',
      rowSpan: 2,
      filters: stagesFilter,
      onFilter: (value, record) => record?.stage === value,
    },

    {
      title: 'Order Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Project Budget',
      dataIndex: 'projcBudget',
      key: 'projcBudget',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Materials',
      children: [
        {
          title: 'Budget cost',
          dataIndex: 'materialBudCons',
          key: 'materialBudCons',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'PO Released so far',
          dataIndex: 'materialRelesVal',
          key: 'materialRelesVal',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
      ],
    },
    {
      title: 'Service',
      children: [
        {
          title: 'Budget cost',
          dataIndex: 'serviceBudCons',
          key: 'serviceBudCons',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
        {
          title: 'PO Released so far',
          dataIndex: 'serviceRelesVal',
          key: 'serviceRelesVal',
          align: 'right',
          render: value => (value ? formatValue(value) : 0),
        },
      ],
    },
    {
      title: 'Total Budget Consumed',
      dataIndex: 'totalBudgetConsum',
      key: 'totalBudgetConsum',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Total PO Released so far',
      dataIndex: 'totalPoreles',
      key: 'totalPoreles',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Actual Cost',
      dataIndex: 'scmAllocatedVal',
      key: 'scmAllocatedVal',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Employee Cost',
      dataIndex: 'empCost',
      key: 'empCost',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Material Transfer Cost',
      dataIndex: 'materialTransferCost',
      key: 'materialTransferCost',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Cash Voucher',
      dataIndex: 'cashVochar',
      key: 'cashVochar',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    {
      title: 'Others In Tally',
      dataIndex: 'otherInTally',
      key: 'otherInTally',
      align: 'right',
      render: value => (value ? formatValue(value) : '0'),
    },
    // {
    //   title: 'Budget consumed so far',
    //   dataIndex: 'budgetConsumed',
    //   key: 'budgetConsumed',
    //   align: 'right',
    //   render: (_, record) => {
    //     const budgetVal = Number(record?.budgetVal || 0)
    //     const poReleasedVal = Number(record?.poReleasedVal || 0)
    //     const manPowerCost = Number(record?.manPowerCost || 0)
    //     const transferCost = Number(record?.transferCost || 0)
    //     const cashVouchar = Number(record?.cashVouchar || 0)
    //     const othersInTally = Number(record?.othersInTally || 0)

    //     const consumed =
    //       budgetVal - (poReleasedVal + manPowerCost + transferCost + cashVouchar + othersInTally)

    //     return formatValue(consumed)
    //   },
    // },
    {
      title: 'Debit Value',
      dataIndex: 'debitValue',
      key: 'debitValue',
      align: 'right',
      render: value => (value ? formatValue(value) : 0),
    },
    {
      title: 'Overall Project Spent',
      dataIndex: 'actualVal',
      key: 'actualVal',
      align: 'right',
      render: (_, record) =>
        formatValue(Number(record.actualVal || 0) - Number(record.debitValue || 0)),
    },
    {
      title: 'Balance Available',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (_, record) => {
        const balanceVal = (Number(record.projcBudget) || 0) - (Number(record.actualVal) || 0)
        return formatValue(balanceVal)
      },
    },
    {
      title: 'Profit & Loss',
      key: 'profitAndLoss',
      align: 'right',
      render: (_, record) => {
        const profit =
          Number(record.orderValue || 0) - Number(record.actualVal - record.debitValue || 0)
        const color = profit >= 0 ? 'green' : 'red'
        return <span style={{ color }}>{formatValue(profit)}</span>
      },
    },
  ]

  const cleanupDataSource = dataSource => {
    return dataSource.map((row, index) => {
      const projcBudget = Number(row.projcBudget || 0)
      const materialBudCons = Number(row.materialBudCons || 0)
      const materialRelesVal = Number(row.materialRelesVal || 0)
      const serviceBudCons = Number(row.serviceBudCons || 0)
      const serviceRelesVal = Number(row.serviceRelesVal || 0)
      const totalBudgetConsum = Number(row.totalBudgetConsum || 0)
      const totalPoreles = Number(row.totalPoreles || 0)
      const scmAllocatedVal = Number(row.scmAllocatedVal || 0)
      const empCost = Number(row.empCost || 0)
      const materialTransferCost = Number(row.materialTransferCost || 0)
      const cashVochar = Number(row.cashVochar || 0)
      const otherInTally = Number(row.otherInTally || 0)
      const actualVal = Number(row.actualVal || 0) - Number(row.debitValue || 0)
      const debitValue = Number(row.debitValue || 0)
      const balanceAvailable = projcBudget - actualVal
      const profitLoss = Number(row.orderValue || 0) - actualVal

      return {
        'S.No': index + 1,
        'Project No': row.projCode || '-',
        'Project Name': row.projName || '-',
        'Customer Name': row.custName || '-',
        'Project Stage': row.stage || '-',
        'Order Value': Number(row.orderValue || 0),
        'Project Budget': projcBudget,
        'Materials - Budget Cost': materialBudCons,
        'Materials - PO Released so far': materialRelesVal,
        'Service - Budget Cost': serviceBudCons,
        'Service - PO Released so far': serviceRelesVal,
        'Total Budget Consumed': totalBudgetConsum,
        'Total PO Released so far': totalPoreles,
        'Actual Cost': scmAllocatedVal,
        'Employee Cost': empCost,
        'Material Transfer Cost': materialTransferCost,
        'Cash Voucher': cashVochar,
        'Others In Tally': otherInTally,
        'Debit Value': debitValue,
        'Overall Project Spent': actualVal,
        'Balance Available': balanceAvailable,
        'Profit & Loss': profitLoss,
      }
    })
  }

  const handleExportCSV = () => {
    const cleanedData = cleanupDataSource(project)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `PO_Released_So_Far_${currentDateTime}.csv`)
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
          scroll={{ y: 300, x: 2000 }}
          style={{ width: '100%', overflowX: 'auto' }}
          onChange={handleDataChange}
          summary={() => {
            let totalOrderValue = 0
            let totalProjBudget = 0
            let totalMaterialBudCons = 0
            let totalMaterialRelesVal = 0
            let totalServiceBudCons = 0
            let totalServiceRelesVal = 0
            let totalBudgetConsum = 0
            let totalPoreles = 0
            let totalScmAllocatedVal = 0
            let totalEmpCost = 0
            let totalMaterialTransferCost = 0
            let totalCashVochar = 0
            let totalOtherInTally = 0
            let totalDebitVal = 0
            let totalActualVal = 0
            let totalBalanceAvailable = 0
            let totalProfitLoss = 0

            project.forEach(item => {
              totalOrderValue += Number(item.orderValue) || 0
              totalProjBudget += Number(item.projcBudget) || 0
              totalMaterialBudCons += Number(item.materialBudCons) || 0
              totalMaterialRelesVal += Number(item.materialRelesVal) || 0
              totalServiceBudCons += Number(item.serviceBudCons) || 0
              totalServiceRelesVal += Number(item.serviceRelesVal) || 0
              totalBudgetConsum += Number(item.totalBudgetConsum) || 0
              totalPoreles += Number(item.totalPoreles) || 0
              totalScmAllocatedVal += Number(item.scmAllocatedVal) || 0
              totalEmpCost += Number(item.empCost) || 0
              totalMaterialTransferCost += Number(item.materialTransferCost) || 0
              totalCashVochar += Number(item.cashVochar) || 0
              totalDebitVal += Number(item.debitValue) || 0
              totalOtherInTally += Number(item.otherInTally) || 0
              const spends = (Number(item.actualVal) || 0) - (Number(item.debitValue) || 0)
              totalActualVal += spends

              const balanceVal = (Number(item.projcBudget) || 0) - (Number(item.actualVal) || 0)
              totalBalanceAvailable += balanceVal

              const profit =
                (Number(item.orderValue) || 0) -
                (Number(item.actualVal) - Number(item.debitValue) || 0)
              totalProfitLoss += profit
            })

            const formatCurrency = value => `₹${formatValue(value)}`

            return (
              <Table.Summary.Row style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
                <Table.Summary.Cell index={0} colSpan={5}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalOrderValue)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalProjBudget)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalMaterialBudCons)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalMaterialRelesVal)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalServiceBudCons)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalServiceRelesVal)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalBudgetConsum)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalPoreles)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalScmAllocatedVal)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalEmpCost)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalMaterialTransferCost)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalCashVochar)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalOtherInTally)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalDebitVal)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalActualVal)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right">
                  {formatCurrency(totalBalanceAvailable)}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  align="right"
                  style={{ color: totalProfitLoss >= 0 ? 'green' : 'red' }}
                >
                  {formatCurrency(totalProfitLoss)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </div>
    </>
  )
}

export default PoReleasedModal
