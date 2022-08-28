<script setup>
import { ref, onMounted } from 'vue';
import loading from '../components/loading.vue'
const emit = defineEmits(['closeModal']);
const props = defineProps(['category']);
const txtname = ref(null);
const msg = ref('');
const msgType = ref('failed');
const show = ref(false);
const category = ref({
    iva: 0,
    name: '',
    active: true
});

onMounted( async () =>{
    await infoCategory();
    txtname.value.focus();
});

const closeModal = () => {
    emit('closeModal', false)
}

const infoCategory = async () => {
    if(props.category[0].id > 0){
        category.value = {
            id: props.category[0].id,
            iva: props.category[0].iva,
            name: props.category[0].name,
            active: props.category[0].active
        }
    }
}

const saveCategory = async () => {
    const valit = validate();
    if(valit){
        show.value = true;
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        msg.value = '';
        if(props.category[0].id > 0){
            const data = JSON.stringify(category.value);
            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: data,
                redirect: 'follow'
            };
            const request = await fetch(`http://localhost:3000/boxdinner/categories/${props.category[0].id}`, requestOptions);
            const res = await request.json();
            if(res.response){
                msgType.value = 'success';
                msg.value = `${res.message} // ${res.data.name}`;
                show.value = false;
            }else{
                msgType.value = 'failed';
                msg.value = `Ocurrio algo inesperado`;
            }
        }else{
            const data = JSON.stringify(category.value);
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: data,
                redirect: 'follow'
            };
            const request = await fetch(`http://localhost:3000/boxdinner/categories`, requestOptions);
            const res = await request.json();
            if(res.response){
                msgType.value = 'success';
                msg.value = `${res.message} // ${res.data.name}`;
                show.value = false;
            }else{
                msgType.value = 'failed';
                msg.value = `Algo salio mal`;
            }
        }
        
    }
}

const toUpercase = (e) =>{
    e.target.value = e.target.value.toUpperCase();
}

const validate = () => {
let res = true;
    if(category.value.iva === '' || category.value.iva === null || category.value.iva === undefined || category.value.iva < 0){
        msg.value = 'IVA no puede ser un campo vacío.';
        res = false;
    }

    if(category.value.name === '' || category.value.name === null || category.value.name === undefined){
        msg.value = 'Nombre de la categoría no puede estar vacío.';
        res = false;
    }
    return res;
}
</script>
<template>
<div class="fixed inset-0" @keyup.esc="closeModal">
    <div class="modal-flex-container flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="modal-bg-container fixed inset-0 bg-gray-700 bg-opacity-75">

        </div>
        <div class="modal-space-container">

        </div>
        <div class="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="modal-wrapper bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="modal-wrapper-flex">
                    <div class="modal-content text-center mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class=" text-gray-900 text-3xl font-bold">Categoría</h3>
                        <div class="modal-text items-center">
                            <p>Nombre:</p>
                            <input type="text"
                            placeholder="Ingrese nombre de la categoría"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="category.name"
                            @input="toUpercase($event)"
                            ref="txtname"
                            >
                            <p>IVA:</p>
                            <input type="number"
                            placeholder="Ingrese valor del IVA"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            v-model="category.iva"
                            >
                            <p>Activo:</p>
                            <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                                <input v-model="category.active" id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="bordered-checkbox-1" class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">{{ category.active ? 'Categoría activa' : 'Categoría inactiva' }}</label>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between">
                            <button  @click="saveCategory" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-28 ml-4">Guardar</button>
                            <button @click="closeModal"  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-28 ml-4">Cerrar</button>
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