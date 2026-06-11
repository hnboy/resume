import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import CreateResume from '../pages/CreateResume.vue'
import EditResume from '../pages/EditResume.vue'
import PreviewResume from '../pages/PreviewResume.vue'
import JobMatch from '../pages/JobMatch.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/create', name: 'CreateResume', component: CreateResume },
  { path: '/edit/:id', name: 'EditResume', component: EditResume },
  { path: '/preview/:id', name: 'PreviewResume', component: PreviewResume },
  { path: '/job-match', name: 'JobMatch', component: JobMatch }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router