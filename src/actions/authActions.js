import api from '../api/api';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../constants/authConstants';

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await api.post('/Auth/login', { username, password });
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    // The error is now a simple message string, thanks to the api.js interceptor.
        dispatch({ 
        type: LOGIN_FAILURE, 
        payload: error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message 
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
