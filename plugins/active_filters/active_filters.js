/**
 * Description: ActiveFilters plugin
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite
 * License: GPLv3
 */

(function($){

    var ActiveFilters = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);

            this.els('closeButton').click(function() {
                manifold.raise_event(options.query_uuid, FILTER_REMOVED, filter);
            });

            this.el('clearFilters').click(function () {
                manifold.raise_event(options.query_uuid, CLEAR_FILTERS);
            });
            this.check_and_hide_clear_button();

            this.listen_query(options.query_uuid);

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

        show_clear_button: function()
        {
            this.el('clearFilters').show();
        }

        hide_clear_button: function()
        {
            this.el('clearFilters').hide();
        }

        check_and_hide_clear_button: function()
        {
            // Count the number of filter _inside_ the current plugin
            var count = this.els('filterButton').length;
            if (count == 1) { // Including the template
                jQuery("#clearFilters").hide();
            }
        }

        clear_filters: function() 
        {
            // XXX We need to remove all filter but template
            this.hide_clear_button();
        },

        add_filter: function(filter)
        {
            var template = this.el('template').html();
            var ctx = {
                id:   this.id(this.id_from_filter(filter, false)),
                span: this.str_from_filter(filter)
            };
            var output = Mustache.render(template, ctx);

            this.el('myActiveFilters').append(output);

            // Add an event on click on the close button, call function removeFilter
            var self = this;
            this.els('closeButton').last().click(function() {
                manifold.raise_event(self.options.query_uuid, FILTER_REMOVED, filter);
            });

            this.show_clear_button();
        },
        
        remove_filter = function(filter)
        {
            this.el(this.id_from_filter(filter, false)).remove();
            this.check_and_hide_clear_button();
        },

        /* Events */

        on_filter_added: function(filter) {
            this.add_filter(filter);
        },

        on_filter_removed: function(filter) {
            this.remove_filter(filter);
        },

        on_filter_clear: function(filter) {
            this.clear_filters();
        },
    });

    $.plugin('ActiveFilters', ActiveFilters);

})(jQuery);
