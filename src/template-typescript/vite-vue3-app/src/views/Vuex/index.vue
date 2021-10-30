<template>
  <div class="vuex-container page-container">
    <div class="page-title">Vuex Test Page</div>
    <p>store count is: {{ count }}</p>
    <p>store doubleCount is: {{ doubleCount }}</p>
    <button @click="increment">increment</button>
    <button @click="asyncIncrement">asyncIncrement</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Vuex',

  setup() {
    const store = useStore()
    const reactiveData = reactive({
      // 在 computed 函数中访问 state
      count: computed(() => store.state.app.count),
      // 在 computed 函数中访问 getter
      doubleCount: computed(() => store.getters['app/double'])
    })

    // 使用 mutation
    const increment = () => {
      store.commit('app/increment', undefined)
    }

    // 使用 action
    const asyncIncrement = () => {
      store.dispatch('app/increment', undefined)
    }

    return {
      ...toRefs(reactiveData),
      increment,
      asyncIncrement
    }
  }
})
</script>

<style scoped lang="scss">
button {
  margin: 0 8px;
}
</style>
