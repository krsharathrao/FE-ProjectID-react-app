import {
  ROLE_LIST_REQUEST, ROLE_LIST_SUCCESS, ROLE_LIST_FAILURE,
  ROLE_CREATE_REQUEST, ROLE_CREATE_SUCCESS, ROLE_CREATE_FAILURE, ROLE_CREATE_RESET,
  ROLE_UPDATE_REQUEST, ROLE_UPDATE_SUCCESS, ROLE_UPDATE_FAILURE, ROLE_UPDATE_RESET,
  ROLE_DELETE_REQUEST, ROLE_DELETE_SUCCESS, ROLE_DELETE_FAILURE,
} from '../constants/roleConstants';

export const roleListReducer = (state = { roles: [] }, action) => {
  switch (action.type) {
    case ROLE_LIST_REQUEST:
      return { loading: true, roles: [] };
    case ROLE_LIST_SUCCESS:
      return { loading: false, roles: action.payload };
    case ROLE_LIST_FAILURE:
      return { loading: false, error: action.payload };

    // After a role is created, add it to the list in the state
    case ROLE_CREATE_SUCCESS:
      return {
        ...state,
        roles: [...state.roles, action.payload],
      };

    // After a role is updated, find and update it in the list
    case ROLE_UPDATE_SUCCESS:
      return {
        ...state,
        roles: state.roles.map((role) =>
          role.roleId === action.payload.roleId ? action.payload : role
        ),
      };

    // After a role is deleted, remove it from the list
    case ROLE_DELETE_SUCCESS:
      return {
        ...state,
        roles: state.roles?.filter((role) => role.roleId !== action.payload),
      };

    default:
      return state;
  }
};

export const roleCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ROLE_CREATE_REQUEST:
      return { loading: true };
    case ROLE_CREATE_SUCCESS:
      return { loading: false, success: true, role: action.payload };
    case ROLE_CREATE_FAILURE:
      return { loading: false, error: action.payload };
    case ROLE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const roleUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ROLE_UPDATE_REQUEST:
      return { loading: true };
    case ROLE_UPDATE_SUCCESS:
      return { loading: false, success: true, role: action.payload };
    case ROLE_UPDATE_FAILURE:
      return { loading: false, error: action.payload };
    case ROLE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const roleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ROLE_DELETE_REQUEST:
      return { loading: true };
    case ROLE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ROLE_DELETE_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
