import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'
import VueHotKey from 'v-hotkey'

Vue.use(VueHotKey)

new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App)
})
