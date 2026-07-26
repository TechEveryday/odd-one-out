import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  /* Hash history, not web history. Capacitor serves the bundle from a local origin with
   * no server-side rewrite, so a path like /draw has nothing to fall back to index.html
   * on reload or on a restored deep link. The hash never leaves the document, so it
   * resolves identically in the web view and in a browser. */
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
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
