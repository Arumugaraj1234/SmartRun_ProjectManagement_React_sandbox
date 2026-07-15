import serverApi from 'services/serverApi'

const getKeyCategory = async function({ doctype, tenId, enqID }) {
  return serverApi
    .post(
      `getKeyCategory`,
      {
        documentTypeCode: doctype,
        tenantId: tenId,
        enquiryId: enqID ?? '',
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
export default getKeyCategory
