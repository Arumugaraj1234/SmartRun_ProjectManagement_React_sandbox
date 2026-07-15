import React, { useState, useEffect } from 'react'
import { Table, message } from 'antd'
import store from 'store'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import AutoCompleteComponent from 'components/shared/AutoCompleteComponent'
import DropDownComponent from '../../shared/DropDownComponent'
import Button1 from '../../shared/ButtonComponent'
import AssignTeamInsert from '../AssignTeamInsert'
import AssignTeamGetDtlService from '../../../services/common/AssignTeamGetDtlService'
import InsertAssignTeamDataService from '../../../services/common/InsertAssignTeamDataService'
// import getDepartmentAndEmployeeDropDownDataService from '../../../services/common/getDepartmentAndEmployeeDropDownDataService'
import deleteAssignTeamdataService from '../../../services/common/deleteAssignTeamdataService'
import getEmployeeDropDownDataService from '../../../services/common/getEmployeeDropDownDataService'
import BackButtonComponent from '../BackBtnComponent'

// console.log(employeID)
const AssignTeam = ({ component }) => {
  const Tab = store.get('Tab')
  const employeID = store.get('employeeId')
  const deptId = store.get('depCode')
  const { mstId, tenantId, processCode, ProjectID } = Tab

  const [insertRow, setInsertRow] = useState({
    employeeDept: '',
    employeeID: '',
  })
  const [departmentData, setDepartmentData] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [data, setData] = useState([])
  const [emp, setEmp] = useState([])
  const [empName, setEmpName] = useState('')
  // const [deptCode, setdeptCode] = useState('')
  const [deptName, setDeptName] = useState('')
  const [showUploadList, setShowUploadList] = useState('')
  const [filtersinfo, setfilterinfo] = useState([])

  const NewEmployeeName = value => {
    setEmp(value)
  }

  useEffect(() => {
    onLoadFunc()
    getDepartmentDropDownData()
  }, [])

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const onLoadFunc = async () => {
    try {
      const response = await fetchAssignTeamServicedata()

      if (response) {
        setData(response.processAssignedTeamEntity)
        setShowUploadList(response.assignTeam)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleRemove = record => {
    deleteAssignTeamdata(record.empId)
    fetchAssignTeamServicedata()
  }
  const deleteAssignTeamdata = async empdata => {
    try {
      const returnData = await deleteAssignTeamdataService({
        tenantId,
        employeeID: empdata,
        referenceId: mstId,
        referenceDoc: processCode,
      })
      if (returnData) {
        message.success(returnData.responseMessage)
      }
      fetchAssignTeamServicedata()
      return returnData
    } catch (error) {
      console.error('Error fetching deleteAssignTeamdata:', error)
      return []
    }
  }

  const fetchAssignTeamServicedata = async () => {
    try {
      const returnData = await AssignTeamGetDtlService({
        tenantId,
        employeeID: employeID,
        referenceId: mstId,
        referenceDoc: processCode,
      })
      if (returnData) {
        setData(returnData?.processAssignedTeamEntity)
        setShowUploadList(returnData.assignTeam)
      }
      return returnData
    } catch (error) {
      console.error('Error fetching AssignTeamGetDtlService:', error)
      return []
    }
  }

  const InsertAssignTeamData = async () => {
    try {
      const returnData = await InsertAssignTeamDataService({
        tenantId,
        employeeID: emp,
        referenceId: mstId,
        referenceDoc: processCode,
        projectId: ProjectID,
      })
      setInsertRow(() => {
        return {
          employeeDept: '',
          employeeID: '',
        }
      })
      console.log(insertRow)
      if (returnData.responseCode === '200') {
        message.success(returnData.responseMessage)
        setEmp('')
        // setdeptCode('')
        setDeptName('')
        setEmpName('')
      }
      if (returnData.responseCode !== '200') {
        message.error(returnData.responseMessage)
      }

      fetchAssignTeamServicedata()
      return returnData
    } catch (error) {
      setInsertRow(() => {
        return {
          employeeDept: '',
          employeeID: '',
        }
      })
      setEmp('')
      // setdeptCode('')
      setDeptName('')
      setEmpName('')
      console.error('Error fetching InsertAssignTeamData:', error)
      return []
    }
  }

  const getDepartmentDropDownData = async () => {
    try {
      const props = {
        pmId: processCode,
        tenantId,
        deptCode: deptId,
      }
      const returnData = await IndentGroupgetDetails({
        requestPath: 'getDeptForPM',
        requestData: props,
      })

      const departmentCodes = returnData?.[0]?.departmentCode.split(',')
      const departmentNames = returnData?.[0]?.departmentName.split(',')

      const options = departmentCodes.map((code, index) => ({
        key: code.trim(),
        value: departmentNames[index].trim(),
      }))
      setDepartmentData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
      return []
    }
  }

  const getEmployeeDropDownData = async departmtCode => {
    try {
      const returnData = await getEmployeeDropDownDataService({
        tenantId,
        departmentId: departmtCode,
      })
      const options = returnData.map(item => ({ key: item.employeeId, value: item.employeeName }))
      // setEmployeeData(returnData)
      setEmployeeData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getEmployeeDropDownData:', error)
      return []
    }
  }

  const AssignTeamInsertMethod = () => {
    // need to call insert method here
    InsertAssignTeamData()
    // fetchAssignTeamServicedata()
    setInsertRow(prevInsertRow => {
      console.log(prevInsertRow) // Log the previous state before updating
      return {
        employeeDept: '',
        employeeID: '',
      }
    })
    // setdeptCode('')
    setEmp('')
  }

  const handleInputChange = (fieldName, value, option) => {
    console.log(value)
    setInsertRow(prevData => ({
      ...prevData,
      [fieldName]: option.key,
    }))

    if (fieldName === 'employeeID') {
      setEmp(option.key)
      setEmpName(option.value)
    }
    if (fieldName === 'employeeDept') {
      // setdeptCode(option.key)
      setDeptName(option.value)
      getEmployeeDropDownData(option.key)
    }
  }

  const insertData = [
    {
      key: 1,
      employeeDept: 'Mechanical',
      employeeID: 'Sindhu',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
    },
  ]

  const insertColumn = [
    {
      title: 'Department',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      render: () => (
        <DropDownComponent
          data={departmentData}
          value={deptName}
          onChange={text => setDeptName(text)}
          onSelect={(value, option) => handleInputChange('employeeDept', value, option)}
          onBlur={value => NewEmployeeName(value)}
        />
      ),
    },
    {
      title: 'Team Member',
      dataIndex: 'employeeID',
      key: 'employeeID',
      render: () => (
        <AutoCompleteComponent
          data={employeeData}
          value={empName}
          onChange={text => setEmpName(text)}
          onSelect={(value, option) => handleInputChange('employeeID', value, option)}
          onBlur={value => NewEmployeeName(value)}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'employeeID',
      render: () => (
        <Button1 onClick={AssignTeamInsertMethod} text="Save" type="primary" marginright="10px" />
      ),
    },
  ]

  const employeeDept1 = []
  const employeeName1 = []

  if (data) {
    data.map(h => {
      return employeeDept1.push(h.employeeDept)
    })
    data.map(h => {
      return employeeName1.push(h.employeeName)
    })
  }
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const employeeDept2 = employeeDept1.filter(distinct)
  const employeeName2 = employeeName1.filter(distinct)

  const employeeDept3 = []
  const employeeName3 = []

  employeeDept2
    .filter(e => e != null && e !== '')
    .map(e => (typeof e === 'string' ? e.trim() : e))
    .sort((a, b) =>
      String(a).localeCompare(String(b), undefined, {
        sensitivity: 'base',
      }),
    )
    .forEach(element => {
      employeeDept3.push({
        text: element,
        value: element,
      })
    })

  employeeName2
    .filter(e => e != null && e !== '')
    .map(e => (typeof e === 'string' ? e.trim() : e))
    .sort((a, b) =>
      String(a).localeCompare(String(b), undefined, {
        sensitivity: 'base',
      }),
    )
    .forEach(element => {
      employeeName3.push({
        text: element,
        value: element,
      })
    })

  const columns = [
    {
      title: 'Department',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      render: text => text,
      filters: employeeDept3,
      filteredValue: filtersinfo.employeeDept,
      onFilter: (value, record) => record?.employeeDept === value,
    },
    {
      title: 'Team Member',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: text => text,
      filters: employeeName3,
      filteredValue: filtersinfo.employeeName,
      onFilter: (value, record) => record?.employeeName === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <RemoveIcon
          onClick={() => handleRemove(record)}
          disableInputBoxes={showUploadList !== '1'}
        />
      ),
    },
  ]

  return (
    <div>
      <div>
        <h5>Team Member Allocated</h5>
        <Table dataSource={data} columns={columns} onChange={handleChange} pagination={false} />
      </div>
      {showUploadList && showUploadList === '1' ? (
        <AssignTeamInsert column={insertColumn} data={insertData} />
      ) : null}
      <div>
        {component !== 'scmind' ? <BackButtonComponent componentToRender={component} /> : null}
      </div>
    </div>
  )
}

export default AssignTeam
