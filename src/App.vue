<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <LeftMenu/>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>

    <FooterPlayer/>
  </v-app>
</template>

<script setup>
//========== IMPORTS ==========
import { onMounted, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import LeftMenu from '@/components/LeftMenu'
import FooterPlayer from '@/components/FooterPlayer'
//========== STORES ==========
const mainStore = useMainStore()
//========== WATCH ==========
watch(() => mainStore.collection, () => {
  mainStore.saveCollection()
}, { deep: true })
//========== ON MOUNTED ==========
onMounted(() => {
  mainStore.getCollection()
})
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
.v-dialog .v-overlay__content {
  width: 100%;
}
</style>
