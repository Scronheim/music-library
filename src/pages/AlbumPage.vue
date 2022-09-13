<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-btn icon="mdi-arrow-left" @click="router.go(-1)"/>
        {{ album.title }} ({{ album.year }})
        <v-btn icon="mdi-pencil" color="info" @click="editAlbumDialog = true"/>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img :src="album.pic"/>
          </v-col>
          <v-col>
            <v-list>
              <v-list-item title="Название">
                <b>{{ album.title }}</b>
              </v-list-item>
              <v-list-item title="Год выпуска">
                <b>{{ album.year }}</b>
              </v-list-item>
              <v-list-item title="Жанр">
                <b>{{ album.genre }}</b>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <v-text-field v-for="track in album.tracks"
                          :label="`Трек № ${track.number}`"
                          :key="track.number"
                          v-model="track.title">
              <template v-slot:prepend-inner>
                <v-btn icon="mdi-play" color="success" size="smaller" @click="playTrack(track)"/>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="editAlbumDialog">
      <AlbumForm :album="album"/>
    </v-dialog>
  </v-container>
</template>

<script setup>
//========== IMPORTS ==========
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import AlbumForm from '@/components/AlbumForm'
//========== STORES ==========
const mainStore = useMainStore()
//========== COMPUTED ==========
const artist = computed(() => {
  return Object.values(mainStore.collection).find(a => a.slug === route.params.artist)
})
const album = computed(() => {
  return artist.value.albums.find(a => a.slug === route.params.album)
})
//========== VARIABLES ==========
const route = useRoute()
const router = useRouter()
const editAlbumDialog = ref(false)
//========== METHODS ==========
const playTrack = (track) => {
  mainStore.player.currentTrack = {
    artist: artist.value.artist,
    album,
    track
  }
}
//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
