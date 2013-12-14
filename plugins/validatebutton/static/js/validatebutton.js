// first application is for the 'validation' button in the topmenu
// if the subject query is non empty, then we turn on the subject button
// that is provided through button_domid

(function($){

    var debug=false;
    debug=true

    var ValidateButton = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);
            this.listen_query(options.query_uuid);
	    this.triggered=false;
	},

	// we have received at least one answer: we'll do something
	on_new_record: function (record) {
	    // we only need to act on the first record
	    if (this.triggered) return;
	    if (debug) messages.debug("validatebutton.on_query_done - turning on "+this.options.button_domid);
	    $('#'+this.options.button_domid).removeClass('disabled');
	    this.triggered=true;
        },
	// for reference only, since there is nothing we need to do at this point
	on_query_done: function() {
	},
    });

    $.plugin('ValidateButton', ValidateButton);

})(jQuery);
