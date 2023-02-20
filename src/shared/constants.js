// 设置服务端渲染的标签的属性
// 如果一个标签上包含这个属性，说明它是服务端渲染出来的
export const SSR_ATTR = 'data-server-rendered'


// 资产类型，即options上挂载的属性
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

// 生命周期的所有函数名称
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]
