import React from 'react'
import EnquiryValidation from 'components/common/DocumentUploadManagement'

const projectDap = () => {
  const savedetail = () => {
    console.log('Save function')
  }
  return (
    <div>
      <EnquiryValidation
        componenttoRender="project"
        type="Projects"
        uploadDocType="DC036"
        insertfunc={savedetail}
      />
    </div>
  )
}

export default projectDap
