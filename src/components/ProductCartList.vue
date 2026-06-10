<script setup>
import ProductCart from "./ProductCart.vue";
// import pizza1 from "@/assets/images/pizza/cheeseChicken1.png";
import { computed, onMounted, onUnmounted, ref } from "vue";
import pizzas from "@/data/pizzaz.js";

// 🔥 Шаг 1. Создаём состояние пагинации
const currentPage = ref(1); // текущее значение страницы, по умолчанию 1
const itemsPerPage = ref(4); // количество товаров на странице, можно изменить по своему усмотрению
let resizeTimeout = null; // переменная для хранения таймаута при изменении размера окна

const props = defineProps({
  searchQueryProduct: String, // получаем строку поискового запроса от родителя
  sortOptionProduct: String, // получаем выбранную сортировку от родителя
  category: String // получаем выбранную категорию от родителя
});

const filteredPizzas = computed(() => {
  let result = [...pizzas]; // создаем копию массива пицц для фильтрации и сортировки
  // Если строка поискового запроса пустая, возвращаем все пиццы, иначе фильтруем их по названию, игнорируя регистр
  // if (!props.searchQueryProduct) {
  //   return pizzas;
  // }
  // 🟡 1. Фильтр по категории
  if (props.category && props.category !== 'all') {
    result = result.filter(pizza => pizza.category.toLowerCase().includes(props.category.toLowerCase()));
  }
  // 🔍 Поиск
  if (props.searchQueryProduct) {// если есть поисковый запрос, фильтруем пиццы по названию
    result = result.filter(pizza => 
      pizza.title.toLowerCase().includes(props.searchQueryProduct.toLowerCase())// сравниваем названия пицц с поисковым запросом, игнорируя регистр
    );
  }
  // Фильтруем пиццы, сравнивая их названия с поисковым запросом, игнорируя регистр
  // return pizzas.filter(pizza => 
  //   pizza.title.toLowerCase().includes(props.searchQueryProduct.toLowerCase())
  // );
  // 🔽 3. Сортировка
  if (props.sortOptionProduct === 'price_asc') {
    result.sort((a, b) => a.price - b.price); // сортируем по возрастанию цены
  } else if (props.sortOptionProduct === 'price_desc') {
    result.sort((a, b) => b.price - a.price); // сортируем по убыванию цены
  } else if (props.sortOptionProduct === 'rating') {
    result.sort((a, b) => b.rating - a.rating); // сортируем по рейтингу (от высокого к низкому)
  }

  return result;// возвращаем отфильтрованный и отсортированный массив пицц
});
// 🔥 Шаг 2. После filteredPizzas сделаем totalPages
const totalPages = computed(() => {
  return Math.ceil(filteredPizzas.value.length / itemsPerPage.value); // округляем вверх результат деления количества отфильтрованных пицц на количество товаров на странице
});
// 🔥 Шаг 3. Пиццы текущей страницы
const currentPizzas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value; // вычисляем индекс первого товара на текущей странице
  const end = start + itemsPerPage.value; // вычисляем индекс последнего товара на текущей странице
  return filteredPizzas.value.slice(start, end); // возвращаем срез массива отфильтрованных пицц, который соответствует текущей странице
});
// Делаем адаптив в зависимости от ширины экрана 
const updateItemsPerPage = () => {
  const width = window.innerWidth; // получаем ширину окна браузера

  if (width < 640) { // для экранов меньше 640px (мобильные устройства)
    itemsPerPage.value = 1; // показываем по 1 товару на странице
  } else if (width < 1024) { // для экранов от 640px до 1024px (планшеты)
    itemsPerPage.value = 2; // показываем по 2 товара на странице
  } else { // для экранов больше 1024px (десктопы)
    itemsPerPage.value = 4; // показываем по 4 товара на странице
  };
  // 👇 Сбрасываем на 1-ю страницу при изменении кол-ва товаров, чтобы не остаться на "пустой" странице
  currentPage.value = 1;
};
const addClickAlert = () => {
  alert("Товар добавить в корзину?");
};
console.log(addClickAlert, "addClickAlert в ProductCartList.vue");

