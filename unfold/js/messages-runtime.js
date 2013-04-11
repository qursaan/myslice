// messages runtime -- convenience functions messages.fatal and the like
// in addition, messages can get lost if the UI is not ready to accept them
// so we use console.log in this case
var messages = {
    ready : false,
    levels : ['fatal','error','warning','info','debug'],
    handler : function (level,msg) {
	if (messages.ready) $.publish("/messages/"+level+"/",msg);
	else console.log("/messages/"+level+"/: "+msg);
    },
};
for (var i in messages.levels) { var level=messages.levels[i]; messages[level]=function (msg) {messages.handler (level,msg)};}
$(function(){messages.ready=true;})
    

