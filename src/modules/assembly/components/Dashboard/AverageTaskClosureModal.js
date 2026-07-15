import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import store from 'store'
import InspectionReportService from 'services/Quality/InspectionReport'

const AverageTaskClosureModal = ({ selectedMonth, project }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  useEffect(() => {
    getProjectDataDtls()
  }, [])

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

  const getProjectDataDtls = async () => {
    const props = {
      monYr: selectedMonth ? moment(selectedMonth).format('YYYY-MM') : moment().format('YYYY-MM'),
      empId,
      tenantId,
      deptCode: 'D06',
      pmId: '4',
      projId: project,
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getTaskCompTime',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const activity1 = []
  const projName1 = []
  const completeDate1 = []

  projectData.map(h => {
    return activity1.push(h.activity)
  })

  projectData.map(h => {
    return projName1.push(h.projName)
  })
  projectData.map(h => {
    return completeDate1.push(h.completedDate)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const activity2 = activity1.filter(distinctval)
  const projName2 = projName1.filter(distinctval)
  const completeDate2 = completeDate1.filter(distinctval)

  const activity3 = []
  const projName3 = []
  const completeDate3 = []

  activity2.map(element => {
    return activity3.push({
      text: element,
      value: element,
    })
  })

  projName2.map(element => {
    return projName3.push({
      text: element,
      value: element,
    })
  })

  completeDate2.map(element => {
    return completeDate3.push({
      text: element,
      value: element,
    })
  })

  const projectColumns = [
    // {
    //   title: 'S.No',
    //   dataIndex: 'sno',
    //   key: 'sno',
    //   width: '10%',
    //   render: (text, record, index) => index + 1,
    // },

    {
      title: 'Project Name',
      dataIndex: 'projName',
      key: 'projName',
      filters: projName3,
      filteredValue: filterData.projName,
      onFilter: (value, record) => record?.projName === value,
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      filters: activity3,
      filteredValue: filterData.activity,
      onFilter: (value, record) => record?.activity === value,
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Planned End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Actual Start Date',
      dataIndex: 'actualDate',
      key: 'actualDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Actual End Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      filters: completeDate3,
      filteredValue: filterData.completedDate,
      onFilter: (value, record) => record?.completedDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Delay Days',
      dataIndex: 'delay',
      key: 'delay',
      className: 'right-align-cell',
    },
  ]

  return (
    <div className="custom_antd_Table">
      <Table
        dataSource={projectData}
        columns={projectColumns}
        size="small"
        pagination={{
          pageSizeOptions: ['10', '20', '30', '50', [projectData?.length]],
          showSizeChanger: true,
          defaultPageSize: 50,
        }}
        scroll={{ y: 300 }}
        onChange={handleDataChange}
      />
    </div>
  )
}

export default AverageTaskClosureModal
