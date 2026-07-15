import React from 'react'
import IndentManagement from '../../../../components/common/IndentManagement'

const DesignIndentManagement = () => {
  const data = {
    createindent: true,
    module: 'Design',
  }
  return (
    <div>
      <IndentManagement componentdata={data} />
    </div>
  )
}

export default DesignIndentManagement
