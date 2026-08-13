import React, { useState, useEffect } from 'react'
import store from 'store'
import moment from 'moment'
import { Card, Table, message } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import DcFields from './Dcfields'
import CreateDc from './CreateDc'
import Dcdetails from './Dcdetails'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const DeliveryChallan = () => {
  const tenantId = store.get('tenantId')
  const Menulistdata = store.get('MenuListData')

  const [createModal, setCreateModal] = useState(false)
  const [tableData, setTabledata] = useState([])
  const [detailpopup, setDetailpopup] = useState(false)
  const [singleDetails, setSingleDetails] = useState(null)
  const [formdatas, setFormdatas] = useState(null)
  const [filtersinfo, setfilterinfo] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call to set width on component mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getDcDetails = record => {
    setSingleDetails(record)
    setDetailpopup(true)
  }

  const fdcType = []
  const fdcDate = []
  const fdcfrom = []
  const fdcto = []
  const fpodate = []
  const fstatus = []
  const fdcmode = []

  tableData.map(h => {
    return fdcType.push(h.dcType)
  })
  tableData.map(h => {
    return fdcDate.push(h.dcDate)
  })
  tableData.map(h => {
    return fdcfrom.push(h.shippedFrom)
  })
  tableData.map(h => {
    return fdcto.push(h.deliveredTo)
  })
  tableData.map(h => {
    return fpodate.push(h.poDATE)
  })
  tableData.map(h => {
    return fstatus.push(h.isCancel)
  })
  tableData.map(h => {
    return fdcmode.push(h.dcMode)
  })

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const filtereddctype = fdcType.filter(distinct)
  const filtereddcdate = fdcDate.filter(distinct)
  const filterdcfrom = fdcfrom.filter(distinct)
  const filterdcto = fdcto.filter(distinct)
  const filteredpodate = fpodate.filter(distinct)
  const filteredstatus = fstatus.filter(distinct)
  const filtereddcmode = fdcmode.filter(distinct)

  const FDCTYPE = []
  const FILEREDDATE = []
  const FILTEREDDCFROM = []
  const FILTERDCTO = []
  const FILTEREDPODATE = []
  const FILTEREDSTATUS = []
  const FDCMODE = []

  filtereddctype.map(element => {
    return FDCTYPE.push({
      text: element,
      value: element,
    })
  })
  filtereddcdate.map(element => {
    const formattedDate = moment(element).format('DD-MMM-YYYY')
    return FILEREDDATE.push({
      text: formattedDate,
      value: element,
    })
  })
  filterdcfrom.map(element => {
    return FILTEREDDCFROM.push({
      text: element,
      value: element,
    })
  })
  filterdcto.map(element => {
    return FILTERDCTO.push({
      text: element,
      value: element,
    })
  })
  filteredpodate.map(element => {
    const formattedDate = moment(element).format('DD-MMM-YYYY')
    return FILTEREDPODATE.push({
      text: formattedDate,
      value: element,
    })
  })
  filteredstatus.map(element => {
    return FILTEREDSTATUS.push({
      text: element === '0' ? 'Created' : 'Cancelled',
      value: element,
    })
  })
  filtereddcmode.map(element => {
    return FDCMODE.push({
      text: element,
      value: element,
    })
  })

  const Columns = [
    {
      title: 'DC Code',
      dataIndex: 'dcCode',
      key: 'dcCode',
    },
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },

    {
      title: 'DC Type',
      dataIndex: 'dcType',
      key: 'dcType',
      filters: FDCTYPE,
      filteredValue: filtersinfo.dcType,
      onFilter: (value, record) => record?.dcType === value,
    },
    {
      title: 'Date',
      dataIndex: 'dcDate',
      key: 'dcDate',
      filters: FILEREDDATE,
      filteredValue: filtersinfo.dcDate,
      onFilter: (value, record) => record?.dcDate === value,
      render: text => moment(text).format('DD-MMM-YYYY') || '',
    },
    {
      title: 'Detail Count',
      dataIndex: 'dcDtlCount',
      key: 'dcDtlCount',
      render: (text, record) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          onClick={() => {
            getDcDetails(record)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              getDcDetails(record)
            }
          }}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          <span>{parseFloat(record.dcDtlCount).toLocaleString('en-IN')}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'dcMode',
      key: 'dcMode',
      filters: FDCMODE,
      filteredValue: filtersinfo.dcMode,
      onFilter: (value, record) => record?.dcMode === value,
    },
    {
      title: 'DC From Name',
      dataIndex: 'shippedFrom',
      key: 'shippedFrom',
      filters: FILTEREDDCFROM,
      filteredValue: filtersinfo.shippedFrom,
      onFilter: (value, record) => record?.shippedFrom === value,
    },
    {
      title: 'DC To Name',
      dataIndex: 'deliveredTo',
      key: 'deliveredTo',
      filters: FILTERDCTO,
      filteredValue: filtersinfo.deliveredTo,
      onFilter: (value, record) => record?.deliveredTo === value,
    },
    {
      title: 'PO Date',
      dataIndex: 'poDATE',
      key: 'poDATE',
      filters: FILTEREDPODATE,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : ''),
      filteredValue: filtersinfo.poDATE,
      onFilter: (value, record) => record?.poDATE === value,
    },
    {
      title: `Total ${Menulistdata[0].currency}`,
      dataIndex: 'totalValue',
      key: 'totalValue',
      align: 'right',
      render: text => text || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isCancel',
      key: 'isCancel',
      filters: FILTEREDSTATUS,
      filteredValue: filtersinfo.isCancel,
      onFilter: (value, record) => record?.isCancel === value,
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{text === '0' ? 'Created' : 'Cancelled'}</div>
          <ButtonComponent
            onClick={() => downloadreport(record)}
            icon={<DownloadOutlined />}
            type="primary"
          />
        </div>
      ),
    },
  ]

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const downloadreport = async record => {
    const reqdata = {
      dcId: record.dcID,
      tenantId,
      key: 'deliveryChallan',
    }
    const response = await indentFileUpload({
      requestPath: 'getDeliveryChallanReportPdf',
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

  // const getFormattedValue = value => {
  //   if (!value) {
  //     return ''
  //   }
  //   const inputValue = value.replace(/[^\d.]/g, '')
  //   const parsedValue = inputValue.trim() === '' ? 0 : parseFloat(inputValue)
  //   const formattedValue = parsedValue.toLocaleString('en-IN', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   })
  //   return formattedValue
  // }

  const closepopup = () => {
    setCreateModal(false)
    if (formdatas) {
      getDetails(formdatas)
    }
  }
  const closedetailpopup = () => {
    setDetailpopup(false)
    getDetails(formdatas)
  }

  const openpopup = () => {
    setCreateModal(true)
  }

  const getDtls = async formData => {
    getDetails(formData)
    setFormdatas(formData)
    // if (formData.Projectcode) {
    //   const response = await indentFileUpload({
    //     requestPath: 'getAllDcHdrByPmId',
    //     requestData: {
    //       tenantId,
    //       pmHdrId: formData.Projectcode,
    //     },
    //   })
    //   if (response?.responseData) {
    //     setTabledata(response?.responseData || [])
    //   }
    // } else {
    //   setTabledata([])
    // }
  }

  const getDetails = async data => {
    if (data.Projectcode) {
      const response = await indentFileUpload({
        requestPath: 'getAllDcHdrByPmId',
        requestData: {
          tenantId,
          pmHdrId: data.Projectcode,
        },
      })
      if (response?.responseCode === '200') {
        setTabledata(response?.responseData || [])
      } else {
        setTabledata([])
        message.error(response?.responseMessage)
      }
    } else {
      messageReturn(405)
      setTabledata([])
    }
  }
  const handleClear = () => {
    setTabledata([])
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card
        style={{ width: '100%', marginTop: '13px' }}
        title="Delivery Challan"
        extra={
          <ButtonComponent
            text="New Delivery Challan"
            type="primary"
            onClick={openpopup}
            icon={<PlusOutlined style={{ color: 'white' }} />}
          />
        }
      >
        <DcFields onGetDetails={getDtls} onClear={handleClear} getAllEnable />
        <div style={{ marginTop: '20px' }}>
          {tableData.length > 0 ? (
            <div>
              <Table
                columns={Columns}
                dataSource={tableData}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [tableData?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                onChange={handleChange}
              />
            </div>
          ) : null}
        </div>

        {createModal && <CreateDc onClose={closepopup} visible={createModal} />}
        {detailpopup && (
          <Dcdetails onClose={closedetailpopup} visible={detailpopup} data={singleDetails} />
        )}
      </Card>
    </div>
  )
}

export default DeliveryChallan
