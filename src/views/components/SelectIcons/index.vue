<template>
  <div class="icons-container">
    <div class="icons-wrapper">
      <div v-for="(item, index) of iconsMap" :key="item.icon" @click="handleClipboard(item.icon, index)">
        <div class="icon-item" :class="{'active': item.isactive}">
          <svg-icon class-name="disabled" :icon-class="item.icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsSelection'

export default {
  name: 'icons',
  props: {
    hasactive: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    hasactive(val) {
      if (val) {
        for (const item of this.iconsMap) {
          item.isactive = false
        }
      }
    }
  },
  data() {
    return {
      iconsMap: []
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map(i => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap.map(v => {
      const obj = {
        icon: v,
        isactive: false
      }
      return obj
    })
  },
  methods: {
    handleClipboard(text, index) {
      console.log(text)
      console.log(index)
      for (const item of this.iconsMap) {
        item.isactive = false
      }
      this.iconsMap[index].isactive = true
      this.$emit('selected-icon', text)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    height: 44px;
    text-align: center;
    width: 40px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
    &:hover {
      background-color: rgba(11, 178, 122, 0.4);
      color: #fff;
    }
    &.active {
      background-color: rgba(11, 178, 122, 0.4);
      color: #fff;
    }
  }
  .disabled {
    pointer-events: none;
  }
}
</style>
