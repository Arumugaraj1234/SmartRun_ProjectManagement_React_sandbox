import serverApi from 'services/serverApi'

const getTaskRemarksDetail = async function(remarksprop) {
  return serverApi
    .post(`getTaskRemarksById`, remarksprop, {
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
export default getTaskRemarksDetail
