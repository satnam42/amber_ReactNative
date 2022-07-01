import {
  BLOCK_REDUCER_REFRESH,
  GET_BLOCKLIST_FAIL,
  GET_BLOCKLIST_REQUEST,
  GET_BLOCKLIST_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: null,
  loading: false,
  blockList: [],
};

export const blockReducer = (prevState = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case BLOCK_REDUCER_REFRESH: {
      return {
        ...prevState,
        error: null,
        loading: false,
      };
    }
    case GET_BLOCKLIST_REQUEST: {
      return {
        ...prevState,
        error: null,
        blockList: null,
        loading: true,
      };
    }
    case GET_BLOCKLIST_SUCCESS: {
      return {
        ...prevState,
        error: null,
        blockList: payload,
        loading: false,
      };
    }
    case GET_BLOCKLIST_FAIL: {
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
