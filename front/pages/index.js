import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    const onScroll = () => {
      /**
       * window.scrollY : 얼마나 내렸는지
       * document.documentElement.clientWidth : 화면에 보이는 길이
       * document.documentElement.scrollHeight : 총 길이
       */
      const currentY = window.scrollY;
      const viewY = document.documentElement.clientHeight;
      const totalY = document.documentElement.scrollHeight;
      if (currentY + viewY + 900 >= totalY) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      // 지워주지 않으면 메모리에 계속 싸여 있게 됨
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

/**
 * 화면을 그리기 전에 실행되는 함수 : SSR
 * - 매개변수인 context 안에는 store가 들어있음
 * - 프론트 서버에서 실행됨
 */
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });

  /* REQUEST가 SUCCESS로 바뀔때까지 기다려주는 코드 */
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
