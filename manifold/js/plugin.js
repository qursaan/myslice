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
        this.query_handler_prefix = (typeof prefix === 'undefined') ? '' : (prefix + '_');
        this.$element.on(manifold.get_query_channel(query_uuid), $.proxy(this._query_handler, this));
    },

    default_options: {},

    speak: function(msg){
        // You have direct access to the associated and cached jQuery element
        this.$element.append('<p>'+msg+'</p>');
    },

    register: function() {
        // Registers the plugin to jQuery
    },

});
