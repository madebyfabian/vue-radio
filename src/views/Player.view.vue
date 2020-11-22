<template>
  <div class="View View-Player">
    <section class="player-wrap">
      <div class="player">
        <div class="player-image" />
        <button class="player-button">
          <Icon v-if="playerIsStopped" name="play-solid" />
          <Icon v-else name="stop-solid" />
        </button>

        {{ playerIsStopped }}

        <h1>Station</h1>
        <p>Description</p>
      </div>
    </section>
    
    <BaseLink iconRight @click="setSearchViewOpened(true)">Select another station</BaseLink>
  </div>
</template>

<script>
  import { computed, watch } from 'vue'
  import useStore from '@/store'
  import BaseLink from '@/components/BaseLink'
  import Icon from '@/components/Icon'
  
  export default {
    components: { BaseLink, Icon },

    setup() {
      const { playerIsStopped, setSearchViewOpened, setPlayerIsStopped } = useStore()

      setTimeout(() => {
        setPlayerIsStopped(true)
      }, 2000)

      watch(playerIsStopped, ( newVal, oldVal ) => {
        console.log(oldVal, newVal)
      })

      return { playerIsStopped, setSearchViewOpened, setPlayerIsStopped }
    }
  }
</script>

<style lang="scss" scoped>
  .View-Player {
    height: 100vh;
    background: rgba(red, .1);
    display: grid;
    grid-template-rows: 1fr min-content;
  }

  .player-wrap {
    padding-bottom: var(--spacing-view-y);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .player {
    text-align: center;

    &-image {
      height: 7.5rem;
      width: 7.5rem;
      border-radius: 1.25rem;
      margin: 0 auto;
      background-color: white;
    }

    h1 {
      margin: 1.5rem 0 .5rem;
    }

    p {
      color: var(--color-content-secondary);
    }
  }
</style>