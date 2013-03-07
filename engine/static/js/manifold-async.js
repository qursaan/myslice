// Helper functions for asynchronous requests

var api_url = '/manifold/api/json/'
var api_render_url = '/manifold/render/json'

function manifold_array_size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// Executes all async. queries contained in manifold_async_query_array, which is
// an array of hash (action, method, ts, filter, fields)
//
function manifold_async_exec(arr)
{

    // start spinners
    //onObjectAvailable('Spinners', function(){ Spinners.create('.loading').play(); }, this, true);
    jQuery('.loading').spin();

    // We use js function closure to be able to pass the query (array) to the
    // callback function used when data is received
    var manifold_async_success_wrapper = function(query, id) {
        return function(data, textStatus) {
            manifold_async_success(data, query, id);
        };
    };

    // Loop through query array and issue XML/RPC queries
    jQuery.each(arr, function(index, elt) {
        // we do rendering by default
        jQuery.post(api_url, {'query': elt.query.to_hash()}, manifold_async_success_wrapper(elt.query, elt.id));
    })
}

function manifold_async_exec_render(arr)
{

    // start spinners
    //onObjectAvailable('Spinners', function(){ Spinners.create('.loading').play(); }, this, true);
    jQuery('.loading').spin();

    // We use js function closure to be able to pass the query (array) to the
    // callback function used when data is received
    var manifold_async_success_wrapper = function(query, id) {
        return function(data, textStatus) {
            manifold_async_success(data, query, id);
        };
    };

    // Loop through query array and issue XML/RPC queries
    jQuery.each(arr, function(index, elt) {
        // we do rendering by default
        jQuery.post(api_render_url, {'query': elt.query.to_hash()}, manifold_async_success_wrapper(elt.query, elt.id));
    })
}

function manifold_async_render(data, query)
{
    // We use js function closure to be able to pass the query (array) to the
    // callback function used when data is received
    var manifold_async_render_success_wrapper = function(query) {
        return function(data, textStatus) {
            manifold_async_render_success(data, query);
        };
    };

    jQuery.post(api_render_url, {'data': data, 'query': query.to_hash()}, manifold_async_render_success_wrapper(data, query));
}

function manifold_async_error(str) {
    var out = '<div class="error"><h2>Error</h2><dl id="system-message"><dt class="error">Notice</dt><dd class="error message"><ul><li>' + jQuery('<div />').text(str).html() + '</li></ul></dd></dl></div>';
    jQuery('#manifold_message').html(out);
    //onObjectAvailable('Spinners', function(){ Spinners.get('.loading').remove(); }, this, true);
    jQuery('.loading').spin();
}

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

function manifold_async_render_list(data, method, is_cached) {
    // we suppose we only have one column, or we need more precisions
    var col = [];
    if (manifold_array_size(data[0]) == 1) {
        for (var k in data[0]) {
            key = k;
            value = k;
        }
    } else {
        for (var k in data[0]) {
            if (k.substr(-4) == '_hrn') {
                key = k;
            } else {
                value = k;
            }
        }
    }
    var out = manifold_html_ul(data, key, value, key, method, is_cached);
    var element = '#manifold__list__' + key + '__' + value;
    jQuery(element).html(out);
    // FIXME spinners
    //onObjectAvailable('Spinners', function(){ Spinners.get(element).remove(); }, this, true);
    jQuery('.loading').spin();
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

function __old__manifold_async_render_success(data, query) {
    if (data) {

        // We loop through all the fields to update the corresponding
        // locations in the page
        if (typeof(data[0].error) != 'undefined') {
            manifold_async_error(data[0].error);
        }

        /* Publish an update announce */
        jQuery.publish("/rendering/changed", [data, query]);

        // Is there a linked query ?
        if ((query.done == 'now') && (query.ts == 'latest')) {
            var new_query = [query_json.replace("latest", "now")];
            manifold_async_exec(new_query);
        }
    }
}
