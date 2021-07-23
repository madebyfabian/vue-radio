import { reactive, ref, toRefs } from 'vue'

const lsKeys = {
  userFavorites: 'user.favorites',
  playerVolume: 'user.playerVolume',
  playerIsMuted: 'user.playerIsMuted',
  streamUrls: 'stream.urls',
  currStreamObj: 'stream.currObj'
}

const setLsItem = ( key, value ) => localStorage.setItem(key, JSON.stringify(value))
const getLsItem = key => { try { return JSON.parse(localStorage.getItem(key)) } catch (_) { return undefined } }

const lsIsSynced = ref(false)

const store = reactive({
  searchViewOpened: false,
  playerIsStopped: true,
  playerIsMuted: false, // If user clicks volume button, the volume is still preserved in "playerVolume" but the <audio> gets set to muted="true".
  playerVolume: 100,
  userFavorites: [],
  streamUrls: [],
  currStreamObj: null,
  proxyUrl: 'https://cors-anywhere-madebyfabian.herokuapp.com'
})

export default function useStore() {
  // Loop localStorage keys once to sync persisting localStorage into vue store.
  if (!lsIsSynced.value) {
    const storeDefaultValues = JSON.parse(JSON.stringify(store))

    for (const [ key, lsKey = value ] of Object.entries(lsKeys)) {
      const defaultVal = storeDefaultValues[key]
      let val = getLsItem(lsKey)
      if (!val) {
        val = defaultVal; 
        setLsItem(lsKey, defaultVal)
      }
      store[key] = val
    }

    lsIsSynced.value = true
  }


  const setSearchViewOpened = val => store.searchViewOpened = val


  const setPlayerIsStopped = val => store.playerIsStopped = val


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


  const addStreamUrl = async id => {
    // Fetches the streaming URl for a given id and attaches it to the item saved in localstorage/store.
    const index = store.streamUrls.findIndex(item => item.id === id)
    if (!index)
      return

    try {
      const params = new URLSearchParams({ render: 'json', id })
      const res = await fetch(store.proxyUrl + '/https://opml.radiotime.com/Tune.ashx?' + params.toString())
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


  const setCurrStreamObj = newObj => {
    store.currStreamObj = newObj
    setLsItem(lsKeys.currStreamObj, store.currStreamObj)
  }


  const setPlayerVolume = newVal => {
    newVal = Math.min(Math.max(parseInt(newVal), 0), 100) // limit between 0 and 100
    store.playerVolume = newVal
    setLsItem(lsKeys.playerVolume, store.playerVolume)
  }


  const setPlayerIsMuted = newVal => {
    store.playerIsMuted = newVal
    setLsItem(lsKeys.playerIsMuted, newVal)
  }


  return {
    ...toRefs(store),
    setSearchViewOpened,
    setPlayerIsStopped,
    addUserFavorite, removeUserFavorite,
    addStreamUrl,
    setCurrStreamObj,
    setPlayerVolume,
    setPlayerIsMuted
  }
}