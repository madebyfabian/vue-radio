<template>
  <div class="View View-Search">
    <BaseLink class="searchOpenLink" iconLeft @click="setSearchViewOpened(false)">Back</BaseLink>  
    <SearchInput v-model="inputVal" />

    <section v-if="!searchResults || !inputVal">
      <p v-if="userFavorites.length" class="sectionHeadline isSmall isUppercase" v-text="`Your Favorites`" />
      <RadioStationItem v-for="item of userFavorites" :key="item.id" :item="item" />
    </section>

    <section v-else>
      <p v-if="searchResults.length" class="sectionHeadline isSmall isUppercase" v-text="`Search Results`" />
      <RadioStationItem v-for="item of searchResults" :key="item.id" :item="item" />
    </section>
  </div>
</template>

<script>
  import { computed, ref, onMounted, watch } from 'vue'
  import useStore from '@/store'
  import BaseLink from '@/components/BaseLink'
  import SearchInput from '@/components/SearchInput'
  import RadioStationItem from '@/components/RadioStationItem'

  let controller = new AbortController(),
      usedAbortController = false
  
  export default {
    components: { BaseLink, SearchInput, RadioStationItem },

    setup() {
      const { userFavorites, setSearchViewOpened, proxyUrl } = useStore()
      const inputVal = ref('')

      const searchResults = ref(null)

      const getStations = async newVal => {
        // if the current AbortController has been used before, abort the pending request and reset it
        if (usedAbortController) {
          controller.abort()

          // reset AbortController
          controller = new AbortController() 
        }

        usedAbortController = true

        if (!newVal)
          return

        const params = new URLSearchParams({ 
          itemUrlScheme: 'secure', 
          fullTextSearch: true, 
          query: newVal
        })
        
        try {
          const res = await fetch(proxyUrl.value + '/https://api.tunein.com/profiles?' + params.toString(), { signal: controller.signal })
          let data = await res.json()
          data = data?.Items?.[0]?.Children
          if (!data)
            return

          // Transform search results.
          searchResults.value = data.map(item => ({
            id: item.GuideId,
            title: item.Title,
            subtitle: item.Subtitle,
            description: item.Description,
            image: item.Image
          }))
        } catch (_) {}
      }
      watch(inputVal, getStations)

      return { setSearchViewOpened, inputVal, searchResults, userFavorites }
    }
  }
</script>

<style lang="scss" scoped>
  .View-Search {
    min-height: 100vh;
    background: var(--color-bg-primary);
    overflow-y: scroll;
  }

  .SearchInput {
    margin: 1.5rem 0 2.5rem;
  }

  .sectionHeadline {
    color: var(--color-content-secondary);
    margin-bottom: .5rem;
  }
</style>