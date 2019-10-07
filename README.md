# KUPlus(くーぷら) とは
KULASISなどの京都大学学務システムの機能を拡張する非公式拡張機能です。
現在、以下の機能を実装しています。

* 未確定時間割ページ上に教室情報を表示
* シラバス検索ページで検索対象時限の設定欄に現在の仮時間割を表示
* シラバス検索ページで一覧画面内で詳細を表示
* 確定時間割ページでCSVダウンロード
* 時間割ページからワンクリックで「授業資料」等にアクセス
* 授業資料の一覧でのDL機能

# ダウンロード
原則下記のChromeウェブストアからダウンロードしてください。
https://chrome.google.com/webstore/detail/obeghdnflgepdemhcnkmbnojlcbdlenl/

本リポジトリをクローンして、ご自身のChromeに導入することも可能です。ただし、アップデートが自動で行われないため、将来的に不具合が発生する可能性があります。

# 使用上の注意
作者は、本拡張機能を使用したことによるいかなる損害に対しても**一切**責任を負いません。自己責任で使用してください。  
特に履修登録などの重大な手続きにおいて、本拡張機能が原因の損害が発生した場合でも、いかなる補償もいたしかねます。予めご了承ください。  
万全を期す場合は、本拡張機能を一時的に無効にして操作を行っていただければと思います。

ソースコードを見ていただければわかるとは思いますが、拡張機能実装にあたり、KULASISでの手続きや検索処理を加工するような実装はしておりません。

# ChangeLog
## v2.0.0
* シラバス小窓の廃止
* `chrome://newtab/` でポップアップクリック時に新規タブを開かないように変更
* My部局ボタンを削除
* (開発環境を一新)

## v1.1.0
* 授業資料の一覧でのDL機能追加

## v1.0.0
* 初版リリース

# 今後の実装予定
* シラバス検索ページでの空きコマ全選択機能
* 教室情報読込時の「Now Loading...」表示
* 未確定時間割のCSVダウンロード
* 確定時間割情報の読み込み（需要が微妙）
* My部局の登録・ジャンプ

# お問い合わせ
本拡張機能に関するお問い合わせは、
[@d0ra1998](https://twitter.com/d0ra1998)
までリプライ又はDMなどでお願いします。