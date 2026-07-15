import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const Stagewisechart = ({ Datas, title }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Open Task',
        type: 'column',
        data: [],
      },
      {
        name: 'Completed Task',
        type: 'column',
        data: [],
      },
      {
        name: 'Completion %',
        type: 'line',
        data: [],
        yAxisIndex: 1,
      },
    ],
    options: {
      chart: {
        height: 180,
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
        width: [0, 0, 4],
      },
      title: {
        text: title,
        align: 'left',
        style: {
          fontWeight: '700',
          fontFamily: 'Arial, sans-serif',
          color: 'grey',
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [2],
        formatter: value => value?.toFixed(2),
      },
      labels: [],
      xaxis: {
        type: 'category',
        text: 'Project Code',
      },
      yaxis: [
        {
          title: {
            text: 'Tasks Count',
          },
          labels: {
            formatter: value => value?.toFixed(0),
          },
        },

        {
          opposite: true,
          title: {
            text: 'Compl. %',
          },
          labels: {
            formatter: value => value?.toFixed(0),
          },
        },
      ],
      grid: {
        show: false, // Disable grid lines
      },
    },
  })

  useEffect(() => {
    if (Datas && Datas.length > 0) {
      const projectIds = Datas.map(data => data.projCode)
      const openTasks = Datas.map(data => parseInt(data.openTask, 10))
      const completedTasks = Datas.map(data => parseInt(data.completedTask, 10))
      const completedPers = Datas.map(data => parseFloat(data.completedPer))

      setChartData({
        series: [
          { name: 'Open Task', type: 'column', data: openTasks },
          { name: 'Completed Task', type: 'column', data: completedTasks },
          { name: 'Completion %', type: 'line', data: completedPers, yAxis: 1 },
        ],
        options: {
          chart: {
            height: 180,
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
          stroke: { width: [0, 0, 4] },
          title: {
            text: title,
            align: 'left',
            style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [2],
            formatter: value => value?.toFixed(2),
          },
          labels: projectIds,
          xaxis: {
            categories: projectIds,
            type: 'category',
            title: {
              text: 'Project Code',
              style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'black' },
            },
          },
          yaxis: [
            {
              title: { text: 'Tasks Count' },
              labels: { formatter: value => value?.toFixed(0) },
              tickAmount: 5,
            },
            {
              opposite: true,
              title: { text: 'Compl. %' },
              labels: { formatter: value => value?.toFixed(0) },
              min: 0,
              max: 100,
              tickAmount: 5,
            },
          ],
          grid: { show: false },
        },
      })
    } else {
      // Reset the chart when there's no data
      setChartData({
        series: [
          { name: 'Open Task', type: 'column', data: [] },
          { name: 'Completed Task', type: 'column', data: [] },
          { name: 'Completion %', type: 'line', data: [], yAxisIndex: 1 },
        ],
        options: {
          chart: {
            height: 180,
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
          stroke: { width: [0, 0, 4] },
          title: {
            text: title,
            align: 'left',
            style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'grey' },
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [2],
            formatter: value => value?.toFixed(2),
          },
          labels: [],
          xaxis: {
            categories: [],
            type: 'category',
            title: {
              text: 'Project Code',
              style: { fontWeight: '700', fontFamily: 'Arial, sans-serif', color: 'black' },
            },
          },
          yaxis: [
            {
              title: { text: 'Tasks Count' },
              labels: { formatter: value => value?.toFixed(0) },
              tickAmount: 5,
            },
            {
              opposite: true,
              title: { text: 'Compl. %' },
              labels: { formatter: value => value?.toFixed(0) },
              min: 0,
              max: 100,
              tickAmount: 5,
            },
          ],
          grid: { show: false },
        },
      })
    }
  }, [Datas])

  return (
    <div className="chart_card table_row_chart">
      <Chart options={chartData.options} series={chartData.series} type="line" height={180} />
    </div>
  )
}

export default Stagewisechart
