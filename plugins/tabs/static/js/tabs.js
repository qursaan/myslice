(function($){
    $.fn.Tabs = function( method ) {
        // In Bootstrap 3, we need 'shown.bs.tab' instead of 'shown'
        // see: http://bootply.com/bootstrap-3-migration-guide
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          // find the plugin object inside the tab content referenced by the current tabs
          $('.plugin', $($(e.target).attr('href'))).trigger('show');
        });
    };
})( jQuery );
