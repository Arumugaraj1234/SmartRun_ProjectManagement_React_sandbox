import React, { useState, useEffect } from 'react'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import { FileExcelOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import currentDateTime from '../../../../currentDateTime'

const QtyTableComponent = ({ data, onClick }) => {
  const [filtersinfo, setfilterinfo] = useState([])

  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')

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

  const projectCode1 = []
  const projectName1 = []
  const hdrStatusDesc1 = []

  if (data) {
    data.map(h => {
      return projectCode1.push(h.projectCode)
    })
    data.map(h => {
      return projectName1.push(h.projectName)
    })
    data.map(h => {
      return hdrStatusDesc1.push(h.hdrStatusDesc)
    })
  }
  const projectCode3 = []
  const projectName3 = []
  const hdrStatusDesc3 = []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const projectCode2 = projectCode1.filter(distinct)
  const projectName2 = projectName1.filter(distinct)
  const hdrStatusDesc2 = hdrStatusDesc1.filter(distinct)

  projectCode2.map(element => {
    return projectCode3.push({
      text: element,
      value: element,
    })
  })
  projectName2.map(element => {
    return projectName3.push({
      text: element,
      value: element,
    })
  })
  hdrStatusDesc2.map(element => {
    return hdrStatusDesc3.push({
      text: element,
      value: element,
    })
  })

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const handleCardClick = record => {
    if (onClick) {
      onClick(record)
    }
  }

  const SaleColumns = [
    {
      title: 'Project Number',
      dataIndex: 'projectCode',
      key: 'projectCode',
      align: 'center',
      filters: projectCode3,
      filteredValue: filtersinfo.projectCode,
      onFilter: (value, record) => record?.projectCode === value,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      filters: projectName3,
      filteredValue: filtersinfo.projectName,
      onFilter: (value, record) => record?.projectName === value,
    },
    {
      title: 'Status',
      dataIndex: 'hdrStatusDesc',
      key: 'hdrStatusDesc',
      filters: hdrStatusDesc3,
      filteredValue: filtersinfo.hdrStatusDesc,
      onFilter: (value, record) => record?.hdrStatusDesc === value,
    },
    {
      title: 'Total Inspection Request',
      key: 'qtyinspectionTotal',
      dataIndex: 'qtyinspectionTotal',
      className: 'right-align-cell',
    },
    {
      title: 'Total Inspection Completed',
      dataIndex: 'qtyinspectionCompleted',
      key: 'qtyinspectionCompleted',
      className: 'right-align-cell',
    },
    {
      title: 'Action',
      key: 'taskActual',
      dataIndex: ['taskActual'],
      render: (text, record) => {
        return (
          <Button type="primary" onClick={() => handleCardClick(record)}>
            Details
          </Button>
        )
      },
    },
  ]
  return (
    <div className="card" style={isMobile ? { width: tableWidth } : { marginTop: '10px' }}>
      <div className="card-body" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
        <div style={{ marginTop: '15px' }}>
          <Table
            columns={SaleColumns}
            dataSource={data}
            exportableProps={{
              fileName: `Quality Details${currentDateTime}`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [data?.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
            scroll={{ y: 400 }}
            onChange={handleChange}
            bordered
          />
        </div>
      </div>
    </div>
  )
}

export default QtyTableComponent
