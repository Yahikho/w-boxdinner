<script setup>
import { ref, computed, onMounted } from 'vue';
import modalPay from '../components/modalPay.vue'

const productInput = ref('');
const txtCode = ref(null)
const listProducts = ref([]);
const indexTbl = ref(0);
const modalPayView = ref(false)
const lstSale = ref([]);

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

onMounted(async () => {
  txtCode.value.focus();
  await lastSale()
});

const lastSale = async () => {
    lstSale.value = [];
    const request = await fetch("http://localhost:3000/boxdinner/lastsale",{
        method: 'GET'
    });
    const res = await request.json();
    if(res.response){
        lstSale.value = res.data;
    }
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

const closeModal =  (e) => {
    modalPayView.value = e;
    txtCode.value.focus();
}
const refresh = async (e) => {
    modalPayView.value  = false;
    if(e){
        listProducts.value = [];
    }
    txtCode.value.focus();
    await lastSale()
}

const upQt = (index) => {
    const newQt = listProducts.value[index].quantity += 1
    listProducts.value[index].quantity = newQt;
    listProducts.value[index].total = newQt * Number(listProducts.value[index].price_sale);
    txtCode.value.focus();
}

const downQt = (index) => {
    if(listProducts.value[index].quantity > 1){
        const newQt = listProducts.value[index].quantity -= 1
        listProducts.value[index].quantity = newQt;
        listProducts.value[index].total = newQt * Number(listProducts.value[index].price_sale);
    }
    txtCode.value.focus();
}

</script>
<template >
<div>
    <div class="grid grid-cols-2">
        <div class="col-span-1 mt-2 ml-2 items-center">
            <p>Codigo de Producto:</p>
            <input type="text" 
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="productInput"
            @keyup.enter="getProduct"
            @keyup.ctrl.space="pay"
            ref="txtCode"
            >
        </div>
        <div class="col-span-1">
            <h2 class="text-center">Ultima venta</h2>
            <div class="grid grid-cols-3" v-for="item in lstSale">
                <div class="text-center">
                    <p>Pago</p>
                    <strong>{{ new Intl.NumberFormat().format(item.payment)}}</strong>
                </div>
                <div  class="text-center">
                    <p>Total</p>
                    <strong>{{ new Intl.NumberFormat().format(item.total)}}</strong>
                </div>
                <div class="text-center">
                    <p>Cambio</p>
                    <strong>{{ new Intl.NumberFormat().format(item.payment - item.total)}}</strong>
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-4 mt-2">
        <table class="col-span-3 table-auto w-full ml-3 h-4">
            <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                <tr>
                    <th>Acciones</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio uni.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-gray-100 ">
                <tr v-for="(item, index) in listProducts" :key="index" @click="changeIndexProdyct(index)" @click.ctrl="deleteProduct" class="cursor-pointer hover:bg-gray-100" :class="[indexTbl === index ? 'bg-gray-100' : '']">
                    <td>
                        <font-awesome-icon icon="fa-solid fa-angle-down" class="text-red-300 text-3xl ml-1" @click="downQt(index)" title="Disminuir cantidad"/>
                        <font-awesome-icon icon="fa-solid fa-angle-up" class="text-green-300 text-3xl ml-4" @click="upQt(index)" title="Aumentar cantidad"/>
                        <font-awesome-icon icon="fa-solid fa-trash-can" class="text-red-300 text-xl ml-6 mb-1" @click="deleteProduct" title="Eliminar Prodcuto"/>
                    </td>
                    <td >{{ item.name }}</td>
                    <td class="text-center">
                        <input type="number" v-model="item.quantity" @change="changeQuantity(item.id, $event, item.price_sale)" min="1" class="w-6">
                    </td>
                    <td class="text-center">
                        <input type="number" v-model="item.price_sale" @change="changePriceSale(item.id, $event)" min="1" class="w-14">
                    </td>
                    <td class="text-center">
                        <p>{{ new Intl.NumberFormat().format(item.total) }}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="justify-items-center grid grid-cols-2 col-span-1">
            <p class="col-span-2 text-3xl">Total</p>
            <p class="col-span-2 font-bold text-4xl">{{new Intl.NumberFormat().format(total)}}</p>
        </div>
    </div>
    <modalPay 
        v-if="modalPayView" 
        @closeModal = "closeModal($event)"
        @refresh = "refresh($event)"
        :listProducts = listProducts
        :total = total
    >
    </modalPay>
</div>
</template>
