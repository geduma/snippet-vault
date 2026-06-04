import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import HomeComponent from './components/Home.component.vue'
import AuthComponent from './components/Auth.component.vue'

const SnippetComponent = defineAsyncComponent(() => import('./components/Snippet.component.vue'))
const NewSnippetComponent = defineAsyncComponent(() => import('./components/NewSnippet.component.vue'))

export default createRouter({
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
