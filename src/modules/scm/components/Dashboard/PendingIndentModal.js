import React, { useEffect, useState } from 'react'
import { Table, Button, Input } from 'antd'
import moment from 'moment'
import store from 'store'
import { FileExcelOutlined } from '@ant-design/icons'
import InspectionReportService from 'services/Quality/InspectionReport'
import currentDateTime from '../../../../currentDateTime'

const PendingIndentModal = ({ selectedMonth, project, check }) => {
  const [projectData, setProjectData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [searchText, setSearchText] = useState('')

  const empId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  useEffect(() => {
    getProjectDataDtls()
  }, [])

  const handleDataChange = (page, filters) => {
    setFilterData(filters)
  }
  const getProjectDataDtls = async () => {
    const props = {
      empId,
      tenantId,
      pmId: '5',
      projectId: project,
      monthYear: moment(selectedMonth).format('MM-YYYY'),
      lifeSpan: check ? '1' : '0',
    }

    const httpresponse = await InspectionReportService({
      requestPath: 'getIndentByNotAvailablePO',
      requestData: props,
    })
    if (httpresponse.responseCode === '200') {
      const updatedData = httpresponse.responseData.map((item, index) => {
        const data = {
          sno: index + 1,
          deliveryData:
            item.deliveryDate != null ? `${moment(item.deliveryDate).format('DD-MMM-YYYY')}` : '-',
          ...item,
        }
        return data
      })
      setProjectData(updatedData)
      console.log(updatedData)
    } else {
      setProjectData([])
    }
  }

  const indentCode1 = []
  const productCode1 = []
  const description1 = []
  const specification1 = []
  const deliveryDate1 = []
  const project1 = []
  const indentType1 = []
  const assignBy1 = []
  const stage1 = []
  const station1 = []
  const subAssy1 = []

  projectData.map(h => {
    return indentCode1.push(h.indentCode)
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
    return deliveryDate1.push(h.deliveryData)
  })

  projectData.map(h => {
    return project1.push(h.projectCode)
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
    return assignBy1.push(h.assignedPerson)
  })

  projectData.map(h => {
    return stage1.push(h.stage)
  })

  const distinctval = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const indentCode2 = indentCode1.filter(distinctval)
  const productCode2 = productCode1.filter(distinctval)
  const description2 = description1.filter(distinctval)
  const specification2 = specification1.filter(distinctval)
  const deliveryDate2 = deliveryDate1.filter(distinctval)
  const project2 = project1.filter(distinctval)
  const indentType2 = indentType1.filter(distinctval)
  const assignBy2 = assignBy1.filter(distinctval)
  const stage2 = stage1.filter(distinctval)
  const station2 = station1.filter(distinctval)
  const subAssy2 = subAssy1.filter(distinctval)

  const productCode3 = []
  const description3 = []
  const specification3 = []
  const deliveryDate3 = []
  const project3 = []
  const assignBy3 = []
  const stage3 = []
  const indentCode3 = []
  const indentType3 = []
  const station3 = []
  const subAssy3 = []

  indentCode2.map(element => {
    return indentCode3.push({
      text: element,
      value: element,
    })
  })
  project2.map(element => {
    return project3.push({
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

  deliveryDate2.map(element => {
    return deliveryDate3.push({
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

  assignBy2.map(element => {
    return assignBy3.push({
      text: element,
      value: element,
    })
  })

  stage2.map(element => {
    return stage3.push({
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

  const projectColumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '10%',
      // render: (text, record, index) => index + 1,
    },
    {
      title: 'Project No',
      dataIndex: 'projectCode',
      key: 'projectCode',
      filters: project3,
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
      render: text => (text ? parseInt(text, 10) : '0'),
    },
    {
      title: 'Indent Line Item Assigned Person',
      dataIndex: 'assignedPerson',
      key: 'assignedPerson',
      filters: assignBy3,
      filteredValue: filterData.assignedPerson,
      onFilter: (value, record) => record?.assignedPerson === value,
    },
    {
      title: 'Expected Delivery Date',
      dataIndex: 'deliveryData',
      key: 'deliveryData',
      filters: deliveryDate3,
      filteredValue: filterData.deliveryData,
      onFilter: (value, record) => record?.deliveryData === value,
      // render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Pending Stage',
      dataIndex: 'stage',
      key: 'stage',
      filters: stage3,
      filteredValue: filterData.stage,
      onFilter: (value, record) => record?.stage === value,
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
    downloadCSV(csvData, `Pending_Indent_Details-${currentDateTime}.csv`)
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
        'S.No': escapeValue(row.sno),
        'Project No': escapeValue(row.projectCode),
        'Indent Type': escapeValue(row.indentTypeDesc),
        'Indent No': escapeValue(row.indentCode),
        Station: escapeValue(row.station),
        'Sub Assembly': escapeValue(row.subAssy),
        'Part No': escapeValue(row.productCode),
        Description: escapeValue(row.description),
        Specification: escapeValue(row.specification),
        Qty: escapeValue(row.qty ? parseInt(row.qty, 10) : '0'),
        'Assigned Person': escapeValue(row.assignedPerson),
        'Delivery Date': escapeValue(
          row.deliveryData ? moment(row.deliveryData).format('DD-MMM-YYYY') : '',
        ),
        'Pending Stage': escapeValue(row.stage),
      }
    })
  }
  // const handleExportCSV = () => {
  //   const csvData = projectData.map(row => {
  //     const rowData = projectColumns.map(col => {
  //       let cellValue = row[col.dataIndex]
  //       cellValue = String(cellValue);
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
  //     link.setAttribute('download', `Pending_Indent_${currentDateTime}.csv`)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   }
  // }

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

export default PendingIndentModal
