import React, { useContext } from "react";
import { Avatar, Popover } from "antd";
import { useSelector } from "react-redux";
import { onLogout } from "../../../redux/actions/Auth";
import { useRouter } from 'next/router'
import { useDispatch } from "react-redux";
import Link from 'next/link';

const UserProfile = (props) => {
  const { authUser } = useSelector(({ auth }) => auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <Link href="/profile">
        <li>
          <a>Profile</a>
        </li>
      </Link>
      <Link href="/logout">
        <li>
          <a>Logout</a>
        </li>
      </Link>

    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-avatar-row">
      <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
        <span className="ant-avatar ant-avatar-circle ant-avatar-image gx-pointer gx-mr-2">
          {/* <Image src={user && user.avatar ? (process.env.NEXT_PUBLIC_BACKEND_PATH_VARIABLE+user.avatar): "/images/profile/default.jpg"} height="30" width="30" layout="responsive" /> */}
          <Avatar alt={authUser && authUser.firstName} src={(authUser && authUser.avatar) ? (process.env.NEXT_PUBLIC_BACKEND_PATH_VARIABLE + authUser.avatar) : "/images/iconic icon.png"} />
        </span>
        <span className="gx-avatar-name">{authUser ? (authUser.firstName ? authUser.firstName : '') + " " + (authUser.lastName ? authUser.lastName : '') : ''}<i
          className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
      </Popover>
    </div>
  )
};

export default UserProfile;
