// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 Bug
        'docs',     // 文档更新
        'style',    // 代码格式（不影响代码运行）
        'refactor', // 重构（既不是新增功能，也不是修复 Bug）
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建工具或外部依赖变更（如 webpack、vite、npm）
        'ci',       // CI 配置或脚本变更
        'chore',    // 杂项（不修改 src 或 test）
        'revert',   // 回滚提交
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
};