import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const POBudgetChart = ({ data }) => {
  const [chartData, setChartData] = useState({ series: [], options: {} })

  const formatValue = val => {
    const num = Number(val) || 0
    const truncateToTwo = value => Math.floor(value * 100) / 100
    if (Math.abs(num) >= 10000000) {
      const crores = num / 10000000
      return `₹ ${crores < 1 ? crores.toFixed(2) : truncateToTwo(crores)} Cr`
    }
    if (Math.abs(num) >= 100000) {
      const lakhs = num / 100000
      return `₹ ${lakhs < 1 ? lakhs.toFixed(2) : truncateToTwo(lakhs)} L`
    }
    return `₹ ${Math.round(num).toLocaleString('en-IN')}`
  }

  // ✅ Ensure bars always have a minimum visible height
  const adjustForBarHeight = (val, minAbs = 1000) => {
    if (val === 0) return 0
    if (Math.abs(val) < minAbs) {
      return val < 0 ? -minAbs : minAbs
    }
    return val
  }

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData({ series: [], options: {} })
    }
    const grouped = {}
    data.forEach(item => {
      const code = item.projCode || '-'
      const projBudget = Number(item.projcBudget || 0)
      const actualSpent = Number(item.actualVal || 0) - Number(item.debitValue || 0)
      const balance = projBudget - actualSpent
      if (!grouped[code]) {
        grouped[code] = { projBudget: 0, actualSpent: 0, balance: 0 }
      }
      grouped[code].projBudget += projBudget
      grouped[code].actualSpent += actualSpent
      grouped[code].balance += balance
    })

    const xLabels = Object.keys(grouped)
    const projBudgetValues = xLabels.map(code =>
      adjustForBarHeight(grouped[code].projBudget)
    )
    const actualSpentValues = xLabels.map(code =>
      adjustForBarHeight(grouped[code].actualSpent)
    )
    const balanceValues = xLabels.map(code =>
      adjustForBarHeight(grouped[code].balance)
    )

    const allValues = projBudgetValues.concat(actualSpentValues).concat(balanceValues)
    let maxY = Math.max(...allValues) || 1000
    let minY = Math.min(...allValues) || 0
    if (maxY > 0) maxY *= 1.3
    if (minY < 0) minY *= 1.3

    setChartData({
      series: [
        { name: 'Project Budget', type: 'column', data: projBudgetValues },
        { name: 'Overall Project Spent', type: 'column', data: actualSpentValues },
        { name: 'Balance', type: 'column', data: balanceValues },
      ],
      options: {
        chart: {
          type: 'bar',
          stacked: false,
          toolbar: { show: true },
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
          },
        },
        dataLabels: {
          enabled: true,
          formatter: val => formatValue(val), // ✅ still show real formatted value
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
            colors: ['#000'],
          },
          background: {
            enabled: true,
            foreColor: '#fff',
            borderRadius: 2,
            padding: 2,
            opacity: 0.9,
          },
        },
        colors: ['#007bff', '#dc3545', '#28a745'],
        xaxis: {
          categories: xLabels,
          title: { text: 'Project Code' },
          labels: { rotate: -45, style: { fontSize: '12px' } },
        },
        yaxis: {
          min: minY,
          max: maxY,
          title: { text: 'Amount (₹)' },
          labels: { formatter: val => formatValue(val) },
        },
        tooltip: {
          shared: false,
          custom: ({ seriesIndex, dataPointIndex }) => {
            const proj = xLabels[dataPointIndex]
            const realValue = [
              grouped[proj].projBudget,
              grouped[proj].actualSpent,
              grouped[proj].balance,
            ][seriesIndex]
            const value = formatValue(realValue) // ✅ tooltip shows true value
            const label = ['Project Budget', 'Overall Project Spent', 'Balance'][seriesIndex]
            return `
              <div style="padding: 6px 10px">
                <b>Project:</b> ${proj}<br/>
                <b>${label}:</b> ${value}
              </div>
            `
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
        },
      },
    })
  }, [data])

  return (
    <div className="chart_card" style={{ width: '800px', overflowX: 'auto' }}>
      <div style={{ width: `${chartData.series[0]?.data.length * 300}px`, minWidth: '100%' }}>
        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
      </div>
    </div>
  )
}

export default POBudgetChart
