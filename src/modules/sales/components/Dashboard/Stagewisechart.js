import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const Stagewisechart = ({ Datas }) => {
  const emptyChartData = {
    series: [
      {
        name: 'PO Value',
        type: 'column',
        data: [],
      },
      {
        name: 'Enquiry Count',
        type: 'line',
        data: [],
        yAxisIndex: 1,
      },
    ],
    chart: {
      height: 220,
      type: 'line',
      toolbar: {
        tools: {
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: false,
          zoom: false,
          selection: false,
          download: true,
          position: 'top-left',
        },
      },
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: 'Stagewise Order Details',
      align: 'left',
      style: {
        fontWeight: '700',
        fontFamily: 'Arial, sans-serif',
        color: 'grey',
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: [],
    grid: {
      show: false,
    },
    xaxis: {
      type: 'category',
      labels: {
        formatter: value => {
          // Add custom tooltip to x-axis labels using the title attribute
          return value
        },
        useHTML: true,
      },
    },
    yaxis: [
      {
        title: {
          text: 'PO Value',
        },
        labels: {
          formatter: value => {
            return `${(value / 1e7).toFixed(1)}C`
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Enquiry Count',
        },
        labels: {
          formatter: value => {
            return value.toFixed(0)
          },
        },
      },
    ],
    tooltip: {
      shared: false,
      x: {
        formatter(value, { dataPointIndex }) {
          return fullDescriptions[dataPointIndex] // Return full description
        },
      },
    },
  }

  const [chartData5, setChartData5] = useState(emptyChartData)
  const [fullDescriptions, setFullDescriptions] = useState([])

  useEffect(() => {
    if (Datas && Datas.length > 0) {
      const values = Datas.map(data => parseFloat(data.val))
      const seCounts = Datas.map(data => parseInt(data.seCount, 10))

      const getAbbreviations = descriptions => {
        return descriptions.map(description => {
          return description
            .split(' ')
            .map(word => {
              if (word.length < 3) {
                return word
              }
              return word[0]
            })
            .join('')
        })
      }

      const descriptions = Datas.map(data => data.description)
      const abbreviatedDescriptions = getAbbreviations(descriptions)

      setFullDescriptions(descriptions)

      setChartData5({
        series: [
          {
            name: 'PO Value',
            type: 'column',
            data: values,
          },
          {
            name: 'Enquiry Count',
            type: 'line',
            data: seCounts,
            yAxisIndex: 1, // Assigning the second Y-axis to this series
          },
        ],
        chart: {
          height: 220,
          type: 'line',
          toolbar: {
            tools: {
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: false,
              zoom: false,
              selection: false,
              download: true,
              position: 'top-left',
            },
          },
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: 'Stagewise Order Details',
          align: 'left',
          style: {
            fontWeight: '700',
            fontFamily: 'Arial, sans-serif',
            color: 'grey',
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: abbreviatedDescriptions,
        xaxis: {
          type: 'category',
          labels: {
            formatter: value => {
              return value
            },
            useHTML: true,
          },
        },
        yaxis: [
          {
            title: {
              text: 'PO Value',
            },
            labels: {
              formatter: value => {
                return `${(value / 1e7).toFixed(1)}C`
              },
            },
          },
          {
            opposite: true,
            title: {
              text: 'Enquiry Count',
            },
            labels: {
              formatter: value => {
                return value.toFixed(0)
              },
            },
          },
        ],
        tooltip: {
          shared: false,
          x: {
            formatter(value, { dataPointIndex }) {
              return descriptions[dataPointIndex] // Return full description
            },
          },
        },
      })
    } else {
      setChartData5(emptyChartData)
    }
  }, [Datas])

  return (
    <div className="chart_card table_row_chart">
      <Chart options={chartData5} series={chartData5.series} type="line" height={270} />
    </div>
  )
}

export default Stagewisechart
