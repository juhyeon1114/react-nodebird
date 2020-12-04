import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSageMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

/**
 * custom middleware : middleware는 3단 고차 함수로 구성된다.
 */
// const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
//   console.log(action);
//   return next(action);
// };

const configureStore = () => {
  const sagaMiddleware = createSageMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares)); // 개발모드일때, 데브툴즈로 리덕스의 기록을 볼 수 있다

  const store = createStore(reducer, enhancer);
  // store.dispatch({
  //     type: 'CHANGE_NICKNAME',
  //     data: 'helloworld'
  // })

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
