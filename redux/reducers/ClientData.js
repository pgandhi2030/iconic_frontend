
const INIT_STATE = {
  clientData: null,
  loadUser: true,
  token: null
};

const clientData = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_CLIENT_DATA": {
      return {
        ...state,
        clientData: action.payload
      };
    }
    default:
      return state;
  }
};

export default clientData
