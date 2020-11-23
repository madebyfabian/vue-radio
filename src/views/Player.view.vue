<template>
  <div class="View View-Player">
    <section class="player-wrap">
      <div class="player" v-if="currStreamObj">
        <div class="player-image" role="image" :style="{ backgroundImage: currStreamObj.image && `url('${ currStreamObj.image }')` }" />

        <h2>{{ currStreamObj.title }}</h2>

        <div class="player-buttonBar">
          <!-- Lautstärke -->
          <button class="player-button player-button-secondary">
            <div><Icon name="heart" /></div>
          </button>

          <button class="player-button" @click="handleButtonClick">
            <div v-if="playerIsStopped"><Icon name="play-solid" /></div>
            <div v-else><Icon name="pause" /></div>
          </button>

          <!-- Heart -->
          <button class="player-button player-button-secondary">
            <div><Icon name="heart" /></div>
          </button>
        </div>

        <!-- <audio ref="audio" :src="audioSrc" autoplay /> -->
      </div>
    </section>
    
    <BaseLink class="selectStationLink" iconRight @click="setSearchViewOpened(true)">Select another station</BaseLink>
  </div>
</template>

<script>
  import { computed, watch, ref, onMounted } from 'vue'
  import useStore from '@/store'
  import BaseLink from '@/components/BaseLink'
  import Icon from '@/components/Icon'
  
  export default {
    components: { BaseLink, Icon },

    setup() {
      // Refs
      const { 
        playerIsStopped, setPlayerIsStopped, 
        setSearchViewOpened,
        streamUrls, addStreamUrl, 
        currStreamObj
      } = useStore()

      const audioSrc = ref(null)
      
      const handleButtonClick = () => {
        setPlayerIsStopped(playerIsStopped.value ? false : true)
      }

      watch(currStreamObj, async newItem => {
        // Set new stream. First, check if stream url is loaded.
        const urlData = streamUrls.value.find(item => item.id === newItem.id)
        let url = urlData?.url
        if (!url) 
          // No url found. Fetch it and add it to the data array.
          url = await addStreamUrl(newItem.id)

        audioSrc.value = url
      })

      return { 
        playerIsStopped, 
        setPlayerIsStopped, 
        setSearchViewOpened, 
        handleButtonClick, 
        audioSrc,
        currStreamObj
      }
    }
  }
</script>

<style lang="scss" scoped>
  .View-Player {
    height: 100vh;
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
      background-size: cover;
      background-position: center center;
    }

    &-buttonBar {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-button {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem .25rem 0;
      appearance: none;
      border: none;
      outline: none;
      color: var(--color-bg-primary);
      background-color: var(--color-content-primary);
      cursor: pointer;
      transition: opacity 150ms ease;

      &:hover {
        opacity: .75;
      }

      .Icon {
        font-size: 2rem;
      }

      &-secondary {
        background: transparent;
        color: var(--color-content-tertiary);
      }
    }

    h2 {
      margin: 1rem 0 .5rem;
    }

    p {
      color: var(--color-content-secondary);
    }
  }

  .selectStationLink {
    color: var(--color-content-tertiary);

    &:hover {
      color: var(--color-content-secondary);
    }
  }
</style>