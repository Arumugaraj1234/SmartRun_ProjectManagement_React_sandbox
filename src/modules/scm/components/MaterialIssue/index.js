import React, { useEffect, useState, useCallback } from 'react'
import { Card, Select, Skeleton, Form, message, Input, Button, AutoComplete } from 'antd'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import store from 'store'
import { FileExcelOutlined, PlusOutlined } from '@ant-design/icons'

import InputComponent from 'components/shared/InputComponent'
// import TableComponent from '../../../../components/common/TableComponent'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import ButtonComponent from '../../../../components/shared/ButtonComponent'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

import currentDateTime from '../../../../currentDateTime'

const MaterialIssue = () => {
  const [form] = Form.useForm()
  const [Addform] = Form.useForm()
  const [Remarkform] = Form.useForm()
  const [inputform] = Form.useForm()
  const { Option } = Select
  const tenantid = store.get('tenantId')
  const empid = store.get('employeeId')
  // const [filtersInfo, setfilterinfo] = useState([])
  const [filterMtrTbl, setfilterMtrTblinfo] = useState([])
  const [dtlTable, setDtlTbl] = useState([])
  const [proval, setProject] = useState(null)
  const [projectDropdown, setProjectDropdown] = useState([])
  const [materialTbl, setMaterialTbl] = useState([])
  const [mrCodedropdown, setMrCodeDropdown] = useState([])
  const [retrieveData, setRetrieveData] = useState([])
  const [dtlLoading, setDtlLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAddMaterial, setIsAddMaterial] = useState(false)
  const [isAddDisplay, setAddDisplay] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [filteredmaterial, setfilteredmaterial] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [partNumberDropdown, setPartNumberDropdown] = useState([])
  const [partNo, setPartNo] = useState(null)

  const [miDtlLst, setMIDtlLst] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

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
  useEffect(() => {
    setMIDtlLst([
      {
        id: 0,
        mrDtlId: '',
        productId: '',
        requestedQty: '',
        availableQty: '',
        issuedQty: '0',
        tenantId: tenantid,
      },
    ])
  }, [])
  useEffect(() => {
    if (retrieveData) {
      const newData = retrieveData.map((item, index) => ({
        id: index + 1,
        mrDtlId: item.mrDtlId,
        productId: item.productId || '',
        requestedQty: item.requierdQty || '',
        availableQty: item.inventoryQty || '',
        issuedQty: '0',
        tenantId: tenantid,
      }))
      setMIDtlLst(newData)
    }
  }, [retrieveData])

  const handleProjectChange = value => {
    handleGetPartNumber()
    setSelectedProject(value)
  }
  // const [miCode, setMicode] = useState(null)
  const [mrCode, setMRCode] = useState(null)

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [isDisplay, setIsDisplay] = useState(false)

  // const MiDate = materialTbl ? materialTbl.map(h => h.miDate) : []
  // const MrDate = materialTbl ? materialTbl.map(h => h.miDate) : []

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const distinct1 = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  // const filterMIDate = MiDate.filter(distinct)
  // const filterMRDate = MrDate.filter(distinct)

  // Dtl table
  const Productcode = materialTbl ? materialTbl.map(h => h.productCode) : []
  const Productdesc = materialTbl ? materialTbl.map(h => h.productDesc) : []

  // Hdr table
  const MrCode = materialTbl ? materialTbl.map(h => h.mrCode) : []
  const MrDate = materialTbl ? materialTbl.map(h => h.requestedOn) : []
  const ProjCode = materialTbl ? materialTbl.map(h => h.projCode) : []
  const ProductCount = materialTbl ? materialTbl.map(h => h.productCount) : []
  const MiCode = materialTbl ? materialTbl.map(h => h.miCode) : []
  const MiDate = materialTbl ? materialTbl.map(h => h.issuedOn) : []
  const IssuedBy = materialTbl ? materialTbl.map(h => h.issuedBy) : []
  const RequestedBy = materialTbl ? materialTbl.map(h => h.requestedBy) : []
  const IsCompleted = materialTbl ? materialTbl.map(h => h.isCompleted) : []

  const filterProductCode = Productcode.filter(distinct)
  const filterProdudtDesc = Productdesc.filter(distinct)

  // Hdr table
  const filterMrCode = MrCode.filter(distinct1)
  const filterMrDate = MrDate.filter(distinct1)
  const filterProductCount = ProductCount.filter(distinct1)
  const filterProjCode = ProjCode.filter(distinct1)
  const filterMiCode = MiCode.filter(distinct1)
  const filterMiDate = MiDate.filter(distinct1)
  const filterIssuedBy = IssuedBy.filter(distinct1)
  const filterReqestedBy = RequestedBy.filter(distinct1)
  const filterIsCompleted = IsCompleted.filter(distinct1)

  const FilterProductCode = filterProductCode.map(element => ({
    text: element,
    value: element,
  }))
  const FilterProductDesc = filterProdudtDesc.map(element => ({
    text: element,
    value: element,
  }))
  const FilterMrCode = filterMrCode.map(element => ({
    text: element,
    value: element,
  }))
  const FilterMrDate = filterMrDate.map(element => ({
    text: dateformatter(element),
    value: element,
  }))
  const FilterProductCount = filterProductCount.map(element => ({
    text: element,
    value: element,
  }))
  const FilterMiCode = filterMiCode.map(element => ({
    text: element,
    value: element,
  }))
  const FilterMiDate = filterMiDate
    .sort((a, b) => a.localeCompare(b))
    .map(element => ({
      text: element,
      value: element,
    }))
  const FilterProjCode = filterProjCode.map(element => ({
    text: element,
    value: element,
  }))
  const FilterIssuedBy = filterIssuedBy.map(element => ({
    text: element,
    value: element,
  }))
  const FilterReqestedBy = filterReqestedBy.map(element => ({
    text: element,
    value: element,
  }))
  const FilterIsCompleted = filterIsCompleted.map(element => ({
    text: element,
    value: element,
  }))

  // const FilterChange = (pagina, filters) => {
  //   setfilterinfo(filters)
  // }
  const FilterChangeMtrTbl = (pag, filters) => {
    setfilterMtrTblinfo(filters)
  }

  useEffect(() => {
    getProjectCode()
  }, [tenantid])

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

  const handleSubmitMtrlDtl = async () => {
    const formValues = form.getFieldsValue()
    if (formValues.Project !== undefined) {
      setIsDisplay(true)
      setLoading(true)
      try {
        const response = await indentFileUpload({
          requestPath: 'getMaterialIssueHdr',
          requestData: {
            productId: partNo || '',
            hdrId: formValues.Project,
            tenantId: tenantid,
          },
        })
        if (response) {
          if (response.responseCode === '200') {
            if (response.responseData !== null && response.responseData.length > 0) {
              setLoading(false)
              const data = response.responseData
              setMaterialTbl(() =>
                data.map(e => ({
                  ...e,
                  isCompleted: e.isCompleted === '1' ? 'Completed' : 'Pending',
                })),
              )
              setfilteredmaterial(() =>
                data.map(e => ({
                  ...e,
                  isCompleted: e.isCompleted === '1' ? 'Completed' : 'Pending',
                  miDate: e.miDate !== null ? dateformatter(e.miDate) : ' ',
                })),
              )
            } else {
              setLoading(false)
              setMaterialTbl([])
            }
          } else {
            setLoading(false)
            setMaterialTbl([])
          }
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      messageReturn(405)
    }
  }
  const handleGetPartNumber = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getpoInstoreDtlByPmId',
        requestData: {
          isFlag: 1,
          tenantId: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData && response.responseData.length > 0) {
            setPartNumberDropdown(response.responseData)
          } else {
            setPartNumberDropdown([])
          }
        } else {
          setPartNumberDropdown([])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDtlLink = async e => {
    setIsModalVisible(true)
    setDtlLoading(true)
    // setMicode(e.miCode)
    try {
      const response = await indentFileUpload({
        requestPath: 'getMaterialIssueDtl',
        requestData: {
          hdrId: e.miHdrId,
          tenantId: tenantid,
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
  const calculateSno = index => {
    return (pagination.current - 1) * pagination.pageSize + index + 1
  }

  // const handleIssuedQtyChange = (val, rec, index) => {
  //   const id = index + 1
  //   const filterRec = miDtlLst.filter(item => item.id === id)
  //   if (val !== '') {
  //     if (
  //       parseInt(filterRec[0].requestedQty, 10) >= parseInt(val, 10) &&
  //       parseInt(filterRec[0].availableQty, 10) >= parseInt(val, 10)
  //     ) {
  //       inputform.setFieldsValue({ [`issuedQty_${index + 1}`]: parseInt(val, 10) })
  //     } else {
  //       const fieldName = `issuedQty_${index + 1}`
  //       inputform.setFieldsValue({ [fieldName]: parseInt(filterRec[0].issuedQty, 100) })
  //       messageReturn(672)
  //     }
  //   } else {
  //     inputform.setFieldsValue({ [`issuedQty_${index + 1}`]: '' })
  //   }
  // }

  const handleIssuedQtyChange = (val, rec, index) => {
    const id = index + 1
    const filterRec = miDtlLst.filter(item => item.id === id)

    if (val !== '') {
      const requestedQty = parseFloat(filterRec[0].requestedQty)
      const availableQty = parseFloat(filterRec[0].availableQty)
      const inputVal = parseFloat(val)

      if (requestedQty >= inputVal && availableQty >= inputVal) {
        inputform.setFieldsValue({ [`issuedQty_${index + 1}`]: inputVal })
      } else {
        const fieldName = `issuedQty_${index + 1}`
        inputform.setFieldsValue({ [fieldName]: parseFloat(filterRec[0].issuedQty) })
        messageReturn(672)
      }
    } else {
      inputform.setFieldsValue({ [`issuedQty_${index + 1}`]: '' })
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (_, __, index) => calculateSno(index),
    },
    {
      title: 'Project Code',
      dataIndex: 'projCode',
      key: 'projCode',
      filters: FilterProjCode,
      filteredValue: filterMtrTbl.projCode,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'MR Code',
      dataIndex: 'mrCode',
      key: 'mrCode',
      filters: FilterMrCode,
      filteredValue: filterMtrTbl.mrCode,
      onFilter: (value, record) => record?.mrCode === value,
    },
    {
      title: 'MR Date',
      dataIndex: 'requestedOn',
      key: 'requestedOn',
      filters: FilterMrDate,
      filteredValue: filterMtrTbl.requestedOn,
      onFilter: (value, record) => record?.requestedOn === value,
      render: (text, record) => moment(record.requestedOn).format('DD-MMM-YYYY'),
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
      key: 'productCount',
      align: 'right',
      filters: FilterProductCount,
      filteredValue: filterMtrTbl.productCount,
      onFilter: (value, record) => record?.productCount === value,
    },
    {
      title: 'MI Code',
      dataIndex: 'miCode',
      key: 'miCode',
      filters: FilterMiCode,
      filteredValue: filterMtrTbl.miCode,
      onFilter: (value, record) => record?.miCode === value,
    },
    {
      title: 'MI Date',
      dataIndex: 'issuedOn',
      key: 'issuedOn',
      filters: FilterMiDate,
      filteredValue: filterMtrTbl.issuedOn,
      onFilter: (value, record) => record?.issuedOn === value,
      render: text => {
        const [datePart, timePart] = text.split(' ')
        const formattedDate = moment(datePart, 'YYYY-MM-DD').format('DD-MMM-YYYY')
        return `${formattedDate} ${timePart}`
      },
    },
    // {
    //   title: 'Part Number',
    //   dataIndex: 'productCode',
    //   key: 'productCode',
    //   filters: FilterProductCode,
    //   filteredValue: filterMtrTbl.productCode,
    //   onFilter: (value, record) => record?.productCode === value,
    // },
    // {
    //   title: 'Description',
    //   dataIndex: 'productDesc',
    //   key: 'productDesc',
    //   filters: FilterProductDesc,
    //   filteredValue: filterMtrTbl.productDesc,
    //   onFilter: (value, record) => record?.productDesc === value,
    // },
    // {
    //   title: 'UOM',
    //   dataIndex: 'uomLongDesc',
    //   key: 'uomLongDesc',
    // },
    // {
    //   title: 'Available Qty.',
    //   dataIndex: 'availableQty',
    //   key: 'availableQty',
    //   align: 'right',
    //   render: text => ({
    //     children: parseFloat(text, 10).toLocaleString('en-IN'),
    //     props: {
    //       style: { textAlign: 'right' },
    //     },
    //   }),
    // },
    // {
    //   title: 'Requested Qty.',
    //   dataIndex: 'requestedQty',
    //   key: 'requestedQty',
    //   align: 'right',
    //   render: text => ({
    //     children: parseFloat(text, 10).toLocaleString('en-IN'),
    //     props: {
    //       style: { textAlign: 'right' },
    //     },
    //   }),
    // },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      filters: FilterReqestedBy,
      filteredValue: filterMtrTbl.requestedBy,
      onFilter: (value, record) => record?.requestedBy === value,
    },
    // {
    //   title: 'Issued Qty.',
    //   dataIndex: 'issuedQty',
    //   key: 'issuedQty',
    //   align: 'right',
    //   render: text => ({
    //     children: parseFloat(text, 10).toLocaleString('en-IN'),
    //     props: {
    //       style: { textAlign: 'right' },
    //     },
    //   }),
    // },
    // {
    //   title: 'Issued On',
    //   dataIndex: 'issuedOn',
    //   key: 'issuedOn',
    //   render: (text) => {
    //     const [datePart, timePart] = text.split(' ');
    //     const formattedDate = moment(datePart, 'YYYY-MM-DD').format('DD-MMM-YYYY');
    //     return `${formattedDate} ${timePart}`;
    //   },
    // },
    {
      title: 'Issued By',
      dataIndex: 'issuedBy',
      key: 'issuedBy',
      filters: FilterIssuedBy,
      filteredValue: filterMtrTbl.issuedBy,
      onFilter: (value, record) => record?.issuedBy === value,
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      filters: FilterIsCompleted,
      filteredValue: filterMtrTbl.isCompleted,
      onFilter: (value, record) => record?.isCompleted === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ButtonComponent type="primary" text="Details" onClick={() => handleDtlLink(record)} />
        </div>
      ),
    },
  ]
  const Dtlcolumns = [
    {
      title: 'S.No',
      dataIndex: 'mrDtlId',
      key: 'mrDtlId',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: FilterProductCode,
      filteredValue: filterMtrTbl.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: FilterProductDesc,
      filteredValue: filterMtrTbl.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
    },
    {
      title: 'Available Qty.',
      dataIndex: 'availableQty',
      key: 'availableQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Requested Qty.',
      dataIndex: 'requestedQty',
      key: 'requestedQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Issued Qty.',
      dataIndex: 'issuedQty',
      key: 'issuedQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
  ]
  const Addtblcolumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Part Number',
      dataIndex: 'productode',
      key: 'productode',
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
    },
    {
      title: 'BIN',
      dataIndex: 'bin',
      key: 'bin',
      render: text => (text !== null ? text : ''),
    },
    {
      title: 'Available Qty.',
      dataIndex: 'inventoryQty',
      key: 'inventoryQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Requested Qty.',
      dataIndex: 'requierdQty',
      key: 'requierdQty',
      align: 'right',
      render: text => ({
        children: parseFloat(text, 10).toLocaleString('en-IN'),
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Issued Qty.',
      dataIndex: 'issuedQty',
      key: 'issuedQty',
      align: 'right',
      render: (text, record, index) => (
        <Form form={inputform}>
          <Form.Item name={`issuedQty_${index + 1}`} initialValue={0} style={{ marginTop: '15px' }}>
            <Input
              onChange={e => handleIssuedQtyChange(e.target.value, record, index)}
              type="number"
              style={{ width: '80px' }}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]
  const handleClear = () => {
    form.resetFields()
    setIsDisplay(false)
    setDtlTbl([])
  }
  const handleExportCSV = val => {
    const tabData = val === 0 ? materialTbl : val === 2 ? retrieveData : dtlTable
    const tabCol = val === 0 ? columns : val === 2 ? Addtblcolumns : Dtlcolumns
    let csvData
    let csvContent
    if (val === 0) {
      csvData = tabData.map(row => {
        const rowData = tabCol.slice(1, -1).map(col => row[col.dataIndex])
        return rowData.join(',')
      })
      csvContent = [
        tabCol
          .slice(1, -1)
          .map(col => col.title)
          .join(','),
        ...csvData,
      ].join('\n')
    } else {
      csvData = tabData.map(row => {
        const rowData = tabCol.map(col => row[col.dataIndex])
        return rowData.slice(1).join(',')
      })
      csvContent = [
        tabCol
          .slice(1)
          .map(col => col.title)
          .join(','),
        ...csvData,
      ].join('\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `${
          val === 0
            ? `Material_Request_Details_${currentDateTime}`
            : `Material_Issue_Details${currentDateTime}`
        }.csv`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const DetailsTableComponent = () => {
    return (
      <div>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={() => handleExportCSV(1)}
          style={{ marginTop: '10px' }}
        >
          Export to CSV
        </Button>
        <Skeleton loading={dtlLoading} active>
          <Table
            dataSource={dtlTable}
            columns={Dtlcolumns}
            // exportableProps={{
            //   fileName: `Inventory`,
            //   btnProps: {
            //     type: 'primary',
            //     icon: <FileExcelOutlined />,
            //     children: <span>Export to CSV</span>,
            //   },
            // }}
            // handleChange={FilterChange}
          />
        </Skeleton>
      </div>
    )
  }
  const handleProjSelect = val => {
    Addform.resetFields(['mrcode'])
    setProject(val)
    getMrCodeDtl(val)
  }
  const getMrCodeDtl = async e => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getMaterialReqHdr',
        requestData: {
          hdrId: e,
          tenantId: tenantid,
          requestType: '1',
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setMrCodeDropdown(response.responseData)
          } else {
            setMrCodeDropdown([])
          }
        } else {
          setMrCodeDropdown([])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRetrieveData = async () => {
    // const formValues = Addform.getFieldsValue()
    // if (formValues.addProject !== undefined && formValues.mrcode !== undefined) {
    setDtlLoading(true)
    setAddDisplay(true)
    try {
      const response = await indentFileUpload({
        requestPath: 'retriveFromIssueStock',
        requestData: {
          hdrId: mrCode,
          tenantId: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setDtlLoading(false)
            setRetrieveData(response.responseData)
          } else {
            setDtlLoading(false)
            setRetrieveData([])
          }
        } else {
          setDtlLoading(false)
          setRetrieveData([])
        }
      }
    } catch (err) {
      setDtlLoading(false)
      console.error(err)
    }
  }

  const handleMRCode = val => {
    setMRCode(val)
  }
  const handleAddTblClear = () => {
    Addform.resetFields()
    Remarkform.resetFields()
    setRetrieveData([])
    setAddDisplay(false)
  }
  const handleSave = async () => {
    // const formval = Addform.getFieldsValue()
    const remarkVal = Remarkform.getFieldsValue()
    try {
      // const validRows = miDtlLst.filter(item => item.issuedQty !== '0')
      if (miDtlLst.length > 0) {
        const formValues = inputform.getFieldsValue()
        const validRows = miDtlLst.map((item, index) => {
          const obj = {
            mrDtlId: item.mrDtlId,
            productId: item.productId,
            requestedQty: item.requestedQty,
            availableQty:
              item.availableQty - parseFloat(formValues[`issuedQty_${index + 1}`], 10) || 0,
            tenantId: item.tenantId,
            issuedQty: parseFloat(formValues[`issuedQty_${index + 1}`], 10) || 0,
          }
          const objAsString = {}
          Object.keys(obj).forEach(key => {
            objAsString[key] = String(obj[key])
          })
          return objAsString
        })

        const reqArr = {
          pmHdrId: proval,
          mrHdrId: mrCode,
          issuedBy: empid,
          remarks: remarkVal.remark !== undefined ? remarkVal.remark : '',
          tenantId: tenantid,
          miDtlList: validRows,
          empId: empid,
        }
        const response = await indentFileUpload({
          requestPath: 'insertMaterialIssueHdrAndDtl',
          requestData: reqArr,
        })
        if (response) {
          if (response.responseCode === '200') {
            handleAddTblClear()
            inputform.resetFields()
            setIsAddMaterial(false)
            handleSubmitMtrlDtl()
            message.success(response.responseMessage)
            handleRetrieveData()
          } else {
            handleAddTblClear()
            inputform.resetFields()
            setIsAddMaterial(false)
            message.error(response.responseMessage)
            handleRetrieveData()
          }
        }
      } else {
        messageReturn(405)
      }
    } catch (err) {
      setDtlLoading(false)
      console.error(err)
    }
  }
  const handleCancel = () => {
    Addform.resetFields()
    Remarkform.resetFields()
    setRetrieveData([])
    setIsAddMaterial(false)
  }
  const AddTableComponent = () => {
    return (
      <div>
        <Form form={Addform} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-3">
              <Form.Item
                name="addProject"
                label={
                  <span>
                    Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Project"
                  style={{ width: '200px' }}
                  onChange={(value, option) => handleProjSelect(value, option)}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {projectDropdown &&
                    projectDropdown.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projCode}-{item.customerName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="mrcode"
                label={
                  <span>
                    MR Code<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select MR Code"
                  style={{ width: '200px' }}
                  onChange={(value, option) => handleMRCode(value, option)}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {mrCodedropdown &&
                    mrCodedropdown
                      .filter(item => item.completed === '0' && item.cancelled === '0')
                      .map(item => (
                        <Option key={item.mrHdrId} value={item.mrHdrId}>
                          {item.mrCode}
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
            onClick={handleRetrieveData}
          />
          <ButtonComponent type="primary" text="Clear" onClick={handleAddTblClear} />
        </div>
        <div style={{ marginTop: '10px', display: isAddDisplay ? 'block' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => handleExportCSV(2)}
              style={{ marginTop: '10px' }}
            >
              Export to CSV
            </Button>
            <Form form={Remarkform} layout="vertical" labelAlign="left">
              <div className="row form_datas" style={{ marginTop: '10px' }}>
                <p
                  style={
                    isMobile ? { marginTop: '35px' } : { marginTop: '10px', marginLeft: '5px' }
                  }
                >
                  {' '}
                  Remark :{' '}
                </p>
                <Form.Item name="remark" style={{ marginLeft: '5px', marginTop: '5px' }}>
                  <InputComponent type="text" placeholder="remark" />
                </Form.Item>
              </div>
            </Form>
          </div>
          <Skeleton loading={dtlLoading} active>
            <Table
              dataSource={retrieveData}
              columns={Addtblcolumns}
              // pagination={{ ...pagination, onChange: handlePageChange }}
              pagination={false}
              scroll={{ y: 300 }}
              sticky
              // handleChange={FilterChangeMtrTbl}
            />
          </Skeleton>
        </div>
        <div style={{ display: isAddDisplay ? 'flex' : 'none', justifyContent: 'center' }}>
          <ButtonComponent type="primary" text="Save" marginright="10px" onClick={handleSave} />
          <ButtonComponent type="primary" text="Cancel" onClick={handleCancel} />
        </div>
      </div>
    )
  }
  const handleCloseModal = () => {
    setIsModalVisible(false)
  }
  const handleCloseAddMaterial = () => {
    setIsAddMaterial(false)
  }
  const handlePageChange = page => {
    setPagination(prevPagination => ({
      ...prevPagination,
      current: page,
    }))
  }
  const handleAddMaterial = () => {
    Addform.resetFields()
    Remarkform.resetFields()
    setRetrieveData([])
    setAddDisplay(false)
    setIsAddMaterial(true)
  }
  const debouncedSearch = useCallback(
    // eslint-disable-next-line no-undef
    _.debounce(value => {
      const filtered = filteredmaterial.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
      setMaterialTbl(filtered)
    }, 300),
    [filteredmaterial],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card
        style={{ width: '100%', marginTop: '20px' }}
        title="Material Issue"
        extra={
          <div style={isMobile ? { position: 'absolute', right: '10px', top: '62px' } : {}}>
            <ButtonComponent
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              text="Create Material Issue"
              onClick={handleAddMaterial}
            />
          </div>
        }
      >
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
                  onChange={(value, option) => handleProjectChange(value, option)}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  <Option value="getAll">Get All</Option>
                  {projectDropdown &&
                    projectDropdown.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projCode}-{item.customerName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            {selectedProject && (
              <div className="col-md-2">
                <Form.Item name="PartNumber" label={<span>Part Number</span>}>
                  <AutoComplete
                    options={
                      partNumberDropdown &&
                      partNumberDropdown.map(item => ({
                        value: item.productCode, // text shown in the dropdown
                        productId: item.productId, // keep extra data if needed
                      }))
                    }
                    onChange={(value, option) => {
                      // Pass both code and productId to parent handler if needed
                      setPartNo(option.productId)
                    }}
                    style={{ width: '300px' }}
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  >
                    <Input placeholder="Select Part Number" />
                  </AutoComplete>
                </Form.Item>
              </div>
            )}
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent
            type="primary"
            text="Get Details"
            marginright="10px"
            onClick={handleSubmitMtrlDtl}
          />
          <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
        </div>

        <div style={{ display: isDisplay ? 'flex' : 'none', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => handleExportCSV(0)}
            style={{ marginTop: '10px' }}
          >
            Export to CSV
          </Button>
        </div>
        <div style={{ marginTop: '10px', display: isDisplay ? 'block' : 'none' }}>
          <Skeleton loading={isLoading} active>
            <Input.Search
              style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
              placeholder="Search here..."
              enterButton
              // onSearch={handleSearch}
              onChange={e => handleSearch(e)}
            />
            <Table
              dataSource={materialTbl}
              columns={columns}
              pagination={{ ...pagination, onChange: handlePageChange }}
              handleChange={FilterChangeMtrTbl}
              scroll={{ y: 400 }}
            />
          </Skeleton>
        </div>
        <ModalPopup
          text="Material Issue Details"
          isModalVisible={isModalVisible}
          onCancel={handleCloseModal}
          FieldsComponent={DetailsTableComponent}
          width="1000px"
        />
        <ModalPopup
          text="Issue Details"
          isModalVisible={isAddMaterial}
          onCancel={handleCloseAddMaterial}
          FieldsComponent={AddTableComponent}
          width="1000px"
        />
      </Card>
    </div>
  )
}

export default MaterialIssue
