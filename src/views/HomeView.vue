<script setup>
import PizzaNav from '@/components/PizzaNav.vue';
import ProductCartList from '@/components/ProductCartList.vue';
import PizzaModalOrder from '@/components/PizzaModalOrder.vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['add-to-cart']); // объявляем событие, которое будет эмитироваться в родительский компонент (App.vue) при добавлении пиццы в корзину

const sortOption = ref('rating'); // храним выбранную опцию сортировки, по умолчанию сортировка по рейтингу
const selectedPizza = ref(null); // храним данные выбранной пиццы для отображения в модальном окне заказа (чтобы передать данные в модалку), по умолчанию нет выбранной пиццы
const isOpenModalOrder = ref(false); // храним состояние открытости модального окна заказа, по умолчанию оно закрыто
const searchQuery = ref(''); // храним строку поискового запроса, по умолчанию она пустая
const activeCategory = ref('all'); // храним выбранную категорию, по умолчанию выбрана категория "Все"
const openPizzaModal = (pizza) => {
  // Когда пользователь кликает на кнопку "Добавить" в компоненте ProductCart.vue, он вызывает эту функцию и передаёт данные о пицце, которую он хочет заказать. Мы сохраняем эти данные в реактивную переменную selectedPizza, чтобы потом передать их в модальное окно заказа и отобразить информацию о выбранной пицце там.
  // 💥 Когда открываешь модалку
  selectedPizza.value = pizza; // сохраняем данные выбранной пиццы в реактивную переменную, чтобы потом передать эти данные в модальное окно заказа
  isOpenModalOrder.value = true; // открываем модальное окно заказа
  console.log('💥 Модальное окно заказа открыто для пиццы:', pizza);
}
const handleConfirmorder = (pizza) => {
  emit('add-to-cart', pizza); // эмитируем событие в родительский компонент (App.vue) с данными о пицце, которую пользователь подтвердил для заказа

  isOpenModalOrder.value = false; // закрываем модальное окно заказа после подтверждения
}
// сброс категории при поиске:
watch(searchQuery, (newValue) => {
  if (newValue) {
    activeCategory.value = 'all'; // сбрасываем категорию на "Все" при вводе поискового запроса
  }
});
</script>
<template>
  <PizzaModalOrder :is-open-modal-order="isOpenModalOrder" :pizza="selectedPizza" @close="isOpenModalOrder = false" @confirm="handleConfirmorder"/>
  <PizzaNav @update-sort="(value) => sortOption = value" @update-category="(value) => activeCategory = value" />
  <!-- передаём строку поискового запроса и выбранную опцию сортировки в компонент ProductCartList для фильтрации и сортировки списка товаров -->
  <ProductCartList @add-to-cart="openPizzaModal" :search-query-product="searchQuery" :sort-option-product="sortOption" :category="activeCategory"/>
</template>