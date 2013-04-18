/**
 * Description: display a query result in a googlemap
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

// xxx TODO -- this one could use a bit of cleaning like what was done for the first plugins
// especially wrt using 'instance' and 'data' in such a confusing way

(function( jQuery ){

  var methods = {
     init : function( options ) {

       return this.each(function(){
         
         var $this = jQuery(this),
             data = $this.data('GoogleMap'), GoogleMap = jQuery('<div />', {text : $this.attr('title')});
         
         // If the plugin hasn't been initialized yet
         if ( ! data ) {
         
           /* Plugin initialization */

            //google.load('maps', '3', { other_params: 'sensor=false' });
            //google.setOnLoadCallback(initialize);

            $this.data('map', null);
            $this.data('markerCluster', null);
            $this.data('markers', []);

	     console.log ("lat=" + options.latitude + " long=" + options.longitude + " and zoom=" + options.zoom);
            var myLatlng = new google.maps.LatLng(options.latitude, options.longitude);
            var myOptions = {
              zoom: options.zoom,
              center: myLatlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
      
            var map = new google.maps.Map(document.getElementById("map"), myOptions);
            $this.data('map', map);

            /* End of plugin initialization */

            jQuery(this).data('GoogleMap', {
				plugin_uuid: options.plugin_uuid,
				query_uuid: options.query_uuid,
                target : $this,
                current_resources: Array(),
                GoogleMap : GoogleMap
            });

            /* Subscribe to query updates */
            jQuery.subscribe('/results/' + options.query_uuid + '/changed', {instance: $this}, update_map);
            jQuery.subscribe('/update-set/' + options.query_uuid, {instance: $this}, on_resource_changed);
            jQuery.subscribe('/query/' + options.query_uuid + '/changed', {instance: $this}, query_changed);
            
            //data = jQuery(this).data();
            
            // TODO: Change the status of a node based on the actions in GoogleMap plugin or in other plugins (e.g. DataTables)
            // Can we publish a value in results row['sliver'] ???
            // Today, the value is attached or undefined
            // But can we think about a added/removed status ???
            // This plugin would update the map based on the results published

         }
       });
     },
    destroy : function( ) {

        return this.each(function(){
            var $this = jQuery(this), data = $this.data('GoogleMap');
			jQuery(window).unbind('GoogleMap');
			data.GoogleMap.remove();
			$this.removeData('GoogleMap');
		})

    },
