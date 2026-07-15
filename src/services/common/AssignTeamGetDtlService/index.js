import serverApi from 'services/serverApi'

const AssignTeamGetDtlService = async function({
  tenantId,
  employeeID,
  referenceId,
  referenceDoc,
}) {
  return serverApi
    .post(
      `getProcessAssignedTeam`,
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
export default AssignTeamGetDtlService
