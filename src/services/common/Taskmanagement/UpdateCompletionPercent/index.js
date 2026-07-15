import serverApi from 'services/serverApi'

const UpdateCompletionpercent = async function(updateprop) {
  return serverApi
    .post(`UpdateTaskDtlPtg`, updateprop, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}
export default UpdateCompletionpercent
