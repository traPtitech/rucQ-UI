<template>
  <div :class="$style.allAnketo">
    <div :class="$style.anketoTitle">項目一覧</div>
    <table :class="$style.anketoTable">
      <thead>
        <tr :class="$style.tableHeader">
          <td :class="$style.typeColumn">内容</td>
          <td :class="$style.nameColumn">期限</td>
        </tr>
        <tr :class="$style.tableContents" v-for="item in items" :key="item.id">
          <td :class="$style.nameCell" @click="goToDetail(item.id)">
            <span>{{ item.name }}</span>
          </td>
          <td :class="$style.deadline">{{ formatISOToDate(item.due) }}</td>
        </tr>
      </thead>
    </table>

    <!-- アクションボタン -->
    <div :class="$style.actions">
      <button @click="addItem">アンケートの追加</button>
      <v-dialog v-model="dialog">
        <v-sheet :class="$style.dialogSheet">
          <v-card-title class="mt-2">アンケートを追加</v-card-title>
          <v-textarea
            label="質問タイトル"
            v-model="newQuestionGroup.name"
            :class="$style.textField"
            variant="outlined"
            rows="1"
            auto-grow
          />
          <v-textarea
            label="説明"
            v-model="newQuestionGroup.description"
            :class="$style.textField"
            variant="outlined"
            rows="2"
            auto-grow
          />
          <v-textarea
            label="回答期限 (例: 2024-12-31)"
            v-model="newQuestionGroup.due"
            variant="outlined"
            :class="$style.textField"
            rows="1"
            class="mb-30"
            auto-grow
          />

          <div :class="$style.selectAnswerStyle">
            <v-btn @click="addQuestionItem" color="primary" class="mt-4">質問項目の追加</v-btn>
            <div
              v-for="(question, index) in newQuestionGroup.questions"
              :key="index"
              :class="$style.questionCard"
            >
              <v-row align="center" justify="center" class="mt-2 position-relative">
                <v-col cols="auto">
                  <h3 :class="$style.questionTitle">質問</h3>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="deleteQuestion(index)"
                    :class="$style.questionoDeleteButton"
                    size="x-small"
                    icon
                  >
                    <v-icon color="white">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-textarea
                label="説明"
                v-model="newQuestionGroup.questions[index].description"
                :class="$style.textField"
                variant="outlined"
                rows="1"
                auto-grow
              />
              <div :class="xs ? $style.ansStyleAndPublic_mobile : $style.ansStyleAndPublic">
                <v-select
                  label="回答形式"
                  :items="['single', 'multiple', 'free_text', 'free_number']"
                  v-model="newQuestionGroup.questions[index].type"
                  :class="[$style.textField, xs ? '' : ['w-50', 'ma-auto']]"
                  hide-details
                  variant="outlined"
                />
                <v-checkbox
                  v-model="newQuestionGroup.questions[index].is_public"
                  label="公開質問にする"
                  hide-details
                ></v-checkbox>
              </div>
              <div
                v-if="
                  newQuestionGroup.questions[index].type == 'single' ||
                  newQuestionGroup.questions[index].type == 'multiple'
                "
              >
                <v-btn @click="addOption(index)" :class="$style.addOptionButton"
                  >選択肢を追加</v-btn
                >
                <div
                  v-for="(option, optionId) in newQuestionGroup.questions[index].options"
                  :key="optionId"
                  :class="$style.optionContainer"
                >
                  <div :class="$style.optionRow">
                    <v-textarea
                      label="選択肢名"
                      v-model="newQuestionGroup.questions[index].options[optionId].content"
                      :class="$style.textOptionField"
                      variant="outlined"
                      rows="1"
                      hide-details
                      auto-grow
                    />

                    <!-- ここにバツボタン -->
                    <v-btn
                      @click="deleteOption(index, optionId)"
                      color="grey-lighten-1"
                      cols="auto"
                      size="x-small"
                      icon
                    >
                      <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class="$style.dialogButtonContainer">
            <v-btn @click="decideAddItem" color="primary" size="large">質問の公開</v-btn>

            <v-btn
              @click="dialogClose"
              color="primary"
              variant="tonal"
              :class="$style.closeButton"
              size="large"
              >キャンセル</v-btn
            >
          </div>
        </v-sheet>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

