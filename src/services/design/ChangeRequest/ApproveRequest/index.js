import serverApi from 'services/serverApi'

const ApproveRequest = async function(currentseq, empId, tenantId, hdrId) {
  return serverApi
    .post(
      `updateChangeReqHdrSeqAndStatus`,
      {
        currentseq,
        empId,
        tenantId,
        hdrId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
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
export default ApproveRequest
