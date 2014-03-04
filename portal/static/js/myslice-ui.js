
/* Table initialisation */
$(document).ready(function() {
	
	var platformParameters = {};
	
		
	
	
	/* Testbeds list */
	$.post("/rest/network/", { "fields" : ["network_hrn", "network_longname", "description"]}, function(data) {
		var testbed_data = [];
		var testbed_row = "<thead>";
		testbed_row += "<tr>";
		testbed_row += "<th id=testbed_check><input type=\"checkbox\" name=\"network_hrn\" value=\"all\"/></th>";
		testbed_row += "<th id=testbed_icon></th>";
		testbed_row += "<th>network_hrn</th>";
		testbed_row += "<th>Full name</th>";
		testbed_row += "<th>Description</th>";
		testbed_row += "</tr>";
		testbed_row += "</thead>";
		testbed_data.push(testbed_row);
		$.each( data, function(key, val) {
			testbed_row = "<tr data-keys=\""+val.network_hrn+"\">"
			testbed_row += "<td><input type=\"checkbox\" name=\"network_hrn\" value=\""+val.network_hrn+"\"/></td>";
			testbed_row += "<td><img src='/static/img/testbeds/"+val.network_hrn+".png' alt='' /></td>";
			testbed_row += "<td>"+val.network_hrn+"</td>";
			testbed_row += "<td>"+val.network_longname+"</td>";
			testbed_row += "<td>"+val.description+"</td>";
			testbed_row += "</thead>";

			testbed_data.push(testbed_row);
		});
	$("table#testbedList").html(testbed_data.join(''));
	$("div#testbed-list-loaded").css("display","block");
	$("div#testbed-list-loading").css("display","none");

			
	});
	
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
