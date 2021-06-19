

https://github.com/Kakimoty-Field/renameCloudFoundryAppName


# はじめに
このツールは、[IBM CloudFoundry](https://cloud.ibm.com/cloudfoundry/overview) のアプリケーション名を同じ名前で上書きします

# なんでうれしいの
IBM Cloud Foundry は、開発アクティビティが１０日間無い場合、アプリケーションがスリープします。
このツールを定期的に実行して、開発アクティビティを発生させることによって、アプリケーションがスリープしなくなります。

# IBM Cloud Functions での使い方

1. **アクション** を作成します。ランタイムは `Node.js` の最新版を選択します。
1. **コード**に、`index.js` の中身を貼り付けて、保存します。
1. **トリガー** を `Periodic`で 作成し、**アクション**に接続します。

JSON ペイロード を以下のように設定します。

```
{
    "targetName" : [アクティビティを発生させたい CloudFoundry アプリケーション名],
    "USER_NAME"  : [IBM Cloud のユーザID] 
    "PASS_WORD"  : [IBM Cloud のパスワード],
}
```

正しく設定されていると、**トリガー**で指定したトリガータイミングになると、対象CloudFoundry アプリの「アクティビティー・フィード」に **アプリを更新しました** というメッセージが表示されます。

# 今後やりたいこと
- CLI でインストールできるシェルスクリプトを用意したいな
- Cloud Foundy のAPIを詰め込んだライブラリにできたらいいな
- DevOps ツールチェーンとかにできないのかしら？

# 参考URL
- [Cloud Foundry API Document](http://v3-apidocs.cloudfoundry.org/version/3.101.0/index.html)
- [User Account and Authentication Service Document](https://docs.cloudfoundry.org/api/uaa/version/75.2.0/index.html)
