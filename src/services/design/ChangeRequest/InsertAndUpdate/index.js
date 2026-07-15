import serverApi from 'services/serverApi'

const InsertAndUpdate = async (
  crId,
  createdBy,
  deHdrId,
  initiatedBy,
  lastUpdatedBy,
  nextApprovingDesig,
  pkId,
  pmHdrId,
  pmId,
  productDesc,
  pskId,
  requestDetails,
  tenantId,
  updatedDrawingNo,
  updatedDrawingRevNo,
  CrDtlID,
  CrHdrId,
  comments,
  tenantid,
) => {
  const changeReqDtlEntity = [
    {
      crDtlId: CrDtlID,
      crhdrId: CrHdrId,
      designerComments: comments,
      tenantId: tenantid,
      empId: createdBy
    },
  ]
  return serverApi
    .post(
      `updateChangeRequestDtl`,
      {
        crId,
        createdBy,
        deHdrId,
        initiatedBy,
        lastUpdatedBy,
        nextApprovingDesig,
        pkId,
        pmHdrId,
        pmId,
        productDesc,
        pskId,
        requestDetails,
        tenantId,
        updatedDrawingNo,
        updatedDrawingRevNo,
        changeReqDtlEntity,
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
export default InsertAndUpdate