/*
    reposition : function( ) { // ... },
    update : function( ) { // ... },
    hide : function( ) { // ... },
*/
    show : function( content ) {
        google.maps.event.trigger(map, 'resize');
    }
  };

    jQuery.fn.GoogleMap = function( method ) {
		/* Method calling logic */
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.GoogleMap' );
		}    

    };

    /* Private methods */
        function query_changed(e,query){
            var data = e.data.instance.data();
            /* Compare current and advertised query to get added and removed fields */
            previous_query=data.current_query;
            /* Save the query as the current query */
            data.current_query=query;
            
            var rows=[];
            if(typeof(data.results)!="undefined" && data.results.length>0){
                jQuery.each(data.results, function(i, row){
                    jQuery.each(query.filter, function (idx, filter){
                        if(get_value(row[filter[0]])==filter[2]){
                            rows.push(row);
                        }
                    });
                });
                data.markerCluster=[];
                data.markers=[];
                var myLatlng = new google.maps.LatLng(34.397, 150.644);
                var myOptions = {
                    zoom: 2,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                map = new google.maps.Map(jQuery('#map')[0],myOptions);
                data.map=map;
                //map.clearMarkers();
                update_map(e, rows);
            }
        }
	function update_map(e, rows) {            
            var data = e.data.instance.data();
            var instance_ = e.data.instance;
	    //$plugindiv.closest('.need-spin').spin(false);
	    instance_.closest('.need-spin').spin(false);


            if (rows === undefined || !rows || rows.length==0) {
		messages.warning ("Empty result in googlemap.update_map - nothing to show");
                return;
            }

            if(rows.length==0) {
                rows=data.results;
            }

            if(typeof(data.results)=="undefined" || data.results==null){
                data.results=rows;
            }
            var map = data.map;
            var markerCluster = data.markerCluster;            
            var markers = data.markers;
            var coords = new Array();
            var infowindow = new google.maps.InfoWindow();
            /*
            if(typeof(markers)!="undefined" && markers.length>0){
                map.clearMarkers();
            }*/

            data.current_resources = Array();

            jQuery.each(data.results, function(i, result){
                // get the coordinates
                var latitude=get_value(result['latitude']);
                var longitude=get_value(result['longitude']);
                var hash = latitude + longitude;

                // check to see if we've seen this hash before
                if(coords[hash] == null) {
                    // get coordinate object
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    // store an indicator that we've seen this point before
                    coords[hash] = 1;
                } else {
                    // add some randomness to this point 1500 = 100 meters, 15000 = 10 meters
                    var lat = latitude + (Math.random() -.5) / 1500; 
                    var lng = longitude + (Math.random() -.5) / 1500; 

                    // get the coordinate object
                    var myLatlng = new google.maps.LatLng(lat, lng);
                }
                // If the node is attached to the slice, action will be Remove; else action will be add to slice
                if (typeof(result['sliver']) != 'undefined') {
                    data.current_resources.push(result['urn']);
                    action="del";
                    action_class="ui-icon-circle-minus";
                    action_message="Remove from slice";
                }else{
                    action="add";
                    action_class="ui-icon-circle-plus";
                    action_message="Add to slice";
                }
                // XXX not working
                if (!(result['latitude'])) {
                    return true;
                }

                //jQuery(".map-button").click(button_click);
                if(jQuery.inArray(result,rows)>-1){
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        title: get_value(result['ip']),
                        // This should be done by the rendering
                        content: '<p>Agent: ' + get_value(result['ip']) + ' (' + get_value(result['urn']) + ')<br/>Platform: ' + get_value(result['platform'])+'</p>' +
                                '<div class="map-button" id="'+action+'/'+get_value(result['urn'])+'" style="cursor:pointer;">'+
                                '<span class="ui-icon '+action_class+'" style="clear:both;float:left;"></span>'+action_message+
                                '</div>'
                    }); 

                    google.maps.event.addListener(marker, 'click', function() {
                            infowindow.content = this.content;
                            infowindow.open(map, this);
                            // onload of the infowindow on the map, bind a click on a button
                            google.maps.event.addListener(infowindow, 'domready', function() {
                                jQuery('.map-button').unbind('click');
                                jQuery(".map-button").click({instance: instance_}, button_click);
                            });
                    });
                    markers.push(marker);
                }
            });
            markerCluster = new MarkerClusterer(map, markers, {zoomOnClick: false});
            google.maps.event.addListener(markerCluster, "clusterclick", function (cluster) {
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
                map.fitBounds(bounds);
            });
            data.markerCluster=markerCluster;
        }
        function button_click(e){
            var data = e.data.instance.data().GoogleMap;
            var op_value=this.id.split("/");
            if(op_value.length>0){
                jQuery.publish('selected', op_value[0]+'/'+op_value[1]);
                var value = op_value[1];

                if (op_value[0] == 'add') {
                    data.current_resources.push(value);
                } else {
                    tmp = jQuery.grep(data.current_resources, function(x) { return x != value; });
                    data.current_resources = tmp;
                }

                /* inform slice that our selected resources have changed */
                jQuery.publish('/update-set/' + data.query_uuid, [data.current_resources, true, e.data.instance]);
            }
        }

    function on_resource_changed(e, resources, instance)
    {
        /* TODO OPENLAB : this query determines which checkboxes must be checked */
        if (instance == e.data.instance)
            return;
        data = e.data.instance.data().GoogleMap;

        previous_resources = data.current_resources;
        data.current_resources = resources;

        /* TODO We uncheck all checkboxes ... */
        //jQuery('datatables-checkbox-' + data.options.plugin_uuid).attr('checked', false);
        /* ... and check the ones specified in the resource list */
        //jQuery.each(data.current_resources, function(index, urn) {
        //    jQuery('#datatables-checkbox-' + data.options.plugin_uuid + "-" + urn).attr('checked', true)
        //});
        
    }

})( jQuery );
