import { reactive, toRefs } from 'vue'

const lsKeys = {
  userFavorites: 'user.favorites',
  playerVolume: 'user.playerVolume',
  playerIsMuted: 'user.playerIsMuted',
  streamUrls: 'stream.urls',
  currStreamObj: 'stream.currObj'
}

const setLsItem = ( key, value ) => localStorage.setItem(key, JSON.stringify(value))
const getLsItem = key => { try { return JSON.parse(localStorage.getItem(key)) } catch (_) { return undefined } }

const store = reactive({
  searchViewOpened: false,
  playerIsStopped: true,
  playerIsMuted: false, // If user clicks volume button, the volume is still preserved in "playerVolume" but the <audio> gets set to muted="true".
  playerVolume: 100,
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
    let items = getLsItem(lsKeys.userFavorites)
    if (!items) {
      items = []; setLsItem(lsKeys.userFavorites, [])
    }
    store.userFavorites = items
  }
  const addUserFavorite = newItem => {
    store.userFavorites.push(newItem)
    setLsItem(lsKeys.userFavorites, store.userFavorites)
  }
  const removeUserFavorite = id => {
    const index = store.userFavorites.findIndex(item => item.id === id)
    if (index === undefined)
      return 
    store.userFavorites.splice(index, 1)

    setLsItem(lsKeys.userFavorites, store.userFavorites)
  }


  // ------
  // "streamUrls"
  // ------
  const syncStreamUrls = () => {
    let urls = getLsItem(lsKeys.streamUrls)
    if (!urls) {
      urls = []; setLsItem(lsKeys.streamUrls, urls)
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

      setLsItem(lsKeys.streamUrls, store.streamUrls)

      return url
    } catch (error) {
      console.error(error)
    }
  }


  // ------
  // "currStreamObj"
  // ------
  const syncCurrStreamObj = () => {
    let obj = getLsItem(lsKeys.currStreamObj)
    if (!obj) {
      obj = null; setLsItem(lsKeys.currStreamObj, obj)

      // Navigate user to search view.
      setSearchViewOpened(true)
    }
    
    store.currStreamObj = obj
  }
  const setCurrStreamObj = newObj => {
    store.currStreamObj = newObj
    setLsItem(lsKeys.currStreamObj, store.currStreamObj)
  }


  // ------
  // "playerVolume"
  // ------
  const syncPlayerVolume = () => {
    let vol = getLsItem(lsKeys.playerVolume)
    if (typeof vol !== 'number') {
      vol = 100; setLsItem(lsKeys.playerVolume, vol)
    }
    store.playerVolume = vol
  }
  const setPlayerVolume = newVal => {
    newVal = Math.min(Math.max(parseInt(newVal), 0), 100) // limit between 0 and 100
    store.playerVolume = newVal
    setLsItem(lsKeys.playerVolume, store.playerVolume)
  }


  // ------
  // "playerIsMuted"
  // ------
  const syncPlayerIsMuted = () => {
    let isMuted = getLsItem(lsKeys.playerIsMuted)
    if (typeof isMuted !== 'boolean') {
      isMuted = false; setLsItem(lsKeys.playerIsMuted, isMuted)
    }
    store.playerIsMuted = isMuted
  }
  const setPlayerIsMuted = newVal => {
    store.playerIsMuted = newVal
    setLsItem(lsKeys.playerIsMuted, newVal)
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
    setCurrStreamObj,

    syncPlayerVolume,
    setPlayerVolume,

    syncPlayerIsMuted,
    setPlayerIsMuted
  }
}