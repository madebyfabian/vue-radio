<template>
  <div class="View View-Player">
    <section class="player-wrap">
      <div class="player" v-if="currStreamObj">
        <div class="player-image" role="image" :style="{ backgroundImage: currStreamObj.image && `url('${ currStreamObj.image }')` }" />

        <p class="isUppercase">Now playing</p>
        <h2>{{ currStreamObj.title }}</h2>

        <div class="player-buttonBar">
          <div class="volumeControl">
            <IconButton isLarge @click="handleMutePlayerClick">
              <Icon v-if="playerVolume === 0 || playerIsMuted" name="sound-0" isLarge />
              <Icon v-else-if="playerVolume <= 50" name="sound-50"  isLarge />
              <Icon v-else-if="playerVolume > 50"  name="sound-100" isLarge />
            </IconButton>
            <div class="volumeControl-bar">
              <SliderInput :value="!playerIsMuted ? playerVolume : 0" @update="handleVolumeSliderInput" min="0" max="100" />
            </div>
          </div>

          <IconButton @click="setPlayerIsStopped(!playerIsStopped)" isLarge isPrimary>
            <Icon v-if="!playerIsLoading && playerIsStopped"  name="play"  isLarge />
            <Icon v-if="!playerIsLoading && !playerIsStopped" name="pause" isLarge />
          
            <div v-if="playerIsLoading">...</div>
          </IconButton>

          <IconButton :item="currStreamObj" displayFavoriteState isLarge />
        </div>
      </div>
    </section>
    
    <BaseLink class="selectStationLink" iconRight @click="setSearchViewOpened(true)">Select another station</BaseLink>

    <audio 
      ref="audioEl" 
      :src="audioSrc" 
      :muted="playerIsStopped || playerIsMuted"
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
        playerIsMuted, setPlayerIsMuted,
        searchViewOpened, setSearchViewOpened,
        streamUrls, addStreamUrl, 
        currStreamObj,
        playerVolume, setPlayerVolume
      } = useStore()

      const audioSrc = ref(null),
            audioEl = ref(null),
            playerIsLoading = ref(false)

      // Handle user input update player volume with the slider
      const handleVolumeSliderInput = newVal => {
        // Unmute player, since user actively interacts with the slider, even if he muted before.
        setPlayerIsMuted(false)
        setPlayerVolume(newVal)
      }

      const handleMutePlayerClick = () => {
        // If user manually dragged the slider to 0, then this button will have (visually) no effect. So set the volume up a little.
        if (playerVolume.value === 0)
          setPlayerVolume(15)

        setPlayerIsMuted(!playerIsMuted.value)
      }
    
      onMounted(() => {
        // Set Audio Player volume.
        const $audio = audioEl.value
        watch(playerVolume, newVal => {
          $audio.volume = newVal / 100
          setPlayerIsMuted(newVal === 0)
        })

        // Set new stream. First, check if stream url is loaded.
        watch(currStreamObj, async newItem => {
          const urlData = streamUrls.value.find(item => item.id === newItem.id)
          let url = urlData?.url
          if (!url) 
            // No url found. Fetch it and add it to the data array.
            url = await addStreamUrl(newItem.id)

          audioSrc.value = url
          setTimeout(() => {
            setPlayerIsStopped(false)
          }, 100)
        }, { immediate: true })

        // Handle keyboard shortcut presses.
        window.addEventListener('keydown', e => {
          if (searchViewOpened.value)
            return

          let key = e.code.toUpperCase()
          switch (key) {
            case 'SPACE':
              playerIsStopped.value = !playerIsStopped.value
              break
          
            case 'ARROWUP':
              setPlayerVolume(playerVolume.value + 5)
              break

            case 'ARROWDOWN':
              setPlayerVolume(playerVolume.value - 5)
              break

            case 'KEYM':
              setPlayerIsMuted(!playerIsMuted.value)
              break
          }
        })
      })

      return { 
        playerIsLoading,
        playerIsStopped, 
        playerIsMuted,
        setPlayerIsMuted,
        setPlayerIsStopped,
        playerVolume,
        setPlayerVolume,
        setSearchViewOpened, 
        audioSrc,
        audioEl,
        currStreamObj,
        handleVolumeSliderInput,
        handleMutePlayerClick
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
      margin-bottom: 2.5rem;
    }

    &-buttonBar {
      display: flex;
      align-items: center;
      justify-content: center;

      > * {
        margin: 0 .375rem 0;
      }
    }

    .volumeControl {
      position: relative;

      &:hover .volumeControl-bar {
        opacity: 1;
        visibility: visible;
        transform: none;
      }

      &-bar {
        opacity: 0;
        visibility: hidden;
        background: var(--color-bg-secondary); 
        width: 2.5rem; 
        height: 7.5rem; 
        margin: 0 0 -.25rem .5rem;
        display: flex; 
        align-items: center; 
        justify-content: center;
        position: absolute;
        bottom: 100%;
        border-radius: .75rem;
        transition-property: opacity, visibility, transform;
        transition-duration: 150ms;
        transition-timing-function: ease;
        transform: translateY(.5rem);

        .SliderInput {
          position: absolute;
        }
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