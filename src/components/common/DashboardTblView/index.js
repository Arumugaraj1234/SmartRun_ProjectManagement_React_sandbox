import React, { useState, useEffect } from 'react'
import { Table, Skeleton, Card, Row, Col } from 'antd'
import store from 'store'
import moment from 'moment'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import '../../../modules/sales/components/Dashboard/style.scss'

const DashboardTableView = ({ pmId, selectedMonth, fromDate, toDate }) => {
  const [getProjectListResp, setProjectList] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const [filtersinfo, setFiltersinfo] = useState({})
  let fromDateval = ''
  let toDateval = ''

  function getFirstAndLastDateOfMonth(year, month) {
    // month is 0-indexed (0 = January, 11 = December)
    const monthIndex = month - 1
    const firstDate = new Date(year, monthIndex, 1)
    const lastDate = new Date(year, monthIndex + 1, 0) // 0 gives the last day of the previous month

    return {
      firstDate,
      lastDate,
    }
  }

  // const tab=store.get("Tab");
  const employeeId = store.get('employeeId')
  const tenantid = store.get('tenantId')

  useEffect(() => {
    if (selectedMonth !== null) {
      const getYearnMonth = moment(selectedMonth)
        .format('YYYY-MM')
        .split('-')
      const { firstDate, lastDate } = getFirstAndLastDateOfMonth(getYearnMonth[0], getYearnMonth[1])
      fromDateval = moment(firstDate).format('YYYY-MM-DD')
      toDateval = moment(lastDate).format('YYYY-MM-DD')
    } else {
      fromDateval = moment(fromDate).format('YYYY-MM-DD')
      toDateval = moment(toDate).format('YYYY-MM-DD')
    }
    getProjectList(fromDateval, toDateval)
  }, [selectedMonth])

  const getProjectList = async (fDate, tdate) => {
    setTableLoading(true)
    const response = await indentFileUpload({
      requestPath: 'getRequestedToDtl',
      requestData: {
        tenantId: tenantid,
        empId: employeeId,
        pmId,
        isDashboard: '1',
        fromDate: fDate,
        toDate: tdate,
      },
    })
    setProjectList(response?.responseData || [])
    setTableLoading(false)
  }
  const handleChange = (pagination, filters) => {
    setFiltersinfo(filters)
  }

  const projectCode1 = []
  const projectName1 = []
  const reqName1 = []
  const requestedByName1 = []
  const requestedByDeptName1 = []
  const requestedToName1 = []
  const requestedToDeptName1 = []
  const seqStatusDesc1 = []
  const requestedDate1 = []
  const closedDate1 = []

  if (getProjectListResp.length > 0) {
    getProjectListResp.map(h => {
      return projectCode1.push(h.projectCode)
    })
    getProjectListResp.map(h => {
      return projectName1.push(h.projectName)
    })
    getProjectListResp.map(h => {
      return reqName1.push(h.reqName)
    })
    getProjectListResp.map(h => {
      return requestedByName1.push(h.requestedByName)
    })
    getProjectListResp.map(h => {
      return requestedByDeptName1.push(h.requestedByDeptName)
    })
    getProjectListResp.map(h => {
      return requestedToName1.push(h.requestedToName)
    })
    getProjectListResp.map(h => {
      return requestedToDeptName1.push(h.requestedToDeptName)
    })
    getProjectListResp.map(h => {
      return seqStatusDesc1.push(h.seqStatusDesc)
    })
    getProjectListResp.map(h => {
      return requestedDate1.push(h.requestedDate)
    })
    getProjectListResp.map(h => {
      return closedDate1.push(h.closedDate)
    })
  }
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const reqName2 = reqName1.filter(distinct)
  const requestedByName2 = requestedByName1.filter(distinct)
  const requestedByDeptName2 = requestedByDeptName1.filter(distinct)
  const requestedToName2 = requestedToName1.filter(distinct)
  const requestedToDeptName2 = requestedToDeptName1.filter(distinct)
  const seqStatusDesc2 = seqStatusDesc1.filter(distinct)
  const requestedDate2 = requestedDate1.filter(distinct)
  const closedDate2 = closedDate1.filter(distinct)

  const projectCode3 = projectCode2.map(h => {
    return { text: h, value: h }
  })
  const projectName3 = projectName2.map(h => {
    return { text: h, value: h }
  })
  const reqName3 = reqName2.map(h => {
    return { text: h, value: h }
  })
  const requestedByName3 = requestedByName2.map(h => {
    return { text: h, value: h }
  })
  const requestedByDeptName3 = requestedByDeptName2.map(h => {
    return { text: h, value: h }
  })
  const requestedToName3 = requestedToName2.map(h => {
    return { text: h, value: h }
  })
  const requestedToDeptName3 = requestedToDeptName2.map(h => {
    return { text: h, value: h }
  })
  const seqStatusDesc3 = seqStatusDesc2.map(h => {
    return { text: h, value: h }
  })
  const requestedDate3 = requestedDate2.map(h => {
    return { text: h ? moment(h).format('DD-MMM-YYYY') : '-', value: h }
  })
  const closedDate3 = closedDate2.map(h => {
    return { text: h ? moment(h).format('DD-MMM-YYYY') : '-', value: h }
  })
  const columns = [
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 100,
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      render: (text, record) => record.projectCode,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 100,
      filters: projectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
      render: (text, record) => record.projectName,
    },
    {
      title: 'Request Name',
      dataIndex: 'reqName',
      key: 'reqName',
      width: 100,
      filters: reqName3,
      filteredValue: filtersinfo.reqName,
      onFilter: (value, record) => record?.reqName === value,
      render: (text, record) => record.reqName,
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedByName',
      key: 'requestedByName',
      width: 100,
      filters: requestedByName3,
      filteredValue: filtersinfo.requestedByName,
      onFilter: (value, record) => record?.requestedByName === value,
    },

    {
      title: 'From Department',
      dataIndex: 'requestedByDeptName',
      key: 'requestedByDeptName',
      width: 100,
      filters: requestedByDeptName3,
      filteredValue: filtersinfo.requestedByDeptName,
      onFilter: (value, record) => record?.requestedByDeptName === value,
    },
    {
      title: 'Requested To',
      dataIndex: 'requestedToName',
      key: 'requestedToName',
      width: 100,
      filters: requestedToName3,
      filteredValue: filtersinfo.requestedToName,
      onFilter: (value, record) => record?.requestedToName === value,
    },
    {
      title: 'To Department',
      dataIndex: 'requestedToDeptName',
      key: 'requestedToDeptName',
      width: 100,
      filters: requestedToDeptName3,
      filteredValue: filtersinfo.requestedToDeptName,
      onFilter: (value, record) => record?.requestedToDeptName === value,
    },
    {
      title: 'Status',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
      width: 100,
      filters: seqStatusDesc3,
      filteredValue: filtersinfo.seqStatusDesc,
      onFilter: (value, record) => record?.seqStatusDesc === value,
    },
    {
      title: 'Requested Date',
      dataIndex: 'requestedDate', // need to ask entity
      key: 'requestedDate',
      width: 100,
      filters: requestedDate3,
      filteredValue: filtersinfo.requestedDate,
      onFilter: (value, record) => record?.requestedDate === value,
      render: text => {
        let requesteddate = null
        if (text !== null) {
          requesteddate = moment(text).format('DD-MMM-YYYY')
        } else {
          requesteddate = '-'
        }
        return requesteddate
      },
      // render: (text, record) => moment(record.requestedDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Closed Date',
      dataIndex: 'closedDate', // need to ask entity
      key: 'closedDate',
      width: 100,
      filters: closedDate3,
      filteredValue: filtersinfo.closedDate,
      onFilter: (value, record) => record?.closedDate === value,
      render: text => {
        let closeddate = null
        if (text !== null) {
          closeddate = moment(text).format('DD-MMM-YYYY')
        } else {
          closeddate = '-'
        }
        return closeddate
      },
    },
  ]

  return (
    <Row gutter={[24, 24]} style={{ marginTop: '0px' }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Card style={{ borderRadius: '10px' }}>
          <p
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              fontWeight: '700',
              fontFamily: 'Arial, sans-serif',
              color: 'gray',
            }}
          >
            Request Management Details
          </p>

          <div>
            {tableLoading ? (
              <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={getProjectListResp}
                scroll={{ y: 300, x: 150 }}
                pagination={false}
                onChange={handleChange}
              />
            )}
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardTableView
