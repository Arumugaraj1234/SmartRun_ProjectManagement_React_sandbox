import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import moment from 'moment'
import store from 'store'
import InspectionReportService from 'services/Quality/InspectionReport'

const ProjectInProgressModal = ({ selectedMonth, project }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  useEffect(() => {
    getProjectDataDtls()
  }, [])

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
      requestPath: 'getProjectProgressDtls',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const projectCode1 = []
  // const customerName1 = []
  const projectName1 = []
  const completeDate1 = []

  projectData.map(h => {
    return projectCode1.push(h.projectCode)
  })
  // projectData.map(h => {
  //   return customerName1.push(h.customerName)
  // })
  projectData.map(h => {
    return projectName1.push(h.projectName)
  })
  projectData.map(h => {
    return completeDate1.push(h.completedDate)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const projectCode2 = projectCode1.filter(distinctval)
  // const customerName2 = customerName1.filter(distinctval)
  const projectName2 = projectName1.filter(distinctval)
  const completeDate2 = completeDate1.filter(distinctval)

  const projectCode3 = []
  // const customerName3 = []
  const projectName3 = []
  const completeDate3 = []

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })

  // customerName2.map(element => {
  //   return customerName3.push({
  //     text: element,
  //     value: element,
  //   })
  // })

  projectName2.map(element => {
    return projectName3.push({
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
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filterData.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    // {
    //   title: 'Customer Name',
    //   dataIndex: 'customerName',
    //   key: 'customerName',
    //   filters: customerName3,
    //   filteredValue: filterData.customerName,
    //   onFilter: (value, record) => record?.customerName=== value,
    // },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filterData.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },

    {
      title: 'Planned Start Date',
      dataIndex: 'planStartDate',
      key: 'planStartDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Planned Completed Date',
      dataIndex: 'planEndDate',
      key: 'planEndDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Actual Completed Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
  ]

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

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

export default ProjectInProgressModal
