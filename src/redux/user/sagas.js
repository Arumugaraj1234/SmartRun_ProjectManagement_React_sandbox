import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import store from 'store'
import * as firebase from 'services/firebase'
import * as jwt from 'services/jwt'
import actions from './actions'

const mapAuthProviders = {
  firebase: {
    login: firebase.login,
    register: firebase.register,
    currentAccount: firebase.currentAccount,
    logout: firebase.logout,
  },
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
  },
}

export function* LOGIN({ payload }) {
  const { username, password, callback } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].login, password, username)
  if (typeof callback === 'function') {
    yield call(callback, success)
  }
  if (success) {
    if (success.responseData[0].jwtToken) {
      const usernrole = success.responseData[0].userName
      const nameuser = success.responseData[0].userName
      const userFirName = success.responseData[0].empFirstNane
      const userLstName = success.responseData[0].empLastName

      yield put({
        type: 'user/SET_STATE',
        payload: {
          id: '1',
          name: nameuser,
          email: '',
          role: usernrole,
          authorized: true,
          userfullname: `${userFirName}${' '}${userLstName}`,
        },
      })

      yield history.push('/')
      notification.success({
        message: 'Logged In',
        description: `Welcome back ${usernrole}!`,
      })
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
      notification.success({
        message: 'Logged Failed',
        description: success.returnMsg,
      })
    }
  }
  if (!success) {
    notification.success({
      message: 'Login Failed',
      description: 'Something went wrong! Check your internet connection.',
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  const { email, password, name } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[authProvider].register, email, password, name)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    yield history.push('/')
    notification.success({
      message: 'Succesful Registered',
      description: 'You have successfully registered!',
    })
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const response = yield call(mapAuthProviders[authProvider].currentAccount)

  if (response) {
    const username = store.get('adminname')
    const userrole = store.get('adminrole')
    const fistnam = store.get('firstname')
    const lastnam = store.get('lastname')
    const logdsj = store.get('logopath')
    const bgfjs = store.get('bgimg')

    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: '1',
        name: username,
        email: '',
        role: userrole,
        authorized: true,
        userlogo: logdsj,
        userbgimg: bgfjs,
        userfullname: `${fistnam}${' '}${lastnam}`,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const { authProvider } = yield select(state => state.settings)
  yield call(mapAuthProviders[authProvider].logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
