import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// 🔥 Toastification
import Toast from "vue-toastification";
// 🔥 Стили уведомлений
import "vue-toastification/dist/index.css";

const app = createApp(App);

// createApp(App).mount('#app');
app.mount('#app'); // mount the app to the DOM - this is where the app will be rendered. На русском - "монтируем" приложение в DOM - это место, где будет отображаться приложение.

// 🔥 Подключаем Toastification
app.use(Toast, {
  // 🔥 Настройки плагина (можно настроить по своему усмотрению)
  position: "top-right", // Позиция уведомлений
  timeout: 5000, // Время отображения уведомлений (в миллисекундах)
  closeOnClick: true, // Закрывать уведомление при клике? если false, то уведомление будет оставаться на экране, пока пользователь не закроет его вручную
  pauseOnHover: true, // Приостанавливать таймер при наведении на уведомление
  draggable: true, // Разрешить перетаскивание уведомлений
  draggablePercent: 0.6, // Процент от ширины окна, при котором уведомление будет удалено при перетаскивании
  showCloseButtonOnHover: true, // Показывать кнопку закрытия только при наведении на уведомление
  hideProgressBar: true, // Показывать ли индикатор времени до закрытия уведомления
  closeButton: "button", // Тип кнопки закрытия (можно использовать "button" для стандартной кнопки или "icon" для иконки)
  maxToast: 5, // Максимальное количество одновременно отображаемых уведомлений
  transition: "Vue-Toastification__bounce", // Анимация
  dangerouslyUseHTMLString: true, // Разрешить использование HTML в сообщениях (будьте осторожны с этим, так как это может привести к XSS-уязвимостям, если вы не контролируете содержимое сообщений)
  icon: true, // Показывать иконки в уведомлениях
});
