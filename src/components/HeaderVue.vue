<script setup>
// Переключение профиля dropdown
// const profileDropdown = document.getElementById('profile-dropdown');
// const dropdownMenu = profileDropdown.querySelector('.dropdown');
// profileDropdown.addEventListener('click', () => {
//   dropdownMenu.classList.toggle('hidden');
// });
// // Закрытие при клике вне dropdown
// document.addEventListener('click', (event) => {
//   if (!profileDropdown.contains(event.target)) {
//     dropdownMenu.classList.add('hidden');
//   }
// });
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
const props = defineProps({
  totalCount: Number, // получаем количество товаров в корзине от родителя, чтобы отображать его в бейдже
  totalPrice: Number, // получаем общую сумму заказа в корзине от родителя, чтобы отображать её в шапке рядом с количеством товаров
  isAuth: Boolean, // получаем состояние авторизации пользователя от родителя, чтобы при клике на кнопку профиля открывать либо dropdown, либо модальное окно логина
  currentUser: Object, // получаем данные текущего аутентифицированного пользователя от родителя, чтобы отображать его имя в шапке вместо кнопки "Войти" при успешной аутентификации
});

const isOpen = ref(false);
const dropdownRef = ref(null); // production-вариант (с кликом вне)
const isBouncing = ref(false); // для анимации пульсации бейджа при добавлении товара в корзину
const cartButton = ref(null); // ссылка на кнопку корзины
const search = ref(''); // для хранения строки поискового запроса, которую мы будем отправлять в родительский компонент при изменении
let timeoutId = null; // для хранения идентификатора таймаута, чтобы можно было его очистить при необходимости
// const isAuth = ref(false); // для хранения состояния авторизации пользователя, по умолчанию false (не авторизован)

// defineExpose — это макрос, который явно открывает доступ к внутренним свойствам или методам компонента для родителя.
// defineExpose позволяет нам экспонировать определённые переменные или функции из дочернего компонента, чтобы родительский компонент мог к ним обращаться.В данном случае мы хотим, чтобы родительский компонент мог обращаться к cartButton, чтобы, например, фокусироваться на ней при открытии корзины. 
defineExpose({
  cartButton, // Экспонируем ссылку на кнопку корзины, чтобы родительский компонент мог к ней обращаться и, например, фокусироваться при открытии корзины
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value; // переключаем состояние видимости dropdown при клике на кнопку профиля

  // Потому что dropdown не должен открывать login.
  //  emit('open-login'); // отправляем событие в родителя, что нужно открыть модальное окно логина
};
const emit = defineEmits(['open-cart', 'update-search', 'open-login']); // отправляем событие в родителя, что корзина открыта
// const closeDropdown = (event) => {
//   if (!event.target.closest('#profile-dropdown')) {
//     isOpen.value = false;
//   }
// };
const handleClickOutside = (event) => {
  if (!dropdownRef.value) return;
  if (!dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};
console.log('isOpen', isOpen.value);
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside);
// });
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
//🔥 watch используют, когда нужно: 1.Делать запрос на сервер при изменении значения.2.Сохранять данные в localStorage.3.Запускать анимацию.4.Реагировать на изменение props.5.Делать side effects
watch(isOpen, (newValue, oldValue) => {
  console.log('Dropdown изменился');
  console.log('Было:', oldValue);
  console.log('Стало:', newValue);
});

watch(() => props.totalCount, (newValue, oldValue) => {
  if (newValue > oldValue) {
    isBouncing.value = true; // запускаем анимацию пульсации
    setTimeout(() => {
      isBouncing.value = false; // останавливаем анимацию через 300ms
    }, 300);
  }
});

// watch(search, (newValue) => {
//   emit('update-search', newValue); // отправляем новое значение поискового запроса в родительский компонент
// });

watch(search, (value) => {
  if (timeoutId) {
    clearTimeout(timeoutId); // очищаем предыдущий таймаут, если он существует
  }
  timeoutId = setTimeout(() => {
    emit('update-search', value); // отправляем новое значение поискового запроса в родительский компонент
  }, 300); // задержка в 300 мс
});

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId); // очищаем таймаут при размонтировании компонента, чтобы избежать утечек памяти. ✅ очистка при удалении компонента
  }
});
</script>

