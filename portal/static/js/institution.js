$(document).ready(function() {
	$('li#nav-institution').addClass("active");

    $('a.home-tab').click(function() {
        $('ul.nav-tabs li').removeClass('active');
        $(this).parent().addClass('active');
        $('div.home-panel').hide();
        $('div#'+$(this).data('panel')).show();
    });
    var url = window.location;
    if(url.hash) {
        // Fragment exists 
        tab = url.href.split("#")[1];
        tab_exists = $('div#'+tab).length;
        if (tab_exists) {
           $('ul.nav-tabs li').removeClass('active');
           $('li#'+tab+'-tab').addClass('active');
           $('div.home-panel').hide();            
           $('div#'+tab).show();
        }
    }

    /* TODO: factorize into functions */
    $('button#deleteusers').click(function() {
        $('input:checkbox.user').each(function (index) {
            if(this.checked){
                var record_id = this.id;
                $.post("/delete/user/",{'filters':{'user_hrn':this.id}}, function(data) {
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
