<template>
  <div class="not-find-container">
    <div class="content">
      <SvgIcon class="icon" name="401" />
      <div class="text">抱歉，您暂无权限访问该页面</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.not-find-container {
  height: 100%;
  min-height: calc(100vh - 147px);
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    .icon {
      width: calc(360px - (1920px - 100vw) * 0.125);
      min-width: 280px;
      max-width: 360px;
      -webkit-user-drag: none;
    }
    .text {
      text-align: center;
      font-size: 14px;
      margin-top: 24px;
      color: #c1c2c6;
    }
  }
}
</style>
