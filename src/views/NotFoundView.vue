<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Not Found</h1>
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
  color: white;
  position: relative;
}

.title {
  font-size: 48px;
}

.path {
  padding: 0px 20px;
  font-size: 24px;
  font-family: 'M PLUS Code Latin';
  border-radius: 6px;
  border: 1px solid white;
}
</style>
