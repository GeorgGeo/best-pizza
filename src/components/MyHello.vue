<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
    default: 'Hello World'
  },
})
// Передача данных обратно - от дочернего компонента к родителю (через событие)
const emit = defineEmits(['myEvent']);
function handleClick() {
  emit('myEvent', 'Данные из MyHello');
}
</script>

<template>
  <div>{{ msg }}</div>
  <button @click="handleClick">Click me</button>
</template>

<style scoped>
div {
  color: rgb(255, 51, 0);
  padding: 10px;
  font-weight: bold;
}
</style>