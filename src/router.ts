import { createRouter, createWebHistory } from 'vue-router'
import AuthComponent from './components/Auth.component.vue'
import HomeComponent from './components/Home.component.vue'
import type { Router } from 'vue-router'
import SnippetComponent from './components/Snippet.component.vue'
import NewSnippetComponent from './components/NewSnippet.component.vue'

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
      },
      {
        path: '/:snippetId',
        name: 'Snippet',
        component: SnippetComponent
      },
      {
        path: '/new',
        name: 'NewSnippet',
        component: NewSnippetComponent
      }
    ]
  })
}
