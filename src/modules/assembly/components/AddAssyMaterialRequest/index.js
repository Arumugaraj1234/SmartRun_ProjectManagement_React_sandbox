import React, { useState, useEffect, useRef } from 'react'
import store from 'store'
// import _ from 'lodash'
import { debounce } from 'lodash'

// import { flushSync } from 'react-dom';
import { Form, Select, Table, Input, message, Checkbox } from 'antd'
import { useMediaQuery } from 'react-responsive'
import ModalPopup from 'components/shared/ModalPopupComponent'
import Buttons from 'components/shared/ButtonComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const AddAssyIndent = ({ handleCancel, isModalVisible }) => {
  console.log('addd  async')
  const [inputForm] = Form.useForm()
  const [Addform] = Form.useForm()
  const [dataKeyArea, setDataKeyArea] = useState([])
  const [dataKeySubArea, setDataKeySubArea] = useState([])
  const [showPopUpTable, setshowPopUpTable] = useState(false)
  const [statnType, setStatnType] = useState(undefined)
  const [createTabledata, setCreateTabledata] = useState(undefined)
  const [originalTableData, setOriginalTableData] = useState([])
  const [disableSbmtBtn, setDisableSbmtBtn] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [selectedSnos, setSelectedSnos] = useState(new Set())
  const [searchText, setSearchText] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const handleSearchRef = useRef(debounce(value => setSearchText(value), 300))
  const fieldsStateRef = useRef({})
  const { Option } = Select
  const tenantid = store.get('tenantId')
  const employeeId = store.get('employeeId')

  useEffect(() => {
    Addform.resetFields()
    inputForm.resetFields()
    getKeyareas()
  }, [])

  useEffect(() => {
    setshowPopUpTable(false)
    Addform.resetFields()
    inputForm.resetFields()
    getKeyareas()
    setShowSelectedOnly(false)
    setSelectedSnos(new Set())
    setSearchText('')
    setSearchInputValue('')
  }, [isModalVisible])

  const getKeyareas = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: store.get('ProjectID'),
    }
    const response = await indentFileUpload({
      requestPath: 'getKeyArea',
      requestData: keyareaobj,
    })
    if (response) {
      setDataKeyArea(response?.responseData || [])
    }
  }

  const getKeusubareas = async value => {
    if (value !== 'getall') {
      const keyareaobj = {
        tenantId: tenantid,
        pmHdrId: store.get('ProjectID'),
        pkaId: value,
      }
      const response = await indentFileUpload({
        requestPath: 'getKeySubAreaByPKId',
        requestData: keyareaobj,
      })
      if (response) {
        setDataKeySubArea(response?.responseData)
      }
    } else {
      setDataKeySubArea([
        {
          keyName: 'Get All',
          pkaId: 'getall',
        },
      ])
      Addform.setFieldsValue({ subAssy: 'getall' })
    }
  }

  const distinct1 = (value, index, self) => {
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(createTabledata)) {
      return []
    }
    return createTabledata
      .map(item => item[key])
      .filter(distinct1)
      .sort((a, b) => a.localeCompare(b))
      .map(value => ({
        text: value,
        value,
      }))
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const columns = [
    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
      filters: distinctValues('pkDesc'),
      filteredValue: filtersinfo.pkDesc || null,
      onFilter: (value, record) => record?.pkDesc === value,
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      filters: distinctValues('pskDesc'),
      filteredValue: filtersinfo.pskDesc || null,
      onFilter: (value, record) => record?.pskDesc === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productode',
      key: 'productode',
      filters: distinctValues('productode'),
      filteredValue: filtersinfo.productode || null,
      onFilter: (value, record) => record?.productode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: distinctValues('productDesc'),
      filteredValue: filtersinfo.productDesc || null,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      filters: distinctValues('specification'),
      filteredValue: filtersinfo.specification || null,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      filters: distinctValues('make'),
      filteredValue: filtersinfo.make || null,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Inventory Location',
      dataIndex: 'invLocationDesc',
      key: 'invLocationDesc',
      filters: distinctValues('invLocationDesc'),
      filteredValue: filtersinfo.invLocationDesc || null,
      onFilter: (value, record) => record?.invLocationDesc === value,
    },
    {
      title: 'Available Qty.',
      dataIndex: 'availableQty',
      key: 'availableQty',
      className: 'right-align-cell',
      render: text => Number(text).toFixed(1),
    },
    {
      title: 'UOM',
      dataIndex: 'uomShortDesc',
      key: 'uomShortDesc',
      filters: distinctValues('uomShortDesc'),
      filteredValue: filtersinfo.uomShortDesc || null,
      onFilter: (value, record) => record?.uomShortDesc === value,
    },
    {
      title: 'Requested Qty.',
      dataIndex: 'availableQty',
      key: 'requestedQty',
      render: (__, record) => (
        <Form form={inputForm}>
          <Form.Item name={`requestedQty${record.sno}`}>
            <Input
              onChange={e => {
                const { value } = e.target
                // Form.Item auto-syncs whatever the raw input emits, so an invalid value (e.g.
                // "-5") stays displayed unless we explicitly overwrite it back — stripping
                // non-digits (including "-") here and always writing the sanitized value through
                // handleReqQtyChange, instead of only calling it when the raw value already
                // passed validation, is what makes that overwrite actually happen.
                const sanitized = value.replace(/\D/g, '')
                handleReqQtyChange(record, { target: { value: sanitized } }, record.sno)
              }}
              placeholder="Type here..."
              type="text"
              inputMode="numeric"
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  // FieldsComponent must keep a stable identity across renders: it's rendered as
  // <FieldsComponent /> inside ModalPopupComponent, and every reactive value it needs (station/sub
  // assy lists, table data, filters, selection, search) is read fresh on each call via
  // fieldsStateRef.current (reassigned every render, below) rather than closed over directly —
  // otherwise any parent state update (e.g. selection tracking while typing a qty) would recreate
  // this function, which React treats as a brand-new component type at the same position and fully
  // remounts, wiping out anything with its own local state (previously: the search filter).
  const FieldsComponent = useRef(() => {
    const {
      dataKeyArea: fsDataKeyArea,
      dataKeySubArea: fsDataKeySubArea,
      statnType: fsStatnType,
      showPopUpTable: fsShowPopUpTable,
      isMobile: fsIsMobile,
      columns: fsColumns,
      displayedData: fsDisplayedData,
      handleChange: fsHandleChange,
      showSelectedOnly: fsShowSelectedOnly,
      selectedSnos: fsSelectedSnos,
      searchInputValue: fsSearchInputValue,
      handleSubmit: fsHandleSubmit,
      handleClear: fsHandleClear,
      setValuestoAll: fsSetValuestoAll,
      getKeusubareas: fsGetKeusubareas,
    } = fieldsStateRef.current
    const handleSearch = handleSearchRef.current
    return (
      <div>
        <div>
          <Form form={Addform}>
            <div className="row form_datas" style={{ marginLeft: '20px' }}>
              <Form.Item
                name="StationNo"
                label={
                  <span>
                    Station No.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  value={fsStatnType}
                  onChange={(value, option) => {
                    Addform.resetFields(['subAssy'])
                    setStatnType(value)
                    fsGetKeusubareas(value, option.key)
                  }}
                  placeholder="Select Station "
                  id="statintype"
                  style={{ marginRight: '10px', width: '180px' }}
                >
                  <Option value="getall">Get All</Option>
                  {fsDataKeyArea &&
                    fsDataKeyArea.map(item => (
                      <Option key={item.pkaId} value={item.pkaId}>
                        {item.keyName}({item.code})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="subAssy"
                label={
                  <span>
                    Sub Assy.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  defaultValue="Select Sub Assy."
                  placeholder="Select Sub Assy. "
                  id="statintype"
                  style={{ marginRight: '10px', width: '180px' }}
                >
                  {fsDataKeySubArea &&
                    fsDataKeySubArea.map(item => (
                      <Option key={item.pkId} value={item.pkaId}>
                        {item.keyName}
                        {item.code ? `(${item.code})` : ''}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="RequestType"
                label={
                  <span>
                    Request Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Request Type."
                  style={{ marginRight: '10px', width: '180px' }}
                >
                  <Option value="1">Internal</Option>
                  <Option value="0">DC</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '25px',
              justifyContent: 'center',
              display: 'flex',
              gap: '12px',
            }}
          >
            <Buttons text="Get Details" type="primary" onClick={fsHandleSubmit} />
            <Buttons
              text="Clear"
              type="primary"
              onClick={() => {
                fsHandleClear()
              }}
            />
          </div>
        </div>
        <div
          className="custom_antd_Table"
          style={{ marginTop: '25px', display: fsShowPopUpTable ? 'block' : 'none' }}
        >
          <Buttons text="Request All" type="primary" onClick={fsSetValuestoAll} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              float: 'right',
              flexWrap: 'wrap',
              paddingTop: '5px',
            }}
          >
            <Checkbox
              checked={fsShowSelectedOnly}
              disabled={fsSelectedSnos.size === 0}
              onChange={e => setShowSelectedOnly(e.target.checked)}
            >
              Show selected only ({fsSelectedSnos.size})
            </Checkbox>
            <Input.Search
              style={{
                width: fsIsMobile ? '100%' : '260px',
              }}
              placeholder="Search..."
              value={fsSearchInputValue}
              onChange={e => {
                const cleaned = e.target.value.replace(/\s+/g, '').toLowerCase()
                setSearchInputValue(cleaned)
                handleSearch(cleaned)
              }}
              enterButton
            />
          </div>
          <Table
            columns={fsColumns}
            dataSource={fsDisplayedData}
            pagination={false}
            onChange={fsHandleChange}
            scroll={{ y: 400 }}
            bordered
          />
        </div>
      </div>
    )
  }).current
  const ButtonsComponent = () => {
    return (
      <div style={{ display: showPopUpTable ? 'block' : 'none' }}>
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            justifyContent: 'center',
            display: 'flex',
            gap: '12px',
          }}
        >
          <Buttons text="Submit" type="primary" disable={disableSbmtBtn} onClick={handleCreate} />
          <Buttons
            text="Cancel"
            type="primary"
            onClick={() => {
              handleClear()
              handleClearVals()
              handleCancel()
            }}
          />
        </div>
      </div>
    )
  }
  const handleClearVals = () => {
    if (createTabledata?.length > 0) {
      const updatedValues = createTabledata.map(record => {
        const fieldName = `requestedQty${record.sno}`
        return { [fieldName]: '' }
      })
      inputForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
    setshowPopUpTable(false)
    setShowSelectedOnly(false)
    setSelectedSnos(new Set())
    setSearchText('')
    setSearchInputValue('')
  }
  const handleCreate = async () => {
    setDisableSbmtBtn(true)
    const formvalues = inputForm.getFieldValue()
    const getstnsubassyval = Addform.getFieldsValue()
    const updatedTableData = createTabledata.map((record, index) => {
      return {
        tenantId: tenantid,
        poductId: record.productId,
        requestedQty: formvalues[`requestedQty${index}`],
        availableQty: record.availableQty,
        inventoryLocation: record.invLocationCode,
        descOfGoods: record.productDesc,
      }
    })
    const filteredTableData = updatedTableData.filter(
      item =>
        item.requestedQty !== '0' &&
        item.requestedQty !== '' &&
        item.requestedQty !== null &&
        item.requestedQty !== undefined,
    )
    if (filteredTableData.length > 0) {
      const keyareaobj = {
        pmHdrId: store.get('ProjectID'),
        requestedBy: employeeId,
        requestedFor: employeeId,
        tenantId: tenantid,
        mrDtlList: filteredTableData,
        requestType: getstnsubassyval.RequestType,
      }
      const response = await indentFileUpload({
        requestPath: 'insertMrHdrAndDtl',
        requestData: keyareaobj,
      })
      if (response.responseCode === '200') {
        message.success(response.responseMessage)
        handleCancel()
        Addform.resetFields()
        inputForm.resetFields()
        setDisableSbmtBtn(false)
      } else {
        setDisableSbmtBtn(false)
        message.error(response.responseMessage)
      }
    } else {
      messageReturn(616)
    }
    setDisableSbmtBtn(false)
  }
  if (false) {
    updateinDc()
  }
  const updateinDc = async () => {
    const formvalues = inputForm.getFieldValue()
    const updatedTableData = createTabledata.map((record, index) => {
      return {
        tenantId: tenantid,
        productId: record.productId,
        closedQty: '0',
        qty: formvalues[`requestedQty${index}`],
        descofGoods: record.productode,
      }
    })
    const filteredTableData = updatedTableData.filter(
      item => item.qty !== '0' && item.qty !== '' && item.qty !== null && item.qty !== undefined,
    )
    const keyareaobje = {
      pmHdrId: store.get('ProjectID'),
      requestedOn: employeeId,
      requestedBy: employeeId,
      remarks: '',
      isCompleted: '0',
      tenantId: tenantid,
      dcreqdtl: filteredTableData,
    }
    // eslint-disable-next-line no-unused-vars
    const responses = await indentFileUpload({
      requestPath: 'insertdcreqhdrdtl',
      requestData: keyareaobje,
    })
  }
  const handleClear = () => {
    // setCreateTabledata(undefined)
    setStatnType(undefined)
    // setSubAssyType(undefined)
    Addform.resetFields()
    inputForm.resetFields()
    setShowSelectedOnly(false)
    setSelectedSnos(new Set())
    setSearchText('')
    setSearchInputValue('')
  }

  const handleSubmit = async () => {
    const getstnsubassyval = Addform.getFieldsValue()
    if (
      getstnsubassyval.StationNo !== undefined &&
      getstnsubassyval.subAssy !== undefined &&
      getstnsubassyval.RequestType
    ) {
      getInsertMaterialReqDetls(
        getstnsubassyval.StationNo,
        getstnsubassyval.subAssy,
        store.get('ProjectID'),
        tenantid,
      )
      setshowPopUpTable(true)
    } else {
      messageReturn(405)
    }
  }
  const getInsertMaterialReqDetls = async (pkastnno, subassyval, pmhdrid, tenntid) => {
    const keyareaobj = {
      pkaId: pkastnno,
      pmHdrId: pmhdrid,
      pskaId: subassyval,
      tenantId: tenntid,
    }

    try {
      // Assuming indentFileUpload is an async function that returns a response object
      const response = await indentFileUpload({
        requestPath: 'retriveFromStock',
        requestData: keyareaobj,
      })
      let data = []

      if (response && response.responseData !== null && response.responseData !== undefined) {
        if (response.responseData.length > 0) {
          data = response.responseData.map((item, index) => {
            return { ...item, sno: index }
          })
        } else {
          data = []
        }
      } else {
        data = []
      }
      // originalTableData must carry the same sno-tagged rows as createTabledata — the search
      // box filters over originalTableData, and each row's Form.Item is keyed by record.sno, so
      // filtered rows missing sno all collapsed onto the same field name ("requestedQtyundefined"),
      // making one row's typed qty appear to apply to every filtered row.
      setOriginalTableData(data)
      setCreateTabledata(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setCreateTabledata([])
    }
  }
  const handleReqQtyChange = (record, event, sno) => {
    // const qtyform = inputForm.getFieldsValue()
    if (Number(event.target.value) > Number(record.availableQty)) {
      inputForm.setFieldsValue({ [`requestedQty${sno}`]: '' })
      messageReturn(629)
      setSelectedSnos(prev => {
        const next = new Set(prev)
        next.delete(sno)
        return next
      })
    } else {
      // const setIndexId = `requestedQty${sno}`
      inputForm.setFieldsValue({ [`requestedQty${sno}`]: event.target.value })
      setSelectedSnos(prev => {
        const next = new Set(prev)
        if (event.target.value !== '' && Number(event.target.value) > 0) {
          next.add(sno)
        } else {
          next.delete(sno)
        }
        return next
      })
    }

    /* const qtyform = inputForm.getFieldsValue()
     const newData = [...retrivaldata]
     newData[index].activityName = e.target.value
     setRetrivaldata(newData) */
  }

  const setValuestoAll = () => {
    if (createTabledata.length > 0) {
      const updatedValues = createTabledata.map(record => {
        const requestedqty = Number(record.availableQty).toFixed(1)
        const fieldName = `requestedQty${record.sno}`
        return { [fieldName]: requestedqty }
      })
      inputForm.setFieldsValue(Object.assign({}, ...updatedValues))
      setSelectedSnos(new Set(createTabledata.map(record => record.sno)))
    }
  }

  const displayedData = (originalTableData || []).filter(item => {
    const matchesSelection = !showSelectedOnly || selectedSnos.has(item.sno)
    if (!matchesSelection) return false
    if (!searchText) return true
    return Object.values(item).some(field =>
      String(field)
        .replace(/\s+/g, '')
        .toLowerCase()
        .includes(searchText),
    )
  })

  fieldsStateRef.current = {
    dataKeyArea,
    dataKeySubArea,
    statnType,
    showPopUpTable,
    isMobile,
    columns,
    displayedData,
    handleChange,
    showSelectedOnly,
    selectedSnos,
    searchInputValue,
    handleSubmit,
    handleClear,
    setValuestoAll,
    getKeusubareas,
  }

  return (
    <div style={{ marginTop: '10px', width: '100%', overflowX: 'auto' }}>
      <ModalPopup
        isModalVisible={isModalVisible}
        FieldsComponent={FieldsComponent}
        ButtonsComponent={ButtonsComponent}
        text="Material Request Details"
        onCancel={() => {
          handleCancel()
        }}
        width="900"
      />
    </div>
  )
}

export default AddAssyIndent
