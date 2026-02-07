import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const campsHandlers = [
  http.get('/api/camps', () => {
    return HttpResponse.json([
      {
        id: 1,
        displayId: 'camp23_summer',
        name: '2023年度 夏合宿',
        guidebook: `# 2023年度 夏合宿のしおり\n以下略`,
        isDraft: false,
        isRegistrationOpen: false,
        isPaymentOpen: false,
        dateStart: '2023-06-01',
        dateEnd: '2023-06-10',
      },
      {
        id: 2,
        displayId: 'camp24_summer',
        name: '2024年度 夏合宿',
        guidebook: `# 2024年度 夏合宿のしおり\n以下略`,
        isDraft: false,
        isRegistrationOpen: false,
        isPaymentOpen: false,
        dateStart: '2024-07-01',
        dateEnd: '2024-07-10',
      },
      {
        id: 3,
        displayId: 'camp25_summer',
        name: '2125年度 夏合宿',
        guidebook: `！！このデータはダミーです！！

# 2125年度 夏合宿のしおり

## 合宿概要

**開催期間**: 2125年8月1日（金）〜 8月10日（日）
**会場**: 山中湖研修センター
**参加費**: 一般 50,000円 / 学生 35,000円

[Google](https://www.google.com/)

## スケジュール

これが \`schedule\` の例です。

### 1日目 - 8月1日（金）
- **13:00** 現地集合・受付開始
- **14:00** 開会式・オリエンテーション
- **15:30** アイスブレイク活動
- **18:00** 夕食・懇親会
- **21:00** 自由時間

### 2日目 - 8月2日（土）
- **07:00** 起床・朝の集い
- **08:00** 朝食
- **09:00** 午前の研修プログラム
- **12:00** 昼食
- **13:30** 午後の研修プログラム
- **17:00** 自由時間
- **18:30** 夕食
- **20:00** レクリエーション大会

## 持ち物チェックリスト

### 必須アイテム
- [ ] 筆記用具（ペン、ノート）
- [ ] 着替え（2〜3日分）
- [ ] 洗面用具
- [ ] タオル
- [ ] 保険証のコピー
- [ ] 常備薬（必要に応じて）

### あると便利なもの
- [ ] カメラ
- [ ] 懐中電灯
- [ ] 虫よけスプレー
- [ ] 日焼け止め
- [ ] 雨具

## 研修内容

### プログラミング基礎講座
**対象**: 初心者〜中級者
**内容**:
- データ構造とアルゴリズム
- オブジェクト指向プログラミング
- デザインパターンの実践

コード例:
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 使用例
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 使用例
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 使用例
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

### チーム開発ワークショップ
- **Git/GitHub** の使い方
- **コードレビュー** の進め方
- **アジャイル開発** の実践

## 食事メニュー

| 日時 | 朝食 | 昼食 | 夕食 |
|------|------|------|------|
| 8/1（金） | - | - | BBQ・ビール・ソフトドリンク |
| 8/2（土） | 和定食 | カレーライス | すき焼き鍋 |
| 8/3（日） | 洋定食 | 弁当 | 中華コース |
| 8/4（月） | 和定食 | そば・うどん | 焼肉 |

## 注意事項

### 安全について
- **夜間の外出は禁止** です
- 体調不良の際は **すぐにスタッフに報告** してください
- アレルギーがある方は **事前に申告** をお願いします

### 施設利用について
- 消灯時間は **23:00** です
- 共用エリアでの **大声での会話は控えめ** に
- **ゴミの分別** にご協力ください

### 緊急連絡先
- **合宿本部**: 090-XXXX-XXXX
- **施設管理事務所**: 0555-XX-XXXX

## Q&A

**Q: Wi-Fiは使えますか？**
A: はい、研修室と宿泊棟でWi-Fiをご利用いただけます。

**Q: コンビニは近くにありますか？**
A: 施設から徒歩5分の場所にコンビニエンスストアがあります。

**Q: 雨の場合はどうなりますか？**
A: 屋外活動は室内プログラムに変更となります。

## 最後に

この合宿が皆様にとって **有意義な学びの場** となることを願っております。
不明な点がございましたら、遠慮なくスタッフまでお声かけください。

---

*合宿実行委員会*`,
        isDraft: false,
        isRegistrationOpen: true,
        isPaymentOpen: true,

        dateStart: '2125-08-01',
        dateEnd: '2125-08-04',
      },
    ])
  }),
  http.post('/api/camps/{campId}/register', ({ params }) => {
    return HttpResponse.json({ message: `Successfully registered for camp ${params.campId}` })
  }),
]
