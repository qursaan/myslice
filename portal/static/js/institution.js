$(document).ready(function() {
	loadedTabs = [];
	
	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		id = $(this).attr('href').substr(1);
		if (!(id in loadedTabs)) {
			switch(id) {
				case 'users':
					//loadUsers();
					loadedTabs[id] = true;
				break;
			}
		}
		
	});

    /* TODO: factorize into functions */
    $('button#deleteslices').click(function() {
        $('input:checkbox.slice').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $.post("/delete/slice/",{'filters':{'slice_hrn':this.id}}, function(data) {
                    if(data.success){
                        $('tr[id="'+record_id+'"]').fadeOut("slow");
                        $('tr[id="'+record_id+'"]').remove();
                    }else{
                        alert("Rest Error for "+record_id+": "+data.error);
                    }
                });
                
            }
        });
    });
    $('button#renewslices').click(function() {
        var now = new Date();
        /* In Javascript getMonth() gives month[0] = january, month[1] = february, and so on...  */
        var month = now.getMonth()+2;
        var one_month_later = now.getFullYear()+"-"+month+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        console.log(one_month_later);
        $('input:checkbox.slice').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $.post("/update/slice/",{'filters':{'slice_hrn':this.id},'params':{'expires':one_month_later}}, function(data) {
                    if(data.success){
                        // TODO: highlight row after success
                        //$('tr[id="'+record_id+'"]').highlight();
                    }else{
                        alert("Rest Error for "+record_id+": "+data.error);
                    }
                });
                
            }
        });
        // TODO: refresh table
        //window.location="/portal/institution#slices";
    });

    $('button#createslice').click(function() {
        window.location="/portal/slice_request/";
    });
    $('button#slicerequestbtn').click(function() {
        /*
        window.location="/portal/slice_request/";
        */
    });
});

/*function loadUsers() {
	$('div#users table').load('/table/user/',
		{
			'fields'  : [ 'user_hrn', 'user_first_name', 'user_last_name', 'user_email', 'user_phone' ],
			'filters' : { 'parent_authority' : $('div#users').data('authority') },
			'options' : [ 'checkbox' ]
		}
	);
}*/
