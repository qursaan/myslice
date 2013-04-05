/**
 * MySlice GoogleMap plugin
 * URL: http://trac.myslice.info
 * Description: SensLab display of 3D-geolocated data
 * Author: The MySlice Team
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

// xxx TODO -- this plugin has never been tested 
// in addition it could use a bit of cleaning like what was done for the first plugins
// especially wrt using 'instance' and 'data' in such a confusing way

(function( jQuery ){

  var methods = {
     init : function( options ) {

       return this.each(function(){
         
         var $this = jQuery(this),
             data = $this.data('SensLabMap'), SensLabMap = jQuery('<div />', { text : $this.attr('title') });
         
         // If the plugin hasn't been initialized yet
         if ( ! data ) {
         
           /* Plugin initialization */

            //google.load('maps', '3', { other_params: 'sensor=false' });
            //google.setOnLoadCallback(initialize);

            init();
            /* End of plugin initialization */

            jQuery(this).data('SensLabMap', {
				plugin_uuid: options.plugin_uuid,
				query_uuid: options.query_uuid,
                target : $this,
                SensLabMap : SensLabMap
            });

			/* Subscribe to query updates */
			jQuery.subscribe('/results/' + options.query_uuid + '/changed', {instance: $this}, update_map);
			

         }
       });
     },
    destroy : function( ) {

        return this.each(function(){
            var $this = jQuery(this), data = $this.data('SensLabMap');
			jQuery(window).unbind('SensLabMap');
			data.SensLabMap.remove();
			$this.removeData('SensLabMap');
		})

    },
/*
    reposition : function( ) { // ... },
    show : function( ) { // ... },
    hide : function( ) { // ... },
*/
    update : function( content ) { 
        // should be made a private function
        set3dsize()
    }
  };

    jQuery.fn.SensLabMap = function( method ) {
		/* Method calling logic */
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.SensLabMap' );
		}    

    };

    /* Private methods */

	function update_map(e, rows) {
            var $plugindiv = e.data.instance;
	    $plugindiv.closest('.need-spin').spin(false);
	    
            if(rows) {
		/* TODO rendering */   
            } else {
		alert('error');
            }
	    
	}

})( jQuery );
