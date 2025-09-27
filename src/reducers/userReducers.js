import {
  USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE,
  USER_CREATE_REQUEST, USER_CREATE_SUCCESS, USER_CREATE_FAILURE, USER_CREATE_RESET,
  USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAILURE, USER_UPDATE_RESET,
  USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAILURE,
} from '../constants/userConstants';

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true, users: [] };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAILURE:
      return { loading: false, error: action.payload };

    // After a user is created, add them to the list in the state
    case USER_CREATE_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    // After a user is updated, find and update them in the list
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === action.payload.userId ? action.payload : user
        ),
      };

    // After a user is deleted, remove them from the list
    case USER_DELETE_SUCCESS:
      return {
        ...state,
        users: state.users?.filter((user) => user.userId !== action.payload),
      };

    default:
      return state;
  }
};

export const userCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CREATE_REQUEST:
      return { loading: true };
    case USER_CREATE_SUCCESS:
      return { loading: false, success: true, user: action.payload };
    case USER_CREATE_FAILURE:
      // The payload can be a string for general errors or an object for validation errors.
      return { loading: false, error: action.payload };
    case USER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true, user: action.payload };
    case USER_UPDATE_FAILURE:
      // The payload can be a string for general errors or an object for validation errors.
      return { loading: false, error: action.payload };
    case USER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
