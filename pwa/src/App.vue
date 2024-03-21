<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NotesField from './components/NotesField.vue'
import Editor from 'primevue/editor';

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/logo.png" class="logo" alt="Readfx logo" />
    </a>
  </div>
  <HelloWorld msg="Component base" />
  <NotesField msg="Notes base" />
  <Editor v-model="value" editorStyle="height: 320px" />

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
