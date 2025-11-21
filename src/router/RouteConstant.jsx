import Profile from "../pages/Profile";
import CoSheet from "../pages/CoSheet";
import Dashboard from "../pages/Dashboard";




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

]