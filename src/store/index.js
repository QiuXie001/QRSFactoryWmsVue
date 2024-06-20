import vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router,{resetRouter} from "../router"
import menu from './modules/menu'
import user from './modules/user'
import token from './modules/token'
import things from './modules/things'
import dto from './modules/dto'
vue.use(Vuex)

function addNewRoute(menuList) {
    console.log(menuList)
    let routes = router.options.routes
    console.log(routes)
    menuList.forEach(menu => {
        // 创建顶层路由
        let topRoute = {
            path:menu.Url,
            name:menu.Name,
            children: [],
            component:()=>import('../components/Index')
        };

        // 如果有子菜单，递归处理
        if (menu.Children && menu.Children.length > 0) {
            menu.Children.forEach(child => {
                topRoute.children.push({
                    path: child.Url,
                    name: child.Name,
                    component:()=>import(`../components/views${child.Url}.vue`) // 根据Url解析组件
                });
            });
        }

        // 将顶层路由添加到路由配置中
        routes.push(topRoute);
    })

    resetRouter()
    router.addRoutes(routes)
}

// function resolveComponent(url) {
//     return () => import(`../components/views${url}.vue`);
// }

export default new Vuex.Store({
    state: {
        menu: [],
        things: [],
        token,
        user,
        dto
    },
    mutations: {
        reset() {
            this.state.menu = []
            this.state.things = []
            this.state.user = {}
            this.state.token = ''
            this.state.dto = {}
        },
        setMenu(state, menuList) {
            state.menu = menuList

            addNewRoute(menuList)
        },
        setThings(state, things) {
            state.things = things
        },
        setToken(state, token) {
            state.token = token
        },
        setUser(state, user) {
            state.user = user
        },
        setDto(state, dto)
        {
            state.dto = dto
        }
    },
    getters: {
        getMenu(state) {
            return state.menu
        },
        getThings(state) {
            return state.things
        },
        getUser(state){
            return state.user
        },
        getToken(state){
            return state.token
        },
        getDto(state){
            return state.dto
        }
    },
    modules: {
        // 模块化数据
        menu,
        user,
        token,
        things,
        dto
    },
    plugins: [
        // veux持久化配置
        createPersistedState({
            key: 'rabbitstore-client',
            paths: ['user', 'menu','token','things','dto']
        })
    ]
})