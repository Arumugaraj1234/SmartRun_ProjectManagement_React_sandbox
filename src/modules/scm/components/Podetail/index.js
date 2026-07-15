import React, { useState, useEffect } from 'react'
import { Card, Divider, Row, Button, Space, message, Select, Input } from 'antd'
import { Table } from 'ant-table-extensions'
import {
  FileExcelOutlined,
  ImportOutlined,
  SecurityScanOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import store from 'store'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
// import Manadatorymsg from 'msgfile'
import { useHistory } from 'react-router-dom'
import messageReturn from '_helpers/messageReturn'
import CommonFields2 from '../CommonFields2'
import Tailviewfields from '../Tailviewfields'
import Poimport from '../Poimport'
import Polocal from '../Polocal'
import Poservice from '../Poservice'
import Poassign from './Poassign'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import currentDateTime from '../../../../currentDateTime'
import '../style.scss'
import SupCompState from '../ScsComponent2'

const Podetail = ({ isTailview }) => {
  let defaultfilterData = {}
  const history = useHistory()
  const prevPath = history.location.state?.from
  console.log(prevPath)
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      poCode: [history?.location?.state?.record?.refCode],
    }
  }
  const [potabel, setPoTable] = useState([])
  const [potable1, setPoTable1] = useState([])
  const [pochangetable, setPochangeTable] = useState([])
  const [importview, setImportview] = useState(false)
  const [localview, setLocalview] = useState(false)
  const [serviceview, setServiceview] = useState(false)
  const [rowData, setRowData] = useState({})
  const [selecteddata, setSelectedData] = useState(null)
  const [assigncard, setAssignCard] = useState(false)
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const [uniqueKey, setUniqueKey] = useState(0)
  const [uniqueKey1, setUniqueKey1] = useState(0)
  const [uniqueKey2, setUniqueKey2] = useState(0)
  const [uniqueKey3, setUniqueKey3] = useState(0)
  const tenantId = store.get('tenantId')
  const Menulistdata = store.get('MenuListData')
  const ProjectID = store.get('ProjectID')
  const employeeId = store.get('employeeId')
  const [searchText, setSearchText] = useState('')
  const [singleRecord, setSingleRecord] = useState(null)
  const [pjsModalVisible, setPJSModalVisible] = useState(false)
  const isInternal = store.get('isInternal')

  // eslint-disable-next-line no-unused-vars

  const handleClose = () => {
    setLocalview(false)
    setImportview(false)
    setServiceview(false)
    setAssignCard(false)
    getpotable(selecteddata)
  }
  useEffect(() => {
    onloadRetrivedata()
  }, [])
  const callapi = () => {
    getpotable(selecteddata)
    // handleGetIndentformDetails(selecteddata)
  }
  const handleGetDetails = formData => {
    setSelectedData(formData)
    // handleGetIndentformDetails(formData)
    getpotable(formData)
    setLocalview(false)
    setImportview(false)
    setAssignCard(false)
    setServiceview(false)
  }
  const getpotable = async formData => {
    // setLocalview(false)
    // setImportview(false)
    if (formData) {
      if (formData.IndentCode && formData.Projectcode) {
        const IndentDetailsobj = {
          tenantId,
          hdrId: formData.IndentCode,
          projectId: formData.Projectcode,
        }
        const response = await indentFileUpload({
          requestPath: 'getPoHdrDtlsByIndentId',
          requestData: IndentDetailsobj,
        })
        if (response) {
          if (response.responseData.length > 0) {
            const updatedData = response.responseData.map((item, index) => {
              let poTypeText = ''
              switch (item.poType) {
                case '1':
                  poTypeText = 'Domestic'
                  break
                case '2':
                  poTypeText = 'Import'
                  break
                case '3':
                  poTypeText = 'Service'
                  break
                default:
                  poTypeText = ''
              }

              return {
                ...item,
                sno: index + 1,
                poTypeText,
                praStatus: item.praStatus,
              }
            })
            setPoTable(updatedData)
          } else {
            message.error(response?.responseMessage)
            setPoTable([])
          }
        }
      } else {
        onloadRetrivedata()
      }
    } else {
      onloadRetrivedata()
    }
  }

  const handleGetIndentformDetails = async formData => {
    if (formData.indentID !== undefined) {
      const props = {
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        indentId: formData.indentID,
        projectId: ProjectID,
        tenantId,
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
        empId: employeeId,
        // eslint-disable-next-line eqeqeq
        processCode: isInternal == 1 ? '8' : '5',
      }

      const httpgetdetails = await IndentGroupgetDetails({
        requestPath: 'getIndentGroupHdr',
        requestData: props,
      })
      if (httpgetdetails.responseCode === '200') {
        // message.success(httpgetdetails.responseMessage)
        const updatedData =
          httpgetdetails.responseData &&
          httpgetdetails.responseData.map((data, ind) => {
            return {
              ...data,
              sno: ind + 1,
            }
          })
          const matchedRecord = updatedData.find(
            item => String(item.igHdrId) === String(formData.igHdrId)
          )
        setPoTable1(matchedRecord)
      } else {
        messageReturn(619)
      }
    }
  }

  const onloadRetrivedata = async () => {
    // setLocalview(false)
    // setImportview(false)
    const IndentDetailsobj = {
      tenantId,
      hdrId: 'getAll',
      projectId: ProjectID,
    }
    const response = await indentFileUpload({
      requestPath: 'getPoHdrDtlsByIndentId',
      requestData: IndentDetailsobj,
    })
    if (response) {
      if (response.responseData.length > 0) {
        const updatedData = response.responseData.map((item, index) => {
          let poTypeText = ''
          switch (item.poType) {
            case '1':
              poTypeText = 'Domestic'
              break
            case '2':
              poTypeText = 'Import'
              break
            case '3':
              poTypeText = 'Service'
              break
            default:
              poTypeText = ''
          }

          return {
            ...item,
            sno: index + 1,
            poTypeText,
            praStatus: item.praStatus,
          }
        })
        setPoTable(updatedData)
      } else {
        message.error(response?.responseMessage)
        setPoTable([])
      }
    }
  }

  const UpdatePOtype = async record => {
    const matchingObject = pochangetable.find(item => item.poId === record?.poId)
    if (record.poType === '0') {
      if (matchingObject) {
        const IndentDetailsobj = {
          poId: matchingObject?.poId,
          empId: employeeId,
          poType: matchingObject?.poType,
        }
        const response = await indentFileUpload({
          requestPath: 'updatePoType',
          requestData: IndentDetailsobj,
        })
        if (response) {
          if (response.responseCode === '200') {
            callapi()
            return matchingObject
          }
        }
      } else {
        messageReturn(673)
        setLocalview(false)
        setImportview(false)
        setAssignCard(false)
      }
    }
    return record
  }

  const downloadreport = async record => {
    const reqdata = {
      key:
        record.poType === '1'
          ? 'poLocal'
          : record.poType === '2'
          ? 'poImport'
          : record.poType === '3'
          ? 'poService'
          : '',
      poId: record.poId,
      poType:
        record.poType === '1'
          ? 'Local'
          : record.poType === '2'
          ? 'Import'
          : record.poType === '3'
          ? 'Service'
          : '',
      tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getPoDtlsByPoIdReportPDF',
      requestData: reqdata,
    })

    if (response.responseCode === '200') {
      if (response?.responseData[0]?.fileContent !== null) {
        const link = document.createElement('a')
        link.href = `data:application/octet-stream;base64,${response?.responseData[0]?.fileContent}`
        link.download = response?.fileName
        link.click()
        messageReturn(210)
      } else {
        messageReturn(606)
      }
    }
  }
  const openImport = async record => {
    const matchingObject = await UpdatePOtype(record)
    if ((matchingObject && matchingObject?.poType === '1') || '2' || '3') {
      setRowData(matchingObject)
      if (matchingObject?.poType === '1') {
        setLocalview(true)
        setImportview(false)
        setAssignCard(false)
        setServiceview(false)
        setUniqueKey1(prevKey => prevKey + 1)
      }
      if (matchingObject?.poType === '2') {
        setLocalview(false)
        setImportview(true)
        setAssignCard(false)
        setServiceview(false)
        setUniqueKey2(prevKey => prevKey + 2)
      }
      if (matchingObject?.poType === '3') {
        setLocalview(false)
        setImportview(false)
        setServiceview(true)
        setAssignCard(false)
        setUniqueKey3(prevKey => prevKey + 3)
      }
    }
  }
  const opentableedit = async record => {
    const matchingObject = await UpdatePOtype(record)
    if (matchingObject && matchingObject?.poType > '0') {
      setRowData(matchingObject)
      setLocalview(false)
      setImportview(false)
      setServiceview(false)
      setAssignCard(true)
    }
    setUniqueKey(prevKey => prevKey + 4)
  }
  const handleClear = () => {
    setPoTable([])
    setLocalview(false)
    setImportview(false)
    setAssignCard(false)
    setServiceview(false)
  }

  const handlePoTypeChange = (record, value) => {
    const updatedData = potabel.map(item => {
      if (item.poId === record.poId) {
        return { ...item, poType: value }
      }
      return item
    })
    setPochangeTable(updatedData)
    // setPoTable(updatedData);
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const potype1 = []
  const seqStatusDesc1 = []
  const vendorName1 = []
  const deliveryName1 = []
  const inspectionStatus1 = []
  const billingName1 = []
  const date1 = []
  const revisionDate1 = []
  const indentCode1 = []
  const pono = []

  potabel.map(h => {
    return indentCode1.push(h.indentCode)
  })
  potabel.map(h => {
    return potype1.push(h.poTypeText)
  })
  potabel.map(h => {
    return seqStatusDesc1.push(h.seqStatusDesc)
  })
  potabel.map(h => {
    return vendorName1.push(h.vendorName)
  })
  potabel.map(h => {
    return deliveryName1.push(h.deliveryName)
  })
  potabel.map(h => {
    return inspectionStatus1.push(h.inspectionStatus)
  })
  potabel.map(h => {
    return billingName1.push(h.billingName)
  })
  potabel.map(h => {
    return date1.push(h.date)
  })
  potabel.map(h => {
    return revisionDate1.push(h.revisionDate)
  })
  potabel.map(h => {
    return pono.push(h.poCode)
  })

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const indentCode2 = indentCode1.filter(distinct)
  const potype2 = potype1.filter(distinct)
  const seqStatusDesc2 = seqStatusDesc1.filter(distinct)
  const vendorName2 = vendorName1.filter(distinct)
  const deliveryName2 = deliveryName1.filter(distinct)
  const inspectionStatus2 = inspectionStatus1.filter(distinct)
  const billingName2 = billingName1.filter(distinct)
  const date2 = date1.filter(distinct)
  const revisionDate2 = revisionDate1.filter(distinct)
  const pono2 = pono.filter(distinct)

  const indentCode3 = []
  const potype3 = []
  const seqStatusDesc3 = []
  const vendorName3 = []
  const deliveryName3 = []
  const inspectionStatus3 = []
  const billingName3 = []
  const date3 = []
  const revisionDate3 = []
  const pono3 = []

  indentCode2
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .forEach(element => {
      indentCode3.push({
        text: element,
        value: element,
      })
    })

  potype2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      potype3.push({
        text: element,
        value: element,
      })
    })

  seqStatusDesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      seqStatusDesc3.push({
        text: element,
        value: element,
      })
    })

  vendorName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      vendorName3.push({
        text: element,
        value: element,
      })
    })

  deliveryName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      deliveryName3.push({
        text: element,
        value: element,
      })
    })

  inspectionStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      inspectionStatus3.push({
        text: element,
        value: element,
      })
    })

  billingName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      billingName3.push({
        text: element,
        value: element,
      })
    })

  date2
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      const formattedDate = element ? moment(element).format('DD-MMM-YYYY') : ''
      date3.push({
        text: formattedDate,
        value: element,
      })
    })

  revisionDate2
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      const formattedDate = element ? moment(element).format('DD-MMM-YYYY') : ''
      revisionDate3.push({
        text: formattedDate,
        value: element,
      })
    })

  pono2
    .sort((a, b) => {
      const lastA = parseInt(a.split('/').pop(), 10)
      const lastB = parseInt(b.split('/').pop(), 10)
      return lastA - lastB
    })
    .forEach(element => {
      pono3.push({
        text: element,
        value: element,
      })
    })

  const rowClassName = record => {
    return record.revision !== '0' ? 'highlighted-row' : ''
  }

  const praStatus1 = potabel.map(h => h.praStatus)
  const praStatus2 = praStatus1.filter(distinct)
  const praStatus3 = []

  praStatus2.map(element => {
    return praStatus3.push({
      text: element,
      value: element,
    })
  })

  const searchedData = potabel.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '4%',
    },
    {
      title: 'Indent No',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: indentCode3,
      filteredValue: filtersinfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
    },
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: pono3,
      filteredValue: filtersinfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
    },
    {
      title: 'PO Date',
      dataIndex: 'date',
      key: 'date',
      filters: date3,
      filteredValue: filtersinfo.date,
      onFilter: (value, record) => record?.date === value,
      render: (text, record) => moment(record.date).format('DD-MMM-YYYY'),
    },

    {
      title: 'PO Revision',
      dataIndex: 'revision',
      key: 'revision',
    },
    {
      title: 'Part Count',
      dataIndex: 'partCount',
      key: 'partCount',
    },
    {
      title: 'Revision Date',
      dataIndex: 'revisionDate',
      key: 'revisionDate',
      filters: revisionDate3,
      filteredValue: filtersinfo.revisionDate,
      onFilter: (value, record) => record?.revisionDate === value,
      render: (text, record) => moment(record.revisionDate).format('DD-MMM-YYYY'),
    },
    {
      title: 'PO Type',
      dataIndex: 'poTypeText',
      key: 'poTypeText',
      // render: (text, record) => (record.poType === '1' ? 'Local' : 'Import'),
      filters: potype3,
      filteredValue: filtersinfo.poTypeText || null,
      onFilter: (value, record) => record?.poTypeText === value,
      render: (text, record) => {
        if (record.poType === '0') {
          return (
            <Select
              style={{ width: '100%' }}
              onChange={value => handlePoTypeChange(record, value)}
              placeholder="Select PO Type"
            >
              <Select.Option value="2">Import</Select.Option>
              <Select.Option value="1">Domestic</Select.Option>
              <Select.Option value="3">Service</Select.Option>
            </Select>
          )
        }
        return record.poType === '1'
          ? 'Domestic'
          : record.poType === '2'
          ? 'Import'
          : record.poType === '3'
          ? 'Service'
          : ''
      },
    },

    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendorName3,
      filteredValue: filtersinfo.vendorName || null,
      onFilter: (value, record) => record?.vendorName === value,
    },
    {
      title: 'Delivery Location Name',
      dataIndex: 'deliveryName',
      key: 'deliveryName',
      filters: deliveryName3,
      filteredValue: filtersinfo.deliveryName || null,
      onFilter: (value, record) => record?.deliveryName === value,
    },
    {
      title: `Total ${Menulistdata[0].currency}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text.toLocaleString('en-IN')
      },
    },
    {
      title: `Total FX`,
      dataIndex: 'totalValueFx',
      key: 'totalValueFx',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return '0'
      },
    },
    {
      title: 'PO Status',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatusDesc',

      render: (text, record) => {
        if (text) {
          return {
            children: (
              <a
                role="button"
                tabIndex={0}
                style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  handleGetIndentformDetails(record)
                  setSingleRecord(record)
                  setPJSModalVisible(true)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSingleRecord(record)
                    setPJSModalVisible(true)
                  }
                }}
              >
                {text}
              </a>
            ),
          }
        }

        return {
          children: text != null ? text : '-',
        }
      },

      filters: seqStatusDesc3,
      filteredValue: filtersinfo.seqStatusDesc || null,
      onFilter: (value, record) => record?.seqStatusDesc === value,
    },
    {
      title: 'Inspection Status',
      dataIndex: 'inspectionStatus',
      key: 'inspectionStatus',
      filters: inspectionStatus3,
      filteredValue: filtersinfo.inspectionStatus || null,
      onFilter: (value, record) => record?.inspectionStatus === value,
    },
    {
      title: 'PRA Status',
      dataIndex: 'praStatus',
      key: 'praStatus',
      filters: praStatus3,
      filteredValue: filtersinfo.praStatus || null,
      onFilter: (value, record) => record?.praStatus === value,
    },
    // {
    //   title: 'Billing Name',
    //   dataIndex: 'billingName',
    //   key: 'billingName',
    //   filters: billingName3,
    //   filteredValue: filtersinfo.billingName || null,
    //   onFilter: (value, record) => record?.billingName === value,
    // },

    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <Space>
          <Button type="primary" icon={<ImportOutlined />} onClick={() => openImport(record)} />
          {record.isApproved === '1' ? (
            <Button
              type="primary"
              icon={<SecurityScanOutlined />}
              onClick={() => opentableedit(record)}
            />
          ) : null}
          {record.isApproved === '1' ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadreport(record)}
            />
          ) : null}
        </Space>
      ),
    },
  ]
  const merged = {
    ...singleRecord,
    ...(potable1[0] || {}),
  }
  return (
    <div className="my-3">
      <Card style={{ width: '100%' }} title={!isTailview ? 'Purchase Detail' : null}>
        {!isTailview ? (
          <CommonFields2 onGetDetails={handleGetDetails} onClear={handleClear} getIndent="2" />
        ) : (
          <div>
            <h5 className="mb-3">Purchase Detail</h5>
            <Tailviewfields onGetDetails={handleGetDetails} onClear={handleClear} getIndent="2" />
          </div>
        )}

        <Row>
          {potabel.length > 0 ? <Divider orientation="left">Purchase Order Detail</Divider> : null}
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input.Search
            placeholder="Search..."
            allowClear
            enterButton
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 450 }}
          />
        </div>
        {potabel.length > 0 ? (
          <div>
            <Table
              columns={columns}
              dataSource={searchedData}
              rowClassName={rowClassName}
              exportableProps={{
                fileName: `Purchase_Order_Detail${currentDateTime}`,
                btnProps: {
                  type: 'primary',
                  icon: <FileExcelOutlined />,
                  children: <span>Export to CSV</span>,
                },
              }}
              pagination={{
                pageSizeOptions: ['10', '20', '30', '50', [potabel.length]],
                showSizeChanger: true,
                defaultPageSize: 10,
              }}
              scroll={{ y: 400 }}
              onChange={handleChange}
              bordered
            />
          </div>
        ) : null}
        <div>
          {importview && potabel.length > 0 ? (
            <Poimport
              key={uniqueKey2}
              rowData={rowData}
              onClose={handleClose}
              calldetailapi={callapi}
            />
          ) : null}
          {localview && potabel.length > 0 ? (
            <Polocal
              key={uniqueKey1}
              rowData={rowData}
              onClose={handleClose}
              calldetailapi={callapi}
            />
          ) : null}
          {serviceview && potabel.length > 0 ? (
            <Poservice
              key={uniqueKey3}
              rowData={rowData}
              onClose={handleClose}
              calldetailapi={callapi}
            />
          ) : null}
          {assigncard && potabel.length > 0 ? (
            <Poassign
              key={uniqueKey}
              rowData={rowData}
              onClose={handleClose}
              calldetailapi={callapi}
            />
          ) : null}
          {pjsModalVisible ? (
            <SupCompState
              componentData={merged}
              visibling={pjsModalVisible}
              isView
              // eslint-disable-next-line eqeqeq
              ProcessCode1={isInternal == 1 ? '8' : '5'}
              onmodalCancel={() => {
                setPJSModalVisible(false)
              }}
            />
          ) : null}
        </div>
      </Card>
    </div>
  )
}

export default Podetail
