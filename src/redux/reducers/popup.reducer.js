import {
  SET_POPUP_OVERLAY,
  REMOVE_POPUP_OVERLAY,
  ADD_POPUP_OVERLAY,
  ADD_OFFER_OVERLAY,
  REMOVE_OFFER_OVERLAY,
} from './actionTypes';

const initialState = {
  isPopupActive: false,
  popupData: null,
  isOfferPopupActive: false,
  offerData: null,
};
export const popupReducer = (prevState = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SET_POPUP_OVERLAY: {
      return {
        ...prevState,
        isPopupActive: payload.isPopupActive,
        popupData: payload.popupData,
      };
    }
    case REMOVE_POPUP_OVERLAY: {
      return {
        ...prevState,
        isPopupActive: false,
        popupData: null,
      };
    }
    case ADD_POPUP_OVERLAY: {
      return {
        ...prevState,
        isPopupActive: true,
        popupData: null,
      };
    }
    case REMOVE_OFFER_OVERLAY: {
      return {
        ...prevState,
        isOfferPopupActive: false,
        offerData: null,
      };
    }
    case ADD_OFFER_OVERLAY: {
      return {
        ...prevState,
        isOfferPopupActive: true,
        offerData: payload,
      };
    }
    default: {
      return prevState;
    }
  }
};
