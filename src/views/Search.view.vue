<template>
  <div class="View View-Search">
    <BaseLink class="searchOpenLink" iconLeft @click="setSearchViewOpened(false)">Back</BaseLink>
    
    <h1>Search</h1>    
  </div>
</template>

<script>
  import { computed } from 'vue'
  import useStore from '@/store'
  import BaseLink from '@/components/BaseLink'
  
  export default {
    components: { BaseLink },

    setup() {
      const { setSearchViewOpened } = useStore()

      return { setSearchViewOpened }
    }
  }
</script>

<style lang="scss" scoped>
  .View-Search {
    min-height: 100vh;
    background: var(--color-bg-primary);
  }
</style>