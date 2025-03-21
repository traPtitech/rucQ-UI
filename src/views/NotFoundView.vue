<script setup lang="ts"></script>

<template>
  <div :class="$style.container">
    <router-link :to="`/`">
      <img :src="`/logo/logo.svg`" style="width: 300px" />
    </router-link>
    <!-- vue-router によって同一サイト内部へのリンクを貼る場合、<a> タグの代わりに <router-link> を用いる -->

    <h1 style="font-weight: 500">Not Found</h1>
    <h2 :class="$style.path">{{ decodeURI($route.path) }}</h2>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.path {
  padding: 0 20px;
  font-weight: bold;
  background-color: var(--color-text-sub);
  color: var(--color-background);
  border-radius: 6px;
}

.logo {
  color: var(--color-text);
  width: 50px;
  /* border: 1px solid white; */
}
</style>
