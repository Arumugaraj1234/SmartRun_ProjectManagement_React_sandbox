import React from 'react'
import { Card } from 'antd'
import CommonIndentGroupComponent from '../CommonIndentGroupComponent'

const CommonPJS = () => {
  //   const data = {
  //     createindent: true,
  //     module: 'common',
  //     processCode: '8',
  //     stgCode: 'STG044',
  //     docType: 'DC018',
  //   }
  const showTailview = true
  return (
    <div>
      <Card>
        <CommonIndentGroupComponent isTailview={showTailview} />
      </Card>
    </div>
  )
}

export default CommonPJS
