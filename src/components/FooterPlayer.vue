<template>
  <v-footer app color="indigo">
    <v-card width="100%" color="indigo">
      <v-card-text class="pa-0">
        <v-progress-linear color="red" height="12" v-model="currentDuration" @click="seek">
          <template v-slot:default>
            <strong>{{ currentDurationInMinutes }}/{{ fullDurationInMinutes }}</strong>
          </template>
        </v-progress-linear>
      </v-card-text>
      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col align="start">
            <v-btn v-if="isPlaying" icon="mdi-pause" color="red" @click="stop"/>
            <v-btn v-else icon="mdi-play" color="success" @click="play"/>
          </v-col>
          <v-col align="center">
            <v-card-title>{{ mainStore.player.currentTrack.track.title }}</v-card-title>
            <p>{{ mainStore.player.currentTrack.artist }} - {{ mainStore.player.currentTrack.album.title }}</p>
          </v-col>
          <v-col align="end">
            <v-btn icon="mdi-shuffle-variant" color="primary"/>
            <v-btn icon="mdi-repeat" color="red" :variant="isLooping? 'tonal': 'plain'" @click="toggleLoop"/>
            <v-btn :icon="isMuting? 'mdi-volume-high': 'mdi-volume-off'" @click="toggleMute"/>
          </v-col>
          <v-col cols="2" align-self="end">
            <v-slider min="0" max="1" step="0.05" v-model="volume" @update:modelValue="changeVolume"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script setup>
//========== IMPORTS ==========
import { onMounted, ref, watch, computed } from 'vue'
import { Howl } from 'howler'
import { useMainStore } from '@/stores/main'
//========== STORES ==========
const mainStore = useMainStore()
//========== COMPUTED ==========
const currentDurationInMinutes = computed(() => {
  const m = Math.floor(currentDuration.value % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(currentDuration.value % 60).toString().padStart(2, '0')

  return m + ':' + s
})
const fullDurationInMinutes = computed(() => {
  const m = Math.floor(fullDuration.value % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(fullDuration.value % 60).toString().padStart(2, '0')

  return m + ':' + s
})
const isMuting = computed(() => {
  return player.value._muted
})
const isLooping = computed(() => {
  return player.value._loop
})
const isPlaying = computed(() => {
  return player.value.playing()
})
//========== VARIABLES ==========
let durationInterval = null
const currentDuration = ref(0)
const currentDurationPercent = ref(0)
const fullDuration = ref(0)
const volume = ref(0.5)
const player = ref(new Howl({
  src: [''],
}))
//========== METHODS ==========
const seek = (value, q) => {
  console.log(value, q)
}
const changeVolume = (volume) => {
  player.value.volume(volume)
}
const watchOnDuration = () => {
  if (durationInterval) clearInterval(durationInterval)
  durationInterval = setInterval(() => {
    currentDuration.value = player.value.seek()
    fullDuration.value = player.value._duration
    currentDurationPercent.value = (currentDuration.value / fullDuration.value) * 100
  }, 1000)
}
const toggleMute = () => {
  if (isMuting.value) {
    volume.value = 0.5
    player.value.mute(false)
  } else {
    volume.value = 0
    player.value.mute(true)
  }
}
const toggleLoop = () => {
  if (isLooping.value) {
    player.value.loop(false)
  } else {
    player.value.loop(true)
  }
}
const play = () => {
  player.value.play()
}
const stop = () => {
  player.value.pause()
}
//========== WATCH ==========
watch(() => mainStore.currentTrackSrc, (value) => {
  watchOnDuration()
  player.value.stop()
  player.value = new Howl({
    src: [value],
  })
  player.value.once('load', () => {
    player.value.play()
  })
  player.value.on('end', () => {
    console.log('track end')
  })
})
//========== ON MOUNTED ==========
onMounted(() => {

})
</script>

<style scoped>

</style>
