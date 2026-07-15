import React, { useState, useEffect } from 'react'
import store from 'store'
import {
  Upload,
  Button,
  Form,
  Select,
  DatePicker,
  message,
  Space,
  Table,
  Input,
  Spin,
  AutoComplete,
  Tooltip,
} from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import fileDownload from 'js-file-download'
import moment from 'moment'
import IntendSample from 'resources/IndentTemplate.xlsx'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIcon from 'components/shared/AddIconComponent'
import messageReturn from '_helpers/messageReturn'
import ModalPopup from '../../shared/ModalPopupComponent'
import Buttons from '../../shared/ButtonComponent'
// import Table from '../TableComponent'
import { indentFileUpload } from '../../../services/common/AppeovedDocumentService/adddocumentservice'
import getKeyCategory from '../../../services/common/BudgetsheetService/KeyCategoryService'
import checkFileSize from '../../../_helpers/fileUtill'
import 'antd/dist/antd.css'
import '../style.scss'

const ExpectDefaultDate = moment().add(15, 'days')
const Addindent = ({ handleCancel, isModalVisible, componentdata, commonProjectId }) => {
  const [form] = Form.useForm()
  const [tableform] = Form.useForm()
  const [addnewform] = Form.useForm()
  const [singlefile, setSingleFile] = useState(null)
  const [tableData, setTableData] = useState([])
  const [dataKeyArea, setDataKeyArea] = useState([])
  const [dataKeySubArea, setDataKeySubArea] = useState([])
  const [dataSaleCategory, setDataSaleCategory] = useState([])
  const [indentDate, setIndentDate] = useState(moment())
  const [expectindentDate, setExpectIndentDate] = useState(ExpectDefaultDate)
  const [disablebtn, setDisabledbtn] = useState(false)
  const [uploadbtndisable, setUploadBtnDisable] = useState(false)
  const [filesList, setFilesList] = useState([])
  const [productDetails, setProductDetails] = useState([])
  // const [selectedProduct, setSelectedProduct] = useState(null)
  const [isloading, setLoading] = useState(false)
  const [indentForList, setIndentForList] = useState([])

  const Tab = store.get('Tab')
  const employeeId = store.get('employeeId')
  const ProjectID = store.get('ProjectID')
  const referenceId = store.get('referenceId')
  const enquiryId = store.get('enquiryId')
  const tenantid = store.get('tenantId')
  const enquiryarr = store.get('Enquiry')
  const dueDateObject = enquiryarr?.find(item => item.label === 'Due Date')
  const dueDateval = dueDateObject ? moment(dueDateObject.value) : null
  const planStartObject = enquiryarr?.find(item => item.label === 'Planned Start Date')
  const planStartDate = planStartObject ? moment(planStartObject.value) : null

  // const slaveId = store.get('slaveId')
  const { Option } = Select
  useEffect(() => {
    getKeyareas()
    fetchkeyDropdown()
    getProductDetails()
    getIndentFordetails()
  }, [])

  const getIndentFordetails = async () => {
    const keyareaobj = {
      tenantID: tenantid,
      empId: employeeId,
      isInternal: componentdata?.module === 'common' ? 1 : 0,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentTypeMstDropDown',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      setIndentForList(response?.responseData)
    } else {
      setIndentForList([])
    }
  }
  const getKeyareas = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: ProjectID || commonProjectId,
    }
    const response = await indentFileUpload({
      requestPath: 'getKeyArea',
      requestData: keyareaobj,
    })
    if (response) {
      setDataKeyArea(response?.responseData)
    }
  }
  const getProductDetails = async () => {
    const response = await indentFileUpload({
      requestPath: 'getpoInstoreDtlByPmId ',
      requestData: {
        tenantId: tenantid,
        isFlag: 1,
      },
    })
    if (response?.responseCode === '200') {
      const options = response?.responseData.map(item => ({
        key: item.productId ? item.productId : '',
        value: item.productCode ? item.productCode : '',
        data: item,
      }))
      setProductDetails(options)
    } else {
      message.error(response?.responseMessage)
    }
  }
  const getKeusubareas = async () => {
    const formValues = form.getFieldsValue()
    form.setFieldsValue({ keysubarea: undefined })
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: ProjectID || commonProjectId,
      pkaId: formValues.KeyArea,
    }
    const response = await indentFileUpload({
      requestPath: 'getKeySubAreaByPKId',
      requestData: keyareaobj,
    })
    if (response) {
      setDataKeySubArea(response?.responseData)
    }
  }
  const fetchkeyDropdown = async () => {
    const response = await getKeyCategory({
      doctype: Tab?.docTypeCode || '',
      tenId: tenantid,
      enqID: '',
    })
    if (response) {
      setDataSaleCategory(response?.responseData)
    }
  }

  // const onFileChange = info => {
  //   const selectedFile = info.file.originFileObj;

  //   // if (selectedFile) {
  //   //   if (!checkFileSize(selectedFile) && !validationPerformed) {
  //   //     setSingleFile(null);
  //   //   }else{
  //   //     setSingleFile(selectedFile);
  //   //     setUploadBtnDisable(false);
  //   //   }
  //   //   validationPerformed = true;
  //   // }
  // }

  const beforeUpload1 = file => {
    if (checkFileSize(file)) {
      setSingleFile(file)
      setUploadBtnDisable(false)
    } else {
      setSingleFile(null)
    }
  }

  const submitEcxel = async () => {
    if (
      singlefile &&
      ['KeyArea', 'keysubarea', 'salecategory', 'indentfor'].every(field =>
        form.getFieldValue(field),
      )
    ) {
      setUploadBtnDisable(true)

      const reqObj = [{ tenantid }]
      const formData = new FormData()
      formData.append('UploadIndentReq', JSON.stringify({ reqObj }))
      formData.append('file', singlefile)
      const response = await indentFileUpload({
        requestPath: 'uploadIndentTemplate',
        requestData: formData,
      })
      if (response) {
        // setTableData(response?.responseData)
        const updatedResponseData = response?.responseData.map(item => ({
          ...item,
          remarks: item.remarks,
        }))
        setTableData(updatedResponseData)

        const fieldValues = {}
        updatedResponseData.forEach(item => {
          fieldValues[`partNumber_${item.sno}`] = item.partNumber
          fieldValues[`desc_${item.sno}`] = item.desc
          fieldValues[`specification_${item.sno}`] = item.specification
          fieldValues[`weight_${item.sno}`] = item.weight
          fieldValues[`material_${item.sno}`] = item.material
          fieldValues[`make_${item.sno}`] = item.make
          fieldValues[`qty_${item.sno}`] = item.qty
          fieldValues[`unit_${item.sno}`] = item.unit
          fieldValues[`remarks_${item.sno}`] = item.remarks
        })
        tableform.setFieldsValue(fieldValues)

        if (updatedResponseData.length > 0) {
          setDisabledbtn(false)
        }
        if (response.responseCode === '412') {
          setUploadBtnDisable(false)
          setSingleFile(null)
          messageReturn(603)
        }
      }
    } else {
      messageReturn(405)
    }
  }
  const clearTable = () => {
    handleCancel()
    setSingleFile(null)
    setTableData([])
    setUploadBtnDisable(false)
    form.resetFields()
    tableform.resetFields()
    setExpectIndentDate(ExpectDefaultDate)
    setIndentDate(moment())
  }

  // const handleChange = ({ fileList }) => {
  //   const filteredFiles = fileList.filter(file => checkFileSize(file));
  //   const updatedFileList = filteredFiles.map(file => ({
  //     ...file,
  //     isKeySet: false,
  //   }))
  //   setFilesList(updatedFileList)
  // }

  const handleChange = ({ fileList }) => {
    const updatedFileList = fileList
      .filter(file => {
        const fileSizeKB = file.size / 1024
        return fileSizeKB <= 1024 * 100
      })
      .map(file => ({
        ...file,
        isKeySet: false,
      }))

    setFilesList(updatedFileList)
  }

  const beforeUpload = file => {
    const fileSizeKB = file.size / 1024
    if (fileSizeKB > 1024 * 100) {
      messageReturn(null, `File ${file.name} size should be less than 100 MB`, 'error')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    store.remove('closepopup')
    const formValues2 = tableform.getFieldsValue()
    // const updatedTableData = tableData.map(item => {
    //   return {
    //     ...item,
    //     partNumber: formValues2[`partNumber_${item.sno}`] || '',
    //     desc: formValues2[`desc_${item.sno}`] || '',
    //     specification: formValues2[`specification_${item.sno}`] || '',
    //     make: formValues2[`make_${item.sno}`] || '',
    //     weight: formValues2[`weight_${item.sno}`] || '',
    //     material: formValues2[`material_${item.sno}`] || '',
    //     qty: formValues2[`qty_${item.sno}`] || '',
    //     unit: formValues2[`unit_${item.sno}`] || '',
    //     // remarks: formValues2[`remarks_${item.sno}`] || '',
    //   }
    // })
    let isErrorOccurred = false

    tableData.forEach(item => {
      const qty = formValues2[`qty_${item.sno}`] || ''
      const weight = formValues2[`weight_${item.sno}`] || ''
      const qtyNumber = Number(qty)
      const weightNumber = Number(weight)

      if (Number.isNaN(qtyNumber) || Number.isNaN(weightNumber) || qtyNumber < 1) {
        isErrorOccurred = true
      }
    })

    if (isErrorOccurred) {
      message.error('Enter valid numbers for quantity or mass')
      return
    }

    const updatedTableData = tableData.map(item => {
      const qty = formValues2[`qty_${item.sno}`] || ''
      const weight = formValues2[`weight_${item.sno}`] || ''

      const qtyNumber = Number(qty)
      const weightNumber = Number(weight)

      return {
        ...item,
        partNumber: formValues2[`partNumber_${item.sno}`] || '',
        desc: formValues2[`desc_${item.sno}`] || '',
        specification: formValues2[`specification_${item.sno}`] || '',
        make: formValues2[`make_${item.sno}`] || '',
        weight: Number.isNaN(weightNumber) ? '' : weightNumber,
        material: formValues2[`material_${item.sno}`] || '',
        qty: Number.isNaN(qtyNumber) ? '' : qtyNumber,
        unit: formValues2[`unit_${item.sno}`] || '',
      }
    })
    setTableData(updatedTableData)
    const partNumberIsEmpty = updatedTableData.some(item => item.partNumber === '')
    const qtyIsEmpty = updatedTableData.some(item => item.qty === '')
    const unitIsEmpty = updatedTableData.some(item => item.unit === '')
    const descIsEmpty = updatedTableData.some(item => item.desc === '')
    if (
      ['KeyArea', 'keysubarea', 'salecategory', 'indentfor'].every(field =>
        form.getFieldValue(field),
      ) &&
      tableData.length !== 0 &&
      //  &&  ['KeyArea', 'keysubarea', 'salecategory'].every(field => form.getFieldValue(field))
      !partNumberIsEmpty &&
      !qtyIsEmpty &&
      !unitIsEmpty &&
      !descIsEmpty
    ) {
      setDisabledbtn(true)
      setLoading(true)
      const formValues = form.getFieldsValue()
      const reqObj = {
        indentDate: moment(indentDate).format('YYYY-MM-DD'),
        sbcCode: formValues.salecategory,
        empId: employeeId,
        seq: Tab?.seq || '1',
        tenantId: tenantid,
        expectedDeliveryDate: moment(expectindentDate).format('YYYY-MM-DD'),
        pkaId: formValues.KeyArea,
        pksaId: formValues.keysubarea,
        dtlList: updatedTableData,
        indentType: formValues.indentfor,
        projectId: commonProjectId || ProjectID,
        masterId: Tab?.mstId,
        docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
        pmId: Tab?.processCode || '8',
      }
      const response = await indentFileUpload({
        requestPath: 'insertIndentDtls',
        requestData: reqObj,
      })
      if (response) {
        if (response.responseCode === '200') {
          if (filesList.length > 0) {
            uploadFiles(0, response.responseDataMessage)
          } else {
            handleCancel()
            clearTable()
          }
          setDisabledbtn(false)
          message.success(response.responseMessage)
        } else {
          message.error(response.responseMessage)
          setDisabledbtn(false)
        }
      }
    } else if (!isErrorOccurred) {
      messageReturn(405)
    }

    setLoading(false)
    setDisabledbtn(false)
  }
  const uploadFiles = async (index, e) => {
    const reqObj = [
      {
        enquiryId,
        tenantId: tenantid,
        type: 'Projects',
        empId: employeeId,
        refId: referenceId,
        projectId: ProjectID || commonProjectId,
        stageCode: Tab?.stgCode || componentdata?.stgCode,
        indentDtlId: '',
        indentHdrId: e,
        docType: componentdata?.module === 'common' ? componentdata?.docType : 'DC018',
        uploadDocType: componentdata?.module === 'common' ? 'FC015' : 'FC015',
      },
    ]
    if (index < filesList.length) {
      const formData = new FormData()
      formData.append('insertDocRequest', JSON.stringify({ reqObj }))
      formData.append('file', filesList[index].originFileObj)
      try {
        const response = await indentFileUpload({
          requestPath: 'insertIndentFile',
          requestData: formData,
        })
        if (response) {
          if (response.responseCode === '200') {
            setFilesList(prevFilesList => {
              const updatedFilesList = prevFilesList.filter(
                files => files.name !== response.responseDataMessage,
              )
              return updatedFilesList
            })
            // message.success(response.responseDataMessage)
          } else {
            // message.error(response.responseDataMessage)
          }
          // if (response.responseCode === '409') {
          //   const closehere1 = store.get('closepopup')
          //   if (closehere1 === undefined || null) {
          //     store.set('closepopup', '1')
          //   }
          // }
          if (index === filesList.length - 1) {
            handleCancel()
            clearTable()
            // const closehere = store.get('closepopup')
            // if (closehere === '1') {
            //   store.remove('closepopup')
            // }
            // if (closehere === undefined || null) {
            //   handleCancel()
            //   clearTable()
            // }
          }
          uploadFiles(index + 1, e)
        }
      } catch (error) {
        uploadFiles(index + 1, e)
      }
    }
  }
  const handleRemove = file => {
    const index = filesList.indexOf(file)
    const newFileList = filesList.slice()
    newFileList.splice(index, 1)
    handleChange({ fileList: newFileList })
  }
  const handleDeleteRow = record => {
    const updatedTableData = tableData.filter(item => item.sno !== record.sno)
    setTableData(updatedTableData)
  }
  const highlightRow = record => {
    return record.duplicateRecord === '1' ? 'highlighted-row' : ''
  }
  // const handleremarks = (event, record) => {
  //   const updatedTableData = tableData.map(item => {
  //     if (item.sno === record.sno) {
  //       return {
  //         ...item,
  //         remarks: event.target.value,
  //       }
  //     }
  //     return item
  //   })
  //   setTableData(updatedTableData)
  // }

  const handleKeyPress = e => {
    if (!e || !e.charCode) {
      return
    }

    const charCode = e.charCode || e.keyCode
    const charStr = String.fromCharCode(charCode)

    // Prevent double quotes and single quotes
    if (charStr === '"' || charStr === "'" || charStr === '\\' || charStr === '/') {
      e.preventDefault()
    }
  }
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'sno',
      width: '3%',
      render: (text, record, index) => index + 1,
    },
    {
      title: (
        <span>
          {' '}
          Part Number<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`partNumber_${record.sno}`} initialValue={record.partNumber}>
          <Input maxLength={1023} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },

    {
      title: (
        <span>
          {' '}
          Description <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'desc',
      dataIndex: 'desc',
      width: '8%',
      render: (text, record) => (
        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          <Form.Item name={`desc_${record.sno}`} initialValue={record.desc}>
            <Input maxLength={2155} onKeyPress={handleKeyPress} />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`specification_${record.sno}`} initialValue={record.specification}>
          <Input maxLength={2000} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`weight_${record.sno}`} initialValue={record.weight}>
          <Input
            type="text"
            min="0"
            maxLength={9}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`material_${record.sno}`} initialValue={record.material}>
          <Input maxLength={2055} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`make_${record.sno}`} initialValue={record.make}>
          <Input maxLength={255} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Quantity <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'qty',
      dataIndex: 'qty',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`qty_${record.sno}`} initialValue={record.qty}>
          {/* <Input maxLength={11} onKeyPress={handleKeyPress} /> */}
          <Input
            type="text"
            min="0"
            maxLength={11}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Unit <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'unit',
      dataIndex: 'unit',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`unit_${record.sno}`} initialValue={record.unit}>
          <Input maxLength={7} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: <span> Remarks</span>,
      key: 'remarks',
      dataIndex: 'remarks',
      width: '8%',
      render: (text, record) => (
        <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
          <Input maxLength={250} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      width: '6%',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* <Popover
            title="Add Remarks"
            content={
              <Form form={tableform}>
                <Form.Item name={`remarks_${record.sno}`} initialValue={record.remarks}>
                  <Input.TextArea
                    placeholder="Enter remarks"
                    value={record.remarks}
                    onBlur={event => handleremarks(event, record)}
                    onKeyPress={handleKeyPress}
                  />
                </Form.Item>
              </Form>
            }
            trigger="click"
          > */}
          {/* <Button type="primary" icon={<MessageOutlined />} /> */}
          {/* </Popover> */}
          <RemoveIcon onClick={() => handleDeleteRow(record)} />
        </div>
      ),
    },
  ]

  const formatValue = input => {
    const numericValue = input.replace(/[^0-9.]/g, '').replace(/\.(?=.*\.)/g, '')
    return numericValue.replace(/^0+(\d)/, '$1')
  }

  const handlePaste = e => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text')
    const numericData = formatValue(pasteData)
    document.execCommand('insertText', false, numericData)
  }

  const columns2 = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'sno',
      width: '3%',
      render: () => '',
      // render: () => tableData.length > 0 ? tableData[tableData.length - 1].sno + 1 : 1,
    },
    {
      title: (
        <span>
          {' '}
          Part Number<strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="partNumber" initialValue={record.partNumber}>
          <AutoComplete
            options={productDetails}
            onChange={handleInputChange}
            onSelect={(value, option) => handleInputChange(value, option)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            <Input maxLength={1023} placeholder="Select here" onKeyPress={handleKeyPress} />
          </AutoComplete>
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Description <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'desc',
      dataIndex: 'desc',
      width: '8%',
      render: () => (
        <Form.Item name="desc">
          {/* <Tooltip position="top" title="inputText"> */}
          <Input maxLength={2155} onKeyPress={handleKeyPress} />
          {/* </Tooltip> */}
        </Form.Item>
      ),
    },
    {
      title: 'Specification',
      key: 'specification',
      dataIndex: 'specification',
      width: '8%',
      render: (text, record) => {
        return (
          <Form.Item name="specification" initialValue={record.specification}>
            {/* <Tooltip position="top" title="inputText"> */}
            <Input maxLength={2000} onKeyPress={handleKeyPress} />
            {/* </Tooltip> */}
          </Form.Item>
        )
      },
    },
    {
      title: 'Mass (Kgs)',
      key: 'weight',
      dataIndex: 'weight',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="weight" initialValue={record.weight}>
          <Input
            type="text"
            min="0"
            maxLength={9}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Material',
      key: 'material',
      dataIndex: 'material',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="material" initialValue={record.material}>
          <Input maxLength={2055} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Make',
      key: 'make',
      dataIndex: 'make',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="make" initialValue={record.make}>
          <Input maxLength={255} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Quantity <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'qty',
      dataIndex: 'qty',
      width: '8%',
      render: () => (
        // <Form.Item name="qty" initialValue={record.qty}>
        //   <Input />
        // </Form.Item>

        <Form.Item name="qty">
          <Input
            type="text"
            min="0"
            maxLength={11}
            pattern="[0-9]+([.][0-9]+)?"
            onKeyPress={e => {
              if (
                (!/[0-9]/.test(e.key) && !(e.key === '.' && e.target.value.indexOf('.') === -1)) ||
                (e.target.value.length === 0 && e.key === '-')
              ) {
                e.preventDefault()
              }
              handleKeyPress()
            }}
            onChange={e => {
              if (e.target.value === Number) {
                addnewform.setFieldsValue({
                  quantity: '',
                })
              }
              handleKeyPress()
            }}
            onPaste={handlePaste}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <span>
          {' '}
          Unit <strong style={{ color: 'red' }}>*</strong>
        </span>
      ),
      key: 'unit',
      dataIndex: 'unit',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="unit" initialValue={record.unit}>
          <Input maxLength={7} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: <span> Remarks</span>,
      key: 'remarks',
      dataIndex: 'remarks',
      width: '8%',
      render: (text, record) => (
        <Form.Item name="remarks" initialValue={record.remarks}>
          <Input maxLength={250} onKeyPress={handleKeyPress} />
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      key: 'remarks',
      dataIndex: 'remarks',
      width: '6%',
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* <Popover
            title="Add Remarks"
            content={
              <Form form={addnewform}>
                <Form.Item name="remarks">
                  <Input.TextArea placeholder="Enter remarks" onKeyPress={handleKeyPress} />
                </Form.Item>
              </Form>
            }
            trigger="click"
          > */}
          {/* <Button type="primary" icon={<MessageOutlined />} /> */}
          {/* </Popover> */}
          <AddIcon onClick={() => handleAddRow()} />
        </div>
      ),
    },
  ]

  const handleInputChange = (value, option) => {
    if (option?.data) {
      addnewform.setFieldsValue({
        unit: option?.data?.uomLongDescriprtion || '',
        partNumber: option?.data?.productCode || '',
        desc: option?.data?.productDesc || '',
      })
      // setSelectedProduct(option?.data)
    } else {
      // setSelectedProduct(null)
      value = null
    }
  }

  const handleAddRow = () => {
    const formvalues = addnewform.getFieldsValue()
    if (
      formvalues.partNumber &&
      formvalues.qty &&
      formvalues.unit &&
      formvalues.desc !== ('' && undefined)
    ) {
      const formValues2 = tableform.getFieldsValue()
      const updatedTableData = tableData.map(item => {
        return {
          ...item,
          partNumber: formValues2[`partNumber_${item.sno}`] || '',
          desc: formValues2[`desc_${item.sno}`] || '',
          specification: formValues2[`specification_${item.sno}`] || '',
          make: formValues2[`make_${item.sno}`] || '',
          weight: formValues2[`weight_${item.sno}`] || '',
          material: formValues2[`material_${item.sno}`] || '',
          qty: formValues2[`qty_${item.sno}`] || '',
          unit: formValues2[`unit_${item.sno}`] || '',
        }
      })
      const sno =
        updatedTableData.length > 0 ? updatedTableData[updatedTableData.length - 1].sno + 1 : 1
      const x = [...updatedTableData, { ...formvalues, sno }]
      setTableData(x)
      addnewform.resetFields()
    } else {
      messageReturn(405)
    }
  }

  const insertdata = [
    {
      sno: '',
      partNumber: '',
      desc: '',
      specification: '',
      make: '',
      weight: '',
      material: '',
      qty: '',
      unit: '',
      remarks: '',
    },
  ]
  const onFinish = () => {
    const updatedTableData = tableData.map(item => {
      return {
        ...item,
        remarks: form.getFieldValue(`remarks_${item.sno}`) || '',
      }
    })

    setTableData(updatedTableData)
  }

  const handleDownload = async () => {
    const response = await fetch(IntendSample)
    const blob = await response.blob()
    fileDownload(blob, 'IndentTemplate.xlsx')
  }

  const FieldsComponent = () => {
    return (
      <div className="row">
        <div className="form_indent">
          <Form form={form} layout="vertical" labelAlign="left">
            <div className="row form_datas">
              <div className="col-md-2">
                <Form.Item
                  name="indentfor"
                  label={
                    <span>
                      Indent For<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select placeholder="Select Indent For">
                    {indentForList?.map(item => (
                      <Option key={item.indentTypeCode} value={item.indentTypeCode}>
                        {item.indentTypeDesc}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  name="salecategory"
                  label={
                    <span>
                      Indent Type<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select placeholder="Select Indent Type">
                    {dataSaleCategory?.map(item => (
                      <Option key={item.keyCatCode} value={item.keyCatCode}>
                        {item.keyCategory}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  name="KeyArea"
                  label={
                    <span>
                      Station No.<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select placeholder="Select Station No." onChange={getKeusubareas}>
                    {dataKeyArea?.map(item => (
                      <Option value={item.pkaId}>
                        <Tooltip key={item.pkaId} title={`${item.keyName} (${item.code})`}>
                          {item.keyName} ({item.code})
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  name="keysubarea"
                  label={
                    <span>
                      Sub Assy.<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Select placeholder="Select Sub Assy.">
                    {dataKeySubArea?.map(item => (
                      <Option key={item.pkaId} value={item.pkaId}>
                        <Tooltip key={item.pkaId} title={`${item.keyName} (${item.code})`}>
                          {item.keyName} ({item.code})
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  name="Expected Delivery Date"
                  label={
                    <span>
                      Expected Delivery Date<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <DatePicker
                    value={expectindentDate}
                    defaultValue={expectindentDate}
                    disabledDate={d =>
                      !d || d.isBefore(moment(planStartDate)) || d.isAfter(moment(dueDateval))
                    }
                    format="DD-MMM-YYYY"
                    onChange={date => setExpectIndentDate(date || expectindentDate)}
                  />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  name="file"
                  label={
                    <span>
                      Choose File below 100MB<span style={{ color: 'red' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Upload
                    maxCount={1}
                    listType="text"
                    // onChange={onFileChange}
                    beforeUpload={beforeUpload1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload>
                </Form.Item>
              </div>
              {/* <div className="col-8" /> */}
              <div className="col-md-12" style={{ textAlign: 'right' }}>
                {singlefile ? (
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
                    <p style={{ margin: '0px' }}>
                      <b>Selected File : </b> {singlefile.name}
                    </p>
                    <p style={{ margin: '0px' }}>
                      <b>File Size : </b> {(singlefile.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </Form>

          <div className="col-12">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Buttons text="Download Template" type="primary" onClick={handleDownload} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <Buttons
                  text="Load"
                  type="primary"
                  disable={uploadbtndisable}
                  onClick={submitEcxel}
                />
                <Buttons text="Clear" type="primary" onClick={clearTable} />
              </div>
            </div>
          </div>
          <div className="custom_antd_Table">
            <Form form={tableform} onFinish={onFinish} initialValues={{ dtlList: tableData }}>
              <div>
                {tableData && tableData.length > 0 ? (
                  <Table
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 450 }}
                    sticky
                    rowClassName={highlightRow}
                    bordered
                  />
                ) : null}
                <Form form={addnewform} onFinish={onFinish} initialValues={{ dtlList: tableData }}>
                  <Table
                    columns={columns2}
                    dataSource={insertdata}
                    pagination={false}
                    showHeader={!(tableData.length > 0)}
                    style={{ marginTop: '-1px' }}
                    bordered
                  />
                </Form>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  const ButtonsComponent = () => {
    return (
      <div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            justifyContent: 'center',
            display: 'flex',
            gap: '12px',
          }}
        >
          <div style={{ width: '15rem' }}>
            <Upload
              onChange={handleChange}
              beforeUpload={beforeUpload}
              fileList={filesList}
              multiple
              showUploadList={false}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Product Drawing
              </Button>
              <span style={{ fontSize: '12px' }}>Choose Files below 100MB</span>
            </Upload>
          </div>
          <Buttons text="Submit" type="primary" onClick={handleSubmit} disable={disablebtn} />
          <Buttons
            text="Cancel"
            type="primary"
            onClick={() => {
              handleCancel()
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          {filesList.length > 0 && isloading === false && (
            <Space direction="vertical" style={{ marginTop: 16 }}>
              {filesList.map((file, index) => (
                <div key={file.uid} style={{ display: 'flex' }}>
                  <p className="mt-1">
                    {`${index + 1}) ${file.name}`} <b>{(file.size / (1024 * 1024)).toFixed(2)}MB</b>
                  </p>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(file)}
                  />
                </div>
              ))}
            </Space>
          )}
          {isloading ? (
            <Spin className="mt-3" size="large">
              <Space direction="vertical" style={{ marginTop: 16 }}>
                {filesList.map((file, index) => (
                  <div key={file.uid} style={{ display: 'flex' }}>
                    <p className="mt-1">{`${index + 1}) ${file.name}`}</p>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                    />
                  </div>
                ))}
              </Space>
            </Spin>
          ) : null}
        </div>
      </div>
    )
  }
  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      FieldsComponent={FieldsComponent}
      ButtonsComponent={ButtonsComponent}
      text={`Create Indent -${moment().format('DD-MMM-YYYY')}`}
      onCancel={handleCancel}
      maskClosable={false}
      width="90%"
    />
  )
}

export default Addindent
