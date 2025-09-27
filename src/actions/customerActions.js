import {
  CUSTOMER_LIST_REQUEST,
  CUSTOMER_LIST_SUCCESS,
  CUSTOMER_LIST_FAIL,
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAIL,
  CUSTOMER_CREATE_REQUEST,
  CUSTOMER_CREATE_SUCCESS,
  CUSTOMER_CREATE_FAIL,
  CUSTOMER_CREATE_RESET,
  CUSTOMER_UPDATE_REQUEST,
  CUSTOMER_UPDATE_SUCCESS,
  CUSTOMER_UPDATE_FAIL,
  CUSTOMER_UPDATE_RESET,
  CUSTOMER_DELETE_REQUEST,
  CUSTOMER_DELETE_SUCCESS,
  CUSTOMER_DELETE_FAIL,
} from '../constants/customerConstants';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api/customerApi';

export const listCustomers = () => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_LIST_REQUEST });
    const { data } = await getCustomers();
    dispatch({ type: CUSTOMER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CUSTOMER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const customerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_DETAILS_REQUEST });
    const { data } = await getCustomerById(id);
    dispatch({ type: CUSTOMER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CUSTOMER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createCustomerAction = (customer) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_CREATE_REQUEST });
    const { data } = await createCustomer(customer);
    dispatch({ type: CUSTOMER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CUSTOMER_CREATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateCustomerAction = (id, customer) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_UPDATE_REQUEST });
    const { data } = await updateCustomer(id, customer);
    dispatch({ type: CUSTOMER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CUSTOMER_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const deleteCustomerAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_DELETE_REQUEST });
    await deleteCustomer(id);
    dispatch({ type: CUSTOMER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: CUSTOMER_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
