### 希尔新 ERP 前端

> ele-admin

#### vsc配置eslint-vue

参考[框架文档](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/advanced/eslint.html#vscode-%E9%85%8D%E7%BD%AE-eslint)

#### 目录结构

```
├── build                      // 构建相关
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filters                // 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── lang                   // 国际化 language
│   ├── mock                   // 项目mock 模拟数据
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                   // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── permission.js          // 权限管理
├── static                     // 第三方不打包资源
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

安装依赖

```
npm i
```

启动

```
npm run dev
```

如果`install`慢

```
npm install --registry=https://registry.npm.taobao.org
```

使用`mock`模拟请求数据

```
src/mock/index.js
```

---

- ### 动态路由

  - 前台权限模拟（后台完善后停用）

    > @/mock/login.js

    修改其中的`asyncRouterMap`

  - 前台模块表

    > @/router/index.js

    修改`componentsMap`，`key`与数据库中的`Component`对应

- ### 按钮权限

  - 模拟数据（后台完善后停用）

    > @/mock/login.js

    修改`getPermission`函数的返回值

  - 页面中使用

    添加引用

    `directives: { permission }`

    在需要控制的元素上添加`v-permission`属性，如：

        <span v-permission="{page:$options.name,name:'first'}" class="permission-alert">
        Only
            <el-tag class="permission-tag" size="small">admin</el-tag> can see this
        </span>

    其中`page`属性为当前页面`name`，`name`属性为数据库中元素的`name`

- ### 规范
  参阅[这里](./STYLERULE.md)

* ### 发布

  ```
  # 打包正式环境
  npm run build:prod

  # 打包测试环境
  npm run build:sit

  # --generate a bundle size analytics. default: bundle-report.html
  # 打开生成分析报表
  npm run build:prod --generate_report
  ```
