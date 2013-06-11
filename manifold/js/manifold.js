// utilities 
function debug_dict_keys (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    messages.debug ("debug_dict_keys: " + msg + " keys= " + keys);
}
function debug_dict (msg, o) {
    for (var k in o) messages.debug ("debug_dict: " + msg + " [" + k + "]=" + o[k]);
}
function debug_value (msg, value) {
    messages.debug ("debug_value: " + msg + " " + value);
}
function debug_query (msg, query) {
    if (query === undefined) messages.debug ("debug_query: " + msg + " -> undefined");
    else if (query == null) messages.debug ("debug_query: " + msg + " -> null");
    else if ('query_uuid' in query) messages.debug ("debug_query: " + msg + query.__repr());
    else messages.debug ("debug_query: " + msg + " query= " + query);
}

/* ------------------------------------------------------------ */

/*!
 * This namespace holds functions for globally managing query objects
 * \Class Manifold
 */
var manifold = {

    spin_presets: {},

    spin: function(locator, active /*= true */) {
        active = typeof active !== 'undefined' ? active : true;
        try {
            if (active) {
                $(locator).spin(manifold.spin_presets);
            } else {
                $locator.spin(false);
            }
        } catch (err) { messages.debug("Cannot turn spins on/off " + err); }
    },

    /*!
     * Associative array storing the set of queries active on the page
     * \memberof Manifold
     */
    all_queries: {},

    /*!
     * Insert a query in the global hash table associating uuids to queries.
     * If the query has no been analyzed yet, let's do it.
     * \fn insert_query(query)
     * \memberof Manifold
     * \param ManifoldQuery query Query to be added
     */
    insert_query : function (query) { 
        if (query.analyzed_query == null) {
            query.analyze_subqueries();
        }
        manifold.all_queries[query.query_uuid]=query;
    },

    /*!
     * Returns the query associated to a UUID
     * \fn find_query(query_uuid)
     * \memberof Manifold
     * \param string query_uuid The UUID of the query to be returned
     */
    find_query : function (query_uuid) { 
        return manifold.all_queries[query_uuid];
    },

    // trigger a query asynchroneously
    proxy_url : '/manifold/proxy/json/',

    asynchroneous_debug : true,

    /**
     * \brief We use js function closure to be able to pass the query (array)
     * to the callback function used when data is received
     */
    success_closure: function(query, publish_uuid, callback /*domid*/)
    {
        return function(data, textStatus) {
            manifold.asynchroneous_success(data, query, publish_uuid, callback /*domid*/);
        }
    },

    // Executes all async. queries
    // input queries are specified as a list of {'query_uuid': <query_uuid>, 'id': <possibly null>}
    asynchroneous_exec : function (query_publish_dom_tuples) {
        // start spinners

        // in case the spin stuff was not loaded, let's make sure we proceed to the exit 
        try {
            if (manifold.asynchroneous_debug) 
            messages.debug("Turning on spin with " + jQuery(".need-spin").length + " matches for .need-spin");
            jQuery('.need-spin').spin(manifold.spin_presets);
        } catch (err) { messages.debug("Cannot turn on spins " + err); }
        
        // Loop through input array, and use publish_uuid to publish back results
        jQuery.each(query_publish_dom_tuples, function(index, tuple) {
            var query=manifold.find_query(tuple.query_uuid);
            var query_json=JSON.stringify (query);
            var publish_uuid=tuple.publish_uuid;
            // by default we publish using the same uuid of course
            if (publish_uuid==undefined) publish_uuid=query.query_uuid;
            if (manifold.asynchroneous_debug) {
                messages.debug("sending POST on " + manifold.proxy_url + " to be published on " + publish_uuid);
                messages.debug("... ctd... with actual query= " + query.__repr());
            }
            // not quite sure what happens if we send a string directly, as POST data is named..
            // this gets reconstructed on the proxy side with ManifoldQuery.fill_from_POST
                jQuery.post(manifold.proxy_url, {'json':query_json} , manifold.success_closure(query, publish_uuid, tuple.callback /*domid*/));
        })
    },

    /**
     * \brief Forward a query to the manifold backend
     * \param query (dict) the query to be executed asynchronously
     * \param callback (function) the function to be called when the query terminates
     * Deprecated:
     * \param domid (string) the domid to be notified about the results (null for using the pub/sub system
     */
    forward: function(query, callback /*domid*/) {
        var query_json = JSON.stringify(query);
        $.post(manifold.proxy_url, {'json': query_json} , manifold.success_closure(query, query.query_uuid, callback/*domid*/));
    },

    /*!
     * Returns whether a query expects a unique results.
     * This is the case when the filters contain a key of the object
     * \fn query_expects_unique_result(query)
     * \memberof Manifold
     * \param ManifoldQuery query Query for which we are testing whether it expects a unique result
     */
    query_expects_unique_result: function(query) {
        /* XXX we need functions to query metadata */
        //var keys = MANIFOLD_METADATA[query.object]['keys']; /* array of array of field names */
        /* TODO requires keys in metadata */
        return true;
    },

    /*!
     * Publish result
     * \fn publish_result(query, results)
     * \memberof Manifold
     * \param ManifoldQuery query Query which has received results
     * \param array results results corresponding to query
     */
    publish_result: function(query, result) {
        /* Publish an update announce */
        var channel="/results/" + query.query_uuid + "/changed";
        if (manifold.asynchroneous_debug) messages.debug("publishing result on " + channel);
        jQuery.publish(channel, [result, query]);
    },

    /*!
     * Recursively publish result
     * \fn publish_result_rec(query, result)
     * \memberof Manifold
     * \param ManifoldQuery query Query which has received result
     * \param array result result corresponding to query
     */
    publish_result_rec: function(query, result) {
        /* If the result is not unique, only publish the top query;
         * otherwise, publish the main object as well as subqueries
         * XXX how much recursive are we ?
         */
        if (manifold.query_expects_unique_result(query)) {
            /* Also publish subqueries */
            jQuery.each(query.subqueries, function(object, subquery) {
                manifold.publish_result_rec(subquery, result[0][object]);
                /* TODO remove object from result */
            });
        }
        manifold.publish_result(query, result);
    },

    // if set domid allows the result to be directed to just one plugin
    // most of the time publish_uuid will be query.query_uuid
    // however in some cases we wish to publish the result under a different uuid
    // e.g. an updater wants to publish its result as if from the original (get) query
    asynchroneous_success : function (data, query, publish_uuid, callback /*domid*/) {
        // xxx should have a nicer declaration of that enum in sync with the python code somehow

        /* If a callback has been specified, we redirect results to it */
        if (!!callback) { callback(data); return; }

        if (data.code == 2) { // ERROR
            alert("Your session has expired, please log in again");
            window.location="/logout/";
            return;
        }
        if (data.code == 1) { // WARNING
            messages.error("Some errors have been received from the manifold backend at " + MANIFOLD_URL + " [" + data.description + "]");
            // publish error code and text message on a separate channel for whoever is interested
            jQuery.publish("/results/" + publish_uuid + "/failed", [data.code, data.description] );
        }
        // once everything is checked we can use the 'value' part of the manifoldresult
        var result=data.value;
        if (result) {
            //if (!!callback /* domid */) {
            //    /* Directly inform the requestor */
            //    if (manifold.asynchroneous_debug) messages.debug("directing result to callback");
            //    callback(result);
            //    //if (manifold.asynchroneous_debug) messages.debug("directing result to " + domid);
            //    //jQuery('#' + domid).trigger('results', [result]);
            //} else {
                /* XXX Jordan XXX I don't need publish_uuid here... What is it used for ? */
                /* query is the query we sent to the backend; we need to find the
                 * corresponding analyezd_query in manifold.all_queries
                 */
                tmp_query = manifold.find_query(query.query_uuid);
                manifold.publish_result_rec(tmp_query.analyzed_query, result);
            //}

        }
    },

}; // manifold object
/* ------------------------------------------------------------ */

