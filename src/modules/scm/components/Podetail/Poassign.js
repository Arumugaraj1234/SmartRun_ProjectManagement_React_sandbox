import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import { Card, Table, Checkbox, message, Input, Form, Button } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'
import Buttoncomponent from 'components/shared/ButtonComponent'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

// eslint-disable-next-line no-unused-vars
const Poassign = ({ rowData, onClose, calldetailapi, isView }) => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const Menulistdata = store.get('MenuListData')
  const processDoc = store.get('processDoc')
  const pmHdrId = store.get('ProjectPMHdrId')
  const mstId = store.get('ScmHdrId')
  const enquiryId = store.get('EnquiryID')

  const [form] = Form.useForm()

  const [potabel, setPoTable] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [QCBtn, setQCBtn] = useState(false)

  useEffect(() => {
    getPoDetails()
    form.resetFields()
    setSelectedRowKeys([])
  }, [rowData])

  const getPoDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByPoId',
      requestData: {
        tenantId,
        hdrId: rowData.poId,
        empId: employeeId,
      },
    })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      const updatedData = response.responseData[0].poDtl.map(data => {
        return {
          ...data,
          // pendingQty: data.pendingQty - data.inwardQty < 0 ? 0 : data.pendingQty - data.inwardQty,
        }
      })
      setPoTable(updatedData)
    }
  }

  const columns = [
    {
      title: 'S.No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: 'Part Number',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.productCode || ''}</div>,
    },
    {
      title: 'Description',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.description || ''}</div>,
    },
    {
      title: 'Specification',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.specification || ''}</div>,
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      className: 'right-align-cell',
      render: text => text,
    },
    {
      title: 'Make',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.make || ''}</div>,
    },
    {
      title: 'Mass(Kgs)',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      className: 'right-align-cell',
      render: (text, record) => <div>{record?.indentDtlList[0]?.weight || ''}</div>,
    },
    {
      title: 'Material',
      dataIndex: 'indentDtlList',
      key: 'indentDtlList',
      render: (text, record) => <div>{record?.indentDtlList[0]?.material || ''}</div>,
    },

    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        const numericValue = parseFloat(record?.qty)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.qty
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uomCode',
      key: 'uomCode',
      render: (text, record) => {
        const numericValue = parseFloat(record.indentDtlList[0]?.uomDesc)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toFixed(2)
        }
        return record.indentDtlList[0].uomDesc
      },
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
    },
    {
      title: (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < potabel.length}
              style={{ marginLeft: '5px' }}
              checked={selectedRowKeys.length === potabel.length}
              onChange={event => {
                const { checked } = event.target
                if (checked) {
                  setSelectedRowKeys(potabel.map(item => item.poDtlId))
                  potabel.forEach(item => {
                    if (item.reWorkCount === '0.000') {
                      form.setFieldsValue({
                        [`qtyInspectReqCount_${item.poDtlId}`]:
                          item.pendingQty >= 0 ? parseInt(item.pendingQty, 10) : 0,
                      })
                    } else {
                      form.setFieldsValue({
                        [`qtyInspectReqCount_${item.poDtlId}`]:
                          item.pendingQty >= 0 &&
                          parseInt(item.pendingQty, 10) - parseInt(item.reWorkCount || '0', 10) > 0
                            ? parseInt(item.pendingQty, 10) - parseInt(item.reWorkCount || '0', 10)
                            : undefined,
                      })
                      form.setFieldsValue({
                        [`reworkCount_${item.poDtlId}`]:
                          item.pendingQty >= 0
                            ? parseInt(item.pendingQty, 10) -
                                parseInt(item.reWorkCount || '0', 10) <=
                              0
                              ? parseInt(item.pendingQty, 10) // case 1: when pending – rework <= 0
                              : parseInt(item.pendingQty, 10) -
                                parseInt(item.reWorkCount || '0', 10)
                            : 0,
                      })
                    }
                  })
                } else {
                  setSelectedRowKeys([])
                  const resetQtyFields = potabel.map(item => `qtyInspectReqCount_${item.poDtlId}`)
                  const resetReworkFields = potabel.map(item => `reworkCount_${item.poDtlId}`)
                  form.resetFields(resetQtyFields)
                  form.resetFields(resetReworkFields)
                }
              }}
            />
            <span>Request Qty.</span>
            <span style={{ color: 'red' }}>*</span>
          </div>
        </>
      ),
      dataIndex: 'qtyInspectReqCount',
      key: 'qtyInspectReqCount',
      align: 'center',
      width: '100px',
      render: (text, record) => {
        if (Number(record.pendingQty) <= 0) {
          return (
            <div>
              <Button
                type="text"
                icon={<CopyrightOutlined style={{ color: 'white' }} />}
                style={{ background: '#04b504', border: 'none', borderRadius: '3px' }}
              />
            </div>
          )
        }

        // Handle individual row selection
        const onRowSelect = event => {
          const { checked } = event.target
          const newSelectedKeys = checked
            ? [...selectedRowKeys, record.poDtlId]
            : selectedRowKeys.filter(key => key !== record.poDtlId)

          setSelectedRowKeys(newSelectedKeys)

          const requestQtyField = `qtyInspectReqCount_${record.poDtlId}`
          const reworkQtyField = `reworkCount_${record.poDtlId}`

          if (checked) {
            //  If reworkCount is zero then it should only set value for pending quantity
            if (record.reWorkCount === '0.000') {
              const pendingQty = record.pendingQty >= 0 ? parseInt(record.pendingQty, 10) : 0
              form.setFieldsValue({ [requestQtyField]: pendingQty })
            } else {
              form.setFieldsValue({
                [requestQtyField]:
                  record.pendingQty >= 0 &&
                  parseInt(record.pendingQty, 10) - parseInt(record.reWorkCount || '0', 10) > 0
                    ? parseInt(record.pendingQty, 10) - parseInt(record.reWorkCount || '0', 10)
                    : undefined,
              })

              const reworkQty =
                record.reWorkCount >= 0
                  ? parseInt(record.pendingQty, 10) - parseInt(record.reWorkCount || '0', 10) <= 0
                    ? parseInt(record.pendingQty, 10) // case 1: when pending – rework <= 0
                    : parseInt(record.pendingQty, 10) - parseInt(record.reWorkCount || '0', 10) // case 2: otherwise difference
                  : 0 // fallback

              form.setFieldsValue({ [reworkQtyField]: reworkQty })
            }
          } else {
            form.resetFields([requestQtyField])
            form.resetFields([reworkQtyField])
          }
        }

        // Quantity validation logic
        const onChangeQty = event => {
          const regex = /^[0-9]*$/
          const { value } = event.target

          // Validate input (only numbers)
          if (!regex.test(value)) {
            messageReturn(674) // Invalid input message
            form.setFieldsValue({ [`qtyInspectReqCount_${record.poDtlId}`]: '' })
            return
          }

          const allowQty = Number(record.pendingQty || 0)
          const z = form.getFieldValue(`reworkCount_${record.poDtlId}`) || 0
          const allowQty2 = allowQty - Number(z)

          if (Number(value) <= allowQty2) {
            form.setFieldsValue({ [`qtyInspectReqCount_${record.poDtlId}`]: value })
          } else {
            messageReturn(682) // Exceeds allowed quantity message
            form.setFieldsValue({ [`qtyInspectReqCount_${record.poDtlId}`]: '' })
          }
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Checkbox checked={selectedRowKeys.includes(record.poDtlId)} onChange={onRowSelect} />
            <Form form={form}>
              <Form.Item name={`qtyInspectReqCount_${record.poDtlId}`}>
                <Input type="text" onChange={onChangeQty} />
              </Form.Item>
            </Form>
          </div>
        )
      },
    },
    {
      title: (
        <>
          <span>Rework Qty.</span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'reworkQty',
      key: 'reworkQty',
      align: 'center',
      width: '90px',
      render: (text, record) => {
        if (Number(record.pendingQty) === 0 || Number(record.pendingQty) < 0) {
          return (
            <div>
              <Button
                type="text"
                icon={<CopyrightOutlined style={{ color: 'white' }} />}
                style={{ background: '#04b504', border: 'none', borderRadius: '3px' }}
              />
            </div>
          )
        }
        // const onChange = event => {
        //   const { checked } = event.target
        //   const checkedList = checked
        //     ? [...selectedRowKeys, record.poDtlId]
        //     : selectedRowKeys.filter(item => item !== record.poDtlId)
        //   setSelectedRowKeys(checkedList)
        // }

        const onChangeqty = event => {
          const regex = /^[0-9]*$/
          const { value } = event.target
          if (!regex.test(value)) {
            messageReturn(674)
            form.setFieldsValue({ [`reworkCount_${record.poDtlId}`]: '' })
            return
          }
          // const allowqty =
          //   Number(record.qty || 0) -
          //   (Number(record.inspectedQty || 0) + Number(record.qcRequestedQty || 0))
          const allowqty = Number(record.pendingQty || 0)
          // const formValue = form.getFieldsValue()
          const z = form.getFieldValue(`qtyInspectReqCount_${record.poDtlId}`)
          const allowqty2 = (Number(allowqty) || 0) - (Number(z) || 0)
          if (event.target.value <= parseInt(allowqty2, 10)) {
            form.setFieldsValue({ [`reworkCount_${record.poDtlId}`]: event.target.value })
          } else {
            messageReturn(682)
            form.setFieldsValue({ [`reworkCount_${record.poDtlId}`]: '' })
          }
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            {/* <Checkbox checked={selectedRowKeys.includes(record.poDtlId)} onChange={onChange} /> */}
            <Form form={form}>
              <Form.Item name={`reworkCount_${record.poDtlId}`} onChange={onChangeqty}>
                <Input type="text" />
              </Form.Item>
            </Form>
          </div>
        )
      },
    },
    {
      title: `Pen. Qty.`,
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      className: 'right-align-cell',
      render: text => (text >= 0 ? parseInt(text, 10) : 0),
    },
    {
      title: `Received Qty.`,
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      className: 'right-align-cell',
      render: text => (text >= 0 ? parseInt(text, 10) : 0),
    },
    {
      title: `OK`,
      dataIndex: 'inspectedQty',
      key: 'inspectedQty',
      className: 'right-align-cell',
      render: text => parseInt(text, 10),
    },
    {
      title: `Rejected`,
      dataIndex: 'nokCount',
      key: 'nokCount',
      className: 'right-align-cell',
      render: text => parseInt(text, 10),
    },
    {
      title: `Rework`,
      dataIndex: 'reWorkCount',
      key: 'reWorkCount',
      className: 'right-align-cell',
      render: text => parseInt(text, 10),
    },
    {
      title: `Unit Rate ${Menulistdata[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },
    {
      title: `Total Value ${Menulistdata[0].currency}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text
      },
    },
  ]
  const submitRequest = async () => {
    setQCBtn(true)
    const formValues = form.getFieldsValue()
    const updatedTableData = potabel.map(item => {
      return {
        ...item,
        qtyInspectReqCounts: formValues[`qtyInspectReqCount_${item.poDtlId}`],
        reworkQtys: formValues[`reworkCount_${item.poDtlId}`],
      }
    })
    const reqRaisedArray = []
    updatedTableData.forEach(item => {
      if (selectedRowKeys.includes(item.poDtlId)) {
        const { poDtlId, qtyInspectReqCounts, reworkQtys } = item
        reqRaisedArray.push({
          poDtlId,
          qtyInspectReqCount: qtyInspectReqCounts || 0,
          reworkQty: reworkQtys || 0,
        })
      }
    })
    if (reqRaisedArray.length > 0) {
      const response = await indentFileUpload({
        requestPath: 'insertQtyInspReq',
        requestData: {
          tenantId,
          poId: rowData.poId,
          selectedPODtls: reqRaisedArray,
          empId: employeeId,
          pmId: processDoc,
          pmHdrId,
          mstId,
          enquiryId,
        },
      })
      if (response?.responseCode === '200') {
        onClose()
        message.success(response?.responseMessage)
        form.resetFields()
        setSelectedRowKeys([])
        getPoDetails()
        calldetailapi()
      }
    } else {
      messageReturn(405)
      setQCBtn(false)
    }
  }
  return (
    <div>
      <Card className="custom_antd_Table">
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
          <p>
            <span style={{ fontWeight: 'bold', margin: '0px' }}> PO Number : </span>
            {rowData?.poCode}
          </p>
          <p>
            <span style={{ fontWeight: 'bold', margin: '0px' }}> PO Date : </span>
            {moment(rowData.date).format('DD-MMM-YYYY')}
          </p>
        </div>
        <Table columns={columns} dataSource={potabel} pagination={false} bordered />
        {!isView && (
          <div className="text-center">
            <Buttoncomponent
              type="primary"
              text="QC Request"
              disable={QCBtn}
              onClick={submitRequest}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default Poassign
