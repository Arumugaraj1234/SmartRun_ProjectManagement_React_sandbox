import serverApi from 'services/serverApi'

const getTaskType = async function({ empId, tenantId, pmId }) {
  return serverApi
    .post(
      `getTaskTypeByEmp`,
      {
        tenantId,
        empId,
        pmId,
        depCode: '',
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
export default getTaskType
