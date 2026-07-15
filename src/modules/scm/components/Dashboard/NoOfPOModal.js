import React, { useEffect, useState } from 'react'
import { Table, Button, Input } from 'antd'
import moment from 'moment'
import store from 'store'
import { FileExcelOutlined } from '@ant-design/icons'
import InspectionReportService from 'services/Quality/InspectionReport'
import currentDateTime from '../../../../currentDateTime'

const NoOfPOModal = ({ selectedMonth, project, check }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  const processDoc = store.get('processDoc')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getProjectDataDtls()
  }, [])

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }

  const getProjectDataDtls = async () => {
    const props = {
      tenantId,
      pmId: processDoc != null ? processDoc : 5,
      projectId: project,
      monthYear: moment(selectedMonth).format('MM-YYYY'),
      lifeSpan: check ? '1' : '0',
      empId,
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getNumberOfPoDrill',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const indentCode1 = []
  const poCode1 = []
  const vendor1 = []
  const vendorCate1 = []
  const productCode1 = []
  const description1 = []
  const specification1 = []
  const expectedDeliveryDate1 = []
  const projectId1 = []
  const poDate1 = []
  const indentType1 = []
  const station1 = []
  const subAssy1 = []

  projectData.map(h => {
    return indentCode1.push(h.indentCode)
  })

  projectData.map(h => {
    return poCode1.push(h.poNumber)
  })

  projectData.map(h => {
    return vendor1.push(h.vendor)
  })
  projectData.map(h => {
    return vendorCate1.push(h.venCategory)
  })

  projectData.map(h => {
    return productCode1.push(h.productCode)
  })
  projectData.map(h => {
    return description1.push(h.description)
  })

  projectData.map(h => {
    return specification1.push(h.specification)
  })

  projectData.map(h => {
    return expectedDeliveryDate1.push(h.expectedDeliveryDate)
  })
  projectData.map(h => {
    return indentType1.push(h.indentTypeDesc)
  })
  projectData.map(h => {
    return station1.push(h.station)
  })
  projectData.map(h => {
    return subAssy1.push(h.subAssy)
  })

  projectData.map(h => {
    return poDate1.push(h.poDate)
  })

  projectData.map(h => {
    return projectId1.push(h.projectCode)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const indentCode2 = indentCode1.filter(distinctval)
  const poCode2 = poCode1.filter(distinctval)
  const vendor2 = vendor1.filter(distinctval)
  const vendorCate2 = vendorCate1.filter(distinctval)
  const productCode2 = productCode1.filter(distinctval)
  const description2 = description1.filter(distinctval)
  const specification2 = specification1.filter(distinctval)
  const expectedDeliveryDate2 = expectedDeliveryDate1.filter(distinctval)
  const poDate2 = poDate1.filter(distinctval)
  const projectId2 = projectId1.filter(distinctval)
  const indentType2 = indentType1.filter(distinctval)
  const station2 = station1.filter(distinctval)
  const subAssy2 = subAssy1.filter(distinctval)

  const indentCode3 = []
  const poCode3 = []
  const vendor3 = []
  const vendorCate3 = []
  const productCode3 = []
  const description3 = []
  const specification3 = []
  const expectedDeliveryDate3 = []
  const poDate3 = []
  const projectId3 = []
  const indentType3 = []
  const station3 = []
  const subAssy3 = []

  projectId2.map(element => {
    return projectId3.push({
      text: element,
      value: element,
    })
  })
  poDate2.map(element => {
    return poDate3.push({
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
  poCode2.map(element => {
    return poCode3.push({
      text: element,
      value: element,
    })
  })
  vendor2.map(element => {
    return vendor3.push({
      text: element,
      value: element,
    })
  })
  vendorCate2.map(element => {
    return vendorCate3.push({
      text: element,
      value: element,
    })
  })
  productCode2.map(element => {
    return productCode3.push({
      text: element,
      value: element,
    })
  })

  description2.map(element => {
    return description3.push({
      text: element,
      value: element,
    })
  })
  specification2.map(element => {
    return specification3.push({
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

  expectedDeliveryDate2.map(element => {
    return expectedDeliveryDate3.push({
      text: element,
      value: element,
    })
  })

  const projectColumns = [
    {
      title: 'Project No',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectId3,
      filteredValue: filterData.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
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
      title: 'Indent No',
      dataIndex: 'indentCode',
      key: 'indentCode',
      filters: indentCode3,
      filteredValue: filterData.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
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
      title: 'Part No',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: productCode3,
      filteredValue: filterData.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      filters: description3,
      filteredValue: filterData.description,
      onFilter: (value, record) => record?.description === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      filters: specification3,
      filteredValue: filterData.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: text => (text ? parseInt(text, 10) : '0'),
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor',
      key: 'vendor',
      filters: vendor3,
      filteredValue: filterData.vendor,
      onFilter: (value, record) => record?.vendor === value,
    },
    {
      title: 'Vendor Category',
      dataIndex: 'venCategory',
      key: 'venCategory',
      filters: vendorCate3,
      filteredValue: filterData.venCategory,
      onFilter: (value, record) => record?.venCategory === value,
    },
    {
      title: 'PO No',
      dataIndex: 'poNumber',
      key: 'poNumber',
      filters: poCode3,
      filteredValue: filterData.poNumber,
      onFilter: (value, record) => record?.poNumber === value,
    },
    {
      title: 'PO date',
      dataIndex: 'poDate',
      key: 'poDate',
      filters: poDate3,
      filteredValue: filterData.poDate,
      onFilter: (value, record) => record?.poDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Unit Rate (Rs.)',
      dataIndex: 'basicTotal',
      key: 'basicTotal',
      className: 'right-align-cell',
      render: text =>
        text
          ? parseFloat(text).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
    },
    {
      title: 'Total Value (Rs.)',
      dataIndex: 'totalValue',
      key: 'totalValue',
      className: 'right-align-cell',
      render: text =>
        text
          ? parseFloat(text).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
    },
    {
      title: 'Expected Delivery Date',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      filters: expectedDeliveryDate3,
      filteredValue: filterData.expectedDeliveryDate,
      onFilter: (value, record) => record?.expectedDeliveryDate === value,
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'PJS/PO Creator Name',
      dataIndex: 'pjsPoCreatorName',
      key: 'pjsPoCreatorName',
      render: text => text || '-',
    },
  ]

  // const handleExportCSV = () => {
  //   const csvData = projectData.map(row => {
  //     const rowData = projectColumns.map(col => {
  //       let cellValue = row[col.dataIndex]

  //       if (
  //         cellValue &&
  //         (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"'))
  //       ) {
  //         cellValue = `"${cellValue.replace(/"/g, '""')}"`
  //       }

  //       return cellValue
  //     })
  //     return rowData.join(',')
  //   })

  //   const csvContent = [projectColumns.map(col => col.title).join(','), ...csvData].join('\n')

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //   const link = document.createElement('a')
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob)
  //     link.setAttribute('href', url)
  //     link.setAttribute('download', `Approved_PO_${currentDateTime}.csv`)
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
    const cleanedData = cleanupDataSource(projectData)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Approved_PO_${currentDateTime}.csv`)
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
        'Project No': escapeValue(row.projectCode),
        'Indent Type': escapeValue(row.indentTypeDesc),
        'Indent No': escapeValue(row.indentCode),
        Station: escapeValue(row.station),
        'Sub Assembly': escapeValue(row.subAssy),
        'Part No': escapeValue(row.productCode),
        Description: escapeValue(row.description),
        Specification: escapeValue(row.specification),
        Qty: escapeValue(row.qty),
        'Vendor Name': escapeValue(row.vendor),
        'Vendor Category': escapeValue(row.venCategory),
        'PO No': escapeValue(row.poNumber),
        'PO Date': escapeValue(row.poDate ? moment(row.poDate).format('DD-MMM-YYYY') : ''),
        'Unit Rate (Rs.)': escapeValue(
          row.basicTotal
            ? parseFloat(row.basicTotal).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '',
        ),
        'Total Value (Rs.)': escapeValue(
          row.totalValue
            ? parseFloat(row.totalValue).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '',
        ),
        'Expected Delivery Date': escapeValue(
          row.expectedDeliveryDate ? moment(row.expectedDeliveryDate).format('DD-MMM-YYYY') : '',
        ),
        'PJS/PO Creator Name': escapeValue(row.pjsPoCreatorName || ''),
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
          // exportableProps={{
          //   fileName: `Material_Inward_${currentDateTime}`,
          //   btnProps: {
          //     type: 'primary',
          //     icon: <FileExcelOutlined />,
          //     children: <span>Export to CSV</span>,
          //   },
          // }}
          scroll={{ y: 300 }}
          onChange={handleDataChange}
        />
      </div>
    </>
  )
}

export default NoOfPOModal
