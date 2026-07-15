import store from 'store'
import actions from './actions'



const user = store.get('firstname')
const userrole = store.get('adminrole')

const initialState = {
  id: '',
  name: user,
  role: userrole,
  email: '',
  avatar: '',
  plantcode: '',
  plantType: '',
  authorized: process.env.REACT_APP_AUTHENTICATED || false, // false is default value
  loading: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
