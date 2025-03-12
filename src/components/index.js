const componentsContext = require.context('./public', false, /\.vue/)

const loadComponents = (context) => {
  const componentsList = []
  context.keys().forEach((key) => {
    try {
      const component = context(key).default
      if (component?.name) {
        componentsList.push(component)
      } else {
        console.warn(`组件注册失败: ${key} 缺少name属性`)
      }
    } catch (error) {
      console.error(`组件加载错误: ${key}`, error)
    }
  })
  return componentsList
}

const registeredComponents = loadComponents(componentsContext)

export default {
  install: (Vue) => {
    registeredComponents.forEach((component) => Vue.component(component.name, component))
  },
}
