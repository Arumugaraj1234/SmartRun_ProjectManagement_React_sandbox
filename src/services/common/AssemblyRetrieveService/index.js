import serverApi from 'services/serverApi'
import store from 'store'

const tenantid = store.get('tenantId')

const AssemblyGetDtlService = async function() {
  return serverApi
    .post(
      `getScmHdrBasedDtl`,
      {
        fromDate: '2024-03-10',
        toDate: '2024-03-21',
        projectId: '',
        tenantId: tenantid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
export default AssemblyGetDtlService
