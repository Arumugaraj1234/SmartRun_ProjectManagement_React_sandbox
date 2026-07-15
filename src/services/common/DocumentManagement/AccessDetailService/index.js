import serverApi from 'services/serverApi'

const AccessDtlSerivce = async function({ documId, tenId }) {
  return serverApi
    .post(
      `getdocumentManagementAccessDtl`,
      {
        dmId: documId,
        tenantId: tenId,
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
export default AccessDtlSerivce
