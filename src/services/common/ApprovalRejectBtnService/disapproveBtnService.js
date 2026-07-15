import serverApi from 'services/serverApi'
import store from 'store'

const disapproveBtnService = async function({
  refId,
  refDoctTyp,
  tenId,
  processed,
  curSeq,
  lastSequence,
  cancelseq,
  rejectRemarksVal,
}) {
  const emplId = store.get('employeeId')
  return serverApi
    .post(
      `getUpdateProcessDtl`,
      {
        referenceId: refId,
        currentSeq: curSeq,
        updatedSeq: cancelseq,
        referenceDoc: refDoctTyp,
        tenantId: tenId,
        lastSeq: lastSequence,
        processCode: processed,
        empId: emplId,
        remarks: rejectRemarksVal,
        pmId: processed,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}
export default disapproveBtnService
