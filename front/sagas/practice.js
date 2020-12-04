/* eslint-disable */
/**********제너레이터 개념 *************/

const gen = function*(){
    console.log(1);
    yield;
    console.log(2);
    yield;
    console.log(3);
    yield 4;
}

/**
 * 제너레이터는 .next()로 내부의 코드를 실행시킨다.
 * 한번 실행시킬 때마다 yield에서 멈춘다. 즉, yield는 중단점 역할
 */
const g = gen();
g.next(); // 1 , {value:undefined, done:false}
g.next(); // 2 , {value:undefined, done:false}
g.next(); // 3 , {value:4, done:true}

/**********제너레이터 개념 *************/

import axios from 'axios';
import { all, fork, call, put, take, takeEvery, takeLatest } from 'redux-saga/effects'; //all, fork, call, put ... === redux saga의 액션

function logInAPI() {
    return axios.post('/api/login/어쩌구')
}

function* logIn() {
    try {
        // put == dispatch -> 'LOG_IN_SUCCESS' 액션을 디스패치한다
        // 요청 성공
        // const result = yield call(logInAPI);
        yield put({
            type: 'LOG_IN_SUCCESS',
            // data: result.data
        });
    } catch (err) {
        // 요청 실패
        yield put({
            type: 'LOG_IN_FAILURE',
            // data: err.response.data
        });
    }
    
}

function* watchLogIn() {
    /**
     * while, take -> 동기적으로 동작
     * takeEvery -> 비동기적으로 동작
     * takeLatest -> 순간적으로 여러번의 요청이 들어온 경우, 가장 마지막 요청만 수행
     * takeLeading -> 순간적으로 여러번의 요청이 들어온 경우, 가장 처음의 요청만 수행
     */
    // while (true) {
    //     // take === 'LOG_IN' 이라는 액션이 실행될 때까지 기다리겠다는 의미
    //     yield take('LOG_IN_REQUEST', logIn);    
    // }
    // yield takeEvery('LOG_IN_REQUEST', logIn);
    yield takeLatest('LOG_IN_REQUEST', logIn)
}

function* watchLogOut() {
    yield takeLatest('LOG_OUT_REQUEST');
}

function* watchAddPost() {
    yield takeLatest('ADD_POST');
}

export default function* rootSaga() {
    // all === 인자로 받는 배열안의 함수들을 모두 실행해줌
    // fork === 비동기 함수 호출
    // call === 동기 함수 호출
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchAddPost)
    ])
}