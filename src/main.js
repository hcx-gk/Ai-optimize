import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import request from '../src/utils/request'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  request,
  router,
  render: h => h(App)
}).$mount('#app')

// 开机自启动
axios.post('/api/autoStart')
  .then(response => {
    console.log('Auto start successful:', response.data)
  })
  .catch(error => {
    console.error('Auto start failed:', error)
  })
