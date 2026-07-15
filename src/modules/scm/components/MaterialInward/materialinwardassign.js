import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { Card, Table, Checkbox, message, Form, Input, Button } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

// eslint-disable-next-line no-unused-vars
const MaterialInwardAssign = ({ rowData, onClose, projectCode }) => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const processDoc = store.get('processDoc')
  const [form] = Form.useForm()

  const [miDtlTable, setMiDtlTable] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [QCBtn, setQCBtn] = useState(false)

  useEffect(() => {
    getAssignDetails()
    form.resetFields()
  }, [rowData])

  const getAssignDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getMaterialInwardDtlList',
      requestData: {
        tenantId,
        hdrId: rowData?.miId,
        projectCode,
      },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      setMiDtlTable(response?.responseData || [])
    }
  }

  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  const MtrlInwrdPopupcolumns = [
    {
      title: 'Part Number',
      dataIndex: ['indentDtlList', 'productCode'],
      key: 'productCode',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.productCode) {
          return indentDtlList[0].productCode
        }
        return '-'
      },
    },
    {
      title: 'Description',
      dataIndex: ['indentDtlList', 'description'],
      key: 'description',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.description) {
          return indentDtlList[0].description
        }
        return '-'
      },
    },
    {
      title: 'UOM',
      dataIndex: ['indentDtlList', 'uomDesc'],
      key: 'uomDesc',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.uomDesc) {
          return indentDtlList[0].uomDesc
        }
        return '-'
      },
    },
    {
      title: 'Material',
      dataIndex: ['indentDtlList', 'material'],
      key: 'material',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.material) {
          return indentDtlList[0].material
        }
        return '-'
      },
    },
    {
      title: 'Make',
      dataIndex: ['indentDtlList', 'make'],
      key: 'make',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.make) {
          return indentDtlList[0].make
        }
        return '-'
      },
    },
    {
      title: 'Specification',
      dataIndex: ['indentDtlList', 'specification'],
      key: 'specification',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.specification) {
          return indentDtlList[0].specification
        }
        return '-'
      },
    },
    {
      title: 'Indent Qty.',
      dataIndex: ['indentDtlList', 'totalQty'],
      key: 'totalQty',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.qty) {
          return currencyFormat(indentDtlList[0].qty)
        }
        return '-'
      },
    },
    {
      title: 'Remarks',
      dataIndex: ['indentDtlList', 'remarks'],
      key: 'remarks',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.remarks) {
          return indentDtlList[0].remarks
        }
        return '-'
      },
    },
    {
      title: 'Weight',
      dataIndex: ['indentDtlList', 'weight'],
      key: 'weight',
      render: (text, record) => {
        const { indentDtlList } = record
        if (indentDtlList?.[0]?.weight) {
          return indentDtlList[0].weight
        }
        return '-'
      },
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < miDtlTable.length}
            style={{ marginLeft: '5px' }}
            checked={selectedRowKeys.length === miDtlTable.length}
            onChange={event => {
              const { checked } = event.target
              if (checked) {
                // Select all rows
                setSelectedRowKeys(miDtlTable.map(item => item.miDtlId))
                miDtlTable.forEach(item => {
                  if (Number(item.pendingQty) > 0) {
                    form.setFieldsValue({
                      [`qtyInspectReqCount_${item.miDtlId}`]: item.pendingQty,
                    })
                  }
                })
              } else {
                // Deselect all rows
                setSelectedRowKeys([])
                const resetFields = miDtlTable.map(item => `pendingQty_${item.miDtlId}`)
                form.resetFields(resetFields)
              }
            }}
          />
          <span>Quality Request</span>
          <span style={{ color: 'red' }}>*</span>
        </div>
      ),
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      align: 'center',
      width: '120px',
      render: (text, record) => {
        if (Number(record.pendingQty) <= 0) {
          return (
            <Button
              type="text"
              icon={<CopyrightOutlined style={{ color: 'white' }} />}
              style={{ background: '#04b504', border: 'none', borderRadius: '3px' }}
            />
          )
        }

        const requestQtyField = `qtyInspectReqCount_${record.miDtlId}`

        const onRowSelect = e => {
          const { checked } = e.target
          const newSelected = checked
            ? [...selectedRowKeys, record.miDtlId]
            : selectedRowKeys.filter(id => id !== record.miDtlId)

          setSelectedRowKeys(newSelected)

          if (checked) {
            form.setFieldsValue({ [requestQtyField]: record.pendingQty })
          } else {
            form.resetFields([requestQtyField])
          }
        }

        const onChangeQty = e => {
          const regex = /^[0-9]*$/
          if (!regex.test(e.target.value)) {
            messageReturn(674)
            form.setFieldsValue({ [requestQtyField]: '' })
          }
        }

        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Checkbox checked={selectedRowKeys.includes(record.miDtlId)} onChange={onRowSelect} />
            <Form form={form}>
              <Form.Item name={requestQtyField}>
                <Input type="text" onChange={onChangeQty} />
              </Form.Item>
            </Form>
          </div>
        )
      },
    },

    {
      title: 'Pen. Qty.',
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      render: text =>
        text !== '' && text !== null && text !== undefined && Number(text) > 0
          ? currencyFormat(text)
          : '0',
    },
    {
      title: 'Ordered Qty.',
      dataIndex: 'orderedQty',
      key: 'weight',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },

    {
      title: 'Received Qty.',
      dataIndex: 'receivedQty',
      key: 'weight',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },

    {
      title: 'Inspected Qty.',
      dataIndex: 'inspectedQty',
      key: 'weight',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
    {
      title: 'Rejected Qty.',
      dataIndex: 'nokQty',
      key: 'nokQty',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
  ]
  const submitRequest = async () => {
    setQCBtn(true)
    const formValues = form.getFieldsValue()
    const updatedTableData = miDtlTable.map(item => {
      return {
        ...item,
        qtyInspectReqCount: formValues[`qtyInspectReqCount_${item.miDtlId}`],
      }
    })
    const reqRaisedArray = []
    updatedTableData.forEach(item => {
      if (selectedRowKeys.includes(item.miDtlId) && item.qtyInspectReqCount) {
        const { miDtlId, qtyInspectReqCount } = item
        reqRaisedArray.push({ miDtlId, qtyInspectReqCount })
      }
    })
    if (reqRaisedArray.length > 0) {
      const response = await indentFileUpload({
        requestPath: 'insertMIQtyReq',
        requestData: {
          tenantId,
          poId: rowData.poId,
          selectedPODtls: reqRaisedArray,
          empId: employeeId,
          pmId: processDoc,
        },
      })
      if (response?.responseCode === '200') {
        onClose()
        message.success(response?.responseMessage)
        setSelectedRowKeys([])
        getAssignDetails()
        // calldetailapi()
      }
    } else {
      messageReturn(405)
    }
  }
  return (
    <div>
      <Card className="custom_antd_Table">
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <p>
            <span style={{ fontWeight: 'bold', margin: '0px' }}> Inward Code : </span>
            {rowData?.miCode}
          </p>
          <p>
            <span style={{ fontWeight: 'bold', margin: '0px' }}> Inward Date : </span>
            {moment(rowData?.inwardDate).format('DD-MMM-YYYY')}
          </p>
        </div>
        <Table columns={MtrlInwrdPopupcolumns} dataSource={miDtlTable} pagination={false} />
        <div className="text-center">
          <ButtonComponent
            type="primary"
            text="QC Request"
            disable={QCBtn}
            onClick={submitRequest}
          />
        </div>
      </Card>
    </div>
  )
}

export default MaterialInwardAssign
