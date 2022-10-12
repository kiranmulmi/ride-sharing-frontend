import React from "react";

import logo from '../../logo.svg'
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';


const LoginPage = () => {

  return (
    <div className="login-input-wrap">
      <div><img src={logo} className="App-logo" alt="logo" height={70} /></div>
      <div>
        <div><h2>Login</h2></div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
            }}
            icon={<GoogleOutlined />}> Login with Google</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;