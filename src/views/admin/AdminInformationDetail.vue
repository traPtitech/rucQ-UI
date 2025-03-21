<template>
  <div class="container">
    <div class="headQuestionHeader">
      <div class="headQuestionTitle">
        {{ questionHeader.title }}
        <button class="EditIconContainer" @click="openHeaderDialog">
          <v-icon class="edit-icon">mdi-square-edit-outline</v-icon>
        </button>

        <v-dialog v-model="dialog" scrollable>
          <v-sheet class="dialog-sheet">
            <h2>アンケートを編集</h2>
            <v-textarea
              label="アンケートタイトル"
              v-model="editedTitle"
              variant="outlined"
              rows="1"
              auto-grow
              class="text-field"
            />
            <v-textarea
              label="アンケート説明"
              v-model="editedDescription"
              variant="outlined"
              rows="3"
              auto-grow
              class="text-field"
            />
            <v-textarea
              label="回答期限"
              v-model="editedDeadline"
              variant="outlined"
              rows="1"
              auto-grow
              class="text-field"
            />
            <div class="dialogButtonContainer">
              <v-btn color="primary" @click="headerSave">保存</v-btn>
              <v-btn color="primary" variant="tonal" class="closeButton" @click="closeHeaderDialog"
                >キャンセル</v-btn
              >
            </div>
          </v-sheet>
        </v-dialog>
      </div>
      <div class="headQuestionDescription">{{ questionHeader.description }}</div>
      <div class="headQuestionDeadline">回答期限: {{ questionHeader.deadline }}</div>
    </div>

    <div class="questionsBody">
      <div v-for="question in questions" :key="question.id">
        <div class="question">
          <div class="questionTitle">
            <div class="questionTitleText">{{ question.title }}</div>
            <div class="buttons">
              <div class="allCopyButton">全体をコピー</div>
              <button class="EditIconContainer" @click="openQuestionDialog(question.id)">
                <v-icon class="edit-icon">mdi-square-edit-outline</v-icon>
              </button>
            </div>
            <v-dialog v-model="questionDialogs[question.id]" scrollable>
              <v-sheet class="dialog-sheet">
                <h2>質問を編集</h2>
                <v-textarea
                  label="質問タイトル"
                  v-model="editedTitle"
                  variant="outlined"
                  rows="1"
                  auto-grow
                  class="text-field"
                />
                <v-textarea
                  label="質問説明"
                  v-model="editedDescription"
                  variant="outlined"
                  rows="3"
                  auto-grow
                  class="text-field"
                />
                <h2>選択肢</h2>
                <div
                  v-for="(option, index) in editedOptions"
                  :key="index"
                  class="editQuestionOption"
                >
                  <v-textarea
                    label="選択肢"
                    v-model="editedOptions[index]"
                    variant="outlined"
                    rows="1"
                    auto-grow
                    class="text-field"
                  />
                </div>
                <v-btn @click="editedOptions.push('')" class="mb-5">選択肢を追加</v-btn>
                <div class="dialogButtonContainer">
                  <v-btn color="primary" @click="childQuestionSave(question.id)">保存</v-btn>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    class="closeButton"
                    @click="childQuestionclose(question.id)"
                    >キャンセル</v-btn
                  >
                </div>
              </v-sheet>
            </v-dialog>
          </div>
          <div class="questionDescription">
            {{ question.description }}
          </div>

          <div v-for="option in question.options" :key="option">
            <div class="questionOption">
              {{ option }}

              <v-icon class="copyIcon">mdi-content-copy </v-icon>
            </div>
            <div class="questionRespondents">
              <span v-for="respondent in question.respondents" :key="respondent">
                <div class="member">{{ respondent }}</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isEqualsGreaterThanToken } from 'typescript'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dialog = ref(false)
// パスパラメータを取得
const eventID = router.currentRoute.value.params.id

// 質問ごとにダイアログを管理するため初期化
onMounted(() => {
  questions.value.forEach((q) => {
    questionDialogs.value[q.id] = false
  })
})

// 編集用の一時変数
const editedTitle = ref('')
const editedDescription = ref('')
const editedDeadline = ref('')
const editedOptions = ref<string[]>([])

// ダイアログを開くときに一時変数に現在の値をセット
const openHeaderDialog = () => {
  editedTitle.value = questionHeader.value.title
  editedDescription.value = questionHeader.value.description
  editedDeadline.value = questionHeader.value.deadline
  dialog.value = true
}

const openDialog = (id: number) => {
  editedTitle.value = questions.value[id].title
  editedDescription.value = questions.value[id].description
}

const openQuestionDialog = (id: number) => {
  editedTitle.value = questions.value[id].title
  editedDescription.value = questions.value[id].description
  editedOptions.value = [...questions.value[id].options]
  questionDialogs.value[id] = true
}

// ダイアログを閉じる際に一時変数をリセット
const closeHeaderDialog = () => {
  dialog.value = false
}

const childQuestionclose = (id: number) => {
  questionDialogs.value[id] = false
}

// 保存ボタンをクリックしたときの処理
const headerSave = () => {
  questionHeader.value.title = editedTitle.value
  questionHeader.value.description = editedDescription.value

  // 2024-12-01のような形式かどうかの確認
  if (editedDeadline.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    questionHeader.value.deadline = editedDeadline.value
  } else {
    alert('日付の形式が正しくありません (yyyy-mm-dd)')
    return
  }
  dialog.value = false
}

const childQuestionSave = (id: number) => {
  questions.value[id].title = editedTitle.value
  questions.value[id].description = editedDescription.value
  questions.value[id].options = editedOptions.value
  questionDialogs.value[id] = false
}

