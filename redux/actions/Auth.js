import { fetchError, fetchStart, fetchSuccess } from '../../redux/actions';
import React from 'react';
import axios from '../../util/Api';
import { SET_AUTH_USER_DATA, UPDATE_LOAD_USER, USER_TOKEN_SET } from "../../constants/ActionTypes";
import { Cookies } from 'react-cookie'
import moment from 'moment';

export const setAuthUser = user => {
  return dispatch => {
    dispatch({
      type: SET_AUTH_USER_DATA,
      payload: user,
    });
  };
};

export const updateLoadUser = () => {
  return dispatch => {
    dispatch({
      type: UPDATE_LOAD_USER,
    });
  };
};

export const setAUthToken = token => {
  return dispatch => {
    dispatch({
      type: USER_TOKEN_SET,
      payload: token,
    });
  };
};

export const onRegister = (values) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('auth/signUp', values)
      .then(({ data }) => {
        if (data.result) {
          // if (data.token.access_token) {
          //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
          //   const cookies = new Cookies();
          //   cookies.set('token', data.token.access_token);
          // }
          // dispatch({
          //   type: USER_TOKEN_SET,
          //   payload: data.token.access_token
          // });

          dispatch(fetchSuccess("Registration Successfully Done"));
          // getAuthUser(dispatch);
        }
      })
      .catch(function (error) {
        dispatch(fetchError(error.message));
      });
  };
};

export const onLogin = ({ username, password }) => {
  return dispatch => {
    try {
      dispatch(fetchStart());
      axios
        .post('auth/signIn', {
          username: username,
          password: password,
        }).catch(function (error) {
          dispatch(fetchError(error.message));
        });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};


export const onLogout = (route) => {
  return dispatch => {
    dispatch(fetchStart());
    axios
      .post('auth/logout')
      .then(({ data }) => {
        if (data.result) {
          route.push("/signin");
          // dispatch({
          //   type: USER_TOKEN_SET,
          //   payload: null
          // });
          dispatch(fetchSuccess());
          const cookies = new Cookies();
          cookies.remove('token');
          dispatch(setAuthUser(null));
        }
      })
      .catch(function (error) {
        console.log("onLogout error", error);

      });
  };
};

export const getAuthUser = (dispatch) => {
  dispatch(fetchStart());
  axios
    .post('user/me')
    .then(({ data }) => {
      if (data.result) {
        data.user.dateOfBirth = moment(data.user.dateOfBirth)
        dispatch(fetchSuccess());
        dispatch(setAuthUser(data.user));
      } else {
        dispatch(updateLoadUser());
      }
    })
    .catch(function (error) {
      dispatch(updateLoadUser());
    });
};
export const getAuthUser0 = (loaded = false, token) => {
  return dispatch => {
    if (!token) {
      const token = getCookie('token');
      if (token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    dispatch(fetchStart());
    dispatch(updateLoadUser(loaded));
    axios
      .post('user/me')
      .then(({ data }) => {
        if (data.result) {
          data.user.dateOfBirth = moment(data.user.dateOfBirth)
          dispatch(fetchSuccess());
          dispatch(setAuthUser(data.user));
        } else {
          dispatch(updateLoadUser(true));
        }
      })
      .catch(function (error) {
        dispatch(updateLoadUser(true));
      });
  };
};
