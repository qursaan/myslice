function debug_dict (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    console.log ("debug_dict: " + msg + " Keys : " + keys);
}
function debug_value (msg, value) {
    console.log ("debug_value: " + msg + " " + value);
}

/* manage a set of queries indexed by their id */
/* next move will be to insert all the manifold functions in this namespace */
/* xxx add error management */
var manifold = {
    all_queries: {},
    insert_query : function (query) { 
	manifold.all_queries[query.query_uuid]=query; 
   },
    find_query : function (query_uuid) { 
	return manifold.all_queries[query_uuid];
    },
    debug_all_queries : function (msg) {
	for (var query_uuid in manifold.all_queries) {
	    console.log("manifold.debug " + msg + " " + query_uuid + " -> " + manifold.all_queries[query_uuid]);
	}
    },
}

