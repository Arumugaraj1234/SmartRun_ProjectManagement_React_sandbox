import serverApi from 'services/serverApi'

const getIndustryTypeData = async function(tenantId) {
  return serverApi
    .post(
      `getIndustryTypeInfo`,
      {
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
export default getIndustryTypeData
