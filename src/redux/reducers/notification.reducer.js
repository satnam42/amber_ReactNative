import {
  ADD_TO_NOTIFICATION_STORAGE,
  SET_LATEST_NOTIFICATION,
  TEXT_MSG_RECIVED_NOTIFICATION,
} from './actionTypes';

const initialState = {
  latestNotification: null,
  notificationStorage: [],
  textMsgRecived: null,
};

export const notificationReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_TO_NOTIFICATION_STORAGE: {
      return {
        ...prevState,
        notificationStorage: [...prevState.notificationStorage, payload],
      };
    }
    case SET_LATEST_NOTIFICATION: {
      return {
        ...prevState,
        latestNotification: payload,
      };
    }
    case TEXT_MSG_RECIVED_NOTIFICATION: {
      return {
        ...prevState,
        textMsgRecived: payload,
      };
    }

    default: {
      return prevState;
    }
  }
};
