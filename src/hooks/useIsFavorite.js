import { computed } from 'vue'
import useStore from '@/store'


/**
 * Returns true if the given id is inside our favorites.
 */
export default function useIsFavorite({ id }) {
  const { userFavorites } = useStore()

  const isFavorite = computed(() => {
    return !!userFavorites?.value?.find(favoriteItem => favoriteItem?.id === id)
  })

  return { isFavorite }
}

