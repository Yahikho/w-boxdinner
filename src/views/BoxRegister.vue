<script setup>
import { ref } from 'vue';
import tblProducts from '../components/tblProducts.vue';

const productInput = ref('');
const products = [];
const listProducts = ref([]);

async function getProduct(){
    const getProductByCode = await fetch(`http://localhost:3000/boxdinner/productscode/${productInput.value}`, {
        method: 'GET',
    });
    const res = await getProductByCode.json();
    if(res.response){
        const getIdProduct = res.data[0].id ;
        const duplicateProduct = products.filter(item => getIdProduct === item.productId);
        if(duplicateProduct.length > 0){
            products.forEach(item => {
                if(item.productId === getIdProduct){
                    item.quantity += 1;
                }
            });
        }else{
            products.push({productId : getIdProduct, quantity : 1});
        }
        await generateListProducts();
    }else{
        console.log('Respuesta falsa')
    }
    productInput.value = '';
}

const generateListProducts = async () => {
    listProducts.value = [];
    await Promise.all(products.map(async item => {
        const getProducById = await fetch(`http://localhost:3000/boxdinner/products/${item.productId}`, {
            method: 'GET',
        });
        const res = await getProducById.json();
        
        const product = res.data[0];
        const total = item.quantity * product.price_sale;
        listProducts.value.push({
            id          : product.id,
            name        : product.name,
            price_sale  : product.price_sale,
            quantity    : item.quantity,
            total       : total
        });
    }));
}

</script>
<template>
<div>
    <div>
        <div class="grid grid-cols-6 mt-2 ml-2">
            <p>Codigo de Producto:</p>
            <input type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="productInput"
            @keyup.enter="getProduct"
            >
        </div>
    </div>
    <div class="grid grid-cols-2 mt-2">
        <tblProducts></tblProducts>
        <div>
        </div>
    </div>
</div>
</template>
