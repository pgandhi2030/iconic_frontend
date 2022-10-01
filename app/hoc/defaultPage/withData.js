import React, { useEffect } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import CircularProgress from "../../components/CircularProgress";

export default (ComposedComponent) => (props) => {
	const { authUser, loadUser } = useSelector(({ auth }) => auth);
	useEffect(() => {
		console.log("authUser",authUser)
		if (authUser) {
			if (authUser.role != "clientAdmin" && authUser.kycDone == false) {
				Router.push("/kyc");
			} else {
				Router.push("/home");
			}
		}
	}, [authUser]);
	if (authUser) return <CircularProgress />;
	if (loadUser) return <CircularProgress />;

	return <ComposedComponent {...props} />;
};
