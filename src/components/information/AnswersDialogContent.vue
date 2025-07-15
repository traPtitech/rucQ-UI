<script setup lang="ts">
import type { components } from '@/api/schema'
import { useDisplay } from 'vuetify'
import UserIcon from '@/components/generic/UserIcon.vue'
const { xs } = useDisplay()

type Question = components['schemas']['QuestionResponse']

defineProps<{
  question: Question
  answers: Record<string, string[]> | undefined
  isSelected: boolean
}>()
</script>

<template>
  <v-expansion-panel v-if="answers" elevation="0">
    <v-expansion-panel-title :class="[$style.title, isSelected ? $style.open : $style.close]">{{
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
            <th :class="$style.firstColumn">回答</th>
            <th :class="$style.secondColumn">回答者</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ids, text) in answers" :key="text">
            <td>
              <div :class="$style.cell">
                {{ text }}
              </div>
            </td>
            <td>
              <div :class="$style.cell">
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
.title {
  transition:
    0.3s min-height cubic-bezier(0.4, 0, 0.2, 1),
    0.3s color cubic-bezier(0.4, 0, 0.2, 1),
    0.3s font-weight cubic-bezier(0.4, 0, 0.2, 1),
    0.3s background-color cubic-bezier(0.4, 0, 0.2, 1);
}

.answerText {
  margin-top: 16px;
}

.open {
  color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primaryLight)) !important;
  font-weight: 500;
}

.close {
  color: rgb(var(--v-theme-secondary));
  font-weight: 400;
}

.divider {
  margin: 4px 0;
}

.cell {
  padding: 12px 0;
}

.userIcon {
  display: inline-block;
  vertical-align: middle;
  margin: 1.5px 3px 1.5px 0;
}

.firstColumn {
  min-width: 150px;
}

.secondColumn {
  min-width: 80px;
}
</style>
