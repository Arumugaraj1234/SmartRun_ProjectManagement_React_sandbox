import serverApi from 'services/serverApi'

const getTaskCategorey = async function({ typeCode, tenantId }) {
  return serverApi
    .post(
      `getTaskCategoryByTypeCode`,
      {
        tenantId,
        typeCode,
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
export default getTaskCategorey
