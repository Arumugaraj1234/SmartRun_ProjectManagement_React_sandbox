import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Chart from 'react-apexcharts'
import { RiseOutlined } from '@ant-design/icons'
import './style.scss'

const LeadChart = ({ Datas }) => {
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
        align: 'center',
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return seriesIndex === 0 ? `${(val / 1e7).toFixed(1)}C` : `${val}`
          }
          return seriesIndex === 2 ? `${(val / 1e7).toFixed(1)}C` : `${val}`
        },
        style: {
          fontSize: '12px',
        },
        background: {
          enabled: true,
        },
        dropShadow: {
          enabled: false,
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
        name: 'Lead Value',
        type: 'column',
        data: [],
        color: '#367a30',
      },
      {
        name: 'Lead Count',
        type: 'line',
        data: [],
        color: '#FF5733',
      },
    ],
  })

  useEffect(() => {
    if (Datas && Datas.leadList) {
      const categoriess = Datas?.leadList?.map(item => item.monthYr)
      const leadValues = Datas?.leadList?.map(item => parseFloat(item.val))
      const seCounts = Datas?.leadList?.map(item => parseInt(item.seCount, 10))
      const enquiryCounts = Datas?.leadList?.map(item => parseInt(item.enqCount, 10))
      const enquiryvalue = Datas?.leadList?.map(item => parseFloat(item.enqValue, 10))
      const totalLeadValue = leadValues.reduce((acc, val) => acc + val, 0)
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
            text: `Lead Rs.${(totalLeadValue / 1e7).toFixed(2)}C`,
            align: 'right',
            style: {
              fontWeight: '700',
              fontFamily: 'Arial, sans-serif',
              color: 'grey',
            },
          },
          tooltip: {
            shared: true,
            y: {
              formatter: (val, { seriesIndex, dataPointIndex }) => {
                if (seriesIndex === 0) {
                  return ` Rs.${(leadValues[dataPointIndex] / 1e7).toFixed(
                    1,
                  )}C,  <span style="font-weight: lighter;">Enquiry Value: </span> Rs.${(
                    enquiryvalue[dataPointIndex] / 1e7
                  ).toFixed(1)}C`
                }
                if (seriesIndex === 1) {
                  return ` ${seCounts[dataPointIndex]}, <span style="font-weight: lighter;"> Enquiry Count: </span> ${enquiryCounts[dataPointIndex]}`
                }
                return ''
              },
            },
            x: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'Lead Value',
            type: 'column',
            data: leadValues,
          },
          {
            name: 'Lead Count',
            type: 'line',
            data: seCounts,
          },
        ],
      })
    }
  }, [Datas])

  return (
    <div className="chart_card">
      <RiseOutlined className="widget_icons_1" />
      <Chart options={chartData.options} series={chartData.series} type="line" height={270} />
    </div>
  )
}

export default LeadChart
