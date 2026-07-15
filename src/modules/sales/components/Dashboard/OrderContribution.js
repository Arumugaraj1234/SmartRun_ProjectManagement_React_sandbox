/* eslint-disable */
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { Select } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { useMediaQuery } from 'react-responsive'
import Chart from 'react-apexcharts'

const OrderContribution = ({ slctdFromDate, slctdToDate, selectedEmployee }) => {
  const tenantId = store.get('tenantId')
  // const employeeId = store.get('employeeId')
  const { Option } = Select
  const colors = ['#008FFB', '#00E396', '#D100D1']
  const [ProjectList, setProjectList] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'pie',
      // events: {
      // dataPointMouseEnter: function(event, chartContext, config) {
      // const seriesIndex = config.seriesIndex
      // const dataPointIndex = config.dataPointIndex
      // const value = chartContext.w.globals.series[seriesIndex][dataPointIndex]
      // const label = chartContext.w.config.labels[dataPointIndex]
      // You can implement your tooltip logic here
      // },
      // },
    },

    tooltip: {
      enabled: true,
      y: {
        formatter: value => ``,
        title: {
          formatter: seriesName => {
            const parts = seriesName.split('-')
            return parts.join(': ')
          },
        },
      },
    },
    colors: colors,
    labels: [],
  })
  const [chartSeries, setChartSeries] = useState([])
  useEffect(() => {
    getProjectList()
    getDashboardData('getAll')
  }, [slctdFromDate, slctdToDate, selectedEmployee])

  const getProjectList = async () => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      // customerName: '',
      // empId: employeeId,
      empId: selectedEmployee,
      isExpectedPoDate: 0,
      // tentativePoVal: 0,
      projectId: '',
      pmId: '1',
      tenantId,
    }
    const response = await indentFileUpload({
      // requestPath: 'getEnqDtlbyDate',
      requestPath: 'getSalesContProjects',
      requestData: keyareaobj,
    })
    if (response) {
      const options = response?.responseData.map(item => ({
        key: `${item.projectCode}-${item.projectName}`,
        value: item.seId ? item.seId : '',
      }))
      options.unshift({ key: 'Get All', value: 'getAll' })
      setProjectList(options)
    }
  }
  const getDashboardData = async value => {
    const keyareaobj = {
      fromDate: moment(slctdFromDate).format('YYYY-MM-DD'),
      toDate: moment(slctdToDate).format('YYYY-MM-DD'),
      tenantId,
      projectId: value,
      // empId: employeeId,
      empId: selectedEmployee,
      pmId: '1',
    }
    const response = await indentFileUpload({
      requestPath: 'getSalesContDtl',
      requestData: keyareaobj,
    })
    if (response && response.responseData && response.responseData.length > 0) {
      const data = response.responseData[0]
      const saleValue = parseFloat((parseFloat(data.saleValue) || 0).toFixed(2))
      const finalCost = parseFloat((parseFloat(data.finalCost) || 0).toFixed(2))
      const totalBaseCode = parseFloat((parseFloat(data.totalBaseCode) || 0).toFixed(2))
      const contributionPercentage = (totalBaseCode / finalCost) * 100
      const finalCostPercentage = (saleValue / finalCost) * 100
      const uom = data.uom
      setChartSeries([finalCost, saleValue])

      setChartOptions({
        chart: {
          type: 'pie',
          // events: {
          //   dataPointMouseEnter: function(event, chartContext, config) {
          //     const seriesIndex = config.seriesIndex
          //     const dataPointIndex = config.dataPointIndex
          //     const value = chartContext.w.globals.series[seriesIndex][dataPointIndex]
          //     const label = chartContext.w.config.labels[dataPointIndex]
          //     // You can implement your tooltip logic here
          //   },
          // },
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            const percentage =
              opts.seriesIndex === 0
                ? contributionPercentage.toFixed(2)
                : finalCostPercentage.toFixed(2)
            return percentage + '%'
          },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: value => ``,
            title: {
              formatter: seriesName => {
                const parts = seriesName.split('-')
                return parts.join(': ')
              },
            },
          },
        },
        colors: colors,
        labels: [
          `Order - <b>${totalBaseCode.toFixed(2)}${uom}</b>`,
          `Contribution - <b>${saleValue.toFixed(2)}${uom}</b>`,
          `Overall Value - <b>${finalCost.toFixed(2)}${uom}</b>`,
        ],
      })
    }
  }

  const handleInputChange = value => {
    getDashboardData(value)
  }

  return (
    <div className="chart_card table_row_chart">
      <h3
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
        Order Vs Contribution
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flex: 'end',
          justifyContent: isMobile ? 'center' : 'right',
          paddingRight: '8px',
        }}
      >
        <p>Project Name :</p>
        <Select
          showSearch
          defaultValue={'getAll'}
          placeholder="Select Project"
          style={{ width: '40%' }}
          onChange={handleInputChange}
          filterOption={(input, option) =>
            option.key && option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {ProjectList.map(project => (
            <Option key={project.key} value={project.value}>
              {project.key}
            </Option>
          ))}
        </Select>
      </div>
      <div
        className="row"
        style={
          isMobile
            ? { padding: '0px 0px' }
            : { display: 'flex', gap: '30px', padding: '10px 35px', alignItems: 'center' }
        }
      >
        <div id="chart" style={isMobile ? { padding: '0px 0px' } : { padding: '10px 35px' }}>
          <Chart options={chartOptions} series={chartSeries} type="pie" width="380" />
        </div>
        {/* <div className="row" style={{ marginLeft: '20px' }}>
          {chartOptions.labels.map((label, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[index % colors.length], marginRight: '5px' }} />
              <span>{label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default OrderContribution
