<template>
  <div class="layout-header-component">
    <div class="content-box">
      <div class="left">
        <div class="menu-switch" @click="systemStore.setState('isExpansion', !systemStore.isExpansion)">
          <SvgIcon
            :name="systemStore.isExpansion ? 'menuExpansion' : 'menuCollapsed'"
            style="width: 20px; height: 20px"
          />
        </div>
      </div>
      <div class="right">
        <a class="mr-12px icon" :href="config.homeHelpUrl" target="_blank">
          <i class="iconfont icon-tubiao_tishi" /><span class="text">帮助</span>
        </a>
        <a class="mr-12px icon" :href="config.homeFeedbackUrl" target="_blank">
          <i class="iconfont icon-tubiao_jilu" /><span class="text">反馈</span>
        </a>
        <div class="user-info">
          <FAvatar :sex="userStore.userInfo?.sex" :user-id="userStore.userInfo?.userId" class="avatar" />
          <ADropdown placement="bottomRight" :align="{ offset: [0, 12] }">
            <div class="info-box">
              <div class="info">
                <p class="name">{{ userStore.userInfo?.userName }}</p>
                <p class="department">{{ userStore.userInfo?.jobPost }}</p>
              </div>
              <i class="iconfont icon-fs_2025040929icon" />
            </div>
            <template #overlay>
              <ul class="menu-dropdown">
                <li class="menu" @click="userService.logout">
                  <i class="iconfont icon-fs_2025040931icon mr-8px" />退出登录
                </li>
              </ul>
            </template>
          </ADropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from '/@/config'
import { userService } from '/@/services'
import { useSystemStore, useUserStore } from '/@/store'
const systemStore = useSystemStore()
const userStore = useUserStore()
</script>

<style lang="less" scoped>
.layout-header-component {
  height: 56px;
  box-shadow: 0px 1px 1px 0 rgb(88 98 110 / 2%);
  margin-bottom: 1px;
  .content-box {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    background: #fff;
    .left {
      padding-left: 24px;
      box-sizing: border-box;
      .menu-switch {
        cursor: pointer;
      }
    }
    .right {
      padding-right: 20px;
      display: flex;
      align-items: center;
      .user-info {
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 16px;
          height: 32px;
          width: 32px;
          border: 1px solid #eee;
        }
        .info-box {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .info {
          line-height: 18px;
          margin: 0 8px;
          p {
            margin: 0;
            padding: 0;
          }
          .name {
            height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
          }
          .department {
            height: 18px;
            font-size: 12px;
            font-weight: 400;
            color: #666666;
            line-height: 18px;
          }
        }
      }
      .icon {
        color: #666666;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 34px;
        padding: 8px 4px 0 4px;
        text-decoration-line: none;
        cursor: pointer;
        .iconfont {
          font-size: 16px;
          line-height: 16px;
        }
        .text {
          height: 18px;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
        }
        &:hover {
          color: #378eef;
        }
      }
    }
  }
}
.menu-dropdown {
  background: #ffffff;
  box-shadow: 0px 4px 12px 1px rgba(88, 98, 110, 0.14);
  border-radius: 3px;
  min-width: 100px;
  padding: 4px;
  .menu {
    font-size: 12px;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    color: #333333;
  }
  .menu:last-child {
    margin-bottom: 0;
  }
  .menu:hover {
    background-color: #f1f4f8;
  }
}
</style>
