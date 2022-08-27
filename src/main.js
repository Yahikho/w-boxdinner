import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './style.css'
import router from './router/index';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUserSecret, faAngleUp, faAngleDown, faTrashCan, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret, faAngleUp, faAngleDown, faTrashCan,faMagnifyingGlass, faPenToSquare)

createApp(App)
    .component('font-awesome-icon',FontAwesomeIcon)
    .use(router)
    .mount('#app')