const getImageUrl = (imageName) => {
  return new URL(`../assets/images/pizza/${imageName}`, import.meta.url).href;
};
// const pizzas = [
//   {
//     id: 0,
//     imageUrl: pizza1,
//     title: "Сырный цыплёнок",
//     types: [0, 1],
//     sizes: [26, 30, 40],
//     price: 803,
//     category: 0,
//     rating: 4
//   },
//   {
//     id: 1,
//     imageUrl: pizza2,
//     title: "Сырная",
//     types: [0],
//     sizes: [26, 40],
//     price: 245,
//     category: 1,
//     rating: 6
//   },
//   {
//     id: 2,
//     imageUrl: pizza3,
//     title: "Цыпленок барбекю",
//     types: [0],
//     sizes: [26, 40],
//     price: 295,
//     category: 1,
//     rating: 4
//   },
//   {
//     id: 3,
//     imageUrl: pizza4,
//     title: "Кисло-сладкий цыпленок",
//     types: [1],
//     sizes: [26, 30, 40],
//     price: 275,
//     category: 2,
//     rating: 2
//   },
//   {
//     id: 4,
//     imageUrl: pizza5,
//     title: "Чизбургер-пицца",
//     types: [0, 1],
//     sizes: [26, 30, 40],
//     price: 415,
//     category: 3,
//     rating: 8
//   },
//   {
//     id: 5,
//     imageUrl: pizza6,
//     title: "Крэйзи пепперони",
//     types: [0],
//     sizes: [30, 40],
//     price: 580,
//     category: 2,
//     rating: 2
//   },
//   {
//     id: 6,
//     imageUrl: pizza7,
//     title: "Терияки",
//     types: [0, 1],
//     sizes: [26, 30, 40],
//     price: 520,
//     category: 3,
//     rating: 7
//   },
//   {
//     id: 7,
//     imageUrl: pizza8,
//     title: "Мясной микс",
//     types: [0, 1],
//     sizes: [26, 30, 40],
//     price: 675,
//     category: 1,
//     rating: 9
//   },
//   {
//     id: 8,
//     imageUrl: pizza9,
//     title: "Пепперони",
//     types: [0, 1],
//     sizes: [26, 30, 40],
//     price: 450,
//     category: 4,
//     rating: 10
//   },
//   // {
//   //   id: 9,
//   //   imageUrl: "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/ec29465e-606b-4a04-a03e-da3940d37e0e.jpg",
//   //   title: "Четыре сезона",
//   //   types: [0, 1],
//   //   sizes: [26, 30, 40],
//   //   price: 395,
//   //   category: 5,
//   //   rating: 10
//   // },
//   // {
//   //   id: 9,
//   //   imageUrl: "https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/30367198-f3bd-44ed-9314-6f717960da07.jpg",
//   //   title: "Овощи и грибы 🌱",
//   //   types: [0, 1],
//   //   sizes: [26, 30, 40],
//   //   price: 285,
//   //   category: 5,
//   //   rating: 7
//   // }
// ];
const emit = defineEmits(['add-to-cart']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "товар добавлен в корзину"

// Хуки жизненного цикла для установки и очистки слушателя события изменения размера окна
onMounted(() => {
  updateItemsPerPage(); // устанавливаем начальное количество товаров на странице при загрузке компонента
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout); // очищаем предыдущий таймаут, если он есть, чтобы избежать слишком частого вызова функции при изменении размера окна
    resizeTimeout = setTimeout(() => {
      updateItemsPerPage(); // вызываем функцию обновления количества товаров на странице после изменения размера окна с небольшой задержкой, чтобы избежать слишком частого вызова при быстром изменении размера окна
    }, 250);
  }); // добавляем слушатель события изменения размера окна для адаптивности
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage); // 👈 уборка за собой!
})
</script>

<template>
  <div class="product-cart-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <!-- <ProductCart v-for="pizza in pizzas" :key="pizza.id" :image-url="getImageUrl(pizza.imageUrl)" :title="pizza.title" :price="pizza.price" :onClickAdd="addClickAlert" /> -->
    <!-- <ProductCart v-for="pizza in filteredPizzas" :key="pizza.id" :id="pizza.id" :image-url="getImageUrl(pizza.imageUrl)" :description="pizza.description" :title="pizza.title" :price="pizza.price" @add="(payload) => emit('add-to-cart', {...pizza, imageUrl: getImageUrl(pizza.imageUrl), img: payload.img})" /> -->
    <!-- 🔥 Шаг 4. Меняем v-for -->
    <ProductCart v-for="pizza in currentPizzas" :key="pizza.id" :id="pizza.id" :image-url="getImageUrl(pizza.imageUrl)" :description="pizza.description" :title="pizza.title" :price="pizza.price" @add="(payload) => emit('add-to-cart', {...pizza, imageUrl: getImageUrl(pizza.imageUrl), img: payload.img})" />
    <!-- 🔥 Шаг 5. Добавляем кнопки пагинации -->
    <div class="pagination flex justify-center mt-6 col-span-full gap-2">
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="currentPage = page"
        class="px-4 py-2 rounded-lg border transition"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          currentPage === page 
            ? 'bg-orange-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      <!-- :class="currentPage === page ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'" -->
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>