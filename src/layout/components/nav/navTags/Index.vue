<template>
  <div class="nav-tag-container">
    <div v-show="showArrow" class="arrow-left" @click="handleScroll(-200)">
      <i class="iconfont icon-fs_2025040929icon" />
    </div>
    <div ref="navTagViewDRef" class="nav-tag-view" @wheel.passive="onWheel">
      <div ref="navTagListDRef" class="nav-tag-list">
        <TagItem
          v-for="(tag, index) in navTagsLocalValue"
          :key="tag.path"
          :tag-data="tag"
          :idx="index"
          :cur-tag-data="currentTag"
          @close="closeTagRouter"
          @open="openTagRouter"
        />
      </div>
    </div>
    <div v-show="showArrow" class="arrow-right" @click="handleScroll(200)">
      <i class="iconfont icon-fs_2025040929icon" />
    </div>
  </div>
  <div class="clear-box">
    <ATooltip
      placement="bottomLeft"
      color="#333"
      :align="{ offset: [-4, 0] }"
      :destroy-tooltip-on-hide="false"
      title="清空标签"
    >
      <div class="clear-view" @click="closeTagRouter(currentTag, NavCloseEnum.CLOSE_OTHER)">
        <i class="iconfont icon-fs_2025040924icon clear-icon" />
      </div>
    </ATooltip>
  </div>
</template>

<script setup lang="ts">
import TagItem from './TagItem.vue'
import useNavTags, { NavCloseEnum } from './hooks/useNavTags'
import { useElementSize } from '@vueuse/core'
import { offSet, scrollLeft } from '/@/utils'
import { debounce } from 'lodash-es'
const router = useRouter()
const navTagViewDRef = ref(null)
const navTagListDRef = ref(null)
const { width: navTagViewWidth } = useElementSize(navTagViewDRef)
const { width: navTagListWidth } = useElementSize(navTagListDRef)
const showArrow = computed(() => navTagListWidth.value > navTagViewWidth.value)
const { navTagsLocalValue, currentTag, closeTagRouter, openTagRouter } = useNavTags(router)

/**
 * 滚轮垂直方向改为水平方向
 */
const onWheel = e => {
  navTagViewDRef.value.scrollLeft += e.deltaY
}

/**
 * 手动滚动偏移量
 * @param offset 滚动偏移量
 */
function handleScroll(offset) {
  const scrollOffset = navTagViewDRef.value.scrollWidth - navTagViewDRef.value.clientWidth
  const tempOffset = navTagViewDRef.value.scrollLeft + offset

  const fromPosition = navTagViewDRef.value.scrollLeft
  let toPosition = 0

  if (tempOffset < 0) {
    toPosition = 0
  } else if (tempOffset > scrollOffset) {
    toPosition = scrollOffset
  } else {
    toPosition = tempOffset
  }
  scrollLeft(navTagViewDRef.value, fromPosition, toPosition)
}

/**
 * 激活标签滚动
 */
function activeScroll() {
  nextTick(() => {
    if (!navTagViewDRef.value) return
    const activeElement = navTagViewDRef.value.querySelector('.tag-active')

    if (!activeElement) return

    const activeStyles = activeElement.getBoundingClientRect()
    const tagViewStyles = navTagViewDRef.value.getBoundingClientRect()

    const scrollLeft = navTagViewDRef.value.scrollLeft
    const scrollViewWidth = tagViewStyles.width

    const curScrolOffset = scrollLeft + scrollViewWidth
    const { left } = offSet(activeElement, navTagListDRef.value)
    const activeElementOffset = left + activeStyles.width

    // 右隐藏
    if (activeElementOffset > curScrolOffset) {
      navTagViewDRef.value.scrollLeft = activeElementOffset - scrollViewWidth + 1
    }

    // 左隐藏
    if (left < scrollLeft) {
      navTagViewDRef.value.scrollLeft = left - 1
    }

    // 中间区域不移动
  })
}

const activeViewScroll = debounce(activeScroll, 200)

watch(currentTag, activeViewScroll, { immediate: true })
watch(navTagViewWidth, activeViewScroll, { immediate: true })
</script>

<style scoped lang="less">
.nav-tag-container {
  display: flex;
  flex: 1;
  width: 0;
  .nav-tag-view {
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-shrink: 0;
    text-align: right;
    .nav-tag-list {
      display: inline-block;
      white-space: nowrap;
      position: relative;
    }
  }
}
.arrow-left,
.arrow-right {
  flex-shrink: 0;
  cursor: pointer;
  width: 16px;
  display: flex;
  align-content: center;
  justify-content: center;
  .iconfont {
    font-size: 16px;
    color: #666666;
    flex-shrink: 0;
    width: 16px;
  }
  &:hover {
    .iconfont {
      color: #378eef;
    }
  }
}
.arrow-left {
  padding-right: 8px;
  .iconfont {
    transform: rotate(90deg);
  }
}
.arrow-right {
  padding-left: 8px;
  .iconfont {
    transform: rotate(-90deg);
  }
}
.clear-box {
  display: flex;
  align-items: center;
  margin-left: 10px;
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
}
</style>
