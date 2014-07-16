/**
 * TestbedsPlugin: List of testbeds plugin
 * Version:     0.1
 * Description: TODO -> generalize to a list of possible filters
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Loïc Baron <loic.baron@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

(function($){

    var FilterStatusPlugin = Plugin.extend({

        /** 
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element)
        {
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);

            /* Setup click handlers */
            this.elts('list-group-item').click({'instance': this}, this._on_click);

            this.prev_filter_status = null;

            /* Initialize tooltips */
            $("[rel='tooltip']").tooltip();

        },

    /**************************************************************************
     *                            GUI MANAGEMENT                              *
     **************************************************************************/

        select_tab: function(tab)
        {
            this.elts('list-group-item').removeClass('active');
            this.elmt(tab).addClass('active');
        },

    /**************************************************************************
     *                            EVENT HANDLERS                              *
     **************************************************************************/

    // These functions are here to react on external filters, which we don't
    // use at the moment

    on_filter_added: function(filter) 
    {
        // XXX
    },

    on_filter_removed: function(filter) 
    {
        // XXX
    },

    on_field_state_changed: function(data) 
    {
        var query_ext;
        
        switch (data.state) {
            case STATE_SET:
            case STATE_WARNINGS:
                /* Get the number of pending / unconfigured resources */
                /* Let's store it in query_ext */
                query_ext = manifold.query_store.find_analyzed_query_ext(this.options.query_uuid);

                $('#badge-pending').text(query_ext.num_pending);
                if (query_ext.num_pending > 0) {
					$('#badge-pending').show();
                } else {
					$('#badge-pending').hide();
                }

                $('#badge-unconfigured').text(query_ext.num_unconfigured);
                if (query_ext.num_unconfigured > 0) {
					$('#badge-unconfigured').show();
                } else {
					$('#badge-unconfigured').hide();
                }
            default:
                break;
        }
    },

    /**************************************************************************
     *                            PRIVATE METHODS                             *
     **************************************************************************/

        /**
         * @brief : Click event handler
         */
        _on_click: function(e)
        {
            var filter_status;
            var filter;

            // A pointer to the plugin instance, since 'this' is overriden here
            self = e.data.instance;


            // Select the tab...
            filter_status = this.dataset['status'];
            self.select_tab(filter_status);

            // ... and communicate the appropriate filters to the manager
            // NOTE: we use the manifold namespace for internal filters 
            if (self.prev_filter_status)
                manifold.raise_event(self.options.query_uuid, FILTER_REMOVED, self.prev_filter_status);

            // XXX The datatables will be refreshed twice !
            if (filter_status != 'all') {
                // No filter for 'all'
                var filter = ['manifold:status', '==', filter_status];
                manifold.raise_event(self.options.query_uuid, FILTER_ADDED, filter);
            }

            self.prev_filter_status = filter_status;
        },

    });

    /* Plugin registration */
    $.plugin('FilterStatusPlugin', FilterStatusPlugin);

})(jQuery);
