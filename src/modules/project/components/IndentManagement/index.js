import React from 'react'
import IndentManagement from '../../../../components/common/IndentManagement'

const ProjectIndentManagement = () => {
  const data = {
    createindent: false,
    module: 'project',
  }
  return (
    <div>
      <IndentManagement componentdata={data} />
    </div>
  )
}

export default ProjectIndentManagement
