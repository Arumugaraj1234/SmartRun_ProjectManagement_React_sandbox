import serverApi from 'services/serverApi'

const getRetrieveTableData = async function(pmId, empId, tenantId) {
  return serverApi
    .post(
      `getChangeRequestDtlByPmId`,
      {
        pmId,
        empId,
        tenantId,
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
export default getRetrieveTableData
