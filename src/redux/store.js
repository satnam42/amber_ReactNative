import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { authReducer } from './reducers/auth.reducer';
import { callReducer } from './reducers/call.reducer';

import logger from 'redux-logger';
import { profileReducer } from './reducers/profile.reducer';
import { followReducer } from './reducers/follow.reducer';
import { blockReducer } from './reducers/block.reducer';
import { chatReducer } from './reducers/chat.reducer';
import { notificationReducer } from './reducers/notification.reducer';
import { extraReducer } from './reducers/extra.reducer';
import { popupReducer } from './reducers/popup.reducer';
import { coinReducer } from './reducers/coin.reducer';
import { usersReducer } from './reducers/users.reducer';
import { RESET_REDUX_STORE } from './reducers/actionTypes';
const appReducer = combineReducers({
  auth: authReducer,
  call: callReducer,
  profile: profileReducer,
  follow: followReducer,
  block: blockReducer,
  chat: chatReducer,
  notification: notificationReducer,
  extra: extraReducer,
  popup: popupReducer,
  coin: coinReducer,
  users: usersReducer
});



const rootReducer = (state, action) => {
  if (action.type === RESET_REDUX_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};


const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger)),
);

export default store;
