<script setup>
import { ref, onMounted } from 'vue';
import modalInfoProduct from '../components/modalInfoProduct.vue'
import loading from '../components/loading.vue'
const search = ref('');
const products = ref([]);
const msg = ref(null);
const modalProduct = ref(false)
const product = ref([]);
const txtSearch = ref(null);
const show = ref(false);

onMounted(async () => {
    await getProductsByNameOrCode();
    txtSearch.value.focus();
});

const getProductsByNameOrCode =  async () => {
    show.value = true;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const data = JSON.stringify({
        "value": search.value.toLocaleUpperCase(),
    });

     const requestOptions = {
        method: 'POST',
        headers: headers,
        body: data,
        redirect: 'follow'
    };

    const request = await fetch("http://localhost:3000/boxdinner/productsNameCode", requestOptions);
    const res = await request.json();
    if(res.response){
       products.value = res.data;
       msg.value = '';
       show.value = false;
    }else{
        show.value = false;
        products.value = [];
        msg.value = `No se encotró nada con ese valor: ${search.value.toLocaleUpperCase()}`;
    }
}

const openModalProduct = (item) => {
    if(item){
        product.value.push(item);
    }
    modalProduct.value = true;
}

const closeModal = (e) => {
    modalProduct.value = e;
    product.value = [];
    getProductsByNameOrCode();
    txtSearch.value.focus();
}

</script>
<template>
    <div>
        <nav class="grid grid-cols-3 mt-4 mx-4" >
            <input type="text" v-model="search" @keyup.enter="getProductsByNameOrCode" ref="txtSearch" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <button @click="openModalProduct" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-28 ml-4" title="Agregar un nuevo producto">Nuevo</button>
        </nav>
        <div class="m-4">
            <table class="col-span-3 table-auto w-full ml-3 h-4">
                <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                        <th></th>
                        <th>Código</th>
                        <th>Nombe</th>
                        <th>Cantidad</th>
                        <th>Precio de llegada</th>
                        <th>Precio IVA</th>
                        <th>Precio aproximado</th>
                        <th>Categoría</th>
                        <th>Última actualización</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-gray-100">
                    <tr  v-for="(item, index) in products" :key="index" class="hover:bg-gray-100">
                        <td>
                            <font-awesome-icon icon="fa-solid fa-pen-to-square" @click="openModalProduct(item)" class="text-2xl text-sky-500 cursor-pointer" title="Editar producto" />
                        </td>
                        <td class="text-center">{{item.code}}</td>
                        <td>{{item.name}}</td>
                        <td class="text-center">{{item.quantity_unit}}</td>
                        <td class="text-center">{{ new Intl.NumberFormat().format(Number(item.arrival_price))}}</td>
                        <td class="text-center">{{ new Intl.NumberFormat().format(Number(item.price_iva))  + ' - ' + item.categories.iva + '%'}}</td>
                        <td class="text-center">{{ new Intl.NumberFormat().format(Number(item.price_sale))}}</td>
                        <td class="text-center">{{item.categories.name}}</td>
                        <td class="text-center">{{new Date(item.update_at).toDateString()}}</td>
                    </tr>
                </tbody>
            </table>
            <p class="text-red-700 ml-4">{{msg}}</p>
        </div>
        <loading v-show="show"></loading>
        <modalInfoProduct 
        v-if="modalProduct" 
        :product=product
        @closeModal = "closeModal($event)"
        >
        </modalInfoProduct>
    </div>
</template>