/**
 * SlaDialog
 * Description: Plugin to allow SLA acceptance and creation to MySlice portal
 *              in Fed4FIRE
 * Requires:    js/plugin.js
 * Author:      Javier García Lloreda <javier.garcial.external@atos.net>
 * Copyright:   Copyright Atos Spain S.A.
 * License:     GPLv3
 */

(function($){

    var SlaDialog = Plugin.extend({

        accepted_slas: {},
        queries: [],

        init: function(options, element) {
	        this.classname = "SlaDialog";
            this._super(options, element);

            /* Member variables */

            /* Plugin events */

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            
            /* GUI setup and event binding */

            // call function
            this.button_binding();

            // Get testbeds with sla and store them in localStorage
            this.get_testbeds_with_sla();
        },

        get_testbeds_with_sla: function () {
            var self = this;
            return $.get('/sla/testbeds/', function(data) {
                if (typeof(Storage) !== "undefined") {
                    if (!localStorage.getItem("sla_testbeds")) {
                        var testbeds = data;
                        localStorage.setItem("sla_testbeds", testbeds);
                    }
                }
            }).done(function(data) {
                self.get_sla_templates(data);
                alert("sla templates recovered: " + data);
            });
        },

        get_sla_templates: function (testbeds) {

            testbeds.forEach(function(testbed, index, array) {

                if(testbed!="omf:netmode") { return } // TODO: remove

                $.get('/sla/agreements/templates/' + testbed, function(slo) {

                    $(".modal-body #sla_template").append(slo);

                    var content =
                    "<div id=" + testbed + " class='row' data-urns='[]' style='display: none'>" +
                        "<div class='col-md-6'>" +
                            "<p>Testbed <span class='provider'>" + testbed + "</span> offers the following SLA for its resources</p>" +
                        "/div>" +
                        "<div class='col-md-1'>" +
                            "<button class='sla-info-button btn btn-default' data-toggle='modal' data-target='#sla_template_modal'>" +
                            "<span class='glyphicon glyphicon-info-sign'></span>" +
                                "Details" +
                            "</button>" +
                        "</div>" +
                        "<div class='col-md-1'>" +
                            "<button class='sla-accept-button btn btn-default' data-complete-text='Accepted' autocomplete='off'>" +
                            "<span class='glyphicon glyphicon-ok'></span>" +
                                "Accept" +
                            "</button>" +
                        "</div>" +
                    "</div>";

                    $("#sla_offers").append(content);
                });
            });
        },

        check_template_status: function() {
            for (var testbed in this.accepted_slas) {
                if (!this.accepted_slas[testbed]) { return false; }
            }

            return true;
        },

        /* PLUGIN EVENTS */

        /* GUI EVENTS */

        button_binding: function() {
            var self = this;
            $(".sla-accept-button").click(function() {
                // set SLA as accepted and remove warnings
                var id = $(this).closest(".row").attr("id");
                self.accepted_slas[id] = true;
                var is_ok = self.check_template_status();

                $(".sla-alert").show();
                $(this).button("complete");
                $(this).prop("disabled", true);

                if (is_ok) {
                    // remove warnings
                    $('#' + id).data("urns").forEach(function (urn, index, array) {
                        data = {
                            state: STATE_SET,
                            key  : "resource",
                            op   : STATE_SET_REMOVE,
                            value: urn
                        }

                        manifold.raise_event(self.query_uuid, STATUS_REMOVE_WARNING, data);
                    });
                }
            });

            $(".sla-alert-close").click(function() {
                $(this).closest(".sla-alert").hide();
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
                    "SLIVER_INFO_EXPIRATION": record.lease[0].end_time,  // FIXME: only working with leases
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

        on_filter_added: function(filter)
        {

        },

        on_field_state_changed: function(data)
        {
            var self = this;
            self.query_uuid = self.options.query_uuid;

            var testbeds = localStorage.getItem("sla_testbeds").split(",");
            var urn_regexp = /\+(.*?)\+/;
            // this.set_state(result, this.options.username);

             switch(data.state) {
                case STATE_SET:
                    switch(data.op) {
                        case STATE_SET_IN_PENDING:
                            if (typeof(data.value) == 'string') {
                                // data.value = urn
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
                            }
                            break;
                        case STATE_SET_OUT:
                            // data.value = urn
                            if (typeof(data.value) == 'string') {
                                // data.value = urn
                                var urn = urn_regexp.exec(data.value)[1];
                                var pos = $.inArray(urn, testbeds);
                                if ( pos != -1) {
                                    var id_ref = testbeds[pos].replace(/\.|:/g, "-");
                                    var array = $("#" + id_ref).data("urns");
                                    array.splice(array.indexOf(data.value), 1);

                                    if ($("#" + id_ref).data("urns").length == 0) {
                                        $("#" + id_ref).hide();
                                        delete self.accepted_slas[id_ref];
                                        $(".sla-accept-button").button("reset");
                                        $(".sla-accept-button").prop("disabled", false);
                                    }
                                    //$( "#sla_offers_list" ).append(
                                    //    $("<li>").text("Testbed " + testbeds[pos] + " offers SLA for its resources")
                                    //);
                                }
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

})(jQuery);
