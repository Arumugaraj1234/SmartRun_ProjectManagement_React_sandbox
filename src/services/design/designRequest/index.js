import serverApi from 'services/serverApi'

const getKeySubAreaDesignRetrieve = async function(pmHdrId, tenantId) {
  return serverApi
    .post(
      `getKeySubArea`,
      {
        pmHdrId,
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
export default getKeySubAreaDesignRetrieve
