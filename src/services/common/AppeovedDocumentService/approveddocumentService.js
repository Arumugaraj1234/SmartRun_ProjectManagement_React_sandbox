import serverApi from 'services/serverApi'

const approveddocumentData = async function({
  enquiryId,
  stageCode,
  approved,
  tenantId,
  docTypeCode,
  employeeId,
}) {
  return serverApi
    .post(
      `getApprovedDocDtl`,
      {
        enquiryId,
        stageCode,
        approved,
        tenantId,
        docTypeCode,
        empId: employeeId,
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

const newapproveDocument = async function({ requestData }) {
  return serverApi
    .post(`sumbitApprovedDoc`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
export { approveddocumentData, newapproveDocument }
