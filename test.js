var target = require('./index.js');

var ret = target.main("[appname]");
console.log(ret); // エラーになる

ret = target.main({targetName : ""});
console.log(ret); // エラーになる


ret = target.main(
    {targetName : process.env.targetName, 
    PASS_WORD :   process.env.Password, 
    USER_NAME :   process.env.UserName});
console.log(ret); // Json が表示される
