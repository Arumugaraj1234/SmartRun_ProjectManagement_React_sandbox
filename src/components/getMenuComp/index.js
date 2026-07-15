import React, { useEffect } from 'react'
import store from 'store'
import GetMenuList from 'services/menus'
import { useHistory } from 'react-router-dom'

const LogViewSearchCard = () => {
  const history = useHistory()
  const loginId = store.get('loginUserID')
  const tenantId = store.get('tenantId')
  const userRoleId = store.get('roleID')

  const fetchBusinessMstdata = () => {
    const returnData = GetMenuList(loginId, tenantId, userRoleId)
    return returnData
  }

  useEffect(() => {
    async function onLoadFunc() {
      const response = await fetchBusinessMstdata(loginId, tenantId, userRoleId)
      let data = []
      if (response !== null && response !== undefined) {
        data = response.data.responseData
        store.set('MenuListData', data)
      } else {
        data = ''
      }

      if (data) {
        history.push(`${data[0].landingPageUrl}`)
      }
    }
    onLoadFunc()
  }, [])

  return <div />
}
export default LogViewSearchCard
