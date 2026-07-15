import React from 'react'
import BackButtonComponent from 'components/common/BackBtnComponent'
import QtyCaDetails from '../QtyCaDetails'

const QualityCA = () => {
  return (
    <div>
      <QtyCaDetails />
      <BackButtonComponent componentToRender="quality" />
    </div>
  )
}

export default QualityCA
