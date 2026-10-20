import { Route, Routes } from "react-router-dom";
import CompanyRegistration from "./components/others/CompanyRegistration";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CompaniesManagement from "./pages/CompaniesManagement";
import Users from "./pages/Users";
import Licenses from "./pages/Licenses";
import Designations from "./pages/Designations";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Roles from "./pages/Roles";
import UsersPage from "./components/others/UserLists";
import AddUser from "./forms/AddUser";
import RolesPage from "./components/others/MockRoles";
import AddRole from "./forms/AddRole";
import AddCompany from "./forms/AddCompany";
import Account from "./pages/Account";
import MockSidebar from "./components/common/MockSidebar";
import MockNavbar from "./components/common/MockNavbar";
import Companies from "./pages/Companies";
import AddDesignation from "./forms/AddDesignation";
import Login from "./components/layout/Login";
import EditUser from "./edit/EditUser";
import EditRole from "./edit/EditRole";
import Register from "./components/layout/Register";
import OrgStructureChart from "./pages/OrgStructureChart";
import OrgStructureSelector from "./pages/OrgStructureSelector";
import OrgStructureHistory from "./forms/OrgStructureHistory";
import UserAssignmentModal from "./forms/UserAssignmentModal";
import ShareholdersList from "./pages/ShareholdersListHolder";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/homepage" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companies-management" element={<CompaniesManagement />} />
        <Route path="/shareholders" element={<ShareholdersList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/edit-role/:id" element={<EditRole />} />
        <Route path="/org-structure/:companyId" element={<OrgStructureChart />}/>
        <Route path="/org-structure" element={<OrgStructureSelector />} />
        <Route path="/org-structure/history/:id" element={<OrgStructureHistory />} />
        <Route path="/org-structure/assign-users/:id" element={<UserAssignmentModal />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/designations" element={<Designations />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-roles" element={<AddRole />} />
        <Route path="/add-company" element={<AddCompany />} />
        <Route path="/account" element={<Account />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-designation" element={<AddDesignation />} />
        <Route path="/user-lists" element={<UsersPage />} />
        <Route path="/company/register" element={<CompanyRegistration />} />
        <Route path="/mock-roles" element={<RolesPage />} />
        <Route path="mock-sidebar" element={<MockSidebar />} />
        <Route path="/mock-navbar" element={<MockNavbar />} />
      </Routes>
    </div>
  );
};

export default App;
