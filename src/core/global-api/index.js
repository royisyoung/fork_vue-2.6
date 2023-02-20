/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    // 非生产环境增加一个 set 方法，禁止给 config 属性直接赋值
    // 之后在`src\platforms\web\runtime\index.js`中向Vue.config 挂在了一些方法
    configDef.set = () => {
      warn(
        // 警告：不要对Vue.config重新赋值，可以挂载或修改对象中的属性。
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 初始化Vue.config对象
  Object.defineProperty(Vue, 'config', configDef)

  // 暴露工具方法
  // 这些方法不作为公共api的一部分 - 避免使用除非你已经意识到某些风险。
  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 定义常用的静态方法
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick


  // 显式可观察API
  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化 Vue.options 对象，挂载3个成员，并初始化为空对象
  // components/directives/filters
  // 3个成员用于存储全局的组件、指令、过滤器

  // Object.create(null) 没有原型，可以提高性能
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })
  // 用于声明“base”构造器来扩展全部普通对象
  // weex多实例的场景中的组件
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 注册内置组件 keep-alive
  extend(Vue.options.components, builtInComponents)

  // 注册 Vue.use() 用来注册插件
  initUse(Vue)
  // 注册 Vue.mixin() 实现混入
  initMixin(Vue)
  // 注册 Vue.extend() 基于传入的options返回一个组件的构造函数
  initExtend(Vue)
  // 注册 Vue.directive()、Vue.component()、Vue.filter()
  initAssetRegisters(Vue)
}
