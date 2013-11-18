var Senslab = {
  normalize: function(node) {
    var info;

    if (node.component_name) { // wsn430-11.devlille.iot-lab.info
      info = node.component_name.split(".");
    } else if (node.hrn) { // iotlab.a8-11\.devgrenoble\.iot-lab\.info
      var info = node.hrn.split("\\.");
      info[0] = info[0].split(".")[1];
    }

    if (info && info[2] == "iot-lab" && info[3] == "info") {
      node.arch = info[0].split("-")[0];
      node.id = info[0].split("-")[1];
      node.site = info[1];
      return true;
    } else {
      console.warn("could not normalize node :");
      console.warn(node);
      return false;
    }
  }
};

Senslab.Map = function() {
  var colors = {
    "Alive": 0x7FFF00,
    "Busy": 0x9943BE,
    "Suspected": 0xFF3030,
    "Selected": 0x0099CC
  };
  
  var archs = [
    "wsn430",
    "m3",
    "a8"
  ];
  
  function Map($container) {
    this.width  = 600;
    this.height = 400;
    
    this.distance = 50;
    this.phi = -100;
    this.theta = 0;
    this.onRot = false;
    
    this.pointerDetectRay = new THREE.Raycaster();
    this.pointerDetectRay.ray.direction.set(0, -1, 0);
    this.projector = new THREE.Projector();
    this.mouse2D = new THREE.Vector3(0, 0, 0);
    
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(this.width, this.height);
    
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
    
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    
    this.updatePosition();
    
    var self = this;
    
    this.nodes = {};
    this.$nodeInputs = {};
    
    $.each(archs, function(i, arch) {
      self.nodes[arch] = [];
      self.$nodeInputs[arch] = $("<input type='text' placeholder='" + arch + "'>")
      .appendTo($container)
      .change(function() {
        self.nodes[arch] = expand($(this).val());
        self.updateColor(arch);
      });
    });
    
    var $canvas = $(this.renderer.domElement)
    .mousemove(function(e) {
      self.mouse2D.x =  ((e.pageX - $canvas.offset().left) / $canvas.width()) * 2 - 1;
      self.mouse2D.y = -((e.pageY - $canvas.offset().top) / $canvas.height()) * 2 + 1;
      
      if (self.onRot) {
        self.theta -= e.pageX - self.mouse2D.pageX;
        self.phi += e.pageY - self.mouse2D.pageY;
        if (self.phi > 180)
          self.phi = 180;
        if (self.phi < -180)
          self.phi = -180;
        
        self.mouse2D.pageX = e.pageX;
        self.mouse2D.pageY = e.pageY;
        
        self.updatePosition();
        self.update();
      }
    }).mousedown(function(e) {
      e.preventDefault();
      switch (e.which) {
        case 1:
          self.pointerDetectRay = self.projector.pickingRay(self.mouse2D.clone(), self.camera);
          var intersects = self.pointerDetectRay.intersectObjects(self.scene.children);
          if (intersects.length > 0 && self.select(intersects[0].object)) {
            var node = intersects[0].object;
            var $nodeInput = self.$nodeInputs[node.arch];
            $nodeInput.val(factorize(self.nodes[node.arch]));
            self.update();
          }
          break;
        case 3:
          self.mouse2D.pageX = e.pageX;
          self.mouse2D.pageY = e.pageY;
          self.onRot = true;
          break;
      }
    }).mouseup(function(e) {
      e.preventDefault();
      switch (e.which) {
        case 3:
          self.onRot = false;
          break;
      }
    }).mouseleave(function(e) {
      self.onRot = false;
    }).mousewheel(function(e, delta) {
      e.preventDefault();
      self.distance += delta * 5;
      self.updatePosition();
      self.update();
    });
    
    $container.append($canvas);
  }
  
  function getCenter(nodes) {
    var xmin = 0, ymin = 0, zmin = 0;
    var xmax = 0, ymax = 0, zmax = 0;
    
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i].x > xmax) xmax = nodes[i].x;
      if (nodes[i].x < xmin) xmin = nodes[i].x;
      if (nodes[i].y > ymax) ymax = nodes[i].y;
      if (nodes[i].y < ymin) ymin = nodes[i].y;
      if (nodes[i].z > zmax) zmax = nodes[i].z;
      if (nodes[i].z < zmin) zmin = nodes[i].z;
    }
    return {x: (xmax + xmin) / 2, y: (ymax + ymin) / 2, z: (zmax + zmin) / 2};
  }
  
  function setColor(node) {
    node.material.color.setHex(colors[node.boot_state] || colors["Selected"]);
  }
  
  Map.prototype.addNodes = function(nodes) {
    var center = getCenter(nodes);
    var program = function(context) {
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    };
    
    for(var i = 0; i < nodes.length; ++i) {
      var material = new THREE.ParticleCanvasMaterial({program: program});
      var particle = new THREE.Particle(material);
      
      particle.id = nodes[i].id;
      particle.arch = nodes[i].arch;
      particle.boot_state = nodes[i].boot_state;
      particle.position.x = (nodes[i].x - center.x) * 10;
      particle.position.y = (nodes[i].y - center.y) * 10;
      particle.position.z = (nodes[i].z - center.z) * 10;
      particle.scale.x = particle.scale.y = 1;
      setColor(particle)
      this.scene.add(particle);
    }
    this.update();
  };
  
  Map.prototype.select = function(node) {
    if (node.boot_state == "Suspected") {
      return false;
    } else if (node.boot_state == "Alive") {
      var array = this.nodes[node.arch];
      array.push(parseInt(node.id));
      array.sort(nodeSort);
      node.boot_state = "Selected";
      setColor(node);
      return true;
    } else {
      var array = this.nodes[node.arch];
      var index = $.inArray(parseInt(node.id), array);
      index > -1 && array.splice(index, 1);
      node.boot_state = "Alive";
      setColor(node);
      return true;
    }
  };
  
  function factorize(nodes) {
    var factorized = [];
    var prev = 0;
    var intervalStart = 0;
    
    for (var i = 0; i < nodes.length; ++i) {
      if (intervalStart) {
        if (nodes[i] == prev + 1) {
          prev++;
        } else {
          factorized.push(intervalStart + "-" + prev);
          intervalStart = 0;
          prev = nodes[i];
        }
      } else {
        if (nodes[i] == prev + 1) {
          intervalStart = prev;
          prev++;
        } else {
          prev && factorized.push(prev);
          prev = nodes[i];
        }
      }
    }
    factorized.push(intervalStart ? intervalStart + "-" + prev : prev);
    return factorized.join(",");
  }
  
  function expand(input) {
    var factorized = input.split(",");
    var expanded = [];
    for (var i = 0; i < factorized.length; ++i) {
      var d = factorized[i].split("-");
      if (d.length == 2) {
        for (var j = parseInt(d[0]); j < parseInt(d[1]) + 1; j++) {
          expanded.push(j);
        }
      } else {
        expanded.push(parseInt(factorized[i]));
      }
    }
    expanded.sort(nodeSort);
    for (var i = 1; i < expanded.length; i++) {
      if (expanded[i] == expanded[i - 1]) {
        expanded.splice(i--, 1);
      }
    }
    return expanded;
  }
  
  function nodeSort(a, b) {
    return a - b;
  }
  
  Map.prototype.updateColor = function(arch) {
    var nodes = this.scene.children;
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i].arch == arch && nodes[i].boot_state != "Suspected") {
        var id = parseInt(nodes[i].id);
        var array = this.nodes[arch];
        nodes[i].boot_state = $.inArray(id, array) == -1 ? "Alive" : "Selected";
        setColor(nodes[i]);
      }
    }
    this.update();
  }
  
  Map.prototype.updatePosition = function() {
    this.camera.position.x = this.distance * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.camera.position.y = this.distance * Math.sin(this.phi * Math.PI / 360);
    this.camera.position.z = this.distance * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.camera.lookAt(this.scene.position);
    this.camera.updateMatrix();
  };
  
  Map.prototype.update = function() {
    this.renderer.render(this.scene, this.camera);
  };
  
  return Map;
}();