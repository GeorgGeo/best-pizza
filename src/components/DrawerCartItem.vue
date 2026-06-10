<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: String,
  price: Number,
  imageUrl: String,
  // добавляем размер и тесто
  size: String,
  dough: String,
  // добавки
  addOns: {
    type: Array,
    default: () => [],
  },
  onClickAdd: Function,
  quantity: {
    type: Number,
    default: 1,
  },
  id: Number,
});
// Вычисляемые свойства для отображения размера и теста в удобочитаемом виде
const sizeLabel = computed(() => {
  switch (props.size) {
    case 'small':
      return 'Маленькая 26см';
    case 'medium':
      return 'Средняя 30см';
    case 'large':
      return 'Большая 40см';
    default:
      return '';
  }
});
const doughLabel = computed(() => {
  return props.dough === 'thin' ? 'Тонкое тесто' : 'Традиционное тесто';
});
// const emit = defineEmits(['add', 'remove']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "кнопка нажата"
const emit = defineEmits(['update-quantity', 'remove']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "кнопка нажата"
const decrease = () => {
  if (props.quantity > 1) {
    console.log({
      action: 'decrease',
      id: props.id,
      newQuantity: props.quantity - 1,
    })
    emit('update-quantity', {id: props.id, quantity: props.quantity - 1});
  } else {
    emit('remove', props.id); // если количество 1, то при нажатии на минус удаляем товар из корзины
  }
}

const increase = () => {
  console.log({
    action: 'increase',
    id: props.id,
    newQuantity: props.quantity + 1,
  })
  emit('update-quantity', {id: props.id, quantity: props.quantity + 1});
}
</script>

<template>
  <div class="drawer-cart-img flex items-center gap-4">
    <a href="/" class="cart-img">
      <img :src="imageUrl" :alt="title" class="w-20 h-20 object-contain" />
    </a>
    <!-- -->
    <div class="drawer-cart-info flex-1">
      <h3 class="cart-title font-bold text-lg">{{ title }}</h3>
      <!-- <p class="cart-description text-gray-500 text-sm">Средняя 30см, традиционное тесто</p> -->
      <p class="cart-description text-gray-500 text-sm">{{ sizeLabel }}, {{ doughLabel }}</p>
      <!--  -->
      <div v-if="addOns.length" class="flex flex-wrap gap-1 mt-2">
        <span v-for="addon in addOns" :key="addon.id" class="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">Добавки: + {{ addon.name }}</span>
      </div>
      <div class="cart-bottom flex items-center justify-between mt-4 border-t pt-4">
        <!-- <button @click="onClickAdd" class="cart-add-btn bg-red-500 text-white px-4 py-2 rounded cursor-pointer">+ Добавить</button> -->
        <button @click="decrease" class="cart-remove-btn w-8 h-8 border-1 border-orange-500 text-orange-500 rounded-sm hover:bg-orange-50 transition-colors duration-200 cursor-pointer">-</button>
        <span class="cart-quantity font-bold">{{ quantity }}</span>
        <button @click="increase" class="cart-add-btn w-8 h-8 border-1 border-orange-500 text-orange-500 rounded-sm hover:bg-orange-50 transition-colors duration-200 cursor-pointer">+</button>
        <span class="cart-price font-bold text-lg">${{ Number(price || 0).toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>