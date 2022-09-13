<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-btn icon="mdi-arrow-left" @click="router.go(-1)"/>
        {{ artist.artist }}
        <v-btn icon="mdi-pencil" color="info" @click="editArtistDialog = true"/>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img :src="artist.pic"/>
          </v-col>
          <v-col>
            <v-list>
              <v-list-item title="Название">
                <b>{{ artist.artist }}</b>
              </v-list-item>
              <v-list-item title="Страна">
                <b>{{ artist.country }}</b>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row v-for="(chunk, index) in chunkedAlbums" :key="`chunk${index}`" class="mt-3">
      <v-col v-for="album in chunk" cols="4" :key="album.title">
        <v-card elevation="5" @click="goToAlbumPage(album)">
          <v-card-title>
            {{ album.title }} ({{ album.year }})
          </v-card-title>
          <v-card-text>
            <v-img :src="album.pic"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog fullscreen v-model="editArtistDialog">
      <ArtistForm :artist="artist"/>
    </v-dialog>
  </v-container>
</template>

<script setup>
//========== IMPORTS ==========
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { chunk } from 'lodash'
import ArtistForm from '@/components/ArtistForm'
//========== STORES ==========
const mainStore = useMainStore()
//========== COMPUTED ==========
const artist = computed(() => {
  return Object.values(mainStore.collection).find(a => a.slug === route.params.artist)
})
const chunkedAlbums = computed(() => {
  return chunk(artist.value.albums, 3)
})
//========== VARIABLES ==========
const route = useRoute()
const router = useRouter()
const editArtistDialog = ref(false)
//========== METHODS ==========
const goToAlbumPage = (album) => {
  router.push(`/collection/${artist.value.slug}/${album.slug}`)
}
//========== ON MOUNTED ==========
onMounted(() => {

})
</script>

<style scoped>

</style>
