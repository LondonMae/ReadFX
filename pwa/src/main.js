import { createApp } from 'vue'
import "primeflex/primeflex.css";
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Sidebar from 'primevue/sidebar'
import Button from "primevue/button"
import Editor from 'primevue/editor';



// const app = createApp(App).mount('#app')
const app = createApp(App);

app.mount("#app");
app.use(PrimeVue);
app.component('Sidebar', Sidebar);
app.component('Button', Button)
app.component('Editor', Editor)
