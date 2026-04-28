## 「IPPAY」の要件定義
### 利用者
- GitHubOAuthでログインができる
- 加盟店が生成したQRコードを読み取り、残高から支払いができる
- 残高をチャージできる
- 自分の支払い履歴とチャージ履歴を一覧で確認できる
### 加盟店
- 決済用のQRコードを発行できる
- 特定の決済IDを指定して、利用者へ返金処理ができる
- 利用者からの決済を確定させる
- 日次・月次の売上および決済履歴を確認できる。

### 用語の定義
| 用語 | 英語表記 | 意味 |
| ---- || ---- || ---- |
| ユーザー | user | 支払いを行う一般ユーザー |
| 加盟店 | Merchant | 支払いを受け取る店舗・事業者 |
| 決済 | Transaction | 利用者から加盟店への支払い行為 |
| 返金 | Refund | 完了した決済を取り消し、資金を戻す行為 |
| チャージ | charge | 外部からIPPAY残高へ資金を追加する行為 |

## データモデリング
| テーブル名 | カラム | 備考 |
| ---- || ---- || ---- |
| Users | id, github_id, name, balance | github_idはOAuthの識別子 |
| Merchants | id, shop_name | 加盟店のアカウント店舗用管理アカウント |
| Transactions | id, user_id, merchant_id, amount, status | status: completed, refunded |
| Refunds | id, transaction_id, amount, reason | 返金理由を記録 |
| ChargeHistories | id, user_id, amount | チャージ手段の記録 |

## URL設計
### ページの URL 一覧
| パス | メソッド | ページ名 | ページ内容 |
| ---- || ---- || ---- || ---- |
| / | GET | トップページ | IPPAYのサービス内容を表示する |

### Web API の URL 一覧
#### 利用者用API
| パス | メソッド | 処理内容 | 送るデータ |
| ---- || ---- || ---- || ---- |
| /api/payments | POST | 決済を行う | { merchant_id, amount } |
| /api/charges | POST | チャージを行う | { amount } |
| /api/history | GET | 履歴を見る | なし |
#### 加盟店が利用するAPI
| パス | メソッド | 処理内容 | 送信するデータ |
| ---- || ---- || ---- || ---- |
| /api/merchant/qr | POST | QRコードを生成する | { amount } |
| /api/payments/:id/refund | POST | 返金する | { reason } |

## モジュール設計
フレームワークにはHonoを利用する
### ディレクトリ構造
src/
├── routes/          # ルーティング（入り口）
├── controllers/     # ビジネスロジック（計算・判断）
├── models/          # データベース操作（データの形）
├── middlewares/     # 認証・エラーチェック
└── app.js           # アプリ全体の起動設定
### 各ファイルの責務
| ファイル名 | 責務 |
| ---- || ---- |
| routes/auth.js | OAuthの処理など |
| routes/payments.js | ユーザー向けの処理 |
| routes/merchant.js | 加盟店向けの処理 |
| controllers/authController.js | セッション情報のDB保存など |
| controllers/payController.js | 残高計算、決済記録・チャージのDB保存 |
| controllers/merchantController.js | 売り上げ計算、返金処理 |