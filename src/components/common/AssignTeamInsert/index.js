import React from 'react'
import { Table } from 'antd'

const AssignTeamInsert = ({ column, data }) => {
  return (
    <div style={{ marginTop: '5%' }}>
      <h5>Add Team Member</h5>
      <Table dataSource={data} columns={column} pagination={false} />
    </div>
  )
}

export default AssignTeamInsert
