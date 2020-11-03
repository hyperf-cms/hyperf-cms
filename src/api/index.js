import { assign, map } from 'lodash'
import faker from 'faker/locale/zh_CN'
import { service, request } from './service'
import * as tools from './tools'

const files = require.context('./modules', true, /\.api\.js$/)
const generators = files.keys().map(key => files(key).default)

export default assign({}, ...map(generators, generator => generator({
  service,
  request,
  faker,
  tools
})))
