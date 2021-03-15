'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.6.84:81/"',
  WS_API: '"ws://192.168.6.84:9502"',
  SITENAME: 'Vue-admin-template',
})
