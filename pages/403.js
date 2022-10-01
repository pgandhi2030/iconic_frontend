import React from 'react';
import Link from "next/link";
import { Result, Button } from 'antd';

const _403 = () => {
  return (
    <Result
      status="403"
      title="403 (Access Denied)"
      subTitle="Sorry, You have no permission to access this page"
      extra={
        <>
          <span className="ant-result-subtitle">If you feel this is mistake, Raise the ticket.</span>
          <br />
          <br />
          <Button className="gx-btn-primary" href="/">Go Home</Button>
        </>
      }
    />
  )
};

export default _403
