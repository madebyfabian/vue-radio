<template>
  <article class="RadioStationItem" :data-id="item.id" @click="handleClick">
    <div class="RadioStationItem-image" role="image" :style="{ backgroundImage: item.image && `url('${ item.image }')` }">
      <div class="iconOverlay">
        <Icon name="play" />
      </div>
    </div>
    <div class="RadioStationItem-content">
      <h2>{{ item.title }}</h2>
      <p class="isSmall">{{ item.subtitle || '' }}</p>
    </div>

    <IconButton :item="item" displayFavoriteState />
  </article>
</template>

<script>
  import { computed } from 'vue'
  import useStore from '@/store'

  import Icon from '@/components/Icon'
  import IconButton from '@/components/IconButton'

  export default {
    props: {
      item: { type: Object, required: true }
    },

    components: { Icon, IconButton },

    setup( props ) {
      const { setCurrStreamObj } = useStore()

      // Play stream.
      const handleClick = async () => {
        setCurrStreamObj(props.item)
      }

      return { handleClick }
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
        opacity: 1;
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

    .IconButton {
      position: absolute;
      right: 1.5rem;
      margin-left: -1.5rem;
    }
  }
</style>