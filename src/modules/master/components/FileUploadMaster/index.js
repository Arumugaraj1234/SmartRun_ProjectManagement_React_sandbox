import React, { useState, useEffect } from 'react'
import { Card, Table, message, Form, Select, Row, Divider, Space, Button, Input } from 'antd'
import store from 'store'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
// service
import messageReturn from '_helpers/messageReturn'
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
  if (dataIndex !== 'desc') {
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

const FileUploadConfig = () => {
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantId = store.get('tenantId')
  const [DocumentTypeDropDown, setDocumentTypeDropDown] = useState([])
  const [isDisplay, setIsDisplay] = useState(false)
  const [docTable, setdocTable] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  // const [data,setData] = useState([])
  const pageSize = 10

  useEffect(() => {
    getDocumentType()
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

  const getDocumentType = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'docTypeMstDropDwn',
        requestData: {
          tenantId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setDocumentTypeDropDown(response.responseData)
          } else {
            setDocumentTypeDropDown([])
          }
        } else {
          setDocumentTypeDropDown([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleClear = () => {
    setIsDisplay(false)
    setEditingKey('')
    setdocTable([])
    // const formVal = form.getFieldsValue()
    form.resetFields()
  }

  const handleSubmit = async () => {
    const formVal = form.getFieldsValue()
    if (formVal.Document !== undefined) {
      setIsDisplay(true)

      try {
        const response = await indentFileUpload({
          requestPath: 'getFileUploadConfig',
          requestData: {
            docCode: formVal.Document,
            tenantId,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            if (response.responseData !== null && response.responseData.length > 0) {
              setdocTable(
                response?.responseData.map((item, index) => ({ ...item, key: index.toString() })),
              )
              // console.log(response.responseData.length);
            } else {
              setdocTable([])
            }
            setEditingKey('')
          } else {
            setdocTable([])
          }
        }
      } catch (err) {
        console.log(err + 6)
      }
    } else {
      messageReturn(405)
    }
  }

  const edit = record => {
    form.setFieldsValue({
      desc: record.desc,
    })
    setEditingKey(record.key)
  }

  const save = async record => {
    // const formData = form.getFieldsValue()
    try {
      const updatedRow = await form.validateFields()
      const response = await indentFileUpload({
        requestPath: 'insertUpdateFileUploadConfig',
        requestData: {
          fuCode: record.fuCode === 'Auto-Generated' ? '' : record.fuCode,
          desc: updatedRow.desc,
          descCode: updatedRow.Document,
          tenantId,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        handleSubmit()
        form.setFieldsValue({
          desc: '',
        })
      } else {
        message.error(response?.responseMessage)
      }
      const newData = [...docTable]
      const index = newData.findIndex(item => record.key === item.key)

      if (index > -1) {
        newData[index] = { ...newData[index], desc: updatedRow.desc }
        setdocTable(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const cancel = record => {
    if (record.fuCode === 'Auto-Generated') {
      setdocTable(docTable.slice(0, -1))
    }
    setEditingKey('')
    // form.resetFields()
    form.setFieldsValue({
      desc: '',
    })
  }

  const handleNewRow = () => {
    if (editingKey === '') {
      const newData = {
        key: `new-`,
        fuCode: 'Auto-Generated',
        desc: '',
      }
      setdocTable([...docTable, newData])
      setEditingKey(newData.key)
      const lastPage = Math.ceil((docTable.length + 1) / pageSize)
      setCurrentPage(lastPage)
    } else {
      message.warning('Save or cancel the current add before adding.')
    }
  }

  const isEditing = record => record.key === editingKey

  const column = [
    {
      title: 'FU Code',
      dataIndex: 'fuCode',
      key: 'fuCode',
      width: '20%',
      editable: false,
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      width: '60%',
      editable: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record)}>
              Save
            </Button>
            <Button onClick={() => cancel(record)}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              disabled={editingKey !== '' && editingKey !== record.key}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = column.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'desc' ? 'text' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="File Upload Config">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Document"
                label={
                  <span>
                    Document Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Document"
                  style={{ width: '100%' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  {DocumentTypeDropDown &&
                    DocumentTypeDropDown.map(item => (
                      <Option key={item.docCode} value={item.docCode}>
                        {item.docDesc}
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
              onClick={handleSubmit}
            />
            <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
          </div>
          <div style={{ display: isDisplay ? 'block' : 'none' }}>
            <Row>
              <Divider orientation="left">File Upload Config Details</Divider>
            </Row>
            <div style={{ textAlign: 'right', paddingBottom: '20px' }}>
              <Button
                type="primary"
                // style={{paddingTop:'20px'}}
                onClick={() => handleNewRow()}
              >
                Add New Config
              </Button>
            </div>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={docTable}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [docTable?.length]],
                showSizeChanger: true,
                defaultPageSize: pageSize,
                current: currentPage,
                onChange: setCurrentPage,
              }}
            />
          </div>
        </Form>
      </Card>
    </div>
  )
}
export default FileUploadConfig
