import { createApp } from 'vue'
import router from './router.ts'
import App from './App.vue'
import { store } from './lib/store.ts'
import './style.css'

createApp(App)
  .use(store)
  .use(router())
  .mount('#app')
