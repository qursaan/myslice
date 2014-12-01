/**
 * univbristopo:    ofelia openflow topology plugin
 * Version:         3.0
 * Description:     plugin to view ofelia topology in myslice
 * Requires:        js/plugin.js
 * URL:             http://www.myslice.info
 * Author:          Frederic Francois <f.francois@bristol.ac.uk>
 * Copyright:       Copyright 2013-2014 Bristol University
 * License:         GPLv3
 */

(function($){

    d3_nodes=[];
    d3_links=[];
    links_list=[];
    d=2;
    window.query_itr=0;
    topoviewer_state={mode:"edit",link_type:"non-optical"};
    //svg=d3;

    var UnivbrisTopo = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);
            this.listen_query(options.query_uuid);
	    jQuery('#topo_plugin').hide();
	    //console.log("topo init called");
        },

	new_record: function(record)
        {
	    var urn = record['urn'];
            var pos = urn.search('link');
	    
	    if (pos!=-1){
		    var link = urn.substring(pos+5);
		    pos = link.search("_");
		    var head_node=link.substring(0,pos);
		    link=link.substring(pos+1);
		    pos = link.search("_");
		    var head_port=link.substring(0,pos);
		    link=link.substring(pos+1);
		    pos = link.search("_");
		    var tail_node=link.substring(0,pos);
		    link=link.substring(pos+1);
		    var tail_port=link;

		    var link_type=0;
		    if (urn.search('opticalpacket')!=-1){
			link_type=4;
		    }
		    else if (urn.search('optical')!=-1){
			link_type=1;
		    }
		    else if (urn.search('compute')!=-1){
			link_type=2;
		    }
		    else if (urn.search('federation')!=-1){
			link_type=3;
		    }
		    

		    //get island name
		    pos = urn.search('ofam');
		    var testbed=urn.substring(pos+5);
		    testbed=testbed.substring(0, testbed.search('link')-1);

		    switch (link_type){
			case 0:
			   var src_id=addNode(head_node,testbed,"packet");
			   var dst_id=addNode(tail_node,testbed,"packet");
			   //var tmp_link={};
			   addLink(src_id,dst_id,head_port,tail_port,urn);
			   /*tmp_link['source']=src_id;
			   tmp_link['target']=dst_id;
                           tmp_link['src_port']=head_port;
			   tmp_link['dst_port']=tail_port;
			   tmp_link['value']=urn;
			   d3_links.push(tmp_link);*/
			   break;

			case 1:
			   var src_id=addNode(head_node,testbed,"optical");
			   var dst_id=addNode(tail_node,testbed,"optical");
			   //var tmp_link={};
			   addLink(src_id,dst_id,head_port,tail_port,urn);
			   /*tmp_link['source']=src_id;
			   tmp_link['target']=dst_id;
			   tmp_link['src_port']=head_port;
			   tmp_link['dst_port']=tail_port;
			   tmp_link['value']=urn;
			   d3_links.push(tmp_link);*/
			   break;

			case 2:
			   var src_id=addNode(head_node,testbed,"packet");
			   var dst_id=addNode(tail_node,testbed,"compute");
			   //var tmp_link={};
			   addLink(src_id,dst_id,head_port,tail_port,urn);
			   /*tmp_link['source']=src_id;
			   tmp_link['target']=dst_id;
			   tmp_link['src_port']=head_port;
			   tmp_link['dst_port']=tail_port;
			   tmp_link['value']=urn;
			   d3_links.push(tmp_link);*/
			   break;

			case 3:
			   var src_id=addNode(head_node,testbed,"federation");
			   var dst_id=addNode(tail_node,testbed,"packet");
			   //var tmp_link={};
			   addLink(src_id,dst_id,head_port,tail_port,urn);
			   /*tmp_link['source']=src_id;
			   tmp_link['target']=dst_id;
			   tmp_link['src_port']=head_port;
			   tmp_link['dst_port']=tail_port;
			   tmp_link['value']=urn;
			   d3_links.push(tmp_link);*/
			   break;

			case 4:
			   var src_id=addNode(head_node,testbed,"optical");
			   var dst_id=addNode(tail_node,testbed,"packet");
			   //var tmp_link={};
			   addLink(src_id,dst_id,head_port,tail_port,urn);
			   /*tmp_link['source']=src_id;
			   tmp_link['target']=dst_id;
			   tmp_link['src_port']=head_port;
			   tmp_link['dst_port']=tail_port;
			   tmp_link['value']=urn;
			   d3_links.push(tmp_link);*/
			   break;
		    }
	    }
        },

	on_new_record: function(record)
        {
	   //if (query_itr=2){
            this.new_record(record);
	   //}
        },


	on_query_done: function()
	{
	  query_itr=query_itr+1;
	  if (query_itr==2){
		return;
	  }
	  //console.log("graph all done called:"+query_itr);
	  describeNodes();
	  calLinkNum();
          //console.log(d3_links);
	  //if (query_itr=2){
	  //$("#univbris_welcome").hide();
	  //jQuery("#univbris_flowspace_selection").show();
	  //$("#link_zoom_in").click(zoomIn(0.25));
	  /* d3 data */

	

	  var nIslands=1, //replace
    	      pad = 5,
              width = parseInt($("#topo_plugin_width").css("width")); //800,//parseInt($("#topologyContainer").css("width")), /* Obtain width from container */
              if(width==0){width=800;} 
              height = 400;

	  //Islands area generation
	  var p = width/height
              ny = Math.sqrt(nIslands/p),
              nx = Math.ceil(p*ny),
              ny = Math.ceil(ny),
              foci = [];

	  if (nx*ny > nIslands){
		if (nx > ny && (nx-1)*ny >= nIslands)
		nx--;
		else if( nx <= ny && nx*(ny-1) >= nIslands)
		ny--;
	  }

	  var aw = Math.floor((width-(nx+1)*pad)/nx),
              ah = Math.floor((height-(ny+1)*pad)/ny);

	  for (i=0; i<nIslands; i++){
        	tx0 = pad + (pad + aw)*(Math.floor(i%nx));
        	ty0 = pad + (pad + ah)*(Math.floor(i/nx));
		foci[i] = {x0: tx0, x1: tx0 + aw, y0: ty0, y1: ty0 + ah};
	  }


	  function randomXToY(minVal,maxVal,floatVal){
  		var randVal = minVal+(Math.random()*(maxVal-minVal));
  		return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
	  };

	  function pEllipse(set){
		function getDistance(p){
                	return Math.pow((p[0]-cx),2)/Math.pow(rx,2) + Math.pow((p[1]-cy),2)/Math.pow(ry,2);
        	};

        	d = 2;

        	try {
	    		cx = (set.x1 + set.x0)/2;
	    		rx = ((set.x1 - set.x0)/2 + (set.y1 - set.y0)/2)/2;
	    		cy = (set.y1 + set.y0)/2;
	    		ry = (set.y1 - set.y0)/2;
	
	    		while (d>1) {
        			p = [randomXToY(set.x0, set.x1), randomXToY(set.y0, set.y1) ];
				d = getDistance(p);	
	    		}
        	} catch(err) {
            		p = [];
        	}

		return p;
	  };


	 var epoints= [];
	  for (i=0;i<d3_nodes.length;i++){
		epoints.push(foci[d3_nodes[i]['group']]);

	  };
          
          var data = {};

	  var nodes=[];

	  //console.log("nodes");
	  //console.log(d3_nodes);
	  //console.log("links");
	  //console.log(d3_links);

	  for (i=0;i<d3_nodes.length;i++){
		var node={};
		node['nodeValue']=d3_nodes[i].nodeValue;
		node['nodeName']=d3_nodes[i].nodeName;
		node['image']=d3_nodes[i].image;
		node['color']= "";
		node['group']=d3_nodes[i].group;
		node['location']=d3_nodes[i].location;
		node['description']= d3_nodes[i].description;
		node['fixed']= false;
		node['radius']= 10;
		if (d3_nodes[i].type == "compute"){
			node['type']=d3_nodes[i].type + " server";
		}
		else{
			node['type']=d3_nodes[i].type + " switch";
		}
		node['available']= d3_nodes[i].available;
		nodes.push(node);
	  };

	  data["nodes"]=nodes;

	  var links=[];
	  for (i=0;i<d3_links.length;i++){
		var link={};
		link['source']= d3_links[i].source;
		link['target']= d3_links[i].target;
		link['value']= d3_links[i].value;
		link['linknum']=d3_links[i].linknum;
		links.push(link);
	  }

	 data["links"]=links;


	function getLinkStyle(d, attr){
		//rsc_ids = d.value.split("-");
		//console.log('link with: '+d.value+" event"); 
		//console.log("getlinkstyle attr:",attr);
		//console.log("topoviewer_state:",topoviewer_state);
	
		//console.log(d);
		if (topoviewer_state.mode!="edit"){
			
			return	null;
		}


		if(d.value.search("optical")!=-1 && topoviewer_state.link_type=="optical"){ //link is optical
			//if(topoviewer_state.link_type=="optical"){
				if(attr=="click"){
		 			  var port_table=$("#univbris_foam_ports_selection__table").dataTable();
					  var nodes = $('input',port_table.fnGetNodes());
					  var checked=false;

					  for(i=0;i<nodes.length;i++){
							if (nodes[i].id==d.value){
								nodes[i].checked=!nodes[i].checked;
								checked=nodes[i].checked;
								break;
							}
					  };


					  if (checked==true){
						var values = {'stroke': 'black', 'stroke-width': '5px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					  else{
						var values = {'stroke': '#ccc', 'stroke-width': '4px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }

				}else if(attr=="mouseover"){
			
					var values = {'stroke': 'blue', 'stroke-width': '4px' };
					//console.log("in mouseover return"+ JSON.stringify(values));
					return JSON.stringify(values);
				}else{
			
					/*
					if( ($(":checkbox#"+rsc_ids[0]+":checked").length && rsc_ids[1].indexOf("eth") != -1) ||($(":checkbox#"+rsc_ids[0]+":checked").length && $(":checkbox#"+rsc_ids[1]+":checked").length)){
						if (attr == "stroke")
						        return "#666";
						else
						        return 2;
					}else{
						if (attr == "stroke")
						        return "#ccc";
						else
						        return 2;
					//}
					*/

					var port_table=$("#univbris_foam_ports_selection__table").dataTable();
					var nodes = $('input',port_table.fnGetNodes());
					var checked=false;

					for(i=0;i<nodes.length;i++){
							if (nodes[i].id==d.value){
								//nodes[i].checked=!nodes[i].checked;
								checked=nodes[i].checked;
								break;
							}
					};

					if (checked==true){
						var values = {'stroke': 'black', 'stroke-width': '5px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					  else{
						var values = {'stroke': '#ccc', 'stroke-width': '4px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					//return {'stroke': '#ccc', 'stroke-width': '2px' };
				}
			//}
			//else{
			//	return	d.style;
			//}

		}
		else{//link is not optical
			if(topoviewer_state.link_type=="non-optical" && !(d.value.search("opticalpacket")==-1 && d.value.search("optical")!=-1) ){
				if(attr=="click"){
		 			  var port_table=$("#univbris_foam_ports_selection__table").dataTable();
					  var nodes = $('input',port_table.fnGetNodes());
					  var checked=false;

					  for(i=0;i<nodes.length;i++){
							if (nodes[i].id==d.value){
								nodes[i].checked=!nodes[i].checked;
								checked=nodes[i].checked;
								break;
							}
					  };


					  if (checked==true){
						var values = {'stroke': 'black', 'stroke-width': '5px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					  else{
						var values = {'stroke': '#ccc', 'stroke-width': '4px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }

				}else if(attr=="mouseover"){
			
					var values = {'stroke': 'blue', 'stroke-width': '4px' };
					//console.log("in mouseover return"+ JSON.stringify(values));
					return JSON.stringify(values);
				}else{
			
					/*
					if( ($(":checkbox#"+rsc_ids[0]+":checked").length && rsc_ids[1].indexOf("eth") != -1) ||($(":checkbox#"+rsc_ids[0]+":checked").length && $(":checkbox#"+rsc_ids[1]+":checked").length)){
						if (attr == "stroke")
						        return "#666";
						else
						        return 2;
					}else{
						if (attr == "stroke")
						        return "#ccc";
						else
						        return 2;
					//}
					*/

					var port_table=$("#univbris_foam_ports_selection__table").dataTable();
					var nodes = $('input',port_table.fnGetNodes());
					var checked=false;

					for(i=0;i<nodes.length;i++){
							if (nodes[i].id==d.value){
								//nodes[i].checked=!nodes[i].checked;
								checked=nodes[i].checked;
								break;
							}
					};

					if (checked==true){
						var values = {'stroke': 'black', 'stroke-width': '5px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					  else{
						var values = {'stroke': '#ccc', 'stroke-width': '4px' };
						//console.log("in mouseover return"+ JSON.stringify(values));
						return JSON.stringify(values);
					  }
					//return {'stroke': '#ccc', 'stroke-width': '2px' };
				}
			}
			else{
				return	null;
			}
			
		}
	
	};

	function getBaseNodeColor(d){
		var group = 0;
		group = d.group;
		return d3.rgb(d.color.toString().toString()).darker(.15*group);
	};

	function getNodeCircleStyle(d, attr){
		selected_len =0;// $(":checkbox:checked.node_id_"+d.nodeValue).length;
		all_len = 0;//$(":checkbox:.node_id_"+d.nodeValue).length;
		//selected_server = $(".server_node_"+d.nodeValue+".connected").length;
		if(attr == "drag"){
		        return d3.rgb(d.color.toString()).brighter(5);
		}else if(attr=="click"){
			 if(selected_len == all_len) {
		                $(":checkbox:checked.node_id_"+d.nodeValue).click();
				return getBaseNodeColor(d);
		         }else{
		                $(":checkbox:not(:checked).node_id_"+d.nodeValue).click();
				return d3.rgb(d.color.toString()).darker(5);
		        }
		}else if (attr == "dragstop" && selected_len == 0){
			return getBaseNodeColor(d);
		}else{
		                if (attr == "fill"){
		                        return getBaseNodeColor(d);
		                } else{
					if (selected_len != 0){
			                        return d3.rgb(d.color.toString()).darker(5);
					}else{
						return getBaseNodeColor(d);
					}
		                }
		}
	};

	function getNodesIsland(d){
		var nNodes = 0;
		data.nodes.forEach(function(o, i){
		   if(o.group == d){
	     		nNodes++;
		   }
		});
	    return nNodes;
	};

	 cur_zoom = 1;
    	 zoom_in_active = false;
    	 zoom_out_active = false;

	
	function zoomIn(zoom){
	    if(zoom_in_active == false && zoom_out_active == false){
		$("#link_zoom_in img").css("background-color", "#666");
		cur_zoom = cur_zoom + zoom;
		zoom_in_active = true;
	    }

	    else if(zoom_in_active == true){
		cur_zoom = cur_zoom - zoom;
		$("#link_zoom_in img").css("background-color", "");
		$("#target, svg, g").css("cursor", "move");
		zoom_in_active = false;
	    }

	    else{
		cur_zoom = cur_zoom + zoom + zoom;
		$("#link_zoom_out img").css("background-color", "");
		$("#link_zoom_in img").css("background-color", "#666");
		zoom_out_active = false;
		zoom_in_active = true;
	    }
	};


	function zoomOut(zoom){
	    if(zoom_out_active == false && zoom_in_active == false){
		if((cur_zoom - zoom) >0){
		    $("#link_zoom_out img").css("background-color", "#666");
		    cur_zoom = cur_zoom - zoom;
		    zoom_out_active = true;
		}
		else{
		    $("#target, svg, g").css("cursor", "move");
		}
	    }	
	    else if(zoom_out_active == true){
		cur_zoom = cur_zoom + zoom;
		$("#link_zoom_out img").css("background-color", "");
		$("#target, svg, g").css("cursor", "move");
		zoom_out_active = false;
	    }

	    else{
		cur_zoom = cur_zoom - zoom;
		zoom_out_active = false;
		$("#link_zoom_in img").css("background-color", "");
		if((cur_zoom - zoom) > 0){
		    $("#link_zoom_out img").css("background-color", "#666");
		    zoom_out_active = true;
		}
		else{
		    $("#target, svg, g").css("cursor", "move");
		}
	    }
	};

	function zoomReset(){
	    cur_zoom = 0.99;
	    posx = 0;
	    posy = 0;
	    return redraw();
	};

	

	function click(){
	    //console.log('into target clicked with zoomin:'+zoom_in_active);
	    
	    if (zoom_in_active == true || zoom_out_active == true){
		var mouseClick = d3.mouse(this);
		_x = -mouseClick[0]/2;
		_y = -mouseClick[1]/2;
		if(zoom_out_active == true){
		    _x = -_x/2;
		    _y = -_y/2;
		}
		posx += _x;
		posy += _y;
		zoom_in_active = false;
		zoom_out_active = false;
		return redraw();
	    }
	};

	$('#target').click(function(){
		//console.log('target clicked');
		click();
	});

	function redraw() {
		//  trans=[(Math.round(width/cur_zoom) - width)/2, (Math.round(height/cur_zoom) - height)/2];
		    trans = [posx, posy];
		    svg.transition()
		       .duration(500)
		       .attr('x', function(d){ return d.x; })
		       .attr('y', function(d){ return d.y; })
		       .attr("transform", 
			    "translate(" + trans +")"
			    + "scale(" + cur_zoom + ")");
		   $("#link_zoom_in img").css("background-color","");
		   $("#link_zoom_out img").css("background-color","");
		   $("#target, svg, g").css("cursor", "move"); 
	};

	//Global position of the canvas
	var posx = 0;
	var posy = 0;

	/* Translation - bound to drag behavior */
	dragMap = function(d) {
	//No drag while zoom option active
	   if(zoom_in_active == false && zoom_out_active == false){
	      posx += d3.event.dx;
	      posy += d3.event.dy;
	      svg.attr('x', function(d) { return d.x; })
		 .attr('y', function(d) { return d.y; })
		 .attr("transform", "translate(" + posx + "," + posy + ") scale (" + cur_zoom + ")");
	   }
	};

	
	/* Instantiation General parameters*/
	var  padding = 6,
	     color = d3.scale.category10().domain(d3.range(nIslands)),
	     radius = d3.scale.sqrt().range([0, 12]);

	svg = d3.select("#target")
	    .on("click", click)
	    .append("svg")
		.attr("pointer-events", "all")
		.attr("width", width)
		.attr("height", height)
		.datum({x: 0, y: 0})
		.call(d3.behavior.drag().on("drag", dragMap))
	    .append("svg:g").on("zoom", redraw)
		.attr("cursor", "move")       
	
	// DATA VARIABLES
	var nodes = data.nodes;
	// Set color for each node
	nodes.forEach(function(d) {
	    if (d.available != "False") {
		d.color = color(d.group%nIslands);
	    } else {
		d.color = "#CCC";
	    }
	});

	var links = data.links;

	// Modified version (Carolina)
	var force = d3.layout.force()
	    .gravity(1/(2*nIslands))
	    .distance(200/nIslands)
	    .friction(0.6)
	    .size([width, height])
	    .nodes(nodes)
	    .links(links)
	    .start();

       

	var EMPTY_ISLAND = "Island with no resources";

	//XXX:Very ugly, needs improvement
	var islandsLocs = []
	for (i = 0; i< nIslands; i++){
		islandsLocs[i] = EMPTY_ISLAND;
	}

	nodeInitialPos = []
	for (i = 0; i< nodes.length; i++){
		nodeInitialPos[i] = [nodes[i].x, nodes[i].y];
		if (islandsLocs[nodes[i].group] == EMPTY_ISLAND){
			islandsLocs[nodes[i].group] = nodes[i].location;
		}
	}

	var dataislands = []
	for (i = 0; i< nIslands; i++){
		dataislands[i] = {rx: (aw/2 + ah/2)/2, ry: ah/2, cx:(foci[i].x0+foci[i].x1)/2, cy:(foci[i].y0+foci[i].y1)/2, group: i, location: islandsLocs[i]};
	}

	var islands = svg.selectAll(".island")
	    .data(dataislands)
	  .enter().append("g")
		.attr("class", "island")

	var iellipses = islands.append("ellipse")
	    .attr("rx", function(d) { return d.rx; })
	    .attr("ry", function(d) { return d.ry; })
	    .attr("cx",function(d) { return d.cx; })
	    .attr("cy", function(d) { return d.cy; })
	    .style("fill", function(d) { return color(d.group%nIslands); })
	    .style("stroke", function(d) { return color(d.group%nIslands);}) 
	    .style("opacity", 0.3)
	    .style("stroke-opacity", 0.7)

	var ilabels = islands.append("text")
	      .attr("text-anchor", "middle")
	      .attr("y", function(d){ return d.cy + d.ry*0.9})
	      .attr("x", function(d){ return d.cx})
	      .attr("font-color", function(d) { return d3.rgb(color(d.group%nIslands)).darker(5); })
	      .style("opacity",1)
	      .style("cursor", "default")
	      .text(function(d) { return d.location });

	//First ellipse animation on startup
	animate();

	var link = svg.selectAll(".link")
	    .data(links)
	  .enter().append("path")
	    .attr("class", "link").style({'fill': 'black','stroke': "#ccc", 'stroke-width': "4px" });

	link.on("click", function(d) {
			        d3.select(this).style(JSON.parse(getLinkStyle(d, "click")));
			}	
	);

	link.on("mouseover", function(d) {
				//console.log(getLinkStyle(d, "mouseover"));
				d3.select(this).style(JSON.parse(getLinkStyle(d, "mouseover")));
			       // d3.select(this).style({'stroke': "blue", 'stroke-width': "3px" })
			}	
	);

	link.on("mouseout", function(d) {
				//console.log("mouseout");
				d3.select(this).style(JSON.parse(getLinkStyle(d, "mouseout")));
			       // d3.select(this).style({'stroke': "#CCC", 'stroke-width': "2px" })
			}	
	);

	var node = svg.selectAll(".node")
	    .data(nodes)
	  .enter().append("g")
	    .attr("class", "node")
	    .call(force.drag)
	    .call(d3.behavior.drag()
	    .on("dragstart", function(d, i, e) {
		    d.fixed = false;
		    force.stop();
	    })
	    .on("drag", function(d, i) {
		    d.px += d3.event.dx;
		    d.py += d3.event.dy;
		    d.x += d3.event.dx;
		    d.y += d3.event.dy;
	       	    d3.select(this).selectAll("circle").style("stroke", function(d){return getNodeCircleStyle(d, "drag");}) 
		    tick();
	    })
	    .on("dragend", function(d, i) {
		  //  d.fixed = true; // of course set the node to fixed so the force does not include the node in its auto positioning stuff //with the force.stop() it won't autopositioning, allowing to regroup the nodes
		    d3.select(this).selectAll("circle").style("stroke", function(d){return getNodeCircleStyle(d, "dragstop");})
		    tick();
		    force.stop();
	    })
	    );

	
	node.append("circle")
	    .attr("r", function(d) { return d.radius; })
	    .style("stroke", function(d){return getNodeCircleStyle(d, "stroke");})
	    .style("fill", function(d){return getNodeCircleStyle(d, "fill");});

	node.append("image")
	    .attr("xlink:href", function (d) { return d.image; })
	    .attr("x", -8)
	    .attr("y", -8)
	    .attr("width", 16)
	    .attr("height", 16)
	    .attr("opacity", function(d) { return d.available=="False"?0.8:1; })

	node.append("text")
	    .attr("dx", 12)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.name });

	node.on("mouseover", function (d, i){
			//tooltip.show(get_node_info_formated(d));
		        // Ugly hack to decode HTML
			//$('<div/>').html(d.description).text()
			tooltip.show(d.description);
			$("#selected_node_info").html("Selected " + d.type + ": " + d.nodeName + " at " + d.location);
			$("#selected_node_info").css("background-color", d.color );
			$("#selected_node_info").css("text-shadow", "-3px 2px 4px #eee");
			$("#selected_node_info").show();
		}
		)
		.on("mouseout", function() {
				$("#selected_node_info").css("background-color", "#ebf5ff");
				//$("#selected_node_info").hide()
		                tooltip.hide();
		        })
		.on("click", function(d) {
		    /* Only available AMs can be selected */
		    if (d.available != "False") {
			//checkTopologyLoops(d);
			d3.select(this).selectAll("circle").style("stroke", function(d){return getNodeCircleStyle(d, "click");});
		    }
	    	})

	//Number of nodes in each Island
	var qNodes = [];
	for(i=0; i<nIslands; i++){
	   qNodes[i] = getNodesIsland(i);
	} 
	var grav = 0.008 * nx * ny;

	force.on("tick", function(e){
	    var k = grav * e.alpha;
	    var node_groups = {}

	    // Adjust K colliding factor
	    $.each(data.nodes, function(i, n){
		if (node_groups[n.group] == undefined) {
		    node_groups[n.group] = 1;
		} else {
		    node_groups[n.group] += 1;
		}
	    });

	    data.nodes.forEach(function(o, i){
		var fact = 1;
		// Dumb hack: limit expansion through #nodes
		if (node_groups[o.group] >= 10) {
		    fact = Math.floor(node_groups[o.group]/10);
		} else {
		    fact = o.group+1;
		}
		// Carolina: when there are few nodes, avoid them to stay too far away from the center
		// AND when there are so many nodes avoid them to stay too near each others 
		if(qNodes[o.group] < 5){
		    fact = fact * 2;
		} else {
		    fact = fact/2;
		}
		try {
		    o.y += k * fact * qNodes[o.group] * ((dataislands[o.group].cy) - o.y);
		    o.x += k * fact * qNodes[o.group] * ((dataislands[o.group].cx) - o.x);
		} catch (err) {
		}
	    });

	    node.each(collide(.5));
	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";})
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });

	    /*link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	    */
	    link.attr("d", function(d) {
    		var dx = d.target.x - d.source.x,
        	    dy = d.target.y - d.source.y,
		    
        	    //dr = 50/d.linknum;  //linknum is defined above
		    dr = Math.sqrt(dx * dx + dy * dy)/d.linknum;
		   // console.log("printing d:");
		   // console.log(d);
    		//return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + 			d.target.x + "," + d.target.y;
		  return "M" + d.source.x + "," + d.source.y + 
           "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + 
           "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;
  	      });
	});

	function redrawNodes(){
		node.selectAll("circle").style("stroke", function(d){return getNodeCircleStyle(d, "stroke");});
		link.style({'fill': 'black','stroke': "#00BFFF", 'stroke-width': "5px" });//"stroke", function(d) {return getLinkStyle(d, "stroke");});
		//link.style("stroke-width", function(d) {return getLinkStyle(d, "stroke-width");});
	}



	function tick() {
	  
	  /*link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
	  */
	  
	  node.each(collide(.5));
	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	      .attr("cx", d.x)
	      .attr("cy", d.y);

	  link.attr("d", function(d) {
    		var dx = d.target.x - d.source.x,
        	dy = d.target.y - d.source.y,
		dr = Math.sqrt(dx * dx + dy * dy)/d.linknum;
        	//dr = 50/d.linknum;  //linknum is defined above
		//console.log("target:"+d.target.nodeName+" source:" +d.source.nodeName+" link_no:  "+dr);
		//dr = 75;//Math.sqrt(dx * dx + dy * dy);
    		//return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + 			d.target.x + "," + d.target.y;
		return "M" + d.source.x + "," + d.source.y + 
           "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + 
           "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;
  	  });

	  
	};

	

	function animate(){

	iellipses.attr("rx", function(d) { return d.rx; })
	    .style("display","block")
	    .attr("ry", function(d) { return d.ry; })
	    .attr("cx",function(d) { return d.cx; })
	    .attr("cy", function(d) { return d.cy; })
	    .style("fill", function(d) { return color(d.group%nIslands); })
	    .style("stroke", function(d) { return color(d.group%nIslands);}) 
	    .style("opacity", 0.3)
	    .style("stroke-opacity", 0.7)

	ilabels.attr("text-anchor", "middle")
	      .attr("y", function(d){ return d.cy + d.ry*0.9})
	      .attr("x", function(d){ return d.cx})
	      .attr("font-color", function(d) { return d3.rgb(color(d.group%nIslands)).darker(5); })
	      .style("opacity",1)
	      .text(function(d) { return d.location });

	iellipses.transition()
		        .style("stroke-width",3)
		        .style("stroke", function(d) { return d3.rgb(color(d.group%nIslands)).brighter(10);})
		        .duration(1500)
	iellipses.transition()
		   .delay(1500)
		   .style("opacity",0)
		   .duration(3000)
	ilabels.transition()
		   .delay(1500)
		   .style("opacity",0)
		   .duration(3000);
	}

	function regroup(){
		force.resume();
		animate();
	}

	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = d.radius + radius.domain()[1] + padding,
		nx1 = d.x - r,
		nx2 = d.x + r,
		ny1 = d.y - r,
		ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
		var x = d.x - quad.point.x,
		    y = d.y - quad.point.y,
		    l = Math.sqrt(x * x + y * y),
		    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
		if (l < r) {
		  l = (l - r) / l * alpha;
		  d.x -= x *= l;
		  d.y -= y *= l;
		  quad.point.x += x;
		  quad.point.y += y;
		}
	      }
	      return x1 > nx2
		  || x2 < nx1
		  || y1 > ny2
		  || y2 < ny1;
	    });
	  };
	};

	//$("#link_zoom_in").onclick(zoomIn(0.25));

	$("#topo_regroup").unbind('click');
	$("#topo_regroup").click(function(e){
	  e.preventDefault();
	  regroup();
	});

	$("#link_zoom_reset").unbind('click');
	$("#link_zoom_reset").click(function(e){
	  e.preventDefault();
	  zoomReset();
	  redraw();
	});

	$("#link_zoom_in").unbind('click');
	$("#link_zoom_in").click(function(e){
	  e.preventDefault(); 
	  //console.log("zoom current value:"); 
	  //console.log(cur_zoom);
	  $("#target, svg, g").css("cursor", "url('../../static/img/zoomin.png'),auto");
	  zoomIn(0.25);
	  //console.log(zoom_in_active);
	 // redraw();  
	});

	$("#link_zoom_out").unbind('click');
	$("#link_zoom_out").click(function(e){
	  e.preventDefault();
	  $("#target, svg, g").css("cursor", "url('../../static/img/zoomout.png'),auto" );
	  zoomOut(0.25);
	  //redraw();
	});
	  $("#target, svg, g").css("cursor", "crosshair");
        //alert("called");
		//jQuery('#topo_plugin').hide();
	//};	  
	//} //if query_itr
	}, //end of function of on all query done

		//jQuery('#complete-univbris_topology').hide();

    });

    $.plugin('UnivbrisTopo', UnivbrisTopo);

    function addNode(node_dpid,location,node_type){
	var found=false;
	var i=0;
	for(i=0;i<d3_nodes.length;i++){
		//if (i=0){
		//	console.log("adding node");
		//	console.log(d3_nodes[i]);
		//}
		if(d3_nodes[i].nodeName==node_dpid){
			found=true;
			break;
		}
	}

	if(found==false){
		var node={};
		node['nodeValue']=12;
		node['nodeName']=node_dpid;
		node['type']=node_type;
		if (node_type=="compute"){
			node['image']='../../static/img/server-tiny.png';
		}
		else if (node_type=="optical"){
			node['image']='../../static/img/oswitch-tiny.png';

		}else if (node_type=="federation"){
			node['image']='../../static/img/switch-tiny2.png';

		}else{
			node['image']='../../static/img/switch-tiny.png';

		}
		node['color']= "";
		node['group']=0;
		node['location']=location;
		node['description']= "";
		node['fixed']= false;
		node['radius']= 10;
		node['available']= true;
		d3_nodes.push(node);
		return d3_nodes.length-1;
	}
	else{
		return i;
	}
   }; //end of add node function


  function addLink(source,target,src_port,dst_port,value){

	var found=false;
	for(i=0;i<d3_links.length;i++){
		//if(d3_links[i].source==source && d3_links[i].target==target && d3_links[i].src_port==src_port && d3_links[i].dst_port==dst_port && d3_links[i].value==value){
		if((d3_links[i].source==source && d3_links[i].target==target && d3_links[i].src_port==src_port && d3_links[i].dst_port==dst_port) || 
		  (d3_links[i].source==target && d3_links[i].target==source && d3_links[i].src_port==dst_port && d3_links[i].dst_port==src_port)){
			found=true;
			break;
		}
	}

	if (found == false){
		var tmp_link={};
		tmp_link['source']=source;
		tmp_link['target']=target;
                tmp_link['src_port']=src_port;
		tmp_link['dst_port']=dst_port;
	        tmp_link['value']=value;
		tmp_link['linknum']=1;
		d3_links.push(tmp_link);
	}
	   
  };

   function calLinkNum(){
	/* d3_links.sort(function(a,b) {
    		if (a.source > b.source) {return 1;}
   		 	else if (a.source < b.source) {return -1;}
    		else {
        		if (a.target > b.target) {return 1;}
        		if (a.target < b.target) {return -1;}
        		else {return 0;}
    		}
	});*/

         for (var i=0; i<d3_nodes.length; i++){
		for (var i1=0; i1<d3_nodes.length; i1++){
			if(i!=i1){
				var num_link=1;
				for (var i2=0; i2<d3_links.length; i2++){
					if ((d3_links[i2].source ==i  &&
        					d3_links[i2].target ==i1) || (d3_links[i2].source ==i1  &&
        					d3_links[i2].target ==i)){
						d3_links[i2].linknum = num_link;
						num_link++;
					}
				}				
			}
		}	
	 }

	/* for (var i=0; i<d3_links.length; i++) {
    		if (i != 0 &&
        		d3_links[i].source == d3_links[i-1].source &&
        		d3_links[i].target == d3_links[i-1].target) {
            			d3_links[i].linknum = d3_links[i-1].linknum + 1;
        	}
    		else {d3_links[i].linknum = 1;};
  	};*/

   };

  



   function describeNodes(){
	for(i=0;i<d3_nodes.length;i++){
		if(d3_nodes[i].type=="packet" || d3_nodes[i].type=="optical" || d3_nodes[i].type=="federation"){
			d3_nodes[i].description="<strong>Switch Datapath ID&#58; <br> "+d3_nodes[i].nodeName+" </strong><br><strong>Connections&#58;</strong><br>"
			for(i1=0;i1<d3_links.length;i1++){
				if(d3_links[i1].source==i){
					d3_nodes[i].description+="<strong>&#149; Port "+d3_links[i1].src_port+ " </strong>to Switch " + d3_nodes[d3_links[i1].target].nodeName + " at port "+ d3_links[i1].dst_port+"<br>";
				}
			else if(d3_links[i1].target==i){
				d3_nodes[i].description+="<strong>&#149; Port "+ d3_links[i1].dst_port + " </strong>to Switch " + d3_nodes[d3_links[i1].source].nodeName + " at port "+ d3_links[i1].src_port+"<br>";
			}
			}


		}
		else if (d3_nodes[i].type=="compute"){
			d3_nodes[i].description="<strong>Virtualization server name&#58; <br>"+d3_nodes[i].nodeName+"</strong><br><strong>Connections&#58;</strong><br>";
			for(i1=0;i1<d3_links.length;i1++){
				if(d3_links[i1].source==i){
					d3_nodes[i].description+="<strong>&#149; Port "+d3_links[i1].src_port+ " </strong>to Switch " + d3_nodes[d3_links[i1].target].nodeName + " at port "+ d3_links[i1].dst_port+"<br>";
				//console.log(d3_links[i1],d3_nodes[d3_links[i1].target]);
				}
			       if(d3_links[i1].target==i){
				d3_nodes[i].description+="<strong>&#149; Port "+ d3_links[i1].dst_port + " </strong>to Switch " + d3_nodes[d3_links[i1].source].nodeName + " at port "+ d3_links[i1].src_port+"<br>";
				//console.log(d3_links[i1],d3_nodes[d3_links[i1].source]);
			}
			}
		}

		/*try{
	
		
		}
		catch(err){
			console.log(err);
		}*/
		
		//if(d3_nodes[i].nodeName==node_dpid){
		//	found=true;
		//	break;
		//}
	}


   };

	

})(jQuery);
