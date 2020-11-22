<template>
  <div class="BaseLink copy" role="link">
    <Icon v-if="iconLeft" class="isLeft" name="arrow" />
    <slot />
    <Icon v-if="iconRight" class="isRight" name="arrow" />
  </div>
</template>

<script>
  import Icon from '@/components/Icon'

  export default {
    components: { Icon },

    props: {
      iconLeft: { type: Boolean, default: false },
      iconRight: { type: Boolean, default: null }
    }
  }
</script>

<style lang="scss" scoped>
  .BaseLink {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: var(--color-content-secondary);
    transition: color 150ms ease;
    margin: 0 auto;

    &:hover {
      color: var(--color-content-primary);
    }

    .Icon {
      &.isLeft {
        transform: rotate(90deg);
        margin: 0 .125rem 0 -.5rem;
      }

      &.isRight {
        transform: rotate(-90deg);
        margin: 0 -.5rem 0 .125rem;
      }
    }
  }
</style>