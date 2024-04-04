import {Button} from 'primevue/button';

<!-- <script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script> -->

<template>
  <!-- <h1>{{ msg }}</h1> -->

  <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div> -->



  <p>
    <br>
    <button class="button-options" onclick="alert('Invoked Sync Notes')">Sync Notes!</button>
    <button class="button-options" onclick="alert('Invoke Summarize')">Summarize!</button>
    <br>
    <!-- <button class="button-options" onclick="alert('Invoked Settings')">Settings</button> -->
    <button class="button-options" onclick="alert('Invoked Reports')">Reports</button>
    <button class="button-options" onclick="alert('Invoked Links')">Links</button>
    <button class="button-options" onclick="alert('Invoked Booksmarks')">Bookmarks</button>

    <!-- <button class="btn">
      <template>Save</template>
    </button> -->


  </p>
</template>

<style scoped>

.button-options{
  background-color: rgb(154, 208, 138);
  margin: 5px;
}

.read-the-docs {
  color: #888;
}
</style>
