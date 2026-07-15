import serverApi from 'services/serverApi'

const approvalListRetrievalService = async function({ equipId, tenId, employeeId }) {
  return serverApi
    .post(
      `getDocumentManagementDetails`,
      {
        enquiryId: equipId,
        tenantId: tenId,
        empId: employeeId,
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
export default approvalListRetrievalService
