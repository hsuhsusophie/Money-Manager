import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faBook, 
  faChartBar, 
  faChartPie, 
  faCog,
  faHome,
  faFileAlt,
  faCalendarAlt,
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'

// 添加圖標到庫中
library.add(faBook, faChartBar, faChartPie, faCog, faHome, faFileAlt, faCalendarAlt, faChartSimple)

const app = createApp(App)

// 註冊 FontAwesome 組件
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
