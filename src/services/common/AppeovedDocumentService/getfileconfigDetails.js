import serverApi from 'services/serverApi'

const documentlIst = async function({ requestData }) {
  return serverApi
    .post(`getFileUploadConfigDtl`, requestData, {
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

export default documentlIst
