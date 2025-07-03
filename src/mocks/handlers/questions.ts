import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const questionsHandlers = [
  http.get('/api/camps/{campId}/question-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'スキー',
        description:
          'スキー・スノボをする人のための質問です。借りるものを全て選んで保存してください。',
        due: '2023-10-01T12:00:00Z',
        questions: [
          {
            id: 3,
            title: 'スキーをする？',
            description: null,
            type: 'single',
            options: [
              { id: 5, content: 'する' },
              { id: 6, content: 'しない' },
            ],
            isPublic: true,
            isOpen: true,
          },
          {
            id: 4,
            title: 'スキーセット',
            description: null,
            type: 'single',
            options: [
              { id: 7, content: '借りる' },
              { id: 8, content: '借りない' },
            ],
            isPublic: true,
            isOpen: true,
          },
          {
            id: 5,
            title: '自由選択',
            description: null,
            type: 'multiple',
            options: [
              { id: 18, content: '選択肢1' },
              { id: 19, content: '選択肢2' },
            ],
            isPublic: true,
            isOpen: true,
          },
          {
            id: 6,
            title: 'スノーボードセット',
            description: null,
            type: 'single',
            options: [
              { id: 9, content: '借りる' },
              { id: 10, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 7,
            title: 'スキーウェア',
            description: null,
            type: 'single',
            options: [
              { id: 11, content: 'S' },
              { id: 12, content: 'M' },
              { id: 13, content: 'L' },
            ],
            isPublic: true,
            isOpen: true,
          },
          {
            id: 8,
            title: 'ゴーグル',
            description: null,
            type: 'single',
            options: [
              { id: 14, content: '借りる' },
              { id: 15, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 9,
            title: '自由記述',
            description: null,
            type: 'free_text',
            isPublic: true,
            isOpen: true,
          },
          {
            id: 10,
            title: 'グローブ',
            description: null,
            type: 'single',
            options: [
              { id: 16, content: '借りる' },
              { id: 17, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
          },

          {
            id: 11,
            title: '身長',
            description: '単位はcm',
            type: 'free_number',
            isPublic: true,
            isOpen: true,
          },
          {
            id: 12,
            title: '足のサイズ',
            description: '単位はcm',
            type: 'free_number',
            isPublic: true,
            isOpen: true,
          },
        ],
      },
      {
        id: 2,
        name: 'バス',
        description: 'バスに乗る？',
        due: '2023-10-01T12:00:00Z',
        questions: [
          {
            id: 1,
            title: '乗るものにチェック',
            description: null,
            type: 'multiple',
            options: [
              { id: 1, content: '行き' },
              { id: 2, content: '帰り' },
            ],
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
            id: 13,
            title: 'アレルギー',
            description: null,
            type: 'free_text',
            isPublic: true,
            isOpen: true,
          },
        ],
      },
    ])
  }),
  http.get('/api/me/question-groups/{questionGroupId}/answers', async ({ params }) => {
    if (params.questionGroupId === '1') {
      return HttpResponse.json([
        {
          id: 203,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 204,
          type: 'single',
          questionId: 4,
          userId: 'traP',
          selectedOption: { id: 7, content: '借りる' },
        },
        {
          id: 205,
          type: 'multiple',
          questionId: 5,
          userId: 'traP',
          selectedOptions: [],
        },
        {
          id: 206,
          type: 'single',
          questionId: 6,
          userId: 'traP',
          selectedOption: { id: 10, content: '借りない' },
        },
        {
          id: 207,
          type: 'single',
          questionId: 7,
          userId: 'traP',
          selectedOption: { id: 12, content: 'M' },
        },
        {
          id: 208,
          type: 'single',
          questionId: 8,
          userId: 'traP',
          selectedOption: { id: 14, content: '借りる' },
        },
        {
          id: 208,
          type: 'free_text',
          questionId: 9,
          userId: 'traP',
          content: 'なにか',
        },
        {
          id: 209,
          type: 'single',
          questionId: 10,
          userId: 'traP',
          selectedOption: { id: 16, content: '借りる' },
        },
        {
          id: 210,
          type: 'free_number',
          questionId: 11,
          userId: 'traP',
          content: 170,
        },
        {
          id: 211,
          type: 'free_number',
          questionId: 12,
          userId: 'traP',
          content: 26,
        },
      ])
    }

    if (params.questionGroupId === '2') {
      return HttpResponse.json([
        {
          id: 201,
          type: 'multiple',
          questionId: 1,
          userId: 'traP',
          selectedOptions: [{ id: 1, content: '行き' }],
        },
        // {
        //   id: 202,
        //   type: 'single',
        //   questionId: 2,
        //   userId: 'traP',
        //   content: { id: 4, questionId: 2, content: '乗らない' },
        // },
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
