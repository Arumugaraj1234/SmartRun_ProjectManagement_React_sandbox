import serverApi from 'services/serverApi'

const TaskPercentageFlag = async function(retriveprop) {
  return serverApi
    .post(`TaskPercentageFlag`, retriveprop, {
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
export default TaskPercentageFlag
