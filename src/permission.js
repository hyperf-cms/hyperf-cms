import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { Notification } from 'element-ui';
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          if (res.code == 200) {
            Notification({
              title: '欢迎进入Hyperf-cms',
              message: '若页面出现抖动的情况，请调整浏览器宽度屏幕即可, 如使用过程中出现错误或者有优化的建议可以点击头像进入系统建议进行反馈',
              type: 'success',
              offset: 100,
              duration: 5000
            });
          }
          const data = res.data
          data.path = to.path
          //生成路由操作
          store.dispatch('GenerateRoutes', { data }).then(() => { 
            //动态添加可访问路由表
            console.log(store.getters.routers)
            router.addRoutes(store.getters.routers)
            //hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true }) 
          })
          //
          next()
        }).catch((err) => {
          //提交退出登录的Vuex
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }  
  }
})

router.afterEach((to) => {
  NProgress.done() // 结束Progress  
})
