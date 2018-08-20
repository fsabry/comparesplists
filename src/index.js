import React from 'react';
import ReactDOM from 'react-dom';
import 'css/App.css';
import App from 'components/App';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import RootReducers from 'reducers';
import saga from 'sagas/Saga';
import * as constants from 'utils/Constants';

const sagaMiddleware = createSagaMiddleware();

let store = createStore(RootReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(saga);

//Get sites
store.dispatch({type: constants.GET_ALL_WEBS});

ReactDOM.render(
    <Provider store={store}>
      <div className="enableBootstrap">
        <App />
      </div>    
    </Provider>, document.getElementById('root'));

