import React from 'react';
import Head from 'next/head'
import withRedux from 'next-redux-wrapper';
import { ToastProvider } from 'react-toast-notifications';
import 'antd/dist/antd.css';
import '../public/loader.css';
import '../styles/style.css';
import initStore from '../redux/store';
import { Provider } from "react-redux";
import { Router } from 'next/dist/client/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import AuthRoutes from "../util/AuthProvider";

NProgress.configure({ showSpinner: false, trickleRate: 0.1, trickleSpeed: 700 });

Router.events.on('routeChangeStart', () => {
  NProgress.start();
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
})

Router.events.on('routeChangeError', () => {
  NProgress.done();
})


const Page = ({ Component, pageProps, store }) => {
  return (
    <>
      <Head>
        <title>Iconic Films and Photography</title>
      </Head>
      <Provider store={store}>
        <AuthRoutes>
          <Component {...pageProps} />
        </AuthRoutes>
      </Provider>
    </>
  );
};

export default withRedux(initStore)(Page);
