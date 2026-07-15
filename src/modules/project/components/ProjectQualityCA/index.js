import React from 'react'
import QtyCaDetails from 'modules/Quality/components/QtyCaDetails'
import BackButtonComponent from 'components/common/BackBtnComponent'

const ProjectQualityCA = () => {
  return (
    <div>
      <QtyCaDetails />
      <BackButtonComponent componentToRender="project" />
    </div>
  )
}

export default ProjectQualityCA