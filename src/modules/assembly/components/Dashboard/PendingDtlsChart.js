import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const Stagewisechart = ({ Datas, title }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 180,
        type: 'bar', // Changed to 'bar'
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
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      colors: ['#1E90FF', '#FF4500'],
      title: {
        text: title,
        align: 'left',
        style: {
          fontWeight: '700',
          fontFamily: 'Arial, sans-serif',
          color: 'grey',
        },
      },
      xaxis: {
        categories: [], // Use categories for x-axis labels
        type: 'category',
        title: {
          text: 'Project Code', // Set the title for the x-axis
          style: {
            fontWeight: '700',
            fontFamily: 'Arial, sans-serif',
            color: 'grey',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Tasks Count',
        },
        labels: {
          formatter: value => value.toFixed(0),
        },
      },
      grid: {
        show: false, // Disable grid lines
      },
    },
  })

  useEffect(() => {
    if (Datas && Datas.length > 0) {
      const projectIds = Datas.map(data => data.projCode)
      const delayTasks = Datas.map(data => parseInt(data.delayTask, 10))
      const pendingTasks = Datas.map(data => parseInt(data.openTask, 10))

      setChartData({
        series: [
          { name: 'Total Task', data: pendingTasks },
          { name: 'Delay Task', data: delayTasks },
        ],
        options: {
          chart: {
            height: 180,
            type: 'bar',
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
          colors: ['#1E90FF', '#FF4500'],
          title: {
            text: title,
            align: 'left',
            style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
          },
          xaxis: {
            categories: projectIds,
            type: 'category',
            title: {
              text: 'Project Code',
              style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
            },
          },
          yaxis: {
            title: { text: 'Tasks Count' },
            labels: { formatter: value => value.toFixed(0) },
          },
          grid: { show: false },
        },
      })
    } else {
      // Reset the chart when there's no data
      setChartData({
        series: [
          { name: 'Total Task', data: [] },
          { name: 'Delay Task', data: [] },
        ],
        options: {
          chart: {
            height: 180,
            type: 'bar',
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
          colors: ['#1E90FF', '#FF4500'],
          title: {
            text: title,
            align: 'left',
            style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
          },
          xaxis: {
            categories: [],
            type: 'category',
            title: {
              text: 'Project Code',
              style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
            },
          },
          yaxis: {
            title: { text: 'Tasks Count' },
            labels: { formatter: value => value.toFixed(0) },
          },
          grid: { show: false },
        },
      })
    }
  }, [Datas, title])

  return (
    <div className="chart_card table_row_chart">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar" // Changed to 'bar'
        height={180}
      />
    </div>
  )
}

export default Stagewisechart
