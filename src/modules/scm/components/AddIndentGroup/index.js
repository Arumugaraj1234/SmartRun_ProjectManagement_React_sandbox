/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Form, DatePicker, message, Input, Select, Spin, Checkbox } from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import store from 'store'
import moment from 'moment'
import ButtonComponent from 'components/shared/ButtonComponent'
import { Table } from 'ant-table-extensions'
import ModalPopup from 'components/shared/ModalPopupComponent'
import InputComponent from 'components/shared/InputComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import messageReturn from '_helpers/messageReturn'
import './style.scss'
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
  // Station-based grouping is NEW-flow only; LEGACY projects keep the single-indent dropdown.
  const [stationList, setStationList] = useState([])
  const [costFlowType, setCostFlowType] = useState('LEGACY')
  const isNewFlow = costFlowType === 'NEW'

  const [indentTable, setIndentTable] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])

  // Parts-table search + "show selected only" (rows with Allocate Qty > 0).
  const [searchText, setSearchText] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [selectedSnos, setSelectedSnos] = useState(new Set())
  const handleSearchRef = useRef(debounce(value => setSearchText(value), 300))
  // FieldsComponent is rendered as <FieldsComponent /> inside ModalPopup, so redefining it every
  // render would remount the whole subtree (losing input focus) whenever search/checkbox state
  // changes. Keep one stable function and feed it live data through this ref (same pattern as
  // AddAssyMaterialStaging).
  const fieldsStateRef = useRef({})

  const updateSelected = (sno, value) => {
    setSelectedSnos(prev => {
      const next = new Set(prev)
      if (value !== '' && value !== undefined && value !== null && Number(value) > 0) {
        next.add(sno)
      } else {
        next.delete(sno)
      }
      return next
    })
  }

  useEffect(() => {
    getProjectList()
    getCostFlowType()
  }, [])

  const getCostFlowType = async () => {
    const response = await IndentGroupgetDetails({
      requestPath: 'getCostFlowTypeByPmHdrId',
      requestData: { projectID: proId, tenantID: tenantId },
    })
    if (response?.responseDataMessage) {
      setCostFlowType(response.responseDataMessage)
    }
  }

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
      if (costFlowType === 'NEW') {
        getStationList()
      } else {
        getIndentList()
      }
    }
  }, [projectList, costFlowType])

  const getStationList = async () => {
    setStationList([])
    const response = await IndentGroupgetDetails({
      requestPath: 'getStationsForGrouping',
      requestData: {
        tenantId,
        empId: employeeId,
        pmId: '5',
        projectId: proId,
        getIndent: isInternal == 1 ? '5' : '6',
      },
    })
    setStationList(response?.responseData || [])
  }

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
  // Auto-split order for a part shared by several indent lines: earliest indent due date first
  // (no due date last), then Indent No., then original line order.
  const splitOrder = (a, b) => {
    const da = a.indentDueDate || '9999-12-31'
    const db = b.indentDueDate || '9999-12-31'
    if (da !== db) return da.localeCompare(db)
    // numeric-aware so ...-A-9 comes before ...-A-11
    const byCode = (a.indentCode || '').localeCompare(b.indentCode || '', undefined, { numeric: true })
    return byCode !== 0 ? byCode : a.sno - b.sno
  }

  // NEW-flow: every line of the same Part Number (across the station's indents, or repeated
  // within one indent) becomes ONE row. Its source lines are shown as expandable child rows, each
  // with its own Allocate Qty, so the user can take qty from whichever indent they want. Storage
  // is unchanged - submit still sends one indent_grp_dtl row per real indent line (indentTable).
  // LEGACY (single indent) stays one row per line.
  const buildMergedRows = rows => {
    const single = item => ({ ...item, rowKey: `r-${item.sno}`, sourceSnos: [item.sno] })
    if (!isNewFlow) return rows.map(single)
    const byProduct = new Map()
    rows.forEach(item => {
      if (!byProduct.has(item.productCode)) byProduct.set(item.productCode, [])
      byProduct.get(item.productCode).push(item)
    })
    return Array.from(byProduct.values()).map(group => {
      if (group.length === 1) return single(group[0])
      const ordered = [...group].sort(splitOrder)
      const sourceSnos = ordered.map(g => g.sno)
      const groupSno = Math.min(...sourceSnos)
      const sumField = f => ordered.reduce((sum, g) => sum + (parseFloat(g[f]) || 0), 0)
      const indentCodes = new Set(ordered.map(g => g.indentCode))
      return {
        ...ordered[0],
        sno: groupSno,
        rowKey: `g-${groupSno}`,
        isGroup: true,
        sourceSnos,
        indentCount: indentCodes.size,
        indentCode: indentCodes.size === 1 ? ordered[0].indentCode : null,
        indentQty: sumField('indentQty'),
        indentGrpQty: sumField('indentGrpQty'),
        allocateQty: sumField('allocateQty').toString(),
        children: ordered.map(g => ({
          ...g,
          rowKey: `c-${g.sno}`,
          isChild: true,
          groupSno,
          groupSnos: sourceSnos,
        })),
      }
    })
  }

  const mergedRows = useMemo(() => buildMergedRows(indentTable), [indentTable, isNewFlow])

  // Merged-row total: split across its source lines in splitOrder (earliest due date first),
  // filling each up to its own remaining capacity (indentQty - indentGrpQty). The user can then
  // expand the row and override any single line (handleLineQtyChange). A single-source row splits
  // trivially to itself.
  const handleQtyChange = (record, e) => {
    const { value } = e.target
    const totalAvailable = record.sourceSnos.reduce((sum, sno) => {
      const src = indentTable[sno]
      return sum + (parseFloat(src.indentQty) - parseFloat(src.indentGrpQty))
    }, 0)
    let finalValue = value

    if (value !== '') {
      const numValue = parseFloat(value)
      if (!Number.isNaN(numValue) && numValue < 0) {
        message.warning('Allocate Qty cannot be negative. Auto-corrected.')
        finalValue = '0'
      } else if (!Number.isNaN(numValue) && numValue > totalAvailable) {
        message.warning(`Allocate Qty cannot exceed ${totalAvailable}. Auto-corrected.`)
        finalValue = totalAvailable.toString()
      }
    }

    let remaining = finalValue === '' ? 0 : parseFloat(finalValue) || 0
    const newData = [...indentTable]
    // sourceSnos is already in splitOrder (see buildMergedRows).
    record.sourceSnos.forEach(sno => {
      const capacity = parseFloat(newData[sno].indentQty) - parseFloat(newData[sno].indentGrpQty)
      const take = Math.min(Math.max(remaining, 0), capacity)
      newData[sno] = { ...newData[sno], allocateQty: take.toString() }
      remaining -= take
      allqtyForm.setFieldsValue({ [`allocateqty${sno}`]: newData[sno].allocateQty })
    })
    setIndentTable(newData)
    updateSelected(record.sno, finalValue)
  }

  // Child (single indent line) of a merged row: set just this line, clamped to its own remaining
  // capacity; the merged row's total follows automatically (it is derived from indentTable).
  const handleLineQtyChange = (record, e) => {
    const { value } = e.target
    const { sno } = record
    const capacity = parseFloat(indentTable[sno].indentQty) - parseFloat(indentTable[sno].indentGrpQty)
    let finalValue = value

    if (value !== '') {
      const numValue = parseFloat(value)
      if (!Number.isNaN(numValue) && numValue < 0) {
        message.warning('Allocate Qty cannot be negative. Auto-corrected.')
        finalValue = '0'
      } else if (!Number.isNaN(numValue) && numValue > capacity) {
        message.warning(`Allocate Qty cannot exceed ${capacity} for this indent. Auto-corrected.`)
        finalValue = capacity.toString()
      }
    }

    const newData = [...indentTable]
    newData[sno] = { ...newData[sno], allocateQty: finalValue }
    allqtyForm.setFieldsValue({ [`allocateqty${sno}`]: finalValue })
    setIndentTable(newData)
    const groupTotal = record.groupSnos.reduce(
      (sum, s) => sum + (parseFloat(newData[s].allocateQty) || 0),
      0,
    )
    updateSelected(record.groupSno, groupTotal)
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
    try {
      // Block submit while any Allocate Qty is invalid (negative / over indent qty).
      try {
        await allqtyForm.validateFields()
      } catch (validationErr) {
        message.error('Please fix the highlighted Allocate Qty values')
        return
      }
      // getFieldsValue(true) so rows hidden by the search / "show selected only" filter
      // (unmounted Form.Items) are still included - see feedback_antd_paginated_form_getfieldsvalue.
      const formvalues = allqtyForm.getFieldsValue(true)

      const updatedTableData = indentTable.map((item, index) => {
        return {
          ...item,
          allocateQty: formvalues[`allocateqty${index}`],
        }
      })
      const filteredData = updatedTableData.filter(
        item =>
          item.allocateQty !== '' &&
          item.allocateQty !== '0' &&
          Number(item.allocateQty) > 0 &&
          Number(item.allocateQty) <= Number(item.indentQty),
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
          submit(
            // Station groups span multiple indents - refresh the list unfiltered rather than by one indent.
            isNewFlow ? 'getAll' : indentId || formValues.IndentCode,
            formValues.FromDate,
            formValues.ToDate,
            formValues.Projectcode,
            isTailview,
          )
        } else {
          message.error(httpinsert.responseMessage)
        }
      } else {
        messageReturn(661)
      }
    } finally {
      setDisableSubmitButton(false)
    }
  }

  const productCode1 = []
  const description1 = []
  const specification1 = []
  const Material1 = []
  const make1 = []

  mergedRows.map(h => {
    return productCode1.push(h.productCode)
  })
  mergedRows.map(h => {
    return description1.push(h.description)
  })
  mergedRows.map(h => {
    return specification1.push(h.specification)
  })
  mergedRows.map(h => {
    return Material1.push(h.material)
  })
  mergedRows.map(h => {
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

  // Child (per-indent line) rows only show Indent + quantities; the part details live on the
  // merged row above them.
  const parentOnly = (text, record) => (record.isChild ? null : text)

  const insertcolumns = [
    {
      title: 'S.No',
      key: 'slno',
      width: 50,
      render: (text, record, index) => (record.isChild ? null : index + 1),
    },
    // Station grouping pulls parts from several indents at once, so show which indent each row came from.
    ...(isNewFlow
      ? [
          {
            title: 'Indent',
            dataIndex: 'indentCode',
            width: '12%',
            key: 'indentCode',
            render: (text, record) => {
              if (record.isGroup && record.indentCount > 1) {
                const shown = record.visibleIndentCount
                return (
                  <span style={{ color: '#1890ff' }}>
                    {shown !== undefined && shown < record.indentCount
                      ? `${shown} of ${record.indentCount}`
                      : record.indentCount}{' '}
                    indents
                  </span>
                )
              }
              return text
            },
          },
        ]
      : []),
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      width: '15%',
      key: 'productCode',
      filters: productCode3,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
      render: parentOnly,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '15%',
      filters: description3,
      filteredValue: filtersinfo.description,
      onFilter: (value, record) => record?.description === value,
      key: 'description',
      render: parentOnly,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      width: '7%',
      key: 'specification',
      filters: specification3,
      filteredValue: filtersinfo.specification,
      onFilter: (value, record) => record?.specification === value,
      render: parentOnly,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      width: '5%',
      key: 'make',
      filters: make3,
      filteredValue: filtersinfo.make,
      onFilter: (value, record) => record?.make === value,
      render: parentOnly,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      width: '13%',
      key: 'material',
      filters: Material3,
      filteredValue: filtersinfo.material,
      onFilter: (value, record) => record?.material === value,
      render: parentOnly,
    },
    {
      title: 'Mass (kgs)',
      dataIndex: 'weight',
      width: '7%',
      key: 'weight',
      render: parentOnly,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      width: '5%',
      key: 'uom',
      render: parentOnly,
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
        <Input
          type="number"
          min={0}
          placeholder="Allocate Qty.."
          value={record.allocateQty}
          onChange={e =>
            record.isChild ? handleLineQtyChange(record, e) : handleQtyChange(record, e)
          }
        />
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

    // NEW-flow keys the item list off a station (PKA); LEGACY off a single indent.
    const keyField = isNewFlow ? formValues.Station : formValues.IndentCode
    if (
      grpname !== '' &&
      grpname !== undefined &&
      keyField !== '' &&
      keyField !== undefined &&
      isInv !== null &&
      isInv !== undefined
    ) {
      const props = isNewFlow
        ? {
            pkaId: formValues.Station,
            tenantId,
            empId: employeeId,
            getIndent: isInternal == 1 ? '5' : '6',
          }
        : {
            indentId: formValues.IndentCode,
            tenantId,
            empId: employeeId,
          }
      const httpgetdetails = await IndentGroupgetDetails({
        requestPath: isNewFlow ? 'getIndentGrpNewProdByStation' : 'getIndentGrpNewProd',
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
          allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: item.allocateQty })
        })
        const initSelected = new Set()
        buildMergedRows(updatedData).forEach(group => {
          if (Number(group.allocateQty) > 0) initSelected.add(group.sno)
        })
        setSelectedSnos(initSelected)
        setShowSelectedOnly(false)
        setSearchText('')
        setSearchInputValue('')
        setIndentTable(responseDataWithAllocateQty)
      } else {
        setIndentTable([])
        setSelectedSnos(new Set())
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
      allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: item.allocateQty })
    })
    const nextSelected = new Set()
    buildMergedRows(updatedData).forEach(group => {
      if (Number(group.allocateQty) > 0) nextSelected.add(group.sno)
    })
    setSelectedSnos(nextSelected)
  }

  const handleUnAllocateRow = () => {
    const updatedData = indentTable.map(item => ({
      ...item,
      allocateQty: '0',
    }))
    setIndentTable(updatedData)
    updatedData.forEach(item => {
      allqtyForm.setFieldsValue({ [`allocateqty${item.sno}`]: item.allocateQty })
    })
    setSelectedSnos(new Set())
    setShowSelectedOnly(false)
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

  // Non-destructive filter over the parts table: free-text search across all columns +
  // optional "show only rows with an allocated qty". A merged row also matches on any of its
  // per-indent child lines (e.g. searching an indent no. that only one child carries).
  const matchesSearch = item =>
    Object.keys(item).some(
      key =>
        key !== 'children' &&
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()),
    )
  // With "show selected only", a merged row also hides its 0-qty child lines; visibleIndentCount
  // drives the "2 of 3 indents" label. Safe for submit - qty lives in indentTable and submit reads
  // getFieldsValue(true), and the hidden lines are 0 anyway.
  const displayedData = mergedRows
    .filter(item => {
      if (showSelectedOnly && !selectedSnos.has(item.sno)) return false
      if (!searchText) return true
      return matchesSearch(item) || (item.children || []).some(matchesSearch)
    })
    .map(item => {
      if (!showSelectedOnly || !item.children) return item
      const children = item.children.filter(c => Number(c.allocateQty) > 0)
      return {
        ...item,
        children,
        visibleIndentCount: new Set(children.map(c => c.indentCode)).size,
      }
    })

  const FieldsComponent = useRef(() => {
    const fs = fieldsStateRef.current
    const handleSearch = handleSearchRef.current
    return (
      // Covers the whole Create Indent Group form/table while Submit is in flight.
      <Spin spinning={fs.disableSubmitButton} size="large" tip="Please wait...">
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
                    onChange={fs.fromdateChange}
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
                    onChange={fs.toDateChange}
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
                    onChange={ProjId => fs.getIndentList(ProjId)}
                    disabled={isTailview}
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toString()
                        .toUpperCase()
                        .indexOf(input.toUpperCase()) !== -1
                    }
                  >
                    {fs.projectList?.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                {fs.isNewFlow ? (
                  <Form.Item
                    name="Station"
                    label={
                      <span>
                        Station<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select Station"
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toUpperCase()
                          .indexOf(input.toUpperCase()) !== -1
                      }
                    >
                      {fs.stationList?.map(item => (
                        <Option key={item.pkaId} value={item.pkaId}>
                          {item.stationDesc}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
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
                      onChange={(value, option) => fs.handleDueDate(value, option)}
                    >
                      {fs.indentList?.map(item => (
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
                )}
              </div>

              {!fs.isNewFlow && (
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
              )}
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
              <ButtonComponent
                text="Get Details"
                type="primary"
                onClick={() => fs.handleInsertData()}
              />
            </div>
          </Form>
          <div className="custom_antd_Table aig-parts-table">
            {fs.indentTable.length > 0 ? (
              <>
                <div
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ButtonComponent
                      text="Allocate All"
                      type="primary"
                      onClick={() => fs.handleAllocateRow()}
                    />
                    <ButtonComponent
                      text="Unallocate All"
                      type="primary"
                      onClick={() => fs.handleUnAllocateRow()}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <Checkbox
                      checked={fs.showSelectedOnly}
                      disabled={fs.selectedSnos.size === 0}
                      onChange={e => setShowSelectedOnly(e.target.checked)}
                    >
                      Show selected only ({fs.selectedSnos.size})
                    </Checkbox>
                    <Input.Search
                      style={{ width: '280px' }}
                      placeholder="Search parts..."
                      allowClear
                      value={fs.searchInputValue}
                      onChange={e => {
                        setSearchInputValue(e.target.value)
                        handleSearch(e.target.value)
                      }}
                    />
                  </div>
                </div>
                {/* <TableComponent
                  scrollY={700}
                  columns={insertcolumns}
                  data={indentTable}
                  page={false}
                /> */}
                <Form form={allqtyForm}>
                  <Table
                    columns={fs.insertcolumns}
                    dataSource={fs.displayedData}
                    // Only turn on the fixed-header scroll body when there are enough rows to need it.
                    // With scroll.y set, rc-table forces overflow-y:scroll on the body and shrinks the
                    // header's last column by the scrollbar width - that's the gap on the table's right edge.
                    scroll={fs.displayedData.length > 15 ? { y: 700 } : undefined}
                    onChange={fs.handleChange}
                    pagination={false}
                    rowKey="rowKey"
                    // Expand/collapse icon sits in the Indent column, beside the "N indents" label
                    // (antd defaults it to the first column, S.No). Index 1 = Indent (NEW-flow only;
                    // LEGACY rows never have children, so no icon shows there).
                    expandable={{
                      expandIconColumnIndex: fs.isNewFlow ? 1 : 0,
                      // Small arrow in the label's colour instead of antd's boxed +/- button; rows
                      // without children get a same-width spacer so indent numbers stay aligned.
                      expandIcon: ({ expanded, onExpand, record }) =>
                        record.children ? (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={e => onExpand(record, e)}
                            onKeyDown={e => e.key === 'Enter' && onExpand(record, e)}
                            style={{
                              display: 'inline-block',
                              width: 18,
                              color: '#1890ff',
                              cursor: 'pointer',
                              fontSize: 11,
                            }}
                          >
                            {expanded ? <DownOutlined /> : <RightOutlined />}
                          </span>
                        ) : (
                          <span style={{ display: 'inline-block', width: 18 }} />
                        ),
                    }}
                  />
                </Form>
              </>
            ) : null}
          </div>
        </div>
      </Spin>
    )
  }).current

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
              loading={disableSubmitButton}
            />
            <ButtonComponent
              text="Cancel"
              type="primary"
              onClick={() => {
                handleCancel()
              }}
              disable={disableSubmitButton}
            />
          </>
        ) : null}
      </div>
    )
  }

  // Reassigned every render so the stable FieldsComponent above always reads current data.
  fieldsStateRef.current = {
    disableSubmitButton,
    isNewFlow,
    projectList,
    stationList,
    indentList,
    indentTable,
    displayedData,
    insertcolumns,
    showSelectedOnly,
    selectedSnos,
    searchInputValue,
    fromdateChange,
    toDateChange,
    getIndentList,
    handleDueDate,
    handleInsertData,
    handleAllocateRow,
    handleUnAllocateRow,
    handleChange,
  }

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      ButtonsComponent={ButtonsComponent}
      FieldsComponent={FieldsComponent}
      text="Create Indent Group"
      onCancel={() => {
        // Mask click / X / Esc all route through here — ignore them while Submit is
        // in flight so the form can't be dismissed mid-request.
        if (disableSubmitButton) return
        handleCancel()
      }}
      maskClosable={!disableSubmitButton}
      width="900"
    />
  )
}

export default AddIndentGroup
