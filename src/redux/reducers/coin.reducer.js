import { COIN_REDUCER_REFRESH, GET_USER_COINS_COUNT_FAIL, GET_USER_COINS_COUNT_REQUEST, GET_USER_COINS_COUNT_SUCCESS, REMOVE_SELECTED_COIN_FOR_PURCHASE, SET_SELECTED_COIN_FOR_PURCHASE } from "./actionTypes";


const initialState = {
    selectedCoinForPurchase: null,
    currectCoin: 0,
    loading: false,
    error: null,
};
export const coinReducer = (prevState = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_SELECTED_COIN_FOR_PURCHASE: {
            return {
                ...prevState,
                selectedCoinForPurchase: payload,
            };
        }
        case REMOVE_SELECTED_COIN_FOR_PURCHASE: {
            return {
                ...prevState,
                selectedCoinForPurchase: null
            };
        }
        case GET_USER_COINS_COUNT_REQUEST: {
            return {
                ...prevState,
                loading: true,
                error: null
            };
        }
        case GET_USER_COINS_COUNT_SUCCESS: {
            return {
                ...prevState,
                currectCoin: payload,
                loading: false
            };
        }
        case GET_USER_COINS_COUNT_FAIL: {
            return {
                ...prevState,
                loading: false,
                error: payload
            };
        }
        case COIN_REDUCER_REFRESH: {
            return {
                ...prevState,
                loading: false,
                error: null
            };
        }

        default: {
            return prevState;
        }
    }
};


