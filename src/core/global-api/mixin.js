/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  // 构造器上挂载mixin方法
  Vue.mixin = function (mixin: Object) {
    // 将传入的对象合并到实例options中
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
