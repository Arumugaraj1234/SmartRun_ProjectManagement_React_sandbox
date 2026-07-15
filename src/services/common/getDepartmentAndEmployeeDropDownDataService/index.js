import serverApi from 'services/serverApi'

const getDepartmentAndEmployeeDropDownDataService = async function({
  tenantId,
  isActive,
  employeID,
}) {
  return serverApi
    .post(
      `getDepartmentAndEmpInfo`,
      {
        tenantId,
        isActive,
        employeID,
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
export default getDepartmentAndEmployeeDropDownDataService
