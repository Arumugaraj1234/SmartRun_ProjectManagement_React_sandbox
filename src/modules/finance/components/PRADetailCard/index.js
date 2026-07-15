import React from 'react'
import { FileExcelOutlined } from '@ant-design/icons'
import { Skeleton, Divider } from 'antd'
import { Table } from 'ant-table-extensions'

const PRADetailCard = props => {
  const { resp, isLoading, tableLoading, columns } = props

  return (
    <>
      <div
        className="col-sm-12 col-xs-12 col-md-12 col-lg-12"
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <div>
          <h5>
            <Divider orientation="left">PRA Detail</Divider>
          </h5>
        </div>
        {tableLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={resp}
            exportableProps={{
              fileName: `PRA Report`,
              btnProps: {
                type: 'primary',
                icon: <FileExcelOutlined />,
                children: <span>Export to CSV</span>,
              },
            }}
            // pagination={{
            //   pageSizeOptions: ['10', '20', '30', '50' , [resp?.length]],
            //   defaultPageSize: 10,
            // }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30', '50', `${resp?.length}`],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            }}
            scroll={{ y: 500 }}
            bordered
          />
        )}
      </div>
    </>
  )
}
export default PRADetailCard
