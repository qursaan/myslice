(function($){
  var SensLabMap = Plugin.extend({
    init: function(options, element) {
      this._super(options, element);
      
      this.elmt().on('show', this, this.on_show);

      var query = manifold.query_store.find_analyzed_query(options.query_uuid);
      this.method = query.object;
      this.key = manifold.metadata.get_key(this.method);
      
      /* Setup query and record handlers */
      this.listen_query(options.query_uuid);
      this.listen_query(options.query_all_uuid, 'all');

      this.sites = [];
      this.nodes = {};
    },
    
    on_show: function(e) {
      e.data.refresh();
    },
    
    on_all_new_record: function(node) {
      Senslab.normalize(node, this.key);
      if (node.normalized) {
        var site = node.site;
        if ($.inArray(site, this.sites) == -1) {
          this.sites.push(site);
          this.nodes[site] = [];
        }
        this.nodes[site].push(node);
      } else {
        console.warn("node has no site:");
        console.warn(node);
      }
    },
    
    on_all_query_done: function() {
      var self = this;
      
      Senslab.createMaps($('#maps-container'), this.sites, this.nodes);
      Senslab.notify = function(node) {
        manifold.raise_event(self.options.query_uuid,
                             node.boot_state == "Alive" ? SET_REMOVED : SET_ADD,
                             node[self.key]
                            );
      }
    }
  });
  $.plugin('SensLabMap', SensLabMap);
})(jQuery);
