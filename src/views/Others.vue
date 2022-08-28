<script setup>
import {onMounted, ref } from 'vue';
const categories = ref([]);

onMounted(async () => {
    await getCategories();
});
const getCategories = async () => {
    const request = await fetch(`http://localhost:3000/boxdinner/categories`, {
        method: 'GET',
    });
    const res = await request.json();
    if(res.response){
        categories.value = res.data;
    }else{
        console.log('Halgo salio mal')
    }
}

const formatDate = (date) => {
    const first = date.split('T');
    const second = first[1].split('.');
    return `${first[0]} ${second[0]}`;
};

</script>
<template>
    <div class="grid grid-cols-2">
        <div class="ml-2 mt-2">
            <button @click="openModalCategory" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-28 ml-4">Nuevo</button>
            <table class="col-span-3 table-auto w-full h-4 mt-2">
                    <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                <tr>
                        <th>Nombre</th>
                        <th>Iva</th>
                        <th>Ultima actualización</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-100">
                    <tr v-for="(item, index) in categories" :key="index">
                        <td>{{item.name}}</td>
                        <td class="text-center">{{item.iva +' %'}}</td>
                        <td class="text-center">{{formatDate(item.update_at)}}</td>
                        <td>
                             <font-awesome-icon icon="fa-solid fa-pen-to-square" class="text-2xl text-sky-500 cursor-pointer" title="Editar categoría"/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>