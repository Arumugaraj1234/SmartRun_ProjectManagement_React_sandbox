import serverApi from 'services/serverApi'

const getKeySubAreaDropDown = async function(tenantId) {
  return serverApi
    .post(
      `getKeyArea`,
      {
        pmHdrId: '',
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
export default getKeySubAreaDropDown
