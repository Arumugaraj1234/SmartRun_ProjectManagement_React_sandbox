import serverApi from 'services/serverApi'

const uploadtaskDocuments = async function({ requestData }) {
  return serverApi
    .post(`UpdateTaskFileDtl`, requestData, {
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
export default uploadtaskDocuments
