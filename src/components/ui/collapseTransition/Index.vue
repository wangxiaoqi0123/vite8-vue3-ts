<template>
  <Transition v-on="transition">
    <slot />
  </Transition>
</template>
<script lang="ts" setup>
import type { RendererElement } from 'vue'
import { addClass, removeClass } from './assist'
import './index.css'

const transition = {
  beforeEnter(el: RendererElement) {
    addClass(el, 'collapse-transition')
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom

    el.style.height = '0'
    el.style.paddingTop = '0'
    el.style.paddingBottom = '0'
  },

  enter(el: RendererElement) {
    el.dataset.oldOverflow = el.style.overflow
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.paddingTop = el.dataset.oldPaddingTop || ''
      el.style.paddingBottom = el.dataset.oldPaddingBottom || ''
    } else {
      el.style.height = ''
      el.style.paddingTop = el.dataset.oldPaddingTop || ''
      el.style.paddingBottom = el.dataset.oldPaddingBottom || ''
    }

    el.style.overflow = 'hidden'
  },

  afterEnter(el: RendererElement) {
    // for safari: remove class then reset height is necessary
    removeClass(el, 'collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow || ''
  },

  beforeLeave(el: RendererElement) {
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.height = el.scrollHeight + 'px'
    el.style.overflow = 'hidden'
  },

  leave(el: RendererElement) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition')
      el.style.height = '0'
      el.style.paddingTop = '0'
      el.style.paddingBottom = '0'
    }
  },

  afterLeave(el: RendererElement) {
    removeClass(el, 'collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow || ''
    el.style.paddingTop = el.dataset.oldPaddingTop || ''
    el.style.paddingBottom = el.dataset.oldPaddingBottom || ''
  }
}
</script>
