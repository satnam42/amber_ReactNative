import {
  END_VIDEO_CALL,
  REMOVE_CALLING_TO,
  SETISVIDEOCALL,
  SET_CALLING_TO,
  TOGGLE_IS_RECIVING,
  SET_IS_ALREADY_IN_CALL,
  SET_CALL_ACTION,
  SET_CALLING_DATA,
  SET_CALL_MODE
} from './actionTypes';

const initialState = {
  incomingCall: false,
  navigateTo: null,
  isVideoCalling: false,
  callingTo: null,
  isReciving: null,
  isAlreadyInCall: false,
  callAction: null,
  callMode: null,
  callingData: null
};

export const callReducer = (prevState = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SETISVIDEOCALL: {
      return {
        ...prevState,
        isVideoCalling: payload.bool,
        navigateTo: payload.navigateTo || null,
      };
    }
    case END_VIDEO_CALL: {
      return {
        ...prevState,
        isVideoCalling: false,
        navigateTo: null,
        isReciving: null,
        incomingCall: false,
        callingTo: null,
      };
    }
    case SET_CALLING_TO: {
      return {
        ...prevState,
        callingTo: payload,
      };
    }
    case REMOVE_CALLING_TO: {
      return {
        ...prevState,
        callingTo: null,
      };
    }
    case TOGGLE_IS_RECIVING: {
      return {
        ...prevState,
        isReciving: payload,
      };
    }
    case SET_IS_ALREADY_IN_CALL: {
      return {
        ...prevState,
        isAlreadyInCall: payload,
      };
    }
    case SET_CALL_ACTION: {
      return {
        ...prevState,
        callAction: payload,
      };
    }
    case SET_CALL_MODE: {
      return {
        ...prevState,
        callMode: payload,
      };
    }
    case SET_CALLING_DATA: {
      return {
        ...prevState,
        callingData: payload,
      };
    }

    default: {
      return prevState;
    }
  }
};
