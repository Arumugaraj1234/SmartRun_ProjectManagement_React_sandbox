import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { Table, Button, Input, Switch, Form, message, Modal } from 'antd'

const DetailTaskTemplate = ({ onClose, visible, data, getTemplateDetails }) => {
  const tenantId = store.get('tenantId')

  const empid = store.get('employeeId')
  // const { Option } = Select

  const [tableData, setTableData] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [tableform] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    getDetailData()
  }, [data])

  const getDetailData = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'gettemplateDtl',
        requestData: {
          tenantId,
          ttHdrId: data.ttHdrId,
        },
      })
      if (response) {
        if (response?.responseMessage === '200') {
          if (response?.responseData?.length > 0) {
            const modifyData = response.responseData.map((data1, index) => ({
              key: index + 1,
              ...data1,
            }))
            setTableData(modifyData)
          }
        } else {
          setTableData([])
        }
      }
    } catch (error) {
      console.error('Error fetching department data:', error)
    }
  }

  const isEditing = record => record.key === editingKey

  const edit = record => {
    tableform.setFieldsValue({
      actvtyName: record.activityName,
      plannedDay: record.plannedDurationDays,
      deptName: record.deptCode,
    })
    setEditingKey(record.key)
  }

  const cancel = async () => {
    try {
      await tableform.validateFields()
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const hanldeDelete = async rec => {
    try {
      const response = await indentFileUpload({
        requestPath: 'deleteTemplateHdrAndDtl',
        requestData: {
          tenantId,
          ttHdrId: rec.ttHdrId,
          ttDtlId: rec.ttDtlId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          message.success(response.responseMessage)
          setEditingKey('')
          getDetailData()
          getTemplateDetails()
          onClose()
        } else {
          message.success(response.responseMessage)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const save = async () => {
    try {
      const values = await tableform.validateFields()
      const newData = tableData.filter(item => item.key === editingKey)
      // const arr = [
      //   {
      //     ttDtlId: '',
      //     ttHdrId: '',
      //     activityName: '',
      //     plannedDurationDays: '',
      //     isActive: '',
      //     lastUpdatedtime: '',
      //     lastUpdatedBy: '',
      //     tenantId: '',
      //   },
      // ]

      let obj = {
        ttHdrId: '',
        ttName: '',
        ttCreatedBy: '',
        ttCreatedOn: '',
        ttDepartmentCode: '',
        taskTypeCode: '',
        taskCategoryCode: '',
        isActive: '',
        lastUpdatedBy: '',
        tenantId: '',
        taskTemplateDtlList: [],
      }

      if (newData?.length > 0) {
        if (newData[0].ttCode === 'Auto Generated') {
          // insert
          newData.forEach(() => {
            obj = {
              ...obj,
              ttHdrId: data.ttHdrId,
              ttName: data.ttName,
              ttCreatedBy: data.ttCreatedBy,
              ttCreatedOn: data.ttCreatedOn.split(' ')[0],
              ttDepartmentCode: data.ttDepartmentCode,
              taskTypeCode: data.taskTypeCode,
              taskCategoryCode: data.taskCategoryCode,
              isActive: data.isActive,
              lastUpdatedBy: empid,
              tenantId,
              taskTemplateDtlList: newData.map(() => ({
                ttDtlId: '', // Assuming ttDtlId is intended to be an empty string
                ttHdrId: data.ttHdrId,
                activityName: values.actvtyName,
                plannedDurationDays: values.plannedDay,
                isActive: values.isActive === undefined ? '0' : values.isActive ? '1' : '0', // Convert boolean to '1' or '0'
                lastUpdatedtime: '',
                lastUpdatedBy: empid,
                tenantId,
              })),
            }
          })
        } else {
          // update
          obj = {
            ...obj,
            ttHdrId: data.ttHdrId,
            ttName: data.ttName,
            ttCreatedBy: data.ttCreatedBy,
            ttCreatedOn: data.ttCreatedOn.split(' ')[0],
            ttDepartmentCode: data.ttDepartmentCode,
            taskTypeCode: data.taskTypeCode,
            taskCategoryCode: data.taskCategoryCode,
            isActive: values.isActive === false ? '0' : '1',
            lastUpdatedBy: empid,
            tenantId,

            taskTemplateDtlList: newData.map(detail => ({
              ttDtlId: detail.ttDtlId,
              ttHdrId: detail.ttHdrId,
              activityName: values.actvtyName,
              plannedDurationDays: values.plannedDay,
              isActive: values.isActive === false ? '0' : '1',
              lastUpdatedtime: detail.lastUpdatedtime.split(' ')[0],
              lastUpdatedBy: empid,
              tenantId,
            })),
          }
        }
      }

      const response = await indentFileUpload({
        requestPath: 'updateTaskTemplate',
        requestData: obj,
      })

      if (response) {
        if (response.responseCode === '200') {
          message.success(response.responseMessage)
          setEditingKey('')
          getDetailData()
        } else {
          message.error(response.responseMessage)
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  // const departmentchange = record => {
  //   tableform.setFieldsValue({
  //     deptName: record.deptCode,
  //   })
  // }

  const columns = [
    {
      title: 'Activity name',
      dataIndex: 'activityName',
      key: 'activityName',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="actvtyName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please input the Activity name!' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Planned Duration days',
      dataIndex: 'plannedDurationDays',
      key: 'plannedDurationDays',
      align: 'right',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="plannedDay"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Please input the Planned Duration days!' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        )
      },
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item name="isActive" valuePropName="checked" style={{ margin: 0 }}>
            <Switch />
          </Form.Item>
        ) : record.isActive === '1' ? (
          'Yes'
        ) : (
          'No'
        )
      },
    },
    {
      title: 'Last Updated On',
      dataIndex: 'lastUpdatedtime',
      key: 'lastUpdatedtime',
      render: text => {
        const first = text !== null && text !== undefined && text.split(' ')
        return (
          <span>
            {text !== undefined ? moment(first[0]).format('DD-MMM-YYYY') : ''} {first[1]}
          </span>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Button type="primary" onClick={save}>
              Save
            </Button>
            <Button onClick={cancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button type="primary" onClick={() => edit(record)}>
              Edit
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={() => hanldeDelete(record)}>
              Delete
            </Button>
          </span>
        )
      },
    },
  ]

  // const getTaskTypeMaster = async () => {
  //   try {
  //     const response = await indentFileUpload({
  //       requestPath: 'getAllTaskType',
  //       requestData: {
  //         tenantId,
  //         deptCode: '',
  //       },
  //     })
  //     if (
  //       response &&
  //       response.responseData &&
  //       response.responseData.length > 0 &&
  //       response.responseData
  //     ) {
  //       const mappedData = response.responseData.map((item, index) => ({
  //         key: index + 1,
  //         ttCode: item.ttCode,
  //         plannedDay: item.ttDesc,
  //         deptName: item.deptName,
  //         isActive: item.isActive,
  //         deptCode: item.deptCode,
  //       }))
  //       setTableData(mappedData)
  //       setCurrentPage(1)
  //     } else {
  //       setTableData([])
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const addNewRow = () => {
    if (editingKey === '') {
      const newRowKey =
        (tableData.length ? parseInt(tableData[tableData.length - 1].key, 10) : 0) + 1
      const newRow = {
        key: newRowKey,
        ttCode: 'Auto Generated',
        plannedDay: '',
        deptName: '',
        isActive: false,
      }
      tableform.resetFields()
      setTableData([...tableData, newRow])
      setEditingKey(newRowKey)
      const lastPage = Math.ceil((tableData.length + 1) / pageSize)
      setCurrentPage(lastPage)
    } else {
      message.warning('Please complete the current edit before adding a new row.')
    }
  }

  return (
    <Modal
      title="Detail Task Template"
      visible={visible}
      width="90%"
      onCancel={onClose}
      footer={null}
    >
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={addNewRow}>
          Add New{' '}
        </Button>
      </div>
      <Form form={tableform} component={false}>
        <Table
          columns={columns}
          dataSource={tableData}
          rowClassName="editable-row"
          pagination={{
            pageSizeOptions: ['3', '20', '30', '50'],
            showSizeChanger: true,
            defaultPageSize: pageSize,
            current: currentPage,
            onChange: page => setCurrentPage(page),
          }}
        />
      </Form>
    </Modal>
  )
}

export default DetailTaskTemplate