<template>
  <div class="header p-[10px] pb-5 border-b border-gray-400">
    <!-- <h1>Best Pizza</h1> -->
    <div class="container mx-auto">
      <header class="header flex items-center justify-between px-8">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3">
          <img src="../assets/images/logo.png" alt="Best Pizza Logo" class="logo h-10 w-10" />
          <div>
            <h1 class="text-xl font-bold text-black tracking-wider">NEXT PIZZA</h1>
            <p class="text-gray-500">вкуснее уже не будет</p>
          </div>
        </a>
        <!-- Search -->
         <div class="search flex-1 max-w-xl mx-8">
          <div class="relative">
            <input 
              v-model="search" 
              type="text" placeholder="Поиск пиццы..." 
              class="search-input bg-gray-100 shadow-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10 pr-4 py-2 w-full" />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.48674 5.25469e-09C7.69591 -4.8654e-05 8.88103 0.337848 9.90836 0.975558C10.9357 1.61327 11.7643 2.52541 12.3008 3.60904C12.8372 4.69267 13.0601 5.90466 12.9443 7.10823C12.8284 8.31181 12.3785 9.45905 11.6453 10.4205L15.7477 14.5245C15.9028 14.6802 15.9929 14.889 15.9996 15.1087C16.0063 15.3283 15.9292 15.5423 15.7838 15.7071C15.6385 15.8719 15.4358 15.9753 15.2171 15.9961C14.9983 16.0169 14.7798 15.9537 14.606 15.8193L14.5247 15.7475L10.4205 11.6452C9.60141 12.2698 8.64535 12.6903 7.63144 12.872C6.61754 13.0537 5.57494 12.9914 4.58992 12.6901C3.60489 12.3889 2.70577 11.8574 1.96693 11.1397C1.2281 10.422 0.670807 9.53868 0.341162 8.56283C0.0115182 7.58698 -0.0809972 6.54665 0.0712713 5.52795C0.22354 4.50924 0.616214 3.54143 1.2168 2.70462C1.81739 1.8678 2.60863 1.18602 3.52504 0.715706C4.44145 0.24539 5.45668 5.43643e-05 6.48674 5.25469e-09ZM6.48674 1.72983C5.22505 1.72983 4.01504 2.23102 3.1229 3.12314C2.23075 4.01525 1.72955 5.22522 1.72955 6.48687C1.72955 7.74851 2.23075 8.95849 3.1229 9.8506C4.01504 10.7427 5.22505 11.2439 6.48674 11.2439C7.74843 11.2439 8.95844 10.7427 9.85058 9.8506C10.7427 8.95849 11.2439 7.74851 11.2439 6.48687C11.2439 5.22522 10.7427 4.01525 9.85058 3.12314C8.95844 2.23102 7.74843 1.72983 6.48674 1.72983Z" fill="#ADADAD"/>
            </svg>
          </div>
         </div>
        <!-- Profile and cart  -->
        <div class="profile-cart flex items-center gap-6">
          <!-- profile with dropdown -->
          <div class="profile-dropdown relative" ref="dropdownRef" id="profile-dropdown">
            <button @click.stop="isAuth ? toggleDropdown() : emit('open-login')" class="flex items-center gap-2 focus:outline-none py-2 px-4 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors duration-200">
              <template v-if="isAuth && currentUser">
                <div class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  {{ currentUser.name.charAt(0).toUpperCase() }}
                </div>
                <span>{{ currentUser.name }}</span>
              </template>
              <template v-else>
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.3206 13.2502V11.8613C11.3206 11.1246 11.0421 10.418 10.5466 9.89709C10.051 9.37615 9.3788 9.0835 8.67793 9.0835H3.39264C2.69177 9.0835 2.0196 9.37615 1.52401 9.89709C1.02842 10.418 0.75 11.1246 0.75 11.8613V13.2502" stroke="#FE5F00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.03522 6.30556C7.49471 6.30556 8.67787 5.0619 8.67787 3.52778C8.67787 1.99365 7.49471 0.75 6.03522 0.75C4.57573 0.75 3.39258 1.99365 3.39258 3.52778C3.39258 5.0619 4.57573 6.30556 6.03522 6.30556Z" stroke="#FE5F00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Профиль</span>
              </template>
            </button>
            <!-- Dropdown -->
            <div v-if="isOpen" class="dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <a href="/settings" class="block px-4 py-2 text-sm hover:bg-gray-100">Настройки</a>
              <a href="/orders" class="block px-4 py-2 text-sm hover:bg-gray-100">Заказы</a>
              <a href="/logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Выйти</a>
            </div>
          </div>
          <!-- /.profile -->
          <!-- cart -->
          <div class="relative">
            <!-- ref="cartButton" Это ссылка на кнопку корзины -->
            <button ref="cartButton" @click="emit('open-cart')" class="p-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-all duration-300 ease-in-out origin-center cursor-pointer" :class="isBouncing ? 'scale-125 shadow-lg bg-orange-50 ' : 'scale-100'">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.41683 15.4167C6.15321 15.4167 6.75016 14.8197 6.75016 14.0833C6.75016 13.347 6.15321 12.75 5.41683 12.75C4.68045 12.75 4.0835 13.347 4.0835 14.0833C4.0835 14.8197 4.68045 15.4167 5.41683 15.4167Z" stroke="#FE5F00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.4168 15.4167C14.1532 15.4167 14.7502 14.8197 14.7502 14.0833C14.7502 13.347 14.1532 12.75 13.4168 12.75C12.6805 12.75 12.0835 13.347 12.0835 14.0833C12.0835 14.8197 12.6805 15.4167 13.4168 15.4167Z" stroke="#FE5F00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.86333 4.08333H15.4167L14.2967 9.67667C14.2357 9.9836 14.0687 10.2593 13.825 10.4555C13.5812 10.6518 13.2762 10.756 12.9633 10.75H5.91667C5.59112 10.7528 5.27582 10.6363 5.0302 10.4226C4.78459 10.209 4.62564 9.91279 4.58333 9.59L3.57 1.91C3.52798 1.58949 3.37095 1.29516 3.12813 1.08178C2.88532 0.868395 2.57325 0.750489 2.25 0.75H0.75" stroke="#FE5F00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <!-- Бейдж -->
            <!-- <span v-if="totalCount > 0" class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{{ totalCount }}</span> -->
            <span v-if="totalCount > 0" class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">{{ totalCount }}</span>
            <span v-if="totalPrice > 0" @click="emit('open-cart')" class="absolute -bottom-2 -left-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded cursor-pointer">$ {{ totalPrice }}</span>
          </div>
        </div>
      </header>
    </div>
    <!-- /.container -->
  </div>
</template>

<style scoped>
</style>