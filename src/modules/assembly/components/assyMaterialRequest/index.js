import React, { useState, useEffect, useCallback } from 'react'
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons'
import Button from 'components/shared/ButtonComponent'
import { message, Modal, Input } from 'antd'
import { Table } from 'ant-table-extensions'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import AddNewDocument from 'modules/assembly/components/AddAssyMaterialRequest'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'
import MrFields from './MrFields'
import currentDateTime from '../../../../currentDateTime'

const AssyMaterialRequest = ({ type }) => {
  const history = useHistory()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hdrTabledata, setHdrTabledata] = useState(null)
  // const [MRCodeVal, setMRCode] = useState('')
  const [dtlTabledata, setDtlTabledata] = useState(null)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [mRHdrIdVal, setMRHdrIdVal] = useState(undefined)
  const [addMtrlBtnShworHyd, setAddMtrlBtnShworHyd] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  const [filteredmaterial, setfilteredmaterial] = useState([])
  const [tableWidth, setTableWidth] = useState('300px')
  const tenantid = store.get('tenantId')
  // const assyHdrId = store.get('AssyHdrId')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  useEffect(() => {
    if (type !== '1') {
      addMaterialReqstData()
      getRerieveData()
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 90}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const componentToRender = 'assembly'
  const handleBackClick = () => {
    const currentRoute = history.location.pathname.substring(1)
    if (componentToRender !== currentRoute) {
      history.push(`/${componentToRender}`)
    } else {
      window.location.reload()
    }
  }
  const addMaterialReqstData = async formdata => {
    const keyareaobj = {
      // hdrId: assyHdrId,
      hdrId: type === '1' ? formdata.Projectcode : store.get('ProjectID'),
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'retriveAssyResp',
      requestData: keyareaobj,
    })
    setAddMtrlBtnShworHyd(response.responseDataMessage)
  }
  const getRerieveData = async formdata => {
    // setLoading(true)
    const keyareaobj = {
      hdrId: type === '1' ? formdata.Projectcode : store.get('ProjectID'),
      tenantId: tenantid,
      requestType: '',
    }

    const response = await indentFileUpload({
      requestPath: 'getMaterialReqHdr',
      requestData: keyareaobj,
    })
    let data
    if (
      response.responseData !== null &&
      response.responseData !== undefined &&
      response.responseData.length > 0
    ) {
      if (response.responseData.length > 0) {
        // setLoading(false)
        data = response.responseData
      } else {
        // setLoading(false)
        data = []
      }
    } else {
      // setLoading(false)
      message.error(response.responseMessage)
      data = []
    }
    setHdrTabledata(() =>
      data?.map(item => ({
        ...item,
        requestedOn: moment(item.requestedOn).format('YYYY-MM-DD'),
        requestType: item.requestType === '1' ? 'Internal' : 'DC', // Update requestType based on condition
        completed: (() => {
          if (item.cancelled === '1') {
            return 'Cancelled' // If cancelled, set completed to 'Cancelled'
          }
          if (item.completed !== '0' && item.completed !== '0') {
            return 'Completed' // If completed is not '0', set it to 'Completed'
          }
          return 'Requested' // Otherwise, set it to 'Requested'
        })(),
      })),
    )
    setfilteredmaterial(() =>
      data?.map(item => ({
        ...item,
        requestedOn: moment(item.requestedOn).format('DD-MMM-YYYY'),
        requestType: item.requestType === '1' ? 'Internal' : 'DC', // Update requestType based on condition
        completed: (() => {
          if (item.cancelled === '1') {
            return 'Cancelled' // If cancelled, set completed to 'Cancelled'
          }
          if (item.completed !== '0' && item.completed !== '0') {
            return 'Completed' // If completed is not '0', set it to 'Completed'
          }
          return 'Requested' // Otherwise, set it to 'Requested'
        })(),
      })),
    )
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const requestType1 = []
  const requeston1 = []
  const requestedBy1 = []
  const mrCode1 = []
  const status1 = []
 
  if (hdrTabledata && hdrTabledata.length > 0) {
    hdrTabledata.map(h => {
      return mrCode1.push(h.mrCode)
    })
  }
  if (hdrTabledata && hdrTabledata.length > 0) {
    hdrTabledata.map(h => {
      return requestType1.push(h.requestType)
    })
  }
  if (hdrTabledata && hdrTabledata.length > 0) {
    hdrTabledata.map(h => {
      return requeston1.push(h.requestedOn)
    })
  }
  if (hdrTabledata && hdrTabledata.length > 0) {
    hdrTabledata.map(h => {
      return requestedBy1.push(h.employeeName)
    })
  }
  if (hdrTabledata && hdrTabledata.length > 0) {
    hdrTabledata.map(h => {
      return status1.push(h.completed)
    })
  }
  
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== "" && self.indexOf(value) === index;
  }
  const mrCode2 = mrCode1.filter(distinct)
  const requestType2 = requestType1.filter(distinct)
  const status2 = status1.filter(distinct)
  const employeeName2 = requestedBy1.filter(distinct)
  const requestedOn2 = requeston1.filter(distinct)

  const requestType3 = []
  const mrCode3 = []
  const status3 = []
  const requestedOn3 = []
  const employeeName3 = []

  mrCode2.map(element => {
    return mrCode3.push({
      text: element,
      value: element,
    })
  })
  requestType2.map(element => {
    return requestType3.push({
      text: element,
      value: element,
    })
  })
  status2.map(element => {
    return status3.push({
      text: element,
      value: element,
    })
  })
  requestedOn2.map(element => {
    return requestedOn3.push({
      text: moment(element).format('DD-MMM-YYYY'),
      value: element,
    })
  })
  employeeName2.map(element => {
    return employeeName3.push({
      text: element,
      value: element,
    })
  })

  // const filt = hdrTabledata?.map(item => ({
  //   ...item,
  //   requestType: item.requestType === "0" ? "DC" : "INDC"
  // }));

  // console.log(filt,"filt");

  const columns = [
    {
      title: 'MR Code',
      dataIndex: 'mrCode',
      key: 'mrCode',
      filters: mrCode3,
      filteredValue: filtersinfo.mrCode,
      onFilter: (value, record) => record?.mrCode === value,
      render: text => text,
    },
    {
      title: 'Request Type',
      dataIndex: 'requestType',
      key: 'requestType',
      filters: requestType3,
      filteredValue: filtersinfo.requestType,
      onFilter: (value, record) => record?.requestType === value,
      render: text => text,
    },
    {
      title: 'Requested On',
      dataIndex: 'requestedOn',
      key: 'requestedOn',
      filters: requestedOn3,
      filteredValue: filtersinfo.requestedOn,
      onFilter: (value, record) => record?.requestedOn === value,
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Requested By',
      dataIndex: 'employeeName',
      key: 'employeeName',
      filters: employeeName3,
      filteredValue: filtersinfo.employeeName,
      onFilter: (value, record) => record?.employeeName === value,
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
      key: 'productCount',
      className: 'right-align-cell',
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      filters: status3,
      filteredValue: filtersinfo.completed,
      onFilter: (value, record) => record?.completed === value,
      render: text => text,
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (text, record, index) => (
        <div>
          <Button
            type="primary"
            text="Details"
            onClick={() => handleClickOnDetails(record, index)}
          />
        </div>
      ),
    },
  ]

  const partNumber1 = []
  if (dtlTabledata && dtlTabledata.length > 0) {
    dtlTabledata.map(h => {
      return partNumber1.push(h.prodoctCode)
    })
  }

  const distinct1 = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== "" && self.indexOf(value) === index;
  }

  const partNumber2 = partNumber1.filter(distinct1)
  const partNumber3 = partNumber2.map(element => ({
    text: element,
    value: element,
  }))

  const distinctValues = key => {
    if (!Array.isArray(dtlTabledata)) {
      return [] // Return an empty array if dtlTabledata is not an array
    }

    return dtlTabledata
      .map(item => item[key])
      .filter(distinct1).sort((a, b) => a.localeCompare(b))
      .map(value => ({
        text: value,
        value,
      }))
  }

  const matrlReqDtlCol = [
    {
      title: 'Part Number',
      dataIndex: 'prodoctCode',
      key: 'prodoctCode',
      filters: partNumber3,
      filteredValue: filtersinfo.prodoctCode,
      onFilter: (value, record) => record?.prodoctCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: distinctValues('productDesc'),
      filteredValue: filtersinfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      filters: distinctValues('specification'),
      filteredValue: filtersinfo.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      filters: distinctValues('make'),
      filteredValue: filtersinfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uomShortDesc',
      key: 'uomShortDesc',
      filters: distinctValues('uomShortDesc'),
      filteredValue: filtersinfo.uomShortDesc,
      onFilter: (value, record) => record?.uomShortDesc === value,
    },
    {
      title: 'BIN',
      dataIndex: 'bin',
      key: 'bin',
      render: text => (text !== null ? text : ''),
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      filters: distinctValues('station'),
      filteredValue: filtersinfo.station,
      onFilter: (value, record) => record?.station === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subAssy',
      key: 'subAssy',
      filters: distinctValues('subAssy'),
      filteredValue: filtersinfo.subAssy,
      onFilter: (value, record) => record?.subAssy === value,
    },
    {
      title: 'Inventory Location',
      dataIndex: 'invenLocation',
      key: 'invenLocation',
      filters: distinctValues('invenLocation'),
      filteredValue: filtersinfo.invenLocation,
      onFilter: (value, record) => record?.invenLocation === value,
    },
    {
      title: 'Available Qty.',
      dataIndex: 'availableQty',
      key: 'availableQty',
      className: 'right-align-cell',
      render: text => Number(text).toLocaleString('en-IN'),
    },
    {
      title: 'Requested Qty.',
      dataIndex: 'requestedQty',
      key: 'requestedQty',
      className: 'right-align-cell',
      render: text => Number(text).toLocaleString('en-IN'),
    },
    {
      title: 'Issued Qty.',
      dataIndex: 'issuedQty',
      key: 'issuedQty',
      className: 'right-align-cell',
      render: text => Number(text).toLocaleString('en-IN'),
    },
  ]

  const doctype = 'DC036'
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleCancel = () => {
    getRerieveData()
    setIsModalVisible(false)
  }
  const handleSubmit = () => {
    if (false) {
      getRerieveData()
    }
  }
  const handleClickOnDetails = record => {
    // setMRCode(record.mrCode)
    getMaterialRequestDtl(record.mrHdrId)
    setMRHdrIdVal(record.mrHdrId)
  }

  const getMaterialRequestDtl = async mrhdrid => {
    setShowDtlTablLoading(true)
    const keyareaobjs = {
      hdrId: mrhdrid,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'getMaterialReqDtl',
      requestData: keyareaobjs,
    })
    let data
    if (response.responseData !== null && response.responseData !== undefined) {
      if (response.responseData.length > 0) {
        // setLoading(false)
        data = response.responseData
      } else {
        // setLoading(false)
        data = ''
      }
    } else {
      // setLoading(false)
      data = ''
    }
    setDtlTabledata(data)
  }
  const cancelMR = async () => {
    const keyareaobjs = {
      hdrId: mRHdrIdVal,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'cancelMiRequestHdr',
      requestData: keyareaobjs,
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      getRerieveData()
      setShowDtlTablLoading(false)
    } else {
      message.error(response.responseMessage)
    }
  }
  const handleCancelMatrlDtl = () => {
    setShowDtlTablLoading(false)
  }
  const handleGetDetails = formData => {
    if (
      formData.FromDate &&
      formData.ToDate &&
      formData.Projectcode &&
      formData.FromDate &&
      formData.ToDate &&
      formData.Projectcode !== ''
    ) {
      getRerieveData(formData)
      addMaterialReqstData(formData)
    } else {
      messageReturn(405)
    }
  }
  const handleClear = () => {
    setHdrTabledata([])
    setAddMtrlBtnShworHyd(false)
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
      setHdrTabledata(filtered)
    }, 300),
    [filteredmaterial],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: type && type === '1' ? '20px' : '0px',
          }}
        >
          <h5>Material Request</h5>
        </div>
        <div style={{ display: type && type === '1' ? 'block' : 'none' }}>
          {type && type === '1' ? (
            <MrFields onGetDetails={handleGetDetails} onClear={handleClear} />
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            position: 'relative',
            top: isMobile ? '0px' : '30px',
            padding: '5px',
          }}
        >
          {addMtrlBtnShworHyd === '1' ? (
            <Button
              text="Add Material Request"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={showModal}
            />
          ) : null}
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
        </div>
        {/* {hdrTabledata && hdrTabledata.length > 0 ? ( */}
        <div>
          <Table
            columns={columns}
            dataSource={hdrTabledata}
            exportableProps={{
              fileName: `Material_Requet_${currentDateTime}`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            bordered
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [hdrTabledata?.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
            scroll={{ y: 400 }}
            onChange={handleChange}
          />
          <center className="mt-3">
            <Button text="Back" onClick={handleBackClick} />
          </center>
        </div>
        {/* ) : null} */}

        <AddNewDocument
          submit={handleSubmit}
          projDoc={doctype}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      </div>
      <Modal
        title={`Material Request Detail `}
        visible={showDtlTablLoading}
        width="900"
        footer={null}
        onCancel={handleCancelMatrlDtl}
      >
        <div className="my-3" style={{ display: showDtlTablLoading ? 'block' : 'none' }}>
          <Table columns={matrlReqDtlCol} dataSource={dtlTabledata} bordered />

          {dtlTabledata &&
          dtlTabledata.length > 0 &&
          dtlTabledata[0].isCancelled === '0' &&
          dtlTabledata[0].isCompleted === '0' ? (
            <center>
              <Button text="Cancel MR" type="primary" onClick={cancelMR} />
            </center>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}

export default AssyMaterialRequest
