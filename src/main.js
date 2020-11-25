import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'


// Init app.
const app = createApp(App)
app.config.productionTip = false


// Adding new, vue3 svg inline plugin.
import VueSvgInlinePlugin from 'vue-svg-inline-plugin'
app.use(VueSvgInlinePlugin)


app.mount('#app')