import React, { useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import CustomScrollbars from "../../../util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import {
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	THEME_TYPE_LITE,
} from "../../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import { setPathName } from "../../../redux/actions";
import { ContactsOutlined, CarryOutOutlined, SettingOutlined, SecurityScanOutlined, ReconciliationOutlined, TeamOutlined, FileTextOutlined, UserAddOutlined, DollarOutlined } from '@ant-design/icons';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BsCalendarWeek } from "react-icons/bs";
import { GoBook } from "react-icons/go";
import { VscOrganization } from "react-icons/vsc";
import { MdOutlineAssessment, MdEventNote, MdOutlineVerifiedUser } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = (props) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth.authUser);
	const role = auth ? auth.role : null;
	const projectId = auth && auth.projectId ? auth.projectId._id : null;
	let { navStyle, themeType, pathname } = useSelector(
		({ settings }) => settings
	);

	const getNoHeaderClass = (navStyle) => {
		if (
			navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
			navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
		) {
			return "gx-no-header-notifications";
		}
		return "";
	};
	const getNavStyleSubMenuClass = (navStyle) => {
		if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
			return "gx-no-header-submenu-popup";
		}
		return "";
	};

	useEffect(() => {
		dispatch(setPathName(router.pathname));
	}, [router.pathname]);

	const selectedKeys = pathname.substr(1);
	const defaultOpenKeys = selectedKeys.split("/")[1];
	return (
		<>
			<SidebarLogo />
			<div className="gx-sidebar-content">
				<CustomScrollbars className="gx-layout-sider-scrollbar">
					<Menu
						defaultOpenKeys={[defaultOpenKeys]}
						selectedKeys={[selectedKeys]}
						theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
						mode="inline"
					>


						<Menu.Item key="setup">
							<Link href={`/home`}>
								<a>
									<i className="icon icon-components" />
									{/* <SettingOutlined style={{ fontSize: '20px' }} /> */}
									<span>Home</span>
								</a>
							</Link>
						</Menu.Item>

					</Menu>
				</CustomScrollbars>
			</div>
		</>
	);
};

SidebarContent.propTypes = {};
export default SidebarContent;
