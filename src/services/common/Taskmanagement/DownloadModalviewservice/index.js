import serverApi from 'services/serverApi'

const getDocumentManagementDetails = async function(docprops) {
  return serverApi
    .post(`getDocumentManagementDetailsById`, docprops, {
      headers: {
        'Content-Type': 'application/json',
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
export default getDocumentManagementDetails
