import {
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_DETAILS_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_RESET,
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
  PROJECT_UPDATE_FAIL,
  PROJECT_UPDATE_RESET,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_SUCCESS,
  PROJECT_DELETE_FAIL,
} from '../constants/ProjectConstants';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../api/projectsApi';

export const listProjects = () => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_LIST_REQUEST });
    const { data } = await getProjects();
    dispatch({ type: PROJECT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const projectDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_DETAILS_REQUEST });
    const { data } = await getProjectById(id);
    dispatch({ type: PROJECT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createProjectAction = (project) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_CREATE_REQUEST });
    const { data } = await createProject(project);
    dispatch({ type: PROJECT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_CREATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateProjectAction = (id, project) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_UPDATE_REQUEST });
    const { data } = await updateProject(id, project);
    dispatch({ type: PROJECT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_UPDATE_FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const deleteProjectAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_DELETE_REQUEST });
    await deleteProject(id);
    dispatch({ type: PROJECT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PROJECT_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
