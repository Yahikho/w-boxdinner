<script setup>
import { ref, onMounted, computed } from 'vue';
const sales = ref([]);
const salesByCategory = ref([]);
const initial = ref('');
const finish = ref('');
const productBySales = ref([]);
const indexSale =ref(0);

onMounted( async () =>{
    await getSales();
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
        salesByCategory.value = [];
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const rawDay = JSON.stringify({
            "initial": initial.value,
            "finish": finish.value
        });

        const requestOptionsDay = {
            method: 'POST',
            headers: myHeaders,
            body: rawDay,
            redirect: 'follow'
        };

        const requestDay = await fetch("http://localhost:3000/boxdinner/sales", requestOptionsDay);
        const resDay = await requestDay.json();
        if(resDay.response){
            const data = JSON.parse(resDay.data.replace(/\\/g,"\\\\"));
            sales.value = data;
        }

        const rawBetween = JSON.stringify({
            "initial": initial.value,
            "finish": finish.value
        });

        const requestOptionsBetween = {
            method: 'POST',
            headers: myHeaders,
            body: rawBetween,
            redirect: 'follow'
        };

        const requestBetween = await fetch("http://localhost:3000/boxdinner/salesbycategory", requestOptionsBetween);
        const resBetwenn = await requestBetween.json();
        if(resBetwenn.response){
            const data = resBetwenn.data;
            salesByCategory.value = data;
        }
    }
    
}

const formatDate = (date) => {
    const first = date.split('T');
    const second = first[1].split('.');
    return `${first[0]} ${second[0]}`;
};

const total = computed(() => {
    return salesByCategory.value.map(item =>  Number(item.total)).reduce((prev, curr) => prev + curr, 0)
});



const productsBySale = async (id, index) => {
    productBySales.value = [];
    const request = await fetch(`http://localhost:3000/boxdinner/productsonsales/${id}`,{
        method: 'GET'
    });
    const res = await request.json();
    if(res.response){
        productBySales.value = JSON.parse(res.data.replace(/\\/g,"\\\\"));
        indexSale.value = index;
    }
}

const cancelSale = async (id, active) => {
    const bolActive = active === 1 ? false : true;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = JSON.stringify({
        "active": bolActive
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    const request = await fetch(`http://localhost:3000/boxdinner/sales/${id}`, requestOptions);
    const res = await request.json();
    if(res.response){
        await getSales();
    }else{
        alert('Hubo un problema al cancelar la venta')
    }
}

const cancelProductSale = async(id, active, index) => {
    const bolActive = active === 1 ? false : true; 
      const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = JSON.stringify({
        "active": bolActive
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    const request = await fetch(`http://localhost:3000/boxdinner/productsonsales/${id}`, requestOptions);
    const res = await request.json();
    if(res.response){
        await productsBySale(id,index)
        await getSales();
    }else{
        alert('Hubo un problema al cancelar la venta')
    }
}

</script>
<template>
    <div>
        <div class="grid grid-cols-5 pl-2">
            <div class="col-span-2 mt-2">
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
                    <button @click="getSales" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Buscar</button>
                </div>
                <table class="col-span-3 table-auto w-full h-4 mt-2">
                    <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                        <tr>
                            <th>Factura #</th>
                            <th>Fecha</th>
                            <th>Efectivo</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-gray-100">
                        <tr  v-for="(item, index) in sales" :key="index" @click="productsBySale(item.id, index)" class="hover:bg-gray-300 cursor-pointer" :class="[indexSale === index ? 'bg-gray-300 ' : '']">
                            <td class="text-center">{{item.id +' - '+ (item.active === 1 ? 'Activo' : 'Inactivo')}}</td>
                            <td class="text-center">{{ formatDate(item.create_at) }}</td>
                            <td class="text-center">{{ new Intl.NumberFormat().format(item.payment)}}</td>
                            <td class="text-center">{{ new Intl.NumberFormat().format(item.total)}}</td>
                            <th> <input type="checkbox" @click="cancelSale(item.id, item.active) " :checked="item.active === 1 ? true : false"></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-3">
                <div>
                    <table class="col-span-3 table-auto w-full h-4 mt-2">
                        <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th>Categoria</th>
                                <th>Total ventas</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-gray-100">
                            <tr v-for="(item, index) in salesByCategory" :key="index">
                                <td class="text-center">{{item.name}}</td>
                                <td class="text-center">{{ new Intl.NumberFormat().format(item.total)}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center">
                        <strong>Total ventas:</strong>
                        <p>{{ new Intl.NumberFormat().format(total)}}</p>
                    </div>
                </div>
                <div class="ml-10 mt-36">
                    <table class="col-span-3 table-auto w-full h-4 mt-2">
                        <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio Und.</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-gray-100">
                            <tr v-for="(item, index) in productBySales" :key="index">
                                <td class="text-center">{{item.name}}</td>
                                <td class="text-center">{{item.quantity}}</td>
                                <td class="text-center">{{new Intl.NumberFormat().format(Number(item.price_unit))}}</td>
                                <td><input type="checkbox" @click="cancelProductSale(item.id,item.active, index)" :checked="item.active === 1 ? true : false" title="Desactiva Venta" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>