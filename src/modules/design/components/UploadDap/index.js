import React from 'react'
import EnquiryValidation from 'components/common/DocumentUploadManagement'

const UploadDap = () => {
  const savedetail = () => {
    console.log('Save function')
  }
  return (
    <div>
      <EnquiryValidation
        componenttoRender="design"
        type="Projects"
        uploadDocType="DC036"
        insertfunc={savedetail}
      />
    </div>
  )
}

export default UploadDap
