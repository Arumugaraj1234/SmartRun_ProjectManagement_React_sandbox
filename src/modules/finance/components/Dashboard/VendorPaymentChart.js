import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const VendorPaymentChart = ({ data }) => {
  const [chartData, setChartData] = useState({ series: [], options: {} })

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData({ series: [], options: {} }) 
    }
    const grouped = {}

    data.forEach(item => {
      const code = item.projCode || 'N/A'
      const payable = Number(item.amountPayable) || 0
      const due = Number(item.amountDue) || 0

      if (!grouped[code]) {
        grouped[code] = { totalPayable: 0, totalDue: 0 }
      }

      grouped[code].totalPayable += payable
      grouped[code].totalDue += due
    })

    const xLabels = Object.keys(grouped)
    const payableAmounts = xLabels.map(code => grouped[code].totalPayable)
    const dueAmounts = xLabels.map(code => grouped[code].totalDue)
    const duePercents = xLabels.map(code => {
      const { totalPayable, totalDue } = grouped[code]
      return totalPayable === 0 ? 0 : (totalDue / totalPayable) * 100
    })

    setChartData({
      series: [
        {
          name: 'Payable (%)',
          type: 'column',
          data: xLabels.map(code => {
            const {totalPayable} = grouped[code]
            return totalPayable ? 100 : 0
          }),
        },
        {
          name: 'Due (%)',
          type: 'line',
          data: xLabels.map(code => {
            const { totalPayable, totalDue } = grouped[code]
            return totalPayable ? (totalDue / totalPayable) * 100 : 0
          }),
        },
      ],
      options: {
        chart: {
          height: 300,
          type: 'line',
          stacked: false,
          toolbar: {
            show: true,
          },
        },
        stroke: {
          width: [0, 3],
          curve: 'smooth',
        },
        markers: {
          size: 5,
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
          },
        },
        colors: ['#00B8D9', '#FF4560'],
        xaxis: {
          categories: xLabels,
          title: {
            text: 'Project Code',
          },
        },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,
          title: {
            text: 'Percentage (%)',
          },
          labels: {
            formatter: value => `${value.toFixed(0)}%`,
          },
        },
        tooltip: {
          shared: true,
          followCursor: true,
          custom: ({ dataPointIndex }) => {
            const proj = xLabels[dataPointIndex]
            const payable = payableAmounts[dataPointIndex].toLocaleString('en-IN')
            const due = dueAmounts[dataPointIndex].toLocaleString('en-IN')
            const percent = duePercents[dataPointIndex].toFixed(1)
            return `
          <div style="padding: 6px 10px">
            <b>Project:</b> ${proj}<br/>
            <b>Amount Payable:</b> ₹${payable}<br/>
            <b>Amount Due:</b> ₹${due}<br/>
            <b>Due %:</b> ${percent}%
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
    <div className="chart_card">
      <Chart options={chartData.options} series={chartData.series} type="line" height={320} />
    </div>
  )
}

export default VendorPaymentChart
