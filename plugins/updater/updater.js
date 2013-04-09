/**
 * Description: associate with a Get query, maintains the 'Update' query that records pending changes
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

( function ( $ ) {
    
    $.fn.Updater = function( method ) {
        /* Method calling logic */
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on $.Updater' );
        }    
	
    };
    
    var methods = {
	
	init : function( options ) {
	    return this.each(function(){
		var $this = $(this);
		var updater = new Updater (options);
		$this.data('Updater',updater);
		/* Subscribe to query updates */
                var results_channel = '/results/' + options.query_uuid + '/changed';
		$.subscribe(results_channel, function (e,rows) { updater.update_slice (e,rows); } );


	// xxx - here -- here -- xxx

            $('#updater-' + options.plugin_uuid).click({instance: $this}, function (e) {
                var data = e.data.instance.data().Slices;
                tophat_async_exec([{'query': data.update_query, 'id': null}]);
                //$('#updateslice-' + options.plugin_uuid).prop('disabled', true);
            });

            /* End of plugin initialization */

            $(this).data('Slices', {
                options: options,
                target : $this,
                update_query : null,
                child_subscribe: false, /* Are we listening for children updates */
                Slices : Slices
            });

         }
       });
     },
    destroy : function( ) {

        return this.each(function(){
            var $this = $(this), data = $this.data('Slices');
            $(window).unbind('Slices');
            data.Slices.remove();
            $this.removeData('Slices');
        })

    },

    show : function( content ) { }
  };

    /* Private methods */

    function update_resources(e, resources, change)
    {
        data = e.data.instance.data().Slices;

        data.update_query.params['resource'] = resources
        $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
    }

    function update_leases(e, leases, change)
    {
        data = e.data.instance.data().Slices;

        data.update_query.params['lease'] = leases
        $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
    }

    function update_slice(e, rows, query) {
        /* This function is called twice : get and update */

        var data = e.data.instance.data().Slices;

        /* Update placeholders and trigger subqueries updates */
        if (rows.length == 0) {
            alert("no result");
            return;
        }
        var slice = rows[0];

        /* for get */
        if (data.update_query == null) {
            data.update_query = new Query('update','slice', 'now', query.filter, {"resource": null, "lease": null}, query.fields, 0, data.options.query_uuid);
        }
        /* In case of update the list of resources and leases should be updated accordingly */

        /* only for get ? */
        $.each(slice, function(key, value) {
            if (typeof value == 'string') {
                $('#myslice__' + key).html(value);
            }
        });

        /* TODO avoid repetitions + made this code generic and plugin-independent */

        if (query.method == 'update') {
            // XXX NON, les uuid doivent etre les memes que dans la query Get, cet appel devrait etre fait avant.
            query.analyzed_subqueries();
        }

        /* NOTE: Dans le cadre d'un update, on n'a pas besoin de refaire tout
         * le query plan et obtenir toutes les infos, par contre on ne peut pas
         * savoir d'avance quels parametres ont été accordés, changés, etc.
         * Dans le cas général, ca pourrait affecter le query plan...
         * Par contre on n'a pas d'information sur toutes les resources, mais
         * uniquement celles dans la liste. Comment gérer ?
         */

        /* Inform child plugins about their respective parts of the results */
        /* Only for get */
        var r_subq = query.analyzed_query.subqueries['resource'];
        var l_subq = query.analyzed_query.subqueries['lease'];
        $.publish('/results/' + r_subq.uuid + '/changed', [slice['resource'], r_subq]);
        $.publish('/results/' + l_subq.uuid + '/changed', [slice['lease'],    l_subq]);

        /* Subscribe to get notifications from child plugins */
        if (!data.child_subscribe) {
            $.subscribe('/update-set/' + r_subq.uuid, {instance: e.data.instance}, update_resources);
            $.subscribe('/update-set/' + l_subq.uuid, {instance: e.data.instance}, update_leases);
            data.child_subscribe = true
        }

    }

})( jQuery );

