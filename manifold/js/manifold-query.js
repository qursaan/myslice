function ManifoldQuery(action, method, timestamp, filters, params, fields, unique, uuid, aq, sq)
{  
    // get, update, delete, create
    var action;
    
    // slice, user, network... : Metadata
    var method; 
    
    // timestamp, now, latest(cache) : date of the results queried    
    var timestamp;
    
    // key(field),op(=<>),value
    var filters;

    // todo
    var params;
    
    // hostname, ip,... : Metadata
    var fields;
    
    // 0,1 : list of element of an object or single object  
    var unique;
    
    // uuid : unique identifier of a query
    var uuid;
    
    // Query : root query (no sub-Query)
    var analyzed_query;
    
    // {} : Assoc Table of sub-queries ["resources"->subQ1, "users"->subQ2]
    var subqueries;

/*-------------------------------------------------------------
              Query properties are SQL like : 
---------------------------------------------------------------
SELECT fields FROM method WHERE filter;
UPDATE method SET field=value WHERE filter; / returns SELECT 
DELETE FROM method WHERE filter
INSERT INTO method VALUES(field=value)
-------------------------------------------------------------*/
    
    this.clone = function() {
        q = new ManifoldQuery();
        return jQuery.extend(true, q, this);
    }
    this.add_filter = function(key, op, value) {
        this.filters.push(new Array(key, op, value));
    }
    this.update_filter = function(key, op, value) {
        // Need to be improved...
        // remove all occurrences of key if operation is not defined
        if(!op){
            this.filters = jQuery.grep(this.filters, function(val, i) {
                return val[0] != key; 
            });
        // Else remove the key+op filters
        }else{
            this.filters = jQuery.grep(this.filters, function(val, i) {return (val[0] != key || val[1] != op);});
        }
        this.filters.push(new Array(key, op, value));
    }
    this.remove_filter = function (key,op,value){
        // if operator is null then remove all occurences of this key
        if(!op){
            this.filters = jQuery.grep(this.filters, function(val, i) { 
                return val[0] != key; 
            });
        }else{
            this.filters = jQuery.grep(this.filters, function(val, i) {return (val[0] != key || val[1] != op);});
        }
    }
    // FIXME These functions computing diff's between queries are meant to be shared
    this.diff_fields = function (otherQuery)
    {
        var f1 = this.fields;
        var f2 = otherQuery.fields;

        /* added elements are the ones in f2 not in f1 */
        var added   = jQuery.grep(f2, function (x) { return jQuery.inArray(x, f1) == -1 }); 
        /* removed elements are the ones in f1 not in f2 */
        var removed = jQuery.grep(f1, function (x) { return jQuery.inArray(x, f2) == -1 }); 
        
        return {'added':added, 'removed':removed};
    }    
    // FIXME Modify filter to filters
    this.diff_filter = function (otherQuery)
    {
        var f1 = this.filters;
        var f2 = otherQuery.filters;
        
        /* added elements are the ones in f2 not in f1 */
        var added   = jQuery.grep(f2, function (x) { return !arrayInArray(x, f1)}); 
        /* removed elements are the ones in f1 not in f2 */
        var removed = jQuery.grep(f1, function (x) { return !arrayInArray(x, f2)}); 
        
        return {'added':added, 'removed':removed};
    } 
    this.to_hash = function() {
        return {'action': this.action, 'method': this.method, 'timestamp': this.timestamp,
		'filters': this.filters, 'params': this.params, 'fields': this.fields};
    }
    this.analyze_subqueries = function() {
        /* adapted from the PHP function in com_tophat/includes/query.php */
        var q = new ManifoldQuery();
        q.uuid = this.uuid;
        q.action = this.action;
        q.method = this.method;
        q.timestamp = this.timestamp;

        /* Filters */
        jQuery.each(this.filters, function(i, filter) {
            var k = filter[0];
            var op = filter[1];
            var v = filter[2];
            var pos = k.indexOf('.');
            if (pos != -1) {
                var method = k.substr(0, pos);
                var field = k.substr(pos+1);
                if (jQuery.inArray(this.method, q.subqueries) == -1) {
                    q.subqueries[this.method] = new ManifoldQuery();
                    q.subqueries[this.method].action = this.action;
                    q.subqueries[this.method].method = this.method;
                    q.subqueries[this.method].timestamp = this.timestamp;
                }
                q.subqueries[this.method].filters.push(Array(field, op, v));
            } else {
                q.filters.push(this.filter);
            }
        });

        /* Params */
        jQuery.each(this.params, function(param, value) {
            var pos = param.indexOf('.');
            if (pos != -1) {
                var method = param.substr(0, pos);
                var field = param.substr(pos+1);
                if (jQuery.inArray(this.method, q.subqueries) == -1) {
                    q.subqueries[this.method] = new ManifoldQuery();
                    q.subqueries[this.method].action = this.action;
                    q.subqueries[this.method].method = this.method;
                    q.subqueries[this.method].timestamp = this.timestamp;
                }
                q.subqueries[this.method].params[field] = value;
            } else {
                q.params[field] = value;
            }
        });

        /* Fields */
        jQuery.each(this.fields, function(i, v) {
            var pos = v.indexOf('.');
            if (pos != -1) {
                var method = v.substr(0, pos);
                var field = v.substr(pos+1);
                if (jQuery.inArray(this.method, q.subqueries) == -1) {
                    q.subqueries[this.method] = new ManifoldQuery();
                    q.subqueries[this.method].action = this.action;
                    q.subqueries[this.method].method = this.method;
                    q.subqueries[this.method].timestamp = this.timestamp;
                }
                q.subqueries[this.method].fields.push(field);
            } else {
                q.fields.push(v);
            }
        });
        this.analyzed_query = q;
    }
 
    /* constructor */
    this.action = action;
    this.method = method;
    this.timestamp = timestamp;
    this.filters = filters;
    this.params = params;
    this.fields = fields;
    this.unique = unique;
    this.uuid = uuid;
    this.analyzed_query = aq;
    this.subqueries = sq;
}  
