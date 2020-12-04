import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  });

  return (
    <Card
      // 리액트에서 배열로 jsx를 쓰려면 key를 붙여줘야함
      actions={[
        <div key="twit">게시글<br />{me.Posts.length}</div>,
        <div key="followings">팔로잉<br />{me.Followings.length}</div>,
        <div key="followers">팔로워<br />{me.Followers.length}</div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />

      <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
