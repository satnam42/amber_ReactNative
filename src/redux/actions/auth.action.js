import {api_login} from '../../api_services';
import {
  LOGIN_FAIL,
  LOGIN_REFRESH,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from '../reducers/actionTypes';

// LOGIN
export const login = data => async dispatch => {
  console.log('loging with ', data);
  dispatch({
    type: LOGIN_REQUEST,
  });

  try {
    const response = await api_login(data);
    if (response.statusCode === 200) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      });
    } else {
      throw response;
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error?.error || error.message || 'something went wrong',
    });
  }
};

// UPDATE PROFILE
// export const updateMyProfile = data => async dispatch => {

//   dispatch({
//     type: LOGIN_REQUEST,
//   });

//   try {
//     const response = await api_login(data);
//     if (response.statusCode === 200) {
//       dispatch({
//         type: LOGIN_SUCCESS,
//         payload: response.data,
//       });
//     } else {
//       throw response;
//     }
//   } catch (error) {
//     dispatch({
//       type: LOGIN_FAIL,
//       payload: error?.error || error.message || 'something went wrong',
//     });
//   }
// };

// CLEAN-UP
export const login_refresh = () => async dispatch => {
  dispatch({
    type: LOGIN_REFRESH,
  });
};
