<!-- filepath: /home/mumumu/trap/rucQ/frontend/src/views/admin/AdminSettings.vue -->
<template>
  <v-container class="admin-settings" fluid>
    <h1 class="admin-title">管理者ツール</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="item in adminTools" :key="item.title">
        <v-card class="admin-card" @click="navigateTo(item.path)" elevation="4">
          <v-card-title class="admin-card-title">
            <v-icon large>{{ item.icon }}</v-icon>
          </v-card-title>
          <v-card-text class="admin-card-text">
            {{ item.title }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

// 管理者ツールのリスト
const adminTools = ref([
  {
    title: 'しおりの編集',
    icon: 'mdi-book-edit',
    path: 'guidebook',
  },
  {
    title: '質問の閲覧編集',
    icon: 'mdi-account-group',
    path: 'users',
  },
  {
    title: 'dmの送信',
    icon: 'mdi-email',
    path: 'dm',
  },
  {
    title: '振込確認',
    icon: 'mdi-cash',
    path: 'payments',
  },
  {
    title: '部屋の編集',
    icon: 'mdi-list-box-outline',
    path: 'rooms',
  },
  // 必要に応じて他の管理者ツールを追加
])

// ナビゲーション関数
const navigateTo = (path: string) => {
  // ルートパスの最初のセグメントを取得
  const segments = route.path.split('/')
  router.push(`/${segments[1]}/admin/${path}`)
}
</script>

<style scoped>
.admin-settings {
  padding: 20px;
}

.admin-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2em;
  color: var(--v-primary-base);
}

.admin-card {
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.admin-card-title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

.admin-card-text {
  text-align: center;
  font-size: 1.2em;
  padding-bottom: 20px;
}
</style>
