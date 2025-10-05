<template>
  <div id="app">
    <AppNavigation />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNavigation from './components/AppNavigation.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppNavigation,
  },
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* Общие стили для кнопок */
button {
  font-family: inherit;
}

/* Убираем стандартные стили для ссылок */
a {
  color: inherit;
  text-decoration: none;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
