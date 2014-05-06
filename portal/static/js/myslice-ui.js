
/*
 * Call it with level: success, info, warning, danger
 */
function mysliceAlert(msg, level, timeout) {
	level = typeof level !== 'undefined' ? level : 'success';
	timeout = typeof timeout !== 'undefined' ? timeout : false;
	var el = $('#myslice-message');
	el.find('.message').text(msg);
	el.addClass('alert-' + level);
	el.parent().fadeIn('fast');
	if (timeout) {
		setTimeout(function(){el.alert('close');},5000);
	}
};
/* Table initialisation */
$(document).ready(function() {
	
	var platformParameters = {};
	
	$('#myslice-message').bind('closed.bs.alert', function () {
		$(this).parent().hide();
	});

	mysliceAlert('hello','danger');
	
	
	$("#objectList").load("/table/resource/", {"fields" : ["hostname","hrn","country","type"], "options": ["checkbox"] }, function(data) {
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
	        "bAutoHeight": false,
	        "fnInitComplete": function(oSettings, json) {
				for(var i = 0; i < myslice.pending.length; i++) {
					var el = $('*[data-key="'+myslice.pending[i]+'"]');
					el.addClass("active");
					el.find('input[type=checkbox]').prop('checked', true);
					if (myslice.count() > 0) {
						$('#badge-pending').text(myslice.count());
						$('#badge-pending').show();
					}
				}
		    }
		} );
		
		
		$("input[type=checkbox]").click(function() {
			var cnt = 0;
			var id = $(this).val();
			var row = $(this).parent().parent()
			if (row.hasClass("active")) {
				row.removeClass("active");
				myslice.del(id);
				cnt = myslice.count();
				$('#badge-pending').text(cnt);
				if (cnt <= 0) {
					$('#badge-pending').hide();
				}
			} else {
				row.addClass("active");
				myslice.add(id);
				cnt = myslice.count();
				$('#badge-pending').text(cnt);
				if (cnt > 0) {
					$('#badge-pending').show();
				}
			}
		});
	});
	
	
});

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