const router = useRouter()
const dialog = ref(false)

const newQuestionGroup = ref<
  components['schemas']['PostQuestionGroupRequest'] & {
    questions: (components['schemas']['PostQuestionRequest'] & {
      options: components['schemas']['PostOptionRequest'][]
    })[]
  }
>({
  // 新規アンケートの追加
  camp_id: 0,
  name: '',
  due: '',
  description: '',
  questions: [
    {
      question_group_id: 0,
      title: '',
      description: '',
      type: 'single',
      is_public: false,
      is_open: false,
      options: [
        {
          question_id: 0,
          content: '',
        },
      ],
    },
  ],
})

const items = ref<components['schemas']['QuestionGroup'][]>([])

const formatISOToDate = (isoString: string) => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateToISO = (dateString: string) => {
  // formatがyyyy-mm-ddの形式になっていなければアラート
  const date = new Date(dateString)
  return date.toISOString()
}

const deleteOption = (questionIndex: number, optionId: number) => {
  // 指定された位置の選択肢を削除
  newQuestionGroup.value.questions[questionIndex].options.splice(optionId, 1)
}

const deleteQuestion = (questionIndex: number) => {
  console.log(questionIndex)

  // 指定された位置の質問を削除
  newQuestionGroup.value.questions.splice(questionIndex, 1)
}

const goToDetail = (id: number) => {
  // クリック時に詳細ページに移動
  router.push({ name: 'DetailPage', params: { id } })
}

onMounted(async () => {
  items.value = await getQuestionGroups()
})

const addItem = () => {
  dialog.value = true
}
// addOption 関数内で存在チェックを追加
const addOption = (index: number) => {
  newQuestionGroup.value.questions[index].options.push({
    question_id: index,
    content: '',
  })
}

const addQuestionItem = () => {
  newQuestionGroup.value.questions.push({
    // 空のデータを入れる。　親をさすqurstion_idなどは適当に入れておく
    question_group_id: 0,
    title: '',
    description: '',
    type: 'single',
    is_public: false,
    is_open: true,
    options: [
      {
        question_id: 0,
        content: '',
      },
    ],
  })
}

const dialogClose = () => {
  dialog.value = false
}

const decideAddItem = async () => {
  // バックエンドにpostする処理
  let campData = await getDefaultCamp()
  if (!campData) {
    console.error('Failed to fetch default camp')
    return
  }
  newQuestionGroup.value.camp_id = campData.id

  // 2024-12-31みたいな形式を変換
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newQuestionGroup.value.due)) {
    alert('日付の形式が正しくありません')
    return
  }
  newQuestionGroup.value.due = formatDateToISO(newQuestionGroup.value.due)
  let res = await postQuestionGroup(newQuestionGroup.value)

  if (res) {
    newQuestionGroup.value.questions.forEach(async (question) => {
      question.question_group_id = res.id

      let questionRes = await postQuestion(question)
      if (questionRes) {
        question.options.forEach(async (option) => {
          option.question_id = questionRes.id
          await postOption(option)
        })
      }
    })

    items.value.push(res)
  }

  dialogClose()
}

// apiに関する関数を追加
const getDefaultCamp = async () => {
  const { data, error } = await apiClient.GET('/api/camps/default')
  if (error) {
    console.error('Failed to fetch default camp:', error.message)
    return
  }
  return data
}

const getQuestionGroups = async () => {
  const { data, error } = await apiClient.GET('/api/question_groups')
  if (error) {
    console.error('Failed to fetch information groups:', error.message)
    return []
  }
  return data
}

