<template>
  <div class="SearchInput">
    <Icon name="search" />
    <input 
      placeholder="Search for any station"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script>
  import { ref } from 'vue'
  import Icon from '@/components/Icon'

  export default {
    props: [ 'modelValue' ],

    components: { Icon }
  }
</script>

<style lang="scss" scoped>
  .SearchInput {
    display: flex;
    align-items: center;
    position: relative;

    input {
      height: 3rem;
      appearance: none;
      background: none;
      width: 100%;
      padding: 0 .75rem 0 3rem;
      border-radius: .5rem;
      border: 2px solid var(--color-bg-secondary);
      font: inherit;
      color: var(--color-content-primary);

      &::placeholder {
        color: var(--color-content-tertiary);
      }
    }

    .Icon {
      position: absolute;
      margin-left: .75rem;
      color: var(--color-content-tertiary);
    }
  }
</style>