<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification'; // импортируем функцию useToast из библиотеки vue-toastification для отображения уведомлений
const toast = useToast(); // создаем экземпляр toast для использования в компоненте
console.log(toast); // проверяем, что toast доступен и работает
const emit = defineEmits(['close', 'success-login']); // Он просто говорит "закрыть модальное окно" и передаёт эту информацию родителю, который уже знает, что делать с этим событием
const props = defineProps({
  isOpenSmsModalProps: {
    type: Boolean,
    default: false, // лучше явно указать false, чтобы модалка не выскакивала сама
  }, // получаем состояние открытости модального окна логина от родителя
  generateCodeProps: {
    type: String,
    default: '', // по умолчанию пустая строка, так как код будет генерироваться внутри компонента
  }, // получаем сгенерированный код от родителя, если нужно (но в данном случае мы генерируем его внутри компонента)
  phoneProps: {
    type: String,
    default: '', // по умолчанию пустая строка, так как номер телефона будет вводиться внутри компонента
  }, // получаем отформатированный номер телефона от родителя, если нужно (но в данном случае мы обрабатываем его внутри компонента)
});
const codeDigits = ref(['', '', '', '']); // для хранения каждой цифры кода отдельно
// const SMSCode = ref(''); // для хранения введённого кода из SMS
const codeInputs = ref([]); // для хранения ссылок на все 4 поля ввода кода

const enteredCode = computed(() => codeDigits.value.join('')); // объединяем цифры в одну строку для проверки

// Функция для обработки правильности ввода номера телефона - validateion
const isSMSValid = computed(() => {
  // Проверяем, что код состоит из 4 цифр
  // return /^\d{4}$/.test(SMSCode.value);
  return enteredCode.value.length === 4 && /^\d{4}$/.test(enteredCode.value); // Проверяем, что код состоит из 4 цифр и не содержит других символов
});
// Обработка ввода цифры
const handleCodeInput = (event, index) => {
  const value = event.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

  codeDigits.value[index] = value; // Обновляем соответствующую цифру в массиве

  if (value && index < 3) {
    codeInputs.value[index + 1].focus(); // Переходим к следующему полю, если текущий не пустой
  }
};
// verifyCode
const verifyCode = () => {
  // props.generateCodeProps - это 
  if (enteredCode.value === props.generateCodeProps) {
    const users = JSON.parse(localStorage.getItem('users')) || []; // Получаем список пользователей из localStorage или используем пустой массив, если данных нет
    // очищаем номер
    const cleanePhone = props.phoneProps.replace(/\D/g, ''); // Удаляем все нецифровые символы из номера телефона для сравнения
    const currentUser = users.find(user => user.phone === cleanePhone && user.code === props.generateCodeProps); // Ищем пользователя с совпадающим номером телефона и кодом
    toast.success(`Вы успешно вошли в аккаунт! 🎉`); // Показываем уведомление об успехе при правильном коде
    codeDigits.value = ['', '', '', '']; // Очищаем поля ввода кода после успешной проверки
    emit('success-login', currentUser); // Отправляем данные текущего пользователя родителю при успешной аутентификации
    emit('close'); // Закрываем модальное окно после успешного входа
  } else {
    toast.error('Неверный код! Пожалуйста, попробуйте снова.'); // Показываем уведомление об ошибке при неправильном коде
  }
};

</script>

<template>
  <!-- Overlay (фон затемнения) -->
   <transition name="fade" appear>
    <div v-if="props.isOpenSmsModalProps" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
          <div class="flex">
            <!-- Левая часть - информация -->
            <div class="cart-drawer-left p-2 flex flex-col">
              <!-- Заголовок -->
              <div class="mb-6">
                <h2 class="cart-drawer-title font-bold text-2xl md:text-3xl text-gray-900 mb-2">Введите код</h2>
                <p class="cart-drawer-description text-gray-500 text-sm">SMS-код был отправлен на номер телефона +7 (921) 450-20-25</p>
                <input v-for="(digit, index) in codeDigits"
                   :key="index"
                   :ref="el => codeInputs[index] = el"
                   type="text" 
                   maxlength="1"
                   pattern="[0-9]{4}" 
                   autocomplete="off" 
                   inputmode="numeric" 
                   v-model="codeDigits[index]" 
                   placeholder="0" 
                   @input="handleCodeInput($event, index)"
                   class="w-14 h-14 text-2xl text-center mt-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" />
                <!-- Опционально: сообщение об ошибке -->
                <p v-if="enteredCode.length > 0 && !isSMSValid" class="text-red-500 text-sm mt-2">Пожалуйста, введите корректный SMS-код</p>
              </div>
              <!-- /.mb-6 -->
            </div>
            <!-- Левая часть - end -->
            <!-- Правая часть - картинка -->
            <div class="cart-drawer-right p-4 aspect-square">
              <img src="../assets/images/modal/modalSMS.png" alt="SMS Code" class="w-[60px] h-[60px] object-cover rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-300" />
            </div>
            <!-- Правая часть - end -->
          </div>
          <!--  -->
          <button @click="verifyCode" class="w-full bg-orange-500 text-white py-3 px-3 rounded-xl hover:bg-orange-600 transition-colors duration-300 shadow-lg shadow-orange-500/20" :disabled="!isSMSValid" :class="{ 'bg-gray-500 opacity-50 cursor-not-allowed': !isSMSValid }">Подтвердить</button>
        </div>
        <!-- Модально окно - end -->
      </div>
      <!--  -->
    </div>
  </transition>
</template>

<style scoped>
</style>