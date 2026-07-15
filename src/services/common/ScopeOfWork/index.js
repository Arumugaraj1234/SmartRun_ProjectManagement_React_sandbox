import serverApi from 'services/serverApi'

const getScopeOfWorkInfoData = async function(tenantId) {
  return serverApi
    .post(
      `getScopeOfWorkInfo`,
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
export default getScopeOfWorkInfoData
