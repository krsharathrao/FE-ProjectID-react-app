import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Import reducers here
import authReducer from '../reducers/authReducer';
import { roleListReducer, roleCreateReducer, roleUpdateReducer, roleDeleteReducer } from '../reducers/roleReducers';
import { userListReducer, userCreateReducer, userUpdateReducer, userDeleteReducer } from '../reducers/userReducers';
import {
  billingTypeListReducer,
  billingTypeDetailsReducer,
  billingTypeCreateReducer,
  billingTypeUpdateReducer,
  billingTypeDeleteReducer
} from '../reducers/billingTypeReducers';
import {
  businessUnitListReducer,
  businessUnitDetailsReducer,
  businessUnitCreateReducer,
  businessUnitUpdateReducer,
  businessUnitDeleteReducer
} from '../reducers/businessUnitReducers';
import {
  segmentListReducer,
  segmentDetailsReducer,
  segmentCreateReducer,
  segmentUpdateReducer,
  segmentDeleteReducer
} from '../reducers/segmentReducers';
import {
  customerListReducer,
  customerDetailsReducer,
  customerCreateReducer,
  customerUpdateReducer,
  customerDeleteReducer
} from '../reducers/customerReducers';
import { projectCreateReducer, projectDeleteReducer, projectDetailsReducer, projectListReducer, projectUpdateReducer } from '../reducers/ProjectCore';

const rootReducer = combineReducers({
  auth: authReducer,
  roleList: roleListReducer,
  roleCreate: roleCreateReducer,
  roleUpdate: roleUpdateReducer,
  roleDelete: roleDeleteReducer,
  userList: userListReducer,
  userCreate: userCreateReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,
  billingTypeList: billingTypeListReducer,
  billingTypeDetails: billingTypeDetailsReducer,
  billingTypeCreate: billingTypeCreateReducer,
  billingTypeUpdate: billingTypeUpdateReducer,
  billingTypeDelete: billingTypeDeleteReducer,
  businessUnitList: businessUnitListReducer,
  businessUnitDetails: businessUnitDetailsReducer,
  businessUnitCreate: businessUnitCreateReducer,
  businessUnitUpdate: businessUnitUpdateReducer,
  businessUnitDelete: businessUnitDeleteReducer,
  segmentList: segmentListReducer,
  segmentDetails: segmentDetailsReducer,
  segmentCreate: segmentCreateReducer,
  segmentUpdate: segmentUpdateReducer,
  segmentDelete: segmentDeleteReducer,
  customerList: customerListReducer,
  customerDetails: customerDetailsReducer,
  customerCreate: customerCreateReducer,
  customerUpdate: customerUpdateReducer,
  customerDelete: customerDeleteReducer,
projectList: projectListReducer,
projectDetails: projectDetailsReducer,
projectCreate: projectCreateReducer,
projectUpdate: projectUpdateReducer,
projectDelete: projectDeleteReducer,
});

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
