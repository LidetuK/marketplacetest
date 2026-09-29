<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total } = useNav()
const progress = computed(() => `${currentPage.value} / ${total.value}`)
</script>

<template>
  <div class="with-outline">
    <aside class="outline-rail">
      <div class="outline-brand">SE1 → SE2</div>
      <div class="outline-subtitle">Phase 1 · Web + App</div>
      <Toc class="outline-toc" :max-depth="1" />
      <div class="outline-progress">{{ progress }}</div>
    </aside>
    <main class="outline-main outline-main--cols">
      <div class="col">
        <slot name="default" />
        <slot name="left" />
      </div>
      <div class="col">
        <slot name="right" />
      </div>
    </main>
  </div>
</template>
