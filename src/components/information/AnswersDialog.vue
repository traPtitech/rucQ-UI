<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { xs } = useDisplay()
</script>

<template>
  <v-dialog
    :fullscreen="xs"
    :transition="xs ? 'dialog-bottom-transition' : undefined"
    :max-width="xs ? undefined : 800"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <div :class="$style.button" v-bind="activatorProps">参加者の回答を見る</div>
    </template>

    <template v-slot:default="{ isActive }">
      <div class="bg-white h-100" v-if="xs">
        <div :class="$style.heading">
          <v-btn
            @click="isActive.value = false"
            density="comfortable"
            elevation="0"
            icon="mdi-close"
            baseColor="transparent"
            class="text-secondary"
          ></v-btn>
        </div>
        <v-card-text>
          <div :class="$style.content">ここに参加者の回答を表示</div>
        </v-card-text>
      </div>
      <div v-else>
        <v-card>
          <div :class="$style.heading">
            <v-btn
              @click="isActive.value = false"
              density="comfortable"
              elevation="0"
              icon="mdi-close"
              baseColor="transparent"
              class="text-secondary"
            ></v-btn>
          </div>
          <v-card-text>
            <div :class="$style.content">ここに参加者の回答を表示</div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-dialog>
</template>

<style module>
.heading {
  display: flex;
  justify-content: flex-end;
  padding: 4px 4px 0 4px;
  margin-bottom: -12px;
}

.button {
  margin-top: 10px;
  width: 100%;
  text-align: end;
  font-size: 12px;
  font-weight: 400;
  color: #0066ff;
  cursor: pointer;
}

.content {
  border: 1px solid red;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
