import { reactive, toRefs } from 'vue'

// ------------
// Utils
// ------------
const lsKeys = {
  userFavorites: 'user.favorites',
  streamUrls: 'streamUrls',
  currStreamObj: 'currStreamObj'
}

const localStorageSet = ( key, value ) => {
  value = JSON.stringify(value)
  localStorage.setItem(key, value)
}

const localStorageGet = key => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (_) {
    return undefined
  }
}



// ------------
// Exports
// ------------
const store = reactive({
  searchViewOpened: false,
  playerIsStopped: true,
  userFavorites: [],
  streamUrls: [],
  currStreamObj: null
})

export default function useStore() {
  const setSearchViewOpened = val => store.searchViewOpened = val
  const setPlayerIsStopped = val => store.playerIsStopped = val


  // ------
  // "userFavorites"
  // ------
  const syncUserFavorites = () => {
    let items = localStorageGet(lsKeys.userFavorites)
    if (!items) {
      items = []; localStorageSet(lsKeys.userFavorites, [])
    }
    store.userFavorites = items
  }
  const addUserFavorite = newItem => {
    store.userFavorites.push(newItem)
    localStorageSet(lsKeys.userFavorites, store.userFavorites)
  }
  const removeUserFavorite = id => {
    const index = store.userFavorites.findIndex(item => item.id === id)
    if (index === undefined)
      return 
    store.userFavorites.splice(index, 1)

    localStorageSet(lsKeys.userFavorites, store.userFavorites)
  }


  // ------
  // "streamUrls"
  // ------
  const syncStreamUrls = () => {
    let urls = localStorageGet(lsKeys.streamUrls)
    if (!urls) {
      urls = []; localStorageSet(lsKeys.streamUrls, urls)
    }
    store.streamUrls = urls
  }
  const addStreamUrl = async id => {
    // Fetches the streaming URl for a given id and attaches it to the item saved in localstorage/store.
    const index = store.streamUrls.findIndex(item => item.id === id)
    if (!index)
      return

    try {
      const params = new URLSearchParams({ render: 'json', id })
      const res = await fetch('https://cors-anywhere.herokuapp.com/https://opml.radiotime.com/Tune.ashx?' + params.toString())
      let data = await res.json()
      let url = data?.body?.[0].url
      if (!url)
        return

      store.streamUrls.push({ id, url })

      localStorageSet(lsKeys.streamUrls, store.streamUrls)

      return url
    } catch (error) {
      console.error(error)
    }
  }


  // ------
  // "currStreamObj"
  // ------
  const syncCurrStreamObj = () => {
    let obj = localStorageGet(lsKeys.currStreamObj)
    if (!obj) {
      obj = null; localStorageSet(lsKeys.currStreamObj, obj)
    }
    store.currStreamObj = obj
  }
  const setCurrStreamObj = newObj => {
    store.currStreamObj = newObj
    localStorageSet(lsKeys.currStreamObj, store.currStreamObj)
  }


  return {
    ...toRefs(store),
    setSearchViewOpened,
    setPlayerIsStopped,

    syncUserFavorites,
    addUserFavorite,
    removeUserFavorite,

    syncStreamUrls,
    addStreamUrl,
    
    syncCurrStreamObj,
    setCurrStreamObj
  }
}