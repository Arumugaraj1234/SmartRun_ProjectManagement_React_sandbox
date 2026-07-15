import serverApi from 'services/serverApi'

const TaskReassignFlag = async function(reqpath, reasign) {
  return serverApi
    .post(
      reqpath,
      reasign,

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
export default TaskReassignFlag
