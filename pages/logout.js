
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Page from '@/app/hoc/securedPage';
import { useDispatch } from "react-redux";
import { onLogout } from "@/redux/actions/Auth";
import axios from '@/util/Api';
import { Cookies } from 'react-cookie'
import { SET_AUTH_USER_DATA, UPDATE_LOAD_USER, USER_TOKEN_SET } from "@/constants/ActionTypes";

const Logout = ({ apollo }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .post('auth/logout')
            .then(({ data }) => {
                const cookies = new Cookies();
                cookies.remove('token');
                dispatch({
                  type: USER_TOKEN_SET,
                  payload: null
                });
                dispatch({
                    type: SET_AUTH_USER_DATA,
                    payload: null
                });
                router.push("/signin");
            })
            .catch(function (error) {
              
            });

    }, [])

    return (
        <div className="row">
            <div className="col-md-5 gs-mx-auto">
                <h1 className="page-title">Logout</h1>
                <p>Signing out...</p>
            </div>
        </div>
    )
}

export default Page(Logout);
