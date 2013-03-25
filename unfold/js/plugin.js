var plugin = {

    debug:true,

    ////////// use local storage to remember open/closed toggles
    store_status : function (domid) {
	var plugin=$('#'+domid);
	key='toggle.'+domid;
	if (debug) console.log('storing toggle status for '+domid);
	$.localStorage.setItem(key,plugin.visible());
    },
    // restore last status
    restore_last_status : function (domid) {
	key='toggle.'+domid;
	// don't do anything if nothing stored
	var retrieved=$.localStorage.getItem(key,undefined);
	if (retrieved===null) return;
	if (debug) console.log ("Applying retrieved status " + retrieved +  " to " + domid);
	set_visible(domid,retrieved);
    },
    // triggered upon $(document).ready
    init_all_plugins: function() {
	$('.plugin-hide').each(function() {
	    $(this).click(function () { 
		var plugin='#'+this.id.replace('hide-',''); 
		var show='#'+this.id.replace('hide-','show-'); 
		$(plugin).slideUp(); $(show).show(); $(this).hide();});
	});
	$('.plugin-show').each(function() {
	    $(this).click(function () { 
		var plugin='#'+this.id.replace('show-',''); 
		var hide='#'+this.id.replace('show-','hide-'); 
		$(plugin).slideDown(); $(hide).show(); $(this).hide();});
	});
	$('.plugin-tooltip').each(function(){ $(this).tooltip({'selector':'','placement':'right'}); });
    },
    toggle : function (domid) {
	var plugin=$('#'+domid);
	plugin.toggle();
	var showbtn=$('#show-'+domid);
	var hidebtn=$('#hide-'+domid);
	if (plugin.visible()) {
	    hidebtn.show();
	    showbtn.hide();
	} else {
	    hidebtn.hide();
	    showbtn.show();
	}
	plugin.store_status(domid);
    },
    // 'target' is retrieved from storage so essentially a string 'true' or 'false'
    set_visible : function (domid, target) {
	var plugin=$('#'+domid);
	if (plugin.visible()!=target) {
	    if (debug) console.log('set_visible: toggling ' + domid);
	    plugin.toggle (domid);
	}
    },
} // global unfold

/* upon document completion, we locate all the hide and show areas, 
 * and configure their behaviour 
 */
$(document).ready(plugin.init_all_plugins)

