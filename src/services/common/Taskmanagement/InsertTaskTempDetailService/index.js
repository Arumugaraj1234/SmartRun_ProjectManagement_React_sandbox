import serverApi from 'services/serverApi'

const InsertTasktemplatedetails = async function(docprops) {
  return serverApi
    .post(`updateTaskEntryDtl`, docprops, {
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
export default InsertTasktemplatedetails
