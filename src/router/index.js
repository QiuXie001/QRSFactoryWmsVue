import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/Login')
    },
    {
        path: '/Index',
        name: '公共页面',
        component: () => import('../components/Index'),
        children: [
            {
                path: '/Home',
                name: '首页',
                meta: {
                    title: '首页'
                },
                component: () => import('../components/Home')
            },{
                path: '/PersonalInfo',
                name: '个人信息',
                meta: {
                    title: '个人信息'
                },
                component: () => import('../components/PersonalInfo')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export function resetRouter() {
    router.match = new VueRouter({
        mode: 'hash',
        routes: []
    }).match;
}
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        resetRouter();
        next();
    }
    else {

        next();
    }
});
export default router;