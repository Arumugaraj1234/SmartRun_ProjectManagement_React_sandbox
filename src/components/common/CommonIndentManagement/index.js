import React from 'react'
import { Card } from 'antd'
import IndentManagement from '../IndentManagement'

const CommonIndentManagement = () => {
  const data = {
    createindent: true,
    module: 'common',
    processCode: '8',
    stgCode: 'STG044',
    docType: 'DC018',
  }
  return (
    <div>
      <Card>
        <IndentManagement componentdata={data} />
      </Card>
    </div>
  )
}

export default CommonIndentManagement
