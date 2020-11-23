<template>
  <main :class="{ searchViewOpened }">
    <Player />
    <transition name="show">
      <Search v-if="searchViewOpened" />
    </transition>
  </main>
</template>

<script>
  import { computed, onMounted } from 'vue'

  import '@/scss/main.scss'
  import useStore from '@/store'
  import Player from '@/views/Player.view'
  import Search from '@/views/Search.view'

  
  
  export default {
    name: 'App',
    components: { Player, Search },

    setup() {
      const { searchViewOpened, syncUserFavorites, syncStreamUrls, syncCurrStreamObj, syncPlayerVolume } = useStore()

      onMounted(() => {
        syncUserFavorites()
        syncStreamUrls(),
        syncCurrStreamObj(),
        syncPlayerVolume()
      })

      return { searchViewOpened }
    }
  }
</script>

<style lang="scss" scoped>
  .View-Player, .View-Search {
    transition: transform 300ms cubic-bezier(0.65, 0, 0.35, 1);
  }

  .View-Player {
    transform: none;
  }

  main.searchViewOpened .View-Player {
    transform: translateX(-50%);
  }
  

  .View-Search {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(0);
  }

  .show-enter-from,
  .show-leave-to {
    transform: translateX(100%);
  }


  button {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 999999;
  }
</style>