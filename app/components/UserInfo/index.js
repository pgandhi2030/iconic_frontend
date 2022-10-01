import React from "react";
import {useDispatch} from "react-redux";
import {Avatar, Popover} from "antd";
import {onLogout} from "../../../redux/actions/Auth";
import {useRouter} from 'next/router'

const UserInfo = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li>My Account</li>
      <li>Connections</li>
      <li onClick={() => dispatch(onLogout(router))}>Logout
      </li>
    </ul>
  );

  return (
    <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
             trigger="click">
      <Avatar src={"/images/images/avatar/domnic-harris.png"}
              className="gx-avatar gx-pointer" alt=""/>
    </Popover>
  )
};

export default UserInfo;
