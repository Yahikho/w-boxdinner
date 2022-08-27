<script setup>
import { ref, onMounted, computed } from 'vue';
const sales = ref([]);
const salesByCategory = ref([]);
const initial = ref('');
const finish = ref('');

onMounted( async () =>{
    getSales();
});

const getSales = async () => {
    if(initial.value === '' && finish.value === ''){
        const request = await fetch("http://localhost:3000/boxdinner/sales",{
            method: 'GET'
        });
        const res = await request.json();
        if(res.response){
            const data = JSON.parse(res.data.replace(/\\/g,"\\\\"));
            sales.value = data;
        }

        const requestSalesByCaregory = await fetch("http://localhost:3000/boxdinner/salesbycategory",{
            method: 'GET'
        });

        const resSalesByCategory = await requestSalesByCaregory.json();
        if(resSalesByCategory.response){
            salesByCategory.value = resSalesByCategory.data;
        }

    }else{
        sales.value = [];
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "initial": initial.value,
            "finish": finish.value
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const request = await fetch("http://localhost:3000/boxdinner/sales", requestOptions);
        const res = await request.json();
        if(res.response){
            const data = JSON.parse(res.data.replace(/\\/g,"\\\\"));
            sales.value = data;
        }
    }
    
}
const formatDate = (date) => {
    const first = date.split('T');
    const second = first[1].split('.');
    return `${first[0]} ${second[0]}`;
};

const total = computed(() => {
  return salesByCategory.value.map(item => Number(item.total)).reduce((prev, curr) => prev + curr, 0)
});
</script>
<template>
    <div>
        <div class="grid grid-cols-4">
            <div class="col-span-2 mt-2 ml-2">
                <div class="grid grid-cols-2 my-2">
                    <div>
                        <p>Desde:</p>
                        <input
                        v-model="initial"
                        type="date"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                    </div>
                    <div>
                        <p>Hasta:</p>
                        <input 
                        v-model="finish"
                        type="date"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                    </div>
                    
                </div>
                <div class="grid mt-2">
                    <button @click="getSales" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full ml-4">Buscar</button>
                </div>
                <table class="col-span-3 table-auto w-full ml-3 h-4 mt-2">
                    <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                        <tr>
                            <th>Factura #</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Efectivo</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-gray-100">
                        <tr  v-for="(item, index) in sales" :key="index">
                            <td class="text-center">{{item.id}}</td>
                            <td class="text-center">{{  formatDate(item.create_at) }}</td>
                            <td class="text-center">{{ new Intl.NumberFormat().format(item.total)}}</td>
                            <td class="text-center">{{ new Intl.NumberFormat().format(item.payment)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-2 ml-5">
                <div>
                    <table class="col-span-3 table-auto w-full ml-3 h-4 mt-2">
                        <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th>Categoria</th>
                                <th>Total ventas</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-gray-100">
                            <tr v-for="(item, index) in salesByCategory" :key="index">
                                <td>{{item.name}}</td>
                                <td>{{ new Intl.NumberFormat().format(item.total)}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center mt-10">
                        <strong>Total ventas:</strong>
                        <p>{{ new Intl.NumberFormat().format(total)}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>