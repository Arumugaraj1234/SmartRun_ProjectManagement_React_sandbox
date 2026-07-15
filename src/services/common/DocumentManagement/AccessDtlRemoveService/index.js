import serverApi from 'services/serverApi'

const AccessDtlRemove = async function(dmaId) {
  return serverApi
    .post(`deleteDocumentManagementAccessDtl`, dmaId, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}
export default AccessDtlRemove
