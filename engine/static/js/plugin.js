/* upon document completion, we locate all the hide and show areas, 
 * and configure their behaviour 
 */
$(document).ready(function() {
    $('.plugin-hide').each(function() {
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('hide-',''); 
	    var show='#'+$(this).attr('id').replace('hide-','show-'); 
	    jQuery(plugin).hide(); jQuery(show).show(); $(this).hide();});
	})
    $('.plugin-show').each(function() {
	$(this).click(function () { 
	    var plugin='#'+$(this).attr('id').replace('show-',''); 
	    var hide='#'+$(this).attr('id').replace('show-','hide-'); 
	    jQuery(plugin).show(); jQuery(hide).show(); $(this).hide();});
	})
    })
