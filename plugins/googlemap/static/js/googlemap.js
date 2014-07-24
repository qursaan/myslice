/**
 * Description: display a query result in a Google map
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/* BUGS:
 * - infowindow is not properly reopened when the maps does not have the focus
 */

GOOGLEMAP_BGCOLOR_RESET   = 0;
GOOGLEMAP_BGCOLOR_ADDED   = 1;
GOOGLEMAP_BGCOLOR_REMOVED = 2;

(function($){

    // events that happen in the once-per-view range
    var debug=false;
    debug=true;

    // this now should be obsolete, rather use plugin_debug in plugin.js
    // more on a on-per-record basis
    var debug_deep=false;
    // debug_deep=true;

    var GoogleMap = Plugin.extend({

        /**************************************************************************
         *                          CONSTRUCTOR
         **************************************************************************/

        init: function(options, element) 
        {
            this._super(options, element);

            /* Member variables */

            /* we keep a couple of global hashes
             * lat_lon --> { marker, <ul> }
             * id --> { <li>, <input> }
             */
            this.by_lat_lon = {};
            /* locating checkboxes by DOM selectors might be abstruse, as we cannot safely assume 
             * all the items will belong under the toplevel <div>
             */
            this.by_id = {};
            this.by_init_id = {};

            this.markers = Array();

            /* Events */
            this.elmt().on('show', this, this.on_show);
            this.elmt().on('shown.bs.tab', this, this.on_show);
            this.elmt().on('resize', this, this.on_resize);

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.object = query.object;

            /* see querytable.js for an explanation */
            var keys = manifold.metadata.get_key(this.object);
            this.canonical_key = (keys && keys.length == 1) ? keys[0] : undefined;
            this.init_key = this.options.init_key;
            this.init_key = this.init_key || this.canonical_key;

            /* sanity check */
            if ( ! this.init_key ) 
                messages.warning ("QueryTable : cannot find init_key");
            if ( ! this.canonical_key )
                messages.warning ("QueryTable : cannot find canonical_key");
            if (debug)
                messages.debug("googlemap: canonical_key="+this.canonical_key+" init_key="+this.init_key);

            this.listen_query(options.query_uuid);

            /* GUI setup and event binding */
            this.initialize_map();

        }, // init

        /**************************************************************************
         *                         PLUGIN EVENTS
         **************************************************************************/

        on_show: function(e) {
	        if (debug) messages.debug("googlemap.on_show");
            var googlemap = e.data;
            google.maps.event.trigger(googlemap.map, 'resize');
        }, 

        /**************************************************************************
         *                        GUI MANIPULATION
         **************************************************************************/

        initialize_map: function() 
        {
            this.markerCluster = null;
            //create empty LatLngBounds object in order to automatically center the map on the displayed objects
            this.bounds = new google.maps.LatLngBounds();
            var center = new google.maps.LatLng(this.options.latitude, this.options.longitude);

            var myOptions = {
                zoom: this.options.zoom,
                center: center,
		        scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            }
	    
            var domid = this.id('googlemap');
	        var elmt = document.getElementById(domid);
            this.map = new google.maps.Map(elmt, myOptions);
            this.infowindow = new google.maps.InfoWindow();

        }, // initialize_map

        // return { marker: gmap_marker, ul : <ul DOM> }
        create_marker_struct: function(object, lat, lon) 
        {
            /* the DOM fragment */
            var dom = $("<p>").addClass("geo").append(object+"(s)");
            var ul = $("<ul>").addClass("geo");
            dom.append(ul);
            /* add a gmap marker to the mix */
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lon),
                title: object,
                /* gmap can deal with a DOM element but not a jquery object */
                content: dom.get(0),
                keys: Array(),
            }); 
            //extend the bounds to include each marker's position
            this.bounds.extend(marker.position);
            return { marker: marker, ul: ul };
        },

        /* given an input <ul> element, this method inserts a <li> with embedded checkbox 
         * for displaying/selecting the resource corresponding to the input record
         * returns the created <input> element for further checkbox manipulation
         */
        create_record_checkbox: function (record, ul, checked)
        {
            var key, key_value, data;

            var checkbox = $("<input>", {type:'checkbox', checked:checked, class:'geo'});
            var id = record[this.canonical_key];
            var init_id = record[this.init_key];

            // xxx use init_key to find out label - or should we explicitly accept an incoming label_key ?
            var label = init_id;

            key = this.canonical_key;
            key_value = manifold.record_get_value(record, key);

            ul.append($("<li>").addClass("geo")
              .append($('<div>') // .addId(this.id_from_key(key, key_value))
                .append(checkbox)
                .append($("<span>").addClass("geo")
                  .append(label)
                )
              )
            );

            // XXX STATE / BACKGROUND

            // hash by id and by init_id 
            this.by_id[id]=checkbox;
            this.by_init_id[init_id] = checkbox;

            /* the callback for when a user clicks
             * NOTE: this will *not* be called for changes done by program
             */
            var self=this;
            checkbox.change( function (e) {
                data = {
                    state: STATE_SET,
                    key  : null,
                    op   : this.checked ? STATE_SET_ADD : STATE_SET_REMOVED,
                    value: id
                }
                manifold.raise_event(self.options.query_uuid, FIELD_STATE_CHANGED, data);
            });
            return checkbox;
        },
            
        set_checkbox_from_record_key: function (record_key, checked) 
        {
            if (checked === undefined) checked = true;

            var checkbox = this.by_init_id [record_key];
            if (!checkbox) {
                console.log("googlemap.set_checkbox_from_record - not found " + record_key);
                return;
            }

            checkbox.attr('checked', checked);
        },


        set_checkbox_from_data: function(id, checked) 
        {
            var checkbox = this.by_id[id];
            if (!checkbox) {
                console.log("googlemap.set_checkbox_from_data - id not found " + id);
                return;
            }
            checkbox.attr('checked', checked);
        }, 

        set_bgcolor: function(key_value, class_name)
        {
            var elt = $(document.getElementById(this.id_from_key(this.canonical_key, key_value)))
            if (class_name == GOOGLEMAP_BGCOLOR_RESET)
                elt.removeClass('added removed');
            else
                elt.addClass((class_name == GOOGLEMAP_BGCOLOR_ADDED ? 'added' : 'removed'));
        },


        /**
         * Populates both this.by_lat_lon and this.arm_marker arrays
         */
        new_record: function(record) 
        {
            var record_key;

            if (!(record['latitude'])) 
                return;

            /* get the coordinates*/
            var latitude  = unfold.get_value(record['latitude']);
            var longitude = unfold.get_value(record['longitude']);
            var lat_lon = latitude + longitude;

    	    // check if we've seen anything at that place already
    	    // xxx might make sense to allow for some fuzziness, 
    	    // i.e. consider 2 places equal if not further away than 300m or so...
    	    var marker_s = this.by_lat_lon[lat_lon];
    	    if ( marker_s == null ) {
        	    marker_s = this.create_marker_struct(this.object, latitude, longitude);
        	    this.by_lat_lon[lat_lon] = marker_s;
        	    this.arm_marker(marker_s.marker, this.map);
	        }

            /* Add key to the marker */
            record_key = manifold.record_get_value(record, this.canonical_key);
            marker_s.marker.keys.push(record_key);
	    
    	    // now add a line for this resource in the marker
    	    // xxx should compute checked here ?
    	    // this is where the checkbox will be appended
    	    var ul = marker_s.ul;
    	    var checkbox = this.create_record_checkbox(record, ul, false);
        }, // new_record

        arm_marker: function(marker, map)
        {
            var self = this;
            google.maps.event.addListener(marker, 'click', function () {
                self.infowindow.close();
                self.infowindow.setContent(marker.content);
                self.infowindow.open(map, marker);
            });
        }, // arm_marker

        clear_map: function()
        {
            /* XXX */
        },

        filter_map: function()
        {
            var self = this;
            var visible;

            /* Loop on every marker and sets it visible */
            $.each(this.markers, function(i, marker) {
                /* For a marker to be visible, at least one of its keys has to
                 * be visible */
                visible = false;
                $.each(marker.keys, function(j, key) {
                    visible = visible || manifold.query_store.get_record_state(self.options.query_uuid, key, STATE_VISIBLE);
                });
                marker.setVisible(visible);
            });

            this.do_clustering();
        },

        do_clustering: function()
        {
            this.markerCluster = new MarkerClusterer(this.map, this.markers, {zoomOnClick: false});
            this.markerCluster.setIgnoreHidden(true);
            google.maps.event.addListener(this.markerCluster, "clusterclick", function (cluster) {
                var cluster_markers = cluster.getMarkers();
                var bounds  = new google.maps.LatLngBounds();
                $.each(cluster_markers, function(i, marker){
                    bounds.extend(marker.getPosition()); 
                });
                //map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds));
                this.map.fitBounds(bounds);
            });
            //now fit the map to the bounds
            this.map.fitBounds(this.bounds);
            // Fix the zoom of fitBounds function, it's too close when there is only 1 marker
            if (this.markers.length==1) {
                this.map.setZoom(this.map.getZoom()-4);
            }
        },

        redraw_map: function()
        {
            // Let's clear the table and only add lines that are visible
            var self = this;
            this.clear_map();

            /* Add records to internal hash structure */
            var record_keys = [];
            manifold.query_store.iter_records(this.options.query_uuid, function (record_key, record) {
                self.new_record(record);
                record_keys.push(record_key);
            });

            /* Add markers to cluster */
            this.markers = Array();
            $.each(this.by_lat_lon, function (k, s) {
                self.markers.push(s.marker); 
            });

            this.do_clustering();


            /* Set checkbox and background color */
            $.each(record_keys, function(i, record_key) {
                var state = manifold.query_store.get_record_state(self.options.query_uuid, record_key, STATE_SET);
                var warnings = manifold.query_store.get_record_state(self.options.query_uuid, record_key, STATE_WARNINGS);
                switch(state) {
                    // XXX The row and checkbox still does not exists !!!!
                    case STATE_SET_IN:
                    case STATE_SET_IN_SUCCESS:
                    case STATE_SET_OUT_FAILURE:
                        self.set_checkbox_from_record_key(record_key, true);
                        break;
                    case STATE_SET_OUT:
                    case STATE_SET_OUT_SUCCESS:
                    case STATE_SET_IN_FAILURE:
                        break;
                    case STATE_SET_IN_PENDING:
                        self.set_checkbox_from_record_key(record_key, true);
                        self.set_bgcolor(record_key, GOOGLEMAP_BGCOLOR_ADDED);
                        break;
                    case STATE_SET_OUT_PENDING:
                        self.set_bgcolor(record_key, GOOGLEMAP_BGCOLOR_REMOVED);
                        break;
                }
                //self.change_status(record_key, warnings); // XXX will retrieve status again
            });
        },

       /**************************************************************************
        *                           QUERY HANDLERS
        **************************************************************************/ 

        on_filter_added: function(filter)
        {
            this.filter_map();
        },

        on_filter_removed: function(filter)
        {
            this.filter_map();
        },
        
        on_filter_clear: function()
        {
            this.filter_map();
        },

        on_query_in_progress: function() 
        {
            this.spin();
        },

        on_query_done: function()
        {
            this.redraw_map();
            this.unspin();
        },

        on_field_state_changed: function(data)
        {
            switch(data.state) {
                case STATE_SET:
                    switch(data.value) {
                        case STATE_SET_IN:
                        case STATE_SET_IN_SUCCESS:
                        case STATE_SET_OUT_FAILURE:
                            this.set_checkbox_from_data(data.key, true);
                            this.set_bgcolor(data.key, QUERYTABLE_BGCOLOR_RESET);
                            break;  
                        case STATE_SET_OUT:
                        case STATE_SET_OUT_SUCCESS:
                        case STATE_SET_IN_FAILURE:
                            this.set_checkbox_from_data(data.key, false);
                            this.set_bgcolor(data.key, QUERYTABLE_BGCOLOR_RESET);
                            break;
                        case STATE_SET_IN_PENDING:
                            this.set_checkbox_from_data(data.key, true);
                            this.set_bgcolor(data.key, QUERYTABLE_BGCOLOR_ADDED);
                            break;  
                        case STATE_SET_OUT_PENDING:
                            this.set_checkbox_from_data(data.key, false);
                            this.set_bgcolor(data.key, QUERYTABLE_BGCOLOR_REMOVED);
                            break;
                    }
                    break;

                case STATE_WARNINGS:
                    //this.change_status(data.key, data.value);
                    break;
            }
        },

    });

    $.plugin('GoogleMap', GoogleMap);

})(jQuery);
