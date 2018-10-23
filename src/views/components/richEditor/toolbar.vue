<template>
    <div>
        <!-- Add a bold button -->
        <button v-if="showData.bold" class="ql-bold" title="加粗">Bold</button>
        <button v-if="showData.italic" class="ql-italic" title="倾斜">Italic</button>
        <button v-if="showData.underline" type="button" class="ql-underline" title="下划线"></button>
        <button v-if="showData.strike" type="button" class="ql-strike" title="删除线"></button>
        <button v-if="showData.blockquote" type="button" class="ql-blockquote " title="引用"></button>
        <button v-if="showData.direction" type="button" class="ql-direction" value="rtl" title="文本方向"></button>
        <!-- Add font size dropdown -->
        <select v-if="showData.header" class="ql-header" title="标题">
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
            <option selected="selected">正常</option>
        </select>
        <select v-if="showData.size" class="ql-size" defaultValue="normal" title="字号">
            <option value="small">小号</option>
            <!-- Note a missing, thus falsy value, is used to reset to default -->
            <option value="normal">正常</option>
            <option value="large">中号</option>
            <option value="huge">大号</option>
        </select>
        <select v-if="showData.font" class="ql-font" title="字体">
            <option selected="selected">无衬线</option>
            <option value="serif">衬线</option>
            <option value="monospace">等宽字体</option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <button v-if="showData.sub" class="ql-script" title="下标" value="sub"></button>
        <!-- <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span> -->
        <button v-if="showData.super" class="ql-script" title="上标" value="super"></button>
        <select v-if="showData.align" class="ql-align" title="对齐方式">
            <option selected="selected"></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
        </select>
        <button v-if="showData.ordered" type="button" class="ql-list" value="ordered" title="有序列表"></button>
        <button v-if="showData.bullet" type="button" class="ql-list" value="bullet" title="无序列表"></button>
        <select v-if="showData.color" class="ql-color" title="颜色">
            <option selected="selected"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option value="#ffffff"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option>
        </select>
        <select v-if="showData.background" class="ql-background" title="背景颜色">
            <option value="#000000"></option>
            <option value="#e60000"></option>
            <option value="#ff9900"></option>
            <option value="#ffff00"></option>
            <option value="#008a00"></option>
            <option value="#0066cc"></option>
            <option value="#9933ff"></option>
            <option selected="selected"></option>
            <option value="#facccc"></option>
            <option value="#ffebcc"></option>
            <option value="#ffffcc"></option>
            <option value="#cce8cc"></option>
            <option value="#cce0f5"></option>
            <option value="#ebd6ff"></option>
            <option value="#bbbbbb"></option>
            <option value="#f06666"></option>
            <option value="#ffc266"></option>
            <option value="#ffff66"></option>
            <option value="#66b966"></option>
            <option value="#66a3e0"></option>
            <option value="#c285ff"></option>
            <option value="#888888"></option>
            <option value="#a10000"></option>
            <option value="#b26b00"></option>
            <option value="#b2b200"></option>
            <option value="#006100"></option>
            <option value="#0047b2"></option>
            <option value="#6b24b2"></option>
            <option value="#444444"></option>
            <option value="#5c0000"></option>
            <option value="#663d00"></option>
            <option value="#666600"></option>
            <option value="#003700"></option>
            <option value="#002966"></option>
            <option value="#3d1466"></option>
        </select>
        <button v-if="showData.indent" type="button" class="ql-indent" title="增加缩进" value="+1"></button>
        <button v-if="showData.indent" type="button" class="ql-indent" title="减少缩进" value="-1"></button>
        <button v-if="showData.link" type="button" class="ql-link " title="超链接"></button>
        <button v-if="showData.image" type="button" class="ql-image " title="图片"></button>
        <button v-if="showData.clean" type="button" class="ql-clean" title="清除字体样式"></button>
        <!-- You can also add your own -->
        <!-- <button style="width: 80px;" @click="customButtonClick">自定义</button> -->
        <slot name="diy"></slot>
    </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    toollist: {
      type: Array,
      default: () => {
        return (
          this.toollist || [
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'direction',
            'header',
            'size',
            'font',
            'sub',
            'super',
            'align',
            'ordered',
            'bullet',
            'color',
            'background',
            'indent',
            'link',
            'image',
            'clean'
          ]
        )
      }
    }
  },
  data() {
    // 数据data在这里
    return {
      showData: {}
    }
  },
  created() {
    const _this = this
    this.toollist.forEach(item => {
      _this.showData[item] = true
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
</style>
