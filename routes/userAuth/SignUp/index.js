import React from "react";
import { Button, Form, Input, message } from "antd";
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from '@/util/Api';

import IntlMessages from "@/util/IntlMessages";
import InfoView from "@/app/components/InfoView";

const FormItem = Form.Item;

const SignUp = (props) => {

  const router = useRouter();

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {

    axios.post('auth/signUp', values).then(({ data }) => {
      if (data) {
        message.success(data.message);
        router.back()
      }
    })
  };


  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
            </div>
            {/* <div className="gx-app-logo-wid">
              <h1>Photographer Signup</h1>
            </div> */}
            <div className="gx-app-logo" style={{ "margin": "auto" }}>
              <img alt="example" src="/images/iconic logo-title.png" width={"60%"} style={{ "margin": "15%" }} />
            </div>
          </div>

          <div className="gx-app-login-content">
            <div className="gx-app-logo-wid">
              <h1>Photographer Signup</h1>
            </div>
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0">
              <FormItem rules={[{ required: true, message: 'Please input your First Name!' }]} name="firstName">
                <Input placeholder="First name" />
              </FormItem>
              <FormItem rules={[{ required: true, message: 'Please input your Last Name!' }]} name="lastName">
                <Input placeholder="Last name" />
              </FormItem>

              <Form.Item
                name="emailId"
                rules={[{ type: 'email', message: 'Not a valid Email' }, { required: false, message: 'Email is required' }]}
              ><Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="mobileNumber"
                rules={[{ required: false, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit mobile number!" }]}
              ><Input placeholder="Mobile Number" />
              </Form.Item>


              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    pattern: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/,
                    message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number',
                  }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('The two passwords that you entered do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <FormItem>
                <div><Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signUp" />
                </Button>
                  <span><IntlMessages id="app.userAuth.or" /></span> <Link href="/signin">
                    <a><IntlMessages
                      id="app.userAuth.signIn" /></a>

                  </Link></div>
              </FormItem>
            </Form>
          </div>
          <InfoView />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
