/* upon document completion, we locate all the hide and show areas, 
 * and configure their behaviour 
 */
/* xxx missing - see plugin.php 
 * if (typeof jQuery('#$uuid').$title != 'undefined') {
 * jQuery('#$uuid').$title('show');
 * }; 
 */

$(document).ready(
    function() {
	$('.plugin-hide').each(function(p) {
	    plugin='#'+$(this).attr('id').replace('hide-','plugin-');
	    show='#'+$(this).attr('id').replace('hide-','show-');
	    type=$(this).attr('plugin-type');
	    $(this).click(function () { jQuery(plugin).hide(); jQuery(show).show(); $(this).hide();})
	})
	$('.plugin-show').each(function(p) {
	    plugin='#'+$(this).attr('id').replace('show-','plugin-');
	    hide='#'+$(this).attr('id').replace('show-','hide-');
	    type=$(this).attr('plugin-type');
	    $(this).click(function () { jQuery(plugin).show(); jQuery(hide).show(); $(this).hide();})
	})
	    })


