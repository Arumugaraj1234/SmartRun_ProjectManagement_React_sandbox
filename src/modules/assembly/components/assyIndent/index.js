import React from 'react'
import IndentManagement from '../../../../components/common/IndentManagement'

const assyIndent = () => {
  const data = {
    createindent: true,
    module: 'Assembly',
  }
  return (
    <div>
      <IndentManagement componentdata={data} />
    </div>
  )
}

export default assyIndent
