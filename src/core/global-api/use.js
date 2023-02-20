/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  // Vue构造器上定义use方法，接受一个插件参数
  Vue.use = function (plugin: Function | Object) {
    // 获取已安装的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      // 若插件已安装，则返回当前实例
      return this
    }
    // 附加的参数
    // additional parameters
    const args = toArray(arguments, 1)
    // 将实例插入到第一个
    args.unshift(this)
    // 若插件是一个包含install方法的对象，执行install
    // 若插件是一个函数，则执行该函数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 将插件添加到记录中
    installedPlugins.push(plugin)
    return this
  }
}
