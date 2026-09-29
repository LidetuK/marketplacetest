<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total } = useNav()
const progress = computed(() => `${currentPage.value} / ${total.value}`)

const railRef = ref<HTMLElement | null>(null)

/** Survives layout remounts when switching slide layouts */
let savedScrollTop = 0

function captureScroll() {
  if (railRef.value)
    savedScrollTop = railRef.value.scrollTop
}

function restoreScroll() {
  const el = railRef.value
  if (!el)
    return
  el.scrollTop = savedScrollTop
}

onMounted(async () => {
  await nextTick()
  restoreScroll()
  requestAnimationFrame(() => {
    restoreScroll()
    requestAnimationFrame(restoreScroll)
  })
})

onBeforeUnmount(() => {
  captureScroll()
})

watch(currentPage, async () => {
  captureScroll()
  await nextTick()
  restoreScroll()
  requestAnimationFrame(restoreScroll)
})
</script>

<template>
  <aside
    ref="railRef"
    class="outline-rail"
    @scroll.passive="captureScroll"
  >
    <div class="outline-brand">SE1 → SE2</div>
    <div class="outline-subtitle">Phase 1 · Web + App</div>
    <Toc class="outline-toc" :max-depth="1" />
    <div class="outline-progress">{{ progress }}</div>
  </aside>
</template>
