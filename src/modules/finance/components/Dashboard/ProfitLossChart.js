import React from 'react'
import Chart from 'react-apexcharts'

const ProfitLossChart = ({ data = [] }) => {
  const PLdata = Array.isArray(data) ? data : []
  const projectCodes = PLdata.map(item => item?.projCode || 'NA')

  const profitLossSeries = []
  const barColors = []

  // Auto format into ₹, L, or Cr
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

  PLdata.forEach(item => {
    const orderValue = Number(item?.orderValue || 0)
    const totalSpends = Number(item?.actualVal || 0) - Number(item?.debitValue || 0)
    const profitLoss = orderValue - totalSpends

    profitLossSeries.push(profitLoss)
    barColors.push(profitLoss >= 0 ? '#00C853' : '#D50000') // green for profit, red for loss
  })

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
    colors: barColors.length ? barColors : ['#BDBDBD'], // fallback grey
    dataLabels: {
      enabled: true,
      formatter: val => formatValue(val),
      style: { colors: ['#fff'] },
    },
    xaxis: {
      categories: projectCodes.length ? projectCodes : ['No Data'],
      title: { text: 'Project Code' },
    },
    yaxis: {
      title: { text: 'Profit / Loss' },
      labels: { formatter: val => formatValue(val) },
    },
    tooltip: {
      y: { formatter: val => formatValue(val) },
    },
    legend: { show: false },
  }

  const chartSeries = [
    {
      name: 'Profit / Loss',
      data: profitLossSeries.length ? profitLossSeries : [0],
    },
  ]

  return (
    <div className="chart_card">
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  )
}

export default ProfitLossChart
