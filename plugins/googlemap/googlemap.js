/**
 * Description: display a query result in a googlemap
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){

    var PLUGIN_NAME = 'GoogleMap';

    // routing calls
    jQuery.fn.GoogleMap = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME );
		}    
    };

    /***************************************************************************
     * Public methods
     ***************************************************************************/

    var methods = {

        /**
         * @brief Plugin initialization
         * @param options : an associative array of setting values
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init : function( options ) {

            return this.each(function(){
         
                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new GoogleMaps(options);
                $this.data('Manifold', plugin);

                plugin.initialize();

                /* Events */
                $this.on('show.' + PLUGIN_NAME, methods.show);

                $this.set_query_handler(options.query_uuid, plugin.query_handler);
                $this.set_record_handler(options.query_uuid, plugin.record_handler); 
                $this.set_record_handler(options.query_all_uuid, plugin.record_handler_all); 

            }); // this.each
        }, // init

        /**
         * @brief Plugin destruction
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        destroy : function( ) {

            return this.each(function() {
                var $this = $(this);
                var hazelnut = $this.data('Manifold');

                // Unbind all events using namespacing
                $(window).unbind(PLUGIN_NAME);

                // Remove associated data
                hazelnut.remove();
                $this.removeData('Manifold');
            });

        }, // destroy

        show : function( ) {
            google.maps.event.trigger(map, 'resize');
        } // show

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function GoogleMaps(options) 
    {
        /* member variables */
        this.options = options;

        // query status
        this.received_all = false;
        this.received_set = false;
        this.in_set_buffer = Array();

        var object = this;

        /**
         */
        this.initialize = function() {
            this.map = null;
            this.markerCluster = null;
            this.markers = [];
            this.coords = new Array();

            var myLatlng = new google.maps.LatLng(options.latitude, options.longitude);
            var myOptions = {
                zoom: options.zoom,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
      
            this.map = new google.maps.Map(document.getElementById("map"), myOptions);
            this.infowindow = new google.maps.InfoWindow();
        }

        /**
         */
        this.new_record = function(record)
        {

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
            // If the node is attached to the slice, action will be Remove; else action will be add to slice
            if (typeof(record['sliver']) != 'undefined') {
                data.current_resources.push(record['urn']);
                action="del";
                action_class="ui-icon-circle-minus";
                action_message="Remove from slice";
            }else{
                action="add";
                action_class="ui-icon-circle-plus";
                action_message="Add to slice";
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
                    content: '<p>Agent: ' + get_value(record['ip']) + ' (' + get_value(record['resource_hrn']) + ')<br/>Platform: ' + get_value(record['platform'])+'</p>' +
                            '<div class="map-button" id="'+action+'/'+get_value(record['resource_hrn'])+'" style="cursor:pointer;">'+
                            '<span class="ui-icon '+action_class+'" style="clear:both;float:left;"></span>'+action_message+
                            '</div>'
                }); 

                this.addInfoWindow(marker, object.map);
                object.markers.push(marker);
            //}

        };

        this.addInfoWindow = function(marker, map) {
            google.maps.event.addListener(marker, 'click', function () {     
                if(object.infowindow){
                    object.infowindow.close();
                }
                object.infowindow.setContent(marker.content);// = new google.maps.InfoWindow({ content: marker.content });
                object.infowindow.open(map, marker);
                // onload of the infowindow on the map, bind a click on a button
                google.maps.event.addListener(object.infowindow, 'domready', function() {
                    jQuery('.map-button').unbind('click');
//                    jQuery(".map-button").click({instance: instance_, infoWindow: object.infowindow}, button_click);                     
                });
            });
        }


        this.set_checkbox = function(record)
        {
            // XXX urn should be replaced by the key
            // XXX we should enforce that both queries have the same key !!
            //checkbox_id = "#hazelnut-checkbox-" + object.options.plugin_uuid + "-" + unfold.escape_id(record[ELEMENT_KEY].replace(/\\/g, ''))
            //$(checkbox_id, object.table.fnGetNodes()).attr('checked', true);
        }

        this.record_handler = function(e, event_type, record)
        {
            // elements in set
            switch(event_type) {
                case NEW_RECORD:
                    /* NOTE in fact we are doing a join here */
                    if (object.received_all)
                        // update checkbox for record
                        object.set_checkbox(record);
                    else
                        // store for later update of checkboxes
                        object.in_set_buffer.push(record);
                    break;
                case CLEAR_RECORDS:
                    // nothing to do here
                    break;
                case IN_PROGRESS:
                    manifold.spin($(this));
                    break;
                case DONE:
                    if (object.received_all)
                        manifold.spin($(this), false);
                    object.received_set = true;
                    break;
            }
        };

        this.record_handler_all = function(e, event_type, record)
        {
            // all elements
            switch(event_type) {
                case NEW_RECORD:
                    // Add the record to the table
                    object.new_record(record);
                    break;
                case CLEAR_RECORDS:
                    // object.table.fnClearTable();
                    break;
                case IN_PROGRESS:
                    manifold.spin($(this));
                    break;
                case DONE:

                    // MarkerClusterer
                    object.markerCluster = new MarkerClusterer(object.map, object.markers, {zoomOnClick: false});
                    google.maps.event.addListener(object.markerCluster, "clusterclick", function (cluster) {
                        var markers = cluster.getMarkers();
                        var bounds  = new google.maps.LatLngBounds();
                      /* 
                      * date: 24/05/2012
                      * author: lbaron
                      * Firefox JS Error - replaced $.each by JQuery.each
                      */                  
                      jQuery.each(markers, function(i, marker){
                          bounds.extend(marker.getPosition()); 
                      });

                      //map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds));
                      object.map.fitBounds(bounds);
                    });

                    if (object.received_set) {
                        /* XXX needed ? XXX We uncheck all checkboxes ... */
                        $("[id^='datatables-checkbox-" + object.options.plugin_uuid +"']").attr('checked', false);

                        /* ... and check the ones specified in the resource list */
                        $.each(object.in_set_buffer, function(i, record) {
                            object.set_checkbox(record);
                        });

                        manifold.spin($(this), false);
                    }
                    object.received_all = true;
                    break;
            }
        };


        this.query_handler = function(e, event_type, query)
        {
            // This replaces the complex set_query function
            // The plugin does not need to remember the query anymore
            switch(event_type) {
                // Filters
                case FILTER_ADDED:
                case FILTER_REMOVED:
                case CLEAR_FILTERS:
                    // XXX Here we might need to maintain the list of filters !
                    /* Process updates in filters / current_query must be updated before this call for filtering ! */
                    object.table.fnDraw();
                    break;

                // Fields
                /* Hide/unhide columns to match added/removed fields */
                case FIELD_ADDED:
                    break;
                case FIELD_REMOVED:
                    break;
                case CLEAR_FIELDS:
                    alert('GoogleMaps::clear_fields() not implemented');
                    break;
            } // switch


        }

        function button_click(e){
            var op_value=this.id.split("/");
            if(op_value.length>0){
                var value = op_value[1];
                manifold.raise_event(object.options.query_uuid, (op_value[0] == 'add')?SET_ADD:SET_REMOVED, value);
            }
        } // function button_click()
    } 

    // clear and replace
//                jQuery.each(data.results, function(i, row){
//                    jQuery.each(query.filter, function (idx, filter){
//                        if(get_value(row[filter[0]])==filter[2]){
//                            rows.push(row);
//                        }
//                    });
//                });
//                data.markerCluster=[];
//                data.markers=[];
//                var myLatlng = new google.maps.LatLng(34.397, 150.644);
//                var myOptions = {
//                    zoom: 2,
//                    center: myLatlng,
//                    mapTypeId: google.maps.MapTypeId.ROADMAP
//                }
//                map = new google.maps.Map(jQuery('#map')[0],myOptions);
//                data.map=map;
//                //map.clearMarkers();
//                update_map(e, rows);
//            }
//        }

})( jQuery );
