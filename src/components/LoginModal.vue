<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification'; // импортируем функцию useToast из библиотеки vue-toastification для отображения уведомлений
import defaultUsers from '@/data/baseaccount'; // импортируем базу
const toast = useToast(); // создаем экземпляр toast для использования в компоненте
const props = defineProps({
  isOpenLoginModalProps: {
    type: Boolean,
    default: false, // лучше явно указать false, чтобы модалка не выскакивала сама
  }, // получаем состояние открытости модального окна логина от родителя
});
const emit = defineEmits(['close', 'send-code']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "закрыть модальное окно"
const phone = ref(''); // для хранения введённого номера телефона
const userName = ref(''); // для хранения введённого имени пользователя
const userEmail = ref(''); // для хранения введённого email пользователя
// const enterCode = ref(''); // для хранения введённого кода из SMS
// console.log(enterCode.value); // выводим введённый код в консоль для проверки
const generatedCode = ref(''); // для хранения сгенерированного кода, который будет отправлен пользователю (для демонстрации)
const users = ref(JSON.parse(localStorage.getItem('users')) || defaultUsers); // для хранения списка пользователей из базы данных (для демонстрации)
// Функция форматирования
const formatPhoneNumber = (value) => {
  // Удаляем все нецифровые символы. Оставляем только цифры для дальнейшего форматирования.
  const digits = value.replace(/\D/g, '');
  // Форматируем номер в виде +3 (921) XXX-XX-XX
  // const formatted = digits.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
  if (!digits) return '';
  
  const prefix = '4'; // замените на '7' для РФ, '380' для Украины и т.д.
  
  // Прогрессивное форматирование по мере ввода
  if (digits.length <= 1) return `+${prefix}${digits}`;
  if (digits.length <= 4) return `+${prefix} (${digits.slice(1)}`;
  if (digits.length <= 7) return `+${prefix} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `+${prefix} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+${prefix} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  // return formatted;
};
// Функция для обработки правильности ввода номера телефона
// Фильтруем ввод: оставляем только цифры, ограничиваем длину до 11 символов (для формата +3 (921) XXX-XX-XX)
const handlePhoneInput = (event) => {
  // Удаляем всё, кроме цифр
  let value = event.target.value.replace(/\D/g, '');
  // Ограничиваем длину до 11 символов
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  phone.value = formatPhoneNumber(value); // Обновляем значение с отформатированным номером
};
// Фейковая генерация кода для демонстрации (в реальной жизни код должен генерироваться на сервере и отправляться пользователю)
const sendCode = () => {
  if(!isFormValid.value) return; // Если форма не валидна, не отправляем код
  const code = Math.floor(1000 + Math.random() * 9000).toString(); // Генерируем случайный 4-значный код
  generatedCode.value = code; // Сохраняем сгенерированный код
  // Проверяем есть ли пользователь
  const existingUser = users.value.find(user => user.phone === getCleanPhoneNumber()); // Ищем пользователя по чистому номеру телефона
  if (existingUser) {
    // обновляем код
    existingUser.code = code; // Обновляем код для существующего пользователя
    // 🔥 обязательно сохраняем
    localStorage.setItem('users', JSON.stringify(users.value)); // Сохраняем обновленный массив пользователей в localStorage
  } else {
    // создаём нового пользователя
    const newUser = {
      id: Date.now(), // Генерируем уникальный ID на основе текущего времени
      phone: getCleanPhoneNumber(), // Сохраняем чистый номер телефона
      name: userName.value.trim(), // Сохраняем имя пользователя
      email: userEmail.value.trim(), // Сохраняем email пользователя
      code, // Сохраняем сгенерированный код
    };
    users.value.push(newUser); // Добавляем нового пользователя в массив
    localStorage.setItem('users', JSON.stringify(users.value)); // Сохраняем обновленный массив пользователей в localStorage
  }
  
  console.log('Generated Code SMS (for demo):', code); // Выводим код в консоль для проверки

  // Опционально: показать тост о том, что код "отправлен"
  toast.info(`Код для входа: ${code} (для демонстрации)`); // Показываем код в виде уведомления (для демонстрации)
  // 👇 отправляем код родителю
  emit('send-code', {
    code, // отправляем сгенерированный код, который должен прийти пользователю в SMS
    phone: phone.value, // отправляем также отформатированный номер телефона, если нужно
    userName: userName.value, // отправляем имя пользователя
    userEmail: userEmail.value, // отправляем email пользователя
  }); // Передаем сгенерированный код родителю через событие 'send-code'
  phone.value = ''; // Очищаем поле ввода после отправки кода
  userName.value = ''; // Очищаем поле имени после отправки кода
  userEmail.value = ''; // Очищаем поле email после отправки кода
};
// Делаем функцию оформления SMS
// const handleSMS = () => {
//   if (enterCode.value === generatedCode.value) {
//     toast.success(`Вы успешно вошли в аккаунт! 🎉`); // Показываем уведомление об успехе при правильном коде
//     emit('close'); // Закрываем модальное окно после успешного входа
//   } else {
//     toast.error('Неверный код! Пожалуйста, попробуйте снова.'); // Показываем уведомление об ошибке при неправильном коде
//   };
  
// };
// console.log('Display the sendCode', handleSMS); // Выводим функцию отправки кода в консоль для проверки
// Вычисляемое свойство: количество цифр в номере
const digitsCount = computed(() => {
  return phone.value.replace(/\D/g, '').length; // Считаем только цифры
});
// Валиден ли номер для отправки
const isPhoneValid = computed(() => {
  return digitsCount.value === 11; // Номер валиден, если содержит ровно 11 цифр
});
// 🔥 Для отправки на сервер — функция очистки от форматирования
const getCleanPhoneNumber = () => {
  return phone.value.replace(/\D/g, ''); // Удаляем все нецифровые символы для получения чистого номера
};
console.log(getCleanPhoneNumber()); // Выводим чистый номер в консоль для проверки
const isNameValid = computed(() => {
  return /^[A-Za-zА-Яа-яЁёІіЇїЄє\s]{2,}$/.test(userName.value.trim()); // Имя должно содержать только буквы и пробелы, минимум 2 символа
});
const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value.trim()); // Простая проверка формата email
});
const isFormValid = computed(() => {
  return isPhoneValid.value && isNameValid.value && isEmailValid.value; // Форма валидна, если все поля корректны
});
</script>

