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
            title: '行きのバス',
            description: null,
            type: 'single',
            options: [
              { id: 1, questionId: 1, content: '乗る' },
              { id: 2, questionId: 1, content: '乗らない' },
            ],
            isPublic: true,
            isOpen: false,
          },
          {
            id: 2,
            questionGroupId: 1,
            title: '帰りのバス',
            description: null,
            type: 'single',
            options: [
              { id: 3, questionId: 2, content: '乗る' },
              { id: 4, questionId: 2, content: '乗らない' },
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
]
