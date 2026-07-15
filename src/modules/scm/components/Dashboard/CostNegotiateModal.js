import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Table } from 'antd'
import moment from 'moment'
import store from 'store'
import InspectionReportService from 'services/Quality/InspectionReport'
import currentDateTime from 'currentDateTime'
import { FileExcelOutlined } from '@ant-design/icons'

const CostNegotiateModal = ({ selectedMonth, project, check }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getProjectDataDtls()
  }, [])

  const getProjectDataDtls = async () => {
    const props = {
      tenantId,
      pmId: '5',
      projectId: project,
      monthYear: moment(selectedMonth).format('MM-YYYY'),
      lifeSpan: check ? '1' : '0',
      empId,
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getPoInitalValue',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const poNumber1 = []
  const vendorName1 = []
  const podate1 = []
  const indentBasicTotal1 = []
  const totalValue1 = []
  const potype1 = []
  const indentCode1 = []
  const station1 = []
  const subAssy1 = []
  const indentType1 = []

  projectData.map(h => {
    return poNumber1.push(h.poNumber)
  })

  projectData.map(h => {
    return potype1.push(h.poType)
  })

  projectData.map(h => {
    return vendorName1.push(h.vendorName)
  })
  projectData.map(h => {
    return podate1.push(h.poDate)
  })

  projectData.map(h => {
    return indentBasicTotal1.push(h.indentBasicTotal)
  })

  projectData.map(h => {
    return totalValue1.push(h.totalValue)
  })
  projectData.map(h => {
    return station1.push(h.station)
  })
  projectData.map(h => {
    return subAssy1.push(h.subAssy)
  })
  projectData.map(h => {
    return indentCode1.push(h.indentCode)
  })
  projectData.map(h => {
    return indentType1.push(h.indentTypeDesc)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const poNumber2 = poNumber1.filter(distinctval)
  const vendorName2 = vendorName1.filter(distinctval)
  const podate2 = podate1.filter(distinctval)
  const indentBasicTotal2 = indentBasicTotal1.filter(distinctval)
  const totalValue2 = totalValue1.filter(distinctval)
  const potype2 = potype1.filter(distinctval)
  const indentCode2 = indentCode1.filter(distinctval)
  const station2 = station1.filter(distinctval)
  const subAssy2 = subAssy1.filter(distinctval)
  const indentType2 = indentType1.filter(distinctval)

  const poNumber3 = []
  const vendorName3 = []
  const podate3 = []
  const indentBasicTotal3 = []
  const totalValue3 = []
  const potype3 = []
  const indentCode3 = []
  const indentType3 = []
  const station3 = []
  const subAssy3 = []

  poNumber2.map(element => {
    return poNumber3.push({
      text: element,
      value: element,
    })
  })
  indentCode2.map(element => {
    return indentCode3.push({
      text: element,
      value: element,
    })
  })
  vendorName2.map(element => {
    return vendorName3.push({
      text: element,
      value: element,
    })
  })
  potype2.map(element => {
    return potype3.push({
      text: element,
      value: element,
    })
  })
  indentType2.map(element => {
    return indentType3.push({
      text: element,
      value: element,
    })
  })
  station2.map(element => {
    return station3.push({
      text: element,
      value: element,
    })
  })
  subAssy2.map(element => {
    return subAssy3.push({
      text: element,
      value: element,
    })
  })

  podate2.map(element => {
    return podate3.push({
      text: element,
      value: element,
    })
  })

  indentBasicTotal2.map(element => {
    return indentBasicTotal3.push({
      text: element,
      value: element,
    })
  })

  totalValue2.map(element => {
    return totalValue3.push({
      text: element,
      value: element,
    })
  })
  const projectColumns = [
    {
      title: 'Project No',
      dataIndex: 'projCode',
      key: 'projCode',
      // filters: project3,
      filteredValue: filterData.projCode,
      onFilter: (value, record) => record?.projCode === value,
    },
    {
      title: 'Indent No',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: indentCode3,
      filteredValue: filterData.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
    },
    {
      title: 'Indent Type',
      dataIndex: 'indentTypeDesc',
      key: 'indentTypeDesc',
      filters: indentType3,
      filteredValue: filterData.indentTypeDesc,
      onFilter: (value, record) => record?.indentTypeDesc === value,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      filters: station3,
      filteredValue: filterData.station,
      onFilter: (value, record) => record?.station === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subAssy',
      key: 'subAssy',
      filters: subAssy3,
      filteredValue: filterData.subAssy,
      onFilter: (value, record) => record?.subAssy === value,
    },
    {
      title: 'PO No',
      dataIndex: 'poNumber',
      key: 'poNumber',
      filters: poNumber3,
      filteredValue: filterData.poNumber,
      onFilter: (value, record) => record?.poNumber === value,
    },

    {
      title: 'PO Date',
      dataIndex: 'poDate',
      key: 'poDate',
      filters: podate3,
      filteredValue: filterData.poDate,
      onFilter: (value, record) => record?.poDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'PO Type',
      dataIndex: 'poType',
      key: 'poType',
      filters: [
        { text: 'Domestic', value: '1' },
        { text: 'Import', value: '2' },
        { text: 'Service', value: '3' },
      ],
      filteredValue: filterData.poType || null,
      onFilter: (value, record) => record?.poType === value,
      render: (text, record) => {
        if (record.poType === '0') {
          return (
            <Select style={{ width: '100%' }} placeholder="Select PO Type">
              <Select.Option value="1">Domestic</Select.Option>
              <Select.Option value="2">Import</Select.Option>
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
      filteredValue: filterData.vendorName,
      onFilter: (value, record) => record?.vendorName === value,
    },

    {
      title: 'Delivery Location',
      dataIndex: 'deliveryLocation',
      key: 'deliveryLocation',
      // filters: location3,
      filteredValue: filterData.deliveryLocation,
      onFilter: (value, record) => record?.deliveryLocation === value,
    },
    {
      title: 'PO Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      filters: podate3,
      filteredValue: filterData.totalValue,
      onFilter: (value, record) => record?.totalValue === value,
    },
    {
      title: 'Initial Price',
      dataIndex: 'indentBasicTotal',
      key: 'indentBasicTotal',
      filters: podate3,
      filteredValue: filterData.indentBasicTotal,
      onFilter: (value, record) => record?.indentBasicTotal === value,
    },
    {
      title: 'Final Price',
      dataIndex: 'indentFinalTotal',
      key: 'indentFinalTotal',
      filters: podate3,
      filteredValue: filterData.indentFinalTotal,
      onFilter: (value, record) => record?.indentFinalTotal === value,
    },
    {
      title: 'Cost Savings',
      dataIndex: 'diffrence',
      key: 'diffrence',
      filters: podate3,
      filteredValue: filterData.diffrence,
      onFilter: (value, record) => record?.diffrence === value,
    },
  ]
  const handleDataChange = (page, filters) => {
    setFilterData(filters)
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
    const cleanedData = cleanupDataSource(projectData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Cost_Negotiate_Value_${currentDateTime}.csv`)
  }
  const cleanupDataSource = dataSource => {
    const poTypeMap = {
      '1': 'Domestic',
      '2': 'Import',
      '3': 'Service',
    }

    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value ?? ''
      }

      return {
        'Project No': escapeValue(row.projCode),
        'Indent No': escapeValue(row.indentCode),
        'Indent Type': escapeValue(row.indentTypeDesc),
        Station: escapeValue(row.station),
        'Sub Assenbly': escapeValue(row.subAssy),
        'PO No': escapeValue(row.poNumber),
        'PO Date': row.poDate ? moment(row.poDate).format('DD-MMM-YYYY') : '',
        'PO Type': escapeValue(poTypeMap[row.poType] || ''),
        'Vendor Name': escapeValue(row.vendorName),
        'Delivery Location': escapeValue(row.deliveryLocation),
        'PO Total Value': escapeValue(row.totalValue),
        'Initial Price': escapeValue(row.indentBasicTotal),
        'Final Price': escapeValue(row.indentFinalTotal),
        'Cost Savings': escapeValue(row.diffrence),
      }
    })
  }

  const searchedData = projectData.filter(item => {
    if (!searchText) return true
    return Object.values(item).some(value =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    )
  })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={() => handleExportCSV()}
          style={{ marginTop: '10px' }}
        >
          Export to CSV
        </Button>
        <Input.Search
          placeholder="Search..."
          allowClear
          enterButton
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 450 }}
        />
      </div>
      <div className="custom_antd_Table">
        <Table
          dataSource={searchedData}
          columns={projectColumns}
          size="small"
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [projectData?.length]],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          scroll={{ y: 300 }}
          onChange={handleDataChange}
        />
      </div>
    </>
  )
}

export default CostNegotiateModal
