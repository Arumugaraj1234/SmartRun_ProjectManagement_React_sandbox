import React from 'react'
import AssyInternal from '../../../../components/common/DocumentUploadManagement'

const assyInternalBuyoff = () => {
  const savedetail = () => {
    console.log('')
  }
  return (
    <div>
      <AssyInternal
        componenttoRender="assembly"
        type="Projects"
        uploadDocType="DC060"
        insertfunc={savedetail}
      />
    </div>
  )
}

export default assyInternalBuyoff
