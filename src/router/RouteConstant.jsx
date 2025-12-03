import Profile from "../pages/Profile";
import CoSheet from "../pages/CoSheet";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/users/UserList";
import AddUser from "../pages/users/AddUser";
import Orgination from "../pages/orgination/Orgination";
import AddOgination from "../pages/orgination/AddOgination";
import EditOgination from "../pages/orgination/EditOgination";
import ViewOgination from "../pages/orgination/ViewOgination";
import OrganizationHierarchy from "../pages/orgination/OrganizationHierarchy";
import OrganizationHierarchyTest from "../pages/orgination/OrganizationHierarchyTest";
import AdminList from "../pages/admin/AdminList";
import DefenseMapping from "../pages/admin/DefenseMapping";
import EditAdmin from "../pages/admin/EditAdmin";
import AddAdmin from "../pages/admin/AddAdmin";
import BulkAddAdmin from "../pages/admin/BulkAddAdmin";




export const routeParams = "management";




export default [
   {
     element: Dashboard,
     path: `dashboard`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
    {
     element: CoSheet,
     path: `cosheet`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: Profile,
     path: `profile`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: Orgination,
     path: `orgination`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: AddOgination,
     path: `orgination/addorgination`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: EditOgination,
     path: `orgination/editorgination/:orgId`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: ViewOgination,
     path: `orgination/vieworgination/:orgId`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: OrganizationHierarchy,
     path: `organization-hierarchy/:orgId?`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: OrganizationHierarchyTest,
     path: `organization-hierarchy-test`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: AdminList,
     path: `admin-list`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: AddAdmin,
     path: `admin-list/add-admin`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: DefenseMapping,
     path: `defense-mapping/:orgId?`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: EditAdmin,
     path: `edit-admin/:adminId/:orgId?`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: BulkAddAdmin,
     path: `admin-list/bulk-add-admin/:orgId?`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
    {
     element: UserList,
     path: `user-list`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: AddUser,
     path: `user-list/add-user`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },

   

]