import React, { useEffect, useRef } from 'react'
import ApexCharts from 'apexcharts'
import CurrentDateTime from '../../../../currentDateTime'

const ChartComponent = ({ teamMemberData, val }) => {
  const chartRef = useRef(null)

  const saleValue = teamMemberData.map(data => data.saleValue || 0)
  const targetValue = teamMemberData.map(data => data.targetValue || 0)
  const projCode = teamMemberData.map(data => data.projectCode || '')
  const actualValue = teamMemberData.map(data => {
    const scmPoValue = parseInt(data.scmPoValue, 10) || 0
    const materialTransferValue = parseInt(data.materialTransferValue, 10) || 0
    return scmPoValue + materialTransferValue
  })

  useEffect(() => {
    // const options = {
    //   series: [
    //     {
    //       name: 'Budget Value',
    //       type: 'bar',
    //       data: saleValue,
    //     },
    //     {
    //       name: 'Target value',
    //       type: 'bar',
    //       data: targetValue,
    //     },
    //     {
    //       name: 'Actual value',
    //       type: 'bar',
    //       data: actualValue,
    //     },
    //   ],
    //   chart: {
    //     height: 330,
    //     type: 'bar',
    //     toolbar: {
    //       export: {
    //         csv: {
    //           filename: `ProjectDashboard_CSV_${CurrentDateTime}`,
    //         },
    //         png: {
    //           filename: `ProjectDashboard_PNG_${CurrentDateTime}`,
    //         },
    //         svg: {
    //           filename: `ProjectDashboard_SVG_${CurrentDateTime}`
    //         }
    //       }
    //     }
    //   },
    //   platOptions: {
    //     bar: {
    //       horizontal: false,
    //       barHeight: '20%',
    //       barWidth: '30%',
    //       borderRadius: 4,
    //       colors: ['#FF5733', '#33FF57', '#E5C72E'],
    //     }
    //   },
    //   stroke: {
    //     width: [4]
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   xaxis: {
    //     categories: projCode,
    //   },
    //   yaxis: {
    //     title: {
    //       text: `Value ${val}`,
    //       style: {
    //         fontSize: '14px',
    //       }
    //     },
    //     labels: {
    //       formatter(value) {
    //         return parseFloat(value / 1e7).toFixed(2);
    //       }
    //     }
    //   },
    //   grid: {
    //     show: false
    //   },
    //   tooltip: {
    //     formatter(value, series) {
    //       return `<b>${series.name}</b><br/>Value: ${(value / 1e7).toFixed(2)}`;
    //     }
    //   }
    // };

    const options = {
      series: [
        {
          name: 'Budget Value ',
          data: saleValue,
        },
        {
          name: 'Target value',
          data: targetValue,
        },
        {
          name: 'Actual Value',
          data: actualValue,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          export: {
            csv: {
              filename: `ProjectDashboard_CSV_${CurrentDateTime}`,
            },
            png: {
              filename: `ProjectDashboard_PNG_${CurrentDateTime}`,
            },
            svg: {
              filename: `ProjectDashboard_SVG_${CurrentDateTime}`,
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      // stroke: {
      //   width: [4]
      // },
      dataLabels: {
        enabled: true,
        formatter(value) {
          return `${parseFloat(value / 1e7).toFixed(2)}C`
        },
      },
      stroke: {
        show: true,
        width: -1,
        colors: ['transparent'],
      },
      xaxis: {
        categories: projCode,
      },
      yaxis: {
        title: {
          text: `Value ${val}`,
          style: {
            fontSize: '14px',
          },
        },
        labels: {
          formatter(value) {
            return `${parseFloat(value / 1e7).toFixed(2)}C`
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false,
      },
      tooltip: {
        formatter(value, series) {
          const formattedValue = `${parseFloat(value / 1e7).toFixed(2)}C`
          return `<b>${series.name}</b><br/>Value: ${formattedValue}`
        },
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

  return <div ref={chartRef} style={{ width: '100%' }} />
}

export default ChartComponent
