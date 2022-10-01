import { combineReducers } from "redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import ClientData from "./ClientData";


const reducers = combineReducers({
  settings: Settings,
  auth: Auth,
  common: Common,
  clientData: ClientData
});

export default reducers;
