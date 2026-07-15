import React, { useState } from 'react'
import { Modal, Input, Button, message } from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import store from 'store'

const NotifyApprove = ({ details, modalVisible, onCancel }) => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const approveseq = details?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.currSequence
  const cancelseq = details?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.cancelSeq
  const docGroup = details?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.docGroup
  const Processcode = details?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.processCode

  const ApproveNotification = async type => {
    setLoading(true)

    const keyareaobj = {
      tenantId,
      empId: employeeId,
      hdrId: details?.refId,
      remarks,
      currentseq: type === 1 ? approveseq : cancelseq,
      pmId:
        Processcode === null || Processcode === undefined || Processcode === ''
          ? details?.pmId
          : Processcode,
      docType: details?.docTypeCode,
      pmHdrId: details?.projectId,
      mstId: details?.mstId,
      enquiryId: details?.enquiryId || null,
      poId: details?.indentDtl?.[0]?.poId || null,
      docGroup: docGroup || null,
    }
    const response = await indentFileUpload({
      requestPath: 'getDirectApprovalDesignNotify',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      onCancel()
    } else {
      message.error(response.responseMessage)
      onCancel()
    }
    setLoading(false)
  }

  return (
    <div>
      <Modal visible={modalVisible} onCancel={onCancel} footer={null} title="Approve Notification">
        <div>
          <div className="row mb-2">
            <div className="col-sm-6 font-weight-bold d-flex justify-content-between align-items-center">
              <span>Project</span> <span>:</span>
            </div>
            <div className="col-sm-6 d-flex align-items-center">
              {`${details.projectCode} - ${details.projectName}`}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-6 font-weight-bold d-flex justify-content-between align-items-center">
              <span>Description</span> <span>:</span>
            </div>
            <div className="col-sm-6 d-flex align-items-center">{details.docTypeDesc}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-6 font-weight-bold d-flex justify-content-between align-items-center">
              <span>Reference Code</span> <span>:</span>
            </div>
            <div className="col-sm-6 d-flex align-items-center">{details.refCode}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-6 font-weight-bold d-flex justify-content-between align-items-center">
              <span> Target Cost & Actual Cost</span> <span>:</span>
            </div>
            <div className="col-sm-6 d-flex align-items-center">
              {details?.indentDtl?.[0]?.targetValue || '-'} &{' '}
              {details?.indentDtl?.[0]?.allocatedValue || '-'}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-6 font-weight-bold d-flex justify-content-between align-items-center">
              <span>Current Status</span> <span>:</span>
            </div>
            <div className="col-sm-6 d-flex align-items-center">
              {details?.indentDtl?.[0]?.docLifeCycleMstList?.[0]?.previousSeqStatusDesc || '-'}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h5>Remarks</h5>
          <Input.TextArea id="remarks_id" onChange={e => setRemarks(e.target.value)} />
          <center style={{ marginTop: '10px' }}>
            <Button
              type="primary"
              disabled={loading}
              onClick={() => {
                ApproveNotification(1)
              }}
            >
              Approve
            </Button>
            {cancelseq ? (
              <Button
                type="danger"
                className="ml-3"
                disabled={loading}
                onClick={() => {
                  ApproveNotification(0)
                }}
              >
                Previouse Stage
              </Button>
            ) : null}
          </center>
        </div>
      </Modal>
    </div>
  )
}

export default NotifyApprove
