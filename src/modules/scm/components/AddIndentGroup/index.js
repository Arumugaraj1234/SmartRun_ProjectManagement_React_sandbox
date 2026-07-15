/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react'
import { Form, DatePicker, message, Input, Select } from 'antd'
import store from 'store'
import moment from 'moment'
import ButtonComponent from 'components/shared/ButtonComponent'
import { Table } from 'ant-table-extensions'
import ModalPopup from 'components/shared/ModalPopupComponent'
import InputComponent from 'components/shared/InputComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import messageReturn from '_helpers/messageReturn'
// import TailviewIndentGroup from '../TailviewIndentGroup'

const AddIndentGroup = ({ handleCancel, isModalVisible, submit, isTailview }) => {
  const [form] = Form.useForm()
  const [allqtyForm] = Form.useForm()
  const { Option } = Select
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const proId = store.get('ProjectID')

  // const proId = store.get('ProjectID')
  const [indentId, setIndentId] = useState('')
  const [disableSubmitButton, setDisableSubmitButton] = useState(false)

  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate
  const isInternal = store.get('isInternal')
  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }
  const [indentList, setIndentList] = useState([])
  const [projectList, setProjectList] = useState([])

  const [indentTable, setIndentTable] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])

  useEffect(() => {
    getProjectList()
  }, [])

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await IndentGroupgetDetails({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }
  console.log(projectList, 'projet list')
  useEffect(() => {
    if (projectList.length > 0) {
      form.setFieldsValue({
        Projectcode: proId,
      })
      getIndentList()
    }
  }, [projectList])

  const getIndentList = async () => {
    setIndentList([])
    const formData = form.getFieldsValue()
    const payload = {
      tenantId,
      empId: employeeId,
      pmId: '5',
      projectId: proId,
      fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
      toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      getIndent: isInternal == 1 ? '5' : '6',
    }
    const response = await IndentGroupgetDetails({
      requestPath: 'indentHdrDropDownByProjectCode',
      requestData: payload,
    })
    console.log(payload, 'payload check')
    console.log(response, 'response check')

    if (response) {
      if (response?.responseData?.length > 0) {
        setIndentList(response?.responseData)
      } else {
        setIndentList([])
      }
    }
  }
  const handleQtyChange = (index, e, indentQty) => {
    const newData = [...indentTable]
    const { value } = e.target
    let numValue = parseFloat(value) || 0
    const maxQty = parseFloat(indentQty) || 0

    if (numValue > maxQty) {
      message.warning(`Allocate Qty cannot exceed ${maxQty}. Auto-corrected.`)
      numValue = maxQty

      newData[index].allocateQty = numValue.toString()
      setIndentTable(newData)

      allqtyForm.setFieldsValue({ [`allocateqty${index}`]: numValue.toString() })
    }
  }

  const fromdateChange = () => {
    setIndentList([])
    getProjectList()
  }

  const toDateChange = () => {
    setIndentList([])
    getProjectList()
  }

  const handleinsertSubmit = async () => {
    setDisableSubmitButton(true)
    const formvalues = allqtyForm.getFieldValue()

    const updatedTableData = indentTable.map((item, index) => {
      return {
        ...item,
        allocateQty: formvalues[`allocateqty${index}`],
      }
    })
    const filteredData = updatedTableData.filter(
      item => item.allocateQty !== '' && item.allocateQty !== '0',
    )
    const formValues = form.getFieldsValue()
    const grpname = formValues.groupname
    const inventory = formValues.isInventory

    // const fromdate = moment(formValues.FromDate).format('YYYY-MM-DD')
    // const todate = moment(formValues.ToDate).format('YYYY-MM-DD')
    // const projectCode = formValues.Projectcode

    const newArray = filteredData.map(item => ({
      indentDtlId: item.indentDtlId,
      inventory: item.allocateQty,
      qty: item.allocateQty,
      tenantId,

      // Add other properties if needed
    }))
    const props = {
      createdBy: employeeId,
      groupName: grpname,
      insrtGrpDtl: newArray,
      lastUpdatedBy: employeeId,
      tenantId,
      isInventory: inventory,
    }
    if (newArray.length > 0) {
      const httpinsert = await IndentGroupgetDetails({
        requestPath: 'insertTempGrup',
        requestData: props,
      })
      if (httpinsert.responseCode === '200') {
        message.success(httpinsert.responseMessage)
        setDisableSubmitButton(false)
        submit(
          indentId || formValues.IndentCode,
          formValues.FromDate,
          formValues.ToDate,
          formValues.Projectcode,
          isTailview,
        )
      } else {
        message.error(httpinsert.responseMessage)
        setDisableSubmitButton(false)
      }
    } else {
      messageReturn(661)
      setDisableSubmitButton(false)
    }
  }

  const productCode1 = []
  const description1 = []
  const specification1 = []
  const Material1 = []
  const make1 = []

  indentTable.map(h => {
    return productCode1.push(h.productCode)
  })
  indentTable.map(h => {
    return description1.push(h.description)
  })
  indentTable.map(h => {
    return specification1.push(h.specification)
  })
  indentTable.map(h => {
    return Material1.push(h.material)
  })
  indentTable.map(h => {
    return make1.push(h.make)
  })

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const productCode2 = productCode1.filter(distinct)
  const description2 = description1.filter(distinct)
  const specification2 = specification1.filter(distinct)
  const Material2 = Material1.filter(distinct)
  const make2 = make1.filter(distinct)

  const productCode3 = []
  const description3 = []
  const specification3 = []
  const Material3 = []
  const make3 = []

  productCode2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return productCode3.push({
        text: element,
        value: element,
      })
    })
  description2
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return description3.push({
        text: element,
        value: element,
      })
    })
  specification2.map(element => {
    return specification3.push({
      text: element,
      value: element,
    })
  })
  Material2.map(element => {
    return Material3.push({
      text: element,
      value: element,
    })
  })
  make2.map(element => {
    return make3.push({
      text: element,
      value: element,
    })
  })

  const insertcolumns = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      width: '15%',
      key: 'productCode',
      filters: productCode3,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '15%',
      filters: description3,
      filteredValue: filtersinfo.description,
      onFilter: (value, record) => record?.description === value,
      key: 'description',
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      width: '7%',
      key: 'specification',
      filters: specification3,
      filteredValue: filtersinfo.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      width: '5%',
      key: 'make',
      filters: make3,
      filteredValue: filtersinfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      width: '13%',
      key: 'material',
      filters: Material3,
      filteredValue: filtersinfo.material,
      onFilter: (value, record) => record?.material === value,
    },
    {
      title: 'Mass (kgs)',
      dataIndex: 'weight',
      width: '7%',
      key: 'weight',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      width: '5%',
      key: 'uom',
    },
    {
      title: 'Indent Qty.',
      dataIndex: 'indentQty',
      width: '7%',
      key: 'indentQty',
    },
    {
      title: 'Allocated Qty.',
      dataIndex: 'indentGrpQty',
      width: '7%',
      key: 'indentGrpQty',
    },
    {
      title: 'Allocate Qty.',
      dataIndex: 'allocateQty',
      width: '10%',
      key: 'allocateQty',
      render: (text, record) => (
        <Form.Item
          name={`allocateqty${record.sno}`}
          style={{ margin: 0 }}
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === '') return Promise.resolve()
                if (Number(value) > Number(record.indentQty)) {
                  return Promise.reject(new Error(`Max allowed is ${record.indentQty}`))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Allocate Qty.."
            onChange={e => handleQtyChange(record.sno, e, record.indentQty)}
          />
        </Form.Item>
      ),
    },
  ]

  const handleDueDate = (value, option) => {
    form.setFieldsValue({ duedate: moment(option.expectedDeliveryDate, 'YYYY-MM-DD') })
  }

  const handleInsertData = async () => {
    const formValues = form.getFieldsValue()
    const grpname = formValues.groupname
    const isInv = formValues.isInventory
    setIndentId(formValues.IndentCode)
    // const indent = indentId || formValues.IndentCode

    if (
      grpname !== '' &&
      grpname !== undefined &&
      formValues.IndentCode !== '' &&
      formValues.IndentCode !== undefined &&
      isInv !== null &&
      isInv !== undefined
    ) {
      const props = {
        indentId: formValues.IndentCode,
        tenantId,
        empId: employeeId,
      }
      const httpgetdetails = await IndentGroupgetDetails({
        requestPath: 'getIndentGrpNewProd',
        requestData: props,
      })
      if (httpgetdetails.responseCode === '200') {
        const responseDataWithAllocateQty = httpgetdetails.responseData.map((item, index) => ({
          ...item,
          sno: index,
          allocateQty: item.indentQty - item.indentGrpQty,
        }))
        const updatedData = responseDataWithAllocateQty.map(item => ({
          ...item,
          allocateQty: (parseFloat(item.indentQty) - parseFloat(item.indentGrpQty)).toString(),
        }))
        updatedData.forEach(item => {
          const allocateQtyValue = item.allocateQty
          allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: allocateQtyValue })
        })
        setIndentTable(responseDataWithAllocateQty)
      } else {
        setIndentTable([])
        message.error(httpgetdetails.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleAllocateRow = () => {
    const updatedData = indentTable.map(item => ({
      ...item,
      allocateQty: (parseFloat(item.indentQty) - parseFloat(item.indentGrpQty)).toString(),
    }))
    setIndentTable(updatedData)
    updatedData.forEach(item => {
      const allocateQtyValue = item.allocateQty
      allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: allocateQtyValue })
    })
  }

  const handleUnAllocateRow = () => {
    const updatedData = indentTable.map(item => ({
      ...item,
      allocateQty: '0',
    }))
    setIndentTable(updatedData)
    updatedData.forEach(item => {
      const allocateQtyValue = item.allocateQty
      allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: allocateQtyValue })
    })
  }

  // const handlegroupnamecheck = async () => {
  //   const formValues = form.getFieldsValue()
  //   const grpname = formValues.groupname
  //   if (grpname !== '' && grpname !== undefined) {
  //     const props = {
  //       tempName: grpname,
  //       tenantId,
  //     }
  //     const httpgetdetails = await IndentGroupgetDetails({
  //       requestPath: 'checkTemplateName',
  //       requestData: props,
  //     })
  //     if (httpgetdetails.responseCode === '200') {
  //       message.success(httpgetdetails.responseMessage)
  //     } else {
  //       setIndentTable([])
  //       message.error(httpgetdetails.responseDataMessage)
  //     }
  //   }
  // }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const FieldsComponent = () => {
    return (
      <div>
        <Form form={form}>
          <div className="row">
            {/* { isTailview ? (
              <Row gutter={24}> */}
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="FromDate"
                label={
                  <span>
                    From Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabled
                  onChange={fromdateChange}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="ToDate"
                label={
                  <span>
                    To Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                initialValue={moment(defaultToDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabled
                  onChange={toDateChange}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="Projectcode"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Project"
                  onChange={ProjId => getIndentList(ProjId)}
                  disabled={isTailview}
                >
                  {projectList?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="IndentCode"
                label={
                  <span>
                    Indent<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Indent"
                  onChange={(value, option) => handleDueDate(value, option)}
                >
                  {indentList?.map(item => (
                    <Option
                      key={item.indentId}
                      expectedDeliveryDate={item.expectedDeliveryDate}
                      value={item.indentId}
                    >
                      {item.indentCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="duedate"
                label={
                  <span>
                    Due Date<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <DatePicker style={{ width: '100%' }} disabled />
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="isInventory"
                label={
                  <span>
                    Stock Availability<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Inventory">
                  <Option key="1" value="1">
                    Yes
                  </Option>
                  <Option key="2" value="0">
                    No
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="groupname"
                label={
                  <span>
                    Group Name<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <InputComponent placeholder="Type Group Name" />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent text="Get Details" type="primary" onClick={() => handleInsertData()} />
          </div>
        </Form>
        <div className="custom_antd_Table">
          {indentTable.length > 0 ? (
            <>
              <div style={{ marginBottom: '10px' }}>
                <ButtonComponent
                  text="Allocate All"
                  type="primary"
                  onClick={() => handleAllocateRow()}
                />
                <span style={{ margin: '0 8px' }} />
                <ButtonComponent
                  text="Unallocate All"
                  type="primary"
                  onClick={() => handleUnAllocateRow()}
                />
              </div>
              {/* <TableComponent
                scrollY={700}
                columns={insertcolumns}
                data={indentTable}
                page={false}
              /> */}
              <Form form={allqtyForm}>
                <Table
                  columns={insertcolumns}
                  dataSource={indentTable}
                  scroll={{ y: 700 }}
                  onChange={handleChange}
                  pagination={false}
                  rowKey="sno"
                />
              </Form>
            </>
          ) : null}
        </div>
      </div>
    )
  }

  const ButtonsComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
        }}
      >
        {indentTable.length > 0 ? (
          <>
            <ButtonComponent
              text="Submit"
              type="primary"
              marginright="10px"
              onClick={handleinsertSubmit}
              disable={disableSubmitButton}
            />
            <ButtonComponent
              text="Cancel"
              type="primary"
              onClick={() => {
                handleCancel()
              }}
            />
          </>
        ) : null}
      </div>
    )
  }

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      ButtonsComponent={ButtonsComponent}
      FieldsComponent={FieldsComponent}
      text="Create Indent Group"
      onCancel={() => {
        handleCancel()
      }}
      width="900"
    />
  )
}

export default AddIndentGroup
