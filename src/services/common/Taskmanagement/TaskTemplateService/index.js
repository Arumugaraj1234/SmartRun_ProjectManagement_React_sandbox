import serverApi from 'services/serverApi'

const TaskTemplateService = async function(retriveprop) {
  return serverApi
    .post(`gettemplateHdrName`, retriveprop, {
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
export default TaskTemplateService
