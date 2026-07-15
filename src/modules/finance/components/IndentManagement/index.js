import React from 'react'
import IndentManagement from '../../../../components/common/IndentManagement'

const FinanceIndentManagement = () => {
  const data = {
    createindent: false,
    module: 'finance',
  }
  return (
    <div>
      <IndentManagement componentdata={data} />
    </div>
  )
}

export default FinanceIndentManagement
