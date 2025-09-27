// Billing Type Redux Logic
import {
  BILLING_TYPE_LIST_REQUEST,
  BILLING_TYPE_LIST_SUCCESS,
  BILLING_TYPE_LIST_FAIL,
  BILLING_TYPE_DETAILS_REQUEST,
  BILLING_TYPE_DETAILS_SUCCESS,
  BILLING_TYPE_DETAILS_FAIL,
  BILLING_TYPE_CREATE_REQUEST,
  BILLING_TYPE_CREATE_SUCCESS,
  BILLING_TYPE_CREATE_FAIL,
  BILLING_TYPE_CREATE_RESET,
  BILLING_TYPE_UPDATE_REQUEST,
  BILLING_TYPE_UPDATE_SUCCESS,
  BILLING_TYPE_UPDATE_FAIL,
  BILLING_TYPE_UPDATE_RESET,
  BILLING_TYPE_DELETE_REQUEST,
  BILLING_TYPE_DELETE_SUCCESS,
  BILLING_TYPE_DELETE_FAIL,
  BILLING_TYPE_DELETE_RESET
} from '../constants/billingTypeConstants';

// List
export const billingTypeListReducer = (state = { billingTypes: [] }, action) => {
  switch (action.type) {
    case BILLING_TYPE_LIST_REQUEST:
      return { loading: true, billingTypes: [] };
    case BILLING_TYPE_LIST_SUCCESS:
      return { loading: false, billingTypes: action.payload };
    case BILLING_TYPE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Details
export const billingTypeDetailsReducer = (state = { billingType: {} }, action) => {
  switch (action.type) {
    case BILLING_TYPE_DETAILS_REQUEST:
      return { ...state, loading: true };
    case BILLING_TYPE_DETAILS_SUCCESS:
      return { loading: false, billingType: action.payload };
    case BILLING_TYPE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Create
export const billingTypeCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BILLING_TYPE_CREATE_REQUEST:
      return { loading: true };
    case BILLING_TYPE_CREATE_SUCCESS:
      return { loading: false, success: true, billingType: action.payload };
    case BILLING_TYPE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case BILLING_TYPE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// Update
export const billingTypeUpdateReducer = (state = { billingType: {} }, action) => {
  switch (action.type) {
    case BILLING_TYPE_UPDATE_REQUEST:
      return { loading: true };
    case BILLING_TYPE_UPDATE_SUCCESS:
      return { loading: false, success: true, billingType: action.payload };
    case BILLING_TYPE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case BILLING_TYPE_UPDATE_RESET:
      return { billingType: {} };
    default:
      return state;
  }
};

// Delete
export const billingTypeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BILLING_TYPE_DELETE_REQUEST:
      return { loading: true };
    case BILLING_TYPE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BILLING_TYPE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case BILLING_TYPE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
