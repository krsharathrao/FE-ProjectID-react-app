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
import {
  getSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
} from '../api/segmentApi';

export const listSegments = () => async (dispatch) => {
  try {
    dispatch({ type: SEGMENT_LIST_REQUEST });
    const { data } = await getSegments();
    dispatch({ type: SEGMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEGMENT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const segmentDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SEGMENT_DETAILS_REQUEST });
    const { data } = await getSegmentById(id);
    dispatch({ type: SEGMENT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEGMENT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createSegmentAction = (segment) => async (dispatch) => {
  try {
    dispatch({ type: SEGMENT_CREATE_REQUEST });
    const { data } = await createSegment(segment);
    dispatch({ type: SEGMENT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEGMENT_CREATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateSegmentAction = (id, segment) => async (dispatch) => {
  try {
    dispatch({ type: SEGMENT_UPDATE_REQUEST });
    const { data } = await updateSegment(id, segment);
    dispatch({ type: SEGMENT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEGMENT_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const deleteSegmentAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: SEGMENT_DELETE_REQUEST });
    await deleteSegment(id);
    dispatch({ type: SEGMENT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: SEGMENT_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
