import React, { useEffect, useState } from 'react'
import { Card, Select, Form, DatePicker, Skeleton, Button, Input, message } from 'antd'
import { FileExcelOutlined, FileTwoTone } from '@ant-design/icons'
// import { CheckOutlined } from '@ant-design/icons';
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment'
import store from 'store'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

import currentDateTime from '../../../currentDateTime'
import './style.scss'

const DesignIndentLifecycle = ({ componentdata }) => {
  const { Option } = Select
  const [form] = Form.useForm()
  const tenantId = store.get('tenantId')
  const [isDisplay, setIsDisplay] = useState(false)
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState(null)
  const employeeId = store.get('employeeId')
  // const [detailCard, setDetailCard] = useState(false)
  // const [dtlretrievedata, setDtlretrievedata] = useState([])
  // const [seqArr, setSeqArr] = useState([])
  const [disableInsrtBtn, setDisableInsrtBtn] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [partnummodal, setPartnumModal] = useState(false)
  const [ProductCostdetails, setProductCostDetails] = useState([])
  const Menulistdata = store.get('MenuListData')
  const currentYear = moment().year()
  const currentMonth = moment().month()

  let defaultFromDate
  let defaultToDate

  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }

  const initialData = [
    {
      sno: '',
      indentCode: '',
      productCode: '',
      productDesc: '',
      statusSeq: '',
      created: false,
      verified: false,
      pmverified: false,
    },
  ]
  const [projectList, setProjectList] = useState([])
  const [indentList, setIndentList] = useState([])
  const [dtlData, setDtlData] = useState(initialData)
  const [dtlretrievedata, setDtlretrievedata] = useState([])
  const [lifecycleColumnNames, setLifecycleColumnNames] = useState([])

  useEffect(() => {
    getProjectList()
    getIndentList()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const fromdateChange = () => {
    getProjectList()
  }

  const toDateChange = () => {
    getProjectList()
  }

  const handleClear = () => {
    form.resetFields()
    setIsDisplay(false)
  }

  const getProjectList = async () => {
    const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getIndentProjectDtlsByDate',
      requestData: {
        tenantId,
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
      },
    })
    setProjectList(response?.responseData || [])
  }
  const getIndentList = async () => {
    const response = await indentFileUpload({
      requestPath: 'getIndentTypeMstDropDown',
      requestData: {
        tenantID: tenantId,
        empId: employeeId,
        isInternal: componentdata?.module === 'common' ? 1 : 0,
      },
    })
    setIndentList(response?.responseData || [])
  }

  // const handleClick = record => {
  //   console.log('Clicked record:', record)
  //   setDetailCard(true)
  //   getIndentDtlList(record.indentId)
  // }

  // const getIndentDtlList = async id => {
  //   const response = await indentFileUpload({
  //     requestPath: 'getindentDtlcyc',
  //     requestData: {
  //       tenantId,
  //       indentId: id,
  //     },
  //   })
  //   if (response.responseCode === '200') {
  //     console.log(response.responseData)
  //     setDtlretrievedata(response.responseData)
  //   } else {
  //     message.error(response.responseMessage)
  //     setDtlretrievedata([])
  //   }
  // }

  // const detailcolumn = [
  //   {
  //     title: 'S.No',
  //     dataIndex: 'sno',
  //     key: 'sno',
  //   },
  //   {
  //     title: 'Product Code',
  //     dataIndex: 'productCode',
  //     key: 'productCode',
  //   },
  //   {
  //     title: 'Product Desc',
  //     dataIndex: 'productDesc',
  //     key: 'productDesc',
  //   },
  //   {
  //     title: 'Indent Qty.',
  //     dataIndex: 'indentDtlQty',
  //     key: 'indentDtlQty',
  //     className: 'right-align-cell',
  //     render: text => parseInt(text, 10),
  //   },
  //   {
  //     title: 'PO Qty.',
  //     dataIndex: 'poQty',
  //     key: 'poQty',
  //     className: 'right-align-cell',
  //   },
  //   {
  //     title: 'Material Inward Qty.',
  //     dataIndex: 'miQty',
  //     key: 'miQty',
  //     className: 'right-align-cell',
  //   },
  //   {
  //     title: 'GRN Qty.',
  //     dataIndex: 'grnQty',
  //     key: 'grnQty',
  //     className: 'right-align-cell',
  //   },
  // ]

  // console.log(seqArr)
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '60px',
      fixed: 'left',
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentcode',
      key: 'indentcode',
      width: '80px',
      fixed: 'left',
      render: (text, record) => (
        <div
          style={{
            backgroundColor: record.isFlag > 1 ? '#ed5d5d' : 'transparent',
            color: record.isFlag > 1 ? 'white' : 'black',
            padding: '8px', // Adding some padding for better visual appearance
          }}
        >
          {/* <a
            onClick={() => handleClick(record)}
            onKeyPress={event => handleClick(event, record)}
            role="button"
            tabIndex={0}
            // style={{ color: 'blue' }}
          > */}
          {text}
          {/* </a> */}
        </div>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: '80px',
      fixed: 'left',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : null),
    },
    {
      title: 'Revision No.',
      dataIndex: 'revisionNo',
      key: 'revisionNo',
      width: '60px',
      fixed: 'left',
      render: (text, record) => (
        <div
          style={{
            backgroundColor: record.revisionNo > 1 ? '#ed5d5d' : 'transparent',
            color: record.revisionNo > 1 ? 'white' : 'black',
            padding: '8px', // Adding some padding for better visual appearance
          }}
        >
          {/* <a
            onClick={() => handleClick(record)}
            onKeyPress={event => handleClick(event, record)}
            role="button"
            tabIndex={0}
            // style={{ color: 'blue' }}
          > */}
          {text != null ? text : '-'}
          {/* </a> */}
        </div>
      ),
    },
    {
      title: 'Revision Date',
      dataIndex: 'revisionDate',
      key: 'revisionDate',
      width: '80px',
      fixed: 'left',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : null),
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '80px',
      fixed: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      width: '80px',
      fixed: 'left',
    },
    {
      title: 'Station',
      dataIndex: 'keyAreaDesc',
      key: 'keyAreaDesc',
      width: '80px',
      fixed: 'left',
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subKeyAreaDesc',
      key: 'subKeyAreaDesc',
      width: '80px',
      fixed: 'left',
    },
    {
      title: 'Indent Qty.',
      dataIndex: 'indentQty',
      key: 'indentQty',
      width: '80px',
      fixed: 'left',
      align: 'right',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: '80px',
      fixed: 'left',
      render: text => text || '-',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: '80px',
      fixed: 'left',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
  ]
  const [tableCol, SetTabCol] = useState(columns)

  // const FieldsComponent = () => {
  //   return (
  //     <div>
  //       <Table columns={detailcolumn} dataSource={dtlretrievedata} bordered />
  //     </div>
  //   )
  // }

  const columns6 = [
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
    },
    {
      title: 'Po Date',
      dataIndex: 'poDate',
      key: 'poDate',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: `Unit Rate ${Menulistdata[0].currency}`,
      dataIndex: 'unitRate',
      key: 'unitRate',
      className: 'right-align-cell',
      render: text => {
        const numericValue = parseFloat(text)
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(numericValue)) {
          return numericValue.toLocaleString('en-IN')
        }
        return text?.toLocaleString('en-IN') || ''
      },
    },
  ]

  const PartnumFieldsComponent = () => {
    return (
      <div>
        <Table
          columns={columns6}
          dataSource={ProductCostdetails}
          scroll={{ y: 500 }}
          pagination={false}
          bordered
        />
      </div>
    )
  }

  const getProductcost = async record => {
    const formData = form.getFieldsValue()
    const reqdata = {
      productId: record,
      // productId,
      tenantId,
      pmHdrId: formData.Project,
    }
    const response = await indentFileUpload({
      requestPath: 'getIndentDtlProductCost',
      requestData: reqdata,
    })
    if (response) {
      setPartnumModal(true)
      if (response.responseCode === '200') {
        setProductCostDetails(response.responseData)
      } else {
        message.error(response.responseMessage)
      }
    } else {
      setPartnumModal(true)
      message.error(response.responseMessage)
    }
  }

  const handleSubmit = async () => {
    const formData = form.getFieldsValue()
    console.log(formData, 'formData--------')
    if (formData.Project !== undefined && formData.Indent !== undefined) {
      setDisableInsrtBtn(true)
      setLoading(true)
      setIsDisplay(true)
      const response = await indentFileUpload({
        requestPath: 'getindentLifecycDtl',
        requestData: {
          tenantId,
          projectId: formData.Project,
          indentType: formData.Indent,
          fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
          toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
        },
      })
      if (response.responseCode === '200') {
        setDisableInsrtBtn(false)
        if (response.responseData.length > 0) {
          if (response.responseData[0].indentList.length > 0) {
            const filteredSeqList = response.responseData[0].seqList.filter(
              seq => seq.docStatusDesc !== 'Indent Closed',
            )

            const columnNames = filteredSeqList.map(seq => seq.docStatusDesc)
            setLifecycleColumnNames(columnNames)
            const updateSeq = filteredSeqList.map((rec, index) => {
              return {
                sno: index + 1,
                ...rec,
              }
            })
            // setSeqArr(updateSeq)

            const column = updateSeq.map((seq, index) => ({
              title: seq.docStatusDesc,
              dataIndex: columnNames[index],
              key: columnNames[index],
              align: 'center',
              width: '80px',
              render: (value, record) => {
                // const shouldRender =
                //   parseInt(record.statusSeq, 10) > 3
                //     ? parseInt(record.statusSeq, 10) - 1
                //     : parseInt(record.statusSeq, 10) >= parseInt(seq.sno, 10) ||
                //       record.statusSeq === '0'
                const remark = record?.remarks?.[index]

                console.log(remark, 'remark---> ', index)
                return (
                  <div>
                    {remark?.updatedOn && remark.statusDesc === columnNames[index] ? (
                      <div>
                        <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                        {remark && <p>{moment(remark.updatedOn).format('DD-MMM-YYYY HH:mm')}</p>}
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>
                )
              },
            }))

            const extractDateTime = text => {
              const dateTimeMatch = text?.match(/\(([^)]+)\)/)
              return dateTimeMatch ? dateTimeMatch[1] : ''
            }

            const extractDate = text => {
              const dateTimeMatch = text?.match(/\(([^)]+)\)/)
              if (dateTimeMatch) {
                const dateString = dateTimeMatch[1]
                const dateOnly = dateString.split(' ')[0]
                return dateOnly
              }
              return ''
            }

            const newColumns = [
              {
                title: 'Indent Closed',
                dataIndex: 'indentClosedDate',
                key: 'indentClosedDate',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'Inventory Stock',
                dataIndex: 'isInventoryDateTime',
                key: 'isInventoryDateTime',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'Cash Voucher',
                dataIndex: 'cashVoucherDateTime',
                key: 'cashVoucherDateTime',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'PJS',
                dataIndex: 'pjsDateTime',
                key: 'pjsDateTime',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'PO',
                dataIndex: 'poDateTime',
                key: 'poDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'MI',
                dataIndex: 'miDateTime',
                key: 'miDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'QC Requested',
                dataIndex: 'inspReqDateTime',
                key: 'inspReqDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'QC Cleared',
                dataIndex: 'inspDateTime',
                key: 'inspDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'GRN',
                dataIndex: 'grnDateTime',
                key: 'grnDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'PRA Raised',
                dataIndex: 'praReqDateTime',
                key: 'praReqDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDate(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'PRA Closed',
                dataIndex: 'praDateTime',
                key: 'praDateTime',
                align: 'center',
                width: '80px',
                render: text => {
                  const dateTime = text !== '' ? extractDateTime(text) : null

                  return (
                    <div>
                      {dateTime ? (
                        <div>
                          <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
                          {dateTime && <p>{dateTime}</p>}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  )
                },
              },
              {
                title: 'Action',
                dataIndex: 'productId',
                key: 'productId',
                align: 'center',
                width: '80px',
                render: productId => (
                  <Button
                    type="primary"
                    onClick={() => {
                      getProductcost(productId)
                    }}
                    icon={<FileTwoTone />}
                  />
                ),
              },
            ]

            // const column = updateSeq.map((seq, index) => ({
            //   title: seq.docStatusDesc,
            //   dataIndex: columnNames[index],
            //   key: columnNames[index],
            //   align: 'center',
            //   render: (value, record) => {
            //     // Get the status sequence number
            //     const statusSeqNum = parseInt(record.statusSeq, 10);

            //     // Create an array to hold the elements to be rendered
            //     const elements = [];

            //     // Render the checkmark and updatedOn for each sequence up to the statusSeq
            //     for (let i = 0; i < statusSeqNum; i += 1) {
            //       const remark = record?.remarks[i];
            //       if (remark) {
            //         elements.push(
            //           <div key={i}>
            //             <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
            //             <p>{remark.updatedOn}</p>
            //           </div>
            //         );
            //       }
            //     }

            //     // If no elements were added, render '-'
            //     if (elements.length === 0) {
            //       return '-';
            //     }

            //     // Return the elements to be rendered
            //     return <div>{elements}</div>;
            //   }
            // }));

            // const column1 = updateSeq.map((seq, index) => ({
            //   title: seq.docStatusDesc,
            //   dataIndex: columnNames[index],
            //   key: columnNames[index],
            //   align: 'center',
            //   width: '80px',
            //   render: (value, record) => {
            //     const filteredRemarks = record?.remarks?.map(remark => {
            //       if (parseInt(record.statusSeq, 10) >= seq.sno || record.statusSeq === '0') {
            //         return (
            //           <div>
            //             <span style={{ fontSize: '28px', color: 'green' }}>&#10004; </span>
            //             <p>{remark.updatedOn}</p>
            //           </div>
            //         )
            //       }
            //       return null
            //     })

            //     return filteredRemarks?.some(remark => remark !== null) ? filteredRemarks : '-'
            //   },
            // }))

            columns.push(...column, ...newColumns)
            SetTabCol(columns)
            setLoading(false)
            const updatedDtlData = response.responseData[0].indentList.map((item, index) => {
              const data = {
                sno: index + 1,
                indentcode: item.indentCode,
                productCode: item.productCode,
                productId: item.productId,
                productDesc: item.productDesc,
                revisionNo: item.revisionNo,
                vendorName: item.vendorName,
                deliveryDate: item.deliveryDate,
                revisionDate: moment(item.revisionDate).format('DD-MMM-YYYY'),
                createdOn: moment(item.createdOn).format('DD-MMM-YYYY'),
                grnDateTime:
                  item.grnDateTime != null
                    ? `Completed (${moment(item.grnDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                inspDateTime:
                  item.inspDateTime != null
                    ? `Completed (${moment(item.inspDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                miDateTime:
                  item.miDateTime != null
                    ? `Completed (${moment(item.miDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                inspReqDateTime:
                  item.inspReqDateTime != null
                    ? `Completed (${moment(item.inspReqDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                poDateTime:
                  item.poDateTime != null
                    ? `Completed (${moment(item.poDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                praReqDateTime:
                  item.praReqDateTime != null
                    ? `Completed (${moment(item.praReqDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                praDateTime:
                  item.praDateTime != null
                    ? `Completed (${moment(item.praDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',

                indentQty: item.indentQty,
                pjsDateTime:
                  item.pjsDateTime != null
                    ? `Completed (${moment(item.pjsDateTime).format('DD-MMM-YYYY HH:mm')})`
                    : '',
                indentClosedDate:
                  item.indentClosedDate != null
                    ? `Completed (${moment(item.indentClosedDate).format('DD-MMM-YYYY')})`
                    : '',
                isInventoryDateTime:
                  item.type != null && item.type === 'IS_INVENTORY'
                    ? `Completed (${moment(item.typeCreatedTime).format('DD-MMM-YYYY')})`
                    : '',
                cashVoucherDateTime:
                  item.type != null && item.type === 'Cash Voucher'
                    ? `Completed (${moment(item.typeCreatedTime).format('DD-MMM-YYYY')})`
                    : '',
                statusSeq:
                  parseInt(item.statusSeq, 10) > 3
                    ? parseInt(item.statusSeq, 10) - 1
                    : parseInt(item.statusSeq, 10),
                isFlag: item.isFlag,
                indentId: item.indentId,
                remarks: item.remarksval,
                subKeyAreaDesc: item.subKeyAreaDesc,
                keyAreaDesc: item.keyAreaDesc,
              }
              columnNames.forEach((columnName, columnIndex) => {
                const updatedOn = moment(
                  item.remarksval?.[columnIndex]?.updatedOn,
                  'YYYY-MM-DD HH:mm:ss',
                ).isValid()
                  ? moment(item.remarksval?.[columnIndex]?.updatedOn, 'YYYY-MM-DD HH:mm:ss').format(
                      'DD-MMM-YYYY HH:mm',
                    )
                  : ''
                // const updatedOn = item.remarksval?.[columnIndex]?.updatedOn
                //   ? `(${item.remarksval[columnIndex].updatedOn})`
                //   : ''
                // if (updatedOn) {
                //   data[columnName] =
                //     item.statusSeq >= columnIndex + 1 || item.statusSeq === '0'
                //       ? `Completed ${updatedOn}`
                //       : ''
                // }
                data[columnName] = updatedOn ? `Completed (${updatedOn})` : ''
              })
              return data
            })
            setDtlData(updatedDtlData)
            console.log(updatedDtlData)
            setDtlretrievedata(updatedDtlData)
          } else {
            setLoading(false)
            setDtlData([])
          }
        }
      }
    } else {
      setDisableInsrtBtn(false)
      messageReturn(405)
    }
  }
  const handleSelectProject = (e, val) => {
    console.log(e)
    setProjectName(val.children[2])
  }

  // const handleExportCSV = () => {
  //   const csvData = dtlData.map(row => {
  //     const rowData = tableCol.map(col => row[col.dataIndex])
  //     return rowData.join(',')
  //   })
  //   console.log(dtlData,'dtlData')
  //   const csvContent = [
  //     tableCol
  //       .map(col => col.title)
  //       .join(','),
  //     ...csvData,
  //   ].join('\n')

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //   const link = document.createElement('a')
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob)
  //     link.setAttribute('href', url)
  //     link.setAttribute('download', `${projectName}_IndentLifecycle_${currentDateTime}.csv`)
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
    const cleanedData = cleanupDataSource(dtlData, lifecycleColumnNames)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `${projectName}_IndentLifecycle_${currentDateTime}.csv`)
  }

  const cleanupDataSource = (dataSource, columnNames) => {
    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value
      }
      const base = {
        'S.No': escapeValue(row.sno),
        'Indent No.': escapeValue(row.indentcode),
        'Created Date': escapeValue(row.createdOn),
        'Revision No': escapeValue(row.revisionNo),
        'Revision Date': escapeValue(row.revisionDate),
        'Part Number': escapeValue(row.productCode),
        Description: escapeValue(row.productDesc),
        Station: escapeValue(row.keyAreaDesc),
        'Sub Assembly': escapeValue(row.subKeyAreaDesc),
        'Indent Qty': escapeValue(row.indentQty),
        'Vendor Name': escapeValue(row.vendorName),
        'Delivery Date': escapeValue(row.deliveryDate),
      }
      columnNames.forEach(col => {
        base[col] = escapeValue(row[col])
      })
      return {
        ...base,
        'Indent Closed': escapeValue(row.indentClosedDate),
        'Inventory Stock': escapeValue(row.isInventoryDateTime),
        'Cash Voucher': escapeValue(row.cashVoucherDateTime),
        PJS: escapeValue(row.pjsDateTime),
        PO: escapeValue(row.poDateTime),
        MI: escapeValue(row.miDateTime),
        'QC Requested': escapeValue(row.inspReqDateTime),
        'QC Cleared': escapeValue(row.inspDateTime),
        GRN: escapeValue(row.grnDateTime),
        'PRA Raised': escapeValue(row.praReqDateTime),
        'PRA Closed': escapeValue(row.praDateTime),
      }
    })
  }

  const handleSearch = e => {
    const filtered = dtlretrievedata.filter(item =>
      Object.keys(item).some(key =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      ),
    )
    setDtlData(filtered)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card style={{ width: '100%', marginTop: '20px' }} title="Indent Lifecycle">
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
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
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  onChange={fromdateChange}
                />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
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
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  onChange={toDateChange}
                />
              </Form.Item>
            </div>
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
                  placeholder="Select Project"
                  style={{ width: '100%' }}
                  onChange={(value, option) => handleSelectProject(value, option)}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {projectList &&
                    projectList.map(item => (
                      <Option key={item.projectId} value={item.projectId}>
                        {item.projectCode}-{item.customerName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Indent"
                label={
                  <span>
                    Indent For<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select
                  placeholder="Select Indent"
                  style={{ width: '100%' }}
                  // onChange={(value, option) => handleSelectChange(value, option)}
                >
                  {indentList &&
                    indentList.map(item => (
                      <Option key={item.indentTypeCode} value={item.indentTypeCode}>
                        {item.indentTypeDesc}
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
            text="Submit"
            marginright="10px"
            onClick={handleSubmit}
            disable={disableInsrtBtn}
          />
          <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
        </div>
        <div style={{ display: isDisplay ? 'block' : 'none' }}>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportCSV}
            style={{ marginTop: '10px' }}
          >
            Export to CSV
          </Button>
        </div>
        <div style={{ display: isDisplay ? 'block' : 'none', overflow: 'scroll' }}>
          <Skeleton loading={loading} active>
            <Input.Search
              style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
              placeholder="Search here..."
              enterButton
              // onSearch={handleSearch}
              onChange={e => handleSearch(e)}
            />
            <div className="custom_antd_Table">
              <Table
                dataSource={dtlData}
                columns={tableCol}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', '100'],
                  showSizeChanger: true,
                  defaultPageSize: 100,
                }}
                // pagination={false}
                scroll={{ y: 400 }}
              />
            </div>
          </Skeleton>
        </div>
        <div>
          {partnummodal ? (
            <ModalPopup
              FieldsComponent={PartnumFieldsComponent}
              isModalVisible={partnummodal}
              text="Product - PO History"
              onCancel={() => {
                setPartnumModal(false)
                setProductCostDetails([])
              }}
            />
          ) : null}
        </div>
        {/* <ModalPopup
        isModalVisible={detailCard}
        FieldsComponent={FieldsComponent}
        text="Indent Details"
        onCancel={() => {
          setDetailCard(false)
        }}
        width="900"
      /> */}
      </Card>
    </div>
  )
}

export default DesignIndentLifecycle
