/**
 * MySlice Apply plugin
 * Version: 0.1.0
 * URL: http://www.myslice.info
 * Description: display of selected resources
 * Requires: 
 * Author: The MySlice Team
 * Copyright: Copyright 2012 UPMC Sorbonne Universités
 * License: GPLv3
 */

(function( $ ){

    var debug=false;
    debug=true;

    // XXX record selected (multiple selection ?)
    // XXX record disabled ?
    // XXX out of sync plugin ?
    // XXX out of date record ?
    // record tags ???
    //
    // criticality of the absence of a handler in a plugin
    // non-critical only can have switch case
    // 
    // Record state through the query cycle


    var ApplyPlugin = Plugin.extend({

        /**************************************************************************
         *                          CONSTRUCTOR
         **************************************************************************/

        init: function(options, element) {
	        this.classname="queryupdater";
            this._super(options, element);

            var self = this;

            this.initial = Array();
            this.selected_resources = Array();

            this.table = this.elmt('table').dataTable({
                sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t>",
		        bAutoWidth: true,
            });
            
            //this.elmt('update').click(this, this.do_ok);
            //this.elmt('refresh').click(this, this.do_cancel);

            this.elmt('apply').on('shown.bs.modal', function() {
                self.do_update();
            })

            this.listen_query(options.query_uuid);
        },

        /*************************** PLUGIN EVENTS ****************************/

        /***************************** GUI EVENTS *****************************/

        /************************** GUI MANIPULATION **************************/

        populate_table: function()
        {
            var state;

            // Loop over records and display pending ones
            manifold.query_store.iter_records(this.options.query_uuid, function (record_key, record) {
                state = manifold.query_store.get_record_state(this.options.query_uuid, null, STATE_SET);
            
            });
        },
        
        set_button_state: function(name, state)
        {
            this.elmt(name).attr('disabled', state ? false : 'disabled');
        },

        clear: function()
        {

        },

        find_row: function(key)
        {
            // key in third position, column id = 2
            var KEY_POS = 2;

            var cols = $.grep(this.table.fnSettings().aoData, function(col) {
                return (col._aData[KEY_POS] == key);
            } );

            if (cols.length == 0)
                return null;
            if (cols.length > 1)
                throw "Too many same-key rows in ResourceSelected plugin";

            return cols[0];
        },

        _do_update: function(e) {
            var self = e.data;
            self.do_update;
        },

        do_update: function() {

            var username = this.options.username;

            this.spin();
            console.log("do_update in progress");

            manifold.raise_event(this.options.query_uuid, RUN_UPDATE);

            // how to stop the spinning after the event? 
            // this should be triggered by some on_updatequery_done ?

        },

        do_ok: function(e)
        {
            throw 'queryupdater.do_reset Not implemented';
        },

        do_cancel: function(e)
        {
            throw 'queryupdater.do_clear_annotations Not implemented';
        },
        
       /**************************************************************************
        *                           QUERY HANDLERS
        **************************************************************************/ 

        on_new_record: function(record)
        {

            // if (not and update) {

                // initial['resource'], initial['lease'] ?
                this.initial.push(record);

            //this.set_record_state(record, RECORD_STATE_ATTACHED);
                // We simply add to the table
            // } else {
                //                 \ this.initial_resources
                //                  \
                // this.             \
                // current_resources  \    YES    |   NO
                // --------------------+----------+---------
                //       YES           | attached | added
                //       NO            | removed  |   /
                // 

            // }
        },

        // QUERY STATUS
        //                                      +-----------------+--------------+
        //                                      v        R        |              |
        // +-------+  ?G    +-------+        +-------+        +---+---+          |
        // |       | -----> |       |  !G    |       |        |       |    DA    |
        // |  ND   |        |  PG   | -----> |   D   | -----> |  PC   | <------+ |
        // |       | <----- |       |  ~G    |       |   C    |       |        | | 
        // +-------+   GE   +-------+        +-------+        +-------+      +------+
        //                                       ^              ^  |         |      |
        //                                       | DA        UE |  | ?U      | PCA  |
        //                                       |              |  v         |      |
        //                                   +-------+        +-------+      +------+
        //                                   |       |   !U   |       |         ^
        //                                   |  AD   | <----- |  PU   | --------+
        //                                   |       |        |       |   ~U     
        //                                   +-------+        +-------+          
        //                                                                       
        //
        // LEGEND:
        // 
        // Plugins (i) receive state information, (ii) perform actions
        //
        // States:                                  Actions:
        // ND : No data                             ?G : Get query
        // PG : Pending Get                         !G : Get reply  
        //  D : Data present                        ~G : Get partial reply
        // PC : Pending changes                     GE : Get error                            
        // PU : Pending update                       C : Change request
        // PCA: Pending change with annotation       R : Reset request
        // AD : Annotated data                      ?U : Update query
        //                                          !U : Update reply
        //                                          ~U : Update partial reply
        //                                          UE : Update error            
        //                                          DA : Delete annotation request
        // NOTE:
        // - D -> PU directly if the user chooses 'dynamic update'
        // - Be careful for updates if partial Get success

        // ND: No data == initialization state
        
        // PG : Pending get
        // - on_query_in_progress
        // NOTE: cannot distinguish get and update here. Is it important ?

        on_query_in_progress: function()
        {
            this.spin();
        },

        on_query_done: function()
        {
            this.populate_table();
            this.unspin();
        },

        // D : Data present
        // - on_clear_records (Get)
        // - on_new_record (shared with AD) XXX
        // - on_query_done
        // NOTE: cannot distinguish get and update here. Is it important ?
        // NOTE: Would record key be sufficient for update ?

        on_clear_records: function()
        {
            this.clear();
        },

        on_query_done: function()
        {
            this.unspin();
        },

        // PC : Pending changes
        // NOTE: record_key could be sufficient 
        on_added_record: function(record)
        {
            this.set_record_state(record, RECORD_STATE_ADDED);
            // update pending number
        },

        on_removed_record: function(record_key)
        {
            this.set_record_state(RECORD_STATE_REMOVED);
        },

        // PU : Pending update
        // - on_query_in_progress (already done)
        
        // PCA : Pending change with annotation
        // NOTE: Manifold will inform the plugin about updates, and thus won't
        // call new record, even if the same channel UUID is used...
        // - TODO on_updated_record
        // - Key and confirmation could be sufficient, or key and record state
        // XXX move record state to the manifold plugin API

        on_field_state_changed: function(data)
        {
            /*
            if(result.request == FIELD_REQUEST_ADD){
                this.selected_resources.push(result.value);
            } else if(result.request == FIELD_REQUEST_REMOVE_RESET){
                var i = this.selected_resources.indexOf(result.value);
                if(i != -1){
                    this.selected_resources.splice(i,1);
                }
            }
            this.set_state(result);
            */

            var action, msg, row, status, button = '';

            switch(data.state) {
                case STATE_VALUE:
                    switch(data.op) {
                        // XXX other events missing !!
                        case STATE_VALUE_CHANGE_PENDING:
                            action = 'UPDATE';
                            break;
                    }
                    break;

                case STATE_SET:
                    switch(data.op) {
                        case STATE_SET_IN_PENDING:
                            action = 'ADD';
                            msg   = 'PENDING';
                            button = "<span class='glyphicon glyphicon-remove ResourceSelectedClose' id='" + data.key + "'/>";
                            break;  

                        case STATE_SET_OUT_PENDING:
                            action = 'REMOVE';
                            msg   = 'PENDING';
                            button = "<span class='glyphicon glyphicon-remove ResourceSelectedClose' id='" + data.key + "'/>";
                            break;

                        case STATE_SET_IN:
                        case STATE_SET_OUT:
                            // find line and delete it
                            row = this.find_row(data.value);
                            if (row)
                                this.table.fnDeleteRow(row.nTr);
                            return;

                        case STATE_SET_IN_SUCCESS:
                            action = 'ADD';
                            msg   = 'SUCCESS';
                            break;
                        case STATE_SET_IN_FAILURE:
                            action = 'ADD';
                            msg   = 'FAILURE';
                            break;

                        case STATE_SET_OUT_SUCCESS:
                            action = 'REMOVE';
                            msg   = 'FAILURE';
                            break;
                        case STATE_SET_OUT_FAILURE:
                            action = 'REMOVE';
                            msg   = 'FAILURE';
                            break;

                    }
                    break;

                default:
                    return;
            }

            status = msg + status;

            // find line
            // if no, create it, else replace it
            // XXX it's not just about adding lines, but sometimes removing some
            // XXX how do we handle status reset ?

            // Jordan : I don't understand this. I added this test otherwise we have string = ""..."" double quoted twice.
            if (typeof(data.value) !== "string")
                data.value = JSON.stringify(data.value);
            data.selected_resources = this.selected_resources;
            row = this.find_row(data.value);
            newline = [action, data.key, data.value, msg, button];
            if (!row) {
                // XXX second parameter refresh = false can improve performance. todo in querytable also
                this.table.fnAddData(newline);
                row = this.find_row(data.value);
            } else {
                // Update row text...
                this.table.fnUpdate(newline, row.nTr);
            }

            // Change cell color according to status
            if (row) {
                $(row.nTr).removeClass('add remove')
                var cls = action.toLowerCase();
                if (cls)
                    $(row.nTr).addClass(cls);
            }
        },

        // XXX we will have the requests for change
        // XXX + the requests to move into the query cycle = the buttons aforementioned

        // XXX what happens in case of updates ? not implemented yet
        // XXX we want resources and leases
        // listen for SET_ADD and SET_REMOVE for slice query

        /************************** PRIVATE METHODS ***************************/

        _close_click: function(e)
        {
            var self = e.data;

            //jQuery.publish('selected', 'add/'+key_value);
            // this.parentNode is <td> this.parentNode.parentNode is <tr> 
            // this.parentNode.parentNode.firstChild is the first cell <td> of this line <tr>
            // this.parentNode.parentNode.firstChild.firstChild is the text in that cell
            //var firstCellVal=this.parentNode.parentNode.firstChild.firstChild.data;
            var remove_urn = this.id; 
            var current_resources = event.data.instance.current_resources;
            var list_resources = $.grep(current_resources, function(x) {return x.urn != remove_urn});
            //jQuery.publish('selected', 'cancel/'+this.id+'/'+unfold.get_value(firstCellVal));
            $.publish('/update-set/' + event.data.instance.options.resource_query_uuid, [list_resources, true]);
        },

        /******************************** TODO ********************************/

        update_resources: function(resources, change)
        {
            messages.debug("update_resources");
            var my_oTable = this.table.dataTable();
            var prev_resources = this.current_resources; 

            /*
             * The first time the query is advertised, don't do anything.  The
             * component will learn nodes in the slice through the manifest
             * received through the other subscription 
             */
             if (!change)
                return;
             // ioi: Refubrished
             var initial = this.initial;
             //var r_removed  = []; //
             /*-----------------------------------------------------------------------
                TODO: remove this dirty hack !!!
             */
             resources = jQuery.map(resources, function(x){
                if(!('timeslot' in x)){x.timeslot=0;}
                return x;
             });
             /*
                TODO: handle generic keys instead of specific stuff
                      ex: urn
                          urn-lease
             */
             var initial_urn = $.map(initial, function(x){return x.urn;});
             var resources_urn = $.map(resources, function(x){return x.urn;});
             var r_removed = $.grep(initial, function (x) { return $.inArray(x.urn, resources_urn) == -1 });
             var r_attached = $.grep(initial, function (x) { return $.inArray(x.urn, resources_urn) > -1 });
             var r_added = $.grep(resources, function (x) { return $.inArray(x.urn, initial_urn) == -1 });
             exists = false; // ioi
             /*-----------------------------------------------------------------------*/

             my_oTable.fnClearTable();
             /*
                TODO: factorization of this code !!!
             */
             $.each(r_added, function(i, r) { 
                //var type = (typeof initial == 'undefined' || r.node != initial.node) ? 'add' : 'attached';
                var type = 'add';  
                // Create the resource objects
                // ioi: refubrished
                var urn = r.urn;
                time = r.timeslot;
                              
                var SPAN = "<span class='glyphicon glyphicon-remove ResourceSelectedClose' id='"+urn+"'/>";
                var slot = "<span id='resource_"+urn+"'>" + time + "</span>"; //ioi
                // ioi
                var newline=Array();
                newline.push(type, urn, slot, SPAN); // ioi
                var line = my_oTable.fnAddData(newline);
                var nTr = my_oTable.fnSettings().aoData[ line[0] ].nTr;
                nTr.className = type;
             });
             $.each(r_attached, function(i, r) {  
                //var type = (typeof initial == 'undefined' || r.node != initial.node) ? 'add' : 'attached';
                var type = 'attached';
                // Create the resource objects
                // ioi: refubrished
                var node = r.urn;
                time = r.timeslot;

                var SPAN = "<span class='glyphicon glyphicon-renomve ResourceSelectedClose' id='"+node+"'/>";
                var slot = "<span id='resource_"+node+"'>" + time + "</span>"; //ioi
                // ioi
                var newline=Array();
                newline.push(type, node, slot, SPAN); // ioi
                var line = my_oTable.fnAddData(newline);
                var nTr = my_oTable.fnSettings().aoData[ line[0] ].nTr;
                nTr.className = type;
             });
             $.each(r_removed, function(i, r) { 
                // The list contains objects
                // ioi: refubrished
                var node = r.urn;
                var time = r.timeslot;
                    
                var SPAN = "<span class='glyphicon glyphicon-remove ResourceSelectedClose' id='"+node+"'/>";
                var slot = "<span id='resource_"+node+"'>" + time + "</span>";
                // ioi
                var newline=Array();
                newline.push('remove', node, slot, SPAN); // ioi
                var line = my_oTable.fnAddData(newline);
                var nTr = my_oTable.fnSettings().aoData[ line[0] ].nTr;
                nTr.className = 'remove';
             });

             this.current_resources = $.merge(r_attached,r_added);

             /* Allow the user to update the slice */
             //jQuery('#updateslice-' + data.ResourceSelected.plugin_uuid).prop('disabled', false);

        }, // update_resources

    });

    $.plugin('ApplyPlugin', ApplyPlugin);

})(jQuery);
