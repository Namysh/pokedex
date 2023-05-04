<script setup>
import { useQuery } from "@tanstack/vue-query";
import Pokeball from "@/components/Pokeball.vue";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { POKEMON_COLORS, POKEMON_DEFAULT_COLOR } from '@/constants'


const props = defineProps({
  url: String
})

const { data: pokemon } = useQuery({
  queryKey: ['pokemon', props.url],
  queryFn: () => fetch(props.url).then((res) => res.json()),
  staleTime: Infinity
})

const router = useRouter()

const imageRef = ref()
const typesRef = ref()
const nameRef = ref()

const go = async (id) => {
  imageRef.value.style.viewTransitionName = 'pokemon-image';
  typesRef.value.forEach((type, index) => {
    type.style.viewTransitionName = 'pokemon-type-' + index;
  })
  nameRef.value.style.viewTransitionName = 'pokemon-name';

  document.startViewTransition(() => {
    imageRef.value.style.viewTransitionName = '';
    typesRef.value.forEach((type) => {
      type.style.viewTransitionName = '';
    })
    nameRef.value.style.viewTransitionName = '';


    return router.push(`/${id}`)
  });
}
</script>

<template>
  <div v-if="pokemon" :style="`background-color: ${POKEMON_COLORS[pokemon.types[0].type.name] ?? POKEMON_DEFAULT_COLOR}`"
    class="rounded-xl overflow-hidden cursor-pointer  appear p-4 relative h-[125px]" @click="go(pokemon.id)">
    <div class="flex flex-col items-start gap-2">
      <span class="text-white font-bold capitalize" ref="nameRef">{{ pokemon.name }}</span>
      <ul class="flex-col flex gap-2">
        <li ref="typesRef" class="bg-white/30 text-white px-2 text-sm rounded-xl" v-for="type in pokemon.types"
          :key="type.type.name">
          {{ type.type.name }}
        </li>
      </ul>
    </div>
    <div class="absolute  bottom-0 right-0 w-20 h-20 flex items-center justify-center">
      <Pokeball class="absolute w-24 h-24" />

      <img ref="imageRef" class="absolute w-20 h-20"
        :src="`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokemon.id.toString().padStart(3, '0')}.png`" />

    </div>
  </div>
</template>

<style>
.iii {}
</style>