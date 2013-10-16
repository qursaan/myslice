// Various global variables
var mouseX = 0, mouseY = 0, camera, scene, renderer, projector;

// Camera parameters
var phi = -100, theta = 0, distance = 130;

// graphical nodes
var objects = [];

// list of selected nodes
var selectedNodes = [];

var div3d, nodebox, infobox;

function onResize() {
  renderer.setSize(div3d.offsetWidth, div3d.offsetHeight);
  camera.aspect = div3d.offsetWidth / div3d.offsetHeight;
  camera.updateProjectionMatrix();
  myrender();
}

function getCenter(nodes) {
  var xmin = 0, ymin = 0, zmin = 0;
  var xmax = 0, ymax = 0, zmax = 0;
  
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i][1] > xmax) xmax = nodes[i][1];
    if (nodes[i][1] < xmin) xmin = nodes[i][1];
    if (nodes[i][2] > ymax) ymax = nodes[i][2];
    if (nodes[i][2] < ymin) ymin = nodes[i][2];
    if (nodes[i][3] > zmax) zmax = nodes[i][3];
    if (nodes[i][3] < zmin) zmin = nodes[i][3];
  }
  return {x: (xmax + xmin) / 2, y: (ymax + ymin) / 2, z: (zmax + zmin) / 2};
}

function debugaxis(axisLength) {
  var v = function(x, y, z) {
    return new THREE.Vertex(new THREE.Vector3(x, y, z));
  }
  
  var createAxis = function (p1, p2, color) {
    var lineGeometry = new THREE.Geometry();
    var lineMat = new THREE.LineBasicMaterial({ color: color, lineWidth: 2 });
    lineGeometry.vertices.push(p1, p2);
    var line = new THREE.Line(lineGeometry, lineMat);
    scene.add(line);
  }
  
  createAxis(v(0, 0, 0), v(axisLength, 0, 0), 0xFF0000);
  createAxis(v(0, 0, 0), v(0, axisLength, 0), 0x00FF00);
  createAxis(v(0, 0, 0), v(0, 0, axisLength), 0x0000FF);
};

