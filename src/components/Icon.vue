<template>
  <div class="Icon" :class="{ isLarge }">
    <img class="Icon-svg" v-svg-inline  :src="iconSrc" :alt="name">
  </div>
</template>

<script>
  import { computed } from 'vue'
  
  export default {
    props: {
      name: { type: String, required: true, validator: val => val.length },
      isLarge: { type: Boolean, default: false }
    },

    setup( props ) {
      const iconSrc = computed(() => require(`../assets/icons/icon-${props.name}.svg`))
      return { iconSrc }
    }
  }
</script>

<style lang="scss" scoped>
  .Icon {
    font-size: 1.5rem;
    height: 1em;
    width: 1em;
    display: table;

    &.isLarge {
      font-size: 2rem;
    }

    &-svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
</style>