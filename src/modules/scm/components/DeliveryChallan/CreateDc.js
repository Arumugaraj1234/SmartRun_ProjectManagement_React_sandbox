import React, { useEffect, useState } from 'react'
import store from 'store'
import moment from 'moment'
import {
  Modal,
  Form,
  Input,
  Select,
  Card,
  Table,
  message,
  DatePicker,
  AutoComplete,
  Radio,
  Popover,
} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import AddIcon from 'components/shared/AddIconComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import messageReturn from '_helpers/messageReturn'
import convertNumberToWords from '../../../../_helpers/convertToWords'
import DcFields from './Dcfields'
import {
  indentFileUpload,
  commongetmethod,
} from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import './style.scss'
import '../../../style.scss'

const CreateDc = ({ onClose, visible }) => {
  const emptyrow = {
    description: '',
    hsnCode: '',
    productQtyOnHand: '',
    uom: '',
    unitrate: '',
    totalvalue: '',
    productId: '',
    uomCode: '',
    productCode: '',
  }

  const { Option } = Select
  const { TextArea } = Input
  const [DcForm] = Form.useForm()
  const [tableForm] = Form.useForm()
  const [dclist, setDcList] = useState([])
  const [addressList, setAddressList] = useState([])
  const [fromAddresList, setFromAddresList] = useState([])
  const [showform, setShowform] = useState(false)
  const [projectList, setProjectList] = useState([])
  // const [prodCode, setProdCode] = useState('')
  const [hsnCode, setHsnCode] = useState([])
  const [uomCodedata, setUOMCode] = useState([])
  const [pmHdrId, setPmHdrId] = useState(null)
  // const [uomcode, setUomcode] = useState('')
  // const [selectedProduct, setSelectedProduct] = useState(null)
  const [mrDetails, setMrDetails] = useState([])
  const [newhsnData, setNewhsnData] = useState([emptyrow])

  const emptyGroupRow = {
    msHdrId: '',
    msName: '',
    hsnCode: '',
    qty: '1',
    uom: '',
    uomCode: '',
    totalvalue: '',
  }
  const [dcMode, setDcMode] = useState('individual')
  const [availableGroups, setAvailableGroups] = useState([])
  const [groupRowsData, setGroupRowsData] = useState([emptyGroupRow])

  // Re-render trigger only - Form.useWatch's direct return value is unreliable in this
  // antd/rc-field-form version, so the actual value is read via getFieldsValue(true) below.
  Form.useWatch([], DcForm)
  const isBgrNeoFactoryShipping =
    DcForm.getFieldsValue(true).FromdeliveryName === 'BGR NEO LIMITED - Factory'

  useEffect(() => {
    if (!isBgrNeoFactoryShipping && dcMode === 'group') {
      setDcMode('individual')
      setGroupRowsData([emptyGroupRow])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBgrNeoFactoryShipping])

  const tenantId = store.get('tenantId')
  const Menulistdata = store.get('MenuListData')
  const employeeId = store.get('employeeId')

  const getDtls = async formData => {
    if (formData.Projectcode) {
      getType()
      getpoDtl(formData.Projectcode)
      setPmHdrId(formData.Projectcode)
      getDcRequest(formData.Projectcode)
      getAvailableGroups(formData.Projectcode)
    } else {
      messageReturn(405)
    }
  }

  const getAvailableGroups = async projectId => {
    const response = await indentFileUpload({
      requestPath: 'retrieveApprovedGroupReturnsByProject',
      requestData: {
        hdrId: projectId || '',
        tenantId,
      },
    })
    setAvailableGroups(response?.responseData || [])
  }

  const getpoDtl = async projectId => {
    // DcForm.resetFields()
    const deliveryName = DcForm.getFieldValue('FromdeliveryName')
    let selectedaddress = ''
    if (deliveryName) {
      selectedaddress = fromAddresList.find(item => item.code === deliveryName)
    }
    const response = await indentFileUpload({
      requestPath: 'getDCProductDropDown ',
      requestData: {
        tenantId,
        pmHdrId: projectId || '',
        fromName: selectedaddress?.name || '',
      },
    })
    if (response?.responseData) {
      getDcRequest(pmHdrId)
      const options = response?.responseData.map(item => ({
        value: item.productId,
        label: item.productCode,
        data: item,
      }))
      setProjectList(options)
      // setHsntable([])
    }
  }

  const handleHSNCode = async e => {
    if (e?.description !== '') {
      const response = await indentFileUpload({
        requestPath: 'getHsnCodeByPartNo',
        requestData: {
          partNo: e?.description,
          tenantId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData.length > 0) {
            const hsncodeData = response.responseData.map(item => ({
              key: item.key,
              value: item.value,
            }))
            const uomCodeData = response.responseData.map(item => ({
              key: item.uomCode,
              value: item.uomDesc,
            }))
            setUOMCode(uomCodeData)
            setHsnCode(hsncodeData)
          }
        }
      }
    }
  }

  const getType = async () => {
    const response = await commongetmethod({ requestPath: 'getDCTypeDtl' })
    if (response?.responseData !== null && response?.responseData !== undefined) {
      setDcList(response?.responseData)
      setShowform(true)
    }
  }
  const getDcRequest = async Projectcode => {
    const deliveryName = DcForm.getFieldValue('FromdeliveryName')
    if (Projectcode) {
      const response = await indentFileUpload({
        requestPath: 'getdcreqhdrdtldtl',
        requestData: {
          pmHdrId: Projectcode || '',
          fromName: deliveryName || '',
          tenantId,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setMrDetails(response.responseData)
          } else {
            setMrDetails([])
          }
        } else {
          setMrDetails([])
        }
      }
    }
  }

  const handleDcChange = async fieldname => {
    if (fieldname === 'AddressType') {
      const AddressType = DcForm.getFieldValue('AddressType')
      if (AddressType !== '' && AddressType !== null && AddressType !== undefined) {
        setAddressList([])
        DcForm.setFieldsValue({
          deliveryName: undefined,
          deliveryAddressLine: '',
          deliveryCity: '',
          deliveryPincode: '',
          deliveryState: '',
          deliveryGst: '',
        })
        const response = await indentFileUpload({
          requestPath: 'getAddressDtlByDcType',
          requestData: {
            tenantId,
            dcTypeCode: AddressType,
          },
        })
        if (response?.responseCode === '200') {
          setAddressList(response?.responseData || [])
          if (response?.responseData.length === 1) {
            filladdress(response?.responseData[0])
          }
        } else {
          setAddressList([])
        }
      }
    }
    if (fieldname === 'FromAddressType') {
      const AddressType = DcForm.getFieldValue('FromAddressType')
      if (AddressType !== '' && AddressType !== null && AddressType !== undefined) {
        setFromAddresList([])
        DcForm.setFieldsValue({
          FromdeliveryName: undefined,
          fromaddress: '',
          fromcity: '',
          frompincode: '',
          fromstate: '',
          fromgst: '',
        })
        const response = await indentFileUpload({
          requestPath: 'getAddressDtlByDcType',
          requestData: {
            tenantId,
            dcTypeCode: AddressType,
          },
        })
        if (response?.responseCode === '200') {
          setFromAddresList(response?.responseData || [])
          if (response?.responseData.length === 1) {
            fillfromaddress(response?.responseData[0])
          }
        } else {
          setFromAddresList([])
        }
      }
    }
  }
  const handleAddressChange = () => {
    const deliveryName = DcForm.getFieldValue('deliveryName')
    if (deliveryName !== '' && deliveryName !== null && deliveryName !== undefined) {
      const data = addressList.find(item => item.code === deliveryName)
      filladdress(data)
    }
  }

  const handleFromAddressChange = () => {
    getpoDtl(pmHdrId)
    DcForm.setFieldsValue({ DCReqest: undefined })
    setNewhsnData([emptyrow])
    setGroupRowsData([emptyGroupRow])
    const deliveryName = DcForm.getFieldValue('FromdeliveryName')
    if (deliveryName !== '' && deliveryName !== null && deliveryName !== undefined) {
      const data = fromAddresList.find(item => item.code === deliveryName)
      fillfromaddress(data)
    }
  }

  const filladdress = data => {
    const deliveryName = DcForm.getFieldValue('FromdeliveryName')
    if (data.name !== deliveryName) {
      DcForm.setFieldsValue({
        deliveryName: data.name,
        deliveryAddressLine: data.address,
        deliveryCity: data.city,
        deliveryPincode: data.pincode,
        deliveryState: data.state,
        deliveryGst: data.gstNo,
      })
    } else {
      messageReturn(662)
      DcForm.setFieldsValue({
        deliveryName: null,
        AddressType: undefined,
      })
    }
  }

  const fillfromaddress = data => {
    const deliveryName = DcForm.getFieldValue('deliveryName')
    if (data.name !== deliveryName) {
      DcForm.setFieldsValue({
        FromdeliveryName: data.name,
        fromaddress: data.address,
        fromcity: data.city,
        frompincode: data.pincode,
        fromstate: data.state,
        fromgst: data.gstNo,
      })
    } else {
      messageReturn(662)
      DcForm.setFieldsValue({
        // FromAddressType: undefined,
        FromdeliveryName: null,
        FromAddressType: undefined,
      })
    }
  }

  const handleClear = () => {
    setShowform(false)
    DcForm.resetFields()
    setPmHdrId(null)
    setDcList([])
    setDcMode('individual')
    setNewhsnData([emptyrow])
    setGroupRowsData([emptyGroupRow])
    setAvailableGroups([])
    // setUomcode('')
  }
  const onFinish = values => {
    const amountInWords = convertNumberToWords(parseFloat(values.amount, 2))
    DcForm.setFieldsValue({ amountInWords })
  }
  // const handleInputChange = (value, option) => {
  //   if (option?.data) {
  //     tableForm.setFieldsValue({
  //       productQtyOnHand: option?.data?.qty || '',
  //       uom: option?.data?.uomLongDescriprtion || '',
  //       productCode: option?.data?.productCode || '',
  //     })
  //     setSelectedProduct(option?.data)
  //     if (option?.data?.productCode) {
  //       setProdCode(option?.data?.productId)
  //       setUomcode(option?.data?.uomCode)
  //     }
  //     calculaterowtotal()
  //   } else {
  //     setProdCode('')
  //     setUomcode('')
  //     setSelectedProduct(null)
  //   }
  // }

  // const calculaterowtotal = () => {
  //   const formvalue = tableForm.getFieldsValue()

  //   if (formvalue.productQtyOnHand && formvalue.unitrate) {
  //     const total = Number(formvalue.productQtyOnHand) * Number(formvalue.unitrate)
  //     tableForm.setFieldsValue({ totalvalue: total.toLocaleString() })
  //   } else {
  //     tableForm.setFieldsValue({ totalvalue: '0' })
  //   }
  // }

  // const insertData = [
  //   {
  //     dcDtlId: '',
  //     dcId: '',
  //     hsnNo: '',
  //     descOfGoods: '',
  //     qty: '',
  //     uom: '',
  //     rate: '',
  //     total: '',
  //     productId: '',
  //     uomDesc: '',
  //   },
  // ]
  // const columns = [
  //   {
  //     title: 'Description of Goods',
  //     dataIndex: 'description',
  //     key: 'description',
  //     width: '30%',
  //     render: () => (
  //       <Form.Item name="description">
  //         <AutoComplete
  //           options={projectList}
  //           onChange={handleInputChange}
  //           onSelect={(value, option) => handleInputChange(value, option)}
  //           filterOption={(inputValue, option) =>
  //             option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  //           }
  //         >
  //           <Input placeholder="Select here" />
  //         </AutoComplete>
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: 'HSN Code',
  //     dataIndex: 'hsnCode',
  //     key: 'hsnCode',
  //     width: '10%',
  //     render: () => (
  //       <Form.Item name="hsnCode">
  //         <Input
  //           type="number"
  //           onChange={e => {
  //             if (e.target.value.length > 8) {
  //               tableForm.setFieldsValue({
  //                 hsnCode: '',
  //               })
  //             }
  //           }}
  //           maxLength={8}
  //         />
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: 'Quantity',
  //     dataIndex: 'productQtyOnHand',
  //     key: 'productQtyOnHand',
  //     width: '10%',
  //     render: () => (
  //       <Form.Item name="productQtyOnHand">
  //         <Input
  //           type="number"
  //           onChange={e => {
  //             calculaterowtotal()
  //             if (selectedProduct?.qty) {
  //               if (parseInt(selectedProduct.qty, 10) < parseInt(e.target.value, 10)) {
  //                 tableForm.setFieldsValue({
  //                   productQtyOnHand: selectedProduct.qty,
  //                 })
  //               }
  //             }
  //           }}
  //         />
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: 'UOM',
  //     dataIndex: 'uom',
  //     key: 'uom',
  //     width: '10%',
  //     render: () => (
  //       <Form.Item name="uom">
  //         <Input type="text" />
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: `Unit Rate ${Menulistdata[0].currency}`,
  //     dataIndex: 'unitrate ',
  //     key: 'unitrate ',
  //     width: '15%',
  //     align: 'right',
  //     render: () => (
  //       <Form.Item name="unitrate">
  //         <Input type="text" onChange={calculaterowtotal} />
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: `Total Value ${Menulistdata[0].currency}`,
  //     dataIndex: 'totalvalue',
  //     key: 'totalvalue',
  //     width: '15%',
  //     align: 'right',
  //     render: () => (
  //       <Form.Item name="totalvalue">
  //         <Input type="text" disabled />
  //       </Form.Item>
  //     ),
  //   },
  //   {
  //     title: 'Action',
  //     dataIndex: 'operation',
  //     width: '15%',
  //     render: () => <AddIcon onClick={() => handleAdd()} />,
  //   },
  // ]

  // const columns1 = [
  //   {
  //     title: 'Description of Goods',
  //     dataIndex: 'descOfGoods',
  //     key: 'descOfGoods',
  //     width: '30%',
  //   },
  //   {
  //     title: 'HSN Code',
  //     dataIndex: 'hsnNo',
  //     key: 'hsnNo',
  //     width: '10%',
  //   },
  //   {
  //     title: 'Quantity',
  //     dataIndex: 'qty',
  //     key: 'qty',
  //     width: '10%',
  //   },
  //   {
  //     title: 'UOM',
  //     dataIndex: 'uom',
  //     key: 'uom',
  //     width: '10%',
  //   },
  //   {
  //     title: `Unit Rate ${Menulistdata[0].currency}`,
  //     dataIndex: 'rate',
  //     key: 'rate',
  //     align: 'right',
  //     width: '15%',
  //     render: text => getFormattedValue(text),
  //   },
  //   {
  //     title: `Total Value ${Menulistdata[0].currency}`,
  //     dataIndex: 'total',
  //     key: 'total',
  //     width: '15%',
  //     align: 'right',
  //     render: text => getFormattedValue(text),
  //   },
  //   {
  //     title: 'Action',
  //     dataIndex: 'rate',
  //     render: (_, record, index) => <RemoveIcon onClick={() => handleRemove(index)} />,
  //   },
  // ]

  const handleInputChanges = (index, key, value) => {
    const newData = [...newhsnData]
    const partNumber = newData[index].productId

    // Find correct maxQty from part master list
    const partInfo = projectList.find(opt => opt.data.productId === partNumber)
    const maxQty = partInfo?.data?.qty ? parseFloat(partInfo.data.qty) : 0
    const locationCode = partInfo?.data?.locationCode
    console.log(locationCode, 'locationCode------')
    newData[index].locationCode = locationCode || null
    // Calculate total used quantity for this part in other rows (excluding this one!)
    const usedQty = newhsnData.reduce((sum, row, idx) => {
      return idx !== index && row.productId === partNumber
        ? sum + parseFloat(row.productQtyOnHand || 0)
        : sum
    }, 0)

    // Calculate max allowed for current row
    const maxAllowedForRow = maxQty - usedQty

    // Prevent entering value greater than allowed
    if (key === 'productQtyOnHand') {
      // Accept empty string (field being cleared), allow editing freely
      if (value === '' || value === undefined) {
        newData[index][key] = value
        setNewhsnData(newData)
        return
      }
      const numericValue = parseFloat(value)
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(numericValue) && numericValue > 0) {
        if (numericValue > maxAllowedForRow) {
          message.error(`Available quantity for "${partNumber}" is only ${maxAllowedForRow}.`)
          return
        }
      }
    }

    newData[index][key] = value

    if (key === 'productQtyOnHand' || key === 'unitrate') {
      const quantity = parseFloat(newData[index].productQtyOnHand) || 0
      const unitRate = parseFloat(newData[index].unitrate) || 0
      newData[index].totalvalue = quantity * unitRate
    }
    setNewhsnData(newData)
  }

  const handleAddNewRow = () => {
    const mandatoryFields = [
      'description',
      'hsnCode',
      'productQtyOnHand',
      'uom',
      'unitrate',
      'productCode',
    ]

    // Check if any existing row misses mandatory fields
    const incompleteRow = newhsnData.find(row => {
      return mandatoryFields.some(field => !row[field] || row[field] === '')
    })

    if (incompleteRow) {
      message.error('Please fill all mandatory fields in the existing rows before adding new.')
      return
    }

    // Optional: You can add additional checks here if needed

    // Add new empty row
    setNewhsnData([...newhsnData, { ...emptyrow }])
  }

  useEffect(() => {
    updatetotalvalue()
  }, [newhsnData, groupRowsData, dcMode])

  const handleRemoveRow = index => {
    const newTableData = newhsnData.filter((_, rowIndex) => rowIndex !== index)
    setNewhsnData(newTableData)
  }
  const updatetotalvalue = () => {
    const activeRows = dcMode === 'group' ? groupRowsData : newhsnData
    const totalvalues = activeRows.reduce((sum, row) => sum + parseFloat(row.totalvalue || 0), 0)
    DcForm.setFieldsValue({
      TotalBasic: getFormattedValue(totalvalues.toLocaleString()),
    })
    calculatetotal()
  }

  const descriptionChange = (index, option) => {
    if (!option?.data) return

    const newData = [...newhsnData]

    const { productId, productCode, productDesc, qty } = option.data

    // Calculate used qty excluding current row
    const usedQty = newData.reduce((sum, row, idx) => {
      return idx !== index && row.productId === productId
        ? sum + parseFloat(row.productQtyOnHand || 0)
        : sum
    }, 0)

    const remainingQty = Math.max(qty - usedQty, 0)

    newData[index] = {
      ...newData[index],
      productCode,
      productId,
      description: productDesc,
      productQtyOnHand: remainingQty,
    }
    setNewhsnData(newData)
    calculatetotal()
  }
  const handleKeyDown = e => {
    if (e.key === '" ' || e.key === " ' ") {
      e.preventDefault()
    }
  }
  const handleKeyPress = e => {
    if (!e || !e.charCode) {
      return
    }

    const charCode = e.charCode || e.keyCode
    const charStr = String.fromCharCode(charCode)

    // Prevent double quotes and single quotes
    if (charStr === '"' || charStr === "'") {
      e.preventDefault()
    }
  }
  const columns3 = [
    {
      title: (
        <span>
          Part Number <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'productCode',
      key: 'productCode',
      width: '20%',
      render: (_, record, index) => (
        <AutoComplete
          options={projectList}
          value={record.productCode || ''}
          style={{ width: '100%' }}
          filterOption={(inputValue, option) =>
            option.label.toUpperCase().includes(inputValue.toUpperCase())
          }
          onChange={value => handleInputChanges(index, 'productCode', value)}
          onSelect={(value, option) => descriptionChange(index, option)}
        >
          <Input placeholder="Select here" onKeyDown={handleKeyDown} />
        </AutoComplete>
      ),
    },

    {
      title: (
        <span>
          {' '}
          Description of Goods <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'description',
      key: 'description ',
      width: '20%',
      render: (text, record, index) => (
        // <Input value={text} onChange={(e) => handleInputChanges(index, 'description', e.target.value)} />

        <Input
          value={text}
          onKeyPress={handleKeyPress}
          disabled
          onChange={e => handleInputChanges(index, 'description', e.target.value)}
        />
      ),
    },

    {
      title: (
        <span>
          {' '}
          HSN Code <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      width: '10%',
      render: (text, record, index) => (
        // <Input
        //   maxLength={8}
        //   value={text}
        //   onChange={(e) => handleInputChanges(index, 'hsnCode', e.target.value)}
        //   onKeyPress={(e) => {
        //     const charCode = e.charCode || e.keyCode;
        //     if (charCode < 48 || charCode > 57) {
        //       e.preventDefault();
        //     }
        //     handleKeyPress()
        //   }}
        // />
        <AutoComplete
          style={{ width: '150px' }}
          options={hsnCode}
          onKeyPress={e => {
            const charCode = e.charCode || e.keyCode
            if (charCode < 48 || charCode > 57) {
              e.preventDefault()
            }
            handleKeyPress()
          }}
          onChange={e => {
            handleInputChanges(index, 'hsnCode', e)
          }}
          maxLength={8}
          onClick={() => handleHSNCode(record)}
        >
          <Input placeholder="Select here" />
        </AutoComplete>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Qty.<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'productQtyOnHand',
      key: 'productQtyOnHand',
      width: '10%',

      render: (text, record, index) => {
        const partNumber = record.productCode

        const partInfo = projectList.find(opt => opt.value === partNumber)
        const maxQty = partInfo?.data?.qty ? parseFloat(partInfo.data.qty) : 0

        const usedQty = newhsnData.reduce((sum, row, idx) => {
          return idx !== index && row.productCode === partNumber
            ? sum + parseFloat(row.productQtyOnHand || 0)
            : sum
        }, 0)

        const remainingQty = maxQty - usedQty
        return (
          <Input
            value={text}
            disable={remainingQty <= -2}
            onKeyPress={e => {
              // your logic here, e.g., allow only digits and dot
              const {
                key,
                currentTarget: { value },
              } = e
              const isDigit = /[0-9]/.test(key)
              const isDot = key === '.'
              const alreadyHasDot = value.includes('.')
              if (!isDigit && (!isDot || alreadyHasDot)) {
                e.preventDefault()
              }
              handleKeyPress(e)
            }}
            onChange={e => handleInputChanges(index, 'productQtyOnHand', e.target.value)}
          />
        )
      },
    },
    {
      title: (
        <span>
          {' '}
          UOM<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'uom',
      key: 'uom',
      width: '10%',
      render: (text, record, index) => (
        // <Input
        //   value={text}
        //   onChange={e => handleInputChanges(index, 'uom', e.target.value)}
        //   onKeyPress={handleKeyPress}
        // />
        <AutoComplete
          style={{ width: '150px' }}
          options={uomCodedata}
          onChange={e => {
            handleInputChanges(index, 'uom', e)
          }}
          maxLength={8}
          // onClick={e => handleInputChanges(index, 'uom', e)}
        >
          <Input placeholder="Select here" />
        </AutoComplete>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Unit Rate {Menulistdata[0].currency}
          <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'unitrate ',
      key: 'unitrate ',
      width: '15%',
      align: 'right',
      render: (text, record, index) => (
        <Input
          value={text}
          // onMouseLeave={updatetotalvalue}
          onChange={e => handleInputChanges(index, 'unitrate', e.target.value)}
          onKeyPress={e => {
            const {
              key,
              currentTarget: { value },
            } = e
            const isDigit = /[0-9]/.test(key)
            const isDot = key === '.'
            const alreadyHasDot = value.includes('.')

            if (!isDigit && (!isDot || alreadyHasDot)) {
              e.preventDefault()
            }
            // if (Number.isNaN(Number(e.key))) {
            //   e.preventDefault()
            // }
            handleKeyPress()
          }}
        />
      ),
    },
    {
      title: (
        <span>
          {' '}
          Total Value {Menulistdata[0].currency}
          <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'totalvalue',
      key: 'totalvalue',
      width: '15%',
      align: 'right',
      render: (text, record, index) => (
        <Input
          value={getFormattedValue(text)}
          disabled
          onChange={e => handleInputChanges(index, 'totalvalue', e.target.value)}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {newhsnData.length > 1 && <RemoveIcon onClick={() => handleRemoveRow(index)} />}
          {index === newhsnData.length - 1 && <AddIcon onClick={() => handleAddNewRow()} />}
        </div>
      ),
    },
  ]

  // Available Material Groups come back as one row per constituent product (grouped
  // by msHdrId) — collapse them into one option per group for the picker, keeping
  // the item breakdown around for the info popover.
  const groupOptions = []
  const groupOptionsByHdrId = {}
  availableGroups.forEach(item => {
    if (!groupOptionsByHdrId[item.msHdrId]) {
      groupOptionsByHdrId[item.msHdrId] = { msHdrId: item.msHdrId, msName: item.msName, items: [] }
      groupOptions.push(groupOptionsByHdrId[item.msHdrId])
    }
    groupOptionsByHdrId[item.msHdrId].items.push(item)
  })

  const handleGroupSelect = (index, msHdrId) => {
    const newData = [...groupRowsData]
    if (!msHdrId) {
      // Cleared via the Select's own "x" - reset this row back to empty so hasGroupData can
      // go false again once no row has a group selected, re-enabling the Individual Items tab.
      newData[index] = { ...emptyGroupRow }
      setGroupRowsData(newData)
      return
    }
    const selected = groupOptionsByHdrId[msHdrId]
    if (!selected) return
    const computedTotal = selected.items.reduce(
      (sum, item) => sum + parseFloat(item.qty || 0) * parseFloat(item.costPerUnit || 0),
      0,
    )
    newData[index] = {
      ...newData[index],
      msHdrId: selected.msHdrId,
      msName: selected.msName,
      // The Staging Group's own UOM (msUomLongDesc), not derived from a member item's own
      // product UOM - every item on this group shares the same value.
      uom: selected.items[0]?.msUomLongDesc || '',
      uomCode: selected.items[0]?.uomCode || '',
      totalvalue: computedTotal ? computedTotal.toFixed(2) : '',
    }
    setGroupRowsData(newData)
  }

  const handleGroupInputChange = (index, key, value) => {
    const newData = [...groupRowsData]
    newData[index][key] = value
    setGroupRowsData(newData)
  }

  const handleAddGroupRow = () => {
    const mandatoryFields = ['msHdrId', 'hsnCode', 'totalvalue']
    const incompleteRow = groupRowsData.find(row =>
      mandatoryFields.some(field => !row[field] || row[field] === ''),
    )
    if (incompleteRow) {
      message.error('Please fill all mandatory fields in the existing rows before adding new.')
      return
    }
    setGroupRowsData([...groupRowsData, { ...emptyGroupRow }])
  }

  const handleRemoveGroupRow = index => {
    setGroupRowsData(groupRowsData.filter((_, rowIndex) => rowIndex !== index))
  }

  const hasIndividualData = newhsnData.some(
    row =>
      row.productCode || row.description || row.hsnCode || row.productQtyOnHand || row.unitrate,
  )
  const hasGroupData = groupRowsData.some(row => row.msHdrId)

  const groupColumns = [
    {
      title: (
        <span>
          Group <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'msHdrId',
      key: 'msHdrId',
      width: '25%',
      render: (text, record, index) => {
        const usedIds = groupRowsData
          .filter((_, rowIndex) => rowIndex !== index)
          .map(row => row.msHdrId)
          .filter(Boolean)
        const options = groupOptions.filter(g => !usedIds.includes(g.msHdrId))
        const group = groupOptionsByHdrId[record.msHdrId]
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Group"
              value={record.msHdrId || undefined}
              onChange={value => handleGroupSelect(index, value)}
              allowClear
            >
              {options.map(g => (
                <Option key={g.msHdrId} value={g.msHdrId}>
                  {g.msName}
                </Option>
              ))}
            </Select>
            {group ? (
              <Popover
                content={
                  <Table
                    size="small"
                    pagination={false}
                    columns={[
                      { title: 'Part Number', dataIndex: 'productCode', key: 'productCode' },
                      { title: 'Description', dataIndex: 'productDesc', key: 'productDesc' },
                      { title: 'UOM', dataIndex: 'uomLongDesc', key: 'uomLongDesc' },
                      { title: 'Qty', dataIndex: 'qty', key: 'qty' },
                    ]}
                    dataSource={group.items}
                    rowKey="productId"
                  />
                }
              >
                <InfoCircleOutlined />
              </Popover>
            ) : null}
          </div>
        )
      },
    },
    {
      title: (
        <span>
          {' '}
          HSN Code <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'hsnCode',
      key: 'hsnCode',
      width: '10%',
      render: (text, record, index) => (
        <Input
          maxLength={8}
          value={text}
          onChange={e => handleGroupInputChange(index, 'hsnCode', e.target.value)}
          onKeyPress={e => {
            const charCode = e.charCode || e.keyCode
            if (charCode < 48 || charCode > 57) {
              e.preventDefault()
            }
            handleKeyPress(e)
          }}
        />
      ),
    },
    {
      title: (
        <span>
          {' '}
          Qty.<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'qty',
      key: 'qty',
      width: '8%',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={e => handleGroupInputChange(index, 'qty', e.target.value)}
          onKeyPress={e => {
            const {
              key,
              currentTarget: { value },
            } = e
            const isDigit = /[0-9]/.test(key)
            const isDot = key === '.'
            const alreadyHasDot = value.includes('.')
            if (!isDigit && (!isDot || alreadyHasDot)) {
              e.preventDefault()
            }
            handleKeyPress(e)
          }}
        />
      ),
    },
    {
      title: (
        <span>
          {' '}
          UOM<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'uom',
      key: 'uom',
      width: '8%',
      render: text => <Input value={text} disabled />,
    },
    {
      title: (
        <span>
          {' '}
          Total Value {Menulistdata[0].currency}
          <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'totalvalue',
      key: 'totalvalue',
      width: '15%',
      align: 'right',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={e => handleGroupInputChange(index, 'totalvalue', e.target.value)}
          onKeyPress={e => {
            const {
              key,
              currentTarget: { value },
            } = e
            const isDigit = /[0-9]/.test(key)
            const isDot = key === '.'
            const alreadyHasDot = value.includes('.')
            if (!isDigit && (!isDot || alreadyHasDot)) {
              e.preventDefault()
            }
            handleKeyPress(e)
          }}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {groupRowsData.length > 1 && <RemoveIcon onClick={() => handleRemoveGroupRow(index)} />}
          {index === groupRowsData.length - 1 && <AddIcon onClick={() => handleAddGroupRow()} />}
        </div>
      ),
    },
  ]

  // const handleAdd = () => {
  //   const formValues = tableForm.getFieldsValue()
  //   if (
  //     !formValues.hsnCode ||
  //     !formValues.description ||
  //     !formValues.productQtyOnHand ||
  //     !formValues.uom ||
  //     !formValues.unitrate ||
  //     !formValues.totalvalue
  //   ) {
  //     return
  //   }
  //   const x = {
  //     dcDtlId: '',
  //     dcId: '',
  //     hsnNo: formValues.hsnCode,
  //     descOfGoods: formValues.description,
  //     qty: formValues.productQtyOnHand,
  //     uom: formValues.uom,
  //     rate: removeCommas(formValues.unitrate),
  //     total: removeCommas(formValues.totalvalue),
  //     productId: prodCode,
  //     uomDesc: uomcode || '',
  //   }
  //   const newHsntable = [...hsntable, x]
  //   const totalSum = newHsntable.reduce((sum, item) => sum + parseFloat(item.total), 0)
  //   setHsntable(newHsntable)
  //   tableForm.resetFields()
  //   DcForm.setFieldsValue({
  //     TotalBasic: getFormattedValue(totalSum.toLocaleString()),
  //   })
  //   calculatetotal()
  // }

  // const handleRemove = index => {
  //   setHsntable(hsntable.filter((_, i) => i !== index))
  //   const newHsntable = hsntable.filter((_, i) => i !== index)
  //   const totalSum = newHsntable.reduce((sum, item) => sum + parseFloat(item.total), 0)
  //   DcForm.setFieldsValue({
  //     TotalBasic: getFormattedValue(totalSum.toLocaleString()),
  //   })
  //   amountonchange()
  // }

  const getFormattedValue = value => {
    if (!value) {
      return ''
    }
    const inputValue = String(value).replace(/[^\d.]/g, '')
    const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
    const formattedValue = parsedValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formattedValue
  }

  const removeCommas = value => {
    if (!value) {
      return 0
    }
    const valuse = value.replace(/,/g, '')
    return valuse
  }

  const amountonchange = () => {
    calculatetotal()
    const formvalues = DcForm.getFieldsValue()
    DcForm.setFieldsValue({
      TotalBasic: getFormattedValue(formvalues.TotalBasic),
      Gst: getFormattedValue(formvalues.Gst),
      TotalValue: getFormattedValue(formvalues.TotalValue),
    })
    const formvalue2 = tableForm.getFieldsValue()

    tableForm.setFieldsValue({
      unitrate: getFormattedValue(formvalue2.unitrate),
      totalvalue: getFormattedValue(formvalue2.totalvalue),
    })
  }

  const calculatetotal = () => {
    const formvalues = DcForm.getFieldsValue()
    const TotalBasic = parseFloat(removeCommas(formvalues.TotalBasic), 2) || 0
    const Gst = parseFloat(removeCommas(formvalues.Gst), 2) || 0
    const totalWithGst = TotalBasic + TotalBasic * (Gst / 100)
    const finalTotalWithCommas = totalWithGst.toLocaleString('en-IN')
    const amountInWord = convertNumberToWords(parseFloat(totalWithGst, 2))
    DcForm.setFieldsValue({
      Total: finalTotalWithCommas,
      amountInWords: amountInWord,
    })
    // const formvalues = DcForm.getFieldsValue()
    // const fieldsToSum = ['TotalBasic', 'Gst']
    // const total = fieldsToSum.reduce((accumulator, fieldName) => {
    //   let fieldValue = formvalues[fieldName]
    //   if (fieldValue === '' || fieldValue === undefined || fieldValue === null) {
    //     fieldValue = '0'
    //   }
    //   fieldValue = parseFloat(removeCommas(fieldValue)) || 0
    //   return accumulator + fieldValue
    // }, 0)

    // if (total !== undefined && total !== null) {
    //   const amountInWord = convertNumberToWords(parseInt(total, 10))
    //   const finalTotalWithCommas = total.toLocaleString('en-IN')
    //   DcForm.setFieldsValue({
    //     amountInWords: amountInWord,
    //     Total: finalTotalWithCommas,
    //   })
    // }
  }

  const saveDc = async () => {
    let isValid = true
    let updatedHsnTable = []
    if (dcMode === 'group') {
      const touchedGroupRows = groupRowsData.filter(item => item.msHdrId)
      touchedGroupRows.forEach(item => {
        if (!item.msHdrId || !item.hsnCode || !item.qty || !item.totalvalue) {
          isValid = false
        }
      })
      if (touchedGroupRows.length === 0) {
        isValid = false
      }
      updatedHsnTable = touchedGroupRows.map(item => ({
        dcDtlId: '',
        dcId: '',
        descOfGoods: item.msName,
        hsnNo: item.hsnCode,
        productId: '',
        qty: item.qty,
        rate: '0',
        total: item.totalvalue,
        uom: item.uom,
        // Empty, like the individual-items branch below - lets the backend resolve/create a
        // real uom_mst code from the group's own UOM label (item.uom) via getUomCodeByUnit,
        // instead of persisting the group's member item's own product UOM code (wrong source).
        uomDesc: '',
        dcrId: '',
        productCode: '',
        mrHdrId: null,
        locationCode: '',
        msHdrId: item.msHdrId,
        msName: item.msName,
      }))
    } else {
      console.log(newhsnData, 'newhsnData==')
      const newhsnData2 = newhsnData.filter(
        item =>
          item.productCode ||
          item.description ||
          item.hsnCode ||
          item.productQtyOnHand ||
          item.unitrate,
      )
      newhsnData2.forEach(item => {
        if (
          !item.description ||
          !item.hsnCode ||
          !item.productQtyOnHand ||
          !item.unitrate ||
          !item.totalvalue ||
          !item.uom
        ) {
          isValid = false
        }
      })
      if (newhsnData2.length === 0) {
        isValid = false
      }
      updatedHsnTable = newhsnData2.map(item => ({
        dcDtlId: item.dcDtlId || '',
        dcId: '',
        descOfGoods: item.description,
        hsnNo: item.hsnCode,
        productId: item.productId || '',
        qty: item.productQtyOnHand,
        rate: item.unitrate,
        total: item.totalvalue,
        uom: item.uom,
        uomDesc: '',
        dcrId: item.dcrId || '',
        productCode: item.productCode || '',
        mrHdrId: item.mrHdrId,
        locationCode: item.locationCode || '',
      }))
    }
    const formvalues = DcForm.getFieldsValue()
    const mandatoryFields = [
      'DcType',
      'ChallanDate',
      'AddressType',
      'deliveryName',
      'deliveryAddressLine',
      'deliveryCity',
      'deliveryState',
      'deliveryPincode',
      'deliveryGst',
      // 'LRDate',
      // 'LRNo',
      // 'PoDate',
      // 'PoNo',
      'TotalBasic',
      'Gst',
      'Total',
      'FromdeliveryName',
      'fromcity',
      'frompincode',
      'fromaddress',
      'fromstate',
      'fromgst',
      // 'TransportationMode',
      // 'TransportationName',
      // 'Recno',
      'Division',
      'Remarks',
    ]

    const invalidField = mandatoryFields.find(
      field => !formvalues[field] || formvalues[field] === '',
    )
    if (invalidField) {
      isValid = false
    }
    if (isValid && updatedHsnTable.length > 0) {
      const response = await indentFileUpload({
        requestPath: 'insertDcDtl',
        requestData: {
          amountInWords: formvalues.amountInWords,
          dcDate: moment(formvalues.ChallanDate).format('YYYY-MM-DD'),
          dcDtlList: updatedHsnTable,
          dcID: '',
          dcType: formvalues.DcType,
          dcTypeDesc: '',
          deliveredTo: formvalues.deliveryName,
          deliveredToAddress: formvalues.deliveryAddressLine,
          deliveredToCountry: '',
          deliveredToDistrict: formvalues.deliveryCity,
          deliveredToState: formvalues.deliveryState,
          deliveredPinCode: formvalues.deliveryPincode,
          deliveredGstIn: formvalues.deliveryGst,
          gstValue: removeCommas(formvalues.Gst || 0),
          lrDateTime: formvalues.LRDate ? moment(formvalues.LRDate).format('YYYY-MM-DD') : '',
          lrNo: formvalues.LRNo,
          pmHdrId,
          poDATE: formvalues.PoDate ? moment(formvalues.PoDate).format('YYYY-MM-DD') : '',
          poNO: formvalues.PoNo,
          remarks: formvalues.Remarks,
          shippedFrom: formvalues.FromdeliveryName,
          shippedFromAddress: formvalues.fromaddress,
          shippedFromCountry: '',
          shippedFromDistrict: formvalues.fromcity,
          shippedFromState: formvalues.fromstate,
          shippedPinCode: formvalues.frompincode,
          shippedGstIn: formvalues.fromgst,
          // recNo: formvalues.Recno,
          division: formvalues.Division,
          tenantId,
          empId: employeeId,
          totalBasic: removeCommas(formvalues.TotalBasic),
          totalValue: removeCommas(formvalues.Total),
          transportationMode: formvalues.TransportationMode,
          transportationName: formvalues.TransportationName,
        },
      })
      updateDcqty(updatedHsnTable)
      if (response.responseCode === '200') {
        message.success(response.responseDataMessage)
        onClose()
      } else {
        message.error(response.responseDataMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const updateDcqty = async newhsnDat => {
    const filteredData = newhsnDat.filter(item => item.dcrId !== '')
    const paylod = filteredData.map(item => ({
      dtlId: item.dcDtlId,
      qty: item.qty,
    }))
    if (filteredData && filteredData.length > 0) {
      // eslint-disable-next-line no-unused-vars
      const response = await indentFileUpload({
        requestPath: 'updateDcqty',
        requestData: paylod,
      })
    }
  }

  const handleCancelpopup = () => {
    onClose()
  }
  const changedcdropdown = () => {
    const formvalue = DcForm.getFieldsValue()
    const x = formvalue.DCReqest
    const selectedlist = mrDetails?.find(item => item.dcrId === x)

    if (selectedlist.dereqdtllist && selectedlist.dereqdtllist.length !== 0) {
      const hsndata = selectedlist.dereqdtllist.map(item => ({
        ...item,
        description: item.descofGoods,
        productQtyOnHand: item.pendingQty,
        productId: item.productId,
      }))
      setNewhsnData(hsndata)
    } else {
      setNewhsnData([emptyrow])
    }
  }

  return (
    <div>
      <Modal
        title="Create Delivery Challan"
        visible={visible}
        width="90%"
        onCancel={onClose}
        footer={null}
      >
        <Form form={DcForm} className="create_dc_form" onFinish={onFinish}>
          <div>
            <DcFields onGetDetails={getDtls} onClear={handleClear} />
          </div>
          {showform === true ? (
            <div>
              <Card className="mt-4">
                <div className="d-flex justify-content-end mb-5">
                  <Form.Item
                    name="DcType"
                    label={
                      <span className="label">
                        DC Type<span className="mandatorystar"> *</span>
                      </span>
                    }
                    className="col-md-3"
                    initialValue="Returnable"
                  >
                    <Select style={{ width: '100%' }}>
                      <Option value="Returnable">Returnable</Option>
                      <Option value="Non Returnable">Non Returnable</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {/* <h5>Shipping From</h5> */}
                    <Form.Item
                      name="FromAddressType"
                      label={
                        <h5 className="labels" style={{ marginBottom: '0px' }}>
                          Shipping From<span style={{ color: 'red' }}>*</span>
                        </h5>
                      }
                      labelAlign="left"
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select"
                        onChange={() => handleDcChange('FromAddressType')}
                      >
                        {dclist?.map(item => (
                          <Option key={item.dcCode} value={item.dcCode}>
                            {item.dcDesc}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="FromdeliveryName"
                      label={
                        <span className="labels">
                          Name<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleFromAddressChange}
                      >
                        {fromAddresList?.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Option key={index} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="fromaddress"
                      label={
                        <span className="labels">
                          Address<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter Address" />
                    </Form.Item>
                    <Form.Item
                      name="fromcity"
                      label={
                        <span className="labels">
                          City<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter City" />
                    </Form.Item>
                    <Form.Item
                      name="frompincode"
                      label={
                        <span className="labels">
                          PinCode<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter PinCode" />
                    </Form.Item>
                    <Form.Item
                      name="fromstate"
                      label={
                        <span className="labels">
                          State<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter State" />
                    </Form.Item>
                    <Form.Item
                      name="fromgst"
                      label={
                        <span className="labels">
                          GSTIN<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter GSTIN" />
                    </Form.Item>
                  </div>
                  {/* <div className='col-md-4' /> */}
                  <div className="col-md-6">
                    {/* <h5>Delivered To</h5> */}
                    <Form.Item
                      name="AddressType"
                      label={
                        <h5 className="labels" style={{ marginBottom: '0px' }}>
                          Delivered To<span style={{ color: 'red' }}>*</span>
                        </h5>
                      }
                      labelAlign="left"
                    >
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select"
                        onChange={() => handleDcChange('AddressType')}
                      >
                        {dclist?.map(item => (
                          <Option key={item.dcCode} value={item.dcCode}>
                            {item.dcDesc}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="deliveryName"
                      label={
                        <span className="labels">
                          Name<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select"
                        onChange={handleAddressChange}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {addressList?.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Option key={index} value={item.code}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="deliveryAddressLine"
                      label={
                        <span className="labels">
                          Address<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter Address" />
                    </Form.Item>
                    <Form.Item
                      name="deliveryCity"
                      label={
                        <span className="labels">
                          City<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter City" />
                    </Form.Item>
                    <Form.Item
                      name="deliveryPincode"
                      label={
                        <span className="labels">
                          PinCode<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter PinCode" />
                    </Form.Item>
                    <Form.Item
                      name="deliveryState"
                      label={
                        <span className="labels">
                          State<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter State" />
                    </Form.Item>
                    <Form.Item
                      name="deliveryGst"
                      label={
                        <span className="labels">
                          GSTIN<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter GSTIN" />
                    </Form.Item>
                  </div>
                </div>
              </Card>
              <Card className="mt-2">
                <div className="row">
                  <div className="col-md-6 mt-2">
                    {/* <Form.Item
                      name="Recno"
                      label={
                        <span className="labels">
                          Rec No.<span className="mandatorystar"> *</span>
                        </span>
                      }
                      initialValue="Auto Generated"
                    >
                      <Input placeholder="Enter Rec No." disabled />
                    </Form.Item> */}
                    <Form.Item
                      name="Division"
                      initialValue="Robotics"
                      label={
                        <span className="labels">
                          Division<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input disabled placeholder="Enter Division" />
                    </Form.Item>
                    <Form.Item
                      name="Challan No"
                      initialValue="Auto Generated"
                      label={
                        <span className="labels">
                          DC No<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="Enter DC No" disabled />
                    </Form.Item>
                    <Form.Item
                      name="ChallanDate"
                      initialValue={moment()}
                      label={
                        <span className="labels">
                          DC Date<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        defaultValue={moment()}
                        format="DD-MMM-YYYY"
                        disabledDate={d => !d || d.isAfter(moment())}
                      />
                    </Form.Item>
                    <Form.Item name="DCReqest" label={<span className="labels">DC Reqest</span>}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select DC Request"
                        onChange={changedcdropdown}
                      >
                        {mrDetails?.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Option key={index} value={item.dcrId}>
                            {item.remarks}-{item.reqBy}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-6 mt-2">
                    <Form.Item name="PoNo" label={<span className="labels">Po. No.</span>}>
                      <Input placeholder="Enter Po. No." />
                    </Form.Item>
                    <Form.Item name="PoDate" label={<span className="labels">Po. Date</span>}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="DD-MMM-YYYY"
                        disabledDate={d => !d || d.isAfter(moment())}
                      />
                    </Form.Item>
                    <Form.Item
                      name="TransportationName"
                      label={<span className="labels">Transportation Name</span>}
                    >
                      <Input placeholder="Enter Transportation Name" />
                    </Form.Item>
                    <Form.Item
                      name="TransportationMode"
                      label={<span className="labels">Transportation Mode</span>}
                    >
                      <Input placeholder="Enter Transportation Mode" />
                    </Form.Item>
                    <Form.Item name="LRNo" label={<span className="labels">LR No.</span>}>
                      <Input placeholder="Enter LR No." />
                    </Form.Item>
                    <Form.Item name="LRDate" label={<span className="labels">LR Date</span>}>
                      <DatePicker format="DD-MMM-YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                </div>
                <div className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Radio.Group
                    value={dcMode}
                    onChange={e => {
                      setDcMode(e.target.value)
                      setNewhsnData([emptyrow])
                      setGroupRowsData([emptyGroupRow])
                    }}
                  >
                    <Radio.Button value="individual" disabled={dcMode === 'group' && hasGroupData}>
                      Individual Items
                    </Radio.Button>
                    {isBgrNeoFactoryShipping && (
                      <Radio.Button
                        value="group"
                        disabled={dcMode === 'individual' && hasIndividualData}
                      >
                        Material Group
                      </Radio.Button>
                    )}
                  </Radio.Group>
                  {((dcMode === 'group' && hasGroupData) ||
                    (dcMode === 'individual' && hasIndividualData)) && (
                    <ButtonComponent
                      type="primary"
                      text="Clear"
                      onClick={() => {
                        if (dcMode === 'group') {
                          setGroupRowsData([emptyGroupRow])
                        } else {
                          setNewhsnData([emptyrow])
                        }
                      }}
                    />
                  )}
                </div>
                <Form form={tableForm}>
                  <div>
                    {/* {hsntable.length > 0 ? (
                        <Table columns={columns1} dataSource={hsntable} pagination={false} />
                      ) : null}
                      <Table
                        columns={columns}
                        dataSource={insertData}
                        pagination={false}
                        showHeader={!(hsntable.length > 0)}
                        style={{ marginTop: '-1px' }}
                      /> */}
                    {dcMode === 'group' ? (
                      <Table
                        columns={groupColumns}
                        dataSource={groupRowsData}
                        pagination={false}
                        style={{ marginTop: '-1px' }}
                      />
                    ) : (
                      <Table
                        columns={columns3}
                        dataSource={newhsnData}
                        pagination={false}
                        style={{ marginTop: '-1px' }}
                      />
                    )}
                  </div>
                </Form>
                <div className="row mt-4">
                  <div className="col-md-5 remarks_section">
                    <Form.Item
                      name="amountInWords"
                      label={<h5 className="labels">Amount in Words</h5>}
                    >
                      <TextArea className="custom-input" disabled />
                    </Form.Item>

                    <Form.Item
                      name="Remarks"
                      className="mt-3"
                      label={
                        <h5 className="labels">
                          Remarks<span className="mandatorystar"> *</span>
                        </h5>
                      }
                    >
                      <TextArea className="custom-input" />
                    </Form.Item>
                  </div>
                  <div className="col-md-2" />
                  <div className="col-md-5">
                    <Form.Item
                      name="TotalBasic"
                      label={
                        <span className="labels">
                          Basic Total{Menulistdata[0].currency}
                          <span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="0.00" onChange={amountonchange} disabled />
                    </Form.Item>
                    <Form.Item
                      name="Gst"
                      label={
                        <span className="labels">
                          GST<span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Select
                        style={{ width: '100%' }}
                        onChange={amountonchange}
                        placeholder="Select GST"
                      >
                        <Option value="5">5</Option>
                        <Option value="12">12</Option>
                        <Option value="18">18</Option>
                        <Option value="28">28</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="Total"
                      label={
                        <span className="labels">
                          Total Value{Menulistdata[0].currency}
                          <span className="mandatorystar"> *</span>
                        </span>
                      }
                    >
                      <Input placeholder="0.00" onChange={amountonchange} disabled />
                    </Form.Item>
                  </div>
                </div>
              </Card>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                  gap: '12px',
                }}
              >
                <ButtonComponent type="primary" text="Save" onClick={saveDc} />
                <ButtonComponent type="primary" text="Cancel" onClick={handleCancelpopup} />
              </div>
            </div>
          ) : null}
        </Form>
      </Modal>
    </div>
  )
}

export default CreateDc
