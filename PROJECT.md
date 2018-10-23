- ### 按钮使用规范

  - 表单中

    ```html
    <!-- 取消/重置按钮-->
    <el-button>取消/重置</el-button>
    <!-- 提交/确认按钮-->
    <el-button type="primary">提交/确认</el-button>
    ```

  - 页面中操作按钮组

    ```html
    <!-- 提交/确认/保存按钮-->
    <el-button type="primary">提交/确认/保存</el-button>
    <!-- 其他操作操作按钮-->
    <el-button type="warning" plain>操作按钮</el-button>
    ```

  - 页面表格中

    ```html
    <!-- 编辑按钮-->
    <el-button type="warning" size="mini" icon="el-icon-edit" circle></el-button>
    <!-- 删除按钮-->
    <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
    ```

- #### 页面中样式或组件的使用

  - 页面表格中使用规范

    > 项目表格采用 iview 的 table 表格，按需导入，vue 全局注册组。只需在需要用到的地方调用即可，HTML 中调用方法如下，<br/>table 的具体 API 配置方法详见: [iview Table 表格](https://www.iviewui.com/components/table)<br/>vue 的 render 渲染请参考:[Vue render 深入窥探之谜](https://juejin.im/post/5aceb4b0518825556534e0f6)

    ```html
    <iviewTable stripe :columns="columns" :data="TableData"></iviewTable>
    ```

    ```javascript
    /* 需要注意的是，table的表头右侧操作需要统一使用相同的rander函数，只需要在表头配置数组末尾加上如下代码 */
    
    columns = [
      {
        title: '操作',
        width: 65,
        align: 'center',
        fixed: 'right',
        render: function(h, obj) {
          return h(
            'el-dropdown',
            {
              props: {},
              on: {
                command: _this.handleCommand
              }
            },
            [
              h('span', {}, [
                h('svg-icon', {
                  props: {
                    'icon-class': 'set_table'
                  }
                })
              ]),
              h('el-dropdown-menu', { slot: 'dropdown' }, [
                h(
                  'el-dropdown-item',
                  { props: { command: { key: 'edit', id: obj.row.Id } } },
                  '编辑'
                ),
                h('el-dropdown-item', { props: { disabled: true } }, '停止计划')
              ])
            ]
          )
        }
      }
    ]
    ```

  - VueTreeselect 使用方法

    > 具体 API 文档，详见: <a href="https://vue-treeselect.js.org/#events">VueTreeselect</a>

    ```html
    <!--已经在main.js中全局注册组件，只需要在专注html中的配置即可-->
    <treeselect v-model="value" :multiple="true" :options="options" />
    ```

  - Vue.Draggable 拖拽组件的使用方法

    > 具体 API 文档，详见: <a href="https://github.com/SortableJS/Vue.Draggable">Vue.Draggable</a>

  - 备注类样式

    > 请直接为当前备注说明的父容器加上 `.warn-content` 样式即可

  - 页面顶部筛选组件使用方法

    > 全功能模板

    ```html
    <template>
      <div class="app-container">
        <TopOperating :blockdata="slotList">
          <div slot="title1">
            <PanelMain :name="'在职'" :number="1476" istitle :current="checked === 0" @click.native="selectPane(0)"></PanelMain>
            <PanelMain :name="'全职'" :number="325" :current="checked === 1" @click.native="selectPane(1)"></PanelMain>
            <PanelMain :name="'学习'" :number="123" :current="checked === 2" @click.native="selectPane(2)"></PanelMain>
            <PanelMain :name="'劳务派遣'" :number="123" :current="checked === 3" @click.native="selectPane(3)"></PanelMain>
            <PanelMain :name="'全职派遣'" :number="666" :current="checked === 4" @click.native="selectPane(4)"></PanelMain>
          </div>
          <div slot="title2">
            <PanelMain :name="'试用期'" :number="333" :current="checked === 5" @click.native="selectPane(5)"></PanelMain>
            <PanelMain :name="'待离职'" :number="528" :current="checked === 6" @click.native="selectPane(6)"></PanelMain>
            <PanelMain :name="'正式'" :number="123" :current="checked === 7" @click.native="selectPane(7)"></PanelMain>
          </div>
          <div slot="title3">
            <PanelMain :name="'待入职'" :number="159" :current="checked === 8" @click.native="selectPane(8)"></PanelMain>
            <PanelMain :name="'已入职'" :number="654" :current="checked === 9" @click.native="selectPane(9)"></PanelMain>
          </div>
          <div slot="commonly">
            <p>这里是主要筛选条件插槽...</p>
          </div>
          <div slot="button">
            <el-button type="primary">新增</el-button>
            <el-button type="primary" plain>导入</el-button>
            <el-button type="primary" plain>导出</el-button>
          </div>
          <div slot="filterlist">
            <p style="height: 80px;">这里是筛选详情插槽....</p>
          </div>
        </TopOperating>
      </div>
    </template>
    
    <script>
    import TopOperating from '@/views/components/TopOperating'
    import PanelMain from '@/views/components/TopOperating/PanelMain.vue'
    export default {
      components: {
        TopOperating,
        PanelMain
      },
      watch: {},
      data() {
        return {
          slotList: [
            { span: 12, name: 'title1' }, /*其中span为当前插槽的所占份数，分栏24*/
            { span: 8, name: 'title2' }, /*name为插槽的名字，必须与template中的slot传入名称一致*/
            { span: 4, name: 'title3' }
          ],
          checked: 0
        }
      },
      methods: {
        selectPane(a) {
          this.checked = a
        }
      }
    }
    </script>
    ```

    > 操作说明：
    >
    > ​ 由于跨组件传参比较麻烦，顶部筛选组件需要导入两个组件同时使用，TopOperating 为主要组件，PanelMain 为辅助组件（此组件为非必须组件，如果不需要卡片筛选组件则无需导入 PanelMain 和传入 blockdata），只专注渲染 HTML 无操作逻辑。
    >
    > ​ TopOperating 组件的插槽 slot 为了方便使用，分为：动态插槽和固定插槽。如果不需要当前插槽不使用即可，动态插槽需要配合参数 blockdata 共同作用才能生效

    | 参数                     | 说明                                    | 类型    | 可选值 | 默认值  |
    | ------------------------ | --------------------------------------- | ------- | ------ | ------- |
    | blockdata                | 动态插槽配置项                          | object  | 无     | 无      |
    | istitle（PanelMain 中）  | 所有(特殊样式)                          | boolean |        | false   |
    | name（PanelMain 中）     | 标题                                    | string  |        |         |
    | number（PanelMain 中）   | 内容                                    | string  |        |         |
    | endname （PanelMain 中） | 只有在 istitle 模式下使用，表示结尾文字 | string  |        |         |
    | current （PanelMain 中） | 选中 active 标记                        | boolean |        | false   |
    | rowgutter                | 动态插槽的间距                          | number  |        | 18      |
    | filgutter                | 插槽 commonly 与插槽 button 的间距      | number  |        | 18      |
    | mainclo                  | 插槽 commonly 所占分栏数(小屏幕占 14)   | number  |        | 18 / 14 |
    | btnclo                   | 插槽 button 所占分栏数(小屏幕占 10)     | number  |        | 6 / 10  |
    | hidefilter               | 隐藏筛选按钮                            | boolean |        | false   |

  - 富文本编辑器组件

    > 富文本编辑器基于 [Vue-Quill-Editor](https://github.com/surmon-china/vue-quill-editor) 进行二次开发封装成的组件，其最核心内容还是 [Quill](https://quilljs.com/docs/quickstart/) ,目前只对编辑器的顶部操作toolbar进行了定制化开发，如果想更深入的定制请参考  [Vue-Quill-Editor](https://github.com/surmon-china/vue-quill-editor)  和  [Quill](https://quilljs.com/docs/quickstart/) 。

    ```javascript
    /*导入组件*/
    import richEditor from '@/views/components/RichEditor'
    export default {
        components: {
        richEditor
      }
    }
    ```

    ```html
    <!--template中使用
    <!-- 使用v-model绑定富文本数据-->
    <rich-editor v-model="content"></rich-editor>
    ```

    | 配置项     | 说明     | 配置项     | 说明                |
    | ---------- | -------- | ---------- | ------------------- |
    | bold       | 加粗     | super      | 上标                |
    | italic     | 倾斜     | align      | 对齐方式            |
    | underline  | 下划线   | ordered    | 有序列表            |
    | strike     | 删除线   | bullet     | 无序列表            |
    | blockquote | 引用     | color      | 颜色                |
    | direction  | 文本方向 | background | 背景颜色            |
    | header     | 标题     | indent     | 增加缩进 / 减少缩进 |
    | size       | 字号     | link       | 超链接              |
    | font       | 字体     | image      | 图片                |
    | sub        | 下标     | clean      | 清除字体样式        |

    

    

- ### 用户操作提示信息样式

  > 用于用户主动操作后的反馈提示，例如表单提交、导入导出、入库........

  - 成功消息提示

    ```javascript
    this.$message.success('成功消息')
    ```

  - 警告消息提示

    ```javascript
    this.$message.warning('警告消息')
    ```

  - 失败消息提示

    ```javascript
    this.$message.error('失败消息')
    ```

  - 警告消息提示并确认进行下一步

    ```javascript
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    ```

- ### 基本组成页面标准模板

  > 页面模板使用注意事项：
  >
  > 1.  页面基本布局采用 row 布局方式，分 24 等份，具体的 col 请根据具体需求配比，具体参见：[Layout 布局](http://element-cn.eleme.io/#/zh-CN/component/layout)
  > 2.  页面每个块级部分背景均使用 card 卡片组件为基础背景样式，可自主决定卡片头部是否需要，不需要删掉即可。
  > 3.  为了方便管理后台请求接口，封装的请求接口函数统一在 '/src/api' 文件夹中，请求接口函数需要自己自定义封装，然后在当前页面导入调用即可。
  > 4.  模板中第一个 _<style>_ 标签中写需要自定义重写 elemet-ui 本身的样式的 css 代码。注意：大部分重置 element 本身样式的 css 代码，写在有 _scoped_ 属性的 style 标签中是无效的，所以第二个 _<style>_ 标签中写在当前 template 中生效的 css 样式，以提高代码运行效率。

  ```html
  <template>
    <div class="app-container">
        <BuildPage></BuildPage>
    </div>
  </template>
  <script>
  import BuildPage from '@/views/components/building'
  export default {
  name: '组件名称',
  components: { BuildPage },
  watch: {},
  data() {
    // 数据data在这里
    return {}
  },
  methods: {
    init() {
      // 处理函数
    }
  },
  mounted() {
    // 一般在此调用初始化函数
    this.init()
  }
  }
  </script>
  <style rel="stylesheet/scss" lang="scss">
  /* 重置样式，用于重写element-ui样式，自定义自己的样式 */
  </style>
  <style rel="stylesheet/scss" lang="scss" scoped>
  /* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
  .app-container {
  }
  </style>
  ```

- ### 关于不显示在侧边菜单栏目中的页面配置
 > 不显示在菜单中的页面为了方便管理，统一配置在src/router/index.js 文件中的如下object中的children中

```javascript
{
  path: '/hide',
  component: Layout,
  children: [{
    path: 'flow_creat',
    component: () =>
        import('@/views/workflow/flow_creat'),
    name: 'flow_creatWorkflow',
    meta: {
      title: '流程模板创建',
      noCache: true
    }
  }],
  hidden: true
}
```

> 在其他页面中调用跳转这个页面，请这样写：（例如： this.$router.push({ path: '/hide/flow_creat' }) ）


* ### node 后台模拟数据，启动操作注意事项

> 为更真实的还原后台环境，现使用 node + express + mockjs 搭建了一个真实的 node 后台环境，利用 mockjs 来模拟数据。后台服务放在 APIService 文件夹中，初次使用请按照以下方法启动 node 后台

```javascript
// 新建一个后台终端，进入Node后台api文件目录
cd APIService

// 初次拉取后,先执行以下两步

// 1.先在终端中初始化全局安装nodemon 后台服务自动重启插件
npm install nodemon -g
// 2.初次拉取需要install
npm install

// 以后每次要启动node后台，只需要打开终端执行以下命令即可
nodemon ./bin/www
```
