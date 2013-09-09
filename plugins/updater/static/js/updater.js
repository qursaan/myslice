/**
 * Description: Manage query updates
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function( $ ) {
    
    var debug=false;
//    debug=true

    var Updater = Plugin.extend({

        init: function(options, element)
        {
            this._super(options, element);
            
            this.listen_query(options.query_uuid);
        },

        
        /*************************** PLUGIN EVENTS ****************************/

        /***************************** GUI EVENTS *****************************/

        arm_button: function()
        {
	        this.el('updater').click(this, this.submit_update_request);
        },

        submit_update_request: function (e) 
        {
            var self = e.data;

            manifold.raise_event(self.options.query_uuid, RUN_UPDATE);

        },

        /************************** GUI MANIPULATION **************************/

        disable_update_button: function()
        {
            this.el('updater').attr('disabled', 'disabled');
        },

        /*************************** QUERY HANDLER ****************************/

        /*************************** RECORD HANDLER ***************************/

        /************************** PRIVATE METHODS ***************************/

        /******************************** TODO ********************************/

        /*
	    query_failed: function (e, code, output) 
        {
            var plugindiv=e.data;
            var updater=plugindiv.data('Updater');
                $('#updater-' + updater.options.plugin_uuid).removeAttr('disabled');
            // just as a means to deom how to retrieve the stuff passed on the channel
            if (debug)
                messages.debug("retrieved error code " + code + " and output " + output);
    	},
	    
        update_resources: function (e, resources, change)
        {
                data = e.data.instance.data().Slices;

                data.update_query.params['resource'] = resources
                $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
        },

        update_leases: function (e, leases, change) 
        {
            data = e.data.instance.data().Slices;
            
            data.update_query.params['lease'] = leases
            $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
        },
        
        query_completed: function (e, rows, query)
        {

            // This function is called twice : get and update 
            messages.info("updater.query_completed - not implemented yet");
            return;
          
            var data = e.data.instance.data().Slices;
          
            // Update placeholders and trigger subqueries updates 
            if (rows.length == 0) {
            alert("no result");
            return;
            }
            var slice = rows[0];
          
            // for get
            if (data.update_query == null) {
                data.update_query = new Query('update','slice', 'now', query.filter, {"resource": null, "lease": null}, query.fields, 0, data.options.query_uuid);
            }
            // In case of update the list of resources and leases should be updated accordingly
          
            // only for get ?
            $.each(slice, function(key, value) {
            if (typeof value == 'string') {
                $('#myslice__' + key).html(value);
            }
            });
          
            // TODO avoid repetitions + made this code generic and plugin-independent 
            
            if (query.method == 'update') {
                // XXX NON, les uuid doivent etre les memes que dans la query Get, cet appel devrait etre fait avant.
                query.analyzed_subqueries();
            }
          
            // NOTE: Dans le cadre d'un update, on n'a pas besoin de refaire tout
            // le query plan et obtenir toutes les infos, par contre on ne peut pas
            // savoir d'avance quels parametres ont été accordés, changés, etc.
            // Dans le cas général, ca pourrait affecter le query plan...
            // Par contre on n'a pas d'information sur toutes les resources, mais
            // uniquement celles dans la liste. Comment gérer ?
            
            // Inform child plugins about their respective parts of the results 
            // Only for get 
            var r_subq = query.analyzed_query.subqueries['resource'];
            var l_subq = query.analyzed_query.subqueries['lease'];
            $.publish('/results/' + r_subq.uuid + '/changed', [slice['resource'], r_subq]);
            $.publish('/results/' + l_subq.uuid + '/changed', [slice['lease'],    l_subq]);
            
            // Subscribe to get notifications from child plugins
            if (!data.child_subscribe) {
                $.subscribe('/update-set/' + r_subq.uuid, {instance: e.data.instance}, update_resources);
                $.subscribe('/update-set/' + l_subq.uuid, {instance: e.data.instance}, update_leases);
                data.child_subscribe = true
            }
            
        }
        */
    });

    $.plugin('Updater', Updater);

})( jQuery );
