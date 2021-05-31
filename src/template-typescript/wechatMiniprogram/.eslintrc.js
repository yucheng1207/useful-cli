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
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-var-requires': 0,
        'no-fallthrough': 0,
    }, // 规则
}
