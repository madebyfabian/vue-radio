<template>
  <button class="IconButton" :class="{ isLarge, isPrimary }" @click="handleClick">
    <div v-if="displayFavoriteState" class="IconButton-favoriteWrap" :class="{ isActive: isFavorite }">
      <div class="isRegular"><Icon :isLarge="isLarge" name="heart" /></div>
      <div class="isSolid"><Icon :isLarge="isLarge" name="heart-solid" /></div>
    </div>

    <slot />
  </button>
</template>

<script>
  import { computed, watch } from 'vue'
  import useIsFavorite from '@/hooks/useIsFavorite'
  import useStore from '@/store'

  import Icon from '@/components/Icon'

  export default {
    props: {
      isLarge: { type: Boolean, default: false },
      isPrimary: { type: Boolean, default: false },
      item: { type: Object, default: null },
      displayFavoriteState: { type: Boolean, default: false }
    },

    components: { Icon },

    setup( props ) {
      const { addUserFavorite, removeUserFavorite } = useStore()
      const { isFavorite } = useIsFavorite({ id: props?.item?.id })

      const handleClick = () => {
        if (props.displayFavoriteState) 
          isFavorite.value 
            ? removeUserFavorite(props?.item?.id) 
            : addUserFavorite(props?.item)
      }

      return { isFavorite, handleClick }
    }
  }
</script>

<style lang="scss" scoped>
  .IconButton {
    cursor: pointer;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    color: var(--color-content-tertiary);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 150ms ease;

    &:hover {
      opacity: .75
    }

    &.isPrimary {
      background: var(--color-content-primary);
      color: var(--color-bg-primary); 
    }

    &.isLarge {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 100%;

      .IconButton-favoriteWrap {
        height: 2rem;
        width: 2rem;
      }
    }

    &-favoriteWrap {
      position: relative;
      height: 1.5rem;
      width: 1.5rem;

      > div {
        position: absolute;
        left: 0;
        top: 0;
        transition: color 75ms ease, opacity 75ms ease;

        &.isRegular { opacity: 1 }
        &.isSolid { opacity: 0 }
      }

      &:hover > div {
        &.isRegular { opacity: 1 }
        &.isSolid { opacity: .33 }
      }

      &.isActive > div {
        // color: var(--color-content-secondary);

        &.isRegular { opacity: 0 }
        &.isSolid { opacity: 1 }
      }
    }
  }
</style>