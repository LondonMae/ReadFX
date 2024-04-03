import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';


// const app = createApp(App).mount('#app')
const app = createApp(App);

app.mount("#app");
app.use(PrimeVue);
