import Vue from 'vue'
import App from './client/App.vue'
import store from './server/vuex/store'

new Vue({
    store,
    el: '#app',
    render: h => h(App)
})
