/**
  *
  * main() このアクションを呼び出すときに実行されます
  *
  * @param Cloud Functions アクションは 1 つのパラメーターを受け入れます。このパラメーターは JSON オブジェクトでなければなりません。
  *
  * @return このアクションの出力。この出力は、JSON オブジェクトでなければなりません。
  *
  */
 const https = require('https');

 const QueryString = require('querystring');
  
 const API_URL_GETBASEADDRESS = "https://api.ng.bluemix.net/v2/info";
 const API_URLPARTS_GETTOKEN = "oauth/token";
 const API_URL_APP = "https://api.ng.bluemix.net/v3/apps";

 const ENV_USERNAME=process.env.USERNAME;
 const ENV_PASSWORD=process.env.PASSWORD;

//
// エントリーポイント
// 
 async function main(params) {
    if( !params || !params.targetName) return { message : "No Param" };

    var targetName = params.targetName;

    var ret = await getBaseURL();
    var token = await getToken(ret.authorization_endpoint);
    var applist = await getApp(token, targetName);
    var result = await updateStatus(token ,applist.resources[0].guid, targetName);
    console.log(result);
    return { message: result };
 }
 
 //
 // 認証 UAA のホスト名を取得するために、CloudFoundry Platform の情報を取得します。
 async function getBaseURL()
 {
     var ret = await httpSequence(API_URL_GETBASEADDRESS);
     return JSON.parse(ret);
 }
 
//
// API呼び出し用トークン取得します。
 async function getToken(baseUrl)
 {
     console.log(">>>> gettoken");
     //(補足) Y2Y6は、username:cf (passwordなし）をBase64でエンコードしたものになります。
     var headers = {
         'Authorization': "Basic Y2Y6",
         'Content-Type': "application/x-www-form-urlencoded"
     };
     
    var payload = {
        "username"  : ENV_USERNAME,
        "password"  : ENV_PASSWORD,
        "grant_type": "password",
        "response_type": "token"
    };
     var ret = await httpSequence(`${baseUrl}/${API_URLPARTS_GETTOKEN}`, 
                                  "POST",
                                  headers, 
                                  QueryString.stringify(payload)).catch();
      
      return JSON.parse(ret);
 }

 //
 // 更新対象のアプリケーション情報を取得します。
 async function getApp(token, name)
 {
    console.log(">>>> getGUID");
    var headers = {
        'Authorization': `${token.token_type} ${token.access_token}`,
        'Content-Type': "application/x-www-form-urlencoded"
    };
    var ret = await httpSequence(`${API_URL_APP}?names=${name}`, 
                                 "GET",
                                 headers).catch();
     
     return JSON.parse(ret);
 }
 
 //
 // アプリケーションを更新します。
async function updateStatus(token, guid, name)
{
    console.log(">>>> updateStatus");
    var headers = {
        'Authorization': `${token.token_type} ${token.access_token}`,
        'Content-Type': "application/json"
    };
    var ret = await httpSequence(`${API_URL_APP}/${guid}`, 
                                 "PATCH",
                                 headers,
                                 JSON.stringify({name : name})
                                 ).catch();
     
     return JSON.parse(ret);
}

 //
 // HTTPS 通信を処理します。
 function httpSequence(url, method, headers, postData)
 {
     return new Promise( (resolve, reject) => 
     {
         var opt = {
             method : method || "GET",   // default = GET
             headers : headers || {}     // default = empty
         };
         
         console.log("-----httpSequence", url);
 
         var buffer = "";
         var req = https.request(url, opt, (res) => 
         {
             res.on('data', (data) => 
             {
                 buffer += data;
             });
             res.on('end', () => {
                 // Status Check
                 if( 200 !== res.statusCode )
                 {
                     console.log(res.statusCode);
                     reject(buffer);
                 } else {
                     resolve(buffer)
                 }
             });
         }).on('error', (err) => 
         {
             reject(err);
         });
         
         if( postData )
         {
             console.log(postData);
             req.write(postData);
         }
         req.end(); // .get() なら必要ない
     });
 }

 exports.main = main;

 //main({targetName:"kakimoty-field-nr"});
