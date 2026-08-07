import React, { useEffect, useState } from 'react'
import { Card, Select, Skeleton, Form, Button, Input, message } from 'antd'
import { Table } from 'ant-table-extensions'
import store from 'store'
import { FileExcelOutlined, ProfileOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'

import messageReturn from '_helpers/messageReturn'
import ButtonComponent from '../../../../components/shared/ButtonComponent'

// import TableComponent from '../../../../components/common/TableComponent'
// import ModalPopup from '../../../../components/shared/ModalPopupComponent'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

// message file
import currentDateTime from '../../../../currentDateTime'

const ItemsMaster = () => {
  const [form] = Form.useForm()
  const { Option } = Select
  const tenantid = store.get('tenantId')
  const tenantID = store.get('tenantId')
  const tenantId = store.get('tenantId')
  const [projectDropdown, setProjectDropdown] = useState([])
  const [filtersInfo, setfilterinfo] = useState([])
  // const [dtlTable, setDtlTbl] = useState([])
  const [productTbl, setProductDtlTbl] = useState([])
  const [droDownVal, setDropDownVal] = useState(null)
  const [allretriveddata, setAllretriveddata] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [isDownloading, setIsDownloading] = useState(false)

  // const [checked, setIsChecked] = useState(true)
  const [loading, setLoading] = useState(false)
  // const [dtlLoading, setDtlLoading] = useState(false)
  // const [isModalVisible, setIsModalVisible] = useState(false)
  // const [productCode, setProductCode] = useState(null)
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  // })
  const [isDisplay, setIsDisplay] = useState(false)
  const [podtlpopup, setPoDtlPopup] = useState(false)
  const [poDtlList, setPoDtlList] = useState([])

  const Productcode = productTbl ? productTbl.map(h => h.productCode) : []
  const ProjectCode1 = productTbl ? productTbl.map(h => h.projectCode) : []
  const indentCode = productTbl ? productTbl.map(h => h.indentCode) : []
  const sbcDesc = productTbl ? productTbl.map(h => h.sbcDesc) : []
  const Pkdesc = productTbl ? productTbl.map(h => h.pkDesc) : []
  const Pskdesc = productTbl ? productTbl.map(h => h.pskDesc) : []
  const Specification = productTbl ? productTbl.map(h => h.specification) : []
  const Description = productTbl ? productTbl.map(h => h.productDesc) : []
  const Make = productTbl ? productTbl.map(h => h.make) : []

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }
  const filterproductCode = Productcode.filter(distinct)
  const filterspecification = Specification.filter(distinct)
  const filterdescription = Description.filter(distinct)
  const filtermake = Make.filter(distinct)
  const ProjectCode2 = ProjectCode1.filter(distinct)
  const filterpkdesc = Pkdesc.filter(distinct)
  const filterpskdesc = Pskdesc.filter(distinct)
  const filertindentCode = indentCode.filter(distinct)
  const filertsbcDesc = sbcDesc.filter(distinct)

  const makeFilterArray = (arr, sort = true) => {
    let cleaned = arr
      .filter(Boolean) // remove null/undefined/empty
      .map(e => (typeof e === 'string' ? e.trim() : e)) // trim if string
    if (sort) {
      cleaned = cleaned.sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }),
      )
    }
    return cleaned.map(e => ({ text: e, value: e }))
  }

  const makeFilterArrayByLastNumber = arr => {
    const cleaned = arr.filter(Boolean).map(e => e.trim())
    return cleaned
      .sort((a, b) => {
        const lastA = Number(a.split('-').pop())
        const lastB = Number(b.split('-').pop())
        return (Number.isNaN(lastA) ? 0 : lastA) - (Number.isNaN(lastB) ? 0 : lastB)
      })
      .map(e => ({ text: e, value: e }))
  }

  const ProjectCode3 = makeFilterArray(ProjectCode2) // ascending
  const filertSbcDesc = makeFilterArray(filertsbcDesc) // ascending
  const filertIndentCode = makeFilterArrayByLastNumber(filertindentCode) // ascending
  const FilterSpecification = makeFilterArray(filterspecification) // ascending
  const FilterProductCode = makeFilterArray(filterproductCode) // ascending
  const FilterProductDesc = makeFilterArray(filterdescription) // ascending
  const FilterMake = makeFilterArray(filtermake) // ascending
  const FilterPkDesc = makeFilterArray(filterpkdesc) // ascending
  const FilterPskDesc = makeFilterArray(filterpskdesc)
  const FilterChange = (pagina, filters) => {
    setfilterinfo(filters)
  }

  useEffect(() => {
    getProjectCode()
  }, [tenantid])

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
  // const handleChangeCheckBox = e => {
  //   setIsChecked(e.target.checked)
  // }
  const handleSelectChange = (val, opt) => {
    if (val === 'getall') {
      setDropDownVal('getAll')
    } else {
      setDropDownVal(opt.key)
    }
  }
  const getProjectCode = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getProjdtlOrdById',
        requestData: {
          tenantID: tenantid,
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
      console.log(err)
    }
  }

  const OpenPodetail = async indentDtl => {
    const reqdata = {
      tenantId,
      indentDtlId: indentDtl.indentDtlId,
    }
    console.log(reqdata, 'reqdata')
    const response = await indentFileUpload({
      requestPath: 'getPoDetailByIndentDtl',
      requestData: reqdata,
    })
    if (response) {
      setPoDtlPopup(true)
      if (response.responseCode === '200') {
        setPoDtlList(response.responseData)
      } else {
        message.error(response.responseMessage)
      }
    } else {
      setPoDtlPopup(true)
      message.error(response.responseMessage)
    }

    // setPoDtlList(record)
  }

  const PoDtlFieldsComponent = () => {
    return (
      <div>
        <Table columns={columns3} dataSource={poDtlList} bordered scroll={{ y: 500 }} />
      </div>
    )
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    const zip = new JSZip()
    const downloadPromises = productTbl.map(async record => {
      const dmId = record?.dmId
      if (dmId) {
        const response = await indentFileUpload({
          requestPath: 'documentDownloadDocFile',
          requestData: {
            referenceId: dmId,
            tenantId: tenantid,
            fileCode: '',
            docTypeCode: '',
          },
        })

        if (response && response.fileContent !== null) {
          // Add the file content to the ZIP
          zip.file(response.fileName, response.fileContent, { base64: true })
        }
      }
    })

    try {
      await Promise.all(downloadPromises)
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${'Bill_Of_Material'}_${currentDateTime}.zip`)
    } catch (error) {
      console.error('Error downloading files', error)
      messageReturn(606)
    } finally {
      setIsDownloading(false) // Re-enable button and reset text
    }
  }

  const handleSubmitPrDtl = async () => {
    const formValues = form.getFieldsValue()

    if (formValues.Project !== undefined) {
      setIsDisplay(true)
      setLoading(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'getAllProductsDtl',
          requestData: {
            pmHdrId: droDownVal,
            tenantId: tenantID,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            if (response.responseData !== null && response.responseData.length > 0) {
              setLoading(false)
              const updatedData = response.responseData.map((item, index) => {
                return { ...item, sno: index + 1 }
              })
              setProductDtlTbl(updatedData)
              setAllretriveddata(updatedData)
            } else {
              setLoading(false)
              setProductDtlTbl([])
              setAllretriveddata([])
            }
          } else {
            setLoading(false)
            setProductDtlTbl([])
            setAllretriveddata([])
          }
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      messageReturn(405)
    }
  }
  // const handleLinkClick = async e => {
  //   setIsModalVisible(true)
  //   setDtlLoading(true)
  //   setProductCode(e.productCode)
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
  //     console.log(err)
  //   }
  // }
  // const calculateSno = index => {
  //   return (pagination.current - 1) * pagination.pageSize + index + 1
  // }

  const columns3 = [
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: text => ({
        children: text !== null ? Number(text) : '',
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Unit Rate',
      dataIndex: 'uniteRate',
      key: 'uniteRate',
      className: 'right-align-cell',
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text => <span>{parseFloat(text).toLocaleString('en-IN')}</span>,
    },
  ]

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '3%',
      // render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: ProjectCode3,
      filteredValue: filtersInfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
      // render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Indent Code',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: filertIndentCode,
      filteredValue: filtersInfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
      // render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Po Number',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Indent Category',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      filters: filertSbcDesc,
      filteredValue: filtersInfo.sbcDesc,
      onFilter: (value, record) => record?.sbcDesc === value,
      // render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
      filters: FilterPkDesc,
      filteredValue: filtersInfo.pkDesc,
      onFilter: (value, record) => record?.pkDesc === value,
    },
    {
      title: 'Sub Assy',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      filters: FilterPskDesc,
      filteredValue: filtersInfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
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
      filteredValue: filtersInfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      width: '8%',
      filters: FilterProductDesc,
      filteredValue: filtersInfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: '8%',
      filters: FilterSpecification,
      filteredValue: filtersInfo.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      filters: FilterMake,
      filteredValue: filtersInfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
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
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      align: 'right',
      render: text => ({
        children: text !== null ? parseInt(text, 10) : '',
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Value',
      dataIndex: 'unitRate',
      key: 'unitRate',
      // width: '6%',
      // className: 'right-align-cell',
      // render: text => ({
      //   children: text !== null ? parseInt(text, 10) : '',
      //   props: {
      //     style: { textAlign: 'right' },
      //   },
      // }),
      render: text => <span>{text ? parseFloat(text, 10).toLocaleString('en-IN') : ' '}</span>,
      // const numericValue = parseFloat(text)
      // eslint-disable-next-line no-restricted-globals
      // if (!isNaN(numericValue)) {
      //   return numericValue.toLocaleString('en-IN', {
      //     minimumFractionDigits: 2,
      //     maximumFractionDigits: 2,
      //   })
      // }
      // return text
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDescriprtion',
      key: 'uomLongDescriprtion',
      width: '4%',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return (
          <div>
            {record && record.dmId > 0 ? (
              <DownloadDocuments
                isPdf={record.isPdf}
                tenanrId={tenantID}
                refid={record.dmId}
                fileDocode=""
                docTypeCode=""
              />
            ) : (
              ''
            )}
            <div>
              {record && record.poCode !== null && (
                <Button
                  type="primary"
                  onClick={() => {
                    OpenPodetail(record, index)
                  }}
                  icon={<ProfileOutlined />}
                  style={{ marginTop: '5px' }}
                />
              )}
            </div>
          </div>
        )
      },
    },
  ]
  // const Dtlcolumns = [
  //   {
  //     title: 'S.No',
  //     dataIndex: 'sno',
  //     key: 'sno',
  //     render: (text, record, index) => index + 1,
  //   },
  //   {
  //     title: 'Part Number',
  //     dataIndex: 'inventoryLocationCode',
  //     key: 'inventoryLocationCode',
  //     render: () => (
  //       <div>{productCode && <span style={{ marginLeft: '8px' }}>{productCode}</span>}</div>
  //     ),
  //   },
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
  const handleClear = () => {
    form.resetFields()
    setIsDisplay(false)
    // setDtlTbl([])
  }

  // const DetailsTableComponent = () => {
  //   return (
  //     <div style={{ marginTop: '10px' }}>
  //       <Skeleton loading={dtlLoading} active>
  //         <Table
  //           dataSource={dtlTable}
  //           columns={Dtlcolumns}
  //           exportableProps={{
  //             fileName: `Inventory`,
  //             btnProps: {
  //               type: 'primary',
  //               icon: <FileExcelOutlined />,
  //               children: <span>Export to CSV</span>,
  //             },
  //           }}
  //           handleChange={FilterChange}
  //         />
  //       </Skeleton>
  //     </div>
  //   )
  // }
  // const handleCloseModal = () => {
  //   setIsModalVisible(false)
  // }
  // const handlePageChange = page => {
  //   setPagination(prevPagination => ({
  //     ...prevPagination,
  //     current: page,
  //   }))
  // }
  // const handleExportCSV = () => {
  //   const filteredColumns = columns.filter(col => col.dataIndex !== '')

  //   const headerRow = filteredColumns.map(col => `"${col.title}"`).join(',')

  //   const csvData = productTbl.map(row => {
  //     const rowData = filteredColumns.map(
  //       col => `"${row[col.dataIndex] !== null ? row[col.dataIndex] : ''}"`,
  //     )
  //     return rowData.join(',')
  //   })
  //   const csvContent = [headerRow, ...csvData].join('\n')

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //   const link = document.createElement('a')
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob)
  //     link.setAttribute('href', url)
  //     link.setAttribute('download', `Bill_of_Material_${currentDateTime}.csv`)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   }
  // }

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

  const handleExportCSV = () => {
    const cleanedData = cleanupDataSource(productTbl)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Bill_of_Material_${currentDateTime}.csv`)
  }

  const cleanupDataSource = dataSource => {
    return dataSource.map(row => {
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

      return {
        'S.No': escapeValue(row.sno),
        'Project Code': escapeValue(row.projectCode),
        'Indent Code': escapeValue(row.indentCode),
        'Indent Category': escapeValue(row.sbcDesc),
        'Po Code': escapeValue(row.poCode),
        'Vendor Name': escapeValue(row.vendorName),
        Station: escapeValue(row.pkDesc),
        'Sub Assy': escapeValue(row.pskDesc),
        'Part Number': escapeValue(row.productCode),
        Description: escapeValue(row.productDesc),
        Specification: escapeValue(row.specification),
        Make: escapeValue(row.make),
        Material: escapeValue(row.material),
        'Mass (Kgs)': escapeValue(row.weight),
        Qty: escapeValue(row.qty),
        Value: escapeValue(row.unitRate),
        UOM: escapeValue(row.uomShortDescriprtion),
        Remarks: escapeValue(row.remarks),
      }
    })
  }

  const handleSearch = e => {
    const filtered = allretriveddata.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      ),
    )
    setProductDtlTbl(filtered)
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ marginTop: '20px' }} title="Bill of Material">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-2">
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
                  style={{ width: '200px' }}
                  onChange={(value, option) => handleSelectChange(value, option)}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  <Option value="getall">Get All</Option>
                  {projectDropdown &&
                    projectDropdown.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
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
        {productTbl && productTbl.length > 0 ? (
          <div style={{ marginBottom: '-42px', marginLeft: '120px' }}>
            <ButtonComponent
              text={isDownloading ? 'Downloading...' : 'Download All'}
              type="primary"
              onClick={handleDownload}
            />
          </div>
        ) : null}
        <div style={{ display: isDisplay ? 'block' : 'none' }}>
          <Button
            type="primary"
            exportableProps={{
              fileName: 'Bill_of_material',
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            onClick={handleExportCSV}
            style={{ marginTop: '10px' }}
          >
            Export to CSV
          </Button>
        </div>

        <div style={{ marginTop: '10px', display: isDisplay ? 'block' : 'none' }}>
          <Skeleton loading={loading} active>
            <Input.Search
              style={{
                marginTop: isMobile ? '1px' : '-35px',
                width: isMobile ? '100%' : '30%',
                float: 'right',
              }}
              placeholder="Search here..."
              enterButton
              // onSearch={handleSearch}
              onChange={e => handleSearch(e)}
            />
            <Table
              dataSource={productTbl}
              columns={columns}
              // pagination={{ ...pagination, onChange: handlePageChange }}
              handleChange={FilterChange}
              scroll={{ y: 400 }}
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [productTbl?.length]],
                showSizeChanger: true,
                defaultPageSize: 50,
              }}
            />
          </Skeleton>
        </div>
        {/* <ModalPopup
        text="Inventory"
        isModalVisible={isModalVisible}
        onCancel={handleCloseModal}
        FieldsComponent={DetailsTableComponent}
      /> */}
      </Card>
      <div>
        {podtlpopup ? (
          <ModalPopup
            FieldsComponent={PoDtlFieldsComponent}
            isModalVisible={podtlpopup}
            text="Purchase Order Details"
            width={1400}
            onCancel={() => {
              setPoDtlPopup(false)
              setPoDtlList([])
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default ItemsMaster
