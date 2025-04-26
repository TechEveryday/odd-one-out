import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AboutView,
    },
    {
      path: '/player-count',
      name: 'player-count',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HowManyPlayers.vue'),
    },
    {
      path: '/player-names',
      name: 'player-names',
      component: () => import('../views/PlayerNames.vue'),
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../views/DrawCards.vue'),
    },
  ],
})

export default router
