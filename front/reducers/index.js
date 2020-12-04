import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

/**
 * 정적 action -> data를 유동적으로 바꿔줄 수 없다.
 */
// const changeNickname = {
//     type: 'CHANGE_NICKNAME',
//     data: 'hello',
// }

/**
 * 동적 action -> action을 만들어주는 함수를 만들어서, data를 유동적으로 바꿔줄 수 있다.
 * ( action creator  )
 */
// const changeNickname = (data) => {
//     return {
//         type: 'CHANGE_NICKNAME',
//         data
//     }
// }

/**
 * Before
 */
// reducer == (이전상태, 액션) => 다음상태
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         return { ...state, ...action.payload };
//       default: // default 는 reducer 를 초기화할 때, 사용됨. default에서 state를 return해주지 않으면 undefined가 return이 되서 오동작함
//         return state;
//     }
//   },
//   user,
//   post,
// });

/**
 * After
 */
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
