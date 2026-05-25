[![GreasyFork](https://img.shields.io/badge/GreasyFork-install-orange)](https://greasyfork.org/ja/scripts/579674-atcoder-novisteps-auto-sync-unofficial-port)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-green)](https://github.com/kirameku26/AtCoder-NoviSteps-Auto-Sync-Unofficial-port)
# AtCoder NoviSteps Auto Sync (Unofficial Port)

AtCoder での AC 状況を、[AtCoder NoviSteps](https://atcoder-novisteps.vercel.app/) へ自動的に同期するための ユーザースクリプト（非公式）です。

---

## 開発の背景

[AtCoder NoviSteps Auto Sync](https://github.com/kuruton3910/atcoder-novisteps-sync)を使おうと思いましたが、ユーザースクリプトに実装した場合、導入が簡単になることや、私のように諸事情でChromeのデベロッパー モードが使えない場合があるからです

---

## 特徴

- **ワンタップ同期:** ページを開くと右下にボタンが現れ、ワンクリックで [AtCoder Problems](https://kenkoooo.com/atcoder/) API から最新の AC 状況を取得し、自動で NoviSteps の進捗に反映します。
- **低負荷設計:** サーバーへの敬意を忘れず、リクエスト間に適切な待機時間を設けています。

---

## 動作確認環境

- Google Chrome（最新版推奨）

---

## 使い方（Tampermonkeyでの導入）

1. [このユーザースクリプト](https://greasyfork.org/ja/scripts/579674-atcoder-novisteps-auto-sync-unofficial-port)をダウンロードします。

2. `Tampermonkey` を開いた欄にある `ユーザー名の設定 (AtCoder NoviSteps Auto Sync)` を開き、**自分の AtCoder ID を入力してOKボタンを押してください（この手順を忘れると正常に動作しません）。**

   ![IDを入力する設定欄](<images/01_USER_ID_settings.png>)

   ![あなたのIDを入力する](<images/02_input_USER_ID.png>)

> ⚠️ **注意:** `USER_ID` を書き換えずに使用した場合、同期は正常に機能しません。必ず手順2を実行してください。

---

## 必要な権限について

本拡張機能は以下の権限を使用します。

- `kenkoooo.com` へのアクセス（AC状況の取得）
- `atcoder-novisteps.vercel.app` へのアクセス（進捗の書き込み）

これら以外のサイトやデータへはアクセスしません。

---

## 注意事項・既知の制限

- 同期は AtCoder Problems への提出データの反映状況に依存します。AtCoder Problems 側の更新が遅れている場合、NoviSteps への反映も遅れることがあります。
- 同期済み問題の「取り消し」には対応していません。
- 問題数が多い場合、初回の同期に時間がかかることがあります。
- [AtCoder Problems API](https://kenkoooo.com/atcoder/) の利用規約・利用制限をご確認のうえ、常識の範囲内でご利用ください。

---

## 謝辞とリスペクト

本ツールは、以下の素晴らしいサービスと、その開発者・運営者様に心からの敬意を表して作成されました。

- **[AtCoder NoviSteps](https://atcoder-novisteps.vercel.app/)** 様（発起人：@drken1215 様、および開発メンバーの皆様）
- **[AtCoder Problems](https://kenkoooo.com/atcoder/)** 様（@kenkoooo 様）
- **[AtCoder](https://atcoder.jp/)** 様（AtCoder株式会社 様）
- **[リプトン](https://github.com/kuruton3910)** 様（@Rptonn 様）

---

## 免責事項

- 本ツールは個人が作成した**完全非公式**のツールです。
- 本ツールに関するお問い合わせを、NoviSteps 運営チームや AtCoder 株式会社様へ行わないでください。
- ご利用は自己責任でお願いします。

---

## License

[MIT License](./LICENSE)
