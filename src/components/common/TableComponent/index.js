import React from 'react'
import { Table } from 'antd'

const TableComponent = ({ columns, data, scrollY, scrollX, handleChange = () => {}, rowClass }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSizeOptions: ['10', '20', '30', '50', [data?.length]],
        showSizeChanger: true,
        defaultPageSize: 10,
      }}
      onChange={handleChange}
      scroll={{ y: scrollY || 500, x: scrollX }}
      rowClassName={rowClass}
      bordered
    />
  )
}

export default TableComponent
