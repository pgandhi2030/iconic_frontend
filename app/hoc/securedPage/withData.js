import React, {useEffect} from "react";
import Router from "next/router";
import {useSelector} from "react-redux";
import CircularProgress from "../../components/CircularProgress";

export default (ComposedComponent) => (props) => {
  const {authUser, loadUser} = useSelector(({auth}) => auth);

  useEffect(() => {
    if (!authUser && !loadUser) {
      Router.push("/signin");
    }
  }, [authUser, loadUser]);

  if (!authUser || loadUser) return <CircularProgress/>;

  return <ComposedComponent {...props} />;
};
