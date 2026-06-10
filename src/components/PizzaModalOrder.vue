<script setup>
import cheeseSide from '../assets/images/addons/cheeseSide.png';
import creameMoz from '../assets/images/addons/creameMoz.png';
import chederParm from '../assets/images/addons/chederParm.png';
import { ref, computed, watch } from 'vue'; // Импортируем функцию ref для создания реактивных переменных
// Свойства, которые приходят извне
const props = defineProps({
  isOpenModalOrder: {
    type: Boolean,
    default: true,
  }, // Открыто ли модальное окно
  pizza: {
    type: [Object, null], // разрешаем и Object и null
    required: true,
  }, // Пицца, для которой открывается модальное окно
});
// Состояние выбора
const selectedSize = ref('medium'); // Выбранный размер по умолчанию. Можно изменить на 'small' или 'large'.
const selectedDough = ref('traditional'); // Выбранный тип теста по умолчанию. Можно изменить на 'thin'.
const selectedAddons = ref([]); // Массив для хранения выбранных добавок (по id)

const emit = defineEmits(['close', 'confirm']); // Определяем события для закрытия и подтверждения модального окна

// Настройки размеров и теста
const sizes = [
  { id: 'small', label: 'Маленькая', price: 8.99 },
  { id: 'medium', label: 'Средняя', price: 12.99 },
  { id: 'large', label: 'Большая', price: 15.99 },
];
const doughTypes = [
  { id: 'traditional', label: 'Традиционное' },
  { id: 'thin', label: 'Тонкое' },
];
// Добавки
const addOns = [
  { id: 1, name: 'Сырный бортик', price: 179, image: cheeseSide },
  { id: 2, name: 'Сливочная моцарелла', price: 79, image: creameMoz },
  { id: 3, name: 'Сыры чеддер и пармезан', price: 79, image: chederParm },
];
// Вычисляемая стоимость добавок на основе выбранных пользователем
const addonsPrice = computed(() => {
 return addOns.filter(addon => selectedAddons.value.includes(addon.id)).reduce((total, addon) => total + addon.price, 0);
});
// Вычисляемая общая стоимость заказа с учётом размера, теста и добавок
const totalPricePizza = computed(() => {
  if (!props.pizza || !props.pizza.price) {
    return 0; // Если данных о пицце нет, возвращаем 0
  }
  const sizePrice = sizes.find(size => size.id === selectedSize.value)?.price || 0; // Получаем цену за размер
  const doughPrice = selectedDough.value === 'thin' ? -1 : 0; // Например, тонкое тесто может быть дешевле на 1 доллар
  const basePrice = props.pizza?.price ?? 0; // Базовая цена пиццы
  console.log('🧮 Пересчёт цены:', {
    base: basePrice,
    size: sizePrice,
    dough: doughPrice,
    addons: addonsPrice.value,
  });
  console.log('🔍 props.pizza в модалке:', props.pizza);
  console.log('🔍 Return', sizePrice + doughPrice + addonsPrice.value + basePrice);
  return sizePrice + doughPrice + addonsPrice.value + basePrice; // Общая стоимость заказа
}); // Теперь цена реактивная
// Функции управления выбором
const toggleAddon = (addonId) => {
  console.log(`Триггер функции toggleAddon для добавки с id ${addonId}`);
  if (selectedAddons.value.includes(addonId)) {
    // Если добавка уже выбрана, удаляем ее из массива
    selectedAddons.value = selectedAddons.value.filter(id => id !== addonId);
    console.log(`Добавка с id ${addonId} удалена. Текущий выбор:`, selectedAddons.value);
  } else {
    // Если добавка не выбрана, добавляем ее в массив
    selectedAddons.value.push(addonId);
    console.log(`Добавка с id ${addonId} добавлена. Текущий выбор:`, selectedAddons.value);
  }
};
// 🔥 Добавьте эту функцию
const emitConfirm = () => {
  const result = {
    ...props.pizza,
    img: props.pizza.img || props.pizza.imageUrl,
    price: totalPricePizza.value,
    size: selectedSize.value,
    dough: selectedDough.value,
    addOns: addOns.filter(addon => selectedAddons.value.includes(addon.id))
  };
  console.log('🔥 Отправляем в confirm:', result); // 🔥 Вывод в консоль
  emit('confirm', result);
};

watch(() => props.pizza, () => {
  selectedSize.value = 'medium'; // Сброс размера при смене пиццы
  selectedDough.value = 'traditional'; // Сброс теста при смене пиццы
  selectedAddons.value = []; // Сброс добавок при смене пиццы
}, { immediate: true, deep: true }); // Сброс при первой загрузке и при каждом изменении пиццы
</script>

