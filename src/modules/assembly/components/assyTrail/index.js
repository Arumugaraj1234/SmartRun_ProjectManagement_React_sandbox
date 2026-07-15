import React from 'react'
import AssyTrail from '../../../../components/common/DocumentUploadManagement'

const assyTrail = () => {
  const savedetail = () => {
    console.log('funtion entered')
  }
  return (
    <div>
      <AssyTrail
        componenttoRender="assembly"
        type="Projects"
        uploadDocType="DC059"
        insertfunc={savedetail}
      />
    </div>
  )
}

export default assyTrail
