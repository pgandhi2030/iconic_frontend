import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Cookies } from 'react-cookie'
import { SET_AUTH_USER_DATA, UPDATE_LOAD_USER, USER_TOKEN_SET } from "@/constants/ActionTypes";

import { onLogin } from "@/redux/actions/Auth";
import IntlMessages from "@/util/IntlMessages";
import InfoView from "@/app/components/InfoView";
import axios from '@/util/Api';


const SignIn = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    axios.post('auth/signIn', values).then(({ data }) => {
      const cookies = new Cookies();
      cookies.set('token', data.token);
      dispatch({
        type: SET_AUTH_USER_DATA,
        payload: data
      });
      if (data.role != "clientAdmin" && data.kycDone == false) {
        router.push(process.env.NEXT_PUBLIC_FRONTEND_PATH_VARIABLE + '/kyc');
      } else {
        router.push(process.env.NEXT_PUBLIC_FRONTEND_PATH_VARIABLE + '/home');
      }
    }).catch((error) => {
      if (error.response.status == 400) {
        message.error(error.response.data.error);
      } else {
        message.error("Something went wrong!" + error);
      }
    })
    // dispatch(onLogin(values))

  };


  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
            </div>
            <div className="gx-app-logo">
              <center>
                <img alt="example" src="/images/iconic logo-title.png" width={"60%"} />
              </center>
            </div>
          </div>
          <div className="gx-app-login-content">
            <div className="gx-app-logo-wid">
              <h1><IntlMessages id="app.userAuth.signIn" /></h1>
            </div>
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0">
              <Form.Item
                rules={[{ required: true, message: 'The input is not valid E-mail!' }]} name="username">
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please input your Password!' }]} name="password">
                <Input type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>
                <span><IntlMessages id="app.userAuth.or" /></span> <Link href="/signup">
                  <a>
                    <IntlMessages id="app.userAuth.signUp" />
                  </a>
                </Link>
              </Form.Item>

            </Form>
          </div>
          <InfoView />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
