import serverApi from 'services/serverApi'

const getMstPocEmpForDepartment = async function({ tenantId, departmentId }) {
  return serverApi
    .post(
      `getMstPocEmpForDepartment`,
      {
        tenantId,
        departmentId,
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
export default getMstPocEmpForDepartment
