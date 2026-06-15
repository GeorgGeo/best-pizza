<script setup>
import { ref, watch } from 'vue';

// реактивные переменные
const activeCategory = ref('all'); //🔹 по умолчанию выбрана категория "Все"
const sortOption = ref('rating'); // по умолчанию сортировка по рейтингу
const isOpen = ref(false); // для управления открытием выпадающего меню dropdown-menu
const emit = defineEmits(['update-sort', 'update-category']); // объявляем событие для передачи выбранной сортировки и категории родителю

const toggleDropdown = () => {
  isOpen.value = !isOpen.value; // переключаем состояние dropdown
};

// массив категорий (можно оставить обычным массивом)
const categories = [
  { id: 'all', name: 'Все' },
  { id: 'meat', name: 'Мясные' },
  { id: 'spicy', name: 'Острые' },
  { id: 'sweet', name: 'Сладкие' },
  { id: 'vegetarian', name: 'Вегетарианские' },
  { id: 'chicken', name: 'С курицей' },
];

//🔥 Добавим массив вариантов сортировки
const sortOptions = [
  { id: 'rating', name: 'по рейтингу' },
  { id: 'price_asc', name: 'цене (возрастание)' },
  { id: 'price_desc', name: 'цене (убывание)' },
];

//🔹 функция смены категории
const handleCategoryChange = (id) => {
  activeCategory.value = id;// обновляем активную категорию
  emit('update-category', id); // отправляем событие родителю с новой категорией
  console.log('Выбрана категория:', id);// здесь можно добавить логику для фильтрации пицц по категории
}
// А сортировать ты должен сам, например:
// const sortedPizzas = computed(() => {
//   if (sortOption.value === 'price_asc') {
//     return [...pizzas].sort((a, b) => a.price - b.price)
//   }
// })

//🔥 Создадим функцию переключения
const toggleSort = () => {
  const currentIndex = sortOptions.findIndex(option => option.id === sortOption.value);
  if (currentIndex === -1) {
    sortOption.value = sortOptions[0].id; // если текущая сортировка не найдется, устанавливаем первую
    return;
  }; // если вдруг текущая сортировка не найдется, выходим
  const nextIndex = (currentIndex + 1) % sortOptions.length; // переключаемся циклично
  sortOption.value = sortOptions[nextIndex].id; // обновляем выбранную сортировку
  emit('update-sort', sortOption.value); // отправляем событие родителю с новой сортировкой
};

watch(sortOption, (newValue) => {
  emit('update-sort', newValue); // при изменении сортировки отправляем событие родителю
});
</script>

<template>
  <div class="pizza-catalog-nav mb-6">
    <!-- Заголовок -->
    <h2 class="catalog-title font-extrabold text-lg lg:text-4xl text-center p-2">Все пиццы</h2>

    <!-- Контейнер для фильтров и сортировки -->
    <div class="nav-controls flex items-center justify-between mt-4 xl:flex-row flex-col gap-4">

      <!-- Список категорий (Табы) -->
      <!-- :class="{ active: activeCategory === category.id }" -->
      <!-- Обёртка для fade-эффекта -->
      <div class="category-wrapper relative w-full">
        <ul class="category-list flex gap-2 rounded-2xl overflow-x-auto w-full">
        <!-- <ul class="category-list flex overflow-x-auto gap-1 flex-nowrap w-full min-w-0"> -->
          <li v-for="category in categories"
          :key="category.id"
          class="category-item whitespace-nowrap"
          :class="[
            'px-4 py-2 cursor-pointer transition',
            activeCategory === category.id
              ? 'bg-white font-semibold'
              : 'hover:bg-orange-400/50'
          ]"
          @click="handleCategoryChange(category.id)">
            {{ category.name }}
          </li>

          <!-- Кнопка "Ещё" (можно сделать выпадающим списком) -->
          <li class="category-item more-btn relative whitespace-nowrap" ref="dropdownRef">
            <button class="more-button" @click.stop="toggleDropdown">
              Ещё <span class="arrow">▼</span></button>
            <!-- Выпадающий список с дополнительными категориями -->
            <ul v-if="isOpen" class="dropdown-menu absolute top-full left-0 mt-2 w-40 px-2 bg-white shadow-lg rounded-lg z-10 border border-gray-200">
              <li class="dropdown-item">Категория 4</li>
              <li class="dropdown-item">Категория 5</li>
              <li class="dropdown-item">Категория 6</li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- /.category-list -->
      <!-- <p>Выбрана сортировка: {{ sortOption }}</p> -->

      <!-- Блок сортировки -->
      <div class="sort-wrapper">
        <!-- Иконка сортировки (как на макете) -->
        <span class="sort-icon cursor-pointer" @click="toggleSort">⇅</span>
        <span class="sort-label">Сортировка:</span>
        <select name="" id="" class="sort-select" v-model="sortOption" @change="emit('update-sort', sortOption)">
          <option value="rating">по рейтингу</option>
          <option value="price_asc">цене (возрастание)</option>
          <option value="price_desc">цене (убывание)</option>
        </select>
        <!-- /#.sort-select -->
      </div>
      <!-- /.sort-wrapper -->
      
    </div>
  </div>
</template>

<style scoped>
.category-list {
  list-style: none;
  padding: 5px 8px;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.05);

  overflow-x: auto;
  overflow-y: hidden;

  scroll-behavior: smooth; /* Плавная прокрутка при клике на категорию */
  scroll-snap-type: x proximity; /* Добавляем плавную прокрутку и "прилипание" к элементам при скролле */

  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  -ms-overflow-style: none;
}
.category-list::-webkit-scrollbar {
  display: none;
}
.category-item {
  /* border-radius: 10px; Скругление как на макете */
  cursor: pointer;
  padding: 5px 8px;
  /* Серый цвет неактивных */
  transition: all 0.2s ease;
  /* background: #f3f3f3; Фон неактивной кнопки */
  flex-shrink: 0; /* Чтобы элементы не сжимались и не переносились на новую строку */
  scroll-snap-align: start; /* "Прилипание" к началу элемента при скролле */
}
/* Блок сортировки */
.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8d8d8d;
  font-size: 16px;
}

.sort-select {
  border: none;
  background: transparent;
  font-size: 16px;
  color: #ff6b00; /* Цвет текста сортировки */
  font-weight: 600;
  cursor: pointer;
  outline: none;
  padding: 5px;
}
/* Убираем стандартную стрелку селекта и делаем свою (опционально) */
.sort-select {
  appearance: none; 
  -webkit-appearance: none;
}

.sort-icon {
  color: #ff6b00;
  font-size: 18px;
}
/* Скрываем скроллбар но оставляем скролл */
.category-list {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}
.category-list::-webkit-scrollbar {
  display: none;             /* Chrome/Safari */
}
@media (max-width: 768px) {
  .category-wrapper::after {
    content: '';

    position: absolute;
    top: 0;
    right: 0;

    width: 40px;
    height: 100%;

    background: linear-gradient(
      to right,
      transparent,
      #fefefe
    );

    pointer-events: none;
  }
}
</style>