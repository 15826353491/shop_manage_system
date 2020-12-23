import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../components/Login.vue'
import index from '../components/Index.vue'
import welcome from '../components/Welcome.vue'
import userlist from '../components/user/UserList.vue'
import rolelist from '../components/role/RoleList.vue'
import powerlist from '../components/role/PowerList.vue'
import goodslist from '../components/goods/GoodsList.vue'
import addgoods from '../components/goods/AddGoods.vue'
import goodscateory from '../components/goods/GoodsCateory.vue'
import goodsdata from '../components/goods/GoodsData.vue'
import orderlist from '../components/order/OrderList.vue'
import datasum from '../components/data/DataSum.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: login },
  { path: '/index', name: 'index', component: index,
   children:[
    { path: '/index/',redirect:'/index/welcome' },
    { path: '/index/welcome', name: 'welcome', component: welcome },
    { path: '/index/userlist', name: 'userlist', component: userlist },
    { path: '/index/rolelist', name: 'rolelist', component: rolelist },
    { path: '/index/powerlist', name: 'powerlist', component: powerlist },
    { path: '/index/goodslist', name: 'goodslist', component: goodslist },
    { path: '/index/addgoods', name: 'addgoods', component: addgoods },
    { path: '/index/goodsdata', name: 'goodsdata', component: goodsdata },
    { path: '/index/goodscateory', name: 'goodscateory', component: goodscateory },
    { path: '/index/orderlist', name: 'orderlist', component: orderlist },
    { path: '/index/datasum', name: 'datasum', component: datasum }
   ]
  }
]

const router = new VueRouter({
  routes
  // mode: 'history'
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
 // 如果用户访问的登录页，直接放⾏
 if (to.path === '/login') return next()
 // 从 sessionStorage 中获取到 保存的 token 值
 const tokenStr = sessionStorage.getItem('token')
 // 没有token，强制跳转到登录页
 if (!tokenStr) return next('/login')
 next()
 })

export default router
