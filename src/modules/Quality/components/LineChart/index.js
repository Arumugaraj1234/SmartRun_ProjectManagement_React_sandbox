import React, { useEffect, useRef } from 'react'
import ApexCharts from 'apexcharts'
import Style from './style.module.scss'

// import CurrentDateTime from '../../../../currentDateTime';

const ChartComponent = ({ teamMemberData }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const InspecData = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0')
      const matchingData =
        teamMemberData &&
        teamMemberData.find(data => {
          const dataMonth = data.inspOn ? data.inspOn.split('-')[1] : '0'
          return dataMonth === month
        })
      return matchingData ? matchingData.inspCall : '0'
    })

    const ReWorkData = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0')
      const matchingData =
        teamMemberData &&
        teamMemberData.length > 0 &&
        teamMemberData.find(data => {
          const dataMonth = data.inspOn ? data.inspOn.split('-')[1] : '0'
          return dataMonth === month
        })
      return matchingData ? matchingData.inspQty : '0'
    })

    const options = {
      series: [
        {
          name: 'No of Inspection Call',
          type: 'column',
          data: InspecData,
        },
        {
          name: 'No of Completed Inspection Call',
          type: 'line',
          data: ReWorkData,
        },
      ],
      chart: {
        height: 280,
        type: 'line',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: [],
          },
          autoSelected: 'download',
        },
      },
      stroke: {
        width: [0, 4],
      },
      // title: {
      //   text: 'Team Member',
      //   align: 'left',
      //   style: {
      //     fontWeight: '700',
      //     fontFamily: 'Arial, sans-serif',
      //     color: 'gray',
      //   },
      // },

      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'July',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: [
        {
          title: {
            text: 'No of Inspection Call',
            style: {
              fontSize: '14px',
            },
          },
          labels: {
            formatter(value) {
              return Math.round(value)
            },
          },
        },
        {
          opposite: true,
          title: {
            text: 'No of Completed Inspection Call',
            style: {
              fontSize: '14px',
            },
          },
          labels: {
            formatter(value) {
              return Math.round(value)
            },
          },
        },
      ],
      grid: {
        show: false,
      },
    }

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options)
      chart.render()

      return () => {
        chart.destroy()
      }
    }

    return undefined
  }, [teamMemberData])

  return <div className={Style.Chart} ref={chartRef} />
}

export default ChartComponent
