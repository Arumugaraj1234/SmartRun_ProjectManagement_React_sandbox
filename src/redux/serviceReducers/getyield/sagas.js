import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import actions from './actions'
import {getYieldData} from 'services/dashboard/getyield'

export function* FETCH_DATA(tenantid,branchcode,pldate) {
  const success = yield call(getYieldData, tenantid,branchcode,pldate)
  if(success){
    return success
  }
}
  

  export default function* rootSaga() {
    yield all([
      takeEvery(actions.GET_DATA, FETCH_DATA),
    ])
  }