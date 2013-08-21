(function($){

    $.fn.Tabs = function( method ) {

        $('a[data-toggle="tab"]').on('shown', function (e) {
          // find the plugin object inside the tab content referenced by the current tabs
          $('.plugin', $($(e.target).attr('href'))).trigger('show');
        });

    };

})( jQuery );
