/**
 * MyPlugin:    demonstration plugin
 * Version:     0.1
 * Description: Template for writing new plugins and illustrating the different
 *              possibilities of the plugin API.
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Jordan Augé <jordan.auge@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

var AsapDateSelected = new Date();

(function($){

    var AsapPlugin = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) {
	    // for debugging tools
	    this.classname="myplugin";
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Member variables */

            /* Plugin events */

            /* Setup query and record handlers */

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient
            this.listen_query(options.query_uuid, 'resources');
            this.listen_query(options.query_lease_uuid, 'leases');

            /* GUI setup and event binding */
            // call function
            this._initUI();
        },

        /* PLUGIN EVENTS */
        // on_show like in querytable

        remove: function(id) {
            return (elem=document.getElementById(id)).parentNode.removeChild(elem);
        },
        /* GUI EVENTS */
        /**
         * Initialize the date picker, the table, the slider and the buttons. Once done, display scheduler.
         */
        _initUI: function() 
        {
            var self = this;

            /*
            dateToday = new Date();

            $("#DateAsap").datepicker({
            	//dateFormat: "D, d M yy",
                minDate: dateToday,
                defaultDate: dateToday,
            }).on('changeDate', function(ev) {
                if(ev.date < dateToday){
                    $("#asap_msg").show();
                    $("#asap_msg").css("color","red");
                    $("#asap_msg").html("Please select an end date today or later");
                    $("#asap_msg").fadeOut(4000);
                    $("#DateAsap").datepicker( "setDate", dateToday );
                }else{
                    AsapDateSelected = ev.date;
                }
            }).datepicker('setValue', AsapDateSelected);
            */
            $("#asap_schedule").click(function() {
                r = document.getElementById("resources");
                if(r.childNodes.length == 0){
                    $("#asap_msg").show();
                    $("#asap_msg").css("color","orange");
                    $("#asap_msg").html("Please select at least one IoTLab resource");
                    $("#asap_msg").fadeOut(4000);
                }else{
                    start_time = 0;
                    duration = $("#duration").val();
                    if(!parseInt(duration)){
                        $("#asap_msg").show();
                        $("#asap_msg").css("color","red");
                        $("#asap_msg").html("Please set the duration with a number");
                        $("#asap_msg").fadeOut(4000);
                    }else{
                        elements = r.childNodes;
                        // length of elements changes during loop as we remove elements one by one
                        var size = elements.length;
                        for (i = 0; i < size; i++) { 
                            // lets take the first element
                            el = elements[0];
                            t_id = el.id.split("_");
                            self.send_lease(t_id[1], String(start_time), duration);
                        }
                    }
                }
            });
        },

        // a function to bind events here: click change
        // how to raise manifold events
        send_lease: function(resource_urn, start_time, duration)
        {
            var lease_key, new_lease, data;

            lease_key = manifold.metadata.get_key('lease');

            new_lease = {
                resource:   resource_urn,
                start_time: start_time,
                duration: duration,
                //end_time:   end_time.getTime()/1000,
            };

            // This is needed to create a hashable object
            new_lease.hashCode = manifold.record_hashcode(lease_key.sort());
            new_lease.equals   = manifold.record_equals(lease_key);

            data = {
                state: STATE_SET,
                key  : null,
                op   : STATE_SET_ADD,
                value: new_lease
            }
            prev_state = manifold.query_store.get_record_state(this.options.query_uuid, resource_urn, STATE_SET);
            manifold.raise_event(this.options.query_lease_uuid, FIELD_STATE_CHANGED, data);


        },

        /* GUI MANIPULATION */

        // We advise you to write function to change behaviour of the GUI
        // Will use naming helpers to access content _inside_ the plugin
        // always refer to these functions in the remaining of the code

        show_hide_button: function() 
        {
            // this.id, this.el, this.cl, this.elts
            // same output as a jquery selector with some guarantees
        },

        /* TEMPLATES */

        // see in the html template
        // How to load a template, use of mustache

        /* QUERY HANDLERS */

        // How to make sure the plugin is not desynchronized
        // He should manifest its interest in filters, fields or records
        // functions triggered only if the proper listen is done

        // no prefix

        on_filter_added: function(filter)
        {

        },

        // ... be sure to list all events here
        
        on_resources_field_state_changed: function(record)
        {
            if(record["op"] != null){
                resource = manifold.query_store.get_record(this.options.query_uuid,record['value']);
                console.log(resource);
                // TODO: Define which facilities support ASAP
                if(resource["authority_id"]=="iotlab"){
                    // TODO: use filters Pending or Unconfigured
                    if(record['op']==2){
                        var elm = document.createElement('div');
                        elm.innerHTML = record['value'];
                        elm.id = "asap_"+record['value'];
                        r = document.getElementById("resources");
                        r.appendChild(elm);
                    }else if(record['op']==1){
                        this.remove("asap_"+record['value']);
                    }
                }
            }
        },
        on_leases_field_state_changed: function(record)
        {
            resource = manifold.query_store.get_record(this.options.query_uuid,record['value']['resource']);
            console.log(resource);
            // TODO: Define which facilities support ASAP
            if(resource["authority_id"]=="iotlab"){
                // TODO: use filters Pending or Unconfigured
                if(record['op']==2){
                    this.remove("asap_"+record['value']['resource']);
                }else if(record['op']==1){
                    var elm = document.createElement('div');
                    elm.innerHTML = record['value']['resource'];
                    elm.id = "asap_"+record['value']['resource'];
                    r = document.getElementById("resources");
                    r.appendChild(elm);
                }
            }
        },

        /* RECORD HANDLERS */
        on_all_new_record: function(record)
        {
            console.log("on_all_new_record ---- ");
            console.log(record);
        },

        /* INTERNAL FUNCTIONS */
        _dummy: function() {
            // only convention, not strictly enforced at the moment
        },

    });

    /* Plugin registration */
    $.plugin('AsapPlugin', AsapPlugin);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
