import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import { setAccessToken } from "../../util/Utility";


const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    bindMiddleware([thunk])
  );
  let currentState = store.getState();
  store.subscribe(() => {
    // keep track of the previous and current state to compare changesAppLayout/index.j
    let previousState = currentState;
    currentState = store.getState();
    // if the token changes set the value in localStorage and axios headers
    // console.log("previousState", previousState)
    // console.log("currentState", currentState)
    // if (previousState.auth.token !== currentState.auth.token) {
    //   const token = currentState.auth.token;
    //   setAccessToken(token);
    // }
  });
  return store;
}

export default configureStore;
