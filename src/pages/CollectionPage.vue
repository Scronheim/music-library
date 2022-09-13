<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Коллекция
        <v-btn icon="mdi-plus" color="success" @click="addToCollection"/>
        <v-btn icon="mdi-delete" color="error" @click="clearCollection"/>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="2">
            <v-select label="Жанр" :hide-details="true" :items="mainStore.genresList" v-model="filters.genre"/>
          </v-col>
          <v-col cols="2">
            <v-select label="Страна" :hide-details="true" :items="mainStore.countries" v-model="filters.country"/>
          </v-col>
          <v-col>
            <v-btn @click="clearFilters">Сбросить фильтры</v-btn>
<!--            <v-select label="Год" :hide-details="true" :items="mainStore.years" v-model.number="filters.year"/>-->
          </v-col>
        </v-row>
        <v-row v-for="(chunk, index) in chunkedCollection" :key="`chunk${index}`">
          <v-col v-for="(artist, artistIndex) in chunk" :key="`artist${artistIndex}`" cols="4">
            <v-hover v-slot="{isHovering, props}">
              <v-card elevation="5" color="#263238" rounded v-bind="props" @click.stop="goToArtistPage(artist)">
                <v-card-title>
                  {{ artist.artist }} ({{ artist.country }})
                  <v-btn v-show="isHovering" icon="mdi-pencil" color="info" @click.stop="openEditArtistDialog(artist)"/>
                  <v-btn v-show="isHovering" icon="mdi-delete" color="error" @click.stop="deleteArtistFromCollection(artist)"/>
                </v-card-title>
                <v-card-text>
                  <img :src="artist.pic" style="width: 100%; height: 100%"/>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="editArtistDialog" width="700">
      <ArtistForm :artist="currentArtist"/>
    </v-dialog>

    <v-overlay v-model="overlay"/>
  </v-container>
</template>

<script setup>
//========== IMPORTS ==========
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { chunk } from 'lodash'
import { useToast } from 'vue-toastification'
import { useMainStore } from '@/stores/main'
import ArtistForm from '@/components/ArtistForm'
//========== STORES ==========
const mainStore = useMainStore()
const toast = useToast()
//========== COMPUTED ==========
const chunkedCollection = computed(() => {
  let collection = mainStore.collection
  if (filters.value.genre) {
    collection = collection.filter(i => i.genres.includes(filters.value.genre))
  }
  if (filters.value.country) {
    collection = collection.filter(i => i.country === filters.value.country)
  }
  return chunk(collection, 3)
})
//========== VARIABLES ==========
const clearFilters = () => {
  filters.value = {
    genre: null,
    country: null,
    year: null,
  }
}
const overlay = ref(false)
const currentArtist = ref({})
const filters = ref({
  genre: null,
  country: null,
  year: null,
})
const editArtistDialog = ref(false)
const router = useRouter()
//========== METHODS ==========
const openEditArtistDialog = (artist) => {
  currentArtist.value = artist
  editArtistDialog.value = true
}
const deleteArtistFromCollection = (artist) => {
  const artistIndex = mainStore.collection.findIndex(a => a.slug === artist.slug)
  mainStore.collection.splice(artistIndex, 1)
}
const goToArtistPage = (artist) => {
  router.push(`/collection/${artist.slug}`)
}
const clearCollection = async () => {
  mainStore.collection = await window.api.send('clearCollection')
  toast.success('Коллекция очищена')
}
const addToCollection = async () => {
  overlay.value = true
  mainStore.collection = await window.api.send('openFolderDialog')
  overlay.value = false
  toast.success('Коллекция обновлена')
}
//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
