// import express from "express";
// import {
//   getDashboardStats,
//   getRecentActivities,
//   getCompanyRegistrations,
// } from "../controllers/dashboardController.js";
// import { protect, restrictTo } from "../middlewares/authMiddleware.js";

// const dashboardRouter = express.Router();

// dashboardRouter.use(protect);
// dashboardRouter.use(restrictTo("SuperAdmin", "Admin", "HR"));

// dashboardRouter.get("/dashboard/stats", getDashboardStats);
// dashboardRouter.get("/dashboard/activities", getRecentActivities);
// dashboardRouter.get(
//   "/dashboard/company-registrations",
//   getCompanyRegistrations
// );

// export default dashboardRouter;



import express from "express";
import {
  getDashboardStats,
  getRecentActivities,
  getCompanyRegistrations,
  getLicenseDistribution,
} from "../controllers/dashboardController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.use(protect);
dashboardRouter.use(restrictTo("SuperAdmin", "Admin", "HR", "Shareholder"));

dashboardRouter.get("/dashboard/stats", getDashboardStats);
dashboardRouter.get("/dashboard/activities", getRecentActivities);
dashboardRouter.get("/dashboard/company-registrations", getCompanyRegistrations);
dashboardRouter.get("/dashboard/license-distribution", getLicenseDistribution);

export default dashboardRouter;