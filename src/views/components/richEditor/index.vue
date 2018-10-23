<template>
  <quill-editor v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"></quill-editor>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import toolbar from './toolbar.vue'
export default {
  name: 'RichEditor',
  components: { quillEditor, toolbar },
  props: {
    toolconfig: { type: Array }
  },
  watch: {
    content(val) {
      this.$emit('input', val)
    }
  },
  data() {
    // 数据data在这里
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image']
          ]
        }
      }
    }
  },
  methods: {
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    }
  },
  mounted() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 重置样式，用于重写element-ui样式，自定义自己的样式 */
.quill-editor {
  .ql-container {
    min-height: 220px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 自定义样式，由于有scoped属性，所以只对当前tamplate中的 html生效，优化打包效率*/
.app-container {
}
</style>
