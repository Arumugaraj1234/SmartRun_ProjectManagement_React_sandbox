import serverApi from 'services/serverApi'

const getQtyDtl = async function(qhdrId, custName, empId, fromDate, pmId, tenantID, toDate,projectId) {
  return serverApi
    .post(
      `getQtyDtl`,
      {
        qhdrId,
        customerName: custName,
        empId,
        fromDate,
        pmId,
        tenantId: tenantID,
        toDate,
        projectId
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
export default getQtyDtl
