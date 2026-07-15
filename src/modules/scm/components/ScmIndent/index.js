import React from 'react'
import BackButtonComponent from 'components/common/BackBtnComponent'
import ScmIndentManagement from '../ScmIndentManagement'

const ScmIndent = () => {
  return (
    <div>
      <ScmIndentManagement isTailview />
      <div>
        <BackButtonComponent componentToRender="scm" />
      </div>
    </div>
  )
}

export default ScmIndent