<template>
  <!-- Overlay (фон затемнения) -->
  <transition name="fade" appear>
    <div v-if="props.isOpenModalOrder" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <!-- Относительный контейнер для позиционирования кнопки -->
      <div class="relative max-w-4xl w-full mx-auto">
        <!-- Кнопка закрытия - теперь вне белого контейнера -->
        <button 
          class="close-btn absolute -top-3 -right-6 w-8 h-8 bg-transparent flex items-center justify-center text-white hover:text-orange-700 z-[99] transition-colors text-2xl" 
          @click="emit('close')"
        >
          ×
        </button>
      <!-- Контейнер модального окна -->
      <div class="bg-white rounded-[30px] shadow-2xl p-6 w-full max-w-4xl mx-auto overflow-hidden max-h-[90vh] flex flex-col md:flex-row md:p-2">
        <!-- Кнопка закрытия -->
        <!-- <button class="close-btn absolute z-[99] -top-2 -right-4 text-white hover:text-orange-700 hover:bg-gray-200 rounded-full text-2xl" @click="emit('close')">×</button> -->
        <!-- Левая часть (картинка) -->
        <div class="cart-drawer-left w-full md:w-1/2 flex items-center justify-center p-8 md:p-2 min-h-[300px]">
          <div class="relative w-full max-w-[300px] aspect-square">
            <!-- <img src="../assets/images/pizza/cheeseChicken1.png" alt="Pizza" class="w-full h-full object-contain rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" /> -->
            <img :src="pizza.imageUrl" :alt="pizza.title" class="w-full h-full object-contain rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
        <!-- Правая часть (информация) -->
        <div class="cart-drawer-right w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <!-- Заголовок -->
          <div class="mb-6">
            <h2 class="cart-drawer-title font-bold text-2xl md:text-3xl text-gray-900 mb-2">{{ pizza.title }}</h2>
            <p class="cart-drawer-description text-gray-500 text-sm">{{ pizza.description }}</p>
          </div>
          <!-- Выбор размера -->
          <div class="mb-4">
            <div class="bg-gray-100 rounded-xl flex mb-2">
              <!-- <button class="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">Маленькая</button>
              <button class="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">Средняя</button>
              <button class="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">Большая</button> -->
              <button v-for="size in sizes" :key="size.id" @click="selectedSize = size.id" class="bg-gray-200 text-gray-900 px-4 py-2 rounded-xl hover:bg-orange-500/50 flex-1 transition-all duration-300 cursor-pointer" :class="selectedSize === size.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'">{{ size.label }}</button>
            </div>
          </div>
          <!-- Выбор теста -->
          <div class="mb-6">
            <div class="bg-gray-100 rounded-xl p-1 flex">
              <!-- <button class="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">Традиционное</button>
              <button class="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200">Тонкое</button> -->
              <button v-for="dough in doughTypes" :key="dough.id" @click="selectedDough = dough.id" class="bg-gray-200 text-gray-900 px-4 py-2 rounded-xl hover:bg-orange-500/50 flex-1 transition-all duration-300 cursor-pointer" :class="selectedDough === dough.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'">{{ dough.label }}</button>
            </div>
          </div>
          <!-- Добавки -->
          <div class="mb-6">
            <h3 class="cart-drawer-subtitle font-bold text-lg mb-3">Добавить по вкусу</h3>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="addon in addOns" 
              :key="addon.id"
              @click="toggleAddon(addon.id)"
              class="bg-white border border-gray-300 rounded-xl p-3 flex flex-col items-center transition-transform duration-300 hover:shadow-lg cursor-pointer hover:border-2 hover:border-orange-500" :class="selectedAddons.includes(addon.id) ? 'border-[#FF6600] ring-1 ring-[#FF6600] bg-orange-50/30' : 'border-gray-200'">
                <div class="relative w-full aspect-square mb-2">
                  <img :src="addon.image" :alt="addon.name" class="w-full h-full object-contain rounded-lg drop-shadow-md hover:scale-105 transition-transform duration-300" />
                  <!-- Иконка галочки при выборе -->
                  <div v-if="selectedAddons.includes(addon.id)" class="absolute top-1 right-1 bg-[#FF6600] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-sm">
                    ✓
                  </div>
                </div>
                <span class="text-[11px] leading-tight text-center text-gray-600 mb-1 line-clamp-2">{{ addon.name }}</span>
                <span class="text-sm font-bold mt-auto text-gray-900">${{ addon.price }}</span>
              </div>
            </div>
          </div>
          <!-- Кнопка добавления в корзину -->
          <div class="mt-auto pt-4">
            <!-- <button class="cart-drawer-add-btn w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-4 py-2 rounded-xl transition-colors duration-300 shadow-lg shadow-orange-500/30" @click="emit('confirm', {
              ...props.pizza, // сохраняем все исходные поля пиццы (id, name, price, img и т.д.)
              img: props.pizza.img || props.pizza.imageUrl, // используем поле img для анимации, если его нет, берем imageUrl
              price: totalPricePizza.value, // обновляем цену на общую стоимость с учётом размера, теста и добавок
              size: selectedSize.value, // добавляем выбранный размер
              dough: selectedDough.value, // добавляем выбранный тип теста
              // addOns: selectedAddons // добавляем массив выбранных добавок (по id)
              addOns: addOns.filter(addon => selectedAddons.includes(addon.id)) // добавляем массив выбранных добавок с полными данными (id, name, price, image)
            })">Добавить в корзину за ${{ totalPricePizza.toFixed(2) }}</button> -->
            <!-- 🔥 -->
            <button class="cart-drawer-add-btn w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-4 py-2 rounded-xl transition-colors duration-300 shadow-lg shadow-orange-500/30" @click="emitConfirm">Добавить в корзину за ${{ totalPricePizza.toFixed(2) }}</button>
          </div>       
        </div>
      </div>
      </div>

    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>