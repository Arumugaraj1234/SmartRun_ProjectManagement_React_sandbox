import React from 'react'
// import ApproveOrReject from 'components/common/ApproveRejectBtnComponent'
import EnquiryValidation from 'components/common/DocumentUploadManagement'

const UploadOffer = () => {
  // const refId = ''
  // const refDoctTyp = ''
  // const tenId = ''

  return (
    <div>
      <EnquiryValidation componenttoRender="sales" type="Sales" Value />
      {/* <ApproveOrReject refId={refId} refDoctTyp={refDoctTyp} tenId={tenId} component="sales" /> */}
    </div>
  )
}

export default UploadOffer
