// import testComp from './test/test-comp'

// ./public文件夹内组件将自动注册 文件命名格式为下划线 my-component.vue  组件内需要写name,格式为驼峰 myComponent
let autoInitComponents = [];
let Components = require.context("./public", false, /\.vue/);
Components.keys().forEach((key) => {
  if (Components(key).default) autoInitComponents.push(Components(key).default);
});

const components = {
  install: function (Vue) {
    autoInitComponents.forEach((comp) => {
      Vue.component(comp.name, comp);
    });
  },
};
export default components;
