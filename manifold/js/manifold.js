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

// Constants that should be somehow moved to a plugin.js file
var FILTER_ADDED   = 1;
var FILTER_REMOVED = 2;
var CLEAR_FILTERS  = 3;
var FIELD_ADDED    = 4;
var FIELD_REMOVED  = 5;
var CLEAR_FIELDS   = 6;
var NEW_RECORD     = 7;
var CLEAR_RECORDS  = 8;

var IN_PROGRESS    = 101;
var DONE           = 102;

/* Update requests from plugins */
var SET_ADD        = 201;
var SET_REMOVED    = 202;
var RUN_UPDATE     = 203;

/* Query status */
var STATUS_NONE               = 500; // Query has not been started yet
var STATUS_GET_IN_PROGRESS    = 501; // Query has been sent, no result has been received
var STATUS_GET_RECEIVED       = 502; // Success
var STATUS_GET_ERROR          = 503; // Error
var STATUS_UPDATE_PENDING     = 504;
var STATUS_UPDATE_IN_PROGRESS = 505;
var STATUS_UPDATE_RECEIVED    = 506;
var STATUS_UPDATE_ERROR       = 507;
// outdated ?

// A structure for storing queries



function QueryExt(query, parent_query_ext, main_query_ext, update_query_ext, disabled) {

    /* Constructor */
    if (typeof query == "undefined")
        throw "Must pass a query in QueryExt constructor";
    this.query            = query
    this.parent_query_ext = (typeof parent_query_ext == "undefined") ? null : parent_query_ext
    this.main_query_ext   = (typeof main_query_ext   == "undefined") ? null : main_query_ext
    this.update_query_ext = (typeof update_query_ext   == "undefined") ? null : update_query_ext
    this.disabled         = (typeof update_query_ext   == "undefined") ? false : disabled
    
    this.status       = null;
    this.results      = null;
    // update_query null unless we are a main_query (aka parent_query == null); only main_query_fields can be updated...
}

function QueryStore() {

    this.main_queries     = {};
    this.analyzed_queries = {};

    /* Insertion */

    this.insert = function(query)
    {
        // We expect only main_queries are inserted

        /* If the query has not been analyzed, then we analyze it */
        if (query.analyzed_query == null) {
            query.analyze_subqueries();
        }

        /* We prepare the update query corresponding to the main query and store both */
        /* Note: they have the same UUID */

        // XXX query.change_action() should become deprecated
        update_query = query.clone();
        update_query.action = 'update';
        update_query.analyzed_query.action = 'update';
        update_query.params = {};
        update_query_ext = new QueryExt(update_query);
        console.log("Update query created from Get query", update_query);

        /* We store the main query */
        query_ext = new QueryExt(query, null, null, update_query_ext, false);
        manifold.query_store.main_queries[query.query_uuid] = query_ext;
        /* Note: the update query does not have an entry! */


        // The query is disabled; since it is incomplete until we know the content of the set of subqueries
        // XXX unless we have no subqueries ???
        // we will complete with params when records are received... this has to be done by the manager
        // SET_ADD, SET_REMOVE will change the status of the elements of the set
        // UPDATE will change also, etc.
        // XXX We need a proper structure to store this information...

        // We also need to insert all queries and subqueries from the analyzed_query
        // XXX We need the root of all subqueries
        query.iter_subqueries(function(sq, data, parent_query) {
            if (parent_query)
                parent_query_ext = manifold.query_store.find_analyzed_query_ext(parent_query.query_uuid);
            else
                parent_query_ext = null;
            // XXX parent_query_ext == false
            // XXX main.subqueries = {} # Normal, we need analyzed_query
            sq_ext = new QueryExt(sq, parent_query_ext, query_ext)
            manifold.query_store.analyzed_queries[sq.query_uuid] = sq_ext;
        });

        // XXX We have spurious update queries...
    }

    /* Searching */

    this.find_query_ext = function(query_uuid)
    {
        return this.main_queries[query_uuid];
    }

    this.find_query = function(query_uuid)
    {
        return this.find_query_ext(query_uuid).query;
    }

    this.find_analyzed_query_ext = function(query_uuid)
    {
        return this.analyzed_queries[query_uuid];
    }

    this.find_analyzed_query = function(query_uuid)
    {
        return this.find_analyzed_query_ext(query_uuid).query;
    }
}

/*!
 * This namespace holds functions for globally managing query objects
 * \Class Manifold
 */
