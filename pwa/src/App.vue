<script setup>
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Options from './components/Options.vue'
import NotesField from './components/NotesField.vue'
import Export from './components/Export.vue';
import Sidebar from 'primevue/sidebar'
import Button from "primevue/button"
import Editor from 'primevue/editor';
import ProgressBar from 'primevue/progressbar';




import { ref } from 'vue';

const visible = ref(false);
</script>







<template>

  <!-- <Button icon="pi pi-user"/> -->

  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/logo.png" class="logo" alt="Readfx logo" />
    </a>
  </div>
  <Sidebar v-model:visible="visible">
    <p>Hi</p>
  </Sidebar>
  <Button @click="visible = true" />

  <div class="card">
        <ProgressBar :value="50"></ProgressBar>
  </div>


  <SelectButton v-model="value" :options="options" optionLabel="name" multiple aria-labelledby="multiple" />
  <Options msg="Component base" class="" options />
  <Editor v-model="value" editorStyle="height: 320px" class="editor" />
  <Export msg="Notes base" class="export" />
  <NotesField msg="Notes base" class="notes" />



</template>

<style scoped>
/* @import 'primeflex/primeflex.css'; */
:deep(.p-editor-container .p-editor-toolbar) {
  color: rgb(75, 21, 201);
}

/* :deep(.p-editor-container){
  border-radius: 25px;
  color:rgb(213, 9, 159);
} */

/* :deep(.p-editor-content){
  border-radius: 25px;
  color:rgb(213, 9, 159);
} */

/* .notes{ */
/* background-color:  white; */
/* } */

.options {
  background-color: white;
}

.editor {
  background-color: rgb(255, 255, 255);
}


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #39926baa);
}
</style>


<!-- 
<script>
export default {
    data() {
        return {
            visible: false
        }
    }
}
</script>
 -->
