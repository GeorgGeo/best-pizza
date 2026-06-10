<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <!-- Модальное окно -->
  <div class="cart-drawer bg-white rounded-[30px] shadow-lg p-6 w-full max-w-md mx-auto overflow-hidden relative">
    <!-- Кнопка закрытия -->
    <button class="close-btn absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full text-2xl" @click="emit('close')">×</button>
    <!-- Левая часть (картинка) -->
    <div class="cart-drawer-left w-1/2 pr-4">
      <img src="../assets/images/pizza/cheeseChicken1.png" alt="Pizza" class="w-full h-auto rounded-lg" />
    </div>
    <!-- Правая часть (информация) -->
    <div class="cart-drawer-right w-1/2 pl-4">
      <h2 class="cart-drawer-title font-bold text-2xl mb-4">Пицца Цыпленок с сыром</h2>
      <p class="cart-drawer-description text-gray-500 mb-6">Цыпленок, моцарелла, сыры чеддер и пармезан, сырный соус, томаты, соус альфредо, чеснок</p>
      <span class="cart-drawer-price font-bold text-xl mb-6 block">$12.99</span>
      <button class="cart-drawer-add-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">+ Добавить в корзину</button>
    </div>
    <!-- Кнопка добавления в корзину -->
    <button class="cart-drawer-add-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Добавить в корзину за $12.99</button>
  </div>
</template>
<!-- <div class="cart-drawer fixed top-0 left-0 bg-black opacity-60 rounded-[30px] shadow-lg p-6 w-full h-full overflow-hidden relative flex flex-col mx-auto">
    Кнопка закрытия
    <button class="close-btn absolute z-10 w-8 h-8 flex justify-center items-center top-2 right-2 text-gray-500 hover:text-gray-700 hover:bg-[#e04e00] rounded-full text-2xl animate-pulse" @click="emit('close')">
      <span class="text-2xl text-gray-500 hover:text-gray-700 transition-transform duration-500 hover:rotate-180 hover:scale-125 transition-all">×</span>
    </button>
    <div class="cart-drawer-container flex mb-6">
      Левая часть (картинка)
      <div class="cart-drawer-left w-1/2 pr-4">
        <img src="../assets/images/pizza/cheeseChicken1.png" alt="Pizza" class="w-auto h-auto rounded-lg" />
      </div>
      Правая часть (информация)
      <div class="cart-drawer-right w-1/2 pl-4">
        <h2 class="cart-drawer-title font-bold text-2xl mb-4">Пицца Цыпленок с сыром</h2>
        <p class="cart-drawer-description text-gray-500 mb-6">Цыпленок, моцарелла, сыры чеддер и пармезан, сырный соус, томаты, соус альфредо, чеснок</p>
        <span class="cart-drawer-price font-bold text-xl mb-6 block">$12.99</span>
      </div>
    </div>
    Кнопка добавления в корзину
    <button class="cart-drawer-add-btn w-full px-4 py-2 bg-[#FE5F00] hover:bg-[#e04e00] text-white rounded transition-all duration-300">Добавить в корзину за $12.99</button>
  </div> -->
<style scoped>
</style>