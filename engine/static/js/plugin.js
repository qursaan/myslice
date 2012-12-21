/* upon document completion, we locate all the hide and show areas, 
 * and configure their behaviour 
 */
$(document).ready(function() {
    window.console.log("Setting plugin toggle behaviour");
    $('.plugin-hide').each(function() {
	window.console.log("Setting plugin toggle behaviour on hide "+$(this).attr('id'));
	$(this).click(function () { 
	    window.console.log("click on a HIDE button");
	    var plugin='#'+$(this).attr('id').replace('hide-',''); 
	    var show='#'+$(this).attr('id').replace('hide-','show-'); 
	    jQuery(plugin).hide(); jQuery(show).show(); $(this).hide();});
	})
    $('.plugin-show').each(function() {
	window.console.log("Setting plugin toggle behaviour on show "+$(this).attr('id'));
	$(this).click(function () { 
	    window.console.log("click on a SHOW button");
	    var plugin='#'+$(this).attr('id').replace('show-',''); 
	    var hide='#'+$(this).attr('id').replace('show-','hide-'); 
	    jQuery(plugin).show(); jQuery(hide).show(); $(this).hide();});
	})
    })
