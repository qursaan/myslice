/**
 * Description: ActiveFilters plugin
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite
 * License: GPLv3
 */

(function($){

    var ActiveFilters = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);

            this.listen_query(options.query_uuid);

            $("#clearFilters").click(function () {
                manifold.raise_event(options.query_uuid, CLEAR_FILTERS);
            });
        },

        // This should be provided in the API
        // make_id_from_filter, etc
        getOperatorLabel: function(op)
        {
            if (op == "=" || op == "==") {
                return 'eq';
            } else if (op == "!=") {
                return "ne";
            } else if (op == ">") {
                return "gt";
            } else if (op == ">=") {
                return "ge";
            } else if (op == "<") {
                return "lt";
            } else if (op == "<=") {
                return "le";
            } else {
                return false;
            }
        },

        // Visual actions on the component

        clear_filters: function() {
            $("#clearFilters").hide();
        },

        on_filter_added: function(filter) {
            var key    = filter[0];
            var op     = filter[1];
            var value  = filter[2];
            var op_str = this.getOperatorLabel(op);
            var id     = 'filter_' + key + "_" + op_str;

            // Add a button for a filter            
            $('#myActiveFilters').append("<div id='" + id + "' class='filterButton' style='float:left;margin-bottom:10px;'/>");
            $('#' + id).append(key + op + value);

            // Add a close button to remove the filter
            $('#' + id).append("<img id='close-" + id + "' src='/all-static/img/details_close.png' class='closeButton' style='padding-left:3px;'/>");
            // Add an event on click on the close button, call function removeFilter
            $('#close-' + id).click(function(event) {
                manifold.raise_event(options.query_uuid, FILTER_REMOVED, filter);
            });
            // If there are active filters, then show the clear filters button
            $("#clearFilters").show();
        },

        on_filter_removed: function(filter) {
            var key    = filter[0];
            var op     = filter[1];
            var value  = filter[2];
            var op_str = this.getOperatorLabel(op);
            var id     = 'filter_' + key + "_" + op_str;

            $('#' + id).remove()
            // Count the number of filter _inside_ the current plugin
            count = $('.filterButton', $('#myActiveFilters')).length;
            if (count == 0) {
                jQuery("#clearFilters").hide();
            }
        },

        on_filter_clear: function(filter) {
            $("#clearFilters").hide();

        },
    });

    $.plugin('ActiveFilters', ActiveFilters);

})(jQuery);
