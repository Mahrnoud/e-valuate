// main.js - Application entry point
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create Vue application instance
const app = createApp(App)

// Initialize Pinia store
const pinia = createPinia()
app.use(pinia)

// Use Vue Router
app.use(router)

// Mount app to DOM
app.mount('#app')
