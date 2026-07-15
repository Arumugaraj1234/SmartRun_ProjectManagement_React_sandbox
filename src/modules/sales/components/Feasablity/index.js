import React from 'react'
// import ApproveOrReject from 'components/common/ApproveRejectBtnComponent'
import EnquiryValidation from 'components/common/DocumentUploadManagement'

const Feasablity = () => {
  // const refId = ''
  // const refDoctTyp = ''
  // const tenId = ''

  // const savedetail = () => {
  //   console.log('Save function')
  // }
  return (
    <div>
      <EnquiryValidation componenttoRender="sales" type="Sales" />
      {/* <ApproveOrReject refId={refId} refDoctTyp={refDoctTyp} tenId={tenId} component="sales" /> */}
    </div>
  )
}

export default Feasablity
