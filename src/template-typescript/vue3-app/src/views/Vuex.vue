<template>
    <div class="test">
        <h1>This is an vuex test page</h1>
        <p>count: {{ count }}</p>
        <p>double: {{ double }}</p>
        <button @click="increment">add</button>
        <button @click="asyncIncrement">asyncAdd</button>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from '@/store';
const store = useStore();
console.log(store);
// 在 computed 函数中访问 state
const count = computed(() => store.state.app.count);
// 在 computed 函数中访问 getter
const double = computed(() => store.getters['app/double']);

const increment = () => {
    store.commit('app/increment', undefined);
};

const asyncIncrement = () => {
    store.dispatch('app/increment', undefined);
};
</script>
