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
  BILLING_TYPE_UPDATE_REQUEST,
  BILLING_TYPE_UPDATE_SUCCESS,
  BILLING_TYPE_UPDATE_FAIL,
  BILLING_TYPE_DELETE_REQUEST,
  BILLING_TYPE_DELETE_SUCCESS,
  BILLING_TYPE_DELETE_FAIL
} from '../constants/billingTypeConstants';
import {
  fetchBillingTypes,
  fetchBillingTypeById,
  createBillingType,
  updateBillingType,
  deleteBillingType
} from '../api/billingTypeApi';

// List Billing Types
export const listBillingTypes = () => async (dispatch) => {
  try {
    dispatch({ type: BILLING_TYPE_LIST_REQUEST });
    const { data } = await fetchBillingTypes();
    dispatch({ type: BILLING_TYPE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BILLING_TYPE_LIST_FAIL,
      payload: error.errors || error.message || 'Failed to fetch billing types',
    });
  }
};

// Billing Type Details
export const getBillingTypeDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BILLING_TYPE_DETAILS_REQUEST });
    const { data } = await fetchBillingTypeById(id);
    dispatch({ type: BILLING_TYPE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BILLING_TYPE_DETAILS_FAIL,
      payload: error.errors || error.message || 'Failed to fetch billing type',
    });
  }
};

// Create Billing Type
export const createBillingTypeAction = (billingType) => async (dispatch) => {
  try {
    dispatch({ type: BILLING_TYPE_CREATE_REQUEST });
    const { data } = await createBillingType(billingType);
    dispatch({ type: BILLING_TYPE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BILLING_TYPE_CREATE_FAIL,
      payload: error.errors || error.message || 'Failed to create billing type',
    });
  }
};

// Update Billing Type
export const updateBillingTypeAction = (id, billingType) => async (dispatch) => {
  try {
    dispatch({ type: BILLING_TYPE_UPDATE_REQUEST });
    const { data } = await updateBillingType(id, billingType);
    dispatch({ type: BILLING_TYPE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BILLING_TYPE_UPDATE_FAIL,
      payload: error.errors || error.message || 'Failed to update billing type',
    });
  }
};

// Delete Billing Type
export const deleteBillingTypeAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: BILLING_TYPE_DELETE_REQUEST });
    await deleteBillingType(id);
    dispatch({ type: BILLING_TYPE_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: BILLING_TYPE_DELETE_FAIL,
      payload: error.errors || error.message || 'Failed to delete billing type',
    });
  }
};
