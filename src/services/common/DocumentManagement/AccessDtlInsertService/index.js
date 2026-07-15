import serverApi from 'services/serverApi'

const AccessDtlInsert = async function(accessData) {
  return serverApi
    .post(`insertDocumentManagementAccessDtl`, accessData, {
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
export default AccessDtlInsert
