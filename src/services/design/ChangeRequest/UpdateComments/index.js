import serverApi from 'services/serverApi'

const updateComments = async function(crDtlId, crhdrId, designerComments, tenantId, empId) {
  return serverApi
    .post(
      `updateDesignerComments`,
      {
        crDtlId,
        crhdrId,
        designerComments,
        tenantId,
        empId
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
export default updateComments
