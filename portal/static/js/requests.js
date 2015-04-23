function unspin_all_status(){
    $('.portal__validate__checkbox').each(function (index) {
        if(this.checked){
            t_id = this.id.split('__');
            status_id = t_id[t_id.length-2]+'__'+t_id[t_id.length-1]+'-status-loading';
            $('#'+status_id).css('display','none');    
        }
    });
}
function spin_all_status(){
    $('.portal__validate__checkbox').each(function (index) {
        if(this.checked){
            t_id = this.id.split('__');
            status_id = t_id[t_id.length-2]+'__'+t_id[t_id.length-1]+'-status-loading';
            $('#'+status_id).css('display','inline');
        }
    });
}
	$(document).ready(function() {
		$("li#nav-request").addClass("active");
		$('table.requests').dataTable({
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
		});
	});
	function on_click_event() {
		var ids = []; 
		$('.portal__validate__checkbox').each(function(i, el) {
			if ($(el).prop('checked')) {
				// portal__validate__checkbox__slice__2
				var id_array = $(el).attr('id').split('__');
				// push(slice__2)
				ids.push(id_array[3] + '__' + id_array[4]);
			}
		});
		if (ids.length > 0) {
            spin_all_status();
			var id_str = ids.join('/');

			// XXX spinner
			$.getJSON('/portal/validate_action/' + id_str, function(status) {
				$.each(status, function(request_type__id, request_status) {
					// request_status: NAME -> dict (status, description)
					var status_str = '';
					$.each(request_status, function(name, result) {
						if (status_str != '')
							status_str += ' -- ';

						if (result.status) {
							status_str += '<font color="green">OK</font>';
							$('#portal__validate__checkbox__' + request_type__id).hide();
						} else {
							status_str += '<font color="red">ERROR: ' + result.description + '</font>';
						}
					});
					$('#portal__status__' + request_type__id).html(status_str);
				});
                unspin_all_status();
			});
		}
	}
	function on_click_reject() {
		var ids = []; 
		$('.portal__validate__checkbox').each(function(i, el) {
			if ($(el).prop('checked')) {
				// portal__validate__checkbox__slice__2
				var id_array = $(el).attr('id').split('__');
				// push(slice__2)
				ids.push(id_array[3] + '__' + id_array[4]);
			}
		});
		if (ids.length > 0) {
            spin_all_status();
			var id_str = ids.join('/');

			// XXX spinner
			$.getJSON('/portal/reject_action/' + id_str, function(status) {
				$.each(status, function(request_type__id, request_status) {
					// request_status: NAME -> dict (status, description)
					var status_str = '';
					$.each(request_status, function(name, result) {
						if (status_str != '')
							status_str += ' -- ';

						if (result.status) {
							status_str += '<font color="green">Rejected</font>';
							$('#portal__validate__checkbox__' + request_type__id).hide();
						} else {
							status_str += '<font color="red">ERROR: ' + result.description + '</font>';
						}
					});
					$('#portal__status__' + request_type__id).html(status_str);
				});
                unspin_all_status();
			});
		}
	}
