/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import store from 'store'
import { Form, Card, message, Input, Skeleton, Tooltip, Button, Select, Upload } from 'antd'
import { CommentOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import QualityCaDtlService from 'services/Quality/QualityCaDtl'
import qtyCaupdate from 'services/Quality/QualityCaApproval'
import Popuptable from 'components/shared/PopuptableComponent'
import Buttons from 'components/shared/ButtonComponent'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import TableComponent from 'components/common/TableComponent'
import { useMediaQuery } from 'react-responsive'
import {
  addDocumentdetail,
  documentLIst,
} from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
// import RemoveIcon from 'components/shared/RemoveIconComponent'
// import IndentGroupgetDetails from 'services/common/IndentGroupService'
import currentDateTime from 'currentDateTime'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import InputComponent from '../../../../components/shared/InputComponent'

const QtyCaDetails = () => {
  const employeID = store.get('employeeId')
  const ProjectID = store.get('ProjectID')
  const tenantId = store.get('tenantId')
  const Tab = store.get('Tab')
  const enquiryId = store.get('EnquiryID')

  const { docTypeCode, processCode, mstId, stgCode } = Tab

  let defaultfilterData = {}
  const history = useHistory()
  if (history?.location?.state?.record?.refCode) {
    const splitText = history?.location?.state?.record?.refCode.split('-')
    defaultfilterData = {
      poCode: [splitText[0]],
    }
  }
  const [form] = Form.useForm()
  const [inputForm] = Form.useForm()
  const { Option } = Select
  const [isEditable, setIsEditable] = useState('')
  const disable = true
  const { TextArea } = Input
  const [onloadtable, setOnloadtable] = useState([])
  const [docStatusList, setDocStatusList] = useState([])
  const [filteredmaterial, setfilteredmaterial] = useState([])
  const [isDtlModal, setIsDtlModal] = useState(false)
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const [qcrestable, setQcrestable] = useState([])
  const [rmkDetaillist, setRmkDetaillist] = useState([])
  const [detailCard, setdetailCard] = useState(false)
  const [hdrcardloading, setHdrcardloading] = useState(true)
  const [reportdata, setReportdata] = useState([])
  const [filtersinfo] = useState(defaultfilterData)
  const [totalCount, settotalCount] = useState('0')
  const [totalCACount, settotalCACount] = useState('0')
  const [totalRJCount, settotalRJCount] = useState('0')
  const [totalRWCount, settotalRWCount] = useState('0')
  const [initialData, setinitialData] = useState({})
  const [drawingRefId, setDrawingRefId] = useState('')
  const [doctypedata, setDocTypeData] = useState([])
  const [filesList, setFilesList] = useState([])
  // const [masterPoc, setMasterPoc] = useState('')
  const [qinsId, setQinsId] = useState(undefined)

  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 50,
  // })

  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  useEffect(() => {
    getOnloadQtyCaDtl()
    getDoctDetails(qinsId)
    documentTypelist()
  }, [])

  const getOnloadQtyCaDtl = async () => {
    const props = {
      empId: employeID,
      pmHdrId: ProjectID,
      pmId: processCode,
      tenantId,
    }
    const httpget = await QualityCaDtlService({
      requestPath: 'getQiCaDtlsByPmHdrId',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      const updatedData = httpget.responseData.map((item, index) => {
        const data = {
          sno: index + 1,
          ...item,
        }
        return data
      })
      updatedData.sort((a, b) => {
        const getLastNumber = code => {
          const parts = code.split('/')
          return parseInt(parts[parts.length - 1], 10) || 0
        }
        return getLastNumber(a.poCode) - getLastNumber(b.poCode)
      })
      setOnloadtable(updatedData)
      setfilteredmaterial(updatedData)
      setIsDtlModal(false)
    } else {
      message.error(httpget.responseMessage)
    }
  }
  const openInsdetails = rec => {
    setIsDtlModal(true)
    form.setFieldsValue({
      projectcode: rec.productDescription,
      poCode: rec.poCode,
      qty: rec.qty,
      vendorName: rec.vendorName,
      raisedDate: rec.reqReceivedDatetime
        ? moment(rec.reqReceivedDatetime).format('DD-MMM-YYYY HH:mm')
        : '',
    })
    form.setFieldsValue({
      inspectionQty: rec.qty,
    })

    getQtyDtlsResponse(rec.qiCaDtlId)
    handleGetDetails(rec.qiId)
  }

  const documentTypelist = async () => {
    try {
      const requestData = {
        documentTypeCode: 'DC072',
        tenantId,
      }
      const response = await documentLIst({
        requestData,
      })
      if (response) {
        setDocTypeData(response.responseData)
      }
    } catch (error) {
      message.error(error)
    }
  }

  // const handleDeleteFile = async dmid => {
  //   const props = [
  //     {
  //       empId: employeID,
  //       tenantId,
  //       dmaId: dmid,
  //     },
  //   ]
  //   const httpDeleteFile = await IndentGroupgetDetails({
  //     requestPath: 'deleteUploadDocument',
  //     requestData: props,
  //   })
  //   if (httpDeleteFile.responseCode === '200') {
  //     message.success(httpDeleteFile.responseMessage)
  //     setReportdata(prev => prev.filter(doc => doc.dmId !== dmid))
  //   } else {
  //     message.error(httpDeleteFile.responseMessage)
  //   }
  // }

  const handleUploadChange = info => {
    const newFileList = info.fileList.slice(-1)
    setFilesList(newFileList)
  }
  const handletaskfileupload = async () => {
    const formvalue = inputForm.getFieldsValue()
    if (filesList.length === 0 || formvalue.documentType === undefined) {
      messageReturn(644)
      return
    }

    try {
      const file = filesList[0]
      const reqObj = [
        {
          enquiryId,
          tenantId,
          documentType: 'DC072',
          uploadDocType: formvalue.documentType,
          remarks: '',
          empId: employeID,
          refId: qinsId,
          ProjectID,
          stageCode: stgCode,
          documentName: 'QC Inspection',
          type: 'Projects',
          pmId: processCode,
        },
      ]

      const formData = new FormData()
      formData.append('addDocument', JSON.stringify({ reqObj }))
      formData.append('file', file.originFileObj)

      const response = await addDocumentdetail({ requestData: formData })

      if (response.responseCode === '200') {
        message.success(`File ${file.name} uploaded successfully`)
        getDoctDetails(qinsId)
        setFilesList([])
      } else {
        messageReturn(null, `Failed to upload file ${file.name}`)
      }
    } catch (error) {
      messageReturn(610)
    }
  }
  const handleGetDetails = async id => {
    // const formData = form.getFieldsValue()
    const props = {
      tenantId,
      empId: employeID,
      qiId: id,
      qicName: 'config 1',
    }
    setQinsId(id)
    getDoctDetails(id)
    const httpget = await QualityCaDtlService({
      requestPath: 'getInspHdrAndDtl',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      if (httpget?.responseData?.length > 0) {
        // setIsEditable(httpget?.responseData?.[0]?.isEditable)
        // setQcrestable(httpget?.responseData)
        if (form && httpget?.responseData) {
          const initialValues = {}

          httpget.responseData.forEach(record => {
            initialValues.totalrejectedInternalrmk = record.rejectIntRemarks
            initialValues.totalrejectedExternalrmk = record.rejectExtRemarks
            initialValues.totalrejectedInternal = parseInt(record.totalRejcInt || 0, 10)
            initialValues.totalrejectedExternal = parseInt(record.totalRejcExt || 0, 10)
            initialValues.totalreworkInternalrmk = record.reworkIntRemarks
            initialValues.totalreworkExternalrmk = record.reworkVenRemarks
            initialValues.totalreworkInternal = parseInt(record.totalReworkInt || 0, 10)
            initialValues.totalreworkExternal = parseInt(record.totalReworkVen || 0, 10)
            initialValues.okquantity = parseInt(record.totalOkQty || 0, 10)
            initialValues.nokquantity = parseInt(record.totalNokQty || 0, 10)
            initialValues.nokquantityrmk = record.nokRemarks
            initialValues.okquantityrmk = record.okRemarks
            initialValues.remarks = record.nokRemarks
            // Add other fields as needed
          })
          setinitialData(initialValues)
          form.setFieldsValue(initialValues)
        }
      }
    }
  }
  const getQtyDtlsResponse = async dtlid => {
    setHdrcardloading(true)
    const props = {
      qiCaDtlId: dtlid,
      tenantId,
      pmId: processCode,
      empId: employeID,
    }
    const httpgetQtyDtl = await QualityCaDtlService({
      requestPath: 'getQiCaDtlsByQiCaDtlId',
      requestData: props,
    })

    if (httpgetQtyDtl.responseCode === '200') {
      setQcrestable(httpgetQtyDtl?.responseData)
      setIsEditable(httpgetQtyDtl?.responseData?.[0]?.isEditable)
      setDocStatusList(httpgetQtyDtl?.responseData?.[0]?.docLifeCycleMstList)
      setDrawingRefId(httpgetQtyDtl?.responseData?.[0]?.dmId)
      // setMasterPoc(httpgetQtyDtl?.responseData?.[0]?.masterPoc)
      setHdrcardloading(false)
      if (form && httpgetQtyDtl?.responseData) {
        form.setFieldsValue({
          caInternal: httpgetQtyDtl?.responseData?.[0].caInternal,
          caVendor: httpgetQtyDtl?.responseData?.[0].caVendor,
          reworkInternal: httpgetQtyDtl?.responseData?.[0].reworkInternal,
          reworkVendor: httpgetQtyDtl?.responseData?.[0].reworkVendor,
          rejectedInternal: httpgetQtyDtl?.responseData?.[0].rejectedInternal,
          rejectedExternal: httpgetQtyDtl?.responseData?.[0].rejectedExternal,
        })
      }
    } else {
      setHdrcardloading(false)
    }
  }

  const getRemarkslog = async () => {
    const props = {
      refId: qcrestable && qcrestable?.[0]?.qiCaDtlId,
      // refDoc: `CA ${qcrestable && qcrestable?.[0]?.caType}`,
      refDoc: 'CA',
      tenantId,
    }
    const httprmk = await QualityCaDtlService({
      requestPath: 'getQIStatusDtls',
      requestData: props,
    })
    if (httprmk.responseCode === '200') {
      setRmkDetaillist(httprmk.responseData)
    } else {
      message.error(httprmk.responseMessage)
    }
  }

  const handleInspectionResult = fieldname => {
    const formData = form.getFieldsValue()
    const newValue = formData[fieldname].replace(/[^0-9.]/g, '')
    form.setFieldsValue({
      [`${fieldname}`]: newValue,
    })
    const insQty = formData.inspectionQty === '' ? 0 : parseInt(formData.inspectionQty, 10)
    const caInternal = formData.caInternal === '' ? 0 : parseInt(formData.caInternal, 10)
    const caVendor = formData.caVendor === '' ? 0 : parseInt(formData.caVendor, 10)
    const reworkInternal =
      formData.reworkInternal === '' ? 0 : parseInt(formData.reworkInternal, 10)
    const reworkVendor = formData.reworkVendor === '' ? 0 : parseInt(formData.reworkVendor, 10)
    const rejectedInternal =
      formData.rejectedInternal === '' ? 0 : parseInt(formData.rejectedInternal, 10)
    const rejectedExternal =
      formData.rejectedExternal === '' ? 0 : parseInt(formData.rejectedExternal, 10)

    const sum =
      caInternal + caVendor + reworkInternal + reworkVendor + rejectedInternal + rejectedExternal

    if (sum > insQty) {
      form.setFieldsValue({
        [`${fieldname}`]: 0,
      })
      messageReturn(640)
    }
  }

  const qcrescolumns = [
    {
      title: 'No of Items offered for Inspection',
      dataIndex: 'inspectionQty',
      key: 'inspectionQty',
      render: text => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item style={{ marginTop: '20px' }} name="inspectionQty">
            <Input
              type="text"
              value={text ? parseFloat(text).toLocaleString('en-IN') : ''}
              readOnly
            />
          </Form.Item>
        </Form>
      ),
    },

    {
      title: (
        <>
          <span>Conditionally Accepted - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'caInternal',
      key: 'caInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="caInternal"
            initialValue={
              record.caInternal ? parseFloat(record.caInternal).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={record.caInternal ? parseFloat(record.caInternal).toLocaleString('en-IN') : ''}
              onChange={() => handleInspectionResult('caInternal')}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Conditionally Accepted - Due to Supplier Mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'caVendor',
      key: 'caVendor',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="caVendor"
            initialValue={
              record.caVendor ? parseFloat(record.caVendor).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={record.caVendor ? parseFloat(record.caVendor).toLocaleString('en-IN') : ''}
              onChange={() => handleInspectionResult('caVendor')}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rework - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'reworkInternal',
      key: 'reworkInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="reworkInternal"
            initialValue={
              record.reworkInternal ? parseFloat(record.reworkInternal).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={
                record.reworkInternal
                  ? parseFloat(record.reworkInternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('reworkInternal')}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rework - Due to Supplier Mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'reworkVendor',
      key: 'reworkVendor',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="reworkVendor"
            initialValue={
              record.reworkVendor ? parseFloat(record.reworkVendor).toLocaleString('en-IN') : ''
            }
          >
            <Input
              type="text"
              value={
                record.reworkVendor ? parseFloat(record.reworkVendor).toLocaleString('en-IN') : ''
              }
              onChange={() => handleInspectionResult('reworkVendor')}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rejected - Due to Internal Input Error </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'rejectedInternal',
      key: 'rejectedInternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="rejectedInternal"
            initialValue={
              record.rejectedInternal
                ? parseFloat(record.rejectedInternal).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              type="text"
              value={
                record.rejectedInternal
                  ? parseFloat(record.rejectedInternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('rejectedInternal')}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <>
          <span>Rejected - Due to supplier mistake </span>
          <span style={{ color: 'red' }}>*</span>
        </>
      ),
      dataIndex: 'rejectedExternal',
      key: 'rejectedExternal',
      render: (text, record) => (
        <Form form={form} disabled={isEditable === '0'}>
          <Form.Item
            style={{ marginTop: '20px' }}
            name="rejectedExternal"
            initialValue={
              record.rejectedExternal
                ? parseFloat(record.rejectedExternal).toLocaleString('en-IN')
                : ''
            }
          >
            <Input
              type="text"
              value={
                record.rejectedExternal
                  ? parseFloat(record.rejectedExternal).toLocaleString('en-IN')
                  : ''
              }
              onChange={() => handleInspectionResult('rejectedExternal')}
            />
          </Form.Item>
        </Form>
      ),
    },
  ]

  // const handleChange = (pagination, filters) => {
  //   setfilterinfo(filters)
  // }
  const vendorname1 = []
  const reqReceivedDatetime1 = []
  const pocode1 = []
  const CurrentStatus1 = []

  onloadtable.map(h => {
    return vendorname1.push(h.vendorName)
  })
  onloadtable.map(h => {
    return reqReceivedDatetime1.push(h.reqReceivedDatetime)
  })
  onloadtable.map(h => {
    return pocode1.push(h.poCode)
  })
  onloadtable.map(h => {
    return CurrentStatus1.push(h.documentStatusTypeDescription)
  })
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const vendoename2 = vendorname1.filter(distinct)
  const pocode2 = pocode1.filter(distinct)
  const CurrentStatus2 = CurrentStatus1.filter(distinct)
  const reqReceivedDatetime2 = reqReceivedDatetime1
    .map(date => moment(date).format('YYYY-MM-DD'))
    .filter(distinct)
    .sort((a, b) => moment(a).valueOf() - moment(b).valueOf())

  const vendorname3 = []
  const reqReceivedDatetime3 = []
  const pocode3 = []
  const CurrentStatus3 = []

  vendoename2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return vendorname3.push({
        text: element,
        value: element,
      })
    })

  reqReceivedDatetime2
    .slice()
    .sort((a, b) => new Date(a) - new Date(b)) // sort by date ascending
    .map(element => {
      return reqReceivedDatetime3.push({
        text: moment(element).format('DD-MMM-YYYY'),
        value: element,
      })
    })

  pocode2
    .sort((a, b) => {
      const lastA = parseInt(a.split('/').pop(), 10)
      const lastB = parseInt(b.split('/').pop(), 10)
      return lastA - lastB
    })
    .forEach(element => {
      pocode3.push({
        text: element,
        value: element,
      })
    })

  CurrentStatus2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return CurrentStatus3.push({
        text: element,
        value: element,
      })
    })

  const onloadcolumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 65,
    },
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: pocode3,
      filteredValue: filtersinfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendorname3,
      filteredValue: filtersinfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Description',
      dataIndex: 'productDescription',
      key: 'productDescription',
      width: '250px',
    },
    // {
    //   title: 'UOM',
    //   dataIndex: 'uomShortDescription',
    //   key: 'uomShortDescription',
    // },
    {
      title: 'Concession Raised Date',
      dataIndex: 'reqReceivedDatetime',
      key: 'reqReceivedDatetime',
      render: (text, record) => (
        <span>
          {record.reqReceivedDatetime
            ? moment(record.reqReceivedDatetime).format('DD-MMM-YYYY')
            : ''}
        </span>
      ),
      filters: reqReceivedDatetime3,
      filteredValue: filtersinfo.reqReceivedDatetime,
      onFilter: (value, record) =>
        moment(record.reqReceivedDatetime).format('YYYY-MM-DD') === value,
    },
    {
      title: 'Concession Raised Qty.',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
    },
    {
      title: 'Conditional Ok',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        return <span>{parseInt(record.caInternal, 10) + parseInt(record.caVendor, 10)}</span>
      },
    },
    {
      title: 'Rework',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        return <span>{Number(record.reworkInternal) + Number(record.reworkVendor)}</span>
      },
    },
    {
      title: 'Rejected',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: (text, record) => {
        return (
          <span>
            {parseInt(record.rejectedInternal, 10) + parseInt(record.rejectedExternal, 10)}
          </span>
        )
      },
    },

    {
      title: 'Current Status',
      dataIndex: 'documentStatusTypeDescription',
      key: 'documentStatusTypeDescription',
      filters: CurrentStatus3,
      filteredValue: filtersinfo.documentStatusTypeDescription,
      onFilter: (value, record) => record?.documentStatusTypeDescription === value,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record, index) => (
        <ButtonComponent
          type="primary"
          text="Details"
          onClick={() => openInsdetails(record, index)}
        />
      ),
    },
  ]

  const remarksColumns = [
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Status Description',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: (text, record) => moment(record.updatedOn).format('DD-MMM-YYYY HH:mm'),
    },
  ]

  const handleinsert = async () => {
    let insertcheck = false

    const formData = form.getFieldValue()

    const caVendor = formData.caVendor === '' ? 0 : parseInt(formData.caVendor, 10)
    const caInternal = formData.caInternal === '' ? 0 : parseInt(formData.caInternal, 10)
    const reworkInternalval =
      formData.reworkInternal === '' ? 0 : parseInt(formData.reworkInternal, 10)
    const reworkVendorval = formData.reworkVendor === '' ? 0 : parseInt(formData.reworkVendor, 10)
    const rejectedInternalval =
      formData.rejectedInternal === '' ? 0 : parseInt(formData.rejectedInternal, 10)
    const rejectedExternalval =
      formData.rejectedExternal === '' ? 0 : parseInt(formData.rejectedExternal, 10)

    const props = {
      // caQty: caQtyval,
      caVendor,
      caInternal,
      reworkInternal: reworkInternalval,
      reworkVendor: reworkVendorval,
      rejectedInternal: rejectedInternalval,
      rejectedExternal: rejectedExternalval,
      qiCaDtlId: (qcrestable && qcrestable?.[0]?.qiCaDtlId) || '',
      pmId: processCode,
      mstId,
      docTypeCode,
      pmHdrId: ProjectID,
      tenantId,
      enquiryId,
      remarks: formData.remarks,
    }
    const insQty = formData.inspectionQty
    const sum =
      caInternal +
      caVendor +
      reworkInternalval +
      reworkVendorval +
      rejectedInternalval +
      rejectedExternalval
    if (formData.remarks) {
      if (insQty === sum) {
        const httpinsert = await QualityCaDtlService({
          requestPath: 'updateQiCaDtls',
          requestData: props,
        })

        if (httpinsert.responseCode === '200') {
          message.success(httpinsert.responseMessage)
          getOnloadQtyCaDtl()
          setIsDtlModal(false)
          insertcheck = true
        } else {
          message.error(httpinsert.responseMessage)
        }
      } else {
        messageReturn(641)
      }
    } else {
      messageReturn(405)
    }
    return insertcheck
  }

  function openAppRemarks() {
    setApproveRemarksCard(true)
    setRejectRemarksCard(false)
  }
  function openRejectRemarksVal() {
    setRejectRemarksCard(true)
    setApproveRemarksCard(false)
  }
  const handleCloseDtlModal = () => {
    setIsDtlModal(false)
    setReportdata([])
    setRejectRemarksCard(false)
    setApproveRemarksCard(false)
  }

  const handleApprove = async seq => {
    // const formValues = form.getFieldsValue()
    setApproveRemarksCard(false)
    setRejectRemarksCard(false)
    const formvalue = inputForm.getFieldValue()
    const formData = form.getFieldValue()

    // const caQtyval = formData.caQty === '' ? 0 : parseInt(formData.caQty, 10)
    const caVendor = formData.caVendor === '' ? 0 : parseInt(formData.caVendor, 10)
    const caInternal = formData.caInternal === '' ? 0 : parseInt(formData.caInternal, 10)
    const reworkInternalval =
      formData.reworkInternal === '' ? 0 : parseInt(formData.reworkInternal, 10)
    const reworkVendorval = formData.reworkVendor === '' ? 0 : parseInt(formData.reworkVendor, 10)
    const rejectedInternalval =
      formData.rejectedInternal === '' ? 0 : parseInt(formData.rejectedInternal, 10)
    const rejectedExternalval =
      formData.rejectedExternal === '' ? 0 : parseInt(formData.rejectedExternal, 10)

    const insQty = formData.inspectionQty
    const sum =
      caVendor +
      caInternal +
      reworkInternalval +
      reworkVendorval +
      rejectedInternalval +
      rejectedExternalval

    const handleInsertResult = await handleinsert()
    if (handleInsertResult) {
      if (insQty === sum) {
        const keyareaobj = {
          tenantId,
          hdrId: (qcrestable && qcrestable?.[0]?.qiCaDtlId) || '',
          currentseq: seq,
          empId: employeID,
          remarks: formvalue.remarks,
          pmId: processCode,
          mstId,
          docTypeCode,
          pmHdrId: ProjectID,
          enquiryId,
        }

        if (formvalue.remarks) {
          const response = await qtyCaupdate({
            requestPath: 'updateQiCaSeqAndStatus',
            requestData: keyareaobj,
          })
          if (response.responseCode === '200') {
            inputForm.resetFields()
            setApproveRemarksCard(false)
            getOnloadQtyCaDtl()
            handleCloseDtlModal()
          } else {
            messageReturn(607)
          }
        } else {
          messageReturn(641)
        }
      } else {
        messageReturn(405)
      }
    }
  }

  const handleReject = async seq => {
    // const formValues = form.getFieldsValue()
    const formvalue = inputForm.getFieldValue()

    // const formData = form.getFieldValue()

    // const caQtyval = formData.caQty === '' ? 0 : parseInt(formData.caQty, 10)
    // const caVendor = formData.caVendor === '' ? 0 : parseInt(formData.caVendor, 10)
    // const caInternal = formData.caInternal === '' ? 0 : parseInt(formData.caInternal, 10)
    // const reworkInternalval =
    //   formData.reworkInternal === '' ? 0 : parseInt(formData.reworkInternal, 10)
    // const reworkVendorval = formData.reworkVendor === '' ? 0 : parseInt(formData.reworkVendor, 10)
    // const rejectedInternalval =
    //   formData.rejectedInternal === '' ? 0 : parseInt(formData.rejectedInternal, 10)
    // const rejectedExternalval =
    //   formData.rejectedExternal === '' ? 0 : parseInt(formData.rejectedExternal, 10)

    // const insQty = formData.inspectionQty
    // const sum =
    //   caVendor +
    //   caInternal +
    //   reworkInternalval +
    //   reworkVendorval +
    //   rejectedInternalval +
    //   rejectedExternalval
    //   if (insQty === sum) {

    const keyareaobj = {
      tenantId,
      hdrId: (qcrestable && qcrestable?.[0]?.qiCaDtlId) || '',
      currentseq: seq,
      empId: employeID,
      remarks: formvalue.remarks,
    }
    const handleInsertResult = await handleinsert()
    if (handleInsertResult) {
      if (formvalue.remarks) {
        const response = await qtyCaupdate({
          requestPath: 'updateQiCaSeqAndStatus',
          requestData: keyareaobj,
        })
        if (response.responseCode === '200') {
          inputForm.resetFields()
          getOnloadQtyCaDtl()
          handleCloseDtlModal()
          setRejectRemarksCard(false)
        } else {
          messageReturn(607)
        }
      } else {
        messageReturn(405)
      }
    }

    // } else{
    //
    // }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
    },
    {
      title: 'Document Type ',
      dataIndex: 'uploadDocument',
      key: 'uploadDocument',
    },
    // {
    //   title: 'Doc ID',
    //   dataIndex: 'dmId',
    //   key: 'dmId',
    // },
    // {
    //   title:  'Remarks',
    //   key: 'remarks',
    //   dataIndex: 'remarks',
    //   render: (text, record) => {
    //     return  (
    //       <span>{record.remarks}</span>
    //     )
    //   },
    // },
    {
      title: 'Uploaded On',
      key: 'createdDate',
      dataIndex: 'createdDate',
      render: (text, record) => moment(record.createdDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'Uploaded By',
      key: 'createdBy',
      dataIndex: 'createdBy',
    },
    {
      title: 'Action',
      key: 'Apprveaction',
      dataIndex: 'Apprveaction',
      align: 'center',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <DownloadDocuments
              refid={record.dmId}
              tenanrId={tenantId}
              fileDocode={record.uploadDocType}
              docTypeCode={record.document}
              isPdf={record.isPdf}
            />
            {/* {masterPoc === '1' ? (
              <RemoveIcon onClick={() => handleDeleteFile(record.dmId)} />
            ) : null} */}
          </div>
        )
      },
    },
  ]

  const OpenDetailCard = () => {
    setdetailCard(true)
    getRemarkslog()
  }

  const getDoctDetails = async id => {
    const props = {
      enqId: enquiryId,
      stgCode: 'STG042',
      docTypeCode: 'DC072',
      tenantId,
      uploadDocType: '',
      refId: id,
      pmHdrId: ProjectID,
    }
    const httpgetDoc = await qtyCaupdate({
      requestPath: 'getqtyInspecDocDtl',
      requestData: props,
    })

    if (httpgetDoc.responseCode === '200') {
      setReportdata(httpgetDoc.responseData)
    }
  }

  const DtlComponent = () => {
    const AddRemarksComponent = seq => {
      return (
        <div>
          <Card bordered={false} className="custom-card">
            <div>
              <div>
                <h5>Add Remarks</h5>
                <Form form={inputForm}>
                  <Form.Item name="remarks">
                    <TextArea rows={4} />
                  </Form.Item>
                </Form>
                <center style={{ marginTop: '10px' }}>
                  <Buttons type="primary" text="Save" onClick={() => handleApprove(seq)} />
                </center>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    const RejectRemarksComponent = seq => {
      return (
        <div>
          <Card bordered={false} className="custom-card">
            <div>
              <div>
                <h5>Add Remarks</h5>
                <Form form={inputForm}>
                  <Form.Item name="remarks">
                    <TextArea rows={4} />
                  </Form.Item>
                </Form>{' '}
                <center style={{ marginTop: '10px' }}>
                  <Buttons type="primary" text="Save" onClick={() => handleReject(seq)} />
                </center>
              </div>
            </div>
          </Card>
        </div>
      )
    }
    return (
      <div>
        <div>
          <Skeleton loading={hdrcardloading} active>
            <div>
              <Form form={form} layout="vertical" labelAlign="left">
                {/* <div className="row form_datas">
                  <div className="col-md-2">
                    <Form.Item name="vendorName" label={<span>Vendor Name</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item name="poCode" label={<span>PO number</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item name="projectcode" label={<span>Description</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>

                  <div className="col-md-2">
                    <Form.Item name="qty" label={<span>Conditionally Accepted Qty</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item
                      name="remarks"
                      label={
                        <span>
                          Remarks<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                    >
                      <InputComponent type="text" disabled />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <Form.Item name="raisedDate" label={<span>Concession Raised Date</span>}>
                          <InputComponent type="text" disabled />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                      <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                        Drawing Detail:
                      </p>
                      <p style={{ marginBottom: '0', pointerEvents: 'auto', opacity: 1 }}>
                        <DownloadDocuments
                          refid="4590"
                          tenanrId={tenantId}
                          fileDocode="FC015"
                          docTypeCode="DC018"
                        />
                      </p>
                    </div>
                  </div>

                </div> */}
                <div className="row form_datas">
                  <div className="col-md-2">
                    <Form.Item name="vendorName" label={<span>Vendor Name</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item name="poCode" label={<span>PO number</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item name="projectcode" label={<span>Description</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item name="qty" label={<span>Conditionally Accepted Qty</span>}>
                      <InputComponent type="text" disabled={disable} />
                    </Form.Item>
                  </div>
                  <div className="col-md-2">
                    <Form.Item
                      name="remarks"
                      label={
                        <span>
                          Remarks<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                    >
                      <InputComponent type="text" disabled />
                    </Form.Item>
                  </div>
                  <div className="col-md-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Form.Item name="raisedDate" label={<span>Concession Raised Date</span>}>
                        <InputComponent type="text" disabled />
                      </Form.Item>
                      {reportdata && reportdata?.[0]?.dmId !== 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: '5px',
                          }}
                        >
                          <p style={{ marginRight: '10px', fontWeight: 'bold', marginBottom: '0' }}>
                            Drawing Detail:
                          </p>
                          <p style={{ marginBottom: '0', pointerEvents: 'auto', opacity: 1 }}>
                            <DownloadDocuments
                              refid={drawingRefId}
                              tenanrId={tenantId}
                              fileDocode="FC015"
                              docTypeCode="DC018"
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <div style={{ marginTop: '15px' }}>
              <Table dataSource={qcrestable} columns={qcrescolumns} pagination={false} />
            </div>
            <div style={{ display: isDtlModal ? 'block' : 'none', marginTop: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <h5>Overall Inspection Result:</h5>
              </div>

              <table
                style={{
                  width: '25%',
                  margin: 'auto',
                  marginBottom: '10px',
                  border: '1px solid black',
                  borderCollapse: 'collapse',
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      OK
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="okquantity">
                          <Input
                            type="text"
                            // onChange={() => handleInspectionResult('okquantity')}
                            disabled
                          />
                        </Form.Item>
                      </Form>
                    </td>

                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.okquantityrmk}>
                          <Form.Item style={{ marginBottom: '0px' }} name="okquantityrmk">
                            <Input type="text" placeholder="Ok Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      Not OK
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="nokquantity">
                          <Input
                            type="text"
                            // onChange={() => handleInspectionResult('nokquantity')}
                            disabled
                          />
                        </Form.Item>
                      </Form>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.nokquantityrmk}>
                          <Form.Item style={{ marginBottom: '0px' }} name="nokquantityrmk">
                            <Input type="text" placeholder="Nok Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      Rejected (Internal)
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedInternal">
                          <Input
                            type="text"
                            // onChange={() => handleInspectionResult('totalrejectedInternal')}
                          />
                        </Form.Item>
                      </Form>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.totalrejectedInternalrmk}>
                          <Form.Item
                            style={{ marginBottom: '0px' }}
                            name="totalrejectedInternalrmk"
                          >
                            <Input type="text" placeholder="Rejected Internal Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      Rejected (External)
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalrejectedExternal">
                          <Input
                            type="text"
                            // onChange={() => handleInspectionResult('totalrejectedExternal')}
                          />
                        </Form.Item>
                      </Form>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.totalrejectedExternalrmk}>
                          <Form.Item
                            style={{ marginBottom: '0px' }}
                            name="totalrejectedExternalrmk"
                          >
                            <Input type="text" placeholder="Rejected External Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      Rework (Internal)
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalreworkInternal">
                          <Input
                            type="text"
                            onChange={() => handleInspectionResult('totalreworkInternal')}
                          />
                        </Form.Item>
                      </Form>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.totalreworkInternalrmk}>
                          <Form.Item style={{ marginBottom: '0px' }} name="totalreworkInternalrmk">
                            <Input type="text" placeholder="Rejected Rewrok Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', fontWeight: 'bold', padding: '8px' }}>
                      Rework (External)
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Form.Item style={{ marginBottom: '0px' }} name="totalreworkExternal">
                          <Input
                            type="text"
                            onChange={() => handleInspectionResult('totalreworkExternal')}
                          />
                        </Form.Item>
                      </Form>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <Form form={form} disabled>
                        <Tooltip title={initialData?.totalreworkExternalrmk}>
                          <Form.Item style={{ marginBottom: '0px' }} name="totalreworkExternalrmk">
                            <Input type="text" placeholder="Rejected Rework Remakrs.." />
                          </Form.Item>
                        </Tooltip>
                      </Form>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '10px' }} className="custom_antd_Table">
              <TableComponent columns={columns} data={reportdata} scrollY={500} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h6 style={{ marginBottom: '0px', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold' }}> Current Status : </span>{' '}
                {qcrestable && qcrestable?.[0]?.documentStatusTypeDescription}
              </h6>
            </div>
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
                gap: '10px',
              }}
            >
              <Form form={inputForm}>
                <Form.Item
                  name="documentType"
                  rules={[{ required: true, message: 'Please select Document Type!' }]}
                >
                  <Select placeholder="Select Doc Type">
                    {doctypedata.map(item => (
                      <Option key={item.fuCode} value={item.fuCode}>
                        {item.description}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>

              <div style={{ width: '135px' }}>
                <Upload
                  onChange={handleUploadChange}
                  fileList={filesList}
                  beforeUpload={false}
                  showUploadList={false}
                >
                  <Button type="primary" size="medium" icon={<UploadOutlined />}>
                    Select Files
                  </Button>
                </Upload>
                {filesList.length > 0 && (
                  <div>
                    <p>Selected Files:</p>
                    <ul>
                      {filesList.map(file => (
                        <li key={file}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <ButtonComponent
                type="primary"
                text="Upload"
                onClick={() => {
                  handletaskfileupload()
                }}
              />

              {docStatusList && docStatusList.length > 0 ? (
                <ButtonComponent
                  text={docStatusList[0].docStatusDesc}
                  type="primary"
                  marginright="10px"
                  onClick={() => openAppRemarks()}
                />
              ) : null}
              <Popuptable
                onClose={() => setApproveRemarksCard(false)}
                cardLabel=""
                component={AddRemarksComponent(
                  docStatusList && docStatusList.length > 0 ? docStatusList[0].currSequence : '',
                )}
                visible={approveRemarksCard && isDtlModal}
              />
              <ButtonComponent
                type="primary"
                icon={<CommentOutlined />}
                marginright="10px"
                onClick={() => {
                  OpenDetailCard()
                }}
              />
              <Popuptable
                onClose={() => setdetailCard(false)}
                cardLabel=""
                component={
                  <div
                    className="custom_antd_Table"
                    style={{ width: isMobile ? '280px' : '500px' }}
                  >
                    {' '}
                    <TableComponent data={rmkDetaillist} columns={remarksColumns} scrollY={500} />
                  </div>
                }
                visible={detailCard}
              />
              <div style={{ display: isEditable === '0' ? 'none' : 'inline' }}>
                <ButtonComponent text="Save" type="primary" onClick={() => handleinsert()} />
              </div>
              <Popuptable
                onClose={() => setRejectRemarksCard(false)}
                cardLabel=""
                component={RejectRemarksComponent(
                  docStatusList && docStatusList.length > 0 ? docStatusList[0].previousSeq : '',
                )}
                visible={rejectRemarksCard && isDtlModal}
              />
              {docStatusList && docStatusList.length > 0 && docStatusList[0].cancelSeq ? (
                <ButtonComponent
                  text={docStatusList[0].cancelStatusDesc}
                  type="danger"
                  marginright="10px"
                  onClick={() => openRejectRemarksVal()}
                />
              ) : null}
            </div>
          </Skeleton>
        </div>
      </div>
    )
  }
  // const handlePageChange = (page, filters) => {
  //   setfilterinfo(filters)
  //   setPagination(prevPagination => ({
  //     ...prevPagination,
  //     current: page,
  //   }))
  // }

  useEffect(() => {
    const total = onloadtable?.reduce((sum, item) => sum + parseInt(item.qty, 10), 0)
    const totalca = onloadtable?.reduce(
      (sum, item) => sum + (parseInt(item.caVendor, 10) + parseInt(item.caInternal, 10)),
      0,
    )
    const totalrj = onloadtable?.reduce(
      (sum, item) =>
        sum + (parseInt(item.rejectedExternal, 10) + parseInt(item.rejectedInternal, 10)),
      0,
    )
    const totalrw = onloadtable?.reduce(
      (sum, item) => sum + (parseInt(item.reworkInternal, 10) + parseInt(item.reworkVendor, 10)),
      0,
    )
    settotalCount(total)
    settotalCACount(totalca)
    settotalRJCount(totalrj)
    settotalRWCount(totalrw)
  }, [onloadtable])

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
      setOnloadtable(filtered)
    }, 300),
    [filteredmaterial],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }

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
    const cleanedData = cleanupDataSource(onloadtable)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Concession Note_${currentDateTime}.csv`)
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
        'PO Number': escapeValue(row.poCode),
        'Vendor Name': escapeValue(row.vendorName),
        'Part Number': escapeValue(row.productCode),
        Description: escapeValue(row.productDescription),
        'Concession Raised Date': escapeValue(
          moment(row.reqReceivedDatetime).format('DD-MMM-YYYY HH:mm'),
        ),
        'Concession Raised Qty.': escapeValue(row.qty),
        'Conditional Ok': escapeValue(row.caInternal + row.caVendor),
        Rework: escapeValue(row.reworkInternal + row.reworkVendor),
        Rejected: escapeValue(row.rejectedInternal + row.rejectedExternal),
        'Current Status': escapeValue(row.documentStatusTypeDescription),
      }
    })
  }
  return (
    <div>
      <h5>Concession Note</h5>
      <div>
        {/* <TableComponent
          data={onloadtable}
          columns={onloadcolumns}
          onChange={handleChange}
          scrollY={400}
        /> */}
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={handleExportCSV}
          style={{ marginTop: '10px' }}
        >
          Export to CSV
        </Button>

        <Input.Search
          style={{
            margin: '0 0 10px 0',
            width: isMobile ? '100%' : '30%',
            float: 'right',
            paddingTop: '5px',
          }}
          placeholder="Search here..."
          enterButton
          onChange={e => handleSearch(e)}
        />

        <Table
          dataSource={onloadtable}
          columns={onloadcolumns}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', '100'],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          scroll={{ y: 400 }}
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
                Total Concession Note Raised :{totalCount}
              </span>
              <span style={{ padding: '0px 50px' }}>Total CA :{totalCACount}</span>
              <span style={{ padding: '0px 50px' }}>Total Rework :{totalRWCount}</span>
              <span style={{ padding: '0px 50px' }}>Total Rejected :{totalRJCount}</span>
            </div>
          )}
        />
      </div>
      <ModalPopup
        text="CA Detail"
        isModalVisible={isDtlModal}
        onCancel={handleCloseDtlModal}
        FieldsComponent={DtlComponent}
        width={1500}
      />
    </div>
  )
}

export default QtyCaDetails
