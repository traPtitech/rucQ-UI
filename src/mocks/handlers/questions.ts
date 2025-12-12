import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const questionsHandlers = [
  http.get('/api/camps/{campId}/question-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'スキー',
        description:
          'スキー・スノボをする人のための質問です。\n借りるものを全て選んで保存してください(https://www.google.com/)。',
        due: '2125-07-30T12:00:00Z',
        questions: [
          {
            id: 3,
            title: 'スキーをする？',
            type: 'single',
            options: [
              { id: 5, content: 'する' },
              { id: 6, content: 'しない' },
            ],
            isPublic: true,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 4,
            title: 'スキーセット',
            type: 'single',
            options: [
              { id: 7, content: '借りる' },
              { id: 8, content: '借りない' },
            ],
            isPublic: false,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 5,
            title: '自由選択',
            type: 'multiple',
            options: [
              { id: 18, content: '選択肢1' },
              { id: 19, content: '選択肢2' },
            ],
            isPublic: true,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 6,
            title: 'スノーボードセット',
            type: 'single',
            options: [
              { id: 9, content: '借りる' },
              { id: 10, content: '借りない' },
            ],
            isPublic: false,
            isOpen: false,
            isRequired: false,
          },
          {
            id: 7,
            title: 'スキーウェア',
            type: 'single',
            options: [
              { id: 11, content: 'S' },
              { id: 12, content: 'M' },
              { id: 13, content: 'L' },
            ],
            isPublic: false,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 8,
            title: 'ゴーグル',
            type: 'single',
            options: [
              { id: 14, content: '借りる' },
              { id: 15, content: '借りない' },
            ],
            isPublic: false,
            isOpen: false,
            isRequired: false,
          },
          {
            id: 9,
            title: '自由記述',
            type: 'free_text',
            isPublic: true,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 10,
            title: 'グローブ',
            type: 'single',
            options: [
              { id: 16, content: '借りる' },
              { id: 17, content: '借りない' },
            ],
            isPublic: true,
            isOpen: false,
            isRequired: false,
          },
          {
            id: 11,
            title: '身長',
            description: '単位はcm',
            type: 'free_number',
            isPublic: true,
            isOpen: true,
            isRequired: false,
          },
          {
            id: 12,
            title: '足のサイズ',
            description: '単位はcm',
            type: 'free_number',
            isPublic: false,
            isOpen: true,
            isRequired: false,
          },
        ],
      },
      {
        id: 2,
        name: 'バス',
        description: 'バスに乗る？',
        due: '2125-07-30T12:00:00Z',
        questions: [
          {
            id: 1,
            title: '乗るものにチェック',
            type: 'multiple',
            options: [
              { id: 1, content: '行き' },
              { id: 2, content: '帰り' },
            ],
            isPublic: false,
            isOpen: false,
            isRequired: false,
          },
        ],
      },
      {
        id: 3,
        name: 'その他',
        description: 'その他の質問です。',
        due: '2125-07-30T12:00:00Z',
        questions: [
          {
            id: 13,
            title: 'アレルギー',
            type: 'free_text',
            isPublic: false,
            isOpen: true,
            isRequired: false,
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
  http.post('/api/question-groups/{questionGroupId}/answers', async () => {
    const resp = [
      {
        id: 1,
        type: 'free_text' as const,
        questionId: 301,
        userId: 'traP',
        content: 'はろー',
      },
    ]
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
    return HttpResponse.json(resp, { status: 200 })
  }),
  http.get('/api/questions/{questionId}/answers', async ({ params }) => {
    if (params.questionId === '3') {
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
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 205,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 206,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 207,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 208,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 209,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 210,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 211,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 212,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 213,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 214,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 215,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 216,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 217,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 218,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 219,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 220,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 221,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 222,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 223,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 224,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 225,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 226,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 227,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 228,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 229,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 230,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 231,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 232,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 5, content: 'する' },
        },
        {
          id: 263,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 6, content: 'しない' },
        },
        {
          id: 264,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 6, content: 'しない' },
        },
        {
          id: 265,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 6, content: 'しない' },
        },
        {
          id: 266,
          type: 'single',
          questionId: 3,
          userId: 'traP',
          selectedOption: { id: 6, content: 'しない' },
        },
      ])
    }
    if (params.questionId === '5') {
      return HttpResponse.json([
        {
          id: 205,
          type: 'multiple',
          questionId: 5,
          userId: 'traP',
          selectedOptions: [{ id: 18, content: '選択肢1' }],
        },
        {
          id: 206,
          type: 'multiple',
          questionId: 5,
          userId: 'traP',
          selectedOptions: [{ id: 19, content: '選択肢2' }],
        },
        {
          id: 207,
          type: 'multiple',
          questionId: 5,
          userId: 'traP',
          selectedOptions: [
            { id: 18, content: '選択肢1' },
            { id: 19, content: '選択肢2' },
          ],
        },
      ])
    }
    if (params.questionId === '9') {
      return HttpResponse.json([
        {
          id: 285,
          type: 'free_text',
          questionId: 9,
          userId: 'traP',
          content:
            'サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト',
        },
        {
          id: 286,
          type: 'free_text',
          questionId: 9,
          userId: 'traP',
          content: 'サンプルテキストサンプルテキスト',
        },
        {
          id: 287,
          type: 'free_text',
          questionId: 9,
          userId: 'traP',
          content: 'サンプルテキストサンプルテキスト',
        },
      ])
    }
    if (params.questionId === '11') {
      return HttpResponse.json([
        {
          id: 326,
          type: 'free_number',
          questionId: 11,
          userId: 'traP',
          content: 170,
        },
        {
          id: 327,
          type: 'free_number',
          questionId: 11,
          userId: 'traP',
          content: 170,
        },
        {
          id: 328,
          type: 'free_number',
          questionId: 11,
          userId: 'traP',
          content: 180,
        },
        {
          id: 329,
          type: 'free_number',
          questionId: 11,
          userId: 'traP',
          content: 180,
        },
      ])
    }
    return HttpResponse.json([])
  }),
]
