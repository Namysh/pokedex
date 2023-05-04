<script setup>
import { useQuery } from '@tanstack/vue-query'
import { nextTick, ref } from 'vue'
import Menu from "@/components/Menu.vue";
import Pokeball from "@/components/Pokeball.vue";
import { POKEMON_COLORS, POKEMON_DEFAULT_COLOR } from '@/constants'

const props = defineProps({
  id: Number
})

const url = `https://pokeapi.co/api/v2/pokemon/${props.id}/`

const { data: pokemon } = useQuery({
  queryKey: ['pokemon', url],
  queryFn: () => fetch(url).then((res) => res.json()),
  staleTime: Infinity
})

const menuCollapsed = ref(true)
const pokemonNameTopRef = ref()
const pokemonNameRef = ref()

const toggleName = async () => {
  if (!menuCollapsed.value) pokemonNameTopRef.value.style.viewTransitionName = 'pokemon-name';
  else pokemonNameRef.value.style.viewTransitionName = 'pokemon-name-top';

  document.startViewTransition(() => {
    if (!menuCollapsed.value) pokemonNameTopRef.value.style.viewTransitionName = '';
    else pokemonNameRef.value.style.viewTransitionName = '';
    menuCollapsed.value = !menuCollapsed.value
  });
}
</script>

<template>
  <div class="h-full w-full  relative overflow-hidden"
    :style="`background-color: ${POKEMON_COLORS[pokemon.types[0].type.name] ?? POKEMON_DEFAULT_COLOR}`">

    <div class="w-32 h-32 bg-white/20 absolute rotate-[80deg] -translate-x-6 pointer-events-none	 -translate-y-10">
    </div>

    <div class="absolute right-16 gap-2 grid grid-cols-5 grid-rows-3">
      <div v-for="_ in 3 * 5" class="h-[5px] w-[5px] rounded-full bg-white/20"></div>
    </div>

    <div class="p-4 flex flex-col pt-12" :class="{ 'h-1/2': menuCollapsed }">
      <div class="flex justify-between text-white">
        <svg @click="$router.push('/')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
        </svg>
        <span v-if="!menuCollapsed" ref="pokemonNameTopRef" class="text-white pokemon-name-top font-bold capitalize">
          {{ pokemon.name }}
        </span>
        <div class="relative flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <Pokeball v-if="!menuCollapsed" class="absolute w-32  h-32 animate-[spin_5000ms_linear_infinite]" />
        </div>
      </div>
      <div class="flex justify-between mt-4" v-if="menuCollapsed">
        <span ref="pokemonNameRef" class="text-white text-3xl pokemon-name font-bold capitalize">
          {{ pokemon.name }}
        </span>
        <span class="text-white slide-in"> #{{ pokemon.id.toString().padStart(3, '0') }} </span>
      </div>
      <div v-if="menuCollapsed" class="flex justify-between">
        <ul class="flex gap-2 types ">
          <li class="bg-white/50 text-white px-2 py-1 rounded-xl" v-for="(type, index) in pokemon.types"
            :key="type.type.name" :style="`view-transition-name: pokemon-type-${index}`">
            {{ type.type.name }}
          </li>
        </ul>
        <span class="text-white slide-in">{{ species?.genera?.[7].genus }}</span>
      </div>

    </div>
    <div class="relative z-10 flex  justify-center -translate-y-full mt-8 ">
      <Pokeball v-if="menuCollapsed" class="absolute w-52 h-52 animate-[spin_5000ms_linear_infinite]"></Pokeball>
      <img class="w-48 pokemon-image " v-if="menuCollapsed" :src="`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokemon.id
        .toString()
        .padStart(3, '0')}.png`" />
    </div>
    <Menu @click="toggleName" :class="!menuCollapsed ? 'translate-y-32' : 'translate-y-1/2'"
      class="absolute  menu transition-transform bottom-0 w-full h-full "
      :items="['About', 'Base stats', 'Evolution', 'Moves']">
      <template #about>
        <span class="select-none text-black/20 text-2xl">Click here to {{ menuCollapsed ? 'collapse' : 'expand' }}</span>
      </template>
      <template #base-stats>
      </template>
      <template #evolution>
      </template>
      <template #moves>
      </template>
    </Menu>

  </div>
</template>

<style>
.pokemon-image {
  view-transition-name: pokemon-image;
}

.types {
  view-transition-name: pokemon-types;
}

.menu {
  view-transition-name: menu;
}

::view-transition-old(menu),
::view-transition-new(menu) {
  animation: none;
  mix-blend-mode: normal;
}



@keyframes scale-to-zero {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(0);
  }
}

@keyframes scale-to-one {
  from {
    transform: scale(0.7);
  }

  to {
    transform: scale(1);
  }
}


::view-transition-old(pokemon-image) {
  animation-duration: 100ms;
}

::view-transition-new(pokemon-image) {
  animation: scale-to-one 500ms forwards;
  animation-duration: 100ms;

}

.pokemon-name-top {
  view-transition-name: pokemon-name-top;
}

.pokemon-name {
  view-transition-name: pokemon-name;
}

.slide-in {
  animation: slide-in 300ms ease-in-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
