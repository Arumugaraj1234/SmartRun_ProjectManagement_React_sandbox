import React, { useEffect, useState } from 'react'
import store from 'store'
import { Card, Table, Form, message, Button, Popconfirm, Input, Space } from 'antd'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  if (dataIndex !== 'tcName') {
    return <td {...restProps}>{children}</td>
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Enter the ${title}!`,
            },
            {
              type: 'string',
              pattern: /^(?!\s*$).+/,
              message: `${title} cannot contain only empty spaces!`,
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const TimeSheetCatgory = () => {
  const [form] = Form.useForm()
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const [TimesheetTable, setTimesheetTable] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  useEffect(() => {
    getTimeSheetCategory()
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

  const reqdata = {
    tcId: '',
    tenantId,
  }

  const getTimeSheetCategory = async () => {
    const response = await IndentGroupgetDetails({
      requestPath: 'getTimeSheetCategory',
      requestData: reqdata,
    })
    if (response?.responseCode === '200') {
      setTimesheetTable(
        response?.responseData.map((item, index) => ({ ...item, key: index.toString() })),
      )
    } else {
      message.error(response?.responseMessage)
      setTimesheetTable([])
    }
  }

  const save = async record => {
    try {
      const updatedRow = await form.validateFields()
      if (record.key === 'new-') {
        const response = await indentFileUpload({
          requestPath: 'insertTimeSheetCategory',
          requestData: {
            tcName: updatedRow.tcName,
            createdBy: empId,
            updatedBy: empId,
            tenantId,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          form.resetFields()
          getTimeSheetCategory()
        } else {
          message.error(response?.responseMessage)
          form.resetFields()
          getTimeSheetCategory()
        }
        const newData = [...TimesheetTable]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], tcName: updatedRow.tcName }
          setTimesheetTable(newData)
          setEditingKey('')
        }
      } else {
        const response = await indentFileUpload({
          requestPath: 'updateTimeSheetCategory',
          requestData: {
            tcId: record.tcId,
            tcName: updatedRow.tcName,
            updatedBy: empId,
            tenantId,
          },
        })
        if (response?.responseCode === '200') {
          message.success(response?.responseMessage)
          form.resetFields()
          getTimeSheetCategory()
        } else {
          message.error(response?.responseMessage)
          form.resetFields()
          getTimeSheetCategory()
        }
        const newData = [...TimesheetTable]
        const index = newData.findIndex(item => record.key === item.key)

        if (index > -1) {
          newData[index] = { ...newData[index], tcName: updatedRow.tcName }
          setTimesheetTable(newData)
          setEditingKey('')
        }
      }
    } catch (errInfo) {
      message.error('Validate Failed:', errInfo)
    }
  }

  const edit = record => {
    if (false) {
      form.setFieldsValue({
        tcName: record.tcName,
      })
      setEditingKey(record.key)
    }
  }

  const cancel = record => {
    if (record.key === 'new-') {
      const newData = TimesheetTable.slice(0, -1)
      setTimesheetTable(newData)
      setEditingKey('')
      form.resetFields()
    } else {
      setEditingKey('')
      form.resetFields()
    }
  }
  const isEditing = record => record.key === editingKey

  const handleAdd = () => {
    if (editingKey === '') {
      const newData = {
        key: `new-`,
        tcId: 'Auto-Genrated',
        tcName: '',
      }
      setTimesheetTable([...TimesheetTable, newData])
      setEditingKey(newData.key)
      const totalPages = Math.ceil((TimesheetTable.length + 1) / 10)
      setCurrentPage(totalPages)
    } else {
      message.warning('Save or cancel the current add category before adding a new category.')
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'tcId',
      width: '2%',
      editable: false,
    },
    {
      title: 'Category',
      dataIndex: 'tcName',
      width: '25%',
      editable: true,
    },
    {
      title: 'Created By',
      dataIndex: 'createdEmpName',
      width: '18%',
      editable: false,
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      width: '13%',
      editable: false,
      render: (_, record) => {
        if (record.key !== 'new-') {
          return moment(record.createdOn).format('DD-MMM-YYYY HH:mm')
        }
        return ''
      },
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedEmpName',
      width: '18%',
      editable: false,
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      width: '13%',
      editable: false,
      render: (text, record) => {
        if (record.key !== 'new-') {
          return moment(record.updatedOn).format('DD-MMM-YYYY HH:mm')
        }
        return ''
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Space>
              <Button type="primary" onClick={() => save(record)}>
                {' '}
                Save
              </Button>
              <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
                <Button> Cancel</Button>
              </Popconfirm>
            </Space>
          </span>
        ) : (
          <Button type="primary" disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Button>
        )
      },
    },
  ]

  const mergedColumns = columns.map(col => ({
    ...col,
    onCell: record => ({
      record,
      inputType: col.dataIndex === 'tcName' ? 'text' : '',
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record),
    }),
  }))

  return (
    <div style={isMobile ? { width: tableWidth } : { marginTop: '20px' }}>
      <Card
        style={{ width: '100%' }}
        title="Timesheet Category"
        extra={
          <div style={{ display: 'none' }}>
            <ButtonComponent
              text="New Category"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={handleAdd}
            />
          </div>
        }
      >
        <Form form={form}>
          {TimesheetTable && TimesheetTable.length > 0 && (
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={TimesheetTable}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                current: currentPage,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', [TimesheetTable?.length]],
                onChange: setCurrentPage,
                total: TimesheetTable.length,
              }}
            />
          )}
        </Form>
      </Card>
    </div>
  )
}
export default TimeSheetCatgory
