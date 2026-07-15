import serverApi from 'services/serverApi'

const getBudgetSheetRetrival = async function({ mstId, tenId, budgetValue }) {
  return serverApi
    .post(
      `getSalesBudgetSheetHdrAndDtl`,
      {
        masterId: mstId,
        tenantId: tenId,
        isBudget: budgetValue,
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
export default getBudgetSheetRetrival
