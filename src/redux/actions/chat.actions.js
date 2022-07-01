import {api_conversationList, api_getOldChat} from '../../api_services';
import {
  CONVERSATION_LIST_FAIL,
  CONVERSATION_LIST_REQUEST,
  CONVERSATION_LIST_SUCCESS,
  GET_OLD_CHAT_FAIL,
  GET_OLD_CHAT_REQUEST,
  GET_OLD_CHAT_SUCCESS,
} from '../reducers/actionTypes';

export const getOldChat = data => async dispatch => {
  dispatch({
    type: GET_OLD_CHAT_REQUEST,
  });

  try {
    const response = await api_getOldChat(data);

    if (response.statusCode === 200) {
      dispatch({
        type: GET_OLD_CHAT_SUCCESS,
        payload: response?.items,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: GET_OLD_CHAT_FAIL,
      payload: error?.error || error.message || 'something went wrong',
    });
  }
};
export const getCoversationList = data => async dispatch => {
  dispatch({
    type: CONVERSATION_LIST_REQUEST,
  });

  try {
    const response = await api_conversationList(data);

    if (response.statusCode === 200) {
      dispatch({
        type: CONVERSATION_LIST_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: CONVERSATION_LIST_FAIL,
      payload: error?.error || error.message || 'something went wrong',
    });
  }
};
