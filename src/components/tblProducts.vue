<script setup>
    import { ref, onBeforeUpdate } from 'vue';

    const listProducts = ref([]);
    const newValuesByProduct = [];

    const props = defineProps({
        products: ref([])
    });

    const changeQuantity = (id, event, price) => {
        if(newValuesByProduct.length > 0){
            listProducts.value.forEach(element => {
                if(element.id === id){
                    element.quantity = event.target.value;
                }else{
                    newValuesByProduct.push({
                        id,
                        quantity: Number(event.target.value),
                        total: Number(event.target.value) * price
                    });
                    listProducts.value.push(newValuesByProduct);
                }
            });
        }else{
            newValuesByProduct.push({
                id,
                quantity: event.target.value
            });
            listProducts.value.push(newValuesByProduct);
        }
        applyChanges()
    }

    const changePriceSale = () => {

    }

    const applyChanges = () => {

    }

    onBeforeUpdate(() => {
    });
</script>
<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Und.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in products" :key="index" >
                    <td>{{ item.name }}</td>
                    <td><input type="text" v-model="item.quantity" @change="changeQuantity(item.id, $event, item.price_sale)"></td>
                    <td><input type="text" v-model="item.price_sale"></td>
                    <td>{{ item.total }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>