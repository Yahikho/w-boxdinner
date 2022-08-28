<script setup>
import { ref, onMounted, computed } from 'vue'
import loading from '../components/loading.vue'
const emit = defineEmits(['closeModal', 'refresh']);
const props = defineProps(['listProducts', 'total']);
const txtPay = ref(null);
const pay = ref(null);
const msg = ref(null);
const show = ref(false);

const closeModal = () => {
    emit('closeModal', false)
}

const refresh = () => {
    emit('refresh', true)
}

const bk = computed(()=>{
    return pay.value - props.total;
});

onMounted(() => {
  txtPay.value.focus();
})
const generateSale = async () => {
    if(bk.value >= 0){
        show.value = true;
        const produsts = [];
        props.listProducts.forEach(element => {
            produsts.push({
                productId: element.id,
                quantity: element.quantity,
                price_sale: Number(element.price_sale)
            });
        });
    
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const data = JSON.stringify({
            "payment": pay.value,
            "total" : props.total,
            "products": produsts
        });

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: data,
            redirect: 'follow'
        };

        const request = await fetch("http://localhost:3000/boxdinner/productsonsales", requestOptions);
        const res = await request.json();
        if(res.response){
            msg.value = "Venta registrada";
            if(confirm('¿Generar Factura?')){
                console.log('Genera factura')
            }
            show.value = true;
            refresh();
        }else{
            msg.value = "Se jodio el sistema";
        }
    }else{
        msg.value = "EL valor del pago es menor al valor de la venta";
    }
}

</script>
<template>
<div class="fixed inset-0">
    <div class="modal-flex-container flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="modal-bg-container fixed inset-0 bg-gray-700 bg-opacity-75">

        </div>
        <div class="modal-space-container">

        </div>
        <div class="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="modal-wrapper bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="modal-wrapper-flex sm:flex sm:items-start">
                    <div class="modal-content text-center mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class=" text-gray-900 text-3xl font-bold">Terminar venta</h3>
                        <div class="modal-text grid grid-cols-2 items-center">
                            <input
                                required
                                placeholder="Ingrese valor de pago"
                                type="number" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                ref="txtPay"
                                v-model="pay"
                                @keyup.esc="closeModal"
                                @keyup.enter="generateSale"
                                >
                            <div class="text-center grid grid-cols-1">
                                <p class="text-2xl">Efectivo: <strong :class="[pay < props.total ? 'text-red-700' : 'text-green-700']">{{new Intl.NumberFormat().format(pay)}}</strong></p>
                                <p class="font-medium text-2xl">Total:  <strong class="text-green-700">{{new Intl.NumberFormat().format(props.total)}}</strong></p>
                                <p>___________________</p>
                                <p class="text-2xl">Cambio: <strong :class="[bk <= 0 ? 'text-red-700' : 'text-green-700']">{{new Intl.NumberFormat().format(bk)}}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="text-center" :class="[bk < 0 ? 'text-red-700': 'text-green-700']">{{msg}}</p>
        </div>
    </div>
    <loading v-show="show"></loading>
</div>
</template>