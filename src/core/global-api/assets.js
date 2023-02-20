/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * 创建资产的注册方法
   */
  // ASSET_TYPES: [directive, component, filter]
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 如果没有定义则返回选项中的资产
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        // 校验组件名称
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          // 定义组件名
          definition.name = definition.name || id
          // 通过Vue.extend()将该组件配置项转换为该组件的构造函数
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          // 规范化指令为配置项
          definition = { bind: definition, update: definition }
        }

        // 将配置项到保存到全局
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
