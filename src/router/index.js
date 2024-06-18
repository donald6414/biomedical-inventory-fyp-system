import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/auth/Login.vue'
import AdminDashboard from '../views/dashboard/AdminDashboard.vue'
import Dashboard from "../components/Dashboard.vue";
import ForgotPassword from "../views/auth/ForgotPassword.vue";
import ResetPassword from "../views/auth/ResetPassword.vue";
import Profile from "../components/Auth/Profile.vue";

// Technician
import Departments from "../components/Technician/Departments.vue"
import Equipments from "../components/Technician/Equipments.vue"
import ScheduledMaintenance from "../components/Technician/ScheduledMaintenance.vue"
import FaultReport from "../components/Technician/FaultReport.vue"

import { userStore } from "../stores/user.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/',
      redirect:'/dashboard',
      name:"AdminLayout",
      component: AdminDashboard,
      meta:{requiresAuth:true},
      children:[
        {path:'/profile',name:'Profile',component:Profile},
        {path:'/dashboard',name:'Dashboard',component:Dashboard},
        {path:'/departments',name:'Departments',component:Departments},
        {path:'/equipments',name:'Equipments',component:Equipments},
        {path:'/scheduled-maintenance',name:'ScheduledMaintenance',component:ScheduledMaintenance},
        {path:'/faults-reports',name:'FaultReport',component:FaultReport},
      ]
    },
  ]
})

router.beforeEach((to,from,next)=>{
  const protectedRoutes = ['Dashboard','Departments','Profile','Equipments','ScheduledMaintenance','FaultReport'];

  userStore().loadFromSessionStorage();

  const user = userStore().user;

  if(!user.token && protectedRoutes.includes(to.name)){
    next({name:'Login'})
  }else if(user.token && (to.name == 'Login' || to.name == 'Register')){
    next({name:'Dashboard'});
  }else{
    next();
  }
})

export default router
