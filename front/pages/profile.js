import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import Router from 'next/router';
import useSWR, { useSWRInfinite } from 'swr';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { backURL } from '../config/config';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const { data: followersData, error: followersError } = useSWR(`${backURL}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingsError } = useSWR(`${backURL}/user/followings?limit=${followingsLimit}`, fetcher);
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '로딩중';
  }

  if (followersError || followingsError) {
    console.error(followersError || followingsError);
    return '팔로잉/팔로워 로딩 중 에러 발생';
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        {/* <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} /> */}
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsError && !followingsData} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersError && !followersData} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
