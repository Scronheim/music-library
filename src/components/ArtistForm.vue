<template>
  <v-card>
    <v-card-title>
      Редактирование группы {{ artist.artist }}
    </v-card-title>
    <v-card-text>
      <v-text-field label="Название" v-model="artist.artist"/>
      <v-select label="Страна" :items="mainStore.countries" v-model="artist.country"/>
      <v-select label="Жанр" :items="mainStore.genresList" multiple v-model="artist.genres"/>
      <v-text-field label="Фото" v-model="artist.pic"/>
      <v-divider/>
      <v-card-title>Альбомы</v-card-title>
      <v-list>
        <v-list-item nav v-for="album in artist.albums"
                     :value="album.title"
                     :key="album.title"
                     link active-color="primary"
                     @click="setCurrentAlbum(album)"
        >
          {{ album.title }}
        </v-list-item>
      </v-list>
      <AlbumForm v-if="currentAlbum.title !== undefined" :album="currentAlbum"/>
    </v-card-text>
  </v-card>
</template>

<script setup>
//========== IMPORTS ==========
import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import AlbumForm from '@/components/AlbumForm'
//========== STORES ==========
const mainStore = useMainStore()
//========== COMPUTED ==========

//========== VARIABLES ==========
const currentAlbum = ref({
  pic: ''
})
const props = defineProps({
  artist: {
    type: Object,
    required: true,
    default: () => ({
      artist: '',
      albums: [],
      country: ''
    })
  }
})
//========== METHODS ==========
const setCurrentAlbum = (album) => {
  currentAlbum.value = album
}
//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
