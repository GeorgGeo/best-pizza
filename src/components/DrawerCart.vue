<script setup>
import DrawerCartItem from './DrawerCartItem.vue';
import { useToast } from 'vue-toastification'; // импортируем функцию useToast из библиотеки vue-toastification для отображения уведомлений
const toast = useToast(); // создаем экземпляр toast для использования в компоненте
// import { defineEmits } from 'vue';
const emit = defineEmits(['close', 'update-quantity', 'remove', 'clear-cart']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "кнопка нажата"
// defineProps - для получения данных от родителя, defineEmits - для отправки событий родителю. В данном случае, когда пользователь кликает на кнопки "+" или "-", мы хотим сообщить родителю, что нужно обновить количество товара или удалить его из корзины. Поэтому мы определяем события 'update-quantity' и 'remove', которые будут отправляться с соответствующими данными (например, id товара и новое количество). Родительский компонент будет слушать эти события и выполнять нужные действия (обновлять состояние корзины).
const props = defineProps({
  items: Array,
  totalPrice: Number,
  taxValue: Number,
});
// Делаем функцию оформления заказа
const handleOrder = () => {
  // Проверка пустой корзины
  if (!props.items.length) {
    toast.info('Ваша корзина пуста 😢! Добавьте товары перед оформлением заказа.'); // Показываем уведомление об ошибке, если корзина пуста
    return;
  };

  toast.success('Спасибо за заказ! 🍕 Ваш заказ успешно оформлен. Ждите звонка менеджера'); // Показываем уведомление об успехе при оформлении заказа

  emit('clear-cart'); // Отправляем событие родителю для очистки корзины после оформления заказа
  emit('close'); // Закрываем корзину после оформления заказа
}
</script>

<template>
  <!-- Overlay -->
  <div class="cart-drawer fixed inset-0 bg-black opacity-90 rounded-[30px] shadow-lg w-full h-full z-[90]"></div>
  <!-- Drawer Content -->
  <div class="cart-drawer-right fixed top-0 right-0 w-96 bg-white shadow-xl rounded-r-[30px] z-[100] h-full flex flex-col pb-[35px]">
    <h2 class="cart-title p-3 bg-gray-200 rounded-tr-[30px]">В корзине <span class="font-bold">{{ items.length }} товара</span></h2>
    <!-- Кнопка закрытия -->
    <button class="close-btn absolute w-8 h-8 flex justify-center items-center top-2 right-2 text-gray-500 hover:text-gray-700 hover:bg-[#e04e00] rounded-full text-2xl animate-pulse" @click="emit('close')">
      <span class="text-2xl text-gray-500 hover:text-gray-700 transition-transform duration-500 hover:rotate-180 hover:scale-125 transition-all">×</span>
    </button>
    <!-- Промежуточный контент (если будет список товаров, он займет место посередине) -->
    <div class="content flex-1 overflow-y-auto px-[30px]">
      <!-- Сюда можно добавить список товаров -->
      <!-- <DrawerCartItem title="Сырная пицца" :price="500" imageUrl="https://via.placeholder.com/150" /> -->
      <DrawerCartItem v-for="item in items" 
        :key="item.id" 
        :id="item.id" 
        :title="item.title" 
        :price="item.price" 
        :imageUrl="item.imageUrl"  
        :quantity="item.quantity" 
        :size="item.size"
        :dough="item.dough"
        :add-ons="item.addOns"
        @update-quantity="emit('update-quantity', $event)" 
        @remove="emit('remove', $event)" />
      <span class="flex my-2 text-lg">Итого: 
        <span class="flex-grow h-px self-end relative -top-[5px] mx-3 bg-gray-300"></span>
        <span class="font-bold ml-auto">{{ totalPrice }} $</span>
      </span>
      <span class="flex my-2 text-lg">Налог 5%: 
        <span class="flex-grow border-b mx-3 border-gray-300"></span>
        <span class="font-bold ml-auto">{{ taxValue.toFixed(2) }} $</span>
      </span>
    </div>
    <!-- Кнопка оформления заказа -->
    <button @click="handleOrder" class="cart-drawer-add-btn w-[calc(100%-60px)] px-4 py-2 mx-[30px] bg-[#FE5F00] hover:bg-[#e04e00] text-white rounded transition-all duration-300 mt-auto">Оформить заказ</button>
  </div>
</template>

<style scoped>
</style>