function drawNodes(nodes) {
  var geometry = new THREE.Geometry();
  var center = getCenter(nodes);
  
  onResize();
  for (var i = 0; i < nodes.length; i++) {
    var material = new THREE.ParticleCanvasMaterial({
      color: 0xffffff,
      program: function (context) {
        context.beginPath();
        context.arc(0, 0, 1, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      }
    });
    var particle = new THREE.Particle(material);
    particle.name = nodes[i][0];
    particle.position.x = nodes[i][1] - center.x;
    particle.position.y = nodes[i][2] - center.y;
    particle.position.z = nodes[i][3] - center.z;
    particle.uid = nodes[i][4];
    particle.state = nodes[i][5];
    particle.position.multiplyScalar(10);
    particle.scale.x = particle.scale.y = 1;
    scene.add(particle);
    
    var vertex = new THREE.Vertex(particle.position);
    geometry.vertices.push(vertex);
    objects.push(particle)
    
    debugaxis(10);
    myrender();
  }
}

function init(nodes) {
  div3d = document.getElementById('div3d');
  nodebox = document.getElementById('nodebox');
  infobox = document.getElementById('infobox');
  
  infobox.innerHTML = 'Node info : ';
  nodebox.value = "";
  
  camera = new THREE.PerspectiveCamera(75, div3d.offsetWidth / div3d.offsetHeight, 1, 10000);
  scene = new THREE.Scene();
  renderer = new THREE.CanvasRenderer();
  projector = new THREE.Projector();
  
  div3d.appendChild(renderer.domElement);
  
  window.addEventListener('resize', onResize, false);
  scene.add(camera);
  
  nodebox.onkeyup = parseNodebox;
  
  div3d.onmousedown = OnMouseDown;
  div3d.onmouseup = OnMouseUp;
  div3d.onmousemove = displayNodeInfo;
  if (div3d.addEventListener) {
    div3d.addEventListener('DOMMouseScroll', wheel, false); // mozilla
  }
  div3d.onmousewheel = wheel; // IE & Opera
}

function sortfunction(a, b) {
  return (a - b) //causes an array to be sorted numerically and ascending
}

// factorize the expanded list in selectedNode to produce dash intervals
// 1,2,3,5,9  -> 1-3,5,9
function factorize() {
  var fact = [];
  var previous = 0;
  var intervalStart = 0;
  selectedNodes.sort(sortfunction);
  for (j = 0; j < selectedNodes.length; j++) {
    if (intervalStart) {
      // we are in an interval
      if (selectedNodes[j] == previous + 1) {
        // interval grows
        previous += 1;
      } else {
        // end of interval
        fact.push(intervalStart + "-" + previous);
        intervalStart = 0;
        previous = selectedNodes[j];
      }
    } else {
      // we are not in an interval
      if (selectedNodes[j] == previous + 1) {
        // let's begin an interval
        intervalStart = previous;
        previous += 1;
      } else {
        if (previous) {
          fact.push(previous);
        }
        previous = selectedNodes[j];
      }
    }
  } // for end
  // at the end of the loop, two cases
  // we were still in an interval, then add it to the result
  // we were not in an interval, then add the last selectednode (previous)
  if (intervalStart) {
    fact.push(intervalStart + "-" + previous);
  } else if (previous) {
    fact.push(previous);
  }
  return fact;
}

// expand a list of nodes containing dash intervals
// 1-3,5,9 -> 1,2,3,5,9
function expand(input) {
  var factorized = input.split(",");
  var expanded = [];
  for (var i = 0; i < factorized.length; i++) {
    var d = factorized[i].split("-");
    if (d.length == 2) {
      for (var j = parseInt(d[0]); j < parseInt(d[1]) + 1; j++) {
        expanded.push(j);
      }
    } else {
      expanded.push(parseInt(factorized[i]));
    }
  }
  expanded.sort(sortfunction);
  for (var i = 1; i < expanded.length; i++) {
    if (expanded[i] == expanded[i - 1]) {
      expanded.splice(i--, 1);
    }
  }
  return expanded;
}

function parseNodebox() {
  selectedNodes = expand(nodebox.value);
  myrender();
}

// set the camera position according two angles theta and phi and the distance
// and display the scene
function myrender() {
  camera.position.x = distance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
  camera.position.y = distance * Math.sin(this.phi * Math.PI / 360);
  camera.position.z = distance * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
  camera.lookAt(scene.position);
  camera.updateMatrix();
  
  for (i = 0; i < objects.length; i++) {
    if (selectedNodes.indexOf(objects[i].name) != -1) {
      objects[i].material.color.setHex(0x0099CC);
    } else {
      if (objects[i].state == "Busy") {
        objects[i].material.color.setHex(0x9943BE);
      } else if (objects[i].state == "Alive") {
        objects[i].material.color.setHex(0x7FFF00);
      } else {
        objects[i].material.color.setHex(0xFF3030);
      }
    }
  }
  renderer.render(scene, camera);
}

// rigthbutton is used for rotations
function onDocumentMouseMoveRot(event) {
  var NewmouseX = event.clientX;
  var NewmouseY = event.clientY;
  var DeltaX = NewmouseX - mouseX;
  var DeltaY = NewmouseY - mouseY;
  
  mouseX = NewmouseX;
  mouseY = NewmouseY;
  
  theta -= DeltaX;
  phi += DeltaY;
  if (phi > 180) phi = 180;
  if (phi < -180) phi = -180;
  myrender();
}
// mousewheel is used for zoom
function Zoom(delta) {
  distance += delta * 5;
  myrender();
}

// return the graphical node under the mouse
function findNodeUnderMouse(event) {
  var x, y, z;
  
  event.preventDefault();
  
  x = ((event.clientX - div3d.offsetLeft) / div3d.offsetWidth) * 2 - 1;
  y = -((event.clientY - div3d.offsetTop) / div3d.offsetHeight) * 2 + 1;
  z = 0.5;
  
  var vector = new THREE.Vector3(x, y, z);
  projector.unprojectVector(vector, camera);
  
  var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
  var intersects = ray.intersectObjects(objects);
  
  if (intersects.length > 0) {
    return intersects[0];
  } else {
    return null;
  }
}

// display some info of the node under the mouse
function displayNodeInfo(e) {
  obj = findNodeUnderMouse(e);
  if (obj) {
    infobox.innerHTML = 'Node info : number ' + obj.object.name + " with id " + obj.object.uid;
  }
}

// select/unselect nodes
function toggleNode(obj) {
  var nodeId = obj.object.name;
  var index = selectedNodes.indexOf(nodeId);
  
  if (index == -1) {
    selectedNodes.push(nodeId);
  } else {
    selectedNodes.splice(index, 1);
  }
  nodebox.value = factorize().join(",");
  myrender();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mouse handling functions
//
function OnMouseDown(e) {
  var clickType = 'LEFT';
  if (e.type != 'mousedown') return true
    if (e.which) {
      if (e.which == 3) clickType = 'RIGHT';
      if (e.which == 2) clickType = 'MIDDLE';
      //infobox.innerHTML = clickType + " - Cam Pos = " + camera.position.x + "," + camera.position.y + "," + camera.position.z;
    }
    mouseX = e.clientX;
  mouseY = e.clientY;
  if (clickType == 'RIGHT') {
    document.onmousemove = onDocumentMouseMoveRot;
  }
  if (clickType == 'LEFT') {
    obj = findNodeUnderMouse(e);
    if (obj != null) toggleNode(obj);
  }
}

function OnMouseUp(e) {
  document.onmousemove = displayNodeInfo;
}

// This function was taken here : http://www.adomas.org/javascript-mouse-wheel/
// Event handler for mouse wheel event.

function wheel(event) {
  var delta = 0;
  if (!event) /* For IE. */
    event = window.event;
  if (event.wheelDelta) { /* IE/Opera. */
    delta = event.wheelDelta / 120;
  } else if (event.detail) { /** Mozilla case. */
    /** In Mozilla, sign of delta is different than in IE.
     * Also, delta is multiple of 3.
     */
    delta = -event.detail / 3;
  }
  /** If delta is nonzero, handle it.
   * Basically, delta is now positive if wheel was scrolled up,
   * and negative, if wheel was scrolled down.
   */
  if (delta)
    Zoom(delta);
  /** Prevent default actions caused by mouse wheel.
   * That might be ugly, but we handle scrolls somehow
   * anyway, so don't bother here..
   */
  if (event.preventDefault)
    event.preventDefault();
  event.returnValue = false;
}
