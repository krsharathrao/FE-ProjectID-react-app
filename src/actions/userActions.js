import api from '../api/api';
import {
  USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE,
  USER_CREATE_REQUEST, USER_CREATE_SUCCESS, USER_CREATE_FAILURE,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE,
  USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAILURE,
} from '../constants/userConstants';

export const listUsers = () => async (dispatch) => {
  dispatch({ type: USER_LIST_REQUEST });
  try {
    const { data } = await api.get('/Users');
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    // The error is now a simple message string, thanks to the api.js interceptor.
    dispatch({ type: USER_LIST_FAILURE, payload: error });
  }
};

export const createUser = (user) => async (dispatch) => {
  dispatch({ type: USER_CREATE_REQUEST });
  try {
    const { data } = await api.post('/Users', user);
    dispatch({ type: USER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const errorPayload = error && error.errors ? error.errors : (error.title || 'An unexpected error occurred');
    dispatch({ type: USER_CREATE_FAILURE, payload: errorPayload });
  }
};

export const updateUser = (id, user) => async (dispatch) => {
  dispatch({ type: USER_UPDATE_REQUEST });
  try {
    const { data } = await api.put(`/Users/${id}`, user);
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const errorPayload = error && error.errors ? error.errors : (error.title || 'An unexpected error occurred');
    dispatch({ type: USER_UPDATE_FAILURE, payload: errorPayload });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: USER_DELETE_REQUEST });
  try {
    await api.delete(`/Users/${id}`);
    dispatch({ type: USER_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: USER_DELETE_FAILURE, payload: error });
  }
};
