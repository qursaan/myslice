/**
 * Description: display a query result in a Google map
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($){

   var GoogleMaps = Plugin.extend({

        init: function(options, element)
        {
            this._super(options, element);

            /* Member variables */
            // query status
            this.received_all = false;
            this.received_set = false;
            this.in_set_buffer = Array();

            /* XXX Events XXX */
            this.$element.on('show.Datatables', this.on_show);
            // TODO in destructor
            // $(window).unbind('Hazelnut');

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_map();
        }, // init

        /* PLUGIN EVENTS */

        on_show: function()
        {
            google.maps.event.trigger(map, 'resize');
        }, // on_show

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        /**
         */
        initialize_map: function()
        {
            this.map = null;
            this.markerCluster = null;
            this.markers = [];
            this.coords = new Array();

            var myLatlng = new google.maps.LatLng(this.options.latitude, this.options.longitude);
            var myOptions = {
                zoom: this.options.zoom,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
      
            this.map = new google.maps.Map(document.getElementById("map"), myOptions);
            this.infowindow = new google.maps.InfoWindow();
        }, // initialize_map

        /**
         */
        new_record: function(record)
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

                this.addInfoWindow(marker, this.map);
                this.markers.push(marker);
            //}

        }, // new_record

        addInfoWindow: function(marker, map)
        {
            var self = this;
            google.maps.event.addListener(marker, 'click', function () {     
                if(self.infowindow){
                    self.infowindow.close();
                }
                self.infowindow.setContent(marker.content);// = new google.maps.InfoWindow({ content: marker.content });
                self.infowindow.open(map, marker);
                // onload of the infowindow on the map, bind a click on a button
                google.maps.event.addListener(self.infowindow, 'domready', function() {
                    jQuery('.map-button').unbind('click');
//                    jQuery(".map-button").click({instance: instance_, infoWindow: object.infowindow}, button_click);                     
                });
            });
        }, // addInfoWindow

        set_checkbox: function(record)
        {
            // XXX urn should be replaced by the key
            // XXX we should enforce that both queries have the same key !!
            //checkbox_id = "#hazelnut-checkbox-" + object.options.plugin_uuid + "-" + unfold.escape_id(record[ELEMENT_KEY].replace(/\\/g, ''))
            //$(checkbox_id, object.table.fnGetNodes()).attr('checked', true);
        }, // set_checkbox


        /*************************** QUERY HANDLER ****************************/

        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record)
        {
            if (this.received_all)
                // update checkbox for record
                this.set_checkbox(record);
            else
                // store for later update of checkboxes
                this.in_set_buffer.push(record);
        },

        on_clear_records: function(record)
        {

        },

        // Could be the default in parent
        on_query_in_progress: function()
        {
            this.spin();
        },

        on_query_done: function()
        {
            if (this.received_all)
                this.unspin();
            this.received_set = true;
        },

        // all

        on_all_new_record: function(record)
        {
            this.new_record(record);
        },

        on_all_clear_records: function()
        {
        },

        on_all_query_in_progress: function()
        {
            // XXX parent
            this.spin();
        },

        on_all_query_done: function()
        {

            // MarkerClusterer
            this.markerCluster = new MarkerClusterer(this.map, this.markers, {zoomOnClick: false});
            google.maps.event.addListener(this.markerCluster, "clusterclick", function (cluster) {
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
              this.map.fitBounds(bounds);
            });

            var self = this;
            if (this.received_set) {
                /* XXX needed ? XXX We uncheck all checkboxes ... */
                $("[id^='datatables-checkbox-" + this.options.plugin_uuid +"']").attr('checked', false);

                /* ... and check the ones specified in the resource list */
                $.each(this.in_set_buffer, function(i, record) {
                    self.set_checkbox(record);
                });

                this.unspin();
            }
            this.received_all = true;

        }, // on_all_query_done

        /************************** PRIVATE METHODS ***************************/

        _button_click: function(e)
        {
            var op_value=this.id.split("/");
            if(op_value.length>0) {
                var value = op_value[1];
                manifold.raise_event(this.options.query_uuid, (op_value[0] == 'add')?SET_ADD:SET_REMOVED, value);
            }
        } // button_click

    });

    $.plugin('GoogleMaps', GoogleMaps);

})(jQuery);
