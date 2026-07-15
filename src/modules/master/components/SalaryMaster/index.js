import React, { useEffect, useState } from 'react'
import { Card, Select, Form, Row, Button, Divider, Input, message } from 'antd'
import { Table } from 'ant-table-extensions'
import store from 'store'
import { useMediaQuery } from 'react-responsive'
import ModalPopup from 'components/shared/ModalPopupComponent'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from '../../../../components/shared/ButtonComponent'

import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const SalaryMaster = () => {
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const { Option } = Select
  const [isDisplay, setIsDisplay] = useState(false)
  const [depList, setdepList] = useState([])
  const [empdtlList, setempdtlList] = useState([])
  const [empdtlvisible, setempdtlvisible] = useState(false)
  const [singleempDetail, setSingleempDetail] = useState({})
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const tenantid = store.get('tenantId')

  useEffect(() => {
    DepartmentDropDown()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call to set width on component mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  const removeCommas = value => {
    if (!value) {
      return 0
    }
    const valuse = value.replace(/,/g, '')
    return valuse
  }

  const DepartmentDropDown = async () => {
    const formData = form.getFieldsValue()
    if (formData.Employee !== '') {
      try {
        const response = await indentFileUpload({
          requestPath: 'getDepartmentAndEmpInfo',
          requestData: {
            isActive: '1',
            tenantId: tenantid,
            employeID: '',
          },
        })
        if (response) {
          setdepList(response)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  const empName1 = []
  const desig1 = []
  const empstatus1 = []

  empdtlList.forEach(h => {
    empName1.push(h.employeeFirstName)
  })
  empdtlList.forEach(h => {
    desig1.push(h.designationName)
  })
  empdtlList.forEach(h => {
    empstatus1.push(h.employeeStatusName)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const empName2 = empName1.filter(distinct)
  const desig2 = desig1.filter(distinct)
  const empstatus2 = empstatus1.filter(distinct)

  const empName3 = []
  const desig3 = []
  const empstatus3 = []

  empName2.forEach(element => {
    empName3.push({
      text: element,
      value: element,
    })
  })
  desig2.forEach(element => {
    desig3.push({
      text: element,
      value: element,
    })
  })
  empstatus2.forEach(element => {
    empstatus3.push({
      text: element,
      value: element,
    })
  })

  const column = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeFirstName',
      key: 'employeeFirstName ',
      filters: empName3,
      // filteredValue: filtersinfo.employeeFirstName || null,
      onFilter: (value, record) => record?.employeeFirstName === value,
      render: text => text,
    },
    {
      title: 'Designation',
      dataIndex: 'designationName',
      key: 'designationName',
      filters: desig3,
      // filteredValue: filtersinfo.designationName || null,
      onFilter: (value, record) => record?.designationName === value,
      render: text => text,
    },
    {
      title: 'Employee Status',
      dataIndex: 'employeeStatusName',
      key: 'employeeStatusName',
      filters: empstatus3,
      // filteredValue: filtersinfo.employeeStatusName || null,
      onFilter: (value, record) => record?.employeeStatusName === value,
      render: text => text,
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Cost / Month ',
      dataIndex: 'approxSalary',
      key: 'approxSalary',
      value: currencyFormat('approxSalary'),
      align: 'right',
      render: text => (
        <div style={{ textAlign: 'right' }}>
          {text !== undefined && text !== null
            ? parseFloat(text).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : ''}
        </div>
      ),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (record, index) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setempdtlvisible(true)
              setempdtlcard(record, index)
            }}
          >
            Details
          </Button>
        </div>
      ),
    },
  ]
  const setempdtlcard = (_record, index) => {
    setSingleempDetail(index)
    form2.setFieldsValue({
      EmpId: index.employeeCode,
      EmpName: index.employeeFirstName,
      Designation: index.designationName,
      Email: index.emailId,
      Department: index.departmentName,
      Salary: index.approxSalary,
    })
  }
  const opendtlcard = () => {
    return (
      <div>
        <Form form={form2}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="EmpId"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Employee Code<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="EmpName"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={<span>Employee Name</span>}
              >
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item name="Designation" label={<span>Designation</span>}>
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                name="Department"
                label={<span>Department</span>}
              >
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Email"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={<span>Email</span>}
              >
                <Input type="text" disabled />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Salary"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Cost / Month<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="number" style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={updateSalary}>
              Save
            </Button>
            <Button type="primary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  const handleSubmitPrDtl = async () => {
    const formData = form.getFieldsValue()
    if (formData.Department !== undefined) {
      setIsDisplay(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'getEmpdetails',
          requestData: {
            departmentId: formData.Department,
            tenantId: tenantid,
            employeeId: '',
          },
        })
        if (response) {
          if (response?.responseCode === '200') {
            const updatedData = response?.responseData.map((data, ind) => {
              return {
                ...data,
                sno: ind + 1,
              }
            })
            setempdtlList(updatedData)
            // setfilteredvendor(response?.responseData)
            // message.success(response?.responseMessage)
          } else {
            form1.resetFields()
            message.error(response.responseMessage)
          }
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      messageReturn(405)
    }
  }
  const updateSalary = async () => {
    const formData = form2.getFieldsValue()
    if (
      formData.EmpId !== '' &&
      formData.EmpId !== undefined &&
      formData.Salary !== '' &&
      formData.Salary !== undefined
    ) {
      try {
        const response = await indentFileUpload({
          requestPath: 'updtempmstdetails',
          requestData: {
            salary: removeCommas(formData.Salary),
            tenantId: tenantid,
            empId: singleempDetail?.employeeId,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            message.success(response?.responseMessage)
            setIsDisplay(false)
            setempdtlvisible(false)
            handleSubmitPrDtl()
          } else {
            message.error(response?.responseMessage)
          }
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      messageReturn(405)
    }
  }
  const handleClear = () => {
    form.resetFields()
    form1.resetFields()
    setIsDisplay(false)
  }
  const handleCancel = () => {
    form1.resetFields()
    form2.resetFields()
    setempdtlvisible(false)
  }
  const handleDetailCancel = () => {
    form2.resetFields()
    setempdtlvisible(false)
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Cost">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-3">
              <Form.Item
                name="Department"
                label={
                  <span>
                    Department<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Department"
                  style={{ width: '200px' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  {depList &&
                    depList.map(item => (
                      <Option key={item.departmentCode} value={item.departmentCode}>
                        {item.departmentName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent
              type="primary"
              text="Get Details"
              marginright="10px"
              onClick={handleSubmitPrDtl}
            />
            <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
          </div>
        </Form>
        <Form form={form1}>
          <div style={{ marginTop: '40px', display: isDisplay ? 'block' : 'none' }}>
            <div>
              <Row>
                <Divider orientation="left">Employee Salary Details</Divider>
              </Row>
              <Table
                columns={column}
                dataSource={empdtlList}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [empdtlList?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                // onChange={handleChange}
              />
              {empdtlvisible ? (
                <ModalPopup
                  text="Update Employee Salary"
                  FieldsComponent={opendtlcard}
                  isModalVisible="setempdtlvisible"
                  width="900"
                  onCancel={() => {
                    handleDetailCancel()
                  }}
                />
              ) : null}
            </div>
          </div>
        </Form>
      </Card>
    </div>
  )
}
export default SalaryMaster
