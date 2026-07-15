import React from 'react'
import QtyCaDetails from 'modules/Quality/components/QtyCaDetails'
import BackButtonComponent from 'components/common/BackBtnComponent'

const AssyCAdetails = () => {
  return (
    <div>
      <QtyCaDetails />
      <BackButtonComponent componentToRender="assembly" />
    </div>
  )
}

export default AssyCAdetails
