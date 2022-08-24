<script setup>
</script>
<template>
<div class="grid grid-cols-8 bg-sky-500 font-bold">
    <router-link to="/" class="pl-2 hover:bg-sky-400">Caja</router-link>
    <router-link to="/daily" class="pl-2 hover:bg-sky-400">Diario</router-link>
</div>
<router-view></router-view>
</template>