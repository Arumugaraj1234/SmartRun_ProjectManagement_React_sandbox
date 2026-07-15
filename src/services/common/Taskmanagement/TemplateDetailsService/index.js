import serverApi from 'services/serverApi'

const getTemplateDetails = async function(getTemprop) {
  return serverApi
    .post(`gettemplateDtl`, getTemprop, {
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
export default getTemplateDetails
