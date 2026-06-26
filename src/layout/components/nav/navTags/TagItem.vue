<template>
  <div ref="targetDRef" class="tag-box" @contextmenu.right="e => e.preventDefault()">
    <div class="tag-context" :class="{ 'tag-active': isActive }" @click="openTag">
      <span class="tag-title">{{ tagData.title }}</span>
      <i class="iconfont icon-fs_2025041001icon" @click="closeTag(NavCloseEnum.CLOSE_CURRENT)" />
    </div>
    <ul v-if="visible" ref="contextmenuDRef" class="contextmenu">
      <li @click="closeTag(NavCloseEnum.CLOSE_CURRENT)">关闭</li>
      <li @click="closeTag(NavCloseEnum.CLOSE_OTHER)">关闭其他</li>
      <li @click="closeTag(NavCloseEnum.CLOSE_ALL)">关闭全部</li>
      <li @click="closeTag(NavCloseEnum.CLOSE_RIGHT)">关闭右侧</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { type INavTag, NavCloseEnum, isSameTagNav } from './hooks/useNavTags'

interface IProps {
  idx: number
  tagData: INavTag
  curTagData: INavTag
}
const props = defineProps<IProps>()
const emit = defineEmits(['close', 'open'])
const isActive = computed(() => isSameTagNav(props.tagData, props.curTagData))
const targetDRef = ref(null)
const contextmenuDRef = ref(null)
const visible = ref(false)

const switchContextmenu = e => {
  visible.value = targetDRef.value.contains(e.target)
  if (visible.value) {
    nextTick(() => {
      if (contextmenuDRef.value) {
        contextmenuDRef.value.style.left = e.clientX + 'px'
        contextmenuDRef.value.style.top = e.clientY + 'px'
      }
    })
  }
}
watchEffect(onCleanup => {
  const targetParent = targetDRef.value?.parentNode
  targetParent?.addEventListener('contextmenu', switchContextmenu)
  onCleanup(() => {
    targetParent?.removeEventListener('contextmenu', switchContextmenu)
  })
})
onClickOutside(targetDRef, () => (visible.value = false))

const closeTag = type => {
  emit('close', props.tagData, type, props.idx)
  visible.value = false
}

const openTag = () => {
  emit('open', props.tagData)
}
</script>

<style scoped lang="less">
.tag-box {
  display: inline-block;
  .contextmenu {
    position: fixed;
    left: 0;
    top: 34px;
    z-index: 100;
    background-color: #fff;
    padding: 5px 0;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.1);
    & > li {
      height: 24px;
      padding: 5px 15px;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 1;
      text-align: left;
      cursor: pointer;
      color: rgb(81, 90, 110);
      &:hover {
        background-color: #eee;
      }
    }
  }
}
.tag-box + .tag-box {
  margin-left: 10px;
}
.tag-context {
  height: 24px;
  border-radius: 3px;
  border: 1px solid #dddddd;
  cursor: pointer;
  padding: 3px 8px 3px 8px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  box-sizing: border-box;
  line-height: 16px;
  .iconfont {
    flex-shrink: 0;
    color: #999999;
    vertical-align: -2px;
  }
  .tag-title:hover {
    color: #378eef;
  }
  .iconfont:hover {
    color: #378eef;
  }
  &:has(.iconfont:hover) {
    color: #378eef;
  }
}
.tag-active {
  background-color: #ebf3fd;
  border: 1px solid #87bbf5;
  color: #378eef;
  .iconfont {
    color: #378eef;
  }
}
</style>
