/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { defineComputed, proxy } from '../instance/state'
import { extend, mergeOptions, validateComponentName } from '../util/index'

export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   * 每一个实例构造器包括Vue根实例，都有一个独一无二的cid
   * 这使得我们能够为原型继承创建包装“子构造器”并缓存他们
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}

    // 获取当前实例
    // 然后尝试从缓存中获取并返回
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    // 生成name，并校验
    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    // 创建子构造器的构造函数
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // 子构造函数从当前实例的原型中继承属性
    Sub.prototype = Object.create(Super.prototype)
    // 指定构造器属性为构造函数本身
    Sub.prototype.constructor = Sub
    // 设置cid
    Sub.cid = cid++
    // 从当前实例中merge生成options
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    // 将当前实例存为父类
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 对于道具和计算属性，我们在扩展时在扩展原型上的Vue实例上定义代理getter
    // 初始化子构造器的Pops
    if (Sub.options.props) {
      initProps(Sub)
    }
    // 初始化子构造器的computed
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // 允许进一步使用extend、mixin、use
    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // 创建资产，这样扩展类也可以使用私有资产
    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    // 启用递归自我查找，即把当前构造函数存到options.components中
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 扩展时保持对父类选项的参考
    // 稍后在实例化的时候我们可以检查到父类选项是否已经更新
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // 缓存这个构造器
    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
