<template>
  <div class="nav">
    <NavTitle style="margin-right: 100px" />
    <NavTags />
  </div>
</template>

<script setup lang="ts">
import NavTitle from './NavTitle.vue'
import NavTags from './navTags/Index.vue'
</script>

<style scoped lang="less">
.nav {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 100;
  height: 42px;
  line-height: 42px;
  padding: 0 12px 0 20px;
  background-color: #fbfdff;
  box-shadow: 0px 2px 8px 0px rgba(88, 98, 110, 0.08);

  > span {
    font-size: 12px;
    color: #666;
  }

  .clear-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: pointer;

    .clear-icon {
      display: block;
      line-height: 13px;
      font-size: 13px;
    }

    &:hover {
      background: #f1f4f8;
      border-radius: 3px;

      .clear-icon {
        color: #378eef;
      }
    }
  }

  .grey-line {
    width: 1px;
    height: 18px;
    background: #dddddd;
    margin: 12px 16px;
  }
}
</style>
