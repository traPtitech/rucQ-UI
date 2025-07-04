<!-- 参加登録・合宿選択 View -->
<!-- すでにユーザーが最新の合宿の参加登録を済ませている場合は GuidebookView へリダイレクトする -->
<script setup lang="ts">
</script>



<template>
  <div class="container">
    <img :src="`/logo/logo-white.svg`" style="width: 300px" />
    <v-expansion-panels class="panel">
      <v-expansion-panel 
        title="3290年度 Xmas合宿"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div></div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.panel {
  max-width: 600px;
  width: 80%;
}
</style>