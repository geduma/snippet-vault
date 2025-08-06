import { createRouter, createWebHistory } from 'vue-router'
import AuthComponent from './components/Auth.component.vue'
import HomeComponent from './components/Home.component.vue'
import type { Router } from 'vue-router'

export default (): Router => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'index',
        redirect: '/home'
      },
      {
        path: '/auth',
        name: 'Auth',
        component: AuthComponent
      },
      {
        path: '/home',
        name: 'Home',
        component: HomeComponent
      }
    ]
  })
}
