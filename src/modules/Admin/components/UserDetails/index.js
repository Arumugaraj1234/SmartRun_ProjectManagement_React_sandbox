import React, { useEffect, useState } from 'react'
import store from 'store'
import { Card, Skeleton, Select, Form, Input, message, AutoComplete } from 'antd'
import { EyeOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import { Table } from 'ant-table-extensions'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import TextBox from '../../../../components/shared/InputComponent'

import getEmployeeService from '../../../../services/common/getDepartmentAndEmployeeDropDownDataService'
import currentDateTime from '../../../../currentDateTime'

const UserDetails = () => {
  const [empDtlform] = Form.useForm()
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [empTbl, setEmployeeTbl] = useState([])
  const [empTblData, setEmployeeTblData] = useState([])
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  // })
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [empDtl, setEmpDetail] = useState(null)
  const [empDesig, setEmpDesig] = useState([])
  const [empStatus, setEmpStatus] = useState([])
  const [empRole, setEmpRole] = useState([])
  const [dept, setDeptEmp] = useState([])
  const [disable, setDisable] = useState(false)
  const [filtersInfo, setfilterinfo] = useState([])
  const [isView, setIsView] = useState(null)
  const [employeeList, setEmployeeList] = useState([])
  // const [disableField, setdisableField] = useState(true)
  const [createUser, setCreateUser] = useState(false)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedDept, setSelectedDept] = useState(null)

  // const [isDisplay, setIsDisplay] = useState(false)

  useEffect(() => {
    getuserCreateFlag()
    getEmployeeUserDtl()
    getEmpDesig()
    getEmpStatus()
    getDeptAndEmp()
    getEmpRole()
    getEmployeeList()
  }, [])

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

  const employeeName = empTbl ? empTbl.map(h => h.employeeName) : []
  const empployeeDesg = empTbl ? empTbl.map(h => h.userRole) : []
  const empUserName = empTbl ? empTbl.map(h => h.userName) : []
  const employeeStatus = empTbl ? empTbl.map(h => h.employeeStatus) : []
  const employeeDept = empTbl ? empTbl.map(h => h.department) : []
  const employeeRole = empTbl ? empTbl.map(h => h.userRole) : []
  const clientDesign1 = empTbl ? empTbl.map(h => h.clientDesign) : []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const filterempName = employeeName.filter(distinct)
  const filterempDesg = empployeeDesg.filter(distinct)
  const filterempUserName = empUserName.filter(distinct)
  const filterempStatus = employeeStatus.filter(distinct)
  const filterempDept = employeeDept.filter(distinct)
  const filterempRole = employeeRole.filter(distinct)
  const clientDesign2 = clientDesign1.filter(distinct)

  const FilterEmpName = filterempName.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEmpDesg = filterempDesg.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEmpUserName = filterempUserName.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEmpStatus = filterempStatus.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEmpDept = filterempDept.map(element => ({
    text: element,
    value: element,
  }))
  const FilterEmpRole = filterempRole.map(element => ({
    text: element,
    value: element,
  }))
  const clientDesign3 = clientDesign2.map(element => ({
    text: element,
    value: element,
  }))

  const FilterChange = (pag, filters) => {
    setfilterinfo(filters)
  }

  // const handlePageChange = page => {
  //   setPagination(prevPagination => ({
  //     ...prevPagination,
  //     current: page,
  //   }))
  // }

  const getEmpDesig = async () => {
    const obj = {
      tenantId,
      departmentId: '',
      employeeId: '',
    }
    const response = await indentFileUpload({
      requestPath: 'getEmpDesignation',
      requestData: obj,
    })
    if (response) {
      const options = response.responseData.map(item => ({
        key: item.desigCode,
        value: item.desigName,
        label: item.desigName,
      }))
      setEmpDesig(options)
    }
  }
  const getEmpStatus = async () => {
    const obj = {
      tenantId,
      departmentId: '',
      employeeId: '',
    }
    const response = await indentFileUpload({
      requestPath: 'getEmpStatus',
      requestData: obj,
    })
    if (response) {
      setEmpStatus(response.responseData)
    }
  }

  const getEmployeeList = async (deptId, empStsCode) => {
    if (!deptId || !empStsCode) {
    setEmployeeList([]);
    form.setFieldsValue({ fromEmployee: undefined });
    return;
  }
    const obj = {
      tenantId,
      departmentId: deptId, 
      employmentStatusCode: empStsCode,
    }

    const response = await indentFileUpload({
      requestPath: 'getEmpdetails',
      requestData: obj,
    })

    if (response && Array.isArray(response.responseData) && response.responseData.length > 0) {
    const options = response.responseData.map(item => ({
      key: item.employeeId,
      value: item.employeeFirstName,
    }))
    setEmployeeList(options)
    form.setFieldsValue({ fromEmployee: undefined })
  } else {
    setEmployeeList([])
    form.setFieldsValue({ fromEmployee: undefined })
  }
}

  // const handleDepartmentChange = value => {
  //   getEmployeeList(value)
  // }
  const handleDepartmentChange = value => {
  setSelectedDept(value);

  if (selectedStatus) {
    getEmployeeList(value, selectedStatus)
  } else {
    setEmployeeList([])
    form.setFieldsValue({ fromEmployee: undefined })
  }
}

const handleStatusChange = value => {
  setSelectedStatus(value);

  if (selectedDept) {
    getEmployeeList(selectedDept, value)
  } else {
    setEmployeeList([])
    form.setFieldsValue({ fromEmployee: undefined })
  }
}

  const getuserCreateFlag = async () => {
    const obj = {
      tenantID: tenantId,
      empId: employeeId,
    }
    const response = await indentFileUpload({
      requestPath: 'createUserDetailsEnable',
      requestData: obj,
    })
    if (response.responseCode === '200') {
      if (parseInt(response?.responseDataMessage, 10) > 0) {
        setCreateUser(true)
      }
    }
  }
  const getEmpRole = async () => {
    const obj = {
      tenantId,
      departmentId: '',
      employeeId: '',
    }
    const response = await indentFileUpload({
      requestPath: 'getEmpRole',
      requestData: obj,
    })
    if (response) {
      setEmpRole(response.responseData)
    }
  }
  const getDeptAndEmp = async () => {
    const response = await getEmployeeService({
      tenantId,
      isActive: '1',
      employeID: '',
    })
    let data = []
    if (response !== null && response !== undefined && response.length > 0) {
      data = response
    } else {
      data = ''
    }
    setDeptEmp(data)
  }

  const getEmployeeUserDtl = async () => {
    setLoading(true)
    try {
      const obj = {
        tenantId,
        departmentId: '',
        employeeId,
      }

      const response = await indentFileUpload({
        requestPath: 'getEmployeeUserDtlForDept',
        requestData: obj,
      })

      if (response) {
        if (response.responseCode === '200') {
          setLoading(false)
          if (response.responseData.length > 0) {
            if (response.responseData.length > 1) {
              setDisable(false)
            } else {
              setDisable(true)
            }
            const updatedData = response.responseData.map((item, index) => {
              return { ...item, sno: index + 1 }
            })
            setEmployeeTbl(updatedData)
            setEmployeeTblData(updatedData)
          } else {
            setEmployeeTbl([])
            setEmployeeTblData([])
          }
        } else {
          setLoading(false)
          setEmployeeTbl([])
          setEmployeeTblData([])
        }
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDetails = async rec => {
    getEmpDesig()
    setSelectedDept(rec.deptCode);
    setSelectedStatus(rec.emplStatus);
    empDtlform.setFieldsValue({
      designation: rec.designation,
      status: rec.emplStatus,
      role: rec.userRoleId,
      department: rec.deptCode,
      name: rec.employeeName,
      email: rec.emailId,
      empid: rec.empCode,
      clientDesign: rec.clientDesign,
    })
    form.setFieldsValue({
      fromEmployee: rec.fromEmployee ?? undefined, 
      toEmployee: rec.employeeName,
    })
    await getEmployeeList(rec.deptCode, rec.emplStatus);
    setEmpDetail(rec)
    setIsModalVisible(true)
    setIsView(0)
  }
  const handleClear = () => {
    if (isView === 0) {
      empDtlform.setFieldsValue({
        designation: empDtl.designation,
        status: empDtl.employeeStatus,
        role: empDtl.userRole,
        department: empDtl.deptCode,
        name: empDtl.employeeName,
        password: '',
        email: empDtl.emailId,
        clientDesign: empDtl.clientDesign,
      })
      form.setFieldsValue({ toEmployee: empDtl.employeeName })
    } else {
      empDtlform.resetFields()
    }
  }

  const handleClose = () => {
    setIsModalVisible(false)
    handleClear()
    // setdisableField(true)
    form.resetFields(['fromEmployee', 'toEmployee', 'name'])

    setEmployeeList([])
  }

  const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(email)) {
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (isView === 0) {
      try {
        const formValues = empDtlform.getFieldsValue()
        const isMandatory =
          empTbl.length > 1
            ? (formValues.designation !== undefined && formValues.designation !== '') ||
              formValues.status !== undefined ||
              formValues.role !== undefined ||
              formValues.department !== undefined ||
              (formValues.empid !== undefined && formValues.empid !== '') ||
              (formValues.name !== undefined && formValues.name !== '') ||
              (formValues.email !== undefined && formValues.email !== '') ||
              (formValues.password !== undefined && formValues.password !== '')
            : (formValues.name !== undefined && formValues.name !== '') ||
              (formValues.password !== undefined && formValues.password !== '')
        if (isMandatory) {
          if (validateEmail(formValues.email)) {
            const fromEmployee = form.getFieldValue('fromEmployee')
            const obj = {
              tenantId,
              empName: formValues.name,
              password: formValues.password !== undefined ? formValues.password : '',
              status: formValues.status,
              designation: formValues.designation,
              department: formValues.department,
              role: formValues.role,
              empId: empDtl.employeeId,
              emailId: formValues.email,
              empCode: formValues.empid,
              clientDesign: formValues.clientDesign || '',
              fromEmployee,
            }

            const response = await indentFileUpload({
              requestPath: 'updateEmployeeDtl',
              requestData: obj,
            })
            if (response) {
              if (response.responseCode === '200') {
                message.success(response.responseMessage)
                getEmployeeUserDtl()
                setIsModalVisible(false)
                handleClear()
              } else {
                message.error(response.responseMessage)
              }
            }
          } else {
            messageReturn(628)
          }
        } else {
          messageReturn(405)
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        const formValues = empDtlform.getFieldsValue()
        const isMandatory =
          formValues.designation !== undefined &&
          formValues.designation !== '' &&
          formValues.status !== undefined &&
          formValues.role !== undefined &&
          formValues.department !== undefined &&
          formValues.email !== undefined &&
          formValues.email !== '' &&
          formValues.name !== undefined &&
          formValues.name !== '' &&
          formValues.password !== undefined &&
          formValues.password !== '' &&
          formValues.empid !== undefined &&
          formValues.empid !== ''
        if (isMandatory) {
          if (validateEmail(formValues.email)) {
            const fromEmployee = form.getFieldValue('fromEmployee')
            const obj = {
              tenantId,
              empName: formValues.name,
              password: formValues.password,
              status: formValues.status,
              designation: formValues.designation,
              designationCode: formValues.designationCode,
              department: formValues.department,
              role: formValues.role,
              empId: formValues.empid,
              emailId: formValues.email,
              clientDesign: formValues.clientDesign || '',
              fromEmployee,
            }

            const response = await indentFileUpload({
              requestPath: 'insertEmployeeDtl',
              requestData: obj,
            })
            if (response) {
              if (response.responseCode === '200') {
                message.success(response.responseDataMessage)
                getEmployeeUserDtl()
                setIsModalVisible(false)
              } else {
                message.error(response.responseDataMessage)
              }
            }
          } else {
            messageReturn(628)
          }
        } else {
          messageReturn(405)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const EmpDtlComponent = () => {
    // const [form] = Form.useForm()
    return (
      <div>
        <Form form={form} layout="vertical">
          <Form form={empDtlform} layout="vertical" labelAlign="left">
            <div className="row form_datas">
              <div className="col-md-3">
                <Form.Item
                  name="empid"
                  label={
                    <span>
                      Employee ID<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <TextBox placeholder="EMP ID" maxLengthEnabled="true" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="designation"
                  label={
                    <span>
                      Approval Level<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <AutoComplete
                    style={{ width: 200 }}
                    placeholder="Select Designation"
                    options={empDesig}
                    filterOption={(inputValue, option) =>
                      option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onSelect={(value, option) =>
                      empDtlform.setFieldsValue({ designation: value, designationCode: option.key })
                    }
                    onSearch={value => empDtlform.setFieldsValue({ designation: value })}
                    disabled={disable}
                  />
                </Form.Item>
                <Form.Item name="designationCode" style={{ display: 'none' }}>
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="status"
                  label={
                    <span>
                      Status<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    placeholder="Select Status"
                    disabled={disable}
                    style={{ width: '200px' }}
                    onChange={handleStatusChange}
                    // onChange={(value, option) => handleSelectChange(value, option)}
                  >
                    {empStatus &&
                      empStatus.map(item => (
                        <Option key={item.statusCode} value={item.statusCode}>
                          {item.statusName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="department"
                  label={
                    <span>
                      Department<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    placeholder="Select Department"
                    style={{ width: '200px' }}
                    disabled={disable}
                    // onChange={(value, option) => handleSelectChange(value, option)}
                    onChange={handleDepartmentChange}
                  >
                    {dept &&
                      dept.map(item => (
                        <Option key={item.departmentCode} value={item.departmentCode}>
                          {item.departmentName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="role"
                  label={
                    <span>
                      Role<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select
                    placeholder="Select Role"
                    style={{ width: '200px' }}
                    disabled={disable}
                    // onChange={(value, option) => handleSelectChange(value, option)}
                  >
                    {empRole &&
                      empRole.map(item => (
                        <Option key={item.roleCode} value={item.roleCode}>
                          {item.roleName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="name"
                  label={
                    <span>
                      Name<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  {/* <TextBox placeholder="Name" /> */}
                  <Input
                    placeholder="Name"
                    onChange={e => {
                      const nameValue = e.target.value
                      form.setFieldsValue({ toEmployee: nameValue })
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="email"
                  label={
                    <span>
                      Email ID<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                  rules={[
                    {
                      type: 'email',
                    },
                  ]}
                >
                  <TextBox placeholder="Email Id" />
                </Form.Item>
              </div>

              <div className="col-md-3">
                <Form.Item
                  name="password"
                  label={
                    <span>
                      Password<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input.Password
                    placeholder="Password"
                    iconRender={visible => (visible ? <EyeOutlined /> : <EyeOutlined />)}
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  name="clientDesign"
                  label={
                    <span>
                      Designation<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input placeholder="Designation" />
                </Form.Item>
              </div>
            </div>
          </Form>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Assign Projects</span>
          </div>
          <div style={{ margin: '16px 0' }}>
            <hr />
          </div>
          <div className="row">
            <div className="col-md-3">
              <Form.Item name="fromEmployee" label={<span>From Employee</span>} colon={false}>
                <Select placeholder="Select Employee" style={{ width: '200px' }}>
                  {employeeList.map(emp => (
                    <Option key={emp.key} value={emp.key}>
                      {emp.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item name="toEmployee" label="To Employee" colon={false}>
                <Input
                  placeholder=""
                  readOnly
                  style={{ cursor: 'not-allowed', backgroundColor: '#f5f5f5' }}
                />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent
              type="primary"
              text="Submit"
              marginright="10px"
              onClick={handleSubmit}
            />
            <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
          </div>
        </Form>
      </div>
    )
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      // render: (_, __, index) => calculateSno(index)
    },
    {
      title: 'Employee ID',
      dataIndex: 'empCode',
      key: 'empCode',
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      filters: FilterEmpName,
      filteredValue: filtersInfo.employeeName,
      onFilter: (value, record) => record?.employeeName === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: FilterEmpDept,
      filteredValue: filtersInfo.department,
      onFilter: (value, record) => record?.department === value,
    },
    {
      title: 'Approval Level',
      dataIndex: 'designation',
      key: 'designation',
      filters: FilterEmpDesg,
      filteredValue: filtersInfo.designation,
      onFilter: (value, record) => record?.designation === value,
    },
    {
      title: 'User Role',
      dataIndex: 'userRole',
      key: 'userRole',
      filters: FilterEmpRole,
      filteredValue: filtersInfo.userRole,
      onFilter: (value, record) => record?.userRole === value,
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      filters: FilterEmpUserName,
      filteredValue: filtersInfo.userName,
      onFilter: (value, record) => record?.userName === value,
    },
    {
      title: 'Employee Status',
      dataIndex: 'employeeStatus',
      key: 'employeeStatus',
      filters: FilterEmpStatus,
      filteredValue: filtersInfo.employeeStatus,
      onFilter: (value, record) => record?.employeeStatus === value,
    },
    {
      title: 'Designation',
      dataIndex: 'clientDesign',
      key: 'clientDesign',
      filters: clientDesign3,
      filteredValue: filtersInfo.clientDesign,
      onFilter: (value, record) => record?.clientDesign === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ButtonComponent
            type="primary"
            text="Action"
            onClick={() => handleDetails(record, index)}
          />
        </div>
      ),
    },
  ]
  const handleSearch = e => {
    const filtered = empTblData.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      ),
    )
    setEmployeeTbl(filtered)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="User Details">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          {createUser && (
            <ButtonComponent
              type="primary"
              text="Create New User"
              onClick={() => {
                setIsModalVisible(true)
                // setdisableField(false)
                setIsView(1)
                empDtlform.resetFields()
                form.resetFields(['fromEmployee'])
                form.setFieldsValue({ toEmployee: '' })
                getEmpDesig()
              }}
            />
          )}
        </div>
        {/* <div style={{ marginTop: '10px', display: isDisplay ? 'block' : 'none' }}> */}
        <Skeleton loading={loading} active>
          <Input.Search
            style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
            placeholder="Search here..."
            enterButton
            // onSearch={handleSearch}
            onChange={e => handleSearch(e)}
          />
          <Table
            dataSource={empTbl}
            columns={columns}
            // pagination={{ ...pagination, onChange: handlePageChange }}
            exportableProps={{
              fileName: `User_Details_${currentDateTime}`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            scroll={{ y: 400 }}
            handleChange={FilterChange}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [empTbl?.length]],
              showSizeChanger: true,
              defaultPageSize: 50,
            }}
          />
        </Skeleton>
        {/* </div> */}
      </Card>
      <ModalPopup
        text="Employee Details"
        isModalVisible={isModalVisible}
        onCancel={handleClose}
        FieldsComponent={EmpDtlComponent}
        width={950}
      />
    </div>
  )
}

export default UserDetails
