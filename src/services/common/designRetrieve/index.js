import serverApi from 'services/serverApi';

const getDesignDtl = async function(customer, designID, empId, fromDate, processId,toDate,tenantID,projectId) {
    return serverApi
      .post(
        `getDesignDtl`,
        {
            customer, designID, empId, fromDate, processId,toDate,tenantID,projectId
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
  export default getDesignDtl
  