import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css';
import axios from "axios";
import VueRouter from 'vue-router';
import router, { resetRouter } from "./router";
import store from './store';
import '../public/icon/iconfont.css';

Vue.prototype.$axios = axios;
Vue.prototype.$httpUrl = 'https://localhost:44329';
Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI, { size: 'small' });

new Vue({
  router,
  store,
  created() {
    // 当Vue实例创建后，从Vuex状态恢复路由配置
    this.restoreRoutes();
  },
  methods: {
    restoreRoutes() {
      // 从Vuex状态获取菜单数据
      const menuList = this.$store.state.menu;
      // 重置路由
      resetRouter();
      // 根据菜单数据动态添加路由
      this.addNewRoutes(menuList);
    },
    resetRouter() {
      router.options.routes = []; // 清空路由配置
    },
    addNewRoutes(menuList) {
      menuList.forEach(menu => {
        // 创建顶层路由
        let topRoute = {
            path:menu.Url,
            name:menu.Name,
            children: [],
            component:()=>import('./components/Index')
        };

        // 如果有子菜单，递归处理
        if (menu.Children && menu.Children.length > 0) {
            menu.Children.forEach(child => {
                topRoute.children.push({
                    path: child.Url,
                    name: child.Name,
                    component:()=>import(`./components/views${child.Url}.vue`) // 根据Url解析组件
                });
            });
        }
        // 将顶层路由添加到路由配置中
        router.options.routes.push(topRoute);
      });

      // 添加路由到Vue Router实例
      router.addRoutes(router.options.routes);
    }
  },
  render: h => h(App),
}).$mount('#app');
