/**
 * TestbedsPlugin: List of testbeds plugin
 * Version:     0.1
 * Description: TODO -> generalize to a list of possible filters
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Loïc Baron <loic.baron@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

(function($){

    var ApplyPlugin = Plugin.extend({

        /** 
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element)
        {
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);
        },


    })

    /* Plugin registration */
    $.plugin('ApplyPlugin', ApplyPlugin);

})(jQuery);
