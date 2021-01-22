import Layout from '@/views/layout/Layout'

const settingRouter = {
  path: 'setting',
  component: Layout,
  name: 'Api:setting',
  children: [
    //用户管理路由
    {
      path: '/setting/user_module/user/list',
      name: 'Api:setting/user_module/user/list-index',
      component: () => import('@/views/setting/user_module/user/index'),
    },
    {
      path: '/setting/user_module/personal_update',
      name: 'Api:setting/user_module/user-personal-update',
      component: () => import('@/views/setting/user_module/user/personalUpdate'),
    },
    {
      path: '/setting/user_module/role/list',
      name: 'Api:setting/user_module/role-index',
      component: () => import('@/views/setting/user_module/role/index'),
    },
    {
      path: '/setting/user_module/permission/list',
      name: 'Api:setting/user_module/permission-index',
      component: () => import('@/views/setting/user_module/permission/index'),
    },

    //系统管理路由
    {
      path: '/setting/system_module/systemConfig',
      name: 'Api:setting/system_module/system_config-systemConfig',
      component: () => import('@/views/setting/system/index/'),
    },
    {
      path: '/setting/system_module/operate_log/list',
      name: 'Api:setting/system_module/operate_log-index',
      component: () => import('@/views/setting/system/operateLog/'),
    },
    {
      path: '/setting/system/global_config',
      name: 'Api:setting/system/get_config-index',
      component: () => import('@/views/setting/system/global_config/index'),
    },
    {
      path: '/setting/system/notice',
      name: 'Api:setting/system/notice-index',
      component: () => import('@/views/setting/system/notice/index'),
    },
    {
      path: '/setting/system/notice/create',
      name: 'Api:setting/system/notice-store',
      component: () => import('@/views/setting/system/notice/create'),
    },
    {
      path: '/setting/system/notice/update',
      name: 'Api:setting/system/notice-update',
      component: () => import('@/views/setting/system/notice/update'),
    },
    {
      path: '/setting/system/advice',
      name: 'Api:setting/system/advice-index',
      component: () => import('@/views/setting/system/advice/index'),
    },
    {
      path: '/setting/system/advice/create',
      name: 'Api:setting/system/advice-store',
      component: () => import('@/views/setting/system/advice/create'),
    },
    {
      path: '/setting/system/advice/update',
      name: 'Api:setting/system/advice-update',
      component: () => import('@/views/setting/system/advice/update'),
    },
    {
      path: '/setting/system/advice/reply',
      name: 'Api:setting/system/advice-reply',
      component: () => import('@/views/setting/system/advice/reply'),
    },
    {
      path: '/setting/system/control',
      name: 'Api:setting/system/control-getControlList',
      component: () => import('@/views/setting/system/control/index'),
    },

    //技术开发路由
    {
      path: '/setting/technique/logs',
      name: 'Api:setting/system/system_log-getSystemLog',
      component: () => import('@/views/setting/technique/logs'),
    },
    {
      path: '/setting/technique/log',
      name: 'Api:setting/system/log-getLogList',
      component: () => import('@/views/setting/technique/log'),
    },
    {
      path: '/setting/technique/sql_query',
      name: 'Api:setting/technique/get_sql_result-getSqlResult',
      component: () => import('@/views/setting/technique/sqlQuery'),
    },
    {
      path: '/setting/technique/sql_export',
      name: 'Api:setting/technique/export_sql-exportSqlData',
      component: () => import('@/views/setting/technique/sqlExport'),
    },
    {
      path: '/setting/technique/test',
      name: 'Api:setting/technique/test-test',
      component: () => import('@/views/setting/technique/test'),
    },
    {
      path: '/setting/technique/json_decode',
      name: 'Api:setting/technique/json_decode-jsonDecode',
      component: () => import('@/views/setting/technique/jsonDecode'),
    },
    {
      path: '/setting/technique/config_file',
      name: 'Api:setting/technique/config_file-getList',
      component: () => import('@/views/setting/technique/configFile'),
    },
    {
      path: '/setting/technique/file_center',
      name: 'Api:setting/technique/file_center-getList',
      component: () => import('@/views/setting/technique/fileCenter'),
    },
    {
      path: '/setting/technique/queue',
      name: 'Api:setting/technique/queue-getList',
      component: () => import('@/views/setting/technique/queue'),
    },
    {
      path: '/setting/technique/horizon',
      name: 'Api:setting/technique/horizon-horizon',
      component: () => import('@/views/setting/technique/horizon'),
    },
  ]
};

export default settingRouter