// extend jQuery/$ with pubsub capabilities
/* https://gist.github.com/661855 */
(function($) {

  var o = $({});

  $.subscribe = function( channel, selector, data, fn) {
    /* borrowed from jQuery */
    if ( data == null && fn == null ) {
        // ( channel, fn )
        fn = selector;
        data = selector = undefined;
    } else if ( fn == null ) {
        if ( typeof selector === "string" ) {
            // ( channel, selector, fn )
            fn = data;
            data = undefined;
        } else {
            // ( channel, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }
    /* </ugly> */

    /* We use an indirection function that will clone the object passed in
     * parameter to the subscribe callback 
     * 
     * FIXME currently we only clone query objects which are the only ones
     * supported and editable, we might have the same issue with results but
     * the page load time will be severely affected...
     */
    o.on.apply(o, [channel, selector, data, function() { 
        for(i = 1; i < arguments.length; i++) {
            if ( arguments[i].constructor.name == 'ManifoldQuery' )
                arguments[i] = arguments[i].clone();
        }
        fn.apply(o, arguments);
    }]);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));

/* ------------------------------------------------------------ */

//http://stackoverflow.com/questions/5100539/django-csrf-check-failing-with-an-ajax-post-request
//make sure to expose csrf in our outcoming ajax/post requests
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

