/**
 * MyPlugin:    demonstration plugin
 * Version:     0.1
 * Description: Template for writing new plugins and illustrating the different
 *              possibilities of the plugin API.
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Jordan Augé <jordan.auge@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

(function($){

    var Slicestat = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) {
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);
			
			google.load("visualization", "1.0", {packages:["corechart"]});
			 
			

            /* Member variables */

            /* Plugin events */

            /* Setup query and record handlers */

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient
            this.listen_query(options.query_uuid);

            /* GUI setup and event binding */
            // call function

        },

        /* PLUGIN EVENTS */
        // on_show like in hazelnut


        /* GUI EVENTS */

        // a function to bind events here: click change
        // how to raise manifold events


        /* GUI MANIPULATION */

        // We advise you to write function to change behaviour of the GUI
        // Will use naming helpers to access content _inside_ the plugin
        // always refer to these functions in the remaining of the code

        show_hide_button: function() 
        {
            // this.id, this.el, this.cl, this.elts
            // same output as a jquery selector with some guarantees
        },

        /* TEMPLATES */

        // see in the html template
        // How to load a template, use of mustache

        /* QUERY HANDLERS */

        // How to make sure the plugin is not desynchronized
        // He should manifest its interest in filters, fields or records
        // functions triggered only if the proper listen is done

        // no prefix

        on_filter_added: function(filter)
        {

        },

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_new_record: function(record)
        {
            console.log(record);
            
            var node = record.hostname;
			var slice = 'root';
			
			google.setOnLoadCallback(function() {
			
				var options = {
				  		pointSize: 2,
						lineWidth: 1,
				 		title: 'Slice '+slice+' last 24 hours', 'width':780, 'height':400,
					vAxes: { 
							0: {format: '###,##%'},
							1: {format: '#Kb',}
							},
					hAxis: { title: "", format: 'HH:mm'},
				    series: {
				        0: { type: "line", targetAxisIndex: 0},
				        1: { type: "line", targetAxisIndex: 0},
				        2: { type: "line", targetAxisIndex: 1},
				        3: { type: "line", targetAxisIndex: 1}
				    }
				};
			
				var jsonData = $.ajax({
				        type: 'POST',
				    	url: "/db/slice",
				    	dataType: "json",
				    	async: false,
				    	data: { period: 'day', resources: 'cpu,pmc_per,asb,arb', slice: slice, node: node },
				        success: function(ret) {
				        	var result = [];
				        	var data = new google.visualization.DataTable();
							data.addColumn('datetime', 'Date');
							data.addColumn('number', 'CPU (%)');
							data.addColumn('number', 'MEM (%)');
							data.addColumn('number', 'Traffic Sent (Kb)');
							data.addColumn('number', 'Traffic Received (Kb)');
							$.each(ret, function() {
								result.push([new Date(this[0]), this[1], this[2], this[3], this[4]]);
							});
							data.addRows(result);
							var chart = new google.visualization.LineChart(document.getElementById('graph'));
							chart.draw(data, options);
				        }
				    }).responseText;
			
			});
        },

        /* INTERNAL FUNCTIONS */
        _dummy: function() {
            // only convention, not strictly enforced at the moment
        },

    });

    /* Plugin registration */
    $.plugin('Slicestat', Slicestat);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
