import serverApi from 'services/serverApi'

const TaskDtlRemarksById = async function(retriveprop) {
  return serverApi
    .post(`getTaskDtlRemarksById`, retriveprop, {
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
export default TaskDtlRemarksById
