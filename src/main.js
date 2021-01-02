import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import { httpAxios } from './utils/axios'
import store from './store';
// import './assets/icon/iconfont.css'//在线使用svg图片时
axios.defaults.withCredentials = true
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
import './components/common/directives';
import Utils from './utils/utils';
import './icons';//使用本地svg文件时 引入svg配置文件
Vue.prototype.gUtils = Utils;
// import './assets/element/index.css';
// import './assets/theme/style.css';
//粒子特效
// import VueParticles from 'vue-particles'
// Vue.use(VueParticles)
// Hmy===热区工具

//vue-simple-uploader封装大文件上传组件
import uploader from 'vue-simple-uploader'
Vue.use(uploader)

import requtoo from './views/EventPageEditing/EventPageEditing';
Vue.prototype.requtoo = requtoo;

import Cookies from 'js-cookie';
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small',
    zIndex: 3000
});
Vue.prototype.cdn04 = 'https://cdn04.kepler8.com/images/htj/'
Vue.prototype.cdn06 = 'http://cdn06.kepler8.com/'
Vue.prototype.$httpAxios = httpAxios;
Vue.prototype.Cookies = Cookies;

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    return next();
})
// 给axios所有的请求头加上Authorization参数
axios.defaults.headers.common['Authorization'] = localStorage.getItem('accessToken')

//实例化Vue
new Vue({
    router,
    store,//使用store
    data: function(){ //定义全局变量
        return {
            Authorization: '007',
        }
    },
    render: h => h(App)
}).$mount('#app')