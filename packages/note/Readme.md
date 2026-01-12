# monorepo配置心得

## package.json

- engines: 目前对NPM来说，engines只是起一个说明的作用，即使用户安装的版本不符合要求，也不影响依赖包的安装。但使用pnpm 和 yarn安装，如果版本不符合要求会导致安装失败

## eslint VS Prettier

- Use Prettier for code formatting concerns(格式化), and linters for code-quality concerns(质量)
- Prettier对代码错误不做检查

### 为什么会有冲突

- linter里有许多代码风格规则与prettier冲突
