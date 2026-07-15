import serverApi from 'services/serverApi'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}
const addDocumentdetail = async function({ requestData }) {
  return serverApi
    .post(`addDocument`, requestData, {
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

const documentLIst = async function({ requestData }) {
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

const indentFileUpload = async function({ requestPath, requestData }) {
  return serverApi
    .post(requestPath, requestData, { headers })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}
const commongetmethod = async function({ requestPath }) {
  return serverApi
    .get(requestPath, { headers }) // Send request without query parameters
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}

export { addDocumentdetail, documentLIst, indentFileUpload, commongetmethod }
