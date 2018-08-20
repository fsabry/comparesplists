import { combineReducers } from "redux";
import application from 'reducers/Application';
import { reducer as formReducer } from 'redux-form';

const RootReducers = combineReducers({
  application,
  form: formReducer
});

export default RootReducers;