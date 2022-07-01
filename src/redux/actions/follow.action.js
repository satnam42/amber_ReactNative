import {api_getFollowersList, api_getFollowingList} from '../../api_services';
import {
  USER_FOLLOWERS_FAIL,
  USER_FOLLOWERS_REQUEST,
  USER_FOLLOWERS_SUCCESS,
  USER_FOLLOWING_FAIL,
  USER_FOLLOWING_REQUEST,
  USER_FOLLOWING_SUCCESS,
} from '../reducers/actionTypes';

//GET FOLLOWERS
export const getFollowers = data => async dispatch => {
  dispatch({
    type: USER_FOLLOWERS_REQUEST,
  });

  try {
    const {token, userId} = data;
    const response = await api_getFollowersList(token, userId);
    if (response.statusCode === 200) {
      dispatch({
        type: USER_FOLLOWERS_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: USER_FOLLOWERS_FAIL,
      payload: error?.error || error.message || 'something went wrong',
    });
  }
};

//GET FOLLOWING
export const getFollowing = data => async dispatch => {
  dispatch({
    type: USER_FOLLOWING_REQUEST,
  });
  try {
    const {token, userId} = data;
    const response = await api_getFollowingList(token, userId);
    console.log(response, 'following list');
    if (response.statusCode === 200) {
      dispatch({
        type: USER_FOLLOWING_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: USER_FOLLOWING_FAIL,
      payload: error?.error || error.message || 'something went wrong',
    });
  }
};
