import React, { useEffect, useState } from 'react'
import { Card, Form, Select, message, Skeleton, Checkbox, AutoComplete } from 'antd'
import store from 'store'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import './style.scss'

const RoleScreenMap = () => {
  const { Option } = Select
  const [rolescreenform] = Form.useForm()
  const [Checkboxfrom] = Form.useForm()
  const [moduleLst, setModule] = useState([])
  const [empRole, setEmpRole] = useState([])
  const [roleScreenDtl, setRoleScreenDtl] = useState([])
  // const [isDisplay, setIsDisplay] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRoleid, setUserRoleid] = useState(null)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const tenantId = store.get('tenantId')

  useEffect(() => {
    getModuleLst()
    getEmpRole()
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
  const getModuleLst = async () => {
    const obj = {
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getModuleMstDtls',
      requestData: obj,
    })
    if (response) {
      setModule(response.responseData)
    }
  }

  const handleClear = () => {
    rolescreenform.resetFields()
    Checkboxfrom.resetFields()
    setRoleScreenDtl([])
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
      if (response.responseCode === '200') {
        const options = response.responseData.map(item => ({
          key: item.roleCode,
          value: item.roleName,
        }))
        setEmpRole(options)
      }
    }
  }

  const getRoleScreenDtl = async () => {
    const formValues = rolescreenform.getFieldsValue()
    if (formValues.userrole !== undefined && formValues.module !== undefined) {
      // setIsDisplay(true)
      setIsLoading(true)
      const obj = {
        tenantId,
        roleId: formValues.userrole,
        moduleId: formValues.module,
      }
      const response = await indentFileUpload({
        requestPath: 'getModuleBasedScreenDtls',
        requestData: obj,
      })
      if (response) {
        setIsLoading(false)
        const upadatedRec =
          response.responseData &&
          response.responseData.map((data, ind) => {
            return {
              sno: ind + 1,
              isEditable: 0,
              ...data,
            }
          })
        if (response?.responseData && response?.responseData.length > 0) {
          const roleId = response?.responseData[0].roleId
          setUserRoleid(roleId)
        }

        setRoleScreenDtl(upadatedRec)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleCheckboxChange = record => {
    const updatedData = roleScreenDtl.map(item => {
      if (item.screenMstId === record.screenMstId) {
        return {
          ...item,
          isActive: !item.isActive,
          isEditable: item.isEditable === 0 ? 1 : 0,
        }
      }
      return item
    })
    setRoleScreenDtl(updatedData)
  }
  const handleSubmit = async () => {
    console.log(roleScreenDtl)
    try {
      const updatedArr =
        roleScreenDtl &&
        roleScreenDtl
          .filter(filterData => filterData.isEditable === 1)
          .map(data => {
            return {
              tenantId,
              roleId: userRoleid,
              uiScreenMstId: data.screenMstId,
              isActive: data.isActive === (true || 1) ? 1 : 0,
            }
          })
      if (updatedArr.length > 0) {
        const response = await indentFileUpload({
          requestPath: 'updateUserRoleMapping',
          requestData: updatedArr,
        })
        if (response) {
          if (response.responseCode === '200') {
            message.success(response.responseDataMessage)
            getRoleScreenDtl()
          } else {
            message.error(response.responseDataMessage)
          }
        }
      } else {
        messageReturn(627)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Module',
      dataIndex: 'moduleDesc',
      key: 'moduleDesc',
    },
    {
      title: 'Screen',
      dataIndex: 'screenDesc',
      key: 'screenDesc',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record, index) => (
        <Form form={Checkboxfrom}>
          <Form.Item name={`active_${index}`} initialValue={record.isActive}>
            <Checkbox
              style={{ borderColor: 'black' }}
              checked={record.isActive}
              onChange={() => handleCheckboxChange(record)}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Role Screen Map">
        <Form form={rolescreenform} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-2">
              <Form.Item
                name="userrole"
                label={
                  <span>
                    User Role<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <AutoComplete
                  style={{ width: 200 }}
                  placeholder="Select User role"
                  options={empRole}
                  filterOption={(inputValue, option) =>
                    option && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={value => {
                    rolescreenform.setFieldsValue({ userrole: value })
                    getRoleScreenDtl()
                    Checkboxfrom.resetFields()
                  }}
                  onSearch={value => rolescreenform.setFieldsValue({ userrole: value })}
                />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item
                name="module"
                label={
                  <span>
                    Modules<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Module"
                  style={{ width: '200px' }}
                  onSelect={() => {
                    getRoleScreenDtl()
                    Checkboxfrom.resetFields()
                  }}
                >
                  {moduleLst &&
                    moduleLst.map(item => (
                      <Option key={item.moduleId} value={item.moduleId}>
                        {item.desc}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* <ButtonComponent
          type="primary"
          text="Get Details"
          marginright="10px"
          onClick={getRoleScreenDtl}
        /> */}
          <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
        </div>
        {roleScreenDtl && roleScreenDtl.length > 0 && (
          <div style={{ marginTop: '5px' }}>
            <h5>Role Screen Map Details</h5>
            <Skeleton loading={isLoading} active>
              <div className="custom_antd_Table">
                <Table dataSource={roleScreenDtl} columns={columns} />
              </div>
            </Skeleton>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ButtonComponent
                type="primary"
                text="Submit"
                marginright="10px"
                onClick={handleSubmit}
              />
              <ButtonComponent
                type="primary"
                text="Cancel"
                onClick={() => {
                  // setIsDisplay(false)
                  Checkboxfrom.resetFields()
                  handleClear()
                  setRoleScreenDtl([])
                }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default RoleScreenMap
