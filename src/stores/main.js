import { defineStore } from 'pinia'
// import { useToast } from 'vue-toastification'

// const toast = useToast()

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () => ({
    collection: [],
    countries: ['США', 'Испания', 'Германия', 'Израиль'],
    player: {
      queue: [],
      currentTrack: {
        artist: '',
        album: {},
        track: {},
      }
    },
    genresList: ['Rap', 'Black Metal', 'Death Metal', 'Atmospheric Death Metal', 'Oriental Metal', 'Thrash Metal'],
  }),
  actions: {
    //=========================== GET ===========================
    async getCollection() {
      this.collection = await window.api.send('getCollection')
    },
    async saveCollection() {
      await window.api.send('saveCollection', JSON.stringify(this.collection))
    }
  },
  getters: {
    currentTrackInQueue: state => state.player.queue[0] || {},
    currentTrackSrc: (state) => {
      return state.player.currentTrack.track?.path ? `file://${state.player.currentTrack.track.path}` : ''
    },
    years: () => {
      const start = new Date().getFullYear()
      const stop = start - 50
      const step = -1
      return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
    }
  }
})
