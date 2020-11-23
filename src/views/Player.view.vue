<template>
  <div class="View View-Player">
    <section class="player-wrap">
      <div class="player" v-if="currStreamObj">
        <div class="player-image" role="image" :style="{ backgroundImage: currStreamObj.image && `url('${ currStreamObj.image }')` }" />

        <p class="isUppercase">Now playing</p>
        <h2>{{ currStreamObj.title }}</h2>

        <div style="background: green; width: 40px; height: 120px; display: flex; align-items: center; justify-content: center">
          <SliderInput v-model="playerVolume" min="0" max="100" />
        </div>

        <div class="player-buttonBar">
          <IconButton isLarge>
            <Icon isLarge name="arrow" />
          </IconButton>

          <IconButton @click="handleStopButtonClick" isLarge isPrimary>
            <div v-if="!playerIsLoading">
              <div v-if="playerIsStopped"><Icon isLarge name="play" /></div>
              <div v-else><Icon isLarge name="pause" /></div>
            </div>
            <div v-else>
              ...
            </div>
          </IconButton>

          <IconButton :item="currStreamObj" displayFavoriteState isLarge />
        </div>
      </div>
    </section>
    
    <BaseLink class="selectStationLink" iconRight @click="setSearchViewOpened(true)">Select another station</BaseLink>

    <audio 
      ref="audioEl" 
      :src="audioSrc" 
      :muted="playerIsStopped"
      autoplay 
      @loadstart="playerIsLoading = true" 
      @loadeddata="playerIsLoading = false" 
    />
  </div>
</template>

<script>
  import { computed, watch, ref, onMounted } from 'vue'
  import useStore from '@/store'
  import BaseLink from '@/components/BaseLink'
  import IconButton from '@/components/IconButton'
  import Icon from '@/components/Icon'
  import SliderInput from '@/components/SliderInput'
  
  export default {
    components: { BaseLink, Icon, IconButton, SliderInput },

    setup() {
      // Refs
      const { 
        playerIsStopped, setPlayerIsStopped, 
        setSearchViewOpened,
        streamUrls, addStreamUrl, 
        currStreamObj
      } = useStore()

      const audioSrc = ref(null),
            audioEl = ref(null),
            playerIsLoading = ref(false),
            playerVolume = ref(40)
      
      const handleStopButtonClick = () => {
        let newVal = playerIsStopped.value ? false : true
        setPlayerIsStopped(newVal)
      }

      onMounted(() => {
        const $audio = audioEl.value

        $audio.volume = .2

        setTimeout(() => $audio.volume = 1, 5000)

        watch(currStreamObj, async newItem => {
          // Set new stream. First, check if stream url is loaded.
          const urlData = streamUrls.value.find(item => item.id === newItem.id)
          let url = urlData?.url
          if (!url) 
            // No url found. Fetch it and add it to the data array.
            url = await addStreamUrl(newItem.id)

          audioSrc.value = url
        })
      })

      return { 
        playerIsLoading,
        playerIsStopped, 
        playerVolume,
        setPlayerIsStopped, 
        setSearchViewOpened, 
        handleStopButtonClick, 
        audioSrc,
        audioEl,
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