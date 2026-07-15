import serverApi from 'services/serverApi'

const DeleteBudgetEntry = async function({ sbDtl }) {
  return serverApi
    .post(
      `deleteKeyCategory`,
      {
        sbDtlId: sbDtl,
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
export default DeleteBudgetEntry
