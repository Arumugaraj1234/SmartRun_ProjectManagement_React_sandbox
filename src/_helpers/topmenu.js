import store from 'store'
import GetMenuList from 'services/menus'

const fetchBusinessMstdata = async () => {
  const loginId = store.get('loginUserID')
  const tenantId = store.get('tenantId')
  const userRoleId = store.get('roleID')
  const response = await GetMenuList(loginId, tenantId, userRoleId)
  return response?.data?.responseData || []
}

const logViewSearchCardFunction = async () => {
  const loginId = store.get('loginUserID')
  const tenantId = store.get('tenantId')
  const userRoleId = store.get('roleID')
  const data = await fetchBusinessMstdata(loginId, tenantId, userRoleId)

  store.set('MenuListData', data)
  return data
}

export default logViewSearchCardFunction
