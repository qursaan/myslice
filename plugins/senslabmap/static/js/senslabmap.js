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
      this.nodes = [];
    },

    refresh: function() {
      console.log("refresh");
      myrender();
    },
    
    on_show: function(e) {
      e.data.refresh();
    },
    
    on_all_new_record: function(n) {
      // format is : [name, x, y, z, uid, state]
      // state = "Busy", "Alive" or "Down"
      node = [42, n.x, n.y, n.z, "bb40", "Alive"];
      this.nodes.push(node);
    },
    
    on_all_query_done: function() {
      nodes = this.nodes;
      init();
      parseNodebox();
    }
  });
  $.plugin('SensLabMap', SensLabMap);
})(jQuery);
