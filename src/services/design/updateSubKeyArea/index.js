import serverApi from 'services/serverApi'

const updateKeySubAreaDesign = async function(deHdrid, pskId, tenantId) {
  return serverApi
    .post(
      `updatedesignSubKeyAreaReq`,
      {
        deHdrid,
        pskId,
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
export default updateKeySubAreaDesign
