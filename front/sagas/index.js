import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

import { backURL } from '../config/config';

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = true; // 백엔드에 쿠키를 전달하기 위함

export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(userSaga),
  ]);
}
