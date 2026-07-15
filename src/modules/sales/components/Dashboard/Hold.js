import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'react-apexcharts'
import { PauseCircleOutlined } from '@ant-design/icons'
import './style.scss'

const HoldChart = ({ Datas }) => {
  const [chartData, setChartData] = useState({
    options: {
      xaxis: {
        categories: [],
        axisBorder: { show: true },
        axisTicks: { show: false },
        labels: {
          show: true,
          formatter(value) {
            return moment(value, 'YYYY-MM').format('MMM YYYY')
          },
        },
      },
      yaxis: [
        {
          show: false,
          labels: {
            formatter: val => `Rs.${(val / 1e7).toFixed(1)}C`,
          },
        },
        {
          opposite: true,
          show: false,
        },
      ],
      grid: { show: false },
      chart: {
        sparkline: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      title: {
        text: '',
        align: 'right',
      },
      tooltip: {
        shared: true,
        y: {
          formatter: (val, { seriesIndex }) => {
            if (seriesIndex === 0) {
              return `Rs.${(val / 1e7).toFixed(1)}C`
            }
            if (seriesIndex === 1) {
              return `${val}`
            }
            return val
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex }) => {
          return seriesIndex === 0 ? `${(val / 1e7).toFixed(1)}C` : `${val}`
        },
        style: {
          fontSize: '12px',
        },
      },
      stroke: {
        curve: 'smooth',
        width: [0, 2, 2],
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          columnWidth: '50%',
        },
      },
    },
    series: [
      {
        name: 'Hold Value',
        type: 'column',
        data: [],
        color: '#ebdc0e',
      },
      {
        name: 'Order Count',
        type: 'line',
        data: [],
        color: '#367a30',
      },
    ],
  })

  useEffect(() => {
    if (Datas && Datas.holdList) {
      const categoriess = Datas.holdList.map(item => item.monthYr)
      const datas = Datas.holdList.map(item => parseFloat(item.val))
      const seCounts = Datas.holdList.map(item => parseInt(item.seCount, 10))
      const totalHoldValue = datas.reduce((acc, val) => acc + val, 0)
      const showXAxis = categoriess.length > 0
      setChartData({
        options: {
          ...chartData.options,
          xaxis: {
            ...chartData.options.xaxis,
            categories: categoriess,
            labels: {
              ...chartData.options.xaxis.labels,
              show: showXAxis,
            },
          },
          title: {
            text: `Hold Rs.${(totalHoldValue / 1e7).toFixed(2)}C`,
            align: 'right',
            style: {
              fontWeight: '700',
              fontFamily: 'Arial, sans-serif',
              color: 'grey',
            },
          },
        },
        series: [
          {
            name: 'Hold Value',
            data: datas,
            color: '#ebdc0e',
          },
          {
            name: 'Order Count',
            type: 'line',
            data: seCounts,
          },
        ],
      })
    }
  }, [Datas])

  return (
    <div className="chart_card">
      {/* <RollbackOutlined /> */}
      <PauseCircleOutlined className="widget_icons_4" />
      <Chart options={chartData.options} series={chartData.series} type="line" height={270} />
    </div>
  )
}

export default HoldChart
