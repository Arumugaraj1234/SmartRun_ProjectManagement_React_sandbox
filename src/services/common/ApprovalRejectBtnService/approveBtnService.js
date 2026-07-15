import serverApi from 'services/serverApi'
import store from 'store'

const approveBtnService = async function({
  refId,
  refDoctTyp,
  tenId,
  processed,
  curSeq,
  lastSequence,
  selectedOption,
  remarksVal,
}) {
  const emplId = store.get('employeeId')
  return serverApi
    .post(
      `getUpdateProcessDtl`,
      {
        referenceId: refId,
        currentSeq: curSeq,
        updatedSeq: selectedOption,
        referenceDoc: refDoctTyp,
        tenantId: tenId,
        lastSeq: lastSequence,
        processCode: processed,
        remarks: remarksVal,
        empId: emplId,
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
export default approveBtnService
