<script lang="ts" setup></script>

<template>
  <v-card :class="$style.container">
    <div :class="$style.side">
      <v-icon color="white">mdi-check</v-icon>
    </div>
    <div :class="$style.mainContent">合宿係が ￥ {{}} の振込を確認しました</div>
  </v-card>
</template>

<style module>
.container {
  margin: 24px 0px 12px 0px;
  padding: 0px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e9e5d9;
  display: flex;
  flex-direction: row;
}

.side {
  width: 40px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #4caf50;
}

.mainContent {
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #4caf50;
  margin-left: 20px;
}
</style>
