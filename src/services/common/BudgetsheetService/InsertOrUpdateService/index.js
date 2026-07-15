import serverApi from 'services/serverApi'

const inserUpdateBudgetSheet = async function(insertdata) {
  return serverApi
    .post(`insertOrUpdateSalesBudgetSheetHdrAndDtl`, insertdata, {
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
export default inserUpdateBudgetSheet
