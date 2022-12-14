import React from 'react';
import Page from '../app/hoc/defaultPage';
import asyncComponent from "../util/asyncComponent";

const SignUp = asyncComponent(() => import('../routes/userAuth/SignUp'));

export default Page(() => <SignUp/>);
