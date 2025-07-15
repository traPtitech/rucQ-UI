<script setup lang="ts">
import type { components } from '@/api/schema'
import { useDisplay } from 'vuetify'
import UserIcon from '@/components/generic/UserIcon.vue'
const { xs } = useDisplay()

type Question = components['schemas']['QuestionResponse']

defineProps<{
  question: Question
  answers: Record<string, string[]> | undefined
}>()
</script>

<template>
  <v-expansion-panel v-if="answers" elevation="0">
    <v-expansion-panel-title class="font-weight-medium">{{
      question.title
    }}</v-expansion-panel-title>
    <v-expansion-panel-text v-if="xs" :class="$style.content">
      <div>
        <div :class="$style.userIconsCell">
          <div v-for="(ids, text) in answers" :key="text">
            <div :class="$style.answerText">{{ text }}</div>
            <v-divider :class="$style.divider" />
            <div :class="$style.userIconsCell">
              <div v-for="id in ids" :key="id" :class="$style.userIcon">
                <user-icon :id="id" :size="25" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-expansion-panel-text>
    <v-expansion-panel-text v-else>
      <v-table>
        <thead>
          <tr>
            <th>回答</th>
            <th>回答者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ids, text) in answers" :key="text">
            <td>{{ text }}</td>
            <td>
              <div :class="$style.userIconsCell">
                <div v-for="id in ids" :key="id" :class="$style.userIcon">
                  <user-icon :id="id" :size="25" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style module>
.answerText {
  margin-top: 10px;
}

.divider {
  margin: 4px 0;
}

.userIconsCell {
  padding: 4px 0;
}

.userIcon {
  display: inline-block;
  vertical-align: middle;
  margin: 1.5px 3px 1.5px 0;
}
</style>
