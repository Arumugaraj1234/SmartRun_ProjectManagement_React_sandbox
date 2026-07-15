import React, { useState, useEffect } from 'react'
import { DatePicker, Form, Select, Card, Button } from 'antd'
import store from 'store'
import moment from 'moment'
import Chart from 'react-apexcharts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import GetDetailCard from '../detailCard'

const GetReportSearchCard = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [retrieve, setRetreive] = useState([])
  const [projectResp, setProjectList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedProjectText, setSelectedProjectText] = useState('')
  const [chartSeries, setChartSeries] = useState([])
  const [amntchartSeries, setamntChartSeries] = useState([])
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const menuList = store.get('MenuListData')
  const webColors = [
    '#FF6633', // Orange
    '#FFB399', // Light Orange
    '#FF33FF', // Pink
    '#5F9EA0', // Light Yellow
    '#00B3E6', // Light Blue
    '#E6B333', // Gold
    '#3366E6', // Blue
    '#999966', // Gray
    '#99FF99', // Light Green
    '#B34D4D', // Red
    '#80B300', // Green
    '#809900', // Olive Green
  ]
  const tenantid = store.get('tenantId')
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const currentDate = moment()
  const firstDateOfMonth = moment().startOf('month')

  const disabledFutureDates = current => {
    return current && current > moment().endOf('day')
  }

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'pie',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: () => {
          return ''
        },
      },
    },
    colors: [],
    labels: [],
  })

  const [amountchartOptions, setamountChartOptions] = useState({
    chart: {
      type: 'pie',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: () => {
          return ''
        },
      },
    },
    colors: [],
    labels: [],
  })

  useEffect(() => {
    const onLoadFunc = async () => {
      getProjectList()
    }
    onLoadFunc()
  }, [])

  const getProjectList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId: tenantid,
        fromDate: '',
        toDate: '',
      },
    })
    setProjectList(response?.responseData || []) /* */
  }

  const retreivalResp = async () => {
    setTableLoading(true)
    setIsLoading(true)
    const response = await indentFileUpload({
      requestPath: 'timeSheetReport',
      requestData: {
        pmHdrId: form.getFieldValue('projectId'),
        fromDate: moment(form.getFieldValue('fromdate')).format('YYYY-MM-DD'),
        toDate: moment(form.getFieldValue('todate')).format('YYYY-MM-DD'),
        tenantId: tenantid,
      },
    })
    setRetreive(response?.responseData || []) /* */
    setTableLoading(false)
  }

  const getBarandLinechartResp = async () => {
    setChartSeries([])
    setamntChartSeries([])
    const response = await indentFileUpload({
      requestPath: 'timeSheetDeptDtl',
      requestData: {
        pmHdrId: form.getFieldValue('projectId'),
        fromDate: moment(form.getFieldValue('fromdate')).format('YYYY-MM-DD'),
        toDate: moment(form.getFieldValue('todate')).format('YYYY-MM-DD'),
        tenantId: tenantid,
      },
    })
    if (response !== null && response.responseData.length > 0) {
      // const departmentName = []
      // const departmentHour = []
      // const departmentRupees = []
      // const hsrPercentage = []
      // const amounts = []
      // const amountPercentage = []
      // response.responseData.forEach(e => {
      //   departmentName.push(e.departmentName)
      //   departmentHour.push(
      //     `${e.departmentName} - ${parseFloat(e.hours).toLocaleString('en-IN', {
      //       minimumFractionDigits: 1,
      //       maximumFractionDigits: 1,
      //     }) || '0'}`,
      //   )
      //   departmentRupees.push(
      //     `${e.departmentName} - ${Number(e.rupees).toLocaleString('en-IN', {
      //       minimumFractionDigits: 0,
      //       maximumFractionDigits: 0,
      //     }) || '0'}`,
      //   )
      //   hsrPercentage.push(Number(Number(e.hours).toFixed(2)))
      //   amounts.push(Number(Number(e.rupees).toFixed(2)))
      //   amountPercentage.push(Number(Number(e.percentageOfRupees).toFixed(2)))
      // })

      const aggregatedData = {}
      const departmentRupees = []
      const hsrPercentage = []
      const amounts = []
      const amountPercentage = []
      const departmentHour = []

      response.responseData.forEach(e => {
        const { departmentCode } = e

        if (!aggregatedData[departmentCode]) {
          // Initialize if not exists
          aggregatedData[departmentCode] = {
            departmentName: e.departmentName,
            totalHours: 0,
            totalRupees: 0,
            totalPercentage: 0,
            departmentHour: [], // Initialize departmentHour array
          }
        }

        // Accumulate values
        aggregatedData[departmentCode].totalHours += parseFloat(e.hours)
        aggregatedData[departmentCode].totalRupees += Number(e.rupees)
        aggregatedData[departmentCode].totalPercentage += Number(e.percentageOfRupees)
        aggregatedData[departmentCode].departmentHour.push(
          `${e.departmentName} - ${parseFloat(e.hours).toLocaleString('en-IN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }) || '0'}`,
        ) // Add department hour entry
      })

      // Prepare arrays for chart series
      Object.keys(aggregatedData).forEach(departmentCode => {
        const data = aggregatedData[departmentCode]
        departmentRupees.push(
          `${data.departmentName} - ${data.totalRupees.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }) || '0'}`,
        )
        departmentHour.push(
          `${data.departmentName} - ${parseFloat(data.totalHours).toLocaleString('en-IN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }) || '0'}`,
        )
        hsrPercentage.push(Number(data.totalHours.toFixed(2)))
        amounts.push(Number(data.totalRupees.toFixed(2)))
        amountPercentage.push(Number(data.totalPercentage.toFixed(2)))
      })

      setChartSeries(hsrPercentage)
      setamntChartSeries(amounts)

      setChartOptions({
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Department based (in Hours)',
          align: 'left',
          margin: 10,
          offsetY: 0,
          style: {
            fontFamily: 'Helvetica',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        dataLabels: {
          enabled: true,
          // formatter: function (val, opts) {
          //   return `${opts.w.globals.series[opts.seriesIndex]} %`;
          // },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: () => ``,
            title: {
              formatter: seriesName => {
                const parts = seriesName.split(' - ')
                return parts.join(': ')
              },
            },
          },
          // y: {
          //   formatter: function(value) {
          //     return value
          //   },
          // },
        },
        legend: {
          position: 'right',
          offsetY: 80,
        },
        colors: webColors,
        labels: departmentHour,
      })

      setamountChartOptions({
        chart: {
          type: 'pie',
        },
        title: {
          text: `Department based in Rupees ${menuList[0].currency}`,
          align: 'left',
          margin: 10,
          offsetY: 0,
          style: {
            fontSize: '16px',
            fontfamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        dataLabels: {
          enabled: true,
          formatter: val => {
            return `${val.toFixed(1)} %`
          },
          // formatter: function (val, opts) {
          //   return `${opts.w.globals.series[opts.seriesIndex]} %`;
          // },
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: () => ``,
            title: {
              formatter: seriesName => {
                const parts = seriesName.split(' - ')
                return parts.join(': ')
              },
            },
          },
          // y: {
          //   formatter: function(value) {
          //     return value
          //   },
          // },
        },
        legend: {
          position: 'right',
          offsetY: 80, // Adjust the top padding of the legends
          // markers: {
          //     fillColors: colors // Apply dynamic colors to legend markers
          //   }
        },
        colors: webColors,
        labels: departmentRupees,
      })

      setTableLoading(false)
    }
  }

  const handleProjectChange = (value, option) => {
    form.setFieldsValue({ projectId: value })
    setSelectedProjectText(option.children)
  }

  const handleCancel = () => {
    setIsLoading(false)
  }
  const onHandleSubmit = () => {
    retreivalResp()
    getBarandLinechartResp()
  }

  const dateVal = []
  const hrsval = []
  const amountVal = []
  if (retrieve.length > 0) {
    const dateMap = new Map()

    retrieve.forEach(e => {
      const dateKey = moment(e.recordDate).format('DD-MMM-YYYY')
      const hrs = Number(Number(e.hrs).toFixed(1))
      const rupees = Number(Number(e.rupees).toFixed(2))

      if (dateMap.has(dateKey)) {
        const existingEntry = dateMap.get(dateKey)
        dateMap.set(dateKey, {
          hrs: existingEntry.hrs + hrs,
          rupees: existingEntry.rupees + rupees,
        })
      } else {
        dateMap.set(dateKey, { hrs, rupees })
      }
    })
    dateMap.forEach((values, dateKey) => {
      dateVal.push(dateKey)
      hrsval.push(Number(Number(values.hrs).toFixed(1)))
      amountVal.push(Number(Number(values.rupees).toFixed(2)))
    })
  }

  const options = {
    chart: {
      height: 300,
      //   offsetX: 50,
      type: 'line',
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: 'Timesheet Chart',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
    },
    labels: dateVal,
    xaxis: {
      type: 'category',
    },
    yaxis: [
      {
        seriesName: 'Hours',
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Hours',
        },
        labels: {
          formatter(value) {
            return value.toFixed(2) // Format to 2 decimal places
          },
        },
      },
      {
        seriesName: 'Rupees',
        opposite: true, // This places the y-axis on the right side
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: `Value ${menuList[0].currency}`,
          // rotate: 90, // Rotate the text 90 degrees counter-clockwise (top-to-bottom)
          // offsetX: 0,
          // offsetY: 0,
        },
        labels: {
          formatter(value) {
            return value.toFixed(2) // Format to 2 decimal places
          },
        },
      },
    ],
    grid: {
      show: false, // This removes the gridlines
    },
  }

  const series = [
    {
      name: 'Hours',
      type: 'column',
      data: hrsval,
    },
    {
      name: 'Rupees',
      type: 'line',
      data: amountVal,
    },
  ]

  return (
    <div
      className="my-3"
      style={isMobile ? { width: tableWidth, marginTop: '20px' } : { marginTop: '20px' }}
    >
      <Card
        title="Timesheet Report"
        extra={<PlusCircleOutlined style={{ fontSize: '20px', color: 'white', display: 'none' }} />}
      >
        <Form form={form} layout="vertical" labelAlign="left" onFinish={onHandleSubmit}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="projectId"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please select a project',
                  },
                ]}
              >
                {/* <Select onChange={handleProjectChange} placeholder="Select Project">
                  {projectResp?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))} */}
                <Select onChange={handleProjectChange} placeholder="Select Project">
                  <Option value="getall">Get All</Option>
                  {projectResp?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="fromdate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                initialValue={firstDateOfMonth}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MMM-YYYY"
                  disabledDate={disabledFutureDates}
                />
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="todate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                initialValue={currentDate}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD-MMM-YYYY"
                  disabledDate={disabledFutureDates}
                />
              </Form.Item>
            </div>
          </div>
          <center>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                Submit
              </Button>
              <Button type="primary" onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </center>
        </Form>
      </Card>
      <div style={{ paddingTop: '30px' }}>
        <GetDetailCard
          resp={retrieve}
          isloading={isLoading}
          tableLoading={tableLoading}
          formItem={form}
          projectTitle={selectedProjectText}
          fromDate={form.getFieldValue('fromdate')}
          toDate={form.getFieldValue('todate')}
        />
      </div>
      <div style={{ paddingTop: '30px' }}>
        <Card className="p-0" style={{ display: isLoading ? 'block' : 'none' }}>
          <Chart options={options} series={series} type="line" height={300} />
        </Card>
      </div>

      <div style={{ paddingTop: '30px' }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Card className="p-0" style={{ display: isLoading ? 'block' : 'none' }}>
              {amntchartSeries.length > 0 ? (
                <Chart
                  options={amountchartOptions}
                  series={amntchartSeries}
                  type="pie"
                  height={300}
                />
              ) : (
                <p>No Data</p>
              )}
            </Card>
          </div>
          <div className="col-md-6 mb-3">
            <Card className="p-0" style={{ display: isLoading ? 'block' : 'none' }}>
              {chartSeries.length > 0 ? (
                <Chart options={chartOptions} series={chartSeries} type="pie" height={300} />
              ) : (
                <p>No Data</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default GetReportSearchCard
