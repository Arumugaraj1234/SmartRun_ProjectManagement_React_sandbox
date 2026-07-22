/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Form,
  Row,
  Divider,
  DatePicker,
  Button,
  Input,
  message,
  Select,
  Checkbox,
} from 'antd'
import { FileExcelOutlined, PlusOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import store from 'store'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { useMediaQuery } from 'react-responsive'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../../style.scss'
import currentDateTime from '../../../../currentDateTime'
import messageReturn from '_helpers/messageReturn'

const isZeroAvailableQty = availableQty =>
  availableQty !== undefined && availableQty !== '' && Number(availableQty) === 0

const formatProjectLabel = item => [item.projectCode, item.customerName].filter(Boolean).join('-')

const InventoryMaterialTransfer = () => {
  const [form] = Form.useForm()
  const [itemsForm] = Form.useForm()
  // Used only as a re-render trigger on every keystroke/value change in itemsForm.
  // Do NOT read values off this watch's return value directly (see itemsFormValues below) -
  // Form.useWatch's `preserve` option is unreliable in this antd/rc-field-form version and
  // was found (2026-07-22 debugging) to permanently return an empty object.
  Form.useWatch([], itemsForm)
  const itemsFormValues = itemsForm.getFieldsValue(true)
  const { Option } = Select
  const [materialTable, setmaterialTable] = useState([])
  const [material, setmaterial] = useState(null)
  const [projectlist, setprojectlist] = useState([])
  const [toprojectlist, settoprojectlist] = useState([])
  const [locationlist, setlocationlist] = useState([])
  const [projName, setProjectName] = useState('')
  const [insertModalVisible, setinsertmodalVisible] = useState(false)
  const [showMaterialDtl, setshowMaterialDtl] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  const [transferItems, setTransferItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [qtyCheckedKeys, setQtyCheckedKeys] = useState([])
  const selectedProject = Form.useWatch('Project', form)
  const selectedToProject = Form.useWatch('ToProject', form)
  const selectedFromLocation = Form.useWatch('Fromlocation', form)
  const selectedToLocation = Form.useWatch('Tolocation', form)
  const selectedRemarks = Form.useWatch('Remarks', form)
  const sameProjectSelected =
    !!selectedProject && !!selectedToProject && selectedProject === selectedToProject
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const tenantID = store.get('tenantId')
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')

  const currentYear = moment().year()
  const currentMonth = moment().month()

  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

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

  const isMountedRef = useRef(true)
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const modalVisibleRef = useRef(false)
  useEffect(() => {
    modalVisibleRef.current = insertModalVisible
  }, [insertModalVisible])

  const getMaterialdtl = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'retrieveinventoryMaterial',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    if (!isMountedRef.current) return
    if (response?.responseCode === '200') {
      setmaterialTable(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setmaterialTable([])
    }
  }
  const getprojectdropdown = async () => {
    const response = await indentFileUpload({
      requestPath: 'gettProjectdropdown',
      requestData: {
        tenantID,
      },
    })
    if (!isMountedRef.current) return
    if (response?.responseCode === '200') {
      setprojectlist(
        [...(response?.responseData || [])].sort((a, b) =>
          (a.projectCode || '').localeCompare(b.projectCode || '', undefined, { numeric: true }),
        ),
      )
    } else {
      message.error(response?.responseMessage)
      setprojectlist([])
    }
  }
  const gettoprojectdropdown = async () => {
    const response = await indentFileUpload({
      requestPath: 'gettProjectdropdown',
      requestData: {
        tenantID,
      },
    })
    if (!isMountedRef.current) return
    if (response?.responseCode === '200') {
      settoprojectlist(
        [...(response?.responseData || [])].sort((a, b) =>
          (a.projectCode || '').localeCompare(b.projectCode || '', undefined, { numeric: true }),
        ),
      )
    } else {
      message.error(response?.responseMessage)
      settoprojectlist([])
    }
  }
  const getAvailableProductsForTransfer = async (pmHdrId, locationCode) => {
    if (!pmHdrId || !locationCode) {
      setTransferItems([])
      setSelectedRowKeys([])
      setQtyCheckedKeys([])
      return
    }
    setLoadingItems(true)
    const response = await indentFileUpload({
      requestPath: 'getAvailableProductsForTransfer',
      requestData: {
        tenantId,
        pmHdrId,
        locationCode,
      },
    })
    if (!isMountedRef.current) return
    setLoadingItems(false)
    if (!modalVisibleRef.current) return
    if (response?.responseCode === '200') {
      const rows = (response?.responseData || []).map((item, index) => ({
        key: index + 1,
        productId: item.productId,
        productCode: item.productCode,
        productDesc: item.productDesc,
        spec: item.spec,
        availableQty: item.qty,
        fromBin: item.bin || '',
      }))
      itemsForm.resetFields()
      const fieldsToSet = {}
      rows.forEach(row => {
        fieldsToSet[`availableQty_${row.key}`] = row.availableQty
        fieldsToSet[`transferQuantity_${row.key}`] = ''
        fieldsToSet[`fromBin_${row.key}`] = row.fromBin
        fieldsToSet[`toBin_${row.key}`] = ''
      })
      itemsForm.setFieldsValue(fieldsToSet)
      setTransferItems(rows)
      setSelectedRowKeys([])
      setQtyCheckedKeys([])
    } else {
      setTransferItems([])
      setSelectedRowKeys([])
      setQtyCheckedKeys([])
    }
  }
  const getlocationdropdown = async () => {
    const response = await indentFileUpload({
      requestPath: 'getLocationdropdown',
      requestData: {
        tenantID,
      },
    })
    if (!isMountedRef.current) return
    if (response?.responseCode === '200') {
      setlocationlist(response?.responseData)
    } else {
      message.error(response?.responseMessage)
      setlocationlist([])
    }
  }

  const insertMaterialdtl = async () => {
    const formData = form.getFieldsValue()
    if (
      formData.Project === '' ||
      formData.Project === undefined ||
      formData.ToProject === '' ||
      formData.ToProject === undefined ||
      formData.Fromlocation === '' ||
      formData.Fromlocation === undefined ||
      formData.Tolocation === '' ||
      formData.Tolocation === undefined ||
      formData.Remarks === '' ||
      formData.Remarks === undefined
    ) {
      messageReturn(405)
      return
    }

    if (formData.Project === formData.ToProject && formData.Fromlocation === formData.Tolocation) {
      messageReturn(688)
      return
    }

    const selectedRows = transferItems.filter(row => selectedRowKeys.includes(row.key))
    if (selectedRows.length === 0) {
      messageReturn(405)
      return
    }

    const itemsFormData = itemsForm.getFieldsValue()
    const items = []
    for (let i = 0; i < selectedRows.length; i += 1) {
      const row = selectedRows[i]
      const rowProductId = row.productId
      const rowTransferQty = itemsFormData[`transferQuantity_${row.key}`]
      const rowAvailableQty = itemsFormData[`availableQty_${row.key}`]
      const rowFromBin = itemsFormData[`fromBin_${row.key}`]
      const rowToBin = itemsFormData[`toBin_${row.key}`]

      if (!rowProductId || rowTransferQty === undefined || rowTransferQty === '') {
        messageReturn(405)
        return
      }
      if (Number(rowTransferQty) === 0 || rowAvailableQty === undefined) {
        messageReturn(668)
        return
      }
      if (Number(rowAvailableQty) < Number(rowTransferQty)) {
        messageReturn(669)
        return
      }

      items.push({
        productId: rowProductId,
        productCode: row.productCode || '',
        desc: row.productDesc || '',
        spec: row.spec || '',
        transferQuantity: rowTransferQty,
        fromBin: Array.isArray(rowFromBin) ? rowFromBin.join(', ') : rowFromBin || '',
        toBin: rowToBin || '',
      })
    }

    const response = await indentFileUpload({
      requestPath: 'insertMaterialTransfer',
      requestData: {
        tenantId,
        createdBy: employeeId,
        fromPmHdrId: formData.Project,
        toPmHdrId: formData.ToProject,
        fromInventoryLocationCode: formData.Fromlocation,
        toInventoryLocationCode: formData.Tolocation,
        remark: formData.Remarks,
        items,
      },
    })
    if (!isMountedRef.current) return
    if (response?.responseCode === '200') {
      message.success(response?.responseMessage)
      setinsertmodalVisible(false)
      form.resetFields()
      itemsForm.resetFields()
      setTransferItems([])
      setSelectedRowKeys([])
      setQtyCheckedKeys([])
      setmaterialTable([])
    } else {
      message.error(response?.responseMessage)
    }
  }

  const isSubmitDisabled =
    !selectedProject ||
    !selectedToProject ||
    !selectedFromLocation ||
    !selectedToLocation ||
    !selectedRemarks ||
    selectedRowKeys.length === 0 ||
    transferItems
      .filter(row => selectedRowKeys.includes(row.key))
      .some(row => {
        const rowTransferQty = itemsFormValues[`transferQuantity_${row.key}`]
        const rowAvailableQty = itemsFormValues[`availableQty_${row.key}`]
        if (!row.productId || rowTransferQty === undefined || rowTransferQty === '') return true
        if (Number(rowTransferQty) === 0 || rowAvailableQty === undefined) return true
        if (Number(rowAvailableQty) < Number(rowTransferQty)) return true
        return false
      })

  useEffect(() => {
    getAvailableProductsForTransfer(selectedProject, selectedFromLocation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, selectedFromLocation])

  useEffect(() => {
    if (sameProjectSelected && selectedToLocation && selectedToLocation === selectedFromLocation) {
      form.setFieldsValue({ Tolocation: undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameProjectSelected, selectedFromLocation])

  const handleGetDetails = formData => {
    getMaterialdtl(formData)
  }
  const handleClear = () => {
    form.resetFields()
    setmaterialTable([])
  }
  const handleDetailCancel = () => {
    setinsertmodalVisible(false)
    setshowMaterialDtl(false)
    setprojectlist([])
    setlocationlist([])
    settoprojectlist([])
    form.resetFields()
    itemsForm.resetFields()
    setTransferItems([])
    setSelectedRowKeys([])
    setQtyCheckedKeys([])
  }
  const showModal = record => {
    setshowMaterialDtl(true)
    setmaterial(record)
  }
  const handleChangeProject = e => {
    setProjectName(e.key)
  }
  const handleTransferQtyChange = (e, record) => {
    const rawValue = e.target.value
    if (rawValue === '') return
    let sanitized = rawValue.replace(/[^\d.]/g, '')
    const firstDotIndex = sanitized.indexOf('.')
    if (firstDotIndex !== -1) {
      sanitized =
        sanitized.slice(0, firstDotIndex + 1) +
        sanitized.slice(firstDotIndex + 1).replace(/\./g, '')
    }
    if (sanitized !== rawValue) {
      itemsForm.setFieldsValue({ [`transferQuantity_${record.key}`]: sanitized })
      return
    }
    const availableQty = itemsFormValues[`availableQty_${record.key}`]
    if (availableQty === undefined || availableQty === '') return
    const availNum = Number(availableQty)
    if (Number.isFinite(availNum) && Number(sanitized) > availNum) {
      itemsForm.setFieldsValue({ [`transferQuantity_${record.key}`]: String(availNum) })
      message.warning(`Transfer quantity cannot exceed available quantity (${availNum})`)
    }
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const FilterProductcode = []
  const FilterProject = []
  const FilterToproject = []
  const FilterFromLocation = []
  const FIlterTolocation = []
  const Filterransferdby = []

  if (materialTable) {
    materialTable.map(h => {
      return FilterProductcode.push(h.productCode)
    })
    materialTable.map(h => {
      return FilterProject.push(h.frmprojectName)
    })
    materialTable.map(h => {
      return FilterToproject.push(h.toprojectName)
    })
    materialTable.map(h => {
      return FilterFromLocation.push(h.fromLocationDesc)
    })
    materialTable.map(h => {
      return FIlterTolocation.push(h.toLocationDesc)
    })
    materialTable.map(h => {
      return Filterransferdby.push(h.createdBy)
    })
  }
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const filterprocode = FilterProductcode.filter(distinct)
  const filterproject = FilterProject.filter(distinct)
  const filtertoproject = FilterToproject.filter(distinct)
  const filteredfromlocation = FilterFromLocation.filter(distinct)
  const filtertolocation = FIlterTolocation.filter(distinct)
  const filtertransferdby = Filterransferdby.filter(distinct)

  const FilteredPRoductCOde = []
  const FilteredProject = []
  const FIlteredTOProject = []
  const FilteredFromLocation = []
  const FilteredToLocation = []
  const FilteredTransferedBY = []

  filterprocode.map(element => {
    return FilteredPRoductCOde.push({
      text: element,
      value: element,
    })
  })
  filterproject.map(element => {
    return FilteredProject.push({
      text: element,
      value: element,
    })
  })
  filtertoproject.map(element => {
    return FIlteredTOProject.push({
      text: element,
      value: element,
    })
  })
  filteredfromlocation.map(element => {
    return FilteredFromLocation.push({
      text: element,
      value: element,
    })
  })
  filtertolocation.map(element => {
    return FilteredToLocation.push({
      text: element,
      value: element,
    })
  })
  filtertransferdby.map(element => {
    return FilteredTransferedBY.push({
      text: element,
      value: element,
    })
  })

  const column = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Reference ID',
      dataIndex: 'referenceId',
      key: 'referenceId',
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: FilteredPRoductCOde,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      align: 'center',
    },
    {
      title: 'From Project',
      dataIndex: 'frmprojectName',
      key: 'frmprojectName',
      filters: FilteredProject,
      filteredValue: filtersinfo.frmprojectName,
      onFilter: (value, record) => record?.frmprojectName === value,
    },
    {
      title: 'To Project',
      dataIndex: 'toprojectName',
      key: 'toprojectName',
      filters: FIlteredTOProject,
      filteredValue: filtersinfo.toprojectName,
      onFilter: (value, record) => record?.toprojectName === value,
    },
    {
      title: 'From Location',
      dataIndex: 'fromLocationDesc',
      key: 'fromLocationDesc',
      filters: FilteredFromLocation,
      filteredValue: filtersinfo.fromLocationDesc,
      onFilter: (value, record) => record?.fromLocationDesc === value,
    },
    {
      title: 'To Location',
      dataIndex: 'toLocationDesc',
      key: 'toLocationDesc',
      filters: FilteredToLocation,
      filteredValue: filtersinfo.toLocationDesc,
      onFilter: (value, record) => record?.toLocationDesc === value,
    },
    {
      title: 'Transferred Qty',
      dataIndex: 'transferQuantity',
      key: 'transferQuantity',
      align: 'right',
    },
    {
      title: 'Transferred On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (text, record) =>
        record.createdOn ? moment(record.createdOn).format('DD-MMM-YYYY HH:mm') : '',
    },
    {
      title: 'Transferred By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      filters: FilteredTransferedBY,
      filteredValue: filtersinfo.createdBy,
      onFilter: (value, record) => record?.createdBy === value,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      align: 'center',
      render: (record, index) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button
            type="primary"
            onClick={() => {
              showModal(record, index)
            }}
          >
            Details
          </Button>
        </div>
      ),
    },
  ]

  const eligibleQtyKeys = transferItems
    .filter(
      row =>
        selectedRowKeys.includes(row.key) &&
        !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]),
    )
    .map(row => row.key)

  const getTransferItemsCol = [
    {
      title: ' S.No',
      dataIndex: 'key',
      render: (_, record, index) => index + 1,
    },
    {
      title: (
        <span>
          <Checkbox
            checked={
              transferItems.length > 0 &&
              transferItems
                .filter(row => !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]))
                .every(row => selectedRowKeys.includes(row.key)) &&
              transferItems.some(
                row => !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]),
              )
            }
            indeterminate={
              selectedRowKeys.length > 0 &&
              !transferItems
                .filter(row => !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]))
                .every(row => selectedRowKeys.includes(row.key))
            }
            onChange={e => {
              if (e.target.checked) {
                const selectableRows = transferItems.filter(
                  row => !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]),
                )
                setSelectedRowKeys(selectableRows.map(row => row.key))
              } else {
                const fieldsToSet = {}
                transferItems.forEach(row => {
                  fieldsToSet[`transferQuantity_${row.key}`] = ''
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setSelectedRowKeys([])
                setQtyCheckedKeys([])
              }
            }}
          />
          <span style={{ marginLeft: 8 }}>Part No</span>
        </span>
      ),
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => (
        <span>
          <Checkbox
            checked={selectedRowKeys.includes(record.key)}
            disabled={isZeroAvailableQty(itemsFormValues[`availableQty_${record.key}`])}
            onChange={e => {
              setSelectedRowKeys(prev =>
                e.target.checked ? [...prev, record.key] : prev.filter(key => key !== record.key),
              )
              if (!e.target.checked) {
                setQtyCheckedKeys(prev => prev.filter(key => key !== record.key))
                itemsForm.setFieldsValue({ [`transferQuantity_${record.key}`]: '' })
              }
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}</span>
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
    },
    {
      title: 'Specification',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: 'Available Qty',
      dataIndex: 'availableQty',
      key: 'availableQty',
      render: (text, record) => (
        <Form.Item name={`availableQty_${record.key}`} initialValue={record.availableQty}>
          <Input type="text" disabled />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          <Checkbox
            checked={
              eligibleQtyKeys.length > 0 &&
              eligibleQtyKeys.every(key => qtyCheckedKeys.includes(key))
            }
            indeterminate={
              qtyCheckedKeys.length > 0 &&
              !(
                eligibleQtyKeys.length > 0 &&
                eligibleQtyKeys.every(key => qtyCheckedKeys.includes(key))
              )
            }
            disabled={eligibleQtyKeys.length === 0}
            onChange={e => {
              const fieldsToSet = {}
              if (e.target.checked) {
                eligibleQtyKeys.forEach(key => {
                  fieldsToSet[`transferQuantity_${key}`] = itemsFormValues[`availableQty_${key}`]
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setQtyCheckedKeys(eligibleQtyKeys)
              } else {
                eligibleQtyKeys.forEach(key => {
                  fieldsToSet[`transferQuantity_${key}`] = ''
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setQtyCheckedKeys([])
              }
            }}
          />
          <span style={{ marginLeft: 8 }}>
            Transfer Qty<strong style={{ color: 'red' }}> *</strong>
          </span>
        </span>
      ),
      dataIndex: 'transferQuantity',
      key: 'transferQuantity',
      render: (text, record) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={qtyCheckedKeys.includes(record.key)}
            disabled={
              !selectedRowKeys.includes(record.key) ||
              isZeroAvailableQty(itemsFormValues[`availableQty_${record.key}`])
            }
            onChange={e => {
              if (e.target.checked) {
                setQtyCheckedKeys(prev => [...prev, record.key])
                itemsForm.setFieldsValue({
                  [`transferQuantity_${record.key}`]: itemsFormValues[`availableQty_${record.key}`],
                })
              } else {
                setQtyCheckedKeys(prev => prev.filter(key => key !== record.key))
                itemsForm.setFieldsValue({ [`transferQuantity_${record.key}`]: '' })
              }
            }}
          />
          <Form.Item
            name={`transferQuantity_${record.key}`}
            initialValue={record.transferQuantity}
            style={{ marginBottom: 0, flex: 1 }}
          >
            <Input
              type="text"
              disabled={
                !selectedRowKeys.includes(record.key) ||
                isZeroAvailableQty(itemsFormValues[`availableQty_${record.key}`]) ||
                qtyCheckedKeys.includes(record.key)
              }
              onChange={e => handleTransferQtyChange(e, record)}
            />
          </Form.Item>
        </span>
      ),
    },
    {
      title: 'From Bin',
      dataIndex: 'fromBin',
      key: 'fromBin',
      render: (text, record) => (
        <Form.Item name={`fromBin_${record.key}`} initialValue={record.fromBin}>
          <Input type="text" disabled />
        </Form.Item>
      ),
    },
    {
      title: 'To Bin',
      dataIndex: 'toBin',
      key: 'toBin',
      render: (text, record) => (
        <Form.Item name={`toBin_${record.key}`} initialValue={record.toBin}>
          <Input
            type="text"
            disabled={
              !selectedRowKeys.includes(record.key) ||
              isZeroAvailableQty(itemsFormValues[`availableQty_${record.key}`])
            }
          />
        </Form.Item>
      ),
    },
  ]

  const openinsertcard = () => {
    return (
      <div>
        <Form form={form}>
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
                  style={{ width: '100%', paddingLeft: '25px' }}
                  placeholder="Select Project"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value, option) => handleChangeProject(option, value)}
                  value={projName}
                >
                  {projectlist
                    ? projectlist.map(item => (
                        <Option key={item.projectId} value={item.projectId}>
                          {formatProjectLabel(item)}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="ToProject"
                label={
                  <span>
                    To Project<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  style={{ width: '100%', paddingLeft: '15px' }}
                  placeholder="Select Project"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {toprojectlist
                    ? toprojectlist.map(item => (
                        <Option key={item.projectId} value={item.projectId}>
                          {formatProjectLabel(item)}
                        </Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Fromlocation"
                label={
                  <span>
                    From Location<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '90%' }} placeholder="Select Location">
                  {locationlist
                    ? locationlist
                        .filter(
                          item =>
                            !(
                              sameProjectSelected &&
                              item.inventoryLocationCode === selectedToLocation
                            ),
                        )
                        .map(item => (
                          <Option
                            key={item.inventoryLocationCode}
                            value={item.inventoryLocationCode}
                          >
                            {item.inventoryLocationDescription}
                          </Option>
                        ))
                    : null}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Tolocation"
                label={
                  <span>
                    To Location<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select style={{ width: '100%' }} placeholder="Select Location">
                  {locationlist
                    ? locationlist
                        .filter(
                          item =>
                            !(
                              sameProjectSelected &&
                              item.inventoryLocationCode === selectedFromLocation
                            ),
                        )
                        .map(item => (
                          <Option
                            key={item.inventoryLocationCode}
                            value={item.inventoryLocationCode}
                          >
                            {item.inventoryLocationDescription}
                          </Option>
                        ))
                    : null}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Remarks"
                label={
                  <span>
                    Remarks<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </div>
          </div>
        </Form>
        <Form form={itemsForm} preserve>
          <div style={{ maxHeight: '550px', overflowX: 'auto', overflowY: 'auto' }}>
            <Table
              columns={getTransferItemsCol}
              dataSource={transferItems}
              rowKey="key"
              bordered
              loading={loadingItems}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
            />
          </div>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
          <Button type="primary" onClick={insertMaterialdtl} disabled={isSubmitDisabled}>
            Submit
          </Button>
          <Button type="primary" onClick={handleDetailCancel}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  const openinsertcardRef = useRef(openinsertcard)
  openinsertcardRef.current = openinsertcard
  const StableInsertCard = useRef(() => openinsertcardRef.current()).current

  const DtlFieldComponent = () => {
    return (
      <div className="data-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            Part Number
          </span>
          <span>:&nbsp;{material?.productCode}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Description
          </span>
          <span>:&nbsp;{material?.productDesc}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            UOM
          </span>
          <span>:&nbsp;{material?.uom}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            From Project
          </span>
          <span>:&nbsp;{material?.frmprojectName}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            To Project
          </span>
          <span>:&nbsp;{material?.toprojectName}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            Transferred On
          </span>
          <span>:&nbsp;{moment(material?.transferOn).format('DD-MMM-YYYY HH:mm')}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            Transferred Qty
          </span>
          <span>:&nbsp;{material?.transferQuantity}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Transferred By
          </span>
          <span>:&nbsp;{material?.createdBy}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            From Location
          </span>
          <span>:&nbsp;{material?.fromLocationDesc}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            To Location
          </span>
          <span>:&nbsp;{material?.toLocationDesc}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            From Bin
          </span>
          <span>:&nbsp;{material?.fromBin ? material.fromBin : '-'}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            To Bin
          </span>
          <span>:&nbsp;{material?.toBin ? material.toBin : '-'}</span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-4 tob_label" style={{ fontWeight: 'bold' }}>
            Unit Cost (Rs.)
          </span>

          <span>
            :&nbsp;
            {material?.unitCost !== undefined && material?.unitCost !== null
              ? parseFloat(material?.unitCost).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '0.00'}
          </span>
        </div>
        <div className="col-4 tob_details" style={{ flexbasis: '25%' }}>
          <span className="col-5 tob_label" style={{ fontWeight: 'bold' }}>
            Total Cost (Rs.)
          </span>
          <span>
            :&nbsp;
            {material?.overAllCost !== undefined && material?.overAllCost !== null
              ? parseFloat(material?.overAllCost).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '0.00'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card
        style={{ width: '100%' }}
        title="Inventory Material Transfer"
        extra={
          <div style={isMobile ? { position: 'absolute', right: '10px', top: '62px' } : {}}>
            <ButtonComponent
              text="New Material Transfer"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={() => {
                openinsertcard()
                getprojectdropdown()
                gettoprojectdropdown()
                getlocationdropdown()
                setinsertmodalVisible(true)
              }}
            />
          </div>
        }
      >
        <Form form={form}>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="FromDate"
                label={<span>From Date</span>}
                initialValue={moment(defaultFromDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={d => !d || d.isAfter(form.getFieldValue('ToDate'))}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
              <Form.Item
                name="ToDate"
                label={<span>To Date</span>}
                initialValue={moment(defaultToDate)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={d => !d || d.isBefore(form.getFieldValue('FromDate'))}
                  format="DD-MMM-YYYY"
                />
              </Form.Item>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={handleGetDetails}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </Form>
        {materialTable && materialTable.length > 0 ? (
          <div>
            <Row>
              <Divider orientation="left">Material Transfer Details</Divider>
            </Row>
            <div>
              <Table
                columns={column}
                dataSource={materialTable}
                exportableProps={{
                  fileName: `Inventory_Material_Transfer_${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [materialTable?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : null}
        {insertModalVisible ? (
          <ModalPopup
            text="New Material Transfer"
            FieldsComponent={StableInsertCard}
            isModalVisible="setinsertmodalVisible"
            width="900"
            onCancel={() => {
              handleDetailCancel()
            }}
          />
        ) : null}
      </Card>
      {showMaterialDtl ? (
        <ModalPopup
          text={`Material Transfer Details - ${material?.referenceId}`}
          isModalVisible="setshowMaterialDtl"
          onCancel={() => {
            handleDetailCancel()
          }}
          FieldsComponent={DtlFieldComponent}
          width="900"
        />
      ) : null}
    </div>
  )
}

export default InventoryMaterialTransfer
