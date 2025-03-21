<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { getTimeString, getDayStringNoPad } from '@/lib/date'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { useUserStore, useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import type { components } from '@/api/schema'
import LinkText from '@/components/generic/LinkText.vue'
type CampEvent = components['schemas']['Event']
const props = defineProps<{ event: CampEvent | null }>()
const emit = defineEmits(['delete'])

const { user } = storeToRefs(useUserStore())
const { camp } = storeToRefs(useCampStore())

const isTimeChanged = ref(false)

const name = defineModel<string>('name')
const location = defineModel<string>('location')
const startTime = defineModel<Date>('startTime')
const endTime = defineModel<Date>('endTime')
const color = defineModel<string>('color')

const startTimePick = ref('')
const endTimePick = ref('')
const dayNum = ref(0)

const timeCalc = (time: string, addMin: number) => {
  const date = new Date()
  const [h, m] = time.split(':').map(Number)
  date.setHours(h, m + addMin, 0, 0)
  return getTimeString(date)
}

const updateTime = () => {
  startTime.value!.setDate(new Date(camp.value!.start_date).getDate() + dayNum.value)
  endTime.value!.setDate(new Date(camp.value!.start_date).getDate() + dayNum.value)
  const [startH, startM] = startTimePick.value.split(':').map(Number)
  startTime.value!.setHours(startH, startM, 0, 0)
  const [endH, endM] = endTimePick.value.split(':').map(Number)
  endTime.value!.setHours(endH, endM, 0, 0)
  if (createAsStaff.value) {
    color.value = startTimePick.value === endTimePick.value ? 'ash' : 'navy'
  }
}

watch(() => startTimePick.value, updateTime)
watch(() => endTimePick.value, updateTime)
watch(() => dayNum.value, updateTime)

const getDays = () => {
  const start_date = new Date(camp.value!.start_date)
  const end_date = new Date(camp.value!.end_date)
  const date = new Date(start_date)
  const days: { id: number; name: string }[] = []
  let count = 0

  while (date <= end_date) {
    days.push({ id: count, name: `${count + 1}日目 (${getDayStringNoPad(date)})` })
    date.setDate(date.getDate() + 1)
    count++
  }

  return days
}

const getDayNum = () => {
  const campStartDate = new Date(camp.value!.start_date)
  const eventStartDate = new Date(startTime.value!)
  eventStartDate.setHours(0, 0, 0, 0)
  const diffTime = eventStartDate.getTime() - campStartDate.getTime()
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

const createAsStaff = ref(false)

onMounted(() => {
  createAsStaff.value = props.event?.by_staff || false
  nextTick(() => {
    // startTime と endTime に値が入るのを待つ
    startTimePick.value = getTimeString(startTime.value!)
    endTimePick.value = getTimeString(endTime.value!)
    dayNum.value = getDayNum()
    updateTime()
  })
})
</script>

<template>
  <div class="w-100 h-100">
    <v-text-field
      v-model="name"
      :rules="[(v) => !!v || 'タイトルは必須です']"
      label="タイトル"
      variant="underlined"
      required
      :class="$style.titleInput"
    ></v-text-field>

    <v-text-field
      v-model="location"
      :rules="[(v) => !!v || '場所は必須です']"
      label="場所"
      prepend-inner-icon="mdi-map-marker-outline"
      variant="underlined"
      required
    ></v-text-field>
    <v-select
      v-model="dayNum"
      :items="getDays()"
      item-value="id"
      item-title="name"
      :rules="[(v) => v !== undefined || '開催日は必須です']"
      label="開催日"
      prepend-inner-icon="mdi-calendar-blank"
      variant="underlined"
      required
    ></v-select>

    <div style="display: flex">
      <v-dialog persistent ref="dialog" :v-model:propName="startTimePick">
        <template v-slot:activator="{ props: activatorProps }">
          <v-text-field
            v-model="startTimePick"
            label="開始時刻"
            prepend-inner-icon="mdi-clock-time-four-outline"
            variant="underlined"
            readonly
            v-bind="activatorProps"
            style="margin-right: 10px"
            :rules="[(v) => !!v || '開始時刻は必須です']"
            required
            @click="isTimeChanged = false"
          ></v-text-field>
        </template>
        <template v-slot:default="{ isActive }">
          <v-sheet width="fit-content" style="margin: 0 auto">
            <v-time-picker
              format="24hr"
              :color="color"
              :max="timeCalc(endTimePick, user?.is_staff ? 0 : -1)"
              v-model="startTimePick"
              @update:modelValue="isTimeChanged = true"
              title="開始時刻を設定"
            />
            <v-btn
              @click="isActive.value = false"
              :disabled="!isTimeChanged"
              elevation="0"
              rounded="0"
              width="100%"
              :color="color"
              size="large"
            >
              <span style="font-weight: bold">OK</span>
            </v-btn>
          </v-sheet>
        </template>
      </v-dialog>
      <v-dialog persistent ref="dialog" :v-model:propName="endTimePick">
        <template v-slot:activator="{ props: activatorProps }">
          <v-text-field
            v-model="endTimePick"
            label="終了時刻"
            prepend-inner-icon="mdi-clock-time-four-outline"
            variant="underlined"
            readonly
            v-bind="activatorProps"
            style="margin-left: 10px"
            :rules="[(v) => !!v || '開始時刻は必須です']"
            required
            @click="isTimeChanged = false"
          ></v-text-field>
        </template>
        <template v-slot:default="{ isActive }">
          <v-sheet width="fit-content" style="margin: 0 auto">
            <v-time-picker
              format="24hr"
              :color="color"
              :min="timeCalc(startTimePick, user?.is_staff ? 0 : 1)"
              v-model="endTimePick"
              @update:modelValue="isTimeChanged = true"
              title="終了時刻を設定"
            />
            <v-btn
              @click="isActive.value = false"
              :disabled="!isTimeChanged"
              elevation="0"
              rounded="0"
              width="100%"
              :color="color"
              size="large"
            >
              <span style="font-weight: bold">OK</span>
            </v-btn>
          </v-sheet>
        </template>
      </v-dialog>
    </div>

    <v-item-group v-model="color" class="d-flex justify-center" width="100%">
      <v-item v-for="(myColor, i) in ['orange', 'green', 'red', 'blue', 'purple', 'pink']" :key="i">
        <template v-slot:default="{}">
          <v-btn
            :active="color === myColor"
            :icon="`mdi-numeric-${i + 1}`"
            :color="myColor"
            height="40"
            :ripple="false"
            :variant="color === myColor ? 'elevated' : 'tonal'"
            width="40"
            style="margin: 6px"
            elevation="0"
            @click="((color = myColor), (createAsStaff = false))"
          ></v-btn>
        </template>
      </v-item>
    </v-item-group>

    <v-checkbox
      v-model="createAsStaff"
      @click="color = !createAsStaff ? (startTimePick === endTimePick ? 'ash' : 'navy') : 'orange'"
      :disabled="!user!.is_staff"
      label="合宿公式のイベント"
      hide-details
    ></v-checkbox>

    <v-dialog persistent max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <LinkText v-if="event" v-bind="activatorProps" text="イベントを削除する" />
      </template>
      <template v-slot:default="{ isActive }">
        <v-card :class="$style.card">
          <template v-slot:title> イベントを削除 </template>
          <template v-slot:subtitle> 続行しますか？ この操作は取り消せません </template>
          <div style="display: grid; grid-template-columns: 1fr 1fr">
            <v-btn
              @click="isActive.value = false"
              elevation="0"
              rounded="0"
              width="100%"
              variant="text"
              color="theme"
              size="large"
            >
              <span style="font-weight: bold">戻る</span>
            </v-btn>
            <v-btn
              @click="(emit('delete'), (isActive.value = false))"
              elevation="0"
              rounded="0"
              width="100%"
              color="theme"
              size="large"
            >
              <span style="font-weight: bold">OK</span>
            </v-btn>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style module>
.titleInput :global(input) {
  font-size: 20px !important;
}

.card :global(.v-card-subtitle) {
  opacity: 1 !important;
}
</style>
