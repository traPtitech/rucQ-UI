<script setup lang="ts">
// データを配列として定義
const cardItems = [
  {
    id: 'Apple',
    title: 'Apple',
    content: 'Apple is a fruit that is often red or green. It is crunchy and sweet.',
    level: 2,
  },
  {
    id: 'Banana',
    title: 'Banana',
    content: '',
    level: 3,
  },
  {
    id: 'Orange',
    title: 'Orange',
    content: 'Orange is a citrus fruit that is orange in color.',
    level: 1,
  },
  {
    id: 'Strawberry',
    title: 'Strawberry',
    content:
      'Strawberry is a red fruit with small seeds on its surface. It is sweet and often used in desserts.',
    level: 2,
  },
]
</script>

<template>
  <div :class="$style.container">
    <masonry-wall :items="cardItems" :column-width="240" :gap="16">
      <template #default="{ item }">
        <div :class="$style.card">
          <component :is="`h${item.level}`">{{ item.title }}</component>
          <p v-if="item.content">{{ item.content }}</p>
        </div>
      </template>
    </masonry-wall>
  </div>
</template>

<style module>
.container {
  height: 100%;
  width: 100%;
  margin: auto;
  max-width: 1200px;
  box-sizing: border-box;
  position: relative;
  padding: 16px;
}

.card {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
