<script setup>
// import { ref } from 'vue';
// import MyHello from './components/MyHello.vue';
import HeaderVue from './components/HeaderVue.vue';
import PizzaNav from './components/PizzaNav.vue';
import ProductCartList from './components/ProductCartList.vue';
import DrawerCart from './components/DrawerCart.vue';
import PizzaModalOrder from './components/PizzaModalOrder.vue';
import LoginModal from './components/LoginModal.vue';
import DisplayModalSms from './components/DisplayModalSms.vue';
import { ref, computed, nextTick, watch } from 'vue';
// import ProductCart from './components/ProductCart.vue';
// 🚀 App.vue
// └─ headerRef.value          → экземпляр HeaderVue
//    └─ cartButton           → ref(null), объявленный в Header
//       └─ value             → сам DOM-элемент <button>
const headerRef = ref(null); // Экземпляр всего компонента <HeaderVue>
// Данные для передачи в дочерний компонент
// const message = ref('Привет из родителя!'); // создаём реактивную переменную для хранения сообщения, т.е. локальную переменную (копию), которая может изменяться и при этом Vue будет отслеживать эти изменения и обновлять интерфейс при необходимости

// Функция для обработки события от дочернего компонента
// const handleUpdate = (data) => {
//   console.log('Получены данные от MyHello:', data);
//   message.value = data; // Обновляем сообщение, полученное от дочернего компонента
//   console.log('message после изменения:', message); // Выводим в консоль объект ref, который содержит новое значение в свойстве value
// };
const isCartOpen = ref(false); // храним состояние открытости корзины, по умолчанию она закрыта
const cartItems = ref([]); // храним массив товаров в корзине, по умолчанию он пустой
const searchQuery = ref(''); // храним строку поискового запроса, по умолчанию она пустая
const sortOption = ref('rating'); // храним выбранную опцию сортировки, по умолчанию сортировка по рейтингу
const activeCategory = ref('all'); // храним выбранную категорию, по умолчанию выбрана категория "Все"
const isOpenModalOrder = ref(false); // храним состояние открытости модального окна заказа, по умолчанию оно закрыто
const selectedPizza = ref(null); // храним данные выбранной пиццы для отображения в модальном окне заказа (чтобы передать данные в модалку), по умолчанию нет выбранной пиццы
const isOpenLoginModal = ref(false); // храним состояние открытости модального окна логина, по умолчанию оно закрыто
const isOpenSmsModal = ref(false); // храним состояние открытости модального окна SMS-кода, по умолчанию оно закрыто
// ✅ Добавляем состояние для хранения сгенерированного кода из LoginModal.vue, чтобы потом передать его в DisplayModalSMS.vue для проверки правильности введённого кода пользователем
const generatedSMSCode = ref(''); // храним сгенерированный код из LoginModal.vue, который должен прийти пользователю в SMS, по умолчанию он пустой
const userPhone = ref(''); // храним отформатированный номер телефона из LoginModal.vue, по умолчанию он пустой
const isAuthenticated = ref(false); // храним состояние аутентификации пользователя, по умолчанию пользователь не аутентифицирован
const currentUser = ref(null); // храним данные текущего аутентифицированного пользователя, по умолчанию нет аутентифицированного пользователя
// ✅ Функция открытия LoginModal.vue при клике на кнопку "Войти" в Header.vue
const openLoginModal = () => {
  isOpenLoginModal.value = true; // открываем модальное окно логина
  console.log('Модальное окно логина открыто');
}
// ✅ Функция после отправки SMSкода в LoginModal.vue, которая будет получать сгенерированный код и отформатированный номер телефона от LoginModal.vue и сохранять их в реактивные переменные, чтобы потом передать эти данные в DisplayModalSMS.vue для проверки правильности введённого кода пользователем
const handleSendCode = ({ code, phone }) => {
  generatedSMSCode.value = code; // сохраняем сгенерированный код из LoginModal.vue, который должен прийти пользователю в SMS в реактивную переменную, чтобы потом передать этот код в DisplayModalSMS.vue для проверки правильности введённого кода пользователем
  userPhone.value = phone; // сохраняем отформатированный номер телефона из LoginModal.vue в реактивную переменную, чтобы потом передать этот номер в DisplayModalSMS.vue для проверки правильности введённого кода пользователем

  // закрываем первую модалку логина и открываем вторую модалку для ввода SMS-кода
  isOpenLoginModal.value = false; // закрываем модальное окно логина
  isOpenSmsModal.value = true; // открываем модальное окно для ввода SMS-кода
};
const handleSuccessLogin = (userData) => {
  isAuthenticated.value = true; // устанавливаем состояние аутентификации пользователя в true, чтобы показать его имя в шапке вместо кнопки "Войти"
  currentUser.value = userData; // сохраняем данные аутентифицированного пользователя в реактивную переменную, чтобы потом использовать эти данные для отображения информации о пользователе в шапке или для других целей
  console.log('Пользователь успешно аутентифицирован');
};
const updateQuantity = ({ id, quantity }) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item) {
    item.quantity = quantity; // обновляем количество товара в корзине
    console.log('Количество товара обновлено:', { id, quantity });
    console.log('Текущие товары в корзине:', cartItems.value);
  }
}
const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id); // удаляем товар из корзины по его id
  console.log('Товар удалён из корзины:', id);
  console.log('Текущие товары в корзине:', cartItems.value);
}
// Создаём отдельную функцию для открытия модального окна заказа, чтобы передать в неё данные выбранной пиццы
const openPizzaModal = (pizza) => {
  // Когда пользователь кликает на кнопку "Добавить" в компоненте ProductCart.vue, он вызывает эту функцию и передаёт данные о пицце, которую он хочет заказать. Мы сохраняем эти данные в реактивную переменную selectedPizza, чтобы потом передать их в модальное окно заказа и отобразить информацию о выбранной пицце там.
  // 💥 Когда открываешь модалку
  selectedPizza.value = pizza; // сохраняем данные выбранной пиццы в реактивную переменную, чтобы потом передать эти данные в модальное окно заказа
  isOpenModalOrder.value = true; // открываем модальное окно заказа
  console.log('💥 Модальное окно заказа открыто для пиццы:', pizza);
}
const handleConfirmorder = (pizza) => {
  console.log('🔍 Получено из модалки:', pizza); // 👈 Смотрим, есть ли price
  isOpenModalOrder.value = false; // закрываем модальное окно заказа после подтверждения заказа
  animateToCart(pizza.img); // запускаем анимацию "летающей пиццы" при подтверждении заказа в модальном окне
  const existingItem = cartItems.value.find(item => item.id === pizza.id); // проверяем, есть ли уже такой товар в корзине по его id
  if (!existingItem) {
    cartItems.value.push({
      ...pizza,
      quantity: 1,
      price: pizza.price, // устанавливаем цену из данных, полученных из модального окна заказа (в которых уже учтены выбранные размер, тесто и добавки) 🔥 Используем обновлённую цену из модалки
    }); // добавляем новый товар в массив cartItems, используя метод push, и устанавливаем его количество равным 1
  } else {
    existingItem.quantity += 1; // если товар уже есть в корзине, увеличиваем его количество на 1
    existingItem.price = pizza.price; // 🔥 обновляем цену товара в корзине на новую цену из модалки, если товар уже есть в корзине
  }
  console.log('Товар добавлен в корзину из модального окна заказа:', pizza);
  console.log('Текущие товары в корзине:', cartItems.value);
  console.log('🔥 Цена из модалки:', pizza.price);
  console.log('🔥 Текущие товары в корзине:', cartItems.value);
}
const addToCart = (pizza) => {
  console.log(pizza.img); // получаем ссылку на изображение пиццы из переданных данных при клике на кнопку "Добавить" в компоненте ProductCart.vue
  animateToCart(pizza.img); //🔥 анимация запускаем анимацию "летающей пиццы" при добавлении товара в корзину
  const existingItem = cartItems.value.find(item => item.id === pizza.id); // проверяем, есть ли уже такой товар в корзине по его id
  if (!existingItem) {
    // cartItems.value.push(pizza); // добавляем новый товар в массив cartItems, используя метод push
    cartItems.value.push({ ...pizza, quantity: 1 }); // добавляем новый товар в массив cartItems, используя метод push, и устанавливаем его количество равным 1
  } else {
    existingItem.quantity += 1; // если товар уже есть в корзине, увеличиваем его количество на 1
  }
  console.log('Товар добавлен в корзину:', pizza);
  console.log('Текущие товары в корзине:', cartItems.value);
}
console.log(addToCart);
// 🚀 Шаг 4. Делаем функцию “летающей пиццы”
const animateToCart = async (imgRef) => {
  // const img = event.target.closest('.cart-img')?.querySelector('img'); // находим изображение пиццы, от которого был клик
  const img = imgRef?.value || imgRef; // получаем DOM-элемент изображения пиццы из переданной ссылки (ref) в компоненте ProductCart.vue
  if (!img) return; // если изображение не найдено, выходим из функции
  // const cartButton = headerRef.value?.cartButton?.value; // получаем ссылку на кнопку корзины из HeaderVue через ref
  await nextTick(); // ждём, пока DOM обновится и кнопка корзины будет доступна для получения её координат
  // Vue 3.3+ автоматически "разворачивает" ref при доступе!
  // 🔥 Vue 3.3+ auto-unwraps exposed refs, so cartButton is already the DOM element, not a ref object. Поэтому мы можем обращаться к cartButton напрямую без .value.
  const cartButton = headerRef.value?.cartButton; // получаем ссылку на кнопку корзины из HeaderVue через ref
  console.log('🔍 Тип cartButton:', cartButton?.constructor?.name); // Проверяем тип cartButton
  console.log('cartButton:', cartButton); // Проверяем что кнопка не undefined
  if (!cartButton) return; // если кнопка корзины не найдена, выходим из функции
  const imgRect = img.getBoundingClientRect(); // получаем координаты изображения пиццы
  const cartRect = cartButton.getBoundingClientRect(); // получаем координаты кнопки корзины
  const flyingImg = img.cloneNode(true); // создаём клона изображения пиццы
  // 🔥 Настраиваем стили клона для анимации
  // flyingImg.style.position = 'fixed'; // устанавливаем позицию клона как fixed, чтобы он мог свободно перемещаться по экрану
  // flyingImg.style.left = `${imgRect.left}px`; // устанавливаем начальную позицию клона по горизонтали, совпадающую с позицией оригинального изображения
  // flyingImg.style.top = `${imgRect.top}px`; // устанавливаем начальную позицию клона по вертикали, совпадающую с позицией оригинального изображения
  // flyingImg.style.zIndex = '1000'; // устанавливаем высокий z-index, чтобы клон был поверх других элементов
  // flyingImg.style.width = `${imgRect.width}px`; // устанавливаем ширину клона, совпадающую с шириной оригинального изображения
  // flyingImg.style.height = `${imgRect.height}px`; // устанавливаем высоту клона, совпадающую с высотой оригинального изображения
  // flyingImg.style.pointerEvents = 'none'; // отключаем события мыши для клона, чтобы он не мешал кликам по другим элементам
  // flyingImg.style.transition = 'all 0.5s ease-in-out'; // добавляем плавный переход для анимации
  // =================================================================================
  // 🔥 Альтернативный способ установки стилей клона с помощью Object.assign для более компактного кода
  Object.assign(flyingImg.style, {
    position: 'fixed',
    left: `${imgRect.left}px`,
    top: `${imgRect.top}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    zIndex: 1000,
    pointerEvents: 'none',
    transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
  });
  // 1. Создаём клон и добавляем в DOM
  document.body.appendChild(flyingImg); // добавляем клон изображения в тело документа
  // 🔥 ВАЖНО: заставляем браузер применить стартовые стили
  // flyingImg.getBoundingClientRect(); // принудительно запрашиваем геометрию клона, чтобы браузер применил стартовые стили и был готов к анимации
  // 🔥 форсим рендер
  flyingImg.offsetWidth;
  //🎯  requestAnimationFrame (RAF) — это браузерный API, который синхронизирует ваш код с частотой обновления экрана (обычно 60 кадров/сек).
  // 2. 🎧 "Вешаем уши" на элемент: ждём окончания анимации
  // 🔑 Важно: Слушатель нужно добавить до изменения стилей, иначе можно пропустить событие.
  flyingImg.addEventListener('transitionend', () => {
    flyingImg.remove(); // удаляем клон изображения после завершения анимации
  });
  // 3. 🚀 Запускаем анимацию (браузер начинает отсчёт)
  requestAnimationFrame(() => {
    // flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - imgRect.width / 2}px`; // устанавливаем конечную позицию клона по горизонтали, центрируя его относительно кнопки корзины
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`; // устанавливаем конечную позицию клона по горизонтали, центрируя его относительно кнопки корзины
    // flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - imgRect.height / 2}px`; // устанавливаем конечную позицию клона по вертикали, центрируя его относительно кнопки корзины
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`; // устанавливаем конечную позицию клона по вертикали, центрируя его относительно кнопки корзины
    flyingImg.style.width = '0px'; // уменьшаем ширину клона до 0, чтобы создать эффект исчезновения
    flyingImg.style.height = '0px'; // уменьшаем высоту клона до 0, чтобы создать эффект исчезновения
    flyingImg.style.opacity = '0.5'; // уменьшаем непрозрачность клона, чтобы создать эффект исчезновения
    //🎯 transition: all 0.5s → браузер знает: "через ~500мс надо вызвать transitionend"
  });
  
  setTimeout(() => {
    flyingImg.remove(); // удаляем клон изображения через 1 секунду на всякий случай, если событие transitionend не сработает
  }, 1000); 
}

// Высчитываем общую сумму заказа в корзине
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    console.log(`Подсчёт товара: ${item.title}, цена: ${item.price}, количество: ${item.quantity}`); // выводим в консоль информацию о каждом товаре при подсчёте общей суммы
    return sum + item.price * item.quantity; // для каждого товара умножаем его цену на количество и добавляем к общей сумме
  }, 0);
})
// Высчитываем 5% налог от общей суммы заказа
const tax = computed(() => {
  return totalPrice.value * 0.05; // умножаем общую сумму заказа на 0.05, чтобы получить налог
})

const totalCountHeader = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    console.log(`Подсчёт товара: ${item.title}, количество: ${item.quantity}`); // выводим в консоль информацию о каждом товаре при подсчёте общего количества
    return sum + item.quantity; // для каждого товара добавляем его количество к общему количеству товаров в корзине
  }, 0);
})

// Функция для очистки корзины после оформления заказа
const clearCartFunction = () => {
  cartItems.value = []; // очищаем массив товаров в корзине, устанавливая его в пустой массив
  console.log('Корзина очищена');
  console.log('Текущие товары в корзине:', cartItems.value);
}

// сброс категории при поиске:
watch(searchQuery, (newValue) => {
  if (newValue) {
    activeCategory.value = 'all'; // сбрасываем категорию на "Все" при вводе поискового запроса
  }
});
</script>

<template>
  <!-- <h1>You did it!</h1>
  <h2>My project</h2>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <MyHello :msg="'Hello from MyHello component!'" />
  <MyHello :msg="message" @my-event="handleUpdate" />
    <div class="bg-red-500 text-white p-10 text-3xl">
      Tailwind работает 🚀
    </div> -->
    <DrawerCart  v-if="isCartOpen" :items="cartItems" :total-price="totalPrice" :tax-value="tax" @close="isCartOpen = false" @update-quantity="updateQuantity" @remove="removeItem" @clear-cart="clearCartFunction"/>
    <!-- Модальные окна -->
    <PizzaModalOrder :is-open-modal-order="isOpenModalOrder" :pizza="selectedPizza" @close="isOpenModalOrder = false" @confirm="handleConfirmorder"/>
    <LoginModal :is-open-login-modal-props="isOpenLoginModal" @close="isOpenLoginModal = false" @send-code="handleSendCode"/>
    <DisplayModalSms 
      :is-open-sms-modal-props="isOpenSmsModal" 
      :generate-code-props="generatedSMSCode" 
      :phone-props="userPhone" 
      @close="isOpenSmsModal = false" 
      @success-login="handleSuccessLogin"/>
    <div class="bg-surface h-auto m-auto p-[15px]">
      <div class="background bg-white rounded-[30px] p-[10px]">
        <HeaderVue ref="headerRef" 
        @open-cart="isCartOpen = !isCartOpen" 
        @update-search="(value) => searchQuery = value" 
        @open-login="openLoginModal" 
        :total-count="totalCountHeader" 
        :total-price="totalPrice"
        :is-auth="isAuthenticated"
        :current-user = "currentUser"
        />
        <!-- 🔥 добавляем обработчик события update-sort для получения выбранной опции сортировки от компонента PizzaNav. Передаём опцию сортировки в компонент PizzaNav -->
        <PizzaNav @update-sort="(value) => sortOption = value" @update-category="(value) => activeCategory = value" />
        <!-- передаём строку поискового запроса и выбранную опцию сортировки в компонент ProductCartList для фильтрации и сортировки списка товаров -->
        <ProductCartList @add-to-cart="openPizzaModal" :search-query-product="searchQuery" :sort-option-product="sortOption" :category="activeCategory"/>
      </div>
      
    </div>

</template>

<style scoped>
</style>