const postQuestionGroup = async (
  questionGroup: components['schemas']['PostQuestionGroupRequest'],
) => {
  const { data, error } = await apiClient.POST('/api/question_groups', {
    body: {
      camp_id: questionGroup.camp_id,
      name: questionGroup.name,
      due: questionGroup.due,
      description: questionGroup.description,
    },
  })
  if (error) {
    console.error('Failed to post question group:', error.message)
    console.log(data)
    console.log(questionGroup.camp_id)
    return
  }

  return data
}

const postQuestion = async (question: components['schemas']['PostQuestionRequest']) => {
  const { data, error } = await apiClient.POST(`/api/questions`, { body: question })
  if (error) {
    console.error('Failed to put question:', error.message)
    return
  }
  return data
}

const postOption = async (option: components['schemas']['PostOptionRequest']) => {
  const { data, error } = await apiClient.POST(`/api/options`, { body: option })
  if (error) {
    console.error('Failed to put option:', error.message)
    return
  }
  return data
}
</script>

<style module>
.header {
  background-color: #4a90e2;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.allAnketo {
  margin: 30px auto;
  padding: 20px;
  width: 90%;
  background-color: rgb(248, 248, 248);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.anketoTitle {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.anketoTable {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border-spacing: 10px;
}

.tableHeader {
  border: 3px solid #948d8d !important;
  z-index: 2;
  background-color: #faf4ea;
  font-size: 17px;
  display: flex;
}

.tableContents {
  display: flex;
}

.questionCard {
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  width: 95%;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all ease-in 0.3s;
}

.typeColumn,/*内容　期限*/
.nameColumn {
  font-weight: bold;
  color: #333 !important;
  padding: 12px;
  flex: 1;
  border-bottom: none;
}

.ansStyleAndPublic {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 80%;
  margin-bottom: 30px !important;
  margin: auto;
}

.ansStyleAndPublic_mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;
  margin-bottom: 30px !important;
}

.deadline,
.nameCell {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  font-size: larger;
  color: #333333;
  flex: 1;
  white-space: normal; /* 改行させる */
  word-break: break-all; /* 単語内でも折り返す */
}

.nameCell {
  cursor: pointer;
  transition: all ease-in 0.3s;
}

.nameCell span {
  border-bottom: 1px solid transparent; /* 初期状態は透明なボーダー */
  transition: border-bottom 0.1s ease-in; /* border-bottom のみにトランジションを適用 */
}

.nameCell span:hover {
  border-bottom: 1.5px solid #6b6666; /* ホバー時にボーダーを表示 */
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.actions button {
  padding: 10px 25px;
  background-color: #f07b41;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #d56d39;
}

.dialogSheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 65%;
  min-width: 350px;
  margin: auto;
  max-height: 90vh;
}

.dialogButtonContainer {
  display: flex;
  justify-content: center;
  margin: auto;
  gap: 20px;
  margin-bottom: 20px;
}

.textField {
  resize: none;
  width: 80%;
  margin: auto;
  justify-content: center;
  margin-top: 15px;
}

.textOptionField {
  resize: none;
  justify-content: center;
  text-align: center;
  margin: auto;
  width: 100%;
}

.addedOption {
  margin-top: 10px;
}

.selectAnswerStyle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  gap: 20px;
  padding-bottom: 80px;
  margin-bottom: 20px;
  background-color: #fafafa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.addOptionButton {
  margin-top: 10px;
  margin-bottom: 20px !important;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.optionContainer {
  margin-top: 10px;
  width: 80%;
  display: flex;
  margin: auto;
}

.optionRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: auto;
  margin-bottom: 30px;
  width: 100%;
}

.questionoDeleteButton {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  z-index: 10;
  background-color: #bdbdbd;
}

.questionTitle {
  font-size: 24px; /* ここで文字サイズを大きくする */
}
</style>
