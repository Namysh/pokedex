<script setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import PokemonCard from "@/components/PokemonCard.vue";
import { computed, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const getPokemons = (url = `https://pokeapi.co/api/v2/pokemon`) => {
  return fetch(url)
    .then((res) => res.json())
};

const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['pokemons'],
  queryFn: ({ pageParam }) => getPokemons(pageParam),
  getNextPageParam: (lastPage) => lastPage.next,
  staleTime: Infinity
})

const allPokemons = computed(() => data.value ? data.value.pages.flatMap(d => d.results) : [])

const loadMoreRef = ref()

const { stop } = useIntersectionObserver(
  loadMoreRef,
  ([{ isIntersecting }]) => isIntersecting && fetchNextPage()
)

onUnmounted(stop)
</script>

<template>
  <div class="p-4 flex flex-col">
    <span class="font-bold text-xl mb-8">
      Pokedex
    </span>
    <div class="grid grid-cols-2 gap-2">

      <PokemonCard v-for="(pokemon, index) in allPokemons" :url="pokemon.url" :key="pokemon.url"
        :style="`animation-delay: ${index < 20 ? Math.floor(index / 2) * 200 : 0}ms;`" class="slide-in h-[125px]">
      </PokemonCard>

      <svg ref="loadMoreRef" class="animate-spin h-6 w-6 text-black mx-auto col-span-2" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>

    </div>

  </div>
</template>

<style scoped>
.slide-in {
  animation: slide-in 400ms ease-in-out forwards;
  opacity: 0;
}

@keyframes slide-in {
  0% {
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
