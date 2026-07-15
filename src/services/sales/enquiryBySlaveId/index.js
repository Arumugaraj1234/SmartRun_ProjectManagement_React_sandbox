import serverApi from 'services/serverApi'

const getEnquiryBySlaveIdDtls = async function(slaveId) {
  return serverApi
    .post(
      `getEnqDtlbySlaveId `,
      {
        slaveId,
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
export default getEnquiryBySlaveIdDtls
