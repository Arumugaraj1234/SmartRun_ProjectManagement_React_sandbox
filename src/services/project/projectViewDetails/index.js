import serverApi from 'services/serverApi'
import store from 'store'

const getProjectViewDtlRetrieve = async function(
  tenantID,
  // projectID,
) {
  return serverApi
    .post(
      `getProjectDtl`,
      {
        tenantID,
        projectID: store.get('ProjectPMHdrId'),
        fromDate: '',
        toDate: '',
        custName: '',
        pmId: '',
        empId: '',
      },
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
export default getProjectViewDtlRetrieve
