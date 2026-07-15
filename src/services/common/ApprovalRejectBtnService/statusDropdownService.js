import serverApi from 'services/serverApi'
import store from 'store'

const statusDropdownService = async function({ refId, refDoctTyp, tenId, employeID }) {
  const getReferenceIdVal = store.get('referenceMstId')
  return serverApi
    .post(
      `getprocessEnbleStatus`,
      {
        slaveId: refId,
        referenceDocType: refDoctTyp,
        tenantId: tenId,
        empId: employeID,
        referenceId: getReferenceIdVal,
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
export default statusDropdownService
