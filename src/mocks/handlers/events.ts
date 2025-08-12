import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

// moment: 合宿公式の特定の時刻の予定
// official: 合宿が公式に開催する「開始時刻と終了時刻が異なる」イベント
// duration: 有志が開催する「開始時刻と終了時刻が異なる」イベント

export const eventsHandlers = [
  http.get('/api/camps/{campId}/events', async () => {
    return HttpResponse.json([
      // 1日目 (2025-08-01)
      {
        id: 1,
        type: 'moment',
        name: '駐車場集合',
        description: '合宿の開始前に駐車場に集合してください。',
        location: '駐車場',
        time: '2025-08-01T13:00:00+09:00',
      },
      {
        id: 2,
        type: 'official',
        name: 'オープニングセレモニー',
        description: '合宿の開始を祝うセレモニーです。',
        location: 'メインホール',
        timeStart: '2025-08-01T14:00:00+09:00',
        timeEnd: '2025-08-01T15:30:00+09:00',
      },
      {
        id: 3,
        type: 'moment',
        name: '出発',
        description: '合宿地へ出発します。',
        location: '集合場所',
        time: '2025-08-01T15:30:00+09:00',
      },
      {
        id: 4,
        type: 'moment',
        name: '到着',
        description: '合宿地に到着します。',
        location: '合宿地',
        time: '2025-08-01T18:00:00+09:00',
      },
      {
        id: 5,
        type: 'duration',
        name: 'カードゲーム大会',
        description: `合宿中のカードゲーム大会です。Markdown 表示の検証用に詳細情報を含めています。

## 概要
みんなでワイワイ楽しむカジュアルな大会です。初心者歓迎、途中参加・途中退出OK。

### タイムテーブル
1. 19:00 受付開始
2. 19:15 ルール説明（簡易）
3. 19:30 予選ラウンド開始
4. 20:30 決勝卓
5. 21:00 表彰・解散

### ルール例

> ルールは当日の参加者に合わせて柔軟に調整します。

### 持ち物

### 事前タスク（チェックリスト）


### 参考リンク
- 参加ガイド: https://example.com/card-event-guide
- 進行メモ（内部向け）: https://example.com/notes

### スコアシート例（コードブロック）
~~~text
プレイヤー, 勝ち数
Alice, 2
Bob, 1
Carol, 0
~~~

### 所要時間の目安（テーブル）
| ゲーム | 想定時間 |
|:--|:--|
| UNO | 10〜20分 |
| カタン | 60〜90分 |
| ドミニオン | 30〜60分 |

![雰囲気イメージ](/logo/logo.svg)

主催: @kitsne / 会場: ゲームルーム`,
        location: 'ゲームルーム',
        timeStart: '2025-08-02T19:00:00+09:00',
        timeEnd: '2025-08-02T21:00:00+09:00',
        organizerId: 'kitsne',
        displayColor: 'blue',
      },
      // 1日目夜
      {
        id: 6,
        type: 'official',
        name: '夕食',
        description: '合宿初日の夕食です。',
        location: 'レストラン',
        timeStart: '2025-08-01T18:30:00+09:00',
        timeEnd: '2025-08-01T20:00:00+09:00',
      },
      {
        id: 7,
        type: 'duration',
        name: 'ウェルカムパーティー',
        description: '参加者同士の親睦を深める懇親会です。',
        location: 'パーティールーム',
        timeStart: '2025-08-01T20:30:00+09:00',
        timeEnd: '2025-08-01T22:30:00+09:00',
        organizerId: 'party_organizer',
        displayColor: 'purple',
      },
      {
        id: 8,
        type: 'duration',
        name: 'ナイトゲーム',
        description: '夜の親睦ゲーム大会。',
        location: 'リビング',
        timeStart: '2025-08-01T21:00:00+09:00',
        timeEnd: '2025-08-01T23:00:00+09:00',
        organizerId: 'game_master',
        displayColor: 'green',
      },
      {
        id: 9,
        type: 'moment',
        name: '消灯',
        description: '1日目の就寝時間です。',
        location: '宿泊棟',
        time: '2025-08-01T24:00:00+09:00',
      },

      // 2日目 (2025-08-02)
      {
        id: 10,
        type: 'moment',
        name: '起床',
        description: '2日目の始まりです。',
        location: '宿泊棟',
        time: '2025-08-02T07:00:00+09:00',
      },
      {
        id: 11,
        type: 'official',
        name: '朝食',
        description: '合宿2日目の朝食です。',
        location: 'レストラン',
        timeStart: '2025-08-02T08:00:00+09:00',
        timeEnd: '2025-08-02T09:00:00+09:00',
      },
      {
        id: 12,
        type: 'official',
        name: 'モーニングセッション',
        description: '午前中のメインセッションです。',
        location: 'メインホール',
        timeStart: '2025-08-02T09:30:00+09:00',
        timeEnd: '2025-08-02T11:30:00+09:00',
      },
      {
        id: 13,
        type: 'duration',
        name: 'プログラミング勉強会',
        description: 'コーディング技術の共有セッション。',
        location: '研修室A',
        timeStart: '2025-08-02T10:00:00+09:00',
        timeEnd: '2025-08-02T12:00:00+09:00',
        organizerId: 'tech_lead',
        displayColor: 'orange',
      },
      {
        id: 14,
        type: 'duration',
        name: 'デザイン思考ワークショップ',
        description: 'UI/UXデザインについて学ぶワークショップ。',
        location: '研修室B',
        timeStart: '2025-08-02T10:30:00+09:00',
        timeEnd: '2025-08-02T12:30:00+09:00',
        organizerId: 'design_mentor',
        displayColor: 'pink',
      },
      {
        id: 15,
        type: 'official',
        name: '昼食',
        description: '2日目の昼食です。',
        location: 'レストラン',
        timeStart: '2025-08-02T12:00:00+09:00',
        timeEnd: '2025-08-02T13:00:00+09:00',
      },
      {
        id: 16,
        type: 'duration',
        name: 'ハッカソン準備',
        description: 'ハッカソンのチーム分けと企画相談。',
        location: 'コワーキングスペース',
        timeStart: '2025-08-02T13:30:00+09:00',
        timeEnd: '2025-08-02T15:00:00+09:00',
        organizerId: 'hackathon_organizer',
        displayColor: 'red',
      },
      {
        id: 17,
        type: 'official',
        name: 'ハッカソン開始',
        description: '24時間ハッカソンの開始です。',
        location: 'コワーキングスペース',
        timeStart: '2025-08-02T15:00:00+09:00',
        timeEnd: '2025-08-03T15:00:00+09:00',
      },
      {
        id: 18,
        type: 'duration',
        name: 'サウナセッション',
        description: 'リフレッシュタイム。',
        location: 'サウナ',
        timeStart: '2025-08-02T16:00:00+09:00',
        timeEnd: '2025-08-02T18:00:00+09:00',
        organizerId: 'sauna_master',
        displayColor: 'blue',
      },
      {
        id: 19,
        type: 'duration',
        name: 'スポーツタイム',
        description: 'バレーボールやバスケットボールで体を動かしましょう。',
        location: '体育館',
        timeStart: '2025-08-02T16:30:00+09:00',
        timeEnd: '2025-08-02T18:30:00+09:00',
        organizerId: 'sports_captain',
        displayColor: 'green',
      },
      {
        id: 20,
        type: 'official',
        name: '夕食',
        description: '2日目の夕食です。',
        location: 'レストラン',
        timeStart: '2025-08-02T18:30:00+09:00',
        timeEnd: '2025-08-02T20:00:00+09:00',
      },
      // すでに定義済みのカードゲーム大会 (id: 5)
      {
        id: 21,
        type: 'duration',
        name: 'ボードゲーム大会',
        description: 'カードゲーム大会と同時開催のボードゲーム大会。',
        location: 'ゲームルーム2',
        timeStart: '2025-08-02T19:30:00+09:00',
        timeEnd: '2025-08-02T21:30:00+09:00',
        organizerId: 'board_game_master',
        displayColor: 'purple',
      },
      {
        id: 22,
        type: 'duration',
        name: '深夜の開発タイム',
        description: 'ハッカソンの集中開発時間。',
        location: 'コワーキングスペース',
        timeStart: '2025-08-02T22:00:00+09:00',
        timeEnd: '2025-08-03T02:00:00+09:00',
        organizerId: 'night_owl_dev',
        displayColor: 'orange',
      },

      // 3日目 (2025-08-03)
      {
        id: 23,
        type: 'moment',
        name: '起床',
        description: '最終日の始まりです。',
        location: '宿泊棟',
        time: '2025-08-03T07:30:00+09:00',
      },
      {
        id: 24,
        type: 'official',
        name: '朝食',
        description: '最終日の朝食です。',
        location: 'レストラン',
        timeStart: '2025-08-03T08:00:00+09:00',
        timeEnd: '2025-08-03T09:00:00+09:00',
      },
      {
        id: 25,
        type: 'duration',
        name: 'ハッカソン最終調整',
        description: 'ハッカソンの最終調整と発表準備。',
        location: 'コワーキングスペース',
        timeStart: '2025-08-03T09:00:00+09:00',
        timeEnd: '2025-08-03T14:00:00+09:00',
        organizerId: 'hackathon_organizer',
        displayColor: 'red',
      },
      {
        id: 26,
        type: 'duration',
        name: '朝のお散歩会',
        description: '自然の中でリフレッシュしましょう。',
        location: '周辺散策路',
        timeStart: '2025-08-03T09:30:00+09:00',
        timeEnd: '2025-08-03T10:30:00+09:00',
        organizerId: 'nature_guide',
        displayColor: 'green',
      },
      {
        id: 27,
        type: 'duration',
        name: '写真撮影会',
        description: '合宿の思い出を写真に残そう。',
        location: '庭園',
        timeStart: '2025-08-03T10:00:00+09:00',
        timeEnd: '2025-08-03T11:00:00+09:00',
        organizerId: 'photographer',
        displayColor: 'pink',
      },
      {
        id: 28,
        type: 'official',
        name: '昼食',
        description: '最終日の昼食です。',
        location: 'レストラン',
        timeStart: '2025-08-03T12:00:00+09:00',
        timeEnd: '2025-08-03T13:00:00+09:00',
      },
      // ハッカソン終了 (すでにid: 17で定義済み)
      {
        id: 29,
        type: 'official',
        name: 'ハッカソン発表会',
        description: 'ハッカソンの成果発表会です。',
        location: 'メインホール',
        timeStart: '2025-08-03T15:30:00+09:00',
        timeEnd: '2025-08-03T17:30:00+09:00',
      },
      {
        id: 30,
        type: 'duration',
        name: '表彰式準備',
        description: 'ハッカソンの表彰式の準備。',
        location: 'メインホール',
        timeStart: '2025-08-03T15:00:00+09:00',
        timeEnd: '2025-08-03T15:30:00+09:00',
        organizerId: 'event_staff',
        displayColor: 'orange',
      },
      {
        id: 31,
        type: 'duration',
        name: '懇親会準備',
        description: '最後の懇親会の準備をしましょう。',
        location: 'パーティールーム',
        timeStart: '2025-08-03T16:00:00+09:00',
        timeEnd: '2025-08-03T17:00:00+09:00',
        organizerId: 'party_prep_team',
        displayColor: 'purple',
      },
      {
        id: 32,
        type: 'official',
        name: 'クロージングセレモニー',
        description: '合宿の締めくくりセレモニーです。',
        location: 'メインホール',
        timeStart: '2025-08-03T18:00:00+09:00',
        timeEnd: '2025-08-03T19:00:00+09:00',
      },
      {
        id: 33,
        type: 'duration',
        name: 'フェアウェルパーティー',
        description: '最後の懇親会です。',
        location: 'パーティールーム',
        timeStart: '2025-08-03T19:30:00+09:00',
        timeEnd: '2025-08-03T21:30:00+09:00',
        organizerId: 'farewell_organizer',
        displayColor: 'blue',
      },
      {
        id: 34,
        type: 'moment',
        name: '荷造り開始',
        description: '帰宅準備を始めましょう。',
        location: '宿泊棟',
        time: '2025-08-03T21:00:00+09:00',
      },
      {
        id: 35,
        type: 'moment',
        name: 'チェックアウト',
        description: '宿泊施設からのチェックアウトです。',
        location: 'フロント',
        time: '2025-08-03T22:00:00+09:00',
      },
      {
        id: 36,
        type: 'moment',
        name: '出発',
        description: '合宿地からの出発です。',
        location: '合宿地',
        time: '2025-08-03T22:30:00+09:00',
      },
      {
        id: 37,
        type: 'moment',
        name: '出発地到着',
        description: '出発地に到着しました。',
        location: '集合場所',
        time: '2025-08-04T01:00:00+09:00',
      },
      {
        id: 38,
        type: 'moment',
        name: '解散',
        description: '合宿終了、お疲れさまでした！',
        location: '集合場所',
        time: '2025-08-04T01:30:00+09:00',
      },
    ])
  }),
]
