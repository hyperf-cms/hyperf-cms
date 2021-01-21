import Layout from '@/views/layout/Layout'

const settingRouter = {
  path: 'setting',
  component: Layout,
  name: 'Api:setting',
  meta: {
    title: '设置模块',
    icon: 'set_up'
  },
  children: [
    //用户管理路由
    {
      path: '/setting/user_module/user/list',
      name: 'Api:setting/user_module/user-index',
      component: () => import('@/views/setting/user_module/user/index'),
      meta: { title: '用户列表', icon: 'product-list' },
    },
    {
      path: '/setting/user_module/personal_update',
      name: 'Api:setting/user_module/user-personal-update',
      component: () => import('@/views/setting/user_module/user/personalUpdate'),
      meta: { title: '个人中心修改用户', icon: 'product-add' },
    },
    {
      path: '/setting/user_module/role/list',
      name: 'Api:setting/user_module/role-index',
      component: () => import('@/views/setting/user_module/role/index'),
      meta: { title: '角色管理', icon: 'role' },
    },
    {
      path: '/setting/user_module/permission/list',
      name: 'Api:setting/user_module/permission-index',
      component: () => import('@/views/setting/user_module/permission/index'),
      meta: { title: '功能权限', icon: 'permission' },
    },

    //系统管理路由
    {
      path: '/setting/system_module/systemConfig',
      name: 'Api:setting/system_module/system_config-systemConfig',
      component: () => import('@/views/setting/system/index/'),
      meta: { title: '系统配置', icon: 'product-list' },
    },
    {
      path: '/setting/system_module/operate_log/list',
      name: 'Api:setting/system_module/operate_log-index',
      component: () => import('@/views/setting/system/operateLog/'),
      meta: { title: '操作日志', icon: 'log' },
    },
    {
      path: '/setting/system/global_config',
      name: 'Api:setting/system/get_config-index',
      component: () => import('@/views/setting/system/global_config/index'),
      meta: { title: '全局配置', icon: 'setting_global' },
    },
    {
      path: '/setting/system/notice',
      name: 'Api:setting/system/notice-index',
      component: () => import('@/views/setting/system/notice/index'),
      meta: { title: '通知管理', icon: 'notice' },
    },
    {
      path: '/setting/system/notice/create',
      name: 'Api:setting/system/notice-store',
      component: () => import('@/views/setting/system/notice/create'),
      meta: { title: '添加通知', icon: 'notice' },
    },
    {
      path: '/setting/system/notice/update',
      name: 'Api:setting/system/notice-update',
      component: () => import('@/views/setting/system/notice/update'),
      meta: { title: '修改通知', icon: 'notice' },
    },
    {
      path: '/setting/system/advice',
      name: 'Api:setting/system/advice-index',
      component: () => import('@/views/setting/system/advice/index'),
      meta: { title: '建议管理', icon: 'notice' },
    },
    {
      path: '/setting/system/advice/create',
      name: 'Api:setting/system/advice-store',
      component: () => import('@/views/setting/system/advice/create'),
      meta: { title: '添加建议', icon: 'notice' },
    },
    {
      path: '/setting/system/advice/update',
      name: 'Api:setting/system/advice-update',
      component: () => import('@/views/setting/system/advice/update'),
      meta: { title: '修改建议', icon: 'notice' },
    },
    {
      path: '/setting/system/advice/reply',
      name: 'Api:setting/system/advice-reply',
      component: () => import('@/views/setting/system/advice/reply'),
      meta: { title: '回复建议', icon: 'notice' },
    },
    {
      path: '/setting/system/control',
      name: 'Api:setting/system/control-getControlList',
      component: () => import('@/views/setting/system/control/index'),
      meta: { title: '后台控制', icon: 'switch' },
    },

    //技术开发路由
    {
      path: '/setting/technique/logs',
      name: 'Api:setting/system/system_log-getSystemLog',
      component: () => import('@/views/setting/technique/logs'),
      meta: { title: '日志系统', icon: 'logs' },
    },
    {
      path: '/setting/technique/log',
      name: 'Api:setting/system/log-getLogList',
      component: () => import('@/views/setting/technique/log'),
      meta: { title: '日志中心', icon: 'logs' },
    },
    {
      path: '/setting/technique/sql_query',
      name: 'Api:setting/technique/get_sql_result-getSqlResult',
      component: () => import('@/views/setting/technique/sqlQuery'),
      meta: { title: 'SQL查询', icon: 'setting_sql' },
    },
    {
      path: '/setting/technique/sql_export',
      name: 'Api:setting/technique/export_sql-exportSqlData',
      component: () => import('@/views/setting/technique/sqlExport'),
      meta: { title: '导出SQL', icon: 'sql_export' },
    },
    {
      path: '/setting/technique/test',
      name: 'Api:setting/technique/test-test',
      component: () => import('@/views/setting/technique/test'),
      meta: { title: '测试路由', icon: 'test' },
    },
    {
      path: '/setting/technique/json_decode',
      name: 'Api:setting/technique/json_decode-jsonDecode',
      component: () => import('@/views/setting/technique/jsonDecode'),
      meta: { title: 'JSON解析', icon: 'jsonDecode' },
    },
    {
      path: '/setting/technique/config_file',
      name: 'Api:setting/technique/config_file-getList',
      component: () => import('@/views/setting/technique/configFile'),
      meta: { title: '配置文件', icon: 'configFile' },
    },
    {
      path: '/setting/technique/file_center',
      name: 'Api:setting/technique/file_center-getList',
      component: () => import('@/views/setting/technique/fileCenter'),
      meta: { title: '文件中心', icon: 'fileCenter' },
    },
    {
      path: '/setting/technique/queue',
      name: 'Api:setting/technique/queue-getList',
      component: () => import('@/views/setting/technique/queue'),
      meta: { title: '队列异常', icon: 'queue' },
    },
    {
      path: '/setting/technique/horizon',
      name: 'Api:setting/technique/horizon-horizon',
      component: () => import('@/views/setting/technique/horizon'),
      meta: { title: 'Horizon控制台', icon: 'horizon' },
    },
  ]
};

export default settingRouter
