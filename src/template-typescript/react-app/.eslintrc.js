// see https://zhuanlan.zhihu.com/p/62401626
module.exports = {
    parser: '@typescript-eslint/parser', // 解析器
    extends: ['plugin:@typescript-eslint/recommended', 'react-app'], // 继承的规则 [扩展]
    plugins: ['@typescript-eslint', 'react'], // 插件
    rules: {
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-var-requires': 0,
        'import/no-anonymous-default-export': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
    }, // 规则
};
