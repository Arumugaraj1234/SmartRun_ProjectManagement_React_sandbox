import React from 'react'
import DocumentUploadManagement from '../../../../components/common/DocumentUploadManagement'

const FinanceUploadManagement = () => {
  const savedetail = () => {
    console.log('funtion entered')
  }
  return (
    <div>
      <DocumentUploadManagement
        componenttoRender="finance"
        type="Finance"
        uploadDocType="DC073"
        insertfunc={savedetail}
      />
    </div>
  )
}
export default FinanceUploadManagement
