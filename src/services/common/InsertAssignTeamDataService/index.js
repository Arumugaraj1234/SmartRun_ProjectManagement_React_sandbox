import serverApi from 'services/serverApi'

const InsertAssignTeamDataService = async function({
  tenantId,
  employeeID,
  referenceId,
  referenceDoc,
}) {
  return serverApi
    .post(
      `insertProcessAssignedTeam`,
      {
        tenantId,
        employeeID,
        referenceId,
        referenceDoc,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
export default InsertAssignTeamDataService
