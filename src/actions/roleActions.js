import api from '../api/api';
import {
  ROLE_LIST_REQUEST, ROLE_LIST_SUCCESS, ROLE_LIST_FAILURE,
  ROLE_CREATE_REQUEST, ROLE_CREATE_SUCCESS, ROLE_CREATE_FAILURE,
  ROLE_UPDATE_REQUEST, ROLE_UPDATE_SUCCESS, ROLE_UPDATE_FAILURE,
  ROLE_DELETE_REQUEST, ROLE_DELETE_SUCCESS, ROLE_DELETE_FAILURE,
} from '../constants/roleConstants';

export const listRoles = () => async (dispatch) => {
  dispatch({ type: ROLE_LIST_REQUEST });
  try {
    const { data } = await api.get('/Roles');
    dispatch({ type: ROLE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ROLE_LIST_FAILURE, payload: error });
  }
};

export const createRole = (role) => async (dispatch) => {
  dispatch({ type: ROLE_CREATE_REQUEST });
  try {
    const { data } = await api.post('/Roles', role);
    dispatch({ type: ROLE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const errorPayload = error && error.errors ? error.errors : (error.title || 'An unexpected error occurred');
    dispatch({ type: ROLE_CREATE_FAILURE, payload: errorPayload });
  }
};

export const updateRole = (id, role) => async (dispatch) => {
  dispatch({ type: ROLE_UPDATE_REQUEST });
  try {
    const { data } = await api.put(`/Roles/${id}`, role);
    dispatch({ type: ROLE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const errorPayload = error && error.errors ? error.errors : (error.title || 'An unexpected error occurred');
    dispatch({ type: ROLE_UPDATE_FAILURE, payload: errorPayload });
  }
};

export const deleteRole = (id) => async (dispatch) => {
  dispatch({ type: ROLE_DELETE_REQUEST });
  try {
    await api.delete(`/Roles/${id}`);
    dispatch({ type: ROLE_DELETE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: ROLE_DELETE_FAILURE, payload: error });
  }
};
