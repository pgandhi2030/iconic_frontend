import { SET_AUTH_USER_DATA, UPDATE_LOAD_USER, USER_TOKEN_SET } from '../../constants/ActionTypes';

const INIT_STATE = {
  authUser: null,
  loadUser: true,
  token: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_AUTH_USER_DATA: {
      return {
        ...state,
        authUser: action.payload, loadUser: false,
      };
    }
    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload,
      };
    }
    case UPDATE_LOAD_USER: {
      return {
        ...state,
        loadUser: false,
      };
    }
    default:
      return state;
  }
};
