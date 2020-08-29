import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/downloaded-books',
      name: 'downloaded-books',
      component: require('@/components/DownloadedBooks').default
    },
    {
      path: '/book-detail',
      name: 'book-detail',
      component: require('@/components/BookDetail').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
