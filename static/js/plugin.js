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
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('hide-','plugin-'); 
	    var show='#'+$(this).attr('id').replace('hide-','show-'); 
	    jQuery(plugin).hide(); jQuery(show).show(); $(this).hide();});
	})
    $('.plugin-show').each(function() {
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('show-','plugin-'); 
	    var hide='#'+$(this).attr('id').replace('show-','hide-'); 
	    jQuery(plugin).show(); jQuery(hide).show(); $(this).hide();});
	})
    })
