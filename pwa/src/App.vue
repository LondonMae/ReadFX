<script setup>
import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import Options from './components/Options.vue'
import NotesField from './components/NotesField.vue'
import Editor from 'primevue/editor';
import Export from './components/Export.vue';
import Sidebar from 'primevue/sidebar';
// import SelectButton from 'primevue/selectbutton';
</script>







<template>


  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/logo.png" class="logo" alt="Readfx logo" />
    </a>
  </div>
  <!-- <b>Added items options</b> -->


  <div class="card flex justify-content-center">
    <Sidebar v-model:visible="visible" header="Sidebar">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </Sidebar>
    <Button icon="pi pi-user" @click="visible = true" style="background-color: green;" />
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



<script>
export default {
    data() {
        return {
            visible: false
        }
    }
}
</script>

