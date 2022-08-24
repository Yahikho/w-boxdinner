import { createRouter, createWebHistory } from 'vue-router'
import  BoxRegister  from '../views/BoxRegister.vue';
import  Daily  from '../views/Daily.vue';

const routes = [
    {
        path: '/',
        name: 'Caja',
        component : BoxRegister
    },
    {
        path: '/daily',
        name: 'Diario',
        component: Daily
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;