<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getDayStringNoPad } from '@/lib/date'
import EventTimePick from './EventTimePick.vue'
import EventDeleteDialog from './EventDeleteDialog.vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import UserIcon from '@/components/generic/UserIcon.vue'
import { EVENT_COLORS } from '@/lib/eventColors'

type DurationEvent = components['schemas']['DurationEventResponse']
type Camp = components['schemas']['CampResponse']

const props = defineProps<{ event: DurationEvent | null; camp: Camp }>()
const emit = defineEmits(['delete'])

// イベントの設定
const name = defineModel<string>('name')
const location = defineModel<string>('location')
const color = defineModel<DurationEvent['displayColor']>('color')
const organizerId = defineModel<string>('organizerId') // 主催者の ID

// Date 型で合わせると時刻未設定を表現できないため分割
const dayNum = defineModel<number>('dayNum') // 開催日。0-indexed
const startMinute = defineModel<number | undefined>('start-minute') // 開始時刻。0時からの分数
const endMinute = defineModel<number | undefined>('end-minute') // 終了時刻。0時からの分数

// 日付を表す文字列の配列
const days = computed(() => {
  const date = new Date(props.camp.dateStart)
  const endDate = new Date(props.camp.dateEnd)
  const days: { id: number; name: string }[] = []
  for (let i = 0; date <= endDate; i++) {
    days.push({ id: i, name: `${i + 1}日目 (${getDayStringNoPad(date)})` })
    date.setDate(date.getDate() + 1)
  }
  return days
})

// 合宿参加者の ID の配列
const participantIds = ref<string[]>([])

const getParticipants = async (camp: Camp) => {
  const participants = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.id } },
  })
  if (participants.error || !participants.data) {
    throw new Error(`参加者情報を取得できません: ${participants.error}`)
  }
  return participants.data
}

// 開始時刻のバリデーションルール
const startTimeRule = (time: number | undefined) => {
  if (time === undefined) return '開始時刻は必須です'
  if (endMinute.value && time >= endMinute.value) return '終了時刻以後です'
  return true
}

// 終了時刻のバリデーションルール
const endTimeRule = (time: number | undefined) => {
  if (time === undefined) return '終了時刻は必須です'
  if (startMinute.value && time <= startMinute.value) return '開始時刻以前です'
  return true
}

// 相手側が変わったら再検証させるための参照
const startPickRef = ref<{ validate: () => Promise<string[] | undefined> } | null>(null)
const endPickRef = ref<{ validate: () => Promise<string[] | undefined> } | null>(null)

// お互いが変わったらフィールドを再検証
watch(
  () => endMinute.value,
  () => startPickRef.value?.validate?.(),
)
watch(
  () => startMinute.value,
  () => endPickRef.value!.validate?.(),
)

onMounted(async () => {
  participantIds.value = (await getParticipants(props.camp)).map((p) => p.id)
})

const getListItemProps = (props: Record<string, unknown>) => {
  return { ...props, title: '' } // デフォルトのタイトル表示を抑制し、手前にユーザーアイコンを差し込む
}
</script>

<template>
  <div class="h-100">
    <v-text-field
      v-model="name"
      :rules="[(v) => v !== '' || 'タイトルは必須です']"
      label="タイトル"
      variant="underlined"
      required
      :class="$style.titleInput"
    ></v-text-field>
    <v-text-field
      v-model="location"
      :rules="[(v) => v !== '' || '場所は必須です']"
      label="場所"
      prepend-inner-icon="mdi-map-marker-outline"
      variant="underlined"
      required
    ></v-text-field>
    <v-select
      v-model="dayNum"
      :items="days"
      item-value="id"
      item-title="name"
      label="開催日"
      prepend-inner-icon="mdi-calendar-blank"
      variant="underlined"
      required
    ></v-select>
    <div :class="$style.timePicks">
      <event-time-pick
        ref="startPickRef"
        v-model:minute="startMinute"
        :color="color!"
        label="開始時刻"
        :rule="startTimeRule"
      />
      <event-time-pick
        ref="endPickRef"
        v-model:minute="endMinute"
        :color="color!"
        label="終了時刻"
        :rule="endTimeRule"
      />
    </div>
    <v-autocomplete
      v-model="organizerId"
      :items="participantIds"
      :rules="[(v) => !!v || '主催者は必須です']"
      label="主催者"
      prepend-inner-icon="mdi-crown-outline"
      variant="underlined"
      required
    >
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="getListItemProps(itemProps)">
          <div class="d-flex align-center">
            <user-icon :id="item.value" :size="24" class="mr-2" />
            <v-list-item-title :class="$style.itemTitle">{{ item.value }}</v-list-item-title>
          </div>
        </v-list-item>
      </template>
    </v-autocomplete>
    <v-item-group v-model="color" class="d-flex justify-center" width="100%">
      <v-item v-for="(myColor, i) in EVENT_COLORS" :key="i">
        <template #default="{}">
          <v-btn
            :variant="color === myColor ? 'elevated' : 'tonal'"
            :icon="`mdi-numeric-${i + 1}`"
            :color="myColor"
            :ripple="false"
            density="comfortable"
            elevation="0"
            class="ma-1"
            @click="color = myColor"
          ></v-btn>
        </template>
      </v-item>
    </v-item-group>
    <div v-if="props.event" class="mt-2">
      <event-delete-dialog @delete="emit('delete')" />
    </div>
  </div>
</template>

<style module>
.titleInput :global(input) {
  font-size: 20px !important;
}

.card :global(.v-card-subtitle) {
  opacity: 1 !important;
}

.timePicks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
</style>
