import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue的构造函数
// 此处不用class是为了方便后面为Vue实例混入实例成员
function Vue (options) {
  // 通过this判断，是否通过 new 使用 Vue 构造函数
  // 如果当作普通函数调用 -> Vue() 就发出警告
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化配置
  this._init(options)
}
// 注册 vm 的 _init() 方法：初始化 vm
initMixin(Vue)
// 继续混入（注册） vm 的成员：$data/$props/$set/$delete/$watch
stateMixin(Vue)
// 初始化事件相关方法
// $on/$once/$off/$emit
eventsMixin(Vue)
// 初始化生命周期相关的混入方法
// _update/$forceUpdate/$destroy
lifecycleMixin(Vue)
// 混入 render
// $nextTick/_render
renderMixin(Vue)

export default Vue
