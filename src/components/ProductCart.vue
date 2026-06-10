<script setup>
import { ref } from 'vue';
defineProps({
  id: Number,
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  onClickAdd: Function,
});
const emit = defineEmits(['add']); // ребёнок передаёт родителю, ребёнок не знает что делает родитель. Он просто говорит "кнопка нажата"
const imgRef = ref(null); // создаём реактивную ссылку для изображения пиццы, чтобы потом использовать её в функции анимации
</script>

<template>
  <div class="cart-card">
    <a href="/" class="cart-img">
      <!-- <img src="../assets/images/pizza/cheeseChicken1.png" alt="Pizza" /> -->
      <!-- картинка -->
      <img :src="imageUrl" :alt="title" ref="imgRef" />
    </a>
    <!--  -->
    <div class="cart-content">
      <h3 class="cart-title font-bold text-lg">{{ title }}</h3>
      <p class="cart-description text-gray-500 text-sm">{{ description }}</p>
      <div class="cart-bottom flex items-center justify-between mt-4">
        <span class="cart-price font-bold text-lg">${{ price.toFixed(2) }}</span>
        <!-- <button @click="onClickAdd" class="cart-add-btn bg-red-500 text-white px-4 py-2 rounded cursor-pointer">+ Добавить</button> -->
        <button @click="(e) => emit('add', { id, title, price, imageUrl, event: e, img: imgRef })" class="cart-add-btn bg-red-500 text-white px-4 py-2 rounded cursor-pointer">+ Добавить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.cart-card:hover {
  transform: translateY(-5px);
}
.cart-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1; /* Позволяет контенту занимать всё доступное пространство внутри карточки */
}
.cart-img {
  display: block;
  width: 100%;
  height: 250px; /* Фиксированная высота для всех изображений */
  overflow: hidden;
  border-radius: 10px; /* Опционально: скругление углов */
}

.cart-img img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Сохраняем пропорции изображения, помещая его внутри контейнера */
  object-position: center;
  display: block;
}
.cart-description {
  flex-grow: 1; /* Позволяет описанию занимать всё доступное пространство между заголовком и нижней частью карточки */
  margin-top: 5px; /* Отступ между заголовком и описанием */
}
.cart-bottom {
  margin-top: auto; /* Отодвигаем нижнюю часть карточки вниз, чтобы она всегда была внизу */
}
.cart-add-btn:hover {
  background-color: #e53e3e;
}

.cart-add-btn:hover {
  background-color: #e53e3e;
}
</style>