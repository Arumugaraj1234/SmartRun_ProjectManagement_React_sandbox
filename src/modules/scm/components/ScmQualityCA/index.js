import React from 'react'
import QtyCaDetails from 'modules/Quality/components/QtyCaDetails'
import BackButtonComponent from 'components/common/BackBtnComponent'

const ScmQualityCA = () => {
  return (
    <div>
      <QtyCaDetails />
      <BackButtonComponent componentToRender="scm" />
    </div>
  )
}

export default ScmQualityCA
