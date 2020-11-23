<template>
  <article class="RadioStationItem" :data-id="item.id" @click="handleClick">
    <div class="RadioStationItem-image" role="image" :style="{ backgroundImage: item.image && `url('${ item.image }')` }">
      <div class="iconOverlay">
        <Icon name="play-solid" />
      </div>
    </div>
    <div class="RadioStationItem-content">
      <h2>{{ item.title }}</h2>
      <p class="isSmall">{{ item.subtitle || '' }}</p>
    </div>
    <button class="RadioStationItem-iconWrap" @click="handleFavoriteButtonClick">
      <div :class="{ isHidden: isFavorite }"><Icon name="heart" /></div>
      <div :class="{ isHidden: !isFavorite }"><Icon name="heart-solid" /></div>
    </button>
  </article>
</template>

<script>
  import useStore from '@/store'
  import Icon from '@/components/Icon'
  import { computed } from 'vue'

  export default {
    props: {
      item: { type: Object, required: true }
    },

    components: { Icon },

    setup( props ) {
      const { userFavorites, addUserFavorite, removeUserFavorite, streamUrls, addStreamUrl, setCurrStreamObj } = useStore()

      const isFavorite = computed(() => {
        return !!userFavorites?.value?.find(favoriteItem => favoriteItem?.id === props.item?.id)
      })

      const handleFavoriteButtonClick = () => {
        if (isFavorite.value)
          removeUserFavorite(props.item.id)
        else
          addUserFavorite(props.item)
      }

      /**
       * Play stream.
       */
      const handleClick = async () => {
        setCurrStreamObj(props.item)
      }

      return { isFavorite, handleFavoriteButtonClick, handleClick }
    }
  }
</script>

<style lang="scss" scoped>
  .RadioStationItem {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    margin: 0 -1.5rem;
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease;
    position: relative;

    &:last-child .RadioStationItem-content {
      border-bottom: none
    }

    &:hover {
      background-color: var(--color-bg-secondary);

      .RadioStationItem-image .iconOverlay {
        opacity: .75;
      }
    }

    
    &-image {
      height: 2.5rem;
      width: 2.5rem;
      flex-shrink: 0;
      align-self: flex-start;
      border-radius: .375rem;
      background-color: white;
      background-size: cover;
      background-position: center center;
      margin-top: .25rem;
      overflow: hidden;

      .iconOverlay {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        color: var(--color-content-primary);
        background: rgba(#000, .75);
        transition: opacity 150ms ease;
      }
    }

    &-content {
      flex: 1;
      border-bottom: 1px solid var(--color-bg-secondary);
      border-top: 1px solid transparent;
      padding: 1rem 2.5rem 1rem 0;
      margin: -1rem 0 -1rem 1rem;

      p {
        margin-top: .25rem;
        color: var(--color-content-secondary);
      }
    }

    &-iconWrap {
      position: absolute;
      right: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-left: -1.5rem;
      cursor: pointer;
      padding: 0;
      border: none;
      margin: 0;
      background: none;
      z-index: 10;
      color: var(--color-content-tertiary);

      &:hover {
        > div {
          &.isHidden {
            opacity: .33!important;
          }

          &:not(.isHidden) {
            opacity: 1!important;
          }
        }
      }

      > div {
        position: absolute;
        left: 0;
        top: 0;
        transition: opacity 150ms ease;

        &.isHidden {
          opacity: 0;
        }
      }
    }
  }
</style>