import React from 'react';
import Link from "next/link";
import { Result, Button } from 'antd';

const _404 = () => {
  return (
    <Result
      status="404"
      title="404 (Page Not Found)"
      subTitle="Sorry, The page you requested is doesn't seems to exist."
      extra={
        <>
          <span className="ant-result-subtitle"><h3>Possible Reasons</h3>
            <ul>
              <li>
                The address may have typed incorrectly.
              </li>
              <li>
                It may be a broken or outdated link.
              </li>
            </ul>
          </span>
          <Button className="gx-btn-primary" href="/">Go Home</Button>
        </>
      }
    />
  )
};

export default _404
