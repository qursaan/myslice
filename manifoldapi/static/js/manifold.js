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

// http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

// http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
Object.toType = (function toType(global) {
  return function(obj) {
    if (obj === global) {
      return "global";
    }
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
})(this);

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

/**
 * event: FIELD_STATE_CHANGED
 *
 * Parameters:
 *   dict :
 *      .state      : ???? used to be FIELD_REQUEST_ADD / FIELD_REQUEST_REMOVE
 *      .key        : ??? the key fields of the record
 *      .op         : the key of the record who has received an update
 *      .value      : the new state of the record
 */
var FIELD_STATE_CHANGED = 9;

var IN_PROGRESS    = 101;
var DONE           = 102; //XXX Should be harmonized with query state

/* Update requests related to subqueries */

/*
var SET_ADD        = 201;
var SET_REMOVED    = 202;
*/

// request
/*
var FIELD_REQUEST_CHANGE  = 301;
var FIELD_REQUEST_ADD     = 302;
var FIELD_REQUEST_REMOVE  = 303;
var FIELD_REQUEST_ADD_RESET = 304;
var FIELD_REQUEST_REMOVE_RESET = 305;
*/
// status (XXX Should be deprecated)
var FIELD_REQUEST_PENDING = 401;
var FIELD_REQUEST_SUCCESS = 402;
var FIELD_REQUEST_FAILURE = 403;
var STATUS_OKAY           = 404;
var STATUS_SET_WARNING    = 405;
var STATUS_ADD_WARNING    = 406;
var STATUS_REMOVE_WARNING = 407;
var STATUS_RESET          = 408;

/* Requests for query cycle */
var RUN_UPDATE     = 601;

/* MANIFOLD types */
var TYPE_VALUE  = 1;
var TYPE_RECORD = 2;
var TYPE_LIST_OF_VALUES = 3;
var TYPE_LIST_OF_RECORDS = 4;

/******************************************************************************
 * QUERY STATUS (for manifold events)
 ******************************************************************************/

var STATUS_NONE               = 500; // Query has not been started yet
var STATUS_GET_IN_PROGRESS    = 501; // Query has been sent, no result has been received
var STATUS_GET_RECEIVED       = 502; // Success
var STATUS_GET_ERROR          = 503; // Error
var STATUS_UPDATE_PENDING     = 504;
var STATUS_UPDATE_IN_PROGRESS = 505;
var STATUS_UPDATE_RECEIVED    = 506;
var STATUS_UPDATE_ERROR       = 507;

/******************************************************************************
 * QUERY STATE (for query_store)
 ******************************************************************************/

// XXX Rendundant with query status ?

var QUERY_STATE_INIT        = 0;
var QUERY_STATE_INPROGRESS  = 1;
var QUERY_STATE_DONE        = 2;

/******************************************************************************
 * RECORD STATES (for query_store)
 ******************************************************************************/

var STATE_SET       = 0;
var STATE_VALUE     = 1;
var STATE_WARNINGS  = 2;
var STATE_VISIBLE   = 3;

// ACTIONS
var STATE_SET_CHANGE = 0;
var STATE_SET_ADD    = 1;
var STATE_SET_REMOVE = 2;
var STATE_SET_CLEAR  = 3;

// STATE_SET : enum
var STATE_SET_IN            = 0;
var STATE_SET_OUT           = 1;
var STATE_SET_IN_PENDING    = 2;
var STATE_SET_OUT_PENDING   = 3;
var STATE_SET_IN_SUCCESS    = 4;
var STATE_SET_OUT_SUCCESS   = 5;
var STATE_SET_IN_FAILURE    = 6;
var STATE_SET_OUT_FAILURE   = 7;
var STATE_VALUE_CHANGE_PENDING    = 8;
var STATE_VALUE_CHANGE_SUCCESS    = 9;
var STATE_VALUE_CHANGE_FAILURE    = 10;

// STATE_WARNINGS : dict

// STATE_VISIBLE : boolean

/******************************************************************************
 * CONSTRAINTS
 ******************************************************************************/

var CONSTRAINT_RESERVABLE_LEASE     = 0;

var CONSTRAINT_RESERVABLE_LEASE_MSG = "Configuration required: this resource needs to be scheduled";

// A structure for storing queries

function QueryExt(query, parent_query_ext, main_query_ext, update_query_ext, disabled, domain_query_ext) {

    /* Constructor */
    if (typeof query == "undefined")
        throw "Must pass a query in QueryExt constructor";
    this.query                 = query;
    this.parent_query_ext      = (typeof parent_query_ext      == "undefined") ? null  : parent_query_ext;
    this.main_query_ext        = (typeof main_query_ext        == "undefined") ? null  : main_query_ext;
    this.update_query_ext      = (typeof update_query_ext      == "undefined") ? null  : update_query_ext;
    this.update_query_orig_ext = (typeof update_query_orig_ext == "undefined") ? null  : update_query_orig_ext;
    this.disabled              = (typeof disabled              == "undefined") ? false : disabled;

    // A domain query is a query that is issued to retrieve all possible values for a set
    // eg. all resources that can be attached to a slice
    // It is null unless we are a subquery for which a domain query has been issued
    this.domain_query_ext      = (typeof domain_query_ext      == "undefined") ? null  : domain_query_ext;

    // Set members to buffer until the domain query is completed
    // A list of keys
    this.set_members = [];

    // The set query is the query for which the domain query has been issued.
    // It is null unless the query is a domain query
    this.set_query_ext         = (typeof set_query_ext         == "undefined") ? null  : domain_query_ext;
    
    this.query_state = QUERY_STATE_INIT;

    // Results from a query consists in a dict that maps keys to records
    this.records = new Hashtable();

    // Status is a dict that maps keys to record status
    this.state = new Hashtable();

    // Filters that impact visibility in the local interface
    this.filters = [];

    // XXX Until we find a better solution
    this.num_pending = 0;
    this.num_unconfigured = 0;

    // update_query null unless we are a main_query (aka parent_query == null); only main_query_fields can be updated...
}

function QueryStore() {

    this.main_queries     = {};
    this.analyzed_queries = {};

    /* Insertion */

    this.insert = function(query) {
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

        /* We remember the original query to be able to reset it */
        update_query_orig_ext = new QueryExt(update_query.clone());


        /* We store the main query */
        query_ext = new QueryExt(query, null, null, update_query_ext, update_query_orig_ext, false);
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
            var parent_query_ext;
            if (parent_query) {
                parent_query_ext = manifold.query_store.find_analyzed_query_ext(parent_query.query_uuid);
            } else {
                parent_query_ext = null;
            }
            // XXX parent_query_ext == false
            // XXX main.subqueries = {} # Normal, we need analyzed_query
            sq_ext = new QueryExt(sq, parent_query_ext, query_ext)

            if (parent_query) {
                /* Let's issue a query for the subquery domain. This query will not need any update etc.
                   eg. for resources in a slice, we also query all resources */
                var all_fields = manifold.metadata.get_field_names(sq.object);
                var domain_query = new ManifoldQuery('get', sq.object, 'now', [], {}, all_fields); 
                //var domain_query = new ManifoldQuery('get', sq.object); 

                console.log("Created domain query", domain_query);
                var domain_query_ext = new QueryExt(domain_query);

                domain_query_ext.set_query_ext = sq_ext;
                sq_ext.domain_query_ext = domain_query_ext;

                // One of these two is useless ?
                manifold.query_store.main_queries[domain_query.query_uuid] = domain_query_ext;
                manifold.query_store.analyzed_queries[domain_query.query_uuid] = domain_query_ext;

                // XXX This query is run before the plugins are initialized and listening
                manifold.run_query(domain_query);
            }

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

    this.state_dict_create = function(default_set)
    {
        default_set = (default_set === undefined) ? STATE_SET_OUT : default_set;
        var state_dict = {};
        // We cannot use constants in literal definition, so...
        state_dict[STATE_WARNINGS] = {};
        state_dict[STATE_SET] = default_set;
        state_dict[STATE_VISIBLE] = true;
        return state_dict;
    }

    // RECORDS

    this.set_records = function(query_uuid, records, default_set)
    {
        default_set = (default_set === undefined) ? STATE_SET_OUT : default_set;

        var self = this;
        var key, object, query_ext, record_key;

        query_ext = this.find_analyzed_query_ext(query_uuid);
        object = query_ext.query.object;
        if (object.indexOf(':') != -1) {
            object = object.split(':')[1];
        }
        record_key = manifold.metadata.get_key(object);

        // ["start_time", "resource", "end_time"]
        // ["urn"]
        
        $.each(records, function(i, record) {
            //var key = manifold.metadata.get_key(query_ext.query.object);
            
            var record_key_value = manifold.record_get_value(record, record_key);
            query_ext.records.put(record_key_value, record);

            if (!(query_ext.state.get(record_key_value)))
                query_ext.state.put(record_key_value, self.state_dict_create(default_set));
        });
    }

    this.get_records = function(query_uuid)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        return query_ext.records.values();
    }

    this.get_record = function(query_uuid, record_key)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        return query_ext.records.get(record_key);
    }

    this.del_record = function(query_uuid, record_key)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        return query_ext.records.remove(record_key);
    }

    this.del_state = function(query_uuid, record_key)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        return query_ext.state.remove(record_key);
    }

    this.add_record = function(query_uuid, record, new_state)
    {
        var query_ext, key, record_key;
        query_ext = this.find_analyzed_query_ext(query_uuid);
        
        if (typeof(record) == 'object') {
            key = manifold.metadata.get_key(query_ext.query.object);
            record_key = manifold.record_get_value(record, key);
        } else {
            record_key = record;
        }

        var record_entry = query_ext.records.get(record_key);
        if (!record_entry)
            query_ext.records.put(record_key, record);

        manifold.query_store.set_record_state(query_uuid, record_key, STATE_SET, new_state);
    }

    this.remove_record = function(query_uuid, record, new_state)
    {
        var query_ext, key, record_key;
        query_ext = this.find_analyzed_query_ext(query_uuid);
        
        if (typeof(record) == 'object') {
            key = manifold.metadata.get_key(query_ext.query.object);
            record_key = manifold.record_get_value(record, key);
        } else {
            record_key = record;
        }
        
        if ((query_ext.query.object == 'lease') && (new_state == STATE_SET_OUT)) {
            // Leases that are marked out are in fact leases from other slices
            // We need to _remove_ leases that we mark as OUT
            manifold.query_store.del_record(query_uuid, record_key);
            manifold.query_store.del_state(query_uuid, record_key);
        } else {
            manifold.query_store.set_record_state(query_uuid, record_key, STATE_SET, new_state);
        }
    }

    this.iter_records = function(query_uuid, callback)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        query_ext.records.each(callback);
        //callback = function(record_key, record)
    }

    this.iter_visible_records = function(query_uuid, callback)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        query_ext.records.each(function(record_key, record) {
            if (query_ext.state.get(record_key)[STATE_VISIBLE]) // .STATE_VISIBLE would be for the string key
                callback(record_key, record);
        });
        //callback = function(record_key, record)

    }

    // STATE

    this.set_record_state = function(query_uuid, result_key, state, value)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        var state_dict = query_ext.state.get(result_key);
        if (!state_dict)
            state_dict = this.state_dict_create();

        state_dict[state] = value;

        query_ext.state.put(result_key, state_dict);
    }

    this.get_record_state = function(query_uuid, result_key, state)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        var state_dict = query_ext.state.get(result_key);
        if (!state_dict)
            return null;
        return state_dict[state];
    }

    // FILTERS

    this.add_filter = function(query_uuid, filter)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        // XXX When we update a filter
        query_ext.filters.push(filter);

        this.apply_filters(query_uuid);

    }

    this.update_filter = function(query_uuid, filter)
    {
        // XXX

        this.apply_filters(query_uuid);
    }

    this.remove_filter = function(query_uuid, filter)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        query_ext.filters = $.grep(query_ext.filters, function(x) {
            return !(x.equals(filter));
        });

        this.apply_filters(query_uuid);
    }

    this.get_filters = function(query_uuid)
    {
        var query_ext = this.find_analyzed_query_ext(query_uuid);
        return query_ext.filters;
    }

    this.recount = function(query_uuid)
    {
        var query_ext;
        var is_reserved, is_pending, in_set,  is_unconfigured;

        query_ext = manifold.query_store.find_analyzed_query_ext(query_uuid);
        query_ext.num_pending = 0;
        query_ext.num_unconfigured = 0;

        this.iter_records(query_uuid, function(record_key, record) {
            var record_state = manifold.query_store.get_record_state(query_uuid, record_key, STATE_SET);
            var record_warnings = manifold.query_store.get_record_state(query_uuid, record_key, STATE_WARNINGS);

            is_reserved = (record_state == STATE_SET_IN) 
                       || (record_state == STATE_SET_OUT_PENDING)
                       || (record_state == STATE_SET_IN_SUCCESS)
                       || (record_state == STATE_SET_OUT_FAILURE);

            is_pending = (record_state == STATE_SET_IN_PENDING) 
                      || (record_state == STATE_SET_OUT_PENDING);

            in_set = (record_state == STATE_SET_IN) // should not have warnings
                  || (record_state == STATE_SET_IN_PENDING)
                  || (record_state == STATE_SET_IN_SUCCESS)
                  || (record_state == STATE_SET_OUT_FAILURE); // should not have warnings

            is_unconfigured = (in_set && !$.isEmptyObject(record_warnings));

            /* Let's update num_pending and num_unconfigured at this stage */
            if (is_pending)
                query_ext.num_pending++;
            if (is_unconfigured)
                query_ext.num_unconfigured++;
        });

    }

    this.apply_filters = function(query_uuid)
    {
        var start = new Date().getTime();

        // Toggle visibility of records according to the different filters.

        var self = this;
        var filters = this.get_filters(query_uuid);
        var col_value;
        /* Let's update num_pending and num_unconfigured at this stage */

        // Adapted from querytable._querytable_filter()

        this.iter_records(query_uuid, function(record_key, record) {
            var is_reserved, is_pending, in_set,  is_unconfigured;

            /* By default, a record is visible unless a filter says the opposite */
            var visible = true;

            var record_state = manifold.query_store.get_record_state(query_uuid, record_key, STATE_SET);
            var record_warnings = manifold.query_store.get_record_state(query_uuid, record_key, STATE_WARNINGS);

            is_reserved = (record_state == STATE_SET_IN) 
                       || (record_state == STATE_SET_OUT_PENDING)
                       || (record_state == STATE_SET_IN_SUCCESS)
                       || (record_state == STATE_SET_OUT_FAILURE);

            is_pending = (record_state == STATE_SET_IN_PENDING) 
                      || (record_state == STATE_SET_OUT_PENDING);

            in_set = (record_state == STATE_SET_IN) // should not have warnings
                  || (record_state == STATE_SET_IN_PENDING)
                  || (record_state == STATE_SET_IN_SUCCESS)
                  || (record_state == STATE_SET_OUT_FAILURE); // should not have warnings

            is_unconfigured = (in_set && !$.isEmptyObject(record_warnings));

            // We go through each filter and decide whether it affects the visibility of the record
            $.each(filters, function(index, filter) {
                var key = filter[0];
                var op = filter[1];
                var value = filter[2];


                /* We do some special handling for the manifold:status filter
                 * predicates. */

                if (key == 'manifold:status') {
                    if (op != '=' && op != '==') {
                        // Unsupported filter, let's ignore it
                        console.log("Unsupported filter on manifold:status. Should be EQUAL only.");
                        return true; // ~ continue
                    }

                    switch (value) {
                        case 'reserved':
                            // true  => ~ continue
                            // false => ~ break
                            visible = is_reserved;
                            return visible;
                        case 'unconfigured':
                            visible = is_unconfigured;
                            return visible;
                        case 'pending':
                            visible = is_pending;
                            return visible;
                    }
                    return false; // ~ break
                }

                /* Normal filtering behaviour (according to the record content) follows... */
                col_value = manifold.record_get_value(record, key);

                // When the filter does not match, we hide the column by default
                if (col_value === 'undefined') {
                    visible = false;
                    return false; // ~ break
                }

                // XXX This should accept pluggable filtering functions.


                /* Test whether current filter is compatible with the column */
                if (op == '=' || op == '==') {
                    if ( col_value != value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;

                }else if (op == 'included') {
                    /* By default, the filter returns false unless the record
                     * field match at least one value of the included statement
                     */
                    visible = false;
                    $.each(value, function(i,x) {
                      if(x == col_value){
                          visible = true;
                          return false; // ~ break
                      }
                    });
                }else if (op == '!=') {
                    if ( col_value == value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;
                } else if(op=='<') {
                    if ( parseFloat(col_value) >= value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;
                } else if(op=='>') {
                    if ( parseFloat(col_value) <= value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;
                } else if(op=='<=' || op=='≤') {
                    if ( parseFloat(col_value) > value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;
                } else if(op=='>=' || op=='≥') {
                    if ( parseFloat(col_value) < value || col_value==null || col_value=="" || col_value=="n/a")
                        visible = false;
                }else{
                    // How to break out of a loop ?
                    alert("filter not supported");
                    return false; // break
                }

            });

            // Set the visibility status in the query store
            self.set_record_state(query_uuid, record_key, STATE_VISIBLE, visible);
        });

        var end = new Date().getTime();
        console.log("APPLY FILTERS [", filters, "] took", end - start, "ms");

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

    get_type: function(variable) {
        switch(Object.toType(variable)) {
            case 'number':
            case 'string':
                return TYPE_VALUE;
            case 'object':
                return TYPE_RECORD;
            case 'array':
                if ((variable.length > 0) && (Object.toType(variable[0]) === 'object'))
                    return TYPE_LIST_OF_RECORDS;
                else
                    return TYPE_LIST_OF_VALUES;
        }
    },

    /**
     *  Args:
     *      fields: A String instance (field name), or a set of String instances
     *          (field names) # XXX tuple !!
     *  Returns:
     *      If fields is a String,  return the corresponding value.
     *      If fields is a set, return a tuple of corresponding value.
     *
     *  Raises:
     *      KeyError if at least one of the fields is not found
     */
    record_get_value: function(record, fields) 
    {
        if (typeof(fields) === 'string') {
            if (fields.indexOf('.') != -1) {
                key_subkey = key.split('.', 2);
                key     = key_subkey[0]; 
                subkey  = key_subkey[1];

                if (record.indexOf(key) == -1) {
                    return null;
                }
                // Tests if the following is an array (typeof would give object)
                if (Object.prototype.toString.call(record[key]) === '[object Array]') {
                    // Records
                    return $.map(record[key], function(subrecord) { return manifold.record_get_value(subrecord, subkey) });
                } else if (typeof(record) == 'object') {
                    // Record
                    return manifold.record_get_value(record[key], subkey);
                } else {
                    console.log('Unknown field');
                }
            } else {
                return record[fields];
            }
        } else {
            // see. get_map_entries
            if (fields.length == 1)
                return manifold.record_get_value(record, fields[0])

            // Build a new record
            var ret = {};
            $.each(fields, function(i, field) {
                ret[field] = manifold.record_get_value(record, field);
            });
            ret.hashCode = record.hashCode;
            ret.equals = record.equals;
            return ret;
            // this was an array, we want a dictionary
            //return $.map(fields, function(x) { manifold.record_get_value(record, x) });
                
        }
    },

    record_hashcode: function(key_fields)
    {
        return function() {
            ret = "";
            for (var i=0; i < key_fields.length; i++)
                ret += "@@" + this[key_fields[i]];
            return ret;
        };
    },

    _record_equals: function(self, other, key_fields)
    {
        if ((typeof self === "string") && (typeof other === "string")) {
            return self == other;
        }
        for (var i=0; i < key_fields.length; i++) {
            var this_value  = self[key_fields[i]];
            var other_value = other[key_fields[i]];

            var this_type = manifold.get_type(this_value);
            var other_type = manifold.get_type(other_value);
            if (this_type != other_type)
                return false;

            switch (this_type) {
                case TYPE_VALUE:
                case TYPE_LIST_OF_VALUES:
                    if (this_value != other_value)
                        return false;
                    break;
                case TYPE_RECORD:
                    if (!(_record_equals(this_value, other_value, key_fields)))
                        return false;
                    break;
                case TYPE_LIST_OF_RECORDS:
                    if (this_value.length != other_value.length)
                        return false;
                    for (var j = 0; j < this_value.length; j++)
                        if (!(_record_equals(this_value[j], other_value[j], key_fields)))
                            return false;
                    break;
            }
        }
        return true;
    },

    record_equals: function(key_fields)
    {
        return function(other) { 
            return manifold._record_equals(this, other, key_fields); 
        };
    },

    _in_array: function(element, array, key_fields)
    {
        if (key_fields.length > 1) {
            for (var i = 0; i < array.length; i++) {
                if (manifold._record_equals(element, array[i], key_fields))
                    return true;
            }
            return false;
        } else {
            // XXX TODO If we have a dict, extract the key first
            return ($.inArray(element, array) != -1);
        }
    },

    /************************************************************************** 
     * Metadata management
     **************************************************************************/ 

     metadata: {

        get_table: function(method) {
            var table = MANIFOLD_METADATA[method];
            return (typeof table === 'undefined') ? null : table;
        },

        get_columns: function(method) {
            var table = this.get_table(method);
            if (!table) {
                return null;
            }

            return (typeof table.column === 'undefined') ? null : table.column;
        },

        get_field_names: function(method)
        {
            var columns = this.get_columns(method);
            if (!columns)
                return null;
            return $.map(columns, function (x) { return x.name });
        },

        get_key: function(method) {
            var table = this.get_table(method);
            if (!table)
                return null;

            return (typeof table.key === 'undefined') ? null : table.key;
        },


        get_column: function(method, name) {
            var columns = this.get_columns(method);
            if (!columns)
                return null;

            $.each(columns, function(i, c) {
                if (c.name == name)
                    return c
            });
            return null;
        },

        get_type: function(method, name) {
            var table = this.get_table(method);
            if (!table)
                return null;

            var match = $.grep(table.column, function(x) { return x.name == name });
            if (match.length == 0) {
                return undefined;
            } else {
                return match[0].type;
            }
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

        // Run
        $(document).ready(function() {
        manifold.run_query(query);
        });

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

    // reasonably low-noise, shows manifold requests coming in and out
    asynchroneous_debug : true,
    // print our more details on result publication and related callbacks
    pubsub_debug : false,

    /**
     * \brief We use js function closure to be able to pass the query (array)
     * to the callback function used when data is received
     */
    success_closure: function(query, publish_uuid, callback) {
        return function(data, textStatus) {
            manifold.asynchroneous_success(data, query, publish_uuid, callback);
        }
    },

    run_query: function(query, callback)
        {
        // default value for callback = null
        if (typeof callback === 'undefined')
            callback = null; 

        var query_ext = manifold.query_store.find_query_ext(query.query_uuid);
        query_ext.query_state = QUERY_STATE_INPROGRESS;

        var query_json = JSON.stringify(query);

        // Inform plugins about the progress
        query.iter_subqueries(function (sq) {
            var sq_query_ext = manifold.query_store.find_analyzed_query_ext(sq.query_uuid);
            sq_query_ext.query_state = QUERY_STATE_INPROGRESS;

            manifold.raise_record_event(sq.query_uuid, IN_PROGRESS);
        });


        $.post(manifold.proxy_url, {'json': query_json} , manifold.success_closure(query, null, callback));
    },

    // XXX DEPRECATED
    // Executes all async. queries - intended for the javascript header to initialize queries
    // input queries are specified as a list of {'query_uuid': <query_uuid> }
    // each plugin is responsible for managing its spinner through on_query_in_progress
    asynchroneous_exec : function (query_exec_tuples) {
        
        // Loop through input array, and use publish_uuid to publish back results
        $.each(query_exec_tuples, function(index, tuple) {
            var query=manifold.find_query(tuple.query_uuid);
            var query_json=JSON.stringify (query);
            var publish_uuid=tuple.publish_uuid;
            // by default we publish using the same uuid of course
            if (publish_uuid==undefined) publish_uuid=query.query_uuid;
            if (manifold.pubsub_debug) {
                messages.debug("sending POST on " + manifold.proxy_url + query.__repr());
            }

            query.iter_subqueries(function (sq) {
                manifold.raise_record_event(sq.query_uuid, IN_PROGRESS);
            });

            // not quite sure what happens if we send a string directly, as POST data is named..
            // this gets reconstructed on the proxy side with ManifoldQuery.fill_from_POST
            $.post(manifold.proxy_url, {'json':query_json}, 
                   manifold.success_closure(query, publish_uuid, tuple.callback));
        })
    },

    /**
     * \brief Forward a query to the manifold backend
     * \param query (dict) the query to be executed asynchronously
     * \param callback (function) the function to be called when the query terminates
     */
    forward: function(query, callback) {
        var query_json = JSON.stringify(query);
        $.post(manifold.proxy_url, {'json': query_json} , 
               manifold.success_closure(query, query.query_uuid, callback));
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
        if (manifold.pubsub_debug)
            messages.debug(".. publish_result (1) ");
        var count=0;
        $.each(result, function(i, record) {
            manifold.raise_record_event(query.query_uuid, NEW_RECORD, record);
            count += 1;
        });
        if (manifold.pubsub_debug) 
            messages.debug(".. publish_result (2) has used NEW API on " + count + " records");
        manifold.raise_record_event(query.query_uuid, DONE);
        if (manifold.pubsub_debug) 
            messages.debug(".. publish_result (3) has used NEW API to say DONE");

        // OLD PLUGIN API BELOW
        /* Publish an update announce */
        var channel="/results/" + query.query_uuid + "/changed";
        if (manifold.pubsub_debug) 
            messages.debug(".. publish_result (4) OLD API on channel" + channel);

        $.publish(channel, [result, query]);

        if (manifold.pubsub_debug) 
            messages.debug(".. publish_result (5) END q=" + query.__repr());
    },

    store_records: function(query, records) {
        // Store records
        var query_ext = manifold.query_store.find_analyzed_query_ext(query.query_uuid);
        if (query_ext.set_query_ext) {
            // We have a domain query
            // The results are stored in the corresponding set_query
            manifold.query_store.set_records(query_ext.set_query_ext.query.query_uuid, records);
            
        } else if (query_ext.domain_query_ext) {
            // We have a set query, it is only used to determine which objects are in the set, we should only retrieve the key
            // Has it a domain query, and has it completed ?
            $.each(records, function(i, record) {
                var key = manifold.metadata.get_key(query.object);
                var record_key = manifold.record_get_value(record, key);
                manifold.query_store.set_record_state(query.query_uuid, record_key, STATE_SET, STATE_SET_IN);
            });

        } else {
            // We have a normal query
            manifold.query_store.set_records(query.query_uuid, records, STATE_SET_IN);
        }
    },

    /*!
     * Recursively publish result
     * \fn publish_result_rec(query, result)
     * \memberof Manifold
     * \param ManifoldQuery query Query which has received result
     * \param array result result corresponding to query
     *
     * Note: this function works on the analyzed query
     */
    publish_result_rec: function(query, records) {
        /* If the result is not unique, only publish the top query;
         * otherwise, publish the main object as well as subqueries
         * XXX how much recursive are we ?
         */
        if (manifold.pubsub_debug)
             messages.debug (">>>>> publish_result_rec " + query.object);
        if (manifold.query_expects_unique_result(query)) {
            /* Also publish subqueries */
            $.each(query.subqueries, function(object, subquery) {
                manifold.publish_result_rec(subquery, records[0][object]);
                /* TODO remove object from result */
            });
        }
        if (manifold.pubsub_debug) 
            messages.debug ("===== publish_result_rec " + query.object);

        var query_ext = manifold.query_store.find_analyzed_query_ext(query.query_uuid);
        query_ext.query_state = QUERY_STATE_DONE;

        this.store_records(query, records);

        var pub_query;

        if (query_ext.set_query_ext) {
            if (query_ext.set_query_ext.query_state != QUERY_STATE_DONE)
                return;
            pub_query = query_ext.set_query_ext.query;
        } else if (query_ext.domain_query_ext) {
            if (query_ext.domain_query_ext.query_state != QUERY_STATE_DONE)
                return;
            pub_query = query;
        } else {
            pub_query = query;
        }
        // We can only publish results if the query (and its related domain query) is complete
        manifold.publish_result(pub_query, records);

        if (manifold.pubsub_debug) 
            messages.debug ("<<<<< publish_result_rec " + query.object);
    },

    setup_update_query: function(query, records) 
    {
        // We don't prepare an update query if the result has more than 1 entry
        if (records.length != 1)
            return;
        var query_ext = manifold.query_store.find_query_ext(query.query_uuid);

        var record = records[0];

        var update_query_ext = query_ext.update_query_ext;

        if (!update_query_ext)
            return;

        var update_query = update_query_ext.query;
        var update_query_ext = query_ext.update_query_ext;
        var update_query_orig = query_ext.update_query_orig_ext.query;

        // Testing whether the result has subqueries (one level deep only)
        // iif the query has subqueries
        var count = 0;
        var obj = query.analyzed_query.subqueries;
        for (method in obj) {
            if (obj.hasOwnProperty(method)) {
                var key = manifold.metadata.get_key(method);
                if (!key)
                    continue;
                var sq_keys = [];
                var subrecords = record[method];
                if (!subrecords)
                    continue
                $.each(subrecords, function (i, subrecord) {
                    sq_keys.push(manifold.record_get_value(subrecord, key));
                });
                update_query.params[method] = sq_keys;
                update_query_orig.params[method] = sq_keys.slice();
                count++;
            }
        }

        if (count > 0) {
            update_query_ext.disabled = false;
            update_query_orig_ext.disabled = false;
        }
    },

    process_get_query_records: function(query, records) {
        this.setup_update_query(query, records);
        
        var query_ext = manifold.query_store.find_query_ext(query.query_uuid);
        query_ext.query_state = QUERY_STATE_DONE;

        /* Publish full results */
        var tmp_query = manifold.query_store.find_analyzed_query(query.query_uuid);
        manifold.publish_result_rec(tmp_query, records);
    },

    make_records: function(object, records)
    {
        $.each(records, function(i, record) {
            manifold.make_record(object, record);
        });
    },

    make_record: function(object, record)
    {
        // To make an object a record, we just add the hash function
        var key, new_object;

        if (object.indexOf(':') != -1) {
            new_object = object.split(':')[1];
        } else {
            new_object = object;
        }

        key = manifold.metadata.get_key(new_object);
        record.hashCode = manifold.record_hashcode(key.sort());
        record.equals   = manifold.record_equals(key);

        // Looking after subrecords
        for (var field in record) {
            var result_value = record[field];

            switch (this.get_type(result_value)) {
                case TYPE_RECORD:
                    var subobject = manifold.metadata.get_type(object, field);
                    // if (subobject) XXX Bugs with fields declared string while they are not : network.version is a dict in fact
                    if (subobject && subobject != 'string')
                        manifold.make_record(subobject, result_value);
                    break;
                case TYPE_LIST_OF_RECORDS:
                    var subobject = manifold.metadata.get_type(object, field);
                    if (subobject)
                        manifold.make_records(subobject, result_value);
                    break;
            }
        }
    },

    /**
     * 
     * What we need to do when receiving results from an update query:
     * - differences between what we had, what we requested, and what we obtained
     *    . what we had : update_query_orig (simple fields and set fields managed differently)
     *    . what we requested : update_query
     *    . what we received : records
     * - raise appropriate events
     *
     * The normal process is that results similar to Get will be pushed in the
     * pubsub mechanism, thus repopulating everything while we only need
     * diff's. This means we need to move the publish functionalities in the
     * previous 'process_get_query_records' function.
     */
    process_update_query_records: function(query, records) {
        // First issue: we request everything, and not only what we modify, so will will have to ignore some fields
        var query_uuid        = query.query_uuid;
        var query_ext         = manifold.query_store.find_analyzed_query_ext(query_uuid);
        var update_query      = query_ext.main_query_ext.update_query_ext.query;
        var update_query_orig = query_ext.main_query_ext.update_query_orig_ext.query;
        
        // Since we update objects one at a time, we can get the first record
        var record = records[0];

        // Let's iterate over the object properties
        for (var field in record) {
            var result_value = record[field];
            switch (this.get_type(result_value)) {
                case TYPE_VALUE:
                    // Did we ask for a change ?
                    var update_value = update_query[field];
                    if (!update_value)
                        // Not requested, if it has changed: OUT OF SYNC
                        // How we can know ?
                        // We assume it won't have changed
                        continue;

                    if (!result_value)
                        throw "Internal error";

                    data = {
                        state : STATE_SET,
                        key   : field,
                        op    : update_value,
                        value : (update_value == result_value) ? STATE_VALUE_CHANGE_SUCCESS : STATE_VALUE_CHANGE_FAILURE,
                    }
                    manifold.raise_record_event(query_uuid, FIELD_STATE_CHANGED, data);

                    break;
                case TYPE_RECORD:
                    throw "Not implemented";
                    break;

                /*
case TYPE_LIST_OF_VALUES:
                    // Same as list of records, but we don't have to extract keys
                    
                    // The rest of exactly the same (XXX factorize)
                    var update_keys  = update_query_orig.params[field];
                    var query_keys   = update_query.params[field];
                    var added_keys   = $.grep(query_keys, function (x) { return $.inArray(x, update_keys) == -1 });
                    var removed_keys = $.grep(update_keys, function (x) { return $.inArray(x, query_keys) == -1 });


                    $.each(added_keys, function(i, key) {
                        if ($.inArray(key, result_value) == -1) {
                            data = {
                                request: FIELD_REQUEST_ADD,
                                key   : field,
                                value : key,
                                status: FIELD_REQUEST_FAILURE,
                            }
                        } else {
                            data = {
                                request: FIELD_REQUEST_ADD,
                                key   : field,
                                value : key,
                                status: FIELD_REQUEST_SUCCESS,
                            }
                        }
                        manifold.raise_record_event(query_uuid, FIELD_STATE_CHANGED, data);
                    });
                    $.each(removed_keys, function(i, key) {
                        if ($.inArray(key, result_keys) == -1) {
                            data = {
                                request: FIELD_REQUEST_REMOVE,
                                key   : field,
                                value : key,
                                status: FIELD_REQUEST_SUCCESS,
                            }
                        } else {
                            data = {
                                request: FIELD_REQUEST_REMOVE,
                                key   : field,
                                value : key,
                                status: FIELD_REQUEST_FAILURE,
                            }
                        }
                        manifold.raise_record_event(query_uuid, FIELD_STATE_CHANGED, data);
                    });


                    break;
                */
                case TYPE_LIST_OF_VALUES: // XXX Until fixed
                case TYPE_LIST_OF_RECORDS:
                    var key, new_state, cur_query_uuid;

                    cur_query_uuid = query.analyzed_query.subqueries[field].query_uuid;

                    // example: slice.resource
                    //  - update_query_orig.params.resource = resources in slice before update
                    //  - update_query.params.resource = resource requested in slice
                    //  - keys from field = resources obtained
                
                    if (field == 'lease') {
                         // lease_id has been added to be repeated when
                         // constructing request rspec. We don't want it for
                         // comparisons
                        key = ['start_time', 'end_time', 'resource'];
                    } else {
                        key = manifold.metadata.get_key(field);
                    }
                    if (!key)
                        continue;
                    /*
                    if (key.length > 1) {
                        throw "Not implemented";
                        continue;
                    }
                    key = key[0];
                    */

                    /* XXX should be modified for multiple keys */
                    var result_keys  = $.map(record[field], function(x) { return manifold.record_get_value(x, key); });

                    // XXX All this could be deduced from record state : STATE_IN_PENDING and STATE_OUT_PENDING
                    // what we had at the begining
                    var update_keys  = update_query_orig.params[field];
                    // what we asked
                    var query_keys   = update_query.params[field];
                    // what we added and removed
                    var added_keys   = $.grep(query_keys,  function (x) { return (!(manifold._in_array(x, update_keys, key))); });
                    var removed_keys = $.grep(update_keys, function (x) { return (!(manifold._in_array(x, query_keys,  key))); });

                    // Send events related to parent query
                    $.each(added_keys, function(i, added_key) {
                        new_state = (manifold._in_array(added_key, result_keys, key)) ? STATE_SET_IN_SUCCESS : STATE_SET_IN_FAILURE;

                        // Update record state for children queries
                        manifold.query_store.set_record_state(cur_query_uuid, added_key, STATE_SET, new_state);

                        // XXX This could be optimized
                        manifold.query_store.recount(cur_query_uuid); 

                        data = { state: STATE_SET, key  : field, op   : new_state, value: added_key }
                        manifold.raise_record_event(query_uuid, FIELD_STATE_CHANGED, data);

                        // Inform subquery also
                        data.key = '';
                        manifold.raise_record_event(cur_query_uuid, FIELD_STATE_CHANGED, data);
                        // XXX Passing no parameters so that they can redraw everything would
                        // be more efficient but is currently not supported
                        // XXX We could also need to inform plugins about nodes IN (not pending) that are no more, etc.
                        // XXX refactor all this when suppressing update_queries, and relying on state instead !
                    });
                    $.each(removed_keys, function(i, removed_key) {
                        new_state = (manifold._in_array(removed_key, result_keys, key)) ? STATE_SET_OUT_FAILURE : STATE_SET_OUT_SUCCESS;

                        // Update record state for children queries
                        manifold.query_store.set_record_state(cur_query_uuid, removed_key, STATE_SET, new_state);

                        // XXX This could be optimized
                        manifold.query_store.recount(cur_query_uuid); 

                        data = { state: STATE_SET, key  : field, op   : new_state, value: removed_key }
                        manifold.raise_record_event(query_uuid, FIELD_STATE_CHANGED, data);

                        // Inform subquery also
                        data.key = '';
                        manifold.raise_record_event(cur_query_uuid, FIELD_STATE_CHANGED, data);
                    });

                    break;
            }
        }
        
        // XXX Now we need to adapt 'update' and 'update_orig' queries as if we had done a get
        this.setup_update_query(query, records);

        var query_ext = manifold.query_store.find_query_ext(query.query_uuid);
        query_ext.query_state = QUERY_STATE_DONE;


        // Send DONE message to plugins
        query.iter_subqueries(function(sq, data, parent_query) {
            manifold.raise_record_event(sq.query_uuid, DONE);
        });

    },

    process_query_records: function(query, records) {
        if (query.action == 'get') {
            this.process_get_query_records(query, records);
        } else if (query.action == 'update') {
            this.process_update_query_records(query, records);
        }
    },

    // if set callback is provided it is called
    // most of the time publish_uuid will be query.query_uuid
    // however in some cases we wish to publish the result under a different uuid
    // e.g. an updater wants to publish its result as if from the original (get) query
    asynchroneous_success : function (data, query, publish_uuid, callback) {
        // xxx should have a nicer declaration of that enum in sync with the python code somehow
        
        var start = new Date();
        if (manifold.asynchroneous_debug)
            messages.debug(">>>>>>>>>> asynchroneous_success query.object=" + query.object);

        if (data.code == 2) { // ERROR
            // We need to make sense of error codes here
            alert("Your session has expired, please log in again");
            localStorage.removeItem('user');
            window.location="/logout/";
            if (manifold.asynchroneous_debug) {
                duration=new Date()-start;
                messages.debug ("<<<<<<<<<< asynchroneous_success " + query.object + " -- error returned - logging out " + duration + " ms");
            }
            return;
        }
        if (data.code == 1) { // WARNING
            messages.error("Some errors have been received from the manifold backend at " + MANIFOLD_URL + " [" + data.description + "]");
            // publish error code and text message on a separate channel for whoever is interested
            if (publish_uuid)
                $.publish("/results/" + publish_uuid + "/failed", [data.code, data.description] );

        }

        // If a callback has been specified, we redirect results to it 
        if (!!callback) { 
            callback(data); 
            if (manifold.asynchroneous_debug) {
                duration=new Date()-start;
                messages.debug ("<<<<<<<<<< asynchroneous_success " + query.object + " -- callback ended " + duration + " ms");
            }
            return; 
        }

        if (manifold.asynchroneous_debug) 
            messages.debug ("========== asynchroneous_success " + query.object + " -- before process_query_records [" + query.query_uuid +"]");

        // once everything is checked we can use the 'value' part of the manifoldresult
        var result=data.value;
        if (result) {
            /* Eventually update the content of related queries (update, etc) */
            manifold.make_records(query.object, result);
            this.process_query_records(query, result);

            /* Publish results: disabled here, done in the previous call */
            //tmp_query = manifold.find_query(query.query_uuid);
            //manifold.publish_result_rec(tmp_query.analyzed_query, result);
        }
        if (manifold.asynchroneous_debug) {
            duration=new Date()-start;
            messages.debug ("<<<<<<<<<< asynchroneous_success " + query.object + " -- done " + duration + " ms");
        }

    },

    /************************************************************************** 
     * Plugin API helpers
     **************************************************************************/ 

    raise_event_handler: function(type, query_uuid, event_type, value) {
	if (manifold.pubsub_debug)
	    messages.debug("raise_event_handler, quuid="+query_uuid+" type="+type+" event_type="+event_type);
        if ((type != 'query') && (type != 'record'))
            throw 'Incorrect type for manifold.raise_event()';
        // xxx we observe quite a lot of incoming calls with an undefined query_uuid
        // this should be fixed upstream in manifold I expect
        if (query_uuid === undefined) {
            messages.warning("undefined query in raise_event_handler");
            return;
        }

        // notify the change to objects that either listen to this channel specifically,
        // or to the wildcard channel
        var channels = [ manifold.get_channel(type, query_uuid), manifold.get_channel(type, '*') ];

        $.each(channels, function(i, channel) {
            if (value === undefined) {
		if (manifold.pubsub_debug) messages.debug("triggering [no value] on channel="+channel+" and event_type="+event_type);
                $('.pubsub').trigger(channel, [event_type]);
            } else {
		if (manifold.pubsub_debug) messages.debug("triggering [value="+value+"] on channel="+channel+" and event_type="+event_type);
                $('.pubsub').trigger(channel, [event_type, value]);
            }
        });
    },

    raise_query_event: function(query_uuid, event_type, value) {
        manifold.raise_event_handler('query', query_uuid, event_type, value);
    },

    raise_record_event: function(query_uuid, event_type, value) {
        manifold.raise_event_handler('record', query_uuid, event_type, value);
    },

    /**
     * Event handler helpers
     */
    _get_next_state_add: function(prev_state)
    {
        switch (prev_state) {
            case STATE_SET_OUT:
            case STATE_SET_OUT_SUCCESS:
            case STATE_SET_IN_FAILURE:
                new_state = STATE_SET_IN_PENDING;
                break;

            case STATE_SET_OUT_PENDING:
                new_state = STATE_SET_IN;
                break;

            case STATE_SET_IN:
            case STATE_SET_IN_PENDING:
            case STATE_SET_IN_SUCCESS:
            case STATE_SET_OUT_FAILURE:
                console.log("Inconsistent state: already in");
                return;
        }
        return new_state;
    },

    _get_next_state_remove: function(prev_state)
    {
        switch (prev_state) {
            case STATE_SET_IN:
            case STATE_SET_IN_SUCCESS:
            case STATE_SET_OUT_FAILURE:
                new_state = STATE_SET_OUT_PENDING;
                break;

            case STATE_SET_IN_PENDING:
                new_state = STATE_SET_OUT;
                break;  

            case STATE_SET_OUT:
            case STATE_SET_OUT_PENDING:
            case STATE_SET_OUT_SUCCESS:
            case STATE_SET_IN_FAILURE:
                console.log("Inconsistent state: already out");
                return;
        }
        return new_state;
    },

    _grep_active_lease_callback: function(lease_query, resource_key) {
        return function(lease_key_lease) {
            var state, lease_key, lease;

            lease_key = lease_key_lease[0];
            lease = lease_key_lease[1];

            if (lease['resource'] != resource_key)
                return false;

            state = manifold.query_store.get_record_state(lease_query.query_uuid, lease_key, STATE_SET);;
            switch(state) {
                case STATE_SET_IN:
                case STATE_SET_IN_PENDING:
                case STATE_SET_IN_SUCCESS:
                case STATE_SET_OUT_FAILURE:
                    return true;
                case STATE_SET_OUT:
                case STATE_SET_OUT_PENDING:
                case STATE_SET_OUT_SUCCESS:
                case STATE_SET_IN_FAILURE:
                    return false;
            }
        }
    },

    _enforce_constraints: function(query_ext, record, record_key, event_type)
    {
        var query, data;

        query = query_ext.query;

        switch(query.object) {

            case 'resource':
                // CONSTRAINT_RESERVABLE_LEASE
                // 
                // +) If a reservable node is added to the slice, then it should have a corresponding lease
                // XXX Not always a resource
                var is_reservable = (record.exclusive == true);
                if (is_reservable) {
                    var warnings = manifold.query_store.get_record_state(query.query_uuid, record_key, STATE_WARNINGS);

                    if (event_type == STATE_SET_ADD) {
                        // We should have a lease_query associated
                        var lease_query = query_ext.parent_query_ext.query.subqueries['lease']; // in  options
                        var lease_query_ext = manifold.query_store.find_analyzed_query_ext(lease_query.query_uuid);
                        // Do we have lease records (in) with this resource
                        var lease_records = $.grep(lease_query_ext.records.entries(), this._grep_active_lease_callback(lease_query, record_key));
                        if (lease_records.length == 0) {
                            // Sets a warning
                            // XXX Need for a better function to manage warnings
                            var warn = CONSTRAINT_RESERVABLE_LEASE_MSG;
                            warnings[CONSTRAINT_RESERVABLE_LEASE] = warn;
                        } else {
                            // Lease are defined, delete the warning in case it was set previously
                            delete warnings[CONSTRAINT_RESERVABLE_LEASE];
                        }
                    } else {
                        // Remove warnings attached to this resource
                        delete warnings[CONSTRAINT_RESERVABLE_LEASE];
                    }

                    manifold.query_store.set_record_state(query.query_uuid, record_key, STATE_WARNINGS, warnings);
                }

                /* This was redundant */
                // manifold.query_store.recount(query.query_uuid); 

                // Signal the change to plugins (even if the constraint does not apply, so that the plugin can display a checkmark)
                data = {
                    state:  STATE_WARNINGS,
                    key   : record_key,
                    op    : null,
                    value : warnings
                }
                manifold.raise_record_event(query.query_uuid, FIELD_STATE_CHANGED, data);
                break;

            case 'lease':
                var resource_key = record_key.resource;
                var resource_query = query_ext.parent_query_ext.query.subqueries['resource'];
                var warnings = manifold.query_store.get_record_state(resource_query.query_uuid, resource_key, STATE_WARNINGS);

                if (event_type == STATE_SET_ADD) {
                     // A lease is added, it removes the constraint
                    delete warnings[CONSTRAINT_RESERVABLE_LEASE];
                } else {
                    // A lease is removed, it might trigger the warning
                    var lease_records = $.grep(query_ext.records.entries(), this._grep_active_lease_callback(query, resource_key));
                    if (lease_records.length == 0) { // XXX redundant cases
                        // Sets a warning
                        // XXX Need for a better function to manage warnings
                        var warn = CONSTRAINT_RESERVABLE_LEASE_MSG;
                        warnings[CONSTRAINT_RESERVABLE_LEASE] = warn;
                    } else {
                        // Lease are defined, delete the warning in case it was set previously
                        delete warnings[CONSTRAINT_RESERVABLE_LEASE];
                    }
                    
                }

                manifold.query_store.recount(resource_query.query_uuid); 

                // Signal the change to plugins (even if the constraint does not apply, so that the plugin can display a checkmark)
                data = {
                    state:  STATE_WARNINGS,
                    key   : resource_key,
                    op    : null,
                    value : warnings
                }
                manifold.raise_record_event(resource_query.query_uuid, FIELD_STATE_CHANGED, data);
                break;
        }

        // -) When a lease is added, it might remove the warning associated to a reservable node

        // If a NITOS node is reserved, then at least a NITOS channel should be reserved
        // - When a NITOS channel is added, it might remove a warning associated to all NITOS nodes

        // If a NITOS channel is reserved, then at least a NITOS node should be reserved
        // - When a NITOS node is added, it might remove a warning associated to all NITOS channels

        // A lease is present while the resource has been removed => Require warnings on nodes not in set !

    },

    _get_query_path: function(query_ext) {
        var path = "";
        var sq = query_ext;
        while (sq.parent_query_ext) {
            if (path != "")
                path = '.' + path;
            path = sq.query.object + path;
            sq = sq.parent_query_ext;
        }
        return path;
    },


    /**
     * Handling events raised by plugins
     */
    raise_event: function(query_uuid, event_type, data) 
    {
        var query, query_ext;

        // Query uuid has been updated with the key of a new element
        query_ext    = manifold.query_store.find_analyzed_query_ext(query_uuid);
        query = query_ext.query;

        switch(event_type) {

            // XXX At some point, should be renamed to RECORD_STATE_CHANGED
            case FIELD_STATE_CHANGED:

                // value is an object (request, key, value, status)
                // update is only possible is the query is not pending, etc
                // SET_ADD is on a subquery, FIELD_STATE_CHANGED on the query itself
                // we should map SET_ADD on this...

                // 1. Update internal query store about the change in status

                // 2. Update the update query
                update_query      = query_ext.main_query_ext.update_query_ext.query;
                update_query_orig = query_ext.main_query_ext.update_query_orig_ext.query;

                switch(data.state) {
            
                    case STATE_VALUE:
                        switch(data.op) {
                            case STATE_CHANGE:
                                /* Set parameter data.key in the update_query to VALUE */
                                if (update_query.params[data.key] === undefined)
                                    update_query.params[data.key] = Array();
                                update_query.params[data.key] = value.value;
                                break;

                        }
                        break;

                    case STATE_SET:
                        var prev_state, new_state;
                        var main_query, record, new_data, path;
        
                        // We only track state in the analyzed query
                        prev_state = manifold.query_store.get_record_state(query_uuid, data.value, STATE_SET);
                        if (prev_state === null)
                            prev_state = STATE_SET_OUT;

                        switch(data.op) {
                            case STATE_SET_ADD:
                                new_state = this._get_next_state_add(prev_state);

                                /* data.value containts the resource key */
                                manifold.query_store.add_record(query_uuid, data.value, new_state);
                                record = manifold.query_store.get_record(query_uuid, data.value);
                                this._enforce_constraints(query_ext, record, data.value, STATE_SET_ADD);
                
                                /* Process update query in parent */
                                path =  this._get_query_path(query_ext);
                                if (update_query.params[path] === undefined)
                                    update_query.params[path] = Array();
                                update_query.params[path].push(data.value);

                                break;

                            case STATE_SET_REMOVE:
                                new_state = this._get_next_state_remove(prev_state);

                                /* data.value contains the resource key */
                                manifold.query_store.remove_record(query_uuid, data.value, new_state);
                                record = manifold.query_store.get_record(query_uuid, data.value);
                                this._enforce_constraints(query_ext, record, data.value, STATE_SET_REMOVE);
                    
                                /* Process update query in parent */
                                path =  this._get_query_path(query_ext);
                                arr = update_query.params[path];
                                
                                var key = manifold.metadata.get_key(query.object);
                                arr = $.grep(arr, function(x) { return (!(manifold._record_equals(x, data.value, key))); });
                                if (update_query.params[path] === undefined)
                                    update_query.params[path] = Array();
                                update_query.params[path] = arr;
                                break;
                        }

                        /* Inform the parent query: important for update */
                        new_data = {
                            state : STATE_SET,
                            key   : path,
                            op    : new_state,
                            value : data.value,
                        };
                        main_query = query_ext.main_query_ext.query;
                        manifold.raise_record_event(main_query.query_uuid, event_type, new_data);
                        /* Propagate the event to other plugins subscribed to the query */
                        manifold.query_store.recount(query_uuid);
                        new_data.key = ''
                        manifold.raise_record_event(query_uuid, event_type, new_data);

                        break;
                }
/*
                // 3. Inform others about the change
                // a) the main query...
                manifold.raise_record_event(query_uuid, event_type, data);

                // b) subqueries eventually (dot in the key)
                // Let's unfold 

                var cur_query = query;
                if (cur_query.analyzed_query)
                    cur_query = cur_query.analyzed_query;

                if (data.key) {
                    var path_array = data.key.split('.');
                    var value_key = data.key.split('.');
                    $.each(path_array, function(i, method) {
                        cur_query = cur_query.subqueries[method];
                        value_key.shift(); // XXX check that method is indeed shifted
                    });
                    data.key = value_key;
                }
                manifold.raise_record_event(cur_query.query_uuid, event_type, data);
*/

                break;

            case RUN_UPDATE:
                manifold.run_query(query_ext.main_query_ext.update_query_ext.query);
                break;

            /* QUERY STATE CHANGED */
            
            // FILTERS

            case FILTER_ADDED: 
                console.log("FILTER ADDED", data);
                /* Update internal record state */
                manifold.query_store.add_filter(query_uuid, data);

                /* Propagate the message to plugins */
                manifold.raise_query_event(query_uuid, event_type, data);

                break;

            case FILTER_REMOVED:
                console.log("FILTER REMOVED", data);
                /* Update internal record state */
                manifold.query_store.remove_filter(query_uuid, data);

                /* Propagate the message to plugins */
                manifold.raise_query_event(query_uuid, event_type, data);

                break;

            case FIELD_ADDED:
                main_query = query_ext.main_query_ext.query;
                main_update_query = query_ext.main_query_ext.update_query;
                query.select(data);

                // Here we need the full path through all subqueries
                path = ""
                // XXX We might need the query name in the QueryExt structure
                main_query.select(data);

                // XXX When is an update query associated ?
                // XXX main_update_query.select(value);

                manifold.raise_query_event(query_uuid, event_type, data);
                break;

            case FIELD_REMOVED:
                query = query_ext.query;
                main_query = query_ext.main_query_ext.query;
                main_update_query = query_ext.main_query_ext.update_query;
                query.unselect(data);
                main_query.unselect(data);

                // We need to inform about changes in these queries to the respective plugins
                // Note: query & main_query have the same UUID
                manifold.raise_query_event(query_uuid, event_type, data);
                break;
        }
        // We need to inform about changes in these queries to the respective plugins
        // Note: query, main_query & update_query have the same UUID

        // http://trac.myslice.info/ticket/32
        // Avoid multiple calls to the same event
        //manifold.raise_query_event(query_uuid, event_type, value);

        // We are targeting the same object with get and update
        // The notion of query is bad, we should have a notion of destination, and issue queries on the destination
        // NOTE: Editing a subquery == editing a local view on the destination

        // XXX We might need to run the new query again and manage the plugins in the meantime with spinners...
        // For the time being, we will collect all columns during the first query
    },

    /* Publish/subscribe channels for internal use */
    get_channel: function(type, query_uuid) {
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
