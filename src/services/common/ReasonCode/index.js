import serverApi from 'services/serverApi'

const getReasonCodeData = async function(tenantId, employeeId) {
  return serverApi
    .post(
      `getReasonCodeInfo`,
      {
        tenantId,
        employeeId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
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
export default getReasonCodeData
