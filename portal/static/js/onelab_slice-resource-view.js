$(document).ready(function() {
	$('ul.nav-resources a').click(function() {
        $('ul.nav-resources li').removeClass('active');
        $(this).parent().addClass('active');
        $('div.panel').hide();
        $('div#'+$(this).data('panel')).show();
    });
});