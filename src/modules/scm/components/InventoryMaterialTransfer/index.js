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
  const [itemsTablePagination, setItemsTablePagination] = useState({ current: 1, pageSize: 20 })
  const [qtyCheckedKeys, setQtyCheckedKeys] = useState([])
  const [itemSearchText, setItemSearchText] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const selectedProject = Form.useWatch('Project', form)
  const selectedToProject = Form.useWatch('ToProject', form)
  const selectedFromLocation = Form.useWatch('Fromlocation', form)
  const selectedToLocation = Form.useWatch('Tolocation', form)
  const selectedRemarks = Form.useWatch('Remarks', form)
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
      setItemSearchText('')
      setShowSelectedOnly(false)
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
      setItemSearchText('')
      setShowSelectedOnly(false)
    } else {
      setTransferItems([])
      setSelectedRowKeys([])
      setQtyCheckedKeys([])
      setItemSearchText('')
      setShowSelectedOnly(false)
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

    const selectedRows = transferItems.filter(row => selectedRowKeys.includes(row.key))
    if (selectedRows.length === 0) {
      messageReturn(405)
      return
    }

    // getFieldsValue() alone only returns values for currently-mounted Form.Items - pagination unmounts
    // off-page rows, so a selection spanning multiple pages needs getFieldsValue(true) to include them
    // (same rc-field-form quirk already worked around for itemsFormValues above).
    const itemsFormData = itemsForm.getFieldsValue(true)
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
      if (sameProjectAndLocation && (rowToBin === undefined || rowToBin === '')) {
        messageReturn(689)
        return
      }
      if (sameProjectAndLocation && rowToBin === rowFromBin) {
        messageReturn(691)
        return
      }
      if (
        sameProjectAndLocation &&
        rowToBin !== rowFromBin &&
        Number(rowTransferQty) !== Number(rowAvailableQty)
      ) {
        messageReturn(690)
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
      setItemSearchText('')
      setShowSelectedOnly(false)
      setmaterialTable([])
    } else {
      message.error(response?.responseMessage)
    }
  }

  const sameProjectAndLocation =
    !!selectedProject &&
    !!selectedToProject &&
    selectedProject === selectedToProject &&
    !!selectedFromLocation &&
    !!selectedToLocation &&
    selectedFromLocation === selectedToLocation

  // A bin-to-bin move within the same Project+Location: product_mst only stores one Bin
  // value per product, so a partial qty move here would mislabel the leftover qty as
  // having moved too. Full qty is auto-locked for these rows (see the effect below);
  // same From/To Bin is a no-op and is blocked outright.
  const isBinToBinRow = record => {
    if (!sameProjectAndLocation) return false
    const rowFromBin = itemsFormValues[`fromBin_${record.key}`]
    const rowToBin = itemsFormValues[`toBin_${record.key}`]
    return !!rowToBin && rowToBin !== rowFromBin
  }
  const isSameBinRow = record => {
    if (!sameProjectAndLocation) return false
    const rowFromBin = itemsFormValues[`fromBin_${record.key}`]
    const rowToBin = itemsFormValues[`toBin_${record.key}`]
    return !!rowToBin && rowToBin === rowFromBin
  }

  useEffect(() => {
    if (!sameProjectAndLocation) return
    const fieldsToSet = {}
    let keysChanged = false
    const newQtyCheckedKeys = [...qtyCheckedKeys]

    selectedRowKeys.forEach(key => {
      const rowFromBin = itemsFormValues[`fromBin_${key}`]
      const rowToBin = itemsFormValues[`toBin_${key}`]
      const rowAvailableQty = itemsFormValues[`availableQty_${key}`]
      const isBinToBin = !!rowToBin && rowToBin !== rowFromBin

      if (isBinToBin && !newQtyCheckedKeys.includes(key)) {
        newQtyCheckedKeys.push(key)
        keysChanged = true
        fieldsToSet[`transferQuantity_${key}`] = rowAvailableQty
      }
    })

    if (keysChanged) {
      setQtyCheckedKeys(newQtyCheckedKeys)
      itemsForm.setFieldsValue(fieldsToSet)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameProjectAndLocation, selectedRowKeys, itemsFormValues])

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
        if (sameProjectAndLocation) {
          const rowToBin = itemsFormValues[`toBin_${row.key}`]
          if (rowToBin === undefined || rowToBin === '') return true
          if (isSameBinRow(row)) return true
          if (isBinToBinRow(row) && Number(rowTransferQty) !== Number(rowAvailableQty)) return true
        }
        return false
      })

  useEffect(() => {
    getAvailableProductsForTransfer(selectedProject, selectedFromLocation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, selectedFromLocation])

  useEffect(() => {
    setItemsTablePagination(prev => ({ ...prev, current: 1 }))
  }, [transferItems, itemSearchText, showSelectedOnly])

  useEffect(() => {
    if (selectedRowKeys.length === 0 && showSelectedOnly) {
      setShowSelectedOnly(false)
    }
  }, [selectedRowKeys, showSelectedOnly])

  const handleClearSelection = () => {
    const fieldsToSet = {}
    selectedRowKeys.forEach(key => {
      fieldsToSet[`transferQuantity_${key}`] = ''
    })
    itemsForm.setFieldsValue(fieldsToSet)
    setSelectedRowKeys([])
    setQtyCheckedKeys([])
  }

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
    setItemSearchText('')
    setShowSelectedOnly(false)
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

  const filteredTransferItems = transferItems
    .filter(row => !showSelectedOnly || selectedRowKeys.includes(row.key))
    .filter(row => {
      if (!itemSearchText) return true
      const q = itemSearchText.toLowerCase()
      return (
        (row.productCode || '').toLowerCase().includes(q) ||
        (row.productDesc || '').toLowerCase().includes(q) ||
        (row.spec || '').toLowerCase().includes(q)
      )
    })

  const currentPageStart = (itemsTablePagination.current - 1) * itemsTablePagination.pageSize
  const currentPageRows = filteredTransferItems.slice(
    currentPageStart,
    currentPageStart + itemsTablePagination.pageSize,
  )
  const currentPageSelectableRows = currentPageRows.filter(
    row => !isZeroAvailableQty(itemsFormValues[`availableQty_${row.key}`]),
  )
  const currentPageSelectableKeys = currentPageSelectableRows.map(row => row.key)

  const eligibleQtyKeys = currentPageRows
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
              currentPageSelectableKeys.length > 0 &&
              currentPageSelectableKeys.every(key => selectedRowKeys.includes(key))
            }
            indeterminate={
              currentPageSelectableKeys.some(key => selectedRowKeys.includes(key)) &&
              !currentPageSelectableKeys.every(key => selectedRowKeys.includes(key))
            }
            onChange={e => {
              if (e.target.checked) {
                setSelectedRowKeys(prev =>
                  Array.from(new Set([...prev, ...currentPageSelectableKeys])),
                )
              } else {
                const fieldsToSet = {}
                currentPageSelectableKeys.forEach(key => {
                  fieldsToSet[`transferQuantity_${key}`] = ''
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setSelectedRowKeys(prev =>
                  prev.filter(key => !currentPageSelectableKeys.includes(key)),
                )
                setQtyCheckedKeys(prev =>
                  prev.filter(key => !currentPageSelectableKeys.includes(key)),
                )
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
              eligibleQtyKeys.some(key => qtyCheckedKeys.includes(key)) &&
              !eligibleQtyKeys.every(key => qtyCheckedKeys.includes(key))
            }
            disabled={eligibleQtyKeys.length === 0}
            onChange={e => {
              const fieldsToSet = {}
              if (e.target.checked) {
                eligibleQtyKeys.forEach(key => {
                  fieldsToSet[`transferQuantity_${key}`] = itemsFormValues[`availableQty_${key}`]
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setQtyCheckedKeys(prev => Array.from(new Set([...prev, ...eligibleQtyKeys])))
              } else {
                eligibleQtyKeys.forEach(key => {
                  fieldsToSet[`transferQuantity_${key}`] = ''
                })
                itemsForm.setFieldsValue(fieldsToSet)
                setQtyCheckedKeys(prev => prev.filter(key => !eligibleQtyKeys.includes(key)))
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
              isZeroAvailableQty(itemsFormValues[`availableQty_${record.key}`]) ||
              isBinToBinRow(record)
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
      title: (
        <span>
          To Bin
          {sameProjectAndLocation && <strong style={{ color: 'red' }}> *</strong>}
        </span>
      ),
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
                    ? locationlist.map(item => (
                        <Option key={item.inventoryLocationCode} value={item.inventoryLocationCode}>
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
                    ? locationlist.map(item => (
                        <Option key={item.inventoryLocationCode} value={item.inventoryLocationCode}>
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {selectedRowKeys.length} item{selectedRowKeys.length === 1 ? '' : 's'} selected
            </span>
            <Button
              type="primary"
              onClick={handleClearSelection}
              disabled={selectedRowKeys.length === 0}
            >
              Clear Selection
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: isMobile ? '100%' : 'auto',
              flexWrap: 'wrap',
            }}
          >
            <Checkbox
              checked={showSelectedOnly}
              disabled={selectedRowKeys.length === 0}
              onChange={e => setShowSelectedOnly(e.target.checked)}
            >
              Show selected only
            </Checkbox>
            <Input.Search
              style={{ width: isMobile ? '100%' : '300px' }}
              placeholder="Search here..."
              enterButton
              allowClear
              value={itemSearchText}
              onChange={e => setItemSearchText(e.target.value)}
            />
          </div>
        </div>
        <Form form={itemsForm} preserve>
          <div style={{ maxHeight: '550px', overflowX: 'auto', overflowY: 'auto', clear: 'both' }}>
            <Table
              columns={getTransferItemsCol}
              dataSource={filteredTransferItems}
              rowKey="key"
              bordered
              loading={loadingItems}
              pagination={{
                current: itemsTablePagination.current,
                pageSize: itemsTablePagination.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: (page, pageSize) =>
                  setItemsTablePagination(prev => ({
                    current: pageSize !== prev.pageSize ? 1 : page,
                    pageSize,
                  })),
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
