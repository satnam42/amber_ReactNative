import {
  GET_USERS_LIST_FAIL,
  USERS_REDUCER_REFRESH,
  GET_USERS_LIST_REQUEST,
  GET_USERS_LIST_SUCCESS,
  SET_USER_LIST_FILTER,
  REMOVE_USERS_LIST,
  REMOVE_USER_FROM_USERLIST,
} from './actionTypes';

const initialState = {
  userList: [],
  loading: false,
  error: null,
  filter_pageSize: 10,
  filter_pageNo: 1,
  filter_country: 'ALL',
  filter_lat: null,
  filter_lng: null,
  filter_popular: true,
};
export const usersReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case GET_USERS_LIST_REQUEST: {
      return {
        ...prevState,
        loading: true,
        error: null,
      };
    }
    case GET_USERS_LIST_FAIL: {
      return {
        ...prevState,
        loading: false,
        error: payload,
      };
    }
    case GET_USERS_LIST_SUCCESS: {
      return {
        ...prevState,
        loading: false,
        error: null,
        filter_pageNo: prevState.filter_pageNo + 1,
        userList: [...prevState.userList, ...payload],
      };
    }
    case SET_USER_LIST_FILTER: {
      return {
        ...prevState,
        filter_pageSize: payload?.filter_pageSize || prevState.filter_pageSize,
        filter_pageNo: payload?.filter_pageNo || prevState.filter_pageNo,
        filter_country: payload?.filter_country || prevState.filter_country,
        filter_lat: payload?.filter_lat || prevState.filter_lat,
        filter_lng: payload?.filter_lng || prevState.filter_lng,
        filter_popular: payload?.filter_popular || prevState.filter_popular,
      };
    }
    case USERS_REDUCER_REFRESH: {
      return {
        ...prevState,
        loading: false,
        error: null,
      };
    }
    case REMOVE_USERS_LIST: {
      return {
        ...prevState,
        loading: false,
        error: null,
        userList: [],
        filter_pageNo: 1,
      };
    }

    case REMOVE_USER_FROM_USERLIST: {
      const newList = prevState.userList.filter(
        user => user?.id !== payload?.userId,
      );
      return {
        ...prevState,
        userList: newList,
      };
    }

    default: {
      return prevState;
    }
  }
};
