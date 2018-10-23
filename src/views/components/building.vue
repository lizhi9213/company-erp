<template>
  <div class="building-container">
    <div></div>
    <h1>我们正在建设，稍后再来看吧</h1>
  </div>
</template>
<script>
export default {
  name: 'BuildPage'
}
</script>
<style lang="scss" scoped>
.building-container {
  text-align: center;
  h1 {
    margin-top: 25px;
    color: #666;
  }
  div {
    height: 600px;
    background: url(../../images/building.gif) no-repeat center center;
  }
}
</style>

