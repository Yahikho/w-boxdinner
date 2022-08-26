<script setup>
import { ref, computed } from 'vue';
import modalPay from '../components/modalPay.vue'

const productInput = ref('');
const txtCode = ref(null)
const listProducts = ref([]);
const indexTbl = ref(0);
const modalPayView = ref(false)

async function getProduct(){
    const getProductByCode = await fetch(`http://localhost:3000/boxdinner/productscode/${productInput.value}`, {
        method: 'GET',
    });
    const res = await getProductByCode.json();
    if(res.response){
        const getIdProduct = res.data[0].id ;
        const duplicateProduct = listProducts.value.filter(item => getIdProduct === item.id);
        if(duplicateProduct.length > 0){
            listProducts.value.forEach(item => {
                if(item.id === getIdProduct){
                    item.quantity += 1;
                    item.total = Number(item.quantity)  * Number(item.price_sale)
                }
            });
        }else{
            const quantityByTotal = {
                quantity: 1,
                total: Number(res.data[0].price_sale)
            }
            listProducts.value.unshift(Object.assign(res.data[0],quantityByTotal));
        }
        indexTbl.value = 0;
    }else{
        alert('Cogido de producto no existe')
    }
    productInput.value = '';
}


const changeQuantity = (id, event, priceSale) => {
    listProducts.value.forEach(element => {
        if(element.id === id){
            element.quantity = Number(event.target.value),
            element.total = priceSale * Number(event.target.value)
        }
    });
}

const changePriceSale = (id, event) => {
listProducts.value.forEach(element => {
        if(element.id === id){
            element.price_sale = Number(event.target.value),
            element.total = Number(event.target.value) * element.quantity
        }
    });
}

const total = computed(() => {
  return listProducts.value.map(item => item.total).reduce((prev, curr) => prev + curr, 0)
});


const changeIndexProdyct = (index) => {
    indexTbl.value = index;
}

const deleteProduct = () => {
    if(indexTbl.value === 0){
        listProducts.value.splice(indexTbl.value, indexTbl.value + 1);
    }else{
        listProducts.value.splice(indexTbl.value, indexTbl.value);
    }
    txtCode.value.focus();
}

const pay = () => {
    if(listProducts.value.length > 0){
        modalPayView.value = true;
    }else{
        modalPayView.value = false;
        alert('No hay productos para facturar');
    }
}
</script>
<template >
<div @click.ctrl="deleteProduct">
    <div>
        <div class="grid grid-cols-6 mt-2 ml-2">
            <p>Codigo de Producto:</p>
            <input type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="productInput"
            @keyup.enter="getProduct"
            @keyup.ctrl.space="pay"
            ref="txtCode"
            >
        </div>
    </div>
    <div class="grid grid-cols-3 mt-2">
        
        <table class="col-span-2">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Und.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in listProducts" :key="index" @click="changeIndexProdyct(index)" :class="[indexTbl === index ? 'bg-sky-500' : '']" class="hover:bg-sky-500 cursor-pointer'">
                    <td>{{ item.name }}</td>
                    <td><input type="number" v-model="item.quantity" @change="changeQuantity(item.id, $event, item.price_sale)" min="1" class="bg-inherit text-center "></td>
                    <td><input type="number" v-model="item.price_sale" @change="changePriceSale(item.id, $event)" min="1" class="bg-inherit text-center "></td>
                    <td>{{ item.total }}</td>
                </tr>
            </tbody>
        </table>
        <div class="justify-items-center grid grid-cols-2">
            <p class="col-span-2">Total Neto</p>
            <p class="col-span-2">{{total}}</p>
        </div>
    </div>
    <modalPay v-if="modalPayView"></modalPay>
</div>
</template>
