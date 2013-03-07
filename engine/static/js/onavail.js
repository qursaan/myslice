onavail_debug=true;

function onFunctionAvailable(sMethod, oCallback, oObject, bScope) {
    if (eval('typeof ' + sMethod) == 'function') {
	if (onavail_debug) console.log("onFunctionAvailable, running");
        bScope ? oCallback.call(oObject) : oCallback(oObject);
    } else { 
	if (onavail_debug) console.log("onFunctionAvailable, delaying for 50 ms");
        setTimeout(function () {onFunctionAvailable(sMethod, oCallback, oObject, bScope);}, 50);
    }
}       
function onObjectAvailable(sMethod, oCallback, oObject, bScope) {
    if (eval('typeof ' + sMethod) == 'object') {
        bScope ? oCallback.call(oObject) : oCallback(oObject);
    } else {
        setTimeout(function () {onObjectAvailable(sMethod, oCallback, oObject, bScope);}, 50);
    }
}
