(function($){
  var SensLabMap = Plugin.extend({
    init: function(options, element) {
      this._super(options, element);
      
      this.elmt().on('show', this, this.on_show);
      
      this.method = query.object;
      
      /* Setup query and record handlers */
      this.listen_query(options.query_uuid);
      this.listen_query(options.query_all_uuid, 'all');

      this.sites = [];
      this.nodes = {};
    },
    
    refresh: function() {
      console.log("refresh");
    },
    
    on_show: function(e) {
      e.data.refresh();
    },
    
    on_all_new_record: function(node) {
      Senslab.normalize(node);
      var site = node.site;
      if (site) {
        if ($.inArray(site, this.sites) == -1) {
          this.sites.push(site);
          this.nodes[site] = [];
        }
        this.nodes[site].push(node);
      } else {
        console.warn(node);
        console.warn("-> has no site");
      }
    },
    
    on_all_query_done: function() {
      var
        self = this,
        maps = {},
        $container = $('#maps-container');
  
      $.each(this.sites, function(i, site) {
        var $div = $("<div />").appendTo($container);
        maps[site] = new Senslab.Map($div);
        maps[site].addNodes(self.nodes[site]);
      });
    }
  });
  $.plugin('SensLabMap', SensLabMap);
})(jQuery);
