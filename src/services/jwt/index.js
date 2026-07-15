import apiClient from 'services/axios'
import serverApi from 'services/serverApi'
import store from 'store'

export async function login(password, userName) {
  return serverApi
    .post(
      `authenticate`,
      {
        password,
        userName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      if (response) {
        if (response.data.responseData[0].jwtToken) {
          store.set('accessToken', response.data.responseData[0].jwtToken)
          sessionStorage.setItem('accessTokenForSession', response.data.responseData[0].jwtToken)
          sessionStorage.setItem('firstname', response.data.responseData[0].empFirstNane)
          store.set('tenantId', response.data.responseData[0].tenantID)
          // store.set('branchCode', response.data.masterUserInfo.branchCode)
          // store.set('bgimg', response.data.masterUserInfo.backGroundIMGPath)
          store.set('employeeId', response.data.responseData[0].empID)
          store.set('adminname', response.data.responseData[0].empDepDesc)
          store.set('adminrole', response.data.responseData[0].empRole)
          store.set('firstname', response.data.responseData[0].empFirstNane)
          store.set('lastname', response.data.responseData[0].empLastName)
          store.set('loginUserID', response.data.responseData[0].loginUserID)
          store.set('roleID', response.data.responseData[0].roleid)
          store.set('depCode', response.data.responseData[0].depCode)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}

export async function register(email, password, name) {
  return apiClient
    .post('/auth/register', {
      email,
      password,
      name,
    })
    .then(response => {
      if (response) {
        const { accessToken } = response.data

        if (accessToken) {
          store.set('accessToken', accessToken)
          store.set('tenantId', 're')
          store.set('branchCode', 'rev')
        }
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}

export async function currentAccount() {
  store.set('accessToken', store.get('accessToken'))
  store.set('tenantId', store.get('tenantId'))
  store.set('branchCode', store.get('branchCode'))
  store.set('adminrole', store.get('adminrole'))
  store.set('adminname', store.get('adminname'))
  store.set('menu', store.get('menu'))

  return store.get('accessToken')
}

export async function logout() {
  return apiClient
    .get('/auth/logout')
    .then(() => {
      store.remove('accessToken')
      store.remove('MenuListData')
      sessionStorage.removeItem('accessTokenForSession')
      return true
    })
    .catch(err => console.error(err))
}
