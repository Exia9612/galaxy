# Tatget

- 组件库
- monitor
- npm发包流程
- 全局eslint rules
- 包中的eslint覆盖全局规则

# Todo(2025.8.17)

- <del>保存按照prettier自动格式化</del>
- <del>配置cursor lint规则</del>

# Todo(2025.8.19)

- <del>lint-staged & husky</del>
- 自定义提交规范

# Todo(2025.8.20)

- 自定义提交规范

# Todo(2025.9.29)

- 实现数据响应式，通过watch监听metric变化，应对performance异步收集数据问题

# 月度任务

- 8月：eslint & husky
- 9月：发包 & git CI/CD
- 10月：monitor编码
- 11月：reat-comp + storay 编码 & 尝试上阿里云
- 12月：时间冗余

# monorepo配置心得

## package.json

- engines: 目前对NPM来说，engines只是起一个说明的作用，即使用户安装的版本不符合要求，也不影响依赖包的安装。但使用pnpm 和 yarn安装，如果版本不符合要求会导致安装失败

## eslint VS Prettier

- Use Prettier for code formatting concerns(格式化), and linters for code-quality concerns(质量)
- Prettier对代码错误不做检查

### 为什么会有冲突

- linter里有许多代码风格规则与prettier冲突
