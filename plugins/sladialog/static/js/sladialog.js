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

(function($){

    var SlaDialog = Plugin.extend({

        accepted_slas: {},

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) {
	    // for debugging tools
	    this.classname="SlaDialog";
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Member variables */

            /* Plugin events */

            /* Setup query and record handlers */

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient
            this.listen_query(options.query_uuid);
            
            /* GUI setup and event binding */
            // call function
            this.button_binding();

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

        check_template_status: function() {
            for (var testbed in this.accepted_slas) {
                if (!this.accepted_slas[testbed]) { return false; }
            }

            return true;
        },

        /* PLUGIN EVENTS */
        // on_show like in querytable


        /* GUI EVENTS */

        button_binding: function() {
            var self = this;
            $(".sla-accept-button").click(function() {
                // set SLA as accepted and remove warnings
                var id = $(this).closest(".row").attr("id");
                self.accepted_slas[id] = true;
                var is_ok = self.check_template_status();

                if (is_ok) {
                    // remove warnings
                    // var warnings = manifold.query_store.get_record_state(resource_query.query_uuid, resource_key, STATE_WARNINGS);
                }
            });
        },

        create_sla: function(record) {
            var self = this;

            var urns = [];

            if (record.resource.length != 0 && typeof record.resource[0] === "object") {

                record.resource.forEach(function(r) {
                    if ($.inArray(r.component_id, record.resource) == -1) { // if not already selected
                        urns.push(r.component_id);
                    }
                });

                var data = {
                    "SLIVER_INFO_AGGREGATE_URN": record.resource[0].component_manager_id,
                    "SLIVER_INFO_EXPIRATION": record.lease[0].end_time,     // FIXME: only working with leases
                    "SLIVER_INFO_SLICE_URN": record.slice_urn,
                    "SLIVER_INFO_CREATOR_URN": record.users[0],
                    "SLIVER_INFO_URN": urns,
                    "SLIVER_INFO_SLA_ID": self._getUUID()
                };

                console.log(data);

                $.post("/sla/agreements/create/", data)
                    .done(function (response) {
                        console.log("SLA created");
                    });
            }
        },

        uncheck: function(urn)
        {
//            $('#slamodal').on('hidden.bs.modal', function(e){
//                $('#' + (urn).replace(/"/g,'')).click();
//                console.log('#' + (data.value).replace(/"/g,''));
//            });
        },

        // a function to bind events here: click change
        // how to raise manifold events
        set_state: function(data, username)
        {
            
        },

        post_agreement: function()
        {
            console.log(this.options.user);
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

        on_field_state_changed: function(data)
        {
            var self = this;
            // this.set_state(result, this.options.username);

             switch(data.state) {
                case STATE_SET:
                    switch(data.op) {
                        case STATE_SET_IN_PENDING:
                            if (typeof(data.value) == 'string') {
                                // data.value = urn
                                this._supports_sla(data.value)
                                    .done( function(testbeds) {
                                        var urn_regexp = /\+(.*?)\+/;
                                        var urn = urn_regexp.exec(data.value)[1];
                                        var pos = $.inArray(urn, testbeds);
                                        if ( pos != -1) {
                                            var id_ref = testbeds[pos].replace(/\.|:/g, "-");
                                            $("#" + id_ref).data("urns").push(data.value);
                                            $("#" + id_ref).show();
                                            self.accepted_slas[id_ref] = false;
                                            //$( "#sla_offers_list" ).append(
                                            //    $("<li>").text("Testbed " + testbeds[pos] + " offers SLA for its resources")
                                            //);
                                        }
                                    });
                            }
                            break;
                        case STATE_SET_OUT:
                            // data.value = urn
                            if (typeof(data.value) == 'string') {
                                // data.value = urn
                                this._supports_sla(data.value)
                                    .done( function(testbeds) {
                                        var urn_regexp = /\+(.*?)\+/;
                                        var urn = urn_regexp.exec(data.value)[1];
                                        var pos = $.inArray(urn, testbeds);
                                        if ( pos != -1) {
                                            var id_ref = testbeds[pos].replace(/\.|:/g, "-");
                                            var array = $("#" + id_ref).data("urns");
                                            array.splice(array.indexOf(data.value), 1);

                                            if ($("#" + id_ref).data("urns").length == 0) {
                                                $("#" + id_ref).hide();
                                                delete self.accepted_slas[id_ref];
                                            }
                                            //$( "#sla_offers_list" ).append(
                                            //    $("<li>").text("Testbed " + testbeds[pos] + " offers SLA for its resources")
                                            //);
                                        }
                                    });
                            }
                            break;
                    }
                    break;

                case STATE_WARNINGS:
                    // Add resource to SLA
                    // data.key = urn
                    // data.value = {1: "SLA acceptance required..."}
                    // this.change_status(data.key, data.value);
                    break;
             }
        }, 

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_all_new_record: function(record)
        {
            //
        },

        on_new_record: function(record)
        {
            this.create_sla(record);
        },

        /* INTERNAL FUNCTIONS */
        _dummy: function() {
            // only convention, not strictly enforced at the moment
        },

        _supports_sla: function(resource_urn) {
            return $.ajax("/sla/testbeds/");
        },



        _getUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

    });

    /* Plugin registration */
    $.plugin('SlaDialog', SlaDialog);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
