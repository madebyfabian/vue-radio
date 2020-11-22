import { reactive, toRefs } from 'vue'


const store = reactive({
  searchViewOpened: false,
  playerIsStopped: false
})


export default function useStore() {
  const setSearchViewOpened = val => {
    store.searchViewOpened = val
  }

  const setPlayerIsStopped = val => {
    store.playerIsStopped = val
  }

  return {
    ...toRefs(store),
    setSearchViewOpened,
    setPlayerIsStopped
  }
}