import {
  CURRENT_VIEW_PROFILE_FAIL,
  CURRENT_VIEW_PROFILE_REQUEST,
  CURRENT_VIEW_PROFILE_SUCCESS,
  PROFILE_LIST_MAIN_FAIL,
  PROFILE_LIST_MAIN_REQUEST,
  PROFILE_LIST_MAIN_SUCCESS,
  PROFILE_LIST_REFRESH,
  REMOVE_CURRENT_VIEW_PROFILE,
} from './actionTypes';

const initialState = {
  currentViewProfile: null,
  currentViewFollowers: null,
  currentViewFollowing: null,
  profileListMain: [],
  loading: false,
  error: null,
};
export const profileReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case CURRENT_VIEW_PROFILE_REQUEST: {
      return {
        ...prevState,
        loading: true,
        currentViewProfile: null,
        error: null,
      };
    }
    case CURRENT_VIEW_PROFILE_SUCCESS: {
      return {
        ...prevState,
        loading: false,
        currentViewProfile: payload,
        error: null,
      };
    }
    case CURRENT_VIEW_PROFILE_FAIL: {
      return {
        ...prevState,
        loading: false,
        currentViewProfile: null,
        error: payload,
      };
    }
    case REMOVE_CURRENT_VIEW_PROFILE: {
      return {
        ...prevState,
        currentViewProfile: null,
      };
    }

    case PROFILE_LIST_MAIN_REQUEST: {
      return {
        ...prevState,
        loading: true,
        error: null,
      };
    }
    case PROFILE_LIST_MAIN_SUCCESS: {
      return {
        ...prevState,
        loading: false,
        // profileListMain: payload,
        profileListMain: [...prevState.profileListMain, ...payload],
        error: null,
      };
    }
    case PROFILE_LIST_MAIN_FAIL: {
      return {
        ...prevState,
        loading: false,
        error: payload,
      };
    }
    case PROFILE_LIST_REFRESH: {
      return {
        ...prevState,
        loading: false,
        error: null,
      };
    }

    default: {
      return prevState;
    }
  }
};
