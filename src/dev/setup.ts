import { apiClient } from '@/api/apiClient'

export default async () => {
  // traP をスタッフに設定
  console.log(
    await apiClient.PUT('/api/admin/users/{userId}', {
      params: { path: { userId: 'traP' } },
      body: { isStaff: true },
    }),
  )

  // 既存の合宿を全て削除
  const camps = await apiClient.GET('/api/camps')
  for (const camp of camps.data!) {
    console.log(
      await apiClient.DELETE(`/api/admin/camps/{campId}`, {
        params: { path: { campId: camp.id } },
      }),
    )
  }

  // 新しい合宿を作成
  const newCamp = (
    await apiClient.POST('/api/admin/camps', {
      body: {
        displayId: 'summer2024',
        name: '夏の合宿 2024',
        guidebook:
          '毎年恒例の夏の合宿です！海の近くでプログラミングと交流を楽しみましょう。初心者から上級者まで大歓迎です。',
        isDraft: false,
        isRegistrationOpen: true,
        isPaymentOpen: true,
        dateStart: '2024-08-15',
        dateEnd: '2024-08-18',
      },
    })
  ).data!

  console.log(newCamp)

  const questionGroups = (
    await apiClient.GET('/api/camps/{campId}/question-groups', {
      params: { path: { campId: newCamp.id } },
    })
  ).data!

  for (const questionGroup of questionGroups) {
    // 既存の質問グループを削除
    console.log(
      await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
        params: { path: { questionGroupId: questionGroup.id } },
      }),
    )
  }

  // 合宿の質問を作成
  const questionGroup = (
    await apiClient.POST('/api/admin/camps/{campId}/question-groups', {
      params: { path: { campId: newCamp.id } },
      body: {
        name: '合宿参加者アンケート',
        description: '合宿に参加する前に、以下のアンケートに回答してください。',
        due: '2024-08-10',
        questions: [
          {
            type: 'free_text',
            title: 'あなたの名前',
            isPublic: true,
            isOpen: true,
          },
          {
            type: 'multiple',
            title: '好きなプログラミング言語は何ですか？',
            options: [
              { content: 'JavaScript' },
              { content: 'Python' },
              { content: 'Ruby' },
              { content: 'Java' },
            ],
            isPublic: true,
            isOpen: true,
          },
        ],
      },
    })
  ).data!

  console.log(questionGroup)
}
