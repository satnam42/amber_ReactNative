import {
  ADD_CHAT_STORAGE,
  CHAT_REDUCER_REFRESH,
  CONVERSATION_LIST_FAIL,
  CONVERSATION_LIST_REQUEST,
  CONVERSATION_LIST_SUCCESS,
  DESTORY_CHAT_STORAGE,
  GET_OLD_CHAT_FAIL,
  GET_OLD_CHAT_REQUEST,
  GET_OLD_CHAT_SUCCESS,
} from './actionTypes';

const initialState = {
  error: null,
  loading: false,
  chatStorage: [],
  oldChatPageNo: 1,
  // oldChatStorage: [],
  conversationList: [],
};

export const chatReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case CHAT_REDUCER_REFRESH: {
      return {
        ...prevState,
        error: null,
        loading: false,
      };
    }
    case ADD_CHAT_STORAGE: {
      return {
        ...prevState,
        chatStorage: [...prevState.chatStorage, payload],
      };
    }
    case DESTORY_CHAT_STORAGE: {
      return {
        ...prevState,
        chatStorage: [],
        oldChatPageNo: 1,
      };
    }
    case GET_OLD_CHAT_REQUEST: {
      return {
        ...prevState,
        error: null,
        loading: true,
      };
    }
    case GET_OLD_CHAT_SUCCESS: {
      return {
        ...prevState,
        chatStorage: [...payload.reverse(), ...prevState.chatStorage],
        loading: false,
        oldChatPageNo: prevState.oldChatPageNo + 1,
      };
    }
    case GET_OLD_CHAT_FAIL: {
      return {
        ...prevState,
        error: payload,
        loading: false,
      };
    }
    case CONVERSATION_LIST_REQUEST: {
      return {
        ...prevState,
        error: null,
        loading: true,
      };
    }
    case CONVERSATION_LIST_SUCCESS: {
      return {
        ...prevState,
        conversationList: payload,
        loading: false,
      };
    }
    case CONVERSATION_LIST_FAIL: {
      return {
        ...prevState,
        error: payload,
        loading: false,
      };
    }

    default: {
      return prevState;
    }
  }
};
