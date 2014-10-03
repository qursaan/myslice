/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */ 

(function($){

    vt_servers_list=[];
    testbeds_list=[];

    var UnivbrisVtamForm = Plugin.extend({

        init: function(options, element) {
	    //console.log("hello....................");
            this._super(options, element);
            this.filters = Array(); 

            // an internal buffer for records that are 'in' and thus need to be checked 
            this.buffered_records_to_check = [];
	    // an internal buffer for keeping lines and display them in one call to fnAddData
	    this.buffered_lines = [];

	    

            
	    //var keys = manifold.metadata.get_key(this.object);
	    //this.canonical_key = (keys && keys.length == 1) ? keys[0] : undefined;
	    // 
	    //this.init_key = this.options.init_key;
	    // have init_key default to canonical_key
	    //this.init_key = this.init_key || this.canonical_key;
	    // sanity check
	    //if ( ! this.init_key ) messages.warning ("UnivbrisVtamForm : cannot find init_key");
	    //if ( ! this.canonical_key ) messages.warning ("UnivbrisVtamForm : cannot find canonical_key");
	    //if (debug) messages.debug("UnivbrisVtamForm: canonical_key="+this.canonical_key+" init_key="+this.init_key);

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
           // this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */


	    $('<button id="cancelvtamform" type="button" style="height: 25px; width: 200px" onclick="fnCancelVtamForm()">Cancel</button>').appendTo('#vtam_form_buttons');
	    $("#cancelvtamform").unbind('click').click(this, this.fnCancelVtamForm);

	    $('<button id="addvtamform" type="button" style="height: 25px; width: 200px" onclick="fnAddVtamForm()">Add VM</button>').appendTo('#vtam_form_buttons');
	    $("#addvtamform").unbind('click').click(this, this.fnAddVtamForm);

	   jQuery("#univbris_vtam_form").hide();

	   $('#uob_testbed_name').on("change", this.testbedChanged);

	   //this.on_new_record("urn:publicid:IDN+i2cat:vtam+node+Rodoreda");
	   //this.on_new_record("urn:publicid:IDN+bristol:vtam+node+March");
	   //this.on_new_record("urn:publicid:IDN+brazil:vtam+node+Verdaguer");
	   //this.on_query_done();
	   
	   // console.log("after");
        },

	testbedChanged: function(e){
		console.log($('#uob_testbed_name option:selected').text());

		$('#uob_virtualization_server')
    			.find('option')
    			.remove()
    			.end();

		for(var i=0;i<vt_servers_list.length;i++){
		    if(vt_servers_list[i].testbed==$('#uob_testbed_name option:selected').text()){
	     			$('#uob_virtualization_server')
		 			.append($("<option></option>")
		 			.attr("value",vt_servers_list[i].name)
		 			.text(vt_servers_list[i].name)); 
		    }
		}
	},


	fnCancelVtamForm:function(e){
		jQuery("#univbris_vtam_form").hide();
		jQuery("#univbris_vtam").show();
		console.log("cancel vtam form");
	},

	fnAddVtamForm:function(e){
		console.log("add vtam form");
		var vmNameVal = /^[a-zA-Z0-9]+$/;
		//console.log($("#uob_vm_name").val());
		if (vmNameVal.test($("#uob_vm_name").val())){
			//build form string
			var vtam="testbed:"+$('#uob_testbed_name option:selected').text();
			vtam +=",vt_server:"+$('#uob_virtualization_server option:selected').text();
			vtam +=",vm_name:"+$("#uob_vm_name").val();
			var vm_name="<p id='"+vtam+"'>"+$("#uob_vm_name").val()+"</p>";
			var vtamtable = $("#univbris_vtam__table").dataTable();
			vtamtable.fnAddData([$('#uob_testbed_name option:selected').text(),$('#uob_virtualization_server option:selected').text(), vm_name,'<a class="delete" href="">Delete</a>']);
			jQuery("#univbris_vtam_form").hide();
			jQuery("#univbris_vtam").show();
		}
		else{
			$('#uob_vm_name').addClass('error');
			jQuery('#uob_vm_name_error').show();
		}
	},

        /* PLUGIN EVENTS */

        on_show: function(e) {
	},        

        on_resize: function(e) {
	},        

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        new_record: function(record)
        {
            var urn = record['urn'];
            var pos = urn.search('vtam');
            if (pos!=-1){
                ///line =new Array();
                var vt_server={};
                var com_ay=urn.split("+");
                vt_server['name']=com_ay[com_ay.length-1];
                var testbed_ay=com_ay[1].split(":");
                vt_server['testbed']=testbed_ay[0];
                this.add_new_vt_server(vt_server);
                this.add_new_testbed(testbed_ay[0]);
                //this.vt_servers_list.push(vt_server);
            }
        },

        clear_table: function()
        {
        },

        redraw_table: function()
        {
        },


	add_new_vt_server:function(vt_server){
		var found=false;
		for(var i=0;i<vt_servers_list.length;i++){
			if(vt_servers_list[i].name==vt_server.name && vt_servers_list[i].testbed==vt_server.testbed){
				found=true;
				break;
			}
		}

		//console.log(found);

		if (found==false){
			 vt_servers_list.push(vt_server);
		}
	},

	add_new_testbed:function(testbed){
		var found=false;
		for(var i=0;i<testbeds_list.length;i++){
			if(testbeds_list[i]==testbed){
				found=true;
				break;
			}
		}

		//console.log(found);

		if (found==false){
			 testbeds_list.push(testbed);
		}
	},



	

        /*************************** QUERY HANDLER ****************************/

        on_filter_added: function(filter)
        {
        },

        on_filter_removed: function(filter)
        {
        },
        
        on_filter_clear: function()
        {
            this.redraw_table();
        },

        on_field_added: function(field)
        {
            this.show_column(field);
        },

        on_field_removed: function(field)
        {
            this.hide_column(field);
        },

        on_field_clear: function()
        {
        },


        /*************************** ALL QUERY HANDLER ****************************/

        on_all_filter_added: function(filter)
        {
        },

        on_all_filter_removed: function(filter)
        {

        },
        
        on_all_filter_clear: function()
        {
        },

        on_all_field_added: function(field)
        {
        },

        on_all_field_removed: function(field)
        {
        },

        on_all_field_clear: function()
        {
        },


        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record)
        {
	    //alert("record:")
	    console.log(record.hostname);
            if (this.received_all_query) {
                
            } else {
                this.buffered_records_to_check.push(record);
            }
        },

        on_clear_records: function()
        {
        },

        // Could be the default in parent
        on_query_in_progress: function()
        {
            this.spin();
        },

        on_query_done: function()
        {
            this.received_query = true;
	    for(var i=0;i<this.buffered_records_to_check.length;i++){
		this.new_record(this.buffered_records_to_check[i]);
	    }

	
	    /*$.each(vt_servers_list, function(key, value) {   
     			$('#uob_testbed_name')
         			.append($("<option></option>")
         			.attr("value",key)
         			.text(value.testbed)); 
	    });*/

	     $('#uob_testbed_name')
    			.find('option')
    			.remove()
    			.end()

	    for(var t=0;t<testbeds_list.length;t++){
		$('#uob_testbed_name')
         			.append($("<option></option>")
         			.attr("value",testbeds_list[t])
         			.text(testbeds_list[t])); 
	    }

	    $('#uob_virtualization_server')
    			.find('option')
    			.remove()
    			.end()

	    for(var i=0;i<vt_servers_list.length;i++){
		    if(vt_servers_list[i].testbed==$('#uob_testbed_name option:selected').text()){
	     			$('#uob_virtualization_server')
		 			.append($("<option></option>")
		 			.attr("value",vt_servers_list[i].name)
		 			.text(vt_servers_list[i].name)); 
		    }
	    }
	 
            this.unspin();
        },
        
        on_field_state_changed: function(data)
        {

        },

    }); //close plugin extend

    $.plugin('UnivbrisVtamForm', UnivbrisVtamForm);

})(jQuery);




