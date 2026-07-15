import serverApi from 'services/serverApi'

const insertandUpdateEnquiry = async function(reqobj) {
  return serverApi
    .post(`UpdateEnquiryDtl `, reqobj, {
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
export default insertandUpdateEnquiry
