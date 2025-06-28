import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const questionsHandlers = [
  http.get('/api/camps/{campId}/question-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'バス',
        description: 'バスに乗る？',
        due: '2023-10-01T12:00:00Z',
        questions: [
          {
            id: 1,
            questionGroupId: 1,
            title: '乗るものにチェック',
            description: null,
            type: 'multiple',
            options: [
              { id: 1, questionId: 1, content: '行き' },
              { id: 2, questionId: 1, content: '帰り' },
            ],
            isPublic: true,
            isOpen: false,
          },
        ],
      },
      {
        id: 2,
        name: 'スキー',
        description:
          'スキー・スノボをする人のための質問です。借りるものを全て選んで保存してください。',
        due: '2023-10-01T12:00:00Z',
        questions: [
          {
            id: 3,
            questionGroupId: 2,
            title: 'スキーをする？',
            description: null,
            type: 'single',
            options: [
              { id: 5, questionId: 3, content: 'する' },
              { id: 6, questionId: 3, content: 'しない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 4,
            questionGroupId: 2,
            title: 'スキーセット',
            description: null,
            type: 'single',
            options: [
              { id: 7, questionId: 4, content: '借りる' },
              { id: 8, questionId: 4, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 5,
            questionGroupId: 2,
            title: 'スノーボードセット',
            description: null,
            type: 'single',
            options: [
              { id: 9, questionId: 5, content: '借りる' },
              { id: 10, questionId: 5, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 6,
            questionGroupId: 2,
            title: 'スキーウェア',
            description: null,
            type: 'single',
            options: [
              { id: 11, questionId: 6, content: 'S' },
              { id: 12, questionId: 6, content: 'M' },
              { id: 13, questionId: 6, content: 'L' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 7,
            questionGroupId: 2,
            title: 'ゴーグル',
            description: null,
            type: 'single',
            options: [
              { id: 14, questionId: 7, content: '借りる' },
              { id: 15, questionId: 7, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 8,
            questionGroupId: 2,
            title: 'グローブ',
            description: null,
            type: 'single',
            options: [
              { id: 16, questionId: 8, content: '借りる' },
              { id: 17, questionId: 8, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 9,
            questionGroupId: 2,
            title: '身長（cm）',
            description: null,
            type: 'free_number',
            isPublic: true,
            isOpen: false,
          },
          {
            id: 10,
            questionGroupId: 2,
            title: '足のサイズ（cm）',
            description: null,
            type: 'free_number',
            isPublic: true,
            isOpen: false,
          },
        ],
      },
      {
        id: 3,
        name: 'その他',
        description: 'その他の質問です。',
        due: '2023-10-01T12:00:00Z',
        questions: [
          {
            id: 11,
            questionGroupId: 3,
            title: 'アレルギー',
            description: null,
            type: 'free_text',
            isPublic: true,
            isOpen: false,
          },
        ],
      },
    ])
  }),
  http.get('/api/me/question-groups/{questionGroupId}/answers', async ({ params }) => {
    if (params.questionGroupId === '1') {
      return HttpResponse.json([
        {
          id: 199,
          type: 'multiple',
          questionId: 1,
          userId: 'traP',
          content: [{ id: 1, questionId: 1, content: '行き' }],
        },
        // {
        //   id: 200,
        //   type: 'single',
        //   questionId: 2,
        //   userId: 'traP',
        //   content: { id: 4, questionId: 2, content: '乗らない' },
        // },
      ])
    }

    if (params.questionGroupId === '2') {
      return HttpResponse.json([
        {
          id: 201,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          content: { id: 5, questionId: 3, content: 'する' },
        },
        {
          id: 202,
          type: 'single',
          questionId: 4,
          userId: 'traP',
          content: { id: 7, questionId: 4, content: '借りる' },
        },
        {
          id: 203,
          type: 'single',
          questionId: 5,
          userId: 'traP',
          content: { id: 10, questionId: 5, content: '借りない' },
        },
        {
          id: 204,
          type: 'single',
          questionId: 6,
          userId: 'traP',
          content: { id: 12, questionId: 6, content: 'M' },
        },
        {
          id: 205,
          type: 'single',
          questionId: 7,
          userId: 'traP',
          content: { id: 14, questionId: 7, content: '借りる' },
        },
        {
          id: 206,
          type: 'single',
          questionId: 8,
          userId: 'traP',
          content: { id: 16, questionId: 8, content: '借りる' },
        },
        {
          id: 207,
          type: 'free_number',
          questionId: 9,
          userId: 'traP',
          content: 170,
        },
        {
          id: 208,
          type: 'free_number',
          questionId: 10,
          userId: 'traP',
          content: 26,
        },
      ])
    }

    return HttpResponse.json([])
  }),
  http.post('/api/answers', async () => {
    // 送られた request には answer の id しか含まれておらず、
    // そこから完全な Option を復元することが困難なので、とりあえず無関係なレスポンスを返す
    const resp = {
      id: 1,
      type: 'free_text' as const,
      questionId: 301,
      userId: 'traP',
      content: 'はろー',
    }
    return HttpResponse.json(resp, { status: 201 })
  }),
  http.put('/api/answers/{answerId}', async () => {
    const resp = {
      id: 1,
      type: 'free_text' as const,
      questionId: 301,
      userId: 'traP',
      content: 'はろー',
    }
    return HttpResponse.json(resp, { status: 201 })
  }),
]
