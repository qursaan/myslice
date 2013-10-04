/**
 * Description: display a query result in a Google map
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/* BUGS:
 * - infowindow is not properly reopened when the maps does not have the focus
 */

// events that happen in the once-per-view range
googlemap_debug=false;
// more on a on-per-record basis
googlemap_debug_detailed=false;

(function($){

    var GoogleMap = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);

            /* Member variables */
            // query status
            this.received_all = false;
            this.received_set = false;
            this.in_set_backlog = [];

            // we keep a couple of global hashes
	    // lat_lon --> { marker, <ul> }
	    // hrn --> { <li>, <input> }
	    this.by_lat_lon = {};
	    this.by_hrn = {};

            /* XXX Events */
            this.elmt().on('show', this, this.on_show);
            // TODO in destructor
            // $(window).unbind('Hazelnut');

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.object = query.object;

            var keys = manifold.metadata.get_key(this.object);
	    // 
            this.key = (keys && keys.length == 1) ? keys[0] : null;

            //// Setup query and record handlers 
	    // this query is the one about the slice itself 
	    // event related to this query will trigger callbacks like on_new_record
            this.listen_query(options.query_uuid);
	    // this one is the complete list of resources
	    // and will be bound to callbacks like on_all_new_record
            this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_map();
        }, // init

        /* PLUGIN EVENTS */

        on_show: function(e) {
	    if (googlemap_debug) messages.debug("googlemap.on_show");
            var googlemap = e.data;
            google.maps.event.trigger(googlemap.map, 'resize');
        }, // on_show

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_map: function() {
            this.markerCluster = null;

            var center = new google.maps.LatLng(this.options.latitude, this.options.longitude);
            var myOptions = {
                zoom: this.options.zoom,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            }
	    
            var domid = this.options.plugin_uuid + '--' + 'googlemap';
	    var elmt = document.getElementById(domid);
	    if (googlemap_debug) messages.debug("gmap.initialize_map based on  domid=" + domid + " elmt=" + elmt);
            this.map = new google.maps.Map(elmt, myOptions);
            this.infowindow = new google.maps.InfoWindow();
        }, // initialize_map

	// xxx probably not the right place
        // The function accepts both records and their key 
	record_hrn : function (record) {
            var key_value;
            switch (manifold.get_type(record)) {
            case TYPE_VALUE:
		key_value = record;
                break;
            case TYPE_RECORD:
		if ( ! this.key in record ) return;
                key_value = record[this.key];
                break;
            default:
                throw "Not implemented";
                break;
            }
	    // XXX BACKSLASHES original code was reading like this
	    //return this.escape_id(key_value).replace(/\\/g, '');
	    //  however this sequence removes backslashes from hrn's and as a result
	    // resources_selected was getting all mixed up
	    // hazelnut does publish hrn's with backslashes and that seems like the thing to do
	    return key_value;
	},	    

	// return { marker: gmap_marker, ul : <ul DOM> }
	create_marker_struct: function (object,lat,lon) {
	    // the DOM fragment
	    var dom = $("<p>").addClass("geo").append(object+"(s)");
	    var ul = $("<ul>").addClass("geo");
	    dom.append(ul);
	    // add a gmap marker to the mix
	    var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lon),
                title: object,
		// gmap can deal with a DOM element but not a jquery object
                content: dom.get(0),
            }); 
	    return {marker:marker, ul:ul};
	},

	// add an entry in the marker <ul> tag for that record
	// returns { checkbox : <input DOM> }
	create_record_checkbox: function (record,ul,checked) {
	    var checkbox = $("<input>", {type:'checkbox', checked:checked, class:'geo'});
	    var hrn=this.record_hrn(record);
	    ul.append($("<li>").addClass("geo").append(checkbox).
		      append($("<span>").addClass("geo").append(hrn)));
	    var googlemap=this;
	    // the callback for when a user clicks
	    // NOTE: this will *not* be called for changes done by program
	    checkbox.change( function (e) {
		if (googlemap_debug) messages.debug("googlemap click handler checked= " + this.checked + " hrn=" + hrn);
		manifold.raise_event (googlemap.options.query_uuid, 
				      this.checked ? SET_ADD : SET_REMOVED, hrn);
	    });
	    return checkbox;
	},
	    
	// retrieve DOM checkbox and make sure it is checked/unchecked
        set_checkbox: function(record, checked) {
	    var hrn=this.record_hrn (record);
	    if (! hrn) { messages.warning ("googlemap.set_checkbox: record has no hrn"); return; }
	    var checkbox_s = this.by_hrn [ hrn ];
	    if (! checkbox_s ) { messages.warning ("googlemap.set_checkbox: could not spot checkbox for hrn "+hrn); return; }
	    checkbox_s.checkbox.prop('checked',checked);
        }, // set_checkbox

	// this record is *in* the slice
        new_record: function(record) {
	    if (googlemap_debug_detailed) messages.debug ("new_record");
            if (!(record['latitude'])) return false;
	    
            // get the coordinates
            var latitude=get_value(record['latitude']);
            var longitude=get_value(record['longitude']);
            var lat_lon = latitude + longitude;

	    // check if we've seen anything at that place already
	    // xxx might make sense to allow for some fuzziness, 
	    // i.e. consider 2 places equal if not further away than 300m or so...
	    var marker_s = this.by_lat_lon [lat_lon];
	    if ( marker_s == null ) {
		marker_s = this.create_marker_struct (this.object, latitude, longitude);
		this.by_lat_lon [ lat_lon ] = marker_s;
		this.arm_marker(marker_s.marker, this.map);
	    }
	    
	    // now add a line for this resource in the marker
	    // xxx should compute checked here ?
	    // this is where the checkbox will be appended
	    var ul=marker_s.ul;
	    var checkbox = this.create_record_checkbox (record, ul, false);
	    if ( ! this.key in record ) return;
            var key_value = record[this.key];
	    // see XXX BACKSLASHES 
	    //var hrn = this.escape_id(key_value).replace(/\\/g, '');
	    var hrn = key_value;
            this.by_hrn[hrn] = {
		checkbox: checkbox,
		// xxx Thierry sept 2013
		// xxx actually we might have just used a domid-based scheme instead of the hash
		// since at this point we only need to retrieve the checkbox from an hrn
		// but I was not sure enough that extra needs would not show up so I kept this in place
		// xxx not sure these are actually useful :
                value: key_value,
                record: record,
            }
        }, // new_record

        arm_marker: function(marker, map) {
	    if (googlemap_debug_detailed) messages.debug ("arm_marker content="+marker.content);
            var googlemap = this;
            google.maps.event.addListener(marker, 'click', function () {
                googlemap.infowindow.close();
                googlemap.infowindow.setContent(marker.content);
                googlemap.infowindow.open(map, marker);
            });
        }, // arm_marker

        /*************************** QUERY HANDLER ****************************/

        /*************************** RECORD HANDLER ***************************/
        on_new_record: function(record) {
	    if (googlemap_debug_detailed) messages.debug("on_new_record");
            if (this.received_all)
                // update checkbox for record
                this.set_checkbox(record, true);
            else
                // store for later update of checkboxes
                this.in_set_backlog.push(record);
        },

        on_clear_records: function(record) {
	    if (googlemap_debug_detailed) messages.debug("on_clear_records");
        },

        // Could be the default in parent
        on_query_in_progress: function() {
	    if (googlemap_debug) messages.debug("on_query_in_progress (spinning)");
            this.spin();
        },

        on_query_done: function() {
	    if (googlemap_debug) messages.debug("on_query_done");	    
            if (this.received_all) {
                this.unspin();
	    }
            this.received_set = true;
        },

        on_field_state_changed: function(data) {
	    if (googlemap_debug_detailed) messages.debug("on_field_state_changed");	    
            switch(data.request) {
            case FIELD_REQUEST_ADD:
            case FIELD_REQUEST_ADD_RESET:
                this.set_checkbox(data.value, true);
                break;
            case FIELD_REQUEST_REMOVE:
            case FIELD_REQUEST_REMOVE_RESET:
                this.set_checkbox(data.value, false);
                break;
            default:
                break;
            }
        },


        // all : this 

        on_all_new_record: function(record) {
	    if (googlemap_debug_detailed) messages.debug("on_all_new_record");
            this.new_record(record);
        },

        on_all_clear_records: function() {
	    if (googlemap_debug) messages.debug("on_all_clear_records");	    
        },

        on_all_query_in_progress: function() {
	    if (googlemap_debug) messages.debug("on_all_query_in_progress (spinning)");
            // XXX parent
            this.spin();
        },

        on_all_query_done: function() {
	    if (googlemap_debug) messages.debug("on_all_query_done");

            // MarkerClusterer
            var markers = [];
            $.each(this.by_lat_lon, function (k, s) { markers.push(s.marker); });
            this.markerCluster = new MarkerClusterer(this.map, markers, {zoomOnClick: false});
            google.maps.event.addListener(this.markerCluster, "clusterclick", function (cluster) {
                var cluster_markers = cluster.getMarkers();
                var bounds  = new google.maps.LatLngBounds();
                $.each(cluster_markers, function(i, marker){
                    bounds.extend(marker.getPosition()); 
                });
                //map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds));
                this.map.fitBounds(bounds);
            });

            var googlemap = this;
            if (this.received_set) {
                /* ... and check the ones specified in the resource list */
                $.each(this.in_set_backlog, function(i, record) {
                    googlemap.set_checkbox(record, true);
                });
		// reset 
		googlemap.in_set_backlog = [];

		if (googlemap_debug) messages.debug("unspinning");
                this.unspin();
            }
            this.received_all = true;

        } // on_all_query_done
    });
        /************************** PRIVATE METHODS ***************************/

    $.plugin('GoogleMap', GoogleMap);

})(jQuery);
