// see https://zhuanlan.zhihu.com/p/62401626
module.exports = {
  parser: '@typescript-eslint/parser', // 解析器
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ], // 继承的规则 [扩展]
  env: {
    browser: true,
  }, // 指定代码的运行环境
  plugins: ['@typescript-eslint', 'prettier'], // 插件
  rules: {
    // 规则说明: https://github.com/typescript-eslint/typescript-eslint/tree/v3.0.1/packages/eslint-plugin/docs/rules
    '@typescript-eslint/no-explicit-any': 0, // 允许使用any类型
    '@typescript-eslint/ban-types': 0, // 允许使用类似object的特定类型
    '@typescript-eslint/explicit-module-boundary-types': 0, // 导出的函数和类的公共类方法时不需要显式的返回值和参数类型
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  }, // 规则
}
