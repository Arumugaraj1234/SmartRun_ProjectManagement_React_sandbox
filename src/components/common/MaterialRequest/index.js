import React from 'react'
import { Card } from 'antd'
import AssyMaterialRequest from 'modules/assembly/components/assyMaterialRequest'

const MaterialRequest = () => {
  return (
    <div>
      <Card style={{ width: '100%', marginTop: '20px' }}>
        <AssyMaterialRequest type="1" />
      </Card>
    </div>
  )
}

export default MaterialRequest
