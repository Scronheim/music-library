<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field label="Название" v-model="album.title"/>
          <v-select label="Год выпуска" :items="mainStore.years" v-model.number="album.year"/>
          <v-select :items="mainStore.genresList" v-model="album.genre"/>
          <v-text-field label="Изображение" v-model="album.pic"/>
        </v-col>
        <v-col>
          <template v-for="track in album.tracks" :key="track.title">
            <v-text-field :label="`Трек № ${track.number}`" v-model="track.title"/>
          </template>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
//========== IMPORTS ==========
import { useMainStore } from '@/stores/main'
//========== STORES ==========
const mainStore = useMainStore()
//========== COMPUTED ==========

//========== VARIABLES ==========
const props = defineProps({
  album: {
    type: Object,
    required: true,
    default: () => ({
      pic: '',
      title: '',
      tracks: [],
      year: 2022,
    })
  }
})
//========== METHODS ==========

//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
