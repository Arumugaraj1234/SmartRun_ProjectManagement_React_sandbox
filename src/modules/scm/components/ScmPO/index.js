import React from 'react'
import BackButtonComponent from 'components/common/BackBtnComponent'
import Podetail from '../Podetail'

const ScmPO = () => {
  return (
  
    <div>
      <Podetail isTailview />
      <div>
        <BackButtonComponent componentToRender="scm" />
      </div>
    </div>

  )
}

export default ScmPO
