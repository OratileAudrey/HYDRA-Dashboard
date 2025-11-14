import { createApp } from 'vue'
import router from './routers/index'
import './assets/main.css'
import App from './App.vue'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts) 
app.mount('#app')
