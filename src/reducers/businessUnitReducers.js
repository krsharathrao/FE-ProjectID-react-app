import {
  BUSINESS_UNIT_LIST_REQUEST,
  BUSINESS_UNIT_LIST_SUCCESS,
  BUSINESS_UNIT_LIST_FAIL,
  BUSINESS_UNIT_DETAILS_REQUEST,
  BUSINESS_UNIT_DETAILS_SUCCESS,
  BUSINESS_UNIT_DETAILS_FAIL,
  BUSINESS_UNIT_CREATE_REQUEST,
  BUSINESS_UNIT_CREATE_SUCCESS,
  BUSINESS_UNIT_CREATE_FAIL,
  BUSINESS_UNIT_CREATE_RESET,
  BUSINESS_UNIT_UPDATE_REQUEST,
  BUSINESS_UNIT_UPDATE_SUCCESS,
  BUSINESS_UNIT_UPDATE_FAIL,
  BUSINESS_UNIT_UPDATE_RESET,
  BUSINESS_UNIT_DELETE_REQUEST,
  BUSINESS_UNIT_DELETE_SUCCESS,
  BUSINESS_UNIT_DELETE_FAIL,
} from '../constants/businessUnitConstants';

export const businessUnitListReducer = (state = { businessUnits: [] }, action) => {
  switch (action.type) {
    case BUSINESS_UNIT_LIST_REQUEST:
      return { loading: true, businessUnits: [] };
    case BUSINESS_UNIT_LIST_SUCCESS:
      return { loading: false, businessUnits: action.payload };
    case BUSINESS_UNIT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const businessUnitDetailsReducer = (state = { businessUnit: {} }, action) => {
  switch (action.type) {
    case BUSINESS_UNIT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case BUSINESS_UNIT_DETAILS_SUCCESS:
      return { loading: false, businessUnit: action.payload };
    case BUSINESS_UNIT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const businessUnitCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BUSINESS_UNIT_CREATE_REQUEST:
      return { loading: true };
    case BUSINESS_UNIT_CREATE_SUCCESS:
      return { loading: false, success: true, businessUnit: action.payload };
    case BUSINESS_UNIT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case BUSINESS_UNIT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const businessUnitUpdateReducer = (state = { businessUnit: {} }, action) => {
  switch (action.type) {
    case BUSINESS_UNIT_UPDATE_REQUEST:
      return { loading: true };
    case BUSINESS_UNIT_UPDATE_SUCCESS:
      return { loading: false, success: true, businessUnit: action.payload };
    case BUSINESS_UNIT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case BUSINESS_UNIT_UPDATE_RESET:
      return { businessUnit: {} };
    default:
      return state;
  }
};

export const businessUnitDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BUSINESS_UNIT_DELETE_REQUEST:
      return { loading: true };
    case BUSINESS_UNIT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BUSINESS_UNIT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
