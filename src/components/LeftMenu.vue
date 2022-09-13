<template>
  <v-list nav active-color="primary">
    <v-list-item v-for="item in menu" link
                 :prepend-icon="item.icon"
                 :title="item.title"
                 :to="item.to"
                 :value="item.value"
                 :key="item.value"/>
  </v-list>
</template>

<script setup>
const menu = [
  // { title: 'Главная', to: '/', icon: 'mdi-home', value: 'home' },
  { title: 'Коллекция', to: '/', icon: 'mdi-format-list-bulleted-square', value: 'collection' },
]
</script>

<style scoped>

</style>
