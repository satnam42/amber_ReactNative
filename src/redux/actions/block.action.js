import { api_getBlockUsers } from "../../api_services";
import {
  GET_BLOCKLIST_FAIL,
  GET_BLOCKLIST_REQUEST,
  GET_BLOCKLIST_SUCCESS,
} from "../reducers/actionTypes";

// get block list
export const getBlockList = (data) => async (dispatch) => {
  dispatch({
    type: GET_BLOCKLIST_REQUEST,
  });

  try {
    const response = await api_getBlockUsers(data);

    if (response.statusCode === 200) {
      dispatch({
        type: GET_BLOCKLIST_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: GET_BLOCKLIST_FAIL,
      payload: error?.error || error.message || "something went wrong",
    });
  }
};
