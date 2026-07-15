import serverApi from 'services/serverApi'

const getProjectRetrieveDtl = async function(
  tenantID,
  fromDate,
  toDate,
  custName,
  projectID,
  pmId,
  empId,
) {
  return serverApi
    .post(
      `getProjectDtl`,
      {
        tenantID,
        fromDate,
        toDate,
        custName,
        projectID,
        pmId,
        empId,
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
export default getProjectRetrieveDtl
