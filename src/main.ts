import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import {authNavigationGuard} from "/@/lib/useAuth";
import {routes} from "/@/routes";
import {createRouter, createWebHistory} from "vue-router";
import Modal from "/@/components/common/Modal.vue";

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: (import.meta as any).hot ? [] : routes,
})
router.beforeResolve(authNavigationGuard)

if ((import.meta as any).hot) {
  let removeRoutes: any[] = []

  for (const route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  (import.meta as any).hot.accept('./routes.ts', ({ routes }: any) => {
    for (const removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (const route of routes) {
      removeRoutes.push(router.addRoute(route))
    }
    router.replace('')
  })
}

app.use(router)
app.component('Modal', Modal)
app.mount('#app')
