import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
import store from '@/store'
import JsonEditVue from 'json-editor-vue3'

import 'element-plus/dist/index.css'
import '@/styles/index.scss'

createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus, { locale: zhCn })
  .use(JsonEditVue)
  .mount('#app')
