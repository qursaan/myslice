/**
 * Description: associate with a Get query, maintains the 'Update' query that records pending changes
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

// xxx this is ongoing work, very rough, and not working at all yet 

( function ( $ ) {
    
    var debug=false;
//    debug=true

    $.fn.Updater = function ( method ) {
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
		// xxx not tested yet
                var results_channel = '/results/' + options.query_uuid + '/changed';
		$.subscribe(results_channel, function (e,rows) { updater.query_completed (e,rows); } );
		// under test..
		var failed_channel = '/results/' + options.query_uuid + '/failed';
		$.subscribe(failed_channel, $this, function (e,code,output) { updater.query_failed (e, code, output); } );
	    });
	},
	destroy : function( ) {
            return this.each(function(){
		var $this = $(this);
		$(window).unbind('Updater');
		data.Updater.remove();
		$this.removeData('Updater');
            });
	},

	show : function( content ) { }
    };
    
    function Updater (options) {
	this.options=options;
	// xxx should try to locate update_query first, in case we have several Updaters
	// on the same query
	// however the mental model behind the global manifold object for now is 
	// to unambiguously find a query based on its query_uuid, which in the joomla
	// implementation wouldn't fly
	// we keep this for a later improvement
	var query=manifold.find_query (options.query_uuid);
	// very rough way of filling this for now
	this.update_query = 
	    new ManifoldQuery ("update", query.subject, null, query.filters, 
			       {}, // params
			       query.fields, 
			       undefined, /* unique */ 
			       Math.uuid(32,16), 
			       undefined, undefined /* maybe some day I'll get that one */);
	manifold.insert_query (this.update_query);
	// arm button once document is loaded
	(function(updater) {$(document).ready(function(){updater.arm_button()})})(this);

	this.arm_button = function () {
	    $('#updater-' + this.options.plugin_uuid).click(this, this.submit_update_request);
	},
	this.submit_update_request = function (e) {
	    var query_uuid = e.data.options.query_uuid;
	    var update_query = e.data.update_query;
	    if (debug) messages.debug("Updater.submit_update_request " + update_query.__repr());
	    // actually send the Update query, but publish results as if coming from the original query
	    manifold.asynchroneous_exec ( [ {'query_uuid': update_query.query_uuid, 'publish_uuid' : query_uuid} ], false);
	    // disable button while the query is flying
            $('#updater-' + e.data.options.plugin_uuid).attr('disabled', 'disabled');
        },

	this.query_failed = function (e, code, output) {
	    var plugindiv=e.data;
	    var updater=plugindiv.data('Updater');
            $('#updater-' + updater.options.plugin_uuid).removeAttr('disabled');
	    // just as a means to deom how to retrieve the stuff passed on the channel
	    if (debug) messages.debug("retrieved error code " + code + " and output " + output);
	}
	    
	this.update_resources = function (e, resources, change) {
            data = e.data.instance.data().Slices;

            data.update_query.params['resource'] = resources
            $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
	},

	this.update_leases = function (e, leases, change) {
	    data = e.data.instance.data().Slices;
	    
	    data.update_query.params['lease'] = leases
	    $.publish('/update/' + data.options.query_uuid, [data.update_query, true]);
	},
	
	this.query_completed = function (e, rows, query) {

	    /* This function is called twice : get and update */
	    messages.info("updater.query_completed - not implemented yet");
	    return;
      
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
    }
})( jQuery );

