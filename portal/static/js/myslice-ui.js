
/* Table initialisation */
$(document).ready(function() {
	
	var platformParameters = {};
	
	var oTable = $("#objectList");
		
	$.get("/rest/platform", function(data) {
		var list = '<div class="list-group-item sl-platfrom"><span class="list-group-item-heading">Testbeds</span></div>';
		for(i=0; i<data.length;i++) {
			list += '<a href="#" class="list-group-item sl-platfrom" data-platform="'+data[i].platform+'"><span class="list-group-item-heading">'+data[i].platform_longname+'</span><p class="list-group-item-text">'+data[i].platform+'</p></a>';
		}
		$('#select-platform').html(list);
	}).done(function() {
		// $('a.sl-platfrom').click(function() {
			// console.log($(this).data('platform'));
			// platformParameters = { "platform" : $(this).data('platform') };
			// $('a.sl-platfrom').removeClass('active');
			// $(this).addClass('active');
// 			
			// oTable.load("/list/resource", platformParameters, function(data) {
				// oTable.fnDraw();
			// });
// 			
			// $('body').data('filters',platformParameters);
		// });
	});
	
	/* Testbeds list */
	$('div#testbed-list').ready(function() {
		$('table#testbedList').load("/table/network/",{'fields' : ['platform'], 'options': ['checkbox']}, function() {
			
		});
	});
	
	//{'columns' : ['hostname','country','type'], 'filters' : { 'country' : 'France' } }
	oTable.load("/table/resource/", {'fields' : ['hostname','hrn','country','type'], 'options': ['checkbox'] }, function(data) {
		$(this).dataTable( {
			"sScrollY": window.innerHeight - 275,
			"sDom": "frtiS",
	        "bScrollCollapse": true,
	        "bStateSave": true,
	        "bPaginate": false,
	        "bLengthChange": false,
	        "bFilter": false,
	        "bSort": true,
	        "bInfo": false,
	        "bAutoWidth": true,
	        "bAutoHeight": false
		} );
	});
} );

function drawTable(data) {
	
}

//http://stackoverflow.com/questions/5100539/django-csrf-check-failing-with-an-ajax-post-request
//make sure to expose csrf in our outcoming ajax/post requests
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});
