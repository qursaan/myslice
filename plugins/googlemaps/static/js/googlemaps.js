/**
 * Description: display a query result in a Google map
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/* BUGS:
 * - infowindow is not properly reopened when the maps does not have the focus
 */

googlemaps_debug=true;
googlemaps_debug_detailed=false;

(function($){

    var GoogleMaps = Plugin.extend({

        init: function(options, element) {
	    if (googlemaps_debug) messages.debug("GoogleMaps.init");
            this._super(options, element);

            /* Member variables */
            // query status
            this.received_all = false;
            this.received_set = false;
            this.in_set_buffer = [];

            // key -> { marker, checked }
            this.map_markers = {}

            /* XXX Events XXX */
            this.elmt().on('show', this, this.on_show);
            // TODO in destructor
            // $(window).unbind('Hazelnut');

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.method = query.object;

            var keys = manifold.metadata.get_key(this.method);
            this.key = (keys && keys.length == 1) ? keys[0] : null;

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_map();
        }, // init

        /* PLUGIN EVENTS */

        on_show: function(e) {
	    if (googlemaps_debug) messages.debug("on_show");
            var self = e.data;
            google.maps.event.trigger(self.map, 'resize');
        }, // on_show

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        /**
         */
        initialize_map: function() {
	    if (googlemaps_debug) messages.debug("initialize_map");
            this.markerCluster = null;
            this.coords = new Array();

            var myLatlng = new google.maps.LatLng(this.options.latitude, this.options.longitude);
            var myOptions = {
                zoom: this.options.zoom,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            }
	    
            var domid = this.options.plugin_uuid + manifold.separator + 'map';
	    var el = document.getElementById(domid);
	    if (googlemaps_debug) messages.debug("gmap.initialize_map based on  domid=" + domid + " el=" + el);
            this.map = new google.maps.Map(el, myOptions);
            this.infowindow = new google.maps.InfoWindow();
        }, // initialize_map

        set_checkbox: function(record, checked) {
	    if (googlemaps_debug_detailed) messages.debug ("set_checkbox");
            /* Default: checked = true */
            if (typeof checked === 'undefined')
                checked = true;

            var key_value;
            /* The function accepts both records and their key */
            switch (manifold.get_type(record)) {
            case TYPE_VALUE:
                key_value = record;
                break;
            case TYPE_RECORD:
                /* XXX Test the key before ? */
                key_value = record[this.key];
                break;
            default:
                throw "Not implemented";
                break;
            }

            // we cannot directly edit html, since nothing but marker is displayed
            //var checkbox_id = this.id('checkbox', this.id_from_key(this.key, key_value));
            //checkbox_id = '#' + checkbox_id.replace(/\./g, '\\.');
            //$(checkbox_id, this.table.fnGetNodes()).attr('checked', checked);

            var dict_info = this.map_markers[unfold.escape_id(key_value).replace(/\\/g, '')];


            // Update the marker content
            dict_info.in_set = checked;
            dict_info.marker.content = this.get_marker_content(dict_info.record, checked);

	    // Thierry - this code seems to cause the googlmap area to go all grayed out 
	    // once all the quesries have come back
	    // BEG turning off temporarily
	    //            // Update opened infowindow
	    //            // XXX Factor this code
	    //            this.infowindow.close();
	    //            this.infowindow.open(this.map, dict_info.marker);
	    //            this.infowindow.setContent(dict_info.marker.content);
	    //            this.elts('map-button').unbind('click').click(this, this._button_click);
	    // END turning off temporarily
            //var button = this.checkbox(record, checked);
            //this.elmt('checkbox', this.id_from_record(method, record)).html(button);
        }, 

        checkbox: function(record, checked) {
	    if (googlemaps_debug_detailed) messages.debug ("checkbox");
            if (typeof checked === 'undefined')
                checked = false;

            var method  = manifold.query_store.find_analyzed_query(this.options.query_uuid).object;
            var action = checked ? 'checked' : 'del';
            var ctx = {
                action_class  : checked ? 'ui-icon-circle-minus' : 'ui-icon-circle-plus',
                action_message: checked ? 'Remove from slice' : 'Add to slice',
            };
            var button = this.load_template('template', ctx);

            var id_record = this.id_from_record(method, record);
            if (!id_record)
                return 'ERROR';
            var id = this.id('checkbox', this.id_from_record(method, record));
            return "<div id='" + id + "'>" + button + "</div>";
        },
        
        get_marker_content: function(record, checked) {
	    if (googlemaps_debug_detailed) messages.debug ("get_marker_content");
            return '<p><b>' + this.method + '</b>: ' + get_value(record['resource_hrn']) + '<br/><b>network</b>: ' + get_value(record['network'])+'</p>' + this.checkbox(record, checked);
        },

        /**
         */
        new_record: function(record) {
	    if (googlemaps_debug_detailed) messages.debug ("new_record");
            // get the coordinates
            var latitude=get_value(record['latitude']);
            var longitude=get_value(record['longitude']);
            var hash = latitude + longitude;

            // check to see if we've seen this hash before
            if(this.coords[hash] == null) {
                // get coordinate object
                var myLatlng = new google.maps.LatLng(latitude, longitude);
                // store an indicator that we've seen this point before
                this.coords[hash] = 1;
            } else {
                // add some randomness to this point 1500 = 100 meters, 15000 = 10 meters
                var lat = latitude + (Math.random() -.5) / 1500; 
                var lng = longitude + (Math.random() -.5) / 1500; 

                // get the coordinate object
                var myLatlng = new google.maps.LatLng(lat, lng);
            }
            // XXX not working
            if (!(record['latitude'])) {
                return true;
            }

            //jQuery(".map-button").click(button_click);
            //if(jQuery.inArray(record, rows)>-1){
            var marker = new google.maps.Marker({
                position: myLatlng,
                title: get_value(record['hostname']),
                // This should be done by the rendering
                content: this.get_marker_content(record, false),
            }); 

            this.addInfoWindow(marker, this.map);
            var key_value = (this.key in record) ? record[this.key] : null;
            if (!key_value)
                return;
            this.map_markers[unfold.escape_id(key_value).replace(/\\/g, '')] = {
                marker: marker,
                in_set: false,
                record: record,
                value: key_value
            }
            //}

        }, // new_record

        addInfoWindow: function(marker, map) {
	    if (googlemaps_debug_detailed) messages.debug ("addInfoWindow");
            var self = this;
            google.maps.event.addListener(marker, 'click', function () {     
                if(self.infowindow){
                    self.infowindow.close();
                }
                self.infowindow.setContent(marker.content);// = new google.maps.InfoWindow({ content: marker.content });
                self.infowindow.open(map, marker);
                // onload of the infowindow on the map, bind a click on a button
                google.maps.event.addListener(self.infowindow, 'domready', function() {
                    self.elts('map-button').unbind('click').click(self, self._button_click);
		    //                    jQuery(".map-button").click({instance: instance_, infoWindow: object.infowindow}, button_click);                     
                });
            });
        }, // addInfoWindow


        /*************************** QUERY HANDLER ****************************/

        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record) {
	    if (googlemaps_debug_detailed) messages.debug("on_new_record");
            if (this.received_all)
                // update checkbox for record
                this.set_checkbox(record);
            else
                // store for later update of checkboxes
                this.in_set_buffer.push(record);
        },

        on_clear_records: function(record) {
	    if (googlemaps_debug_detailed) messages.debug("on_clear_records");
        },

        // Could be the default in parent
        on_query_in_progress: function() {
	    if (googlemaps_debug) messages.debug("on_query_in_progress");
            this.spin();
        },

        on_query_done: function() {
	    if (googlemaps_debug) messages.debug("on_query_done");	    
            if (this.received_all)
                this.unspin();
            this.received_set = true;
        },

        on_field_state_changed: function(data) {
	    if (googlemaps_debug) messages.debug("on_field_state_changed");	    
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


        // all

        on_all_new_record: function(record) {
	    if (googlemaps_debug_detailed) messages.debug("on_all_new_record");
            this.new_record(record);
        },

        on_all_clear_records: function() {
	    if (googlemaps_debug) messages.debug("on_all_clear_records");	    
        },

        on_all_query_in_progress: function() {
	    if (googlemaps_debug) messages.debug("on_all_query_in_progress");
            // XXX parent
            this.spin();
        },

        on_all_query_done: function() {
	    if (googlemaps_debug) messages.debug("on_all_query_done");
            // MarkerClusterer
            var markers = [];
            $.each(this.map_markers, function (k, v) { markers.push(v.marker); });

            this.markerCluster = new MarkerClusterer(this.map, markers, {zoomOnClick: false});
            google.maps.event.addListener(this.markerCluster, "clusterclick", function (cluster) {
                var cluster_markers = cluster.getMarkers();
                var bounds  = new google.maps.LatLngBounds();
                /* 
                 * date: 24/05/2012
                 * author: lbaron
                 * Firefox JS Error - replaced $.each by JQuery.each
                 */                  
                jQuery.each(cluster_markers, function(i, marker){
                    bounds.extend(marker.getPosition()); 
                });

                //map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds));
                this.map.fitBounds(bounds);
            });

            var self = this;
            if (this.received_set) {
                /* XXX needed ? XXX We uncheck all checkboxes ... */
                //$("[id^='datatables-checkbox-" + this.options.plugin_uuid +"']").attr('checked', false);

                /* ... and check the ones specified in the resource list */
                $.each(this.in_set_buffer, function(i, record) {
                    self.set_checkbox(record, true);
                });
		// reset 
		self.in_set_buffer = [];

                this.unspin();
            }
            this.received_all = true;

        }, // on_all_query_done

        /************************** PRIVATE METHODS ***************************/

        _button_click: function(e) {
	    if (googlemaps_debug) messages.debug("_button_click");
            var self   = e.data;

            var escaped_key = self.key_from_id($(this).parent().attr('id'), 'checkbox');
            var info_dict = self.map_markers[escaped_key];
            var in_set = info_dict.in_set;
            var value = info_dict.value;

            var escaped_key = self.map_markers[self.key_from_id($(this).parent().attr('id'), 'checkbox')]
            manifold.raise_event(self.options.query_uuid, (in_set) ? SET_REMOVED : SET_ADD, value);
        } // _button_click

    });

    $.plugin('GoogleMaps', GoogleMaps);

})(jQuery);
