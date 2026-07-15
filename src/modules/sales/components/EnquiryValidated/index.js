import React from 'react'
import EnquiryValidationCommon from 'components/common/DocumentUploadManagement'

const EnquiryValidation = () => {
  const savedetail = () => {
    console.log('Save function')
  }
  return (
    <div>
      <EnquiryValidationCommon
        componenttoRender="sales"
        saveButtonStatus="0"
        type="Sales"
        insertfunc={savedetail}
        uploadDocType="DC035"
      />
    </div>
  )
}

export default EnquiryValidation
