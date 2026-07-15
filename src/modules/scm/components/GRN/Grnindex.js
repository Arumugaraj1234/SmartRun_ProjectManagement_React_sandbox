import React, { useState, useEffect, useCallback } from 'react'
import store from 'store'
import moment from 'moment'
import { Button, Card, Row, Divider, message, Input } from 'antd'
import { Table } from 'ant-table-extensions'
import ButtonComponent from 'components/shared/ButtonComponent'
import { FileExcelOutlined, PlusOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import Grnfields from './Grnfields'
import Grndetail from './Grndetail'
import AddGrn from './AddGrn'
import currentDateTime from '../../../../currentDateTime'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const ScmGrn = () => {
  const tenantId = store.get('tenantId')
  const [grnList, setGrnList] = useState([])
  const [detailmodalvisible, setDetailmodalvisible] = useState(false)
  const [detailGrn, setDetailGrn] = useState(null)
  const [grnModal, setGrnModal] = useState(false)
  const [filtersInfo, setfilterinfo] = useState([])
  const [slctdProjectCode, setSlctdProjectCode] = useState('')
  const [slctdProjectName, setSlctdProjectName] = useState('')
  const [filteredmaterial, setfilteredmaterial] = useState([])
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

  // const distinct = (value, index, self) => self.indexOf(value) === index
  const distinct = (value, index, self) => {
    return value !== null && value !== undefined && value !== "" && self.indexOf(value) === index;
};

  const GRNcode = grnList ? grnList.map(h => h.grnCode) : []
  const GRNdate = grnList ? grnList.map(h => h.grnDate) : []
  const projectId1 = grnList ? grnList.map(h => h.projectId) : []
  const projectName1 = grnList ? grnList.map(h => h.projectName) : []
  const productCode1 = grnList ? grnList.map(h => h.productCode) : []
  const productDesc1 = grnList ? grnList.map(h => h.productDesc) : []
  const poCode1 = grnList ? grnList.map(h => h.poCode) : []
  const micode = grnList ? grnList.map(h => h.miCode) : []
  const miDate1 = grnList ? grnList.map(h => h.miDate) : []
  const vendorName1 = grnList ? grnList.map(h => h.vendorName) : []
  const invLocation1 = grnList ? grnList.map(h => h.invLocation) : []
  const createdEmpName1 = grnList ? grnList.map(h => h.createdEmpName) : []

  const filterGRNCode = GRNcode.filter(distinct)
  const filterGRNdate = GRNdate.filter(distinct)
  const projectId2 = projectId1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const productCode2 = productCode1.filter(distinct)
  const productDesc2 = productDesc1.filter(distinct)
  const poCode2 = poCode1.filter(distinct)
  const miCode = micode.filter(distinct)
  const miDate2 = miDate1.filter(distinct)
  const vendorName2 = vendorName1.filter(distinct)
  const invLocation2 = invLocation1.filter(distinct)
  const createdEmpName2 = createdEmpName1.filter(distinct)

  const FilterGRNCode = filterGRNCode.sort((a, b) => a.localeCompare(b)) .map(element => ({
    text: element,
    value: element,
  }));
  const FilterGRNdate = filterGRNdate.sort((a, b) => a.localeCompare(b)).map(element => ({
    text: element ? moment(element).format('DD-MMM-YYYY') : '',
    value: element,
  }))
  
  const projectId3 = projectId2.map(element => ({
    text: element,
    value: element,
  }))
  const projectName3 = projectName2.map(element => ({
    text: element,
    value: element,
  }))
  const productCode3 = productCode2.sort((a, b) => a.localeCompare(b)).map(element => ({
    text: element,
    value: element,
  }))
  const productDesc3 = productDesc2.sort((a, b) => a.localeCompare(b)).map(element => ({
    text: element,
    value: element,
  }))
  const poCode3 = poCode2.sort((a, b) => a.localeCompare(b)).map(element => ({
    text: element,
    value: element,
  }))
  const FilterMiCode = miCode.sort((a, b) => a.localeCompare(b)) .map(element => ({
    text: element,
    value: element,
  }));
  const miDate3 = miDate2.sort((a, b) => a.localeCompare(b)).map(element => ({
    text: element ? moment(element).format('DD-MMM-YYYY') : '',
    value: element,
  }))
  const vendorName3 = vendorName2.map(element => ({
    text: element,
    value: element,
  }))
  const invLocation3 = invLocation2.map(element => ({
    text: element,
    value: element,
  }))
  const createdEmpName3 = createdEmpName2.map(element => ({
    text: element,
    value: element,
  }))

  const FilterChange = (pagina, filters) => {
    setfilterinfo(filters)
  }

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grnCode',
      key: 'grnCode',
      filters: FilterGRNCode,
      filteredValue: filtersInfo.grnCode,
      onFilter: (value, record) => record?.grnCode === value,
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      key: 'grnDate',
      filters: FilterGRNdate,
      filteredValue: filtersInfo.grnDate,
      onFilter: (value, record) => record?.grnDate === value,
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Project Number',
      dataIndex: 'projectId',
      key: 'projectId',
      filters: projectId3,
      filteredValue: filtersInfo.projectId,
      onFilter: (value, record) => record?.projectId === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filtersInfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: productCode3,
      filteredValue: filtersInfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Material Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: productDesc3,
      filteredValue: filtersInfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'PO Number',
      dataIndex: 'poCode',
      key: 'poCode',
      filters: poCode3,
      filteredValue: filtersInfo.poCode,
      onFilter: (value, record) => record?.poCode === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
     
     },
    {
      title: 'GRN Qty.',
      dataIndex: 'grnQty',
      key: 'grnQty',
      align: 'right',
      render: text => parseInt(text, 10),
    },
    {
      title: 'Inward Code',
      dataIndex: 'miCode',
      key: 'miCode',
      filters: FilterMiCode,
      filteredValue: filtersInfo.miCode,
      onFilter: (value, record) => record?.miCode === value,
    },
    {
      title: 'Inward Date',
      dataIndex: 'miDate',
      key: 'miDate',
      filters: miDate3,
      filteredValue: filtersInfo.miDate,
      onFilter: (value, record) => record?.miDate === value,
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: vendorName3,
      filteredValue: filtersInfo.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Inward Store',
      dataIndex: 'invLocation',
      key: 'invLocation',
      filters: invLocation3,
      filteredValue: filtersInfo.invLocation,
      onFilter: (value, record) => record?.invLocation === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Inward By',
      dataIndex: 'createdEmpName',
      key: 'createdEmpName',
      filters: createdEmpName3,
      filteredValue: filtersInfo.createdEmpName,
      onFilter: (value, record) => record?.createdEmpName === value,
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => {
            showModal(record)
          }}
        >
          Details
        </Button>
      ),
    },
  ]

  const getDtls = async (formData, isVisible, slctdProjctDtls) => {
    console.log(slctdProjctDtls)
    const isMandatory =
      isVisible === '1'
        ? formData.Projectcode !== undefined && formData.PONo !== undefined
        : formData.Projectcode !== undefined
    if (isMandatory) {
      const response = await indentFileUpload({
        requestPath: 'getGrnHdrDetails',
        requestData: {
          fromDate: moment(formData.FromDate).format('YYYY-MM-DD'),
          toDate: moment(formData.ToDate).format('YYYY-MM-DD'),
          tenantId,
          projectId: formData.Projectcode,
        },
      })
      if (response?.responseCode === '200') {
        setGrnList(response?.responseData)
        const data = response?.responseData

        // data.sort((a, b) => {
        //   const getProjectNumber = (code) => {
        //     const parts = code.split('/')
        //     return parts.length >= 3 ? parts[2] : ''
        //   }
          
  
        //   const getLastNumber = (code) => {
        //     const parts = code.split('/')
        //     return parseInt(parts[parts.length - 1], 10) || 0
        //   }
  
          
        //   const projectCompare = getProjectNumber(a.poCode).localeCompare(getProjectNumber(b.poCode))
        //   if (projectCompare !== 0) {
        //     return projectCompare
        //   }
  
        //   return getLastNumber(a.poCode) - getLastNumber(b.poCode)
        // })
    
        setGrnList(data)  
        setfilteredmaterial(() =>
          data.map(e => ({
            ...e,
            grnDate: e.grnDate !== null ? dateformatter(e.grnDate) : " ",
            miDate: e.miDate !== null ? dateformatter(e.miDate) : " "
          })))
      } else {
        message.error(response?.responseMessage)
        setGrnList([])
      }
      console.log(response)
    } else {
      messageReturn(405)
    }
  }
  const dateformatter = dateStringval => {
    let returndata
    if (dateStringval) {
      const formattedDate = moment(dateStringval).format('DD-MMM-YYYY')
      returndata = formattedDate
    } else {
      returndata = 'NA'
    }
    return returndata
  }
  const showModal = record => {
    console.log('grnData---> ', record)
    setSlctdProjectCode(record.projectId)
    setSlctdProjectName(record.projectName)
    setDetailmodalvisible(true)
    setDetailGrn(record)
  }

  const AddGrnopen = () => {
    setGrnModal(true)
  }

  const handleClear = () => {
    setGrnList([])
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
      setGrnList(filtered)
    }, 300),
    [filteredmaterial],
  )
  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card
        style={{ width: '100%', marginTop: '13px' }}
        title="GRN"
        extra={
          <>
            <ButtonComponent
              text="Create GRN"
              type="primary"
              onClick={AddGrnopen}
              icon={<PlusOutlined style={{ color: 'white' }} />}
            />
          </>
        }
      >
        <Grnfields
          onGetDetails={getDtls}
          onClear={handleClear}
          grnModal={grnModal}
          showMinwardDrpDwn="0"
          isVisible="0"
          getAllEnable
        />
        {grnList.length > 0 && (
          <div>
            <Row>
              <Divider orientation="left">GRN Details</Divider>
            </Row>
            <div>
              <Input.Search
                style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
                placeholder="Search here..."
                enterButton
                // onSearch={handleSearch}
                onChange={e => handleSearch(e)}
              />
              <Table
                className="responsive-antd-tables"
                columns={columns}
                dataSource={grnList}
                handleChange={FilterChange}
                pagination={{
                  pageSizeOptions: ['10', '20', '30', '50', [grnList?.length]],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                }}
                scroll={{ y: 400 }}
                exportableProps={{
                  fileName: `GRN_${currentDateTime}`,
                  btnProps: {
                    type: 'primary',
                    icon: <FileExcelOutlined />,
                    children: <span>Export to CSV</span>,
                  },
                }}
              />
            </div>
          </div>
        )}
        {detailmodalvisible && (
          <Grndetail
            onClose={() => setDetailmodalvisible(false)}
            details={detailGrn}
            visible={detailmodalvisible}
            slctdProjectCode={slctdProjectCode}
            slctdProjectName={slctdProjectName}
          />
        )}
        {grnModal && <AddGrn onClose={() => setGrnModal(false)} visible={grnModal} />}
      </Card>
    </div>
  )
}

export default ScmGrn
