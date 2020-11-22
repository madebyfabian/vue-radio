import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'


// Init app.
const app = createApp(App)
app.config.productionTip = false


// Adding new, vue3 svg inline plugin.
import VueSvgInlinePlugin from 'vue-svg-inline-plugin'
app.use(VueSvgInlinePlugin)


app.use(router).mount('#app')