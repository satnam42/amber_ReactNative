import {
  REFRESH_FOLLOW_REDUCER,
  SET_FOLLOWER_COUNT,
  SET_FOLLOWING_COUNT,
  UPDATE_MY_PROFILE_FAIL,
  UPDATE_MY_PROFILE_REQUEST,
  UPDATE_MY_PROFILE_SUCCESS,
  USER_FOLLOWERS_FAIL,
  USER_FOLLOWERS_REQUEST,
  USER_FOLLOWERS_SUCCESS,
  USER_FOLLOWING_FAIL,
  USER_FOLLOWING_REQUEST,
  USER_FOLLOWING_SUCCESS,
} from './actionTypes';

const initialState = {
  loading: false,
  error: null,
  followersList: [],
  followingList: [],
  followerCount: 0,
  followingCount: 0,
};

export const followReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case USER_FOLLOWERS_REQUEST: {
      return {
        ...prevState,
        followersList: [],
        loading: true,
        error: null,
      };
    }
    case USER_FOLLOWERS_SUCCESS: {
      return {
        ...prevState,
        followersList: payload,
        loading: false,
        error: null,
      };
    }
    case USER_FOLLOWERS_FAIL: {
      return {
        ...prevState,
        loading: false,
        error: payload,
      };
    }
    case REFRESH_FOLLOW_REDUCER: {
      return {
        ...prevState,
        loading: false,
        error: null,
      };
    }
    case USER_FOLLOWING_REQUEST: {
      return {
        ...prevState,
        followingList: [],
        loading: true,
        error: null,
      };
    }
    case USER_FOLLOWING_SUCCESS: {
      return {
        ...prevState,
        followingList: payload,
        loading: false,
        error: null,
      };
    }
    case USER_FOLLOWING_FAIL: {
      return {
        ...prevState,
        loading: false,
        error: payload,
      };
    }
    case SET_FOLLOWER_COUNT: {
      return {
        ...prevState,
        followerCount: payload.count,
      };
    }
    case SET_FOLLOWING_COUNT: {
      return {
        ...prevState,
        followingCount: payload.count,
      };
    }
    case UPDATE_MY_PROFILE_REQUEST: {
      return {
        ...prevState,
        loading: true,
        error: null,
      };
    }
    case UPDATE_MY_PROFILE_SUCCESS: {
      return {
        ...prevState,
        loading: true,
        error: null,
      };
    }
    case UPDATE_MY_PROFILE_FAIL: {
      return {
        ...prevState,
        loading: false,
        error: payload,
      };
    }

    default: {
      return prevState;
    }
  }
};
