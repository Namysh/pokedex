<script setup>
import { computed, ref } from 'vue'
import {useSwipe} from "@vueuse/core";

const props = defineProps({
  items: Array
})

const selected = ref(props.items[0])
const selectedIndex = computed(() => {
  return props.items.indexOf(selected.value)
})

const target = ref<HTMLElement | null>(null)

const left = ref('0px')

const { lengthX } = useSwipe(
    target, {
      passive: false,
      onSwipe(e) {
        left.value = `${lengthX.value}px`
      },
      onSwipeEnd(e, direction) {
        const width = target.value?.offsetWidth

        if (direction === 'left' && lengthX.value > width / 2) {
          selected.value = props.items[selectedIndex.value + 1] ?? props.items[0]
        } else if (direction === 'right' && lengthX.value < -width / 2) {
          selected.value = props.items[selectedIndex.value - 1] ?? props.items[props.items.length - 1]
        }
        left.value = '0px'

      },
    })
</script>

<template>
  <div ref="target" class="bg-white flex flex-col rounded-t-3xl p-4 pt-8">
    <div class="flex justify-between">
      <div
        class="cursor-pointer"
        @click="selected = item"
        v-for="item in items"
        :key="item"
        :class="{ 'border-b-2': selected === item }"
      >
      </div>
    </div>
    <div class="overflow-hidden flex w-full flex-grow relative">
      <div
        class="shrink-0 w-full absolute "
        v-for="(item, index) in items"
        :key="item"
        :style="`transform: translateX(calc(${((index - selectedIndex) * 100)}% - ${left}))`"
      >
        <slot :name="item.toLowerCase().replace(/ /g, '-')"> </slot>
      </div>
    </div>
  </div>
</template>
