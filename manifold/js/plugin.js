// INHERITANCE
// http://alexsexton.com/blog/2010/02/using-inheritance-patterns-to-organize-large-jquery-applications/
// We will use John Resig's proposal

// http://pastie.org/517177

// NOTE: missing a destroy function

$.plugin = function(name, object) {
    $.fn[name] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var instance = $.data(this, name);
            if (instance) {
                instance[options].apply(instance, args);
            } else {
                instance = $.data(this, name, new object(options, this));
            }
        });
    };
};

var Plugin = Class.extend({

    init: function(options, element)
    {
        // Mix in the passed in options with the default options
        this.options = $.extend({}, this.default_options, options);

        // Save the element reference, both as a jQuery
        // reference and a normal reference
        this.element  = element;
        this.$element = $(element);

        // return this so we can chain/use the bridge with less code.
        return this;
    },

    has_query_handler: function() {
        return (typeof this.on_filter_added === 'function');
    },

    _query_handler: function(e, event_type, data)
    {
        // We suppose this.query_handler_prefix has been defined if this
        // callback is triggered    
        var fn;
        switch(event_type) {
            case FILTER_ADDED:
                fn = 'filter_added';
                break;
            case FILTER_REMOVED:
                fn = 'filter_removed';
                break;
            case CLEAR_FILTERS:
                fn = 'filter_clear';
                break;
            case FIELD_ADDED:
                fn = 'field_added';
                break;
            case FIELD_REMOVED:
                fn = 'field_removed';
                break;
            case CLEAR_FIELDS:
                fn = 'field_clear';
                break;
            default:
                return;
        } // switch
        
        fn = 'on_' + this.query_handler_prefix + fn;
        if (typeof this[fn] === 'function') {
            // call with data as parameter
            // XXX implement anti loop
            this[fn](data);
        }
    },

    listen_query: function(query_uuid, prefix) {
        this.query_handler_prefix = (typeof prefix === 'undefined') ? '' : (prefix + manifold.separator);
        this.$element.on(manifold.get_query_channel(query_uuid), $.proxy(this._query_handler, this));
    },

    default_options: {},

    /* Helper functions for naming HTML elements (ID, classes), with support for filters and fields */

    id: function()
    {
        var ret = this.options.plugin_uuid;
        for (var i = 0; i < arguments.length; i++) {
            ret = ret + manifold.separator + arguments[i];
        }
        return ret;
    },

    el: function()
    {
        if (arguments.length == 0) {
            return $('#' + this.id());
        } else {
            // We make sure to search _inside_ the dom tag of the plugin
            return $('#' + this.id.apply(this, arguments), this.el());
        }
    },

    els: function(cls)
    {
        return $('.' + cls, this.el());
    },

    id_from_filter: function(filter, use_value)
    {
        use_value = typeof use_value !== 'undefined' ? use_value : true;

        var key    = filter[0];
        var op     = filter[1];
        var value  = filter[2];
        var op_str = this.getOperatorLabel(op);
        var s      = manifold.separator;

        if (use_value) {
            return 'filter' + s + key + s + op_str + s + value;
        } else {
            return 'filter' + s + key + s + op_str;
        }
    },

    str_from_filter: function(filter)
    {
        return filter[0] + ' ' + filter[1] + ' ' + filter[2];
    },

    array_from_id: function(id)
    {
        var ret = id.split(manifold.separator);
        ret.shift(); // remove plugin_uuid at the beginning
        return ret;
    },

    id_from_field: function(field)
    {
        return 'field' + manifold.separator + field;
    },

    field_from_id: function(id)
    {
        var array;
        if (typeof id === 'string') {
            array = id.split(manifold.separator);
        } else { // We suppose we have an array ('object')
            array = id;
        }
        // array = ['field', FIELD_NAME]
        return array[1];
    },

});
