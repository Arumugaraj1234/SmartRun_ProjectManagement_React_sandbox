/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react'
import store from 'store'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Card, Row, Divider, message, Form, Select, Button, Input, Skeleton } from 'antd'
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons'

import ButtonComponent from 'components/shared/ButtonComponent'
import { Table } from 'ant-table-extensions'
import ModalPopup from 'components/shared/ModalPopupComponent'
import RemoveIconButton from 'components/shared/RemoveIconComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import messageReturn from '_helpers/messageReturn'
import AddIndentGroup from '../AddIndentGroup'
import SupCompState from '../ScsComponent2'
import currentDateTime from '../../../../currentDateTime'
import ViewPoModal from './ViewPoModal'
// import Tailviewfields from '../Tailviewfields'

const IndentGroupComponent = ({ isTailview }) => {
  let defaultfilterData = {}
  const history = useHistory()
  console.log(history)
  const prevPath = history.location.state?.from
  console.log(prevPath)
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      indentCode: [history?.location?.state?.record?.refCode],
    }
  }
  const { Option } = Select
  const [form] = Form.useForm()
  const [detailCard, setDetailCard] = useState(false)
  const [dtlretrievedata, setDtlretrievedata] = useState([])
  const [hdretrievedata, setHdretrievedata] = useState([])
  const [loading, setLoading] = useState(false)
  const [hdrdata, setHdrdata] = useState([])
  const [addmodalvisible, setAddmodalvisible] = useState(false)
  const [scsmodalvisible, setScsmodalvisible] = useState(false)
  const [poModalvisible, setPOmodalvisible] = useState(false)
  const [indentDtldisplay, setIndentDtldisplay] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [indentType, setIndentType] = useState('')
  const [station, setStation] = useState('')
  const [subAssy, setSubAssy] = useState('')
  const [indId, setIndId] = useState('')
  const [indIdcd, setIndIdcd] = useState('')
  const [finalcost, setFinalcost] = useState('')
  const [totalcost, settotalcost] = useState('')
  const [openindex, setOpenindex] = useState('')
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const [scsHdrid, setScsHdrid] = useState('')
  const [indentHdrid, setIndentHdrid] = useState('')
  const [indentDtlIds, setIndentDtlIds] = useState('')
  const [scsStatus, setScsStatus] = useState('')
  const [inventoryBased, setInventoryBased] = useState('')
  const [singleRecord, setSingleRecord] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [empId, setEmpId] = useState('')
  const [productCodes, setProductCodes] = useState([])
  // const [prodCodeInDetail, setProdCodeInDetail] = useState([])
  // const [indentIds, setIndentIds] = useState()
  // const [commondropdown, setcommondropdown] = useState(false)
  // const [commondropdownval, setcommondropdownval] = useState('')
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const projectval = store.get('ProjectID')
  const currentYear = moment().year()
  const isInternal = store.get('isInternal')
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
  let defaultFromDate
  let defaultToDate
  console.log(indIdcd, finalcost, totalcost, scsHdrid, scsStatus, openindex)
  if (currentMonth < 3) {
    // Financial year starts from April
    defaultFromDate = moment(`${currentYear - 1}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear}-03-31`).format('YYYY-MM-DD')
  } else {
    defaultFromDate = moment(`${currentYear}-04-01`).format('YYYY-MM-DD')
    defaultToDate = moment(`${currentYear + 1}-03-31`).format('YYYY-MM-DD')
  }
  const [indentList, setIndentList] = useState([])

  useEffect(() => {
    getIndentList()
    onloadretrive()
  }, [])

  const getIndentList = async () => {
    const response = await IndentGroupgetDetails({
      requestPath: 'indentHdrDropDownByProjectCode',
      requestData: {
        tenantId,
        empId: employeeId,
        pmId: '5',
        projectId: projectval,
        fromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
        toDate: moment(defaultToDate).format('YYYY-MM-DD'),
        getIndent: isInternal == 1 ? '5' : '1',
      },
    })
    if (response) {
      if (response?.responseData?.length > 0) {
        const updatedResponseData = [
          {
            indentId: 'getAll',
            indentCode: 'Get All',
          },
          ...response?.responseData,
        ]
        const indentIdForDtl = updatedResponseData.map(item => item.indentId)

        console.log('Indent IDs:', indentIdForDtl)
        setIndentList(updatedResponseData)
      } else {
        setIndentList([])
      }
    }
  }

  const OpenDetailCard = (hdrid, gname, st, it, sub, id, ind, sts, inv) => {
    setDetailCard(true)
    gethdrDtldetails(hdrid)
    setIndentHdrid(hdrid)
    setGroupName(gname)
    setStation(st)
    setSubAssy(sub)
    setIndentType(it)
    setIndId(id)
    setOpenindex(ind)
    setScsStatus(sts)
    setInventoryBased(inv)
  }

  const OpenScsCard = (HdrId, st, it, sub, id, ind, sts, cost, icode, fincst) => {
    setScsHdrid(HdrId)
    setStation(st)
    setSubAssy(sub)
    setIndentType(it)
    setIndId(id)
    settotalcost(cost)
    setOpenindex(ind)
    setScsStatus(sts)
    setIndIdcd(icode)
    setFinalcost(fincst)
    setScsmodalvisible(true)
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleSubmit = (indentId, fromdate, todate, projectcode, tileview) => {
    handleCancel()
    handleRefreshdetails(indentId, fromdate, todate, projectcode)
    // const prop = {
    //   indentId,
    //   fromdate,
    //   todate,
    //   projectcode,
    // }
    if (tileview) {
      // setcommondropdownval(prop)
      form.setFieldsValue({
        IndentCodeDP: indentId,
      })
    }
    //  else {
    //   setcommondropdownval(prop)
    //   setcommondropdown(true)
    // }
  }

  const handleCancel = () => {
    // handleGetIndentDetails()
    setAddmodalvisible(false)
  }

  const gethdrDtldetails = async hdrid => {
    const props = {
      delAll: 0,
      igDtlId: hdrid,
      tenantId,
    }

    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'getIndentGroupHdrAndDtl',
      requestData: props,
    })
    if (httpgetdetails.responseCode === '200') {
      setDtlretrievedata(httpgetdetails.responseData)
    } else {
      setDetailCard(false)
      handleGetIndentDetails()
    }
  }

  const handleDtlRemoveRow = async (dtlid, deleteall) => {
    let deletecheck = 0
    let deleteid = dtlid
    if (deleteall) {
      deletecheck = 1
      deleteid = indentHdrid
    }

    const props = {
      delAll: deletecheck,
      igDtlId: deleteid,
      tenantId,
      empId: employeeId,
    }

    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'delIndentGrpDtl',
      requestData: props,
    })
    if (httpgetdetails.responseCode === '200') {
      message.success(httpgetdetails.responseMessage)
      if (deleteall) {
        setDetailCard(false)
        handleGetIndentDetails()
      } else {
        gethdrDtldetails(indentHdrid)
      }
    } else {
      message.error(httpgetdetails.responseMessage)
    }
  }

  // const renderScsComponent = () => {
  //   return (
  //     <SupCompState
  //       hdrId={scsHdrid}
  //       scpDtlList={dtlretrievedata}
  //       indentType={indentType}
  //       subAssy={subAssy}
  //       station={station}
  //       indentId={indId}
  //       scsStatus={scsStatus}
  //       totalcost={totalcost}
  //       indentcode={indIdcd}
  //       finalcost={finalcost}
  //       onmodalCancel={() => {
  //         setScsmodalvisible(false)
  //         handleGetIndentDetails()
  //       }}
  //     />
  //   )
  // }

  // const renderScsComponent = useCallback(() => {
  //   return (
  //     <SupCompState
  //       hdrId={scsHdrid}
  //       scpDtlList={dtlretrievedata}
  //       indentType={indentType}
  //       subAssy={subAssy}
  //       station={station}
  //       indentId={indId}
  //       scsStatus={scsStatus}
  //       totalcost={totalcost}
  //       indentcode={indIdcd}
  //       finalcost={finalcost}
  //       onmodalCancel={() => {
  //         setScsmodalvisible(false);
  //         handleGetIndentDetails();
  //       }}
  //     />
  //   );
  // }, [scsHdrid, dtlretrievedata, indentType, subAssy, station, indId, scsStatus, totalcost, indIdcd, finalcost]);

  const saveAddedIndntGrp = async () => {
    const newRows = dtlretrievedata.filter(item => item.isNew)

    if (newRows.length === 0) {
      message.info('No new rows to save')
      return
    }
    const newArray = newRows.map(item => ({
      indentDtlId: item.indentDtlId || indentDtlIds,
      inventory: item.indentGrpQty,
      qty: item.indentGrpQty,
      tenantId: item.tenantId || tenantId,
    }))

    const props = {
      igHdrId: indentHdrid,
      insrtGrpDtl: newArray,
      empId: employeeId,
      tenantId,
      // newRowlist: newRows,
    }
    console.log('Props to be sent:', 'indentDtlId:', indentDtlIds, 'newArray:', newArray)

    if (newArray.length > 0) {
      const httpinsert = await IndentGroupgetDetails({
        requestPath: 'insertTempGrup',
        requestData: props,
      })

      if (httpinsert?.responseCode === '200') {
        message.success(httpinsert.responseMessage)
        setDtlretrievedata(prev => prev.map(row => (row.isNew ? { ...row, isNew: false } : row)))
      } else {
        message.error(httpinsert?.responseMessage || 'Failed to save')
      }
    }
  }

  const addRowInDetail = async id => {
    const props = {
      indentId: id,
      tenantId,
      empId: employeeId,
    }

    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'getIndentGrpNewProd',
      requestData: props,
    })

    if (httpgetdetails?.responseData) {
      setProductCodes(httpgetdetails.responseData)
    }
  }

  const FieldsComponent = () => {
    const emptyRow = () => ({
      key: 'new',
      productCode: '',
      description: '',
      specification: '',
      weight: '',
      material: '',
      make: '',
      uom: '',
      indentQty: '',
      indentGrpQty: '',
    })
    const [newRow, setNewRow] = useState(emptyRow())

    const handleAddRow = () => {
      if (!newRow.productCode || !newRow.description) {
        message.error('Please fill required fields')
        return
      }

      setDtlretrievedata(prev => [...prev, { ...newRow, key: prev.length + 1, isNew: true }])

      setNewRow(emptyRow())
    }

    const detailcolumn = [
      {
        title: 'Part Number',
        dataIndex: 'productCode',
        render: (text, record) => {
          if (record.key === 'new') {
            return (
              <Select
                style={{ width: '250px' }}
                showSearch
                placeholder="Select Product"
                optionFilterProp="label"
                value={newRow.productCode || undefined}
                onChange={value => {
                  const selectedProduct = productCodes.find(prod => prod.productCode === value)
                  if (selectedProduct) {
                    setNewRow({
                      ...newRow,
                      productCode: selectedProduct.productCode,
                      description: selectedProduct.description || '',
                      specification: selectedProduct.specification || '',
                      weight: selectedProduct.weight || '',
                      material: selectedProduct.material || '',
                      make: selectedProduct.make || '',
                      uom: selectedProduct.uom || '',
                      indentQty: selectedProduct.differenceQty || '',
                      indentGrpQty: selectedProduct.indentGrpQty || '',
                      indentDtlId: selectedProduct.indentDtlId || '',
                    })
                  } else {
                    setNewRow({ ...newRow, productCode: value })
                  }
                }}
                options={productCodes.map(prod => ({
                  value: prod.productCode,
                  label: prod.productCode,
                }))}
              />
            )
          }
          return text
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: (text, record) =>
          record.key === 'new' ? (
            <Input
              value={newRow.description || ''}
              onChange={e => setNewRow({ ...newRow, description: e.target.value })}
            />
          ) : (
            text
          ),
      },
      {
        title: 'Specification',
        dataIndex: 'specification',
        render: (text, record) =>
          record.key === 'new' ? (
            <Input
              value={newRow.specification || ''}
              onChange={e => setNewRow({ ...newRow, specification: e.target.value })}
            />
          ) : (
            text
          ),
      },
      {
        title: 'UOM',
        dataIndex: 'uom',
        render: (text, record) =>
          record.key === 'new' ? (
            <Input
              value={newRow.uom || ''}
              onChange={e => setNewRow({ ...newRow, uom: e.target.value })}
            />
          ) : (
            text
          ),
      },
      {
        title: 'Indent Qty',
        dataIndex: 'indentQty',
        render: (text, record) =>
          record.key === 'new' ? (
            <Input
              value={newRow.indentQty || ''}
              onChange={e => setNewRow({ ...newRow, indentQty: e.target.value })}
            />
          ) : (
            text
          ),
      },
      {
        title: 'Available Qty',
        dataIndex: 'indentGrpQty',
        render: (text, record) =>
          record.key === 'new' ? (
            <Input
              value={newRow.indentGrpQty || ''}
              onChange={e => {
                const { value } = e.target
                const numValue = Number(value)
                const maxQty = Number(newRow.indentQty || 0)

                if (!Number.isNaN(numValue) && numValue <= maxQty) {
                  setNewRow({ ...newRow, indentGrpQty: value })
                } else {
                  message.warning('Available Qty cannot be greater than Indent Qty')
                }
              }}
            />
          ) : (
            text
          ),
      },
      {
        title: 'Action',
        key: 'action',
        render: record =>
          record.key === 'new' ? (
            <Button
              type="secondary"
              size="small"
              style={{
                backgroundColor: 'green',
                color: 'white',
                borderColor: 'green',
                height: '30px',
                width: '30px',
                padding: 0,
              }}
              onClick={() => {
                setIndentDtlIds(record.indentDtlId)
                console.log('Selected record IndentDtlId:', record)
                handleAddRow()
              }}
            >
              <PlusOutlined />
            </Button>
          ) : (
            <RemoveIconButton onClick={() => handleDtlRemoveRow(record.indentGrpDtlId, false)} />
          ),
      },
    ]
    console.log('indentDtlId:', indentDtlIds)

    return (
      <div>
        <div
          className="row"
          style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
        >
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p>
              <span style={{ fontWeight: 'bold' }}>IndentCode</span> : {indId}
            </p>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p>
              <span style={{ fontWeight: 'bold' }}>Indent Type</span> : {indentType}
            </p>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p>
              <span style={{ fontWeight: 'bold' }}>Station</span> : {station}
            </p>
          </div>
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
            <p>
              <span style={{ fontWeight: 'bold' }}>Sub Assembly</span> : {subAssy}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textDecoration: 'underline' }}>
            {inventoryBased === 'True' && <h4>Stock Available</h4>}
          </div>

          <ButtonComponent
            text="Delete Group"
            type="primary"
            disabled={!dtlretrievedata.some(row => row.isNew)}
            onClick={() => handleDtlRemoveRow('', true)}
          />
        </div>

        <div>
          <Table
            columns={detailcolumn}
            dataSource={[...dtlretrievedata, newRow]}
            rowKey={record => record.key || record.indentGrpDtlId}
            bordered
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [dtlretrievedata.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent
            type="primary"
            text="Save"
            disable={employeeId !== empId}
            onClick={() => {
              saveAddedIndntGrp()
            }}
          />
        </div>
      </div>
    )
  }

  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      // const dateSp = dateStringval.split('-');
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }

  const indentCode1 = []
  const expectedDeliveryDate1 = []
  const scsStatus1 = []
  const pjsCreatedPerson1 = []
  const poStatus1 = []
  const isInventory1 = []
  const nextStatus1 = []
  const sbcDesc1 = []
  const pkDesc1 = []
  const pskDesc1 = []
  const groupName1 = []
  const type1 = []

  hdretrievedata.map(h => {
    return nextStatus1.push(h.nextStatus)
  })
  hdretrievedata.map(h => {
    return indentCode1.push(h.indentCode)
  })
  hdretrievedata.map(h => {
    return expectedDeliveryDate1.push(h.expectedDeliveryDate)
  })
  hdretrievedata.map(h => {
    return scsStatus1.push(h.scsStatus)
  })
  hdretrievedata.map(h => {
    return pjsCreatedPerson1.push(h.pjsCreatedPerson)
  })

  hdretrievedata.map(h => {
    return poStatus1.push(h.poStatus)
  })

  hdretrievedata.map(h => {
    return isInventory1.push(h.isInventory)
  })

  hdretrievedata.map(h => {
    return sbcDesc1.push(h.sbcDesc)
  })

  hdretrievedata.map(h => {
    return pkDesc1.push(h.pkDesc)
  })
  hdretrievedata.map(h => {
    return pskDesc1.push(h.pskDesc)
  })
  hdretrievedata.map(h => {
    return groupName1.push(h.groupName)
  })
  hdretrievedata.map(h => {
    return type1.push(h.type)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const indentCode2 = indentCode1.filter(distinct)
  const expectedDeliveryDate2 = expectedDeliveryDate1.filter(distinct)
  const scsStatus2 = scsStatus1.filter(distinct)
  const pjsCreatedPerson2 = pjsCreatedPerson1.filter(distinct)
  const poStatus2 = poStatus1.filter(distinct)
  const isInventory2 = isInventory1.filter(distinct)
  const nextStatus2 = nextStatus1.filter(distinct)
  const sbcDesc2 = sbcDesc1.filter(distinct)
  const pkdesc2 = pkDesc1.filter(distinct)
  const pskDesc2 = pskDesc1.filter(distinct)
  const groupName2 = groupName1.filter(distinct)
  const type2 = type1.filter(distinct)

  const indentCode3 = []
  const expectedDeliveryDate3 = []
  const scsStatus3 = []
  const pjsCreatedPerson3 = []
  const poStatus3 = []
  const isInventory3 = []
  const nextStatus3 = []
  const sbcDesc3 = []
  const pkdesc3 = []
  const pskDesc3 = []
  const groupName3 = []
  const type3 = []

  pskDesc2
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach(element => {
      pskDesc3.push({
        text: element,
        value: element,
      })
    })

  groupName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      groupName3.push({
        text: element,
        value: element,
      }),
    )

  indentCode2
    .sort((a, b) => {
      const numA = parseInt(a.split('-').pop(), 10)
      const numB = parseInt(b.split('-').pop(), 10)
      return numA - numB
    })
    .map(element => {
      return indentCode3.push({
        text: element,
        value: element,
      })
    })
  poStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      poStatus3.push({
        text: element,
        value: element,
      }),
    )

  expectedDeliveryDate2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      expectedDeliveryDate3.push({
        text: moment(element).format('DD-MMM-YYYY'),
        value: element,
      })
    })

  scsStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      scsStatus3.push({
        text: element,
        value: element,
      }),
    )

  pjsCreatedPerson2
    .slice()
    .sort((a, b) => a?.localeCompare(b, 'en', { sensitivity: 'base' }))
    .forEach(element =>
      pjsCreatedPerson3.push({
        text: element,
        value: element,
      }),
    )

  nextStatus2
    .filter(item => item !== null && item !== undefined)
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      nextStatus3.push({
        text: element,
        value: element,
      }),
    )

  isInventory2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      isInventory3.push({
        text: element === 'True' ? 'Yes' : 'No',
        value: element,
      }),
    )

  sbcDesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      sbcDesc3.push({
        text: element,
        value: element,
      }),
    )

  pkdesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      pkdesc3.push({
        text: element,
        value: element,
      }),
    )

  type2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element =>
      type3.push({
        text: element,
        value: element,
      }),
    )

  const searchedData = hdretrievedata
    .filter(item => {
      if (!searchText) return true
      return Object.values(item).some(value =>
        value
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      )
    })
    // Target Cost has no real equivalent for NEW-flow (always the legacy indent_hdr.TARGET_VALUE,
    // permanently 0 there) - blank it at the data level so it's also correct in any CSV export.
    .map(item => (item.costFlowType === 'NEW' ? { ...item, targetCost: '-' } : item))

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: indentCode3,
      filteredValue: filtersinfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
    },
    {
      title: 'Indent Type',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: sbcDesc3,
      filteredValue: filtersinfo.sbcDesc,
      onFilter: (value, record) => record?.sbcDesc === value,
    },
    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: pkdesc3,
      filteredValue: filtersinfo.pkDesc,
      onFilter: (value, record) => record?.pkDesc === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: pskDesc3,
      filteredValue: filtersinfo.pskDesc,
      onFilter: (value, record) => record?.pskDesc === value,
    },
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: groupName3,
      filteredValue: filtersinfo.groupName,
      onFilter: (value, record) => record?.groupName === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: type3,
      filteredValue: filtersinfo.type,
      onFilter: (value, record) => record?.type === value,
    },
    {
      title: 'Part Count',
      dataIndex: 'partCount',
      key: 'partCount',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      className: 'right-align-cell',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: '8%',
      filters: expectedDeliveryDate3,
      filteredValue: filtersinfo.expectedDeliveryDate,
      onFilter: (value, record) => record?.expectedDeliveryDate === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text ? <a>{dateformatter(text)}</a> : '-',
      }),
    },
    {
      title: 'Target Cost (Rs.)',
      key: 'targetCost',
      dataIndex: 'targetCost',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text === '-'
            ? '-'
            : text !== undefined && text !== null
            ? parseFloat(text).toLocaleString('en-IN')
            : '-',
      }),
    },
    {
      title: 'Final Cost (Rs.)',
      key: 'finalCost',
      dataIndex: 'finalCost',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null ? parseFloat(text).toLocaleString('en-IN') : '',
      }),
    },
    {
      title: 'Final Cost FX',
      key: 'finalCostFx',
      dataIndex: 'finalCostFx',
      align: 'right',
      width: '7%',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
            textAlign: 'right',
          },
        },
        children:
          text !== undefined && text !== null && text !== ''
            ? parseFloat(text).toLocaleString('en-IN')
            : '',
      }),
    },
    {
      title: 'Stock Availability',
      dataIndex: 'isInventory',
      key: 'isInventory',
      width: '7%',
      filters: isInventory3,
      filteredValue: filtersinfo.isInventory,
      onFilter: (value, record) => record?.isInventory === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <div>{text === 'True' ? 'Yes' : 'No'}</div>,
      }),
    },
    {
      title: 'PJS Created Person',
      key: 'pjsCreatedPerson',
      dataIndex: 'pjsCreatedPerson',
      className: 'right-align-cell',
      width: '7%',
      filters: pjsCreatedPerson3,
      filteredValue: filtersinfo.pjsCreatedPerson,
      onFilter: (value, record) => record?.pjsCreatedPerson === value,
      render: (text, record) => {
        console.log('Record:', record) // 👈 Console log the record here

        return {
          props: {
            style: {
              backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
              textAlign: 'right',
            },
          },
          children: text !== undefined && text !== null ? text : '',
        }
      },
    },
    {
      title: 'PJS Current Status',
      dataIndex: 'scsStatus',
      key: 'scsStatus',
      filters: scsStatus3,
      filteredValue: filtersinfo.scsStatus,
      onFilter: (value, record) => record?.scsStatus === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text !== undefined && text !== null ? text : '-',
      }),
    },
    {
      title: 'PJS Next Status',
      dataIndex: 'nextStatus',
      key: 'nextStatus',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: nextStatus3,
      filteredValue: filtersinfo?.nextStatus,
      onFilter: (value, record) => record?.nextStatus === value,
      // render: text => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: 'PO Status',
      dataIndex: 'poStatus',
      key: 'poStatus',
      render: (text, record) => {
        const style = {
          backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
        }

        if (text === 'Approved' || text === 'Created') {
          return {
            props: { style },
            children: (
              <a
                role="button"
                tabIndex={0}
                style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  setPOmodalvisible(true)
                  setHdrdata(record)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPOmodalvisible(true)
                    setHdrdata(record)
                  }
                }}
              >
                {text}
              </a>
            ),
          }
        }

        return {
          props: { style },
          children: text != null ? text : '-',
        }
      },
      filters: poStatus3,
      filteredValue: filtersinfo.poStatus || null,
      onFilter: (value, record) => record?.poStatus === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      onCell: record => ({
        style: {
          backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
        },
      }),

      // width:'12%',
      render: (text, record, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'left' }}>
            <ButtonComponent
              type="primary"
              text="Details"
              onClick={() => {
                addRowInDetail(record.indentId)
                setEmpId(record.empId)
                OpenDetailCard(
                  record.igHdrId,
                  record.groupName,
                  record.pkDesc,
                  record.sbcDesc,
                  record.pskDesc,
                  record.indentCode,
                  index,
                  record.scsStatus,
                  record.isInventory,
                )
              }}
            />
            <span style={{ margin: '0 8px' }} />

            {record.isInventory !== 'True' || record.type !== '' ? (
              <ButtonComponent
                type="primary"
                text="PJS"
                onClick={() => {
                  setSingleRecord(record)
                  OpenScsCard(
                    record.igHdrId,
                    record.pkDesc,
                    record.sbcDesc,
                    record.pskDesc,
                    record.indentId,
                    index,
                    record.scsStatus,
                    record.targetCost,
                    record.indentCode,
                    record.finalCost,
                  )
                }}
              />
            ) : null}
          </div>
        )
      },
    },
    // This list can span multiple projects at once (portfolio-wide view), so only drop the whole
    // column when every currently-loaded row is NEW-flow; a mixed legacy+NEW list keeps the column
    // and falls back to per-row blanking (see searchedData above).
  ].filter(
    col =>
      col.key !== 'targetCost' ||
      !(searchedData.length > 0 && searchedData.every(row => row.costFlowType === 'NEW')),
  )

  const handleRefreshdetails = async (indentid, fromdate, todate, projectcode) => {
    const props = {
      fromDate: fromdate,
      indentId: indentid,
      projectId: projectcode,
      tenantId,
      toDate: todate,
      empId: employeeId,
      processCode: isInternal == 1 ? '8' : '5',
    }

    setIndentDtldisplay(true)
    setLoading(true)
    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'getIndentGroupHdr',
      requestData: props,
    })
    if (httpgetdetails.responseCode === '200') {
      const updatedData =
        httpgetdetails.responseData &&
        httpgetdetails.responseData.map((data, ind) => {
          return {
            ...data,
            sno: ind + 1,
          }
        })
      setHdretrievedata(updatedData)
      console.log('refreshed data::', updatedData)
    } else {
      setHdretrievedata([])
      messageReturn(619)
    }
    setLoading(false)
  }

  const handleGetDetails = () => {
    const formData = form.getFieldsValue()
    const updatedFormData = {
      ...formData,
      Projectcode: projectval,
      FromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
      ToDate: moment(defaultToDate).format('YYYY-MM-DD'),
      isTailview,
    }
    handleGetIndentformDetails(updatedFormData)
  }

  const handleGetIndentformDetails = async formData => {
    if (formData.IndentCodeDP !== undefined && formData.Projectcode !== undefined) {
      const props = {
        fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
        indentId: formData.IndentCodeDP,
        projectId: formData.Projectcode,
        tenantId,
        toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
        empId: employeeId,
        processCode: isInternal == 1 ? '8' : '5',
      }

      setIndentDtldisplay(true)
      setLoading(true)
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
        setHdretrievedata(updatedData)
      } else {
        setHdretrievedata([])
        messageReturn(619)
      }
      setLoading(false)
    } else {
      onloadretrive()
      // setIndentDtldisplay(false)
      // message.error('Select Fields (*) Marked Mandatory')
    }
  }

  const onloadretrive = async () => {
    const props = {
      fromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
      indentId: 'getAll',
      projectId: projectval,
      tenantId,
      toDate: moment(defaultToDate).format('YYYY-MM-DD'),
      empId: employeeId,
      processCode: isInternal == 1 ? '8' : '5',
    }

    setIndentDtldisplay(true)
    setLoading(true)
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
      setHdretrievedata(updatedData)
    } else {
      setHdretrievedata([])
      messageReturn(619)
    }
    setLoading(false)
  }

  const handleGetIndentDetails = async () => {
    const formData = form.getFieldsValue()

    if (formData.IndentCodeDP !== undefined) {
      const props = {
        fromDate: moment(defaultFromDate).format('YYYY-MM-DD'),
        indentId: formData.IndentCodeDP,
        projectId: projectval,
        tenantId,
        toDate: moment(defaultToDate).format('YYYY-MM-DD'),
        empId: employeeId,
        processCode: isInternal == 1 ? '8' : '5',
      }

      setIndentDtldisplay(true)
      setLoading(true)
      const httpgetdetails = await IndentGroupgetDetails({
        requestPath: 'getIndentGroupHdr',
        requestData: props,
      })
      if (httpgetdetails.responseCode === '200') {
        const updatedData =
          httpgetdetails.responseData &&
          httpgetdetails.responseData.map((data, ind) => {
            return {
              ...data,
              sno: ind + 1,
            }
          })
        setHdretrievedata(updatedData)
      } else {
        setHdretrievedata([])
        messageReturn(619)
      }
      setLoading(false)
    } else {
      // setIndentDtldisplay(false)
      // message.error('Select Fields (*) Marked Mandatory')
      onloadretrive()
    }
  }

  const handleClear = () => {
    setHdretrievedata([])
    setIndentDtldisplay(false)
  }

  const showModal = () => {
    setAddmodalvisible(true)
  }

  return (
    <div className="mt-3" style={{ overflowX: 'auto' }}>
      <Card style={{ width: '100%' }} title={!isTailview ? 'Indent Group' : null}>
        {isTailview ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h5>Indent Group</h5>
              {/* {isInternal == 1 ? null : ( */}
              <ButtonComponent
                text="Create Indent Group"
                type="primary"
                icon={<PlusOutlined style={{ color: 'white' }} />}
                onClick={showModal}
              />
              {/* )} */}

              {addmodalvisible && (
                <AddIndentGroup
                  submit={handleSubmit}
                  handleCancel={handleCancel}
                  isModalVisible={addmodalvisible}
                  isTailview={isTailview}
                  // ProjectCode={projectval}
                />
              )}
            </div>
            {/* <Tailviewfields onGetDetails={handleGetDetails} onClear={handleClear} getIndent="1" istileDropdown={tiledropdown} isTailview={isTailview} isCommonDropdownval={commondropdownval} /> */}

            <Form form={form}>
              <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <Form.Item
                    name="IndentCodeDP"
                    label={
                      <span>
                        Indent<span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    }
                    style={{ width: '298px' }}
                  >
                    <Select defaultValue="Get All" placeholder="Select Indent">
                      {indentList?.map(item => (
                        <Option key={item.indentId} value={item.indentId}>
                          {item.indentCode}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  // marginTop: '10px',
                }}
              >
                <Button type="primary" onClick={handleGetDetails}>
                  Get details
                </Button>
                <Button type="primary" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </Form>
            <div style={{ display: indentDtldisplay ? 'block' : 'none' }}>
              <Row>
                <Divider orientation="left">Indent Group Detail</Divider>
              </Row>
              <Skeleton loading={loading} active>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Input.Search
                    placeholder="Search..."
                    allowClear
                    enterButton
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 450 }}
                  />
                </div>
                <div>
                  <Table
                    columns={columns}
                    dataSource={searchedData}
                    scroll={{ y: 500, x: 800 }}
                    onChange={handleChange}
                    exportableProps={{
                      fileName: `IndentGroup_${currentDateTime}`,
                      btnProps: {
                        type: 'primary',
                        icon: <FileExcelOutlined />,
                        children: <span>Export to CSV</span>,
                      },
                    }}
                    pagination={{
                      pageSizeOptions: ['10', '20', '30', '50', [hdretrievedata.length]],
                      showSizeChanger: true,
                      defaultPageSize: 10,
                    }}
                    bordered
                  />
                </div>
              </Skeleton>
            </div>
          </>
        ) : null}
        {detailCard ? (
          <ModalPopup
            isModalVisible={detailCard}
            FieldsComponent={FieldsComponent}
            text={`Indent Group Details - ${groupName}`}
            onCancel={() => {
              setDetailCard(false)
              handleGetIndentDetails()
            }}
            width="900"
          />
        ) : null}

        {poModalvisible ? (
          <ViewPoModal
            isModalVisible={poModalvisible}
            text="Indent Group Details"
            onCancel={() => {
              setPOmodalvisible(false)
            }}
            HdrId={hdrdata}
            width="900"
          />
        ) : null}

        {scsmodalvisible ? (
          <SupCompState
            componentData={singleRecord}
            visibling={scsmodalvisible}
            ProcessCode1={isInternal == 1 ? '8' : '5'}
            onmodalCancel={() => {
              setScsmodalvisible(false)
              handleGetIndentDetails()
            }}
          />
        ) : null}
      </Card>
    </div>
  )
}

export default IndentGroupComponent
