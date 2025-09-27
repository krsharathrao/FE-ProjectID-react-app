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
import {
  getBusinessUnits,
  getBusinessUnitById,
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
} from '../api/businessUnitApi';

export const listBusinessUnits = () => async (dispatch) => {
  try {
    dispatch({ type: BUSINESS_UNIT_LIST_REQUEST });
    const { data } = await getBusinessUnits();
    dispatch({ type: BUSINESS_UNIT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUSINESS_UNIT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const businessUnitDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BUSINESS_UNIT_DETAILS_REQUEST });
    const { data } = await getBusinessUnitById(id);
    dispatch({ type: BUSINESS_UNIT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUSINESS_UNIT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createBusinessUnitAction = (businessUnit) => async (dispatch) => {
  try {
    dispatch({ type: BUSINESS_UNIT_CREATE_REQUEST });
    const { data } = await createBusinessUnit(businessUnit);
    dispatch({ type: BUSINESS_UNIT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUSINESS_UNIT_CREATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateBusinessUnitAction = (id, businessUnit) => async (dispatch) => {
  try {
    dispatch({ type: BUSINESS_UNIT_UPDATE_REQUEST });
    const { data } = await updateBusinessUnit(id, businessUnit);
    dispatch({ type: BUSINESS_UNIT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUSINESS_UNIT_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const deleteBusinessUnitAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: BUSINESS_UNIT_DELETE_REQUEST });
    await deleteBusinessUnit(id);
    dispatch({ type: BUSINESS_UNIT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: BUSINESS_UNIT_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
