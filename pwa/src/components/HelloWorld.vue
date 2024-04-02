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
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">Source</a> Readfx: readabilty companion app
    <br>
    <button type="button" onclick="alert('Hello world!')">Sync Notes!</button>
    <button type="button" onclick="alert('Hello world!')">Summarize!</button>
    <br>
    <button type="button" onclick="alert('Hello world!')">Options 1</button>
    <button type="button" onclick="alert('Hello world!')">Options 2</button>
    <button type="button" onclick="alert('Hello world!')">Options 3</button>
    <button type="button" onclick="alert('Hello world!')">Options 4</button>

    <!-- <button class="btn">
      <template>Save</template>
    </button> -->


  </p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
