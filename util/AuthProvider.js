import React from "react";
import {useAuthToken} from "./AppHooks";
import PropTypes from "prop-types";

const AuthRoutes = ({children}) => {
	useAuthToken();

	return <>{children}</>;
};

export default AuthRoutes;

AuthRoutes.propTypes = {
	children: PropTypes.node.isRequired
};
