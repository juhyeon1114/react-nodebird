import React from 'react';
// import Head from 'next/head';
// import AppLayout from '../components/AppLayout';
// import { useDispatch, useSelector } from 'react-redux';
// import { END } from 'redux-saga';
// import Router from 'next/router';

// import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
// import wrapper from '../store/configureStore';

const About = () =>
// const dispatch = useDispatch();
// const { me } = useSelector((state) => state.user);

// useEffect(() => {
//   dispatch({
//     type: LOAD_FOLLOWERS_REQUEST,
//   });
//   dispatch({
//     type: LOAD_FOLLOWINGS_REQUEST,
//   });
// }, []);

// useEffect(() => {
//   if (!(me && me.id)) {
//     Router.push('/');
//   }
// }, [me && me.id]);

  // if (!me) {
  //   return null;
  // }
  // (
  //   <AppLayout>
  //     <Head>
  //       <title>내 프로필 | NodeBird</title>
  //     </Head>
  //     ㅋ
  //   </AppLayout>
  // );
  (
    <div>프로필</div>
  )
;

/**
 * getStaticProps
 * -> 해당 페이지를 static한 html파일로 빌드해줌
 * -> 동적인 정보가 담긴다면 사용할 수 없음
 */
// export const getStaticProps = wrapper.getStaticProps(async (context) => {
//   context.store.dispatch({
//     type: LOAD_MY_INFO_REQUEST,
//   });

//   context.store.dispatch(END);
//   await context.store.sagaTask.toPromise();
// });

export default About;
