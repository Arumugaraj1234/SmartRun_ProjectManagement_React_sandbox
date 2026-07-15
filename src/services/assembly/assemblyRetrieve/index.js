import serverApi from 'services/serverApi'

const getAssemblyDtl = async function(assyId, custName, empId, fromDate, pmId, tenantID, toDate,projectId) {
  return serverApi
    .post(
      `getAssyDtl`,
      {
        assyId,
        custName,
        empId,
        fromDate,
        pmId,
        tenantID,
        toDate,
        projectId
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
export default getAssemblyDtl