<template>
  <!-- Overlay (фон затемнения) -->
   <transition name="fade" appear>
    <div v-if="props.isOpenLoginModalProps" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <!-- Относительный контейнер для позиционирования кнопки -->
      <div class="relative max-w-4xl w-full mx-auto">
        <!-- Кнопка закрытия - теперь вне белого контейнера -->
         <button 
          class="close-btn absolute -top-2 -right-[-12rem] w-8 h-8 bg-transparent flex items-center justify-center text-white hover:text-orange-700 z-[99] transition-colors text-2xl" 
          @click="emit('close')"
        >
          ×
        </button>
        <!-- Контейнер модального окна -->
        <div class="bg-white rounded-[30px] shadow-2xl p-3 w-full max-w-[380px] overflow-hidden mx-auto max-h-[90vh] flex flex-col">
          <!-- Скролл-контент -->
          <div class="flex-1 overflow-y-auto p-2">
            <!-- PHONE -->
            <div class="flex justify-between">
              <!-- Левая часть - информация -->
              <div class="cart-drawer-left p-2 flex flex-col flex-1">
                <!-- Заголовок -->
                <div class="mb-6">
                  <h2 class="cart-drawer-title font-bold text-2xl md:text-3xl text-gray-900 mb-2">Вход в аккаунт</h2>
                  <p class="cart-drawer-description text-gray-500 text-sm">Введите номер телефона, чтобы войти или зарегистрироваться</p>
                  <input type="tel" pattern="[0-9]{11}" autocomplete="tel" inputmode="numeric" v-model="phone" @input="handlePhoneInput" placeholder="+3 (___) ___-__-__"  class="w-full mt-4 p-3 border border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" />
                  <!-- Опционально: сообщение об ошибке -->
                  <p v-if="phone.length > 0 && !isPhoneValid" class="text-red-500 text-sm mt-2">Пожалуйста, введите корректный номер телефона</p>
                </div>
                <!-- /.mb-6 -->
              </div>
              <!-- Левая часть - end -->
              <!-- Правая часть - картинка -->
              <div class="cart-drawer-right p-4 aspect-square">
                <img src="../assets/images/modal/modalLogin.png" alt="Login Image" class="w-[60px] h-[60px] object-cover rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" />
              </div>
              <!-- Правая часть - end -->
            </div>
            <!--  -->
            <!-- NAME -->
            <div class="flex mt-auto justify-between">
              <!-- Левая часть - информация -->
              <div class="cart-name mb-6 p-2 flex flex-col flex-1">
                <p class="text-gray-500 text-sm">Введите ваше имя</p>
                <input type="text" v-model="userName" placeholder="Ваше имя" class="w-full mt-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" />
                <p v-if="userName.length > 0 && !isNameValid" class="text-red-500 text-sm mt-2">Пожалуйста, введите корректное имя</p>
              </div>
              <!-- Левая часть - end -->
              <!-- Правая часть - картинка -->
              <div class="cart-drawer-right p-4 aspect-square">
                <img src="../assets/images/modal/modalUser.png" alt="User Image" class="w-[60px] h-[60px] object-cover rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" />
              </div>
              <!-- Правая часть - end -->
            </div>
            <!-- /.flex -->
            <!-- EMAIL -->
            <div class="flex mt-auto justify-between">
              <!-- Левая часть - информация -->
              <div class="cart-name mb-6 p-2 flex flex-col flex-1">
                <p class="text-gray-500 text-sm">Введите ваш email</p>
                <input type="email" v-model="userEmail" placeholder="Ваш email" class="w-full mt-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" />
                <p v-if="userEmail.length > 0 && !isEmailValid" class="text-red-500 text-sm mt-2">Пожалуйста, введите корректный email</p>
              </div>
              <!-- Левая часть - end -->
              <!-- Правая часть - картинка -->
              <div class="cart-drawer-right p-4 aspect-square">
                <img src="../assets/images/modal/modalEmail.png" alt="Email Image" class="w-[60px] h-[60px] object-cover rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" />
              </div>
              <!-- Правая часть - end -->
            </div>
            
          </div>
          <!-- Кнопка отправки кода -->
          <div class="p-4 border-t flex-shrink-0">
            <button @click="sendCode" class="w-full bg-orange-500 text-white py-3 px-3 rounded-xl hover:bg-orange-600 transition-colors duration-300 shadow-lg shadow-orange-500/20 flex-shrink-0" :disabled="!isFormValid" :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }">Получить код в SMS</button>
          </div>
          <!-- <button @click="sendCode" class="w-full bg-orange-500 text-white py-3 px-3 rounded-xl hover:bg-orange-600 transition-colors duration-300 shadow-lg shadow-orange-500/20 flex-shrink-0" :disabled="!isPhoneValid" :class="{ 'opacity-50 cursor-not-allowed': !isPhoneValid }">Получить код в SMS</button> -->
        </div>
        <!-- Модально окно - end -->
      </div>
      <!--  -->
    </div>
  </transition>
</template>

<style scoped>
</style>