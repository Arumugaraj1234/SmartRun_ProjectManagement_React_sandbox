import React from 'react'
import BackButtonComponent from 'components/common/BackBtnComponent'
import IndentGroupComponent from '../IndentGroup'

const purchaseJustification = () => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <IndentGroupComponent isTailview />
      <div>
        <BackButtonComponent componentToRender="scm" />
      </div>
    </div>
  )
}

export default purchaseJustification
