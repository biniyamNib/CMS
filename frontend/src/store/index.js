import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../slices/dashboardSlice'
import userReducer from '../slices/userSlice';
import roleReducer from '../slices/roleSlice'
import authReducer from '../slices/authSlice';
import companyReducer from '../slices/companySlice'
import orgStructureReducer from '../slices/orgStructureSlice'
import shareholderReducer from '../slices/shareholderSlice'
import licenseReducer from '../slices/licenseSlice';
import designationReducer from '../slices/designationSlice';
import notificationReducer from '../slices/notificationSlice';
import reportReducer from '../slices/reportSlice';


export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    users: userReducer,
    roles: roleReducer,
    auth: authReducer,
    companies: companyReducer,
    orgStructures: orgStructureReducer,
    shareholders: shareholderReducer,
    licenses: licenseReducer,
    designations: designationReducer,
    notifications: notificationReducer,
    reports: reportReducer,
  },
});
