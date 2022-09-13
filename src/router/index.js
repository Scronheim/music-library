import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Collection page',
    component: () => import('@/pages/CollectionPage'),
  },
  {
    path: '/collection/:artist',
    name: 'Artist page',
    component: () => import('@/pages/ArtistPage'),
  },
  {
    path: '/collection/:artist/:album',
    name: 'Album page',
    component: () => import('@/pages/AlbumPage'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
