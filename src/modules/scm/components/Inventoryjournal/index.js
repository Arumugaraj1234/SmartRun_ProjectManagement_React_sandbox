import React, { useState, useEffect, useCallback } from 'react'
import store from 'store'
import { Card, DatePicker, Button, Form, Row, message, Divider, Select, Input } from 'antd'
import moment from 'moment'
import { Table } from 'ant-table-extensions'
import { FileExcelOutlined } from '@ant-design/icons'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import currentDateTime from '../../../../currentDateTime'
// import { right } from '@popperjs/core'

const Inventoryjournal = () => {
  const tenantId = store.get('tenantId')
  // const MenuTab = store.get('MenuListData')
  // const curr = MenuTab[0].currency
  const [form] = Form.useForm()
  const { Option } = Select
  const [inventoryTable, setInventoryTable] = useState([])
  const [filterInventoryData, setFilterInventoryData] = useState([])
  const [projectList, setProjectList] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  const [isDisplay, setIsDisplay] = useState(false)
  const currentYear = moment().year()
  const currentMonth = moment().month()

  let defaultFromDate
  let defaultToDate
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
  const fromdateChange = () => {
    getProjectList()
  }

  const toDateChange = () => {
    getProjectList()
  }

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }
  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)

  useEffect(() => {
    getProjectList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }

  const getallIndent = async () => {
    const fromvalue = form.getFieldsValue()
    setIsDisplay(true)
    // setfilterinfo([])
    if (!fromvalue.FromDate || !fromvalue.ToDate || !fromvalue.Projectcode) {
      messageReturn(405)
      setInventoryTable([])
      return
    }

    const reqdata = {
      fromDate: moment(fromvalue.FromDate).format('YYYY-MM-DD'),
      toDate: moment(fromvalue.ToDate).format('YYYY-MM-DD'),
      projectId: fromvalue.Projectcode || 'getall',
      tenantId,
    }

    const response = await IndentGroupgetDetails({
      requestPath: 'retrieveinventoryJournal',
      requestData: reqdata,
    })

    if (response?.responseCode === '200') {
      setInventoryTable(response?.responseData)
      setFilterInventoryData(response?.responseData)
      // message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
      setInventoryTable([])
      setFilterInventoryData([])
    }
  }

  // const SNo = []
  const TransDate = []
  const TransType = []
  const ProjCode = []
  const ProduCode = []
  const ProduDesc = []
  const UOMDesc = []
  const FromLoc = []
  const OpenBal = []
  const CloseBal = []
  const ReferId = []
  const TransQty = []
  const PoCode = []

  if (inventoryTable) {
    // inventoryTable.map(h => {
    //   return SNo.push(h.serialNumber)
    // })
    inventoryTable.map(h => {
      return TransDate.push(h.inventoryTransactionDate)
    })
    inventoryTable.map(h => {
      return TransType.push(h.inventoryTransactionTypeDescription)
    })
    inventoryTable.map(h => {
      return ProjCode.push(h.projectCode)
    })
    inventoryTable.map(h => {
      return ProduCode.push(h.productCode)
    })
    inventoryTable.map(h => {
      return PoCode.push(h.poCode)
    })
    inventoryTable.map(h => {
      return ProduDesc.push(h.productDescription)
    })
    inventoryTable.map(h => {
      return UOMDesc.push(h.uomLongDescription)
    })
    inventoryTable.map(h => {
      return FromLoc.push(h.inventoryLocDesc)
    })
    inventoryTable.map(h => {
      return OpenBal.push(h.openingBalance)
    })
    inventoryTable.map(h => {
      return CloseBal.push(h.closingBalance)
    })
    inventoryTable.map(h => {
      return ReferId.push(h.inventoryTransactionReferenceId)
    })
    inventoryTable.map(h => {
      return TransQty.push(h.inventoryTransactionQuantity)
    })
  }

  const distinct = (value, index, self) => {
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  // const filtersNo       = SNo.filter(distinct)
  const filtertransDate = TransDate.filter(distinct)
  const filtertransType = TransType.filter(distinct)
  const filterprojCode = ProjCode.filter(distinct)
  const filterprodCode = ProduCode.filter(distinct)
  const filterpoCode = PoCode.filter(distinct)
  const filterprodDesc = ProduDesc.filter(distinct)
  const filteruomDesc = UOMDesc.filter(distinct)
  const filterfromLoc = FromLoc.filter(distinct)
  const filteropenBal = OpenBal.filter(distinct)
  const filtercloseBal = CloseBal.filter(distinct)
  const filterreferId = ReferId.filter(distinct)
  const filtertransQty = TransQty.filter(distinct)

  // const FilterSNo = []
  const FilterTransDate = []
  const FilterTransType = []
  const FilterProjCode = []
  const FilterProduCode = []
  const FilterProduDesc = []
  const FilterUOMDesc = []
  const FilterFromLoc = []
  const FilterOpenBal = []
  const FilterCloseBal = []
  const FilterReferId = []
  const FilterTransQty = []
  const FilterPoCode = []
  // filtersNo.map(element => {
  //   return FilterSNo.push({
  //     text: element,
  //     value: element,
  //   })
  // })
  filtertransDate.map(element => {
    const formattedDate = element ? moment(element).format('DD-MMM-YYYY') : ''
    return FilterTransDate.push({
      text: formattedDate,
      value: element,
    })
  })
  filtertransType.map(element => {
    return FilterTransType.push({
      text: element,
      value: element,
    })
  })
  filterprojCode.map(element => {
    return FilterProjCode.push({
      text: element,
      value: element,
    })
  })
  filterprodCode.map(element => {
    return FilterProduCode.push({
      text: element,
      value: element,
    })
  })
  filterpoCode.map(element => {
    return FilterPoCode.push({
      text: element,
      value: element,
    })
  })
  filterprodDesc.map(element => {
    return FilterProduDesc.push({
      text: element,
      value: element,
    })
  })
  filteruomDesc.map(element => {
    return FilterUOMDesc.push({
      text: element,
      value: element,
    })
  })
  filterfromLoc.map(element => {
    return FilterFromLoc.push({
      text: element,
      value: element,
    })
  })
  filteropenBal.map(element => {
    return FilterOpenBal.push({
      text: element,
      value: element,
    })
  })
  filtercloseBal.map(element => {
    return FilterCloseBal.push({
      text: element,
      value: element,
    })
  })
  filterreferId.map(element => {
    return FilterReferId.push({
      text: element,
      value: element,
    })
  })
  filtertransQty.map(element => {
    return FilterTransQty.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      // filters: FilterSNo,
      // filteredValue: filtersinfo.serialNumber,
      // onFilter: (value, record) => record?.serialNumber=== value,
    },
    // {
    //   title: 'Part Number',
    //   dataIndex: 'productDescription',
    //   key: 'productDescription',
    //   filters: FilterProduDesc,
    //   filteredValue: filtersinfo.productDescription,
    //   onFilter: (value, record) => record?.productDescription=== value,
    // },
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: FilterProjCode,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    // {
    //   title: 'Project Desc.',
    //   dataIndex: 'projectName',
    //   key: 'projectName',
    // },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: FilterProduCode,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDescription',
      key: 'productDescription',
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: 'Po Number',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: FilterPoCode,
      filteredValue: filtersinfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
    },
    {
      title: 'Location',
      dataIndex: 'inventoryLocDesc',
      key: 'inventoryLocDesc',
      filters: FilterFromLoc,
      filteredValue: filtersinfo.inventoryLocDesc,
      onFilter: (value, record) => record?.inventoryLocDesc === value,
    },
    {
      title: 'Trans. Type',
      dataIndex: 'inventoryTransactionTypeDescription',
      key: 'inventoryTransactionTypeDescription',
      filters: FilterTransType,
      filteredValue: filtersinfo.inventoryTransactionTypeDescription,
      onFilter: (value, record) => record?.inventoryTransactionTypeDescription === value,
    },
    {
      title: 'Ref. ID',
      dataIndex: 'inventoryTransactionReferenceId',
      key: 'inventoryTransactionReferenceId',
      filters: FilterReferId,
      filteredValue: filtersinfo.inventoryTransactionReferenceId,
      onFilter: (value, record) => record?.inventoryTransactionReferenceId === value,
    },
    {
      title: 'Transaction On',
      dataIndex: 'inventoryTransactionDate',
      key: 'inventoryTransactionDate',
      width: 150,
      render: (text, record) =>
        record.inventoryTransactionDate
          ? moment(record.inventoryTransactionDate).format('DD-MMM-YYYY HH:mm')
          : '',
      filters: FilterTransDate,
      filteredValue: filtersinfo.inventoryTransactionDate,
      onFilter: (value, record) => record?.inventoryTransactionDate === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDescription',
      key: 'uomLongDescription',
      filters: FilterUOMDesc,
      filteredValue: filtersinfo.uomLongDescription,
      onFilter: (value, record) => record?.uomLongDescription === value,
    },
    {
      title: '  Trans. Qty.',
      dataIndex: 'inventoryTransactionQuantity',
      key: 'inventoryTransactionQuantity',
      value: currencyFormat('inventoryTransactionQuantity'),
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
      filters: FilterTransQty,
      filteredValue: filtersinfo.inventoryTransactionQuantity,
      onFilter: (value, record) => record?.inventoryTransactionQuantity === value,
    },
    {
      title: `Open Bal. Qty`,
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      value: currencyFormat('openingBalance'),
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
      filters: FilterOpenBal,
      filteredValue: filtersinfo.openingBalance,
      onFilter: (value, record) => record?.openingBalance === value,
    },
    {
      title: `Close Bal. Qty.`,
      dataIndex: 'closingBalance',
      key: 'closingBalance',
      value: currencyFormat('closingBalance'),
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
      filters: FilterCloseBal,
      filteredValue: filtersinfo.closingBalance,
      onFilter: (value, record) => record?.closingBalance === value,
    },
  ]

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const handleClear = () => {
    form.resetFields()
    setInventoryTable(false)
    // setfilterinfo([])
    setIsDisplay(false)
  }
  const debouncedSearch = useCallback(
    // eslint-disable-next-line no-undef
    _.debounce(value => {
      const filtered = filterInventoryData.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
      setInventoryTable(filtered)
    }, 300),
    [filterInventoryData],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <>
      <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
        <Card style={{ width: '100%' }} title="Inventory Journal">
          <Form form={form}>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                <Form.Item
                  name="FromDate"
                  label={<span>From Date</span>}
                  initialValue={moment(defaultFromDate)}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={fromdateChange}
                    format="DD-MMM-YYYY"
                    disabledDate={d => !d || d.isAfter(form.getFieldValue('ToDate'))}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                <Form.Item
                  name="ToDate"
                  label={<span>To Date</span>}
                  initialValue={moment(defaultToDate)}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={toDateChange}
                    format="DD-MMM-YYYY"
                    disabledDate={d => !d || d.isBefore(form.getFieldValue('FromDate'))}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
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
                    // onChange={getIndentList}
                    placeholder="Select Project"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toUpperCase()
                        .indexOf(input.toUpperCase()) !== -1
                    }
                  >
                    <Option value="getall">Get All</Option>
                    {projectList?.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
            >
              <Button type="primary" onClick={() => getallIndent()}>
                Get details
              </Button>
              <Button type="primary" onClick={() => handleClear()}>
                Clear
              </Button>
            </div>
            {/* {inventoryTable && inventoryTable.length > 0 ? ( */}
            <div style={{ marginTop: '40px', display: isDisplay ? 'block' : 'none' }}>
              <Row>
                <Divider orientation="left">Journal Details</Divider>
              </Row>

              <div>
                <Input.Search
                  style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
                  placeholder="Search here..."
                  enterButton
                  // onSearch={handleSearch}
                  onChange={e => handleSearch(e)}
                />
                <Table
                  columns={columns}
                  dataSource={inventoryTable}
                  exportableProps={{
                    fileName: `Invertory_Journal_${currentDateTime}`,
                    btnProps: {
                      type: 'primary',
                      icon: <FileExcelOutlined />,
                      children: <span>Export to CSV</span>,
                    },
                  }}
                  pagination={{
                    pageSizeOptions: ['10', '20', '30', '50', [inventoryTable?.length]],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                  }}
                  scroll={{ y: 400 }}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* // ) : null} */}
          </Form>
        </Card>
      </div>
    </>
  )
}
export default Inventoryjournal
