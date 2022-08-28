<script setup>
import { ref, onMounted } from 'vue';
import loading from '../components/loading.vue'
const props = defineProps(['product']);
const emit = defineEmits(['closeModal']);
const categories = ref([]);
const msg = ref('');
const msgType = ref('failed');
const txtCode = ref(null);
const show = ref(false);
const product = ref({
    code: "",
    name: "",
    quantity_unit: 0,
    arrival_price: 0,
    categoryId: 0,
    active: true
});

onMounted( async () =>{
    show.value = true;
    txtCode.value.focus();
    product.value = {}
    const request = await fetch(`http://localhost:3000/boxdinner/categories`, {
        method: 'GET',
    });
    const res = await request.json();
    if(res.response){
        categories.value = res.data;
        infoProduct();
        show.value = false;
    }else{
        console.log('Halgo salio mal')
    }
});

const closeModal = () => {
    emit('closeModal', false)
}


const infoProduct = () => {
    if(props.product[0].id > 0){
        product.value = {
            code: props.product[0].code,
            name: props.product[0].name,
            quantity_unit: props.product[0].quantity_unit,
            arrival_price: props.product[0].arrival_price,
            categoryId: props.product[0].categories.id,
            active: props.product[0].active
        }
    }
}

const saveProduct = async () => {
    const valit = validate();
    if(valit){
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        msg.value = '';
        if(props.product[0].id > 0){
            const data = JSON.stringify(product.value);
            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: data,
                redirect: 'follow'
            };
            const request = await fetch(`http://localhost:3000/boxdinner/products/${props.product[0].id}`, requestOptions);
            const res = await request.json();
            if(res.response){
                msgType.value = 'success';
                msg.value = `${res.message} // ${res.data.name}`;
            }else{
                msgType.value = 'failed';
                msg.value = `Ocurrio algo inesperado`;
            }
        }else{
            const data = JSON.stringify(product.value);
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: data,
                redirect: 'follow'
            };
            const request = await fetch(`http://localhost:3000/boxdinner/products`, requestOptions);
            const res = await request.json();
            if(res.response){
                msgType.value = 'success';
                msg.value = `${res.message} // ${res.data.name}`;
            }else{
                msgType.value = 'failed';
                msg.value = `Algo salio mal`;
            }
        }
    }
}

const validate = () => {
    let res = true;
    if(product.value.code === '' || product.value.code === null || product.value.code === undefined){
        msg.value = 'Codigo de producto no puede estar vacío.';
        res = false;
    }

    if(product.value.name === '' || product.value.name === null || product.value.name === undefined){
        msg.value = 'Nombre del producto no puede estar vacío.';
        res = false;
    }

    if(product.value.quantity_unit <= 0 || product.value.quantity_unit === null || product.value.quantity_unit === undefined){
        msg.value = 'La cantidad no puede ser menor a 1.';
        res = false;
    }

    if(product.value.arrival_price <= 0 || product.value.arrival_price === null || product.value.arrival_price === undefined){
        msg.value = 'El precio no puede ser menor a 1.';
        res = false;
    }

    if(product.value.categoryId === null || product.value.categoryId === undefined){
        msg.value = 'Debe seleccionar una categoría';
        res = false;
    }
    return res;
}

const toUpercase = (e) =>{
    e.target.value = e.target.value.toUpperCase();
}

</script>
<template>
<div class="fixed inset-0" @keyup.esc="closeModal">
    <div @keyup.enter="saveProduct" class="modal-flex-container flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="modal-bg-container fixed inset-0 bg-gray-700 bg-opacity-75">

        </div>
        <div class="modal-space-container">

        </div>
        <div class="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="modal-wrapper bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="modal-wrapper-flex">
                    <div class="modal-content text-center mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class=" text-gray-900 text-3xl font-bold">Producto</h3>
                        <div class="modal-text items-center">
                            <p>Código:</p>
                            <input
                            placeholder="Ingrese código del producto"
                            type="text"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"               
                            v-model="product.code"
                            ref="txtCode"
                            >
                            <p>Nombre:</p>
                            <input
                            @input="toUpercase($event)"
                            placeholder="Ingrese nombre del producto"
                            type="text" 
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="product.name"
                            >
                            <p>Cantidad:</p>
                            <input type="number"
                            placeholder="Igrese la cantidad del producto"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="product.quantity_unit"
                            >
                            <p>Precio de llegada:</p>
                            <input type="number"
                            placeholder="Igrese el precio de llegada"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="product.arrival_price"
                            >
                            <p>Seleciona una categoria:</p>
                            <select v-model="product.categoryId" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option :value="item.id" v-for="(item, index) in categories" :key="index">{{item.name}}</option>
                            </select>
                            <p>Activo:</p>
                            <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                                <input v-model="product.active" id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="bordered-checkbox-1" class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">{{ product.active ? 'Producto activo' : 'Producto inactivo' }}</label>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between">
                            <button @click="saveProduct" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-28 ml-4">Guardar</button>
                            <button @click="closeModal" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-28 ml-4">Cerrar</button>
                        </div>
                        <p class="ml-4 mt-" :class="[msgType === 'failed' ? 'text-red-700' : 'text-green-700']">{{msg}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <loading v-show="show"></loading>
</div>
</template>