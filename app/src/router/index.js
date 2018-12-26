import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: 'Editor',
        component: require("@/views/Editor").default
    },
    {
        path: "/settings",
        name: 'Settings',
        component: require("@/components/routes/Settings").default
    }
  ]
})
