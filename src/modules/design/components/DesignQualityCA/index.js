import React from 'react'
import QtyCaDetails from 'modules/Quality/components/QtyCaDetails'
import BackButtonComponent from 'components/common/BackBtnComponent'

const DesignQualityCA = () => {
  return (
    <div>
      <QtyCaDetails />
      <BackButtonComponent componentToRender="design" />
    </div>
  )
}

export default DesignQualityCA