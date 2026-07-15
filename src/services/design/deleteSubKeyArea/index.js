import serverApi from 'services/serverApi'

const deleteKeySubAreaDesign = async function(dskId, tenantId) {
  return serverApi
    .post(
      `deletedesignSubKeyAreaReq`,
      {
        dskId,
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
export default deleteKeySubAreaDesign
