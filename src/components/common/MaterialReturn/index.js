import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import store from 'store'
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import ButtonComponent from 'components/shared/ButtonComponent'
import { Table } from 'ant-table-extensions'
import ModalPopup from 'components/shared/ModalPopupComponent'
import AddMaterialReturn from 'components/common/AddMaterialReturn'
import {
  Form,
  Card,
  Row,
  Divider,
  Button,
  DatePicker,
  Select,
  message,
  Input,
  Skeleton,
  Checkbox,
  Popover,
} from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import Popuptable from 'components/shared/PopuptableComponent'
import messageReturn from '_helpers/messageReturn'

const MaterialReturn = () => {
  const { TextArea } = Input
  const [projectList, setProjectList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [showaddinwardpop, setshowaddinwardpop] = useState(false)
  const [showInwardDetail, setShowInwardDetail] = useState(false)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [matrlRetrnDtls, setMatrlRetrnDtls] = useState([])
  const [filteredmaterial, setfilteredmaterial] = useState([])
  const [materlRetrnDtlPopUpVal, setMaterlRetrnDtlPopUpVal] = useState([])
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)

  const [mRHdrId, setMRHdrId] = useState('')
  const [requestBy, setRequestBy] = useState('')
  const [requestedOn, setRequestedOn] = useState('')
  const [noofProdcts, setNoofProdcts] = useState('')
  const [lastUpdtBy, setLastUpdtBy] = useState('')
  const [StatusVal, setStatus] = useState('')
  const [IsCompleted, setIsCompleted] = useState('')
  const [IsCanceled, setIsCanceled] = useState('')
  const [cancelBtnStatus, setCancelBtnStatus] = useState(false)
  const [approveBtnStatus, setApproveBtnStatus] = useState(false)
  const [slctdCurrntSeqVal, setSlctdCurrntSeqVal] = useState('')
  const [slctdIsFinalVal, setSlctdIsFinalVal] = useState('')
  const [materialRetrnTableLoader, setMaterialRetrnTableLoader] = useState(false)
  const [cancelSeqNo, setCancelSeqNo] = useState('')
  const [nextSeqNo, setNextSeqNo] = useState('')
  const [lastSeqNo, setLastSeqNo] = useState('')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  const [dtlIdList, setDtlIdList] = useState([])
  const [filtersinfo, setfilterinfo] = useState([])

  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const depCode = store.get('depCode')
  const { Option } = Select
  const [allqtyForm] = Form.useForm()
  const [remarksForm] = Form.useForm()
  const currentYear = moment().year()
  const currentMonth = moment().month() // Month index starting from 0 (January is 0)
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
  const showModal = () => {
    setIsModalVisible(true)
    // setshowaddinwardpop(true)
    setShowInwardDetail(false)
    allqtyForm.resetFields()
  }
  useEffect(() => {
    getProjectList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    allqtyForm.resetFields()
  }
  const handleCancelDtlsBtnInward = () => {
    setShowDtlTablLoading(false)
    setCancelBtnStatus(false)
    setApproveBtnStatus(false)
    setDtlIdList([])
  }
  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY HH:mm:ss')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }
  // const dateformatter = dateStringval => {
  //   const dateSp = dateStringval.split('-')
  //   const finalStr = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]}`
  //   return finalStr
  // }
  const dateformatter1 = dateStringval => {
    const splitDateandTym = dateStringval.split(' ')
    const datesp = splitDateandTym[0].split('-')
    const finalStr = `${datesp[2]}-${moment(datesp[1]).format('MMM')}-${datesp[0]} ${
      splitDateandTym[1]
    }`
    return finalStr
  }
  const getProjectList = async () => {
    const formData = allqtyForm.getFieldsValue()
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

  const getMaterialRetrnDetls = async projectCode => {
    const response = await indentFileUpload({
      requestPath: 'mrHdrRetrieve',
      requestData: {
        tenantId,
        // hdrId: '42',
        empId: employeeId,
        hdrId: projectCode,
      },
    })
    const data = response.responseData
    setMatrlRetrnDtls(() =>
      data.map(e => ({
        ...e,
        createdOn: e.createdOn !== null ? dateformatter(e.createdOn) : ' ',
        lastUpdatedBy: e.lastUpdatedBy !== null ? dateformatter(e.lastUpdatedBy) : ' ',
      })),
    )
    setfilteredmaterial(() =>
      data.map(e => ({
        ...e,
        createdOn: e.createdOn !== null ? dateformatter(e.createdOn) : ' ',
        lastUpdatedBy: e.lastUpdatedBy !== null ? dateformatter(e.lastUpdatedBy) : ' ',
      })),
    )
    setMaterialRetrnTableLoader(false)
    setCancelBtnStatus(false)
    setApproveBtnStatus(false)
  }

  const getReqstMngmntDtls = () => {
    const formvalues = allqtyForm.getFieldValue()
    if (
      formvalues.ToDate !== null &&
      formvalues.FromDate !== null &&
      formvalues.Projectcode !== undefined
    ) {
      setShowInwardDetail(true)
      setMaterialRetrnTableLoader(true)
      getMaterialRetrnDetls(formvalues.Projectcode)
    } else {
      messageReturn(405)
    }
  }

  const columns = [
    {
      title: 'MR Id',
      dataIndex: 'mrhId',
      key: 'mrhId',
    },
    {
      title: 'Request By',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Requested On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      // render: text => {
      //   let createdOn = null
      //   if (text !== null) {
      //     const spltdval = text.split(' ') || null
      //     const dateformat = `${dateformatter(spltdval[0])} ${spltdval[1]}`
      //     createdOn = dateformat
      //   } else {
      //     createdOn = '-'
      //   }
      //   return createdOn
      // },
    },
    {
      title: 'No. of Products',
      dataIndex: 'productCount',
      key: 'productCount',
    },
    {
      title: 'Type',
      dataIndex: 'returnType',
      key: 'returnType',
    },
    {
      title: 'Last Updated On',
      dataIndex: 'lastUpdatedBy',
      key: 'lastUpdatedBy',
      // render: text => {
      //   let updatedOn = null
      //   if (text !== null) {
      //     const spltdval = text.split(' ') || null
      //     const dateformat = `${dateformatter(spltdval[0])} ${spltdval[1]}`
      //     updatedOn = dateformat
      //   } else {
      //     updatedOn = '-'
      //   }
      //   return updatedOn
      // },
    },
    {
      title: 'Status',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleClickOnDetails(record)}
          />
        </div>
      ),
    },
  ]
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(materlRetrnDtlPopUpVal)) {
      return []
    }

    return materlRetrnDtlPopUpVal
      .map(item => item[key])
      .filter(distinct)
      .map(value => ({
        text: value,
        value,
      }))
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const isGroupReturn =
    materlRetrnDtlPopUpVal.length > 0 && materlRetrnDtlPopUpVal.every(item => item.msHdrId)
  const groupedDetailRows = (() => {
    const groupMap = new Map()
    materlRetrnDtlPopUpVal.forEach(item => {
      if (!groupMap.has(item.msHdrId)) {
        groupMap.set(item.msHdrId, {
          key: item.msHdrId,
          msHdrId: item.msHdrId,
          msName: item.msName,
          qty: 0,
          uomSet: new Set(),
          mrdIds: [],
          items: [],
        })
      }
      const group = groupMap.get(item.msHdrId)
      group.qty += Number(item.qty) || 0
      if (item.uomLongDesc) group.uomSet.add(item.uomLongDesc)
      group.mrdIds.push(item.mrdId)
      group.items.push(item)
    })
    return Array.from(groupMap.values()).map(group => ({
      ...group,
      uomLongDesc: Array.from(group.uomSet).join(', ') || '-',
    }))
  })()
  const cancelMRCols = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: distinctValues('productCode'),
      filteredValue: filtersinfo.productCode || null,
      onFilter: (value, record) => record?.productCode === value,
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
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      filters: distinctValues('station'),
      filteredValue: filtersinfo.station || null,
      onFilter: (value, record) => record?.station === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subAssy',
      key: 'subAssy',
      filters: distinctValues('subAssy'),
      filteredValue: filtersinfo.subAssy || null,
      onFilter: (value, record) => record?.subAssy === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
      filters: distinctValues('uomLongDesc'),
      filteredValue: filtersinfo.uomLongDesc || null,
      onFilter: (value, record) => record?.uomLongDesc === value,
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      filters: distinctValues('qty'),
      filteredValue: filtersinfo.qty || null,
      onFilter: (value, record) => record?.qty === value,
    },
    {
      title: (
        <div>
          {' '}
          <Checkbox
            style={{ display: approveBtnStatus ? 'block' : cancelBtnStatus ? 'none' : 'block' }}
            checked={dtlIdList.length === materlRetrnDtlPopUpVal.length}
            onChange={e => handleMainCheckbox(e)}
            disabled={
              filtersinfo.qty >= 0 ||
              filtersinfo.uomLongDesc >= 0 ||
              filtersinfo.subAssy >= 0 ||
              filtersinfo.station >= 0 ||
              filtersinfo.make >= 0 ||
              filtersinfo.specification >= 0 ||
              filtersinfo.productDesc >= 0 ||
              filtersinfo.productCode >= 0
            }
          />
        </div>
      ),
      dataIndex: 'key',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <Checkbox
          style={{ display: approveBtnStatus ? 'block' : cancelBtnStatus ? 'none' : 'block' }}
          checked={dtlIdList.some(item => item.mrDtlId === record.mrdId)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
  ]
  const groupItemsPopoverContent = items => (
    <Table
      size="small"
      pagination={false}
      dataSource={items}
      rowKey="mrdId"
      columns={[
        { title: 'Part Number', dataIndex: 'productCode', key: 'productCode' },
        { title: 'Description', dataIndex: 'productDesc', key: 'productDesc' },
        { title: 'UOM', dataIndex: 'uomLongDesc', key: 'uomLongDesc' },
        {
          title: 'Qty.',
          dataIndex: 'qty',
          key: 'qty',
          align: 'right',
          render: text => Number(text).toFixed(0),
        },
      ]}
    />
  )
  const groupMRCols = [
    {
      title: 'Material Group',
      dataIndex: 'msName',
      key: 'msName',
      render: (text, record) => (
        <span>
          {text}{' '}
          <Popover
            content={groupItemsPopoverContent(record.items)}
            title="Items in this group"
            trigger="click"
          >
            <InfoCircleOutlined
              style={{ marginLeft: '6px', cursor: 'pointer', color: '#1890ff' }}
            />
          </Popover>
        </span>
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      render: text => Number(text).toFixed(0),
    },
    {
      title: (
        <div>
          {' '}
          <Checkbox
            style={{ display: approveBtnStatus ? 'block' : cancelBtnStatus ? 'none' : 'block' }}
            checked={dtlIdList.length === materlRetrnDtlPopUpVal.length}
            onChange={() => handleMainCheckbox()}
          />
        </div>
      ),
      dataIndex: 'key',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <Checkbox
          style={{ display: approveBtnStatus ? 'block' : cancelBtnStatus ? 'none' : 'block' }}
          checked={record.mrdIds.every(id => dtlIdList.some(item => item.mrDtlId === id))}
          onChange={() => handleGroupCheckboxChange(record)}
        />
      ),
    },
  ]
  const handleGroupCheckboxChange = ({ mrdIds }) => {
    if (IsCanceled !== '1' && IsCompleted !== '1') {
      const allSelected = mrdIds.every(id => dtlIdList.some(item => item.mrDtlId === id))
      if (allSelected) {
        setDtlIdList(dtlIdList.filter(item => !mrdIds.includes(item.mrDtlId)))
      } else {
        const toAdd = mrdIds
          .filter(id => !dtlIdList.some(item => item.mrDtlId === id))
          .map(id => ({ mrDtlId: id }))
        setDtlIdList([...dtlIdList, ...toAdd])
      }
    }
  }
  const handleMainCheckbox = () => {
    if (IsCanceled !== '1' && IsCompleted !== '1') {
      if (dtlIdList.length !== materlRetrnDtlPopUpVal.length) {
        const id = materlRetrnDtlPopUpVal.map(item => ({ mrDtlId: item.mrdId }))
        setDtlIdList(id)
      } else {
        setDtlIdList([])
      }
    }
  }
  const handleCheckboxChange = ({ mrdId }) => {
    if (IsCanceled !== '1' && IsCompleted !== '1') {
      if (dtlIdList.some(item => item.mrDtlId === mrdId)) {
        const updatedList = dtlIdList.filter(item => item.mrDtlId !== mrdId)
        setDtlIdList(updatedList)
      } else {
        const updatedList = [...dtlIdList, { mrDtlId: mrdId }]
        setDtlIdList(updatedList)
      }
    }
  }
  const handleClickOnDetails = record => {
    if (record.documentStatusMstList !== null && record.documentStatusMstList !== undefined) {
      setSlctdIsFinalVal(record.documentStatusMstList[0].lastSeq)
      setSlctdCurrntSeqVal(record.documentStatusMstList[0].currSequence)
    } else {
      setSlctdIsFinalVal('')
      setSlctdCurrntSeqVal('')
    }

    setShowDtlTablLoading(true)
    getMtrlRetrveDtlPopUp(record.mrhId)
    setMRHdrId(record.mrhId)
    setRequestBy(record.employeeName)
    setRequestedOn(record.createdOn)
    setNoofProdcts(record.productCount)
    setLastUpdtBy(record.lastUpdatedBy)
    setStatus(record.statusDesc)
    setIsCompleted(record.isCompleted)
    setIsCanceled(record.isCanceled)
    setCancelSeqNo(record.documentStatusMstList?.[0].cancelSeq)
    setNextSeqNo(record.documentStatusMstList?.[0].nextSeq)
    setLastSeqNo(record.documentStatusMstList?.[0].lastSeq)

    // if (record.documentStatusMstList === null) {
    //   if (record.documentStatusMstList[0].cancelSeq === null) {
    //     setCancelBtnStatus(false)
    //     setApproveBtnStatus(false)
    //   } else if (record.documentStatusMstList[0].cancelSeq === '3') {
    //     setCancelBtnStatus(true)
    //     setApproveBtnStatus(false)
    //   }
    // }

    if (record.documentStatusMstList !== null) {
      // setCancelBtnStatus(false)
      // setApproveBtnStatus(true)
      if (record.documentStatusMstList?.[0].currSequence === '2') {
        if (record.isApprovee === '1') {
          setCancelBtnStatus(true)
          setApproveBtnStatus(true)
        } else {
          setCancelBtnStatus(true)
          setApproveBtnStatus(false)
        }
      }
      if (record.documentStatusMstList?.[0].currSequence === '3') {
        setCancelBtnStatus(false)
        setApproveBtnStatus(false)
      }
    }
  }

  const getMtrlRetrveDtlPopUp = async hdridval => {
    const response = await indentFileUpload({
      requestPath: 'retrieveMreturnDtlByHdr',
      requestData: {
        tenantId,
        // hdrId: projectCode,
        empId: employeeId,
        hdrId: hdridval,
      },
    })
    let data
    if (response.responseData !== null && response.responseData !== undefined) {
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
    setMaterlRetrnDtlPopUpVal(data)
    const updatedList = response?.responseData.filter(item => item.isApproved !== '0')
    const list = updatedList.map(dtl => ({ mrDtlId: dtl.mrdId }))
    setDtlIdList(list)
    setfilterinfo([])
  }
  const handleCancelMatrlStgng = async () => {
    const response = await indentFileUpload({
      requestPath: 'cancelMaterialReturnHdr',
      requestData: {
        tenantId,
        // hdrId: projectCode,
        empId: employeeId,
        hdrId: mRHdrId,
        seqNo: cancelSeqNo,
        lastSeq: lastSeqNo,
        mrDtlReqList: dtlIdList,
      },
    })
    if (response?.responseCode === '200') {
      getReqstMngmntDtls()
      message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
    }
    setShowDtlTablLoading(false)
  }
  function addRemarksSubmit() {
    setApproveRemarksCard(true)
  }
  const handleApproveMatrlStgng = async () => {
    const rmrksform = remarksForm.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'materialReturnAccept',
      requestData: {
        currentSeq: slctdCurrntSeqVal,
        empId: employeeId,
        isFinal: slctdIsFinalVal,
        mrhId: mRHdrId,
        remarks: rmrksform.remarks,
        tenantId,
      },
    })
    const responseData = await indentFileUpload({
      requestPath: 'ApproveMreturnDtls',
      requestData: {
        tenantId,
        empId: employeeId,
        hdrId: mRHdrId,
        seqNo: nextSeqNo,
        lastSeq: lastSeqNo,
        mrDtlReqList: dtlIdList,
      },
    })
    if (responseData?.responseCode === '200' && response.responseCode === '200') {
      message.success(response.responseMessage)
      setApproveRemarksCard(false)
      remarksForm.resetFields()
      getReqstMngmntDtls()
      setShowDtlTablLoading(false)
    } else {
      message.error(response.responseMessage)
    }
    // if (responseData?.responseCode === '200') {
    //   getReqstMngmntDtls()
    //   message.success(responseData?.responseMessage)
    // } else {
    //   message.error(responseData?.responseMessage)
    // }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const AddRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <h5>Add Remarks</h5>
          <Form form={remarksForm}>
            <Form.Item name="remarks">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonComponent type="primary" text="Save" onClick={() => handleApproveMatrlStgng()} />
          </div>
        </Card>
      </div>
    )
  }
  const DetailsTableComponent = () => {
    return (
      <div>
        <div className="row form_datas">
          <div className="col-md-4 col-lg-1 col-xl-1 col-sm-4">
            MR ID :<span style={{ fontWeight: 'bold' }}>{mRHdrId}</span>{' '}
          </div>
          <div className="col-md-4 col-lg-1 col-xl-2 col-sm-4">
            Request By : <span style={{ fontWeight: 'bold' }}>{requestBy}</span>{' '}
          </div>
          <div className="col-md-4 col-lg-2 col-xl-3 col-sm-4">
            Requested On : <span style={{ fontWeight: 'bold' }}>{dateformatter1(requestedOn)}</span>{' '}
          </div>
          <div
            className="col-md-4 col-lg-2 col-xl-1 col-sm-4 d-none"
            style={{ paddingRight: '0px', paddingLeft: '0px' }}
          >
            No. of Products : <span style={{ fontWeight: 'bold' }}>{noofProdcts}</span>{' '}
          </div>
          <div className="col-md-4 col-lg-2 col-xl-3 col-sm-4">
            Last Upated By :{' '}
            <span style={{ fontWeight: 'bold' }}>{dateformatter1(lastUpdtBy)}</span>{' '}
          </div>
          <div className="col-md-4 col-lg-2 col-xl-2 col-sm-4">
            Status : <span style={{ fontWeight: 'bold' }}>{StatusVal}</span>{' '}
          </div>
        </div>
        <div className="my-3">
          <Table
            columns={isGroupReturn ? groupMRCols : cancelMRCols}
            dataSource={isGroupReturn ? groupedDetailRows : materlRetrnDtlPopUpVal}
            pagination={
              // pageSizeOptions: ['10', '20', '30', '50', [materlRetrnDtlPopUpVal?.length]],
              // showSizeChanger: true,
              // defaultPageSize: 10,
              false
            }
            scroll={{ y: 400 }}
            onChange={handleChange}
          />
          <div>
            <center>
              {StatusVal && StatusVal !== 'NA' && StatusVal !== '' ? (
                <h5>Stage - {StatusVal}</h5>
              ) : (
                ''
              )}
            </center>
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '25px',
              justifyContent: 'center',
              display: 'flex',
              gap: '12px',
            }}
          >
            <Button
              type="primary"
              style={{ display: cancelBtnStatus ? 'block' : 'none' }}
              onClick={handleCancelMatrlStgng}
            >
              Cancel MR
            </Button>
            <Button
              type="primary"
              style={{ display: approveBtnStatus ? 'block' : 'none' }}
              onClick={addRemarksSubmit}
            >
              Approve
            </Button>
            <Popuptable
              onClose={() => setApproveRemarksCard(false)}
              cardLabel=""
              component={AddRemarksComponent}
              visible={approveRemarksCard}
            />
          </div>
        </div>
      </div>
    )
  }
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
      setMatrlRetrnDtls(filtered)
    }, 300),
    [filteredmaterial],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Form form={allqtyForm}>
        <Card
          style={{ width: '100%', marginTop: '13px' }}
          title="Material Return"
          extra={
            depCode === 'D06' ? (
              <ButtonComponent
                text="Material Return"
                type="primary"
                icon={<PlusOutlined style={{ color: 'white' }} />}
                onClick={showModal}
              />
            ) : null
          }
        >
          <div className="row">
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
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toUpperCase()
                      .indexOf(input.toUpperCase()) !== -1
                  }
                >
                  {projectList?.map(item => (
                    <Option key={item.projectId} value={item.projectId}>
                      {item.projectCode}-{item.customerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            <Button type="primary" onClick={getReqstMngmntDtls}>
              Get details
            </Button>
            <Button type="primary" onClick={handleClear}>
              Clear
            </Button>
          </div>
          {/* getDetailsTableResp && getDetailsTableResp.length > 0 && () */}
          <div style={{ display: showInwardDetail ? 'block' : 'none' }}>
            <Row>
              <Divider orientation="left">Material Return Details</Divider>
            </Row>
            <Skeleton active loading={materialRetrnTableLoader}>
              <div>
                <Input.Search
                  style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
                  placeholder="Search here..."
                  enterButton
                  // onSearch={handleSearch}
                  onChange={e => handleSearch(e)}
                />
                <Table
                  columns={columns}
                  dataSource={matrlRetrnDtls}
                  pagination={{
                    pageSizeOptions: ['10', '20', '30', '50', [matrlRetrnDtls?.length]],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                  }}
                  scroll={{ y: 400 }}
                />
              </div>
            </Skeleton>
          </div>
        </Card>
      </Form>
      <ModalPopup
        text="Material Return Details"
        isModalVisible={showDtlTablLoading}
        onCancel={handleCancelDtlsBtnInward}
        FieldsComponent={DetailsTableComponent}
        width={1450}
      />
      <AddMaterialReturn isModalVisible={isModalVisible} handleCancel={handleCancel} />
    </div>
  )
}

export default MaterialReturn
