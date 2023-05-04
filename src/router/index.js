import { createRouter, createWebHistory } from 'vue-router'
import ViewAllPokemons from '../views/ViewAllPokemons.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      children: [
        {
            path: '',
            component: ViewAllPokemons,
        },
        {
            path: ':id',
            component: () => import('../views/ViewOnePokemon.vue'),
            props: true
        }
        ]
    },
  ]
})

export default router
