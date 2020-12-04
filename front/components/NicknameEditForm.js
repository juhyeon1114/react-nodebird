import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input } from 'antd';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const dispatch = useDispatch();
  const style = useMemo(() => ({ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '30px' }), []);
  const [nickname, setNickname] = useState('');

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  });

  return (
    <Form style={style}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="닉네임"
        enterButton="수정"
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default NicknameEditForm;
