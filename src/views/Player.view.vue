<template>
  <div class="View View-Player">
    <section class="player-wrap">
      <div class="player" v-if="currStreamObj">
        <div class="player-image" role="image" :style="{ backgroundImage: currStreamObj.image && `url('${ currStreamObj.image }')` }" />

        <p class="isUppercase">Now playing</p>
        <h2>{{ currStreamObj.title }}</h2>

        <div class="player-buttonBar">
          <IconButton isLarge>
            <Icon isLarge name="arrow" />
          </IconButton>

          <IconButton @click="handleStopButtonClick" isLarge isPrimary>
            <div v-if="playerIsStopped"><Icon isLarge name="play" /></div>
            <div v-else><Icon isLarge name="pause" /></div>
          </IconButton>

          <IconButton :item="currStreamObj" displayFavoriteState isLarge />
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
  import IconButton from '@/components/IconButton'
  import Icon from '@/components/Icon'
  
  export default {
    components: { BaseLink, Icon, IconButton },

    setup() {
      // Refs
      const { 
        playerIsStopped, setPlayerIsStopped, 
        setSearchViewOpened,
        streamUrls, addStreamUrl, 
        currStreamObj
      } = useStore()

      const audioSrc = ref(null)
      
      const handleStopButtonClick = () => {
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
        handleStopButtonClick, 
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
      margin: 0 auto 1.5rem;
      background-color: white;
      background-size: cover;
      background-position: center center;
    }

    p {
      color: var(--color-content-secondary);
      margin-bottom: .5rem;
    }

    h2 {
      margin-bottom: 2rem;
    }

    &-buttonBar {
      display: flex;
      align-items: center;
      justify-content: center;

      .IconButton {
        margin: 0 .25rem 0;
      }
    }
  }

  .selectStationLink {
    color: var(--color-content-tertiary);

    &:hover {
      color: var(--color-content-secondary);
    }
  }
</style>