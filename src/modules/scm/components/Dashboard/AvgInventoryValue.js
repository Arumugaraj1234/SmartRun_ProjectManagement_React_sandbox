import React, { useEffect, useState } from 'react'
import { Button, Input, Table } from 'antd'
import moment from 'moment'
import store from 'store'
import InspectionReportService from 'services/Quality/InspectionReport'
import { FileExcelOutlined } from '@ant-design/icons'
import currentDateTime from 'currentDateTime'

const AvgInventoryValue = ({ selectedMonth, project, check }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')
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
      pmId: '2',
      projectId: project,
      monthYear: moment(selectedMonth).format('MM-YYYY'),
      lifeSpan: check ? '1' : '0',
      empId,
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getInventoryValueDrill',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      setProjectData(httpresponse.responseData)
    } else {
      setProjectData([])
    }
  }

  const productCode1 = []
  const productDesc1 = []
  const qtyOnHand1 = []
  const costPerUnit1 = []
  const projectCode1 = []
  const make1 = []
  const uom1 = []
  const location1 = []
  const bin1 = []

  projectData.map(h => {
    return productCode1.push(h.productCode)
  })
  projectData.map(h => {
    return productDesc1.push(h.productDesc)
  })
  projectData.map(h => {
    return qtyOnHand1.push(h.qtyOnHand)
  })

  projectData.map(h => {
    return costPerUnit1.push(h.costPerUnit)
  })
  projectData.map(h => {
    return projectCode1.push(h.projectCode)
  })
  projectData.map(h => {
    return make1.push(h.make)
  })
  projectData.map(h => {
    return uom1.push(h.uom)
  })
  projectData.map(h => {
    return location1.push(h.location)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const productCode2 = productCode1.filter(distinctval)
  const productDesc2 = productDesc1.filter(distinctval)
  const qtyOnHand2 = qtyOnHand1.filter(distinctval)
  const costPerUnit2 = costPerUnit1.filter(distinctval)
  const projectCode2 = projectCode1.filter(distinctval)
  const make2 = make1.filter(distinctval)
  const uom2 = uom1.filter(distinctval)
  const location2 = location1.filter(distinctval)
  const bin2 = bin1.filter(distinctval)

  const productCode3 = []
  const productDesc3 = []
  const qtyOnHand3 = []
  const costPerUnit3 = []
  const projectCode3 = []
  const make3 = []
  const uom3 = []
  const location3 = []
  const bin3 = []

  productCode2.map(element => {
    return productCode3.push({
      text: element,
      value: element,
    })
  })

  productDesc2.map(element => {
    return productDesc3.push({
      text: element,
      value: element,
    })
  })

  qtyOnHand2.map(element => {
    return qtyOnHand3.push({
      text: element,
      value: element,
    })
  })

  costPerUnit2.map(element => {
    return costPerUnit3.push({
      text: element,
      value: element,
    })
  })

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
  make2.map(element => {
    return make3.push({
      text: element,
      value: element,
    })
  })
  uom2.map(element => {
    return uom3.push({
      text: element,
      value: element,
    })
  })
  location2.map(element => {
    return location3.push({
      text: element,
      value: element,
    })
  })
  bin2.map(element => {
    return bin3.push({
      text: element,
      value: element,
    })
  })

  const projectColumns = [
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: projectCode3,
      filteredValue: filterData?.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: productCode3,
      filteredValue: filterData.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Part Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: productDesc3,
      filteredValue: filterData.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      align: 'left',
      width: '14%',
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      align: 'left',
      width: '14%',
      filters: make3,
      filteredValue: filterData?.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      filters: uom3,
      filteredValue: filterData.uom,
      onFilter: (value, record) => record?.uom === value,
    },
    {
      title: 'Mass (Kgs)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'right',
      render: text => ({
        children: text !== null ? parseFloat(text).toLocaleString('en-IN') : '',
        props: {
          style: { textAlign: 'right' },
        },
      }),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      filters: location3,
      filteredValue: filterData.location,
      onFilter: (value, record) => record?.location === value,
    },
    {
      title: 'Bin',
      dataIndex: 'bin',
      key: 'bin',
      filters: bin3,
      filteredValue: filterData.bin,
      onFilter: (value, record) => record?.bin === value,
      render: text => text || '',
    },
    {
      title: 'Qty. on Hand',
      dataIndex: 'qtyOnHand',
      key: 'qtyOnHand',
      className: 'right-align-cell',
      filters: qtyOnHand3,
      filteredValue: filterData.qtyOnHand,
      onFilter: (value, record) => record?.qtyOnHand === value,
      render: text => (text ? parseInt(text, 10) : '0'),
    },
    {
      title: 'Cost Per. Unit',
      dataIndex: 'costPerUnit',
      key: 'costPerUnit',
      className: 'right-align-cell',
      filters: costPerUnit3,
      filteredValue: filterData.costPerUnit,
      onFilter: (value, record) => record?.costPerUnit === value,
      render: text =>
        text
          ? parseFloat(text).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '-',
    },
    {
      title: 'Inward Date',
      dataIndex: 'inwardDateTime',
      key: 'inwardDateTime',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Difference',
      dataIndex: 'inwardDateTime',
      key: 'difference',
      render: text => {
        if (!text) return '-'

        const inwardDate = moment(text)
        const today = moment()

        if (!inwardDate.isValid()) return '-'

        const diffDays = today.diff(inwardDate, 'days') // total days
        const months = Math.floor(diffDays / 30)
        const days = diffDays % 30

        if (months > 0 && days > 0) {
          return `${months} Month${months > 1 ? 's' : ''} & ${days} Day${days > 1 ? 's' : ''}`
        }
        if (months > 0) {
          return `${months} Month${months > 1 ? 's' : ''}`
        }
        if (days > 0) {
          return `${days} Day${days > 1 ? 's' : ''}`
        }
        return '0 Days'
      },
    },
  ]
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
    downloadCSV(csvData, `Avg_Inventory_Value_${currentDateTime}.csv`)
  }

  const cleanupDataSource = dataSource => {
    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"` // escape CSV special chars
        }
        return value ?? ''
      }

      // Inward Date formatting
      const inwardDate = row.inwardDateTime ? moment(row.inwardDateTime).format('DD-MMM-YYYY') : ''

      // Difference calculation (same as table render)
      let difference = '-'
      if (row.inwardDateTime) {
        const inwardDateMoment = moment(row.inwardDateTime)
        const today = moment()

        if (inwardDateMoment.isValid()) {
          const diffDays = today.diff(inwardDateMoment, 'days')
          const months = Math.floor(diffDays / 30)
          const days = diffDays % 30

          if (months > 0 && days > 0) {
            difference = `${months} Month${months > 1 ? 's' : ''} & ${days} Day${
              days > 1 ? 's' : ''
            }`
          } else if (months > 0) {
            difference = `${months} Month${months > 1 ? 's' : ''}`
          } else if (days > 0) {
            difference = `${days} Day${days > 1 ? 's' : ''}`
          } else {
            difference = '0 Days'
          }
        }
      }

      return {
        'Project Number': escapeValue(row.projectCode),
        'Part Number': escapeValue(row.productCode),
        'Part Description': escapeValue(row.productDesc),
        Specification: escapeValue(row.specification),
        Make: escapeValue(row.make),
        UOM: escapeValue(row.uom),
        'Mass (Kgs)': escapeValue(
          row.weight !== null && row.weight !== undefined
            ? parseFloat(row.weight).toLocaleString('en-IN')
            : '',
        ),
        Location: escapeValue(row.location),
        Bin: escapeValue(row.bin || ''),
        'Qty. on Hand': escapeValue(row.qtyOnHand ? parseInt(row.qtyOnHand, 10) : 0),
        'Cost Per Unit (Rs.)': escapeValue(
          row.costPerUnit
            ? parseFloat(row.costPerUnit).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '',
        ),
        'Inward Date': escapeValue(inwardDate),
        Difference: escapeValue(difference),
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

export default AvgInventoryValue
