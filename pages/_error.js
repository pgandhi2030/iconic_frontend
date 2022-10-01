import React from 'react';
import IntlMessages from "@/util/IntlMessages";
import Page from '../app/hoc/defaultPage';
import Link from "next/link";
import { Result, Button } from 'antd';

const _Error = () => {
  return (
    <Result
      status="500"
      title="500 (Internal Server Error)"
      subTitle="We are experiencing an internal server problem. We'll be up and running shortly."
      extra={
        <>
          <span className="ant-result-subtitle">Please try again later or raise ticket.</span>
          <br />
          <br />
          <Button className="gx-btn-primary" href="/">Go Home</Button>
        </>
      }
    />
  );
};

export default Page(() => <_Error />);
