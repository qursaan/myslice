// various UI oriented utilities
var unfold = {
    debug_dom: function (msg,dom,maxdepth) {
	if (maxdepth===undefined) maxdepth=5;
	var up=null, counter=0;
	while (true) {
	    console.log(counter+" "+msg+" id='"+dom.id+"' ["+dom.classList+"]");
	    up=dom.parentNode;
	    counter += 1;
	    if ( (up == null) || (up === dom)) break;
	    if (counter >= maxdepth) { console.log(counter+" "+msg+" -> ..."); break; }
	    dom=up;
	}
    },

    warning:function(text){ 
	return "<button class='unfold-warning btn btn-warning'>"+text+"</button>"; 
    },
    error : function(text){ 
	return "<button class='unfold-error btn btn-danger'>"+text+"</button>"; 
    },

    errorDisplay : function (error) {
	return '<div class="error"><dl id="system-message"><dt class="error">Notice</dt><dd class="error message"><ul><li>' + error + '</li></ul></dd></dl></div>';
    return out;
    },

} // global unfold

// xxx tmp - until all plugins are ported
errorDisplay = unfold.errorDisplay;
