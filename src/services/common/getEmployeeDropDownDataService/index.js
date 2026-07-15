import serverApi from 'services/serverApi'

const getEmployeeDropDownDataService = async function({ tenantId, departmentId, employeeId }) {
  return serverApi
    .post(
      `getEmployeeForDepartment`,
      {
        tenantId,
        departmentId,
        employeeId: employeeId || '',
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
export default getEmployeeDropDownDataService
