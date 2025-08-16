<script setup lang="ts">
const emit = defineEmits(['delete'])
</script>

<template>
  <v-dialog persistent max-width="400">
    <template #activator="{ props: activatorProps }">
      <div class="w-100">
        <button :class="$style.text" class="text-red" v-bind="activatorProps">
          イベントを削除する
        </button>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card :class="$style.card">
        <template #title> イベントを削除 </template>
        <template #text> 続行しますか？ この操作は取り消せません </template>
        <div :class="$style.buttons">
          <v-btn
            elevation="0"
            rounded="0"
            width="100%"
            variant="text"
            color="red"
            size="large"
            @click="isActive.value = false"
          >
            <span class="font-weight-bold">戻る</span>
          </v-btn>
          <v-btn
            elevation="0"
            rounded="0"
            width="100%"
            color="red"
            size="large"
            @click="(emit('delete'), (isActive.value = false))"
          >
            <span class="font-weight-bold">削除</span>
          </v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<style module>
.text {
  display: block;
  width: fit-content;
  text-align: center;
  margin: auto;
  margin-bottom: 4;
}

.text:hover {
  text-decoration: underline;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
