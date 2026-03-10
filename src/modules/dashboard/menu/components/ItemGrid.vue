<template>
  <div class="grid m-0">
    <div v-for="item in items" :key="item.id" class="col-12 sm:col-6 lg:col-3 p-2">
      <ItemCard
        :item="item"
        :toggling="togglingId === item.id"
        @edit="emit('edit', item)"
        @options="emit('options', item)"
        @toggle="emit('toggle', item)"
        @delete="emit('delete', item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue'
import type { MenuItem } from '../../../../types/menu.types'

defineProps<{
  items:      MenuItem[]
  togglingId?: number | null   // id المادة التي يجري تعطيلها/تفعيلها الآن
}>()

const emit = defineEmits<{
  edit:    [item: MenuItem]
  options: [item: MenuItem]
  toggle:  [item: MenuItem]
  delete:  [item: MenuItem]
}>()
</script>