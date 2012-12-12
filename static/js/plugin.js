/* upon document completion, we locate all the hide and show areas, 
 * and configure their behaviour 
 */
/* xxx missing - see plugin.php 
 * if (typeof jQuery('#$uuid').$title != 'undefined') {
 * jQuery('#$uuid').$title('show');
 * }; 
 */

$(document).ready(function() {
    $('.plugin-hide').each(function() {
	window.console.log ('@load: id='+$(this).attr('id'));
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('hide-','plugin-'); 
	    var show='#'+$(this).attr('id').replace('hide-','show-'); 
	    window.console.log ("Hiding:"+$(this).attr('id')+' plugin='+plugin+' show='+show);
	    jQuery(plugin).hide(); jQuery(show).show(); $(this).hide();});
	})
    $('.plugin-show').each(function() {
	window.console.log ('@load: id='+$(this).attr('id'));
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('show-','plugin-'); 
	    var hide='#'+$(this).attr('id').replace('show-','hide-'); 
	    window.console.log ("Showing:"+$(this).attr('id')+' plugin='+plugin+' hide='+hide);
	    jQuery(plugin).show(); jQuery(hide).show(); $(this).hide();});
	})
    })
