/**
 * univbris:    test ofam plugin for Bristol University
 * Version:     0.2
 * Description: just testing plugin in myslice
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Frederic Francois <f.francois@bristol.ac.uk>
 * Copyright:   Copyright 2012-2013 Bristol University
 * License:     GPLv3
 */

(function($){

    var Univbris = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);
            this.listen_query(options.query_uuid);

        },

	on_query_done: function()
	{
	  $("#univbris_welcome").hide();
	  jQuery("#univbris_flowspace_selection").show();
	},


    });

    $.plugin('Univbris', Univbris);

})(jQuery);
