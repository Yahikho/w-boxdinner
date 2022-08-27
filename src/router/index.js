import { createRouter, createWebHistory } from 'vue-router'
import  BoxRegister  from '../views/BoxRegister.vue';
import  Daily  from '../views/Daily.vue';
import  Products  from '../views/Products.vue';
import Others from '../views/Others.vue';

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
    },
    {
        path: '/products',
        name: 'Productos',
        component: Products
    },
    {
        path: '/others',
        name: 'Otros',
        component: Others
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;