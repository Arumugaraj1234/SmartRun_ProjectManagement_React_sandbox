import serverApi from 'services/serverApi'

const TaskDtlRetriveService = async function(retriveprop) {
  return serverApi
    .post(`getTaskEntryDtlByDeptDtlId`, retriveprop, {
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
export default TaskDtlRetriveService
