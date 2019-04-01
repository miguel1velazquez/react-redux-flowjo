import { takeLatest, call, put } from 'redux-saga/effects'
import Axios from 'axios'

import { createAsyncTypes } from '../utils/sagas'
import FLOWJOAPI from '../FlowJoAPI'
import { toHTTPLocalHost } from '../utils/http'

/// ////////////////////////////////////////////////////////////////////////////
export const FETCH_WORKSPACES_ASYNC = createAsyncTypes('FETCH_WORKSPACES_ASYNC')
/// ////////////////////////////////////////////////////////////////////////////

export const fetchWorkspaces = () => async dispatch => {
  return dispatch({
    type: FETCH_WORKSPACES_ASYNC.PENDING
  })
}
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
export const watchFetchWorkspaces = () => {
  return takeLatest(FETCH_WORKSPACES_ASYNC.PENDING, fetchWorkspacesAsync)
}

/// ////////////////////////////////////////////////////////////////////////////
// export const getApplicationPort = state => state.flowjo.port;

const getWorkspaces = port => {
  return Axios.get(toHTTPLocalHost(port, FLOWJOAPI.WORKSPACES.ALL))
}

/// ////////////////////////////////////////////////////////////////////////////

export function* fetchWorkspacesAsync() {
  try {
    // const port = yield select(getApplicationPort);
    const port = 4567
    const workspaces = yield call(getWorkspaces, port)
    if (workspaces.data) {
      yield put({
        type: FETCH_WORKSPACES_ASYNC.SUCCESS,
        payload: workspaces.data
      })
    }
  } catch (e) {
    yield put({
      type: FETCH_WORKSPACES_ASYNC.ERROR
    })
  }
}
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const initialState = {
  workspaces: null,
  fetchingWorkspaces: false
}
/// ////////////////////////////////////////////////////////////////////////////

const workspaces = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WORKSPACES_ASYNC.PENDING:
      return {
        ...state,
        fetchingWorkspaces: true
      }
    case FETCH_WORKSPACES_ASYNC.SUCCESS:
      return {
        ...state,
        workspaces: action.payload,
        fetchingWorkspaces: false
      }
    case FETCH_WORKSPACES_ASYNC.ERROR:
      return {
        ...state,
        fetchingWorkspaces: false
      }

    default:
      return state
  }
}

export default workspaces
/// ////////////////////////////////////////////////////////////////////////////
