import serverApi from 'services/serverApi'

const TaskApprovalService = async function(approvalprops) {
  return serverApi
    .post(`UpdateTaskDtlSeq`, approvalprops, {
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
export default TaskApprovalService