const questionHeader = ref({
  title: '2024年度春合宿 レンタル調査',
  deadline: '2023-12-01',
  description:
    'スキー/スノボをする人は用具をレンタルできますので回答してください。本アンケートに回答しないと用具をレンタルできない可能性があります。',
})

type Question = {
  id: number
  title: string
  description: string
  type: 'text' | 'radio' | 'checkbox'
  options: string[]
  answerCount: number
  respondents: string[]
}
// それぞれの編集ボタンに対応するダイアログの表示状態を管理
const questionDialogs = ref<Record<number, boolean>>({})

const questions = ref<Question[]>([
  // まだ決まってないので一旦適当なダミーデータ、後でAPIから取得する。その時にここ頑張る
  {
    id: 0,
    title: 'スキー/スノボをしますか？',
    description: 'スキー/スノボをする人は用具をレンタルできますので回答してください。',
    type: 'radio',
    options: ['スキー', 'スノボ', 'しない'],
    answerCount: 12,
    respondents: [
      '山田',
      '田中',
      '鈴木',
      '佐藤',
      '高橋',
      '伊藤',
      '渡辺',
      '山本',
      '中村',
      '小林',
      '加藤',
      '吉田',
      '山口',
      '松本',
      '井上',
      '木村',
      '山田',
      '田中',
      '鈴木',
      '佐藤',
      '高橋',
      '伊藤',
      '渡辺',
      '山本',
      '中村',
      '小林',
      '加藤',
      '吉田',
      '山口',
      '松本',
      '井上',
      '木村',
      '山田',
      '田中',
      '鈴木',
      '佐藤',
      '高橋',
      '伊藤',
      '渡辺',
      '山本',
      '中村',
      '小林',
      '加藤',
      '吉田',
      '山口',
      '松本',
      '井上',
      '木村',
      '山田',
      '田中',
      '鈴木',
      '佐藤',
      '高橋',
      '伊藤',
      '渡辺',
      '山本',
      '中村',
      '小林',
      '加藤',
      '吉田',
      '山口',
      '松本',
      '井上',
      '木村',
    ],
  },
  {
    id: 1,
    title: 'スキー/スノボの用具をレンタルしますか？',
    description: 'スキー/スノボをする人は用具をレンタルできますので回答してください。',
    type: 'radio',
    options: ['レンタルする', '持参する'],
    answerCount: 8,
    respondents: ['佐藤', '鈴木'],
  },
  {
    id: 2,
    title: 'スキー/スノボの用具をレンタルする場合、サイズを教えてください。',
    description: 'スキー/スノボをする人は用具をレンタルできますので回答してください。',
    type: 'text',
    options: [],
    answerCount: 5,
    respondents: ['高橋', '伊藤'],
  },
  {
    id: 3,
    title: 'レンタルするもの',
    description: 'レンタルするものを選択してください',
    type: 'checkbox',
    options: ['スキー板', 'スノボ板', 'ブーツ', 'ウェア', 'その他'],
    answerCount: 10,
    respondents: ['渡辺', '山本'],
  },
])
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fbfbfb;
}

.headQuestionHeader {
  padding: 16px;
  background-color: #fcfcfc;
  border-radius: 7px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 90%;
  position: relative;
  justify-content: center;
  margin-top: 40px;
}

.headQuestionTitle {
  border-bottom: 1px solid #e0e0e0;
  font-size: 20px;
  font-weight: bold;
  display: flex;
}

.headQuestionDescription {
  font-size: 15px;
  margin-top: 10px;
  color: #636363;
}

.headQuestionDeadline {
  font-size: 14px;
  margin-top: 8px;
  text-align: right;
  margin-right: 20px;
}

.questionsBody {
  width: 90%;
  border-radius: 7px;
  margin-top: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.question {
  padding: 16px;
  background-color: #fcfcfc;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 7px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 95%;
  position: relative;
  justify-content: center;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

.questionTitleText {
  max-width: 80%;
}

.questionTitle {
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.questionOption {
  /*個々の質問の選択肢*/
  font-size: 16px;
  margin-top: 6px;
  color: #555555;

  display: flex;
  align-items: center;
}

.questionDescription {
  /*個々の質問の説明*/
  font-size: 16px;
  margin-top: 6px;
  padding-bottom: 10px;
  color: #555555;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
}

.questionRespondents {
  /*回答者の名前の枠*/
  font-size: 14px;
  color: #636363;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid #bababa;
}

.member {
  /*回答者の名前*/
  background-color: #faece7;
  border-radius: 5px;
  padding: 1px;
  padding-right: 3px;
  padding-left: 3px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}

.dialog-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  min-width: 300px;
  margin: auto;
  max-height: 80vh;
}

.v-dialog__content {
  overflow: visible; /* 必要に応じて調整 */
}

.dialog-sheet h2 {
  margin-bottom: 25px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dialogButtonContainer {
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: 20px;
  gap: 20px;
  margin-bottom: 20px;
}

.editQuestionOption {
  /*個々の質問の選択肢*/
  width: 80%;
  display: flex;
  align-items: center;
}

.allCopyButton {
  /*全体をコピーするボタン*/
  background-color: #32da03;
  color: #ffffff;
  font-size: 20px;
  text-align: right;
  position: relative;
  margin-left: auto;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
}

.text-field {
  resize: none;
  width: 80%;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: right;
  margin-left: auto;
}

/*クリック時のアニメーションは後でやる*/
.copyIcon {
  color: #ff9800;
  font-size: 16px;
  margin-left: auto;
  text-align: right;
  justify-content: center;
  cursor: pointer;
}

.edit-icon {
  color: #ff9800;
  font-size: 20px;
  margin-left: auto;
  text-align: right;
  justify-content: center;
  cursor: pointer;
}

.EditIconContainer {
  margin-left: auto;
  cursor: pointer;
}
</style>
