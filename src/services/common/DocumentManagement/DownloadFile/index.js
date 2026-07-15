import serverApi from 'services/serverApi'

const DownloadDocumentFile = async function({ referenId, tenId, fileCode, docTypeCode }) {
  return serverApi
    .post(
      `documentDownloadDocFile`,
      {
        referenceId: referenId.toString(),
        tenantId: tenId,
        fileCategoryCode: fileCode,
        docCategoryCode: docTypeCode,
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
export default DownloadDocumentFile
