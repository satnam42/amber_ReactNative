import {deleteFromLocalStorage, toLocalStorage} from '../../utils/helper';
import {
  LOAD_PROFILE,
  LOGIN_FAIL,
  LOGIN_REFRESH,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER_COORDS,
  UPDATE_PROFILE_PHOTO,
  UPDATE_USER,
  DO_PROFILE_UPDATE,
  UPDATE_MY_PROFILE,
  REMOVE_VIDEO_FROM_USER_VIDEO_LIST,
} from './actionTypes';

const initialState = {
  accessToken: null,
  user: null,
  doUpdateProfile: false,
  loading: false,
  coords: {
    hasCoords: false,
    lat: null,
    lng: null,
  },
};

export const authReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case LOGIN_REQUEST: {
      return {
        ...prevState,
        user: null,
        loading: true,
      };
    }
    case LOGIN_SUCCESS: {
      toLocalStorage('auth', payload);
      return {
        ...prevState,
        accessToken: payload?.token,
        user: payload,
        loading: false,
      };
    }
    case LOGIN_FAIL: {
      return {
        ...prevState,
        accessToken: null,
        user: null,
        loading: false,
        error: payload,
      };
    }
    case LOGIN_REFRESH: {
      return {
        ...prevState,
        accessToken: null,
        user: null,
        loading: false,
        error: null,
      };
    }
    case LOGOUT: {
      deleteFromLocalStorage('auth');
      return {
        ...prevState,
        user: null,
        accessToken: null,
        loading: false,
      };
    }
    case LOAD_PROFILE: {
      return {
        ...prevState,
        user: payload,
        accessToken: payload?.token,
        loading: false,
      };
    }
    case UPDATE_USER: {
      return {
        ...prevState,
        user: {...prevState.user, ...payload},
        loading: false,
      };
    }
    case UPDATE_MY_PROFILE: {
      toLocalStorage('auth', {...prevState.user, ...payload});
      return {
        ...prevState,
        user: {...prevState.user, ...payload},
        loading: false,
      };
    }

    case UPDATE_PROFILE_PHOTO: {
      return {
        ...prevState,
        user: {...prevState.user, avatar: payload},
        loading: false,
      };
    }

    case SET_USER_COORDS: {
      return {
        ...prevState,
        coords: {
          hasCoords: payload.hasCoords,
          lat: payload.lat,
          lng: payload.lng,
        },
      };
    }

    case REMOVE_VIDEO_FROM_USER_VIDEO_LIST: {
      return {
        ...prevState,
        user: {
          ...prevState?.user,
          videos: prevState.user?.videos.filter(
            item => item.name !== payload.videoName,
          ),
        },
      };
    }
    case DO_PROFILE_UPDATE: {
      return {
        ...prevState,
        doUpdateProfile: !prevState.doUpdateProfile,
      };
    }

    default: {
      return prevState;
    }
  }
};
