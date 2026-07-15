import serverApi from 'services/serverApi'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}
const InspectionReportService = async function({ requestPath, requestData }) {
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

export default InspectionReportService
