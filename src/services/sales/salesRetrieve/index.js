import serverApi from 'services/serverApi'

const getRetrieveSubmitDtls = async function(
  fromDate,
  toDate,
  customerName,
  tenantId,
  empId,
  tentativePoVal,
  isExpectedPoDate,
) {
  return serverApi
    .post(
      `getEnqDtlbyDate`,
      {
        fromDate,
        toDate,
        customerName,
        tenantId,
        empId,
        tentativePoVal,
        isExpectedPoDate,
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
export default getRetrieveSubmitDtls
