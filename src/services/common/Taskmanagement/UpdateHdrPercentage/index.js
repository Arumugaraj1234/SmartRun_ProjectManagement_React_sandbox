import serverApi from 'services/serverApi'

const TaskPercentageUpdate = async function(retriveprop) {
  return serverApi
    .post(`TaskPercentageUpdate`, retriveprop, {
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
export default TaskPercentageUpdate