var manifold = {

    /************************************************************************** 
     * Helper functions
     **************************************************************************/ 

    separator: '__',

    spin_presets: {},

    spin: function(locator, active /*= true */) {
        active = typeof active !== 'undefined' ? active : true;
        try {
            if (active) {
                $(locator).spin(manifold.spin_presets);
            } else {
                $(locator).spin(false);
            }
        } catch (err) { messages.debug("Cannot turn spins on/off " + err); }
    },

    /************************************************************************** 
     * Metadata management
     **************************************************************************/ 

     metadata: {

        get_table: function(method)
        {
            var table = MANIFOLD_METADATA[method];
            return (typeof table === 'undefined') ? null : table;
        },

        get_columns: function(method)
        {
            var table = this.get_table(method);
            if (!table) {
                return null;
            }

            return (typeof table.column === 'undefined') ? null : table.column;
        },

        get_key: function(method)
        {
            var table = this.get_table(method);
            if (!table)
                return null;

            return (typeof table.key === 'undefined') ? null : table.key;
        },


        get_column: function(method, name)
        {
            var columns = this.get_columns(method);
            if (!columns)
                return null;

            $.each(columns, function(i, c) {
                if (c.name == name)
                    return c
            });
            return null;
        },

        get_type: function(method, name)
        {
            var table = this.get_table(method);
            if (!table)
                return null;

            return (typeof table.type === 'undefined') ? null : table.type;
        }

     },

    /************************************************************************** 
     * Query management
     **************************************************************************/ 

    query_store: new QueryStore(),

    // XXX Remaining functions are deprecated since they are replaced by the query store

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
        // NEW API
        manifold.query_store.insert(query);

        // FORMER API
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

    /************************************************************************** 
     * Query execution
     **************************************************************************/ 

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
        //try {
        //    if (manifold.asynchroneous_debug) 
        //   messages.debug("Turning on spin with " + jQuery(".need-spin").length + " matches for .need-spin");
        //    jQuery('.need-spin').spin(manifold.spin_presets);
        //} catch (err) { messages.debug("Cannot turn on spins " + err); }
        
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

            query.iter_subqueries(function (sq) {
                manifold.raise_record_event(sq.query_uuid, IN_PROGRESS);
            });

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
        if (typeof result === 'undefined')
            result = [];

        // NEW PLUGIN API
        manifold.raise_record_event(query.query_uuid, CLEAR_RECORDS);
        $.each(result, function(i, record) {
            manifold.raise_record_event(query.query_uuid, NEW_RECORD, record);
        });
        manifold.raise_record_event(query.query_uuid, DONE);

        // OLD PLUGIN API BELOW
        /* Publish an update announce */
        var channel="/results/" + query.query_uuid + "/changed";
        if (manifold.asynchroneous_debug)
            messages.debug("publishing result on " + channel);
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
            // We need to make sense of error codes here
            alert("Your session has expired, please log in again");
            window.location="/logout/";
            return;
        }
        if (data.code == 1) { // WARNING
            messages.error("Some errors have been received from the manifold backend at " + MANIFOLD_URL + " [" + data.description + "]");
            // publish error code and text message on a separate channel for whoever is interested
            jQuery.publish("/results/" + publish_uuid + "/failed", [data.code, data.description] );

            $("#notifications").notify("create", "sticky", {
              title: 'Warning',
              text: data.description
            },{
              expires: false,
              speed: 1000
            });
            
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

                // XXX We might need to update the corresponding update_query here 
                query_ext = manifold.query_store.find_query_ext(query.query_uuid);
                query = query_ext.query;

                // We don't prepare an update query if the result has more than 1 entry
                if (result.length == 1) {
                    var res = result[0];

                    console.log("Locating update query for updating params", update_query);
                    update_query_ext = query_ext.update_query_ext;
                    update_query = update_query_ext.query;

                    // Testing whether the result has subqueries (one level deep only)
                    // iif the query has subqueries
                    var count = 0;
                    var obj = query.analyzed_query.subqueries;
                    for (method in obj) {
                        if (obj.hasOwnProperty(method)) {
                            var key = manifold.metadata.get_key(method);
                            if (!key)
                                continue;
                            if (key.length > 1)
                                continue;
                            key = key[0];
                            var sq_keys = [];
                            var records = res[method];
                            if (!records)
                                continue
                            $.each(records, function (i, obj) {
                                sq_keys.push(obj[key]);
                            });
                            update_query.params[method] = sq_keys;
                            count++;
                        }
                    }

                    if (count > 0) {
                        update_query_ext.disabled = false;
                    }

                }


                
                // We have results from the main query
                // inspect subqueries and get the key for each

                // XXX note that we might need the name for each relation, but
                // this might be for SET_ADD, since we need to recursively find
                // the path from the main query


                tmp_query = manifold.find_query(query.query_uuid);
                manifold.publish_result_rec(tmp_query.analyzed_query, result);
            //}

        }
    },

    /************************************************************************** 
     * Plugin API helpers
     **************************************************************************/ 

    raise_event_handler: function(type, query_uuid, event_type, value)
    {
        if ((type != 'query') && (type != 'record'))
            throw 'Incorrect type for manifold.raise_event()';

        var channels = [ manifold.get_channel(type, query_uuid), manifold.get_channel(type, '*') ];

        $.each(channels, function(i, channel) {
            if (value === undefined)
                $('.plugin').trigger(channel, [event_type]);
            else
                $('.plugin').trigger(channel, [event_type, value]);
        });
    },

    raise_query_event: function(query_uuid, event_type, value)
    {
        manifold.raise_event_handler('query', query_uuid, event_type, value);
    },

    raise_record_event: function(query_uuid, event_type, value)
    {
        manifold.raise_event_handler('record', query_uuid, event_type, value);
    },


    raise_event: function(query_uuid, event_type, value)
    {
        // Query uuid has been updated with the key of a new element
        query_ext    = manifold.query_store.find_analyzed_query_ext(query_uuid);
        query = query_ext.query;

        switch(event_type) {
            case SET_ADD:
                // update is only possible is the query is not pending, etc
                // CHECK status !

                // XXX we can only update subqueries of the main query. Check !
                // assert query_ext.parent_query == query_ext.main_query
                update_query = query_ext.main_query_ext.update_query_ext.query;

                var path = "";
                var sq = query_ext;
                while (sq.parent_query_ext) {
                    if (path != "")
                        path = '.' + path;
                    path = sq.query.object + path;
                    sq = sq.parent_query_ext;
                }

                update_query.params[path].push(value);
                console.log('Updated query params', update_query);
                // NOTE: update might modify the fields in Get
                // NOTE : we have to modify all child queries
                // NOTE : parts of a query might not be started (eg slice.measurements, how to handle ?)

                // if everything is done right, update_query should not be null. It is updated when we received results from the get query
                // object = the same as get
                // filter = key : update a single object for now
                // fields = the same as get

                break;
            case SET_REMOVED:
                // Query uuid has been updated with the key of a removed element
                break;

            case RUN_UPDATE:
                update_query = query_ext.main_query_ext.update_query_ext.query;
                
                manifold.asynchroneous_exec ( [ {'query_uuid': update_query.query_uuid, 'publish_uuid' : query_uuid} ], false);
                break;

            case FILTER_ADDED:
                break;
            case FILTER_REMOVED:
                break;
            case FIELD_ADDED:
                main_query = query_ext.main_query_ext.query;
                main_update_query = query_ext.main_query_ext.update_query;
                query.select(value);

                // Here we need the full path through all subqueries
                path = ""
                // XXX We might need the query name in the QueryExt structure
                main_query.select(value);

                // XXX When is an update query associated ?
                // XXX main_update_query.select(value);

                break;

            case FIELD_REMOVED:
                query = query_ext.query;
                main_query = query_ext.main_query_ext.query;
                main_update_query = query_ext.main_query_ext.update_query;
                query.unselect(value);
                main_query.unselect(value);

                // We need to inform about changes in these queries to the respective plugins
                // Note: query & main_query have the same UUID
                manifold.raise_query_event(query_uuid, event_type, value);
                break;
        }
        // We need to inform about changes in these queries to the respective plugins
        // Note: query, main_query & update_query have the same UUID
        manifold.raise_query_event(query_uuid, event_type, value);
        // We are targeting the same object with get and update
        // The notion of query is bad, we should have a notion of destination, and issue queries on the destination
        // NOTE: Editing a subquery == editing a local view on the destination

        // XXX We might need to run the new query again and manage the plugins in the meantime with spinners...
        // For the time being, we will collect all columns during the first query
    },

    /* Publish/subscribe channels for internal use */
    get_channel: function(type, query_uuid) 
    {
        if ((type !== 'query') && (type != 'record'))
            return null;
        return '/' + type + '/' + query_uuid;
    },

}; // manifold object
/* ------------------------------------------------------------ */

(function($) {

    // OLD PLUGIN API: extend jQuery/$ with pubsub capabilities
    // https://gist.github.com/661855
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

