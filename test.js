var target = require('./index.js');

var ret = target.main("[appname]");
console.log(ret);

ret = target.main({targetName : ""});
console.log(ret);


ret = target.main({targetName : "AppName"});
console.log(ret);
