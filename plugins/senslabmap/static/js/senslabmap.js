(function($){
  var SensLabMap = Plugin.extend({
    init: function(options, element) {
      this._super(options, element);
      
      this.elmt().on('show', this, this.on_show);
      
      this.method = query.object;
      
      /* Setup query and record handlers */
      this.listen_query(options.query_uuid);
      this.listen_query(options.query_all_uuid, 'all');

      /* GUI setup and event binding */
      this.initialize_map();
    },
    
    initialize_map: function() {
      console.log("init toto");
      // TODO: this is static, retrieve directly nodes
      nodes = nodes_gre;
      init();
      parseNodebox();
    },

    refresh: function() {
      console.log("refresh");
      myrender();
    },
    
    on_show: function(e) {
      /* GUI setup and event binding */
      e.data.refresh();
    },
    
    on_all_new_record: function(record) {
      console.log("All New Record : " + record);
    },
    
    on_new_record: function(record) {
      console.log("New Record : " + record);
    },

    on_query_in_progress: function()
    {
      console.log('on_query_in_progress');
    },
    
    on_query_done: function()
    {
      console.log('on_query_done');
    },

    on_all_query_in_progress: function()
    {
      console.log('on_all_query_in_progress');
    },
    
    on_all_query_done: function()
    {
      console.log('on_all_query_done');
    }
  });
  $.plugin('SensLabMap', SensLabMap);
})(jQuery);
