import Profile from "../pages/Profile";
import CoSheet from "../pages/CoSheet";
import Dashboard from "../pages/Dashboard";
import UserList from "@/pages/users/UserList";
import AddUser from "@/pages/users/AddUser";




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
     element: UserList,
     path: `userlist`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },
   {
     element: AddUser,
     path: `adduser`,
     //permission: RoutePermission?.PLATFORM_ADMIN,
     exact: true
   },

   

]