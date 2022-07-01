import { api_getUserCoin } from "../../api_services";
import { COIN_REDUCER_REFRESH, GET_BLOCKLIST_SUCCESS, GET_USER_COINS_COUNT_FAIL, GET_USER_COINS_COUNT_REQUEST, GET_USER_COINS_COUNT_SUCCESS } from "../reducers/actionTypes";

// COINS
export const getUserCoin = data => async dispatch => {
    dispatch({
        type: GET_USER_COINS_COUNT_REQUEST,
    });

    try {
        const response = await api_getUserCoin(data);
        if (response.statusCode === 200) {
            dispatch({
                type: GET_USER_COINS_COUNT_SUCCESS,
                payload: response?.data?.activeCoin,
            });
        } else {
            throw response;
        }
    } catch (error) {
        dispatch({
            type: GET_USER_COINS_COUNT_FAIL,
            payload: error?.error || error.message || 'failed to get new coin values',
        });
    }
};

// CLEAN-UP
export const coin_reducer_refresh = () => async dispatch => {
    dispatch({
        type: COIN_REDUCER_REFRESH,
    });
};