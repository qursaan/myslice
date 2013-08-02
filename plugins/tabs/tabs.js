(function($){

    $.fn.Tabs = function( method ) {

        $('a[data-toggle="tab"]').on('shown', function (e) {
          google.maps.event.trigger(map, 'resize');
          //e.target // current tab
          //e.relatedTarget // previous tab
        });

    };

})( jQuery );
