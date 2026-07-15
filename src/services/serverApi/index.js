import axios from 'axios'
import store from 'store'
import { notification } from 'antd'
// import Backtologin from './Backtologin'

const apiServer = axios.create({
  baseURL: 'http://localhost:8495/smartrun',
  // baseURL: 'http://192.168.3.38:8495/smartrun',
  // http://15.206.108.18/
  // http://10.130.15.79:5000/10.103.20.30
  // timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})
apiServer.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.AccessToken = accessToken
  }
  return request
})

// apiServer.interceptors.response.use(undefined, errorin => {
//   const { response } = errorin
//   const { error } = response.data
//   if (error) {
//     if (error !== 'Bad Request') {
//       notification.warning({
//         message: error,
//       })
//     }
//   }
// })

apiServer.interceptors.response.use(
  response => {
    const accessToken = store.get('accessToken')
    if (
      accessToken &&
      response.config.url !== 'getNotificationDetails' &&
      response.config.url !== 'updateNotificationDtls' &&
      response.config.url !== 'getindentLifecycDtl' &&
      response.config.url !== 'getAllProductsDtl'
    ) {
      getNotificationData()
    }
    return response
  },
  error => {
    const { response } = error
    const { status, data } = response
    if (status === 401) {
      localStorage.clear()
      store.remove('accessToken')
      window.location.reload()
    } else {
      const { error: responseDataError } = data
      if (responseDataError && responseDataError !== 'Bad Request') {
        notification.warning({
          message: responseDataError,
        })
      }
    }
  },
)

const getNotificationData = async () => {
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const keyareaobj = {
    tenantID: tenantId,
    empId: employeeId,
  }
  try {
    const response = await apiServer.post('getNotificationDetails', keyareaobj)
    store.set('notificationCount', response?.data?.responseData[0]?.count)
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}
export default apiServer
