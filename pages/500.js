import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from 'antd';

const _500 = () => {
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
  )
};

export default _500;
