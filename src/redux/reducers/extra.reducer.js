import { SET_CURRENT_ACTIVE_MAIN_TAB, SET_PREV_ACTIVE_MAIN_TAB } from "./actionTypes";

const initialState = {
    currentActiveMainTab: "HOME",
    prevActiveMainTab: null
};

export const extraReducer = (prevState = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_CURRENT_ACTIVE_MAIN_TAB: {
            return {
                ...prevState,
                currentActiveMainTab: payload
            };
        }
        case SET_PREV_ACTIVE_MAIN_TAB: {
            return {
                ...prevState,
                prevActiveMainTab: payload
            };
        }
        default: {
            return prevState;
        }
    }
};
