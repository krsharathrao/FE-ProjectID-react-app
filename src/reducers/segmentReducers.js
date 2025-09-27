import {
  SEGMENT_LIST_REQUEST,
  SEGMENT_LIST_SUCCESS,
  SEGMENT_LIST_FAIL,
  SEGMENT_DETAILS_REQUEST,
  SEGMENT_DETAILS_SUCCESS,
  SEGMENT_DETAILS_FAIL,
  SEGMENT_CREATE_REQUEST,
  SEGMENT_CREATE_SUCCESS,
  SEGMENT_CREATE_FAIL,
  SEGMENT_CREATE_RESET,
  SEGMENT_UPDATE_REQUEST,
  SEGMENT_UPDATE_SUCCESS,
  SEGMENT_UPDATE_FAIL,
  SEGMENT_UPDATE_RESET,
  SEGMENT_DELETE_REQUEST,
  SEGMENT_DELETE_SUCCESS,
  SEGMENT_DELETE_FAIL,
} from '../constants/segmentConstants';

export const segmentListReducer = (state = { segments: [] }, action) => {
  switch (action.type) {
    case SEGMENT_LIST_REQUEST:
      return { loading: true, segments: [] };
    case SEGMENT_LIST_SUCCESS:
      return { loading: false, segments: action.payload };
    case SEGMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const segmentDetailsReducer = (state = { segment: {} }, action) => {
  switch (action.type) {
    case SEGMENT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case SEGMENT_DETAILS_SUCCESS:
      return { loading: false, segment: action.payload };
    case SEGMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const segmentCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SEGMENT_CREATE_REQUEST:
      return { loading: true };
    case SEGMENT_CREATE_SUCCESS:
      return { loading: false, success: true, segment: action.payload };
    case SEGMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case SEGMENT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const segmentUpdateReducer = (state = { segment: {} }, action) => {
  switch (action.type) {
    case SEGMENT_UPDATE_REQUEST:
      return { loading: true };
    case SEGMENT_UPDATE_SUCCESS:
      return { loading: false, success: true, segment: action.payload };
    case SEGMENT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SEGMENT_UPDATE_RESET:
      return { segment: {} };
    default:
      return state;
  }
};

export const segmentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SEGMENT_DELETE_REQUEST:
      return { loading: true };
    case SEGMENT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SEGMENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
