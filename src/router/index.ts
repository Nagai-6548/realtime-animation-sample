import Vue from 'vue'
import VueRouter from 'vue-router'
import GoogleMap from '../components/GoogleMap.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/:id',
      component: GoogleMap
    }
  ]
})
