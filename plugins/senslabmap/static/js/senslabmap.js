(function($){
  var SensLabMap = Plugin.extend({
    init: function(options, element) {
      this._super(options, element);
      
      /* Member variables */
      // query status
      this.received_all = false;
      this.received_set = false;
      this.in_set_buffer = Array();
      
      this.el().on('show', this, this.on_show);
      
      var query = manifold.query_store.find_analyzed_query(options.query_uuid);
      this.method = query.object;
      
      var keys = manifold.metadata.get_key(this.method);
      this.key = (keys && keys.length == 1) ? keys[0] : null;
      
      /* Setup query and record handlers */
      this.listen_query(options.query_uuid);
      this.listen_query(options.query_uuid, 'all');
      
      /* GUI setup and event binding */
      this.initialize_map();
    },
    
    initialize_map: function() {
      // TODO: this is static, retrieve directly nodes
      nodes = nodes_gre;
      init();
      parseNodebox();
    },
    
    on_show: function(e) {
      // TODO
    },
    
    on_filter_added: function(filter) {
      console.log(filter);
    },
    
    on_new_record: function(record) {
      console.log(record);
    },
    
    on_record_received: function(record) {
      console.log(record);
    },
  });
  $.plugin('SensLabMap', SensLabMap);
})(jQuery);
