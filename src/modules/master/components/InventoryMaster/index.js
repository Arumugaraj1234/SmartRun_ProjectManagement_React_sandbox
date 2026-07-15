import React, { useEffect, useState, useCallback } from 'react'
import { Card, Select, Skeleton, Form, Button, Input } from 'antd'
import { Table } from 'ant-table-extensions'
import store from 'store'
import { FileExcelOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
// import { CSVLink } from 'react-csv'
import messageReturn from '_helpers/messageReturn'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
// import TableComponent from '../../../../components/common/TableComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

// message file
import currentDateTime from '../../../../currentDateTime'

const InventoryMaster = () => {
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantid = store.get('tenantId')
  const tenantID = store.get('tenantId')
  const MenulistData = store.get('MenuListData')
  const [projectDropdown, setProjectDropdown] = useState([])
  const [filtersInfo, setfilterinfo] = useState([])
  const [dtlTable, setDtlTbl] = useState([])
  const [productTbl, setProductDtlTbl] = useState([])
  const [locdropdowndata, setLocdropdowndata] = useState([])
  // const [checked, setIsChecked] = useState(true)
  const [loading, setLoading] = useState(false)
  const [dtlLoading, setDtlLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [productCode, setProductCode] = useState(null)
  const [totalcount, settotalCount] = useState(null)
  const [filteredtotalinvvalue, setFilteredTotalinvvalue] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [filteredvendor, setfilteredvendor] = useState([])
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 50,
  // })
  const [isDisplay, setIsDisplay] = useState(false)

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
  const Productcode = productTbl ? productTbl.map(h => h.prodCode) : []
  // const ponocodeval1 = productTbl ? productTbl.map(h => h.poCode) : []
  const Pkdesc = productTbl ? productTbl.map(h => h.prodDesc) : []
  const Pskdesc = productTbl ? productTbl.map(h => h.uom) : []
  const location1 = productTbl ? productTbl.map(h => h.locationDesc) : []
  const bin1 = productTbl ? productTbl.map(h => h.bin) : []
  const projectNo = productTbl ? productTbl.map(h => h.projCode) : []
  const make1 = productTbl ? productTbl.map(h => h.make) : []

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }
  const filterproductCode = Productcode.filter(distinct)
  // const filterPoNo2 = ponocodeval1.filter(distinct)
  const filterpkdesc = Pkdesc.filter(distinct)
  const filterpskdesc = Pskdesc.filter(distinct)
  const location2 = location1.filter(distinct)
  const bin2 = bin1.filter(distinct)
  const projectNo2 = projectNo.filter(distinct)
  const make2 = make1.filter(distinct)

  const FilterProductCode = filterproductCode
    .filter(Boolean) // remove null/undefined/empty
    .map(e => e.trim()) // remove extra spaces
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' })) // ignore case
    .map(element => ({
      text: element,
      value: element,
    }))

  const FilterPkDesc = filterpkdesc
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const FilterPskDesc = filterpskdesc
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const location3 = location2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const bin3 = bin2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const projectNo3 = projectNo2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const make3 = make2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(element => ({ text: element, value: element }))

  const FilterChange = (pagina, filters) => {
    setfilterinfo(filters)
  }

  useEffect(() => {
    getProjectCode()
    getInvLocationDropdown()
  }, [tenantid])

  // const handleChangeCheckBox = e => {
  //   setIsChecked(e.target.checked)
  // }
  // const handleSelectChange = (val, opt) => {
  //   setDropDownVal(opt.key)
  // }
  const getProjectCode = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getPmInvDtl',
        requestData: {
          projectId: '',
          tenantId: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setProjectDropdown(response.responseData)
          } else {
            setProjectDropdown([])
          }
        } else {
          setProjectDropdown([])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getInvLocationDropdown = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getLocationdropdown',
        requestData: {
          tenantID: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setLocdropdowndata(response.responseData)
          } else {
            setLocdropdowndata([])
          }
        } else {
          setLocdropdowndata([])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmitPrDtl = async () => {
    const formValues = form.getFieldsValue()

    if (formValues.Project !== undefined && formValues.invLocation !== undefined) {
      setIsDisplay(true)
      setLoading(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'getPmInv',
          requestData: {
            projectId: formValues.Project === 'getall' ? '' : formValues.Project,
            tenantId: tenantID,
            invLocationCode: formValues.invLocation === 'getall' ? '' : formValues.invLocation,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            if (response.responseData !== null && response.responseData.length > 0) {
              setLoading(false)
              const updatedData = response.responseData.map((item, index) => {
                return {
                  ...item,
                  sno: index + 1,
                  bin: item.bin || '',
                }
              })
              setProductDtlTbl(updatedData)
              setfilteredvendor(response?.responseData)
            } else {
              setLoading(false)
              setProductDtlTbl([])
              setfilteredvendor([])
            }
          } else {
            setLoading(false)
            setProductDtlTbl([])
          }
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      messageReturn(405)
    }
  }
  // eslint-disable-next-line no-unused-vars
  // const handleLinkClick = async e => {
  //   setIsModalVisible(true)
  //   setDtlLoading(true)
  //   setProductCode(e.prodCode)
  //   try {
  //     const response = await indentFileUpload({
  //       requestPath: 'getProductBasedInventoryDtl',
  //       requestData: {
  //         tenantId: tenantid,
  //         productId: e.productId,
  //       },
  //     })
  //     if (response) {
  //       if (response.responseCode === '200') {
  //         if (response.responseData && response.responseData.length > 0) {
  //           setDtlLoading(false)
  //           setDtlTbl(response.responseData)
  //         } else {
  //           setDtlLoading(false)
  //           setDtlTbl([])
  //         }
  //       } else {
  //         setDtlLoading(false)
  //         setDtlTbl([])
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  const handleClick = async e => {
    setIsModalVisible(true)
    setDtlLoading(true)
    setProductCode(e.prodCode)
    try {
      const response = await indentFileUpload({
        requestPath: 'getProductBasedPoDtl',
        requestData: {
          tenantId: tenantid,
          productId: e.productId,
          pmHdrId: e.projectId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData && response.responseData.length > 0) {
            setDtlLoading(false)
            setDtlTbl(response.responseData)
          } else {
            setDtlLoading(false)
            setDtlTbl([])
          }
        } else {
          setDtlLoading(false)
          setDtlTbl([])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // const calculateSno = index => {
  //   return (pagination.current - 1) * pagination.pageSize + index + 1
  // }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      // render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Project Number',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: projectNo3.sort((a, b) => a.value.localeCompare(b.value)),
      filteredValue: filtersInfo?.projCode,
      onFilter: (value, record) => record?.projCode === value,
    },
    // {
    //   title: 'PO No.',
    //   dataIndex: 'poCode',
    //   key: 'poCode',
    //   filters: FilterPONO3,
    //   filteredValue: filtersInfo?.poCode,
    //   onFilter: (value, record) => record?.poCode === value,
    // },
    {
      title: 'Part Number',
      dataIndex: 'prodCode',
      key: 'prodCode',
      // render: (text, record) => (
      //   <a
      //     role="button"
      //     tabIndex={0}
      //     style={{ color: 'blue', cursor: 'pointer' }}
      //     onClick={() => handleLinkClick(record)}
      //     onKeyDown={e => {
      //       if (e.key === 'Enter') {
      //         handleLinkClick(record)
      //       }
      //     }}
      //   >
      //     {text}
      //   </a>
      // ),
      filters: FilterProductCode,
      filteredValue: filtersInfo.prodCode,
      onFilter: (value, record) => record?.prodCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'prodDesc',
      key: 'prodDesc',
      filters: FilterPkDesc,
      filteredValue: filtersInfo.prodDesc,
      onFilter: (value, record) => record?.prodDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      align: 'left',
      width: '14%',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      align: 'left',
      width: '14%',
      filters: make3,
      filteredValue: filtersInfo?.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      filters: FilterPskDesc,
      filteredValue: filtersInfo.uom,
      onFilter: (value, record) => record?.uom === value,
    },

    {
      title: 'Mass (Kgs)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'right',
      render: text => ({
        children: text !== null ? parseFloat(text).toLocaleString('en-IN') : '',
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Location',
      dataIndex: 'locationDesc',
      key: 'locationDesc',
      filters: location3,
      filteredValue: filtersInfo.locationDesc,
      onFilter: (value, record) => record?.locationDesc === value,
    },
    {
      title: 'Bin',
      dataIndex: 'bin',
      key: 'bin',
      filters: bin3,
      filteredValue: filtersInfo.bin,
      onFilter: (value, record) => record?.bin === value,
      render: text => text || '',
    },
    {
      title: 'Qty. On hand',
      dataIndex: 'qtyOnHand',
      key: 'qtyOnHand',
      align: 'right',
      // render: text => ({
      //   children: text !== null ? parseInt(text, 10) : '',
      //   props: {
      //     style: { textAlign: 'right' },
      //   },
      // }),
      render: text => {
        const formattedText =
          text !== null
            ? Number(text) === Math.floor(text)
              ? Number(text).toFixed(0)
              : Number(text).toFixed(2)
            : ''
        return {
          children: formattedText,
          props: {
            style: { textAlign: 'right' },
          },
        }
      },
    },
    {
      title: `Unit Price ${MenulistData[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      align: 'right',
      render: text => (text ? parseFloat(text).toLocaleString('en-IN') : 0),
    },

    {
      title: `Inventory Value ${MenulistData[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      align: 'right',
      render: (__, record) => {
        const unitRate = Number(record.unitRate) || 0
        const qtyOnHand = Number(record.qtyOnHand) || 0
        const invvalue = unitRate * qtyOnHand
        return parseFloat(invvalue).toLocaleString('en-IN')
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ButtonComponent type="primary" text="Details" onClick={() => handleClick(record)} />
          {/* <ButtonComponent type="primary" text="Details" onClick={() => handleLinkClick(record)} /> */}
        </div>
      ),
    },
  ]
  // const Dtlcolumns = [
  //   {
  //     title: 'S.No',
  //     dataIndex: 'sno',
  //     key: 'sno',
  //     render: (text, record, index) => index + 1,
  //   },
  //   // {
  //   //   title: 'Part Number',
  //   //   dataIndex: 'inventoryLocationCode',
  //   //   key: 'inventoryLocationCode',
  //   //   render: () => (
  //   //     <div>{productCode && <span style={{ marginLeft: '8px' }}>{productCode}</span>}</div>
  //   //   ),
  //   // },
  //   {
  //     title: 'Inventory Location',
  //     dataIndex: 'inventoryLocationDesc',
  //     key: 'inventoryLocationDesc',
  //   },
  //   {
  //     title: 'Qty On Hand',
  //     dataIndex: 'productQtyOnHand',
  //     key: 'productQtyOnHand',
  //     align: 'right',
  //     render: text => ({
  //       children: parseFloat(text, 10).toLocaleString('en-IN'),
  //       props: {
  //         style: { textAlign: 'right' },
  //       },
  //     }),
  //   },
  // ]
  const Dtlcolumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    // {
    //   title: 'Part Number',
    //   dataIndex: 'inventoryLocationCode',
    //   key: 'inventoryLocationCode',
    //   render: () => (
    //     <div>{productCode && <span style={{ marginLeft: '8px' }}>{productCode}</span>}</div>
    //   ),
    // },
    {
      title: 'Po Code',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Po Qty',
      dataIndex: 'qty',
      key: 'qty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Recevied Qty',
      dataIndex: 'receviedQty',
      key: 'receviedQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Inward Qty',
      dataIndex: 'inwardQty',
      key: 'inwardQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
  ]
  const handleClear = () => {
    form.resetFields()
    setIsDisplay(false)
    setDtlTbl([])
  }

  const DetailsTableComponent = () => {
    return (
      <div>
        <Skeleton loading={dtlLoading} active>
          <p>
            {' '}
            <p style={{ fontWeight: 'bold' }}>Part Number :</p> {productCode}
          </p>
          <Table
            dataSource={dtlTable}
            columns={Dtlcolumns}
            // exportableProps={{
            //   fileName: `Inventory${currentDateTime}`,
            //   btnProps: {
            //     type: 'primary',
            //     icon: <FileExcelOutlined />,
            //     children: <span>Export to CSV</span>,
            //   },
            // }}
            handleChange={FilterChange}
          />
        </Skeleton>
      </div>
    )
  }
  const handleCloseModal = () => {
    setIsModalVisible(false)
  }
  // const handlePageChange = page => {
  //   setPagination(prevPagination => ({
  //     ...prevPagination,
  //     current: page,
  //   }))
  // }
  const totalValue = productTbl.reduce((sum, item) => sum + parseInt(item.qtyOnHand, 10), 0)
  const inventorytotalvalue = productTbl.reduce((sum, item) => {
    const unitRate = parseFloat(item.unitRate) || 0
    const qtyOnHand = parseFloat(item.qtyOnHand) || 0
    return sum + unitRate * qtyOnHand
  }, 0)
  // const footerData = [
  //   [
  //     'Total Qty. On hand',
  //     totalValue !== null || undefined
  //       ? parseFloat(totalValue).toLocaleString('en-IN')
  //       : parseFloat(totalValue).toLocaleString('en-IN'),
  //   ],
  //   [
  //     'Total Inventory Value',
  //     inventorytotalvalue !== null || undefined
  //       ? parseFloat(inventorytotalvalue).toLocaleString('en-IN')
  //       : parseFloat(inventorytotalvalue).toLocaleString('en-IN'),
  //   ],
  // ]

  // const csvData = [
  //   [
  //     'S.No.',
  //     'Project Number',
  //     'PO No.',
  //     'Part Number',
  //     'Description',
  //     'Specification',
  //     'Make',
  //     'UOM',
  //     'Mass (Kg)',
  //     'Location',
  //     'Bin',
  //     'Qty. On hand',
  //     `Unit Price (Rs.) ${MenulistData[0].currency}`,
  //     `Inventory Value ${MenulistData[0].currency}`,
  //   ],

  //   ...productTbl.map((item, index) => {
  //     const unitRate = parseFloat(item.unitRate) || 0;
  //     const qtyOnHand = parseFloat(item.qtyOnHand) || 0;
  //     const invValue = unitRate * qtyOnHand;
  //   return [
  //     index + 1,
  //     item.projCode,
  //     item.poCode,
  //     item.prodCode,
  //     item.prodDesc,
  //     item.specification,
  //     item.make,
  //     item.uom,
  //     item.weight,
  //     item.locationDesc,
  //     item.bin,
  //     item.qtyOnHand,
  //     parseFloat(item.unitRate).toLocaleString('en-IN'),
  //     parseFloat(invValue).toLocaleString('en-IN'),
  //   ]}),
  //   ...footerData,
  // ]

  const convertToCSV = data => {
    const header = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [header, ...rows].join('\n')
  }

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = () => {
    const cleanedData = cleanupDataSource(productTbl)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Inventory_Details-${currentDateTime}.csv`)
  }

  const cleanupDataSource = dataSource => {
    const escapeValue = value => {
      if (
        typeof value === 'string' &&
        (value.includes(',') || value.includes('\n') || value.includes('"'))
      ) {
        // Escape special characters (double quotes and commas)
        return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
      }
      return value
    }

    return dataSource.map((row, index) => {
      const unitRate = parseFloat(row.unitRate) || 0
      const qtyOnHand = parseFloat(row.qtyOnHand) || 0
      const invValue = unitRate * qtyOnHand

      return {
        'S.No.': index + 1,
        'Project Number': escapeValue(row.projCode),
        'PO No.': escapeValue(row.poCode),
        'Part Number': escapeValue(row.prodCode),
        Description: escapeValue(row.prodDesc),
        Specification: escapeValue(row.specification),
        Make: escapeValue(row.make),
        UOM: escapeValue(row.uom),
        'Mass (Kg)': escapeValue(row.weight),
        Location: escapeValue(row.locationDesc),
        Bin: escapeValue(row.bin),
        'Qty. On hand': qtyOnHand,
        'Unit Price (Rs.)': unitRate,
        'Inventory Value (Rs.)': invValue.toFixed(2),
        // ...footerData
      }
    })
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    setfilterinfo(filters)
    const { currentDataSource } = extra
    const filtertotalinvvalue = currentDataSource.reduce((sum, item) => {
      const unitRate = parseFloat(item.unitRate) || 0
      const qtyOnHand = parseFloat(item.qtyOnHand) || 0
      return sum + unitRate * qtyOnHand
    }, 0)
    const total = currentDataSource.reduce((sum, item) => sum + parseInt(item.qtyOnHand, 10), 0)
    setFilteredTotalinvvalue(filtertotalinvvalue)
    settotalCount(total)
  }

  useEffect(() => {
    const filtertotalinvvalue = productTbl.reduce((sum, item) => {
      const unitRate = parseFloat(item.unitRate) || 0
      const qtyOnHand = parseFloat(item.qtyOnHand) || 0
      return sum + unitRate * qtyOnHand
    }, 0)
    setFilteredTotalinvvalue(filtertotalinvvalue)
    const total = productTbl.reduce((sum, item) => sum + parseInt(item.qtyOnHand, 10), 0)
    settotalCount(total)
  }, [productTbl])

  const debouncedSearch = useCallback(
    // eslint-disable-next-line no-undef
    _.debounce(value => {
      const filtered = filteredvendor.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
      setProductDtlTbl(filtered)
    }, 300),
    [filteredvendor],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '15px' }} title="Inventory Master">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Project"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Project"
                  style={{ width: '100%' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  <Option value="getall">Get All</Option>
                  {projectDropdown &&
                    projectDropdown.map(item => (
                      <Option key={item.projCode} value={item.projCode}>
                        {item.projCode}-{item.customerName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="invLocation"
                label={
                  <span>
                    Inventory Location<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Inv. Location"
                  style={{ width: '100%' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  <Option value="getall">Get All</Option>
                  {locdropdowndata &&
                    locdropdowndata.map(item => (
                      <Option key={item.inventoryLocationCode} value={item.inventoryLocationCode}>
                        {item.inventoryLocationDescription}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent
            type="primary"
            text="Get Details"
            marginright="10px"
            onClick={handleSubmitPrDtl}
          />
          <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
        </div>
        <div style={{ marginTop: '40px', display: isDisplay ? 'block' : 'none' }}>
          <Skeleton loading={loading} active>
            <div style={{ marginTop: 10 }}>
              {/* <CSVLink data={csvData} filename={`InventoryMaster_${currentDateTime}`}>
                <Button type="primary" icon={<FileExcelOutlined />}>
                  Export to CSVs
                </Button>
              </CSVLink> */}
              <Button
                type="primary"
                exportableProps={{
                  fileName: `InventoryMaster_${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
                onClick={handleExport}
                style={{ marginTop: '10px' }}
              >
                Export to CSV
              </Button>
            </div>
            <Input.Search
              style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
              placeholder="Search here..."
              enterButton
              // onSearch={handleSearch}
              onChange={e => handleSearch(e)}
            />
            <Table
              dataSource={productTbl}
              columns={columns}
              scroll={{ y: 400 }}
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [productTbl?.length]],
                showSizeChanger: true,
                defaultPageSize: 50,
              }}
              onChange={handleChange}
              footer={() => (
                <div
                  style={{
                    fontSize: '16px',
                    marginLeft: '32px',
                    textAlign: 'right',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ padding: '0px 50px' }}>
                    Total Qty. On hand (Nos.) :
                    {totalcount !== null || undefined
                      ? parseFloat(totalcount).toLocaleString('en-IN')
                      : parseFloat(totalValue).toLocaleString('en-IN')}{' '}
                  </span>
                  <span style={{ padding: '0px 50px' }}>
                    Total Inventory Value {MenulistData[0].currency} :
                    {filteredtotalinvvalue !== null || undefined
                      ? parseFloat(filteredtotalinvvalue).toLocaleString('en-IN')
                      : parseFloat(inventorytotalvalue).toLocaleString('en-IN')}{' '}
                  </span>
                </div>
              )}
            />
          </Skeleton>
        </div>
        <ModalPopup
          text="Inventory Store Details"
          isModalVisible={isModalVisible}
          onCancel={handleCloseModal}
          FieldsComponent={DetailsTableComponent}
        />
      </Card>
    </div>
  )
}

export default InventoryMaster
