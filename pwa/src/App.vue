<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NotesField from './components/NotesField.vue'
import Editor from 'primevue/editor';
// import SelectButton from 'primevue/selectbutton';




</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/logo.png" class="logo" alt="Readfx logo" />
    </a>
  </div>
  <!-- <b>Added items options</b> -->
  <SelectButton v-model="value" :options="options" optionLabel="name" multiple aria-labelledby="multiple" />
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
