import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

// const tempStyle = useMemo(() => ({marginTop: '10px'}), []);

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitFinish = useCallback(() => {
    /* onFinish는 이미 preventDefault() 가 적용되어 있음 */
    // setIsLoggedIn(true);

    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitFinish}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>

      {/*
            1) <div style={{ marginTop : '10px' }}>
            위와 같이 객체로써 스타일을 작성하면 렌더링될때마다 객체가 새로 생성이 되므로 성능에 안좋은 영향을 준다.
            따라서, styled-component를 사용하는 것을 추천 (성능이 크게 중요하지 않으면 사용해도 괜찮)
            2) <div style={tempStyle} >
            위와 같이 useMemo를 통해서 style객체를 저장해서 최적화할 수도 있다.
            styled-component를 사용하고 싶지 않은 경우에 대안으로 사용할 수 있다.
            */}
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
        <Link href="/signup">
          <a><Button>회원가입</Button></a>
        </Link>
      </ButtonWrapper>
      {/* </div> */}
    </FormWrapper>
  );
};

export default LoginForm;
