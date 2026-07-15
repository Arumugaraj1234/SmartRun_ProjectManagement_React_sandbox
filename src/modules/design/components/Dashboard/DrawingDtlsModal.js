import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import store from 'store'
import InspectionReportService from 'services/Quality/InspectionReport'

const DrawingDtlsModal = ({ selectedMonth, project }) => {
  console.log(moment(selectedMonth).format('YYYY-MM'), ' DrawingDtlsModal')
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
      monthYear: selectedMonth
        ? moment(selectedMonth).format('MM-YYYY')
        : moment().format('MM-YYYY'),
      empId,
      tenantId,
      deptCode: 'D04',
      pmId: '2',
      category: 'getall',
      projectId: project,
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getDesignWidgetDtlByCategory',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const activityName1 = []
  const assignName1 = []
  const completeDate1 = []
  const projectName1 = []
  const projectNo1 = []

  projectData.map(h => {
    return activityName1.push(h.activityName)
  })
  projectData.map(h => {
    return assignName1.push(h.assignedToName)
  })
  projectData.map(h => {
    return completeDate1.push(h.completedDate)
  })
  projectData.map(h => {
    return projectName1.push(h.projName)
  })
  projectData.map(h => {
    return projectNo1.push(h.projNum)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const activityName2 = activityName1.filter(distinctval)
  const assignName2 = assignName1.filter(distinctval)
  const completeDate2 = completeDate1.filter(distinctval)
  const projectName2 = projectName1.filter(distinctval)
  const projectNo2 = projectNo1.filter(distinctval)

  const activityName3 = []
  const assignName3 = []
  const completeDate3 = []
  const projectName3 = []
  const projectNo3 = []

  activityName2.map(element => {
    return activityName3.push({
      text: element,
      value: element,
    })
  })

  assignName2.map(element => {
    return assignName3.push({
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

  projectName2.map(element => {
    return projectName3.push({
      text: element,
      value: element,
    })
  })

  projectNo2.map(element => {
    return projectNo3.push({
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
      title: 'Project Number',
      dataIndex: 'projNum',
      key: 'projNum',
      align: 'right',
      filters: projectNo3,
      filteredValue: filterData.projNum,
      onFilter: (value, record) => record?.projNum === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projName',
      key: 'projName',
      filters: projectName3,
      filteredValue: filterData.projName,
      onFilter: (value, record) => record?.projName === value,
    },
    {
      title: 'Activity',
      dataIndex: 'activityName',
      key: 'activityName',
      filters: activityName3,
      filteredValue: filterData.activityName,
      onFilter: (value, record) => record?.activityName === value,
    },
    {
      title: 'Assigned Employee',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      filters: assignName3,
      filteredValue: filterData.assignedToName,
      onFilter: (value, record) => record?.assignedToName === value,
    },
    {
      title: 'Planned Start Date',
      dataIndex: 'plannedStartDate',
      key: 'plannedStartDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Planned End Data',
      dataIndex: 'plannedCompletedDate',
      key: 'plannedCompletedDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Completed Data',
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
      render: (text, record) => {
        const diff =
          record.completedDate && record.completedDate !== null
            ? moment(record.plannedCompletedDate).diff(moment(record.completedDate), 'days')
            : moment(record.plannedCompletedDate).diff(moment(), 'days')
        return <span style={{ color: diff < 0 ? 'red' : 'green', textAlign: 'right' }}>{diff}</span>
      },
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

export default DrawingDtlsModal
