<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-btn @click="selectFolderToParse">Выбрать папку</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
//========== IMPORTS ==========

//========== STORES ==========

//========== COMPUTED ==========

//========== VARIABLES ==========

//========== METHODS ==========
const selectFolderToParse = () => {
  window.api.send('openFolderDialog')
}
//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
