import React, { useEffect } from 'react';
import Redirect from '@/app/components/shared/Redirect';
import CircularProgress from "@/app/components/CircularProgress";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";

const authComponent = (WrappedComponent, role, options = { ssr: false }) => {
    function WithAuth(props) {
        const router = useRouter();
        const dispatch = useDispatch();

        const { authUser, loadUser, error } = useSelector(({ auth }) => auth);

        useEffect(() => {
            dispatch({ type: 'SET_AUTH_USER_DATA', payload: authUser });
        }, [authUser]);

        if (
            // !loadUser &&
            (!authUser || error) &&
            typeof window !== 'undefined'
        ) {
            console.log("REDIECTING TO SIGNIN")
            return <Redirect to={process.env.NEXT_PUBLIC_PROTOCOL + process.env.NEXT_PUBLIC_REDIRECT + '/signin'} query={{ message: 'NOT_AUTHENTICATED' }} />
        }

        // TODO: Send a message to login page
        if (authUser) {
            if (role && !role.includes(authUser.role)) {
                return <Redirect to={process.env.NEXT_PUBLIC_PROTOCOL + process.env.NEXT_PUBLIC_REDIRECT + '/signin'} query={{ message: 'NOT_AUTHORIZED' }} />
            }

            return <WrappedComponent {...props} user={authUser} />
        }

        return (
            <CircularProgress />
        )
    }

    if (options.ssr) {
        const serverRedirect = (res, to) => {
            res.redirect(to);
            res.end();
            return {};
        }

        WithAuth.getInitialProps = async (context) => {
            const { req, res } = context;
            if (req) {
                const { user } = req;
                if (!user) {
                    return serverRedirect(res, (process.env.NEXT_PUBLIC_PROTOCOL + process.env.NEXT_PUBLIC_REDIRECT + '/signin?message=NOT_AUTHENTICATED'));
                }

            }

            const pageProps = WrappedComponent.getInitialProps && await WrappedComponent.getInitialProps(context);
            return { ...pageProps, user };
        }
    }

    return WithAuth;
}

export default authComponent;
