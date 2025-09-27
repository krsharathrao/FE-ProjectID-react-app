import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../constants/authConstants';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  loading: false,
  userInfo: userInfoFromStorage,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      localStorage.removeItem('userInfo');
      return { ...state, loading: false, userInfo: null, error: null };
    default:
      return state;
  }
};

export default authReducer;
