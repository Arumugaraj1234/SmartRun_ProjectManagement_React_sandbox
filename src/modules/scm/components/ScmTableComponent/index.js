import React, { useState, useEffect } from 'react'
import { FileExcelOutlined } from '@ant-design/icons'
import { Table } from 'ant-table-extensions'
import { useMediaQuery } from 'react-responsive'
import currentDateTime from '../../../../currentDateTime'
// import style from './style.module.scss';

const ScmTable = ({ columns, data , handleChange }) => {
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

  return (
    <div className="card" style={isMobile ? { width: tableWidth } : { marginTop: '10px' }}>
      <div className="card-body" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
        <div className="table" style={{ marginTop: '15px' }}>
          <Table
            columns={columns}
            dataSource={data}
            exportableProps={{
              fileName: `Project${currentDateTime}`,
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
            bordered
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default ScmTable
