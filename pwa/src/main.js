import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import PrimeVue from 'primevue/config';
import Sidebar from 'primevue/sidebar'
import Button from "primevue/button"
import Editor from 'primevue/editor';
import ProgressBar from 'primevue/progressbar';

import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';



const app = createApp(App);
app.use(PrimeVue);

app.component('Sidebar', Sidebar);
app.component('Button', Button)
app.component('Editor', Editor)
app.component('ProgressBar', ProgressBar)

app.mount("#app");