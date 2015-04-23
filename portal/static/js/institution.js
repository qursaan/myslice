function unspin_all(){
    $('input:checkbox').each(function (index) {
        if(this.checked){
            this.nextElementSibling.style.display = "none";
        }
    });
}
function spin_all(){
    $('input:checkbox').each(function (index) {
        if(this.checked){
            this.nextElementSibling.style.display = "inline";
        }
    });
}
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

    $('button#deleteusers').click(function() {
        spin_all();
        $('input:checkbox.user').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                var user_email = this.dataset.email; 
                console.log(this);
                // Delete in SFA Registry
                $.post("/delete/user/",{'filters':{'user_hrn':record_id}}, function(data) {
                    if(data.success){
                        $.post("/local_user/delete/",{'email':user_email}, function(data) {
                            console.log(data);
                            if (data == true){
                                mysliceAlert('Success: user deleted','success', true);
                            }else{
                                mysliceAlert('Local DB Error for: '+record_id,'warning', true);
                            }
                            $('tr[id="'+record_id+'"]').fadeOut("slow");
                            $('tr[id="'+record_id+'"]').remove();
                        });
                        //$.post("/delete/local:user/",{'filters':{'user_hrn':this.id}}, function(data) {
                    }else{
                        mysliceAlert('Rest Error for: '+data.error,'warning', true);
                        //alert("Rest Error for "+record_id+": "+data.error);
                    }   
                    unspin_all();
                });
            } 
        });
    });

    /* TODO: factorize into functions */
    $('button#deleteslices').click(function() {
        spin_all();
        var flag = false;
        $('input:checkbox.slice').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $('#'+record_id+'-loading').spin();
                $.post("/delete/slice/",{'filters':{'slice_hrn':this.id}}, function(data) {
                    if(data.success){
                        localStorage.clear();
                        $('tr[id="'+record_id+'"]').fadeOut("slow");
                        $('tr[id="'+record_id+'"]').remove();
                        mysliceAlert('Success: slice deleted','success', true);
                    }else{
                        mysliceAlert('Rest Error for: '+data.error,'warning', true);
                        //alert("Rest Error for "+record_id+": "+data.error);
                    }
                    unspin_all();
                });
            }
        });
    });
    $('button#renewslices').click(function() {
        spin_all();
        var now = new Date();
        /* In Javascript getMonth() gives month[0] = january, month[1] = february, and so on...  */
        var month = now.getMonth()+2;
        var one_month_later = now.getFullYear()+"-"+month+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        $('input:checkbox.slice').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $('#'+record_id+'-loading').spin();
                $.post("/update/slice/",{'filters':{'slice_hrn':this.id},'params':{'expires':one_month_later}}, function(data) {
                    if(data.success){
                        // TODO: highlight row after success
                        //$('tr[id="'+record_id+'"]').highlight();
                        mysliceAlert('Success: slice renewed','success', true);
                    }else{
                        mysliceAlert('Rest Error for: '+data.error,'warning', true);
                        //alert("Rest Error for "+record_id+": "+data.error);
                    }
                    unspin_all();
                });
                
            }
        });
        // TODO: refresh table
        //window.location="/portal/institution#slices";
    });
    $('button#deleteprojects').click(function() {
        spin_all();
        var flag = false;
        $('input:checkbox.project').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $('#'+record_id+'-loading').spin();
                console.log(record_id);
                $.post("/delete/myslice:authority/",{'filters':{'authority_hrn':this.id}}, function(data) {
                    if(data.success){
                        localStorage.clear();
                        $('tr[id="'+record_id+'"]').fadeOut("slow");
                        $('tr[id="'+record_id+'"]').remove();
                        mysliceAlert('Success: project deleted','success', true);
                    }else{
                        mysliceAlert('Rest Error for: '+data.error,'warning', true);
                        //alert("Rest Error for "+record_id+": "+data.error);
                    }
                    unspin_all();
                });
            }
        });
    });

    $('button#createslice').click(function() {
        window.location="/portal/slice_request/";
    });

    $('button#createproject').click(function() {
        window.location="/portal/project_request/";
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
