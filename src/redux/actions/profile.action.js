import { getRandomUser, getUserDetails } from "../../api_services";
import {
  CURRENT_VIEW_PROFILE_FAIL,
  CURRENT_VIEW_PROFILE_REQUEST,
  CURRENT_VIEW_PROFILE_SUCCESS,
  PROFILE_LIST_MAIN_FAIL,
  PROFILE_LIST_MAIN_REQUEST,
  PROFILE_LIST_MAIN_SUCCESS,
} from "../reducers/actionTypes";

// GET_CURRENT_VIEW_PROFILE
export const getViewProfile = (data) => async (dispatch) => {
  dispatch({
    type: CURRENT_VIEW_PROFILE_REQUEST,
  });

  try {
    const { token, userId } = data;
    const response = await getUserDetails(token, userId);

    if (response.statusCode === 200) {
      dispatch({
        type: CURRENT_VIEW_PROFILE_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: CURRENT_VIEW_PROFILE_FAIL,
      payload: error?.error || error.message || "something went wrong",
    });
  }
};

// GET / UPDATE PROFILE_LIST_MAIN
export const getUpdateProfileListMain = (data) => async (dispatch) => {
  dispatch({
    type: PROFILE_LIST_MAIN_REQUEST,
  });

  try {
    const { gender, pageNo } = data;

    const response = await getRandomUser(gender, pageNo);
    console.log(response);
    if (response.statusCode === 200) {
      dispatch({
        type: PROFILE_LIST_MAIN_SUCCESS,
        payload: response.items,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: PROFILE_LIST_MAIN_FAIL,
      payload: error?.error || error.message || "something went wrong",
    });
  }
};
