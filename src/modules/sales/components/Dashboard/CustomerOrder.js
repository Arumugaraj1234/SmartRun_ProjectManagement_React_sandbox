import React from 'react'
import Chart from 'react-apexcharts'
import { useMediaQuery } from 'react-responsive'
// import { Card } from "antd";

const CustomerOrderchart = ({ Datas }) => {
  const colors = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#546E7A',
    '#26a69a',
    '#D10CE8',
    '#D100D1',
    '#D17C10',
    '#0CD186',
    '#7A54E8',
    '#0C93D1',
    '#D1A010',
    '#E8B054',
    '#E85464',
    '#3A79D1',
    '#64E854',
    '#D1E8B0',
    '#E8D170',
    '#E8708C',
    '#70E8D1',
    '#0CD1B0',
    '#D1700C',
    '#B0D10C',
    '#D1E864',
    '#64E854',
    '#E8B070',
    '#D1700C',
    '#B0D1E8',
    '#D1B070',
    '#E870B0',
    '#B0E8D1',
    '#70D1B0',
    '#E854D1',
  ]
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const data = Datas.map((item, index) => ({
    label: item.customerName,
    value: Number(item.noOfOrder),
    color: colors[index % colors.length],
  }))

  const chartOptions = {
    labels: data.map(item => item.label),
    chart: { sparkline: { enabled: true } },
    // title: {
    //   text: 'Customer Order Details',
    //   align: 'center',
    // },
    dataLabels: {
      enabled: true,
      // formatter(val) {
      //   console.log(val)
      // },
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: undefined, // Default colors or specify an array of colors
      },
      dropShadow: {
        enabled: false, // Disable drop shadow for a fixed appearance
      },
    },
    colors: data.map(item => item.color),
    plotOptions: {
      pie: {
        customScale: 0.8,
        size: 200,
        donut: {
          size: '65%',
        },
      },
    },
  }

  const chartSeries = data.map(item => item.value)

  return (
    <div className="chart_card table_row_chart">
      <p
        style={{
          textAlign: 'left',
          fontSize: 'small',
          color: 'grey',
          fontWeight: 800,
          fontFamily: 'Arial, sans-serif',
          paddingTop: '7px',
          paddingLeft: '8px',
        }}
      >
        Customer Order Details
      </p>
      <div
        style={{ display: isMobile ? 'bloce' : 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <Chart options={chartOptions} series={chartSeries} type="donut" width="300" />
        <div className="row" style={{ marginLeft: '20px', marginRight: '20px' }}>
          {data.map(item => (
            <div style={{ display: 'flex', padding: '0px 7px ' }}>
              <div
                key={item.label}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    marginRight: '5px',
                  }}
                />
                <span style={{ fontSize: '13px' }}>
                  {item.label} - <b>{item.value}</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerOrderchart
