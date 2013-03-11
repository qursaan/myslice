manifold_async_debug=true;

// Helper functions for asynchronous requests

var api_url = '/manifold/api/json/'

// Executes all async. queries
// input queries are specified as a list of {'query': new Query(..), 'id': <possibly null>}
function manifold_async_exec(queries) {
    if (manifold_async_debug) console.log('manifold_async_exec length='+ queries.length);
    // start spinners
    jQuery('.need-spin').spin();

    // We use js function closure to be able to pass the query (array) to the
    // callback function used when data is received
    var manifold_async_success_closure = function(query, id) {
        return function(data, textStatus) {manifold_async_success(data, query, id);}
    };

    // Loop through query array and use ajax to send back queries (to frontend) with json
    jQuery.each(queries, function(index, tuple) {
	hash=tuple.query.to_hash();
	if (manifold_async_debug) console.log ("sending POST on " + api_url + " iterating on " + tuple + " -> " + hash);
        jQuery.post(api_url, {'query': hash}, manifold_async_success_closure(tuple.query, tuple.id));
    })
}

/* not used
function manifold_async_error(str) {
    var out = '<div class="error"><h2>Error</h2><dl id="system-message"><dt class="error">Notice</dt><dd class="error message"><ul><li>' + jQuery('<div />').text(str).html() + '</li></ul></dd></dl></div>';
    jQuery('#manifold_message').html(out);
    //onObjectAvailable('Spinners', function(){ Spinners.get('.loading').remove(); }, this, true);
    jQuery('.need-spin').spin(false);
}
*/

/* what the hell is this doing here ?
function apply_format(key, value, type, method) {
    // type = type, key = 
    var link = {
        'platform': {'_all': 'platforms'},
        'src_hostname': {'traceroute': 'agents', '_other': 'hostname'},
        'dst_hostname': {'traceroute': 'agents', '_other': 'hostname'},
        'src_ip': {'traceroute': 'agents', '_other': 'ip'},
        'dst_ip': {'traceroute': 'agents', '_other': 'ip'},
        'as_name': {'_all': 'as'},
        'asn': {'_all': 'as'},
        'city': {'_all': 'cities'},
        'continent': {'_all': 'continents'},
        'continent_code': {'_all': 'continents'},
        'country': {'_all': 'countries'},
        'country_code': {'_all': 'countries'},
        'hostname': {'agents': 'agents', 'nodes': 'node', '_other': 'hostname'},
        'ip': {'agents': 'agents', '_other': 'ip'},
        'network_hrn': {'_all': 'network'},
        'region': {'_all': 'regions'},
        'region_code': {'_all': 'regions'},
        'slice_hrn': {'_all': 'slice'},
    };
    if (link[type]) {
        // creates problems sorting ?
        if (link[type]['_all']) {
            var urlpart = link[type]['_all'];
        } else {
            if (link[type][method]) {
                var urlpart = link[type][method];
            } else {
                if (link[type]['_other']) {
                    var urlpart = link[type]['_other'];
                } else {
                    return key;
                }
            }
        }
        return '<a href="/view/' + urlpart + '/' + key +'">' + value + '</a>';
    } else {
        return key;
    }
}
*/

function manifold_html_a(key, value, type) {
    if (type == 'network_hrn') {
        return "<a href='/view/network/" + key + "'>" + value + '</a>';
    } else if (type == 'slice_hrn') {
        return "<a href='/view/slice/" + key + "'>" + value + '</a>';
    } else {

    }
}

function manifold_html_li(type, value, is_cached) {
    var cached = '';
    if (is_cached)
        cached='<div class="cache"><span><b>Cached information from the database</b><br/>Timestamp: XX/XX/XX XX:XX:XX<br/><br/><i>Refresh in progress...</i></span></div>';
    if (type == 'slice_hrn') {
        return "<li class='icn icn-play'>" + value + cached + "</li>";
    } else if (type == 'network_hrn') {
        return "<li class='icn icn-play'>" + value + cached + "</li>";
    } else {
        return "<li>" + value + "</li>";
    }
}


function manifold_html_ul(data, key, value, type, method, is_cached) {
    var out = "<ul>";
    for (var i = 0; i < data.length; i++) {
        out += manifold_html_li(key, apply_format(data[i][key], data[i][value], key, method), is_cached);
        //out += manifold_html_li(key, manifold_html_a(data[i][key], data[i][value], key), is_cached);
    }
    out += "</ul>";

    return out;
}

function manifold_update_template(data) 
{
    jQuery.each(data, function(key, value) {
        if ((typeof value == 'string') || (typeof value == 'number') || (typeof value == 'boolean')) {
            // Simple field
            jQuery('#manifold__' + key).html(value);
        } else if (value == null) {
            jQuery('#manifold__' + key).html("N/A");
        } else { 
            manifold_update_table('#manifold__' + key, value);
        }
    });
}

function manifold_async_success(data, query, id) {
    if (data) {

        if (!!id) {
            /* Directly inform the requestor */
            jQuery('#' + id).trigger('results', [data]);
        } else {
            /* Publish an update announce */
            jQuery.publish("/results/" + query.uuid + "/changed", [data, query]);
        }

        // Is there a linked query ?
        //if ((query.done == 'now') && (query.ts == 'latest')) {
        //    var new_query = [query_json.replace("latest", "now")];
        //    manifold_async_exec(new_query);
        //}
    }
}

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
