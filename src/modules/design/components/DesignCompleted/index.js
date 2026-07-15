import React from 'react'
import EnquiryValidation from 'components/common/DocumentUploadManagement'

const DesignCompleted = () => {
  const savedetail = () => {
    console.log('Save function')
  }
  return (
    <div>
      <EnquiryValidation componenttoRender="design" type="Projects" insertfunc={savedetail} />
    </div>
  )
}

export default DesignCompleted
